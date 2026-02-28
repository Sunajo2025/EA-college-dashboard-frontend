import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';

export default function DeleteChatbotModal({ isOpen, onClose, onConfirm, chatbotName }) {
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

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
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
                        Delete Chatbot?
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
                        You are about to delete <span className="text-gray-900 dark:text-gray-100 font-bold">"{chatbotName}"</span>. This action cannot be undone.
                    </p>

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
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
