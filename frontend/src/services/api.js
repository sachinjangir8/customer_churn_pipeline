import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://customer-churn-pipeline-1.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('Unable to connect to server. Please check if the backend is running.');
    } else {
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
);

/**
 * Health check endpoint
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get model information
 */
export const getModelInfo = async () => {
  try {
    const response = await api.get('/api/model/info');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get required features
 */
export const getFeatures = async () => {
  try {
    const response = await api.get('/api/features');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Predict churn for a single customer
 * @param {Object} customerData - Customer information
 */
export const predictChurn = async (customerData) => {
  try {
    const response = await api.post('/api/predict', customerData);
    // Store customer data in response for later use
    return { ...response.data, customerData };
  } catch (error) {
    throw error;
  }
};

/**
 * Batch prediction for multiple customers
 * @param {Array} customersData - Array of customer information
 */
export const batchPredict = async (customersData) => {
  try {
    const response = await api.post('/api/predict/batch', customersData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get personalized recommendations
 * @param {Object} customerData - Customer information
 */
export const getRecommendations = async (customerData) => {
  try {
    const response = await api.post('/api/recommendations', customerData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
