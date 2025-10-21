import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { CloudRain, Wind, Waves, Bird } from "lucide-react";
import {
  toggleMusic, setMusicEnabled, setCurrentTrack, setVolume,
  skipToNext, skipToPrevious, toggleWhiteNoise, setWhiteNoiseVolume,
  setCurrentRoute,
} from "../../store/slices/musicSlice";

import ToastPlayer from "./toastPlayer";
import CompactPlayer from "./compactPlayer";
import SettingsModal from "./settingsModal";

const UniversalMusicPlayer = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const musicRef = useRef(null);
  const whiteNoiseRefs = useRef({});
  const [isMuted, setIsMuted] = useState(false);
  const [volumeBeforeMute, setVolumeBeforeMute] = useState(35);

  // Get state from Redux
  const {
    currentTrack, volume, musicEnabled, whiteNoiseStates,
    isExpanded, isMinimized, musicTracks, whiteNoiseTracks, currentRoute,
    isRepeating,
  } = useSelector((state) => state.music);

  // Track route changes
  useEffect(() => {
    if (location.pathname !== currentRoute) {
      dispatch(setCurrentRoute(location.pathname));
    }
  }, [location.pathname, currentRoute, dispatch]);

  // Icon mapping
  const getWhiteNoiseIcon = (trackName) => {
    const icons = { Rain: CloudRain, Underwater: Wind, Waves, Chirp: Bird };
    return icons[trackName] || Waves;
  };

  // Effects
  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    Object.entries(whiteNoiseStates).forEach(([name, state]) => {
      const audio = whiteNoiseRefs.current[name];
      if (audio && state) {
        audio.volume = state.volume / 100;
        state.enabled ? audio.play().catch(() => {}) : audio.pause();
      }
    });
  }, [whiteNoiseStates]);

  // Handlers
  const handlePlayPause = () => {
    if (!musicRef.current) return;
    musicEnabled ? musicRef.current.pause() : musicRef.current.play().catch(() => {});
    dispatch(toggleMusic());
  };

  const handleTrackChange = (newTrack) => {
    dispatch(setCurrentTrack(newTrack));
    if (musicEnabled) {
      setTimeout(() => musicRef.current?.play().catch(() => {}), 100);
    }
  };

  const handleSkip = (direction) => {
    if (direction === "next" && isRepeating) {
      if (musicRef.current) {
        musicRef.current.currentTime = 0;
        musicRef.current.play().catch(() => {});
      }
      return;
    }
    
    dispatch(direction === "next" ? skipToNext() : skipToPrevious());
    setTimeout(() => musicRef.current?.play().catch(() => {}), 100);
  };

  const handleMute = () => {
    if (isMuted) {
      dispatch(setVolume(volumeBeforeMute));
      setIsMuted(false);
    } else {
      setVolumeBeforeMute(volume);
      dispatch(setVolume(0));
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseInt(e.target.value);
    dispatch(setVolume(newVol));
    if (newVol > 0 && isMuted) setIsMuted(false);
  };

  // 🎵 KEYBOARD CONTROLS - Music + White Noise
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = event.key.toLowerCase();
      
      switch (key) {
        case 'm': // M - Play/Pause music
          event.preventDefault();
          handlePlayPause();
          break;
          
        case 'n': // N - Skip to next track
          event.preventDefault();
          handleSkip('next');
          break;

        // 🌧️ WHITE NOISE CONTROLS
        case '1': // 1 - Toggle first white noise (usually Rain)
          event.preventDefault();
          if (whiteNoiseTracks[0]) {
            dispatch(toggleWhiteNoise({ name: whiteNoiseTracks[0].name }));
            console.log(`🌧️ Toggled ${whiteNoiseTracks[0].name} via keyboard (1)`);
          }
          break;
          
        case '2': // 2 - Toggle second white noise (usually Underwater)
          event.preventDefault();
          if (whiteNoiseTracks[1]) {
            dispatch(toggleWhiteNoise({ name: whiteNoiseTracks[1].name }));
            console.log(`🌊 Toggled ${whiteNoiseTracks[1].name} via keyboard (2)`);
          }
          break;
          
        case '3': // 3 - Toggle third white noise (usually Waves)
          event.preventDefault();
          if (whiteNoiseTracks[2]) {
            dispatch(toggleWhiteNoise({ name: whiteNoiseTracks[2].name }));
            console.log(`🌊 Toggled ${whiteNoiseTracks[2].name} via keyboard (3)`);
          }
          break;
          
        case '4': // 4 - Toggle fourth white noise (usually Chirp)
          event.preventDefault();
          if (whiteNoiseTracks[3]) {
            dispatch(toggleWhiteNoise({ name: whiteNoiseTracks[3].name }));
            console.log(`🐦 Toggled ${whiteNoiseTracks[3].name} via keyboard (4)`);
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
  }, [musicEnabled, isRepeating, whiteNoiseTracks]); // Added whiteNoiseTracks to dependencies

  const currentMusicTrack = musicTracks.find(track => track.name === currentTrack);
  
  const allowedCompactPages = ['/', '/rooms'];
  const isAllowedCompactPage = allowedCompactPages.includes(currentRoute);
  
  const showCompactPlayer = isAllowedCompactPage && !isMinimized && !isExpanded;
  const showToastPlayer = isMinimized || (!isAllowedCompactPage && !isExpanded);

  // Add body padding when compact player is visible
  useEffect(() => {
    if (showCompactPlayer) {
      document.body.classList.add('has-compact-music-player');
    } else {
      document.body.classList.remove('has-compact-music-player');
    }
    
    return () => {
      document.body.classList.remove('has-compact-music-player');
    };
  }, [showCompactPlayer]);

  const commonProps = {
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
    toggleWhiteNoise: (payload) => dispatch(toggleWhiteNoise(payload)),
    setWhiteNoiseVolume: (payload) => dispatch(setWhiteNoiseVolume(payload)),
    getWhiteNoiseIcon
  };

  return (
    <>
      {/* Audio Elements */}
      <div style={{ display: "none" }}>
        <audio
          ref={musicRef}
          src={currentMusicTrack?.file}
          onEnded={() => handleSkip("next")}
          onPlay={() => dispatch(setMusicEnabled(true))}
          onPause={() => dispatch(setMusicEnabled(false))}
          loop={isRepeating}
        />
        {whiteNoiseTracks.map((track) => (
          <audio
            key={track.name}
            ref={(el) => (whiteNoiseRefs.current[track.name] = el)}
            src={track.file}
            loop
          />
        ))}
      </div>

      {/* Toast Player */}
      {showToastPlayer && (
        <ToastPlayer 
          {...commonProps}
          isAllowedCompactPage={isAllowedCompactPage}
        />
      )}

      {/* Settings Modal */}
      {isExpanded && (
        <SettingsModal {...commonProps} />
      )}

      {/* Compact Player */}
      {showCompactPlayer && (
        <CompactPlayer {...commonProps} />
      )}
    </>
  );
};

export default UniversalMusicPlayer;
