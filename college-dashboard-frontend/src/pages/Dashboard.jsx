/**
 * Dashboard Overview Page
 * Main dashboard content (Layout handles header/sidebar)
 */

import { useAuth } from '../routes/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Welcome, {user?.name || user?.email || 'User'}!
        </h2>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">User Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {user?.email && (
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              )}
              {user?.tenantId && (
                <p>
                  <span className="font-medium">Tenant ID:</span> {user.tenantId}
                </p>
              )}
              {user?.name && (
                <p>
                  <span className="font-medium">Name:</span> {user.name}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">
              🎉 Dashboard Overview
            </h3>
            <p className="text-sm text-blue-700">
              This is your main dashboard. Use the sidebar to navigate to different sections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Protected Routes</h4>
              <p className="text-sm text-gray-600">
                This page is protected and requires authentication to access.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Session Persistence</h4>
              <p className="text-sm text-gray-600">
                Your session is saved and will persist across page refreshes.
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">State Management</h4>
              <p className="text-sm text-gray-600">
                Auth state is managed centrally using React Context API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

