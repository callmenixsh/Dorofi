// components/friends/LeaderboardTab.jsx
import { 
    Crown, Medal, Award, Trophy, User, Calendar, Clock, Globe, 
    BookOpen, Flame, BarChart3, Target, Sunrise, Zap, Star
} from 'lucide-react';
import { useState } from 'react';

export default function LeaderboardTab({ user, friends, loading }) {
    const [imageErrors, setImageErrors] = useState({});
    const [activeLeaderboard, setActiveLeaderboard] = useState('daily'); 

    // Combine user and friends
    const allParticipants = [user, ...friends].filter(participant => participant);

    // Enhanced sorting with proper tie-breaking: Time → Streak → Sessions
    const sortedParticipants = [...allParticipants].sort((a, b) => {
        let timeA, timeB, streakA, streakB, sessionsA, sessionsB;
        
        if (activeLeaderboard === 'daily') {
            timeA = a.stats?.dailyFocusTime || 0;
            timeB = b.stats?.dailyFocusTime || 0;
            streakA = a.stats?.currentStreak || 0;
            streakB = b.stats?.currentStreak || 0;
            sessionsA = a.stats?.dailySessions || 0;
            sessionsB = b.stats?.dailySessions || 0;
        } else if (activeLeaderboard === 'weekly') {
            timeA = a.stats?.weeklyFocusTime || 0;
            timeB = b.stats?.weeklyFocusTime || 0;
            streakA = a.stats?.currentStreak || 0;
            streakB = b.stats?.currentStreak || 0;
            sessionsA = a.stats?.weeklySessions || 0;
            sessionsB = b.stats?.weeklySessions || 0;
        } else {
            timeA = a.stats?.totalFocusTime || 0;
            timeB = b.stats?.totalFocusTime || 0;
            streakA = a.stats?.longestStreak || 0;
            streakB = b.stats?.longestStreak || 0;
            sessionsA = a.stats?.totalSessions || 0;
            sessionsB = b.stats?.totalSessions || 0;
        }

        // 1st priority: Focus time
        if (timeB !== timeA) {
            return timeB - timeA;
        }
        // 2nd priority: Streak
        if (streakB !== streakA) {
            return streakB - streakA;
        }
        // 3rd priority: Sessions
        if (sessionsB !== sessionsA) {
            return sessionsB - sessionsA;
        }
        // If all stats are equal, they have same rank (return 0)
        return 0;
    });

    // Calculate actual ranks with ties
    const participantsWithRanks = sortedParticipants.map((participant, index) => {
        let actualRank = 1;
        
        // Find actual rank by counting participants with better stats
        for (let i = 0; i < index; i++) {
            const prev = sortedParticipants[i];
            const curr = participant;
            
            let prevTime, currTime, prevStreak, currStreak, prevSessions, currSessions;
            
            if (activeLeaderboard === 'daily') {
                prevTime = prev.stats?.dailyFocusTime || 0;
                currTime = curr.stats?.dailyFocusTime || 0;
                prevStreak = prev.stats?.currentStreak || 0;
                currStreak = curr.stats?.currentStreak || 0;
                prevSessions = prev.stats?.dailySessions || 0;
                currSessions = curr.stats?.dailySessions || 0;
            } else if (activeLeaderboard === 'weekly') {
                prevTime = prev.stats?.weeklyFocusTime || 0;
                currTime = curr.stats?.weeklyFocusTime || 0;
                prevStreak = prev.stats?.currentStreak || 0;
                currStreak = curr.stats?.currentStreak || 0;
                prevSessions = prev.stats?.weeklySessions || 0;
                currSessions = curr.stats?.weeklySessions || 0;
            } else {
                prevTime = prev.stats?.totalFocusTime || 0;
                currTime = curr.stats?.totalFocusTime || 0;
                prevStreak = prev.stats?.longestStreak || 0;
                currStreak = curr.stats?.longestStreak || 0;
                prevSessions = prev.stats?.totalSessions || 0;
                currSessions = curr.stats?.totalSessions || 0;
            }
            
            // Check if previous participant has better stats
            if (prevTime > currTime || 
                (prevTime === currTime && prevStreak > currStreak) ||
                (prevTime === currTime && prevStreak === currStreak && prevSessions > currSessions)) {
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

// In your LeaderboardTab.jsx, replace the getRankStyling function:

// Check if participant has any stats in current category
const hasStats = (participant) => {
    if (activeLeaderboard === 'daily') {
        return (participant.stats?.dailyFocusTime || 0) > 0 || 
               (participant.stats?.currentStreak || 0) > 0 || 
               (participant.stats?.dailySessions || 0) > 0;
    } else if (activeLeaderboard === 'weekly') {
        return (participant.stats?.weeklyFocusTime || 0) > 0 || 
               (participant.stats?.currentStreak || 0) > 0 || 
               (participant.stats?.weeklySessions || 0) > 0;
    } else {
        return (participant.stats?.totalFocusTime || 0) > 0 || 
               (participant.stats?.longestStreak || 0) > 0 || 
               (participant.stats?.totalSessions || 0) > 0;
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

    const getSecondaryStats = (participant) => {
        if (activeLeaderboard === 'daily') {
            const currentStreak = participant.stats?.currentStreak || 0;
            const dailySessions = participant.stats?.dailySessions || 0;
            return [
                { 
                    icon: <BookOpen size={12} />, 
                    value: `${dailySessions} session${dailySessions !== 1 ? 's' : ''} today`,
                    className: 'text-secondary' 
                },
                { 
                    icon: <Flame size={12} className={currentStreak > 0 ? 'text-orange-500' : 'text-secondary'} />, 
                    value: `${currentStreak} day streak`,
                    className: currentStreak > 0 ? 'text-orange-500' : 'text-secondary'
                }
            ];
        } else if (activeLeaderboard === 'weekly') {
            const weeklySessions = participant.stats?.weeklySessions || 0;
            const goalPercent = Math.round(((participant.stats?.weeklyFocusTime || 0) / (participant.stats?.weeklyGoal || 300)) * 100);
            return [
                { 
                    icon: <BarChart3 size={12} />, 
                    value: `${weeklySessions} session${weeklySessions !== 1 ? 's' : ''} this week`,
                    className: 'text-secondary'
                },
                { 
                    icon: <Target size={12} className={goalPercent >= 100 ? 'text-green-500' : goalPercent >= 50 ? 'text-yellow-500' : 'text-secondary'} />, 
                    value: `${goalPercent}% of goal`,
                    className: goalPercent >= 100 ? 'text-green-500' : goalPercent >= 50 ? 'text-yellow-500' : 'text-secondary'
                }
            ];
        } else {
            const longestStreak = participant.stats?.longestStreak || 0;
            const totalSessions = participant.stats?.totalSessions || 0;
            return [
                { 
                    icon: <BookOpen size={12} />, 
                    value: `${totalSessions} total session${totalSessions !== 1 ? 's' : ''}`,
                    className: 'text-secondary'
                },
                { 
                    icon: <Star size={12} className={longestStreak > 0 ? 'text-purple-500' : 'text-secondary'} />, 
                    value: `${longestStreak} day best streak`,
                    className: longestStreak > 0 ? 'text-purple-500' : 'text-secondary'
                }
            ];
        }
    };

    const getLeaderboardInfo = () => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istTime = new Date(now.getTime() + istOffset);
        
        if (activeLeaderboard === 'daily') {
            const tomorrow = new Date(istTime);
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            
            const timeUntilReset = tomorrow.getTime() - istTime.getTime();
            const hoursLeft = Math.floor(timeUntilReset / (1000 * 60 * 60));
            const minutesLeft = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
            
            return {
                title: "Today's Focus Hours",
                resetInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Sunrise size={12} />
                        Resets in {hoursLeft}h {minutesLeft}m
                    </span>
                ),
                tipInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Zap size={12} />
                        Daily consistency builds lasting habits
                    </span>
                )
            };
        } else if (activeLeaderboard === 'weekly') {
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
                title: "This Week's Focus Hours", 
                resetInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Calendar size={12} />
                        Resets in {timeString}
                    </span>
                ),
                tipInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Target size={12} />
                        Weekly goals create momentum
                    </span>
                )
            };
        } else {
            return {
                title: "All-Time Focus Hours",
                tipInfo: (
                    <span className="flex items-center justify-center gap-1 text-secondary">
                        <Trophy size={12} />
                        Dedication over time shows true commitment
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
                                        {/* Rank Display - No badges, just icons for top 3 */}
                                        <div className="flex items-center justify-center w-10">
                                            {styling.icon || (
                                                <span className={`font-bold text-sm ${styling.textColor}`}>
                                                    #{styling.rankText}
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Profile Picture - No badge overlay */}
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
                                        <div className="text-xs space-y-1">
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

                {/* Leaderboard Footer Info */}
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
