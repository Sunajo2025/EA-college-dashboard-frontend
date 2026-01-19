import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Bell,
  User,
  LogOut,
  Edit,
  Sun,
  Moon,
  Bot,
  Database,
  Workflow,
  FileWarning,
  CreditCard,
  Info,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ---------- NOTIFICATION DATA ---------- */

const notificationsData = [
  {
    id: 1,
    title: "Chatbot Health Alert",
    time: "2 mins ago",
    priority: "High",
    icon: Bot,
  },
  {
    id: 2,
    title: "Knowledge Base Processing Failed",
    time: "12 mins ago",
    priority: "High",
    icon: FileWarning,
  },
  {
    id: 3,
    title: "Workflow Completed",
    time: "30 mins ago",
    priority: "Medium",
    icon: Workflow,
  },
  {
    id: 4,
    title: "AI Extraction Running",
    time: "1 hour ago",
    priority: "Medium",
    icon: Database,
  },
  {
    id: 5,
    title: "Usage Threshold Warning",
    time: "Today",
    priority: "Medium",
    icon: CreditCard,
  },
  {
    id: 6,
    title: "New Chatbot Created",
    time: "Today",
    priority: "Low",
    icon: Bot,
  },
  {
    id: 7,
    title: "Knowledge Base Updated",
    time: "Yesterday",
    priority: "Low",
    icon: Database,
  },
  {
    id: 8,
    title: "System Update Deployed",
    time: "2 days ago",
    priority: "Low",
    icon: Info,
  },
];

/* ---------- PRIORITY STYLES ---------- */

const iconStyles = {
  High: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  Medium:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  Low: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
};

/* ---------- COMPONENT ---------- */

const Header = ({ isSidebarOpen, user, onSignout }) => {
  const { toggleTheme, isDark } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const menuRef = useRef(null);
  const notifyRef = useRef(null);

  /* ---------- CLOSE ON OUTSIDE CLICK ---------- */

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (notifyRef.current && !notifyRef.current.contains(e.target)) {
        setNotifyOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = useNavigate();

  return (
    <>
      {/* Scrollbar Styling */}
      <style>
        {`
          .notify-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .notify-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .notify-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(209,213,219,0.7);
            border-radius: 999px;
          }
          .dark .notify-scroll::-webkit-scrollbar-thumb {
            background-color: rgba(113,113,122,0.6);
          }
        `}
      </style>

      <header
        className={`bg-white dark:bg-zinc-900 shadow-sm fixed top-0 right-0 z-10 transition-theme ${
          isSidebarOpen ? "left-[260px]" : "left-[80px]"
        }`}
      >
        <div className="flex justify-between items-center px-6 py-3">
          {/* Search */}
          <div className="flex items-center w-1/3 bg-gray-50 dark:bg-zinc-800 rounded-lg px-3 py-2">
            <i className="ri-search-line text-gray-500 dark:text-gray-400 mr-2"></i>
            <input
              placeholder="Search"
              className="bg-transparent outline-none text-sm text-gray-700 dark:text-gray-300 w-full"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Settings */}
            <div
              onClick={() => navigate("/dashboard/settings")}
              className="w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer
             text-gray-600 dark:text-gray-400
             hover:bg-gray-100 dark:hover:bg-zinc-800
             hover:text-indigo-600 transition"
            >
              <Settings size={18} />
            </div>

            {/* Notifications */}
            <div className="relative" ref={notifyRef}>
              <button
                onClick={() => setNotifyOpen(!notifyOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-indigo-600 relative"
              >
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {notifyOpen && (
                <div className="absolute right-0 mt-3 w-[380px] bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 overflow-hidden z-30">
                  <div className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-100 dark:border-zinc-700">
                    Notifications
                  </div>

                  <div className="max-h-80 overflow-y-auto notify-scroll">
                    {notificationsData.slice(0, 10).map((n) => {
                      const Icon = n.icon;
                      return (
                        <div
                          key={n.id}
                          className="flex gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-zinc-700 transition"
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                              iconStyles[n.priority]
                            }`}
                          >
                            <Icon size={18} />
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                              {n.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {n.time}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="px-4 py-2 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer border-t border-gray-100 dark:border-zinc-700">
                    View all notifications
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative " ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-medium"
              >
                {user?.email?.[0]?.toUpperCase() || "U"}
              </button>

              {menuOpen && (
                <div className= "text-gray-900 dark:text-gray-100 absolute right-0 mt-3 w-44 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-gray-100 dark:border-zinc-700 py-2 z-30">
                  <button onClick={() => navigate("/dashboard/profile")} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-zinc-700 w-full">
                    <Edit size={16} />
                    View Profile
                  </button>

                  <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                  <button
                    onClick={onSignout}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
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
    </>
  );
};

export default Header;
