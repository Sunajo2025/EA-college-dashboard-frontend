/**
 * Sidebar Component
 * Collapsible sidebar navigation with tenant information
 */

import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import sidebarConfig from '../config/sidebarConfig';
import { useAuth } from '../routes/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const tenant =
    user?.tenantId || sessionStorage.getItem('tenantId') || 'Tenant';

  return (
    <motion.aside
      animate={{ width: isOpen ? 260 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-white dark:bg-zinc-900 h-screen fixed left-0 top-0 flex flex-col justify-between shadow-md z-20 transition-theme"
      style={{
        backgroundImage:
          'linear-gradient(to top, rgba(91,95,255,0.06), transparent 35%)',
      }}
    >
      {/* Logo Section */}
      <div className="px-5 flex items-center h-16">
        {isOpen && (
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-8 object-contain brightness-0 dark:invert transition-theme"
            />
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="ml-auto p-1 rounded text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-theme"
        >
          {isOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex-1 overflow-y-auto px-2">
        {sidebarConfig.map((item) => (
          <NavLink
            key={item.link}
            to={`/dashboard/${item.link}`}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-[15px] font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`
            }
          >
            <i className={`${item.icon} text-xl`} />
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Tenant Section */}
      <div className="p-4 flex items-center gap-3">
        {isOpen ? (
          <>
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold transition-theme">
              {tenant[0]?.toUpperCase() || 'T'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {tenant}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Premium Member
              </span>
            </div>
          </>
        ) : (
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold mx-auto transition-theme">
            {tenant[0]?.toUpperCase() || 'T'}
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
