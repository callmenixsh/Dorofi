// components/Profile/StatsOverview.jsx - Fixed to fetch dailySessions properly
import { Clock, Target, TrendingUp, Award, Calendar, BarChart3, Zap } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchUnifiedStats } from "../../store/slices/statsSlice";
import { useAuth } from "../../contexts/AuthContext";

export default function StatsOverview() {
    const dispatch = useDispatch();
    const { profile: profileStats, timer: timerStats, isLoading, error } = useSelector(state => state.stats || {});
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            dispatch(fetchUnifiedStats());
        }
    }, [user, dispatch]);

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        
        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${minutes}m`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "No date";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric'
        });
    };

    // Combine stats from both profile and timer sections
    const stats = {
        // Daily stats from timer
        dailyFocusTime: timerStats?.dailyFocusTime || 0,
        dailySessions: timerStats?.dailySessions || 0,
        currentStreak: timerStats?.currentStreak || 0,
        
        // Profile stats
        totalFocusTime: profileStats?.totalFocusTime || 0,
        totalSessions: profileStats?.totalSessions || 0,
        longestStreak: profileStats?.longestStreak || 0,
        averageSessionLength: profileStats?.averageSessionLength || 0,
        bestDay: profileStats?.bestDay || { date: null, focusTime: 0, sessions: 0 }
    };

    const statsData = [
        {
            icon: Clock,
            label: "Today's Focus",
            value: formatTime(stats.dailyFocusTime),
            color: "primary",
        },
        {
            icon: Zap,
            label: "Today's Sessions",
            value: stats.dailySessions,
            color: "accent",
        },
        {
            icon: Clock,
            label: "Total Focus Time", 
            value: formatTime(stats.totalFocusTime),
            color: "primary",
        },
        {
            icon: Target,
            label: "Total Sessions",
            value: stats.totalSessions,
            color: "secondary",
        },
        {
            icon: BarChart3,
            label: "Avg Session",
            value: formatTime(stats.averageSessionLength),
            color: "secondary",
        },
        {
            icon: TrendingUp,
            label: "Current Streak",
            value: `${stats.currentStreak} days`,
            color: "accent",
        },
        {
            icon: Award,
            label: "Best Streak",
            value: `${stats.longestStreak} days`,
            color: "primary",
        },
        {
            icon: Calendar,
            label: "Best Day",
            value: stats.bestDay?.focusTime ? formatDate(stats.bestDay.date) : "No record",
            color: "accent",
        },
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="bg-surface rounded-xl p-5 animate-pulse border border-background">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-background rounded-xl"></div>
                            <div className="flex-1">
                                <div className="h-4 w-20 bg-background rounded mb-2"></div>
                                <div className="h-6 w-16 bg-background rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="col-span-full bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-center">Failed to load stats: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, index) => (
                <div 
                    key={index} 
                    className="bg-surface rounded-xl p-5 hover:shadow-md transition-all duration-200 border border-background"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 bg-${stat.color}/10 rounded-xl`}>
                            <stat.icon size={22} className={`text-${stat.color}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-secondary font-medium mb-1">{stat.label}</p>
                            <p className="text-xl font-bold text-primary">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
