// components/friends/LeaderboardTab.jsx
import { 
    Crown, Medal, Award, Trophy, User, Calendar, Clock, Globe, 
    BookOpen, Flame, BarChart3, Target, Sunrise, Zap
} from 'lucide-react';
import { useState } from 'react';

export default function LeaderboardTab({ user, friends, loading }) {
    const [imageErrors, setImageErrors] = useState({});
    const [activeLeaderboard, setActiveLeaderboard] = useState('daily'); 

    // Combine user and friends
    const allParticipants = [user, ...friends].filter(participant => participant);

    // Sort by different focus time metrics based on active tab
    const sortedParticipants = [...allParticipants].sort((a, b) => {
        if (activeLeaderboard === 'daily') {
            // Sort by today's focus time
            return (b.stats?.dailyFocusTime || 0) - (a.stats?.dailyFocusTime || 0);
        } else if (activeLeaderboard === 'weekly') {
            // Sort by this week's focus time
            return (b.stats?.weeklyFocusTime || 0) - (a.stats?.weeklyFocusTime || 0);
        } else {
            // Sort by all-time focus time
            return (b.stats?.totalFocusTime || 0) - (a.stats?.totalFocusTime || 0);
        }
    });

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const getHighResProfilePicture = (googlePicture) => {
        if (!googlePicture) return null;
        return googlePicture
            .replace("s96-c", "s200-c")
            .replace("=s96", "=s200")
            .replace("sz=50", "sz=200");
    };

    const handleImageError = (participantId) => {
        setImageErrors(prev => ({ ...prev, [participantId]: true }));
    };

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
                textColor: 'text-gray-100 dark:text-gray-300',
                icon: <Medal size={18} className="text-gray-700 dark:text-gray-200" />,
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

    const getPrimaryMetric = (participant) => {
        if (activeLeaderboard === 'daily') {
            return formatTime(participant.stats?.dailyFocusTime || 0);
        } else if (activeLeaderboard === 'weekly') {
            return formatTime(participant.stats?.weeklyFocusTime || 0);
        } else {
            return formatTime(participant.stats?.totalFocusTime || 0);
        }
    };

// In your LeaderboardTab component, update the getSecondaryStats function:

const getSecondaryStats = (participant) => {
    if (activeLeaderboard === 'daily') {
        // Daily: Show sessions today and current streak
        const currentStreak = participant.stats?.currentStreak || 0;
        return [
            { 
                icon: <BookOpen size={12} />, 
                value: `${participant.stats?.dailySessions || 0} sessions today`,
                className: '' 
            },
            { 
                icon: <Flame size={12} className={currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'} />, 
                value: `${currentStreak} day streak`,
                className: currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'
            }
        ];
    } else if (activeLeaderboard === 'weekly') {
        // Weekly: Show weekly sessions and progress
        return [
            { 
                icon: <BarChart3 size={12} />, 
                value: `${participant.stats?.weeklySessions || 0} sessions this week`,
                className: ''
            },
            { 
                icon: <Target size={12} />, 
                value: `${Math.round(((participant.stats?.weeklyFocusTime || 0) / (participant.stats?.weeklyGoal || 300)) * 100)}% of goal`,
                className: ''
            }
        ];
    } else {
        // All-time: Show total sessions and longest streak
        const longestStreak = participant.stats?.longestStreak || 0;
        return [
            { 
                icon: <BookOpen size={12} />, 
                value: `${participant.stats?.totalSessions || 0} total sessions`,
                className: ''
            },
            { 
                icon: <Trophy size={12} className={longestStreak > 0 ? 'text-yellow-500' : 'text-gray-400'} />, 
                value: `${longestStreak} day best streak`,
                className: longestStreak > 0 ? 'text-yellow-500' : 'text-gray-400'
            }
        ];
    }
};

    const getLeaderboardInfo = () => {
        // Get current time in IST
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const istTime = new Date(now.getTime() + istOffset);
        
        if (activeLeaderboard === 'daily') {
            // Calculate time until next midnight IST
            const tomorrow = new Date(istTime);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeUntilReset = tomorrow.getTime() - istTime.getTime();
            const hoursLeft = Math.floor(timeUntilReset / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            
            return {
                title: "Today's Focus Hours",
                resetInfo: (
                    <span className="flex items-center justify-center gap-1">
                        <Sunrise size={12} />
                        Resets in {hoursLeft}h {minutesLeft}m
                    </span>
                ),
                tipInfo: (
                    <span className="flex items-center justify-center gap-1">
                        <Zap size={12} />
                        Stay consistent with daily focus sessions
                    </span>
                )
            };
            
        } else if (activeLeaderboard === 'weekly') {
            // Calculate time until next Monday midnight IST
            const nextMonday = new Date(istTime);
            const daysUntilMonday = (8 - nextMonday.getDay()) % 7; // 0 = Sunday, 1 = Monday, etc.
            const actualDaysUntilMonday = daysUntilMonday === 0 ? 7 : daysUntilMonday;
            
            nextMonday.setDate(nextMonday.getDate() + actualDaysUntilMonday);
            nextMonday.setHours(0, 0, 0, 0);
            
            const timeUntilReset = nextMonday.getTime() - istTime.getTime();
            const daysLeft = Math.floor(timeUntilReset / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((timeUntilReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            
            let timeString = '';
            if (daysLeft > 0) {
                timeString = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m`;
            } else {
                timeString = `${hoursLeft}h ${minutesLeft}m`;
            }
            
            return {
                title: "This Week's Focus Hours", 
                resetInfo: (
                    <span className="flex items-center justify-center gap-1">
                        <Calendar size={12} />
                        Resets in {timeString}
                    </span>
                ),
                tipInfo: (
                    <span className="flex items-center justify-center gap-1">
                        <Target size={12} />
                        Work toward your weekly goals together
                    </span>
                )
            };
            
        } else {
            return {
                title: "All-Time Focus Hours",
                tipInfo: (
                    <span className="flex items-center justify-center gap-1">
                        <Trophy size={12} />
                        Long-term dedication pays off
                    </span>
                )
            };
        }
    };

    if (loading) {
        return (
            <div className="bg-surface rounded-lg p-6 text-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary">Loading leaderboard...</p>
            </div>
        );
    }

    if (sortedParticipants.length === 0) {
        return (
            <div className="bg-surface rounded-lg p-8 text-center">
                <Trophy size={48} className="text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary mb-2">No Data Yet</h3>
                <p className="text-secondary">Complete some focus sessions to see leaderboard data!</p>
            </div>
        );
    }

    const leaderboardInfo = getLeaderboardInfo();

    return (
        <div className="space-y-4">
            <div className="bg-surface rounded-lg">
                {/* Header with Tabs */}
                <div className="p-6 border-b border-background">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                            <Trophy size={20} />
                            {leaderboardInfo.title}
                        </h3>
                    </div>

                    {/* 3 Leaderboard Type Tabs */}
                    <div className="flex bg-background rounded-lg p-1">
                        <button
                            onClick={() => setActiveLeaderboard('daily')}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition-all text-sm ${
                                activeLeaderboard === 'daily'
                                    ? 'bg-primary text-background shadow-sm'
                                    : 'text-secondary hover:text-primary'
                            }`}
                        >
                            <Clock size={14} />
                            Today
                        </button>
                        <button
                            onClick={() => setActiveLeaderboard('weekly')}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition-all text-sm ${
                                activeLeaderboard === 'weekly'
                                    ? 'bg-primary text-background shadow-sm'
                                    : 'text-secondary hover:text-primary'
                            }`}
                        >
                            <Calendar size={14} />
                            This Week
                        </button>
                        <button
                            onClick={() => setActiveLeaderboard('alltime')}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium transition-all text-sm ${
                                activeLeaderboard === 'alltime'
                                    ? 'bg-primary text-background shadow-sm'
                                    : 'text-secondary hover:text-primary'
                            }`}
                        >
                            <Globe size={14} />
                            All Time
                        </button>
                    </div>
                </div>
                
                {/* Leaderboard Content */}
                <div className="p-4 space-y-3">
                    {sortedParticipants.map((participant, index) => {
                        const styling = getRankStyling(index);
                        const isCurrentUser = participant.id === user?.id || participant.email === user?.email;
                        const participantId = participant.id || participant.email;
                        const hasImageError = imageErrors[participantId];
                        const profilePicture = getHighResProfilePicture(participant.picture);
                        const secondaryStats = getSecondaryStats(participant);
                        
                        return (
                            <div 
                                key={participantId}
                                className={`rounded-lg p-4 border-2 transition-all hover:shadow-md ${styling.bgColor} ${
                                    isCurrentUser ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Rank Icon/Number */}
                                        <div className="flex items-center justify-center w-8">
                                            {styling.icon || (
                                                <span className={`font-bold text-sm ${styling.textColor}`}>
                                                    #{styling.rankText}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Profile Picture */}
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-surface">
                                                {profilePicture && !hasImageError ? (
                                                    <img 
                                                        src={profilePicture}
                                                        alt={participant.displayName || participant.name}
                                                        className="w-full h-full object-cover"
                                                        onError={() => handleImageError(participantId)}
                                                        crossOrigin="anonymous"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                        <User size={20} className="text-primary/50" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                       {/* User Info */}
<div>
    <div className="flex items-center gap-2 mb-1">
        <h3 className="font-medium text-primary">
            {participant.displayName || participant.name}
        </h3>
        {isCurrentUser && (
            <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">You</span>
        )}
    </div>
    <p className="text-sm text-secondary">
        @{participant.username || 'no-username'}
    </p>
</div>

                                    </div>
                                    
                                    {/* Stats */}
                                    <div className="text-right">
                                        <p className="font-semibold text-primary text-lg">
                                            {getPrimaryMetric(participant)}
                                        </p>
                                        <div className="text-xs text-secondary space-y-1">
                                            {secondaryStats.map((stat, statIndex) => (
                                                <p key={statIndex} className={`flex items-center justify-end gap-1 ${stat.className}`}>
                                                    {stat.icon}
                                                    {stat.value}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {/* Empty State for Single User */}
                {sortedParticipants.length === 1 && (
                    <div className="p-8 text-center border-t border-background">
                        <Trophy size={48} className="text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-primary mb-2">You're Leading!</h3>
                        <p className="text-secondary">
                            Add friends to compete in {activeLeaderboard === 'alltime' ? 'all-time' : activeLeaderboard} focus hours!
                        </p>
                    </div>
                )}

                {/* Leaderboard Footer Info */}
                <div className="p-4 bg-background/50 border-t border-background rounded-b-lg">
                    <div className="text-center text-xs text-secondary space-y-1">
                        {leaderboardInfo.resetInfo && <p>{leaderboardInfo.resetInfo}</p>}
                        <p>{leaderboardInfo.tipInfo}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
