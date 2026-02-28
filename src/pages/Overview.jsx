import { useState, useEffect } from 'react';
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
} from "recharts";
import { MessageSquareText } from "lucide-react";
import { useAuth } from "../routes/AuthContext";


const API_BASE = 'http://127.0.0.1:5000';

import SkeletonLoader from '../components/SkeletonLoaders';

const COLORS = ["#6366F1", "#E5E7EB"];

const Overview = () => {
  const userId = sessionStorage.getItem("userId") || 'guest';
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [kpiData, setKpiData] = useState([
    { label: "Total Chatbots", value: 0 },
    { label: "Active Chatbots", value: 0 },
    { label: "Documents Processed", value: 0 },
    { label: "Total Extractions", value: 0 },
  ]);

  const [usageMonthly, setUsageMonthly] = useState([]);
  const [chatbotStatus, setChatbotStatus] = useState([
    { name: "Active", value: 0 },
    { name: "Inactive", value: 0 },
  ]);

  const [insights, setInsights] = useState([]);

  useEffect(() => {
    if (userId && userId !== 'guest') {
      fetchAllData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchChatbotStats(),
        fetchKnowledgeStats(),
        fetchExtractionStats(),
        fetchChatbots(),
        fetchRecentActivity(),
        generateInsights()
      ]);
    } catch (error) {
      console.error('Error fetching overview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatbotStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/stats/${userId}`);
      const data = await res.json();

      if (res.ok && data.stats) {
        setKpiData(prev => {
          const updated = [...prev];
          updated[0] = { label: "Total Chatbots", value: data.stats.totalChatbots };
          updated[1] = { label: "Active Chatbots", value: data.stats.activeChatbots };
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to fetch chatbot stats:', error);
    }
  };

  const fetchKnowledgeStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/stats/${userId}`);
      const data = await res.json();

      if (res.ok && data.stats) {
        setKpiData(prev => {
          const updated = [...prev];
          updated[2] = { label: "Documents Processed", value: data.stats.totalDocuments };
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to fetch knowledge stats:', error);
    }
  };

  const fetchExtractionStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/extraction/stats/${userId}`);
      const data = await res.json();

      if (res.ok && data.stats) {
        setKpiData(prev => {
          const updated = [...prev];
          updated[3] = { label: "Total Extractions", value: data.stats.fieldsExtracted };
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to fetch extraction stats:', error);
    }
  };

  const fetchChatbots = async () => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/${userId}`);
      const data = await res.json();

      if (res.ok && data.chatbots) {
        const active = data.chatbots.filter(bot => bot.status).length;
        const inactive = data.chatbots.length - active;

        setChatbotStatus([
          { name: "Active", value: active },
          { name: "Inactive", value: inactive }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch chatbots:', error);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/${userId}`);
      const data = await res.json();

      if (res.ok && data.chatbots) {
        // Generate monthly usage data from chatbot requests
        const now = new Date();
        const monthlyData = [];

        for (let i = 4; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = month.toLocaleString('default', { month: 'short' });

          // Simulate monthly distribution of requests
          const totalRequests = data.chatbots.reduce((sum, bot) => sum + bot.requests, 0);
          const monthlyRequests = Math.floor(totalRequests / 5) + Math.floor(Math.random() * 500);

          monthlyData.push({
            month: monthName,
            requests: monthlyRequests
          });
        }

        setUsageMonthly(monthlyData);
      }
    } catch (error) {
      console.error('Failed to fetch recent activity:', error);
    }
  };

  const generateInsights = async () => {
    try {
      const [chatbotsRes, docsRes, extractionsRes] = await Promise.all([
        fetch(`${API_BASE}/chatbots/${userId}`),
        fetch(`${API_BASE}/knowledge/documents/${userId}`),
        fetch(`${API_BASE}/extraction/jobs/${userId}`)
      ]);

      const chatbotsData = await chatbotsRes.json();
      const docsData = await docsRes.json();
      const extractionsData = await extractionsRes.json();

      const generatedInsights = [];

      // Chatbot insights
      if (chatbotsData.chatbots) {
        const inactiveBots = chatbotsData.chatbots.filter(bot => !bot.status).length;
        if (inactiveBots > 0) {
          generatedInsights.push(`• ${inactiveBots} chatbot${inactiveBots > 1 ? 's are' : ' is'} currently inactive`);
        }

        const lowResolutionBots = chatbotsData.chatbots.filter(bot => {
          const rate = parseInt(bot.resolutionRate);
          return !isNaN(rate) && rate < 80;
        }).length;

        if (lowResolutionBots > 0) {
          generatedInsights.push(`• ${lowResolutionBots} chatbot${lowResolutionBots > 1 ? 's have' : ' has'} resolution rate below 80%`);
        }

        const totalRequests = chatbotsData.chatbots.reduce((sum, bot) => sum + bot.requests, 0);
        if (totalRequests > 0) {
          generatedInsights.push(`• Total of ${totalRequests.toLocaleString()} AI requests processed`);
        }
      }

      // Knowledge base insights
      if (docsData.documents) {
        const totalDocs = docsData.documents.length;
        const totalChunks = docsData.documents.reduce((sum, doc) => sum + (doc.chunks || 0), 0);

        if (totalDocs > 0) {
          generatedInsights.push(`• ${totalDocs} document${totalDocs > 1 ? 's' : ''} in knowledge base with ${totalChunks} chunks`);
        }
      }

      // Extraction insights
      if (extractionsData.jobs) {
        const completedJobs = extractionsData.jobs.filter(job => job.status === 'Completed').length;
        const failedJobs = extractionsData.jobs.filter(job => job.status === 'Failed').length;

        if (completedJobs > 0) {
          generatedInsights.push(`• ${completedJobs} extraction job${completedJobs > 1 ? 's' : ''} completed successfully`);
        }

        if (failedJobs > 0) {
          generatedInsights.push(`• ${failedJobs} extraction job${failedJobs > 1 ? 's' : ''} require${failedJobs === 1 ? 's' : ''} attention`);
        }
      }

      // Default insights if none generated
      if (generatedInsights.length === 0) {
        generatedInsights.push('• No activity detected yet');
        generatedInsights.push('• Start by creating your first chatbot');
        generatedInsights.push('• Upload documents to build your knowledge base');
        generatedInsights.push('• Run extractions to process your documents');
      }

      setInsights(generatedInsights);
    } catch (error) {
      console.error('Failed to generate insights:', error);
      setInsights([
        '• Unable to load insights at this time',
        '• Please try refreshing the page'
      ]);
    }
  };

  return (
    <div className="p-5 space-y-6">
      {/* Modern Greeting Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-600 p-6 text-white shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome back{" "}
              <span className="animate-textShine font-semibold">
                {user?.name || "User"}
              </span>
            </h1>
            <p className="text-sm text-indigo-100 mt-1 max-w-md">
              Your AI systems are running smoothly. Monitor insights, usage, and performance in one place.
            </p>
          </div>

          <button
            className="flex items-center cursor-pointer gap-2 rounded-xl bg-white/15 backdrop-blur px-5 py-3 text-sm font-medium text-white border border-white/30 hover:bg-white/25 transition"
          >
            <MessageSquareText size={18} />
            Launch Smart Chat
          </button>
        </div>

        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl"></div>
      </div>

      {/* Header */}
      <div>
        <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100">
          Platform Overview
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Real time snapshot of AI usage, performance, and cost
        </p>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <SkeletonLoader key={i} type="card" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiData.map((item) => (
            <div
              key={item.label}
              className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-2xl font-medium text-indigo-600 dark:text-indigo-400 mt-1">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Section */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonLoader type="chart" />
          </div>
          <SkeletonLoader type="chart" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 lg:col-span-2 transition-theme">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              AI Requests by Month
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={usageMonthly}>
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg)",
                    border: "none",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="requests" radius={[6, 6, 0, 0]} fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              Chatbot Status
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chatbotStatus}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {chatbotStatus.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--tooltip-bg)",
                    border: "none",
                    borderRadius: "8px",
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
      )}

      {/* AI Insights Section */}
      {loading ? (
        <SkeletonLoader type="insight" />
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
            AI Insights
          </h2>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Overview;