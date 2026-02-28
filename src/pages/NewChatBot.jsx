/**
 * Chatbot Chat Page
 * Chat with a specific AI Chatbot
 */

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, Plus, Trash2, ArrowLeft, Brain } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000';

const ChatbotChatPage = () => {
  const { chatbotId } = useParams();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") || 'guest';

  const [chatbotInfo, setChatbotInfo] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingChatbot, setLoadingChatbot] = useState(true);
  const messagesEndRef = useRef(null);

  const initialWelcomeMessage = {
    id: 1,
    role: 'ai',
    text: 'Hello! How can I assist you today?',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  /* ---------------- LOAD CHATBOT INFO ---------------- */

  useEffect(() => {
    if (!chatbotId || !userId || userId === 'guest') {
      navigate('/dashboard/chatbots');
      return;
    }
    fetchChatbotInfo();
    fetchSessions();
  }, [chatbotId, userId]);

  const fetchChatbotInfo = async () => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/${userId}/${chatbotId}`);
      const data = await res.json();

      if (res.ok) {
        setChatbotInfo(data.chatbot);
        setMessages([{
          ...initialWelcomeMessage,
          text: data.chatbot.systemPrompt || 'Hello! How can I assist you today?'
        }]);
      } else {
        alert('Chatbot not found');
        navigate('/dashboard/chatbots');
      }
    } catch (error) {
      console.error('Failed to fetch chatbot:', error);
      alert('Failed to load chatbot');
      navigate('/dashboard/chatbots');
    } finally {
      setLoadingChatbot(false);
    }
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/${userId}/${chatbotId}/sessions`);
      const data = await res.json();

      if (res.ok && Array.isArray(data.sessions)) {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  /* ---------------- LOAD SESSION MESSAGES ---------------- */

  const loadSession = async (sessionId) => {
    setCurrentSessionId(sessionId);
    try {
      const res = await fetch(
        `${API_BASE}/chatbots/${userId}/${chatbotId}/sessions/${sessionId}`
      );
      const data = await res.json();

      if (res.ok && Array.isArray(data.history)) {
        const formatted = [];

        data.history.forEach((item) => {
          formatted.push({
            id: `${item.createdAt}-user`,
            role: 'user',
            text: item.message,
            time: new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });

          formatted.push({
            id: `${item.createdAt}-ai`,
            role: 'ai',
            text: item.reply,
            usedKnowledge: item.usedKnowledge,
            time: new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          });
        });

        setMessages(formatted);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    }
  };

  /* ---------------- SEND MESSAGE ---------------- */

  const sendMessage = async () => {
    if (!input.trim() || typing) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch(`${API_BASE}/chatbots/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          chatbotId,
          message: userMsg.text,
          sessionId: currentSessionId,
          useContext: true,
          useKnowledge: true,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);

      // Update current session ID if it's a new session
      if (data.sessionId && !currentSessionId) {
        setCurrentSessionId(data.sessionId);
        fetchSessions(); // Refresh session list
      }

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: data.reply,
        usedKnowledge: data.usedKnowledge,
        responseTime: data.responseTime,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'ai',
          text: error.message || 'Sorry, something went wrong. Please try again.',
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  /* ---------------- NEW CHAT ---------------- */

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([
      {
        id: Date.now(),
        role: 'ai',
        text: chatbotInfo?.systemPrompt || 'Hello! How can I assist you today?',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);
  };

  /* ---------------- DELETE SESSION ---------------- */

  const deleteSession = async (sessionId, e) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const res = await fetch(
        `${API_BASE}/chatbots/${userId}/${chatbotId}/sessions/${sessionId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));

        if (currentSessionId === sessionId) {
          startNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('Failed to delete conversation');
    }
  };

  /* ---------------- AUTO SCROLL ---------------- */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  if (loadingChatbot) {
    return (
      <div className="p-5 h-[calc(100vh-80px)] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading chatbot...</p>
      </div>
    );
  }

  return (
    <div className="p-5 h-[calc(100vh-80px)] flex gap-4">
      <style>{`
        .sleek-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .sleek-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sleek-scroll::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.4);
          border-radius: 999px;
        }

        .input-flow {
          position: relative;
        }
        .input-flow::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 18px;
          background: linear-gradient(
            90deg,
            #6366f1,
            #8b5cf6,
            #ec4899,
            #22d3ee,
            #6366f1
          );
          background-size: 300% 300%;
          animation: flowRotate 4s linear infinite;
          filter: blur(6px);
          opacity: 0.9;
        }
        .input-flow > div {
          position: relative;
          z-index: 1;
        }

        @keyframes flowRotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }

        .thinking-bubbles {
          display: flex;
          gap: 8px;
          padding: 10px 14px;
        }
        .thinking-bubbles span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: bubble 1.4s infinite ease-in-out;
        }
        .thinking-bubbles span:nth-child(1) { background: #6366f1; }
        .thinking-bubbles span:nth-child(2) { background: #8b5cf6; animation-delay: 0.2s; }
        .thinking-bubbles span:nth-child(3) { background: #ec4899; animation-delay: 0.4s; }
        .thinking-bubbles span:nth-child(4) { background: #22d3ee; animation-delay: 0.6s; }

        @keyframes bubble {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }

        .delete-btn {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .conversation-item:hover .delete-btn {
          opacity: 1;
        }
      `}</style>

      {/* Conversations Sidebar */}
      <div className="hidden md:flex w-64 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 p-4 flex-col">
        <button
          onClick={() => navigate('/dashboard/chatbots')}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4"
        >
          <ArrowLeft size={16} />
          Back to Chatbots
        </button>

        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Conversations
          </h2>
          <button
            onClick={startNewChat}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-600 text-gray-900 dark:text-gray-100 text-xs font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition flex items-center gap-1.5"
          >
            <Plus size={14} />
            New Chat
          </button>
        </div>

        <div className="space-y-2 overflow-auto sleek-scroll flex-1">
          {loadingSessions ? (
            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
              No conversations yet
            </div>
          ) : (
            sessions.map((session) => (
              <ConversationItem
                key={session.sessionId}
                title={session.title}
                messageCount={session.messageCount}
                active={currentSessionId === session.sessionId}
                onClick={() => loadSession(session.sessionId)}
                onDelete={(e) => deleteSession(session.sessionId, e)}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-700">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {chatbotInfo?.name || 'Chatbot'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {chatbotInfo?.description || 'AI Assistant'}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 sleek-scroll">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
          {typing && <ThinkingBubbles />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-zinc-700">
          <div className={typing ? 'input-flow rounded-2xl' : ''}>
            <div className="flex gap-3 items-center bg-white dark:bg-zinc-900 rounded-2xl px-3 py-2">
              <button
                onClick={startNewChat}
                className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
                title="New Chat"
              >
                <Plus size={18} />
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 outline-none placeholder:text-gray-400"
              />

              <button
                onClick={sendMessage}
                disabled={typing || !input.trim()}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const MessageBubble = ({ msg }) => (
  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`max-w-[70%] px-4 py-3 rounded-xl text-sm ${
        msg.role === 'user'
          ? 'bg-indigo-600 text-white'
          : 'bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-gray-100'
      }`}
    >
      <p className="whitespace-pre-wrap">{msg.text}</p>
      <div className="flex items-center justify-between mt-1 text-xs opacity-70">
        <span>{msg.time}</span>
        {msg.role === 'ai' && msg.usedKnowledge && (
          <span className="flex items-center gap-1 ml-3">
            <Brain size={12} />
            KB
          </span>
        )}
      </div>
    </div>
  </div>
);

const ThinkingBubbles = () => (
  <div className="flex justify-start">
    <div className="thinking-bubbles">
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);

const ConversationItem = ({ title, messageCount, active, onClick, onDelete }) => (
  <div
    className={`conversation-item px-3 py-2 rounded-lg cursor-pointer transition flex items-center justify-between group ${
      active
        ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'
        : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'
    }`}
    onClick={onClick}
  >
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium truncate">{title}</p>
      <p className="text-xs opacity-60 mt-0.5">{messageCount} messages</p>
    </div>
    <button
      onClick={onDelete}
      className="delete-btn p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition"
      title="Delete conversation"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

export default ChatbotChatPage;