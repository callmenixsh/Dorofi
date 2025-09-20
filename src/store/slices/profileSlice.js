// store/slices/profileSlice.js - Complete with status management
import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    // User profile data
    userProfile: null,
    stats: {
      totalSessions: 0,
      totalFocusTime: 0,
      dailyFocusTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      weeklyGoal: 300,
      weeklyProgress: 0,
      achievements: []
    },
    
    // Editing states
    isEditingDisplay: false,
    isEditingUsername: false,
    editedDisplayName: '',
    editedUsername: '',
    
    // UI states
    showLogoutConfirm: false,
    profileInitialized: false,
    
    // Loading states
    loading: false,
    saving: false,
    error: '',
    
    // Username validation
    usernameAvailable: null,
    checkingUsername: false,
    
    // Status management
    userStatus: {
      presence: { status: 'offline', isManual: false },
      customStatus: { text: '', emoji: '', isActive: false },
      privacy: { showLastSeen: true }
    }
  },
  reducers: {
    // Existing reducers
    setIsEditingDisplay: (state, action) => {
      state.isEditingDisplay = action.payload;
    },
    setIsEditingUsername: (state, action) => {
      state.isEditingUsername = action.payload;
    },
    setEditedDisplayName: (state, action) => {
      state.editedDisplayName = action.payload;
    },
    setEditedUsername: (state, action) => {
      state.editedUsername = action.payload;
    },
    setShowLogoutConfirm: (state, action) => {
      state.showLogoutConfirm = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Profile initialization
    initializeProfile: (state, action) => {
      const { user } = action.payload;
      state.editedDisplayName = user.displayName || user.name || '';
      state.editedUsername = user.username || '';
      
      // 🆕 Initialize user status from user data
      state.userStatus = {
        presence: user.presence || { status: 'online', isManual: false },
        customStatus: user.customStatus || { text: '', emoji: '', isActive: false },
        privacy: user.privacy || { showLastSeen: true }
      };
      
      state.profileInitialized = true;
    },
    
    resetProfile: (state) => {
      return {
        ...state,
        isEditingDisplay: false,
        isEditingUsername: false,
        editedDisplayName: '',
        editedUsername: '',
        showLogoutConfirm: false,
        profileInitialized: false,
        error: '',
        // Reset user status
        userStatus: {
          presence: { status: 'offline', isManual: false },
          customStatus: { text: '', emoji: '', isActive: false },
          privacy: { showLastSeen: true }
        }
      };
    },
    
    // 🆕 Status management reducers
    setUserStatus: (state, action) => {
      state.userStatus = { ...state.userStatus, ...action.payload };
    },
    
    updatePresence: (state, action) => {
      state.userStatus.presence = { ...state.userStatus.presence, ...action.payload };
    },
    
    updateCustomStatus: (state, action) => {
      state.userStatus.customStatus = { ...state.userStatus.customStatus, ...action.payload };
    },
    
    updatePrivacy: (state, action) => {
      state.userStatus.privacy = { ...state.userStatus.privacy, ...action.payload };
    },
    
    // 🆕 Additional helper reducers
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setSaving: (state, action) => {
      state.saving = action.payload;
    },
    
    setUsernameAvailable: (state, action) => {
      state.usernameAvailable = action.payload;
    },
    
    setCheckingUsername: (state, action) => {
      state.checkingUsername = action.payload;
    },
    
    generateAchievements: (state, action) => {
      const statsData = action.payload;
      state.stats.achievements = [
        {
          id: 1,
          name: "First Session",
          icon: "🎯",
          earned: (statsData.totalSessions || 0) > 0,
        },
        {
          id: 2,
          name: "7-Day Streak",
          icon: "🔥",
          earned: (statsData.longestStreak || 0) >= 7,
        },
        {
          id: 3,
          name: "50 Hours Total",
          icon: "⏰",
          earned: (statsData.totalFocusTime || 0) >= 3000,
        },
        {
          id: 4,
          name: "30-Day Warrior",
          icon: "💪",
          earned: (statsData.longestStreak || 0) >= 30,
        },
      ];
    }
  }
});

export const {
  // Existing actions
  setIsEditingDisplay,
  setIsEditingUsername,
  setEditedDisplayName,
  setEditedUsername,
  setShowLogoutConfirm,
  setError,
  initializeProfile,
  resetProfile,
  
  // 🆕 Status management actions
  setUserStatus,
  updatePresence,
  updateCustomStatus,
  updatePrivacy,
  
  // 🆕 Additional actions
  setStats,
  setLoading,
  setSaving,
  setUsernameAvailable,
  setCheckingUsername,
  generateAchievements
} = profileSlice.actions;

export default profileSlice.reducer;
