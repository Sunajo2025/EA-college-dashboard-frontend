/**
 * AI Chatbots Page
 * AI Platform Dashboard
 */

import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const chatbotStats = [
  { label: 'Total Chatbots', value: 14 },
  { label: 'Active Chatbots', value: 11 },
  { label: 'Monthly Requests', value: '12.4K' },
  { label: 'Avg Response Time', value: '1.6s' },
];

const initialChatbots = [
  {
    id: 1,
    name: 'Support Assistant',
    description: 'Handles customer support and FAQs',
    status: true,
    health: 'Healthy',
    documents: 42,
    requests: 4200,
    resolutionRate: '92%',
    lastTrained: '2 days ago',
    lastActive: '5 mins ago',
  },
  {
    id: 2,
    name: 'Invoice Help Bot',
    description: 'Answers invoice and billing queries',
    status: true,
    health: 'Needs Training',
    documents: 18,
    requests: 3100,
    resolutionRate: '86%',
    lastTrained: '5 days ago',
    lastActive: '18 mins ago',
  },
  {
    id: 3,
    name: 'HR Policy Bot',
    description: 'Internal HR and policy assistant',
    status: false,
    health: 'Inactive',
    documents: 27,
    requests: 1600,
    resolutionRate: '—',
    lastTrained: '12 days ago',
    lastActive: '—',
  },
];

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-9 h-5 rounded-full transition ${
      enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-600'
    }`}
  >
    <span
      className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition ${
        enabled ? 'translate-x-4' : ''
      }`}
    />
  </button>
);

const AIChatbots = () => {
  const navigate = useNavigate();
  const [chatbots, setChatbots] = useState(initialChatbots);

  const toggleStatus = (id) => {
    setChatbots((prev) =>
      prev.map((bot) =>
        bot.id === id ? { ...bot, status: !bot.status } : bot
      )
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          AI Chatbots
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configure behavior, knowledge, and monitor real time performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {chatbotStats.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-indigo-50 dark:border-zinc-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.label}
            </p>
            <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chatbots Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Chatbots
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Chatbot</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Health</th>
                <th className="px-6 py-3 text-left">Documents</th>
                <th className="px-6 py-3 text-left">Requests</th>
                <th className="px-6 py-3 text-left">Resolution</th>
                <th className="px-6 py-3 text-left">Last Active</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
              {chatbots.map((bot) => (
                <tr key={bot.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {bot.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {bot.description}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bot.status
                          ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                          : 'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400'
                      }`}
                    >
                      {bot.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4">{bot.health}</td>
                  <td className="px-6 py-4">{bot.documents}</td>
                  <td className="px-6 py-4">{bot.requests.toLocaleString()}</td>
                  <td className="px-6 py-4">{bot.resolutionRate}</td>
                  <td className="px-6 py-4">{bot.lastActive}</td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-4">
                      <Toggle
                        enabled={bot.status}
                        onToggle={() => toggleStatus(bot.id)}
                      />

                      <button
                        onClick={() => navigate(`${bot.id}/configure`)}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 transition"
                      >
                        Configure
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AIChatbots;
