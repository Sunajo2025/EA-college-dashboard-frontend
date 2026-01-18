/**
 * Analytics Page
 * AI Platform Dashboard
 */

const kpis = [
  { label: 'Total Requests', value: '128.4K' },
  { label: 'Active Chatbots', value: 11 },
  { label: 'Avg Response Time', value: '1.6s' },
  { label: 'Success Rate', value: '96%' },
];

const usageStats = [
  { label: 'Chatbot Queries', value: '64%', color: 'bg-indigo-500' },
  { label: 'Document Processing', value: '18%', color: 'bg-green-500' },
  { label: 'AI Extraction', value: '12%', color: 'bg-yellow-500' },
  { label: 'Workflows', value: '6%', color: 'bg-purple-500' },
];

const components = [
  {
    name: 'AI Chatbots',
    status: 'Healthy',
    metric: 'Response accuracy 94%',
  },
  {
    name: 'Knowledge Base',
    status: 'Healthy',
    metric: 'Coverage score 89%',
  },
  {
    name: 'Documents',
    status: 'Attention',
    metric: '2 failed uploads',
  },
  {
    name: 'AI Extraction',
    status: 'Healthy',
    metric: 'Precision 96%',
  },
  {
    name: 'Workflows',
    status: 'Healthy',
    metric: '18 runs today',
  },
];

const statusStyle = {
  Healthy: 'text-green-600 dark:text-green-400',
  Attention: 'text-yellow-600 dark:text-yellow-400',
};

const Analytics = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Analytics
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor usage, performance, and system health
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700"
          >
            <p className="text-sm text-gray-500">{kpi.label}</p>
            <p className="text-2xl font-semibold text-indigo-600 mt-1">
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Usage Distribution */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold mb-4">
          Platform Usage Distribution
        </h2>

        <div className="space-y-3">
          {usageStats.map((u) => (
            <div key={u.label}>
              <div className="flex justify-between text-sm mb-1">
                <span>{u.label}</span>
                <span>{u.value}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                <div
                  className={`h-full ${u.color}`}
                  style={{ width: u.value }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Component Health */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left w-1/3">
                Component
              </th>
              <th className="px-6 py-3 text-left w-1/6">
                Status
              </th>
              <th className="px-6 py-3 text-left w-1/2">
                Key Metric
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
            {components.map((c) => (
              <tr key={c.name}>
                <td className="px-6 py-4 font-medium">
                  {c.name}
                </td>
                <td className={`px-6 py-4 ${statusStyle[c.status]}`}>
                  {c.status}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {c.metric}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight Panel */}
      <div className="bg-indigo-600/10 dark:bg-indigo-500/10 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
          Key Insights
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Chatbot usage increased by 18% this week</li>
          <li>• AI Extraction accuracy improved after last retraining</li>
          <li>• Two document uploads failed due to format issues</li>
          <li>• Workflow automation saved an estimated 6 hours today</li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
