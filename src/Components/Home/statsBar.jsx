import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
import { fetchUnifiedStats } from '../../store/slices/statsSlice';
import { clearSessionCompletedFlag } from '../../store/slices/timerSlice';
import { Target, Flame, Clock, LogIn, Zap } from 'lucide-react';

const StatsBar = React.memo(() => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    
    const [showHourFormat, setShowHourFormat] = useState(true);
    
    const timerData = useSelector(useCallback((state) => ({
        totalFocusTime: state.timer.totalFocusTime,
        sessions: state.timer.sessions,
        streak: state.timer.streak,
        dailyGoalEnabled: state.timer.settings.dailyGoalEnabled,
        dailyGoal: state.timer.settings.dailyGoal,
        sessionJustCompleted: state.timer.sessionJustCompleted,
        isLoggedIn: state.timer.isLoggedIn
    }), []));
    
    const timerStats = useSelector(useCallback((state) => state.stats?.timer, []));

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

    const formatTimeHours = useCallback((minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
    }, []);

    const formatTimeMinutes = useCallback((minutes) => {
        return `${minutes}m`;
    }, []);

    const formatTime = useCallback((minutes) => {
        return showHourFormat ? formatTimeHours(minutes) : formatTimeMinutes(minutes);
    }, [showHourFormat, formatTimeHours, formatTimeMinutes]);

    const goalProgress = useMemo(() => {
        return timerData.dailyGoalEnabled 
            ? Math.min((displayStats.focusTimeMinutes / timerData.dailyGoal) * 100, 100) 
            : 0;
    }, [timerData.dailyGoalEnabled, displayStats.focusTimeMinutes, timerData.dailyGoal]);

    const toggleTimeFormat = useCallback(() => {
        setShowHourFormat(prev => !prev);
    }, []);

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
        <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center gap-6 mb-3">
                {/* Focus Time - Clickable */}
                <button
                    onClick={toggleTimeFormat}
                    className="px-5 py-3 rounded-xl bg-surface border border-background hover:border-primary/20 transition-all cursor-pointer active:scale-95"
                    title={`Focus Time Today - Click to switch format (${showHourFormat ? 'hr/min' : 'minutes only'})`}
                >
                    <div className="flex items-center gap-3">
                        <Clock size={18} className="text-primary" />
                        <div className="text-xl font-bold text-primary">
                            {formatTime(displayStats.focusTimeMinutes)}
                        </div>
                    </div>
                </button>

                {/* Sessions */}
                <div 
                    className="px-5 py-3 rounded-xl bg-surface border border-background hover:border-primary/20 transition-all"
                    title="Sessions Completed"
                >
                    <div className="flex items-center gap-3">
                        <Zap size={18} className="text-accent" />
                        <div className="text-xl font-bold text-primary">
                            {displayStats.sessions}
                        </div>
                    </div>
                </div>

                {/* Streak */}
                <div 
                    className="px-5 py-3 rounded-xl bg-surface border border-background hover:border-accent/20 transition-all"
                    title={isAuthenticated ? "Day Streak" : "Login for streaks"}
                >
                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Flame size={18} className="text-accent" />
                            <div className="text-xl font-bold text-accent">
                                {displayStats.streak}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <LogIn size={16} className="text-secondary" />
                            <div className="text-sm font-medium text-secondary">
                                Login
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Goal Card */}
            {timerData.dailyGoalEnabled && (
                <div 
                    className="w-full max-w-md px-4 py-2.5 rounded-xl bg-surface border border-background hover:border-primary/20 transition-all"
                    title={`Daily Goal: ${formatTime(displayStats.focusTimeMinutes)} / ${formatTime(timerData.dailyGoal)}`}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Target size={14} className="text-primary" />
                            <span className="text-xs font-medium text-primary">Daily Goal</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-secondary">
                                {formatTime(displayStats.focusTimeMinutes)} / {formatTime(timerData.dailyGoal)}
                            </span>
                            <span className="text-xs font-medium text-primary">
                                {Math.round(goalProgress)}%
                            </span>
                        </div>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-700"
                            style={{ width: `${goalProgress}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

StatsBar.displayName = 'StatsBar';

export default StatsBar;
