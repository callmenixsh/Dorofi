// Pages/profile.jsx - Move userStatus initialization after user is available
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import apiService from "../services/api.js";
import { AlertCircle } from "lucide-react";

// Import modular components
import ProfileHeader from "../components/Profile/ProfileHeader.jsx";
import StatsOverview from "../components/Profile/StatsOverview.jsx";
import WeeklyProgress from "../components/Profile/WeeklyProgress.jsx";
import Achievements from "../components/Profile/Achievements.jsx";
import ActivityCalendar from "../components/Profile/ActivityCalendar.jsx";
import LogoutModal from "../components/Profile/LogoutModal.jsx";
import StatusManager from "../components/Profile/StatusManager.jsx"; // Add this import

export default function Profile() {
    // Auth Context
    const { user, loading: authLoading, logout, updateUser, isAuthenticated } = useAuth();

    // State Management
    const [isEditingDisplay, setIsEditingDisplay] = useState(false);
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [editedDisplayName, setEditedDisplayName] = useState("");
    const [editedUsername, setEditedUsername] = useState("");
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [profileInitialized, setProfileInitialized] = useState(false);

    // Initialize userStatus with safe defaults
    const [userStatus, setUserStatus] = useState({
        presence: { status: 'offline', isManual: false },
        customStatus: { text: '', emoji: '', isActive: false }
    });

    const [stats, setStats] = useState({
        totalSessions: 0,
        totalFocusTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyGoal: 300,
        weeklyProgress: 0,
        achievements: [],
    });

    // Initialize profile data only once when user is available
    useEffect(() => {
        if (authLoading) return; // Wait for auth context
        if (!isAuthenticated || !user) return; // Wait for authenticated user
        if (profileInitialized) return; // Don't initialize twice

        console.log("🎯 Initializing profile for user:", user.email);

        // Set editing state with user data
        setEditedDisplayName(user.displayName || user.name || "");
        setEditedUsername(user.username || "");

        // Initialize userStatus with user data
        setUserStatus({
            presence: user.presence || { status: 'offline', isManual: false },
            customStatus: user.customStatus || { text: '', emoji: '', isActive: false }
        });

        // Fetch backend data
        fetchUserProfile();
        setProfileInitialized(true);
    }, [user, isAuthenticated, authLoading, profileInitialized]);

    const handleStatusUpdate = (updates) => {
        setUserStatus(prev => ({ ...prev, ...updates }));
        updateUser(updates); // Update context
    };

    const fetchUserProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.log("⚠️ No token, using basic stats");
            setBasicStats();
            return;
        }

        try {
            setProfileLoading(true);
            setError("");

            console.log("📡 Fetching backend profile data...");

            // Fetch user stats (don't update user profile here to avoid loops)
            const statsResponse = await apiService.getUserStats();
            console.log("✅ Stats received:", statsResponse);

            setStats({
                totalSessions: statsResponse.totalSessions || 0,
                totalFocusTime: statsResponse.totalFocusTime || 0,
                totalFocusTime: statsResponse.dailyFocusTime || 0,
                currentStreak: statsResponse.currentStreak || 0,
                longestStreak: statsResponse.longestStreak || 0,
                weeklyGoal: statsResponse.weeklyGoal || 300,
                weeklyProgress: statsResponse.weeklyProgress || 0,
                achievements: generateAchievements(statsResponse)
            });

        } catch (error) {
            console.error("❌ Backend fetch failed:", error);
            setError("Backend unavailable - showing basic profile");
            setBasicStats();
        } finally {
            setProfileLoading(false);
        }
    };

    const setBasicStats = () => {
        setStats({
            totalSessions: 0,
            totalFocusTime: 0,
            currentStreak: 0,
            longestStreak: 0,
            weeklyGoal: 300,
            weeklyProgress: 0,
            achievements: generateAchievements({ totalSessions: 0, longestStreak: 0, totalFocusTime: 0 })
        });
    };

    const generateAchievements = (stats) => [
        {
            id: 1,
            name: "First Session",
            icon: "🎯",
            earned: (stats.totalSessions || 0) > 0,
        },
        {
            id: 2,
            name: "7-Day Streak",
            icon: "🔥",
            earned: (stats.longestStreak || 0) >= 7,
        },
        {
            id: 3,
            name: "50 Hours Total",
            icon: "⏰",
            earned: (stats.totalFocusTime || 0) >= 3000,
        },
        {
            id: 4,
            name: "30-Day Warrior",
            icon: "💪",
            earned: (stats.longestStreak || 0) >= 30,
        },
    ];

    // Utility functions
    const getHighResProfilePicture = (googlePicture) => {
        if (!googlePicture) return null;
        return googlePicture
            .replace("s96-c", "s400-c")
            .replace("=s96", "=s400")
            .replace("sz=50", "sz=400");
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    // Handler functions
    const handleSaveDisplayName = async () => {
        if (!editedDisplayName.trim()) {
            setError("Display name cannot be empty");
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (localStorage.getItem("token")) {
                await apiService.updateDisplayName(editedDisplayName.trim());
                console.log("✅ Display name updated in backend");
            }

            updateUser({ 
                displayName: editedDisplayName.trim(),
                name: editedDisplayName.trim() 
            });

            setIsEditingDisplay(false);
        } catch (error) {
            console.error("Failed to update display name:", error);
            setError("Failed to update display name. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveUsername = async () => {
        if (!editedUsername.trim()) {
            setError("Username cannot be empty");
            return;
        }

        try {
            setSaving(true);
            setError("");

            if (!localStorage.getItem("token")) {
                setError("Please log in to set a username");
                return;
            }

            await apiService.updateUsername(editedUsername.trim());
            console.log("✅ Username updated in backend");

            updateUser({
                username: editedUsername.trim().toLowerCase(),
                usernameLastChanged: new Date().toISOString(),
            });

            setIsEditingUsername(false);
        } catch (error) {
            console.error("Failed to update username:", error);
            setError(error.message || "Failed to update username. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        logout(); // Context handles everything
    };

    // Show loading only while auth is initializing
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-secondary">Loading...</div>
                </div>
            </div>
        );
    }

    // ProtectedRoute should handle this, but keep as fallback
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Please log in to view your profile</p>
                </div>
            </div>
        );
    }

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

                {/* Show loading indicator for profile data only */}
                {profileLoading && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-primary text-sm">Loading profile data...</p>
                        </div>
                    </div>
                )}

                {/* Modular Components */}
                <ProfileHeader
                    currentUser={user}
                    isEditingDisplay={isEditingDisplay}
                    setIsEditingDisplay={setIsEditingDisplay}
                    editedDisplayName={editedDisplayName}
                    setEditedDisplayName={setEditedDisplayName}
                    isEditingUsername={isEditingUsername}
                    setIsEditingUsername={setIsEditingUsername}
                    editedUsername={editedUsername}
                    setEditedUsername={setEditedUsername}
                    saving={saving}
                    error={error}
                    setError={setError}
                    onSaveDisplayName={handleSaveDisplayName}
                    onSaveUsername={handleSaveUsername}
                    onLogout={() => setShowLogoutConfirm(true)}
                    getHighResProfilePicture={getHighResProfilePicture}
                />
                <StatusManager 
                    user={{...user, ...userStatus}}
                    onStatusUpdate={handleStatusUpdate}
                />

                <StatsOverview stats={stats} formatTime={formatTime} />
                <WeeklyProgress stats={stats} formatTime={formatTime} />
                <Achievements stats={stats} />
                <ActivityCalendar stats={stats} />

                <LogoutModal
                    showModal={showLogoutConfirm}
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={handleLogout}
                />
            </div>
        </div>
    );
}
