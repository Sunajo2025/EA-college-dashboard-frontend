/**
 * AI Extraction Page
 * AI Platform Dashboard
 */

import { useState } from 'react';

/* ---------- DATA ---------- */

const stats = [
  { label: 'Extraction Templates', value: 8 },
  { label: 'Active Jobs', value: 3 },
  { label: 'Fields Extracted', value: 142 },
  { label: 'Success Rate', value: '96%' },
];

const initialExtractions = [
  {
    id: 1,
    name: 'Invoice Extraction',
    document: 'Invoice_Jan_2025.pdf',
    status: 'Completed',
    fields: 12,
    updated: 'Today',
  },
  {
    id: 2,
    name: 'HR Profile Extraction',
    document: 'Employee_Data.docx',
    status: 'Processing',
    fields: '—',
    updated: 'Just now',
  },
  {
    id: 3,
    name: 'Contract Metadata',
    document: 'Agreement.pdf',
    status: 'Failed',
    fields: 0,
    updated: 'Yesterday',
  },
];

const statusStyle = {
  Completed:
    'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400',
  Processing:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400',
  Failed:
    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

/* ---------- COMPONENT ---------- */

const AIExtraction = () => {
  const [jobs, setJobs] = useState(initialExtractions);
  const [processingId, setProcessingId] = useState(null);
  const [previewJob, setPreviewJob] = useState(null);

  /* ---------- ACTIONS ---------- */

  const rerunExtraction = (id) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, status: 'Processing', fields: '—', updated: 'Processing' }
          : j
      )
    );
    setProcessingId(id);

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id
            ? {
                ...j,
                status: 'Completed',
                fields: Math.floor(Math.random() * 15 + 5),
                updated: 'Just now',
              }
            : j
        )
      );
      setProcessingId(null);
    }, 3000);
  };

  /* ---------- UI ---------- */

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          AI Extraction
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Extract structured data from documents using AI
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700"
          >
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-semibold text-indigo-600 mt-1">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600">
            <tr>
              <th className="px-6 py-3 w-2/6 text-left">Extraction</th>
              <th className="px-6 py-3 w-2/6 text-left">Document</th>
              <th className="px-6 py-3 w-1/6 text-left">Status</th>
              <th className="px-6 py-3 w-1/12 text-left">Fields</th>
              <th className="px-6 py-3 w-1/6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
            {jobs.map((job) => {
              const loading = job.id === processingId;

              return (
                <tr key={job.id} className="relative">
                  <td className="px-6 py-4 font-medium truncate">
                    {job.name}
                  </td>

                  <td className="px-6 py-4 truncate">
                    {job.document}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${statusStyle[job.status]}`}
                    >
                      {loading && (
                        <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      )}
                      {job.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {loading ? '—' : job.fields}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setPreviewJob(job)}
                        className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-700 text-xs font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => rerunExtraction(job.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 text-xs font-medium"
                      >
                        Re-run
                      </button>
                    </div>
                  </td>

                  {/* Skeleton */}
                  {loading && (
                    <td
                      colSpan={5}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse pointer-events-none"
                    />
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {previewJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold">
              Extracted Fields
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {Array.from({ length: previewJob.fields || 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800"
                >
                  Field {i + 1}: Value
                </div>
              ))}
            </div>

            <button
              onClick={() => setPreviewJob(null)}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium"
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
