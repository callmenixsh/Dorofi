// Components/Home/musicPlayer.jsx - Clean & Ergonomic Version
import React, { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	Volume2,
	VolumeX,
	Play,
	Pause,
	SkipBack,
	SkipForward,
	Music,
	ChevronDown,
	Waves,
	CloudRain,
	Wind,
	X,
	Maximize2,
	Bird,
	Minimize2,
	ChevronUp,
} from "lucide-react";
import {
	toggleMusic,
	setMusicEnabled,
	setCurrentTrack,
	setVolume,
	skipToNext,
	skipToPrevious,
	toggleWhiteNoise,
	setWhiteNoiseVolume,
	expandPlayer,
	minimizePlayer,
	restorePlayer,
	closeModal,
} from "../../store/slices/musicSlice";

const MusicPlayer = () => {
	const dispatch = useDispatch();
	const musicRef = useRef(null);
	const whiteNoiseRefs = useRef({});
	const [isMuted, setIsMuted] = useState(false);
	const [volumeBeforeMute, setVolumeBeforeMute] = useState(35);

	// Get state from Redux
	const {
		currentTrack,
		volume,
		musicEnabled,
		whiteNoiseStates,
		isExpanded,
		isMinimized,
		musicTracks,
		whiteNoiseTracks,
	} = useSelector((state) => state.music);

	// Icon mapping
	const getWhiteNoiseIcon = (trackName) => {
		const icons = { Rain: CloudRain, Underwater: Wind, Waves, Chirp: Bird };
		return icons[trackName] || Waves;
	};

	// Effects
	useEffect(() => {
		if (musicRef.current) musicRef.current.volume = volume / 100;
	}, [volume]);

	useEffect(() => {
		Object.entries(whiteNoiseStates).forEach(([name, state]) => {
			const audio = whiteNoiseRefs.current[name];
			if (audio && state) {
				audio.volume = state.volume / 100;
				state.enabled ? audio.play().catch(() => {}) : audio.pause();
			}
		});
	}, [whiteNoiseStates]);

	// Handlers
	const handlePlayPause = () => {
		if (!musicRef.current) return;
		musicEnabled
			? musicRef.current.pause()
			: musicRef.current.play().catch(() => {});
		dispatch(toggleMusic());
	};

	const handleTrackChange = (newTrack) => {
		dispatch(setCurrentTrack(newTrack));
		if (musicEnabled) {
			setTimeout(() => musicRef.current?.play().catch(() => {}), 100);
		}
	};

	const handleSkip = (direction) => {
		dispatch(direction === "next" ? skipToNext() : skipToPrevious());
		setTimeout(() => musicRef.current?.play().catch(() => {}), 100);
	};

	const handleMute = () => {
		if (isMuted) {
			dispatch(setVolume(volumeBeforeMute));
			setIsMuted(false);
		} else {
			setVolumeBeforeMute(volume);
			dispatch(setVolume(0));
			setIsMuted(true);
		}
	};

	const currentMusicTrack = musicTracks.find(
		(track) => track.name === currentTrack
	);

	return (
		<>
			{/* Audio Elements */}
			<div style={{ display: "none" }}>
				<audio
					ref={musicRef}
					src={currentMusicTrack?.file}
					onEnded={() => handleSkip("next")}
					onPlay={() => dispatch(setMusicEnabled(true))}
					onPause={() => dispatch(setMusicEnabled(false))}
				/>
				{whiteNoiseTracks.map((track) => (
					<audio
						key={track.name}
						ref={(el) => (whiteNoiseRefs.current[track.name] = el)}
						src={track.file}
						loop
					/>
				))}
			</div>

			{/* Toast Player - Bottom Left */}
			{isMinimized && (
				<div className="fixed bottom-6 left-6 z-40">
					<div className="bg-surface/95 backdrop-blur-sm rounded-2xl border border-surface/50 p-6">
						<div className="flex items-center gap-4 mb-6">
							<button
								onClick={handlePlayPause}
								className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
									musicEnabled
										? "bg-primary text-background"
										: "bg-primary/20 text-primary hover:bg-primary/30"
								}`}
							>
								{musicEnabled ? (
									<Pause size={18} />
								) : (
									<Play size={18} className="ml-0.5" />
								)}
							</button>

							<div className="flex-1">
								<div className="font-semibold text-primary text-base truncate max-w-40">
									{currentTrack}
								</div>
							</div>

							<button
								onClick={() => handleSkip("next")}
								className="w-10 h-10 rounded-xl hover:bg-surface/50 flex items-center justify-center transition-colors"
							>
								<SkipForward size={16} className="text-secondary" />
							</button>

							<button
								onClick={() => dispatch(restorePlayer())}
								className="w-10 h-10 rounded-xl hover:bg-surface/50 flex items-center justify-center transition-colors"
							>
								<ChevronUp size={16} className="text-secondary" />
							</button>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								{whiteNoiseTracks.map((track) => {
									const IconComponent = getWhiteNoiseIcon(track.name);
									const state = whiteNoiseStates[track.name] || {
										enabled: false,
										volume: 30,
									};

									return (
										<button
											key={track.name}
											onClick={() =>
												dispatch(toggleWhiteNoise({ name: track.name }))
											}
											className={`w-12 h-12 rounded-xl transition-all flex items-center justify-center ${
												state.enabled
													? "bg-accent text-background"
													: "bg-surface/50 text-secondary hover:bg-accent/20 hover:text-accent"
											}`}
										>
											<IconComponent size={16} />
										</button>
									);
								})}
							</div>

							<button
								onClick={() => dispatch(expandPlayer())}
								className="w-12 h-12 rounded-xl hover:bg-surface/50 flex items-center justify-center transition-colors"
							>
								<Maximize2 size={16} className="text-secondary" />
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Expanded Modal */}
			{isExpanded && (
				<div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
					<div className="w-full max-w-4xl max-h-[85vh] bg-surface/95 rounded-3xl border border-surface overflow-hidden">
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-surface/50">
							<h2 className="text-2xl font-bold text-primary">Audio Control</h2>
							<div className="flex items-center gap-2">
								<button
									onClick={() => dispatch(minimizePlayer())}
									className="w-10 h-10 rounded-full hover:bg-surface/50 flex items-center justify-center transition-colors"
								>
									<Minimize2 size={18} className="text-secondary" />
								</button>
								<button
									onClick={() => dispatch(closeModal())}
									className="w-10 h-10 rounded-full hover:bg-surface/50 flex items-center justify-center transition-colors"
								>
									<X size={18} className="text-secondary" />
								</button>
							</div>
						</div>

						<div className="p-6">
							{/* Music Section */}
							<div className="mb-8">
								<h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
									<Music size={20} />
									Music
								</h3>

								<div className="bg-background/50 rounded-2xl p-6">
									{/* Track & Controls */}
									<div className="flex items-center justify-between mb-4">
										<select
											value={currentTrack}
											onChange={(e) => handleTrackChange(e.target.value)}
											className="bg-surface border border-primary/30 text-primary px-4 py-3 rounded-xl font-medium appearance-none cursor-pointer pr-10 min-w-48 hover:border-primary/60 focus:border-primary focus:outline-none transition-colors"
										>
											{musicTracks.map((track) => (
												<option
													key={track.name}
													value={track.name}
													className="bg-surface text-primary"
												>
													{track.name}
												</option>
											))}
										</select>

										<div className="flex items-center gap-4">
											<button
												onClick={() => handleSkip("prev")}
												className="w-12 h-12 rounded-full border-2 border-surface hover:border-primary/50 flex items-center justify-center transition-colors"
											>
												<SkipBack size={20} className="text-secondary" />
											</button>

											<button
												onClick={handlePlayPause}
												className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
													musicEnabled
														? "bg-accent hover:bg-accent/80 text-background"
														: "bg-primary hover:bg-primary/90 text-background"
												}`}
											>
												{musicEnabled ? (
													<Pause size={24} />
												) : (
													<Play size={24} className="ml-1" />
												)}
											</button>

											<button
												onClick={() => handleSkip("next")}
												className="w-12 h-12 rounded-full border-2 border-surface hover:border-primary/50 flex items-center justify-center transition-colors"
											>
												<SkipForward size={20} className="text-secondary" />
											</button>
										</div>
									</div>

									{/* Volume Control */}
									<div className="flex items-center gap-4">
										<button
											onClick={handleMute}
											className="w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
										>
											{isMuted || volume === 0 ? (
												<VolumeX size={18} className="text-primary" />
											) : (
												<Volume2 size={18} className="text-primary" />
											)}
										</button>
										<input
											type="range"
											min="0"
											max="100"
											value={volume}
											onChange={(e) => {
												const newVol = parseInt(e.target.value);
												dispatch(setVolume(newVol));
												if (newVol > 0 && isMuted) setIsMuted(false);
											}}
											className="flex-1 modal-volume-slider"
											style={{
												background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume}%, var(--color-surface) ${volume}%, var(--color-surface) 100%)`,
											}}
										/>
										<span className="text-secondary w-10 text-center text-sm">
											{volume}
										</span>
									</div>
								</div>
							</div>

							{/* White Noise Section */}
							<div>
								<h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
									<Waves size={20} />
									Ambient
								</h3>

								<div className="grid grid-cols-2 gap-4">
									{whiteNoiseTracks.map((track) => {
										const IconComponent = getWhiteNoiseIcon(track.name);
										const state = whiteNoiseStates[track.name] || {
											enabled: false,
											volume: 30,
										};

										return (
											<div
												key={track.name}
												className="bg-background/50 rounded-2xl p-4"
											>
												<div className="flex items-center justify-between mb-3">
													<div className="flex items-center gap-3">
														<div
															className={`w-10 h-10 rounded-full flex items-center justify-center ${
																state.enabled
																	? "bg-accent text-background"
																	: "bg-surface text-secondary"
															}`}
														>
															<IconComponent size={18} />
														</div>
														<span className="font-medium text-primary">
															{track.name}
														</span>
													</div>

													<button
														onClick={() =>
															dispatch(toggleWhiteNoise({ name: track.name }))
														}
														className={`w-12 h-6 rounded-full transition-colors ${
															state.enabled ? "bg-accent" : "bg-surface"
														} relative`}
													>
														<div
															className={`w-5 h-5 bg-background rounded-full transition-transform absolute top-0.5 ${
																state.enabled
																	? "translate-x-6"
																	: "translate-x-0.5"
															}`}
														/>
													</button>
												</div>

												<div className="flex items-center gap-3">
													<button
														onClick={() => {
															const newVol = state.volume === 0 ? 30 : 0;
															dispatch(
																setWhiteNoiseVolume({
																	name: track.name,
																	volume: newVol,
																})
															);
														}}
														disabled={!state.enabled}
														className="w-6 h-6 rounded-full bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors disabled:opacity-30"
													>
														{state.volume === 0 ? (
															<VolumeX size={12} className="text-accent" />
														) : (
															<Volume2 size={12} className="text-accent" />
														)}
													</button>
													<input
														type="range"
														min="0"
														max="100"
														value={state.volume}
														onChange={(e) =>
															dispatch(
																setWhiteNoiseVolume({
																	name: track.name,
																	volume: parseInt(e.target.value),
																})
															)
														}
														disabled={!state.enabled}
														className="flex-1 white-noise-slider"
														style={{
															background: state.enabled
																? `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${state.volume}%, var(--color-surface) ${state.volume}%, var(--color-surface) 100%)`
																: `var(--color-surface)`,
														}}
													/>
													<span className="text-xs text-secondary w-6 text-center">
														{state.volume}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Compact Player */}
			{!isMinimized && !isExpanded && (
				<div className="bg-surface/90 backdrop-blur-sm rounded-3xl border border-surface/50">
					<div className="flex items-center gap-4 px-6 py-4">
						<button
							onClick={handlePlayPause}
							className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
								musicEnabled
									? "bg-primary text-background"
									: "bg-primary/10 text-primary hover:bg-primary/20"
							}`}
						>
							{musicEnabled ? (
								<Pause size={20} />
							) : (
								<Play size={20} className="ml-0.5" />
							)}
						</button>

						<div className="relative">
							<select
								value={currentTrack}
								onChange={(e) => handleTrackChange(e.target.value)}
								className="bg-surface/80 border border-primary/30 text-primary px-4 h-12 rounded-2xl text-sm font-medium appearance-none cursor-pointer pr-10 min-w-40 hover:border-primary/60 focus:border-primary focus:outline-none transition-colors"
							>
								{musicTracks.map((track) => (
									<option
										key={track.name}
										value={track.name}
										className="bg-surface text-primary"
									>
										{track.name}
									</option>
								))}
							</select>
							<ChevronDown
								size={16}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary pointer-events-none"
							/>
						</div>

						<button
							onClick={() => handleSkip("next")}
							className="w-12 h-12 rounded-2xl border-2 border-surface hover:border-primary/50 flex items-center justify-center transition-colors bg-primary"
						>
							<SkipForward size={18} className="text-background" />
						</button>

						{/* Volume Control Box */}
						<div className="flex items-center gap-2 bg-surface/50 rounded-2xl px-3 py-2 min-w-32">
							<button
								onClick={handleMute}
								className="w-6 h-6 rounded-full hover:bg-surface/50 flex items-center justify-center transition-colors"
							>
								{isMuted || volume === 0 ? (
									<VolumeX size={14} className="text-primary" />
								) : (
									<Volume2 size={14} className="text-primary" />
								)}
							</button>
							<input
								type="range"
								min="0"
								max="100"
								value={volume}
								onChange={(e) => {
									const newVol = parseInt(e.target.value);
									dispatch(setVolume(newVol));
									if (newVol > 0 && isMuted) setIsMuted(false);
								}}
								className="flex-1 volume-slider"
								style={{
									background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volume}%, var(--color-surface) ${volume}%, var(--color-surface) 100%)`,
								}}
							/>
						</div>

						<div className="flex-1"></div>

						<div className="flex items-center gap-2">
							{whiteNoiseTracks.map((track) => {
								const IconComponent = getWhiteNoiseIcon(track.name);
								const state = whiteNoiseStates[track.name] || {
									enabled: false,
									volume: 30,
								};

								return (
									<button
										key={track.name}
										onClick={() =>
											dispatch(toggleWhiteNoise({ name: track.name }))
										}
										className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
											state.enabled
												? "bg-accent text-background"
												: "bg-surface/50 text-secondary hover:bg-accent/20 hover:text-accent"
										}`}
									>
										<IconComponent size={16} />
									</button>
								);
							})}

							<button
								onClick={() => dispatch(minimizePlayer())}
								className="w-10 h-10 rounded-xl bg-surface/50 hover:bg-secondary/20 flex items-center justify-center transition-colors ml-2"
							>
								<Minimize2 size={16} className="text-secondary" />
							</button>

							<button
								onClick={() => dispatch(expandPlayer())}
								className="w-10 h-10 rounded-xl bg-surface/50 hover:bg-primary/20 flex items-center justify-center transition-colors"
							>
								<Maximize2 size={16} className="text-secondary" />
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default MusicPlayer;
