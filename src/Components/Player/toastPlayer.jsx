import React, { useState, useRef, useEffect } from "react";
import {
    Pause,
    Play,
    Music,
    Maximize2,
	Repeat1,
	SkipForward,
    Settings2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
    expandPlayer,
    restorePlayer,
} from "../../store/slices/musicSlice";
import PlaylistSelector from "./playlistSelector";

const ToastPlayer = ({
    musicEnabled,
    currentTrack,
    musicTracks,
    isRepeating,
    whiteNoiseTracks,
    whiteNoiseStates,
    isAllowedCompactPage,
    handlePlayPause,
    handleTrackChange,
    handleSkip,
    toggleWhiteNoise,
    getWhiteNoiseIcon,
}) => {
    const dispatch = useDispatch();
    const [showActionBar, setShowActionBar] = useState(false);
    const containerRef = useRef(null);

    // Close action bar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setShowActionBar(false);
            }
        };

        if (showActionBar) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showActionBar]);

    const toggleActionBar = () => {
        setShowActionBar(!showActionBar);
    };

    return (
        <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-none">
            {/* Mobile - Spinning Music Circle + Right Action Bar */}
            <div className="block sm:hidden">
                <div className="flex items-center gap-3" ref={containerRef}>
                    {/* Main Circle Button */}
                    <button
                        onClick={toggleActionBar}
                        className="w-14 h-14 rounded-full bg-primary text-background flex items-center justify-center shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                    >
                        {/* Spinning Music Icon */}
                        <Music 
                            size={20} 
                            className={`transition-transform ${
                                musicEnabled ? 'animate-spin' : ''
                            }`}
                            style={{
                                animationDuration: musicEnabled ? '3s' : '0s'
                            }}
                        />

                        {/* Subtle ring animation when playing */}
                        {musicEnabled && (
                            <div className="absolute inset-0 rounded-full border-2 border-background/20 animate-pulse" />
                        )}

                        {/* Small indicator dot */}
                        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-colors ${
                            showActionBar ? 'bg-accent' : 'bg-background/30'
                        }`} />
                    </button>

                    {/* Action Bar - appears to the right of circle */}
                    <div 
                        className={`bg-surface/95 backdrop-blur-sm rounded-full border border-primary/20 px-2 py-2 flex items-center gap-2 transition-all duration-300 ${
                            showActionBar 
                                ? 'opacity-100 scale-100 translate-x-0' 
                                : 'opacity-0 scale-95 -translate-x-4 pointer-events-none'
                        }`}
                    >
                        {/* Pause/Play Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering container click
                                handlePlayPause();
                            }}
                            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-sm ${
                                musicEnabled
                                    ? "bg-primary text-background"
                                    : "bg-primary/20 text-primary hover:bg-primary/30"
                            }`}
                            title={musicEnabled ? "Pause" : "Play"}
                        >
                            {musicEnabled ? (
                                <Pause size={16} />
                            ) : (
                                <Play size={16} className="ml-0.5" />
                            )}
                        </button>

                        {/* Settings Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering container click
                                dispatch(expandPlayer());
                                setShowActionBar(false); // Close action bar when opening settings
                            }}
                            className="w-11 h-11 rounded-full bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-colors shadow-sm"
                            title="Audio settings"
                        >
                            <Settings2 size={16} className="text-secondary hover:text-primary transition-colors" />
                        </button>

                        {/* Compact View Button (if available) */}
                        {isAllowedCompactPage && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent triggering container click
                                    dispatch(restorePlayer());
                                    setShowActionBar(false); // Close action bar when switching views
                                }}
                                className="w-11 h-11 rounded-full bg-surface/50 hover:bg-accent/20 flex items-center justify-center transition-colors shadow-sm"
                                title="Compact view"
                            >
                                <Maximize2 size={16} className="text-secondary hover:text-accent transition-colors" />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Desktop - Full Toast (unchanged) */}
            <div className="hidden sm:block">
                <div className="bg-surface/95 backdrop-blur-sm rounded-2xl border border-primary/20 p-5 min-w-80">
                    {/* Main Row */}
                    <div className="flex items-center gap-3 mb-5">
                        <button
                            onClick={handlePlayPause}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                musicEnabled
                                    ? "bg-primary text-background"
                                    : "bg-primary/20 text-primary hover:bg-primary/30"
                            }`}
                        >
                            {musicEnabled ? (
                                <Pause size={18} />
                            ) : (
                                <Play size={18} className="ml-0.5" />
                            )}
                        </button>

                        <PlaylistSelector
                            currentTrack={currentTrack}
                            tracks={musicTracks}
                            onChange={handleTrackChange}
                            className="flex-1"
                            size="small"
                            position="top"
                        />

                        <button
                            onClick={() => handleSkip("next")}
                            className="w-10 h-10 rounded-xl hover:bg-surface/50 flex items-center justify-center transition-colors"
                        >
                            <SkipForward size={16} className="text-secondary" />
                        </button>

                        <button
                            onClick={() => dispatch(toggleRepeat())}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                isRepeating
                                    ? "bg-accent text-background"
                                    : "hover:bg-surface/50 text-secondary hover:text-accent"
                            }`}
                            title={isRepeating ? "Repeat: On" : "Repeat: Off"}
                        >
                            <Repeat1 size={14} />
                        </button>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {whiteNoiseTracks.map((track) => {
                                const IconComponent = getWhiteNoiseIcon(track.name);
                                const state = whiteNoiseStates[track.name] || {
                                    enabled: false,
                                    volume: 30,
                                };

                                return (
                                    <button
                                        key={track.name}
                                        onClick={() => toggleWhiteNoise({ name: track.name })}
                                        className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                                            state.enabled
                                                ? "bg-accent text-background"
                                                : "bg-surface/50 text-secondary hover:bg-accent/20 hover:text-accent"
                                        }`}
                                        title={`${track.name} ${state.enabled ? "On" : "Off"}`}
                                    >
                                        <IconComponent size={14} />
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-2">
                            {isAllowedCompactPage && (
                                <button
                                    onClick={() => dispatch(restorePlayer())}
                                    className="w-10 h-10 rounded-xl hover:bg-surface/50 flex items-center justify-center transition-colors"
                                    title="Show compact player"
                                >
                                    <Maximize2 size={16} className="text-secondary" />
                                </button>
                            )}

                            <button
                                onClick={() => dispatch(expandPlayer())}
                                className="w-10 h-10 rounded-xl hover:bg-surface/50 flex items-center justify-center transition-colors"
                                title="Open audio settings"
                            >
                                <Settings2 size={16} className="text-secondary" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToastPlayer;
