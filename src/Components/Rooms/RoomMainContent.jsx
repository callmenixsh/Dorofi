// src/Components/Rooms/RoomMainContent.jsx
import React from 'react';
import TimerCard from '../Home/timerCard';
import TimerControls from '../Home/timerControls';
import StatsBar from '../Home/statsBar';
import TaskModal from '../Home/taskmodal';
import TimerSettingsModal from '../Home/timerSettingsModal';

const RoomMainContent = ({
  isSidebarOpen,
  showTaskModal,
  showSettings
}) => {
  return (
    <div className={`flex-grow flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:mr-80' : 'mr-0'}  overflow-y-auto custom-scrollbar`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl ">
        {/* Room Goal Card (should be moved to RoomSession for proper positioning) */}
        
        <div className="space-y-8">
          <StatsBar />
          
          {/* Centered Single-Column Timer Layout matching Homepage exactly */}
          <div className="max-w-2xl mx-auto w-full space-y-8">
            <TimerCard />
            <TimerControls />
          </div>
        </div>

        {/* Modals */}
        {showTaskModal && <TaskModal />}
        {showSettings && <TimerSettingsModal />}
      </div>
    </div>
  );
};

export default RoomMainContent;
