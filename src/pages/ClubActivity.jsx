/**
 * Club Activity Page
 * College Administrator
 */

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const metrics = [
  { label: 'Total Clubs', value: 28 },
  { label: 'Active Clubs', value: 21 },
  { label: 'Inactive Clubs', value: 7 },
  { label: 'Departments Affected', value: 4 },
];

const activityStatus = [
  { name: 'Active', value: 21 },
  { name: 'Inactive', value: 7 },
];

const departmentData = [
  { department: 'CSE', inactive: 2 },
  { department: 'ECE', inactive: 1 },
  { department: 'EEE', inactive: 2 },
  { department: 'Mechanical', inactive: 1 },
  { department: 'Civil', inactive: 1 },
];

const categoryData = [
  { category: 'Technology', inactive: 3 },
  { category: 'Arts', inactive: 2 },
  { category: 'Sports', inactive: 1 },
  { category: 'Social', inactive: 1 },
];

const inactiveClubs = [
  {
    name: 'Robotics Club',
    department: 'CSE',
    category: 'Technology',
    lastActive: '42 days ago',
    risk: 'High',
  },
  {
    name: 'Drama Club',
    department: 'Arts',
    category: 'Arts',
    lastActive: '30 days ago',
    risk: 'Medium',
  },
  {
    name: 'Eco Club',
    department: 'Civil',
    category: 'Social',
    lastActive: '27 days ago',
    risk: 'Medium',
  },
];

const COLORS = ['#6366F1', '#EF4444'];

const riskStyles = {
  High: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
};

const ClubActivity = () => {
  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
        Club Activity
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((item) => (
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

      {/* Visual Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active vs Inactive */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Activity Status
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={activityStatus}
                dataKey="value"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
              >
                {activityStatus.map((_, index) => (
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

          <div className="flex justify-center gap-4 text-sm mt-4 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
              Active
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Inactive
            </span>
          </div>
        </div>

        {/* Department-wise */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Inactive Clubs by Department
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentData}>
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
                dataKey="inactive"
                radius={[6, 6, 0, 0]}
                fill="#6366F1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category-wise */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Inactive Clubs by Category
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData}>
              <XAxis 
                dataKey="category" 
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
                dataKey="inactive"
                radius={[6, 6, 0, 0]}
                fill="#6366F1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inactive Clubs Table */}
      <div className="rounded-2xl p-4 shadow-sm bg-gradient-to-b from-indigo-50/60 to-indigo-50/20 dark:from-indigo-950/20 dark:to-indigo-950/10 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Inactive Clubs Requiring Attention
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2 text-left font-medium">Club</th>
                <th className="px-4 py-2 text-left font-medium">Department</th>
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-left font-medium">Last Active</th>
                <th className="px-4 py-2 text-left font-medium">Risk</th>
              </tr>
            </thead>

            <tbody>
              {inactiveClubs.map((club, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-theme"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 rounded-l-xl">
                    {club.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {club.department}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {club.category}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {club.lastActive}
                  </td>
                  <td className="px-4 py-3 rounded-r-xl">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${riskStyles[club.risk]}`}
                    >
                      {club.risk}
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
          <li>• Technology clubs show the highest inactivity rate</li>
          <li>• CSE and EEE departments require immediate follow-up</li>
          <li>• 3 clubs inactive for more than 30 days</li>
          <li>• Early admin intervention recommended</li>
        </ul>
      </div>
    </div>
  );
};

export default ClubActivity;
