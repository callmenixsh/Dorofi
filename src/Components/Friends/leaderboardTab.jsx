// components/friends/LeaderboardTab.jsx - FIXED IST TIMEZONE COUNTDOWN
import { 
    Crown, Medal, Award, Trophy, User, Calendar, Clock, Globe, 
    Flame, Target, Star
} from 'lucide-react';
import { useState } from 'react';

export default function LeaderboardTab({ user, friends, loading }) {
    const [imageErrors, setImageErrors] = useState({});
    const [activeLeaderboard, setActiveLeaderboard] = useState('daily'); 

    // 🔥 FIXED: Helper function to get IST time (GMT+5:30)
// 🔥 FIXED: Get IST time correctly without adding offset to local time
const getISTTime = () => {
    // Create a date in IST timezone directly
    return new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
};

    // Combine user and friends
    const allParticipants = [user, ...friends].filter(participant => participant);

    // Enhanced sorting with proper tie-breaking: Time → Streak/Goal% → Sessions
    const sortedParticipants = [...allParticipants].sort((a, b) => {
        let timeA, timeB, secondaryA, secondaryB;
        
        if (activeLeaderboard === 'daily') {
            timeA = a.stats?.dailyFocusTime || 0;
            timeB = b.stats?.dailyFocusTime || 0;
            secondaryA = a.stats?.currentStreak || 0;
            secondaryB = b.stats?.currentStreak || 0;
        } else if (activeLeaderboard === 'weekly') {
            timeA = a.stats?.weeklyFocusTime || 0;
            timeB = b.stats?.weeklyFocusTime || 0;
            // Goal progress as secondary metric
            const goalA = a.stats?.weeklyGoal || 300;
            const goalB = b.stats?.weeklyGoal || 300;
            secondaryA = goalA > 0 ? (timeA / goalA) * 100 : 0;
            secondaryB = goalB > 0 ? (timeB / goalB) * 100 : 0;
        } else {
            timeA = a.stats?.totalFocusTime || 0;
            timeB = b.stats?.totalFocusTime || 0;
            secondaryA = a.stats?.longestStreak || 0;
            secondaryB = b.stats?.longestStreak || 0;
        }

        // 1st priority: Focus time
        if (timeB !== timeA) {
            return timeB - timeA;
        }
        // 2nd priority: Secondary metric (streak or goal%)
        if (secondaryB !== secondaryA) {
            return secondaryB - secondaryA;
        }
        // If all stats are equal, they have same rank
        return 0;
    });

    // Calculate actual ranks with ties
    const participantsWithRanks = sortedParticipants.map((participant, index) => {
        let actualRank = 1;
        
        // Find actual rank by counting participants with better stats
        for (let i = 0; i < index; i++) {
            const prev = sortedParticipants[i];
            const curr = participant;
            
            let prevTime, currTime, prevSecondary, currSecondary;
            
            if (activeLeaderboard === 'daily') {
                prevTime = prev.stats?.dailyFocusTime || 0;
                currTime = curr.stats?.dailyFocusTime || 0;
                prevSecondary = prev.stats?.currentStreak || 0;
                currSecondary = curr.stats?.currentStreak || 0;
            } else if (activeLeaderboard === 'weekly') {
                prevTime = prev.stats?.weeklyFocusTime || 0;
                currTime = curr.stats?.weeklyFocusTime || 0;
                const prevGoal = prev.stats?.weeklyGoal || 300;
                const currGoal = curr.stats?.weeklyGoal || 300;
                prevSecondary = prevGoal > 0 ? (prevTime / prevGoal) * 100 : 0;
                currSecondary = currGoal > 0 ? (currTime / currGoal) * 100 : 0;
            } else {
                prevTime = prev.stats?.totalFocusTime || 0;
                currTime = curr.stats?.totalFocusTime || 0;
                prevSecondary = prev.stats?.longestStreak || 0;
                currSecondary = curr.stats?.longestStreak || 0;
            }
            
            // Check if previous participant has better stats
            if (prevTime > currTime || 
                (prevTime === currTime && prevSecondary > currSecondary)) {
                actualRank++;
            }
        }
        
        return { ...participant, rank: actualRank };
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

    // Check if participant has any stats in current category
    const hasStats = (participant) => {
        if (activeLeaderboard === 'daily') {
            return (participant.stats?.dailyFocusTime || 0) > 0 || 
                   (participant.stats?.currentStreak || 0) > 0;
        } else if (activeLeaderboard === 'weekly') {
            return (participant.stats?.weeklyFocusTime || 0) > 0;
        } else {
            return (participant.stats?.totalFocusTime || 0) > 0 || 
                   (participant.stats?.longestStreak || 0) > 0;
        }
    };

    // Updated ranking system - only medals for users with stats
    const getRankStyling = (rank, participant) => {
        // If user has no stats, show serial number regardless of rank
        if (!hasStats(participant)) {
            return {
                bgColor: 'bg-transparent border-transparent hover:bg-surface/50',
                textColor: 'text-secondary',
                icon: null,
                rankText: `${rank}`,
                profileBorder: 'border-primary/20'
            };
        }
        
        // Only give medals to users with stats
        switch (rank) {
            case 1: return {
                bgColor: 'bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border border-yellow-400/30',
                textColor: 'text-yellow-600',
                icon: <Crown size={18} className="text-yellow-500 drop-shadow-sm" />,
                rankText: '1st',
                profileBorder: 'border-yellow-400/50'
            };
            case 2: return {
                bgColor: 'bg-gradient-to-r from-slate-300/10 to-gray-400/10 border border-slate-300/30',
                textColor: 'text-slate-600',
                icon: <Medal size={18} className="text-slate-500 drop-shadow-sm" />,
                rankText: '2nd',
                profileBorder: 'border-slate-300/50'
            };
            case 3: return {
                bgColor: 'bg-gradient-to-r from-amber-600/10 to-orange-500/10 border border-amber-600/30',
                textColor: 'text-amber-600',
                icon: <Award size={18} className="text-amber-600 drop-shadow-sm" />,
                rankText: '3rd',
                profileBorder: 'border-amber-500/50'
            };
            default: return {
                bgColor: 'bg-transparent border-transparent hover:bg-surface/50',
                textColor: 'text-secondary',
                icon: null,
                rankText: `${rank}`,
                profileBorder: 'border-primary/20'
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

    // 🔥 UPDATED - Optimal secondary stats for each category
    const getSecondaryStats = (participant) => {
        if (activeLeaderboard === 'daily') {
            // Daily: Focus Time + Current Streak
            const currentStreak = participant.stats?.currentStreak || 0;
            return [
                { 
                    icon: <Flame size={12} className={currentStreak > 0 ? 'text-orange-500' : 'text-secondary'} />, 
                    value: `${currentStreak} day streak`,
                    className: currentStreak > 0 ? 'text-orange-500' : 'text-secondary'
                }
            ];
        } else if (activeLeaderboard === 'weekly') {
            // Weekly: Focus Time + Goal Progress %
            const weeklyTime = participant.stats?.weeklyFocusTime || 0;
            const weeklyGoal = participant.stats?.weeklyGoal || 300;
            const goalPercent = Math.round((weeklyTime / weeklyGoal) * 100);
            return [
                { 
                    icon: <Target size={12} className={goalPercent >= 100 ? 'text-green-500' : goalPercent >= 50 ? 'text-yellow-500' : 'text-secondary'} />, 
                    value: `${goalPercent}% of goal`,
                    className: goalPercent >= 100 ? 'text-green-500' : goalPercent >= 50 ? 'text-yellow-500' : 'text-secondary'
                }
            ];
        } else {
            // All-time: Total Focus Time + Longest Streak
            const longestStreak = participant.stats?.longestStreak || 0;
            return [
                { 
                    icon: <Star size={12} className={longestStreak > 0 ? 'text-purple-500' : 'text-secondary'} />, 
                    value: `${longestStreak} day best streak`,
                    className: longestStreak > 0 ? 'text-purple-500' : 'text-secondary'
                }
            ];
        }
    };

    // 🔥 FIXED: Use IST timezone for countdown calculations
    const getLeaderboardInfo = () => {
        const istTime = getISTTime(); // Use IST instead of local time
        
        if (activeLeaderboard === 'daily') {
            // Calculate next day reset at midnight IST
            const tomorrow = new Date(istTime);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeUntilReset = tomorrow.getTime() - istTime.getTime();
            const hoursLeft = Math.floor(timeUntilReset / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            
            return {
                title: "Today's Focus Battle",
                resetInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Clock size={12} />
                        Resets in {hoursLeft}h {minutesLeft}m (IST)
                    </span>
                ),
                tipInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Flame size={12} />
                        Build your streak with daily focus
                    </span>
                )
            };
        } else if (activeLeaderboard === 'weekly') {
            // Calculate next Monday at midnight IST
            const nextMonday = new Date(istTime);
            const daysUntilMonday = (8 - nextMonday.getDay()) % 7;
            const actualDaysUntilMonday = daysUntilMonday === 0 ? 7 : daysUntilMonday;
            
            nextMonday.setDate(nextMonday.getDate() + actualDaysUntilMonday);
            nextMonday.setHours(0, 0, 0, 0);
            
            const timeUntilReset = nextMonday.getTime() - istTime.getTime();
            const daysLeft = Math.floor(timeUntilReset / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((timeUntilReset % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            let timeString = daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h` : `${hoursLeft}h`;
            
            return {
                title: "Weekly Challenge", 
                resetInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Calendar size={12} />
                        Resets in {timeString} (IST)
                    </span>
                ),
                tipInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Target size={12} />
                        Crush your weekly goals together
                    </span>
                )
            };
        } else {
            return {
                title: "Hall of Fame",
                tipInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Star size={12} />
                        The ultimate measure of dedication
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

    if (participantsWithRanks.length === 0) {
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
                    {participantsWithRanks.map((participant, index) => {
                        const styling = getRankStyling(participant.rank, participant);
                        const isCurrentUser = participant.id === user?.id || participant.email === user?.email;
                        const participantId = participant.id || participant.email;
                        const hasImageError = imageErrors[participantId];
                        const profilePicture = getHighResProfilePicture(participant.picture);
                        const secondaryStats = getSecondaryStats(participant);
                        
                        return (
                            <div 
                                key={participantId}
                                className={`rounded-lg p-4 transition-all hover:shadow-md ${styling.bgColor} ${
                                    isCurrentUser ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Rank Display */}
                                        <div className="flex items-center justify-center w-10">
                                            {styling.icon || (
                                                <span className={`font-bold text-sm ${styling.textColor}`}>
                                                    #{styling.rankText}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Profile Picture */}
                                        <div className="relative">
                                            <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${styling.profileBorder} bg-surface`}>
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
                                                    <span className="text-xs bg-primary text-background px-2 py-1 rounded-full">You</span>
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
                                        <div className="text-xs space-y-1 mt-1">
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
                {participantsWithRanks.length === 1 && (
                    <div className="p-8 text-center border-t border-background">
                        <Trophy size={48} className="text-secondary mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-primary mb-2">You're Leading!</h3>
                        <p className="text-secondary">
                            Add friends to compete in {activeLeaderboard === 'alltime' ? 'all-time' : activeLeaderboard} focus hours!
                        </p>
                    </div>
                )}

                {/* 🔥 FIXED: Leaderboard Footer Info with IST timezone */}
                <div className="p-4 bg-background/50 border-t border-background rounded-b-lg">
                    <div className="text-center text-xs space-y-1">
                        {leaderboardInfo.resetInfo && <p>{leaderboardInfo.resetInfo}</p>}
                        <p>{leaderboardInfo.tipInfo}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
