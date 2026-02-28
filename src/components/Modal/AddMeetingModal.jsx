
export function AddMeetingModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Add meeting</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="space-y-4">
          <button className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-indigo-50 dark:hover:bg-zinc-800">
            <FileText className="text-indigo-500" />
            <div className="text-left">
              <p className="text-sm font-medium">Upload transcript</p>
              <p className="text-xs text-gray-500">Generate summary and action items</p>
            </div>
          </button>

          <button className="w-full flex items-center gap-3 p-4 border rounded-xl hover:bg-indigo-50 dark:hover:bg-zinc-800">
            <Clock className="text-indigo-500" />
            <div className="text-left">
              <p className="text-sm font-medium">Paste meeting notes</p>
              <p className="text-xs text-gray-500">Convert notes into structured insights</p>
            </div>
          </button>

          <button
            disabled
            className="w-full flex items-center gap-3 p-4 border rounded-xl opacity-50 cursor-not-allowed"
          >
            <Calendar className="text-indigo-500" />
            <div className="text-left">
              <p className="text-sm font-medium">Auto capture meeting</p>
              <p className="text-xs text-gray-500">Coming soon with browser extension</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
