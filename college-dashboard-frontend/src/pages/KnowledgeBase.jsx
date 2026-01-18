/**
 * Knowledge Base Page
 * AI Platform Dashboard
 */

import { useState } from 'react';

/* ---------- CONSTANTS ---------- */

const statCards = [
  { label: 'Total Documents', value: 18 },
  { label: 'Total Chunks', value: 1240 },
  { label: 'Last Trained', value: '2 hours ago' },
  { label: 'Knowledge Health', value: 'Good' },
];

const initialDocuments = [
  {
    id: 1,
    name: 'FAQs.pdf',
    type: 'PDF',
    status: 'Processed',
    chunks: 320,
    updated: 'Today',
  },
];

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
  const [documents, setDocuments] = useState(initialDocuments);
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState(1);
  const [processingId, setProcessingId] = useState(null);

  const [form, setForm] = useState({
    name: '',
    sourceType: 'File',
    chunkSize: 500,
    overlap: 50,
    language: 'English',
  });

  /* ---------- ACTIONS ---------- */

  const startProcessing = () => {
    const id = Date.now();

    setDocuments((prev) => [
      {
        id,
        name: form.name,
        type: form.name.split('.').pop()?.toUpperCase() || 'FILE',
        status: 'Processing',
        chunks: '—',
        updated: 'Processing',
      },
      ...prev,
    ]);

    setProcessingId(id);
    setShowModal(false);
    setStep(1);

    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: 'Processed',
                chunks: Math.floor(Math.random() * 300 + 150),
                updated: 'Just now',
              }
            : d
        )
      );
      setProcessingId(null);
    }, 3000);
  };

  const removeDoc = (id) =>
    setDocuments((prev) => prev.filter((d) => d.id !== id));

  /* ---------- UI ---------- */

  return (
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
        {statCards.map((s) => (
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

      {/* Upload */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-500/30 p-6 text-center">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Upload documents
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          PDF, DOCX, TXT supported
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
        >
          Upload Document
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 w-2/6 text-left">Document</th>
              <th className="px-6 py-3 w-1/12 text-left">Type</th>
              <th className="px-6 py-3 w-1/6 text-left">Status</th>
              <th className="px-6 py-3 w-1/12 text-left">Chunks</th>
              <th className="px-6 py-3 w-1/6 text-left">Updated</th>
              <th className="px-6 py-3 w-1/6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
            {documents.map((doc) => {
              const loading = doc.id === processingId;

              return (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
                >
                  <td className="px-6 py-4 font-medium truncate text-gray-900 dark:text-gray-100">
                    {doc.name}
                  </td>

                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {doc.type}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusStyle[doc.status]}`}
                    >
                      {loading && (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      )}
                      {doc.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {loading ? '—' : doc.chunks}
                  </td>

                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {doc.updated}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => removeDoc(doc.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-600/20 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}

            {documents.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No documents uploaded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Create Knowledge Source
            </h2>

            {/* Step Indicator */}
            <div className="flex gap-3 text-sm">
              {['Source', 'Processing', 'Review'].map((s, i) => (
                <div
                  key={s}
                  className={`flex-1 p-2 rounded-lg text-center ${
                    step === i + 1
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {s}
                </div>
              ))}
            </div>

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <input
                  placeholder="Document name (example.pdf)"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className={inputClass}
                />

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

                <button
                  disabled={!form.name}
                  onClick={() => setStep(2)}
                  className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  value={form.chunkSize}
                  onChange={(e) =>
                    setForm({ ...form, chunkSize: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Chunk Size"
                />

                <input
                  type="number"
                  value={form.overlap}
                  onChange={(e) =>
                    setForm({ ...form, overlap: e.target.value })
                  }
                  className={inputClass}
                  placeholder="Overlap"
                />

                <div className="sm:col-span-2 flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-700"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your document will be chunked, embedded, and indexed.
                </p>
                <button
                  onClick={startProcessing}
                  className="w-full px-4 py-2.5 rounded-xl bg-indigo-600 text-white"
                >
                  Start Processing
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setShowModal(false);
                setStep(1);
              }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
