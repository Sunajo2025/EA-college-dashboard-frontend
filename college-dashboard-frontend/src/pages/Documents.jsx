/**
 * Documents Page
 * AI Platform Dashboard
 */

import { useState } from 'react';

const stats = [
  { label: 'Total Documents', value: 32 },
  { label: 'Processed', value: 26 },
  { label: 'Processing', value: 4 },
  { label: 'Failed', value: 2 },
];

const initialDocs = [
  {
    id: 1,
    name: 'Invoice_Jan_2025.pdf',
    type: 'PDF',
    chatbot: 'Invoice Bot',
    status: 'Processed',
    pages: 12,
    updated: 'Today',
  },
  {
    id: 2,
    name: 'HR_Policies.docx',
    type: 'DOCX',
    chatbot: 'HR Bot',
    status: 'Processing',
    pages: '—',
    updated: 'Just now',
  },
  {
    id: 3,
    name: 'User_Agreement.pdf',
    type: 'PDF',
    chatbot: 'Legal Bot',
    status: 'Failed',
    pages: 18,
    updated: 'Yesterday',
  },
];

const statusStyle = {
  Processed:
    'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  Processing:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  Failed:
    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

const Documents = () => {
  const [docs, setDocs] = useState(initialDocs);
  const [processingId, setProcessingId] = useState(null);

  const reprocessDoc = (id) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'Processing',
              pages: '—',
              updated: 'Processing',
            }
          : d
      )
    );

    setProcessingId(id);

    setTimeout(() => {
      setDocs((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                status: 'Processed',
                pages: Math.floor(Math.random() * 20 + 5),
                updated: 'Just now',
              }
            : d
        )
      );
      setProcessingId(null);
    }, 3000);
  };

  const removeDoc = (id) =>
    setDocs((prev) => prev.filter((d) => d.id !== id));

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Documents
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          View and manage uploaded documents and their processing status
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
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

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 w-2/6 text-left">Document</th>
              <th className="px-6 py-3 w-1/12 text-left">Type</th>
              <th className="px-6 py-3 w-1/6 text-left">Chatbot</th>
              <th className="px-6 py-3 w-1/6 text-left">Status</th>
              <th className="px-6 py-3 w-1/12 text-left">Pages</th>
              <th className="px-6 py-3 w-1/6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
            {docs.map((doc) => {
              const loading = doc.id === processingId;

              return (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
                >
                  {/* Name */}
                  <td className="px-6 py-4 font-medium truncate text-gray-900 dark:text-gray-100">
                    {doc.name}
                  </td>

                  {/* Type */}
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {doc.type}
                  </td>

                  {/* Chatbot */}
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {doc.chatbot}
                  </td>

                  {/* Status */}
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

                  {/* Pages */}
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {loading ? '—' : doc.pages}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => reprocessDoc(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-600/20 transition"
                      >
                        Reprocess
                      </button>
                      <button
                        onClick={() => removeDoc(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-600/20 transition"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {docs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Documents;
