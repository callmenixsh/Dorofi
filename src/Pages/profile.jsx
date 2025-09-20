// Pages/profile.jsx - Updated with proper data fetching
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from "../contexts/AuthContext.jsx";
import { AlertCircle } from "lucide-react";
import apiService from '../services/api.js';
import { 
  setIsEditingDisplay, setIsEditingUsername, setEditedDisplayName, 
  setEditedUsername, setShowLogoutConfirm, setError, initializeProfile,
  resetProfile, setUserStatus, updatePresence, updateCustomStatus, 
  updatePrivacy, setStats, setLoading, generateAchievements
} from '../store/slices/profileSlice';

// Import modular components
import ProfileHeader from "../components/Profile/ProfileHeader.jsx";
import StatsOverview from "../components/Profile/StatsOverview.jsx";
import WeeklyProgress from "../components/Profile/WeeklyProgress.jsx";
import Achievements from "../components/Profile/Achievements.jsx";
import ActivityCalendar from "../components/Profile/ActivityCalendar.jsx";
import LogoutModal from "../components/Profile/LogoutModal.jsx";
import StatusManager from "../components/Profile/StatusManager.jsx";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading: authLoading, logout, updateUser, isAuthenticated } = useAuth();
  
  // Safe destructuring with fallbacks
  const profileState = useSelector(state => state.profile) || {};
  const {
    stats = {
      totalSessions: 0,
      totalFocusTime: 0,
      dailyFocusTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyGoal: 300,
      weeklyProgress: 0,
      achievements: []
    },
    isEditingDisplay = false,
    isEditingUsername = false,
    editedDisplayName = '',
    editedUsername = '',
    showLogoutConfirm = false,
    loading = false,
    saving = false,
    error = '',
    profileInitialized = false,
    usernameAvailable = null,
    checkingUsername = false,
    userStatus = {
      presence: { status: 'offline', isManual: false },
      customStatus: { text: '', emoji: '', isActive: false },
      privacy: { showLastSeen: true }
    }
  } = profileState;

  // Initialize profile data when user is available - ONLY ONCE
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) return;
    if (profileInitialized) return;

    console.log("🎯 Initializing profile for user:", user.email);
    dispatch(initializeProfile({ user }));
    fetchUserProfile();
  }, [user, isAuthenticated, authLoading, profileInitialized]);

  // Cleanup on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(resetProfile());
    }
  }, [isAuthenticated, dispatch]);

  // 🔧 Updated profile fetching with real API calls
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("⚠️ No token, using basic stats");
      setBasicStats();
      return;
    }

    try {
      dispatch(setLoading(true));
      console.log("📡 Fetching user stats from API...");
      
      // Try to fetch real stats from your API
      const statsResponse = await apiService.getUserStats();
      console.log("✅ Stats received from API:", statsResponse);
      
      // Update Redux with real data
      const realStats = {
        totalSessions: statsResponse.totalSessions || 0,
        totalFocusTime: statsResponse.totalFocusTime || 0,
        dailyFocusTime: statsResponse.dailyFocusTime || 0,
        currentStreak: statsResponse.currentStreak || 0,
        longestStreak: statsResponse.longestStreak || 0,
        weeklyGoal: statsResponse.weeklyGoal || 300,
        weeklyProgress: statsResponse.weeklyProgress || 0
      };
      
      dispatch(setStats(realStats));
      dispatch(generateAchievements(realStats));
      
    } catch (error) {
      console.error("❌ Failed to fetch user stats:", error);
      console.log("🔄 Falling back to basic stats");
      setBasicStats();
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Fallback for when API is unavailable
  const setBasicStats = () => {
    const basicStats = {
      totalSessions: 12, // Some demo data
      totalFocusTime: 450, // 7.5 hours in minutes
      dailyFocusTime: 85, // Today's focus time
      currentStreak: 3,
      longestStreak: 7,
      weeklyGoal: 300,
      weeklyProgress: 180
    };
    
    dispatch(setStats(basicStats));
    dispatch(generateAchievements(basicStats));
    console.log("📊 Using demo stats:", basicStats);
  };

  // Utility functions
  const getHighResProfilePicture = (googlePicture) => {
    if (!googlePicture) return null;
    return googlePicture
      .replace("s96-c", "s400-c")
      .replace("=s96", "=s400")
      .replace("sz=50", "sz=400");
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Handler functions
  const handleSaveDisplayName = async () => {
    if (!editedDisplayName.trim()) {
      dispatch(setError("Display name cannot be empty"));
      return;
    }

    try {
      updateUser({ displayName: editedDisplayName.trim(), name: editedDisplayName.trim() });
      dispatch(setIsEditingDisplay(false));
      dispatch(setError(""));
    } catch (error) {
      dispatch(setError("Failed to update display name"));
    }
  };

  const handleSaveUsername = async () => {
    if (!editedUsername.trim()) {
      dispatch(setError("Username cannot be empty"));
      return;
    }

    try {
      updateUser({ username: editedUsername.trim().toLowerCase() });
      dispatch(setIsEditingUsername(false));
      dispatch(setError(""));
    } catch (error) {
      dispatch(setError("Failed to update username"));
    }
  };

  const handleLogout = () => {
    dispatch(setShowLogoutConfirm(false));
    logout();
  };

  // Fixed status update handler
  const handleStatusUpdate = (updates) => {
    console.log("🔄 Handling status update:", updates);
    
    // Update Redux state immediately
    if (updates.presence) {
      dispatch(updatePresence(updates.presence));
    }
    if (updates.customStatus) {
      dispatch(updateCustomStatus(updates.customStatus));
    }
    if (updates.privacy) {
      dispatch(updatePrivacy(updates.privacy));
    }
    
    // Also update AuthContext for persistence
    updateUser(updates);
  };

  // API function handlers
  const updatePresenceStatus = async (status) => {
    try {
      console.log("🔄 Updating presence status:", status);
      await apiService.updatePresenceStatus(status);
      console.log("✅ Presence status updated successfully");
    } catch (error) {
      console.error("❌ Failed to update presence status:", error);
    }
  };

  const updateUserCustomStatus = async (statusData) => {
    try {
      console.log("🔄 Updating custom status:", statusData);
      await apiService.updateCustomStatus(statusData);
      console.log("✅ Custom status updated successfully");
    } catch (error) {
      console.error("❌ Failed to update custom status:", error);
    }
  };

  const updatePrivacySettings = async (privacyData) => {
    try {
      console.log("🔄 Updating privacy settings:", privacyData);
      await apiService.updatePrivacySettings(privacyData);
      console.log("✅ Privacy settings updated successfully");
    } catch (error) {
      console.error("❌ Failed to update privacy settings:", error);
    }
  };

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-secondary">Loading...</div>
        </div>
      </div>
    );
  }

  // Show login prompt for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-secondary mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-primary mb-4">Profile Access Required</h1>
          <p className="text-secondary">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  // Show loading state for stats
  if (loading && !profileInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-secondary">Loading profile data...</div>
        </div>
      </div>
    );
  }

  // Merge user data with Redux userStatus for StatusManager
  const mergedUserData = {
    ...user,
    presence: userStatus.presence.status ? userStatus.presence : (user.presence || { status: 'online', isManual: false }),
    customStatus: userStatus.customStatus.isActive || userStatus.customStatus.text ? userStatus.customStatus : (user.customStatus || { text: '', emoji: '', isActive: false }),
    privacy: userStatus.privacy.showLastSeen !== undefined ? userStatus.privacy : (user.privacy || { showLastSeen: true })
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Error Display */}
        {error && (
          <div className="bg-surface/50 border border-accent/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-accent" />
              <span className="text-accent">{error}</span>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <ProfileHeader 
          currentUser={user}
          isEditingDisplay={isEditingDisplay}
          setIsEditingDisplay={(value) => dispatch(setIsEditingDisplay(value))}
          editedDisplayName={editedDisplayName}
          setEditedDisplayName={(value) => dispatch(setEditedDisplayName(value))}
          isEditingUsername={isEditingUsername}
          setIsEditingUsername={(value) => dispatch(setIsEditingUsername(value))}
          editedUsername={editedUsername}
          setEditedUsername={(value) => dispatch(setEditedUsername(value))}
          saving={saving}
          error={error}
          setError={(value) => dispatch(setError(value))}
          onSaveDisplayName={handleSaveDisplayName}
          onSaveUsername={handleSaveUsername}
          onLogout={() => dispatch(setShowLogoutConfirm(true))}
          getHighResProfilePicture={getHighResProfilePicture}
          usernameAvailable={usernameAvailable}
          checkingUsername={checkingUsername}
        />

        {/* Status Manager */}
        <StatusManager 
          user={mergedUserData}
          onStatusUpdate={handleStatusUpdate}
          updatePresenceStatus={updatePresenceStatus}
          updateUserCustomStatus={updateUserCustomStatus}
          updatePrivacySettings={updatePrivacySettings}
        />

        {/* Stats Overview - Back to original horizontal layout */}
        <StatsOverview stats={stats} formatTime={formatTime} />

        {/* Weekly Progress */}
        <WeeklyProgress stats={stats} formatTime={formatTime} />

        {/* Achievements */}
        <Achievements stats={stats} />

        {/* Activity Calendar */}
        <ActivityCalendar stats={stats} />

        {/* Logout Modal */}
        <LogoutModal 
          showModal={showLogoutConfirm}
          onClose={() => dispatch(setShowLogoutConfirm(false))}
          onConfirm={handleLogout}
        />
      </div>
    </div>
  );
}
