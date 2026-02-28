import { useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, Copy, Check, MessageCircle, X } from 'lucide-react'
import { ToastContainer } from '../components/Toast'
import SkeletonLoader from '../components/SkeletonLoaders'

const API_BASE = 'http://127.0.0.1:5000'

const statusStyles = {
  'Strong Match': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  'Good Match': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  'Under Review': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
}

const JDCandidates = () => {
  const navigate = useNavigate()
  const { chatbotId } = useParams()
  const userId = sessionStorage.getItem('userId') || 'guest'

  const [chatbot, setChatbot] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [conversation, setConversation] = useState([])
  const [summary, setSummary] = useState('')
  const [showConversation, setShowConversation] = useState(false)
  const [copied, setCopied] = useState({ link: false, code: false })
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    setToasts((p) => [...p, { id: Date.now(), message, type }])
  }

  const removeToast = (id) => {
    setToasts((p) => p.filter((t) => t.id !== id))
  }

  useEffect(() => {
    if (userId !== 'guest' && chatbotId) {
      fetchChatbot()
      fetchCandidates()
    }
  }, [userId, chatbotId])

  useEffect(() => {
    document.body.style.overflow = showConversation ? 'hidden' : ''
    return () => (document.body.style.overflow = '')
  }, [showConversation])

  const fetchChatbot = async () => {
    const res = await fetch(`${API_BASE}/jd-chatbots/${userId}/${chatbotId}`)
    const data = await res.json()
    if (res.ok) setChatbot(data.chatbot)
  }

  const fetchCandidates = async () => {
    const res = await fetch(`${API_BASE}/jd-chatbots/${userId}/${chatbotId}/candidates`)
    const data = await res.json()
    if (res.ok) setCandidates(data.candidates)
    setLoading(false)
  }

  const viewConversation = async (candidate) => {
    setSelectedCandidate(candidate)
    setShowConversation(true)

    const res = await fetch(
      `${API_BASE}/jd-chatbots/${userId}/${chatbotId}/candidates/${candidate.sessionId}`
    )
    const data = await res.json()
    if (res.ok) {
      setConversation(data.messages)
      setSummary(data.summary)
    }
  }

  const closeConversation = () => {
    setShowConversation(false)
    setSelectedCandidate(null)
    setConversation([])
    setSummary('')
  }

  const copyToClipboard = async (text, type) => {
    await navigator.clipboard.writeText(text)
    setCopied({ ...copied, [type]: true })
    addToast(`${type === 'link' ? 'Link' : 'Embed code'} copied!`, 'success')
    setTimeout(() => setCopied({ ...copied, [type]: false }), 2000)
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/jd-chatbots')}
            className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
          >
            <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {chatbot?.jobTitle || 'JD Chatbot'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} screened
            </p>
          </div>
        </div>

        {chatbot && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Shareable Link
              </h3>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={chatbot.shareableLink}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-sm text-gray-700 dark:text-gray-300"
                />
                <button
                  onClick={() => copyToClipboard(chatbot.shareableLink, 'link')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  {copied.link ? <Check size={16} /> : <Copy size={16} />}
                  {copied.link ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                Embed Code
              </h3>
              <div className="flex gap-2">
                <textarea
                  readOnly
                  rows={3}
                  value={chatbot.embedCode}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-xs text-gray-700 dark:text-gray-300 font-mono resize-none"
                />
                <button
                  onClick={() => copyToClipboard(chatbot.embedCode, 'code')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center gap-2 h-fit"
                >
                  {copied.code ? <Check size={16} /> : <Copy size={16} />}
                  {copied.code ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Candidate</th>
                  <th className="px-6 py-3 text-center">Interactions</th>
                  <th className="px-6 py-3 text-center">Match Score</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Last Interaction</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                {loading ? (
                  <SkeletonLoader type="table-row" count={5} />
                ) : candidates.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No candidates have interacted yet
                    </td>
                  </tr>
                ) : (
                  candidates.map((candidate) => (
                    <tr
                      key={candidate.sessionId}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
                    >
                      <td className="px-6 py-4">
                        <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                          {candidate.name}
                        </p>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {candidate.email}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">
                        {candidate.messageCount}
                      </td>

                      <td className="px-6 py-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="w-20 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden shadow-inner">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${candidate.matchScore >= 80
                                  ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                                  : candidate.matchScore >= 60
                                    ? 'bg-gradient-to-r from-indigo-500 to-blue-500'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                                }`}
                              style={{ width: `${candidate.matchScore}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                            {candidate.matchScore}%
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[candidate.status]
                            }`}
                        >
                          {candidate.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {candidate.lastInteraction}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => viewConversation(candidate)}
                            className="px-3 py-1.5 rounded-lg text-sm bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 transition flex items-center gap-2"
                          >
                            <MessageCircle size={14} />
                            View Chat
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

      {showConversation && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={closeConversation}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[700px] bg-white dark:bg-zinc-900 shadow-2xl z-50 transition-transform duration-300 ${showConversation ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {selectedCandidate?.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedCandidate?.email}
              </p>
            </div>
            <button onClick={closeConversation}>
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {summary && (
            <div className="px-6 py-4 bg-indigo-50 dark:bg-indigo-900/20 border-b border-gray-200 dark:border-zinc-700">
              <h3 className="text-sm font-medium text-indigo-900 dark:text-indigo-300 mb-2">
                AI Summary
              </h3>
              <p className="text-sm text-indigo-800 dark:text-indigo-200 whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.role === 'candidate'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
                    }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  <p
                    className={`text-xs mt-2 ${msg.role === 'candidate'
                      ? 'text-indigo-200'
                      : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default JDCandidates