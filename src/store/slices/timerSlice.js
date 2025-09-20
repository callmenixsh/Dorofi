import { createSlice } from '@reduxjs/toolkit';

const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    timeLeft: 25 * 60, // 25 minutes in seconds
    isRunning: false,
    mode: 'work', // 'work' or 'break'
    sessions: 2,
    totalFocusTime: 14520, // total seconds focused
    streak: 7
  },
  reducers: {
    // Timer controls
    startTimer: (state) => {
      state.isRunning = true;
    },
    pauseTimer: (state) => {
      state.isRunning = false;
    },
    resetTimer: (state) => {
      state.isRunning = false;
      state.timeLeft = state.mode === 'work' ? 25 * 60 : 5 * 60;
    },
    
    // Timer tick (called every second)
    tick: (state) => {
      if (state.timeLeft > 0) {
        state.timeLeft -= 1;
        if (state.mode === 'work') {
          state.totalFocusTime += 1;
        }
      }
      
      // Auto switch when timer reaches 0
      if (state.timeLeft === 0) {
        state.isRunning = false;
        if (state.mode === 'work') {
          state.sessions += 1;
          state.mode = 'break';
          state.timeLeft = 5 * 60; // 5 minute break
        } else {
          state.mode = 'work';
          state.timeLeft = 25 * 60; // 25 minute work
        }
      }
    },
    
    // Manual mode switching
    switchToWork: (state) => {
      state.mode = 'work';
      state.timeLeft = 25 * 60;
      state.isRunning = false;
    },
    switchToBreak: (state) => {
      state.mode = 'break';
      state.timeLeft = 5 * 60;
      state.isRunning = false;
    },
    
    // Stats updates
    incrementStreak: (state) => {
      state.streak += 1;
    },
    resetStreak: (state) => {
      state.streak = 0;
    }
  }
});

export const {
  startTimer,
  pauseTimer,
  resetTimer,
  tick,
  switchToWork,
  switchToBreak,
  incrementStreak,
  resetStreak
} = timerSlice.actions;

export default timerSlice.reducer;
