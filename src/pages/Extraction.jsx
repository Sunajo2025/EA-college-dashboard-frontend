import { useState, useEffect } from 'react';
import { ToastContainer } from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoaders';

/* ---------- CONFIGURATION ---------- */
const API_URL = 'http://localhost:5000';
const USER_ID = 'user123';

/* ---------- COMPONENT ---------- */

const AIExtraction = () => {
  const [stats, setStats] = useState({
    extractionTemplates: 0,
    activeJobs: 0,
    fieldsExtracted: 0,
    successRate: '0%'
  });
  const [jobs, setJobs] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [previewJob, setPreviewJob] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    file: null,
    documentType: 'invoice'
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  /* ---------- DATA FETCHING ---------- */

  useEffect(() => {
    fetchStats();
    fetchJobs();
    fetchDocumentTypes();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/extraction/stats/${USER_ID}`);
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/extraction/jobs/${USER_ID}`);
      const data = await response.json();
      if (data.jobs) {
        setJobs(data.jobs.map(job => ({
          id: job.jobId,
          name: job.name,
          document: job.document,
          status: job.status,
          fields: job.fieldsExtracted || 0,
          updated: formatDate(job.updatedAt),
          extractedData: job.extractedData || {},
          documentType: job.documentType || 'general',
          error: job.error
        })));
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentTypes = async () => {
    try {
      const response = await fetch(`${API_URL}/extraction/document-types`);
      const data = await response.json();
      if (data.documentTypes) {
        setDocumentTypes(data.documentTypes);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  /* ---------- HELPERS ---------- */

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days}d ago`;
  };

  /* ---------- ACTIONS ---------- */

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.name || !uploadForm.file) {
      addToast('Please provide a name and select a file', 'warning');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('userId', USER_ID);
      formData.append('name', uploadForm.name);
      formData.append('file', uploadForm.file);
      formData.append('documentType', uploadForm.documentType);

      const response = await fetch(`${API_URL}/extraction/run`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setShowUploadModal(false);
        setUploadForm({ name: '', file: null, documentType: 'invoice' });
        await fetchJobs();
        await fetchStats();
        addToast('Extraction started successfully!', 'success');
      } else {
        addToast(data.error || 'Upload failed', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      addToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const rerunExtraction = async (id) => {
    setProcessingId(id);

    setJobs(prev =>
      prev.map(j =>
        j.id === id
          ? { ...j, status: 'Processing', fields: 0, updated: 'Processing' }
          : j
      )
    );

    try {
      const response = await fetch(
        `${API_URL}/extraction/jobs/${USER_ID}/${id}/rerun`,
        { method: 'POST' }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchJobs();
        await fetchStats();
        addToast('Extraction re-run started!', 'update');
      } else {
        addToast(data.error || 'Rerun failed', 'error');
        await fetchJobs();
      }
    } catch (error) {
      console.error('Rerun error:', error);
      addToast('Rerun failed', 'error');
      await fetchJobs();
    } finally {
      setProcessingId(null);
    }
  };

  const deleteJob = async (id) => {
    if (!confirm('Are you sure you want to delete this extraction job?')) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/extraction/jobs/${USER_ID}/${id}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        await fetchJobs();
        await fetchStats();
        addToast('Extraction job deleted', 'delete');
      } else {
        addToast('Failed to delete job', 'error');
      }
    } catch (error) {
      console.error('Delete error:', error);
      addToast('Failed to delete job', 'error');
    }
  };

  /* ---------- STATUS STYLES ---------- */

  const statusStyle = {
    Completed:
      'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
    Processing:
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
    Failed:
      'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 space-y-8">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            AI Extraction
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Extract structured data from any document type using AI
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
        >
          + New Extraction
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <SkeletonLoader key={i} type="card" />
          ))
        ) : (
          Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-gray-200 dark:border-zinc-800"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </p>
              <p className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mt-1">
                {value}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 w-2/6 text-left font-medium">Extraction</th>
              <th className="px-6 py-3 w-2/6 text-left font-medium">Document</th>
              <th className="px-6 py-3 w-1/6 text-left font-medium">Status</th>
              <th className="px-6 py-3 w-1/12 text-left font-medium">Fields</th>
              <th className="px-6 py-3 w-1/6 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {loading ? (
              <SkeletonLoader type="table-row" count={5} />
            ) : (
              <>
                {jobs.map((job) => {
                  const isLoading = job.id === processingId;

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-950/50 transition"
                    >
                      <td className="px-6 py-4 font-medium truncate text-gray-900 dark:text-gray-100">
                        {job.name}
                      </td>

                      <td className="px-6 py-4 truncate text-gray-700 dark:text-gray-300">
                        {job.document}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusStyle[job.status]}`}
                        >
                          {isLoading && (
                            <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          )}
                          {job.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {isLoading ? '—' : job.fields}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setPreviewJob(job)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => rerunExtraction(job.id)}
                            disabled={isLoading}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Re-run
                          </button>
                          <button
                            onClick={() => deleteJob(job.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-600/20 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {jobs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No extraction jobs found. Click "New Extraction" to get started.
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              New Extraction
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Extraction Name
                </label>
                <input
                  type="text"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., January Invoice"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Document Type
                </label>
                <select
                  value={uploadForm.documentType}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, documentType: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {documentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.fieldCount} fields)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Document
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:text-sm file:font-medium hover:file:bg-indigo-700 file:cursor-pointer cursor-pointer"
                  />
                </div>
                {uploadForm.file && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Selected: {uploadForm.file.name}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/10 p-3 rounded-xl">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <strong>Supported formats:</strong> PDF, DOCX, TXT
                  <br />
                  <strong>Document types:</strong> Invoice, Resume, Contract, Receipt, ID, Medical, General
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadForm({ name: '', file: null, documentType: 'invoice' });
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !uploadForm.name || !uploadForm.file}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {uploading ? 'Extracting...' : 'Start Extraction'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-3xl rounded-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {previewJob.name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {previewJob.document}
                </p>
              </div>
              <span
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusStyle[previewJob.status]}`}
              >
                {previewJob.status}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 sticky top-0 bg-white dark:bg-zinc-900 py-2">
                Extracted Fields ({previewJob.fields})
              </h3>

              {previewJob.status === 'Failed' && previewJob.error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
                  <p className="text-sm text-red-700 dark:text-red-400">
                    <strong>Error:</strong> {previewJob.error}
                  </p>
                </div>
              )}

              {Object.keys(previewJob.extractedData).length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(previewJob.extractedData).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                    >
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        {value !== null && value !== undefined ? String(value) : (
                          <span className="text-gray-400 dark:text-gray-500 italic">Not found</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 rounded-xl">
                  {previewJob.status === 'Processing'
                    ? 'Extraction in progress...'
                    : 'No data available'}
                </div>
              )}
            </div>

            <button
              onClick={() => setPreviewJob(null)}
              className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIExtraction;