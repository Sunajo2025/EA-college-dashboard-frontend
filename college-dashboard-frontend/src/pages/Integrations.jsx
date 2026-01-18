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

const initialIntegrations = [
  {
    id: 1,
    name: 'Webhook',
    description: 'Send data to external systems',
    category: 'Automation',
    connected: true,
    status: 'Healthy',
  },
  {
    id: 2,
    name: 'Slack',
    description: 'Send notifications to Slack channels',
    category: 'Communication',
    connected: false,
    status: 'Not Connected',
  },
  {
    id: 3,
    name: 'Google Sheets',
    description: 'Store extracted data in spreadsheets',
    category: 'Storage',
    connected: true,
    status: 'Healthy',
  },
  {
    id: 4,
    name: 'Zapier',
    description: 'Trigger workflows in other apps',
    category: 'Automation',
    connected: false,
    status: 'Not Connected',
  },
];

const statusStyle = {
  Healthy: 'text-green-600 dark:text-green-400',
  'Not Connected': 'text-gray-500',
  Error: 'text-red-600 dark:text-red-400',
};

/* ---------- COMPONENT ---------- */

const Integrations = () => {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  const toggleIntegration = (id) => {
    setIntegrations((prev) =>
      prev.map((intg) =>
        intg.id === id
          ? {
              ...intg,
              connected: !intg.connected,
              status: !intg.connected ? 'Healthy' : 'Not Connected',
            }
          : intg
      )
    );
  };

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
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-semibold text-indigo-600 mt-1">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {integrations.map((intg) => (
          <div
            key={intg.id}
            className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  {intg.name}
                </h2>
                <span
                  className={`text-xs font-medium ${statusStyle[intg.status]}`}
                >
                  {intg.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {intg.description}
              </p>

              <span className="inline-block mt-3 px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-700 text-xs">
                {intg.category}
              </span>
            </div>

            <div className="flex justify-between items-center mt-6">
              <button
                onClick={() => setSelectedIntegration(intg)}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-700 text-xs font-medium"
              >
                Configure
              </button>

              <button
                onClick={() => toggleIntegration(intg.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  intg.connected
                    ? 'bg-green-600/10 text-green-600'
                    : 'bg-indigo-600/10 text-indigo-600'
                }`}
              >
                {intg.connected ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Configure Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              Configure {selectedIntegration.name}
            </h2>

            <p className="text-sm text-gray-500">
              Provide required configuration details for this integration.
            </p>

            <input
              placeholder="API Key / Webhook URL"
              className="w-full px-4 py-3 rounded-xl border bg-transparent"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setSelectedIntegration(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium"
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
