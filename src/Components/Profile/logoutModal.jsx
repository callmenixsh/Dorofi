// components/Profile/LogoutModal.jsx
import { LogOut, AlertCircle } from "lucide-react";

export default function LogoutModal({ showModal, onClose, onConfirm }) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg shadow-lg w-96 max-w-[90vw] p-6 border border-surface">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                        <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary">Confirm Logout</h3>
                </div>

                <p className="text-secondary mb-6">
                    Are you sure you want to logout? You'll need to sign in again to access your progress.
                </p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-surface hover:bg-background text-secondary hover:text-primary rounded-lg transition-colors border border-surface"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
