// src/hooks/useTimer.js - Custom hook for timer logic
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tick, startTimer, pauseTimer, resetTimer } from '../store/slices/timerSlice';

export const useTimer = () => {
  const dispatch = useDispatch();
  const timer = useSelector(state => state.timer);
  const intervalRef = useRef(null);

  // Format time helper
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Timer effect - handles the countdown
  useEffect(() => {
    if (timer.isRunning && timer.timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        dispatch(tick());
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, [timer.isRunning, timer.timeLeft, dispatch]);

  // Timer control functions
  const toggleTimer = () => {
    if (timer.isRunning) {
      dispatch(pauseTimer());
    } else {
      dispatch(startTimer());
    }
  };

  const handleReset = () => {
    dispatch(resetTimer());
  };

  return {
    ...timer,
    formatTime,
    toggleTimer,
    handleReset
  };
};
