// components/Profile/LogoutModal.jsx - With theme colors
import { LogOut, AlertCircle } from "lucide-react";

export default function LogoutModal({ showModal, onClose, onConfirm }) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-surface rounded-2xl p-6 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-accent" />
          </div>
          
          <h3 className="text-xl font-bold text-primary mb-2">Confirm Logout</h3>
          <p className="text-secondary mb-6">
            Are you sure you want to logout? You'll need to sign in again to access your progress.
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-surface border border-surface rounded-xl text-secondary hover:bg-surface/80 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-accent text-background rounded-xl hover:bg-accent/90 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
