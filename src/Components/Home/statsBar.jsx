// Components/Home/statsBar.jsx - Ultra-lightweight version
import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUnifiedStats } from '../../store/slices/statsSlice';
import { clearSessionCompletedFlag } from '../../store/slices/timerSlice';
import { LogIn } from 'lucide-react';

const StatsBar = React.memo(() => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    
    // 🔥 ULTRA SELECTIVE - Only the bare minimum from timer state
    const timerData = useSelector(useCallback((state) => ({
        totalFocusTime: state.timer.totalFocusTime,
        sessions: state.timer.sessions,
        streak: state.timer.streak,
        dailyGoalEnabled: state.timer.settings.dailyGoalEnabled,
        dailyGoal: state.timer.settings.dailyGoal,
        sessionJustCompleted: state.timer.sessionJustCompleted,
        isLoggedIn: state.timer.isLoggedIn
    }), []));
    
    // Unified stats (separate selector to prevent cascading updates)
    const timerStats = useSelector(useCallback((state) => state.stats?.timer, []));

    // 🔥 MEMOIZED CALCULATIONS
    const displayStats = useMemo(() => {
        if (isAuthenticated && timerStats) {
            return {
                focusTimeMinutes: timerStats.dailyFocusTime || 0,
                sessions: timerStats.dailySessions || 0,
                streak: timerStats.currentStreak || 0,
            };
        }
        return {
            focusTimeMinutes: Math.floor((timerData.totalFocusTime || 0) / 60),
            sessions: timerData.sessions || 0,
            streak: timerData.streak || 0,
        };
    }, [isAuthenticated, timerStats, timerData.totalFocusTime, timerData.sessions, timerData.streak]);

    const formatTime = useCallback((minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
    }, []);

    const goalProgress = useMemo(() => {
        return timerData.dailyGoalEnabled 
            ? Math.min((displayStats.focusTimeMinutes / timerData.dailyGoal) * 100, 100) 
            : 0;
    }, [timerData.dailyGoalEnabled, displayStats.focusTimeMinutes, timerData.dailyGoal]);

    // 🔥 MINIMAL EFFECTS - Only essential operations
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUnifiedStats());
        }
    }, [isAuthenticated, dispatch]);

    useEffect(() => {
        if (timerData.sessionJustCompleted) {
            const timeoutId = setTimeout(() => {
                dispatch(fetchUnifiedStats());
                dispatch(clearSessionCompletedFlag());
            }, 500);
            return () => clearTimeout(timeoutId);
        }
    }, [timerData.sessionJustCompleted, dispatch]);

    return (
        <div className="flex items-center justify-center gap-16 mb-8">
            {/* Focus Time */}
            <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                    {formatTime(displayStats.focusTimeMinutes)}
                </div>
                {timerData.dailyGoalEnabled && (
                    <div className="w-20 h-1 bg-surface rounded-full mb-2">
                        <div 
                            className="h-1 bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${goalProgress}%` }}
                        />
                    </div>
                )}
                <div className="text-sm text-secondary">
                    {timerData.dailyGoalEnabled ? `Goal: ${timerData.dailyGoal}m` : 'Today'}
                </div>
            </div>

            {/* Sessions */}
            <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                    {displayStats.sessions}
                </div>
                <div className="text-sm text-secondary">Sessions</div>
            </div>

            {/* Streak */}
            <div className="text-center">
                {isAuthenticated ? (
                    <>
                        <div className="text-2xl font-bold text-accent mb-1">
                            {displayStats.streak}
                        </div>
                        <div className="text-sm text-secondary">Day Streak</div>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-surface/50 flex items-center justify-center">
                            <LogIn size={20} className="text-secondary" />
                        </div>
                        <div className="text-xs text-secondary">Login for<br />streaks</div>
                    </>
                )}
            </div>
        </div>
    );
});

StatsBar.displayName = 'StatsBar';

export default StatsBar;
