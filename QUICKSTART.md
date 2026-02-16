# Quick Start Guide

Get the Customer Churn Prediction system running in 5 minutes!

## 🚀 Option 1: Quick Local Setup (Recommended for Development)

### Step 1: Clone and Navigate
```bash
git clone https://github.com/yourusername/customer-churn-prediction.git
cd customer-churn-prediction
```

### Step 2: Backend Setup (3 minutes)
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Train the model (this takes 10-30 minutes)
# Skip this step if models are already included
python train_model.py

# Start the server
python app.py
```

Backend is now running at `http://localhost:5000` ✅

### Step 3: Frontend Setup (2 minutes)
Open a **new terminal**:
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

Frontend will automatically open at `http://localhost:3000` ✅

## 🐳 Option 2: Docker (Recommended for Deployment)

### Prerequisites
- Docker and Docker Compose installed

### One Command Deployment
```bash
docker-compose up --build
```

That's it! Access the application at `http://localhost` ✅

## ☁️ Option 3: Deploy to Cloud

### Frontend (Vercel)
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Backend (Heroku)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

Update frontend environment variable with your Heroku URL!

## ✅ Verify Installation

1. Open `http://localhost:3000`
2. Click on "Model Info" tab
3. You should see model metrics
4. Go to "Single Prediction" tab
5. Fill the form and click "Predict Churn"

If you see predictions, you're all set! 🎉

## 🐛 Common Issues

### Issue: "Module not found"
**Solution:** Make sure virtual environment is activated
```bash
# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### Issue: "Port already in use"
**Solution:** Change port or kill existing process
```bash
# Backend - edit app.py, change port number
# Frontend - set PORT=3001 in .env

# Or kill process
# Windows: taskkill /PID <PID> /F
# Mac/Linux: kill -9 <PID>
```

### Issue: "Model not found"
**Solution:** Train the model first
```bash
cd backend
python train_model.py
```

### Issue: Frontend can't connect to backend
**Solution:** Update API URL in frontend/.env
```
REACT_APP_API_URL=http://localhost:5000
```

## 📚 Next Steps

1. Read the full [README.md](README.md) for detailed documentation
2. Check [SETUP.md](SETUP.md) for comprehensive setup instructions
3. Explore the Jupyter notebooks in `notebooks/` directory
4. Customize the UI in `frontend/src/App.css`
5. Extend the API in `backend/app.py`

## 🆘 Need Help?

- 📖 Check the [SETUP.md](SETUP.md) for troubleshooting
- 🐛 Open an issue on GitHub
- 📧 Contact: your.email@example.com

## 🎯 Quick Test

### Test the API
```bash
cd backend
python test_api.py
```

### Make a Prediction via cURL
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
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
  }'
```

Happy predicting! 🚀
