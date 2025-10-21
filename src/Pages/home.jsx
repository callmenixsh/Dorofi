// Pages/Home.jsx - Show F Key Hint Only When Timer Running
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { setLoggedInState, setBackendStats } from "../store/slices/timerSlice";
import {
    setLoggedInState as setTasksLoggedInState,
    fetchTasks,
} from "../store/slices/tasksSlice";
import useTimer from "../hooks/useTimer";

import StatsBar from "../Components/Home/statsBar";
import TimerCard from "../Components/Home/timerCard";
import TimerControls from "../Components/Home/timerControls";
import TaskModal from "../Components/Home/taskmodal";
import TimerSettingsModal from "../Components/Home/timerSettingsModal";

const Home = () => {
    const dispatch = useDispatch();
    const { user, token } = useAuth();
    const { showTaskModal } = useSelector((state) => state.tasks);
    const { showSettings, isLoggedIn, settings, isRunning, mode } = useSelector(
        (state) => state.timer
    );

    // Initialize timer
    useTimer();

    // Focus mode state - ONLY triggered by F key
    const [focusMode, setFocusMode] = useState(false);

    // Disable scroll when in focus mode
    useEffect(() => {
        if (focusMode) {
            // Save current scroll position and overflow
            const scrollY = window.scrollY;
            const originalOverflow = document.body.style.overflow;
            const originalPosition = document.body.style.position;
            const originalTop = document.body.style.top;
            const originalWidth = document.body.style.width;

            // Lock scroll
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";

            // Cleanup - restore scroll when focus mode exits
            return () => {
                document.body.style.overflow = originalOverflow;
                document.body.style.position = originalPosition;
                document.body.style.top = originalTop;
                document.body.style.width = originalWidth;
                window.scrollTo(0, scrollY);
            };
        }
    }, [focusMode]);

    // Keyboard shortcut for F key ONLY
    useEffect(() => {
        const handleFocusModeToggle = (event) => {
            // STRICT CHECK: Only 'f' or 'F' key, nothing else
            if (event.key !== 'f' && event.key !== 'F') {
                return; // Exit early if not F key
            }

            // Check if typing in an input field
            const isTyping =
                event.target.tagName === "INPUT" ||
                event.target.tagName === "TEXTAREA" ||
                event.target.isContentEditable;

            // Check if any modal or dialog is open
            const isModalOpen = showSettings || showTaskModal;

            // Only trigger if all conditions are met
            if (!isTyping && !isModalOpen) {
                event.preventDefault();
                event.stopPropagation();
                setFocusMode((prev) => {
                    console.log('🎯 Focus mode toggled via F key:', !prev);
                    return !prev;
                });
            }
        };

        // Listen on window level
        window.addEventListener("keydown", handleFocusModeToggle);
        return () => window.removeEventListener("keydown", handleFocusModeToggle);
    }, [showSettings, showTaskModal]);

    useEffect(() => {
        if (user) {

            // Update BOTH timer and tasks logged in state
            dispatch(setLoggedInState(true));
            dispatch(setTasksLoggedInState(true));

            // Load existing backend stats from localStorage
            try {
                const googleUserInfo = localStorage.getItem("googleUserInfo");
                if (googleUserInfo) {
                    const userData = JSON.parse(googleUserInfo);
                    if (userData.stats) {
                        dispatch(setBackendStats(userData.stats));
                    }
                }
            } catch (error) {
                console.error("Error reading existing stats:", error);
            }

            // Fetch tasks from backend
            dispatch(fetchTasks());
        } else {

            // Update BOTH timer and tasks logged in state
            dispatch(setLoggedInState(false));
            dispatch(setTasksLoggedInState(false));
        }
    }, [user, token, dispatch]);

    // Normal mode rendering
    if (!focusMode) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    <div className="space-y-8">
                        <StatsBar />
                        <TimerCard />
                        <TimerControls />
                        {showTaskModal && <TaskModal />}
                        {showSettings && <TimerSettingsModal />}
                    </div>

                    {/* Keyboard shortcut hint - ONLY show when timer is running */}
                    {isRunning && (
                        <div className="fixed top-20 right-4 px-3 py-2 bg-background/90 text-secondary rounded-lg text-xs shadow-lg backdrop-blur-sm border border-primary/20 z-40">
                            Press{" "}
                            <kbd className="px-2 py-1 bg-primary/10 text-primary rounded mx-1 font-mono">
                                F
                            </kbd>{" "}
                            for Focus Mode
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // TRUE Fullscreen Focus Mode - covers EVERYTHING including music player
    return (
        <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999] overflow-hidden">
            {/* Centered Timer and Controls */}
            <div className="w-full max-w-xl px-4 space-y-8">
                <TimerCard />
                <TimerControls />
            </div>

            {/* Focus Mode Indicator - minimal and elegant */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 bg-primary/10 backdrop-blur-md text-primary rounded-full text-sm shadow-lg border border-primary/20 flex items-center gap-3 z-[10000]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="font-medium">Focus Mode</span>
                </div>
                <div className="h-4 w-px bg-primary/30"></div>
                <span className="text-xs opacity-75">
                    Press{" "}
                    <kbd className="px-1.5 py-0.5 bg-primary/20 rounded text-xs mx-1 font-mono">
                        F
                    </kbd>{" "}
                    to exit
                </span>
            </div>

            {/* Modals - Always available even in focus mode with higher z-index */}
            {showTaskModal && (
                <div className="z-[10001]">
                    <TaskModal />
                </div>
            )}
            {showSettings && (
                <div className="z-[10001]">
                    <TimerSettingsModal />
                </div>
            )}
        </div>
    );
};

export default Home;
