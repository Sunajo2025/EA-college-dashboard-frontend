import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { 
  FileText, 
  CalendarCheck, 
  Brain, 
  CheckCircle2, 
  Clock,
  Search,
  Sparkles,
  TrendingUp,
  Users
} from "lucide-react";

const meetingKpis = [
  { label: "Meetings Captured", value: 28, icon: CalendarCheck },
  { label: "Knowledge Items", value: 156, icon: Brain },
  { label: "Actions Created", value: 41, icon: CheckCircle2 },
  { label: "Pending Follow-ups", value: 9, icon: Clock },
];

const knowledgeGrowth = [
  { week: "W1", items: 45 },
  { week: "W2", items: 78 },
  { week: "W3", items: 112 },
  { week: "W4", items: 156 },
];

const recentMeetings = [
  { 
    id: 1, 
    title: "Q1 Product Strategy", 
    date: "Today, 2:30 PM", 
    actions: 5,
    decisions: 3,
    attendees: 6,
    status: "processed"
  },
  { 
    id: 2, 
    title: "Design System Review", 
    date: "Yesterday, 10:00 AM", 
    actions: 2,
    decisions: 4,
    attendees: 4,
    status: "processed"
  },
  { 
    id: 3, 
    title: "Client Onboarding Sync", 
    date: "Jan 20, 3:00 PM", 
    actions: 7,
    decisions: 2,
    attendees: 5,
    status: "processed"
  },
];

const aiInsights = [
  { 
    text: "Payment integration mentioned in 4 recent meetings - consider creating a dedicated initiative",
    type: "pattern"
  },
  { 
    text: "7 action items from last week still pending - review with team leads",
    type: "alert"
  },
  { 
    text: "Design decisions from 3 meetings align with new brand guidelines",
    type: "alignment"
  },
];

const MeetingsOverview = () => {
  const navigate = useNavigate();
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Meetings
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Turn every meeting into searchable knowledge with AI-powered summaries and actions
        </p>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white border border-indigo-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              
              <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">
                AI-Powered Knowledge Hub
              </span>
            </div>
            <h2 className="text-xl font-semibold">Your Meetings, Simplified</h2>
            <p className="text-sm text-indigo-100 mt-1 max-w-2xl">
              Automatically capture, summarize, and transform meetings into actionable knowledge with AI-generated insights and follow-ups.
            </p>
          </div>

          <button
            onClick={() => navigate('/dashboard/meetings/upload')}
            className="flex items-center gap-2 rounded-lg bg-white text-indigo-600 px-5 py-2.5 text-sm font-medium hover:bg-indigo-50 transition"
          >
            <FileText size={18} />
            Add Meeting
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {meetingKpis.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Knowledge Growth Chart */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-gray-100 dark:border-zinc-700 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Knowledge Growth
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Captured items over time
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={knowledgeGrowth}>
              <XAxis 
                dataKey="week" 
                stroke="#9CA3AF" 
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#9CA3AF" 
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="items" 
                stroke="#6366F1" 
                strokeWidth={2}
                dot={{ fill: '#6366F1', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-gray-100 dark:border-zinc-700">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/dashboard/meetings/search')}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">Search Knowledge</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-6">Ask questions in natural language</p>
            </button>
            <button 
              onClick={() => alert('Generate minutes of meeting')}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">Generate MOM</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-6">Create minutes from any meeting</p>
            </button>
            <button 
              onClick={() => navigate('/dashboard/meetings/actions')}
              className="w-full text-left px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-800 transition text-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">Review Actions</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 ml-6">See all pending follow-ups</p>
            </button>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-5 border border-gray-100 dark:border-zinc-700">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            AI-Powered Insights
          </h2>
        </div>
        <div className="space-y-2">
          {aiInsights.map((insight, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-700"
            >
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Meetings Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Recent Meetings
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Automatically processed and ready to explore
          </p>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Meeting</th>
              <th className="px-6 py-3 text-left font-medium">Attendees</th>
              <th className="px-6 py-3 text-left font-medium">Decisions</th>
              <th className="px-6 py-3 text-left font-medium">Actions</th>
              <th className="px-6 py-3 text-left font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">View</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
            {recentMeetings.map((meeting) => (
              <tr
                key={meeting.id}
                className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
              >
                {/* Meeting */}
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {meeting.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {meeting.date}
                  </p>
                </td>

                {/* Attendees */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                    <Users className="w-4 h-4" />
                    <span>{meeting.attendees}</span>
                  </div>
                </td>

                {/* Decisions */}
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {meeting.decisions}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {meeting.actions}
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                    Processed
                  </span>
                </td>

                {/* View */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => navigate(`/dashboard/meetings/${meeting.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-600/20 transition"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}

            {recentMeetings.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No meetings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeetingsOverview;