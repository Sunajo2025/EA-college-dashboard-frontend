/**
 * Usage & Billing Page
 * AI Platform Dashboard
 */

const usageStats = [
  { label: 'Total Requests', value: '128,420' },
  { label: 'Tokens Used', value: '42.6M' },
  { label: 'Active Chatbots', value: 11 },
  { label: 'Workflows Executed', value: 286 },
];

const usageBreakdown = [
  { label: 'Chatbot Queries', value: '62%' },
  { label: 'AI Extraction', value: '18%' },
  { label: 'Knowledge Training', value: '12%' },
  { label: 'Workflow Automation', value: '8%' },
];

const billingHistory = [
  { id: 1, date: 'Mar 2025', amount: '$89.00', status: 'Paid' },
  { id: 2, date: 'Feb 2025', amount: '$74.50', status: 'Paid' },
  { id: 3, date: 'Jan 2025', amount: '$61.20', status: 'Paid' },
];

const statusStyle = {
  Paid: 'text-green-600 dark:text-green-400',
  Pending: 'text-yellow-600 dark:text-yellow-400',
};

const UsageBilling = () => {
  const usedRequests = 128420;
  const planLimit = 200000;
  const usagePercent = Math.round((usedRequests / planLimit) * 100);

  return (
    <div className="p-5 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
          Usage & Billing
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track AI usage, billing cycles, and subscription details
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {usageStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="text-2xl font-medium text-indigo-600 dark:text-indigo-400 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Plan & Usage */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              Current Plan
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Pro Plan • 200,000 requests per month
            </p>
          </div>

          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
            Upgrade Plan
          </button>
        </div>

        {/* Usage Meter */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Monthly Usage</span>
            <span>
              {usedRequests.toLocaleString()} / {planLimit.toLocaleString()}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                usagePercent > 85 ? 'bg-red-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>

          {usagePercent > 85 && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-2">
              Approaching monthly limit
            </p>
          )}
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Usage Breakdown
        </h2>

        <div className="space-y-4">
          {usageBreakdown.map((u) => (
            <div key={u.label}>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                <span>{u.label}</span>
                <span>{u.value}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-zinc-700 overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: u.value }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden transition-theme">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-5 py-3 text-left">Billing Period</th>
              <th className="px-5 py-3 text-left">Amount</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-right">Invoice</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700 text-gray-600 dark:text-gray-400">
            {billingHistory.map((bill) => (
              <tr key={bill.id}>
                <td className="px-5 py-4">{bill.date}</td>
                <td className="px-5 py-4">{bill.amount}</td>
                <td className={`px-5 py-4 ${statusStyle[bill.status]}`}>
                  {bill.status}
                </td>
                <td className="px-5 py-4 text-right">
                  <button className="px-3 py-1.5 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium hover:bg-indigo-600/20 transition">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-indigo-50 dark:border-zinc-700 transition-theme">
        <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Payment Method
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Visa ending in •••• 4242
        </p>

        <button className="mt-4 px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-zinc-600 transition">
          Update Payment Method
        </button>
      </div>

      {/* Notice */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-zinc-700 transition-theme text-sm text-gray-600 dark:text-gray-400">
        Usage data refreshes every 15 minutes. Billing is finalized at the end of each billing cycle.
      </div>
    </div>
  );
};

export default UsageBilling;
