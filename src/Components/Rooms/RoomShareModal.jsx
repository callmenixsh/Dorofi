// src/Components/Rooms/RoomShareModal.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import { Share2, X } from 'lucide-react';

const RoomShareModal = ({ isOpen, onClose, roomId, roomLink }) => {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-backdrop-in" 
      onClick={() => onClose()}
    >
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md border border-primary/20 relative z-10 overflow-hidden animate-modal-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shrink-0">
              <Share2 size={24} className="text-background" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-primary">Share Study Room</h2>
            </div>
            <button
              onClick={() => onClose()}
              className="rounded-full p-2 hover:bg-surface/80 transition-colors"
              aria-label="Close"
            >
              <X size={20} className="text-secondary hover:text-primary transition-colors" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-xs text-secondary leading-relaxed font-medium">
            Invite others to join your synced study session by sharing the room code or direct link below!
          </p>

          {/* Room Code Box */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Room Code</label>
            <div className="flex gap-2">
              <div className="flex-grow bg-surface/50 border border-primary/10 rounded-xl px-4 py-3 text-sm font-mono font-bold text-primary flex items-center">
                {roomId}
              </div>
              <button
                onClick={handleCopyCode}
                className={`px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-sm ${
                  copiedCode ? 'bg-green-500 text-white' : 'bg-primary text-background hover:bg-primary/95'
                }`}
              >
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>

          {/* Room Link Box */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-secondary uppercase tracking-widest">Direct Link</label>
            <div className="flex gap-2">
              <div className="flex-grow bg-surface/50 border border-primary/10 rounded-xl px-4 py-3 text-xs font-medium text-secondary truncate flex items-center">
                {roomLink}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap shadow-sm ${
                  copiedLink ? 'bg-green-500 text-white' : 'bg-primary text-background hover:bg-primary/95'
                }`}
              >
                {copiedLink ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default RoomShareModal;
