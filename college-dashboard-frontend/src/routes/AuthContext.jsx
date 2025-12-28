/**
 * Authentication Context
 * Centralized authentication state management
 * Provides auth state and methods to all components
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signin as signinService, signup as signupService, signout as signoutService } from '../services/authService';
import { saveUserToStorage, getUserFromStorage, removeUserFromStorage } from '../utils/storage';
import { ROUTES } from '../constants/api';

// Create the context
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Wraps the app and provides authentication state and methods
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /**
   * Initialize auth state from localStorage on mount
   * This handles page refresh persistence
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = getUserFromStorage();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        removeUserFromStorage();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Sign up a new user
   * @param {Object} userData - Registration data
   * @returns {Promise<void>}
   */
  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      // Call signup API
      const response = await signupService(userData);

      // Store user data
      // Assuming backend returns user object
      const userDataToStore = response.user || response;
      saveUserToStorage(userDataToStore);
      setUser(userDataToStore);

      // Store tenantId in sessionStorage for sidebar
      if (userDataToStore.tenantId) {
        sessionStorage.setItem('tenantId', userDataToStore.tenantId);
      }

      // Redirect to dashboard overview
      navigate('/dashboard/overview');
    } catch (err) {
      const errorMessage = err.message || 'Signup failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in an existing user
   * @param {Object} credentials - Login credentials
   * @returns {Promise<void>}
   */
  const signin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      // Call signin API
      const response = await signinService(credentials);

      // Store user data
      // Assuming backend returns user object
      const userDataToStore = response.user || response;
      saveUserToStorage(userDataToStore);
      setUser(userDataToStore);

      // Store tenantId in sessionStorage for sidebar
      if (userDataToStore.tenantId) {
        sessionStorage.setItem('tenantId', userDataToStore.tenantId);
      }

      // Redirect to dashboard overview
      navigate('/dashboard/overview');
    } catch (err) {
      const errorMessage = err.message || 'Signin failed. Please check your credentials.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out the current user
   * Clears auth state and redirects to signin
   */
  const signout = async () => {
    try {
      setLoading(true);
      
      // Call signout service (for future JWT implementation)
      await signoutService();

      // Clear user state and storage
      setUser(null);
      removeUserFromStorage();
      sessionStorage.removeItem('tenantId');
      setError(null);

      // Redirect to signin
      navigate(ROUTES.SIGNIN);
    } catch (err) {
      console.error('Error during signout:', err);
      // Even if API call fails, clear local state
      setUser(null);
      removeUserFromStorage();
      sessionStorage.removeItem('tenantId');
      navigate(ROUTES.SIGNIN);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return user !== null;
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    signup,
    signin,
    signout,
    clearError,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

