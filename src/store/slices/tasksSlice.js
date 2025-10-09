// store/slices/tasksSlice.js - Fixed for New Schema
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks for backend communication (auth-only)
export const fetchTasks = createAsyncThunk(
    'tasks/fetchTasks',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { timer } = getState();
            
            if (!timer.isLoggedIn) {
                // Return empty for guests - they'll use localStorage
                return { tasks: [] };
            }

            return await api.getTasks();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const syncTaskToBackend = createAsyncThunk(
    'tasks/syncTaskToBackend',
    async ({ action, task, taskId }, { getState, rejectWithValue }) => {
        try {
            const { timer } = getState();
            
            if (!timer.isLoggedIn) {
                return null; // No sync for guests
            }

            switch (action) {
                case 'add':
                    // 🔥 FIXED: Send clean task data with 'name'
                    const cleanTask = {
                        name: task.name
                    };
                    return await api.addTask(cleanTask);
                case 'update':
                    return await api.updateTask(taskId, task);
                case 'delete':
                    return await api.deleteTask(taskId);
                default:
                    throw new Error('Invalid action');
            }
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Local storage functions (for pinned tasks and guest mode)
const loadTasksFromStorage = () => {
    try {
        const saved = localStorage.getItem('dorofi_tasks');
        return saved ? JSON.parse(saved) : [];
    } catch (error) {
        console.error('Failed to load tasks from localStorage:', error);
        return [];
    }
};

const saveTasksToStorage = (tasks) => {
    try {
        localStorage.setItem('dorofi_tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Failed to save tasks to localStorage:', error);
    }
};

const loadPinnedTaskFromStorage = () => {
    try {
        const saved = localStorage.getItem('dorofi_pinned_task');
        return saved ? JSON.parse(saved) : null;
    } catch (error) {
        console.error('Failed to load pinned task from localStorage:', error);
        return null;
    }
};

const savePinnedTaskToStorage = (task) => {
    try {
        if (task) {
            localStorage.setItem('dorofi_pinned_task', JSON.stringify(task));
        } else {
            localStorage.removeItem('dorofi_pinned_task');
        }
    } catch (error) {
        console.error('Failed to save pinned task to localStorage:', error);
    }
};

const initialState = {
    tasks: loadTasksFromStorage(),
    pinnedTask: loadPinnedTaskFromStorage(),
    showTaskModal: false,
    isLoading: false,
    lastSyncDate: null,
    isLoggedIn: false,
};

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        addTask: (state, action) => {
            const newTask = {
                _id: Date.now().toString(), // 🔥 FIXED: Use '_id' for consistency
                name: action.payload, // 🔥 FIXED: Use 'name'
                isCompleted: false, // 🔥 FIXED: Use 'isCompleted'
                isPinned: false,
                // Frontend only - timestamps for local use
                createdAt: new Date().toISOString(),
            };
            
            state.tasks.push(newTask);
            
            if (state.isLoggedIn) {
                console.log('📝 Task added, will sync to backend');
            } else {
                saveTasksToStorage(state.tasks);
            }
        },
        
        toggleTask: (state, action) => {
            const task = state.tasks.find(t => t._id === action.payload);
            if (task) {
                task.isCompleted = !task.isCompleted; // 🔥 FIXED: Use 'isCompleted'
                
                if (!state.isLoggedIn) {
                    saveTasksToStorage(state.tasks);
                }
            }
        },
        
        removeTask: (state, action) => {
            const taskId = action.payload;
            
            // Remove from pinned if it was pinned
            if (state.pinnedTask?._id === taskId) {
                state.pinnedTask = null;
                savePinnedTaskToStorage(null);
            }
            
            state.tasks = state.tasks.filter(t => t._id !== taskId);
            
            if (!state.isLoggedIn) {
                saveTasksToStorage(state.tasks);
            }
        },

        // Update task functionality
        updateTask: (state, action) => {
            const { taskId, updates } = action.payload;
            const taskIndex = state.tasks.findIndex(task => task._id === taskId);
            
            if (taskIndex !== -1) {
                // Update the task
                state.tasks[taskIndex] = { 
                    ...state.tasks[taskIndex], 
                    ...updates,
                    // Keep original timestamps
                    createdAt: state.tasks[taskIndex].createdAt,
                    // Add updated timestamp
                    updatedAt: new Date().toISOString()
                };
                
                // Update pinned task if this was the pinned one
                if (state.pinnedTask?._id === taskId) {
                    state.pinnedTask = { ...state.pinnedTask, ...updates };
                    savePinnedTaskToStorage(state.pinnedTask);
                }
                
                // Save to localStorage if not logged in
                if (!state.isLoggedIn) {
                    saveTasksToStorage(state.tasks);
                }
                
                console.log('📝 Task updated:', taskId, updates);
            }
        },
        
        togglePinTask: (state, action) => {
            const taskId = action.payload;
            const task = state.tasks.find(t => t._id === taskId);
            
            if (task) {
                if (state.pinnedTask?._id === taskId) {
                    // Unpin
                    state.pinnedTask = null;
                    task.isPinned = false;
                    savePinnedTaskToStorage(null);
                } else {
                    // Pin (and unpin any existing)
                    if (state.pinnedTask) {
                        const oldPinned = state.tasks.find(t => t._id === state.pinnedTask._id);
                        if (oldPinned) oldPinned.isPinned = false;
                    }
                    
                    state.pinnedTask = { ...task }; // Create a copy
                    task.isPinned = true;
                    savePinnedTaskToStorage(state.pinnedTask);
                }
                
                if (!state.isLoggedIn) {
                    saveTasksToStorage(state.tasks);
                }
            }
        },
        
        openTaskModal: (state) => {
            state.showTaskModal = true;
        },
        
        closeTaskModal: (state) => {
            state.showTaskModal = false;
        },
        
        setLoggedInState: (state, action) => {
            state.isLoggedIn = action.payload;
            if (action.payload) {
                // Clear localStorage when logged in
                localStorage.removeItem('dorofi_tasks');
                console.log('🔑 User logged in, cleared local tasks');
            } else {
                // When logging out, keep current tasks as local
                saveTasksToStorage(state.tasks);
                console.log('🔑 User logged out, saved tasks locally');
            }
        },
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.tasks) {
                    // 🔥 FIXED: Merge backend data with frontend fields
                    state.tasks = action.payload.tasks.map(task => ({
                        _id: task._id, // 🔥 Backend MongoDB ID
                        name: task.name, // 🔥 FIXED: Use 'name'
                        isCompleted: task.isCompleted || false, // 🔥 FIXED: Use 'isCompleted'
                        isPinned: state.pinnedTask?._id === task._id,
                        createdAt: task.createdAt || new Date().toISOString(),
                    }));
                    state.lastSyncDate = Date.now();
                    console.log('✅ Tasks synced from backend:', action.payload.tasks.length);
                }
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.isLoading = false;
                console.error('❌ Failed to fetch tasks:', action.payload);
            })
            .addCase(syncTaskToBackend.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(syncTaskToBackend.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload?.tasks) {
                    // 🔥 FIXED: Update with fresh backend data + frontend fields
                    state.tasks = action.payload.tasks.map(task => ({
                        _id: task._id,
                        name: task.name, // 🔥 FIXED: Use 'name'
                        isCompleted: task.isCompleted || false, // 🔥 FIXED: Use 'isCompleted'
                        isPinned: state.pinnedTask?._id === task._id,
                        createdAt: task.createdAt || new Date().toISOString(),
                    }));
                    state.lastSyncDate = Date.now();
                    console.log('✅ Task synced to backend');
                }
            })
            .addCase(syncTaskToBackend.rejected, (state, action) => {
                state.isLoading = false;
                console.error('❌ Failed to sync task to backend:', action.payload);
            });
    },
});

export const {
    addTask,
    toggleTask,
    removeTask,
    updateTask,
    togglePinTask,
    openTaskModal,
    closeTaskModal,
    setLoggedInState,
} = tasksSlice.actions;

export default tasksSlice.reducer;
