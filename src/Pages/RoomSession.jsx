import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Users } from 'lucide-react';
import useTimer from '../hooks/useTimer';
import { addReaction, addMessage } from '../store/slices/roomsSlice';

// Room Components
import RoomHeader from '../Components/Rooms/RoomHeader';
import RoomSidebar from '../Components/Rooms/RoomSidebar';
import RoomMainContent from '../Components/Rooms/RoomMainContent';
import RoomShareModal from '../Components/Rooms/RoomShareModal';

const RoomSession = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [activeTab, setActiveTab] = useState('participants');
  const [chatMessage, setChatMessage] = useState('');
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isJoining, setIsJoining] = useState(true);
  const [joiningStep, setJoiningStep] = useState(0);
  const chatEndRef = useRef(null);
  
  useTimer();
  
  const { activeRoom, recentReactions, messages } = useSelector(state => state.rooms);
  const { showTaskModal } = useSelector((state) => state.tasks);
  const { showSettings } = useSelector((state) => state.timer);
  const { user } = useSelector((state) => state.profile);

  const participants = [
    { id: '1', name: 'Alex (Host)', task: 'Writing Research Paper', mode: 'work', timeLeft: 1240, progress: 65, avatar: 'A' },
    { id: '2', name: 'Sarah', task: 'Studying Organic Chemistry', mode: 'work', timeLeft: 180, progress: 92, avatar: 'S' },
    { id: '3', name: 'Mike', task: 'Coffee break...', mode: 'shortBreak', timeLeft: 300, progress: 10, avatar: 'M' },
    { id: '4', name: 'Jamie', task: 'Design System Work', mode: 'work', timeLeft: 1500, progress: 30, avatar: 'J' },
  ];

  const reactions = [
    { type: 'fire', icon: '🔥', label: 'Cheer' },
    { type: 'heart', icon: '❤️', label: 'Love' },
    { type: 'coffee', icon: '☕', label: 'Break' },
    { type: 'zap', icon: '⚡', label: 'Focus' },
  ];

  const COOLDOWN_MS = 1000;

  const handleSendReaction = (type, targetName = 'the room') => {
    if (cooldownRemaining > 0) return;
    setCooldownRemaining(COOLDOWN_MS);
    dispatch(addReaction({ 
      type, 
      from: user?.displayName || 'You',
      target: targetName
    }));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    dispatch(addMessage({
      from: user?.displayName || 'You',
      text: chatMessage,
      userId: user?._id || 'me'
    }));
    setChatMessage('');
  };

  const handleLeaveRoom = () => {
    if (window.confirm('Are you sure you want to leave the study room?')) {
      navigate('/rooms');
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, recentReactions, activeTab]);

  // Joining Simulation steps
  useEffect(() => {
    const steps = [
      'Establishing connection to server...',
      'Retrieving focus group details...',
      'Syncing local Pomodoro timer...',
      'Entering study workspace...'
    ];

    const stepInterval = setInterval(() => {
      setJoiningStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 400);

    const timer = setTimeout(() => {
      setIsJoining(false);
      clearInterval(stepInterval);
    }, 1600);

    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
    };
  }, []);

  // Cooldown effect
  useEffect(() => {
    if (cooldownRemaining > 0) {
      const timer = setInterval(() => {
        setCooldownRemaining(prev => Math.max(0, prev - 100));
      }, 100);
      return () => clearInterval(timer);
    }
  }, [cooldownRemaining]);

  // Tab key sidebar toggle listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const isTyping =
          e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.isContentEditable;

        if (!isTyping) {
          e.preventDefault();
          setIsSidebarOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isJoining) {
    const steps = [
      'Establishing connection to server...',
      'Retrieving focus group details...',
      'Syncing local Pomodoro timer...',
      'Entering study workspace...'
    ];
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-sm mx-auto space-y-6">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 animate-ping duration-1000" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 animate-spin duration-[3000ms]">
              <Users size={28} className="text-background" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-lg font-black text-primary uppercase tracking-widest">Joining Study Room</h2>
            <div className="h-1.5 w-32 bg-surface rounded-full mx-auto overflow-hidden border border-primary/5">
              <div 
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${((joiningStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono h-4">
              {steps[joiningStep]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">

      {/* Sidebar - Fixed, doesn't participate in flow */}
      <RoomSidebar
        isOpen={isSidebarOpen}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onClose={setIsSidebarOpen}
        onSendReaction={handleSendReaction}
        cooldownRemaining={cooldownRemaining}
        participants={participants}
        recentReactions={recentReactions}
        messages={messages}
        onSendMessage={handleSendMessage}
        chatMessage={chatMessage}
        setChatMessage={setChatMessage}
        chatEndRef={chatEndRef}
        COOLDOWN_MS={COOLDOWN_MS}
        reactions={reactions}
        user={user}
      />

      {/* Main scrollable content - shifts left when sidebar is open */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:mr-80' : 'mr-0'
        } min-h-screen overflow-y-auto custom-scrollbar`}
      >
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          
          {/* Room Header */}
          <RoomHeader
            roomId={roomId}
            roomName={activeRoom?.name || 'Study Room'}
            participantsCount={participants.length}
            onShareClick={() => setShowShareModal(true)}
            onLeaveClick={handleLeaveRoom}
            onToggleSidebar={setIsSidebarOpen}
            isSidebarOpen={isSidebarOpen}
          />

          {/* Timer Section */}
          <div className="space-y-8 mt-6">
            <RoomMainContent
              showTaskModal={showTaskModal}
              showSettings={showSettings}
            />
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <RoomShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        roomId={roomId}
        roomLink={window.location.href}
      />
    </div>
  );
};

export default RoomSession;