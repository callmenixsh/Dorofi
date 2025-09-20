// Components/Home/timerControls.jsx - Updated for Redux
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startTimer, pauseTimer, resetTimer } from '../../store/slices/timerSlice';

const TimerControls = () => {
  const dispatch = useDispatch();
  const { isRunning, mode } = useSelector(state => state.timer);

  const handleToggleTimer = () => {
    if (isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer());
    }
  };

  const handleResetTimer = () => {
    dispatch(resetTimer());
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Reset Button */}
      <button
        onClick={handleResetTimer}
        className="w-12 h-12 rounded-full border-2 border-surface hover:border-accent/50 flex items-center justify-center transition-colors"
        title="Reset Timer"
      >
        <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Play/Pause Button */}
      <button
        onClick={handleToggleTimer}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
          isRunning
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-primary hover:bg-primary/90 text-white'
        }`}
        title={isRunning ? 'Pause Timer' : 'Start Timer'}
      >
        {isRunning ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6 4h6" />
          </svg>
        )}
      </button>

      {/* Mode Switch Button */}
      <button
        onClick={() => {/* We'll add this later */}}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          mode === 'work'
            ? 'bg-accent/20 text-accent hover:bg-accent/30'
            : 'bg-primary/20 text-primary hover:bg-primary/30'
        }`}
        title={`Switch to ${mode === 'work' ? 'break' : 'work'}`}
      >
        {mode === 'work' ? '☕ Break' : '🎯 Focus'}
      </button>
    </div>
  );
};

export default TimerControls;
