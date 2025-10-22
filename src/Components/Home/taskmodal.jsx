import React, { useState, useEffect } from "react";
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

const TaskModal = () => {
    const dispatch = useDispatch();
    const { tasks, showTaskModal, isLoading, isLoggedIn } = useSelector(
        (state) => state.tasks
    );
    const { currentSession } = useSelector((state) => state.timer);
    const [newTask, setNewTask] = useState("");
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editingText, setEditingText] = useState("");
    const [activeTaskId, setActiveTaskId] = useState(null);

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

    return (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-md sm:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden border border-primary/20">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-surface/50 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-primary">Manage Tasks</h2>
                        {isLoggedIn && (
                            <p className="text-xs sm:text-sm text-secondary mt-1">
                                Synced across devices 
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => dispatch(closeTaskModal())}
                        className="rounded-full p-2 hover:bg-surface/80 transition-colors"
                        aria-label="Close"
                    >
                        <X
                            size={20}
                            className="text-secondary hover:text-primary transition-colors"
                        />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 max-h-[calc(95vh-120px)] sm:max-h-[calc(90vh-120px)] overflow-y-auto">
                    {/* Add Task Form */}
                    <form onSubmit={handleAddTask} className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                placeholder="Add a new task..."
                                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-surface/50 border border-surface rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all text-primary placeholder-secondary text-sm sm:text-base"
                                autoFocus
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!newTask.trim() || isLoading}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-accent hover:bg-accent/90 text-background rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                            >
                                <Plus size={16} />
                                {isLoading ? "Adding..." : "Add Task"}
                            </button>
                        </div>
                    </form>

                    {/* Active Tasks */}
                    <div className="mb-6">
                        <h3 className="text-base sm:text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                            <Target size={16} />
                            Active Tasks ({activeTasks.length})
                        </h3>

                        {activeTasks.length > 0 ? (
                            <div className="space-y-2 sm:space-y-3">
                                {activeTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => handleTaskClick(task._id)}
                                        className={`group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border-2 transition-all hover:shadow-sm cursor-pointer ${
                                            activeTaskId === task._id
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                : ''
                                        } ${
                                            task.isPinned
                                                ? "bg-accent/10 border-accent/30 shadow-sm"
                                                : "bg-surface/30 border-surface/50 hover:bg-surface/50 hover:border-accent/20"
                                        }`}
                                    >
                                        {/* Pin Button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePinTask(task._id);
                                            }}
                                            className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
                                                task.isPinned
                                                    ? "bg-accent text-background opacity-100"
                                                    : `hover:bg-accent/20 text-secondary hover:text-accent ${
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
                                            className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-accent/50 hover:border-accent flex items-center justify-center transition-colors flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            {task.isCompleted && (
                                                <Check size={12} className="text-accent" />
                                            )}
                                        </button>

                                        {/* Task Text (Editable) */}
                                        {editingTaskId === task._id ? (
                                            <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="text"
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    className="flex-1 px-2 py-1 bg-background border border-accent/30 rounded focus:outline-none focus:border-accent text-sm sm:text-base text-primary"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveEdit(task._id);
                                                        if (e.key === 'Escape') cancelEditing();
                                                    }}
                                                />
                                                <button
                                                    onClick={() => saveEdit(task._id)}
                                                    className="p-1.5 text-green-500 hover:bg-green-500/10 rounded transition-colors"
                                                    title="Save changes"
                                                >
                                                    <Save size={14} />
                                                </button>
                                                <button
                                                    onClick={cancelEditing}
                                                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                                    title="Cancel editing"
                                                >
                                                    <XCircle size={14} />
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
                                                    className="p-1.5 sm:p-2 rounded-full hover:bg-primary/10 text-secondary hover:text-primary transition-colors"
                                                    title="Edit task"
                                                    disabled={isLoading}
                                                >
                                                    <Edit3 size={14} />
                                                </button>

                                                <button
                                                    onClick={() => handleRemoveTask(task._id)}
                                                    className="p-1.5 sm:p-2 rounded-full hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
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
                            <div className="text-center py-8 sm:py-12 text-secondary">
                                <Target size={40} className="mx-auto mb-3 sm:mb-4 opacity-50" />
                                <p className="text-sm sm:text-base">No active tasks. Add one to get started!</p>
                                {!isLoggedIn && (
                                    <p className="text-xs sm:text-sm mt-2 text-accent">
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
                                <Check size={16} />
                                Completed Tasks ({completedTasks.length})
                            </h3>
                            <div className="space-y-2 sm:space-y-3">
                                {completedTasks.map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => handleTaskClick(task._id)}
                                        className={`group flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-surface/20 rounded-lg border border-surface/30 hover:bg-surface/30 transition-colors cursor-pointer ${
                                            activeTaskId === task._id
                                                ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                                                : ''
                                        }`}
                                    >
                                        <div className="w-6 sm:w-8"></div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleTask(task._id);
                                            }}
                                            className="w-4 h-4 sm:w-5 sm:h-5 rounded border-2 border-accent bg-accent flex items-center justify-center transition-colors flex-shrink-0"
                                            disabled={isLoading}
                                        >
                                            <Check size={12} className="text-background" />
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
                                                className="p-1.5 sm:p-2 rounded-full hover:bg-red-500/10 text-secondary hover:text-red-500 transition-colors"
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
        </div>
    );
};

export default TaskModal;
