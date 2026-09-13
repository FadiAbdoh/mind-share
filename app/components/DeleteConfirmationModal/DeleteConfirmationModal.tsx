
import { motion } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface PageType {
    isOpen: boolean,
    isDeleteAll: boolean,
    postTitle: string | null,
    isDeleting: boolean,
    feedback: {
        type: 'error' | 'success', message: string
    } | null,
    onClose: () => void,
    onConfirm: () => void
}

export default function DeleteConfirmationModal({
    isOpen, isDeleteAll, postTitle, isDeleting, feedback, onClose, onConfirm
}: PageType) {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="text-center space-y-2">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                        {isDeleteAll ? 'Wanna delete All Your Posts?' : 'Wanna delete This Post?'}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                        {isDeleteAll
                            ? 'Are you sure you wanna delete all of your posts? This action cannot be undone.'
                            : postTitle
                                ? `Are you sure you wanna delete "${postTitle}"`
                                : 'Are you sure you wanna delete this post?'
                        }
                    </p>
                </div>

                {feedback && (
                    <div
                        className={`p-3 rounded-xl text-xs font-medium text-center ${feedback.type === "success"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20"
                            }`}
                    >
                        {feedback.message}
                    </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        disabled={isDeleting}
                        onClick={onConfirm}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Deleting...</span>
                            </>
                        ) : (
                            <span>Yes, Delete</span>
                        )}
                    </button>
                </div>

            </motion.div>
        </div>
    )
}