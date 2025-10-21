// Components/Home/timerControls.jsx - Simplified Shortcuts with Confirmation
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Play,
    Pause,
    RotateCcw,
    SkipForward,
    Settings,
    Zap,
    Clock,
    Target,
    X,
    AlertTriangle,
    Code,
} from "lucide-react";
import {
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    completeSession,
    setTimeLeftDirect,
} from "../../store/slices/timerSlice";

const TimerControls = () => {
    const dispatch = useDispatch();
    const {
        isRunning,
        mode,
        timeLeft,
        settings,
        sessions,
        totalFocusTime,
        isLoggedIn,
    } = useSelector((state) => state.timer);
    
    const [showDevMenu, setShowDevMenu] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    
    // 🎮 KONAMI CODE STATE
    const [konamiSequence, setKonamiSequence] = useState([]);
    const [devModeUnlocked, setDevModeUnlocked] = useState(false);
    const [showKonamiSuccess, setShowKonamiSuccess] = useState(false);
    
    // The legendary Konami Code: ↑↑↓↓←→←→BA
    const KONAMI_CODE = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];

    // Check if current mode is a break mode
    const isBreakMode = mode === "shortBreak" || mode === "longBreak";

    // Check if timer has been started (time has elapsed from initial duration)
    const getInitialDuration = () => {
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
    };

    const hasTimerBeenStarted = timeLeft < getInitialDuration();

    // Button visibility logic - Show immediately when running OR after started
    const shouldShowResetButton = isRunning || hasTimerBeenStarted;
    const shouldShowSkipButton = (isRunning || hasTimerBeenStarted) && isBreakMode;

    // Get button colors based on current mode and running state
    const getButtonColors = () => {
        if (isRunning) {
            return {
                bg: "bg-secondary",
                hover: "hover:bg-secondary/90",
            };
        } else {
            switch (mode) {
                case "work":
                    return {
                        bg: "bg-primary",
                        hover: "hover:bg-primary/90",
                    };
                case "shortBreak":
                    return {
                        bg: "bg-accent",
                        hover: "hover:bg-accent/90",
                    };
                case "longBreak":
                    return {
                        bg: "bg-secondary",
                        hover: "hover:bg-secondary/90",
                    };
                default:
                    return {
                        bg: "bg-primary",
                        hover: "hover:bg-primary/90",
                    };
            }
        }
    };

    const buttonColors = getButtonColors();

    // 🎮 KONAMI CODE DETECTION
    useEffect(() => {
        const handleKonamiInput = (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            const newSequence = [...konamiSequence, event.code].slice(-KONAMI_CODE.length);
            setKonamiSequence(newSequence);

            if (newSequence.length === KONAMI_CODE.length && 
                newSequence.every((key, index) => key === KONAMI_CODE[index])) {
                
                console.log('🎮 KONAMI CODE ACTIVATED! Dev mode unlocked!');
                setDevModeUnlocked(true);
                setShowKonamiSuccess(true);
                setKonamiSequence([]);

                setTimeout(() => {
                    setShowKonamiSuccess(false);
                }, 3000);

                if (typeof window !== 'undefined' && window.navigator?.vibrate) {
                    window.navigator.vibrate([100, 50, 100, 50, 100]);
                }
            }

            if (newSequence.length >= KONAMI_CODE.length && 
                !KONAMI_CODE.every((key, index) => key === newSequence[index])) {
                setKonamiSequence([]);
            }
        };

        document.addEventListener('keydown', handleKonamiInput);
        return () => document.removeEventListener('keydown', handleKonamiInput);
    }, [konamiSequence]);

    // 🔥 SIMPLIFIED KEYBOARD SHORTCUTS - Only Space, R, S
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Don't trigger shortcuts when typing in inputs or when confirmation is showing
            if (event.target.tagName === 'INPUT' || 
                event.target.tagName === 'TEXTAREA' || 
                showResetConfirm) {
                return;
            }

            const key = event.key.toLowerCase();
            
            switch (key) {
                case ' ': // Space - Start/Pause timer
                    event.preventDefault();
                    handleToggleTimer();
                    break;
                    
                case 'r': // R - Reset timer (with confirmation for work mode)
                    event.preventDefault();
                    if (shouldShowResetButton) {
                        handleResetTimer();
                    }
                    break;
                    
                case 's': // S - Skip break (only in break mode)
                    event.preventDefault();
                    if (shouldShowSkipButton) {
                        handleSkipBreak();
                    }
                    break;
                    
                case 'escape': // ESC - Close modals
                    if (showResetConfirm) {
                        setShowResetConfirm(false);
                    } else if (devModeUnlocked && showDevMenu) {
                        setShowDevMenu(false);
                    }
                    break;
                    
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isRunning, shouldShowResetButton, shouldShowSkipButton, showResetConfirm, devModeUnlocked, showDevMenu]);

    const handleToggleTimer = () => {
        if (isRunning) {
            dispatch(pauseTimer());
        } else {
            dispatch(startTimer());
        }
    };

    const handleResetTimer = () => {
        if (isBreakMode) {
            // Break modes - reset immediately
            dispatch(switchMode({ mode: "work" }));
        } else {
            // Work mode - show confirmation
            setShowResetConfirm(true);
        }
    };

    const confirmReset = () => {
        dispatch(resetTimer());
        setShowResetConfirm(false);
    };

    const handleSkipBreak = () => {
        dispatch(switchMode({ mode: "work" }));
        dispatch(resetTimer());
    };

    // 🔧 DEV FUNCTIONS
    const devCompleteSession = () => {
        console.log("🧪 DEV: Force completing session");
        dispatch(completeSession());
    };

    const devCompleteMultipleSessions = (count) => {
        console.log(`🧪 DEV: Force completing ${count} sessions`);
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                dispatch(completeSession());
            }, i * 100);
        }
    };

    const devSetTimeLeft = (seconds) => {
        console.log(`🧪 DEV: Setting timer to ${seconds} seconds`);
        dispatch(setTimeLeftDirect(seconds));
    };

    const devSwitchToWork = () => {
        console.log("🧪 DEV: Switching to work mode");
        dispatch(switchMode({ mode: "work" }));
    };

    return (
        <div className="flex flex-col items-center justify-center">
            {/* 🎮 KONAMI SUCCESS NOTIFICATION */}
            {showKonamiSuccess && (
                <div className="fixed top-4 right-4 z-[60] bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg shadow-2xl animate-pulse">
                    <div className="flex items-center gap-2">
                        <Code size={20} />
                        <span className="font-bold">🎮 KONAMI CODE ACTIVATED!</span>
                    </div>
                    <div className="text-xs opacity-90 mt-1">Developer mode unlocked!</div>
                </div>
            )}

            {/* ⚠️ RESET CONFIRMATION MODAL */}
            {showResetConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-surface rounded-2xl shadow-2xl p-6 max-w-sm mx-4 border border-background">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                <AlertTriangle size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary mb-1">Reset Work Timer?</h3>
                                <p className="text-sm text-secondary">This will reset your current work session. This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 px-4 py-2 bg-background text-secondary rounded-lg hover:bg-surface transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmReset}
                                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Timer Controls Container */}
            <div className="relative flex items-center justify-center w-full max-w-sm h-20 mb-4">
                {/* Left side - Reset Button */}
                <div
                    className={`absolute transition-all duration-300 ease-out ${
                        shouldShowResetButton
                            ? "opacity-100 left-0 scale-100"
                            : "opacity-0 left-1/2 -translate-x-1/2 scale-0 pointer-events-none"
                    }`}
                    style={{
                        transformOrigin: "center center",
                    }}
                >
                    <button
                        onClick={handleResetTimer}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface/90 backdrop-blur-sm border border-primary/20 hover:bg-surface/70 flex items-center justify-center transition-all text-secondary hover:text-primary transform hover:scale-105"
                        title={`${isBreakMode ? "Back to Work" : "Reset Timer"} (R)`}
                    >
                        <RotateCcw size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Center - Play/Pause Button */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button
                        onClick={handleToggleTimer}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${buttonColors.bg} ${buttonColors.hover} text-background relative z-10`}
                        title={`${isRunning ? "Pause Timer" : "Start Timer"} (Space)`}
                    >
                        {isRunning ? (
                            <Pause size={28} className="sm:w-8 sm:h-8" />
                        ) : (
                            <Play size={28} className="sm:w-8 sm:h-8 ml-1" />
                        )}
                    </button>
                </div>

                {/* Right side - Skip Button (Only in break mode) */}
                <div
                    className={`absolute transition-all duration-300 ease-out ${
                        shouldShowSkipButton
                            ? "opacity-100 right-0 scale-100"
                            : "opacity-0 left-1/2 -translate-x-1/2 scale-0 pointer-events-none"
                    }`}
                    style={{
                        transformOrigin: "center center",
                    }}
                >
                    <button
                        onClick={handleSkipBreak}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface/90 backdrop-blur-sm border border-primary/20 hover:bg-surface/70 flex items-center justify-center transition-all text-secondary hover:text-primary transform hover:scale-105"
                        title="Skip Break (S)"
                    >
                        <SkipForward size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* 🎮 DEV MODE TOGGLE BUTTON */}
            {devModeUnlocked && (
                <button
                    onClick={() => setShowDevMenu(!showDevMenu)}
                    className="mb-4 px-3 py-1 bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 rounded-lg hover:from-primary/30 hover:to-accent/30 transition-all text-xs font-mono flex items-center gap-2"
                    title="Toggle Dev Panel (Konami Code Unlocked)"
                >
                    <Code size={14} />
                    {showDevMenu ? 'Hide' : 'Show'} Dev Panel
                </button>
            )}

            {/* 🧪 DEV MENU */}
            {devModeUnlocked && showDevMenu && (
                <div className="fixed right-4 top-40 z-50 bg-surface border border-background rounded-xl shadow-2xl p-4 w-72 max-h-[80vh] overflow-y-auto">
                    
                    {/* Header */}
                    <div className="mb-4 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Code size={16} className="text-primary" />
                                <span className="text-sm font-bold text-primary">DEV MODE</span>
                            </div>
                            <button
                                onClick={() => setShowDevMenu(false)}
                                className="p-1 rounded hover:bg-surface/50 transition-colors"
                            >
                                <X size={14} className="text-secondary" />
                            </button>
                        </div>
                        <div className="text-xs text-secondary mt-1">🎮 Unlocked with Konami Code!</div>
                    </div>
                    
                    {/* Keyboard Shortcuts */}
                    <div className="mb-4 p-3 bg-background rounded-lg">
                        <div className="text-xs font-semibold text-primary mb-2">Active Shortcuts:</div>
                        <div className="flex flex-wrap gap-1 text-xs">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Space</span>
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">R</span>
                            {isBreakMode && <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">S</span>}
                        </div>
                    </div>

                    {/* Current State */}
                    <div className="mb-6 text-xs bg-background rounded-lg p-3">
                        <div className="font-semibold text-primary mb-2">Current State:</div>
                        <div className="space-y-1 text-secondary">
                            <div className="flex justify-between">
                                <span>Mode:</span>
                                <span className="font-mono text-primary">{mode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Time Left:</span>
                                <span className="font-mono text-primary">{timeLeft}s</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Sessions:</span>
                                <span className="font-mono text-primary">{sessions}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Focus Time:</span>
                                <span className="font-mono text-primary">{totalFocusTime}m</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Timer Controls */}
                    <div className="mb-6">
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => devSetTimeLeft(5)}
                                className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                            >
                                5s
                            </button>
                            <button
                                onClick={() => devSetTimeLeft(10)}
                                className="px-3 py-2 text-xs bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                            >
                                10s
                            </button>
                            <button
                                onClick={() => devSetTimeLeft(1)}
                                className="px-3 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                1s
                            </button>
                        </div>
                    </div>

                    {/* Session Simulation */}
                    <div className="mb-6">
                        <div className="space-y-3">
                            <button
                                onClick={devCompleteSession}
                                className="w-full px-4 py-3 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center justify-center gap-2 font-medium"
                            >
                                <Zap size={16} />
                                Complete 1 Session
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => devCompleteMultipleSessions(3)}
                                    className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    Complete 3
                                </button>
                                <button
                                    onClick={() => devCompleteMultipleSessions(5)}
                                    className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    Complete 5
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mode Controls */}
                    <div className="mb-4">
                        <button
                            onClick={devSwitchToWork}
                            className="w-full px-4 py-3 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <Target size={16} />
                            Switch to Work
                        </button>
                    </div>

                    {/* Reset Dev Mode */}
                    <div className="border-t border-surface pt-4">
                        <button
                            onClick={() => {
                                setDevModeUnlocked(false);
                                setShowDevMenu(false);
                                console.log('🎮 Dev mode locked. Enter Konami Code to unlock again!');
                            }}
                            className="w-full px-4 py-2 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            🔒 Lock Dev Mode
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimerControls;
