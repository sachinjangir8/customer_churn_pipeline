from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load models and artifacts
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'models')

try:
    model = joblib.load(os.path.join(MODEL_DIR, 'churn_model.pkl'))
    scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
    label_encoders = joblib.load(os.path.join(MODEL_DIR, 'label_encoders.pkl'))
    feature_names = joblib.load(os.path.join(MODEL_DIR, 'feature_names.pkl'))
    metadata = joblib.load(os.path.join(MODEL_DIR, 'model_metadata.pkl'))
    logger.info("All models and artifacts loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {str(e)}")
    model = scaler = label_encoders = feature_names = metadata = None


def preprocess_input(data):
    """
    Preprocess input data for prediction
    """
    try:
        # Create DataFrame
        df = pd.DataFrame([data])
        
        # Feature engineering - same as training
        df['AvgMonthlyCharges'] = df['TotalCharges'] / (df['tenure'] + 1)
        df['ChargeIncrease'] = (df['MonthlyCharges'] > df['AvgMonthlyCharges']).astype(int)
        
        # Service count
        service_cols = ['PhoneService', 'MultipleLines', 'InternetService', 
                       'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 
                       'TechSupport', 'StreamingTV', 'StreamingMovies']
        df['TotalServices'] = (df[service_cols] == 'Yes').sum(axis=1)
        
        # Add-on services
        addon_services = ['OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport']
        df['HasAddonService'] = (df[addon_services] == 'Yes').any(axis=1).astype(int)
        
        # Streaming services
        df['HasStreamingService'] = ((df['StreamingTV'] == 'Yes') | 
                                      (df['StreamingMovies'] == 'Yes')).astype(int)
        
        # Senior with partner
        df['SeniorWithPartner'] = ((df['SeniorCitizen'] == 1) & 
                                    (df['Partner'] == 'Yes')).astype(int)
        
        # Encode categorical variables
        categorical_columns = metadata['categorical_columns']
        for col in categorical_columns:
            if col in df.columns and col in label_encoders:
                df[col] = label_encoders[col].transform(df[col].astype(str))
        
        # Scale numerical features
        numerical_columns = metadata['numerical_columns']
        df[numerical_columns] = scaler.transform(df[numerical_columns])
        
        # Ensure all features are present in correct order
        df = df[feature_names]
        
        return df
    
    except Exception as e:
        logger.error(f"Error in preprocessing: {str(e)}")
        raise


@app.route('/')
def home():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'message': 'Customer Churn Prediction API',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/health', methods=['GET'])
def health_check():
    """
    Detailed health check
    """
    model_status = model is not None
    return jsonify({
        'status': 'healthy' if model_status else 'unhealthy',
        'model_loaded': model_status,
        'scaler_loaded': scaler is not None,
        'encoders_loaded': label_encoders is not None,
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Single prediction endpoint
    """
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get input data
        data = request.json
        
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        
        # Preprocess
        processed_data = preprocess_input(data)
        
        # Predict
        prediction = model.predict(processed_data)[0]
        probability = model.predict_proba(processed_data)[0]
        
        # Prepare response
        result = {
            'churn': bool(prediction),
            'churn_probability': float(probability[1]),
            'confidence': float(max(probability)),
            'risk_level': get_risk_level(probability[1]),
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/predict/batch', methods=['POST'])
def batch_predict():
    """
    Batch prediction endpoint
    """
    try:
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get input data
        data_list = request.json
        
        if not isinstance(data_list, list):
            return jsonify({'error': 'Input must be a list of records'}), 400
        
        results = []
        
        for idx, data in enumerate(data_list):
            try:
                # Preprocess
                processed_data = preprocess_input(data)
                
                # Predict
                prediction = model.predict(processed_data)[0]
                probability = model.predict_proba(processed_data)[0]
                
                result = {
                    'index': idx,
                    'churn': bool(prediction),
                    'churn_probability': float(probability[1]),
                    'confidence': float(max(probability)),
                    'risk_level': get_risk_level(probability[1])
                }
                
                results.append(result)
            
            except Exception as e:
                results.append({
                    'index': idx,
                    'error': str(e)
                })
        
        return jsonify({
            'results': results,
            'total': len(results),
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/model/info', methods=['GET'])
def model_info():
    """
    Get model information and metrics
    """
    try:
        if metadata is None:
            return jsonify({'error': 'Model metadata not loaded'}), 500
        
        info = {
            'model_name': metadata.get('model_name', 'Unknown'),
            'metrics': {
                'accuracy': float(metadata.get('accuracy', 0)),
                'precision': float(metadata.get('precision', 0)),
                'recall': float(metadata.get('recall', 0)),
                'f1_score': float(metadata.get('f1_score', 0)),
                'roc_auc': float(metadata.get('roc_auc', 0))
            },
            'features': {
                'total': len(feature_names) if feature_names else 0,
                'categorical': len(metadata.get('categorical_columns', [])),
                'numerical': len(metadata.get('numerical_columns', []))
            },
            'hyperparameters': metadata.get('best_params', {}),
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(info)
    
    except Exception as e:
        logger.error(f"Model info error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/features', methods=['GET'])
def get_features():
    """
    Get list of required features for prediction
    """
    try:
        required_features = {
            'categorical': [
                'gender', 'Partner', 'Dependents', 'PhoneService', 'MultipleLines',
                'InternetService', 'OnlineSecurity', 'OnlineBackup', 'DeviceProtection',
                'TechSupport', 'StreamingTV', 'StreamingMovies', 'Contract',
                'PaperlessBilling', 'PaymentMethod'
            ],
            'numerical': [
                'SeniorCitizen', 'tenure', 'MonthlyCharges', 'TotalCharges'
            ]
        }
        
        feature_options = {
            'gender': ['Male', 'Female'],
            'Partner': ['Yes', 'No'],
            'Dependents': ['Yes', 'No'],
            'PhoneService': ['Yes', 'No'],
            'MultipleLines': ['Yes', 'No', 'No phone service'],
            'InternetService': ['DSL', 'Fiber optic', 'No'],
            'OnlineSecurity': ['Yes', 'No', 'No internet service'],
            'OnlineBackup': ['Yes', 'No', 'No internet service'],
            'DeviceProtection': ['Yes', 'No', 'No internet service'],
            'TechSupport': ['Yes', 'No', 'No internet service'],
            'StreamingTV': ['Yes', 'No', 'No internet service'],
            'StreamingMovies': ['Yes', 'No', 'No internet service'],
            'Contract': ['Month-to-month', 'One year', 'Two year'],
            'PaperlessBilling': ['Yes', 'No'],
            'PaymentMethod': ['Electronic check', 'Mailed check', 
                            'Bank transfer (automatic)', 'Credit card (automatic)'],
            'SeniorCitizen': [0, 1]
        }
        
        return jsonify({
            'required_features': required_features,
            'feature_options': feature_options,
            'total_features': len(required_features['categorical']) + len(required_features['numerical'])
        })
    
    except Exception as e:
        logger.error(f"Features error: {str(e)}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get personalized recommendations to reduce churn risk
    """
    try:
        data = request.json
        
        if not data:
            return jsonify({'error': 'No input data provided'}), 400
        
        # Preprocess and predict
        processed_data = preprocess_input(data)
        probability = model.predict_proba(processed_data)[0][1]
        
        recommendations = generate_recommendations(data, probability)
        
        return jsonify({
            'churn_probability': float(probability),
            'risk_level': get_risk_level(probability),
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        logger.error(f"Recommendations error: {str(e)}")
        return jsonify({'error': str(e)}), 500


def get_risk_level(probability):
    """
    Determine risk level based on churn probability
    """
    if probability < 0.3:
        return 'Low'
    elif probability < 0.6:
        return 'Medium'
    elif probability < 0.8:
        return 'High'
    else:
        return 'Critical'


def generate_recommendations(data, probability):
    """
    Generate personalized recommendations based on customer data
    """
    recommendations = []
    
    # Contract recommendations
    if data.get('Contract') == 'Month-to-month':
        recommendations.append({
            'category': 'Contract',
            'priority': 'High',
            'message': 'Upgrade to a long-term contract (1 or 2 years) with a discount to improve retention',
            'impact': 'High'
        })
    
    # Tenure recommendations
    if data.get('tenure', 0) < 12:
        recommendations.append({
            'category': 'Engagement',
            'priority': 'High',
            'message': 'Customer is in the critical first year. Implement welcome program and regular check-ins',
            'impact': 'High'
        })
    
    # Service recommendations
    if data.get('OnlineSecurity') != 'Yes' and data.get('InternetService') != 'No':
        recommendations.append({
            'category': 'Services',
            'priority': 'Medium',
            'message': 'Offer online security service with promotional pricing',
            'impact': 'Medium'
        })
    
    if data.get('TechSupport') != 'Yes' and data.get('InternetService') != 'No':
        recommendations.append({
            'category': 'Services',
            'priority': 'Medium',
            'message': 'Provide tech support service to enhance customer satisfaction',
            'impact': 'Medium'
        })
    
    # Payment method
    if data.get('PaymentMethod') == 'Electronic check':
        recommendations.append({
            'category': 'Payment',
            'priority': 'Medium',
            'message': 'Encourage automatic payment methods with incentives to reduce friction',
            'impact': 'Medium'
        })
    
    # Paperless billing
    if data.get('PaperlessBilling') == 'No':
        recommendations.append({
            'category': 'Engagement',
            'priority': 'Low',
            'message': 'Promote paperless billing with incentives for environmental and convenience benefits',
            'impact': 'Low'
        })
    
    # High charges
    avg_charge = data.get('TotalCharges', 0) / (data.get('tenure', 1) + 1)
    if avg_charge > 70:
        recommendations.append({
            'category': 'Pricing',
            'priority': 'High',
            'message': 'Customer has high charges. Consider loyalty discount or bundled service offers',
            'impact': 'High'
        })
    
    # Fiber optic with high churn correlation
    if data.get('InternetService') == 'Fiber optic' and probability > 0.5:
        recommendations.append({
            'category': 'Service Quality',
            'priority': 'High',
            'message': 'Fiber optic customers show higher churn. Check service quality and consider retention offers',
            'impact': 'High'
        })
    
    return sorted(recommendations, key=lambda x: {'High': 0, 'Medium': 1, 'Low': 2}[x['priority']])


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
