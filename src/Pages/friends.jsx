// Pages/friends.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Users, 
    UserPlus, 
    Trophy, 
    Clock, 
    Target, 
    TrendingUp, 
    Search,
    Crown,
    Medal,
    Award,
    Plus,
    X,
    Copy,
    Check,
    UserCheck,
    UserX,
    Bell,
    Send
} from 'lucide-react';

export default function Friends() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('leaderboard');
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friendCode, setFriendCode] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedCode, setCopiedCode] = useState(false);
    const navigate = useNavigate();

    // Mock data - replace with real API calls
    const [friends, setFriends] = useState([
        {
            id: 1,
            name: 'Alex Chen',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format',
            weeklyMinutes: 340,
            currentStreak: 8,
            totalSessions: 89,
            status: 'focusing',
            lastSeen: null
        },
        {
            id: 2,
            name: 'Maria Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b590?w=40&h=40&fit=crop&crop=face&auto=format',
            weeklyMinutes: 285,
            currentStreak: 12,
            totalSessions: 67,
            status: 'break',
            lastSeen: '2 min ago'
        },
        {
            id: 3,
            name: 'David Kim',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format',
            weeklyMinutes: 220,
            currentStreak: 5,
            totalSessions: 45,
            status: 'offline',
            lastSeen: '1 hour ago'
        },
        {
            id: 4,
            name: 'Sarah Wilson',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format',
            weeklyMinutes: 195,
            currentStreak: 3,
            totalSessions: 32,
            status: 'offline',
            lastSeen: '3 hours ago'
        }
    ]);

    // Friend request states
    const [pendingIncoming, setPendingIncoming] = useState([
        {
            id: 101,
            name: 'John Doe',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face&auto=format',
            sentAt: '2 hours ago',
            mutualFriends: 2
        },
        {
            id: 102,
            name: 'Emma Smith',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b590?w=40&h=40&fit=crop&crop=face&auto=format',
            sentAt: '5 hours ago',
            mutualFriends: 1
        }
    ]);

    const [pendingOutgoing, setPendingOutgoing] = useState([
        {
            id: 201,
            name: 'Mike Johnson',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format',
            sentAt: '1 day ago'
        }
    ]);

    const userStats = {
        weeklyMinutes: 185,
        currentStreak: 5,
        totalSessions: 47
    };

    const allParticipants = [
        { ...userStats, name: user?.name || 'You', avatar: user?.picture, isCurrentUser: true },
        ...friends
    ].sort((a, b) => b.weeklyMinutes - a.weeklyMinutes);

    useEffect(() => {
        const userInfo = localStorage.getItem('googleUserInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        } else {
            navigate('/');
        }
    }, [navigate]);

    const handleSendFriendRequest = () => {
        if (friendCode.trim()) {
            console.log('Sending friend request to:', friendCode);
            setPendingOutgoing([...pendingOutgoing, {
                id: Date.now(),
                name: friendCode,
                avatar: '/default-avatar.png',
                sentAt: 'just now'
            }]);
            setFriendCode('');
            setShowAddFriend(false);
        }
    };

    const handleAcceptRequest = (requestId) => {
        const request = pendingIncoming.find(r => r.id === requestId);
        if (request) {
            setFriends([...friends, {
                id: request.id,
                name: request.name,
                avatar: request.avatar,
                weeklyMinutes: Math.floor(Math.random() * 200) + 100,
                currentStreak: Math.floor(Math.random() * 10) + 1,
                totalSessions: Math.floor(Math.random() * 50) + 10,
                status: 'offline',
                lastSeen: 'just joined'
            }]);
            setPendingIncoming(pendingIncoming.filter(r => r.id !== requestId));
        }
    };

    const handleDeclineRequest = (requestId) => {
        setPendingIncoming(pendingIncoming.filter(r => r.id !== requestId));
    };

    const handleCancelRequest = (requestId) => {
        setPendingOutgoing(pendingOutgoing.filter(r => r.id !== requestId));
    };

    const copyFriendCode = async () => {
        const myCode = `DOROFI-${user?.email?.split('@')[0]?.toUpperCase() || 'USER'}`;
        try {
            await navigator.clipboard.writeText(myCode);
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'focusing': return 'text-accent';
            case 'break': return 'text-secondary';
            default: return 'text-secondary/50';
        }
    };

    const getStatusText = (status, lastSeen) => {
        switch (status) {
            case 'focusing': return '🎯 Focusing';
            case 'break': return '☕ On break';
            default: return lastSeen ? `Last seen ${lastSeen}` : 'Offline';
        }
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const filteredFriends = friends.filter(friend =>
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-secondary">Loading...</div>
            </div>
        );
    }

    const tabs = [
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        { id: 'friends', label: 'Friends', icon: Users },
        { id: 'requests', label: `Requests ${pendingIncoming.length > 0 ? `(${pendingIncoming.length})` : ''}`, icon: Bell },
        { id: 'challenges', label: 'Challenges', icon: Target }
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-primary">Friends & Leaderboard</h1>
                    <button
                        onClick={() => setShowAddFriend(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                    >
                        <UserPlus size={18} />
                        Add Friend
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-surface mb-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                                activeTab === tab.id
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-secondary hover:text-primary'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.id === 'requests' && pendingIncoming.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {pendingIncoming.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'leaderboard' && (
                    <div className="space-y-4">
                        {/* Weekly Leaderboard */}
                        <div className="bg-surface rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-primary mb-4">This Week's Leaderboard</h3>
                            
                            <div className="space-y-3">
                                {allParticipants.map((participant, index) => {
                                    // Determine styling based on rank
                                    const getRankStyling = (position) => {
                                        switch (position) {
                                            case 0: return {
                                                bgColor: 'bg-yellow-500/10 border-yellow-500/30',
                                                textColor: 'text-yellow-600',
                                                icon: <Crown size={18} className="text-yellow-500" />,
                                                rankText: '1st'
                                            };
                                            case 1: return {
                                                bgColor: 'bg-gray-400/10 border-gray-400/30',
                                                textColor: 'text-gray-500',
                                                icon: <Medal size={18} className="text-gray-400" />,
                                                rankText: '2nd'
                                            };
                                            case 2: return {
                                                bgColor: 'bg-amber-600/10 border-amber-600/30',
                                                textColor: 'text-amber-600',
                                                icon: <Award size={18} className="text-amber-600" />,
                                                rankText: '3rd'
                                            };
                                            default: return {
                                                bgColor: 'bg-transparent border-transparent',
                                                textColor: 'text-secondary',
                                                icon: null,
                                                rankText: `${position + 1}`
                                            };
                                        }
                                    };

                                    const styling = getRankStyling(index);
                                    
                                    return (
                                        <div 
                                            key={participant.id || 'currentUser'}
                                            className={`rounded-lg p-4 border-2 transition-all ${styling.bgColor} ${
                                                participant.isCurrentUser ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    {/* Rank with icon */}
                                                    <div className="flex items-center justify-center w-8">
                                                        {styling.icon || (
                                                            <span className={`font-bold text-sm ${styling.textColor}`}>
                                                                #{styling.rankText}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Profile picture */}
                                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface">
                                                        <img 
                                                            src={participant.avatar || '/default-avatar.png'} 
                                                            alt={participant.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    
                                                    {/* Name and status */}
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-medium text-primary">
                                                                {participant.isCurrentUser ? 'You' : participant.name}
                                                            </h3>
                                                            {participant.isCurrentUser && (
                                                                <span className="text-xs bg-primary text-white px-2 py-1 rounded">You</span>
                                                            )}
                                                            {/* Special badge for top 3 */}
                                                            {index < 3 && (
                                                                <span className={`text-xs px-2 py-1 rounded ${
                                                                    index === 0 ? 'bg-yellow-500/20 text-yellow-600' :
                                                                    index === 1 ? 'bg-gray-400/20 text-gray-500' :
                                                                    'bg-amber-600/20 text-amber-600'
                                                                }`}>
                                                                    {styling.rankText}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {!participant.isCurrentUser && (
                                                            <p className={`text-xs ${getStatusColor(participant.status)}`}>
                                                                {getStatusText(participant.status, participant.lastSeen)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Stats */}
                                                <div className="text-right">
                                                    <p className="font-semibold text-primary">{formatTime(participant.weeklyMinutes)}</p>
                                                    <p className="text-xs text-secondary">🔥 {participant.currentStreak} day streak</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'friends' && (
                    <div>
                        {/* Search */}
                        <div className="relative mb-4">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                            <input
                                type="text"
                                placeholder="Search friends..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-surface border border-surface rounded-lg text-primary placeholder-secondary focus:outline-none focus:border-primary"
                            />
                        </div>

                        {/* Friends List */}
                        <div className="space-y-3">
                            {filteredFriends.map((friend) => (
                                <div key={friend.id} className="bg-surface rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                                <img 
                                                    src={friend.avatar} 
                                                    alt={friend.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-primary">{friend.name}</h3>
                                                <p className={`text-sm ${getStatusColor(friend.status)}`}>
                                                    {getStatusText(friend.status, friend.lastSeen)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right text-sm">
                                            <p className="text-primary">🎯 {friend.totalSessions} sessions</p>
                                            <p className="text-secondary">🔥 {friend.currentStreak} day streak</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="space-y-6">
                        {/* Incoming Requests */}
                        {pendingIncoming.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-primary mb-4">Friend Requests</h3>
                                <div className="space-y-3">
                                    {pendingIncoming.map((request) => (
                                        <div key={request.id} className="bg-surface rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden">
                                                        <img 
                                                            src={request.avatar} 
                                                            alt={request.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-primary">{request.name}</h3>
                                                        <p className="text-sm text-secondary">
                                                            {request.mutualFriends > 0 
                                                                ? `${request.mutualFriends} mutual friends • ${request.sentAt}`
                                                                : `Sent ${request.sentAt}`
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAcceptRequest(request.id)}
                                                        className="p-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                                                        title="Accept"
                                                    >
                                                        <UserCheck size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeclineRequest(request.id)}
                                                        className="p-2 bg-surface text-secondary rounded-lg hover:bg-background hover:text-primary transition-colors"
                                                        title="Decline"
                                                    >
                                                        <UserX size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Outgoing Requests */}
                        {pendingOutgoing.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-primary mb-4">Sent Requests</h3>
                                <div className="space-y-3">
                                    {pendingOutgoing.map((request) => (
                                        <div key={request.id} className="bg-surface rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-background">
                                                        <img 
                                                            src={request.avatar} 
                                                            alt={request.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-primary">{request.name}</h3>
                                                        <p className="text-sm text-secondary">Sent {request.sentAt}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleCancelRequest(request.id)}
                                                    className="px-3 py-1 text-sm text-secondary hover:text-primary border border-surface rounded-lg hover:bg-background transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {pendingIncoming.length === 0 && pendingOutgoing.length === 0 && (
                            <div className="text-center py-8">
                                <Bell size={48} className="text-secondary mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-primary mb-2">No pending requests</h3>
                                <p className="text-secondary">When someone sends you a friend request, it will appear here.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'challenges' && (
                    <div className="text-center py-8">
                        <Target size={48} className="text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-primary mb-2">Challenges Coming Soon!</h3>
                        <p className="text-secondary">Weekly challenges and group goals will be available here.</p>
                    </div>
                )}

                {/* Add Friend Modal */}
                {showAddFriend && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-background rounded-lg shadow-lg w-96 max-w-[90vw] p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-primary">Add Friend</h3>
                                <button 
                                    onClick={() => setShowAddFriend(false)}
                                    className="text-secondary hover:text-primary"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Share Your Code */}
                            <div className="mb-4">
                                <p className="text-sm text-secondary mb-2">Share your friend code:</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 p-2 bg-surface rounded text-primary font-mono text-sm">
                                        DOROFI-{user?.email?.split('@')[0]?.toUpperCase() || 'USER'}
                                    </div>
                                    <button
                                        onClick={copyFriendCode}
                                        className="p-2 bg-primary text-white rounded hover:bg-accent transition-colors"
                                        title="Copy code"
                                    >
                                        {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Send Friend Request */}
                            <div>
                                <p className="text-sm text-secondary mb-2">Send friend request:</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="DOROFI-USERNAME"
                                        value={friendCode}
                                        onChange={(e) => setFriendCode(e.target.value)}
                                        className="flex-1 p-2 bg-surface border border-surface rounded text-primary placeholder-secondary focus:outline-none focus:border-primary"
                                    />
                                    <button
                                        onClick={handleSendFriendRequest}
                                        className="px-4 py-2 bg-primary text-white rounded hover:bg-accent transition-colors flex items-center gap-2"
                                        title="Send request"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
