# Customer Churn Prediction System

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.2-61dafb)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000)](https://flask.palletsprojects.com/)
[![XGBoost](https://img.shields.io/badge/XGBoost-2.0-red)](https://xgboost.readthedocs.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

An end-to-end, industry-standard machine learning system for predicting customer churn with a modern web interface. Built with best practices for production deployment.

## 🌟 Features

- **Advanced ML Pipeline**: XGBoost model with hyperparameter tuning and SMOTE for handling class imbalance
- **Comprehensive EDA**: Detailed exploratory data analysis with visualizations
- **Feature Engineering**: 7+ engineered features for improved prediction accuracy
- **REST API**: Production-ready Flask backend with comprehensive endpoints
- **Modern UI**: Beautiful React frontend with glassmorphism design
- **Batch Predictions**: Support for CSV/JSON file uploads
- **Personalized Recommendations**: AI-driven retention strategies
- **Model Monitoring**: Real-time metrics and model information
- **Deployment Ready**: Docker support and Vercel/Heroku configuration

## 📊 Model Performance

| Metric | Score |
|--------|-------|
| Accuracy | ~85% |
| Precision | ~82% |
| Recall | ~78% |
| F1-Score | ~80% |
| ROC-AUC | ~88% |

## 🏗️ Architecture

```
customer-churn-prediction/
├── backend/                 # Flask API
│   ├── app.py              # Main application
│   ├── requirements.txt    # Python dependencies
│   └── models/             # Saved ML models
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── App.js         # Main app component
│   │   └── App.css        # Styling
│   ├── public/            # Static files
│   └── package.json       # Node dependencies
├── notebooks/             # Jupyter notebooks
│   ├── 01_EDA_and_Feature_Engineering.ipynb
│   └── 02_Model_Training_and_Evaluation.ipynb
├── data/                  # Dataset directory
└── models/               # Trained model artifacts
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- pip and npm

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/customer-churn-prediction.git
   cd customer-churn-prediction
   ```

2. **Set up Python virtual environment**
   ```bash
   cd backend
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Train the model** (or use pre-trained models)
   ```bash
   cd ../notebooks
   jupyter notebook
   # Run both notebooks in order
   ```

5. **Start the backend server**
   ```bash
   cd ../backend
   python app.py
   ```
   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

2. **Configure API URL** (if needed)
   Create a `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

3. **Start the development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

## 📝 API Documentation

### Endpoints

#### Health Check
```http
GET /api/health
```

#### Get Model Information
```http
GET /api/model/info
```
Returns model metrics, feature count, and hyperparameters.

#### Single Prediction
```http
POST /api/predict
Content-Type: application/json

{
  "gender": "Male",
  "SeniorCitizen": 0,
  "Partner": "Yes",
  "Dependents": "No",
  "tenure": 12,
  "PhoneService": "Yes",
  "MultipleLines": "No",
  "InternetService": "DSL",
  "OnlineSecurity": "Yes",
  "OnlineBackup": "No",
  "DeviceProtection": "No",
  "TechSupport": "Yes",
  "StreamingTV": "No",
  "StreamingMovies": "No",
  "Contract": "One year",
  "PaperlessBilling": "No",
  "PaymentMethod": "Bank transfer (automatic)",
  "MonthlyCharges": 55.0,
  "TotalCharges": 660.0
}
```

**Response:**
```json
{
  "churn": false,
  "churn_probability": 0.23,
  "confidence": 0.77,
  "risk_level": "Low",
  "timestamp": "2025-02-17T10:30:00"
}
```

#### Batch Prediction
```http
POST /api/predict/batch
Content-Type: application/json

[
  { /* customer 1 data */ },
  { /* customer 2 data */ }
]
```

#### Get Recommendations
```http
POST /api/recommendations
Content-Type: application/json

{ /* customer data */ }
```

**Response:**
```json
{
  "churn_probability": 0.75,
  "risk_level": "High",
  "recommendations": [
    {
      "category": "Contract",
      "priority": "High",
      "message": "Upgrade to a long-term contract...",
      "impact": "High"
    }
  ]
}
```

## 🐳 Docker Deployment

### Build and Run

```bash
# Build backend
docker build -t churn-backend ./backend

# Build frontend
docker build -t churn-frontend ./frontend

# Run with docker-compose
docker-compose up -d
```

### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5000
```

## ☁️ Vercel Deployment

### Frontend Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Configure Environment Variables**
   - Go to Vercel Dashboard
   - Add `REACT_APP_API_URL` with your backend URL

### Backend Deployment (Heroku/Railway)

1. **Create `Procfile`**
   ```
   web: gunicorn app:app
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

3. **Or deploy to Railway**
   - Connect your GitHub repository
   - Railway will auto-detect Flask app
   - Add environment variables if needed

## 📊 Data Science Pipeline

### 1. Exploratory Data Analysis
- Data quality assessment
- Missing value analysis
- Target variable distribution
- Feature correlation analysis
- Categorical feature analysis

### 2. Feature Engineering
- Tenure grouping
- Average monthly charges calculation
- Charge increase indicator
- Service count aggregation
- Add-on and streaming service flags

### 3. Model Training
- Data preprocessing with Label Encoding
- Feature scaling with StandardScaler
- SMOTE for class imbalance
- Multiple model comparison:
  - Logistic Regression
  - Decision Tree
  - Random Forest
  - Gradient Boosting
  - XGBoost ⭐ (Selected)
  - LightGBM
  - CatBoost
  - Extra Trees
  - AdaBoost
  - Naive Bayes

### 4. Hyperparameter Tuning
- GridSearchCV with 5-fold cross-validation
- ROC-AUC optimization
- Best parameters selection

### 5. Model Evaluation
- Confusion matrix
- ROC curve
- Precision-Recall curve
- Feature importance analysis

## 🛠️ Technology Stack

### Backend
- **Flask** - Web framework
- **XGBoost** - Machine learning model
- **Scikit-learn** - ML utilities
- **Pandas** - Data manipulation
- **NumPy** - Numerical computing
- **Imbalanced-learn** - SMOTE implementation

### Frontend
- **React** - UI framework
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Icons** - Icon library

### DevOps
- **Docker** - Containerization
- **Vercel** - Frontend hosting
- **Heroku/Railway** - Backend hosting

## 🔒 Security Considerations

- Input validation on all API endpoints
- CORS configuration for production
- Environment variable management
- Rate limiting (recommended for production)
- API authentication (can be added)

## 📈 Future Enhancements

- [ ] Real-time model retraining pipeline
- [ ] A/B testing framework
- [ ] Advanced customer segmentation
- [ ] Deep learning models (LSTM, Transformers)
- [ ] Feature importance explanation (SHAP values)
- [ ] Multi-language support
- [ ] Mobile application
- [ ] Automated reporting system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Your Name
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Dataset: Telco Customer Churn from [Kaggle](https://www.kaggle.com/)
- Inspired by industry best practices in ML deployment
- Thanks to the open-source community

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

⭐ If you find this project helpful, please give it a star!
