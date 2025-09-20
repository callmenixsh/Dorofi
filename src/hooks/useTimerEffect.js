// hooks/useTimerEffect.js - Handle timer countdown
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { tick } from '../store/slices/timerSlice';

export const useTimerEffect = () => {
  const dispatch = useDispatch();
  const { isRunning, timeLeft } = useSelector(state => state.timer);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        dispatch(tick());
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft, dispatch]);
};
