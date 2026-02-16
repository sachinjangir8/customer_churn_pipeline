import React, { useState } from 'react';
import { batchPredict } from '../services/api';
import { FaUpload, FaFileExport, FaTable } from 'react-icons/fa';

const BatchPrediction = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const text = event.target.result;
          let data;

          if (file.name.endsWith('.json')) {
            data = JSON.parse(text);
          } else if (file.name.endsWith('.csv')) {
            // Simple CSV parser
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',').map(h => h.trim());
            
            data = lines.slice(1).map(line => {
              const values = line.split(',');
              const obj = {};
              headers.forEach((header, index) => {
                obj[header] = values[index] ? values[index].trim() : '';
              });
              return obj;
            });
          } else {
            throw new Error('Unsupported file format. Please upload CSV or JSON.');
          }

          const response = await batchPredict(data);
          setResults(response);
        } catch (err) {
          setError(err.message || 'Error processing file');
        } finally {
          setLoading(false);
        }
      };

      reader.readAsText(file);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const downloadResults = () => {
    if (!results) return;

    const csv = convertToCSV(results.results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `churn_predictions_${new Date().toISOString()}.csv`;
    a.click();
  };

  const convertToCSV = (data) => {
    const headers = ['Index', 'Churn', 'Churn Probability', 'Confidence', 'Risk Level', 'Error'];
    const rows = data.map(item => [
      item.index,
      item.churn ? 'Yes' : 'No',
      item.churn_probability ? (item.churn_probability * 100).toFixed(2) + '%' : 'N/A',
      item.confidence ? (item.confidence * 100).toFixed(2) + '%' : 'N/A',
      item.risk_level || 'N/A',
      item.error || ''
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const getStats = () => {
    if (!results) return null;

    const total = results.results.length;
    const churnCount = results.results.filter(r => r.churn).length;
    const errors = results.results.filter(r => r.error).length;
    const avgProbability = results.results
      .filter(r => !r.error)
      .reduce((sum, r) => sum + r.churn_probability, 0) / (total - errors);

    return {
      total,
      churnCount,
      noChurnCount: total - churnCount - errors,
      errors,
      churnRate: ((churnCount / (total - errors)) * 100).toFixed(1),
      avgProbability: (avgProbability * 100).toFixed(1)
    };
  };

  return (
    <div className="batch-prediction-container">
      {/* Upload Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <FaUpload style={{ fontSize: '2rem', color: '#667eea' }} />
          <h3 style={{ margin: 0 }}>Upload Customer Data</h3>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div style={{ 
          border: '2px dashed #667eea',
          borderRadius: '12px',
          padding: '3rem',
          textAlign: 'center',
          background: 'rgba(102, 126, 234, 0.05)'
        }}>
          <input
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="file-upload"
            disabled={loading}
          />
          <label 
            htmlFor="file-upload" 
            style={{ 
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'inline-block'
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <FaTable style={{ fontSize: '3rem', color: '#667eea' }} />
            </div>
            <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '0.5rem' }}>
              {loading ? 'Processing...' : 'Click to upload or drag and drop'}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              CSV or JSON files (max 10MB)
            </p>
          </label>
        </div>

        <div style={{ 
          marginTop: '1.5rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h4 style={{ marginBottom: '0.75rem', color: '#333' }}>📋 File Format Requirements</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#555', lineHeight: '2' }}>
            <li>Include all required customer fields (gender, tenure, services, etc.)</li>
            <li>CSV: First row must be headers matching API field names</li>
            <li>JSON: Array of customer objects with correct field names</li>
            <li>Maximum 1000 records per batch for optimal performance</li>
          </ul>
        </div>
      </div>

      {/* Results Section */}
      {loading && (
        <div className="card" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '3rem' }}>
          <span className="loading-spinner" style={{ width: '40px', height: '40px' }}></span>
          <p style={{ marginTop: '1rem', color: '#666', fontSize: '1.1rem' }}>
            Processing batch predictions...
          </p>
        </div>
      )}

      {results && !loading && (
        <>
          {/* Statistics Summary */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Batch Results Summary</h3>
            
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">Total Records</div>
                <div className="metric-value">{getStats().total}</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Will Churn</div>
                <div className="metric-value" style={{ color: '#e74c3c' }}>
                  {getStats().churnCount}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Will Stay</div>
                <div className="metric-value" style={{ color: '#2ecc71' }}>
                  {getStats().noChurnCount}
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Churn Rate</div>
                <div className="metric-value">{getStats().churnRate}%</div>
              </div>

              <div className="metric-card">
                <div className="metric-label">Avg Probability</div>
                <div className="metric-value">{getStats().avgProbability}%</div>
              </div>

              {getStats().errors > 0 && (
                <div className="metric-card">
                  <div className="metric-label">Errors</div>
                  <div className="metric-value" style={{ color: '#e74c3c' }}>
                    {getStats().errors}
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn btn-primary"
              onClick={downloadResults}
              style={{ marginTop: '1.5rem' }}
            >
              <FaFileExport />
              <span>Download Results CSV</span>
            </button>
          </div>

          {/* Results Table */}
          <div className="card" style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Detailed Predictions</h3>
            
            <table style={{ 
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.95rem'
            }}>
              <thead>
                <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #667eea' }}>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Index</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Churn</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Probability</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Confidence</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Risk Level</th>
                  <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.results.map((result, idx) => (
                  <tr 
                    key={idx}
                    style={{ 
                      borderBottom: '1px solid #e0e0e0',
                      background: idx % 2 === 0 ? '#fff' : '#fafafa'
                    }}
                  >
                    <td style={{ padding: '1rem' }}>{result.index}</td>
                    <td style={{ padding: '1rem' }}>
                      {result.error ? (
                        <span style={{ color: '#e74c3c' }}>Error</span>
                      ) : (
                        <span style={{ 
                          fontWeight: '600',
                          color: result.churn ? '#e74c3c' : '#2ecc71'
                        }}>
                          {result.churn ? 'Yes' : 'No'}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {result.churn_probability 
                        ? `${(result.churn_probability * 100).toFixed(1)}%`
                        : '-'
                      }
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {result.confidence 
                        ? `${(result.confidence * 100).toFixed(1)}%`
                        : '-'
                      }
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {result.risk_level && (
                        <span className={`risk-badge ${
                          result.risk_level === 'Low' ? 'risk-low' :
                          result.risk_level === 'Medium' ? 'risk-medium' :
                          result.risk_level === 'High' ? 'risk-high' :
                          'risk-critical'
                        }`}>
                          {result.risk_level}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {result.error ? (
                        <span style={{ fontSize: '0.85rem', color: '#e74c3c' }}>
                          {result.error}
                        </span>
                      ) : (
                        <span style={{ color: '#2ecc71' }}>✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default BatchPrediction;
