/**
 * Header Component
 * Top navigation bar with search, notifications, theme toggle, and user menu
 */

import { useState, useRef, useEffect } from 'react';
import { Settings, Bell, User, LogOut, Edit, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ isSidebarOpen, toggleSidebar, user, onSignout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { theme, toggleTheme, isDark } = useTheme();

  // Close popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      className={`bg-white dark:bg-zinc-900 shadow-sm fixed top-0 right-0 z-10 transition-theme duration-300 ${isSidebarOpen ? 'left-[260px]' : 'left-[80px]'
        }`}
    >
      <div className="flex justify-between items-center px-6 py-3">
        {/* Search Bar */}
        <div className="flex items-center w-1/3 bg-gray-50 dark:bg-zinc-800 rounded-lg px-3 py-2 transition-theme">
          <i className="ri-search-line text-gray-500 dark:text-gray-400 mr-2"></i>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 w-full placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Icons and User Section */}
        <div className="flex items-center gap-5 relative">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              toggleTheme();
            }}
            className="p-2 cursor-pointer rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-theme"
            aria-label="Toggle theme"
            type="button"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Settings className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" size={20} />
          <div className="relative">
            <Bell className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors" size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* User Profile Section */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium transition-theme">
                {user?.email?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </button>

            {/* Popup Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-3 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 py-2 animate-fadeIn z-20 transition-theme">
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 w-full text-left transition-theme">
                  <Edit size={16} className="text-indigo-500 dark:text-indigo-400" />
                  Edit Profile
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 w-full text-left transition-theme">
                  <User size={16} className="text-indigo-500 dark:text-indigo-400" />
                  Settings
                </button>
                <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                <button
                  onClick={onSignout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-theme"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

