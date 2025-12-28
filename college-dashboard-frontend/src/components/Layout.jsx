/**
 * Layout Component
 * Main layout wrapper for protected routes with sidebar and header
 */

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../routes/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const { user, signout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-zinc-950 transition-theme">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Layout */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? 'ml-[260px]' : 'ml-[80px]'
        }`}
      >
        {/* Header */}
        <Header
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          user={user}
          onSignout={signout}
        />

        {/* Page Content */}
        <main className="pt-[64px] z-10 py-6 px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

