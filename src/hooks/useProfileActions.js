// hooks/useProfileActions.js
import { useDispatch } from 'react-redux';
import { 
  setLoading, setSaving, setError, setStats, setUsernameAvailable, 
  setCheckingUsername, updatePresence, updateCustomStatus, updatePrivacy,
  generateAchievements
} from '../store/slices/profileSlice';
import apiService from '../services/api.js';

export const useProfileActions = () => {
  const dispatch = useDispatch();

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("⚠️ No token, using basic stats");
      setBasicStats();
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(""));
      console.log("📡 Fetching backend profile data...");
      
      const statsResponse = await apiService.getUserStats();
      console.log("✅ Stats received:", statsResponse);
      
      const statsData = {
        totalSessions: statsResponse.totalSessions || 0,
        totalFocusTime: statsResponse.totalFocusTime || 0,
        dailyFocusTime: statsResponse.dailyFocusTime || 0,
        currentStreak: statsResponse.currentStreak || 0,
        longestStreak: statsResponse.longestStreak || 0,
        weeklyGoal: statsResponse.weeklyGoal || 300,
        weeklyProgress: statsResponse.weeklyProgress || 0
      };
      
      dispatch(setStats(statsData));
      dispatch(generateAchievements(statsResponse));
    } catch (error) {
      console.error("❌ Backend fetch failed:", error);
      dispatch(setError("Backend unavailable - showing basic profile"));
      setBasicStats();
    } finally {
      dispatch(setLoading(false));
    }
  };

  const setBasicStats = () => {
    const basicStats = {
      totalSessions: 0,
      totalFocusTime: 0,
      dailyFocusTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyGoal: 300,
      weeklyProgress: 0
    };
    
    dispatch(setStats(basicStats));
    dispatch(generateAchievements(basicStats));
  };

  const saveDisplayName = async (displayName, updateUser) => {
    if (!displayName.trim()) {
      dispatch(setError("Display name cannot be empty"));
      return false;
    }

    try {
      dispatch(setSaving(true));
      dispatch(setError(""));
      
      if (localStorage.getItem("token")) {
        await apiService.updateDisplayName(displayName.trim());
        console.log("✅ Display name updated in backend");
      }
      
      updateUser({ 
        displayName: displayName.trim(), 
        name: displayName.trim() 
      });
      
      return true;
    } catch (error) {
      console.error("Failed to update display name:", error);
      dispatch(setError("Failed to update display name. Please try again."));
      return false;
    } finally {
      dispatch(setSaving(false));
    }
  };

  const saveUsername = async (username, updateUser) => {
    if (!username.trim()) {
      dispatch(setError("Username cannot be empty"));
      return false;
    }

    try {
      dispatch(setSaving(true));
      dispatch(setError(""));
      
      if (!localStorage.getItem("token")) {
        dispatch(setError("Please log in to set a username"));
        return false;
      }
      
      await apiService.updateUsername(username.trim());
      console.log("✅ Username updated in backend");
      
      updateUser({ 
        username: username.trim().toLowerCase(),
        usernameLastChanged: new Date().toISOString(),
      });
      
      return true;
    } catch (error) {
      console.error("Failed to update username:", error);
      dispatch(setError(error.message || "Failed to update username. Please try again."));
      return false;
    } finally {
      dispatch(setSaving(false));
    }
  };

  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 3) {
      dispatch(setUsernameAvailable(null));
      return;
    }

    try {
      dispatch(setCheckingUsername(true));
      const result = await apiService.checkUsername(username);
      dispatch(setUsernameAvailable(result.available));
    } catch (error) {
      console.error('Username check failed:', error);
      dispatch(setUsernameAvailable(null));
    } finally {
      dispatch(setCheckingUsername(false));
    }
  };

  const updatePresenceStatus = async (status, updateUser) => {
    try {
      await apiService.updatePresenceStatus(status);
      const presenceUpdate = { status, isManual: true };
      dispatch(updatePresence(presenceUpdate));
      updateUser({ presence: presenceUpdate });
    } catch (error) {
      console.error('Failed to update presence:', error);
    }
  };

  const updateUserCustomStatus = async (statusData, updateUser) => {
    try {
      await apiService.updateCustomStatus(statusData);
      dispatch(updateCustomStatus(statusData));
      updateUser({ customStatus: statusData });
    } catch (error) {
      console.error('Failed to update custom status:', error);
      throw error;
    }
  };

  const updatePrivacySettings = async (privacyData, updateUser) => {
    try {
      await apiService.updatePrivacySettings(privacyData);
      dispatch(updatePrivacy(privacyData));
      updateUser({ privacy: privacyData });
    } catch (error) {
      console.error('Failed to update privacy:', error);
    }
  };

  return {
    fetchUserProfile,
    saveDisplayName,
    saveUsername,
    checkUsernameAvailability,
    updatePresenceStatus,
    updateUserCustomStatus,
    updatePrivacySettings
  };
};
