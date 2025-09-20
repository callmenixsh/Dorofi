import React, { useState, useRef, useEffect } from 'react';
import { Music, ChevronDown } from 'lucide-react';

const PlaylistSelector = ({ currentTrack, tracks, onChange, className = "", size = "default", position = "bottom" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    small: "px-3 py-2.5 text-sm rounded-xl",
    default: "px-4 py-3 text-sm rounded-xl", 
    large: "px-4 py-3 text-base rounded-xl"
  };

  // Position-based dropdown classes with better spacing
  const dropdownPositionClasses = {
    bottom: "mt-3 top-full", // Opens below with more space
    top: "mb-3 bottom-full"   // Opens above with more space
  };

  // Dropdown width based on context
  const dropdownWidthClasses = {
    small: "min-w-80",    // Toast player - wider for better UX
    default: "min-w-96",  // Compact player - even wider
    large: "w-full"       // Modal - full width
  };

  const chevronRotation = position === "top" 
    ? (isOpen ? 'rotate-0' : 'rotate-180')
    : (isOpen ? 'rotate-180' : 'rotate-0');

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Current Track Display Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-surface/80 border-2 border-primary/60 text-primary font-medium cursor-pointer hover:border-primary hover:bg-surface hover:shadow-lg focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all duration-200 text-left flex items-center justify-between ${sizeClasses[size]}`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="truncate">{currentTrack}</span>
        </div>
        <ChevronDown 
          size={16} 
          className={`text-primary transition-transform duration-200 flex-shrink-0 ${chevronRotation}`} 
        />
      </button>

      {/* Playlist View - Wider and better positioned */}
      {isOpen && (
        <div className={`absolute z-50 bg-surface/95 backdrop-blur-sm border-2 border-primary/30 rounded-xl shadow-2xl overflow-hidden ${dropdownPositionClasses[position]} ${dropdownWidthClasses[size]}`}>

          <div className="px-4 py-3 border-b border-primary/20 bg-background/30">
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
              <Music size={14} />
              Playlist ({tracks.length} tracks)
            </h4>
          </div>
          
          {/* Track list with optimized height */}
          <div className="max-h-72 overflow-y-auto">
            {tracks.map((track, index) => {
              const isCurrentTrack = track.name === currentTrack;
              
              return (
                <button
                  key={track.name}
                  onClick={() => {
                    onChange(track.name);
                    setIsOpen(false);
                  }}
                  className={`w-full px-5 py-4 text-left hover:bg-primary/10 transition-colors duration-150 flex items-center gap-4 group ${
                    isCurrentTrack ? 'bg-accent/10 border-l-4 border-accent' : ''
                  }`}
                >
                  {/* Track Number / Play Icon */}
                  <div className="w-8 h-8 flex items-center justify-center">
                    {isCurrentTrack ? (
                      <div className="w-3 h-3 rounded-full bg-accent animate-pulse"></div>
                    ) : (
                      <span className="text-xs text-secondary group-hover:text-primary transition-colors font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                  
                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm truncate ${
                      isCurrentTrack ? 'text-accent' : 'text-primary'
                    }`}>
                      {track.name}
                    </div>
                    <div className="text-xs text-secondary mt-0.5">
                      {isCurrentTrack ? 'Now Playing' : 'Available'}
                    </div>
                  </div>

                  {/* Play indicator */}
                  {isCurrentTrack && (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3 bg-accent rounded-full animate-pulse"></div>
                      <div className="w-1 h-2 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-1 h-4 bg-accent rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistSelector;
