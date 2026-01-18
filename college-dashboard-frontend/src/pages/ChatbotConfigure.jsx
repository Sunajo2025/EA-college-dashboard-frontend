/**
 * Chatbot Configure Page
 * AI Platform Dashboard
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const tabs = [
  'Overview',
  'Knowledge Base',
  'Behavior',
  'UI & Embed',
  'Integrations',
  'Analytics',
];

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

const selectClass =
  "w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer";

const textareaClass =
  "w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none";

const panelClass =
  "bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6";

const ChatbotConfigure = () => {
  const { chatbotId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const [chatbot, setChatbot] = useState({
    name: 'Support Assistant',
    description: 'Handles customer support queries',
    model: 'GPT-4',
    temperature: 0.4,
    welcomeMessage: 'Hi, how can I help you?',
    systemPrompt: 'You are a helpful support assistant.',
    fallback: 'I am not sure about that.',
    webhook: '',
    documents: ['FAQs.pdf', 'Support_Guide.docx'],
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Configure Chatbot
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chatbot ID: {chatbotId}
          </p>
        </div>

        <button
          onClick={() => navigate('/dashboard/chatbots')}
          className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
        >
          Back
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-zinc-700">
        <nav className="flex gap-6 text-sm font-medium">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 transition ${
                activeTab === tab
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className={`${panelClass} min-h-[360px]`}>
        {/* OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                value={chatbot.name}
                onChange={(e) =>
                  setChatbot({ ...chatbot, name: e.target.value })
                }
                className={inputClass}
                placeholder="Chatbot Name"
              />

              <select
                value={chatbot.model}
                onChange={(e) =>
                  setChatbot({ ...chatbot, model: e.target.value })
                }
                className={selectClass}
              >
                <option>GPT-4</option>
                <option>GPT-3.5</option>
              </select>
            </div>

            <textarea
              value={chatbot.description}
              onChange={(e) =>
                setChatbot({ ...chatbot, description: e.target.value })
              }
              className={textareaClass}
              placeholder="Chatbot description"
              rows={3}
            />

            <div>
              <label className="text-sm text-gray-500 dark:text-gray-400">
                Temperature: {chatbot.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={chatbot.temperature}
                onChange={(e) =>
                  setChatbot({
                    ...chatbot,
                    temperature: Number(e.target.value),
                  })
                }
                className="w-full mt-2 accent-indigo-600 dark:accent-indigo-400"
              />
            </div>

            <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
              Save Changes
            </button>
          </div>
        )}

        {/* KNOWLEDGE BASE */}
        {activeTab === 'Knowledge Base' && (
          <div className="space-y-4">
            <button className="px-5 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-600/20 transition">
              Upload Document
            </button>

            <ul className="space-y-2 text-sm">
              {chatbot.documents.map((doc) => (
                <li
                  key={doc}
                  className="flex justify-between items-center p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300"
                >
                  {doc}
                  <button className="text-red-600 dark:text-red-400 text-xs font-medium">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* BEHAVIOR */}
        {activeTab === 'Behavior' && (
          <div className="space-y-4">
            <textarea
              value={chatbot.systemPrompt}
              onChange={(e) =>
                setChatbot({ ...chatbot, systemPrompt: e.target.value })
              }
              className={textareaClass}
              placeholder="System Prompt"
              rows={4}
            />

            <input
              value={chatbot.fallback}
              onChange={(e) =>
                setChatbot({ ...chatbot, fallback: e.target.value })
              }
              className={inputClass}
              placeholder="Fallback Response"
            />
          </div>
        )}

        {/* UI & EMBED */}
        {activeTab === 'UI & Embed' && (
          <div className="space-y-4">
            <input
              value={chatbot.welcomeMessage}
              onChange={(e) =>
                setChatbot({ ...chatbot, welcomeMessage: e.target.value })
              }
              className={inputClass}
              placeholder="Welcome message"
            />

            <pre className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 text-xs text-gray-700 dark:text-gray-300 overflow-x-auto border border-gray-200 dark:border-zinc-700">
{`<script src="https://yourapp.ai/widget.js" data-id="${chatbotId}"></script>`}
            </pre>
          </div>
        )}

        {/* INTEGRATIONS */}
        {activeTab === 'Integrations' && (
          <div className="space-y-4">
            <input
              value={chatbot.webhook}
              onChange={(e) =>
                setChatbot({ ...chatbot, webhook: e.target.value })
              }
              className={inputClass}
              placeholder="Webhook URL"
            />

            <button className="px-5 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-600/20 transition">
              Enable Integration
            </button>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'Analytics' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300">
              Total Requests: 12,400
            </div>
            <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-700 dark:text-gray-300">
              Avg Response Time: 1.6s
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotConfigure;
