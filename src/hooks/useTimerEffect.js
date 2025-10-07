// hooks/useTimerEffect.js - Enhanced with your custom notification sounds
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useTimer from './useTimer';
import soundManager from '../utils/sounds';

const useTimerEffect = () => {
    const { 
        settings, 
        timeLeft, 
        isRunning, 
        mode 
    } = useSelector(state => state.timer);
    
    // Use the background-safe timer
    useTimer();

    // Request notification permission
    useEffect(() => {
        if (settings.notifications && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, [settings.notifications]);

    // Update sound manager when sound settings change
    useEffect(() => {
        soundManager.setEnabled(settings.soundEnabled);
    }, [settings.soundEnabled]);

    // 🔊 Play your custom sounds when session completes
    useEffect(() => {
        // Only play sound when timer hits 0 and was running (session just completed)
        if (timeLeft === 0 && !isRunning && settings.soundEnabled) {
            if (mode === 'work') {
                // Work session completed - play your work completion sound
                soundManager.playWorkCompleteSound();
                
                // Optional: Browser notification
                if (settings.notifications && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification('🎯 Focus Session Complete!', {
                        body: 'Great work! Time for a break.',
                        icon: '/favicon.ico',
                        tag: 'timer-complete',
                        silent: true // We're handling sound ourselves
                    });
                }
            } else {
                // Break ended - play your break completion sound
                soundManager.playBreakCompleteSound();
                
                if (settings.notifications && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification('⏰ Break Time Over', {
                        body: 'Ready to focus again?',
                        icon: '/favicon.ico',
                        tag: 'break-complete',
                        silent: true
                    });
                }
            }
        }
    }, [timeLeft, isRunning, mode, settings.soundEnabled, settings.notifications]);
};

export default useTimerEffect;
