// store/slices/friendsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const friendsSlice = createSlice({
  name: 'friends',
  initialState: {
    // Data
    friends: [],
    pendingIncoming: [],
    pendingOutgoing: [],
    
    // UI State
    activeTab: 'leaderboard',
    showAddFriendModal: false,
    
    // Loading States
    loading: false,
    friendsInitialized: false,
    error: null,
    
    // Search & Filters
    searchQuery: '',
    leaderboardType: 'weekly'
  },
  reducers: {
    // Loading States
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFriendsInitialized: (state, action) => {
      state.friendsInitialized = action.payload;
    },
    
    // Data Updates
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setPendingIncoming: (state, action) => {
      state.pendingIncoming = action.payload;
    },
    setPendingOutgoing: (state, action) => {
      state.pendingOutgoing = action.payload;
    },
    
    // Individual Friend Actions
    addFriend: (state, action) => {
      state.friends.push(action.payload);
    },
    removeFriend: (state, action) => {
      state.friends = state.friends.filter(
        f => (f.id || f._id) !== action.payload
      );
    },
    
    // Friend Request Actions
    addPendingOutgoing: (state, action) => {
      state.pendingOutgoing.push(action.payload);
    },
    removePendingIncoming: (state, action) => {
      state.pendingIncoming = state.pendingIncoming.filter(
        r => r._id !== action.payload
      );
    },
    removePendingOutgoing: (state, action) => {
      state.pendingOutgoing = state.pendingOutgoing.filter(
        r => r._id !== action.payload
      );
    },
    
    // Accept Request (move from pending to friends)
    acceptFriendRequest: (state, action) => {
      const { requestId, friend } = action.payload;
      state.pendingIncoming = state.pendingIncoming.filter(r => r._id !== requestId);
      if (friend) {
        state.friends.push(friend);
      }
    },
    
    // UI Controls
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setShowAddFriendModal: (state, action) => {
      state.showAddFriendModal = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLeaderboardType: (state, action) => {
      state.leaderboardType = action.payload;
    }
  }
});

export const {
  setLoading,
  setError,
  setFriendsInitialized,
  setFriends,
  setPendingIncoming,
  setPendingOutgoing,
  addFriend,
  removeFriend,
  addPendingOutgoing,
  removePendingIncoming,
  removePendingOutgoing,
  acceptFriendRequest,
  setActiveTab,
  setShowAddFriendModal,
  setSearchQuery,
  setLeaderboardType
} = friendsSlice.actions;

export default friendsSlice.reducer;
