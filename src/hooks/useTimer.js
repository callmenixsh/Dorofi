// src/hooks/useTimer.js - Super simple, no auto-correction spam
import { useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    tick,
    startTimer,
    pauseTimer,
    resetTimer,
    completeSessionWithStatsRefresh,
    fetchUserStats
} from '../store/slices/timerSlice';

export const useTimer = () => {
    const dispatch = useDispatch();
    const timer = useSelector(state => state.timer);
    
    const intervalRef = useRef(null);

    // Format time helper
    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);

    // Tick every second; slice computes timeLeft from expectedEndTime
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        // Use syncTimer to compute timeLeft from expectedEndTime so the timer
        // remains accurate when the page is backgrounded and intervals are throttled.
        if (timer.isRunning && timer.timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                dispatch({ type: 'timer/syncTimer' });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [timer.isRunning, timer.timeLeft, dispatch]);

    // Correct significant drift when tab visibility changes
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && timer.isRunning && timer.currentSession?.expectedEndTime) {
                const now = Date.now();
                const shouldHaveTimeLeft = Math.max(0, Math.ceil((timer.currentSession.expectedEndTime - now) / 1000));
                const drift = Math.abs(timer.timeLeft - shouldHaveTimeLeft);
                
                // Only correct significant drift when tab becomes visible
                if (drift > 3) {
                    console.log('👁️ Major drift on tab focus, correcting:', { drift });
                    dispatch({ type: 'timer/syncTimer' });
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [timer.isRunning, timer.timeLeft, timer.currentSession?.expectedEndTime, dispatch]);

    // Backend sync
    useEffect(() => {
        if (timer.needsBackendSync && timer.isLoggedIn) {
            dispatch(completeSessionWithStatsRefresh(timer.needsBackendSync));
        }
    }, [timer.needsBackendSync, timer.isLoggedIn, dispatch]);

    // Stats fetch
    useEffect(() => {
        if (timer.isLoggedIn && !timer.lastSyncDate) {
            dispatch(fetchUserStats());
        }
    }, [timer.isLoggedIn, timer.lastSyncDate, dispatch]);

    const toggleTimer = useCallback(() => {
        dispatch(timer.isRunning ? pauseTimer() : startTimer());
    }, [timer.isRunning, dispatch]);

    const handleReset = useCallback(() => {
        dispatch(resetTimer());
    }, [dispatch]);

    return {
        ...timer,
        formatTime,
        toggleTimer,
        handleReset
    };
};

export default useTimer;
