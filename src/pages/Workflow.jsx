import { useState, useEffect } from 'react';
import SkeletonLoader from '../components/SkeletonLoaders';

/* ---------- CONFIGURATION ---------- */
const API_URL = 'http://localhost:5000';
const USER_ID = 'user123';

/* ---------- COMPONENT ---------- */

const Workflow = () => {
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    active: 0,
    paused: 0,
    runsToday: 0
  });
  const [workflows, setWorkflows] = useState([]);
  const [triggers, setTriggers] = useState([]);
  const [actions, setActions] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState(null);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(null);
  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    triggerType: 'extraction_completed',
    steps: []
  });

  /* ---------- DATA FETCHING ---------- */

  useEffect(() => {
    fetchStats();
    fetchWorkflows();
    fetchTriggers();
    fetchActions();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/workflows/stats/${USER_ID}`);
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/workflows/${USER_ID}`);
      const data = await response.json();
      if (data.workflows) {
        setWorkflows(data.workflows.map(wf => ({
          ...wf,
          lastRun: wf.lastRun ? formatDate(wf.lastRun) : 'Never'
        })));
      }
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTriggers = async () => {
    try {
      const response = await fetch(`${API_URL}/workflows/triggers`);
      const data = await response.json();
      if (data.triggers) {
        setTriggers(data.triggers);
      }
    } catch (error) {
      console.error('Error fetching triggers:', error);
    }
  };

  const fetchActions = async () => {
    try {
      const response = await fetch(`${API_URL}/workflows/actions`);
      const data = await response.json();
      if (data.actions) {
        setActions(data.actions);
      }
    } catch (error) {
      console.error('Error fetching actions:', error);
    }
  };

  const fetchExecutionHistory = async (workflowId) => {
    try {
      const response = await fetch(`${API_URL}/workflows/${USER_ID}/${workflowId}/executions`);
      const data = await response.json();
      if (data.executions) {
        setExecutionHistory(data.executions);
      }
    } catch (error) {
      console.error('Error fetching execution history:', error);
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

  const toggleStatus = async (workflowId) => {
    try {
      const response = await fetch(
        `${API_URL}/workflows/${USER_ID}/${workflowId}/toggle`,
        { method: 'POST' }
      );

      if (response.ok) {
        await fetchWorkflows();
        await fetchStats();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const runWorkflow = async (workflowId) => {
    setExecuting(workflowId);

    try {
      const response = await fetch(
        `${API_URL}/workflows/${USER_ID}/${workflowId}/execute`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: {} })
        }
      );

      const data = await response.json();

      if (response.ok) {
        await fetchWorkflows();
        await fetchStats();
        alert('Workflow executed successfully!');
      } else {
        alert(data.error || 'Execution failed');
      }
    } catch (error) {
      console.error('Execution error:', error);
      alert('Execution failed');
    } finally {
      setExecuting(null);
    }
  };

  const deleteWorkflow = async (workflowId) => {
    if (!confirm('Are you sure you want to delete this workflow?')) return;

    try {
      const response = await fetch(
        `${API_URL}/workflows/${USER_ID}/${workflowId}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        await fetchWorkflows();
        await fetchStats();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleCreateWorkflow = async () => {
    if (!createForm.name || createForm.steps.length === 0) {
      alert('Please provide a name and at least one step');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: USER_ID,
          name: createForm.name,
          description: createForm.description,
          trigger: {
            type: createForm.triggerType,
            config: {}
          },
          steps: createForm.steps.map((step, idx) => ({
            type: step.type,
            config: step.config || {},
            order: idx + 1
          })),
          status: true
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowCreateModal(false);
        setCreateForm({ name: '', description: '', triggerType: 'extraction_completed', steps: [] });
        await fetchWorkflows();
        await fetchStats();
      } else {
        alert(data.error || 'Creation failed');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Creation failed');
    }
  };

  const addStep = (type) => {
    setCreateForm(prev => ({
      ...prev,
      steps: [...prev.steps, { type, config: {} }]
    }));
  };

  const removeStep = (index) => {
    setCreateForm(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const viewExecutions = async (workflow) => {
    setSelectedFlow(workflow);
    await fetchExecutionHistory(workflow.workflowId);
    setShowExecutionModal(true);
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Workflows
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Automate actions across documents, extraction, and chatbots
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
        >
          + Create Workflow
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

      {/* Live Workflow Animation */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Workflow Execution Flow
        </h2>

        <div className="relative flex items-center gap-4 overflow-x-auto pb-4">
          <FlowStart />
          <FlowConnector />
          <FlowNode title="AI Extraction" subtitle="Extract data" color="indigo" />
          <FlowConnector delay={1} />
          <FlowNode title="Validation" subtitle="Rules check" color="purple" />
          <FlowConnector delay={2} />
          <FlowNode title="Transform" subtitle="Data mapping" color="blue" />
          <FlowConnector delay={3} />
          <FlowEnd />
        </div>

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Real-time visualization showing how your workflows process data step by step.
        </p>
      </div>

      {/* Workflow Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Workflow</th>
              <th className="px-6 py-3 text-left font-medium">Trigger</th>
              <th className="px-6 py-3 text-left font-medium">Steps</th>
              <th className="px-6 py-3 text-left font-medium">Stats</th>
              <th className="px-6 py-3 text-left font-medium">Last Run</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
            {loading ? (
              <SkeletonLoader type="table-row" count={6} />
            ) : (
              <>
                {workflows.map((wf) => {
                  const isExecuting = wf.workflowId === executing;

                  return (
                    <tr
                      key={wf.workflowId}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-950/50 transition"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{wf.name}</p>
                          {wf.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{wf.description}</p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs">
                          {wf.trigger?.type?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {wf.steps?.slice(0, 3).map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-xs text-gray-700 dark:text-gray-300"
                            >
                              {s.type?.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {wf.steps?.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                              +{wf.steps.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-xs space-y-1">
                          <div className="text-gray-700 dark:text-gray-300">
                            ✓ {wf.successCount || 0} · ✗ {wf.failureCount || 0}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {wf.lastRun}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => runWorkflow(wf.workflowId)}
                            disabled={isExecuting || !wf.status}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          >
                            {isExecuting && (
                              <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            )}
                            Run
                          </button>

                          <button
                            onClick={() => toggleStatus(wf.workflowId)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${wf.status
                                ? 'bg-green-600/10 text-green-600 dark:text-green-400'
                                : 'bg-gray-600/10 text-gray-600 dark:text-gray-400'
                              }`}
                          >
                            {wf.status ? 'Active' : 'Paused'}
                          </button>

                          <button
                            onClick={() => viewExecutions(wf)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                          >
                            History
                          </button>

                          <button
                            onClick={() => deleteWorkflow(wf.workflowId)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/10 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-600/20 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {workflows.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                      No workflows found. Click "Create Workflow" to get started.
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Create Workflow
            </h2>

            <div className="flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Workflow Name
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Invoice Processing"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this workflow do?"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trigger
                </label>
                <select
                  value={createForm.triggerType}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, triggerType: e.target.value }))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {triggers.map(trigger => (
                    <option key={trigger.id} value={trigger.id}>
                      {trigger.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Steps ({createForm.steps.length})
                  </label>
                </div>

                <div className="space-y-2 mb-3">
                  {createForm.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                    >
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {idx + 1}
                      </span>
                      <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                        {actions.find(a => a.id === step.type)?.name || step.type}
                      </span>
                      <button
                        onClick={() => removeStep(idx)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 p-1 rounded"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {actions.slice(0, 6).map(action => (
                    <button
                      key={action.id}
                      onClick={() => addStep(action.id)}
                      className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition text-left"
                    >
                      + {action.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateForm({ name: '', description: '', triggerType: 'extraction_completed', steps: [] });
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkflow}
                disabled={!createForm.name || createForm.steps.length === 0}
                className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Workflow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Execution History Modal */}
      {showExecutionModal && selectedFlow && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-3xl rounded-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Execution History
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {selectedFlow.name}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowExecutionModal(false);
                  setSelectedFlow(null);
                  setExecutionHistory([]);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3">
              {executionHistory.length > 0 ? (
                executionHistory.map((exec) => (
                  <div
                    key={exec.executionId}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${exec.status === 'completed'
                            ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
                            : exec.status === 'failed'
                              ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400'
                              : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400'
                          }`}
                      >
                        {exec.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(exec.startedAt)}
                      </span>
                    </div>
                    {exec.steps && exec.steps.length > 0 && (
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {exec.steps.length} steps completed
                      </div>
                    )}
                    {exec.error && (
                      <div className="text-xs text-red-600 dark:text-red-400 mt-2">
                        Error: {exec.error}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No execution history yet
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowExecutionModal(false);
                setSelectedFlow(null);
                setExecutionHistory([]);
              }}
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

/* ---------- ANIMATION COMPONENTS ---------- */

const FlowConnector = ({ delay = 0 }) => (
  <div className="relative flex-1 min-w-[60px] h-[3px] bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
    <span
      className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full animate-flow"
      style={{ animationDelay: `${delay}s` }}
    />
  </div>
);

const FlowNode = ({ title, subtitle, color = 'indigo' }) => {
  const colors = {
    indigo: 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400',
    purple: 'bg-purple-600/10 text-purple-600 dark:text-purple-400',
    blue: 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
  };

  return (
    <div className="flex flex-col items-center min-w-[140px]">
      <div className="relative">
        <div className={`absolute inset-0 rounded-full ${color === 'indigo' ? 'bg-indigo-500/20' : color === 'purple' ? 'bg-purple-500/20' : 'bg-blue-500/20'} blur-lg animate-pulse`} />
        <div className={`relative px-4 py-2 rounded-xl ${colors[color]} text-sm font-medium whitespace-nowrap`}>
          {title}
        </div>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        {subtitle}
      </span>
    </div>
  );
};

const FlowStart = () => (
  <div className="flex flex-col items-center min-w-[120px]">
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
  <div className="flex flex-col items-center min-w-[120px]">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-green-500/20 blur-lg animate-pulse" />
      <div className="relative px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium">
        Complete
      </div>
    </div>
    <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
      Success
    </span>
  </div>
);

export default Workflow;

// Add this to your CSS/Tailwind config
const styles = `
@keyframes flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
.animate-flow {
  animation: flow 2s ease-in-out infinite;
}
`;