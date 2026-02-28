/**
 * Public Route Component
 * Redirects authenticated users away from public routes (signin/signup)
 * Prevents authenticated users from accessing auth pages
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ROUTES } from '../constants/api';

/**
 * PublicRoute Component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Render public content
  return children;
};

export default PublicRoute;

