// Components/Home/taskmodal.jsx - Updated with pin functionality
import React, { useState } from 'react';
import { X, Plus, Check, Trash2, Pin } from 'lucide-react';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  tasks, 
  addTask, 
  toggleTask, 
  removeTask, 
  togglePinTask 
}) => {
  const [newTask, setNewTask] = useState('');

  if (!isOpen) return null;

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask.trim());
      setNewTask('');
    }
  };

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg border border-surface">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface">
          <h2 className="text-xl font-bold text-primary">Tasks</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface/50 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* Add Task */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 bg-surface border border-surface rounded-xl text-primary placeholder-secondary focus:outline-none focus:border-primary"
            />
            <button 
              onClick={handleAddTask}
              className="w-12 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-secondary mb-3">
                Active ({activeTasks.length})
              </h3>
              <div className="space-y-2">
                {activeTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-surface/50 rounded-xl group">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className="w-5 h-5 rounded border-2 border-secondary hover:border-primary transition-colors flex items-center justify-center"
                    >
                      {task.completed && <Check size={12} className="text-primary" />}
                    </button>
                    
                    <span className={`flex-1 text-primary ${task.isPinned ? 'font-medium' : ''}`}>
                      {task.text}
                    </span>
                    
                    {/* Pin Button */}
                    <button 
                      onClick={() => togglePinTask(task.id)}
                      className={`p-1 rounded transition-colors ${
                        task.isPinned 
                          ? 'text-primary bg-primary/10' 
                          : 'text-secondary opacity-0 group-hover:opacity-100 hover:text-primary hover:bg-primary/5'
                      }`}
                      title={task.isPinned ? 'Unpin task' : 'Pin as active task'}
                    >
                      <Pin size={14} />
                    </button>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-secondary mb-3">
                Completed ({completedTasks.length})
              </h3>
              <div className="space-y-2">
                {completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 bg-surface/30 rounded-xl group">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className="w-5 h-5 rounded bg-green-500 flex items-center justify-center"
                    >
                      <Check size={12} className="text-white" />
                    </button>
                    <span className="flex-1 text-secondary line-through">{task.text}</span>
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-secondary">
              <p>No tasks yet. Add one to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
