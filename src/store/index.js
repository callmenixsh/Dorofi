// store/index.js - Add profile reducer properly
import { configureStore } from '@reduxjs/toolkit';
import timerReducer from './slices/timerSlice';
import musicReducer from './slices/musicSlice';
import tasksReducer from './slices/tasksSlice';
import profileReducer from './slices/profileSlice'; // 🆕 Make sure this exists
import friendsReducer from './slices/friendsSlice';
import statsReducer from './slices/statsSlice';
import roomsReducer from './slices/roomsSlice';

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    music: musicReducer,
    tasks: tasksReducer,
    profile: profileReducer,
    friends: friendsReducer,
    stats: statsReducer, 
    rooms: roomsReducer,
  },
  devTools: import.meta.env.MODE !== 'production'
});
