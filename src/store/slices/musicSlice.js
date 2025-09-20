// store/slices/musicSlice.js - Complete with repeat functionality
import { createSlice } from '@reduxjs/toolkit';

const musicSlice = createSlice({
  name: 'music',
  initialState: {
    // Music state
    currentTrack: 'Bittersweet',
    volume: 35,
    musicEnabled: false,
    isRepeating: false, // 🆕 Repeat state
    
    // White noise states
    whiteNoiseStates: {
      Rain: { enabled: false, volume: 30 },
      Underwater: { enabled: false, volume: 25 },
      Waves: { enabled: false, volume: 35 },
      Chirp: { enabled: false, volume: 30 }
    },
    
    // UI states
    isExpanded: false,
    isMinimized: false,
    wasMinimizedBeforeExpand: false,
    
    // Route awareness
    currentRoute: '/',
    
    // Grouped page states - Home & Rooms share the same state
    pageStates: {
      'compact-pages': { isMinimized: false }, // Home & Rooms share this
      'toast-pages': { isMinimized: true }     // Other pages share this
    },
    
    // Track lists
    musicTracks: [
      { name: 'Bittersweet', file: '/assets/music/bittersweet.mp3' },
      { name: 'Comfy', file: '/assets/music/comfy.mp3' },
      { name: 'Daynight', file: '/assets/music/daynight.mp3' },
      { name: 'Frozen Air', file: '/assets/music/frozenair.mp3' },
      { name: 'Lofi Chill', file: '/assets/music/lofichill.mp3' },
      { name: 'Rainy Day', file: '/assets/music/rainyday.mp3' },
      { name: 'Whispering', file: '/assets/music/whispering.mp3' }
    ],
    whiteNoiseTracks: [
      { name: 'Rain', file: '/assets/white/rain.mp3' },
      { name: 'Underwater', file: '/assets/white/underwater.mp3' },
      { name: 'Waves', file: '/assets/white/waves.mp3' },
      { name: 'Chirp', file: '/assets/white/chirp.mp3' }
    ]
  },
  reducers: {
    // Music controls
    toggleMusic: (state) => {
      state.musicEnabled = !state.musicEnabled;
    },
    setMusicEnabled: (state, action) => {
      state.musicEnabled = action.payload;
    },
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    
    // 🆕 Repeat controls
    toggleRepeat: (state) => {
      state.isRepeating = !state.isRepeating;
    },
    setRepeat: (state, action) => {
      state.isRepeating = action.payload;
    },
    
    skipToNext: (state) => {
      const currentIndex = state.musicTracks.findIndex(track => track.name === state.currentTrack);
      const newIndex = (currentIndex + 1) % state.musicTracks.length;
      state.currentTrack = state.musicTracks[newIndex].name;
      state.musicEnabled = true;
    },
    skipToPrevious: (state) => {
      const currentIndex = state.musicTracks.findIndex(track => track.name === state.currentTrack);
      const newIndex = currentIndex === 0 ? state.musicTracks.length - 1 : currentIndex - 1;
      state.currentTrack = state.musicTracks[newIndex].name;
      state.musicEnabled = true;
    },
    
    // White noise controls
    toggleWhiteNoise: (state, action) => {
      const { name } = action.payload;
      if (state.whiteNoiseStates[name]) {
        state.whiteNoiseStates[name].enabled = !state.whiteNoiseStates[name].enabled;
      }
    },
    setWhiteNoiseVolume: (state, action) => {
      const { name, volume } = action.payload;
      if (state.whiteNoiseStates[name]) {
        state.whiteNoiseStates[name].volume = volume;
      }
    },
    
    // UI controls with shared memory for Home & Rooms
    expandPlayer: (state) => {
      state.wasMinimizedBeforeExpand = state.isMinimized;
      state.isMinimized = false;
      state.isExpanded = true;
    },
    
    minimizePlayer: (state) => {
      state.isExpanded = false;
      state.isMinimized = true;
      // Save state for the current page group
      const allowedCompactPages = ['/', '/rooms'];
      const pageGroup = allowedCompactPages.includes(state.currentRoute) ? 'compact-pages' : 'toast-pages';
      state.pageStates[pageGroup].isMinimized = true;
    },
    
    restorePlayer: (state) => {
      const allowedCompactPages = ['/', '/rooms'];
      if (allowedCompactPages.includes(state.currentRoute)) {
        state.isMinimized = false;
        // Save state for compact pages group
        state.pageStates['compact-pages'].isMinimized = false;
      }
    },
    
    closeModal: (state) => {
      state.isExpanded = false;
      if (state.wasMinimizedBeforeExpand) {
        state.isMinimized = true;
        // Save minimized state for current page group
        const allowedCompactPages = ['/', '/rooms'];
        const pageGroup = allowedCompactPages.includes(state.currentRoute) ? 'compact-pages' : 'toast-pages';
        state.pageStates[pageGroup].isMinimized = true;
      }
      state.wasMinimizedBeforeExpand = false;
    },
    
    // Enhanced route management with grouped memory
    setCurrentRoute: (state, action) => {
      const newRoute = action.payload;
      const previousRoute = state.currentRoute;
      
      const allowedCompactPages = ['/', '/rooms'];
      const previousPageGroup = allowedCompactPages.includes(previousRoute) ? 'compact-pages' : 'toast-pages';
      const newPageGroup = allowedCompactPages.includes(newRoute) ? 'compact-pages' : 'toast-pages';
      
      // Save current state to the appropriate group before switching
      state.pageStates[previousPageGroup].isMinimized = state.isMinimized;
      
      // Update route
      state.currentRoute = newRoute;
      
      // Load state for the new page group
      state.isMinimized = state.pageStates[newPageGroup].isMinimized;
      
      // Don't change state if modal is expanded
      if (state.isExpanded) {
        // Keep modal open but remember the underlying state
        return;
      }
    }
  }
});

export const {
  toggleMusic,
  setMusicEnabled,
  setCurrentTrack,
  setVolume,
  toggleRepeat,
  setRepeat,
  skipToNext,
  skipToPrevious,
  toggleWhiteNoise,
  setWhiteNoiseVolume,
  expandPlayer,
  minimizePlayer,
  restorePlayer,
  closeModal,
  setCurrentRoute
} = musicSlice.actions;

export default musicSlice.reducer;
