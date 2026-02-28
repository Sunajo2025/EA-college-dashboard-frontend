import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Clock, User, Calendar } from 'lucide-react';

const MeetingActions = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

  const actions = [
    {
      id: 1,
      task: "Complete payment gateway API integration",
      owner: "Alex Rodriguez",
      deadline: "Feb 15, 2026",
      status: "In Progress",
      meeting: "Q1 Product Strategy",
      meetingId: 1,
      priority: "high"
    },
    {
      id: 2,
      task: "Finalize design system documentation",
      owner: "David Kim",
      deadline: "Feb 10, 2026",
      status: "Pending",
      meeting: "Design System Review",
      meetingId: 2,
      priority: "medium"
    },
    {
      id: 3,
      task: "Create marketing content calendar",
      owner: "Emma Davis",
      deadline: "Feb 20, 2026",
      status: "Pending",
      meeting: "Q1 Product Strategy",
      meetingId: 1,
      priority: "medium"
    },
    {
      id: 4,
      task: "Schedule customer interviews for mobile app",
      owner: "Lisa Park",
      deadline: "Feb 5, 2026",
      status: "Completed",
      meeting: "Client Onboarding Sync",
      meetingId: 3,
      priority: "low"
    },
  ];

  const filteredActions = actions.filter(action => {
    if (filter === 'pending') return action.status !== 'Completed';
    if (filter === 'completed') return action.status === 'Completed';
    return true;
  });

  const stats = [
    { label: 'Total Actions', value: actions.length },
    { label: 'Pending', value: actions.filter(a => a.status !== 'Completed').length },
    { label: 'In Progress', value: actions.filter(a => a.status === 'In Progress').length },
    { label: 'Completed', value: actions.filter(a => a.status === 'Completed').length },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/meetings')}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Action Items
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track all follow-ups and tasks from your meetings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All Actions' },
          { id: 'pending', label: 'Pending' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Actions List */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Task</th>
              <th className="px-6 py-3 text-left font-medium">Owner</th>
              <th className="px-6 py-3 text-left font-medium">Deadline</th>
              <th className="px-6 py-3 text-left font-medium">Meeting</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
            {filteredActions.map((action) => (
              <tr
                key={action.id}
                className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
              >
                {/* Task */}
                <td className="px-6 py-4">
                  <div className="flex items-start gap-2">
                    {action.priority === 'high' && (
                      <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
                    )}
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {action.task}
                    </span>
                  </div>
                </td>

                {/* Owner */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4" />
                    <span>{action.owner}</span>
                  </div>
                </td>

                {/* Deadline */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>{action.deadline}</span>
                  </div>
                </td>

                {/* Meeting */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/dashboard/meetings/${action.meetingId}`)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                  >
                    {action.meeting}
                  </button>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      action.status === 'Completed'
                        ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                        : action.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
                    }`}
                  >
                    {action.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <button className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-600/20 transition">
                    Update Status
                  </button>
                </td>
              </tr>
            ))}

            {filteredActions.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No actions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingActions;