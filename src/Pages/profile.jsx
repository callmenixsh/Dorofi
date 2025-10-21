// Pages/profile.jsx - Fixed WeeklyProgress call
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from "../contexts/AuthContext.jsx";
import { AlertCircle } from "lucide-react";
import apiService from '../services/api.js';

import { 
  setIsEditingDisplay, setIsEditingUsername, setEditedDisplayName, 
  setEditedUsername, setShowLogoutConfirm, setError, initializeProfile,
  resetProfile, setUserStatus, updatePresence, updateCustomStatus, 
  updatePrivacy, setLoading, setSaving
} from '../store/slices/profileSlice';

// 🔥 Import unified stats
import { fetchUnifiedStats } from '../store/slices/statsSlice';

// Import modular components
import ProfileHeader from "../Components/Profile/profileHeader.jsx";
import StatsOverview from "../Components/Profile/statsOverview.jsx";
import WeeklyProgress from "../Components/Profile/weeklyProgress.jsx";
import Achievements from "../Components/Profile/achievements.jsx";
import LogoutModal from "../Components/Profile/logoutModal.jsx";
import StatusManager from "../Components/Profile/statusManager.jsx";

export default function Profile() {
  const dispatch = useDispatch();
  const { user, loading: authLoading, logout, updateUser, isAuthenticated } = useAuth();
  
  // Profile slice state (no stats)
  const profileState = useSelector(state => state.profile) || {};
  const {
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

  // 🔥 Get stats from unified stats slice
  const { profile: profileStats, isLoading: statsLoading } = useSelector(state => state.stats);

  // Initialize profile data when user is available - ONLY ONCE
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) return;
    if (profileInitialized) return;

    console.log("🎯 Initializing profile for user:", user.email);
    dispatch(initializeProfile({ user }));
    
    // 🔥 Fetch unified stats instead of separate API call
    dispatch(fetchUnifiedStats());
  }, [user, isAuthenticated, authLoading, profileInitialized, dispatch]);

  // Cleanup on logout
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(resetProfile());
    }
  }, [isAuthenticated, dispatch]);

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
      dispatch(setSaving(true));
      dispatch(setError(""));

      if (localStorage.getItem("token")) {
        await apiService.updateDisplayName(editedDisplayName.trim());
        console.log("✅ Display name updated in backend");
      }

      updateUser({ 
        displayName: editedDisplayName.trim(), 
        name: editedDisplayName.trim() 
      });
      
      dispatch(setIsEditingDisplay(false));
    } catch (error) {
      console.error("Failed to update display name:", error);
      dispatch(setError("Failed to update display name. Please try again."));
    } finally {
      dispatch(setSaving(false));
    }
  };

  const handleSaveUsername = async () => {
    if (!editedUsername.trim()) {
      dispatch(setError("Username cannot be empty"));
      return;
    }

    try {
      dispatch(setSaving(true));
      dispatch(setError(""));

      if (!localStorage.getItem("token")) {
        dispatch(setError("Please log in to set a username"));
        return;
      }

      await apiService.updateUsername(editedUsername.trim());
      console.log("✅ Username updated in backend");

      updateUser({ 
        username: editedUsername.trim().toLowerCase(),
        usernameLastChanged: new Date().toISOString(),
      });
      
      dispatch(setIsEditingUsername(false));
    } catch (error) {
      console.error("Failed to update username:", error);
      dispatch(setError(error.message || "Failed to update username. Please try again."));
    } finally {
      dispatch(setSaving(false));
    }
  };

  const handleLogout = () => {
    dispatch(setShowLogoutConfirm(false));
    logout();
  };

  const handleStatusUpdate = (updates) => {
    console.log("🔄 Handling status update:", updates);
    
    if (updates.presence) {
      dispatch(updatePresence(updates.presence));
    }
    if (updates.customStatus) {
      dispatch(updateCustomStatus(updates.customStatus));
    }
    if (updates.privacy) {
      dispatch(updatePrivacy(updates.privacy));
    }
    
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
  if ((loading || statsLoading) && !profileInitialized) {
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

        {/* Stats Overview */}
        <StatsOverview />

        {/* 🔥 FIXED: Weekly Progress - No props needed! */}
        <WeeklyProgress />

        {/* Achievements */}
        <Achievements/>


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
