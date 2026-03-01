/**
 * Funding Page
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
import { Eye, CheckCircle } from 'lucide-react';

const metrics = [
  { label: 'Total Budget', value: '₹10,00,000' },
  { label: 'Utilized', value: '₹6,80,000' },
  { label: 'Remaining', value: '₹3,20,000' },
  { label: 'Pending Requests', value: 7 },
];

const utilizationData = [
  { name: 'Utilized', value: 680000 },
  { name: 'Remaining', value: 320000 },
];

const categoryFunding = [
  { category: 'Technology', amount: 280000 },
  { category: 'Cultural', amount: 200000 },
  { category: 'Sports', amount: 150000 },
  { category: 'Social', amount: 50000 },
];

const clubFunding = [
  {
    club: 'Tech Club',
    requested: '₹1,20,000',
    approved: '₹1,00,000',
    status: 'Approved',
  },
  {
    club: 'Cultural Club',
    requested: '₹90,000',
    approved: '—',
    status: 'Pending',
  },
  {
    club: 'Sports Club',
    requested: '₹60,000',
    approved: '₹50,000',
    status: 'Approved',
  },
];

const COLORS = ['#6366F1', '#E5E7EB'];

const statusStyles = {
  Approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
};

const Funding = () => {
  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
        Funding & Budget
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

      {/* Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Utilization */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Budget Utilization
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={utilizationData}
                dataKey="value"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
              >
                {utilizationData.map((_, index) => (
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
              Utilized
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
              Remaining
            </span>
          </div>
        </div>

        {/* Category Allocation */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 lg:col-span-2 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Funding by Category
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryFunding}>
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
                dataKey="amount"
                radius={[6, 6, 0, 0]}
                fill="#6366F1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funding Requests Table */}
      <div className="rounded-2xl p-4 shadow-sm bg-gradient-to-b from-indigo-50/60 to-indigo-50/20 dark:from-indigo-950/20 dark:to-indigo-950/10 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Club Funding Requests
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2 text-left font-medium">Club</th>
                <th className="px-4 py-2 text-left font-medium">Requested</th>
                <th className="px-4 py-2 text-left font-medium">Approved</th>
                <th className="px-4 py-2 text-left font-medium">Status</th>
                <th className="px-4 py-2 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {clubFunding.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-theme"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 rounded-l-xl">
                    {item.club}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.requested}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.approved}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-3 rounded-r-xl">
                    {item.status === 'Pending' && (
                      <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors">
                        <CheckCircle size={16} />
                      </button>
                    )}
                    <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                      <Eye size={16} />
                    </button>
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
          Funding Insights
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Technology clubs consume the highest budget share</li>
          <li>• 2 pending requests exceed recommended limits</li>
          <li>• Budget utilization crossed 65 percent</li>
          <li>• Recommend reviewing pending approvals this week</li>
        </ul>
      </div>
    </div>
  );
};

export default Funding;
