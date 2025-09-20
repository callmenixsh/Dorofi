// Pages/Home.jsx - Remove music player, it's now universal
import React from 'react';
import { useSelector } from 'react-redux';
import { useTimerEffect } from '../hooks/useTimerEffect';
import StatsBar from '../Components/Home/statsBar';
import TimerCard from '../Components/Home/timerCard';
import TimerControls from '../Components/Home/timerControls';
import TaskModal from '../Components/Home/taskmodal';

const Home = () => {
  useTimerEffect();
  const { showTaskModal } = useSelector(state => state.tasks);

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 p-6 pb-2">
          <StatsBar />
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <TimerCard />
              <TimerControls />
            </div>
          </div>
        </div>
        
        {/* Music player is now universal - no need to include here */}
      </div>

      {showTaskModal && <TaskModal />}
    </div>
  );
};

export default Home;
