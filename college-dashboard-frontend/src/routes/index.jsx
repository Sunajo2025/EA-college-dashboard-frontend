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
import Extraction from '../pages/Extraction';
import Workflow from '../pages/Workflow';
import AIChatbot from '../pages/AIChatbot';
import ChatbotConfigure from '../pages/ChatbotConfigure';
import Documents from '../pages/Documents';
import Admin from '../pages/Admin';
import KnowledgeBase from '../pages/knowledgeBase';
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';
import Integrations from '../pages/Integrations';
import UsageBilling from '../pages/UsageBilling';
import Settings from '../pages/Settings';
import Analytics from '../pages/Analytics';
import ChatPage from '../pages/ChatPage';

import { ROUTES } from '../constants/api';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
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

          {/* Protected Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Default */}
            <Route index element={<Navigate to="overview" replace />} />

            {/* Dashboard Pages */}
            <Route path="overview" element={<Overview />} />
            <Route path="ai-extraction" element={<Extraction />} />
            <Route path="workflows" element={<Workflow />} />
            <Route path="documents" element={<Documents />} />
            <Route path="knowledge-base" element={<KnowledgeBase />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="billing" element={<UsageBilling />} />
            <Route path="settings" element={<Settings />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="admin" element={<Admin />} />
            <Route path="chat" element={<ChatPage />} /> 
            <Route path="profile" element={<Profile />} /> 

            {/* AI Chatbots */}
            <Route path="chatbots" element={<AIChatbot />} />
            <Route
              path="chatbots/:chatbotId/configure"
              element={<ChatbotConfigure />}
            />
          </Route>

          {/* Redirects */}
          <Route
            path={ROUTES.PROFILE}
            element={<Navigate to="/dashboard/profile" replace />}
          />

          <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
          <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
