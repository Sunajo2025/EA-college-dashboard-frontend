/**
 * Theme Context
 * Manages light/dark theme state with localStorage persistence
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

/**
 * ThemeProvider Component
 * Provides theme state and toggle function to all components
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  /**
   * Apply theme to HTML element
   */
  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    // Remove both classes first to ensure clean state
    root.classList.remove('dark', 'light');
    // Add the appropriate class
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      // Light mode - no class needed, but ensure dark is removed
      root.classList.remove('dark');
    }
  };

  /**
   * Initialize theme on mount
   * Checks localStorage first, then system preference
   */
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    
    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemPrefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      applyTheme(initialTheme);
    }
    
    setMounted(true);
  }, []);

  /**
   * Toggle between light and dark theme
   */
  const toggleTheme = useCallback(() => {
    // Read current theme from DOM to ensure accuracy
    const root = document.documentElement;
    const isCurrentlyDark = root.classList.contains('dark');
    
    // Determine new theme
    const newTheme = isCurrentlyDark ? 'light' : 'dark';
    
    // Apply theme immediately to DOM
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Update state
    setTheme(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  }, []);

  // Prevent flash of wrong theme
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

/**
 * Custom hook to use theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

