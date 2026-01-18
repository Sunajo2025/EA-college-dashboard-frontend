/**
 * Workflow Page
 * AI Platform Dashboard
 */

import { useState } from 'react';

/* ---------- DATA ---------- */

const stats = [
  { label: 'Total Workflows', value: 6 },
  { label: 'Active', value: 4 },
  { label: 'Paused', value: 2 },
  { label: 'Runs Today', value: 18 },
];

const initialWorkflows = [
  {
    id: 1,
    name: 'Invoice Processing Flow',
    trigger: 'Document Uploaded',
    steps: ['AI Extraction', 'Validation', 'Send Webhook'],
    status: true,
    lastRun: '10 mins ago',
  },
  {
    id: 2,
    name: 'HR Document Flow',
    trigger: 'Extraction Completed',
    steps: ['Update Knowledge Base', 'Notify Admin'],
    status: false,
    lastRun: 'Yesterday',
  },
];

/* ---------- COMPONENT ---------- */

const Workflow = () => {
  const [workflows, setWorkflows] = useState(initialWorkflows);
  const [selectedFlow, setSelectedFlow] = useState(null);

  const toggleStatus = (id) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id ? { ...wf, status: !wf.status } : wf
      )
    );
  };

  const runWorkflow = (id) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id ? { ...wf, lastRun: 'Running now' } : wf
      )
    );

    setTimeout(() => {
      setWorkflows((prev) =>
        prev.map((wf) =>
          wf.id === id ? { ...wf, lastRun: 'Just now' } : wf
        )
      );
    }, 2000);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Workflows
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Automate actions across documents, extraction, and chatbots
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

      {/* Branded Workflow Animation */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Workflow Execution
        </h2>

        <div className="relative flex items-center gap-6 overflow-x-auto">
          <FlowStart />

          <FlowConnector />

          <FlowNode title="AI Extraction" subtitle="Extract data" />

          <FlowConnector delay />

          <FlowNode title="Validation" subtitle="Rules check" />

          <FlowConnector delay />

          <FlowEnd />
        </div>

        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          Live visualization of how workflows execute actions step by step.
        </p>
      </div>

      {/* Workflow Table */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 w-2/6 text-left">Workflow</th>
              <th className="px-6 py-3 w-1/6 text-left">Trigger</th>
              <th className="px-6 py-3 w-2/6 text-left">Steps</th>
              <th className="px-6 py-3 w-1/6 text-left">Last Run</th>
              <th className="px-6 py-3 w-1/6 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
            {workflows.map((wf) => (
              <tr
                key={wf.id}
                className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition"
              >
                <td className="px-6 py-4 font-medium truncate text-gray-900 dark:text-gray-100">
                  {wf.name}
                </td>

                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                  {wf.trigger}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {wf.steps.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-700 text-xs text-gray-700 dark:text-gray-300"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                  {wf.lastRun}
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => runWorkflow(wf.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-600/20 transition"
                    >
                      Run
                    </button>

                    <button
                      onClick={() => toggleStatus(wf.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        wf.status
                          ? 'bg-green-600/10 text-green-600 dark:text-green-400'
                          : 'bg-gray-600/10 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {wf.status ? 'Active' : 'Paused'}
                    </button>

                    <button
                      onClick={() => setSelectedFlow(wf)}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-zinc-600 transition"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {selectedFlow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {selectedFlow.name}
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Trigger: {selectedFlow.trigger}
            </p>

            <ul className="space-y-2">
              {selectedFlow.steps.map((s, i) => (
                <li
                  key={i}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 text-sm text-gray-700 dark:text-gray-300"
                >
                  Step {i + 1}: {s}
                </li>
              ))}
            </ul>

            <button
              onClick={() => setSelectedFlow(null)}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- SMALL COMPONENTS ---------- */

const FlowConnector = ({ delay }) => (
  <div className="relative flex-1 h-[3px] bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
    <span
      className={`absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full animate-flow ${
        delay ? 'animation-delay-2000' : ''
      }`}
    />
  </div>
);

const FlowNode = ({ title, subtitle }) => (
  <div className="flex flex-col items-center min-w-[160px]">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-lg animate-pulse" />
      <div className="relative px-4 py-2 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-sm font-medium">
        {title}
      </div>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
      {subtitle}
    </span>
  </div>
);

const FlowStart = () => (
  <div className="flex flex-col items-center min-w-[140px]">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-lg animate-pulse" />
      <div className="relative px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium">
        Trigger
      </div>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
      Event Occurs
    </span>
  </div>
);

const FlowEnd = () => (
  <div className="flex flex-col items-center min-w-[160px]">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-green-500/20 blur-lg animate-pulse" />
      <div className="relative px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium">
        Action
      </div>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
      Execute Result
    </span>
  </div>
);

export default Workflow;
