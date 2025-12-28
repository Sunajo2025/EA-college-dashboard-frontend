/**
 * Reports & Analytics Page
 * College Administrator
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const metrics = [
  { label: 'Total Events', value: 42 },
  { label: 'Active Clubs', value: 21 },
  { label: 'Avg Events / Club', value: 3.4 },
  { label: 'Budget Utilization', value: '68%' },
];

const monthlyActivity = [
  { month: 'Jan', events: 5 },
  { month: 'Feb', events: 7 },
  { month: 'Mar', events: 9 },
  { month: 'Apr', events: 8 },
  { month: 'May', events: 13 },
];

const departmentPerformance = [
  { department: 'CSE', events: 14 },
  { department: 'ECE', events: 8 },
  { department: 'EEE', events: 7 },
  { department: 'Mechanical', events: 6 },
  { department: 'Civil', events: 7 },
];

const categorySplit = [
  { name: 'Technology', value: 18 },
  { name: 'Cultural', value: 12 },
  { name: 'Sports', value: 8 },
  { name: 'Social', value: 4 },
];

const performanceTable = [
  {
    unit: 'Tech Club',
    events: 8,
    funding: '₹1,00,000',
    status: 'High',
  },
  {
    unit: 'Cultural Club',
    events: 6,
    funding: '₹80,000',
    status: 'Medium',
  },
  {
    unit: 'Sports Club',
    events: 4,
    funding: '₹60,000',
    status: 'Medium',
  },
  {
    unit: 'Eco Club',
    events: 1,
    funding: '₹30,000',
    status: 'Low',
  },
];

const COLORS = ['#6366F1', '#34D399', '#FBBF24', '#CBD5E1'];

const statusStyle = {
  High: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  Low: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const ReportsAnalytics = () => {
  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
        Reports & Analytics
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-xl font-medium text-indigo-600 dark:text-indigo-400 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Trend */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 lg:col-span-2 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Event Activity Trend
          </h2>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={monthlyActivity}>
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
              <Line
                type="monotone"
                dataKey="events"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Split */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Events by Category
          </h2>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={categorySplit}
                dataKey="value"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
              >
                {categorySplit.map((_, index) => (
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
        </div>
      </div>

      {/* Department Performance */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Department-wise Event Performance
        </h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={departmentPerformance}>
            <XAxis 
              dataKey="department" 
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

      {/* Performance Table */}
      <div className="rounded-2xl p-4 shadow-sm bg-gradient-to-b from-indigo-50/60 to-indigo-50/20 dark:from-indigo-950/20 dark:to-indigo-950/10 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Club Performance Summary
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2 text-left font-medium">Club</th>
                <th className="px-4 py-2 text-left font-medium">Events</th>
                <th className="px-4 py-2 text-left font-medium">Funding Used</th>
                <th className="px-4 py-2 text-left font-medium">Performance</th>
              </tr>
            </thead>

            <tbody>
              {performanceTable.map((row, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-theme"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 rounded-l-xl">
                    {row.unit}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {row.events}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {row.funding}
                  </td>
                  <td className="px-4 py-3 rounded-r-xl">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          Key Insights
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Event activity increased sharply in the last two months</li>
          <li>• Technology clubs show the highest ROI on funding</li>
          <li>• Eco and social clubs require engagement support</li>
          <li>• Budget utilization aligns well with activity growth</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
