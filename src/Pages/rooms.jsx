// Pages/Rooms.jsx - Study Rooms Discovery Page
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Users, Globe, Plus, Hash, ArrowRight, Lock, Play, Timer, ArrowLeft, X, ArrowRightLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRoom, leaveRoom, ROOM_MAX_DURATION_MS } from '../store/slices/roomsSlice';
import LeaveRoomModal from '../Components/Rooms/LeaveRoomModal';

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
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [createDuration, setCreateDuration] = useState(2);
  const [createPrivacy, setCreatePrivacy] = useState('public');
  const [privateCode, setPrivateCode] = useState('');
  const [passcodeModalRoom, setPasscodeModalRoom] = useState(null);
  const [inputPasscode, setInputPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const nowMs = now;

  const mockRooms = [
    { id: '1', name: 'Lofi & Study', host: 'Alex', participants: 8, maxParticipants: 10, isPrivate: false, duration: 4 * 3600000, startedAt: nowMs - 1 * 3600000 },
    { id: '2', name: 'Deep Work Only', host: 'Sarah', participants: 5, maxParticipants: 10, isPrivate: true, code: '1234', duration: 2 * 3600000, startedAt: nowMs - 1.5 * 3600000 },
    { id: '3', name: 'Break Time Chill', host: 'Mike', participants: 10, maxParticipants: 10, isPrivate: false, duration: 12 * 3600000, startedAt: nowMs - 10 * 3600000 },
  ];

  const roomsWithExpiry = mockRooms.map(r => ({
    ...r,
    expiresAt: (r.startedAt || nowMs) + (r.duration || ROOM_MAX_DURATION_MS),
  }));

  const filteredRooms = roomsWithExpiry.filter((room) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      room.name.toLowerCase().includes(query) ||
      room.id.toLowerCase().includes(query) ||
      (room.code && room.code.toLowerCase().includes(query))
    );
  });

  const handleJoinRoom = (room) => {
    if (room.isPrivate) {
      setPasscodeModalRoom(room);
      setInputPasscode('');
      setPasscodeError(false);
      return;
    }
    if (activeRoom) {
      if (activeRoom.id === room.id) {
        navigate('/');
        return;
      }
      setPendingAction({ type: 'join', targetRoom: room });
      setShowLeaveModal(true);
      return;
    }
    dispatch(setActiveRoom(room));
    navigate('/');
  };

  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    const correctCode = passcodeModalRoom.code || '1234';
    if (inputPasscode.trim() !== correctCode) {
      setPasscodeError(true);
      return;
    }
    const room = passcodeModalRoom;
    setPasscodeModalRoom(null);
    setInputPasscode('');

    if (activeRoom) {
      if (activeRoom.id === room.id) {
        navigate('/');
        return;
      }
      setPendingAction({ type: 'join', targetRoom: room });
      setShowLeaveModal(true);
      return;
    }
    dispatch(setActiveRoom(room));
    navigate('/');
  };

  const handleReturnToRoom = () => {
    if (activeRoom) navigate('/');
  };

  const handleLeaveCurrentRoom = () => {
    setPendingAction({ type: 'leave' });
    setShowLeaveModal(true);
  };

  const handleConfirmLeave = () => {
    dispatch(leaveRoom());
    const action = pendingAction;
    setPendingAction(null);
    setShowLeaveModal(false);

    if (action?.type === 'join' && action.targetRoom) {
      dispatch(setActiveRoom(action.targetRoom));
      navigate('/');
    } else if (action?.type === 'joinCode' && action.code) {
      navigate('/');
    } else if (action?.type === 'create') {
      setShowCreateModal(true);
    }
  };

  const handleJoinByCode = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    if (activeRoom) {
      setPendingAction({ type: 'joinCode', code: roomCode.trim() });
      setShowLeaveModal(true);
      return;
    }
    navigate('/');
  };

  const handleNewRoomClick = () => {
    if (activeRoom) {
      setPendingAction({ type: 'create' });
      setShowLeaveModal(true);
      return;
    }
    setShowCreateModal(true);
  };

  const handleCreateRoom = () => {
    const code = createPrivacy === 'private' ? (privateCode.trim() || '1234') : undefined;
    const newRoom = {
      id: 'new-' + Date.now(),
      name: roomName.trim() || 'My Study Room',
      host: 'You',
      isHost: true,
      participants: 1,
      maxParticipants: 10,
      isPrivate: createPrivacy === 'private',
      code,
      duration: createDuration * 3600000,
    };
    setShowCreateModal(false);
    setRoomName('');
    setPrivateCode('');
    dispatch(setActiveRoom(newRoom));
    navigate('/');
  };

  const activePercent = activeRoom?.expiresAt
    ? Math.max(0, Math.min(100, ((activeRoom.expiresAt - nowMs) / activeRoom.duration) * 100))
    : 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Active Room — Hero Card */}
        {activeRoom && (
          <div className="relative mb-10 overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-surface/80 to-accent/5 p-6 sm:p-8 shadow-md">
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
              <span className="flex items-center gap-1.5 font-medium">
                <Users size={13} />
                {activeRoom.participants || 1}/10 participants
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-primary tracking-tight">Study Rooms</h1>
          <div className="flex items-center gap-2">
            <form onSubmit={handleJoinByCode} className="relative group">
              <input 
                type="text" 
                placeholder="Code..." 
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                className="w-32 pl-8 pr-3 py-2 bg-surface/50 border border-primary/10 rounded-xl text-xs focus:outline-none focus:border-primary/30 transition-all"
              />
              <Hash size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary/50" />
              <button 
                type="submit" 
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-primary/50 hover:text-primary rounded-md transition-colors"
                title={activeRoom ? "Leave current room to join with code" : "Join by code"}
              >
                <ArrowRight size={14} />
              </button>
            </form>
            <button 
              onClick={handleNewRoomClick}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all font-bold text-xs"
              title={activeRoom ? "Leave current room to create new one" : "Create a new study room"}
            >
              <Plus size={16} />
              New Room
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search study rooms by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface/50 border border-primary/10 rounded-2xl text-sm focus:outline-none focus:border-primary/30 transition-all text-primary placeholder-secondary/50"
          />
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary/50" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-surface rounded-full text-secondary hover:text-primary transition-colors text-xs"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Subtle Active Room Status Bar */}
        {activeRoom && (
          <div className="mb-6 flex items-center justify-between p-3.5 rounded-2xl bg-surface/50 border border-primary/10 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
              </span>
              <p className="text-xs text-secondary truncate">
                Active in <span className="font-bold text-primary">{activeRoom.name}</span> ({activeRoom.participants || 1}/10 people)
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleReturnToRoom}
                className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-background rounded-xl text-xs font-bold transition-all"
              >
                Return
              </button>
              <button
                onClick={handleLeaveCurrentRoom}
                className="px-3 py-1.5 bg-surface text-secondary hover:text-red-500 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all border border-primary/5"
              >
                Leave
              </button>
            </div>
          </div>
        )}

        {/* Room List */}
        <div className="space-y-2">
          {filteredRooms.map((room) => {
            const expired = room.expiresAt <= nowMs;
            const percentLeft = Math.max(0, Math.min(100, ((room.expiresAt - nowMs) / room.duration) * 100));
            const isCurrentActive = activeRoom && activeRoom.id === room.id;
            const isFull = (room.participants || 0) >= 10;
            
            return (
              <div 
                key={room.id}
                className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  expired
                    ? 'border-primary/5 bg-surface/20 opacity-50'
                    : isCurrentActive
                    ? 'border-primary/30 bg-primary/5 shadow-sm'
                    : 'border-primary/5 bg-surface/30 hover:border-primary/15 hover:bg-surface/50'
                }`}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  room.isPrivate ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                }`}>
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
                    <span className="flex items-center gap-1"><Users size={10} />{room.participants}/10</span>
                    {room.isPrivate && (
                      <>
                        <span className="opacity-30">•</span>
                        <span className="text-accent font-semibold flex items-center gap-0.5"><Lock size={10} /> Private</span>
                      </>
                    )}
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
                  ) : isFull ? (
                    <span className="text-[10px] font-bold text-secondary/50 uppercase tracking-wider bg-surface/50 px-2.5 py-1 rounded-lg">Full (10/10)</span>
                  ) : isCurrentActive ? (
                    <button
                      onClick={handleReturnToRoom}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-background rounded-lg transition-all"
                    >
                      Return
                      <ArrowLeft size={11} className="rotate-180" />
                    </button>
                  ) : activeRoom ? (
                    <button 
                      onClick={() => handleJoinRoom(room)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-background rounded-lg transition-all"
                      title="Leave current room & join this room"
                    >
                      Switch
                      <ArrowRightLeft size={11} />
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleJoinRoom(room)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary hover:text-background rounded-lg transition-all"
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

        {/* Empty Search State */}
        {filteredRooms.length === 0 && searchQuery && (
          <div className="text-center py-12 bg-surface/10 rounded-2xl border border-primary/5">
            <Search size={24} className="mx-auto text-secondary/40 mb-2" />
            <p className="text-sm font-bold text-primary">No rooms found</p>
            <p className="text-xs text-secondary mt-1">We couldn't find any rooms matching "{searchQuery}".</p>
          </div>
        )}

        {/* Empty State */}
        {!mockRooms.length && (
          <div className="text-center py-16">
            <p className="text-sm text-secondary mb-4">No active rooms. Start one!</p>
            <button 
              onClick={handleNewRoomClick}
              className="px-6 py-2.5 bg-primary text-background rounded-xl hover:bg-primary/90 transition-all font-bold text-sm"
            >
              Create Room
            </button>
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreateModal && createPortal(
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-backdrop-in" onClick={() => setShowCreateModal(false)}>
          <div className="bg-background border border-primary/20 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-modal-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Users size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-primary">New Room</h2>
                  <p className="text-xs text-secondary mt-0.5">Max 10 people • Max 12 hours</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full p-2 hover:bg-surface/80 transition-colors"
                  aria-label="Close"
                >
                  <X size={20} className="text-secondary hover:text-primary transition-colors" />
                </button>
              </div>
            </div>
            
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-[10px] font-black text-secondary mb-1.5 uppercase tracking-[0.2em]">Name</label>
                <input 
                  type="text" 
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g. Deep Work with Lofi" 
                  className="w-full px-4 py-3 bg-surface/50 border border-surface rounded-xl text-sm focus:outline-none focus:border-primary/50 text-primary placeholder-secondary transition-all"
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
                <div className="flex justify-between text-[9px] font-black text-secondary/50 uppercase tracking-widest mt-0.5">
                  <span>1h</span>
                  <span>12h</span>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-secondary mb-1.5 uppercase tracking-[0.2em]">Privacy & Access</label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button 
                    onClick={() => setCreatePrivacy('public')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      createPrivacy === 'public' 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-surface bg-surface/30 text-secondary hover:border-primary/30'
                    }`}
                  >
                    <Globe size={15} />
                    Public
                  </button>
                  <button 
                    onClick={() => setCreatePrivacy('private')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-xs font-bold transition-all ${
                      createPrivacy === 'private' 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-surface bg-surface/30 text-secondary hover:border-primary/30'
                    }`}
                  >
                    <Lock size={15} />
                    Private
                  </button>
                </div>

                {createPrivacy === 'private' && (
                  <div className="space-y-1.5 animate-in fade-in duration-200">
                    <label className="block text-[10px] font-black text-secondary mb-1.5 uppercase tracking-[0.2em]">Room Passcode</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={privateCode}
                        onChange={(e) => setPrivateCode(e.target.value)}
                        placeholder="Enter passcode (e.g. 1234)" 
                        className="w-full px-4 py-3 pl-9 bg-surface/50 border border-surface rounded-xl text-sm focus:outline-none focus:border-primary/50 text-primary placeholder-secondary/50 font-mono transition-all"
                      />
                      <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/50" />
                    </div>
                    <p className="text-[10px] text-secondary/60">Others will need this code to join your private room.</p>
                  </div>
                )}
              </div>

              <button 
                onClick={handleCreateRoom}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 text-background rounded-xl font-bold text-sm transition-all shadow-sm mt-2"
              >
                Start Session
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Passcode Modal for Private Rooms */}
      {passcodeModalRoom && createPortal(
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-backdrop-in" onClick={() => setPasscodeModalRoom(null)}>
          <div className="bg-background border border-primary/20 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-modal-in" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Lock size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-primary">Private Room</h3>
                  <p className="text-[11px] text-secondary">Enter passcode to join</p>
                </div>
              </div>
              <button onClick={() => setPasscodeModalRoom(null)} className="p-1.5 hover:bg-surface/80 rounded-full">
                <X size={18} className="text-secondary hover:text-primary" />
              </button>
            </div>
            
            <form onSubmit={handlePasscodeSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black text-secondary mb-1.5 uppercase tracking-[0.2em]">Passcode for {passcodeModalRoom.name}</label>
                <input 
                  type="text" 
                  value={inputPasscode}
                  onChange={(e) => { setInputPasscode(e.target.value); setPasscodeError(false); }}
                  placeholder="Enter passcode..."
                  className="w-full px-4 py-3 bg-surface/50 border border-surface rounded-xl text-sm focus:outline-none focus:border-primary/50 text-primary placeholder-secondary font-mono"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-xs text-red-500 font-semibold mt-1.5">Incorrect passcode. Try again (e.g. 1234).</p>
                )}
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-primary text-background rounded-xl font-bold text-sm hover:bg-primary/90 transition-all shadow-sm"
              >
                Join Room
              </button>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Leave Room Modal */}
      <LeaveRoomModal
        isOpen={showLeaveModal}
        onClose={() => {
          setShowLeaveModal(false);
          setPendingAction(null);
        }}
        onConfirm={handleConfirmLeave}
        roomName={activeRoom?.name}
        targetRoomName={
          pendingAction?.type === 'join'
            ? pendingAction.targetRoom?.name
            : null
        }
        customMessage={
          pendingAction?.type === 'create'
            ? `You are currently in "${activeRoom?.name}". You need to leave your current room before creating a new study room.`
            : pendingAction?.type === 'joinCode'
            ? `You are currently in "${activeRoom?.name}". You need to leave your current room before joining room code "${pendingAction.code}".`
            : null
        }
      />
    </div>
  );
};

export default Rooms;
