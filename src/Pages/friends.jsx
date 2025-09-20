// Pages/friends.jsx - Redux version
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useSelector } from 'react-redux';
import { useFriendsActions } from "../hooks/useFriendsActions.js";
import { Users, Trophy, Target, Bell, AlertCircle } from "lucide-react";
import FriendsHeader from "../components/friends/FriendsHeader.jsx";
import FriendsTabs from "../components/friends/FriendsTabs.jsx";
import LeaderboardTab from "../components/friends/LeaderboardTab.jsx";
import FriendsListTab from "../components/friends/FriendsListTab.jsx";
import RequestsTab from "../components/friends/RequestsTab.jsx";

export default function Friends() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("leaderboard");

  // Get state from Redux
  const { 
    friends, 
    pendingIncoming, 
    pendingOutgoing, 
    loading: friendsLoading, 
    error, 
    friendsInitialized
  } = useSelector(state => state.friends);
  
  const { 
    fetchFriendsData, 
    sendFriendRequest, 
    removeFriendAction, 
    acceptRequest, 
    declineRequest, 
    cancelRequest 
  } = useFriendsActions();

  // Initialize friends data
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) return;
    if (friendsInitialized) return;

    console.log("🤝 Initializing friends data for user:", user.email);
    fetchFriendsData();
  }, [user, isAuthenticated, authLoading, friendsInitialized, fetchFriendsData]);

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
          onSendFriendRequest={sendFriendRequest}
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
            onRemoveFriend={removeFriendAction}
          />
        )}

        {activeTab === "requests" && (
          <RequestsTab
            pendingIncoming={pendingIncoming}
            pendingOutgoing={pendingOutgoing}
            onAcceptRequest={acceptRequest}
            onDeclineRequest={declineRequest}
            onCancelRequest={cancelRequest}
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
