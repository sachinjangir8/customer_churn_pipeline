# Customer Churn Prediction - Complete ML Project

## 📦 Project Overview

This is a **production-ready, industry-standard machine learning project** for predicting customer churn with:
- ✅ Complete ML pipeline with XGBoost
- ✅ Modern React frontend with beautiful UI
- ✅ RESTful Flask API backend
- ✅ Docker containerization
- ✅ Vercel & Heroku deployment configurations
- ✅ Comprehensive documentation
- ✅ Industry best practices

## 📁 Project Structure

```
customer-churn-prediction/
├── 📊 notebooks/               # Jupyter notebooks for EDA and training
│   ├── 01_EDA_and_Feature_Engineering.ipynb
│   └── 02_Model_Training_and_Evaluation.ipynb
│
├── 🔧 backend/                 # Flask API server
│   ├── app.py                  # Main application with all endpoints
│   ├── train_model.py          # Automated model training script
│   ├── test_api.py            # API testing suite
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile             # Docker configuration
│   ├── Procfile              # Heroku deployment
│   └── models/               # Trained model artifacts (after training)
│
├── 💻 frontend/               # React application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── PredictionForm.js      # Input form
│   │   │   ├── ResultsDisplay.js      # Prediction results
│   │   │   ├── ModelInfo.js          # Model metrics
│   │   │   └── BatchPrediction.js    # Batch processing
│   │   ├── services/
│   │   │   └── api.js        # API client
│   │   ├── App.js            # Main component
│   │   └── App.css           # Modern styling
│   ├── public/
│   ├── package.json          # Node dependencies
│   ├── Dockerfile           # Docker configuration
│   └── vercel.json         # Vercel deployment
│
├── 📊 data/                  # Dataset
│   └── telco_churn.csv      # Original dataset
│
├── 🐳 docker-compose.yml    # Full stack deployment
├── 📖 README.md            # Comprehensive documentation
├── 🚀 QUICKSTART.md        # Quick setup guide
├── 🔧 SETUP.md            # Detailed setup instructions
├── 📄 LICENSE             # MIT License
└── .gitignore            # Git ignore rules
```

## 🎯 Features

### Machine Learning Pipeline
- **Data Preprocessing**: Label encoding, standard scaling, SMOTE
- **Feature Engineering**: 7+ engineered features
- **Model Selection**: Compared 10+ algorithms
- **Hyperparameter Tuning**: GridSearchCV with 5-fold CV
- **Model Evaluation**: ROC-AUC, Precision, Recall, F1-Score
- **Best Model**: XGBoost with ~88% ROC-AUC

### Backend API (Flask)
- `/api/health` - Health check
- `/api/model/info` - Model metrics and information
- `/api/features` - Required feature list
- `/api/predict` - Single prediction
- `/api/predict/batch` - Batch predictions
- `/api/recommendations` - Personalized retention strategies

### Frontend (React)
- **Single Prediction**: Interactive form with validation
- **Batch Prediction**: CSV/JSON file upload
- **Model Info**: Real-time metrics display
- **Beautiful UI**: Modern glassmorphism design
- **Responsive**: Works on all devices
- **Charts**: Interactive visualizations with Chart.js

## 📊 Model Performance

| Metric | Score |
|--------|-------|
| Accuracy | ~85% |
| Precision | ~82% |
| Recall | ~78% |
| F1-Score | ~80% |
| ROC-AUC | ~88% |

## 🚀 Quick Start

### Option 1: Local Development
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python train_model.py  # Train the model (10-30 mins)
python app.py          # Start server

# Frontend (new terminal)
cd frontend
npm install
npm start
```

### Option 2: Docker
```bash
docker-compose up --build
```

### Option 3: Cloud Deployment
```bash
# Frontend (Vercel)
cd frontend
vercel --prod

# Backend (Heroku)
cd backend
heroku create
git push heroku main
```

## 🔑 Key Components

### 1. Data Science (notebooks/)
- **EDA Notebook**: Comprehensive exploratory analysis
  - Data quality assessment
  - Target variable analysis
  - Feature correlations
  - Categorical analysis with visualizations
  
- **Training Notebook**: Model development
  - Preprocessing pipeline
  - Multiple model comparison
  - Hyperparameter tuning
  - Performance evaluation
  - Feature importance analysis

### 2. Backend API (backend/)
- **Flask Application**: Production-ready REST API
  - CORS enabled for frontend integration
  - Comprehensive error handling
  - Input validation
  - Logging configured
  
- **Training Script**: Automated model training
  - Data loading and preprocessing
  - Feature engineering
  - Model training with GridSearchCV
  - Artifact saving (model, scaler, encoders)
  
- **Testing Suite**: Complete API tests
  - Health check
  - Model info retrieval
  - Single predictions
  - Batch predictions
  - Recommendations

### 3. Frontend Application (frontend/)
- **Modern UI Components**:
  - PredictionForm: Smart input form
  - ResultsDisplay: Charts and visualizations
  - ModelInfo: Metrics dashboard
  - BatchPrediction: File upload and processing
  
- **API Integration**: Axios-based service layer
- **Responsive Design**: Works on all screen sizes
- **Beautiful Styling**: Glassmorphism with gradients

## 🛠️ Technology Stack

### Backend
- **Flask 3.0** - Web framework
- **XGBoost 2.0** - ML model
- **Scikit-learn** - ML utilities
- **Pandas & NumPy** - Data processing
- **Imbalanced-learn** - SMOTE
- **Gunicorn** - Production server

### Frontend
- **React 18.2** - UI framework
- **Chart.js** - Visualizations
- **React Icons** - Icons
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Vercel** - Frontend hosting
- **Heroku** - Backend hosting
- **GitHub Actions** - CI/CD (can be added)

## 📈 Model Details

### Algorithms Compared
1. Logistic Regression
2. Decision Tree
3. Random Forest
4. Gradient Boosting
5. **XGBoost** ⭐ (Selected)
6. LightGBM
7. CatBoost
8. Extra Trees
9. AdaBoost
10. Naive Bayes

### Feature Engineering
- Tenure grouping (0-1 year, 1-2 years, etc.)
- Average monthly charges calculation
- Charge increase indicator
- Total services count
- Has add-on services flag
- Has streaming services flag
- Senior with partner interaction

### Hyperparameters (XGBoost)
- n_estimators: [100, 200, 300]
- max_depth: [3, 5, 7]
- learning_rate: [0.01, 0.1, 0.3]
- subsample: [0.8, 0.9, 1.0]
- colsample_bytree: [0.8, 0.9, 1.0]

## 🎨 UI Features

### Design Elements
- **Glassmorphism**: Frosted glass effect with blur
- **Gradient Backgrounds**: Purple-pink gradients
- **Smooth Animations**: Fade-in, slide-in effects
- **Interactive Cards**: Hover effects and shadows
- **Responsive Grid**: Auto-adjusting layouts
- **Progress Bars**: Animated probability display
- **Charts**: Doughnut charts for visual appeal

### User Experience
- **Form Validation**: Real-time input checking
- **Loading States**: Spinners and progress indicators
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Clear confirmation messages
- **Intuitive Navigation**: Tab-based interface
- **Batch Processing**: CSV/JSON upload support

## 📝 API Documentation

### Request Example
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "gender": "Male",
    "SeniorCitizen": 0,
    "Partner": "Yes",
    "tenure": 12,
    "Contract": "One year",
    "MonthlyCharges": 55.0,
    "TotalCharges": 660.0,
    ...
  }'
```

### Response Example
```json
{
  "churn": false,
  "churn_probability": 0.23,
  "confidence": 0.77,
  "risk_level": "Low",
  "timestamp": "2025-02-17T10:30:00"
}
```

## 🔒 Security & Best Practices

- ✅ Input validation on all endpoints
- ✅ CORS configuration for production
- ✅ Environment variables for sensitive data
- ✅ Error handling and logging
- ✅ Rate limiting ready (can be added)
- ✅ API authentication ready (can be added)
- ✅ Docker security best practices
- ✅ Production-ready configurations

## 📚 Documentation

- **README.md** - Full project documentation
- **QUICKSTART.md** - 5-minute setup guide
- **SETUP.md** - Detailed setup instructions
- **Inline Comments** - Code documentation
- **Jupyter Notebooks** - Analysis documentation

## 🚀 Deployment Options

### 1. Vercel (Frontend)
- Automatic builds from GitHub
- Global CDN
- HTTPS included
- Environment variables support

### 2. Heroku (Backend)
- Easy deployment
- Free tier available
- Automatic scaling
- Add-ons ecosystem

### 3. Docker
- Full stack deployment
- Consistent environments
- Easy scaling
- Production-ready

### 4. AWS/GCP/Azure
- Enterprise-grade hosting
- Managed services
- Auto-scaling
- High availability

## 🔄 Future Enhancements

- [ ] Real-time model retraining
- [ ] A/B testing framework
- [ ] Advanced customer segmentation
- [ ] LSTM/Transformer models
- [ ] SHAP explanations
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Automated reporting

## 📊 Business Value

### Use Cases
1. **Customer Retention**: Identify at-risk customers
2. **Targeted Marketing**: Personalized campaigns
3. **Resource Optimization**: Focus retention efforts
4. **Revenue Protection**: Prevent revenue loss
5. **Customer Insights**: Understand churn drivers

### ROI Benefits
- Reduce churn rate by 10-30%
- Increase customer lifetime value
- Optimize marketing spend
- Improve customer satisfaction
- Data-driven decision making

## 🤝 Contributing

Contributions welcome! See README.md for guidelines.

## 📄 License

MIT License - See LICENSE file

## 👨‍💻 Author

This is a portfolio-ready, production-grade ML project demonstrating:
- End-to-end ML pipeline development
- Full-stack application development
- Modern UI/UX design
- DevOps and deployment skills
- Industry best practices

Perfect for:
- GitHub portfolio
- Job applications
- Capstone projects
- Production deployment
- Learning and education

## 🎓 Learning Resources

This project demonstrates:
- Machine Learning: Classification, preprocessing, tuning
- Backend Development: Flask, REST APIs, Python
- Frontend Development: React, modern UI/UX
- Data Science: EDA, feature engineering, evaluation
- DevOps: Docker, CI/CD, cloud deployment
- Software Engineering: Clean code, documentation, testing

## ⭐ Star this project if you find it helpful!

Happy coding! 🚀
