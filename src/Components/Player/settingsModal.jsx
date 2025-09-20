import React from "react";
import {
    Settings,
    X,
    Music,
    Waves,
    SkipBack,
    SkipForward,
    Play,
    Pause,
    Repeat1,
    Volume2,
    VolumeX,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { closeModal, toggleRepeat } from "../../store/slices/musicSlice";
import PlaylistSelector from "./playlistSelector";

const SettingsModal = ({
    currentTrack,
    musicTracks,
    musicEnabled,
    isRepeating,
    volume,
    isMuted,
    whiteNoiseTracks,
    whiteNoiseStates,
    handleTrackChange,
    handlePlayPause,
    handleSkip,
    handleMute,
    handleVolumeChange,
    toggleWhiteNoise,
    setWhiteNoiseVolume,
    getWhiteNoiseIcon,
}) => {
    const dispatch = useDispatch();

    return (
        <div className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-xs sm:max-w-2xl lg:max-w-4xl max-h-[90vh] sm:max-h-[85vh] bg-surface/95 rounded-2xl sm:rounded-3xl border border-primary/20 overflow-hidden">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-surface/50">
                    <h2 className="text-lg sm:text-2xl font-bold text-primary flex items-center gap-2 sm:gap-3">
                        <Settings size={20} className="sm:w-6 sm:h-6" />
                        <span className="hidden sm:inline">Audio Settings</span>
                        <span className="sm:hidden">Audio</span>
                    </h2>
                    <button
                        onClick={() => dispatch(closeModal())}
                        className="group w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-surface/50 flex items-center justify-center transition-colors"
                        title="Close settings"
                    >
                        <X size={16} className="sm:w-[18px] sm:h-[18px] text-secondary group-hover:text-primary transition-colors" />
                    </button>
                </div>

                <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 overflow-y-auto max-h-[calc(90vh-80px)] sm:max-h-[calc(85vh-88px)]">
                    {/* Music Controls Section */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                            <Music size={16} className="sm:w-5 sm:h-5" />
                            Music Controls
                        </h3>

                        <div className="bg-background/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Track Selection & Playback */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <PlaylistSelector
                                    currentTrack={currentTrack}
                                    tracks={musicTracks}
                                    onChange={handleTrackChange}
                                    className="w-full sm:min-w-48"
                                    size="large"
                                    position="bottom"
                                />

                                <div className="flex items-center justify-center gap-2 sm:gap-4">
                                    <button
                                        onClick={() => handleSkip("prev")}
                                        className="group w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-surface hover:border-primary/50 flex items-center justify-center transition-colors"
                                    >
                                        <SkipBack size={16} className="sm:w-5 sm:h-5 text-secondary group-hover:text-primary transition-colors" />
                                    </button>

                                    <button
                                        onClick={handlePlayPause}
                                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-colors ${
                                            musicEnabled
                                                ? "bg-accent hover:bg-accent/80 text-background"
                                                : "bg-primary hover:bg-primary/90 text-background"
                                        }`}
                                    >
                                        {musicEnabled ? (
                                            <Pause size={20} className="sm:w-6 sm:h-6" />
                                        ) : (
                                            <Play size={20} className="sm:w-6 sm:h-6 ml-0.5 sm:ml-1" />
                                        )}
                                    </button>

                                    <button
                                        onClick={() => handleSkip("next")}
                                        className="group w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-surface hover:border-primary/50 flex items-center justify-center transition-colors"
                                    >
                                        <SkipForward size={16} className="sm:w-5 sm:h-5 text-secondary group-hover:text-primary transition-colors" />
                                    </button>

                                    <button
                                        onClick={() => dispatch(toggleRepeat())}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                                            isRepeating
                                                ? "bg-accent text-background border-accent"
                                                : "border-surface hover:border-accent/50 text-secondary hover:text-accent"
                                        }`}
                                        title={isRepeating ? "Repeat: On" : "Repeat: Off"}
                                    >
                                        <Repeat1 size={14} className="sm:w-[18px] sm:h-[18px]" />
                                    </button>
                                </div>
                            </div>

                            {/* Volume Control */}
                            <div className="flex items-center gap-3 sm:gap-4">
                                <button
                                    onClick={handleMute}
                                    className="group w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors flex-shrink-0"
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX size={14} className="sm:w-[18px] sm:h-[18px] text-primary" />
                                    ) : (
                                        <Volume2 size={14} className="sm:w-[18px] sm:h-[18px] text-primary" />
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
                                <span className="text-secondary w-8 sm:w-12 text-center text-xs sm:text-sm font-medium flex-shrink-0">
                                    {volume}%
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Ambient Sounds Section */}
                    <div>
                        <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 flex items-center gap-2">
                            <Waves size={16} className="sm:w-5 sm:h-5" />
                            Ambient Sounds
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            {whiteNoiseTracks.map((track) => {
                                const IconComponent = getWhiteNoiseIcon(track.name);
                                const state = whiteNoiseStates[track.name] || {
                                    enabled: false,
                                    volume: 30,
                                };

                                return (
                                    <div
                                        key={track.name}
                                        className="bg-background/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 space-y-3 sm:space-y-4 border border-surface/30 hover:border-primary/30 transition-colors"
                                    >
                                        {/* Track Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                                <div
                                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                                                        state.enabled
                                                            ? "bg-accent text-background"
                                                            : "bg-surface text-secondary"
                                                    }`}
                                                >
                                                    <IconComponent size={14} className="sm:w-[18px] sm:h-[18px]" />
                                                </div>
                                                <h4 className="font-medium text-primary text-sm sm:text-base truncate">
                                                    {track.name}
                                                </h4>
                                            </div>

                                            <button
                                                onClick={() => toggleWhiteNoise({ name: track.name })}
                                                className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full transition-all hover:shadow-md relative flex items-center flex-shrink-0 ${
                                                    state.enabled 
                                                        ? "bg-primary hover:bg-primary/90 justify-end" 
                                                        : "bg-surface hover:bg-surface/80 border-2 border-primary/20 justify-start"
                                                }`}
                                            >
                                                <div
                                                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-all shadow-sm m-1 ${
                                                        state.enabled 
                                                            ? "bg-background" 
                                                            : "bg-primary"
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        {/* Volume Control */}
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <button
                                                onClick={() => {
                                                    const newVol = state.volume === 0 ? 30 : 0;
                                                    setWhiteNoiseVolume({
                                                        name: track.name,
                                                        volume: newVol,
                                                    });
                                                }}
                                                disabled={!state.enabled}
                                                className="group w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                                            >
                                                {state.volume === 0 ? (
                                                    <VolumeX size={10} className="sm:w-3 sm:h-3 text-accent" />
                                                ) : (
                                                    <Volume2 size={10} className="sm:w-3 sm:h-3 text-accent" />
                                                )}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={state.volume}
                                                onChange={(e) =>
                                                    setWhiteNoiseVolume({
                                                        name: track.name,
                                                        volume: parseInt(e.target.value),
                                                    })
                                                }
                                                disabled={!state.enabled}
                                                className="flex-1 white-noise-slider disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{
                                                    background: state.enabled
                                                        ? `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${state.volume}%, var(--color-surface) ${state.volume}%, var(--color-surface) 100%)`
                                                        : `var(--color-surface)`,
                                                }}
                                            />
                                            <span className="text-xs text-secondary w-6 sm:w-8 text-center font-mono flex-shrink-0">
                                                {state.volume}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
