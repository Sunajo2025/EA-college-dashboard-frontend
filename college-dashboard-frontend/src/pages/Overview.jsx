/**
 * Overview Page
 * College Administrator Dashboard
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
  { label: 'Total Clubs', value: 28 },
  { label: 'Active Clubs', value: 21 },
  { label: 'Upcoming Events', value: 12 },
  { label: 'Funding Used', value: '₹4.6L' },
];

const eventsMonthly = [
  { month: 'Jan', events: 4 },
  { month: 'Feb', events: 6 },
  { month: 'Mar', events: 9 },
  { month: 'Apr', events: 7 },
  { month: 'May', events: 10 },
];

const clubStatus = [
  { name: 'Active', value: 21 },
  { name: 'Inactive', value: 7 },
];

const COLORS = ['#6366F1', '#E5E7EB'];

const Overview = () => {
  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
        College Overview
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-2xl font-medium text-indigo-600 dark:text-indigo-400 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 lg:col-span-2 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Events by Month
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={eventsMonthly}>
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
                dataKey="events"
                radius={[6, 6, 0, 0]}
                fill="#6366F1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Club Status */}
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Club Activity
          </h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={clubStatus}
                dataKey="value"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
              >
                {clubStatus.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
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

      {/* Insights Section */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          Key Insights
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• 3 clubs inactive for more than 60 days</li>
          <li>• 2 upcoming events have schedule conflicts</li>
          <li>• Cultural Club has the highest activity this month</li>
          <li>• Funding utilization crossed 70 percent</li>
        </ul>
      </div>
    </div>
  );
};

export default Overview;
