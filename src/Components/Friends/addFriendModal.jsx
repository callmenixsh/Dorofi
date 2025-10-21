import { useState } from "react";
import { X, Copy, Check, Send, AlertCircle, User } from "lucide-react";

export default function AddFriendModal({ user, onClose, onSendFriendRequest }) {
	const [friendCode, setFriendCode] = useState("");
	const [copiedCode, setCopiedCode] = useState(false);
	const [sending, setSending] = useState(false);
	const [message, setMessage] = useState("");
	const [messageType, setMessageType] = useState("");

	const myFriendCode = user?.username || "Set username in profile";

	const copyFriendCode = async () => {
		if (!user?.username) {
			setMessage("Please set a username in your profile first");
			setMessageType("error");
			return;
		}

		try {
			await navigator.clipboard.writeText(user.username);
			setCopiedCode(true);
			setTimeout(() => setCopiedCode(false), 2000);
		} catch (err) {
			console.error("Failed to copy:", err);
			setMessage("Failed to copy code to clipboard");
			setMessageType("error");
		}
	};

	const handleSendRequest = async (e) => {
		e.preventDefault();

		if (!friendCode.trim()) {
			setMessage("Please enter a friend code");
			setMessageType("error");
			return;
		}

		if (friendCode.toLowerCase() === user?.username?.toLowerCase()) {
			setMessage("You can't add yourself as a friend!");
			setMessageType("error");
			return;
		}

		setSending(true);
		setMessage("");

		try {
			const result = await onSendFriendRequest(friendCode.trim());

			if (result.success) {
				setMessage(result.message || "Friend request sent successfully!");
				setMessageType("success");
				setFriendCode("");

				setTimeout(() => {
					onClose();
				}, 1500);
			} else {
				setMessage(result.error || "Failed to send friend request");
				setMessageType("error");
			}
		} catch (error) {
			console.error("Send friend request error:", error);
			setMessage("Failed to send friend request. Please try again.");
			setMessageType("error");
		} finally {
			setSending(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4 ">
			<div className="bg-surface rounded-lg shadow-xl w-full max-w-md border border-primary/20">
				<div className="flex justify-between items-center p-6 border-b border-background">
					<h3 className="text-xl font-semibold text-primary flex items-center gap-2">
						<User size={20} />
						Add Friend
					</h3>
					<button
						onClick={onClose}
						className="text-secondary hover:text-primary transition-colors p-1"
						disabled={sending}
					>
						<X size={20} />
					</button>
				</div>

				<div className="p-6 space-y-6">
					{/* Share Your username Section */}
					<div>
						<h4 className="text-sm font-medium text-primary mb-3">
							Your Username
						</h4>
						<div className="flex items-center gap-2">
							<div className="flex-1 p-3 bg-background rounded-lg border border-background">
								<code className="text-primary font-mono text-sm">
									{myFriendCode}
								</code>
							</div>
							<button
								onClick={copyFriendCode}
								className={`p-3 rounded-lg border transition-colors ${
									user?.username
										? "bg-primary text-background hover:bg-accent border-primary"
										: "bg-background text-secondary border-background cursor-not-allowed"
								}`}
								title={
									user?.username
										? "Copy your friend code"
										: "Set username first"
								}
								disabled={!user?.username}
							>
								{copiedCode ? <Check size={16} /> : <Copy size={16} />}
							</button>
						</div>
						<p className="text-xs text-secondary mt-2">
							Share this with friends so they can add you
						</p>
					</div>

					{/* Send Friend Request Section */}
					<div>
						<h4 className="text-sm font-medium text-primary mb-3">
							Add a Friend
						</h4>
						<form onSubmit={handleSendRequest} className="space-y-3">
							<div className="flex gap-2">
								<input
									type="text"
									placeholder="Enter friend's username"
									value={friendCode}
									onChange={(e) => {
										setFriendCode(e.target.value);
										setMessage("");
									}}
									className="flex-1 p-3 bg-background border border-background rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
									disabled={sending}
									maxLength={20}
								/>
								<button
									type="submit"
									className="px-4 py-3 bg-primary text-background rounded-lg hover:bg-accent transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={!friendCode.trim() || sending}
								>
									{sending ? (
										<div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
									) : (
										<Send size={16} />
									)}
									{!sending && <span className="hidden sm:inline">Send</span>}
								</button>
							</div>
							<p className="text-xs text-secondary">
								Enter your friend's username to send them a friend request
							</p>
							{/* Message Display */}
							{message && (
								<div
									className={`p-3 rounded-lg flex items-center gap-2 border ${
										messageType === "success"
											? "bg-accent/10 border-accent/20"
											: "bg-red-500/10 border-red-500/20"
									}`}
								>
									<AlertCircle
										size={16}
										className={
											messageType === "success" ? "text-accent" : "text-red-500"
										}
									/>
									<p
										className={`text-sm ${
											messageType === "success" ? "text-accent" : "text-red-500"
										}`}
									>
										{message}
									</p>
								</div>
							)}
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
