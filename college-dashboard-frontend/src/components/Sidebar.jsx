/**
 * Sidebar Component
 * Collapsible sidebar navigation with tenant information
 */

import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 object-contain brightness-0 dark:invert transition-theme"
          />
        )}

        <button
          onClick={toggleSidebar}
          className="ml-auto p-2 rounded cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-theme"
        >
          {isOpen ? <PanelLeftClose size={22} /> : <PanelLeftOpen size={22} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-3 flex-1 overflow-y-auto px-2 space-y-1">
        {sidebarConfig.map((item) => (
          <NavLink
            key={item.link}
            to={`/dashboard/${item.link}`}
            title={!isOpen ? item.label : undefined}
            className={({ isActive }) =>
              `
              flex items-center
              ${isOpen ? 'gap-3 px-2.5' : 'justify-center px-0'}
              py-2 rounded-md text-[14px] font-semibold transition-all
              ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-800 dark:text-gray-300 hover:bg-indigo-50/70 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400'
              }
              `
            }
          >
            {/* Icon Wrapper */}
            <div
              className={`
                w-9 h-9 flex items-center justify-center rounded-lg
                bg-gradient-to-br
                from-white to-indigo-100
                dark:from-zinc-800 dark:to-indigo-900/40
                transition
              `}
            >
              <i className={`${item.icon} text-[18px]`} />
            </div>

            {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Tenant Section */}
      <div className="px-4 py-3 border-t border-gray-100 dark:border-zinc-800">
        {isOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold transition-theme">
              {tenant[0]?.toUpperCase() || 'T'}
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {tenant}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Premium Member
              </span>
            </div>
          </div>
        ) : (
          <div
            title={tenant}
            className="mx-auto w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900/40 dark:to-indigo-800/40 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-semibold transition-theme"
          >
            {tenant[0]?.toUpperCase() || 'T'}
          </div>
        )}
      </div>
    </motion.aside>
  );
};

export default Sidebar;
