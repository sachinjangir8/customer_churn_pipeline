import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getRecommendations } from '../services/api';
import { FaCheckCircle, FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

const ResultsDisplay = ({ result }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const { churn, churn_probability, confidence, risk_level } = result;
  const churnPercent = (churn_probability * 100).toFixed(1);
  const noChurnPercent = ((1 - churn_probability) * 100).toFixed(1);

  useEffect(() => {
  if (churn) {
    fetchRecommendations();
  }
}, [churn, fetchRecommendations]);

  const fetchRecommendations = useCallback(async () => {
  setLoadingRecs(true);
  try {
    const recs = await getRecommendations(result.customerData || {});
    setRecommendations(recs);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  } finally {
    setLoadingRecs(false);
  }
}, [result]);

  const chartData = {
    labels: ['Will Churn', 'Will Stay'],
    datasets: [
      {
        data: [churnPercent, noChurnPercent],
        backgroundColor: [
          'rgba(231, 76, 60, 0.8)',
          'rgba(46, 204, 113, 0.8)',
        ],
        borderColor: [
          'rgba(231, 76, 60, 1)',
          'rgba(46, 204, 113, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + context.parsed + '%';
          }
        }
      }
    }
  };

  const getRiskClass = (level) => {
    const levelMap = {
      'Low': 'risk-low',
      'Medium': 'risk-medium',
      'High': 'risk-high',
      'Critical': 'risk-critical'
    };
    return levelMap[level] || 'risk-medium';
  };

  const getProgressClass = (level) => {
    const levelMap = {
      'Low': 'progress-low',
      'Medium': 'progress-medium',
      'High': 'progress-high',
      'Critical': 'progress-critical'
    };
    return levelMap[level] || 'progress-medium';
  };

  return (
    <div className="results-container slide-in">
      {/* Main Result Card */}
      <div className="result-card">
        <div className="result-header">
          <h3 className="result-title">Prediction Results</h3>
          <span className={`risk-badge ${getRiskClass(risk_level)}`}>
            {risk_level} Risk
          </span>
        </div>

        {/* Churn Status */}
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          {churn ? (
            <div>
              <FaExclamationTriangle 
                style={{ fontSize: '4rem', color: '#e74c3c', marginBottom: '1rem' }} 
              />
              <h2 style={{ color: '#e74c3c', fontSize: '2rem', marginBottom: '0.5rem' }}>
                Likely to Churn
              </h2>
            </div>
          ) : (
            <div>
              <FaCheckCircle 
                style={{ fontSize: '4rem', color: '#2ecc71', marginBottom: '1rem' }} 
              />
              <h2 style={{ color: '#2ecc71', fontSize: '2rem', marginBottom: '0.5rem' }}>
                Likely to Stay
              </h2>
            </div>
          )}
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Confidence: {(confidence * 100).toFixed(1)}%
          </p>
        </div>

        {/* Probability Chart */}
        <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
          <Doughnut data={chartData} options={chartOptions} />
        </div>

        {/* Probability Bar */}
        <div className="progress-container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            <span>Churn Probability</span>
            <span>{churnPercent}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${getProgressClass(risk_level)}`}
              style={{ width: `${churnPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid" style={{ marginTop: '2rem' }}>
          <div className="metric-card">
            <div className="metric-label">Churn Risk</div>
            <div className="metric-value">{churnPercent}%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Retention</div>
            <div className="metric-value">{noChurnPercent}%</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Confidence</div>
            <div className="metric-value">{(confidence * 100).toFixed(0)}%</div>
          </div>
        </div>
      </div>

      {/* Recommendations Card */}
      {churn && (
        <div className="result-card" style={{ marginTop: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <FaLightbulb style={{ fontSize: '1.5rem', color: '#f39c12' }} />
            <h3 style={{ margin: 0 }}>Retention Recommendations</h3>
          </div>

          {loadingRecs ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span className="loading-spinner"></span>
              <p style={{ marginTop: '1rem', color: '#666' }}>
                Generating personalized recommendations...
              </p>
            </div>
          ) : recommendations && recommendations.recommendations ? (
            <div className="recommendations-list">
              {recommendations.recommendations.map((rec, index) => (
                <div key={index} className="recommendation-item">
                  <div className="recommendation-header">
                    <span className="recommendation-category">{rec.category}</span>
                    <span className={`priority-badge priority-${rec.priority.toLowerCase()}`}>
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p style={{ color: '#555', lineHeight: '1.6', margin: '0.5rem 0 0 0' }}>
                    {rec.message}
                  </p>
                  <div style={{ 
                    marginTop: '0.5rem', 
                    fontSize: '0.85rem', 
                    color: '#888',
                    fontStyle: 'italic'
                  }}>
                    Expected Impact: {rec.impact}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-info">
              <span>ℹ️</span>
              <span>No specific recommendations available at this time.</span>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ 
        marginTop: '1.5rem', 
        display: 'flex', 
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {churn && !loadingRecs && (
          <button 
            className="btn btn-secondary"
            onClick={fetchRecommendations}
          >
            Refresh Recommendations
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsDisplay;
