// store/slices/profileSlice.js - Clean profile-only slice
import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    // User profile data only (no stats)
    userProfile: null,
    
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
    // Profile editing reducers
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
      
      // Initialize user status from user data
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
    
    // Status management reducers
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
    
    // Utility reducers
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
    }
  }
});

export const {
  // Profile editing actions
  setIsEditingDisplay,
  setIsEditingUsername,
  setEditedDisplayName,
  setEditedUsername,
  setShowLogoutConfirm,
  setError,
  initializeProfile,
  resetProfile,
  
  // Status management actions
  setUserStatus,
  updatePresence,
  updateCustomStatus,
  updatePrivacy,
  
  // Utility actions
  setLoading,
  setSaving, // 🔥 This was missing!
  setUsernameAvailable,
  setCheckingUsername
} = profileSlice.actions;


export default profileSlice.reducer;
