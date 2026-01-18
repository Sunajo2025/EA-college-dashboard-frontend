import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CalendarClock,
  AlertTriangle,
  ShieldAlert,
  Users,
  Wallet,
  Activity,
  Info,
  X
} from 'lucide-react';

const initialNotifications = [
  {
    id: 1,
    title: 'New Club Registration',
    message:
      'Tech Club has submitted a new registration request and is awaiting admin approval.',
    priority: 'High',
    time: '2 mins ago',
    icon: ShieldAlert,
  },
  {
    id: 2,
    title: 'Budget Threshold Exceeded',
    message:
      'Cultural Club funding utilization has crossed the approved limit.',
    priority: 'High',
    time: '10 mins ago',
    icon: Wallet,
  },
  {
    id: 3,
    title: 'Event Schedule Conflict',
    message:
      'Two clubs have overlapping events scheduled this Friday.',
    priority: 'Medium',
    time: '30 mins ago',
    icon: CalendarClock,
  },
  {
    id: 4,
    title: 'Pending Approvals',
    message:
      'Three club activity requests are awaiting approval.',
    priority: 'Medium',
    time: '1 hour ago',
    icon: Activity,
  },
  {
    id: 5,
    title: 'Inactive Club Alert',
    message:
      'Photography Club has been inactive for more than 60 days.',
    priority: 'Medium',
    time: '3 hours ago',
    icon: AlertTriangle,
  },
  {
    id: 6,
    title: 'New Members Joined',
    message:
      'Five students joined the Sports Club.',
    priority: 'Low',
    time: 'Today',
    icon: Users,
  },
  {
    id: 7,
    title: 'Meeting Reminder',
    message:
      'Faculty coordination meeting scheduled for tomorrow.',
    priority: 'Low',
    time: 'Today',
    icon: Bell,
  },
  {
    id: 8,
    title: 'Event Report Submitted',
    message:
      'Annual Tech Fest report has been submitted.',
    priority: 'Low',
    time: 'Yesterday',
    icon: Info,
  },
  {
    id: 9,
    title: 'Volunteer Request',
    message:
      'NSS Club requested volunteers for campus drive.',
    priority: 'Low',
    time: 'Yesterday',
    icon: Users,
  },
  {
    id: 10,
    title: 'System Update',
    message:
      'New dashboard features have been deployed successfully.',
    priority: 'Low',
    time: '2 days ago',
    icon: Info,
  },
];

const priorityText = {
  High: 'text-red-600 dark:text-red-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  Low: 'text-indigo-600 dark:text-indigo-400',
};

const iconStyles = {
  High: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
  Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
  Low: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
};

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [openId, setOpenId] = useState(null);

  const handleDiscard = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDiscardAll = () => {
    setNotifications([]);
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
          Notifications
        </h1>

        {notifications.length > 0 && (
          <button
            onClick={handleDiscardAll}
            className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
          >
            Discard All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {notifications.map((item) => {
            const Icon = item.icon;
            const isHigh = item.priority === 'High';

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 140 }}   // left ➜ right dismiss
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className={`
                  relative overflow-hidden rounded-xl shadow-sm transition-theme
                  ${
                    isHigh
                      ? 'bg-white dark:bg-zinc-800'
                      : 'bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700'
                  }
                `}
              >
                {/* High Priority Blinking Red Background */}
                {isHigh && (
                  <div className="absolute inset-0 bg-red-50 dark:bg-red-950/30 animate-pulse pointer-events-none" />
                )}

                <div className="relative">
                  {/* Header */}
                  <div
                    onClick={() =>
                      setOpenId(openId === item.id ? null : item.id)
                    }
                    className="flex items-start justify-between p-4 cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconStyles[item.priority]}`}
                      >
                        <Icon size={18} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {item.title}
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
                          handleDiscard(item.id);
                        }}
                        className="cursor-pointer text-gray-400 hover:text-red-500 transition"
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
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
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
          <div className="text-center py-16 text-sm text-gray-500 dark:text-gray-400">
            No notifications available
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
