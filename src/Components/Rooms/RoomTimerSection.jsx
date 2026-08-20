// src/Components/Rooms/RoomTimerSection.jsx
import React from 'react';
import TimerCard from '../Home/timerCard';
import TimerControls from '../Home/timerControls';
import StatsBar from '../Home/statsBar';

const RoomTimerSection = () => {
  return (
    <div className="space-y-8">
      <StatsBar />
      
      {/* Centered Single-Column Timer Layout matching Homepage exactly */}
      <div className="max-w-2xl mx-auto w-full space-y-8">
        <TimerCard />
        <TimerControls />
      </div>
    </div>
  );
};

export default RoomTimerSection;
