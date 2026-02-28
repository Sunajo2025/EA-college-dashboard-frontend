import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CalendarCheck, 
  Users, 
  Clock, 
  CheckCircle2,
  FileText,
  Download,
  Mail,
  Sparkles,
  MessageSquare
} from 'lucide-react';

const MeetingDetail = () => {
  const navigate = useNavigate();
  const { meetingId } = useParams();
  const [activeTab, setActiveTab] = useState('summary');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - would come from API
  const meeting = {
    id: meetingId,
    title: "Q1 Product Strategy",
    date: "Today, 2:30 PM",
    duration: "45 minutes",
    attendees: ["Sarah Chen", "Mike Johnson", "Alex Rodriguez", "Emma Davis", "David Kim", "Lisa Park"],
    summary: "Discussed Q1 product roadmap priorities, resource allocation, and go-to-market strategy. Key focus on payment integration timeline and design system completion.",
    keyPoints: [
      "Payment integration is top priority for Q1",
      "Design system needs to be completed by mid-February",
      "Marketing campaign will launch alongside new features",
      "Customer feedback indicates strong demand for mobile app"
    ],
    decisions: [
      {
        id: 1,
        decision: "Prioritize payment integration over other features",
        context: "Based on customer demand and revenue potential",
        owner: "Sarah Chen"
      },
      {
        id: 2,
        decision: "Allocate 2 additional engineers to design system",
        context: "To meet February deadline for component library",
        owner: "Mike Johnson"
      },
      {
        id: 3,
        decision: "Launch marketing campaign in March",
        context: "Aligned with feature release timeline",
        owner: "Emma Davis"
      }
    ],
    actions: [
      {
        id: 1,
        task: "Complete payment gateway API integration",
        owner: "Alex Rodriguez",
        deadline: "Feb 15, 2026",
        status: "In Progress"
      },
      {
        id: 2,
        task: "Finalize design system documentation",
        owner: "David Kim",
        deadline: "Feb 10, 2026",
        status: "Pending"
      },
      {
        id: 3,
        task: "Create marketing content calendar",
        owner: "Emma Davis",
        deadline: "Feb 20, 2026",
        status: "Pending"
      },
      {
        id: 4,
        task: "Schedule customer interviews for mobile app",
        owner: "Lisa Park",
        deadline: "Feb 5, 2026",
        status: "Completed"
      }
    ]
  };

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'decisions', label: 'Decisions', icon: CheckCircle2 },
    { id: 'actions', label: 'Action Items', icon: Clock },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <button
            onClick={() => navigate('/dashboard/meetings')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition mt-1"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {meeting.title}
              </h1>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                Processed
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1.5">
                <CalendarCheck className="w-4 h-4" />
                <span>{meeting.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{meeting.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>{meeting.attendees.length} attendees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" />
            Send MOM
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Ask Questions Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-800 rounded-2xl p-5 border border-indigo-100 dark:border-zinc-700">
        <div className="flex items-start gap-3">
          <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Ask questions about this meeting
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g., What was decided about the payment integration?"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
              />
              <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm font-medium">
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-zinc-700">
        <div className="flex gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 border border-gray-100 dark:border-zinc-700">
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Meeting Summary
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {meeting.summary}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Key Points
              </h3>
              <ul className="space-y-2">
                {meeting.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Attendees
              </h3>
              <div className="flex flex-wrap gap-2">
                {meeting.attendees.map((attendee, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-700 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {attendee}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="space-y-4">
            {meeting.decisions.map((decision) => (
              <div
                key={decision.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900"
              >
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {decision.decision}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {decision.context}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Owner:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {decision.owner}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="space-y-3">
            {meeting.actions.map((action) => (
              <div
                key={action.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-900 transition"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {action.task}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>Owner: {action.owner}</span>
                    <span>Due: {action.deadline}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    action.status === 'Completed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                      : action.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400'
                  }`}
                >
                  {action.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingDetail;