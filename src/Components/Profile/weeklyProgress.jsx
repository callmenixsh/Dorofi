// components/Profile/WeeklyProgress.jsx - Clean Production Version
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchUnifiedStats } from "../../store/slices/statsSlice";
import { Edit3, Check, X, Target, Clock, Zap } from "lucide-react";
import apiService from "../../services/api";

export default function WeeklyProgress() {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useAuth();

    const [isEditingGoal, setIsEditingGoal] = useState(false);
    const [editedHours, setEditedHours] = useState(5);
    const [editedMinutes, setEditedMinutes] = useState(0);
    const [localWeeklyGoal, setLocalWeeklyGoal] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Get timer section for weeklyGoal and weeklyFocusTime
    const {
        timer: timerStats,
        isLoading,
        error: statsError,
    } = useSelector((state) => state.stats || {});

    // Fetch stats when authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            dispatch(fetchUnifiedStats());
        }
    }, [isAuthenticated, user, dispatch]);

    // Initialize edited values from timer stats
    useEffect(() => {
        if (timerStats?.weeklyGoal !== undefined) {
            const hours = Math.floor(timerStats.weeklyGoal / 60);
            const minutes = timerStats.weeklyGoal % 60;
            setEditedHours(hours);
            setEditedMinutes(minutes);
            setLocalWeeklyGoal(null);
        }
    }, [timerStats?.weeklyGoal]);

    // Format time function
    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    const weeklyFocusTime = timerStats?.weeklyFocusTime || 0;

    const weeklyGoal =
        localWeeklyGoal !== null
            ? localWeeklyGoal
            : timerStats?.weeklyGoal !== undefined
            ? timerStats.weeklyGoal
            : editedHours * 60 + editedMinutes;

    const weeklyProgress =
        weeklyGoal > 0 ? Math.min((weeklyFocusTime / weeklyGoal) * 100, 100) : 0;

    const isGoalCompleted = weeklyProgress >= 100;
    const timeRemaining = Math.max(0, weeklyGoal - weeklyFocusTime);

    const handleEditGoal = () => {
        const hours = Math.floor(weeklyGoal / 60);
        const minutes = weeklyGoal % 60;
        setEditedHours(hours);
        setEditedMinutes(minutes);
        setIsEditingGoal(true);
        setError("");
    };

    const handleSaveGoal = async () => {
        const totalMinutes = editedHours * 60 + editedMinutes;

        if (totalMinutes < 0 || totalMinutes > 10080) {
            setError("Goal must be between 0 and 168 hours");
            return;
        }

        setSaving(true);
        setError("");

        try {
            setLocalWeeklyGoal(totalMinutes);
            setIsEditingGoal(false);

            await apiService.updateWeeklyGoal(totalMinutes);

            // Refresh stats after successful update
            setTimeout(() => {
                dispatch(fetchUnifiedStats());
            }, 300);
        } catch (error) {
            setLocalWeeklyGoal(null);
            setIsEditingGoal(true);
            setError(error.message || "Failed to update goal. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        const hours = Math.floor(weeklyGoal / 60);
        const minutes = weeklyGoal % 60;
        setEditedHours(hours);
        setEditedMinutes(minutes);
        setIsEditingGoal(false);
        setError("");
    };

    const handlePresetGoal = (hours) => {
        setEditedHours(hours);
        setEditedMinutes(0);
    };

    // Don't show if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Show loading state
    if (isLoading && !timerStats) {
        return (
            <div className="bg-surface rounded-xl p-6 mb-6 animate-pulse border border-background">
                <div className="flex items-center justify-between mb-4">
                    <div className="h-6 w-24 bg-background rounded-lg"></div>
                    <div className="h-4 w-20 bg-background rounded-lg"></div>
                </div>
                <div className="w-full bg-background rounded-full h-3 mb-4"></div>
                <div className="h-4 w-32 bg-background rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-xl p-6 mb-6 border border-background shadow-sm hover:shadow-md transition-all duration-300">
            {/* Show stats error if any */}
            {statsError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 flex items-center gap-2">
                    <X size={16} />
                    Unable to load profile data. Please try refreshing.
                </div>
            )}

            {/* Header Layout */}
            <div className="flex items-center justify-between mb-5">
                {/* Left side - Title with icon */}
                <div className="flex items-center gap-3">
                    <Target className={`w-6 h-6 ${
                        isGoalCompleted ? 'text-green-500' : 'text-primary'
                    } transition-colors duration-300`} />
                    <div>
                        <h2 className="text-lg font-semibold text-primary">Weekly Goal</h2>
                        {isGoalCompleted && (
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                <Zap size={12} />
                                Goal achieved!
                            </p>
                        )}
                    </div>
                </div>

                {/* Right side - Progress info */}
                <div className="text-right flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`px-2 py-1 rounded-full text-xs font-bold ${
                            isGoalCompleted 
                                ? 'bg-green-500/10 text-green-600 border border-green-500/20' 
                                : weeklyProgress > 75
                                ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                                : 'bg-primary/10 text-primary border border-primary/20'
                        } transition-all duration-300`}>
                            {Math.round(weeklyProgress)}% Completed
                        </div>
                    </div>
                    <div className="text-sm text-secondary">
                        <span className="font-medium text-primary">
                            {formatTime(timeRemaining)}
                        </span>
                        <span> remaining</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-5">
                <div className="w-full bg-background rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                        className={`h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
                            isGoalCompleted 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                                : 'bg-gradient-to-r from-primary to-primary/80'
                        }`}
                        style={{ width: `${Math.min(weeklyProgress, 100)}%` }}
                    >
                        {/* Animated shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                </div>
                
                {/* Progress indicator dot */}
                {weeklyProgress > 0 && (
                    <div 
                        className={`absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${
                            isGoalCompleted ? 'bg-green-500' : 'bg-primary'
                        } shadow-lg transition-all duration-700`}
                        style={{ left: `${Math.min(weeklyProgress, 100)}%` }}
                    ></div>
                )}
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
                {/* Left - Current time with icon */}
                <div className="flex items-center gap-2">
                    <Clock size={16} className="text-secondary" />
                    <div className="text-sm">
                        <span className="font-bold text-primary text-base">{formatTime(weeklyFocusTime)}</span>
                        <span className="text-secondary ml-1">focused</span>
                    </div>
                </div>

                {/* Right - Editable Goal */}
                <div className="flex items-center gap-2">
                    {isEditingGoal ? (
                        <div className="inline-flex items-center gap-3 p-2 bg-background rounded-lg border border-primary/20">
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    value={editedHours}
                                    onChange={(e) =>
                                        setEditedHours(
                                            Math.max(0, Math.min(168, parseInt(e.target.value) || 0))
                                        )
                                    }
                                    className="w-14 px-2 py-1 text-sm bg-surface border border-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center text-primary font-medium"
                                    min="0"
                                    max="168"
                                    disabled={saving}
                                    autoFocus
                                />
                                <span className="text-sm text-secondary font-medium">h</span>
                                <input
                                    type="number"
                                    value={editedMinutes}
                                    onChange={(e) =>
                                        setEditedMinutes(
                                            Math.max(0, Math.min(59, parseInt(e.target.value) || 0))
                                        )
                                    }
                                    className="w-14 px-2 py-1 text-sm bg-surface border border-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-center text-primary font-medium"
                                    min="0"
                                    max="59"
                                    disabled={saving}
                                />
                                <span className="text-sm text-secondary font-medium">m</span>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={handleSaveGoal}
                                    disabled={saving}
                                    className="p-2 text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 shadow-sm"
                                    title="Save goal"
                                >
                                    <Check size={14} />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={saving}
                                    className="p-2 text-secondary hover:text-primary hover:bg-background rounded-md transition-colors"
                                    title="Cancel"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={handleEditGoal}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-secondary hover:text-primary hover:bg-background rounded-lg transition-all duration-200 group"
                            title="Edit weekly goal"
                        >
                            <span className="font-semibold">
                                {(weeklyGoal / 60).toFixed(1)}h/week
                            </span>
                            <Edit3 size={14} className="group-hover:scale-110 transition-transform" />
                            {saving && (
                                <div className="w-3 h-3 border border-primary border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {localWeeklyGoal !== null && !saving && (
                                <div
                                    className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                                    title="Goal updated"
                                ></div>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* Quick presets when editing */}
            {isEditingGoal && (
                <div className="mt-5 pt-4 border-t border-background">
                    <div className="flex items-center gap-2 mb-3">
                        <Clock size={14} className="text-secondary" />
                        <span className="text-sm text-secondary font-medium">Quick presets:</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {[2, 5, 10, 20, 25, 45].map((hours) => (
                            <button
                                key={hours}
                                onClick={() => handlePresetGoal(hours)}
                                className={`px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
                                    editedHours === hours && editedMinutes === 0
                                        ? "bg-primary text-white shadow-md scale-105"
                                        : "bg-background text-secondary hover:bg-primary/10 hover:text-primary hover:scale-105"
                                }`}
                                disabled={saving}
                            >
                                {hours}h
                            </button>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}
