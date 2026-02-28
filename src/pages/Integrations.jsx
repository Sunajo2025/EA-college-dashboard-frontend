/**
 * Integrations Page
 * AI Platform Dashboard
 */

import { useState } from 'react';

/* ---------- DATA ---------- */

const stats = [
  { label: 'Available Integrations', value: 12 },
  { label: 'Connected', value: 5 },
  { label: 'Inactive', value: 4 },
  { label: 'Errors', value: 1 },
];

const categories = ['All', 'Automation', 'Communication', 'Storage'];

const initialIntegrations = [
  {
    id: 1,
    name: 'Webhook',
    description: 'Send data to external systems',
    category: 'Automation',
    connected: true,
    status: 'Healthy',
    lastSync: '5 mins ago',
    permissions: 'Full Access',
  },
  {
    id: 2,
    name: 'Slack',
    description: 'Send notifications to Slack channels',
    category: 'Communication',
    connected: false,
    status: 'Not Connected',
    lastSync: '—',
    permissions: 'Messages',
  },
  {
    id: 3,
    name: 'Google Sheets',
    description: 'Store extracted data in spreadsheets',
    category: 'Storage',
    connected: true,
    status: 'Healthy',
    lastSync: 'Today',
    permissions: 'Write Access',
  },
  {
    id: 4,
    name: 'Zapier',
    description: 'Trigger workflows in other apps',
    category: 'Automation',
    connected: false,
    status: 'Not Connected',
    lastSync: '—',
    permissions: 'Triggers',
  },
];

const statusStyle = {
  Healthy: 'text-green-600 dark:text-green-400',
  'Not Connected': 'text-gray-500 dark:text-gray-400',
  Error: 'text-red-600 dark:text-red-400',
};

/* ---------- COMPONENT ---------- */

const Integrations = () => {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleIntegration = (id) => {
    setIntegrations((prev) =>
      prev.map((intg) =>
        intg.id === id
          ? {
              ...intg,
              connected: !intg.connected,
              status: !intg.connected ? 'Healthy' : 'Not Connected',
              lastSync: !intg.connected ? 'Just now' : '—',
            }
          : intg
      )
    );
  };

  const filteredIntegrations =
    activeCategory === 'All'
      ? integrations
      : integrations.filter((i) => i.category === activeCategory);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Integrations
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Connect your AI platform with external services
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {s.label}
            </p>
            <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-3 text-sm">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`px-4 py-2 rounded-xl transition ${
              activeCategory === c
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredIntegrations.map((intg) => (
          <div
            key={intg.id}
            className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-5 flex flex-col justify-between hover:shadow-sm transition"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {intg.name}
                </h2>
                <span
                  className={`text-xs font-medium ${statusStyle[intg.status]}`}
                >
                  {intg.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {intg.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-700 text-xs text-gray-700 dark:text-gray-300">
                  {intg.category}
                </span>
                <span className="px-2 py-1 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs">
                  {intg.permissions}
                </span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Last Sync: {intg.lastSync}
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setSelectedIntegration(intg)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
              >
                Configure
              </button>

              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-600/20 transition">
                  Test
                </button>

                <button
                  onClick={() => toggleIntegration(intg.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    intg.connected
                      ? 'bg-green-600/10 text-green-600 dark:text-green-400'
                      : 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {intg.connected ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Configure Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Configure {selectedIntegration.name}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Provide required configuration details for this integration.
            </p>

            <input
              placeholder="API Key / Webhook URL"
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedIntegration(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
