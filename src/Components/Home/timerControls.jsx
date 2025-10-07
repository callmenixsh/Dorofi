// Components/Home/timerControls.jsx - Reset switches to work mode during breaks
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { startTimer, pauseTimer, resetTimer, switchMode } from '../../store/slices/timerSlice';

const TimerControls = () => {
    const dispatch = useDispatch();
    const { isRunning, mode, timeLeft, settings } = useSelector(state => state.timer);

    // Check if current mode is a break mode
    const isBreakMode = mode === 'shortBreak' || mode === 'longBreak';
    
    // Check if timer has been started (time has elapsed from initial duration)
    const getInitialDuration = () => {
        switch (mode) {
            case 'work': return settings.workDuration * 60;
            case 'shortBreak': return settings.shortBreakDuration * 60;
            case 'longBreak': return settings.longBreakDuration * 60;
            default: return settings.workDuration * 60;
        }
    };
    
    const hasTimerBeenStarted = timeLeft < getInitialDuration();
    
    // Button visibility logic - Show immediately when running OR after started
    const shouldShowResetButton = isRunning || hasTimerBeenStarted;
    const shouldShowSkipButton = (isRunning || hasTimerBeenStarted) && isBreakMode;

    // Get button colors based on current mode and running state
    const getButtonColors = () => {
        if (isRunning) {
            // Pause button - always secondary
            return {
                bg: 'bg-secondary',
                hover: 'hover:bg-secondary/90'
            };
        } else {
            // Play button - mode-specific colors
            switch (mode) {
                case 'work':
                    return {
                        bg: 'bg-primary',
                        hover: 'hover:bg-primary/90'
                    };
                case 'shortBreak':
                    return {
                        bg: 'bg-accent',
                        hover: 'hover:bg-accent/90'
                    };
                case 'longBreak':
                    return {
                        bg: 'bg-secondary',
                        hover: 'hover:bg-secondary/90'
                    };
                default:
                    return {
                        bg: 'bg-primary',
                        hover: 'hover:bg-primary/90'
                    };
            }
        }
    };

    const buttonColors = getButtonColors();

    const handleToggleTimer = () => {
        if (isRunning) {
            dispatch(pauseTimer());
        } else {
            dispatch(startTimer());
        }
    };

    const handleResetTimer = () => {
        // If in break mode, switch back to work mode first, then reset
        if (isBreakMode) {
            dispatch(switchMode({ mode: 'work' }));
        } else {
            // If in work mode, just reset normally
            dispatch(resetTimer());
        }
    };

    const handleSkipBreak = () => {
        // Only allow skipping breaks, switch back to work
        dispatch(switchMode({ mode: 'work' }));
        dispatch(resetTimer()); // Reset the timer when skipping
    };

    return (
        <div className="flex items-center justify-center">
            {/* Timer Controls Container */}
            <div className="relative flex items-center justify-center w-full max-w-sm h-20">
                {/* Left side - Reset Button emerging FROM center */}
                <div 
                    className={`absolute transition-all duration-300 ease-out ${
                        shouldShowResetButton 
                            ? 'opacity-100 left-0 scale-100' 
                            : 'opacity-0 left-1/2 -translate-x-1/2 scale-0 pointer-events-none'
                    }`}
                    style={{
                        transformOrigin: 'center center'
                    }}
                >
                    <button
                        onClick={handleResetTimer}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface/90 backdrop-blur-sm border border-primary/20 hover:bg-surface/70 flex items-center justify-center transition-all text-secondary hover:text-primary transform hover:scale-105"
                        title={isBreakMode ? "Back to Work" : "Reset Timer"}
                    >
                        <RotateCcw size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Center - Play/Pause Button (fixed position) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <button
                        onClick={handleToggleTimer}
                        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 ${buttonColors.bg} ${buttonColors.hover} text-background relative z-10`}
                        title={isRunning ? 'Pause Timer' : 'Start Timer'}
                    >
                        {isRunning ? (
                            <Pause size={28} className="sm:w-8 sm:h-8" />
                        ) : (
                            <Play size={28} className="sm:w-8 sm:h-8 ml-1" />
                        )}
                    </button>
                </div>

                {/* Right side - Skip Button emerging FROM center */}
                <div 
                    className={`absolute transition-all duration-300 ease-out ${
                        shouldShowSkipButton
                            ? 'opacity-100 right-0 scale-100'
                            : 'opacity-0 left-1/2 -translate-x-1/2 scale-0 pointer-events-none'
                    }`}
                    style={{
                        transformOrigin: 'center center'
                    }}
                >
                    <button
                        onClick={handleSkipBreak}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-surface/90 backdrop-blur-sm border border-primary/20 hover:bg-surface/70 flex items-center justify-center transition-all text-secondary hover:text-primary transform hover:scale-105"
                        title="Skip Break"
                    >
                        <SkipForward size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TimerControls;
