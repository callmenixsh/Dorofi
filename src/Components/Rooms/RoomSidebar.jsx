import React from "react";
import { Users, MessageSquare, X, Send } from "lucide-react";

const RoomSidebar = ({
	isOpen,
	activeTab,
	onTabChange,
	onClose,
	onSendReaction,
	cooldownRemaining,
	participants,
	recentReactions,
	messages,
	onSendMessage,
	chatMessage,
	setChatMessage,
	chatEndRef,
	reactions,
	user,
}) => {
	return (
		<>
			{/* Backdrop overlay - mobile only */}
			<div
				className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[199] transition-opacity duration-300 lg:hidden ${
					isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => onClose(false)}
			/>

		{/* Sidebar panel */}
		<div
			className={`fixed z-[200] flex flex-col overflow-hidden transition-all duration-300 ease-in-out
          /* Mobile: true fullscreen */
          inset-0 w-full rounded-none
          /* Desktop: floating panel */
          lg:inset-auto lg:top-4 lg:left-4   lg:h-184 lg:mt-3  lg:bottom-4 lg:w-90 lg:rounded-2xl lg:shadow-2xl lg:shadow-primary/10 lg:border lg:border-primary/10
          ${
						isOpen
							? "translate-x-0 opacity-100"
							: "translate-x-full lg:-translate-x-full opacity-0 lg:opacity-0 pointer-events-none"
					}
          bg-surface
        `}
		>
				<div className="flex flex-col h-full min-h-0 overflow-hidden">
					{/* Header - mobile close button */}
					<div className="flex items-center justify-between p-4 border-b border-primary/5 lg:hidden">
						<h2 className="font-bold text-primary text-sm">Study Room</h2>
						<button
							onClick={() => onClose(false)}
							className="p-2 hover:bg-primary/10 rounded-xl text-secondary transition-colors"
						>
							<X size={20} />
						</button>
					</div>

					{/* Tab bar */}
					<div className="flex border-b border-primary/5">
						<button
							onClick={() => onTabChange("participants")}
							className={`flex-1 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
								activeTab === "participants"
									? "text-primary border-b-2 border-primary"
									: "text-secondary hover:text-primary"
							}`}
						>
							<div className="flex items-center justify-center gap-2">
								<Users size={14} />
								People
							</div>
						</button>
						<button
							onClick={() => onTabChange("chat")}
							className={`flex-1 py-3.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
								activeTab === "chat"
									? "text-primary border-b-2 border-primary"
									: "text-secondary hover:text-primary"
							}`}
						>
							<div className="flex items-center justify-center gap-2">
								<MessageSquare size={14} />
								Chat
							</div>
						</button>
					</div>

					{/* Content area */}
					<div className="flex-grow min-h-0 overflow-hidden flex flex-col">
						{activeTab === "participants" ? (
							<div className="p-4 flex-grow min-h-0 flex flex-col overflow-hidden">
								<div className="flex items-center justify-between mb-4">
									<h2 className="text-[10px] font-bold text-secondary uppercase tracking-widest">
										Participants
									</h2>
									<div className="bg-primary text-background px-2 py-0.5 rounded-full text-[9px] font-bold">
										{participants.length}/10
									</div>
								</div>
								<div className="space-y-2 overflow-y-auto flex-grow custom-scrollbar">
									{participants.map((p) => (
										<div
											key={p.id}
											className="bg-background/60 border border-primary/5 rounded-xl p-3 transition-colors hover:bg-background"
										>
											<div className="flex items-center gap-3">
												<div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
													{p.avatar}
												</div>
												<div className="flex-grow min-w-0">
													<h4 className="font-bold text-primary truncate text-xs">
														{p.name}
													</h4>
													<p className="text-[9px] font-bold text-secondary uppercase">
														{p.mode === "work" ? "Working" : "On Break"}
													</p>
												</div>
												<div className="flex gap-1">
													{reactions.slice(0, 2).map((r) => (
														<button
															key={r.type}
															onClick={() => onSendReaction(r.type, p.name)}
															disabled={cooldownRemaining > 0}
															className={`p-1.5 rounded-lg transition-colors ${cooldownRemaining > 0 ? "opacity-30" : "hover:bg-primary/10"}`}
														>
															<span className="text-xs">{r.icon}</span>
														</button>
													))}
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
					) : (
						<div className="flex-grow min-h-0 flex flex-col overflow-hidden">
							<form
								onSubmit={onSendMessage}
								className="p-3 border-b border-primary/5"
							>
								<div className="flex items-center gap-2">
									<input
										type="text"
										placeholder="Type a message..."
										value={chatMessage}
										onChange={(e) => setChatMessage(e.target.value)}
										className="flex-grow bg-background/60 border border-primary/10 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary/30 transition-colors"
									/>
									<button
										type="submit"
										disabled={!chatMessage.trim()}
										className="p-2.5 bg-primary text-background rounded-2xl disabled:opacity-30 transition-all hover:bg-accent"
									>
										<Send size={14} />
									</button>
								</div>
							</form>

							<div className="px-4 py-2 border-b border-primary/5 flex items-center justify-between gap-2">
								<div className="flex items-center gap-1">
									{reactions.map((react) => (
										<button
											key={react.type}
											onClick={() => onSendReaction(react.type)}
											disabled={cooldownRemaining > 0}
											className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm transition-colors ${
												cooldownRemaining > 0
													? "opacity-30"
													: "hover:bg-primary/10"
											}`}
										>
											{react.icon}
										</button>
									))}
								</div>
							</div>

						<div className="flex-grow min-h-0 overflow-y-auto p-4 custom-scrollbar space-y-3">
								{[
									...messages.map((m) => ({ ...m, feedType: "message" })),
									...recentReactions.map((r) => ({
										...r,
										feedType: "reaction",
									})),
								]
									.sort(
										(a, b) => new Date(b.timestamp) - new Date(a.timestamp),
									)
									.map((item) => {
										if (item.feedType === "reaction") {
											return (
												<div key={item.id} className="flex justify-center">
													<div className="px-3 py-1 bg-primary/5 rounded-full text-[10px] font-bold text-secondary">
														{item.from} sent{" "}
														{item.type === "fire"
															? "🔥"
															: item.type === "heart"
																? "❤️"
																: item.type === "coffee"
																	? "☕"
																	: "⚡"}{" "}
														to {item.target}
													</div>
												</div>
											);
										}
										const isMe = item.from === (user?.displayName || "You");
										return (
											<div
												key={item.id}
												className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
											>
												<span className="text-[9px] font-bold text-secondary uppercase mb-1">
													{item.from}
												</span>
												<div
													className={`px-3 py-2 rounded-2xl text-xs max-w-[90%] ${
														isMe
															? "bg-primary text-background rounded-br-sm"
															: "bg-background/60 border border-primary/5 rounded-bl-sm"
													}`}
												>
													{item.text}
												</div>
											</div>
										);
									})}
								{messages.length === 0 && recentReactions.length === 0 && (
									<div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-6">
										<MessageSquare
											size={36}
											strokeWidth={1}
											className="mb-3"
										/>
										<p className="text-[10px] font-bold uppercase tracking-widest">
											No messages yet
										</p>
									</div>
								)}
							<div ref={chatEndRef} />
						</div>
						</div>
					)}
					</div>
				</div>
			</div>
		</>
	);
};

export default RoomSidebar;
