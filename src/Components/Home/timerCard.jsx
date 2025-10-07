// Components/Home/timerCard.jsx - Complete final version with break mode colors
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Target,
	Sliders,
	Check,
	MoreHorizontal,
	Coffee,
	Zap,
	Lightbulb,
	X,
	Home,
	Brain,
	Eye,
	Heart,
} from "lucide-react";
import { openTaskModal } from "../../store/slices/tasksSlice";
import { toggleTask } from "../../store/slices/tasksSlice";
import { toggleSettings } from "../../store/slices/timerSlice";

const TimerCard = () => {
	const dispatch = useDispatch();
	const [showHelp, setShowHelp] = useState(false);

	// Get timer data from Redux store
	const { timeLeft, mode, settings, currentSession, isRunning } = useSelector(
		(state) => state.timer
	);

	// Get pinned task from Redux store
	const pinnedTask = useSelector((state) =>
		state.tasks.tasks.find((task) => task.isPinned && !task.completed)
	);

	// Lock body scroll when modal is open
	useEffect(() => {
		if (showHelp) {
			const originalStyle = window.getComputedStyle(document.body).overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
	}, [showHelp]);

	// Format time function
	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`;
	};

	const handleTasksClick = () => {
		dispatch(openTaskModal());
	};

	const handleSettingsClick = () => {
		dispatch(toggleSettings());
	};

	const handleCompleteTask = (e) => {
		e.stopPropagation();
		if (pinnedTask) {
			dispatch(toggleTask(pinnedTask.id));
		}
	};

	const handleHelpClick = () => {
		setShowHelp(true);
	};

	const handleCloseHelp = () => {
		setShowHelp(false);
	};

	// Get mode info with break mode colors
	const getModeInfo = () => {
		switch (mode) {
			case "work":
				return {
					icon: <Zap size={18} className="text-primary" />,
					color: "text-primary",
					bgColor: "bg-primary/10",
					borderColor: "border-primary/20",
					cardBg: "bg-surface/5",
					cardBorder: "border-primary/15",
					timerColor: "text-primary",
					dotColor: "primary", // 🔥 Added for session dots
				};
			case "shortBreak":
				return {
					icon: <Coffee size={18} className="text-accent" />,
					color: "text-accent",
					bgColor: "bg-accent/10",
					borderColor: "border-accent/20",
					cardBg: "bg-accent/1",
					cardBorder: "border-accent/15",
					timerColor: "text-accent",
					dotColor: "accent", // 🔥 Added for session dots
				};
			case "longBreak":
				return {
					icon: <Coffee size={18} className="text-secondary" />,
					color: "text-secondary",
					bgColor: "bg-secondary/10",
					borderColor: "border-secondary/20",
					cardBg: "bg-secondary/1",
					cardBorder: "border-secondary/15",
					timerColor: "text-secondary",
					dotColor: "secondary", // 🔥 Added for session dots
				};
			default:
				return {
					icon: <Zap size={18} className="text-primary" />,
					color: "text-primary",
					bgColor: "bg-primary/10",
					borderColor: "border-primary/20",
					cardBg: "bg-surface/25",
					cardBorder: "border-primary/20",
					timerColor: "text-primary",
					dotColor: "primary", // 🔥 Added for session dots
				};
		}
	};

	const modeInfo = getModeInfo();

	// Calculate progress for hidden timer mode
	const getProgress = () => {
		const totalDuration = (() => {
			switch (mode) {
				case "work":
					return settings.workDuration * 60;
				case "shortBreak":
					return settings.shortBreakDuration * 60;
				case "longBreak":
					return settings.longBreakDuration * 60;
				default:
					return settings.workDuration * 60;
			}
		})();
		return ((totalDuration - timeLeft) / totalDuration) * 100;
	};

	// 🔥 NEW - Get session dot styles based on current mode
	const getSessionDotStyle = (index) => {
		const isCompleted = index < currentSession.completedPomodoros;
		const isCurrent = index === currentSession.completedPomodoros && isRunning;
		const isWorkMode = mode === "work";

		if (isCompleted) {
			// Completed dots always use primary color
			return "bg-primary";
		}

		if (isCurrent) {
			// Current dot changes based on mode
			if (isWorkMode) {
				return "bg-primary/50 animate-pulse scale-110";
			} else {
				// Break mode - use mode-specific colors for the outline
				const colorMap = {
					shortBreak: "bg-background/30 border-2 border-accent animate-pulse",
					longBreak: "bg-background/30 border-2 border-secondary animate-pulse",
				};
				return (
					colorMap[mode] ||
					"bg-background/30 border-2 border-primary animate-pulse"
				);
			}
		}

		// Inactive dots - subtle border with mode-specific colors
		const inactiveColorMap = {
			work: "bg-background/30 border border-primary/20",
			shortBreak: "bg-background/30 border border-accent/20",
			longBreak: "bg-background/30 border border-secondary/20",
		};

		return (
			inactiveColorMap[mode] || "bg-background/30 border border-primary/20"
		);
	};

	// Check if current mode is work mode
	const isWorkMode = mode === "work";

	return (
		<>
			<div
				className={`${modeInfo.cardBg} backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-12 border ${modeInfo.cardBorder} transition-all duration-300`}
			>
				{/* Header Row */}
				<div className="flex items-center mb-8">
					{/* Left side - Help button (always visible) */}
					<div className="flex-1">
						<button
							onClick={handleHelpClick}
							className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-all text-secondary hover:text-primary"
							title={isWorkMode ? "Focus Tips" : "Break Tips"}
						>
							<Lightbulb size={14} className="lg:w-4 lg:h-4" />
						</button>
					</div>

					{/* Center - Mode Icon ONLY when timer is visible */}
					{!settings.hideTimer && (
						<div className="flex justify-center">
							<div className="p-3 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10">
								{modeInfo.icon}
							</div>
						</div>
					)}

					{/* Right side - Settings */}
					<div className="flex-1 flex justify-end">
						<button
							onClick={handleSettingsClick}
							className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-all text-secondary hover:text-primary"
							title="Timer Settings"
						>
							<Sliders size={14} className="lg:w-4 lg:h-4" />
						</button>
					</div>
				</div>

				{/* Centered Content */}
				<div className="text-center space-y-8">
					{settings.hideTimer ? (
						<div className="flex justify-center">
							<div className="relative w-32 h-32 sm:w-40 sm:h-40">
								{/* Progress Circle - using radius 46 */}
								<svg
									className="w-full h-full transform -rotate-90"
									viewBox="0 0 100 100"
								>
									{/* Background Circle */}
									<circle
										cx="50"
										cy="50"
										r="46"
										stroke="currentColor"
										strokeWidth="3"
										fill="none"
										className="text-surface opacity-80"
									/>
									{/* Progress Circle */}
									<circle
										cx="50"
										cy="50"
										r="46"
										stroke="currentColor"
										strokeWidth="3"
										fill="none"
										strokeLinecap="round"
										className={`${modeInfo.color} ${
											isRunning ? "drop-shadow-sm" : ""
										}`}
										style={{
											strokeDasharray: `${2 * Math.PI * 46}`,
											strokeDashoffset: `${
												2 * Math.PI * 46 * (1 - getProgress() / 100)
											}`,
											filter: isRunning
												? "drop-shadow(0 0 2px currentColor)"
												: "none",
										}}
									/>
								</svg>

								{/* Center Icon */}
								<div className="absolute inset-0 flex items-center justify-center">
									<div
										className={`p-8 rounded-full ${
											modeInfo.bgColor
										} backdrop-blur-sm border-2 ${modeInfo.borderColor} ${
											isRunning ? "shadow-lg scale-105" : "scale-100"
										} transition-all duration-300`}
									>
										<div className={`${isRunning ? "animate-pulse" : ""}`}>
											{React.cloneElement(modeInfo.icon, {
												size: 38,
												className: modeInfo.color,
											})}
										</div>
									</div>
								</div>
							</div>
						</div>
					) : (
						/* Normal Timer Display */
						<div
							className={`text-6xl sm:text-8xl font-mono font-bold ${
								modeInfo.timerColor
							} ${isRunning ? "drop-shadow-lg" : ""}`}
						>
							{formatTime(timeLeft)}
						</div>
					)}

					{/* 🔥 UPDATED - Session Dots with break mode colors */}
					<div className="flex justify-center gap-2">
						{[...Array(settings.sessionsUntilLongBreak)].map((_, i) => (
							<div
								key={i}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${getSessionDotStyle(
									i
								)}`}
							/>
						))}
					</div>

					{/* Task Display - ALWAYS SHOW IN WORK MODE - CONSISTENT HEIGHT */}
					{isWorkMode && (
						<div className="max-w-sm mx-auto h-16 flex items-center">
							{pinnedTask ? (
								<div
									className={`w-full bg-background/50 backdrop-blur-sm rounded-xl p-4 border border-primary/10 transition-colors ${
										isRunning ? "border-primary/20 shadow-md" : ""
									}`}
								>
									<div className="flex items-center gap-3">
										{/* Complete Task Button */}
										<button
											onClick={handleCompleteTask}
											className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 border-primary/50 hover:border-primary flex items-center justify-center transition-all hover:bg-primary/10 backdrop-blur-sm group flex-shrink-0"
											title="Mark as complete"
										>
											<Check
												size={12}
												className="lg:w-[14px] lg:h-[14px] text-primary opacity-0 group-hover:opacity-100 transition-opacity"
											/>
										</button>

										<div className="flex-1 min-w-0 text-left">
											<p className="text-sm font-semibold text-primary truncate">
												{pinnedTask.text}
											</p>
										</div>

										{/* Task Management Button */}
										<button
											onClick={handleTasksClick}
											className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-all text-secondary hover:text-primary flex-shrink-0"
											title="Manage tasks"
										>
											<MoreHorizontal size={14} className="lg:w-4 lg:h-4" />
										</button>
									</div>
								</div>
							) : (
								<button
									onClick={handleTasksClick}
									className="w-full h-full border-2 border-dashed border-primary/20 rounded-xl hover:border-primary/40 transition-all group bg-background/30 backdrop-blur-sm"
								>
									<div className="flex items-center justify-center gap-3 text-secondary group-hover:text-primary transition-colors">
										<Target
											size={16}
											className="lg:w-[18px] lg:h-[18px] group-hover:bg-accent/20 group-hover:text-accent transition-all rounded-xl p-1"
										/>
										<span className="text-sm font-medium">
											Add a task to focus on
										</span>
									</div>
								</button>
							)}
						</div>
					)}

					{/* Break Mode Message - CONSISTENT HEIGHT */}
					{!isWorkMode && (
						<div className="max-w-sm mx-auto h-16 flex items-center justify-center">
							<div className="text-center">
								<div
									className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${modeInfo.bgColor} ${modeInfo.borderColor} border`}
								>
									{modeInfo.icon}
									<span className={`text-sm font-medium ${modeInfo.color}`}>
										{mode === "shortBreak"
											? "Take a short break"
											: "Enjoy your long break"}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Help Modal - Fixed scroll locking */}
			{showHelp && (
				<div
					className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[9999] min-h-screen p-4"
					onClick={handleCloseHelp}
				>
					<div
						className="bg-background rounded-xl shadow-2xl w-full max-w-md border border-primary/20 relative z-10"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header - Dynamic title */}
						<div className="flex items-center justify-between p-6 border-b border-surface/50">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-primary/10 rounded-xl">
									<Lightbulb size={20} className="text-primary" />
								</div>
								<h2 className="text-xl font-bold text-primary">
									{isWorkMode ? "Focus Tips" : "Break Tips"}
								</h2>
							</div>
							<button
								onClick={handleCloseHelp}
								className="rounded-full p-2 hover:bg-surface/80 transition-colors"
							>
								<X
									size={20}
									className="text-secondary hover:text-primary transition-colors"
								/>
							</button>
						</div>

						{/* Content - Context-sensitive tips */}
						<div className="p-6 space-y-6">
							{isWorkMode ? (
								/* Enhanced Focus Session Tips */
								<>
									<div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
										<div className="flex items-start gap-4">
											<div className="flex-shrink-0 p-3 bg-primary rounded-xl shadow-sm">
												<Home size={20} className="text-white" />
											</div>
											<div className="flex-1">
												<h3 className="font-bold text-primary mb-3 text-lg">
													Prepare Your Space
												</h3>
												<div className="grid gap-2">
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Clear your desk of distractions
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Turn off notifications on devices
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Have water and necessary materials ready
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Choose a comfortable, well-lit area
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20">
										<div className="flex items-start gap-4">
											<div className="flex-shrink-0 p-3 bg-primary rounded-xl shadow-sm">
												<Brain size={20} className="text-white" />
											</div>
											<div className="flex-1">
												<h3 className="font-bold text-primary mb-3 text-lg">
													Stay Focused
												</h3>
												<div className="grid gap-2">
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Work on one task at a time
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															If you think of something else, jot it down
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Resist the urge to check social media
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Use deep breathing if you feel distracted
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</>
							) : (
								/* Enhanced Break Tips */
								<>
									<div className="relative bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-4 border border-accent/20">
										<div className="flex items-start gap-4">
											<div className="flex-shrink-0 p-3 bg-accent rounded-xl shadow-sm">
												<Heart size={20} className="text-white" />
											</div>
											<div className="flex-1">
												<h3 className="font-bold text-accent mb-3 text-lg">
													Physical Wellness
												</h3>
												<div className="grid gap-2">
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Stand up and stretch your body
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Walk around or do light exercise
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Drink water to stay hydrated
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Take deep breaths for relaxation
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>

									<div className="relative bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl p-4 border border-accent/20">
										<div className="flex items-start gap-4">
											<div className="flex-shrink-0 p-3 bg-accent rounded-xl shadow-sm">
												<Eye size={20} className="text-white" />
											</div>
											<div className="flex-1">
												<h3 className="font-bold text-accent mb-3 text-lg">
													Mental Rest
												</h3>
												<div className="grid gap-2">
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Look away from screens (20-20-20 rule)
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Step outside for fresh air if possible
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Listen to calming music
														</span>
													</div>
													<div className="flex items-start gap-3 text-sm">
														<div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
														<span className="text-secondary">
															Avoid mentally demanding activities
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default TimerCard;
