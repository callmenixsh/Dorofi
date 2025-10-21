// hooks/userActivityDetection.js - Accept isAuthenticated parameter
import { useEffect } from 'react';
import apiService from '../services/api';

export const useActivityDetection = (isAuthenticated) => {
    useEffect(() => {
        // Only run if user is authenticated
        if (!isAuthenticated) return;

        let activityTimer;
        let isActive = true;

        const resetTimer = () => {
            clearTimeout(activityTimer);
            
            // If user was away, mark as online
            if (!isActive) {
                apiService.updatePresenceStatus('online').catch(console.error);
                isActive = true;
            }

            // Set away after 10 minutes of inactivity
            activityTimer = setTimeout(() => {
                apiService.updatePresenceStatus('away').catch(console.error);
                isActive = false;
            }, 10 * 60 * 1000); // 10 minutes
        };

        // Listen for user activity
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, resetTimer, true);
        });

        resetTimer(); // Start the timer

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, resetTimer, true);
            });
            clearTimeout(activityTimer);
        };
    }, [isAuthenticated]);
};
