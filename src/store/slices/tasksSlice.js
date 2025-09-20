import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [
      { id: 1, text: "Review project documentation", completed: false, isPinned: false },
      { id: 2, text: "Complete React components", completed: true, isPinned: false },
      { id: 3, text: "Test user authentication", completed: false, isPinned: true },
    ],
    showTaskModal: false
  },
  reducers: {
    // Task CRUD operations
    addTask: (state, action) => {
      const newTask = {
        id: Date.now(),
        text: action.payload,
        completed: false,
        isPinned: false
      };
      state.tasks.push(newTask);
    },
    
    toggleTask: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    
    togglePinTask: (state, action) => {
      // First, unpin all other tasks
      state.tasks.forEach(task => {
        if (task.id !== action.payload) {
          task.isPinned = false;
        }
      });
      
      // Then toggle the target task
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.isPinned = !task.isPinned;
      }
    },
    
    // Modal controls
    openTaskModal: (state) => {
      state.showTaskModal = true;
    },
    closeTaskModal: (state) => {
      state.showTaskModal = false;
    }
  }
});

export const {
  addTask,
  toggleTask,
  removeTask,
  togglePinTask,
  openTaskModal,
  closeTaskModal
} = tasksSlice.actions;

export default tasksSlice.reducer;
