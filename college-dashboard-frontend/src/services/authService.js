/**
 * Authentication Service
 * Handles all API calls related to authentication
 * Centralized service layer - no API calls in components
 */

import { API_BASE_URL, API_ENDPOINTS } from '../constants/api';

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists (for future JWT implementation)
  const token = localStorage.getItem('auth_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Parse response
    const data = await response.json();

    // Handle non-2xx responses
    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Re-throw with more context
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your connection.');
    }
    throw error;
  }
};

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.tenantId - Tenant/Shop ID
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.name - User name (optional)
 * @returns {Promise<Object>} User data from server
 */
export const signup = async (userData) => {
  try {
    const response = await apiRequest(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Signup failed. Please try again.');
  }
};

/**
 * Sign in an existing user
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.tenantId - Tenant/Shop ID
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} User data from server
 */
export const signin = async (credentials) => {
  try {
    const response = await apiRequest(API_ENDPOINTS.SIGNIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Signin failed. Please check your credentials.');
  }
};

/**
 * Sign out user (client-side only for now)
 * When JWT is implemented, this can call a logout endpoint
 * @returns {Promise<void>}
 */
export const signout = async () => {
  // For now, just return a resolved promise
  // When JWT is added, you can call a logout endpoint here
  // await apiRequest(API_ENDPOINTS.SIGNOUT, { method: 'POST' });
  return Promise.resolve();
};

