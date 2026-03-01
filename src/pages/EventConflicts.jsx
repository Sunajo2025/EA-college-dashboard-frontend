/**
 * Schedule Conflicts Page
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
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

const metrics = [
  { label: 'Scheduled Events', value: 42 },
  { label: 'Total Conflicts', value: 6 },
  { label: 'Venue Conflicts', value: 4 },
  { label: 'Time Overlaps', value: 2 },
];

const conflictTypeData = [
  { name: 'Venue Clash', value: 4 },
  { name: 'Time Overlap', value: 2 },
];

const peakSlots = [
  { slot: '10–12', conflicts: 3 },
  { slot: '12–2', conflicts: 1 },
  { slot: '2–4', conflicts: 2 },
];

const conflicts = [
  {
    eventA: 'Tech Symposium',
    eventB: 'AI Workshop',
    venue: 'Main Auditorium',
    time: '10:00 – 12:00',
    type: 'Venue Clash',
    suggestion: 'Move AI Workshop to Seminar Hall',
  },
  {
    eventA: 'Cultural Fest',
    eventB: 'Drama Rehearsal',
    venue: 'Open Stage',
    time: '2:00 – 4:00',
    type: 'Time Overlap',
    suggestion: 'Shift rehearsal to 4:30 PM',
  },
];

const COLORS = ['#EF4444', '#FBBF24'];

const typeStyle = {
  'Venue Clash': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  'Time Overlap': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
};

const ScheduleConflicts = () => {
  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
        Schedule Conflicts
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
        {/* Conflict Type */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Conflict Type Distribution
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={conflictTypeData}
                dataKey="value"
                innerRadius={65}
                outerRadius={90}
                paddingAngle={4}
              >
                {conflictTypeData.map((_, index) => (
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

        {/* Peak Slots */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 lg:col-span-2 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
            Peak Conflict Time Slots
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={peakSlots}>
              <XAxis 
                dataKey="slot" 
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
                dataKey="conflicts"
                radius={[6, 6, 0, 0]}
                fill="#6366F1"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Conflict Table */}
      <div className="rounded-2xl p-4 shadow-sm bg-gradient-to-b from-indigo-50/60 to-indigo-50/20 dark:from-indigo-950/20 dark:to-indigo-950/10 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Detected Conflicts
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-gray-700 dark:text-gray-300">
                <th className="px-4 py-2 text-left font-medium">Event A</th>
                <th className="px-4 py-2 text-left font-medium">Event B</th>
                <th className="px-4 py-2 text-left font-medium">Venue</th>
                <th className="px-4 py-2 text-left font-medium">Time</th>
                <th className="px-4 py-2 text-left font-medium">Type</th>
                <th className="px-4 py-2 text-left font-medium">Smart Suggestion</th>
              </tr>
            </thead>

            <tbody>
              {conflicts.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:bg-indigo-50/40 dark:hover:bg-indigo-900/20 transition-theme"
                >
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100 rounded-l-xl">
                    {item.eventA}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {item.eventB}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <MapPin size={14} />
                    {item.venue}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Clock size={14} />
                    {item.time}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${typeStyle[item.type]}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 rounded-r-xl text-indigo-700 dark:text-indigo-400 font-medium">
                    {item.suggestion}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Management Notes */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
          Management Checklist
        </h2>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Maintain accurate venue availability</li>
          <li>• Define buffer time between events</li>
          <li>• Assign priority to flagship events</li>
          <li>• Keep academic calendar updated</li>
          <li>• Review auto suggestions before approval</li>
        </ul>
      </div>
    </div>
  );
};

export default ScheduleConflicts;
