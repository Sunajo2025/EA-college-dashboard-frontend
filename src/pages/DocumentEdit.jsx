import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Download, RefreshCw, Eye, CheckCircle, XCircle, 
  AlertCircle, Info, X, Sparkles, Send, Loader2, Wand2, Code2 
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000';

// Mermaid rendering component
const MermaidRenderer = ({ content }) => {
  useEffect(() => {
    const renderMermaid = async () => {
      try {
        if (window.mermaid) {
          await window.mermaid.contentLoaderAsync();
        }
      } catch (error) {
        console.log('Mermaid rendering error:', error);
      }
    };
    renderMermaid();
  }, [content]);

  return <div className="mermaid">{content}</div>;
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const styles = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  };

  const Icon = icons[type] || Info;

  useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${styles[type]} animate-slide-in-right`}>
      <Icon size={20} />
      <p className="text-sm font-medium flex-1">{message}</p>
      <button onClick={onClose} className="hover:opacity-70 transition">
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[200] space-y-2 w-96 max-w-full">
      <style>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
      `}</style>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// AI Assistant Modal
const AIAssistantModal = ({ isOpen, onClose, selectedText, documentId, userId, onApply }) => {
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestedContent, setSuggestedContent] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);

  const quickPrompts = [
    'Make this more professional',
    'Simplify the language',
    'Add more details',
    'Make it more concise',
    'Improve grammar',
    'Add bullet points',
  ];

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSendPrompt = async (customPrompt = null) => {
    const userPrompt = customPrompt || prompt;
    if (!userPrompt.trim()) return;

    setIsProcessing(true);
    setChatHistory(prev => [...prev, { role: 'user', content: userPrompt }]);
    setPrompt('');

    try {
      console.log('[AI-EDIT] Sending request:', {
        userId,
        documentId,
        contentLength: selectedText.length,
        instruction: userPrompt
      });

      const response = await fetch(
        `${API_BASE}/documents/generation/${userId}/${documentId}/ai-edit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: selectedText,
            instruction: userPrompt
          })
        }
      );

      const data = await response.json();
      console.log('[AI-EDIT] Response:', response.status, data);

      if (response.ok) {
        setSuggestedContent(data.content);
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: data.content 
        }]);
      } else {
        const errorMsg = data.error || 'Failed to process';
        setChatHistory(prev => [...prev, { 
          role: 'assistant', 
          content: `Error: ${errorMsg}` 
        }]);
      }
    } catch (error) {
      console.error('[AI-EDIT] Error:', error);
      setChatHistory(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApply = () => {
    if (suggestedContent) {
      onApply(suggestedContent);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-200 dark:border-zinc-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600">
              <Sparkles className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Sunajo AI Editor
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6">
                How can I improve this text?
              </h3>
              <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendPrompt(qp)}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 text-sm font-medium disabled:opacity-50"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-100'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-zinc-700">
          <div className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendPrompt()}
              placeholder="Describe what you'd like to change..."
              disabled={isProcessing}
              className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
            />
            <button
              onClick={() => handleSendPrompt()}
              disabled={isProcessing || !prompt.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:shadow-lg disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              Send
            </button>
          </div>

          {suggestedContent && (
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => setSuggestedContent('')}
                className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm font-medium"
              >
                Discard
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 text-sm font-medium flex items-center gap-2"
              >
                <CheckCircle size={16} />
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mermaid Insert Modal
const MermaidInsertModal = ({ isOpen, onClose, onInsert }) => {
  const [diagramType, setDiagramType] = useState('flowchart');
  const [customCode, setCustomCode] = useState('');

  const templates = {
    flowchart: `graph TD
    A[Start] --> B[Process]
    B --> C{Decision}
    C -->|Yes| D[End]
    C -->|No| E[Another Process]
    E --> C`,
    sequence: `sequenceDiagram
    participant User
    participant App
    participant API
    User->>App: Request
    App->>API: Call
    API-->>App: Response
    App-->>User: Result`,
    gantt: `gantt
    dateFormat YYYY-MM-DD
    title Project Timeline
    section Phase 1
    Task 1 :a1, 2024-01-01, 30d
    Task 2 :a2, after a1, 30d`,
    mindmap: `mindmap
  root((Project))
    Goals
      Short-term
      Long-term`
  };

  const handleInsert = () => {
    const code = customCode || templates[diagramType];
    onInsert(`\`\`\`mermaid\n${code}\n\`\`\``);
    setCustomCode('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 dark:border-zinc-700">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Code2 className="text-indigo-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Insert Mermaid Diagram
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Diagram Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(templates).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setDiagramType(type);
                    setCustomCode('');
                  }}
                  className={`p-3 rounded-lg border-2 transition capitalize font-medium ${
                    diagramType === type
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                      : 'border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Diagram Code
            </label>
            <textarea
              value={customCode || templates[diagramType]}
              onChange={(e) => setCustomCode(e.target.value)}
              className="w-full h-40 px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-none"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleInsert}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium flex items-center gap-2"
            >
              <Code2 size={16} />
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const DocumentEdit = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") || 'guest';

  const [document, setDocument] = useState(null);
  const [content, setContent] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showMermaidModal, setShowMermaidModal] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [viewMode, setViewMode] = useState('edit');
  const textareaRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (documentId && userId !== 'guest') {
      fetchDocument();
    }
  }, [documentId, userId]);

  useEffect(() => {
    if (document && (document.status === 'Pending' || document.status === 'Generating')) {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      
      pollIntervalRef.current = setInterval(() => {
        fetchDocument();
      }, 2000);

      return () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      };
    }
  }, [document?.status]);

  const fetchDocument = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/documents/generation/${userId}/${documentId}`
      );
      const data = await res.json();

      if (res.ok) {
        if (document && document.status !== data.status) {
          if (data.status === 'Completed') {
            addToast('✅ Document completed!', 'success');
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          } else if (data.status === 'Failed') {
            addToast('❌ Generation failed', 'error');
          }
        }

        setDocument(data);
        setContent(data.content || '');
        setDocumentName(data.name || '');
        setRegenerating(false);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      addToast('Failed to load document', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveDocument = async () => {
    if (!documentName.trim()) {
      addToast('Please enter a name', 'warning');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `${API_BASE}/documents/generation/${userId}/${documentId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: documentName, content })
        }
      );

      if (res.ok) {
        addToast('✅ Saved!', 'success');
      } else {
        throw new Error('Save failed');
      }
    } catch (error) {
      addToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const regenerateDocument = async () => {
    setRegenerating(true);
    try {
      const res = await fetch(
        `${API_BASE}/documents/generation/${userId}/${documentId}/regenerate`,
        { method: 'POST' }
      );
      const data = await res.json();

      if (res.ok) {
        addToast('⏳ Regenerating...', 'info');
        await fetchDocument();
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      addToast('Failed to regenerate', 'error');
      setRegenerating(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await fetch(
        `${API_BASE}/documents/generation/${userId}/${documentId}/pdf`,
        { headers: { 'Accept': 'application/pdf' } }
      );

      if (!response.ok) {
        const error = await response.json();
        addToast(error.error || 'Download failed', 'error');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${documentName.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      addToast('✅ PDF downloaded!', 'success');
    } catch (error) {
      addToast('Download failed', 'error');
    }
  };

  const viewPDF = () => {
    window.open(
      `${API_BASE}/documents/generation/${userId}/${documentId}/pdf-view`,
      '_blank'
    );
  };

  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      setSelectedText(content.substring(start, end));
    }
  };

  const applyAIChanges = (newContent) => {
    if (selectedText && textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const before = content.substring(0, start);
      const after = content.substring(end);
      setContent(before + newContent + after);
    } else {
      setContent(newContent);
    }
    addToast('✅ Changes applied!', 'success');
    setSelectedText('');
  };

  const handleMermaidInsert = (diagram) => {
    if (textareaRef.current) {
      const cursorPos = textareaRef.current.selectionStart;
      const before = content.substring(0, cursorPos);
      const after = content.substring(cursorPos);
      setContent(before + '\n\n' + diagram + '\n\n' + after);
    } else {
      setContent(content + '\n\n' + diagram + '\n\n');
    }
    addToast('✅ Diagram added!', 'success');
  };

  if (loading) {
    return (
      <div className="p-6 space-y-8 h-screen bg-gray-50 dark:bg-black">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 dark:bg-zinc-800 rounded-xl w-1/3"></div>
          <div className="h-96 bg-gray-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500 mb-4">Document not found</p>
        <button
          onClick={() => navigate('/dashboard/documents')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Back
        </button>
      </div>
    );
  }

  const isProcessing = document.status === 'Pending' || document.status === 'Generating' || regenerating;
  const mermaidBlocks = content.match(/```mermaid\n([\s\S]*?)\n```/g) || [];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <AIAssistantModal
        isOpen={showAIModal}
        onClose={() => { setShowAIModal(false); setSelectedText(''); }}
        selectedText={selectedText}
        documentId={documentId}
        userId={userId}
        onApply={applyAIChanges}
      />
      <MermaidInsertModal
        isOpen={showMermaidModal}
        onClose={() => setShowMermaidModal(false)}
        onInsert={handleMermaidInsert}
      />

      <div className="p-6 space-y-8 bg-gray-50 dark:bg-black min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard/documents')}
              className="p-2 rounded-lg bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 border border-gray-200 dark:border-zinc-700"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Edit Document
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {document.templateName} • {new Date(document.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={viewPDF}
              disabled={document.status !== 'Completed'}
              className="px-4 py-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600/20 disabled:opacity-50 flex items-center gap-2 text-sm font-medium border border-blue-200 dark:border-blue-900"
              title="View in browser"
            >
              <Eye size={16} />
              View
            </button>

            <button
              onClick={downloadPDF}
              disabled={document.status !== 'Completed'}
              className="px-4 py-2.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600/20 disabled:opacity-50 flex items-center gap-2 text-sm font-medium border border-purple-200 dark:border-purple-900"
              title="Download to device"
            >
              <Download size={16} />
              Download
            </button>

            <button
              onClick={regenerateDocument}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-green-600/10 text-green-600 dark:text-green-400 hover:bg-green-600/20 disabled:opacity-50 flex items-center gap-2 text-sm font-medium border border-green-200 dark:border-green-900"
            >
              <RefreshCw size={16} className={isProcessing ? 'animate-spin' : ''} />
              {regenerating ? 'Regenerating...' : 'Regenerate'}
            </button>

            <button
              onClick={saveDocument}
              disabled={saving || isProcessing}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
            >
              {saving && <Loader2 size={16} className="animate-spin" />}
              <Save size={16} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Status Banner */}
        {isProcessing && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Document is {document.status.toLowerCase()}...
            </p>
          </div>
        )}

        {/* Document Name */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Document Name
          </label>
          <input
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            disabled={isProcessing}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              viewMode === 'edit'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-4 py-2 rounded-xl font-medium transition ${
              viewMode === 'preview'
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-zinc-700'
            }`}
          >
            Preview
          </button>
        </div>

        {/* Content Editor / Preview */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {viewMode === 'edit' ? 'Document Content' : 'Preview'}
            </h2>
            {viewMode === 'edit' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setShowMermaidModal(true)}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-lg bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-600/20 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                >
                  <Code2 size={16} />
                  Add Diagram
                </button>
                <button
                  onClick={() => selectedText.length > 0 && setShowAIModal(true)}
                  disabled={selectedText.length === 0 || isProcessing}
                  className="px-4 py-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:shadow-lg disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                  title={selectedText.length === 0 ? 'Select text to edit' : 'Edit selected text with AI'}
                >
                  <Sparkles size={16} />
                  {selectedText.length > 0 ? 'Edit Selection' : 'Edit with AI'}
                </button>
              </div>
            )}
          </div>

          <div className="p-6">
            {viewMode === 'edit' ? (
              content ? (
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onSelect={handleTextSelection}
                  disabled={isProcessing}
                  className="w-full min-h-[600px] px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed resize-none font-mono disabled:opacity-50"
                  placeholder="Document content will appear here..."
                />
              ) : (
                <div className="flex items-center justify-center min-h-[600px]">
                  <div className="text-center">
                    <RefreshCw size={48} className="mx-auto mb-4 opacity-30 animate-spin" />
                    <p className="text-gray-500">Waiting for document generation...</p>
                  </div>
                </div>
              )
            ) : (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="space-y-6">
                  {content.split('\n\n').map((section, idx) => {
                    if (section.includes('```mermaid')) {
                      const mermaidMatch = section.match(/```mermaid\n([\s\S]*?)\n```/);
                      if (mermaidMatch) {
                        return (
                          <div key={idx} className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-700 overflow-x-auto">
                            <MermaidRenderer content={mermaidMatch[1]} />
                          </div>
                        );
                      }
                    }
                    return (
                      <div key={idx} className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                        {section}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Document Information
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                {document.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Template</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                {document.templateName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                {new Date(document.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                {new Date(document.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Input Values */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Template Input Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(document.fieldValues || {}).map(([key, value]) => (
              <div key={key} className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-4 border border-gray-100 dark:border-zinc-700">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100 break-words">
                  {String(value || '—')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://cdn.jsdelivr.net/npm/mermaid@latest/dist/mermaid.min.css');
        
        .mermaid {
          display: flex;
          justify-content: center;
          margin: 1rem 0;
        }

        .prose {
          color: inherit;
        }

        .prose h1, .prose h2, .prose h3 {
          color: inherit;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .prose p {
          margin: 0.5rem 0;
        }

        .prose strong {
          font-weight: 600;
        }

        .prose em {
          font-style: italic;
        }

        .prose ul, .prose ol {
          margin-left: 1.5rem;
          margin-top: 0.5rem;
        }

        .prose li {
          margin: 0.25rem 0;
        }
      `}</style>
    </>
  );
};

export default DocumentEdit;