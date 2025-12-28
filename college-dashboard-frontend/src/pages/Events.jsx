/**
 * Event Hub Page
 * College Administrator
 */

import { CheckCircle, Eye, Clock } from 'lucide-react';
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
  { label: 'Total Events', value: 42 },
  { label: 'Pending Approval', value: 6 },
  { label: 'Upcoming Events', value: 14 },
  { label: 'Ongoing Events', value: 4 },
  { label: 'Completed Events', value: 18 },
];

const statusData = [
  { name: 'Pending', value: 6 },
  { name: 'Upcoming', value: 14 },
  { name: 'Ongoing', value: 4 },
  { name: 'Completed', value: 18 },
];

const monthlyEvents = [
  { month: 'Jan', events: 5 },
  { month: 'Feb', events: 8 },
  { month: 'Mar', events: 10 },
  { month: 'Apr', events: 7 },
  { month: 'May', events: 12 },
];

const pendingEvents = [
  {
    id: 1,
    name: 'Tech Symposium',
    club: 'Tech Club',
    date: '12 Jun 2025',
    submitted: '2 days ago',
  },
  {
    id: 2,
    name: 'Cultural Fest',
    club: 'Cultural Club',
    date: '18 Jun 2025',
    submitted: '4 days ago',
  },
];

const upcomingEvents = [
  {
    id: 1,
    name: 'Sports Meet',
    club: 'Sports Club',
    date: '20 Jun 2025',
    status: 'Upcoming',
  },
  {
    id: 2,
    name: 'AI Workshop',
    club: 'Tech Club',
    date: '22 Jun 2025',
    status: 'Ongoing',
  },
];

const COLORS = ['#FBBF24', '#6366F1', '#34D399', '#CBD5E1'];

const statusPill = {
  Upcoming: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
  Ongoing: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
};

const EventHub = () => {
  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
        Event Hub
      </h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme"
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
            <p className="text-xl font-medium text-indigo-600 dark:text-indigo-400 mt-1">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Donut */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Event Status
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
        </div>

        {/* Events Timeline */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 lg:col-span-2 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Events by Month
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyEvents}>
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
      </div>

      {/* Pending Approval Table */}
      <div className="rounded-2xl p-4 shadow-sm bg-gradient-to-b from-indigo-50/60 to-indigo-50/20 dark:from-indigo-950/20 dark:to-indigo-950/10 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Pending Approvals
        </h2>

        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-700 dark:text-gray-300">
              <th className="px-4 py-2 text-left font-medium">Event</th>
              <th className="px-4 py-2 text-left font-medium">Club</th>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Submitted</th>
              <th className="px-4 py-2 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingEvents.map((event) => (
              <tr
                key={event.id}
                className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-theme"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 rounded-l-xl">
                  {event.name}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {event.club}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {event.date}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                  {event.submitted}
                </td>
                <td className="px-4 py-3 flex justify-center gap-3 rounded-r-xl">
                  <button className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 transition-colors">
                    <CheckCircle size={16} />
                  </button>
                  <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upcoming and Ongoing */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Upcoming and Ongoing Events
        </h2>

        <table className="w-full text-sm border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-700 dark:text-gray-300">
              <th className="px-4 py-2 text-left font-medium">Event</th>
              <th className="px-4 py-2 text-left font-medium">Club</th>
              <th className="px-4 py-2 text-left font-medium">Date</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-center font-medium">View</th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.map((event) => (
              <tr
                key={event.id}
                className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-theme"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 rounded-l-xl">
                  {event.name}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {event.club}
                </td>
                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                  {event.date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${statusPill[event.status]}`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center rounded-r-xl">
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
  );
};

export default EventHub;
