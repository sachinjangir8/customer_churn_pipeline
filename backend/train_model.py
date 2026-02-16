"""
Automated Model Training Script
Trains the churn prediction model and saves all artifacts
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, 
    f1_score, roc_auc_score, classification_report
)
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE
import warnings
warnings.filterwarnings('ignore')

# Paths
DATA_PATH = '../data/telco_churn.csv'
MODEL_DIR = './models'

# Create models directory if it doesn't exist
os.makedirs(MODEL_DIR, exist_ok=True)

print("="*80)
print("Customer Churn Prediction - Model Training Pipeline")
print("="*80)

# Load data
print("\n1. Loading data...")
df = pd.read_csv(DATA_PATH)
print(f"   Dataset shape: {df.shape}")

# Data preprocessing
print("\n2. Data preprocessing...")

# Convert TotalCharges to numeric
df['TotalCharges'] = pd.to_numeric(df['TotalCharges'], errors='coerce')
df['TotalCharges'].fillna(df['MonthlyCharges'], inplace=True)

# Feature engineering
print("   Creating engineered features...")
df['AvgMonthlyCharges'] = df['TotalCharges'] / (df['tenure'] + 1)
df['ChargeIncrease'] = (df['MonthlyCharges'] > df['AvgMonthlyCharges']).astype(int)

service_cols = ['PhoneService', 'MultipleLines', 'InternetService', 
                'OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 
                'TechSupport', 'StreamingTV', 'StreamingMovies']
df['TotalServices'] = (df[service_cols] == 'Yes').sum(axis=1)

addon_services = ['OnlineSecurity', 'OnlineBackup', 'DeviceProtection', 'TechSupport']
df['HasAddonService'] = (df[addon_services] == 'Yes').any(axis=1).astype(int)

df['HasStreamingService'] = ((df['StreamingTV'] == 'Yes') | 
                              (df['StreamingMovies'] == 'Yes')).astype(int)

df['SeniorWithPartner'] = ((df['SeniorCitizen'] == 1) & 
                            (df['Partner'] == 'Yes')).astype(int)

# Drop unnecessary columns
df_model = df.drop(['customerID'], axis=1)

# Separate features and target
X = df_model.drop('Churn', axis=1)
y = df_model['Churn'].map({'Yes': 1, 'No': 0})

print(f"   Features: {X.shape[1]}")
print(f"   Samples: {X.shape[0]}")

# Encode categorical variables
print("\n3. Encoding categorical variables...")
categorical_columns = X.select_dtypes(include=['object']).columns.tolist()
numerical_columns = X.select_dtypes(include=['int64', 'float64']).columns.tolist()

label_encoders = {}
X_encoded = X.copy()

for col in categorical_columns:
    le = LabelEncoder()
    X_encoded[col] = le.fit_transform(X[col].astype(str))
    label_encoders[col] = le

print(f"   Encoded {len(categorical_columns)} categorical columns")

# Train-test split
print("\n4. Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(
    X_encoded, y, test_size=0.2, random_state=42, stratify=y
)
print(f"   Train: {X_train.shape[0]}, Test: {X_test.shape[0]}")

# Feature scaling
print("\n5. Scaling features...")
scaler = StandardScaler()
X_train_scaled = X_train.copy()
X_test_scaled = X_test.copy()

X_train_scaled[numerical_columns] = scaler.fit_transform(X_train[numerical_columns])
X_test_scaled[numerical_columns] = scaler.transform(X_test[numerical_columns])

# Handle class imbalance with SMOTE
print("\n6. Applying SMOTE for class balance...")
smote = SMOTE(random_state=42, k_neighbors=5)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)
print(f"   Balanced training set: {X_train_balanced.shape[0]}")

# Model training with hyperparameter tuning
print("\n7. Training XGBoost model with hyperparameter tuning...")
print("   This may take several minutes...")

xgb_params = {
    'n_estimators': [100, 200, 300],
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.1, 0.3],
    'subsample': [0.8, 0.9, 1.0],
    'colsample_bytree': [0.8, 0.9, 1.0]
}

xgb_grid = GridSearchCV(
    XGBClassifier(random_state=42, eval_metric='logloss'),
    xgb_params,
    cv=5,
    scoring='roc_auc',
    n_jobs=-1,
    verbose=1
)

xgb_grid.fit(X_train_balanced, y_train_balanced)

print(f"\n   Best parameters: {xgb_grid.best_params_}")
print(f"   Best CV score: {xgb_grid.best_score_:.4f}")

# Get best model
best_model = xgb_grid.best_estimator_

# Evaluate on test set
print("\n8. Evaluating model on test set...")
y_pred = best_model.predict(X_test_scaled)
y_pred_proba = best_model.predict_proba(X_test_scaled)[:, 1]

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_pred_proba)

print(f"\n   Accuracy:  {accuracy:.4f}")
print(f"   Precision: {precision:.4f}")
print(f"   Recall:    {recall:.4f}")
print(f"   F1-Score:  {f1:.4f}")
print(f"   ROC-AUC:   {roc_auc:.4f}")

print("\n   Classification Report:")
print(classification_report(y_test, y_pred, target_names=['No Churn', 'Churn']))

# Save all artifacts
print("\n9. Saving model and artifacts...")

# Save model
joblib.dump(best_model, os.path.join(MODEL_DIR, 'churn_model.pkl'))
print("   ✓ Model saved")

# Save scaler
joblib.dump(scaler, os.path.join(MODEL_DIR, 'scaler.pkl'))
print("   ✓ Scaler saved")

# Save label encoders
joblib.dump(label_encoders, os.path.join(MODEL_DIR, 'label_encoders.pkl'))
print("   ✓ Label encoders saved")

# Save feature names
feature_names = X_train_balanced.columns.tolist()
joblib.dump(feature_names, os.path.join(MODEL_DIR, 'feature_names.pkl'))
print("   ✓ Feature names saved")

# Save metadata
metadata = {
    'model_name': 'XGBoost (Tuned)',
    'accuracy': float(accuracy),
    'precision': float(precision),
    'recall': float(recall),
    'f1_score': float(f1),
    'roc_auc': float(roc_auc),
    'categorical_columns': categorical_columns,
    'numerical_columns': numerical_columns,
    'best_params': xgb_grid.best_params_
}

joblib.dump(metadata, os.path.join(MODEL_DIR, 'model_metadata.pkl'))
print("   ✓ Model metadata saved")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': feature_names,
    'importance': best_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\n10. Top 10 Most Important Features:")
print(feature_importance.head(10).to_string(index=False))

print("\n" + "="*80)
print("Model training completed successfully!")
print("="*80)
print(f"\nAll artifacts saved to: {MODEL_DIR}/")
print("\nNext steps:")
print("1. Start the backend: cd backend && python app.py")
print("2. Start the frontend: cd frontend && npm start")
print("3. Access the application at http://localhost:3000")
