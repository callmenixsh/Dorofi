// Pages/Rooms.jsx - Study Rooms Discovery Page
import React, { useState, useEffect } from 'react';
import { Users, Globe, Plus, Hash, ArrowRight, Lock, Play, Timer, ArrowLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRoom, leaveRoom, ROOM_MAX_DURATION_MS } from '../store/slices/roomsSlice';

const formatRemaining = (expiresAt) => {
  const diff = expiresAt - Date.now();
  if (diff <= 0) return 'Ended';
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hrs > 0) return `${hrs}h ${mins}m left`;
  return `${mins}m left`;
};

const Rooms = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { activeRoom } = useSelector(state => state.rooms);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [createDuration, setCreateDuration] = useState(2);
  const [createPrivacy, setCreatePrivacy] = useState('public');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const nowMs = now;

  const mockRooms = [
    { id: '1', name: 'Lofi & Study', host: 'Alex', participants: 12, isPrivate: false, duration: 4 * 3600000, startedAt: nowMs - 1 * 3600000 },
    { id: '2', name: 'Deep Work Only', host: 'Sarah', participants: 5, isPrivate: true, duration: 2 * 3600000, startedAt: nowMs - 1.5 * 3600000 },
    { id: '3', name: 'Break Time Chill', host: 'Mike', participants: 8, isPrivate: false, duration: 12 * 3600000, startedAt: nowMs - 10 * 3600000 },
  ];

  const roomsWithExpiry = mockRooms.map(r => ({
    ...r,
    expiresAt: (r.startedAt || nowMs) + (r.duration || ROOM_MAX_DURATION_MS),
  }));

  const handleJoinRoom = (room) => {
    if (activeRoom) return;
    dispatch(setActiveRoom(room));
    navigate(`/rooms/${room.id}`);
  };

  const handleReturnToRoom = () => {
    if (activeRoom) navigate(`/rooms/${activeRoom.id}`);
  };

  const handleLeaveCurrentRoom = () => {
    if (window.confirm('Leave your current room?')) {
      dispatch(leaveRoom());
    }
  };

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!roomCode.trim() || activeRoom) return;
    navigate(`/rooms/${roomCode}`);
  };

  const handleCreateRoom = () => {
    const newRoom = {
      id: 'new-' + Date.now(),
      name: 'My Study Room',
      host: 'You',
      isHost: true,
      participants: 1,
      isPrivate: createPrivacy === 'private',
      duration: createDuration * 3600000,
    };
    setShowCreateModal(false);
    dispatch(setActiveRoom(newRoom));
    navigate(`/rooms/${newRoom.id}`);
  };

  const activePercent = activeRoom?.expiresAt
    ? Math.max(0, Math.min(100, ((activeRoom.expiresAt - nowMs) / activeRoom.duration) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Active Room — Hero Card */}
        {activeRoom && (
          <div className="relative mb-10 overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-surface/80 to-accent/5 p-6 sm:p-8">
            {/* Pulsing live dot */}
            <div className="absolute top-6 right-6 flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Live</span>
            </div>

            <p className="text-[10px] font-black text-secondary uppercase tracking-[0.25em] mb-3">Your Room</p>
            <h2 className="text-2xl sm:text-3xl font-black text-primary mb-1 pr-20">{activeRoom.name}</h2>
            
            <div className="flex items-center gap-3 text-xs text-secondary mb-6">
              <span className="flex items-center gap-1.5">
                <Users size={13} />
                {activeRoom.participants || 1} online
              </span>
              <span className="opacity-20">•</span>
              <span>{activeRoom.host}</span>
              {activeRoom.isHost && (
                <>
                  <span className="opacity-20">•</span>
                  <span className="text-primary font-bold">Host</span>
                </>
              )}
            </div>

            {/* Time bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-secondary uppercase tracking-[0.15em]">
                  {activeRoom.expiresAt ? formatRemaining(activeRoom.expiresAt) : ''}
                </span>
                <span className="text-[10px] font-black text-secondary/50 uppercase tracking-[0.15em]">
                  {Math.floor((activeRoom.duration || 0) / 3600000)}h session
                </span>
              </div>
              <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-[30000ms]"
                  style={{ width: `${activePercent}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleReturnToRoom}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-primary text-background rounded-2xl hover:bg-primary/90 transition-all font-bold text-sm shadow-lg shadow-primary/20"
              >
                <ArrowLeft size={16} />
                Return to Room
              </button>
              <button 
                onClick={handleLeaveCurrentRoom}
                className="px-4 py-3 bg-background/60 text-secondary rounded-2xl hover:text-red-500 hover:bg-red-500/10 transition-all font-bold text-sm border border-primary/10"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black text-primary tracking-tight">Study Rooms</h1>
          <div className="flex items-center gap-2">
            <form onSubmit={handleJoinByCode} className="relative group">
              <input 
                type="text" 
                placeholder="Code..." 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                disabled={!!activeRoom}
                className="w-32 pl-8 pr-3 py-2 bg-surface/50 border border-primary/10 rounded-xl text-xs focus:outline-none focus:border-primary/30 transition-all disabled:opacity-30"
              />
              <Hash size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary/50" />
              <button 
                type="submit" 
                disabled={!!activeRoom}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-primary/50 hover:text-primary rounded-md transition-colors disabled:opacity-30"
              >
                <ArrowRight size={14} />
              </button>
            </form>
            <button 
              onClick={() => setShowCreateModal(true)}
              disabled={!!activeRoom}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all font-bold text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              New Room
            </button>
          </div>
        </div>

        {/* Room List */}
        <div className="space-y-2">
          {roomsWithExpiry.map((room) => {
            const expired = room.expiresAt <= nowMs;
            const percentLeft = Math.max(0, Math.min(100, ((room.expiresAt - nowMs) / room.duration) * 100));
            
            return (
              <div 
                key={room.id}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  expired
                    ? 'border-primary/5 bg-surface/20 opacity-50'
                    : 'border-primary/5 bg-surface/30 hover:border-primary/15 hover:bg-surface/50'
                }`}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {room.isPrivate ? <Lock size={16} /> : <Globe size={16} />}
                </div>

                {/* Info */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-primary truncate">{room.name}</h3>
                    {expired ? (
                      <span className="text-[9px] font-black text-secondary/50 uppercase tracking-widest shrink-0">Ended</span>
                    ) : (
                      <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest shrink-0">
                        {formatRemaining(room.expiresAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-secondary/60 mt-0.5">
                    <span>{room.host}</span>
                    <span className="opacity-30">•</span>
                    <span className="flex items-center gap-1"><Users size={10} />{room.participants}</span>
                  </div>
                </div>

                {/* Time bar — thin inline */}
                {!expired && (
                  <div className="hidden sm:block w-20 shrink-0">
                    <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary/30 rounded-full transition-all duration-[30000ms]"
                        style={{ width: `${percentLeft}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action */}
                <div className="shrink-0">
                  {expired ? (
                    <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-wider">Ended</span>
                  ) : activeRoom ? (
                    <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-wider">In Room</span>
                  ) : (
                    <button 
                      onClick={() => handleJoinRoom(room)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary hover:text-background transition-all"
                    >
                      Join
                      <Play size={11} fill="currentColor" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!mockRooms.length && (
          <div className="text-center py-16">
            <p className="text-sm text-secondary mb-4">No active rooms. Start one!</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              disabled={!!activeRoom}
              className="px-6 py-2.5 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all font-bold text-sm disabled:opacity-30"
            >
              Create Room
            </button>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-surface border border-primary/20 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-7">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-primary">New Room</h2>
                  <p className="text-[11px] text-secondary mt-0.5">Max 12 hours. Host can close early.</p>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-secondary hover:text-primary transition-colors p-1">
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-secondary mb-1.5 uppercase tracking-[0.2em]">Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Deep Work with Lofi" 
                    className="w-full px-4 py-2.5 bg-background border border-primary/10 rounded-xl text-sm focus:outline-none focus:border-primary/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-secondary mb-1.5 uppercase tracking-[0.2em]">
                    Duration — <span className="text-primary">{createDuration}h</span>
                  </label>
                  <input 
                    type="range" 
                    min={1} 
                    max={12} 
                    step={1}
                    value={createDuration}
                    onChange={(e) => setCreateDuration(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[9px] font-black text-secondary/40 uppercase tracking-widest mt-0.5">
                    <span>1h</span>
                    <span>12h</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-black text-secondary mb-1.5 uppercase tracking-[0.2em]">Privacy</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setCreatePrivacy('public')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        createPrivacy === 'public' 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-primary/10 text-secondary hover:border-primary/30'
                      }`}
                    >
                      <Globe size={15} />
                      Public
                    </button>
                    <button 
                      onClick={() => setCreatePrivacy('private')}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                        createPrivacy === 'private' 
                          ? 'border-primary bg-primary/5 text-primary' 
                          : 'border-primary/10 text-secondary hover:border-primary/30'
                      }`}
                    >
                      <Lock size={15} />
                      Private
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleCreateRoom}
                  className="w-full py-3 bg-primary text-background rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 mt-2"
                >
                  Start Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;