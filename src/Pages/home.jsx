// Pages/Home.jsx - Show F Key Hint Only When Timer Running
import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../contexts/AuthContext";
import { setLoggedInState, setBackendStats } from "../store/slices/timerSlice";
import {
	setLoggedInState as setTasksLoggedInState,
	fetchTasks,
} from "../store/slices/tasksSlice";
import { addReaction, addMessage, leaveRoom } from "../store/slices/roomsSlice";
import useTimer from "../hooks/useTimer";

import StatsBar from "../Components/Home/statsBar";
import TimerCard from "../Components/Home/timerCard";
import TimerControls from "../Components/Home/timerControls";
import TaskModal from "../Components/Home/taskmodal";
import TimerSettingsModal from "../Components/Home/timerSettingsModal";
import RoomHeader from "../Components/Rooms/RoomHeader";
import RoomSidebar from "../Components/Rooms/RoomSidebar";
import LeaveRoomModal from "../Components/Rooms/LeaveRoomModal";
import RoomShareModal from "../Components/Rooms/RoomShareModal";

const Home = () => {
	const dispatch = useDispatch();
	const { user, token } = useAuth();
	const { showTaskModal } = useSelector((state) => state.tasks);
	const { showSettings, isRunning } = useSelector(
		(state) => state.timer,
	);
	const { activeRoom, recentReactions, messages } = useSelector((state) => state.rooms);
	const { displayName } = useSelector((state) => state.profile.user) || {};

	useTimer();

	const [focusMode, setFocusMode] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
	const [activeTab, setActiveTab] = useState("participants");
	const [chatMessage, setChatMessage] = useState("");
	const [cooldownRemaining, setCooldownRemaining] = useState(0);
	const [showLeaveModal, setShowLeaveModal] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);
	const chatEndRef = useRef(null);

	const COOLDOWN_MS = 1000;

	const participants = Array.isArray(activeRoom?.participants) ? activeRoom.participants : [];
	const reactions = [
		{ type: "fire", icon: "🔥", label: "Cheer" },
		{ type: "heart", icon: "❤️", label: "Love" },
		{ type: "coffee", icon: "☕", label: "Break" },
		{ type: "zap", icon: "⚡", label: "Focus" },
	];

	const handleSendReaction = (type, targetName = "the room") => {
		if (cooldownRemaining > 0) return;
		setCooldownRemaining(COOLDOWN_MS);
		dispatch(addReaction({
			type,
			from: displayName || "You",
			target: targetName,
		}));
	};

	const handleSendMessage = (e) => {
		e.preventDefault();
		if (!chatMessage.trim()) return;
		dispatch(addMessage({
			from: displayName || "You",
			text: chatMessage,
			userId: user?._id || "me",
		}));
		setChatMessage("");
	};

	const handleLeaveRoom = () => {
		setShowLeaveModal(true);
	};

	const handleConfirmLeave = () => {
		dispatch(leaveRoom());
		setShowLeaveModal(false);
	};

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, recentReactions, activeTab]);

	useEffect(() => {
		if (cooldownRemaining > 0) {
			const timer = setInterval(() => {
				setCooldownRemaining((prev) => Math.max(0, prev - 100));
			}, 100);
			return () => clearInterval(timer);
		}
	}, [cooldownRemaining]);

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
			if (event.key !== "f" && event.key !== "F") {
				return; // Exit early if not F key
			}

			// Check if typing in an input field
			const isTyping =
				event.target.tagName === "INPUT" ||
				event.target.tagName === "TEXTAREA" ||
				event.target.isContentEditable;

			// Only trigger if not typing
			if (!isTyping) {
				event.preventDefault();
				event.stopPropagation();
				setFocusMode((prev) => {
					console.log("🎯 Focus mode toggled via F key:", !prev);
					return !prev;
				});
			}
		};

		// Listen on window level with capture to catch it before other listeners if needed
		window.addEventListener("keydown", handleFocusModeToggle, true);
		return () =>
			window.removeEventListener("keydown", handleFocusModeToggle, true);
	}, []);

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
			<div className="min-h-screen bg-background relative overflow-x-hidden">
				{activeRoom && (
					<RoomSidebar
						isOpen={isSidebarOpen}
						activeTab={activeTab}
						onTabChange={setActiveTab}
						onClose={setIsSidebarOpen}
						onSendReaction={handleSendReaction}
						cooldownRemaining={cooldownRemaining}
						participants={participants}
						recentReactions={recentReactions}
						messages={messages}
						onSendMessage={handleSendMessage}
						chatMessage={chatMessage}
						setChatMessage={setChatMessage}
						chatEndRef={chatEndRef}
						reactions={reactions}
						user={user}
					/>
				)}
				<div className={`transition-all duration-300 ease-in-out ${activeRoom && isSidebarOpen ? "lg:mr-80" : "mr-0"}`}>
					<div className="container mx-auto px-4 py-8 max-w-4xl">
						<div className="space-y-8">
							{activeRoom && (
								<RoomHeader
									roomId={activeRoom.id || ""}
									roomName={activeRoom.name || "Study Room"}
									participantsCount={Array.isArray(activeRoom?.participants) ? activeRoom.participants.length : (activeRoom?.participants || 0)}
									onShareClick={() => setShowShareModal(true)}
									onLeaveClick={handleLeaveRoom}
									onToggleSidebar={setIsSidebarOpen}
									isSidebarOpen={isSidebarOpen}
								/>
							)}
							<StatsBar />
							<TimerCard />
							<TimerControls />
							{showTaskModal && <TaskModal />}
							{showSettings && <TimerSettingsModal />}
						</div>

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

				{activeRoom && (
					<>
						<LeaveRoomModal
							isOpen={showLeaveModal}
							onClose={() => setShowLeaveModal(false)}
							onConfirm={handleConfirmLeave}
							roomName={activeRoom.name}
						/>
						<RoomShareModal
							isOpen={showShareModal}
							onClose={() => setShowShareModal(false)}
							roomId={activeRoom.id || ""}
							roomLink={window.location.href}
						/>
					</>
				)}
			</div>
		);
	}

	// TRUE Fullscreen Focus Mode - covers EVERYTHING including music player and sidebars
	return createPortal(
		<div className="fixed inset-0 bg-background flex flex-col items-center justify-between py-16 px-6 z-[9999] overflow-hidden">
			{/* Top spacing / subtle brand or minimal info */}
			<div className="w-full max-w-2xl flex items-center justify-between opacity-60">
				<div className="text-xs font-mono uppercase tracking-[0.25em] text-primary">
					Focus Mode
				</div>
				<div className="text-xs font-mono text-secondary">
					Press{" "}
					<kbd className="px-1.5 py-0.5 bg-primary/10 rounded font-mono">F</kbd>{" "}
					to exit
				</div>
			</div>

			{/* Centered Timer and Controls - expanded layout */}
			<div className="w-full max-w-xl space-y-12 my-auto">
				<TimerCard isFocusMode={true} />
				<TimerControls />
			</div>


			{/* Modals - Always available even in focus mode with higher z-index */}
			<div className="z-[10001]">
				{showTaskModal && <TaskModal />}
				{showSettings && <TimerSettingsModal />}
			</div>
		</div>,
		document.body,
	);
};

export default Home;
