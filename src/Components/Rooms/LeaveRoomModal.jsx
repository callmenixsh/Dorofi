// src/Components/Rooms/LeaveRoomModal.jsx
import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X, ArrowRightLeft } from 'lucide-react';

const LeaveRoomModal = ({
  isOpen,
  onClose,
  onConfirm,
  roomName,
  targetRoomName,
  customTitle,
  customMessage,
  confirmText,
}) => {
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      onClose();
      setClosing(false);
    }, 140);
  }, [onClose]);

  const handleConfirm = () => {
    setClosing(true);
    setTimeout(() => {
      onConfirm();
      setClosing(false);
    }, 140);
  };

  if (!isOpen) return null;

  const title = customTitle || (targetRoomName ? 'Switch Study Room' : 'Leave Room');
  const buttonText = confirmText || (targetRoomName ? 'Leave & Join' : 'Leave Room');

  return createPortal(
    <div
      className={`fixed inset-0 bg-background/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 ${
        closing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-background rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-primary/20 flex flex-col relative ${
          closing ? 'animate-modal-out' : 'animate-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center shrink-0">
              {targetRoomName ? (
                <ArrowRightLeft size={22} className="text-red-500" />
              ) : (
                <LogOut size={22} className="text-red-500" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary">{title}</h3>
              <p className="text-xs text-secondary mt-0.5">Confirmation required</p>
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
          {customMessage ? (
            <p className="text-secondary text-sm leading-relaxed mb-6">{customMessage}</p>
          ) : targetRoomName ? (
            <p className="text-secondary text-sm leading-relaxed mb-6">
              You are currently in <span className="font-bold text-primary">{roomName || 'a study room'}</span>. You need to leave your active room before joining <span className="font-bold text-primary">{targetRoomName}</span>.
            </p>
          ) : (
            <p className="text-secondary text-sm leading-relaxed mb-6">
              Are you sure you want to leave <span className="font-bold text-primary">{roomName || 'your current study room'}</span>? You will disconnect from the focus session.
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-surface/50 border border-surface rounded-xl text-secondary hover:text-primary hover:bg-surface/80 transition-colors font-medium text-sm"
            >
              Stay in Room
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium text-sm shadow-sm"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LeaveRoomModal;
