/**
 * Club Registry Page
 * College Administrator
 */

import { Plus, UserCog, Eye } from 'lucide-react';
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

const stats = [
  { label: 'Total Clubs', value: 28 },
  { label: 'Active Clubs', value: 21 },
  { label: 'Pending Approval', value: 4 },
  { label: 'Inactive Clubs', value: 3 },
];

const clubs = [
  {
    id: 1,
    name: 'Cultural Club',
    category: 'Arts',
    admin: 'Ananya S',
    status: 'Active',
    lastActive: '2 days ago',
  },
  {
    id: 2,
    name: 'Tech Club',
    category: 'Technology',
    admin: 'Not Assigned',
    status: 'Pending',
    lastActive: '—',
  },
  {
    id: 3,
    name: 'Sports Club',
    category: 'Sports',
    admin: 'Rahul K',
    status: 'Inactive',
    lastActive: '45 days ago',
  },
];

const statusData = [
  { name: 'Active', value: 21 },
  { name: 'Pending', value: 4 },
  { name: 'Inactive', value: 3 },
];

const categoryData = [
  { category: 'Arts', count: 8 },
  { category: 'Technology', count: 10 },
  { category: 'Sports', count: 6 },
  { category: 'Others', count: 4 },
];

const COLORS = ['#6366F1', '#FBBF24', '#EF4444'];

const statusStyles = {
  Active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  Inactive: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const Clubs = () => {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
          Club Registry
        </h1>

        <button className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-600 transition">
          <Plus size={16} />
          Register Club
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item) => (
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

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Donut */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Club Status
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
              >
                {statusData.map((_, index) => (
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
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              Pending
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Inactive
            </span>
          </div>
        </div>

        {/* Category Bar */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 lg:col-span-2 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Clubs by Category
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
                dataKey="count"
                radius={[6, 6, 0, 0]}
                fill="#6366F1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modern Table */}
      <div
        className="rounded-2xl p-4 shadow-sm bg-gradient-to-b from-indigo-50/60 to-indigo-50/20 dark:from-indigo-950/20 dark:to-indigo-950/10 transition-theme"
      >
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Registered Clubs
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2 text-left font-medium">Club</th>
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-left font-medium">Admin</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-left font-medium">Last Activity</th>
                <th className="px-4 py-2 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {clubs.map((club) => (
                <tr
                  key={club.id}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-theme"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 rounded-l-xl">
                    {club.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {club.category}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        club.admin === 'Not Assigned'
                          ? 'text-red-600 dark:text-red-400 font-medium'
                          : 'text-gray-700 dark:text-gray-300'
                      }
                    >
                      {club.admin}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[club.status]}`}
                    >
                      {club.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                    {club.lastActive}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-3 rounded-r-xl">
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <UserCog size={16} />
                    </button>
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

export default Clubs;
