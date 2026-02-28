import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { MessageCircle, Plus, Settings, Trash2, X } from 'lucide-react'
import { ToastContainer } from '../components/Toast'
import SkeletonLoader from '../components/SkeletonLoaders'
import DeleteChatbotModal from '../components/Modal/DeleteChatbotModal'

const API_BASE = 'http://127.0.0.1:5000'

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-600'
      }`}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${enabled ? 'translate-x-5' : ''
        }`}
    />
  </button>
)

const healthStyles = {
  Healthy: 'text-green-600 dark:text-green-400',
  Moderate: 'text-yellow-600 dark:text-yellow-400',
  Low: 'text-orange-600 dark:text-orange-400',
  Inactive: 'text-gray-500 dark:text-gray-400'
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'

const JDChatbots = () => {
  const navigate = useNavigate()
  const userId = sessionStorage.getItem('userId') || 'guest'

  const [stats, setStats] = useState({
    totalChatbots: 0,
    activeChatbots: 0,
    totalCandidates: 0,
    avgMatch: '0%'
  })

  const [chatbots, setChatbots] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(false)
  const [sidebarMode, setSidebarMode] = useState('create')
  const [selectedChatbot, setSelectedChatbot] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, chatbot: null })
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [toasts, setToasts] = useState([])

  const [form, setForm] = useState({
    jobTitle: '',
    jobSummary: '',
    jdDocumentId: ''
  })

  const addToast = (message, type = 'info') => {
    setToasts((p) => [...p, { id: Date.now(), message, type }])
  }

  const removeToast = (id) => {
    setToasts((p) => p.filter((t) => t.id !== id))
  }

  useEffect(() => {
    if (userId !== 'guest') {
      fetchStats()
      fetchChatbots()
      fetchDocuments()
    } else {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    document.body.style.overflow = showSidebar || deleteModal.isOpen ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [showSidebar, deleteModal.isOpen])

  const fetchStats = async () => {
    const res = await fetch(`${API_BASE}/jd-chatbots/stats/${userId}`)
    const data = await res.json()
    if (res.ok) setStats(data.stats)
  }

  const fetchChatbots = async () => {
    const res = await fetch(`${API_BASE}/jd-chatbots/${userId}`)
    const data = await res.json()
    if (res.ok) setChatbots(data.chatbots)
    setLoading(false)
  }

  const fetchDocuments = async () => {
    const res = await fetch(`${API_BASE}/knowledge/documents/${userId}`)
    const data = await res.json()
    if (res.ok) setDocuments(data.documents)
  }

  const openCreateSidebar = () => {
    setForm({ jobTitle: '', jobSummary: '', jdDocumentId: '' })
    setSidebarMode('create')
    setShowSidebar(true)
  }

  const openEditSidebar = async (bot) => {
    const res = await fetch(`${API_BASE}/jd-chatbots/${userId}/${bot.chatbotId}`)
    const data = await res.json()
    if (res.ok) {
      setSelectedChatbot(bot)
      setForm({
        jobTitle: data.chatbot.jobTitle,
        jobSummary: data.chatbot.jobSummary,
        jdDocumentId: data.chatbot.jdDocumentId
      })
      setSidebarMode('edit')
      setShowSidebar(true)
    }
  }

  const closeSidebar = () => {
    setShowSidebar(false)
    setSelectedChatbot(null)
  }

  const createChatbot = async () => {
    if (!form.jobTitle || !form.jdDocumentId) {
      addToast('Job title and JD document are required', 'warning')
      return
    }

    setCreating(true)
    const res = await fetch(`${API_BASE}/jd-chatbots/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, ...form })
    })

    if (res.ok) {
      fetchStats()
      fetchChatbots()
      closeSidebar()
      addToast('JD chatbot created', 'success')
    }
    setCreating(false)
  }

  const updateChatbot = async () => {
    setUpdating(true)
    const res = await fetch(
      `${API_BASE}/jd-chatbots/${userId}/${selectedChatbot.chatbotId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }
    )

    if (res.ok) {
      fetchStats()
      fetchChatbots()
      closeSidebar()
      addToast('JD chatbot updated', 'update')
    }
    setUpdating(false)
  }

  const confirmDeleteChatbot = async () => {
    await fetch(
      `${API_BASE}/jd-chatbots/${userId}/${deleteModal.chatbot.chatbotId}`,
      { method: 'DELETE' }
    )
    fetchStats()
    fetchChatbots()
    setDeleteModal({ isOpen: false, chatbot: null })
    addToast('JD chatbot deleted', 'delete')
  }

  const toggleStatus = async (id) => {
    await fetch(`${API_BASE}/jd-chatbots/${userId}/${id}/toggle`, { method: 'POST' })
    fetchStats()
    fetchChatbots()
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <DeleteChatbotModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, chatbot: null })}
        onConfirm={confirmDeleteChatbot}
        chatbotName={deleteModal.chatbot?.jobTitle || ''}
      />

      <div className="p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              JD Chatbots
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Conversational candidate intake and JD matching
            </p>
          </div>
          <button
            onClick={openCreateSidebar}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Plus size={18} />
            Create JD Chatbot
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading
            ? [1, 2, 3, 4].map((i) => <SkeletonLoader key={i} type="card" />)
            : [
              { label: 'Total Bots', value: stats.totalChatbots },
              { label: 'Active Bots', value: stats.activeChatbots },
              { label: 'Candidates', value: stats.totalCandidates },
              { label: 'Avg Match', value: stats.avgMatch }
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700"
              >
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
                <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                  {s.value}
                </p>
              </div>
            ))}
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Job Role</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-left">Health</th>
                  <th className="px-6 py-3 text-center">Candidates</th>
                  <th className="px-6 py-3 text-center">Avg Match</th>
                  <th className="px-6 py-3 text-left">Last Active</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                {loading ? (
                  <SkeletonLoader type="table-row" count={6} />
                ) : chatbots.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No JD chatbots created yet
                    </td>
                  </tr>
                ) : (
                  chatbots.map((bot) => (
                    <tr
                      key={bot.chatbotId}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
                    >
                      <td className="px-6 py-4 max-w-md truncate">
                        <p className="font-bold text-gray-900 dark:text-gray-100 truncate">
                          {bot.jobTitle}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {bot.jobSummary}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-center">
                        <Toggle
                          enabled={bot.status}
                          onToggle={() => toggleStatus(bot.chatbotId)}
                        />
                      </td>

                      <td className={`px-6 py-4 font-medium ${healthStyles[bot.health]}`}>
                        {bot.health}
                      </td>

                      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
                        {bot.candidates}
                      </td>

                      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
                        {bot.avgMatch}%
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {bot.lastActive}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditSidebar(bot)}
                            className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 transition"
                          >
                            <Settings size={16} />
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/dashboard/jd-chatbots/${bot.chatbotId}/candidates`)
                            }
                            className="px-3 py-1.5 rounded-lg text-sm bg-green-600/10 text-green-600 dark:text-green-400 hover:bg-green-600/20 transition"
                          >
                            View
                          </button>

                          <button
                            onClick={() => window.open(`/jd-chat/${bot.chatbotId}`, '_blank')}
                            className="p-2 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600/20 transition"
                            title="Open Public Chat"
                          >
                            <MessageCircle size={16} />
                          </button>

                          <button
                            onClick={() => setDeleteModal({ isOpen: true, chatbot: bot })}
                            className="p-2 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 hover:bg-red-600/20 transition"
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

      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[560px] bg-white dark:bg-zinc-900 shadow-2xl z-50 transition-transform duration-300 ${showSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {sidebarMode === 'create' ? 'Create JD Chatbot' : 'Edit JD Chatbot'}
            </h2>
            <button onClick={closeSidebar}>
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            <input
              className={inputClass}
              placeholder="Job role title"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
            />

            <textarea
              className={inputClass}
              rows={3}
              placeholder="Job summary"
              value={form.jobSummary}
              onChange={(e) => setForm({ ...form, jobSummary: e.target.value })}
            />

            <select
              className={inputClass}
              value={form.jdDocumentId}
              onChange={(e) => setForm({ ...form, jdDocumentId: e.target.value })}
            >
              <option value="">Select JD document</option>
              {documents.map((doc) => (
                <option key={doc.documentId} value={doc.documentId}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="px-6 py-5 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
            <button
              onClick={sidebarMode === 'create' ? createChatbot : updateChatbot}
              disabled={creating || updating}
              className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {sidebarMode === 'create' ? 'Create' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default JDChatbots