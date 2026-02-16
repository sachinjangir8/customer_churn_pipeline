import React, { useState, useEffect } from 'react';
import { getModelInfo } from '../services/api';
import { FaCog, FaChartBar, FaLayerGroup } from 'react-icons/fa';

const ModelInfo = () => {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      const info = await getModelInfo();
      setModelInfo(info);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <span className="loading-spinner" style={{ width: '40px', height: '40px' }}></span>
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading model information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!modelInfo) {
    return null;
  }

  const { model_name, metrics, features, hyperparameters } = modelInfo;

  return (
    <div className="model-info-container">
      {/* Model Overview */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <FaCog style={{ fontSize: '2rem', color: '#667eea' }} />
          <div>
            <h2 style={{ margin: 0, color: '#333' }}>Model Overview</h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>{model_name}</p>
          </div>
        </div>

        <div style={{ 
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', margin: 0 }}>
            This is an industry-standard machine learning pipeline using <strong>XGBoost</strong> with 
            hyperparameter tuning. The model has been trained on historical customer data with 
            SMOTE for handling class imbalance and includes comprehensive feature engineering.
          </p>
        </div>

        {/* Performance Metrics */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <FaChartBar style={{ fontSize: '1.5rem', color: '#667eea' }} />
            <h3 style={{ margin: 0 }}>Performance Metrics</h3>
          </div>

          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-label">Accuracy</div>
              <div className="metric-value">{(metrics.accuracy * 100).toFixed(2)}%</div>
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#888', 
                marginTop: '0.5rem' 
              }}>
                Overall Correctness
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Precision</div>
              <div className="metric-value">{(metrics.precision * 100).toFixed(2)}%</div>
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#888', 
                marginTop: '0.5rem' 
              }}>
                True Churners Found
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">Recall</div>
              <div className="metric-value">{(metrics.recall * 100).toFixed(2)}%</div>
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#888', 
                marginTop: '0.5rem' 
              }}>
                Churners Detected
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-label">F1-Score</div>
              <div className="metric-value">{(metrics.f1_score * 100).toFixed(2)}%</div>
              <div style={{ 
                fontSize: '0.85rem', 
                color: '#888', 
                marginTop: '0.5rem' 
              }}>
                Harmonic Mean
              </div>
            </div>

            <div className="metric-card" style={{ 
              gridColumn: 'span 2',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff'
            }}>
              <div className="metric-label" style={{ color: 'rgba(255,255,255,0.9)' }}>
                ROC-AUC Score
              </div>
              <div className="metric-value" style={{ color: '#fff' }}>
                {(metrics.roc_auc * 100).toFixed(2)}%
              </div>
              <div style={{ 
                fontSize: '0.85rem', 
                color: 'rgba(255,255,255,0.8)', 
                marginTop: '0.5rem' 
              }}>
                Model Discrimination Ability
              </div>
            </div>
          </div>
        </div>

        {/* Feature Information */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <FaLayerGroup style={{ fontSize: '1.5rem', color: '#667eea' }} />
            <h3 style={{ margin: 0 }}>Feature Statistics</h3>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ 
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                {features.total}
              </div>
              <div style={{ color: '#666', marginTop: '0.5rem', fontWeight: '600' }}>
                Total Features
              </div>
            </div>

            <div style={{ 
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                {features.categorical}
              </div>
              <div style={{ color: '#666', marginTop: '0.5rem', fontWeight: '600' }}>
                Categorical
              </div>
            </div>

            <div style={{ 
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#667eea' }}>
                {features.numerical}
              </div>
              <div style={{ color: '#666', marginTop: '0.5rem', fontWeight: '600' }}>
                Numerical
              </div>
            </div>
          </div>
        </div>

        {/* Hyperparameters */}
        {hyperparameters && Object.keys(hyperparameters).length > 0 && (
          <div>
            <h3 style={{ marginBottom: '1rem' }}>Optimized Hyperparameters</h3>
            <div style={{ 
              background: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '12px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {Object.entries(hyperparameters).map(([key, value]) => (
                <div key={key} style={{ 
                  padding: '1rem',
                  background: '#fff',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#888', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.5rem'
                  }}>
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700',
                    color: '#333'
                  }}>
                    {typeof value === 'number' ? value.toFixed(4) : value.toString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Technical Details */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Technical Implementation</h3>
        
        <div style={{ 
          display: 'grid',
          gap: '1.5rem'
        }}>
          <div>
            <h4 style={{ color: '#667eea', marginBottom: '0.75rem' }}>
              🔧 Data Preprocessing
            </h4>
            <ul style={{ lineHeight: '2', color: '#555' }}>
              <li>Label Encoding for categorical variables</li>
              <li>StandardScaler for numerical features</li>
              <li>SMOTE for class imbalance handling</li>
              <li>Feature engineering with 7+ derived features</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#667eea', marginBottom: '0.75rem' }}>
              🎯 Model Training
            </h4>
            <ul style={{ lineHeight: '2', color: '#555' }}>
              <li>XGBoost Classifier with GridSearchCV</li>
              <li>5-Fold Stratified Cross-Validation</li>
              <li>ROC-AUC optimization objective</li>
              <li>Comprehensive hyperparameter tuning</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#667eea', marginBottom: '0.75rem' }}>
              📊 Evaluation Metrics
            </h4>
            <ul style={{ lineHeight: '2', color: '#555' }}>
              <li>Multi-metric evaluation (Accuracy, Precision, Recall, F1)</li>
              <li>ROC-AUC and Precision-Recall curves</li>
              <li>Confusion matrix analysis</li>
              <li>Feature importance ranking</li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#667eea', marginBottom: '0.75rem' }}>
              🚀 Deployment
            </h4>
            <ul style={{ lineHeight: '2', color: '#555' }}>
              <li>RESTful API with Flask backend</li>
              <li>React frontend with modern UI/UX</li>
              <li>Docker containerization support</li>
              <li>Vercel/Heroku deployment ready</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
