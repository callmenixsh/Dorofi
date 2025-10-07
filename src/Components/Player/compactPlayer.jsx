import React, { useState } from "react";
import {
    Pause,
    Play,
    SkipForward,
    Repeat1,
    Minimize2,
    VolumeX,
    Volume2,
    ChevronUp,
    ChevronDown,
    Settings2,
} from "lucide-react";
import { useDispatch } from "react-redux";
import {
    toggleRepeat,
    expandPlayer,
    minimizePlayer,
} from "../../store/slices/musicSlice";
import PlaylistSelector from "./playlistSelector";

const CompactPlayer = ({
    musicEnabled,
    currentTrack,
    musicTracks,
    isRepeating,
    whiteNoiseTracks,
    whiteNoiseStates,
    volume,
    isMuted,
    handlePlayPause,
    handleTrackChange,
    handleSkip,
    handleMute,
    handleVolumeChange,
    toggleWhiteNoise,
    getWhiteNoiseIcon,
}) => {
    const dispatch = useDispatch();
    const [isSecondRowExpanded, setIsSecondRowExpanded] = useState(false);

    const toggleSecondRow = () => {
        setIsSecondRowExpanded(!isSecondRowExpanded);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-30">
            <div className="bg-surface/90 backdrop-blur-sm rounded-t-2xl sm:rounded-t-3xl border-t border-primary/20">
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                    {/* First Row - Main Controls with Expand Button */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handlePlayPause}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                    musicEnabled
                                        ? "bg-primary text-background"
                                        : "bg-primary/10 text-primary hover:bg-primary/20"
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
                                className="min-w-32 max-w-40"
                                size="small"
                                position="top"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleSkip("next")}
                                className="group w-8 h-8 rounded-lg hover:bg-accent/20 text-secondary hover:text-accent flex items-center justify-center transition-colors"
                            >
                                <SkipForward size={16} />
                            </button>

                            <button
                                onClick={() => dispatch(toggleRepeat())}
                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                                    isRepeating
                                        ? "bg-accent text-background"
                                        : "bg-surface/50 hover:bg-accent/20 text-secondary hover:text-accent"
                                }`}
                                title={isRepeating ? "Repeat: On" : "Repeat: Off"}
                            >
                                <Repeat1 size={14} />
                            </button>

                            {/* Expand/Collapse Button */}
                            <button
                                onClick={toggleSecondRow}
                                className="w-8 h-8 rounded-lg bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-all"
                                title={isSecondRowExpanded ? "Hide controls" : "Show controls"}
                            >
                                {isSecondRowExpanded ? (
                                    <ChevronDown size={14} className="text-secondary" />
                                ) : (
                                    <ChevronUp size={14} className="text-secondary" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Second Row - Collapsible Volume & Ambient Controls */}
                    <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isSecondRowExpanded ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="flex items-center justify-between px-4 py-2 border-t border-surface/30">
                            <div className="flex items-center gap-2 bg-surface/50 rounded-xl px-2 py-1 min-w-24">
                                <button
                                    onClick={handleMute}
                                    className="w-5 h-5 rounded-full hover:bg-surface/50 flex items-center justify-center transition-colors"
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX size={12} className="text-primary" />
                                    ) : (
                                        <Volume2 size={12} className="text-primary" />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="flex-1 volume-slider w-16"
                                    style={{
                                        background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume}%, var(--color-surface) ${volume}%, var(--color-surface) 100%)`,
                                    }}
                                />
                                <span className="text-xs text-secondary font-mono w-8 text-center">
                                    {volume}%
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                {whiteNoiseTracks.slice(0, 3).map((track) => {
                                    const IconComponent = getWhiteNoiseIcon(track.name);
                                    const state = whiteNoiseStates[track.name] || {
                                        enabled: false,
                                        volume: 30,
                                    };

                                    return (
                                        <button
                                            key={track.name}
                                            onClick={() => toggleWhiteNoise({ name: track.name })}
                                            className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center ${
                                                state.enabled
                                                    ? "bg-accent text-background"
                                                    : "bg-surface/50 text-secondary hover:bg-accent/20 hover:text-accent"
                                            }`}
                                            title={`${track.name} ${state.enabled ? "On" : "Off"}`}
                                        >
                                            <IconComponent size={12} />
                                        </button>
                                    );
                                })}

                                <button
                                    onClick={() => dispatch(minimizePlayer())}
                                    className="w-8 h-8 rounded-lg bg-surface/50 hover:bg-secondary/20 flex items-center justify-center transition-colors ml-1"
                                    title="Minimize to toast"
                                >
                                    <Minimize2 size={12} className="text-secondary" />
                                </button>

                                <button
                                    onClick={() => dispatch(expandPlayer())}
                                    className="w-8 h-8 rounded-lg bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-colors"
                                    title="Open audio settings"
                                >
                                    <Settings2 size={12} className="text-secondary" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desktop Layout - Unchanged */}
                <div className="hidden sm:flex items-center gap-3 lg:gap-5 px-4 sm:px-6 lg:px-8 py-2 lg:py-3">
                    <button
                        onClick={handlePlayPause}
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all ${
                            musicEnabled
                                ? "bg-primary text-background"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                    >
                        {musicEnabled ? (
                            <Pause size={18} className="lg:w-5 lg:h-5" />
                        ) : (
                            <Play size={18} className="lg:w-5 lg:h-5 ml-0.5" />
                        )}
                    </button>

                    <PlaylistSelector
                        currentTrack={currentTrack}
                        tracks={musicTracks}
                        onChange={handleTrackChange}
                        className="min-w-40 lg:min-w-48"
                        size="small"
                        position="top"
                    />

                    <button
                        onClick={() => handleSkip("next")}
                        className="group w-10 h-10 lg:w-12 lg:h-12 rounded-2xl hover:bg-accent/20 text-secondary hover:text-accent flex items-center justify-center transition-colors"
                    >
                        <SkipForward size={16} className="lg:w-[18px] lg:h-[18px]" />
                    </button>

                    <button
                        onClick={() => dispatch(toggleRepeat())}
                        className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center transition-all ${
                            isRepeating
                                ? "bg-accent text-background"
                                : "bg-surface/50 hover:bg-accent/20 text-secondary hover:text-accent"
                        }`}
                        title={isRepeating ? "Repeat: On" : "Repeat: Off"}
                    >
                        <Repeat1 size={16} className="lg:w-[18px] lg:h-[18px]" />
                    </button>

                    <div className="flex items-center gap-2 bg-surface/50 rounded-2xl px-3 py-2 min-w-28 lg:min-w-32">
                        <button
                            onClick={handleMute}
                            className="w-5 h-5 lg:w-6 lg:h-6 rounded-full hover:bg-surface/50 flex items-center justify-center transition-colors"
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX size={12} className="lg:w-[14px] lg:h-[14px] text-primary" />
                            ) : (
                                <Volume2 size={12} className="lg:w-[14px] lg:h-[14px] text-primary" />
                            )}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="flex-1 volume-slider"
                            style={{
                                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume}%, var(--color-surface) ${volume}%, var(--color-surface) 100%)`,
                            }}
                        />
                    </div>

                    <div className="flex-1"></div>

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
                                    className={`w-8 h-8 lg:w-10 lg:h-10 rounded-xl transition-all flex items-center justify-center ${
                                        state.enabled
                                            ? "bg-accent text-background"
                                            : "bg-surface/50 text-secondary hover:bg-accent/20 hover:text-accent"
                                    }`}
                                    title={`${track.name} ${state.enabled ? "On" : "Off"}`}
                                >
                                    <IconComponent size={14} className="lg:w-4 lg:h-4" />
                                </button>
                            );
                        })}

                        <button
                            onClick={() => dispatch(minimizePlayer())}
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-surface/50 hover:bg-secondary/20 flex items-center justify-center transition-colors ml-2"
                            title="Minimize to toast"
                        >
                            <Minimize2 size={14} className="lg:w-4 lg:h-4 text-secondary" />
                        </button>

                        <button
                            onClick={() => dispatch(expandPlayer())}
                            className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-colors"
                            title="Open audio settings"
                        >
                            <Settings2 size={14} className="lg:w-4 lg:h-4 text-secondary" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompactPlayer;
