/**
 * Chat Page
 * AI Platform Dashboard
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: 'Hello! How can I assist you today?',
    time: '09:30 AM',
  },
];

const ChatPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

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
      const res = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Chat failed');
      }

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        text: data.reply,
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
          text: 'Sorry, something went wrong. Please try again.',
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

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
        .thinking-bubbles span:nth-child(1) {
          background: #6366f1;
        }
        .thinking-bubbles span:nth-child(2) {
          background: #8b5cf6;
          animation-delay: 0.2s;
        }
        .thinking-bubbles span:nth-child(3) {
          background: #ec4899;
          animation-delay: 0.4s;
        }
        .thinking-bubbles span:nth-child(4) {
          background: #22d3ee;
          animation-delay: 0.6s;
        }

        @keyframes bubble {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Conversations */}
      <div className="hidden md:flex w-64 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 p-4 flex-col">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Conversations
        </h2>
        <div className="space-y-2 overflow-auto sleek-scroll">
          <ConversationItem active title="Support Assistant" />
          <ConversationItem title="Invoice Bot" />
          <ConversationItem title="HR Policy Bot" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-zinc-700">
          <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Support Assistant
          </h1>
          <p className="text-xs text-green-600 dark:text-green-400">Online</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 sleek-scroll">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {typing && <ThinkingBubbles />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 dark:border-zinc-700">
          <div className={typing ? 'input-flow rounded-2xl' : ''}>
            <div className="flex gap-3 items-center bg-white dark:bg-zinc-900 rounded-2xl px-3 py-2">
              <button className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition">
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
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition active:scale-95"
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
      <p>{msg.text}</p>
      <span className="block mt-1 text-xs opacity-70 text-right">
        {msg.time}
      </span>
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

const ConversationItem = ({ title, active }) => (
  <div
    className={`px-3 py-2 rounded-lg cursor-pointer transition ${
      active
        ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400'
        : 'hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300'
    }`}
  >
    <p className="text-sm font-medium">{title}</p>
  </div>
);

export default ChatPage;
