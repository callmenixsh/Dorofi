// store/slices/timerSlice.js - Updated with simple achievement check
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getToday, getTodayKey } from "../../utils/dateUtils";
import api from "../../services/api";

// 🔥 Import fetchUnifiedStats for reliable refresh
import { fetchUnifiedStats } from "./statsSlice";

// Async thunks for backend communication
export const fetchUserStats = createAsyncThunk(
    "timer/fetchUserStats",
    async (_, { getState, rejectWithValue }) => {
        try {
            console.log("🔄 Fetching unified stats for timer");
            const { timer } = getState();
            if (timer?.isLoggedIn) {
                const response = await api.getUnifiedStats();
                console.log("✅ Unified stats fetched:", response);

                if (response?.success && response?.stats?.timer) {
                    return {
                        success: true,
                        stats: response.stats.timer,
                    };
                }
                return { stats: null };
            } else {
                return { stats: null };
            }
        } catch (error) {
            console.error("❌ Stats fetch failed:", error);
            return rejectWithValue(error.message);
        }
    }
);

export const syncSessionToBackend = createAsyncThunk(
    "timer/syncSessionToBackend",
    async (sessionData, { getState, rejectWithValue }) => {
        try {
            const { timer } = getState();
            if (timer?.isLoggedIn) {
                console.log("🔄 Syncing session to backend:", sessionData);
                const result = await api.recordSession({
                    sessionDuration: sessionData.sessionDuration,
                    sessionType: sessionData.sessionType || "work",
                });
                console.log("✅ Backend sync result:", result);
                return result;
            } else {
                return null;
            }
        } catch (error) {
            console.error("❌ syncSessionToBackend error:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Keep existing completeSessionWithStatsRefresh for compatibility
export const completeSessionWithStatsRefresh = createAsyncThunk(
    "timer/completeSessionWithStatsRefresh",
    async (sessionData, { dispatch, getState, rejectWithValue }) => {
        try {
            const { timer } = getState();

            if (timer?.isLoggedIn) {
                console.log("🎯 Starting session completion with stats refresh...");

                // 1. Sync the session to backend
                const sessionResult = await dispatch(
                    syncSessionToBackend(sessionData)
                ).unwrap();

                // 2. Wait a moment for backend processing
                await new Promise((resolve) => setTimeout(resolve, 500));

                // 3. 🏆 Check achievements silently
                try {
                    await api.checkAchievements();
                    console.log("🏆 Achievement check completed silently");
                } catch (error) {
                    console.log("🏆 Achievement check failed (non-critical):", error.message);
                }

                // 4. Refresh unified stats immediately
                await dispatch(fetchUnifiedStats()).unwrap();

                console.log("🎯 Session completed and stats refreshed successfully!");
                return { sessionResult };
            } else {
                return null;
            }
        } catch (error) {
            console.error("❌ Error in completeSessionWithStatsRefresh:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Helper functions
const loadSettingsFromStorage = () => {
    try {
        const savedSettings = localStorage.getItem("dorofi_timer_settings");
        if (savedSettings) {
            return JSON.parse(savedSettings);
        }
    } catch (error) {
        console.error("Failed to load timer settings from localStorage:", error);
    }

    return {
        workDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
        autoStartBreaks: false,
        autoStartWork: false,
        notifications: true,
        soundEnabled: true,
        hideTimer: false,
        dailyGoalEnabled: false,
        dailyGoal: 120,
    };
};

const saveSettingsToStorage = (settings) => {
    try {
        localStorage.setItem("dorofi_timer_settings", JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save timer settings to localStorage:", error);
    }
};

const loadLocalStorage = () => {
    try {
        const todayKey = getTodayKey();
        const saved = localStorage.getItem(`dorofi_timer_${todayKey}`);

        if (saved) {
            const data = JSON.parse(saved);
            return {
                totalFocusTime: data.totalFocusTime || 0,
                sessions: data.sessions || 0,
                streak: data.streak || 0,
                lastActiveDate: data.lastActiveDate || getToday(),
            };
        }
    } catch (error) {
        console.error("Failed to load timer data from localStorage:", error);
    }

    return {
        totalFocusTime: 0,
        sessions: 0,
        streak: 0,
        lastActiveDate: getToday(),
    };
};

const saveLocalStorage = (state) => {
    if (state.isLoggedIn) return; // Don't save if logged in

    try {
        const todayKey = getTodayKey();
        const dataToSave = {
            totalFocusTime: state.totalFocusTime,
            sessions: state.sessions,
            streak: state.streak,
            lastActiveDate: state.lastActiveDate,
        };
        localStorage.setItem(
            `dorofi_timer_${todayKey}`,
            JSON.stringify(dataToSave)
        );
    } catch (error) {
        console.error("Failed to save timer data to localStorage:", error);
    }
};

// Initial state
const initialState = {
    // Timer state
    timeLeft: 1500,
    mode: "work",
    isRunning: false,

    // Session tracking
    currentSession: {
        startTime: null,
        pausedTime: 0,
        completedPomodoros: 0,
        currentTask: null,
        expectedEndTime: null,
        initialTimeLeft: null,
    },

    // Local stats (for offline users)
    ...loadLocalStorage(),

    // Backend sync
    isLoggedIn: false,
    needsBackendSync: null,
    sessionJustCompleted: null,
    lastSyncDate: null,
    isLoading: false,
    backendStats: null,
    allTimeStats: null,

    // Settings
    settings: loadSettingsFromStorage(),
    showSettings: false,
};

// Set initial timeLeft based on settings
initialState.timeLeft = initialState.settings.workDuration * 60;

const timerSlice = createSlice({
    name: "timer",
    initialState,
    reducers: {
        startTimer: (state) => {
            state.isRunning = true;
            const now = Date.now();
            if (!state.currentSession.startTime) {
                state.currentSession.startTime = now;
                state.currentSession.initialTimeLeft = state.timeLeft;
                console.log(
                    "🚀 Timer started with initial duration:",
                    state.timeLeft,
                    "seconds"
                );
            }
            state.currentSession.expectedEndTime = now + state.timeLeft * 1000;
        },

        pauseTimer: (state) => {
            state.isRunning = false;
            if (state.currentSession.startTime) {
                state.currentSession.pausedTime +=
                    Date.now() - state.currentSession.startTime;
                state.currentSession.startTime = null;
            }
            state.currentSession.expectedEndTime = null;
        },

        resetTimer: (state) => {
            state.isRunning = false;
            state.currentSession = {
                startTime: null,
                pausedTime: 0,
                completedPomodoros: state.currentSession.completedPomodoros,
                currentTask: state.currentSession.currentTask,
                expectedEndTime: null,
                initialTimeLeft: null,
            };

            // Reset timeLeft based on current mode
            const durations = {
                work: state.settings.workDuration * 60,
                shortBreak: state.settings.shortBreakDuration * 60,
                longBreak: state.settings.longBreakDuration * 60,
            };
            state.timeLeft = durations[state.mode];
        },

        syncTimer: (state) => {
            if (state.isRunning && state.currentSession.expectedEndTime) {
                const now = Date.now();
                const shouldHaveTimeLeft = Math.max(
                    0,
                    Math.ceil((state.currentSession.expectedEndTime - now) / 1000)
                );

                console.log("⏰ Timer sync:", {
                    expectedEnd: new Date(
                        state.currentSession.expectedEndTime
                    ).toLocaleTimeString(),
                    currentTime: new Date(now).toLocaleTimeString(),
                    currentTimeLeft: state.timeLeft,
                    shouldHaveTimeLeft: shouldHaveTimeLeft,
                    difference: Math.abs(state.timeLeft - shouldHaveTimeLeft),
                });

                // Only update if there's a significant difference (more than 2 seconds)
                if (Math.abs(state.timeLeft - shouldHaveTimeLeft) > 2) {
                    console.log(
                        "🔄 Correcting timer from",
                        state.timeLeft,
                        "to",
                        shouldHaveTimeLeft
                    );
                    state.timeLeft = shouldHaveTimeLeft;
                }

                // Complete session if time is up
                if (state.timeLeft === 0) {
                    console.log("⏰ Timer completed via sync");
                    timerSlice.caseReducers.completeSession(state);
                }
            }
        },

        tick: (state) => {
            if (state.isRunning && state.timeLeft > 0) {
                state.timeLeft -= 1;
                if (state.timeLeft === 0) {
                    timerSlice.caseReducers.completeSession(state);
                }
            }
        },

        completeSession: (state) => {
            const wasWorkSession = state.mode === "work";

            if (wasWorkSession) {
                // Get actual session duration
                const sessionDuration =
                    state.currentSession.initialTimeLeft !== null
                        ? state.currentSession.initialTimeLeft
                        : state.settings.workDuration * 60;

                console.log("🏁 SESSION COMPLETE:", {
                    sessionDuration,
                    sessionDurationMinutes: sessionDuration / 60,
                    isLoggedIn: state.isLoggedIn,
                });

                // Update local stats only if not logged in
                if (!state.isLoggedIn) {
                    state.totalFocusTime += sessionDuration;
                    state.sessions += 1;

                    const today = getToday();
                    if (state.lastActiveDate !== today) {
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        if (state.lastActiveDate === yesterday.toDateString()) {
                            state.streak += 1;
                        } else {
                            state.streak = 1;
                        }
                        state.lastActiveDate = today;
                    }

                    saveLocalStorage(state);
                }

                state.currentSession.completedPomodoros += 1;

                // Set backend sync flag for logged in users
                if (state.isLoggedIn) {
                    state.needsBackendSync = {
                        sessionDuration,
                        sessionType: "work",
                        timestamp: Date.now(),
                    };
                    console.log("🔄 Setting backend sync flag:", state.needsBackendSync);
                }

                // Mode switching logic
                if (
                    state.currentSession.completedPomodoros >=
                    state.settings.sessionsUntilLongBreak
                ) {
                    state.mode = "longBreak";
                    state.timeLeft = state.settings.longBreakDuration * 60;
                    state.currentSession.completedPomodoros = 0;
                } else {
                    state.mode = "shortBreak";
                    state.timeLeft = state.settings.shortBreakDuration * 60;
                }
            } else {
                state.mode = "work";
                state.timeLeft = state.settings.workDuration * 60;
            }

            // Reset session data
            state.currentSession.startTime = null;
            state.currentSession.pausedTime = 0;
            state.currentSession.expectedEndTime = null;
            state.currentSession.initialTimeLeft = null;
            state.isRunning = false;

            // Auto-start logic
            const shouldAutoStart = wasWorkSession
                ? state.settings.autoStartBreaks
                : state.settings.autoStartWork;
            if (shouldAutoStart) {
                state.isRunning = true;
                const now = Date.now();
                state.currentSession.startTime = now;
                state.currentSession.expectedEndTime = now + state.timeLeft * 1000;
                state.currentSession.initialTimeLeft = state.timeLeft;
            }
        },

        switchMode: (state, action) => {
            const { mode } = action.payload;
            state.mode = mode;
            state.isRunning = false;

            const durations = {
                work: state.settings.workDuration * 60,
                shortBreak: state.settings.shortBreakDuration * 60,
                longBreak: state.settings.longBreakDuration * 60,
            };

            state.timeLeft = durations[mode];
            state.currentSession = {
                startTime: null,
                pausedTime: 0,
                completedPomodoros: state.currentSession.completedPomodoros,
                currentTask: state.currentSession.currentTask,
                expectedEndTime: null,
                initialTimeLeft: null,
            };
        },

        updateSettings: (state, action) => {
            const newSettings = { ...state.settings, ...action.payload };
            state.settings = newSettings;
            saveSettingsToStorage(newSettings);

            // Update timeLeft if timer is not running and duration changed
            if (!state.isRunning) {
                const durationMap = {
                    work: "workDuration",
                    shortBreak: "shortBreakDuration",
                    longBreak: "longBreakDuration",
                };

                const durationField = durationMap[state.mode];
                if (durationField && action.payload[durationField]) {
                    state.timeLeft = newSettings[durationField] * 60;
                    state.currentSession.initialTimeLeft =
                        newSettings[durationField] * 60;
                    console.log(
                        `⚙️ ${state.mode} duration updated:`,
                        newSettings[durationField],
                        "minutes"
                    );
                }
            }
        },

        updateDailyGoal: (state, action) => {
            state.settings.dailyGoal = action.payload;
            saveSettingsToStorage(state.settings);
            if (!state.isLoggedIn) {
                saveLocalStorage(state);
            }
        },

        linkTaskToSession: (state, action) => {
            state.currentSession.currentTask = action.payload;
        },

        toggleSettings: (state) => {
            state.showSettings = !state.showSettings;
        },

        clearSessionCompletedFlag: (state) => {
            state.sessionJustCompleted = null;
        },

        setLoggedInState: (state, action) => {
            state.isLoggedIn = action.payload;
            if (action.payload) {
                // Clear local storage when logging in
                const todayKey = getTodayKey();
                localStorage.removeItem(`dorofi_timer_${todayKey}`);
                console.log("🔑 User logged in, cleared localStorage");
            } else {
                // Clear backend data when logging out
                state.backendStats = null;
                state.lastSyncDate = null;
                state.needsBackendSync = null;
                state.sessionJustCompleted = null;
                console.log("🔑 User logged out");
            }
        },

        clearSyncFlag: (state) => {
            state.needsBackendSync = null;
        },

        updateStatsFromBackend: (state, action) => {
            console.log("📊 Updating stats from backend:", action.payload);
            if (action.payload) {
                state.backendStats = action.payload;
                state.totalFocusTime = action.payload.dailyFocusTime || 0;
                state.sessions = action.payload.dailySessions || 0;
                state.streak = action.payload.currentStreak || 0;
                state.allTimeStats = {
                    totalFocusTime: action.payload.totalFocusTime || 0,
                    totalSessions: action.payload.totalSessions || 0,
                    longestStreak: action.payload.longestStreak || 0,
                };
                state.lastSyncDate = Date.now();
            }
        },

        setBackendStats: (state, action) => {
            timerSlice.caseReducers.updateStatsFromBackend(state, action);
        },

        setTimeLeftDirect: (state, action) => {
            state.timeLeft = action.payload;

            // Complete session if time reaches 0
            if (state.timeLeft <= 0) {
                console.log("⏰ Timer completed via direct time set");
                timerSlice.caseReducers.completeSession(state);
            }
        },
    },

    extraReducers: (builder) => {
        builder
            // fetchUserStats
            .addCase(fetchUserStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUserStats.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.stats) {
                    timerSlice.caseReducers.updateStatsFromBackend(state, {
                        payload: action.payload.stats,
                    });
                }
            })
            .addCase(fetchUserStats.rejected, (state, action) => {
                state.isLoading = false;
                console.error("❌ Failed to fetch user stats:", action.payload);
            })

            // syncSessionToBackend
            .addCase(syncSessionToBackend.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(syncSessionToBackend.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.stats) {
                    timerSlice.caseReducers.updateStatsFromBackend(state, {
                        payload: action.payload.stats,
                    });
                }
                state.needsBackendSync = null;
                console.log("✅ Backend sync completed");
            })
            .addCase(syncSessionToBackend.rejected, (state, action) => {
                state.isLoading = false;
                console.error("❌ Failed to sync session to backend:", action.payload);
            })

            // completeSessionWithStatsRefresh
            .addCase(completeSessionWithStatsRefresh.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(completeSessionWithStatsRefresh.fulfilled, (state, action) => {
                state.isLoading = false;
                state.needsBackendSync = null;
                state.sessionJustCompleted = Date.now();
                console.log("✅ Session completed with stats refresh and achievements!");
            })
            .addCase(completeSessionWithStatsRefresh.rejected, (state, action) => {
                state.isLoading = false;
                console.error(
                    "❌ Failed to complete session with stats refresh:",
                    action.payload
                );
            });
    },
});

export const {
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
    syncTimer,
    completeSession,
    switchMode,
    updateSettings,
    updateDailyGoal,
    linkTaskToSession,
    toggleSettings,
    clearSessionCompletedFlag,
    setLoggedInState,
    clearSyncFlag,
    updateStatsFromBackend,
    setBackendStats,
    setTimeLeftDirect,
} = timerSlice.actions;

export default timerSlice.reducer;
