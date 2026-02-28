
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


export const API_ENDPOINTS = {
  SIGNUP: '/signup',
  SIGNIN: '/signin',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'auth_user',
  TOKEN: 'auth_token', // Reserved for future JWT implementation
};

// Route Paths
export const ROUTES = {
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
};

