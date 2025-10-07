// Pages/Home.jsx - Updated to work with cleaned up timerSlice
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../contexts/AuthContext';
import { 
    setLoggedInState, 
    setBackendStats // 🔥 Still works - now calls updateStatsFromBackend internally
} from '../store/slices/timerSlice';
import { 
    setLoggedInState as setTasksLoggedInState,
    fetchTasks
} from '../store/slices/tasksSlice';
import useTimer from '../hooks/useTimer';

import StatsBar from '../Components/Home/statsBar';
import TimerCard from '../Components/Home/timerCard';
import TimerControls from '../Components/Home/timerControls';
import TaskModal from '../Components/Home/taskmodal';
import TimerSettingsModal from '../Components/Home/timerSettingsModal';

const Home = () => {
    const dispatch = useDispatch();
    const { user, token } = useAuth();
    const { showTaskModal } = useSelector(state => state.tasks);
    const { showSettings, isLoggedIn } = useSelector(state => state.timer);
    
    // Initialize timer
    useTimer();
    
    useEffect(() => {
        if (user) {
            console.log('✅ User logged in, updating Redux state');
            
            // Update BOTH timer and tasks logged in state
            dispatch(setLoggedInState(true));
            dispatch(setTasksLoggedInState(true));
            
            // Load existing backend stats from localStorage
            try {
                const googleUserInfo = localStorage.getItem('googleUserInfo');
                if (googleUserInfo) {
                    const userData = JSON.parse(googleUserInfo);
                    if (userData.stats) {
                        dispatch(setBackendStats(userData.stats)); // 🔥 This now uses updateStatsFromBackend internally
                    }
                }
            } catch (error) {
                console.error('Error reading existing stats:', error);
            }
            
            // Fetch tasks from backend
            dispatch(fetchTasks());
            
            // 🔥 clearLocalData is now handled automatically in setLoggedInState
        } else {
            console.log('❌ User logged out, updating Redux state');
            
            // Update BOTH timer and tasks logged in state
            dispatch(setLoggedInState(false));
            dispatch(setTasksLoggedInState(false));
        }
    }, [user, token, dispatch]);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="space-y-8">
                    <StatsBar />
                    <TimerCard />
                    <TimerControls />
                    {showTaskModal && <TaskModal />}
                    {showSettings && <TimerSettingsModal />}
                </div>
            </div>
        </div>
    );
};

export default Home;
