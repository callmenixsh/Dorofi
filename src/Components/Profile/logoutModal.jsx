// components/Profile/LogoutModal.jsx - With theme colors
import { LogOut, X } from "lucide-react";
import { useState, useCallback } from "react";
import { createPortal } from "react-dom";

export default function LogoutModal({ showModal, onClose, onConfirm }) {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 140);
  }, [onClose]);

  if (!showModal) return null;

  return createPortal(
    <div className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}>
      <div className={`bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-primary/20 flex flex-col relative ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
              <LogOut size={24} className="text-background" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary">Confirm Logout</h3>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-2 hover:bg-surface/80 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-secondary hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-secondary text-base mb-6">
            Are you sure you want to logout? You'll need to sign in again to access your progress.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-surface/50 border border-surface rounded-xl text-secondary hover:text-primary hover:bg-surface/80 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 text-background rounded-xl transition-all font-medium text-sm shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
