/**
 * Notifications Page
 * AI Platform Dashboard
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Database,
  FileWarning,
  Workflow,
  CreditCard,
  Activity,
  Info,
  X,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../routes/AuthContext';
import { API_BASE_URL } from '../constants/api';

/* ---------- UTILS ---------- */

const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString); // Backend should return UTC ISO string
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
};

/* ---------- STYLES ---------- */

const priorityText = {
  High: 'text-red-600 dark:text-red-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  Low: 'text-indigo-600 dark:text-indigo-400',
};

const iconStyles = {
  High:
    'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  Medium:
    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  Low:
    'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
};

/* ---------- COMPONENT ---------- */

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      // Attempt to get ID from user object (handling different potential structures)
      const userId = user.id || user.userId || user._id;

      if (!userId) {
        console.error("User ID not found in auth context");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/notifications/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        // Backend returns list of notifications
        // Map backend fields to frontend expected fields where necessary
        const mappedData = data.map(n => {
          let priority = 'Low';
          let icon = Info;

          switch (n.type) {
            case 'error':
              priority = 'High';
              icon = AlertCircle; // or FileWarning
              break;
            case 'warning':
              priority = 'Medium';
              icon = AlertTriangle;
              break;
            case 'success':
              priority = 'Low';
              icon = CheckCircle;
              break;
            case 'info':
            default:
              priority = 'Low';
              icon = Info;
          }

          return {
            id: n.notificationId, // Map notificationId to id
            title: n.title,
            message: n.message,
            priority: priority,
            time: formatTimeAgo(n.createdAt),
            icon: icon,
            read: n.read,
            rawDate: n.createdAt // Keep raw date if needed
          };
        });

        setNotifications(mappedData);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  const discard = async (id) => {
    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    if (!user) return;
    const userId = user.id || user.userId || user._id;

    try {
      await fetch(`${API_BASE_URL}/notifications/${userId}/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error("Error deleting notification:", err);
      // Could revert optimistic update here if critical
    }
  };

  const discardAll = async () => {
    // Optimistic update
    setNotifications([]);

    if (!user) return;
    const userId = user.id || user.userId || user._id;

    try {
      await fetch(`${API_BASE_URL}/notifications/${userId}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const handleExpand = async (id) => {
    const isOpening = openId !== id;
    setOpenId(isOpening ? id : null);

    if (isOpening) {
      // Mark as read if not already
      const notification = notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        // Update local state
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

        // Call API
        if (!user) return;
        const userId = user.id || user.userId || user._id;

        try {
          await fetch(`${API_BASE_URL}/notifications/${userId}/${id}/read`, {
            method: 'PUT'
          });
        } catch (err) {
          console.error("Error marking as read:", err);
        }
      }
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="p-5 flex justify-center text-gray-400">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
          Notifications
        </h1>

        {notifications.length > 0 && (
          <button
            onClick={discardAll}
            className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
          >
            Discard All
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((item) => {
            const Icon = item.icon;
            const isHigh = item.priority === 'High';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 120 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border ${!item.read ? 'border-indigo-200 dark:border-indigo-900 shadow-md' : 'border-gray-100 dark:border-zinc-700 shadow-sm'}`}
              >
                {/* High priority pulse or Unread indicator */}
                {isHigh && !item.read && (
                  <div className="absolute inset-0 bg-red-50 dark:bg-red-950/30 animate-pulse pointer-events-none" />
                )}
                {!item.read && !isHigh && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                )}

                <div className="relative">
                  {/* Header */}
                  <div
                    onClick={() => handleExpand(item.id)}
                    className="flex justify-between items-start p-4 cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconStyles[item.priority]}`}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <h3 className={`text-sm ${!item.read ? 'font-bold' : 'font-semibold'} text-gray-900 dark:text-gray-100`}>
                          {item.title}
                          {!item.read && <span className="ml-2 inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.time}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold ${priorityText[item.priority]}`}
                      >
                        {item.priority}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          discard(item.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Accordion */}
                  <AnimatePresence>
                    {openId === item.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 text-sm text-gray-700 dark:text-gray-300">
                          {item.message}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-500 dark:text-gray-400">
            No notifications available
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
