// store/slices/statsSlice.js - Clean Production Version
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/api';

// Async thunk for fetching unified stats
export const fetchUnifiedStats = createAsyncThunk(
    'stats/fetchUnified',
    async (_, { rejectWithValue }) => {
        try {
            const response = await apiService.getUnifiedStats();
            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Initial state
const initialState = {
    timer: null,
    profile: null,
    social: null,
    meta: null,
    isLoading: false,
    error: null,
    lastFetch: null,
};

// Create slice
const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        clearStats: (state) => {
            state.timer = null;
            state.profile = null;
            state.social = null;
            state.meta = null;
            state.lastFetch = null;
            state.error = null;
        },
        setStatsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setStatsError: (state, action) => {
            state.error = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnifiedStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUnifiedStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;
                
                if (action.payload?.success && action.payload?.stats) {
                    state.timer = action.payload.stats.timer;
                    state.profile = action.payload.stats.profile;
                    state.social = action.payload.stats.social;
                    state.meta = action.payload.stats.meta;
                    state.lastFetch = Date.now();
                } else {
                    state.error = 'Invalid response format';
                }
            })
            .addCase(fetchUnifiedStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || 'Failed to fetch stats';
            });
    }
});

// Export actions
export const { clearStats, setStatsLoading, setStatsError } = statsSlice.actions;

// Export reducer
export default statsSlice.reducer;
