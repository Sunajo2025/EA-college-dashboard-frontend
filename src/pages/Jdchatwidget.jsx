import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Bot, User, Paperclip } from 'lucide-react'

const API_BASE = 'http://127.0.0.1:5000'

const JDChatWidget = () => {
  const { chatbotId } = useParams()
  const [chatbot, setChatbot] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '' })
  const [infoSubmitted, setInfoSubmitted] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchChatbot()

    // Generate session ID
    const storedSessionId = sessionStorage.getItem(`jd-session-${chatbotId}`)
    if (storedSessionId) {
      setSessionId(storedSessionId)
      setInfoSubmitted(true)
    } else {
      const newSessionId = generateSessionId()
      setSessionId(newSessionId)
      sessionStorage.setItem(`jd-session-${chatbotId}`, newSessionId)
    }
  }, [chatbotId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchChatbot = async () => {
    try {
      const res = await fetch(`${API_BASE}/jd-chatbots/public/${chatbotId}`)
      const data = await res.json()
      if (res.ok) {
        setChatbot(data.chatbot)

        // Add welcome message
        setMessages([
          {
            role: 'assistant',
            message: `Hello! I'm here to help you learn more about the ${data.chatbot.jobTitle} position. Feel free to ask me anything about the role, requirements, or to tell me about your background!`,
            createdAt: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching chatbot:', error)
    }
  }

  const generateSessionId = () => {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const submitInfo = () => {
    if (candidateInfo.name.trim()) {
      setInfoSubmitted(true)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || uploading) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('chatbotId', chatbotId)
    formData.append('sessionId', sessionId)

    try {
      const res = await fetch(`${API_BASE}/jd-chatbots/upload-resume`, {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'candidate',
            message: `[Uploaded Resume: ${file.name}]`,
            createdAt: new Date().toISOString()
          },
          {
            role: 'assistant',
            message: data.message || "Resume analyzed! I've updated my understanding of your fit for this role. What would you like to know?",
            createdAt: new Date().toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Error uploading resume:', error)
    } finally {
      setUploading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // Add user message to UI
    const newUserMsg = {
      role: 'candidate',
      message: userMessage,
      createdAt: new Date().toISOString()
    }
    setMessages((prev) => [...prev, newUserMsg])
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}/jd-chatbots/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatbotId,
          message: userMessage,
          sessionId,
          candidateName: candidateInfo.name,
          candidateEmail: candidateInfo.email
        })
      })

      const data = await res.json()

      if (res.ok) {
        const botMsg = {
          role: 'assistant',
          message: data.response,
          createdAt: new Date().toISOString()
        }
        setMessages((prev) => [...prev, botMsg])
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (infoSubmitted) {
        sendMessage()
      } else {
        submitInfo()
      }
    }
  }

  if (!chatbot) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading chatbot...</p>
        </div>
      </div>
    )
  }

  if (!chatbot.status) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-gray-200 dark:border-zinc-700 max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Chatbot Inactive
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This chatbot is currently not accepting conversations.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-zinc-950 dark:to-indigo-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        {/* Header - Condensed */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
          <h1 className="text-xl font-bold tracking-tight">{chatbot.jobTitle}</h1>
        </div>

        {/* Info Collection */}
        {!infoSubmitted && (
          <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 border-b border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Welcome! Let's get started
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Your name *"
                value={candidateInfo.name}
                onChange={(e) =>
                  setCandidateInfo({ ...candidateInfo, name: e.target.value })
                }
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="email"
                placeholder="Your email (optional)"
                value={candidateInfo.email}
                onChange={(e) =>
                  setCandidateInfo({ ...candidateInfo, email: e.target.value })
                }
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={submitInfo}
                disabled={!candidateInfo.name.trim()}
                className="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Conversation
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        {infoSubmitted && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${msg.role === 'candidate' ? 'flex-row-reverse' : ''
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'candidate'
                      ? 'bg-indigo-600'
                      : 'bg-gray-200 dark:bg-zinc-800'
                      }`}
                  >
                    {msg.role === 'candidate' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-gray-700 dark:text-gray-300" />
                    )}
                  </div>

                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-2xl ${msg.role === 'candidate'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-zinc-800 flex items-center justify-center">
                    <Bot size={16} className="text-gray-700 dark:text-gray-300" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-zinc-800">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      />
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
              <div className="flex gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleResumeUpload}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition disabled:opacity-50"
                  title="Upload Resume"
                >
                  <Paperclip size={20} className={uploading ? 'animate-pulse' : ''} />
                </button>
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || uploading}
                  className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading || uploading}
                  className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={18} />
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default JDChatWidget