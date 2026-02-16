import React, { useState } from 'react';
import './App.css';
import PredictionForm from './components/PredictionForm';
import ResultsDisplay from './components/ResultsDisplay';
import ModelInfo from './components/ModelInfo';
import BatchPrediction from './components/BatchPrediction';
import { FaChartLine, FaRobot, FaBrain, FaDatabase } from 'react-icons/fa';

function App() {
  const [activeTab, setActiveTab] = useState('predict');
  const [predictionResult, setPredictionResult] = useState(null);

  const handlePredictionComplete = (result) => {
    setPredictionResult(result);
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <FaBrain className="logo-icon" />
            <h1>Customer Churn Prediction</h1>
          </div>
          <p className="subtitle">AI-Powered Customer Retention Analytics</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'predict' ? 'active' : ''}`}
          onClick={() => setActiveTab('predict')}
        >
          <FaChartLine /> Single Prediction
        </button>
        <button
          className={`nav-button ${activeTab === 'batch' ? 'active' : ''}`}
          onClick={() => setActiveTab('batch')}
        >
          <FaDatabase /> Batch Prediction
        </button>
        <button
          className={`nav-button ${activeTab === 'model' ? 'active' : ''}`}
          onClick={() => setActiveTab('model')}
        >
          <FaRobot /> Model Info
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        <div className="content-container">
          {activeTab === 'predict' && (
            <div className="tab-content">
              <div className="intro-section">
                <h2>Predict Customer Churn</h2>
                <p>
                  Enter customer information below to predict churn probability and receive
                  personalized retention recommendations powered by machine learning.
                </p>
              </div>
              
              <div className="prediction-layout">
                <div className="form-section">
                  <PredictionForm onPredictionComplete={handlePredictionComplete} />
                </div>
                
                {predictionResult && (
                  <div className="results-section">
                    <ResultsDisplay result={predictionResult} />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'batch' && (
            <div className="tab-content">
              <div className="intro-section">
                <h2>Batch Prediction</h2>
                <p>
                  Upload a CSV file or paste JSON data to predict churn for multiple
                  customers at once. Perfect for analyzing large customer segments.
                </p>
              </div>
              <BatchPrediction />
            </div>
          )}

          {activeTab === 'model' && (
            <div className="tab-content">
              <div className="intro-section">
                <h2>Model Information</h2>
                <p>
                  View detailed information about the machine learning model, including
                  performance metrics, features, and hyperparameters.
                </p>
              </div>
              <ModelInfo />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2025 Customer Churn Prediction System</p>
          <p>Powered by XGBoost & React | Industry-Standard ML Pipeline</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
