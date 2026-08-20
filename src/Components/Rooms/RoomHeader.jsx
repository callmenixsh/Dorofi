// src/Components/Rooms/RoomHeader.jsx
import React from 'react';
import { Hash, Share2, LogOut, Users, MessageSquare,Target } from 'lucide-react';

const RoomHeader = ({ 
  roomId, 
  roomName, 
  participantsCount, 
  onShareClick, 
  onLeaveClick, 
  onToggleSidebar,
  isSidebarOpen
}) => {
  return (
    <div className="mb-6 bg-surface/30 rounded-2xl border border-primary/5 backdrop-blur-sm shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
            <Hash size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-primary truncate">{roomName}</h1>
            <p className="text-xs text-secondary flex items-center gap-1 font-medium">
              <span className="font-mono bg-background/50 px-2 py-0.5 rounded border border-primary/5 text-primary/80">{roomId}</span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1 text-secondary/80">
                <Users size={12} />
                {participantsCount} online
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <div className="flex items-center gap-1">
            <button 
              onClick={onShareClick}
              className="p-2.5 hover:bg-primary/10 rounded-xl text-secondary hover:text-primary transition-all bg-background/50 border border-primary/5 shadow-sm"
              title="Share Room"
            >
              <Share2 size={18} />
            </button>
            <button 
              onClick={() => onToggleSidebar(!isSidebarOpen)}
              className={`lg:hidden p-2.5 rounded-xl transition-all border shadow-sm ${
                isSidebarOpen 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-background/50 border-primary/5 text-secondary hover:text-primary hover:bg-primary/10'
              }`}
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              <MessageSquare size={18} />
            </button>
            <button 
              onClick={() => onToggleSidebar(!isSidebarOpen)}
              className={`hidden lg:flex p-2.5 rounded-xl transition-all border shadow-sm ${
                isSidebarOpen 
                  ? 'bg-primary/10 border-primary/20 text-primary' 
                  : 'bg-background/50 border-primary/5 text-secondary hover:text-primary hover:bg-primary/10'
              }`}
              title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              <Users size={18} />
            </button>
          </div>
          
          <button 
            onClick={onLeaveClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-sm shadow-sm"
          >
            <LogOut size={16} />
            <span>Leave</span>
          </button>
        </div>
      </div>

     <div className="border-t border-primary/5 p-3 flex items-center gap-2.5">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-primary/5 border border-primary/10 rounded-lg text-primary text-[9px] font-black uppercase tracking-wider shrink-0">
        <Target size={11} strokeWidth={3} />
        Room Goal
      </div>
      <span className="text-secondary italic text-xs truncate font-medium">
        "Let's focus together and crush our goals today! 💪"
      </span>
    </div>
    </div>
  );
};

export default RoomHeader;