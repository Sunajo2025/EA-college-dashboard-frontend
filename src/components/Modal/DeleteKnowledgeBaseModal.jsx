import { useState, useEffect } from 'react';
import { AlertCircle, X, Trash2 } from 'lucide-react';

export default function DeleteKnowledgeBaseModal({ isOpen, onClose, onConfirm, documentName, botsToDelete = [], botsToUpdate = [] }) {
    const [confirmationText, setConfirmationText] = useState('');
    const REQUIRED_TEXT = 'permanently delete';

    useEffect(() => {
        if (isOpen) {
            setConfirmationText('');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const totalAffected = botsToDelete.length + botsToUpdate.length;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                            <Trash2 size={20} />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Delete Knowledge Base?
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                        You are about to delete <span className="text-gray-900 dark:text-gray-100 font-bold">"{documentName}"</span>. This action cannot be undone.
                    </p>

                    {totalAffected > 0 && (
                        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                            <div className="flex gap-3">
                                <AlertCircle className="text-amber-600 dark:text-amber-500 shrink-0" size={18} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">
                                        Affected Chatbots
                                    </p>

                                    <div className="space-y-4 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                        {botsToDelete.length > 0 && (
                                            <div>
                                                <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-tighter mb-1.5 underline">
                                                    Will be deleted (No other sources)
                                                </p>
                                                <div className="space-y-1">
                                                    {botsToDelete.map((bot) => (
                                                        <div key={bot.id} className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-300">
                                                            <div className="w-1 h-1 rounded-full bg-red-500" />
                                                            <span className="truncate">{bot.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {botsToUpdate.length > 0 && (
                                            <div>
                                                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-tighter mb-1.5 underline">
                                                    Will be updated (Has other sources)
                                                </p>
                                                <div className="space-y-1">
                                                    {botsToUpdate.map((bot) => (
                                                        <div key={bot.id} className="flex items-center gap-1.5 text-xs text-amber-900 dark:text-amber-300">
                                                            <div className="w-1 h-1 rounded-full bg-amber-500" />
                                                            <span className="truncate">{bot.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Type <span className="text-red-600 dark:text-red-400 italic">"{REQUIRED_TEXT}"</span> to confirm
                            </label>
                            <input
                                type="text"
                                autoFocus
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                placeholder={REQUIRED_TEXT}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition font-medium"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={confirmationText !== REQUIRED_TEXT}
                                onClick={onConfirm}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-red-500/20"
                            >
                                Delete {botsToDelete.length > 0 ? `(+${botsToDelete.length} bots)` : ''}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
