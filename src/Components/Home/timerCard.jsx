// Components/Home/timerCard.jsx - Updated for Redux
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openTaskModal } from '../../store/slices/tasksSlice';

const TimerCard = () => {
  const dispatch = useDispatch();
  
  // Get timer data from Redux store
  const { timeLeft, mode, sessions } = useSelector(state => state.timer);
  
  // Get pinned task from Redux store
  const pinnedTask = useSelector(state => 
    state.tasks.tasks.find(task => task.isPinned && !task.completed)
  );
  
  // Format time function (moved from Home.jsx)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTasksClick = () => {
    dispatch(openTaskModal());
  };

  return (
    <div className="bg-surface/80 backdrop-blur-sm rounded-3xl p-8 border border-surface shadow-lg text-center">
      
      {/* Mode indicator */}
      <div className="mb-4">
        <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
          mode === 'work' 
            ? 'bg-primary/20 text-primary' 
            : 'bg-accent/20 text-accent'
        }`}>
          {mode === 'work' ? '🎯 Focus Time' : '☕ Break Time'}
        </span>
      </div>

      {/* Timer display */}
      <div className="mb-6">
        <div className="text-6xl font-bold text-primary mb-2">
          {formatTime(timeLeft)}
        </div>
        <div className="text-secondary">
          Session {sessions}
        </div>
      </div>

      {/* Pinned task */}
      {pinnedTask && (
        <div className="mb-6 p-4 bg-background/50 rounded-2xl">
          <div className="text-sm text-secondary mb-2">📌 Current Focus</div>
          <div className="text-primary font-medium">{pinnedTask.text}</div>
        </div>
      )}

      {/* Tasks button */}
      <button
        onClick={handleTasksClick}
        className="bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-primary/90 transition-colors"
      >
        {pinnedTask ? 'Manage Tasks' : 'Add Tasks'}
      </button>
    </div>
  );
};

export default TimerCard;
