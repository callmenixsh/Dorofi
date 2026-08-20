import { createSlice } from '@reduxjs/toolkit';

const ROOM_MAX_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

const initialState = {
  activeRoom: null, // { id, name, code, host, isHost, participants: [], duration, startedAt, expiresAt }
  rooms: [], // For the discovery list
  isLoading: false,
  error: null,
  recentReactions: [], // [{ id, from, type, timestamp }]
  messages: [], // [{ id, from, text, timestamp }]
};

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },
    setActiveRoom: (state, action) => {
      const room = action.payload;
      const now = Date.now();
      const duration = Math.min(room.duration || ROOM_MAX_DURATION_MS, ROOM_MAX_DURATION_MS);
      state.activeRoom = {
        ...room,
        duration,
        startedAt: room.startedAt || now,
        expiresAt: room.expiresAt || now + duration,
      };
    },
    leaveRoom: (state) => {
      state.activeRoom = null;
      state.messages = [];
      state.recentReactions = [];
    },
    updateParticipant: (state, action) => {
      if (state.activeRoom) {
        const index = state.activeRoom.participants.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.activeRoom.participants[index] = { ...state.activeRoom.participants[index], ...action.payload };
        } else {
          state.activeRoom.participants.push(action.payload);
        }
      }
    },
    addReaction: (state, action) => {
      state.recentReactions.push({
        id: Date.now() + Math.random(),
        ...action.payload,
        timestamp: new Date().toISOString()
      });
      if (state.recentReactions.length > 10) {
        state.recentReactions.shift();
      }
    },
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString()
      });
      if (state.messages.length > 50) {
        state.messages.shift();
      }
    },
    clearReactions: (state) => {
      state.recentReactions = [];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setRooms, 
  setActiveRoom, 
  leaveRoom, 
  updateParticipant, 
  addReaction, 
  addMessage,
  clearReactions,
  setLoading,
  setError 
} = roomsSlice.actions;

export { ROOM_MAX_DURATION_MS };
export default roomsSlice.reducer;