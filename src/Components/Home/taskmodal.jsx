import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { X, Plus, Check, Trash2, Pin, Target, Edit3, Save, XCircle } from "lucide-react";
import {
    addTask,
    toggleTask,
    removeTask,
    togglePinTask,
    closeTaskModal,
    syncTaskToBackend,
    updateTask,
} from "../../store/slices/tasksSlice";
import { linkTaskToSession } from "../../store/slices/timerSlice";
import { createPortal } from "react-dom";

const TaskModal = () => {
    const dispatch = useDispatch();
    const { tasks, showTaskModal, isLoading, isLoggedIn } = useSelector(
        (state) => state.tasks
    );
    const [newTask, setNewTask] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [closing, setClosing] = useState(false);

    const handleClose = useCallback(() => {
        setClosing(true);
        setTimeout(() => dispatch(closeTaskModal()), 140);
    }, [dispatch]);

    useEffect(() => {
        if (showTaskModal) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [showTaskModal]);

    if (!showTaskModal) return null;

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (newTask.trim()) {
            const taskName = newTask.trim();

            dispatch(addTask(taskName));

            if (isLoggedIn) {
                const taskData = {
                    name: taskName,
                };
                dispatch(
                    syncTaskToBackend({
                        action: "add",
                        task: taskData,
                    })
                );
            }

            setNewTask("");
        }
    };

    const handleToggleTask = async (taskId) => {
        const task = tasks.find((t) => t._id === taskId);
        if (task && isLoggedIn) {
            dispatch(
                syncTaskToBackend({
                    action: "update",
                    taskId,
                    task: { isCompleted: !task.isCompleted },
                })
            );
        }

        dispatch(toggleTask(taskId));
    };

    const handleRemoveTask = async (taskId) => {
        if (isLoggedIn) {
            dispatch(
                syncTaskToBackend({
                    action: "delete",
                    taskId,
                })
            );
        }

        dispatch(removeTask(taskId));
        setActiveTaskId(null);
    };

    const handlePinTask = (taskId) => {
        const task = tasks.find((t) => t._id === taskId);
        dispatch(togglePinTask(taskId));

        if (task && !task.isPinned) {
            dispatch(linkTaskToSession(task));
        } else {
            dispatch(linkTaskToSession(null));
        }
    };

    const startEditing = (task) => {
        setEditingTaskId(task._id);
        setEditingText(task.name);
        setActiveTaskId(null);
    };

    const cancelEditing = () => {
        setEditingTaskId(null);
        setEditingText("");
    };

    const saveEdit = async (taskId) => {
        if (editingText.trim() && editingText.trim() !== tasks.find(t => t._id === taskId)?.name) {
            const updatedTask = { name: editingText.trim() };
            
            dispatch(updateTask({ taskId, updates: updatedTask }));

            if (isLoggedIn) {
                dispatch(
                    syncTaskToBackend({
                        action: "update",
                        taskId,
                        task: updatedTask,
                    })
                );
            }
        }
        
        setEditingTaskId(null);
        setEditingText("");
    };

    const handleTaskClick = (taskId) => {
        setActiveTaskId(activeTaskId === taskId ? null : taskId);
    };

    const activeTasks = tasks.filter((task) => !task.isCompleted);
    const completedTasks = tasks.filter((task) => task.isCompleted);

    return createPortal(
        <div className={`fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[10005] p-4 ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}>
            <div className={`bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-primary/20 flex flex-col relative ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                            <Target size={24} className="text-background" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-primary">
                                Manage Tasks
                            </h2>
                            {isLoggedIn && (
                                <p className="text-xs text-secondary mt-0.5">
                                    Synced across devices
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-full p-2 hover:bg-surface/80 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} className="text-secondary hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                    {/* Add Task Form */}
                    <form onSubmit={handleAddTask} className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-1 px-4 py-3 bg-surface/50 border border-surface rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-primary placeholder-secondary text-sm sm:text-base"
                                autoFocus
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!newTask.trim() || isLoading}
                                className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 text-background rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap shadow-sm"
                            >
                                <Plus size={18} />
                                {isLoading ? "Adding..." : "Add Task"}
                            </button>
                        </div>
                    </form>

                    {/* Active Tasks */}
                    <div className="mb-6">
                        <h3 className="text-base sm:text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                            <Target size={18} />
                            Active Tasks ({activeTasks.length})
                        </h3>

                        {activeTasks.length > 0 ? (
                            <div className="space-y-3">
                                {activeTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => handleTaskClick(task._id)}
                                        className={`group flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                                            activeTaskId === task._id
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                : ''
                                        } ${
                                            task.isPinned
                                                ? "bg-primary/10 border-primary/30 shadow-sm"
                                                : "bg-surface/50 border-surface hover:bg-surface/80"
                                        }`}
                                    >
                                        {/* Pin Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePinTask(task._id);
                                            }}
                                            className={`p-2 rounded-lg transition-all duration-200 ${
                                                task.isPinned
                                                    ? "bg-primary text-background opacity-100"
                                                    : `hover:bg-primary/20 text-secondary hover:text-primary ${
                                                        activeTaskId === task._id ? 'opacity-100' : 'opacity-0 sm:opacity-0'
                                                    } sm:group-hover:opacity-100`
                                            }`}
                                            title={task.isPinned ? "Unpin from home" : "Pin to home"}
                                        >
                                            <Pin size={14} />
                                        </button>

                                        {/* Checkbox */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleTask(task._id);
                                            }}
                                            className="w-5 h-5 rounded-md border-2 border-primary/50 hover:border-primary flex items-center justify-center transition-colors flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            {task.isCompleted && (
                                                <Check size={14} className="text-primary" />
                                            )}
                                        </button>

                                        {/* Task Text (Editable) */}
                                        {editingTaskId === task._id ? (
                                            <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    className="flex-1 px-3 py-1.5 bg-background border border-primary/30 rounded-lg focus:outline-none focus:border-primary text-sm sm:text-base text-primary"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEdit(task._id);
                                                        if (e.key === 'Escape') cancelEditing();
                                                    }}
                                                />
                                                <button
                                                    onClick={() => saveEdit(task._id)}
                                                    className="p-1.5 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                                    title="Save changes"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="Cancel editing"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="flex-1 text-primary font-medium text-sm sm:text-base leading-tight">
                                                {task.name}
                                            </span>
                                        )}

                                        {/* Edit & Delete buttons */}
                                        {editingTaskId !== task._id && (
                                            <div 
                                                className={`flex items-center gap-1 transition-opacity duration-200 ${
                                                    activeTaskId === task._id ? 'opacity-100' : 'opacity-0 sm:opacity-0'
                                                } sm:group-hover:opacity-100`}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => startEditing(task)}
                                                    className="p-2 rounded-lg hover:bg-primary/10 text-secondary hover:text-primary transition-colors"
                                                    title="Edit task"
                                                    disabled={isLoading}
                                                >
                                                    <Edit3 size={14} />
                                                </button>

                                                <button
                                                    onClick={() => handleRemoveTask(task._id)}
                                                    className="p-2 rounded-lg hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
                                                    title="Delete task"
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-secondary bg-surface/30 rounded-xl border border-surface p-6">
                                <Target size={40} className="mx-auto mb-3 opacity-50 text-primary" />
                                <p className="text-sm sm:text-base">No active tasks. Add one to get started!</p>
                                {!isLoggedIn && (
                                    <p className="text-xs sm:text-sm mt-2 text-primary">
                                        Tasks are saved locally. <span className="hidden sm:inline">Login to sync across devices!</span>
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Completed Tasks */}
                    {completedTasks.length > 0 && (
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                                <Check size={18} />
                                Completed Tasks ({completedTasks.length})
                            </h3>
                            <div className="space-y-3">
                                {completedTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => handleTaskClick(task._id)}
                                        className={`group flex items-center gap-3 p-4 bg-surface/30 rounded-xl border border-surface/50 hover:bg-surface/50 transition-colors cursor-pointer ${
                                            activeTaskId === task._id
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                : ''
                                        }`}
                                    >
                                        <div className="w-8"></div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleTask(task._id);
                                            }}
                                            className="w-5 h-5 rounded-md border-2 border-primary bg-primary flex items-center justify-center transition-colors flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <Check size={14} className="text-background" />
                                        </button>

                                        <span className="flex-1 text-secondary line-through text-sm sm:text-base leading-tight">
                                            {task.name}
                                        </span>

                                        <div 
                                            className={`transition-opacity duration-200 ${
                                                activeTaskId === task._id ? 'opacity-100' : 'opacity-0 sm:opacity-0'
                                            } sm:group-hover:opacity-100`}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => handleRemoveTask(task._id)}
                                                className="p-2 rounded-lg hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
                                                title="Delete task"
                                                disabled={isLoading}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default TaskModal;
