// hooks/useTimerEffect.js - With notification manager integration
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useTimer from './useTimer';
import soundManager from '../utils/sounds';
import notificationManager from '../utils/notifications'; // ADD THIS IMPORT

const useTimerEffect = () => {
    const { settings } = useSelector(state => state.timer);
    
    // Use the background-safe timer
    useTimer();

    // Request notification permission on mount and when notifications are enabled
    useEffect(() => {
        if (settings.notifications) {
            notificationManager.requestPermission();
        }
    }, [settings.notifications]);

    // Update sound manager when sound settings change
    useEffect(() => {
        soundManager.setEnabled(settings.soundEnabled);
    }, [settings.soundEnabled]);

    // Update notification manager when notification settings change
    useEffect(() => {
        notificationManager.setEnabled(settings.notifications);
    }, [settings.notifications]);
};

export default useTimerEffect;
