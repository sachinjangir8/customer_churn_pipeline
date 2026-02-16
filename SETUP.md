# Setup Instructions

This document provides step-by-step instructions for setting up the Customer Churn Prediction system.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Training the Model](#training-the-model)
4. [Running the Application](#running-the-application)
5. [Docker Deployment](#docker-deployment)
6. [Cloud Deployment](#cloud-deployment)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn
- Git
- (Optional) Docker and Docker Compose

### Check Versions
```bash
python --version
node --version
npm --version
git --version
docker --version  # Optional
```

## Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/customer-churn-prediction.git
cd customer-churn-prediction
```

### 2. Backend Setup

#### Create Virtual Environment
```bash
cd backend
python -m venv venv
```

#### Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Verify Installation
```bash
python -c "import flask; import xgboost; import pandas; print('All packages installed!')"
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Verify Installation
```bash
npm list react react-dom
```

### 4. Environment Variables

Create `.env` files:

**Backend (.env in backend/):**
```
FLASK_APP=app.py
FLASK_ENV=development
PORT=5000
```

**Frontend (.env in frontend/):**
```
REACT_APP_API_URL=http://localhost:5000
```

## Training the Model

### Option 1: Using Jupyter Notebooks (Recommended)

1. Install Jupyter:
```bash
pip install jupyter matplotlib seaborn
```

2. Start Jupyter:
```bash
cd notebooks
jupyter notebook
```

3. Run notebooks in order:
   - `01_EDA_and_Feature_Engineering.ipynb`
   - `02_Model_Training_and_Evaluation.ipynb`

### Option 2: Using Training Script

```bash
cd backend
python train_model.py
```

This will:
- Load and preprocess data
- Engineer features
- Train XGBoost model with hyperparameter tuning
- Save all artifacts to `models/` directory

**Note:** Training may take 10-30 minutes depending on your hardware.

## Running the Application

### Start Backend Server

```bash
cd backend
# Make sure virtual environment is activated
python app.py
```

Backend will run on `http://localhost:5000`

### Start Frontend Development Server

Open a new terminal:
```bash
cd frontend
npm start
```

Frontend will open automatically at `http://localhost:3000`

### Verify Everything Works

1. Open `http://localhost:3000` in your browser
2. Navigate to "Model Info" tab
3. You should see model metrics and information
4. Go to "Single Prediction" tab
5. Fill the form and click "Predict Churn"

## Docker Deployment

### Build and Run with Docker Compose

```bash
# From project root
docker-compose up --build
```

This will:
- Build backend and frontend images
- Start both services
- Make the app available at `http://localhost`

### Individual Container Commands

**Build Backend:**
```bash
cd backend
docker build -t churn-backend .
docker run -p 5000:5000 churn-backend
```

**Build Frontend:**
```bash
cd frontend
docker build -t churn-frontend .
docker run -p 80:80 churn-frontend
```

## Cloud Deployment

### Vercel (Frontend)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd frontend
vercel --prod
```

3. Configure environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend URL

### Heroku (Backend)

1. Install Heroku CLI:
```bash
# Visit https://devcenter.heroku.com/articles/heroku-cli
```

2. Login and create app:
```bash
heroku login
heroku create your-app-name
```

3. Deploy:
```bash
cd backend
git init
git add .
git commit -m "Initial commit"
heroku git:remote -a your-app-name
git push heroku main
```

4. Upload model files:
```bash
# Option 1: Include in git (if small)
git lfs install
git lfs track "*.pkl"
git add .gitattributes
git add models/*.pkl
git commit -m "Add models"
git push heroku main

# Option 2: Use cloud storage (recommended for large models)
# Store models in AWS S3, Google Cloud Storage, etc.
```

### Railway (Backend Alternative)

1. Visit [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway auto-detects Flask app
4. Add environment variables if needed
5. Deploy!

## Troubleshooting

### Common Issues

#### 1. ModuleNotFoundError
**Problem:** `ModuleNotFoundError: No module named 'flask'`

**Solution:**
```bash
# Make sure virtual environment is activated
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

#### 2. Port Already in Use
**Problem:** `Address already in use: Port 5000`

**Solution:**
```bash
# Find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

#### 3. CORS Errors
**Problem:** Frontend can't connect to backend

**Solution:**
- Check `REACT_APP_API_URL` in frontend `.env`
- Ensure backend is running
- Verify CORS is enabled in `app.py`

#### 4. Model Not Found
**Problem:** `Model not loaded` error

**Solution:**
```bash
# Ensure models directory exists
mkdir -p backend/models

# Train the model
cd backend
python train_model.py
```

#### 5. npm Install Fails
**Problem:** `npm ERR!` during installation

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Review the logs:
   - Backend: Terminal running `python app.py`
   - Frontend: Browser Developer Console (F12)
3. Verify all prerequisites are installed
4. Ensure ports 3000 and 5000 are available
5. Check environment variables are set correctly

### Performance Tips

1. **For faster training:**
   - Reduce GridSearchCV parameters
   - Use fewer cross-validation folds
   - Reduce dataset size for testing

2. **For better predictions:**
   - Ensure input data matches training format
   - Check for missing values
   - Verify categorical values are valid

3. **For production:**
   - Use gunicorn with multiple workers
   - Enable caching
   - Add rate limiting
   - Use CDN for frontend assets

## Next Steps

After successful setup:

1. Explore the notebooks for data analysis
2. Customize the UI in `frontend/src/`
3. Extend the API in `backend/app.py`
4. Add new features to the model
5. Deploy to production!

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://reactjs.org/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [Docker Documentation](https://docs.docker.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Heroku Documentation](https://devcenter.heroku.com/)
