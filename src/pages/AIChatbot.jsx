import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Plus, Settings, Trash2, Power, X } from 'lucide-react';
import { ToastContainer } from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoaders';
import DeleteChatbotModal from '../components/Modal/DeleteChatbotModal';

const API_BASE = 'http://127.0.0.1:5000';

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none ${enabled
      ? 'bg-indigo-600'
      : 'bg-gray-300 dark:bg-zinc-600'
      }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : ''
        }`}
    />
  </button>
);

const healthStyles = {
  Healthy: 'text-green-600 dark:text-green-400',
  'Needs Training': 'text-yellow-600 dark:text-yellow-400',
  'Needs Attention': 'text-orange-600 dark:text-orange-400',
  Inactive: 'text-gray-500 dark:text-gray-400',
};

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';

const AIChatbots = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") || 'guest';

  const [stats, setStats] = useState({
    totalChatbots: 0,
    activeChatbots: 0,
    monthlyRequests: '0',
    avgResponseTime: '0s'
  });

  const [chatbots, setChatbots] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarMode, setSidebarMode] = useState('create');
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    chatbot: null
  });
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    knowledgeSources: [],
    temperature: 0.7,
    maxTokens: 500,
    systemPrompt: ''
  });

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };


  /* ---------- FETCH DATA ---------- */

  useEffect(() => {
    if (userId && userId !== 'guest') {
      fetchStats();
      fetchChatbots();
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (showSidebar || deleteModal.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showSidebar, deleteModal.isOpen]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/stats/${userId}`);
      const data = await res.json();

      if (res.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchChatbots = async () => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/${userId}`);
      const data = await res.json();

      if (res.ok) {
        setChatbots(data.chatbots);
      }
    } catch (error) {
      console.error('Failed to fetch chatbots:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/knowledge/documents/${userId}`);
      const data = await res.json();

      if (res.ok) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  /* ---------- SIDEBAR HANDLERS ---------- */

  const openCreateSidebar = () => {
    setForm({
      name: '',
      description: '',
      knowledgeSources: [],
      temperature: 0.7,
      maxTokens: 500,
      systemPrompt: ''
    });
    setSidebarMode('create');
    setShowSidebar(true);
  };

  const openEditSidebar = async (chatbot) => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/${userId}/${chatbot.chatbotId}`);
      const data = await res.json();

      if (res.ok) {
        setSelectedChatbot(data.chatbot);
        setForm({
          name: data.chatbot.name,
          description: data.chatbot.description,
          knowledgeSources: data.chatbot.knowledgeSources,
          temperature: data.chatbot.temperature,
          maxTokens: data.chatbot.maxTokens,
          systemPrompt: data.chatbot.systemPrompt
        });
        setSidebarMode('edit');
        setShowSidebar(true);
      }
    } catch (error) {
      console.error('Failed to load chatbot details:', error);
      console.error('Failed to load chatbot details:', error);
      addToast('Failed to load chatbot configuration', 'error');
    }
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => {
      setSelectedChatbot(null);
      setSidebarMode('create');
    }, 300);
  };

  /* ---------- CREATE CHATBOT ---------- */

  const createChatbot = async () => {
    if (!form.name.trim()) {
      addToast('Please enter a chatbot name', 'warning');
      return;
    }

    setCreating(true);

    try {
      const res = await fetch(`${API_BASE}/chatbots/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...form,
          systemPrompt: form.systemPrompt || `You are ${form.name}, a helpful AI assistant.`
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create chatbot');
      }

      await fetchStats();
      await fetchChatbots();

      closeSidebar();
      addToast('Chatbot created successfully!', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to create chatbot', 'error');
      console.error('Create error:', error);
    } finally {
      setCreating(false);
    }
  };

  /* ---------- UPDATE CHATBOT ---------- */

  const updateChatbot = async () => {
    if (!form.name.trim()) {
      addToast('Please enter a chatbot name', 'warning');
      return;
    }

    setUpdating(true);

    try {
      const res = await fetch(
        `${API_BASE}/chatbots/${userId}/${selectedChatbot.chatbotId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update chatbot');
      }

      await fetchStats();
      await fetchChatbots();
      closeSidebar();

      addToast('Chatbot updated successfully!', 'update');
    } catch (error) {
      addToast(error.message || 'Failed to update chatbot', 'error');
      console.error('Update error:', error);
    } finally {
      setUpdating(false);
    }
  };

  /* ---------- DELETE CHATBOT ---------- */

  const initiateDeleteChatbot = (chatbot) => {
    setDeleteModal({
      isOpen: true,
      chatbot: chatbot
    });
  };

  const confirmDeleteChatbot = async () => {
    const chatbotId = deleteModal.chatbot?.chatbotId;
    if (!chatbotId) return;

    try {
      const res = await fetch(
        `${API_BASE}/chatbots/${userId}/${chatbotId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        await fetchStats();
        await fetchChatbots();
        addToast('Chatbot deleted successfully', 'delete');
        setDeleteModal({ isOpen: false, chatbot: null });
      } else {
        throw new Error('Failed to delete chatbot');
      }
    } catch (error) {
      addToast('Failed to delete chatbot', 'error');
      console.error('Delete error:', error);
    }
  };

  /* ---------- TOGGLE STATUS ---------- */

  const toggleStatus = async (chatbotId) => {
    try {
      const res = await fetch(
        `${API_BASE}/chatbots/${userId}/${chatbotId}/toggle`,
        { method: 'POST' }
      );

      if (res.ok) {
        await fetchStats();
        await fetchChatbots();
      } else {
        throw new Error('Failed to toggle status');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      addToast('Failed to toggle chatbot status', 'error');
    }
  };

  /* ---------- HANDLE KNOWLEDGE SOURCES ---------- */

  const toggleKnowledgeSource = (documentId) => {
    setForm((prev) => ({
      ...prev,
      knowledgeSources: prev.knowledgeSources.includes(documentId)
        ? prev.knowledgeSources.filter((id) => id !== documentId)
        : [...prev.knowledgeSources, documentId]
    }));
  };

  /* ---------- UI ---------- */

  const chatbotStatCards = [
    { label: 'Total Chatbots', value: stats.totalChatbots },
    { label: 'Active Chatbots', value: stats.activeChatbots },
    { label: 'Monthly Requests', value: stats.monthlyRequests },
    { label: 'Avg Response Time', value: stats.avgResponseTime },
  ];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <DeleteChatbotModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDeleteChatbot}
        chatbotName={deleteModal.chatbot?.name || ''}
      />
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              AI Chatbots
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Configure behavior, knowledge, and monitor real-time performance
            </p>
          </div>
          <button
            onClick={openCreateSidebar}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Create Chatbot
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <SkeletonLoader key={i} type="card" />
            ))
          ) : (
            chatbotStatCards.map((item) => (
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
            ))
          )}
        </div>

        {/* Chatbots Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Chatbots
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Chatbot</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Health</th>
                  <th className="px-6 py-3 text-left">Documents</th>
                  <th className="px-6 py-3 text-left">Requests</th>
                  <th className="px-6 py-3 text-left">Resolution</th>
                  <th className="px-6 py-3 text-left">Last Active</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                {loading ? (
                  <SkeletonLoader type="table-row" count={8} />
                ) : chatbots.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No chatbots created yet
                    </td>
                  </tr>
                ) : (
                  chatbots.map((bot) => (
                    <tr
                      key={bot.chatbotId}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
                    >
                      {/* Chatbot */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {bot.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {bot.description}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${bot.status
                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-zinc-700 dark:text-gray-400'
                            }`}
                        >
                          {bot.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Health */}
                      <td className={`px-6 py-4 font-medium ${healthStyles[bot.health]}`}>
                        {bot.health}
                      </td>

                      {/* Documents */}
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {bot.documents}
                      </td>

                      {/* Requests */}
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {bot.requests.toLocaleString()}
                      </td>

                      {/* Resolution */}
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {bot.resolutionRate}
                      </td>

                      {/* Last Active */}
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {bot.lastActive}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end items-center gap-2">
                          <Toggle
                            enabled={bot.status}
                            onToggle={() => toggleStatus(bot.chatbotId)}
                          />

                          <button
                            onClick={() => openEditSidebar(bot)}
                            className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 transition"
                            title="Configure"
                          >
                            <Settings size={16} />
                          </button>

                          <button
                            onClick={() => navigate(`/dashboard/chatbots/${bot.chatbotId}/chat`)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-green-600/10 text-green-600 dark:text-green-400 hover:bg-green-600/20 transition"
                          >
                            Chat
                          </button>

                          <button
                            onClick={() => initiateDeleteChatbot(bot)}
                            className="p-2 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600/20 transition"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay - Fixed positioning covering entire viewport */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Right Sidebar - Fixed positioning */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[560px] bg-white dark:bg-zinc-900 shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {sidebarMode === 'create' ? 'Create New Chatbot' : `Configure ${selectedChatbot?.name || 'Chatbot'}`}
            </h2>
            <button
              onClick={closeSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <style>{`
              .sidebar-content::-webkit-scrollbar {
                width: 6px;
              }
              .sidebar-content::-webkit-scrollbar-track {
                background: transparent;
              }
              .sidebar-content::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 3px;
              }
              .dark .sidebar-content::-webkit-scrollbar-thumb {
                background: #52525b;
              }
              .sidebar-content::-webkit-scrollbar-thumb:hover {
                background: #9ca3af;
              }
              .dark .sidebar-content::-webkit-scrollbar-thumb:hover {
                background: #71717a;
              }
            `}</style>
            <div className="space-y-6 sidebar-content">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chatbot Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Support Assistant"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Handles customer support and FAQs"
                  rows={3}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Knowledge Sources ({form.knowledgeSources.length} selected)
                </label>
                <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-zinc-700 rounded-xl p-3 space-y-2 bg-gray-50 dark:bg-zinc-800/50">
                  {documents.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
                      No documents available. Upload documents first.
                    </p>
                  ) : (
                    documents.map((doc) => (
                      <label
                        key={doc.documentId}
                        className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition"
                      >
                        <input
                          type="checkbox"
                          checked={form.knowledgeSources.includes(doc.documentId)}
                          onChange={() => toggleKnowledgeSource(doc.documentId)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {doc.type} • {doc.chunks} chunks
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Temperature
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={form.temperature}
                    onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">0 = Focused, 1 = Creative</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Tokens
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="100"
                    value={form.maxTokens}
                    onChange={(e) => setForm({ ...form, maxTokens: parseInt(e.target.value) })}
                    className={inputClass}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max response length</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  System Prompt {sidebarMode === 'create' && '(Optional)'}
                </label>
                <textarea
                  value={form.systemPrompt}
                  onChange={(e) => setForm({ ...form, systemPrompt: e.target.value })}
                  placeholder="You are a helpful assistant..."
                  rows={4}
                  className={inputClass}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Define the chatbot's personality and behavior
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="px-6 py-5 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
            <div className="flex gap-3">
              <button
                onClick={closeSidebar}
                disabled={creating || updating}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-600 transition disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={sidebarMode === 'create' ? createChatbot : updateChatbot}
                disabled={(creating || updating) || !form.name.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
              >
                {creating ? 'Creating...' : updating ? 'Updating...' : sidebarMode === 'create' ? 'Create Chatbot' : 'Update Chatbot'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbots;