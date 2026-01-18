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
  {
    id: 1,
    date: 'Mar 2025',
    amount: '$89.00',
    status: 'Paid',
  },
  {
    id: 2,
    date: 'Feb 2025',
    amount: '$74.50',
    status: 'Paid',
  },
  {
    id: 3,
    date: 'Jan 2025',
    amount: '$61.20',
    status: 'Paid',
  },
];

const statusStyle = {
  Paid: 'text-green-600 dark:text-green-400',
  Pending: 'text-yellow-600 dark:text-yellow-400',
};

const UsageBilling = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Usage & Billing
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor your AI usage and billing details
        </p>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {usageStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-zinc-800 p-5 rounded-2xl border border-gray-100 dark:border-zinc-700"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold text-indigo-600 mt-1">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Plan Overview */}
      <div className="bg-indigo-600/10 dark:bg-indigo-500/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h2 className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">
            Current Plan: Pro
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Includes up to 200K requests per month
          </p>

          <div className="mt-4 space-y-2 text-sm">
            <p>• Overage: $0.002 per request</p>
            <p>• Priority support included</p>
            <p>• Advanced analytics enabled</p>
          </div>
        </div>

        <div className="flex items-center">
          <button className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Usage Breakdown */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 p-6">
        <h2 className="text-lg font-semibold mb-4">
          Usage Breakdown
        </h2>

        <div className="space-y-4">
          {usageBreakdown.map((u) => (
            <div key={u.label}>
              <div className="flex justify-between text-sm mb-1">
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
      <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-100 dark:border-zinc-700 overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 dark:bg-zinc-900 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left w-1/3">
                Billing Period
              </th>
              <th className="px-6 py-3 text-left w-1/3">
                Amount
              </th>
              <th className="px-6 py-3 text-left w-1/3">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-zinc-700">
            {billingHistory.map((bill) => (
              <tr key={bill.id}>
                <td className="px-6 py-4">
                  {bill.date}
                </td>
                <td className="px-6 py-4">
                  {bill.amount}
                </td>
                <td
                  className={`px-6 py-4 ${statusStyle[bill.status]}`}
                >
                  {bill.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notice */}
      <div className="bg-gray-50 dark:bg-zinc-800/60 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-400">
        Usage data refreshes every 15 minutes. Billing is calculated at the end of each billing cycle.
      </div>
    </div>
  );
};

export default UsageBilling;
