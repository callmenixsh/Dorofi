// Components/Home/statsBar.jsx - Updated for Redux
import React from 'react';
import { useSelector } from 'react-redux';

const StatsBar = () => {
  const { totalFocusTime, sessions, streak } = useSelector(state => state.timer);

  // Format total focus time
  const formatFocusTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flex items-center justify-center gap-8 mb-8">
      
      {/* Total Focus Time */}
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">
          {formatFocusTime(totalFocusTime)}
        </div>
        <div className="text-sm text-secondary">Total Focus</div>
      </div>

      {/* Sessions */}
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{sessions}</div>
        <div className="text-sm text-secondary">Sessions</div>
      </div>

      {/* Streak */}
      <div className="text-center">
        <div className="text-2xl font-bold text-primary">{streak}</div>
        <div className="text-sm text-secondary">Day Streak</div>
      </div>
    </div>
  );
};

export default StatsBar;
