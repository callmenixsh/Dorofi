// Pages/friends.jsx - With URL-based tab persistence
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useSelector } from 'react-redux';
import { useFriendsActions } from "../hooks/useFriendsActions.js";
import { Users, Trophy, Target, Bell, AlertCircle } from "lucide-react";
import FriendsHeader from "../Components/friends/friendsHeader.jsx";
import FriendsTabs from "../Components/friends/friendsTabs.jsx";
import LeaderboardTab from "../Components/friends/leaderboardTab.jsx";
import FriendsListTab from "../Components/friends/friendsListTab.jsx";
import RequestsTab from "../Components/friends/requestsTab.jsx";

export default function Friends() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [currentUserStats, setCurrentUserStats] = useState(null);

  // 🔥 NEW - Get initial tab from URL or default to leaderboard
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab');
    const validTabs = ['leaderboard', 'friends', 'requests', 'challenges'];
    return validTabs.includes(tabFromUrl) ? tabFromUrl : 'leaderboard';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

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

  // 🔥 NEW - Update URL when tab changes
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    
    // Update URL without page reload
    const url = new URL(window.location);
    url.searchParams.set('tab', newTab);
    window.history.replaceState({}, '', url);
  };

  // 🔥 NEW - Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const newTab = getInitialTab();
      setActiveTab(newTab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Fetch current user's stats
  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          // Map unified stats to LeaderboardTab format
          setCurrentUserStats({
            dailyFocusTime: data.stats.timer?.dailyFocusTime || 0,
            dailySessions: data.stats.timer?.dailySessions || 0,
            weeklyFocusTime: data.stats.timer?.weeklyFocusTime || 0,
            weeklySessions: data.stats.timer?.weeklySessions || 0,
            weeklyGoal: data.stats.timer?.weeklyGoal || 300,
            totalFocusTime: data.stats.timer?.totalFocusTime || 0,
            totalSessions: data.stats.timer?.totalSessions || 0,
            currentStreak: data.stats.timer?.currentStreak || 0,
            longestStreak: data.stats.timer?.longestStreak || 0,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  // Always refresh data when navigating to friends page
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !user) return;

    
    // Always fetch fresh data when navigating to friends page
    fetchFriendsData();
    fetchUserStats();
    
  }, [user, isAuthenticated, authLoading]);

  // Create user with stats for LeaderboardTab
  const userWithStats = currentUserStats ? {
    ...user,
    stats: currentUserStats
  } : user;

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

        {/* 🔥 UPDATED - Pass handleTabChange instead of setActiveTab */}
        <FriendsTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={handleTabChange} // 🔥 Updated to use URL-aware handler
        />

        {activeTab === "leaderboard" && (
          <LeaderboardTab
            user={userWithStats}
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
