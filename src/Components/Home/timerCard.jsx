// Components/Home/timerCard.jsx - Fixed for New Schema
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import {
    Target,
    Sliders,
    Check,
    MoreHorizontal,
    Coffee,
    Zap,
    Lightbulb,
    X,
    Home,
    Brain,
    Eye,
    Heart,
    Leaf,
} from "lucide-react";
import { openTaskModal, toggleTask } from "../../store/slices/tasksSlice";
import { toggleSettings } from "../../store/slices/timerSlice";

const TimerCard = ({ isFocusMode = false }) => {
    const dispatch = useDispatch();
    const [showHelp, setShowHelp] = useState(false);

    // Get timer data from Redux store
    const { timeLeft, mode, settings, currentSession, isRunning } = useSelector(
        (state) => state.timer
    );

    // 🔥 FIXED: Get pinned task with new schema
    const pinnedTask = useSelector((state) =>
        state.tasks.tasks.find((task) => task.isPinned && !task.isCompleted)
    );

    // Lock body scroll when modal is open
    useEffect(() => {
        if (showHelp) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [showHelp]);

    // Format time function
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const handleTasksClick = () => {
        dispatch(openTaskModal());
    };

    const handleSettingsClick = () => {
        dispatch(toggleSettings());
    };

    // 🔥 FIXED: Handle task completion with new schema
    const handleCompleteTask = (e) => {
        e.stopPropagation();
        if (pinnedTask) {
            dispatch(toggleTask(pinnedTask._id)); // Use _id instead of id
        }
    };

    const handleHelpClick = () => {
        setShowHelp(true);
    };

    const handleCloseHelp = () => {
        setShowHelp(false);
    };

    // Get mode info with break mode colors
    const getModeInfo = () => {
        switch (mode) {
            case "work":
                return {
                    icon: <Zap size={isFocusMode ? 28 : 20} className="text-primary" />,
                    color: "text-primary",
                    bgColor: "bg-primary/10",
                    borderColor: "border-primary/20",
                    cardBg: "bg-surface/5",
                    cardBorder: "border-primary/15",
                    timerColor: "text-primary",
                    dotColor: "primary",
                };
            case "shortBreak":
                return {
                    icon: <Coffee size={isFocusMode ? 28 : 20} className="text-accent" />,
                    color: "text-accent",
                    bgColor: "bg-accent/10",
                    borderColor: "border-accent/20",
                    cardBg: "bg-accent/1",
                    cardBorder: "border-accent/15",
                    timerColor: "text-accent",
                    dotColor: "accent",
                };
            case "longBreak":
                return {
                    icon: <Leaf size={isFocusMode ? 28 : 20} className="text-secondary" />,
                    color: "text-secondary",
                    bgColor: "bg-secondary/10",
                    borderColor: "border-secondary/20",
                    cardBg: "bg-secondary/1",
                    cardBorder: "border-secondary/15",
                    timerColor: "text-secondary",
                    dotColor: "secondary",
                };
            default:
                return {
                    icon: <Zap size={isFocusMode ? 28 : 20} className="text-primary" />,
                    color: "text-primary",
                    bgColor: "bg-primary/10",
                    borderColor: "border-primary/20",
                    cardBg: "bg-surface/25",
                    cardBorder: "border-primary/20",
                    timerColor: "text-primary",
                    dotColor: "primary",
                };
        }
    };

    const modeInfo = getModeInfo();

    // Calculate progress for hidden timer mode
    const getProgress = () => {
        const totalDuration = (() => {
            switch (mode) {
                case "work":
                    return settings.workDuration * 60;
                case "shortBreak":
                    return settings.shortBreakDuration * 60;
                case "longBreak":
                    return settings.longBreakDuration * 60;
                default:
                    return settings.workDuration * 60;
            }
        })();
        return ((totalDuration - timeLeft) / totalDuration) * 100;
    };

    // Check if current mode is work mode
    const isWorkMode = mode === "work";

    return (
        <>
            <div
                className={`${isFocusMode ? 'bg-transparent border-none shadow-none w-full max-w-4xl mx-auto' : 'bg-surface/30 backdrop-blur-xl border border-primary/25 shadow-xl'} rounded-3xl ${isFocusMode ? 'p-12 sm:p-16' : 'p-8 sm:p-10'} transition-all duration-300 relative overflow-hidden group`}
            >
                {/* Ambient inner glows - hidden in focus mode */}
                {!isFocusMode && (
                    <>
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none group-hover:bg-accent/10 transition-colors duration-500"></div>
                    </>
                )}

                {/* Header Row */}
                <div className={`flex items-center ${isFocusMode ? 'mb-16' : 'mb-10'} relative z-10`}>
                    {/* Left side - Help button */}
                    <div className="flex-1">
                        <button
                            onClick={handleHelpClick}
                            className={`${isFocusMode ? 'w-12 h-12 rounded-2xl' : 'w-10 h-10 rounded-2xl'} bg-background/40 border border-surface/50 hover:border-primary/30 flex items-center justify-center transition-all text-secondary hover:text-primary shadow-sm hover:scale-105 active:scale-95`}
                            title={isWorkMode ? "Focus Tips" : "Break Tips"}
                        >
                            <Lightbulb size={isFocusMode ? 20 : 16} />
                        </button>
                    </div>

                    {/* Center - Mode Icon */}
                    {!settings.hideTimer && (
                        <div className="flex justify-center">
                            <div className={`p-4 rounded-2xl bg-background/50 backdrop-blur-md border border-primary/10 shadow-sm ${modeInfo.color}`}>
                                {React.cloneElement(modeInfo.icon, { size: isFocusMode ? 28 : 20 })}
                            </div>
                        </div>
                    )}

                    {/* Right side - Settings */}
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={handleSettingsClick}
                            className={`${isFocusMode ? 'w-12 h-12 rounded-2xl' : 'w-10 h-10 rounded-2xl'} bg-background/40 border border-surface/50 hover:border-primary/30 flex items-center justify-center transition-all text-secondary hover:text-primary shadow-sm hover:scale-105 active:scale-95`}
                            title="Timer Settings"
                        >
                            <Sliders size={isFocusMode ? 20 : 16} />
                        </button>
                    </div>
                </div>

                {/* Centered Content */}
                <div className={`text-center ${isFocusMode ? 'space-y-16' : 'space-y-10'} relative z-10`}>
                    {settings.hideTimer ? (
                        <div className="flex justify-center">
                            <div className="relative w-48 h-48 sm:w-60 sm:h-60">
                                {/* Progress Circle */}
                                <svg
                                    className="w-full h-full transform -rotate-90"
                                    viewBox="0 0 100 100"
                                >
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="46"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                        className="text-surface opacity-30"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="46"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeLinecap="round"
                                        className={`${modeInfo.color} transition-all duration-1000 ease-linear`}
                                        style={{
                                            strokeDasharray: `${2 * Math.PI * 46}`,
                                            strokeDashoffset: `${
                                                2 * Math.PI * 46 * (1 - getProgress() / 100)
                                            }`,
                                            filter: isRunning
                                                ? `drop-shadow(0 0 8px currentColor)`
                                                : "none",
                                        }}
                                    />
                                </svg>

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div
                                        className={`p-12 rounded-full ${
                                            modeInfo.bgColor
                                        } backdrop-blur-md border-2 ${modeInfo.borderColor} ${
                                            isRunning ? "shadow-[0_0_20px_rgba(var(--color-primary),0.2)] scale-105" : "scale-100"
                                        } transition-all duration-500`}
                                    >
                                        <div className={`${isRunning ? "animate-pulse" : ""}`}>
                                            {React.cloneElement(modeInfo.icon, {
                                                size: 54,
                                                className: modeInfo.color,
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`${isFocusMode ? 'text-9xl sm:text-[12rem]' : 'text-7xl sm:text-9xl'} font-mono font-black tracking-tighter ${
                                modeInfo.timerColor
                            } ${isRunning ? "drop-shadow-[0_0_20px_rgba(var(--color-primary),0.35)]" : "opacity-90"} leading-none`}
                        >
                            {formatTime(timeLeft)}
                        </div>
                    )}

                    <div className="flex justify-center gap-3">
                        {[...Array(settings.sessionsUntilLongBreak)].map((_, i) => (
                            <div
                                key={i}
                                className={`${isFocusMode ? 'w-4 h-4' : 'w-3.5 h-3.5'} rounded-full transition-all duration-500 border-2 ${
                                    i < currentSession.completedPomodoros 
                                    ? "bg-primary border-primary shadow-[0_0_10px_rgba(var(--color-primary),0.5)]" 
                                    : i === currentSession.completedPomodoros && isRunning
                                    ? "bg-primary/20 border-primary animate-pulse scale-125"
                                    : "bg-surface/50 border-surface/50"
                                }`}
                            />
                        ))}
                    </div>

                    {isWorkMode && (
                        <div className="max-w-xl mx-auto h-20 flex items-center">
                            {pinnedTask ? (
                                <div
                                    className={`w-full bg-background/40 backdrop-blur-md rounded-2xl p-5 border border-surface/50 transition-all duration-300 shadow-sm ${
                                        isRunning ? "border-primary/30 shadow-md ring-4 ring-primary/5" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleCompleteTask}
                                            className="w-8 h-8 rounded-full border-2 border-primary/40 hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10 group flex-shrink-0 active:scale-90"
                                            title="Mark as complete"
                                        >
                                            <Check
                                                size={14}
                                                className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                            />
                                        </button>

                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-bold text-primary truncate">
                                                {pinnedTask.name}
                                            </p>
                                            <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-0.5">Current focus</p>
                                        </div>

                                        <button
                                            onClick={handleTasksClick}
                                            className="w-10 h-10 rounded-xl bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-all text-secondary hover:text-primary flex-shrink-0"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={handleTasksClick}
                                    className="w-full h-full border-2 border-dashed border-primary/20 rounded-2xl hover:border-primary/40 transition-all group bg-background/20 backdrop-blur-sm flex items-center justify-center gap-4 active:scale-95"
                                >
                                    <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                                        <Target size={20} />
                                    </div>
                                    <span className="text-sm font-bold text-secondary group-hover:text-primary transition-colors">
                                        Assign a task to focus on
                                    </span>
                                </button>
                            )}
                        </div>
                    )}

                    {!isWorkMode && (
                        <div className="max-w-md mx-auto h-20 flex items-center justify-center">
                            <div
                                className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl ${modeInfo.bgColor} border ${modeInfo.borderColor} shadow-sm backdrop-blur-md animate-bounce-subtle`}
                            >
                                {React.cloneElement(modeInfo.icon, { size: 18 })}
                                <span className={`text-sm font-bold uppercase tracking-wider ${modeInfo.color}`}>
                                    {mode === "shortBreak"
                                        ? "Short Break"
                                        : "Long Break"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Help Modal */}
            {showHelp && createPortal(
                <div
                    className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-backdrop-in"
                    onClick={handleCloseHelp}
                >
                    <div
                        className="bg-background rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-primary/20 flex flex-col relative animate-modal-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                                    <Lightbulb size={24} className="text-background" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-primary">
                                        {isWorkMode ? "Focus Tips" : "Break Tips"}
                                    </h2>
                                </div>
                                <button
                                    onClick={handleCloseHelp}
                                    className="rounded-full p-2 hover:bg-surface/80 transition-colors"
                                    aria-label="Close"
                                >
                                    <X
                                        size={20}
                                        className="text-secondary hover:text-primary transition-colors"
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {isWorkMode ? (
                                /* Focus Tips */
                                <>
                                    <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 p-3 bg-primary rounded-xl shadow-sm">
                                                <Home size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-primary mb-3 text-lg">
                                                    Prepare Your Space
                                                </h3>
                                                <div className="grid gap-2">
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Clear your desk of distractions
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Turn off notifications on devices
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Have water and necessary materials ready
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Choose a comfortable, well-lit area
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 p-3 bg-primary rounded-xl shadow-sm">
                                                <Brain size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-primary mb-3 text-lg">
                                                    Stay Focused
                                                </h3>
                                                <div className="grid gap-2">
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Work on one task at a time
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            If you think of something else, jot it down
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Resist the urge to check social media
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Use deep breathing if you feel distracted
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Break Tips */
                                <>
                                    <div className="relative bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-4 border border-accent/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 p-3 bg-accent rounded-xl shadow-sm">
                                                <Heart size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-accent mb-3 text-lg">
                                                    Physical Wellness
                                                </h3>
                                                <div className="grid gap-2">
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Stand up and stretch your body
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Walk around or do light exercise
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Drink water to stay hydrated
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Take deep breaths for relaxation
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-4 border border-accent/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0 p-3 bg-accent rounded-xl shadow-sm">
                                                <Eye size={20} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-accent mb-3 text-lg">
                                                    Mental Rest
                                                </h3>
                                                <div className="grid gap-2">
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Look away from screens (20-20-20 rule)
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Step outside for fresh air if possible
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Listen to calming music
                                                        </span>
                                                    </div>
                                                    <div className="flex items-start gap-3 text-sm">
                                                        <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                                        <span className="text-secondary">
                                                            Avoid mentally demanding activities
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                 </>
                             )}
                         </div>
                     </div>
                 </div>,
                 document.body
             )}
        </>
    );
};

export default TimerCard;
