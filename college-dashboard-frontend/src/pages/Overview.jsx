/**
 * Overview Page
 * AI Platform Admin Dashboard
 */

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const kpiData = [
  { label: 'Total Chatbots', value: 14 },
  { label: 'Active Chatbots', value: 11 },
  { label: 'Documents Processed', value: 386 },
  { label: 'Monthly AI Cost', value: '₹62.4K' },
];

const usageMonthly = [
  { month: 'Jan', requests: 1200 },
  { month: 'Feb', requests: 1850 },
  { month: 'Mar', requests: 2420 },
  { month: 'Apr', requests: 1980 },
  { month: 'May', requests: 2650 },
];

const chatbotStatus = [
  { name: 'Active', value: 11 },
  { name: 'Inactive', value: 3 },
];

const COLORS = ['#6366F1', '#E5E7EB'];

const Overview = () => {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
          Platform Overview
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Real time snapshot of AI usage, performance, and cost
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.label}
            </p>
            <p className="text-2xl font-medium text-indigo-600 dark:text-indigo-400 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Requests Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 lg:col-span-2 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            AI Requests by Month
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={usageMonthly}>
              <XAxis
                dataKey="month"
                stroke="#9CA3AF"
                className="dark:stroke-gray-500"
              />
              <YAxis
                stroke="#9CA3AF"
                className="dark:stroke-gray-500"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
              <Bar
                dataKey="requests"
                radius={[6, 6, 0, 0]}
                fill="#6366F1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chatbot Status */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Chatbot Status
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chatbotStatus}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {chatbotStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--tooltip-bg)',
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
              Active
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              Inactive
            </span>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          AI Insights
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 4 chatbots show repeated unanswered questions</li>
          <li>• Knowledge base coverage below 80 percent for Support Bot</li>
          <li>• Invoice documents have highest extraction accuracy</li>
          <li>• Monthly token usage increased by 18 percent</li>
        </ul>
      </div>
    </div>
  );
};

export default Overview;
