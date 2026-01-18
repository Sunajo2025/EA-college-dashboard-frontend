/**
 * Notifications Page
 * AI Platform Dashboard
 */

import { useState } from 'react';
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
} from 'lucide-react';

/* ---------- DATA ---------- */

const initialNotifications = [
  {
    id: 1,
    title: 'Chatbot Health Degraded',
    message:
      'Support Assistant has repeated unanswered questions. Consider retraining the knowledge base.',
    priority: 'High',
    time: '5 mins ago',
    icon: Bot,
  },
  {
    id: 2,
    title: 'Knowledge Base Processing Failed',
    message:
      'Billing_Policy.pdf failed during chunking due to unsupported formatting.',
    priority: 'High',
    time: '15 mins ago',
    icon: FileWarning,
  },
  {
    id: 3,
    title: 'Workflow Execution Completed',
    message:
      'Invoice Processing workflow completed successfully with 12 extracted fields.',
    priority: 'Medium',
    time: '40 mins ago',
    icon: Workflow,
  },
  {
    id: 4,
    title: 'AI Extraction Running',
    message:
      'HR_Profile_Extraction is currently processing employee documents.',
    priority: 'Medium',
    time: '1 hour ago',
    icon: Activity,
  },
  {
    id: 5,
    title: 'Monthly Usage Threshold',
    message:
      'You have consumed 82% of your monthly AI request limit.',
    priority: 'Medium',
    time: 'Today',
    icon: CreditCard,
  },
  {
    id: 6,
    title: 'Knowledge Base Updated',
    message:
      'FAQs.pdf and Support_Guide.docx were re-indexed successfully.',
    priority: 'Low',
    time: 'Today',
    icon: Database,
  },
  {
    id: 7,
    title: 'New Chatbot Created',
    message:
      'Invoice Help Bot has been created and is ready for configuration.',
    priority: 'Low',
    time: 'Yesterday',
    icon: Bot,
  },
  {
    id: 8,
    title: 'System Update Deployed',
    message:
      'UI performance improvements and analytics enhancements are now live.',
    priority: 'Low',
    time: '2 days ago',
    icon: Info,
  },
];

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
  const [notifications, setNotifications] = useState(initialNotifications);
  const [openId, setOpenId] = useState(null);

  const discard = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const discardAll = () => setNotifications([]);

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
                className="relative overflow-hidden rounded-xl bg-white dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shadow-sm"
              >
                {/* High priority pulse */}
                {isHigh && (
                  <div className="absolute inset-0 bg-red-50 dark:bg-red-950/30 animate-pulse pointer-events-none" />
                )}

                <div className="relative">
                  {/* Header */}
                  <div
                    onClick={() =>
                      setOpenId(openId === item.id ? null : item.id)
                    }
                    className="flex justify-between items-start p-4 cursor-pointer"
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
