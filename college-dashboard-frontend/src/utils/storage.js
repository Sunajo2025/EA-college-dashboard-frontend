/**
 * LocalStorage Utility Functions
 * Handles all browser storage operations for authentication
 */

import { STORAGE_KEYS } from '../constants/api';

/**
 * Save user data to localStorage
 * @param {Object} userData - User object to store
 */
export const saveUserToStorage = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user to storage:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Get user data from localStorage
 * @returns {Object|null} User object or null if not found
 */
export const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error reading user from storage:', error);
    return null;
  }
};

/**
 * Remove user data from localStorage
 */
export const removeUserFromStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN); // Also remove token if exists
  } catch (error) {
    console.error('Error removing user from storage:', error);
  }
};

/**
 * Check if user is stored in localStorage
 * @returns {boolean} True if user exists in storage
 */
export const hasStoredUser = () => {
  return getUserFromStorage() !== null;
};

