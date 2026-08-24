// Pages/FriendProfile.jsx - WITH ACHIEVEMENT MODAL AND 50 ACHIEVEMENTS
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Award, Clock, Target, TrendingUp, Trophy, BarChart3, Zap, Star, Calendar, MapPin, AlertCircle, Timer, X } from 'lucide-react';
import { useAuth } from "../contexts/AuthContext.jsx";
import apiService from '../services/api.js';

// Import your exact original UI components (same as before...)
import { 
    Target as TargetIcon, Rocket, Zap as ZapIcon, Award as AwardIcon, Dumbbell, Brain
    , Crown, Trophy as TrophyIcon, Diamond, Star as StarIcon, Flame, Clock as ClockIcon, 
    TrendingUp as TrendingUpIcon, User as UserIcon, Users, Timer as TimerIcon, Hourglass, Shield, 
    Medal, Sparkles, Calendar as CalendarIcon, Sword, Clover, Wind, Eye,
    Sun, Moon, Skull, Lock,
    Swords,
    RailSymbol,
    TrainTrack,
    ClubIcon,
    FlameKindling,
    FireExtinguisher
} from "lucide-react";
import { 
    FaFire, FaBolt, FaGem, FaCrown, FaHeart, FaMagic,FaInfinity,
    FaPhoenixFramework, 
} from "react-icons/fa";
import {
     GiMagicSwirl, GiCrystalBall,
    GiFireBowl,GiAtom,
    GiFoundryBucket,
    GiFlameClaws,
} from "react-icons/gi";
import { BsThunderbolt } from "react-icons/bs";
import { HiLightningBolt } from "react-icons/hi";

export default function FriendProfile() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        
        if (username) {
            fetchProfile();
        }
    }, [username, isAuthenticated, navigate]);

    const fetchProfile = async () => {
        console.log('🔍 Fetching friend profile for username:', username);
        try {
            setLoading(true);
            setError(null);
            setImageError(false);
            
            const response = await apiService.getUserStatsByUsername(username);
            console.log('✅ Friend profile response:', response);
            
            setProfile({
                ...response.user,
                stats: response.stats
            });
        } catch (err) {
            console.error('❌ Error fetching friend profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 🔥 NEW: Achievement details with 50 achievements
    const getAchievementDetails = (id) => {
        const details = {
            // BEGINNER CATEGORY
            1: { description: "Complete your very first focus session", requirement: "Complete 1 focus session" },
            2: { description: "You're getting the hang of this!", requirement: "Complete 5 focus sessions" },
            3: { description: "Building a solid foundation for productivity", requirement: "Complete 10 focus sessions" },
            4: { description: "You're on the right track to success", requirement: "Complete 15 focus sessions" },
            5: { description: "Commitment is the first step to mastery", requirement: "Complete 20 focus sessions" },

            // SESSIONS CATEGORY
            6: { description: "Your dedication is starting to show", requirement: "Complete 25 focus sessions" },
            7: { description: "A sharp mind is your greatest tool", requirement: "Complete 50 focus sessions" },
            8: { description: "Welcome to the exclusive 100 sessions club!", requirement: "Complete 100 focus sessions" },
            9: { description: "You've mastered the art of focused sessions", requirement: "Complete 200 focus sessions" },
            10: { description: "A true veteran of the focus game", requirement: "Complete 300 focus sessions" },
            11: { description: "Elite level focus and determination", requirement: "Complete 400 focus sessions" },
            12: { description: "Legendary status in the world of productivity", requirement: "Complete 500 focus sessions" },
            13: { description: "You rule the realm of focused work", requirement: "Complete 750 focus sessions" },
            14: { description: "The ultimate achievement in focus mastery", requirement: "Complete 1000 focus sessions" },
            15: { description: "Godlike focus powers have been unlocked", requirement: "Complete 1500 focus sessions" },

            // TIME CATEGORY
            16: { description: "Your first hour of focused work!", requirement: "Focus for 1 total hour" },
            17: { description: "Time invested wisely in your growth", requirement: "Focus for 5 total hours" },
            18: { description: "You've run a marathon of focus!", requirement: "Focus for 10 total hours" },
            19: { description: "Master of time and attention", requirement: "Focus for 20 total hours" },
            20: { description: "A warrior in the battle against distraction", requirement: "Focus for 30 total hours" },
            21: { description: "Time bends to your focused will", requirement: "Focus for 50 total hours" },
            22: { description: "Champion of sustained concentration", requirement: "Focus for 75 total hours" },
            23: { description: "Wisdom comes from dedicated focus", requirement: "Focus for 100 total hours" },
            24: { description: "You reign supreme over your attention", requirement: "Focus for 150 total hours" },
            25: { description: "Immortal dedication to focused work", requirement: "Focus for 200 total hours" },

            // STREAK CATEGORY
            26: { description: "Every journey begins with consistency", requirement: "Maintain a 3-day focus streak" },
            27: { description: "Consistency is your superpower", requirement: "Maintain a 7-day focus streak" },
            28: { description: "A warrior's discipline shows in daily practice", requirement: "Maintain a 14-day focus streak" },
            29: { description: "Master of monthly consistency", requirement: "Maintain a 30-day focus streak" },
            30: { description: "The crown belongs to the consistent", requirement: "Maintain a 50-day focus streak" },
            31: { description: "Your streak has become the stuff of legends", requirement: "Maintain a 75-day focus streak" },
            32: { description: "Nothing can stop your momentum now", requirement: "Maintain a 100-day focus streak" },
            33: { description: "Your consistency transcends mortality", requirement: "Maintain a 150-day focus streak" },

            // ACHIEVEMENT CATEGORY
            34: { description: "The thrill of the hunt for achievements", requirement: "Earn 10 achievements" },
            35: { description: "A fine collection of badges", requirement: "Earn 20 achievements" },
            36: { description: "Master collector of trophies", requirement: "Earn 30 achievements" },
            37: { description: "Lord of all achievements", requirement: "Earn 40 achievements" },
            38: { description: "The perfect collector - every achievement earned", requirement: "Earn all 50 achievements" },

            // SOCIAL CATEGORY
            39: { description: "Spreading your wings in the community", requirement: "Add 5 friends" },
            40: { description: "Building your circle of focus friends", requirement: "Add 10 friends" },
            41: { description: "Leading by example in the community", requirement: "Add 25 friends" },

            // SECRET ACHIEVEMENTS
            101: { description: "The night is your domain of focus", requirement: "Secret achievement" },
            102: { description: "Rising with the sun to focus", requirement: "Secret achievement" },
            103: { description: "Weekend dedication sets you apart", requirement: "Secret achievement" },
            104: { description: "Perfection in every focused moment", requirement: "Secret achievement" },
            105: { description: "Lucky number seven brings fortune", requirement: "Secret achievement" },
            106: { description: "Speed and efficiency combined", requirement: "Secret achievement" },
            107: { description: "Hidden depths of concentration", requirement: "Secret achievement" },
            108: { description: "Triple the power, triple the focus", requirement: "Secret achievement" },
            109: { description: "A phantom in the realm of focus", requirement: "Secret achievement" },
        };
        return details[id] || { description: "Mystery achievement", requirement: "Unknown requirement" };
    };

    // 🔥 FIXED: Navigate back to friends tab specifically
    const handleBackToFriends = () => {
        navigate('/friends?tab=friends');
    };

    // 🔥 NEW: Handle achievement click
    const handleAchievementClick = (achievement) => {
        setSelectedAchievement(achievement);
    };

    // 🔥 NEW: Close modal
    const closeModal = () => {
        setSelectedAchievement(null);
    };

    // Helper functions
    const getHighResProfilePicture = (googlePicture) => {
        if (!googlePicture) return null;
        return googlePicture
            .replace("s96-c", "s400-c")
            .replace("=s96", "=s400")
            .replace("sz=50", "sz=400");
    };

    const formatTime = (minutes) => {
        if (!minutes) return '0m';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center space-x-3">
                        <div className="h-5 w-5 bg-surface rounded animate-pulse" />
                        <div className="h-4 w-32 bg-surface rounded animate-pulse" />
                        <div className="h-4 w-40 bg-surface rounded animate-pulse ml-4" />
                    </div>

                    <div className="bg-surface rounded-lg p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-background animate-pulse" />
                            <div className="space-y-3">
                                <div className="h-7 w-48 bg-background rounded animate-pulse" />
                                <div className="h-4 w-32 bg-background rounded animate-pulse" />
                                <div className="h-8 w-40 bg-background rounded-lg animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div key={i} className="bg-surface rounded-xl p-5 border border-background">
                                <div className="flex items-center gap-4">
                                    <div className="w-11 h-11 bg-background rounded-xl animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3 w-20 bg-background rounded animate-pulse" />
                                        <div className="h-5 w-16 bg-background rounded animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-surface rounded-lg p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-background rounded animate-pulse" />
                                <div className="h-5 w-20 bg-background rounded animate-pulse" />
                            </div>
                            <div className="h-6 w-16 bg-background rounded-full animate-pulse" />
                        </div>
                        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                <div key={i} className="aspect-square rounded-full bg-background animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-full bg-surface flex items-center justify-center mx-auto mb-6">
                        <User size={36} className="text-secondary" />
                    </div>

                    <h1 className="text-2xl font-bold text-primary mb-2">User not found</h1>
                    <p className="text-secondary mb-1">
                        The user <span className="text-primary font-medium">@{username}</span> could not be found.
                    </p>
                    <p className="text-secondary/60 text-sm mb-8">
                        They might have changed their username or their account doesn't exist.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleBackToFriends}
                            className="bg-primary text-background px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={18} />
                            Back to Friends
                        </button>
                        <button
                            onClick={() => fetchProfile()}
                            className="bg-surface text-primary px-6 py-3 rounded-xl hover:bg-surface/80 transition-colors font-medium border border-primary/20 hover:border-primary/40"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-secondary">Profile not found</p>
            </div>
        );
    }

    const stats = profile.stats || {};
    const achievements = profile.achievements || [];

    // StatsOverview data
    const statsData = [
        {
            icon: Clock,
            label: "Total Focus Time", 
            value: formatTime(stats.totalFocusTime),
            iconClass: "text-primary",
            bgClass: "bg-primary/10",
        },
        {
            icon: Target,
            label: "Total Sessions",
            value: stats.totalSessions || 0,
            iconClass: "text-secondary",
            bgClass: "bg-secondary/10",
        },
        {
            icon: BarChart3,
            label: "Avg Session",
            value: formatTime(stats.averageSessionLength),
            iconClass: "text-secondary",
            bgClass: "bg-secondary/10",
        },
        {
            icon: TrendingUp,
            label: "Current Streak",
            value: `${stats.currentStreak || 0} days`,
            iconClass: "text-orange-500",
            bgClass: "bg-orange-500/10",
        },
        {
            icon: Award,
            label: "Best Streak",
            value: `${stats.longestStreak || 0} days`,
            iconClass: "text-primary",
            bgClass: "bg-primary/10",
        },
        {
            icon: Calendar,
            label: "Best Day",
            value: stats.bestDay?.focusTime ? formatDate(stats.bestDay.date) : "No record",
            iconClass: "text-accent",
            bgClass: "bg-accent/10",
        },
        {
            icon: Trophy,
            label: "Achievements",
            value: achievements.length,
            iconClass: "text-yellow-500",
            bgClass: "bg-yellow-500/10",
        },
        {
            icon: Zap,
            label: "Weekly Focus",
            value: formatTime(stats.weeklyFocusTime || 0),
            iconClass: "text-primary",
            bgClass: "bg-primary/10",
        },
    ];

    // Achievement definitions (same as before...)
    const allAchievements = [
        { id: 1, name: "First Steps", icon: TargetIcon, category: "beginner" },
        { id: 2, name: "Getting Started", icon: Rocket, category: "beginner" },
        { id: 3, name: "Building Momentum", icon: ZapIcon, category: "beginner" },
        { id: 4, name: "On Track", icon: TrainTrack, category: "beginner" },
        { id: 5, name: "Committed Beginner", icon: AwardIcon, category: "beginner" },
        { id: 6, name: "Dedicated", icon: Dumbbell, category: "sessions" },
        { id: 7, name: "Focused Mind", icon: Brain, category: "sessions" },
        { id: 8, name: "Century Club", icon: ClubIcon, category: "sessions" },
        { id: 9, name: "Session Master", icon: Crown, category: "sessions" },
        { id: 10, name: "Focus Veteran", icon: TrophyIcon, category: "sessions" },
        { id: 11, name: "Elite Focuser", icon: Diamond, category: "sessions" },
        { id: 12, name: "Focus Legend", icon: StarIcon, category: "sessions" },
        { id: 13, name: "Session Overlord", icon: FaFire, category: "sessions" },
        { id: 14, name: "Ultimate Focus", icon: FaBolt, category: "sessions" },
        { id: 15, name: "Focus God", icon: FaGem, category: "sessions" },
        { id: 16, name: "First Hour", icon: ClockIcon, category: "time" },
        { id: 17, name: "Time Investment", icon: TrendingUpIcon, category: "time" },
        { id: 18, name: "Focus Marathon", icon: UserIcon, category: "time" },
        { id: 19, name: "Time Master", icon: TimerIcon, category: "time" },
        { id: 20, name: "Focus Warrior", icon: Sword, category: "time" },
        { id: 21, name: "Time Lord", icon: Hourglass, category: "time" },
        { id: 22, name: "Focus Champion", icon: Medal, category: "time" },
        { id: 23, name: "Time Sage", icon: FaMagic, category: "time" },
        { id: 24, name: "Focus Emperor", icon: FaCrown, category: "time" },
        { id: 25, name: "Time Immortal", icon: FaInfinity, category: "time" },
        { id: 26, name: "Streak Starter", icon: Flame, category: "streak" },
        { id: 27, name: "Consistent", icon: BsThunderbolt, category: "streak" },
        { id: 28, name: "Week Warrior", icon: Swords, category: "streak" },
        { id: 29, name: "Monthly Master", icon: CalendarIcon, category: "streak" },
        { id: 30, name: "Consistency King", icon: FlameKindling, category: "streak" },
        { id: 31, name: "Streak Legend", icon: FireExtinguisher, category: "streak" },
        { id: 32, name: "Unstoppable", icon: HiLightningBolt, category: "streak" },
        { id: 33, name: "Streak Immortal", icon: GiCrystalBall, category: "streak" },
        { id: 34, name: "Achievement Hunter", icon: TargetIcon, category: "achievement" },
        { id: 35, name: "Badge Collector", icon: Medal, category: "achievement" },
        { id: 36, name: "Trophy Master", icon: TrophyIcon, category: "achievement" },
        { id: 37, name: "Achievement Lord", icon: Crown, category: "achievement" },
        { id: 38, name: "Perfect Collector", icon: Diamond, category: "achievement" },
        { id: 39, name: "Social Butterfly", icon: FaHeart, category: "social" },
        { id: 40, name: "Friend Circle", icon: Users, category: "social" },
        { id: 41, name: "Community Leader", icon: Crown, category: "social" },
        { id: 101, name: "Night Owl", icon: Moon, category: "secret", isSecret: true },
        { id: 102, name: "Early Bird", icon: Sun, category: "secret", isSecret: true },
        { id: 103, name: "Weekend Warrior", icon: GiFireBowl, category: "secret", isSecret: true },
        { id: 104, name: "Perfectionist", icon: Sparkles, category: "secret", isSecret: true },
        { id: 105, name: "Lucky Seven", icon: Clover, category: "secret", isSecret: true },
        { id: 106, name: "Speed Runner", icon: Wind, category: "secret", isSecret: true },
        { id: 107, name: "Hidden Focus", icon: Eye, category: "secret", isSecret: true },
        { id: 108, name: "Triple Threat", icon: GiAtom, category: "secret", isSecret: true },
        { id: 109, name: "Focus Phantom", icon: Skull, category: "secret", isSecret: true },
    ];

    // Map achievements with earned status
    const earnedIds = new Set((achievements || []).map(a => a.achievementId));
    const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement,
        earned: earnedIds.has(achievement.id),
        earnedAt: achievements.find(a => a.achievementId === achievement.id)?.earnedAt
    }));

    const secretAchievements = achievementsWithStatus.filter(a => a.isSecret);
    const earnedSecrets = secretAchievements.filter(a => a.earned);
    const totalEarned = achievementsWithStatus.filter(a => a.earned).length;

    return (
        <>
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto space-y-8">
                    
                    {/* Back Button */}
                    <button
                        onClick={handleBackToFriends}
                        className="flex items-center gap-2 text-secondary hover:text-primary bg-surface hover:bg-surface/80 px-4 py-2 rounded-xl transition-all text-sm font-medium w-fit"
                    >
                        <ArrowLeft size={16} />
                        Back to Friends
                    </button>

                    {/* Profile Header */}
                    <div className="bg-surface rounded-2xl overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-primary/20 to-accent/20" />
                        <div className="px-6 pb-6 -mt-10">
                            <div className="flex items-end gap-5 mb-5">
                                <div className="relative">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-surface bg-background shadow-lg">
                                        {profile.picture && !imageError ? (
                                            <img
                                                src={getHighResProfilePicture(profile.picture)}
                                                alt={profile.displayName || profile.name}
                                                className="w-full h-full object-cover"
                                                onError={() => setImageError(true)}
                                                onLoad={() => setImageError(false)}
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                <User size={32} className="text-primary/50" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="pb-1">
                                    <h1 className="text-2xl font-bold text-primary">
                                        {profile.displayName || profile.name}
                                    </h1>
                                    <p className="text-secondary">
                                        @{profile.username}
                                    </p>
                                </div>
                            </div>

                            {profile.customStatus?.isActive && (
                                <div className="inline-flex items-center gap-2 bg-background px-3 py-2 rounded-lg">
                                    <span className="text-lg">{profile.customStatus.emoji}</span>
                                    <span className="text-primary text-sm">{profile.customStatus.text}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {statsData.map((stat, index) => (
                            <div 
                                key={index} 
                                className="bg-surface rounded-xl p-4 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 ${stat.bgClass} rounded-xl`}>
                                        <stat.icon size={20} className={stat.iconClass} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-secondary font-medium truncate">{stat.label}</p>
                                        <p className="text-lg font-bold text-primary">{stat.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Achievements */}
                    <div className="bg-surface rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-primary/20 rounded-xl">
                                    <Trophy size={20} className="text-primary" />
                                </div>
                                <h2 className="text-lg font-bold text-primary">Medals</h2>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <div className="bg-background px-3 py-1.5 rounded-full">
                                    <span className="text-primary font-semibold">{totalEarned}</span>
                                    <span className="text-secondary mx-1">/</span>
                                    <span className="text-secondary">50</span>
                                </div>
                                {earnedSecrets.length > 0 && (
                                    <div className="bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
                                        <span className="text-purple-500 font-semibold text-xs">
                                            {earnedSecrets.length} secret{earnedSecrets.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
                            {achievementsWithStatus.map((achievement) => {
                                const IconComponent = achievement.icon;
                                return (
                                    <div 
                                        key={achievement.id} 
                                        // 🔥 NEW: Add click handler
                                        onClick={() => handleAchievementClick(achievement)}
                                        className={`aspect-square rounded-full p-3 text-center transition-all duration-300 cursor-pointer relative group overflow-hidden ${
                                            achievement.earned 
                                                ? achievement.isSecret
                                                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 shadow-lg hover:shadow-purple-500/40 hover:scale-110'
                                                    : 'bg-primary/10 border-2 border-primary/20 shadow-sm hover:shadow-md hover:scale-110'
                                                : 'bg-background border-2 border-background opacity-40 hover:opacity-60 hover:scale-105'
                                        }`}
                                        title={
                                            achievement.earned 
                                                ? `${achievement.name} - ${achievement.isSecret ? 'Secret Achievement!' : 'Earned'} ${achievement.earnedAt ? new Date(achievement.earnedAt).toLocaleDateString() : ''}`
                                                : achievement.isSecret 
                                                    ? 'Secret Achievement - ???'
                                                    : `${achievement.name} - Not yet earned`
                                        }
                                    >
                                        {/* Medal Icon */}
                                        <div className="flex items-center justify-center h-full">
                                            {achievement.earned ? (
                                                <IconComponent 
                                                    size={20}
                                                    className={`transition-all duration-300 group-hover:scale-125 ${
                                                        achievement.isSecret 
                                                            ? 'text-purple-600 dark:text-purple-300' 
                                                            : 'text-primary'
                                                    }`}
                                                />
                                            ) : (
                                                achievement.isSecret ? (
                                                    <Lock size={20} className="text-gray-400" />
                                                ) : (
                                                    <IconComponent size={20} className="text-gray-400 opacity-50" />
                                                )
                                            )}
                                        </div>

                                        {/* Achievement name tooltip on hover */}
                                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-background text-primary text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-30 pointer-events-none border border-primary/20">
                                            {achievement.earned 
                                                ? achievement.name 
                                                : achievement.isSecret 
                                                    ? '???' 
                                                    : achievement.name
                                            }
                                            {achievement.earned && achievement.earnedAt && (
                                                <div className="text-secondary text-xs">
                                                    {new Date(achievement.earnedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔥 NEW: Achievement Details Modal */}
            {selectedAchievement && createPortal(
                <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-backdrop-in" onClick={closeModal}>
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-primary/20 relative animate-modal-in" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                    selectedAchievement.earned
                                        ? selectedAchievement.isSecret
                                            ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                            : 'bg-gradient-to-br from-primary to-primary/60'
                                        : 'bg-surface/80 border border-surface'
                                }`}>
                                    {selectedAchievement.earned ? (
                                        <selectedAchievement.icon 
                                            size={24}
                                            className="text-background"
                                        />
                                    ) : (
                                        selectedAchievement.isSecret ? (
                                            <Lock size={24} className="text-secondary" />
                                        ) : (
                                            <selectedAchievement.icon size={24} className="text-secondary" />
                                        )
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-primary">
                                        {selectedAchievement.earned || !selectedAchievement.isSecret 
                                            ? selectedAchievement.name 
                                            : '???'
                                        }
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                            selectedAchievement.isSecret
                                                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30'
                                                : 'bg-primary/10 text-primary border border-primary/20'
                                        }`}>
                                            {selectedAchievement.isSecret ? 'Secret' : selectedAchievement.category}
                                        </span>
                                        {selectedAchievement.earned && (
                                            <span className="text-xs text-green-600 dark:text-green-400 bg-green-500/10 px-2.5 py-0.5 rounded-full font-medium border border-green-500/20">
                                                ✓ Earned
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="rounded-full p-2 hover:bg-surface/80 transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={20} className="text-secondary hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 sm:p-8 space-y-4">
                            {selectedAchievement.earned || !selectedAchievement.isSecret ? (
                                <>
                                    <p className="text-secondary text-sm leading-relaxed">
                                        {getAchievementDetails(selectedAchievement.id).description}
                                    </p>
                                    <div className="bg-surface/50 border border-surface p-4 rounded-xl">
                                        <h4 className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Requirement</h4>
                                        <p className="text-sm text-secondary">
                                            {selectedAchievement.isSecret && selectedAchievement.earned 
                                                ? "Secret requirement completed!" 
                                                : getAchievementDetails(selectedAchievement.id).requirement
                                            }
                                        </p>
                                    </div>
                                    {selectedAchievement.earned && selectedAchievement.earnedAt && (
                                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                                            <h4 className="text-xs font-bold text-green-600 dark:text-green-400 mb-1 uppercase tracking-wider">Earned On</h4>
                                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                {new Date(selectedAchievement.earnedAt).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-6">
                                    <Lock size={40} className="text-secondary/50 mx-auto mb-3" />
                                    <h4 className="text-lg font-bold text-primary mb-1">Secret Achievement</h4>
                                    <p className="text-secondary text-sm">
                                        Complete it to reveal its details!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
