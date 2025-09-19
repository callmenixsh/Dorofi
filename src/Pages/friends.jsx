// Pages/friends.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import apiService from "../services/api.js";
import { Users, Trophy, Target, Bell, AlertCircle } from "lucide-react";
import FriendsHeader from "../components/friends/FriendsHeader.jsx";
import FriendsTabs from "../components/friends/FriendsTabs.jsx";
import LeaderboardTab from "../components/friends/LeaderboardTab.jsx";
import FriendsListTab from "../components/friends/FriendsListTab.jsx";
import RequestsTab from "../components/friends/RequestsTab.jsx";

export default function Friends() {
	// Auth Context
	const { user, isAuthenticated, loading: authLoading } = useAuth();

	// State Management
	const [activeTab, setActiveTab] = useState("leaderboard");
	const [friendsLoading, setFriendsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [friendsInitialized, setFriendsInitialized] = useState(false);

	// Backend data state
	const [friends, setFriends] = useState([]);
	const [pendingIncoming, setPendingIncoming] = useState([]);
	const [pendingOutgoing, setPendingOutgoing] = useState([]);

	// Fetch friends data from backend only once when user is authenticated
	useEffect(() => {
		if (authLoading) return; // Wait for auth to load
		if (!isAuthenticated || !user) return; // Must be authenticated
		if (friendsInitialized) return; // Don't fetch twice

		console.log("🤝 Initializing friends data for user:", user.email);
		fetchFriendsData();
		setFriendsInitialized(true);
	}, [user, isAuthenticated, authLoading, friendsInitialized]);

	const fetchFriendsData = async () => {
		const token = localStorage.getItem("token");
		if (!token) {
			console.log("⚠️ No JWT token found, using empty friends data");
			setFriends([]);
			setPendingIncoming([]);
			setPendingOutgoing([]);
			return;
		}

		try {
			setFriendsLoading(true);
			setError(null);

			console.log("📡 Fetching friends data from backend...");
			const friendsData = await apiService.getFriends();
			console.log("✅ Friends data received:", friendsData);

			setFriends(friendsData.friends || []);
			setPendingIncoming(friendsData.pendingIncoming || []);
			setPendingOutgoing(friendsData.pendingOutgoing || []);
		} catch (error) {
			console.error("❌ Failed to fetch friends data:", error);
			setError("Backend unavailable - showing basic friends page");

			// Set empty arrays on error
			setFriends([]);
			setPendingIncoming([]);
			setPendingOutgoing([]);
		} finally {
			setFriendsLoading(false);
		}
	};

	// Handle friend request actions
	const handleSendFriendRequest = async (friendCode) => {
		try {
			setFriendsLoading(true);
			console.log("📤 Sending friend request to:", friendCode);

			const response = await apiService.sendFriendRequest(friendCode);
			setPendingOutgoing((prev) => [...prev, response.request]);

			return { success: true, message: "Friend request sent!" };
		} catch (error) {
			console.error("❌ Failed to send friend request:", error);
			return {
				success: false,
				error: error.message || "Failed to send request",
			};
		} finally {
			setFriendsLoading(false);
		}
	};

	const handleRemoveFriend = async (friendId) => {
		try {
			// Call your API to remove friend
			await apiService.removeFriend(friendId);

			// Update local state
			setFriends((prev) => prev.filter((f) => (f.id || f._id) !== friendId));

			return { success: true };
		} catch (error) {
			console.error("Failed to remove friend:", error);
			throw error;
		}
	};

	const handleAcceptRequest = async (requestId) => {
		try {
			console.log("✅ Accepting friend request:", requestId);
			const response = await apiService.acceptFriendRequest(requestId);

			// Move request to friends list
			const request = pendingIncoming.find((r) => r._id === requestId);
			if (request && response.friend) {
				setFriends((prev) => [...prev, response.friend]);
				setPendingIncoming((prev) => prev.filter((r) => r._id !== requestId));
			}

			return { success: true };
		} catch (error) {
			console.error("❌ Failed to accept friend request:", error);
			return { success: false, error: error.message };
		}
	};

	const handleDeclineRequest = async (requestId) => {
		try {
			console.log("❌ Declining friend request:", requestId);
			await apiService.declineFriendRequest(requestId);
			setPendingIncoming((prev) => prev.filter((r) => r._id !== requestId));
			return { success: true };
		} catch (error) {
			console.error("❌ Failed to decline friend request:", error);
			// Remove from UI anyway for better UX
			setPendingIncoming((prev) => prev.filter((r) => r._id !== requestId));
			return { success: false, error: error.message };
		}
	};

	const handleCancelRequest = async (requestId) => {
		try {
			console.log("🚫 Canceling friend request:", requestId);
			await apiService.cancelFriendRequest(requestId);
			setPendingOutgoing((prev) => prev.filter((r) => r._id !== requestId));
			return { success: true };
		} catch (error) {
			console.error("❌ Failed to cancel friend request:", error);
			setPendingOutgoing((prev) => prev.filter((r) => r._id !== requestId));
			return { success: false, error: error.message };
		}
	};

	// Show loading while auth is initializing
	if (authLoading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<div className="text-secondary">Loading friends...</div>
				</div>
			</div>
		);
	}

	// This should never show due to ProtectedRoute, but keep as fallback
	if (!isAuthenticated || !user) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<p className="text-red-500 mb-4">Please log in to view friends</p>
					<button
						onClick={() => (window.location.href = "/")}
						className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
					>
						Go to Home
					</button>
				</div>
			</div>
		);
	}

	const tabs = [
		{
			id: "leaderboard",
			label: "Leaderboard",
			icon: Trophy,
		},
		{
			id: "friends",
			label: "Friends",
			icon: Users,
			count: friends.length,
		},
		{
			id: "requests",
			label: "Requests",
			icon: Bell,
			count: pendingIncoming.length,
		},
		{
			id: "challenges",
			label: "Challenges",
			icon: Target,
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-4 py-8 max-w-4xl">
				{/* Error Banner */}
				{error && (
					<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
						<div className="flex items-center gap-3">
							<AlertCircle size={20} className="text-red-500" />
							<p className="text-red-600 text-sm">{error}</p>
						</div>
					</div>
				)}

				{/* Friends Loading Indicator */}
				{friendsLoading && (
					<div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
						<div className="flex items-center gap-3">
							<div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
							<p className="text-primary text-sm">Loading friends data...</p>
						</div>
					</div>
				)}

				<FriendsHeader
					user={user}
					onSendFriendRequest={handleSendFriendRequest}
					loading={friendsLoading}
				/>

				<FriendsTabs
					tabs={tabs}
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>

				{activeTab === "leaderboard" && (
					<LeaderboardTab
						user={user}
						friends={friends}
						loading={friendsLoading}
					/>
				)}

				{activeTab === "friends" && (
					<FriendsListTab
						friends={friends}
						loading={friendsLoading}
						onRemoveFriend={handleRemoveFriend}
					/>
				)}

				{activeTab === "requests" && (
					<RequestsTab
						pendingIncoming={pendingIncoming}
						pendingOutgoing={pendingOutgoing}
						onAcceptRequest={handleAcceptRequest}
						onDeclineRequest={handleDeclineRequest}
						onCancelRequest={handleCancelRequest}
						loading={friendsLoading}
					/>
				)}

				{activeTab === "challenges" && (
					<div className="bg-surface rounded-lg p-8 text-center">
						<Target size={48} className="text-secondary mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-primary mb-2">
							Challenges Coming Soon!
						</h3>
						<p className="text-secondary">
							Weekly challenges and group goals will be available here.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
