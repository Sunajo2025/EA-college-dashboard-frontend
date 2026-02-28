import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, RefreshCw, Edit, X, FileText, ClipboardList, BarChart3, Eye, Download, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { ToastContainer } from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoaders';

const API_BASE = 'http://127.0.0.1:5000';

const statusStyle = {
  Completed: 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  Generating: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  Failed: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

const inputClass = 'w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';

// Template icon mapping
const templateIcons = {
  budget_proposal: FileText,
  project_proposal: ClipboardList,
  business_report: BarChart3,
};

const Documents = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId") || 'guest';

  const [stats, setStats] = useState({
    totalDocuments: 0,
    completed: 0,
    pending: 0,
    generating: 0,
    failed: 0,
  });

  const [documents, setDocuments] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [regeneratingIds, setRegeneratingIds] = useState(new Set());
  const [toasts, setToasts] = useState([]);
  const [pollingDocuments, setPollingDocuments] = useState(new Set());

  const [form, setForm] = useState({
    documentName: '',
    fieldValues: {}
  });

  // Toast functions
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (userId && userId !== 'guest') {
      fetchStats();
      fetchDocuments();
      fetchTemplates();
    } else {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (showSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showSidebar]);

  // Auto-poll for pending/generating documents
  useEffect(() => {
    const pendingOrGenerating = documents.filter(
      doc => doc.status === 'Pending' || doc.status === 'Generating'
    );

    if (pendingOrGenerating.length > 0) {
      const interval = setInterval(() => {
        fetchDocuments();
        fetchStats();
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [documents]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents/generation/stats/${userId}`);
      const data = await res.json();

      if (res.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents/generation/${userId}`);
      const data = await res.json();

      if (res.ok) {
        // Check for newly completed documents
        const oldDocs = documents;
        const newDocs = data.documents;

        newDocs.forEach(newDoc => {
          const oldDoc = oldDocs.find(d => d.documentId === newDoc.documentId);
          if (oldDoc && oldDoc.status !== 'Completed' && newDoc.status === 'Completed') {
            addToast(`Document "${newDoc.name}" completed successfully!`, 'success');
          } else if (oldDoc && oldDoc.status !== 'Failed' && newDoc.status === 'Failed') {
            addToast(`Document "${newDoc.name}" generation failed`, 'error');
          }
        });

        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents/generation/templates`);
      const data = await res.json();

      if (res.ok) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const openSidebar = async (templateId) => {
    try {
      const res = await fetch(`${API_BASE}/documents/generation/templates/${templateId}`);
      const data = await res.json();

      if (res.ok) {
        setSelectedTemplate(data.template);

        const initialValues = {};
        data.template.fields.forEach(field => {
          initialValues[field.name] = '';
        });

        setForm({
          documentName: '',
          fieldValues: initialValues
        });

        setShowSidebar(true);
      }
    } catch (error) {
      console.error('Failed to load template:', error);
      addToast('Failed to load template', 'error');
    }
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => {
      setSelectedTemplate(null);
      setForm({ documentName: '', fieldValues: {} });
    }, 300);
  };

  const handleFieldChange = (fieldName, value) => {
    setForm(prev => ({
      ...prev,
      fieldValues: {
        ...prev.fieldValues,
        [fieldName]: value
      }
    }));
  };

  const generateDocument = async () => {
    if (!form.documentName.trim()) {
      addToast('Please enter a document name', 'warning');
      return;
    }

    for (const field of selectedTemplate.fields) {
      if (field.required && !form.fieldValues[field.name]?.trim()) {
        addToast(`Please fill in ${field.label}`, 'warning');
        return;
      }
    }

    setGenerating(true);

    try {
      const res = await fetch(`${API_BASE}/documents/generation/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          templateId: selectedTemplate.id,
          documentName: form.documentName,
          fieldValues: form.fieldValues
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate document');
      }

      await fetchStats();
      await fetchDocuments();

      closeSidebar();
      addToast('Document generation started! It will be ready shortly.', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to generate document', 'error');
      console.error('Generation error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleNavigateToEdit = (documentId) => {
    navigate(`/dashboard/documents/${documentId}/edit`);
  };

  const viewPDF = (documentId) => {
    window.open(`${API_BASE}/documents/generation/${userId}/${documentId}/pdf`, '_blank');
  };

  const downloadPDF = (documentId, documentName) => {
    const link = document.createElement('a');
    link.href = `${API_BASE}/documents/generation/${userId}/${documentId}/pdf`;
    const date = new Date().toISOString().split('T')[0];
    link.download = `${documentName.replace(/[^a-z0-9]/gi, '_')}_${date}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('PDF download started', 'success');
  };

  const regenerateDocument = async (documentId, documentName) => {
    setRegeneratingIds(prev => new Set(prev).add(documentId));

    try {
      const res = await fetch(
        `${API_BASE}/documents/generation/${userId}/${documentId}/regenerate`,
        { method: 'POST' }
      );

      const data = await res.json();

      if (res.ok) {
        setDocuments(prevDocs =>
          prevDocs.map(doc =>
            doc.documentId === documentId
              ? { ...doc, status: 'Generating' }
              : doc
          )
        );

        await fetchStats();
        // Remove from regeneratingIds after state update
        setRegeneratingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(documentId);
          return newSet;
        });

        addToast(`Regenerating "${documentName}"...`, 'info');
      } else {
        throw new Error(data.error || 'Failed to regenerate document');
      }
    } catch (error) {
      addToast('Failed to regenerate document', 'error');
      console.error('Regenerate error:', error);
      setRegeneratingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  const deleteDocument = async (documentId, documentName) => {
    try {
      const res = await fetch(
        `${API_BASE}/documents/generation/${userId}/${documentId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        await fetchStats();
        await fetchDocuments();
        addToast(`"${documentName}" deleted successfully`, 'delete');
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      addToast('Failed to delete document', 'error');
      console.error('Delete error:', error);
    }
  };

  const statCards = [
    { label: 'Total Documents', value: stats.totalDocuments },
    { label: 'Completed', value: stats.completed },
    { label: 'Pending', value: stats.pending },
    { label: 'Generating', value: stats.generating },
    { label: 'Failed', value: stats.failed },
  ];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Documents
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Generate and manage AI-powered documents from templates
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">

          {loading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <SkeletonLoader key={i} type="card" />
            ))
          ) : (
            statCards.map((s) => (
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
            ))
          )}
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Generate New Document
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              [1, 2, 3].map((i) => (
                <SkeletonLoader key={i} type="card" />
              ))
            ) : (
              templates.map((template) => {
                const IconComponent = templateIcons[template.id] || FileText;
                return (
                  <button
                    key={template.id}
                    onClick={() => openSidebar(template.id)}
                    className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6 text-left hover:border-indigo-300 dark:hover:border-indigo-600 transition"
                  >
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-4">
                      <IconComponent className="text-indigo-600 dark:text-indigo-400" size={24} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {template.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      <Plus size={14} />
                      <span>Create Document</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Generated Documents
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3 text-left">Document Name</th>
                  <th className="px-6 py-3 text-left">Template</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
                {loading ? (
                  <SkeletonLoader type="table-row" count={5} />
                ) : documents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No documents generated yet
                    </td>
                  </tr>
                ) : (
                  documents.map((doc) => {
                    const isRegenerating = regeneratingIds.has(doc.documentId);
                    // Force 'Generating' status if currently regenerating locally
                    const displayStatus = isRegenerating ? 'Generating' : doc.status;
                    const isProcessing = displayStatus === 'Generating' || displayStatus === 'Pending';

                    return (
                      <tr key={doc.documentId}>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                          {doc.name}
                        </td>

                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                          {doc.templateName}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusStyle[displayStatus]}`}
                          >
                            {isProcessing && (
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            )}
                            {displayStatus}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => viewPDF(doc.documentId)}
                              disabled={doc.status !== 'Completed'}
                              className="p-2 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600/20 transition"
                              title="View PDF"
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => downloadPDF(doc.documentId, doc.name)}
                              disabled={doc.status !== 'Completed'}
                              className="p-2 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-purple-600/20 transition"
                              title="Download PDF"
                            >
                              <Download size={16} />
                            </button>

                            <button
                              onClick={() => handleNavigateToEdit(doc.documentId)}
                              disabled={doc.status !== 'Completed'}
                              className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-600/20 transition"
                              title="Edit Document"
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              onClick={() => regenerateDocument(doc.documentId, doc.name)}
                              disabled={isProcessing}
                              className="p-2 rounded-lg bg-green-600/10 text-green-600 dark:text-green-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-600/20 transition"
                              title="Regenerate"
                            >
                              {isRegenerating || doc.status === 'Generating' ? (
                                <RefreshCw size={16} className="animate-spin" />
                              ) : (
                                <RefreshCw size={16} />
                              )}
                            </button>

                            <button
                              onClick={() => deleteDocument(doc.documentId, doc.name)}
                              disabled={isProcessing}
                              className="p-2 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-600/20 transition"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[600px] bg-white dark:bg-zinc-900 shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {selectedTemplate && (
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                  {(() => {
                    const IconComponent = templateIcons[selectedTemplate.id] || FileText;
                    return <IconComponent className="text-indigo-600 dark:text-indigo-400" size={20} />;
                  })()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTemplate.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedTemplate.description}
                  </p>
                </div>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sidebar-scroll">
              <style>{`
                .sidebar-scroll::-webkit-scrollbar {
                  width: 6px;
                }
                .sidebar-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb {
                  background: #d1d5db;
                  border-radius: 3px;
                }
                .dark .sidebar-scroll::-webkit-scrollbar-thumb {
                  background: #52525b;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                  background: #9ca3af;
                }
                .dark .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                  background: #71717a;
                }
                .sidebar-scroll {
                  scrollbar-width: thin;
                  scrollbar-color: #d1d5db transparent;
                }
                .dark .sidebar-scroll {
                  scrollbar-color: #52525b transparent;
                }
              `}</style>

              <div className="space-y-6">
                {/* Document Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Document Name *
                  </label>
                  <input
                    value={form.documentName}
                    onChange={(e) => setForm({ ...form, documentName: e.target.value })}
                    placeholder="e.g., Q1 2025 Budget Proposal"
                    className={inputClass}
                  />
                </div>

                {/* Template Fields */}
                {selectedTemplate.fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {field.label} {field.required && '*'}
                    </label>

                    {field.type === 'textarea' ? (
                      <textarea
                        value={form.fieldValues[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ''}
                        rows={4}
                        className={inputClass}
                      />
                    ) : field.type === 'number' ? (
                      <input
                        type="number"
                        value={form.fieldValues[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className={inputClass}
                      />
                    ) : (
                      <input
                        type="text"
                        value={form.fieldValues[field.name] || ''}
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        placeholder={field.placeholder || ''}
                        className={inputClass}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Footer */}
            <div className="px-6 py-5 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
              <div className="flex gap-3">
                <button
                  onClick={closeSidebar}
                  disabled={generating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-600 disabled:opacity-50 font-medium hover:bg-gray-50 dark:hover:bg-zinc-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={generateDocument}
                  disabled={generating || !form.documentName.trim()}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-50 font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                >
                  {generating && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {generating ? 'Generating...' : 'Generate Document'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Documents;