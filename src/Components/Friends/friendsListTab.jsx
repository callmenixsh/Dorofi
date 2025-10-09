// components/friends/FriendsListTab.jsx - WITH CLICKABLE FRIEND CARDS
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Users,
    User,
    X,
    AlertTriangle,
    Flame,
    Circle,
} from "lucide-react";

export default function FriendsListTab({ friends, loading, onRemoveFriend }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [imageErrors, setImageErrors] = useState({});
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [friendToRemove, setFriendToRemove] = useState(null);
    const [removing, setRemoving] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);

    // 🔥 UPDATED: Handle clicking on friend card
    const handleFriendClick = (friend) => {
        console.log('🔍 Navigating to profile for:', friend.username);
        navigate(`/profile/${friend.username}`);
    };

    const getHighResProfilePicture = (googlePicture) => {
        if (!googlePicture) return null;
        return googlePicture
            .replace("s96-c", "s200-c")
            .replace("=s96", "=s200")
            .replace("sz=50", "sz=200");
    };

    const handleImageError = (friendId) => {
        setImageErrors((prev) => ({ ...prev, [friendId]: true }));
    };

    // Sort friends alphabetically by display name or name
    const sortedFriends = [...friends].sort((a, b) => {
        const nameA = (a.displayName || a.name || "").toLowerCase();
        const nameB = (b.displayName || b.name || "").toLowerCase();
        return nameA.localeCompare(nameB);
    });

    const filteredFriends = sortedFriends.filter(
        (friend) =>
            (friend.displayName || friend.name || "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            (friend.username || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "online":
                return "text-green-500";
            case "away":
                return "text-yellow-500";
            case "busy":
                return "text-red-500";
            case "invisible":
            case "offline":
            default:
                return "text-gray-400";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "online":
                return "Online";
            case "away":
                return "Away";
            case "busy":
                return "Busy";
            case "invisible":
                return "Offline"; // Show as offline for invisible users
            case "offline":
            default:
                return "Offline";
        }
    };

    const getPresenceStatus = (friend) => {
        // If privacy is hidden, show that
        if (friend.privacy?.showLastSeen === false) {
            return {
                status: "offline",
                color: "text-gray-400",
                text: "Offline",
            };
        }

        const now = new Date();
        const lastSeen = friend.presence?.lastSeen
            ? new Date(friend.presence.lastSeen)
            : friend.lastSeen
            ? new Date(friend.lastSeen)
            : null;
        const diffInMinutes = lastSeen
            ? Math.floor((now - lastSeen) / (1000 * 60))
            : null;

        // If user manually set status, use that
        if (friend.presence?.isManual && friend.presence?.status) {
            // If user is invisible, always show as offline
            if (friend.presence.status === 'invisible') {
                return {
                    status: "offline",
                    color: "text-gray-400",
                    text: "Offline",
                };
            }
            
            return {
                status: friend.presence.status,
                color: getStatusColor(friend.presence.status),
                text: getStatusText(friend.presence.status),
            };
        }

        // Auto-detect based on last seen
        if (diffInMinutes === null) {
            return { status: "offline", color: "text-gray-400", text: "Never seen" };
        }
        if (diffInMinutes < 5) {
            return { status: "online", color: "text-green-500", text: "Online" };
        }
        if (diffInMinutes < 15) {
            return { status: "away", color: "text-yellow-500", text: "Away" };
        }
        if (diffInMinutes < 60) {
            return {
                status: "offline",
                color: "text-gray-400",
                text: `Last seen ${diffInMinutes}m ago`,
            };
        }
        if (diffInMinutes < 1440) {
            const hours = Math.floor(diffInMinutes / 60);
            return {
                status: "offline",
                color: "text-gray-400",
                text: `${hours}h ago`,
            };
        }
        const days = Math.floor(diffInMinutes / 1440);
        return { status: "offline", color: "text-gray-400", text: `${days}d ago` };
    };

    const getCustomStatusDisplay = (friend) => {
        // If user is invisible, don't show custom status
        if (friend.presence?.isManual && friend.presence?.status === 'invisible') {
            return { hasCustom: false };
        }
        
        // If user is offline (not manually set to away/busy), don't show custom status
        if (friend.presence?.status === 'offline' || !friend.presence?.isManual) {
            // Check if user is actually online/away/busy based on activity
            const now = new Date();
            const lastSeen = friend.presence?.lastSeen
                ? new Date(friend.presence.lastSeen)
                : friend.lastSeen
                ? new Date(friend.lastSeen)
                : null;
            const diffInMinutes = lastSeen
                ? Math.floor((now - lastSeen) / (1000 * 60))
                : null;

            // Only show custom status if user is recently active (less than 15 minutes)
            if (diffInMinutes === null || diffInMinutes >= 15) {
                return { hasCustom: false };
            }
        }
        
        if (friend.customStatus?.isActive && friend.customStatus?.text) {
            return {
                text: friend.customStatus.text,
                emoji: friend.customStatus.emoji || "",
                hasCustom: true,
            };
        }
        return { hasCustom: false };
    };

    const handleRemoveFriend = (friend, e) => {
        // 🔥 IMPORTANT: Prevent event bubbling so card click doesn't trigger
        e.stopPropagation();
        setFriendToRemove(friend);
        setShowRemoveModal(true);
    };

    const confirmRemoveFriend = async () => {
        if (!friendToRemove) return;

        setRemoving(true);
        try {
            await onRemoveFriend(friendToRemove.id || friendToRemove._id);
            setShowRemoveModal(false);
            setFriendToRemove(null);
        } catch (error) {
            console.error("Failed to remove friend:", error);
        } finally {
            setRemoving(false);
        }
    };

    const cancelRemove = () => {
        setShowRemoveModal(false);
        setFriendToRemove(null);
    };

    if (loading) {
        return (
            <div className="bg-surface rounded-lg p-6 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary">Loading friends...</p>
            </div>
        );
    }

    return (
        <>
            <div>
                {/* Search Bar with Friend Count */}
                {friends.length > 0 && (
                    <div className="relative mb-4">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary"
                        />
                        <input
                            type="text"
                            placeholder="Search friends..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-20 py-2 bg-surface border border-surface rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-secondary">
                            {searchQuery
                                ? `${filteredFriends.length}/${friends.length}`
                                : `${friends.length} friends`}
                        </div>
                    </div>
                )}

                {/* Friends List */}
                {filteredFriends.length === 0 ? (
                    <div className="bg-surface rounded-lg p-8 text-center">
                        <Users size={48} className="text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-primary mb-2">
                            {searchQuery
                                ? "No friends found"
                                : friends.length === 0
                                ? "No Friends Yet"
                                : "No matching friends"}
                        </h3>
                        <p className="text-secondary">
                            {searchQuery
                                ? "Try a different search term"
                                : friends.length === 0
                                ? "Send friend requests to start building your study network!"
                                : "No friends match your search"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredFriends.map((friend) => {
                            const friendId = friend.id || friend._id;
                            const hasImageError = imageErrors[friendId];
                            const profilePicture = getHighResProfilePicture(friend.picture);
                            const currentStreak = friend.stats?.currentStreak || 0;
                            const presenceStatus = getPresenceStatus(friend);
                            const customStatus = getCustomStatusDisplay(friend);
                            const isHovered = hoveredCard === friendId;

                            return (
                                <div
                                    key={friendId}
                                    // 🔥 UPDATED: Make entire card clickable with better hover effects
                                    onClick={() => handleFriendClick(friend)}
                                    className="bg-surface rounded-lg p-4 hover:bg-surface/80 transition-all duration-200 relative cursor-pointer hover:shadow-md hover:scale-[1.02]"
                                    onMouseEnter={() => setHoveredCard(friendId)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Profile Picture with Status Indicator */}
                                            <div className="relative">
                                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-background">
                                                    {profilePicture && !hasImageError ? (
                                                        <img
                                                            src={profilePicture}
                                                            alt={friend.displayName || friend.name}
                                                            className="w-full h-full object-cover"
                                                            onError={() => handleImageError(friendId)}
                                                            crossOrigin="anonymous"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                            <User size={20} className="text-primary/50" />
                                                        </div>
                                                    )}
                                                </div>
                                                {/* Online Status Dot */}
                                                <div
                                                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-surface flex items-center justify-center ${
                                                        presenceStatus.status === "online"
                                                            ? "bg-green-500"
                                                            : presenceStatus.status === "away"
                                                            ? "bg-yellow-500"
                                                            : presenceStatus.status === "busy"
                                                            ? "bg-red-500"
                                                            : "bg-gray-400"
                                                    }`}
                                                >
                                                    <Circle size={10} className="fill-current text-background" />
                                                </div>
                                            </div>

                                            {/* Friend Info */}
                                            <div>
                                                <h3 className="font-medium text-primary">
                                                    {friend.displayName || friend.name}
                                                </h3>
                                                <p className="text-sm text-secondary">
                                                    @{friend.username || "no-username"}
                                                </p>

                                                {/* Status Display - Only show custom status if online/away/busy */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    {/* Show custom status only if user is active and has one */}
                                                    {customStatus.hasCustom && (presenceStatus.status === "online" || presenceStatus.status === "away" || presenceStatus.status === "busy") ? (
                                                        <span className="text-xs text-primary font-medium">
                                                            {customStatus.emoji} {customStatus.text}
                                                        </span>
                                                    ) : (
                                                        <p className={`text-xs font-medium ${presenceStatus.color}`}>
                                                            {presenceStatus.text}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Side - Fixed Width Container */}
                                        <div className="flex items-center justify-end w-32">
                                            {/* Current Streak Display - Always takes space */}
                                            <div className="text-right text-sm min-w-0 flex-1 mr-12">
                                                <p
                                                    className={`font-medium flex items-center justify-end gap-1 ${
                                                        currentStreak > 0
                                                            ? "text-orange-500"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    <Flame
                                                        size={12}
                                                        className={
                                                            currentStreak > 0
                                                                ? "text-orange-500"
                                                                : "text-gray-400"
                                                        }
                                                    />
                                                    {currentStreak} {currentStreak === 1 ? "day" : "days"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 🔥 UPDATED: Only Remove Button (Eye button removed) */}
                                    {isHovered && (
                                        <div className="absolute top-8 right-4 flex items-center  gap-2">
                                            <button
                                                onClick={(e) => handleRemoveFriend(friend, e)}
                                                className="p-2 bg-background hover:bg-red-500 hover:text-white rounded-lg transition-colors group shadow-md"
                                                title="Remove friend"
                                            >
                                                <X
                                                    size={16}
                                                    className="group-hover:text-white text-red-500"
                                                />
                                            </button>
                                            
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Remove Friend Confirmation Modal */}
            {showRemoveModal && friendToRemove && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-lg shadow-xl w-full max-w-md border border-surface">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-surface">
                            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                                <AlertTriangle size={20} className="text-red-500" />
                                Remove Friend
                            </h3>
                            <button
                                onClick={cancelRemove}
                                className="text-secondary hover:text-primary transition-colors p-1"
                                disabled={removing}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <p className="text-secondary mb-4">
                                Are you sure you want to remove{" "}
                                <span className="font-medium text-primary">
                                    {friendToRemove.displayName || friendToRemove.name}
                                </span>{" "}
                                from your friends list?
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 bg-surface/50 border-t border-surface rounded-b-lg">
                            <button
                                onClick={cancelRemove}
                                className="px-4 py-2 text-secondary hover:text-primary transition-colors"
                                disabled={removing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRemoveFriend}
                                disabled={removing}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {removing && (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                )}
                                Remove Friend
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
