// src/Components/Rooms/RoomSidebar.jsx
import React from 'react';
import { Users, MessageSquare, LogOut, X, Target, Send } from 'lucide-react';
import TimerCard from '../Home/timerCard';
import TimerControls from '../Home/timerControls';
import StatsBar from '../Home/statsBar';

const RoomSidebar = ({ 
  isOpen, 
  activeTab, 
  onTabChange, 
  onClose, 
  onSendReaction,
  cooldownRemaining,
  participants,
  recentReactions,
  messages,
  onSendMessage,
  chatMessage,
  setChatMessage,
  chatEndRef,
  COOLDOWN_MS,
  reactions,
  user
}) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 h-full max-h-screen bg-surface/95 backdrop-blur-md border-l border-primary/10 transition-all duration-500 ease-in-out z-[100] flex flex-col shadow-2xl overflow-hidden ${
        isOpen
          ? 'w-full sm:w-80 translate-x-0'
          : 'w-full sm:w-80 translate-x-full pointer-events-none'
      }`}
    >
      <div className="flex flex-col h-full min-h-0 overflow-hidden">
        {/* Mobile Header - Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-primary/5 bg-background/10">
          <h2 className="font-black text-primary uppercase tracking-tighter">Study Room</h2>
          <button 
            onClick={() => onClose(false)}
            className="p-2 hover:bg-primary/10 rounded-xl text-secondary"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-primary/5 bg-background/20">
          <button 
            onClick={() => onTabChange('participants')}
            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === 'participants' ? 'text-primary' : 'text-secondary hover:text-primary/70'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Users size={14} strokeWidth={3} />
              People
            </div>
            {activeTab === 'participants' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-1" />
            )}
          </button>
          <button 
            onClick={() => onTabChange('chat')}
            className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === 'chat' ? 'text-primary' : 'text-secondary hover:text-primary/70'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <MessageSquare size={14} strokeWidth={3} />
              Chat
            </div>
            {activeTab === 'chat' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in slide-in-from-bottom-1" />
            )}
          </button>
        </div>

        <div className="flex-grow min-h-0 overflow-hidden flex flex-col">
          {activeTab === 'participants' ? (
            <div className="p-4 sm:p-6 flex-grow min-h-0 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Participants</h2>
                <div className="bg-primary text-background px-2.5 py-0.5 rounded-full text-[9px] font-black">
                  {participants.length}/10
                </div>
              </div>

              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {participants.map((p) => (
                  <div key={p.id} className="bg-background/40 border border-primary/5 rounded-2xl p-4 group hover:border-primary/20 transition-all shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-black border border-primary/10">
                          {p.avatar}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-surface ${
                          p.mode === 'work' ? 'bg-primary' : 'bg-accent'
                        } ${p.mode === 'work' ? 'animate-pulse' : ''}`} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-primary truncate text-xs">{p.name}</h4>
                          {/* Targeted Reactions */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            {reactions.slice(0, 2).map(r => (
                              <button 
                                key={r.type}
                                onClick={() => onSendReaction(r.type, p.name)}
                                disabled={cooldownRemaining > 0}
                                className={`p-1.5 rounded-lg transition-colors ${
                                  cooldownRemaining > 0 ? 'opacity-30' : 'hover:bg-primary/10'
                                }`}
                                title={`Cheer ${p.name}`}
                              >
                                <span className="text-xs">{r.icon}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <p className="text-[8px] font-black text-secondary uppercase tracking-[0.1em]">
                          {p.mode === 'work' ? 'Deep Work' : 'Resting'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest">
                        <span className="text-secondary/70 truncate max-w-[120px]">{p.task}</span>
                        <span className="text-primary">{p.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-surface/50 rounded-full overflow-hidden border border-primary/5">
                        <div 
                          className={`h-full transition-all duration-1000 ${p.mode === 'work' ? 'bg-primary' : 'bg-accent'}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-grow min-h-0 flex flex-col overflow-hidden bg-background/5">
              {/* Combined Chat Feed (Now showing system notifications for Reactions) */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {[...messages.map(m => ({ ...m, feedType: 'message' })), ...recentReactions.map(r => ({ ...r, feedType: 'reaction' }))]
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                  .map((item) => {
                    if (item.feedType === 'reaction') {
                      return (
                        <div key={item.id} className="flex justify-center my-1 animate-slide-in-right">
                          <div className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-[10px] font-bold text-secondary flex items-center gap-1.5 shadow-sm">
                            <span className="font-black text-primary/80">{item.from}</span>
                            <span className="text-secondary/60">sent</span>
                            <span className="text-xs">{
                              item.type === 'fire' ? '🔥' : 
                              item.type === 'heart' ? '❤️' : 
                              item.type === 'coffee' ? '☕' : '⚡'
                            }</span>
                            <span className="text-secondary/60">to</span>
                            <span className="font-black text-primary/80">{item.target}</span>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={item.id} className={`flex flex-col ${item.from === (user?.displayName || 'You') ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{item.from}</span>
                          <span className="text-[8px] text-secondary/40">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className={`px-4 py-3 rounded-2xl text-[13px] max-w-[90%] shadow-sm font-medium ${
                          item.from === (user?.displayName || 'You') 
                          ? 'bg-primary text-background rounded-tr-none' 
                          : 'bg-surface text-primary border border-primary/5 rounded-tl-none'
                        }`}>
                          {item.text}
                        </div>
                      </div>
                    );
                  })}
                  {([...messages, ...recentReactions].length === 0) && (
                    <div className="h-full flex flex-col items-center justify-center opacity-10 text-center px-6">
                      <MessageSquare size={48} strokeWidth={1} className="mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-[0.3em]">No messages yet</p>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Compact Reactions Bar - Motivate Room */}
                <div className="px-4 py-2 border-t border-primary/5 bg-surface/20 flex items-center justify-between gap-2 relative overflow-hidden">
                  {/* Cooldown Progress Bar */}
                  {cooldownRemaining > 0 && (
                    <div 
                      className="absolute bottom-0 left-0 h-[2px] bg-primary/30 transition-all duration-100 ease-linear"
                      style={{ width: `${(cooldownRemaining / COOLDOWN_MS) * 100}%` }}
                    />
                  )}
                  <span className="text-[9px] font-black text-secondary uppercase tracking-[0.1em] ml-1">Motivate:</span>
                  <div className="flex items-center gap-1.5">
                    {reactions.map((react) => (
                      <button
                        key={react.type}
                        onClick={() => onSendReaction(react.type)}
                        disabled={cooldownRemaining > 0}
                        className={`w-8 h-8 bg-background/50 border border-primary/5 rounded-lg transition-all flex items-center justify-center text-sm shadow-sm ${
                          cooldownRemaining > 0 
                          ? 'opacity-40 cursor-not-allowed scale-95' 
                          : 'hover:border-primary/30 hover:scale-110 active:scale-95 hover:bg-surface'
                        }`}
                        title={react.label}
                      >
                        {react.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <form onSubmit={onSendMessage} className="p-4 bg-surface/50 border-t border-primary/5">
                  <div className="relative flex items-center gap-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-grow bg-background/50 border border-primary/10 rounded-2xl px-4 py-3.5 text-xs focus:outline-none focus:border-primary/40 transition-all pr-12 font-medium"
                    />
                    <button 
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="absolute right-2 p-2 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-primary/20"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    
  );
};

export default RoomSidebar;
