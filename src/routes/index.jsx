/**
 * Main Routes Configuration
 * Sets up all routes with authentication context and route guards
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import Layout from '../components/Layout';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Overview from '../pages/Overview';
import Events from '../pages/Events';
import Funding from '../pages/Funding';
import Clubs from '../pages/Clubs';
import Reports from '../pages/Reports';
import ClubActivity from '../pages/ClubActivity';
import Admin from '../pages/Admin';
import EventConflicts from '../pages/EventConflicts';
import { ROUTES } from '../constants/api';

/**
 * AppRoutes Component
 * Main routing component with AuthProvider wrapper
 */
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes - Redirect to dashboard if already authenticated */}
          <Route
            path={ROUTES.SIGNIN}
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />
          <Route
            path={ROUTES.SIGNUP}
            element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            }
          />

          {/* Protected Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Default dashboard route - redirect to overview */}
            <Route index element={<Navigate to="/dashboard/overview" replace />} />
            {/* Dashboard sub-routes */}
            <Route path="overview" element={<Overview />} />
            <Route path="events" element={<Events />} />
            <Route path="funding" element={<Funding />} />
            <Route path="clubs" element={<Clubs />} />
            <Route path="reports" element={<Reports />} />
            <Route path="club-activity" element={<ClubActivity />} /> 
            <Route path="admin" element={<Admin />} />
            <Route path="event-conflicts" element={<EventConflicts />} />
          </Route>

          {/* Legacy profile route - redirect to dashboard/profile */}
          <Route
            path={ROUTES.PROFILE}
            element={<Navigate to="/dashboard/profile" replace />}
          />

          {/* Default route - Redirect to dashboard overview */}
          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />

          {/* Catch all - Redirect to dashboard overview */}
          <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;

