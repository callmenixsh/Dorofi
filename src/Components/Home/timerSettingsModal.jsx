// Components/Home/TimerSettingsModal.jsx - FIXED with Sessions until Long Break
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	X,
	Settings,
	RotateCcw,
	AlertTriangle,
	Lock,
	Info,
	Bookmark,
	Plus,
	Trash2,
	User,
	Timer,
	Sliders,
} from "lucide-react";
import { updateSettings, toggleSettings } from "../../store/slices/timerSlice";
import { useAuth } from "../../contexts/AuthContext";
import apiService from "../../services/api";

const TimerSettingsModal = () => {
	const dispatch = useDispatch();
	const { user, isAuthenticated } = useAuth();
	const { settings, showSettings, isRunning, mode, timeLeft } = useSelector(
		(state) => state.timer
	);

	// Tab state
	const [activeTab, setActiveTab] = useState("durations");

	// Local state for form
	const [formData, setFormData] = useState(settings);

	// Track hours and minutes for daily goal
	const [goalHours, setGoalHours] = useState(0);
	const [goalMinutes, setGoalMinutes] = useState(0);

	// Preset management state
	const [presets, setPresets] = useState([]);
	const [isCreatingPreset, setIsCreatingPreset] = useState(false);
	const [newPresetName, setNewPresetName] = useState("");

	// Check if timer is actively running (not paused)
	const isTimerActive = isRunning && timeLeft > 0;

	// Lock body scroll when modal is open
	useEffect(() => {
		if (showSettings) {
			const originalStyle = window.getComputedStyle(document.body).overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = originalStyle;
			};
		}
	}, [showSettings]);

	// Load presets from backend
	const loadPresetsFromBackend = async () => {
		if (!isAuthenticated || !user) return;

		try {
			const response = await apiService.getTimerPresets();
			if (response.success) {
				setPresets(response.presets || []);
			}
		} catch (error) {
			console.error("Failed to load presets:", error);
			setPresets([]);
		}
	};

	useEffect(() => {
		if (isAuthenticated && user) {
			loadPresetsFromBackend();
		}
	}, [isAuthenticated, user]);

	// Update local state when settings change
	useEffect(() => {
		setFormData(settings);
		const totalMinutes = settings.dailyGoal || 120;
		setGoalHours(Math.floor(totalMinutes / 60));
		setGoalMinutes(totalMinutes % 60);
	}, [settings]);

	// Update dailyGoal when hours or minutes change
	useEffect(() => {
		const totalMinutes = goalHours * 60 + goalMinutes;
		setFormData((prev) => ({
			...prev,
			dailyGoal: totalMinutes,
		}));
	}, [goalHours, goalMinutes]);

	if (!showSettings) return null;

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = () => {
		dispatch(updateSettings(formData));
		dispatch(toggleSettings());
	};

	const handleCancel = () => {
		setFormData(settings);
		setActiveTab("durations");
		dispatch(toggleSettings());
	};

	const resetToDefaults = () => {
		const defaults = {
			workDuration: 25,
			shortBreakDuration: 5,
			longBreakDuration: 15,
			sessionsUntilLongBreak: 4, // 🔥 ADDED BACK
			autoStartBreaks: false,
			autoStartWork: false,
			notifications: true,
			soundEnabled: true,
			hideTimer: false,
			dailyGoalEnabled: false,
			dailyGoal: 120,
		};
		setFormData(defaults);
		setGoalHours(2);
		setGoalMinutes(0);
	};

	// Helper to determine if a timer setting should be disabled
	const isTimerSettingDisabled = (settingType) => {
		if (!isTimerActive) return false;
		const timerDurationSettings = [
			"workDuration",
			"shortBreakDuration",
			"longBreakDuration",
			"sessionsUntilLongBreak", // 🔥 ADDED BACK
		];
		return timerDurationSettings.includes(settingType);
	};

	// 🔥 FIXED - Preset management with all 4 fields
	const createPreset = async () => {
		if (!newPresetName.trim() || presets.length >= 3) return;

		try {
			const presetData = {
				name: newPresetName.trim(),
				workDuration: formData.workDuration,
				shortBreakDuration: formData.shortBreakDuration,
				longBreakDuration: formData.longBreakDuration,
				sessionsUntilLongBreak: formData.sessionsUntilLongBreak, // 🔥 ADDED BACK
			};

			const response = await apiService.saveTimerPreset(presetData);
			if (response.success) {
				await loadPresetsFromBackend();
				setNewPresetName("");
				setIsCreatingPreset(false);
			}
		} catch (error) {
			console.error("Failed to create preset:", error);
			alert(error.message || "Failed to save preset");
		}
	};

	const deletePreset = async (presetId) => {
		try {
			const response = await apiService.deleteTimerPreset(presetId);
			if (response.success) {
				await loadPresetsFromBackend();
			}
		} catch (error) {
			console.error("Failed to delete preset:", error);
			alert(error.message || "Failed to delete preset");
		}
	};

	// 🔥 FIXED - Apply preset with all 4 fields
	const applyPreset = (preset) => {
		setFormData((prev) => ({
			...prev,
			workDuration: preset.workDuration,
			shortBreakDuration: preset.shortBreakDuration,
			longBreakDuration: preset.longBreakDuration,
			sessionsUntilLongBreak: preset.sessionsUntilLongBreak, // 🔥 ADDED BACK
		}));
	};

	// Get contextual tip for current values
	const getContextTip = () => {
		const ratio = formData.workDuration / formData.shortBreakDuration;

		if (isTimerActive) {
			return {
				icon: Lock,
				color: "text-accent",
				text: "Timer is running - duration settings are locked to prevent disruption.",
			};
		}

		if (formData.workDuration > 60) {
			return {
				icon: AlertTriangle,
				color: "text-accent",
				text: "Long focus sessions (60+ min) can reduce effectiveness. Consider 25-45 min sessions.",
			};
		}

		if (ratio > 8) {
			return {
				icon: AlertTriangle,
				color: "text-accent",
				text: `Work-to-break ratio is ${Math.round(ratio)}:1. Try ${Math.round(
					formData.workDuration / 5
				)} min breaks for better balance.`,
			};
		}

		if (ratio < 2) {
			return {
				icon: Info,
				color: "text-blue-500",
				text: "Long breaks relative to work time. Consider shorter breaks to maintain momentum.",
			};
		}

		if (formData.longBreakDuration < formData.workDuration / 2) {
			return {
				icon: Info,
				color: "text-blue-500",
				text: `Try ${Math.round(
					formData.workDuration * 0.6
				)} min long breaks to prevent mental fatigue.`,
			};
		}

		return {
			icon: Info,
			color: "text-primary",
			text: "Your timer settings look balanced for productive focus sessions.",
		};
	};

	const currentTip = getContextTip();

	return (
		<div
			className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
			onClick={handleCancel}
		>
			<div
				className="bg-background rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-primary/20"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-surface/50">
					<div className="flex items-center gap-2">
						<Settings size={18} className="text-primary" />
						<h2 className="text-lg font-semibold text-primary">
							Timer Settings
						</h2>
						{isTimerActive && (
							<div className="flex items-center gap-1 px-2 py-1 bg-accent/10 rounded-full">
								<Lock size={12} className="text-accent" />
								<span className="text-xs text-accent">Running</span>
							</div>
						)}
					</div>
					<button
						onClick={handleCancel}
						className="p-1 hover:bg-surface/50 rounded-lg transition-colors"
					>
						<X size={18} className="text-secondary" />
					</button>
				</div>

				{/* Tab Navigation */}
				<div className="flex border-b border-surface/30">
					<button
						onClick={() => setActiveTab("durations")}
						className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
							activeTab === "durations"
								? "text-primary border-b-2 border-primary bg-primary/5"
								: "text-secondary hover:text-primary hover:bg-surface/30"
						}`}
					>
						<div className="flex items-center justify-center gap-2">
							<Timer size={14} />
							Durations & Presets
						</div>
					</button>
					<button
						onClick={() => setActiveTab("behavior")}
						className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
							activeTab === "behavior"
								? "text-primary border-b-2 border-primary bg-primary/5"
								: "text-secondary hover:text-primary hover:bg-surface/30"
						}`}
					>
						<div className="flex items-center justify-center gap-2">
							<Sliders size={14} />
							Behavior & Goals
						</div>
					</button>
				</div>

				{/* Content */}
				<div className="max-h-[calc(90vh-200px)] overflow-y-auto">
					{activeTab === "durations" ? (
						// TAB 1 - Durations & Presets
						<div className="p-4 space-y-4">
							{/* Contextual tip */}
							<div className="flex items-start gap-3 p-3 bg-surface/20 rounded-lg border border-surface/30">
								<currentTip.icon
									size={16}
									className={`${currentTip.color} flex-shrink-0 mt-0.5`}
								/>
								<p className="text-sm text-primary leading-relaxed">
									{currentTip.text}
								</p>
							</div>

							{/* Timer Durations */}
							<div className="space-y-3">
								<h3 className="text-sm font-medium text-primary">
									Duration Settings
								</h3>

								<div className="flex items-center justify-between">
									<span
										className={`text-sm ${
											isTimerSettingDisabled("workDuration")
												? "text-secondary"
												: "text-primary"
										}`}
									>
										Focus Time
										{isTimerSettingDisabled("workDuration") && (
											<Lock size={12} className="inline ml-1 text-accent" />
										)}
									</span>
									<div className="flex items-center gap-1">
										<input
											type="number"
											min="1"
											max="120"
											value={formData.workDuration}
											onChange={(e) =>
												handleInputChange(
													"workDuration",
													parseInt(e.target.value) || 1
												)
											}
											disabled={isTimerSettingDisabled("workDuration")}
											className={`w-16 px-2 py-1 text-center border rounded-md focus:outline-none text-sm ${
												isTimerSettingDisabled("workDuration")
													? "bg-surface/25 border-surface/50 text-secondary cursor-not-allowed"
													: "bg-surface/50 border-surface focus:border-primary text-primary"
											}`}
										/>
										<span className="text-xs text-secondary w-6">min</span>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span
										className={`text-sm ${
											isTimerSettingDisabled("shortBreakDuration")
												? "text-secondary"
												: "text-primary"
										}`}
									>
										Short Break
										{isTimerSettingDisabled("shortBreakDuration") && (
											<Lock size={12} className="inline ml-1 text-accent" />
										)}
									</span>
									<div className="flex items-center gap-1">
										<input
											type="number"
											min="1"
											max="30"
											value={formData.shortBreakDuration}
											onChange={(e) =>
												handleInputChange(
													"shortBreakDuration",
													parseInt(e.target.value) || 1
												)
											}
											disabled={isTimerSettingDisabled("shortBreakDuration")}
											className={`w-16 px-2 py-1 text-center border rounded-md focus:outline-none text-sm ${
												isTimerSettingDisabled("shortBreakDuration")
													? "bg-surface/25 border-surface/50 text-secondary cursor-not-allowed"
													: "bg-surface/50 border-surface focus:border-primary text-primary"
											}`}
										/>
										<span className="text-xs text-secondary w-6">min</span>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<span
										className={`text-sm ${
											isTimerSettingDisabled("longBreakDuration")
												? "text-secondary"
												: "text-primary"
										}`}
									>
										Long Break
										{isTimerSettingDisabled("longBreakDuration") && (
											<Lock size={12} className="inline ml-1 text-accent" />
										)}
									</span>
									<div className="flex items-center gap-1">
										<input
											type="number"
											min="10"
											max="60"
											value={formData.longBreakDuration}
											onChange={(e) =>
												handleInputChange(
													"longBreakDuration",
													parseInt(e.target.value) || 10
												)
											}
											disabled={isTimerSettingDisabled("longBreakDuration")}
											className={`w-16 px-2 py-1 text-center border rounded-md focus:outline-none text-sm ${
												isTimerSettingDisabled("longBreakDuration")
													? "bg-surface/25 border-surface/50 text-secondary cursor-not-allowed"
													: "bg-surface/50 border-surface focus:border-primary text-primary"
											}`}
										/>
										<span className="text-xs text-secondary w-6">min</span>
									</div>
								</div>

								{/* 🔥 ADDED BACK - Sessions until Long Break */}
								<div className="flex items-center justify-between">
									<span
										className={`text-sm ${
											isTimerSettingDisabled("sessionsUntilLongBreak")
												? "text-secondary"
												: "text-primary"
										}`}
									>
										Sessions until Long Break
										{isTimerSettingDisabled("sessionsUntilLongBreak") && (
											<Lock size={12} className="inline ml-1 text-accent" />
										)}
									</span>
									<div className="flex items-center gap-1">
										<input
											type="number"
											min="2"
											max="8"
											value={formData.sessionsUntilLongBreak}
											onChange={(e) =>
												handleInputChange(
													"sessionsUntilLongBreak",
													parseInt(e.target.value) || 2
												)
											}
											disabled={isTimerSettingDisabled(
												"sessionsUntilLongBreak"
											)}
											className={`w-16 px-2 py-1 text-center border rounded-md focus:outline-none text-sm ${
												isTimerSettingDisabled("sessionsUntilLongBreak")
													? "bg-surface/25 border-surface/50 text-secondary cursor-not-allowed"
													: "bg-surface/50 border-surface focus:border-primary text-primary"
											}`}
										/>
										<span className="text-xs text-secondary w-12">cycles</span>
									</div>
								</div>
							</div>

							{/* Presets Section */}
							<div className="space-y-3 pt-3 border-t border-surface/30">
								<div className="flex items-center gap-2">
									<h3 className="text-sm font-medium text-primary">
										Timer Presets
									</h3>
									{!isAuthenticated && (
										<Lock size={12} className="text-accent" />
									)}
								</div>

								{!isAuthenticated ? (
									<div className="flex flex-col items-center justify-center py-6 text-center bg-surface/10 rounded-lg">
										<User size={32} className="text-secondary/30 mb-2" />
										<p className="text-xs text-secondary">
											Sign in to save custom presets
										</p>
									</div>
								) : (
									<>
										{/* Existing presets */}
										<div className="space-y-2">
											{presets.length === 0 ? (
												<div className="text-center py-4">
													<Bookmark
														size={24}
														className="text-secondary/30 mx-auto mb-1"
													/>
													<p className="text-xs text-secondary">
														No presets saved
													</p>
												</div>
											) : (
												// 🔥 FIXED - Allow deletion of all presets, including defaults
												presets.map((preset) => (
													<div
														key={preset._id}
														className="border border-surface/30 rounded-lg p-2 hover:bg-surface/10 transition-colors"
													>
														<div className="flex items-center justify-between">
															<div className="flex-1 min-w-0">
																<h4 className="font-medium text-primary text-xs truncate">
																	{preset.name}
																	{preset.isDefault && (
																		<span className="ml-1 text-xs text-secondary/60">
																			(Default)
																		</span>
																	)}
																</h4>
																{/* Show all 4 values in preset display */}
																<p className="text-xs text-secondary">
																	{preset.workDuration}m •{" "}
																	{preset.shortBreakDuration}m •{" "}
																	{preset.longBreakDuration}m •{" "}
																	{preset.sessionsUntilLongBreak} cycles
																</p>
															</div>
															<div className="flex items-center gap-1 ml-2">
																<button
																	onClick={() => applyPreset(preset)}
																	disabled={isTimerActive}
																	className={`px-2 py-1 text-xs rounded transition-colors ${
																		isTimerActive
																			? "bg-surface/25 text-secondary/50 cursor-not-allowed"
																			: "bg-primary/10 text-primary hover:bg-primary/20"
																	}`}
																>
																	Apply
																</button>
																{/* 🔥 CHANGED: Remove isDefault check - allow deletion of all presets */}
																<button
																	onClick={() => deletePreset(preset._id)}
																	className="p-1 text-secondary hover:text-accent hover:bg-accent/10 rounded transition-colors"
																	title={`Delete ${
																		preset.isDefault ? "default " : ""
																	}preset`}
																>
																	<Trash2 size={10} />
																</button>
															</div>
														</div>
													</div>
												))
											)}
										</div>

										{/* Create new preset */}
										{presets.length < 3 && (
											<div className="border border-surface/30 rounded-lg p-3">
												{!isCreatingPreset ? (
													<button
														onClick={() => setIsCreatingPreset(true)}
														disabled={isTimerActive}
														className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors ${
															isTimerActive
																? "text-secondary/50 cursor-not-allowed"
																: "text-secondary hover:text-primary hover:bg-surface/20"
														}`}
													>
														<Plus size={14} />
														<span className="text-xs">
															Save Current as Preset
														</span>
														{isTimerActive && (
															<Lock size={10} className="text-accent ml-auto" />
														)}
													</button>
												) : (
													<div className="space-y-2">
														<input
															type="text"
															value={newPresetName}
															onChange={(e) => setNewPresetName(e.target.value)}
															placeholder="e.g., Deep Work, Study Mode"
															maxLength={20}
															className="w-full px-2 py-1 text-xs bg-surface/50 border border-surface rounded focus:outline-none focus:border-primary text-primary"
															autoFocus
														/>
														{/* 🔥 FIXED - Show all 4 values in preview */}
														<div className="text-xs text-secondary">
															{formData.workDuration}m •{" "}
															{formData.shortBreakDuration}m •{" "}
															{formData.longBreakDuration}m •{" "}
															{formData.sessionsUntilLongBreak} cycles
														</div>
														<div className="flex gap-2">
															<button
																onClick={createPreset}
																disabled={!newPresetName.trim()}
																className="flex-1 px-2 py-1 bg-primary hover:bg-primary/90 text-background rounded text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
															>
																Save
															</button>
															<button
																onClick={() => {
																	setIsCreatingPreset(false);
																	setNewPresetName("");
																}}
																className="px-2 py-1 bg-surface/50 hover:bg-surface/80 text-secondary hover:text-primary rounded text-xs"
															>
																Cancel
															</button>
														</div>
													</div>
												)}
											</div>
										)}
									</>
								)}
							</div>

							{/* Reset */}
							<div className="pt-3 border-t border-surface/30">
								<button
									onClick={resetToDefaults}
									disabled={isTimerActive}
									className={`flex items-center gap-2 text-xs transition-colors ${
										isTimerActive
											? "text-secondary/50 cursor-not-allowed"
											: "text-secondary hover:text-primary"
									}`}
								>
									<RotateCcw size={12} />
									Reset to Defaults
									{isTimerActive && <Lock size={10} className="text-accent" />}
								</button>
							</div>
						</div>
					) : (
						// TAB 2 - Behavior & Goals (same as before)
						<div className="p-4 space-y-4">
							{/* Daily Goal */}
							<div className="space-y-3">
								<h3 className="text-sm font-medium text-primary">Daily Goal</h3>

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="text-sm text-primary">
											Enable Daily Goal
										</span>
										<button
											onClick={() =>
												handleInputChange(
													"dailyGoalEnabled",
													!formData.dailyGoalEnabled
												)
											}
											className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
												formData.dailyGoalEnabled ? "bg-primary" : "bg-surface"
											}`}
										>
											<span
												className={`inline-block h-2.5 w-2.5 transform rounded-full transition-transform ${
													formData.dailyGoalEnabled
														? "translate-x-4 bg-background"
														: "translate-x-1 bg-primary"
												}`}
											/>
										</button>
									</div>

									{formData.dailyGoalEnabled && (
										<div className="flex items-center gap-1">
											<input
												type="number"
												min="0"
												max="12"
												value={goalHours}
												onChange={(e) =>
													setGoalHours(parseInt(e.target.value) || 0)
												}
												className="w-12 px-1 py-1 text-center bg-surface/50 border border-surface rounded-md focus:outline-none focus:border-primary text-primary text-xs"
											/>
											<span className="text-xs text-secondary">h</span>
											<input
												type="number"
												min="0"
												max="59"
												step="15"
												value={goalMinutes}
												onChange={(e) =>
													setGoalMinutes(parseInt(e.target.value) || 0)
												}
												className="w-12 px-1 py-1 text-center bg-surface/50 border border-surface rounded-md focus:outline-none focus:border-primary text-primary text-xs"
											/>
											<span className="text-xs text-secondary">m</span>
										</div>
									)}
								</div>
							</div>

							{/* Behavior Settings */}
							<div className="space-y-3">
								<h3 className="text-sm font-medium text-primary">Behavior</h3>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm text-primary">
											Hide Timer Display
										</span>
										<button
											onClick={() =>
												handleInputChange("hideTimer", !formData.hideTimer)
											}
											className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
												formData.hideTimer ? "bg-primary" : "bg-surface"
											}`}
										>
											<span
												className={`inline-block h-3 w-3 transform rounded-full transition-transform ${
													formData.hideTimer
														? "translate-x-5 bg-background"
														: "translate-x-1 bg-primary"
												}`}
											/>
										</button>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-primary">
											Auto-start Breaks
										</span>
										<button
											onClick={() =>
												handleInputChange(
													"autoStartBreaks",
													!formData.autoStartBreaks
												)
											}
											className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
												formData.autoStartBreaks ? "bg-primary" : "bg-surface"
											}`}
										>
											<span
												className={`inline-block h-3 w-3 transform rounded-full transition-transform ${
													formData.autoStartBreaks
														? "translate-x-5 bg-background"
														: "translate-x-1 bg-primary"
												}`}
											/>
										</button>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-primary">
											Auto-start Work
										</span>
										<button
											onClick={() =>
												handleInputChange(
													"autoStartWork",
													!formData.autoStartWork
												)
											}
											className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
												formData.autoStartWork ? "bg-primary" : "bg-surface"
											}`}
										>
											<span
												className={`inline-block h-3 w-3 transform rounded-full transition-transform ${
													formData.autoStartWork
														? "translate-x-5 bg-background"
														: "translate-x-1 bg-primary"
												}`}
											/>
										</button>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-primary">Notifications</span>
										<button
											onClick={() =>
												handleInputChange(
													"notifications",
													!formData.notifications
												)
											}
											className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
												formData.notifications ? "bg-primary" : "bg-surface"
											}`}
										>
											<span
												className={`inline-block h-3 w-3 transform rounded-full transition-transform ${
													formData.notifications
														? "translate-x-5 bg-background"
														: "translate-x-1 bg-primary"
												}`}
											/>
										</button>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-primary">Sound Effects</span>
										<button
											onClick={() =>
												handleInputChange(
													"soundEnabled",
													!formData.soundEnabled
												)
											}
											className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
												formData.soundEnabled ? "bg-primary" : "bg-surface"
											}`}
										>
											<span
												className={`inline-block h-3 w-3 transform rounded-full transition-transform ${
													formData.soundEnabled
														? "translate-x-5 bg-background"
														: "translate-x-1 bg-primary"
												}`}
											/>
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="flex gap-2 p-4 border-t border-surface/50">
					<button
						onClick={handleCancel}
						className="flex-1 px-3 py-2 bg-surface/50 hover:bg-surface/80 text-secondary hover:text-primary rounded-lg transition-colors text-sm"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="flex-1 px-3 py-2 bg-primary hover:bg-primary/90 text-background rounded-lg transition-colors text-sm font-medium"
					>
						Save Settings
					</button>
				</div>
			</div>
		</div>
	);
};

export default TimerSettingsModal;
