import { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, Search, X } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:5000';

/* ---------- TOAST COMPONENT ---------- */
const Toast = ({ message, type, onClose }) => {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    delete: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  };

  return (
    <div className={`px-4 py-3 rounded-lg border ${styles[type]} flex items-center justify-between gap-3 shadow-lg`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="text-current opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[200] space-y-2 max-w-md">
    {toasts.map((toast) => (
      <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
    ))}
  </div>
);

/* ---------- SKELETON LOADER ---------- */
const SkeletonLoader = ({ type, count = 1 }) => {
  if (type === 'card') {
    return (
      <div className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-16"></div>
      </div>
    );
  }

  if (type === 'table-row') {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <tr key={i}>
            <td colSpan={6} className="px-6 py-4">
              <div className="flex items-center gap-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-16"></div>
                <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-24"></div>
                <div className="h-8 bg-gray-200 dark:bg-zinc-700 rounded w-20"></div>
              </div>
            </td>
          </tr>
        ))}
      </>
    );
  }

  return null;
};

/* ---------- DELETE MODAL ---------- */
const DeleteKnowledgeBaseModal = ({ isOpen, onClose, onConfirm, documentName, botsToDelete, botsToUpdate }) => {
  if (!isOpen) return null;

  const totalAffected = botsToDelete.length + botsToUpdate.length;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-[151] p-4">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-zinc-700">
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <Trash2 className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Delete Knowledge Base
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  You are about to delete <span className="font-semibold text-gray-900 dark:text-gray-100">"{documentName}"</span>. This action cannot be undone.
                </p>

                {totalAffected > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                    <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
                    Affected Chatbots ({totalAffected})
                    </p>
                    
                    {botsToDelete.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-medium text-yellow-700 dark:text-yellow-500 mb-1">
                          Will be deleted (using only this knowledge base):
                        </p>
                        <ul className="space-y-1">
                          {botsToDelete.map(bot => (
                            <li key={bot.id} className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                              {bot.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {botsToUpdate.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-yellow-700 dark:text-yellow-500 mb-1">
                          Will be updated (this knowledge base will be removed):
                        </p>
                        <ul className="space-y-1">
                          {botsToUpdate.map(bot => (
                            <li key={bot.id} className="text-sm text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                              {bot.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {totalAffected === 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      ℹ️ No chatbots are using this knowledge base.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 pt-0">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700 transition font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium"
            >
              Delete {totalAffected > 0 && `(${totalAffected} chatbot${totalAffected > 1 ? 's' : ''} affected)`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* ---------- CONSTANTS ---------- */

const statusStyle = {
  Processed:
    'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  Processing:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
};

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';

const selectClass = inputClass;

/* ---------- COMPONENT ---------- */

const KnowledgeBase = () => {
  const userId = sessionStorage.getItem("userId") || 'guest';

  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalChunks: 0,
    lastUpdated: 'Never',
    health: 'No Data'
  });

  const [documents, setDocuments] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarMode, setSidebarMode] = useState('upload');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    document: null,
    botsToDelete: [],
    botsToUpdate: []
  });

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const [form, setForm] = useState({
    file: null,
    fileName: '',
    sourceType: 'File',
    chunkSize: 500,
    overlap: 50,
    language: 'English',
  });

  /* ---------- FETCH DATA ---------- */

  useEffect(() => {
    if (userId && userId !== 'guest') {
      fetchStats();
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
      const res = await fetch(`${API_BASE}/knowledge/stats/${userId}`);
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
      const res = await fetch(`${API_BASE}/knowledge/documents/${userId}`);
      const data = await res.json();

      if (res.ok) {
        setDocuments(data.documents);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- SIDEBAR HANDLERS ---------- */

  const openUploadSidebar = () => {
    setForm({
      file: null,
      fileName: '',
      sourceType: 'File',
      chunkSize: 500,
      overlap: 50,
      language: 'English',
    });
    setStep(1);
    setSidebarMode('upload');
    setShowSidebar(true);
  };

  const openDetailsSidebar = async (documentId) => {
    try {
      const res = await fetch(
        `${API_BASE}/knowledge/documents/${userId}/${documentId}`
      );
      const data = await res.json();

      if (res.ok) {
        setSelectedDocument(data);
        setSidebarMode('details');
        setShowSidebar(true);
      }
    } catch (error) {
      console.error('Failed to fetch document details:', error);
      addToast('Failed to load document details', 'error');
    }
  };

  const closeSidebar = () => {
    setShowSidebar(false);
    setTimeout(() => {
      setSelectedDocument(null);
      setSidebarMode('upload');
      setStep(1);
    }, 300);
  };

  /* ---------- UPLOAD DOCUMENT ---------- */

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, file, fileName: file.name });
    }
  };

  const uploadDocument = async () => {
    if (!form.file) {
      addToast('Please select a file', 'warning');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', form.file);
    formData.append('userId', userId);
    formData.append('chunkSize', form.chunkSize);
    formData.append('overlap', form.overlap);
    formData.append('language', form.language);

    try {
      const res = await fetch(`${API_BASE}/knowledge/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      await fetchStats();
      await fetchDocuments();

      closeSidebar();
      addToast('Document uploaded and processed successfully!', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to upload document', 'error');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  /* ---------- DELETE DOCUMENT ---------- */

  const initiateDelete = async (doc) => {
    try {
      const res = await fetch(`${API_BASE}/chatbots/${userId}`);
      const data = await res.json();

      console.log('Chatbots fetched:', data);
      console.log('Document to delete:', doc);

      let botsToDelete = [];
      let botsToUpdate = [];

      const targetDocId = String(doc.documentId);
      console.log('Target document ID:', targetDocId);

      if (res.ok && Array.isArray(data.chatbots)) {
        // Fetch full details for each chatbot to get knowledgeSources array
        for (const bot of data.chatbots) {
          try {
            const detailRes = await fetch(`${API_BASE}/chatbots/${userId}/${bot.chatbotId}`);
            const detailData = await detailRes.json();
            
            if (detailRes.ok && detailData.chatbot) {
              const fullBot = detailData.chatbot;
              const sources = fullBot.knowledgeSources || [];
              
              console.log(`Bot: ${bot.name}, Full sources:`, sources);
              
              // Convert all sources to strings for comparison
              const sourcesAsStrings = sources.map(s => String(s));
              
              if (sourcesAsStrings.includes(targetDocId)) {
                console.log(`✓ Bot "${bot.name}" uses this KB`);
                if (sources.length === 1) {
                  botsToDelete.push({ id: bot.chatbotId, name: bot.name });
                  console.log(`  → Will DELETE bot: ${bot.name}`);
                } else {
                  botsToUpdate.push({
                    id: bot.chatbotId,
                    name: bot.name,
                    currentSources: sources
                  });
                  console.log(`  → Will UPDATE bot: ${bot.name} (remove this KB only)`);
                }
              }
            }
          } catch (err) {
            console.error(`Failed to fetch details for bot ${bot.name}:`, err);
          }
        }
      }

      console.log('Final - Bots to delete:', botsToDelete);
      console.log('Final - Bots to update:', botsToUpdate);

      setDeleteModal({
        isOpen: true,
        document: doc,
        botsToDelete,
        botsToUpdate
      });
    } catch (error) {
      console.error('Failed to fetch affected chatbots:', error);
      setDeleteModal({
        isOpen: true,
        document: doc,
        botsToDelete: [],
        botsToUpdate: []
      });
    }
  };

  const confirmDelete = async () => {
    const documentId = deleteModal.document?.documentId;
    if (!documentId) return;

    try {
      const toDelete = deleteModal.botsToDelete || [];
      for (const bot of toDelete) {
        await fetch(`${API_BASE}/chatbots/${userId}/${bot.id}`, {
          method: 'DELETE',
        });
      }

      const toUpdate = deleteModal.botsToUpdate || [];
      const targetIdStr = String(documentId);
      for (const bot of toUpdate) {
        const updatedSources = (bot.currentSources || []).filter(id => String(id) !== targetIdStr);
        await fetch(`${API_BASE}/chatbots/${userId}/${bot.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ knowledgeSources: updatedSources })
        });
      }

      const res = await fetch(
        `${API_BASE}/knowledge/documents/${userId}/${documentId}`,
        { method: 'DELETE' }
      );

      if (res.ok) {
        await fetchStats();
        await fetchDocuments();

        const deleteCount = (deleteModal.botsToDelete || []).length;
        const updateCount = (deleteModal.botsToUpdate || []).length;
        const msg = (deleteCount + updateCount) > 0
          ? `Document deleted. ${deleteCount} chatbot(s) removed, ${updateCount} chatbot(s) updated.`
          : 'Document deleted successfully';

        addToast(msg, 'delete');
        setDeleteModal({ isOpen: false, document: null, botsToDelete: [], botsToUpdate: [] });
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      addToast('Failed to complete deletion process', 'error');
      console.error('Delete error:', error);
    }
  };

  /* ---------- SEARCH ---------- */

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/knowledge/search/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();

      if (res.ok) {
        setSearchResults(data.results);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  /* ---------- UI ---------- */

  const statCards = [
    { label: 'Total Documents', value: stats.totalDocuments },
    { label: 'Total Chunks', value: stats.totalChunks },
    { label: 'Last Updated', value: stats.lastUpdated },
    { label: 'Knowledge Health', value: stats.health },
  ];

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <DeleteKnowledgeBaseModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDelete}
        documentName={deleteModal.document?.name || ''}
        botsToDelete={deleteModal.botsToDelete}
        botsToUpdate={deleteModal.botsToUpdate}
      />

      <div className="p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Knowledge Base
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage documents used to train your AI chatbots
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
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

        {/* Search Bar */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-4">
          <div className="flex gap-3">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch()}
              placeholder="Search across all documents..."
              className={inputClass}
            />
            <button
              onClick={performSearch}
              disabled={searching || !searchQuery.trim()}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Search size={18} />
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Results ({searchResults.length})
              </p>
              {searchResults.map((result) => (
                <div
                  key={result.chunkId}
                  className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg"
                >
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                    {result.documentName} - Chunk {result.chunkIndex}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {result.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-500/30 p-6 text-center">
          <Upload className="mx-auto text-indigo-600 dark:text-indigo-400 mb-3" size={32} />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Upload documents
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            PDF, DOCX, TXT supported • Max 10MB
          </p>
          <button
            onClick={openUploadSidebar}
            className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
          >
            Upload Document
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 text-left">Document</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Chunks</th>
                <th className="px-6 py-3 text-left">Updated</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
              {loading ? (
                <SkeletonLoader type="table-row" count={6} />
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                    No documents uploaded yet
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.documentId}
                    className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {doc.name}
                    </td>

                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {doc.type}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusStyle[doc.status]}`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                      {doc.chunks}
                    </td>

                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {doc.updated}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openDetailsSidebar(doc.documentId)}
                          className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600/20 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => initiateDelete(doc)}
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

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Right Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-[560px] bg-white dark:bg-zinc-900 shadow-2xl z-[101] transform transition-transform duration-300 ease-in-out ${showSidebar ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {sidebarMode === 'upload'
                ? 'Create Knowledge Source'
                : selectedDocument?.document.name || 'Document Details'}
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

            {/* Upload Mode */}
            {sidebarMode === 'upload' && (
              <div className="space-y-6 sidebar-content">
                {/* Step Indicator */}
                <div className="flex gap-3 text-sm">
                  {['Source', 'Processing', 'Review'].map((s, i) => (
                    <div
                      key={s}
                      className={`flex-1 p-2 rounded-lg text-center ${step === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
                        }`}
                    >
                      {s}
                    </div>
                  ))}
                </div>

                {/* Step 1 - File Selection */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select File
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
                      />
                      {form.fileName && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Selected: {form.fileName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Source Type
                      </label>
                      <select
                        value={form.sourceType}
                        onChange={(e) =>
                          setForm({ ...form, sourceType: e.target.value })
                        }
                        className={selectClass}
                      >
                        <option>File</option>
                        <option>Website URL</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2 - Processing Settings */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Chunk Size
                        </label>
                        <input
                          type="number"
                          value={form.chunkSize}
                          onChange={(e) =>
                            setForm({ ...form, chunkSize: e.target.value })
                          }
                          className={inputClass}
                          placeholder="500"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Words per chunk</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Overlap
                        </label>
                        <input
                          type="number"
                          value={form.overlap}
                          onChange={(e) =>
                            setForm({ ...form, overlap: e.target.value })
                          }
                          className={inputClass}
                          placeholder="50"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Overlapping words</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={form.language}
                        onChange={(e) =>
                          setForm({ ...form, language: e.target.value })
                        }
                        className={selectClass}
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 3 - Review */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">File:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.fileName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Chunk Size:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.chunkSize} words</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Overlap:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.overlap} words</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Language:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{form.language}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                      <p className="text-sm text-blue-700 dark:text-blue-400">
                        Your document will be chunked, embedded, and indexed for AI training.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Details Mode */}
            {sidebarMode === 'details' && selectedDocument && (
              <div className="space-y-6 sidebar-content">
                <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Type:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedDocument.document.type}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Total Chunks:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedDocument.document.totalChunks}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Chunk Size:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedDocument.document.chunkSize}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Overlap:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedDocument.document.overlap}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Language:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {selectedDocument.document.language}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {selectedDocument.document.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Document Chunks ({selectedDocument.chunks.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedDocument.chunks.map((chunk) => (
                      <div
                        key={chunk.chunkIndex}
                        className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700"
                      >
                        <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                          Chunk {chunk.chunkIndex + 1}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {chunk.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          {sidebarMode === 'upload' && (
            <div className="px-6 py-5 border-t border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
              <div className="flex gap-3">
                {step === 1 && (
                  <button
                    onClick={() => setStep(2)}
                    disabled={!form.file}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
                  >
                    Continue
                  </button>
                )}

                {step === 2 && (
                  <>
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-600 transition font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
                    >
                      Continue
                    </button>
                  </>
                )}

                {step === 3 && (
                  <>
                    <button
                      onClick={() => setStep(2)}
                      disabled={uploading}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-zinc-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-600 transition disabled:opacity-50 font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={uploadDocument}
                      disabled={uploading}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
                    >
                      {uploading ? 'Processing...' : 'Start Processing'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KnowledgeBase;