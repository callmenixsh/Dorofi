// Pages/FriendProfile.jsx - WITH ACHIEVEMENT MODAL AND 50 ACHIEVEMENTS
import { useState, useEffect } from 'react';
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
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-secondary">Loading {username}'s profile...</div>
                </div>
            </div>
        );
    }

    // 🔥 POMODORO-STYLE ERROR PAGE with fixed navigation
    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    {/* Pomodoro Timer Icon */}
                    <div className="relative mx-auto mb-8 w-32 h-32">
                        <div className="w-32 h-32 rounded-full border-8 border-surface bg-surface/50 flex items-center justify-center relative">
                            <Timer className="w-16 h-16 text-secondary" />
                            {/* Tomato-style accent */}
                            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-accent rounded-full opacity-60"></div>
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 translate-x-1 w-2 h-1 bg-accent/80 rounded-full"></div>
                            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 -translate-x-1 w-2 h-1 bg-accent/80 rounded-full"></div>
                        </div>
                        {/* Crack effect */}
                        <div className="absolute top-8 left-8 w-1 h-16 bg-accent/30 transform rotate-12 rounded-full"></div>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-primary mb-4">This user doesn't exist</h1>
                    <p className="text-secondary text-lg mb-6">
                        The user <span className="text-accent font-medium">@{username}</span> could not be found.
                    </p>
                    <p className="text-secondary/70 text-sm mb-8">
                        They might have changed their username or their account doesn't exist.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={handleBackToFriends} // 🔥 FIXED: Use the new function
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

    // StatsOverview data (same as before...)
    const statsData = [
        {
            icon: Clock,
            label: "Total Focus Time", 
            value: formatTime(stats.totalFocusTime),
            color: "primary",
        },
        {
            icon: Target,
            label: "Total Sessions",
            value: stats.totalSessions || 0,
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
            value: `${stats.currentStreak || 0} days`,
            color: "accent",
        },
        {
            icon: Award,
            label: "Best Streak",
            value: `${stats.longestStreak || 0} days`,
            color: "primary",
        },
        {
            icon: Calendar,
            label: "Best Day",
            value: stats.bestDay?.focusTime ? formatDate(stats.bestDay.date) : "No record",
            color: "accent",
        },
        {
            icon: Trophy,
            label: "Achievements",
            value: achievements.length,
            color: "accent",
        },
        {
            icon: Zap,
            label: "Weekly Focus",
            value: formatTime(stats.weeklyFocusTime || 0),
            color: "primary",
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
                    
                    {/* 🔥 FIXED: Back Button with specific tab navigation */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={handleBackToFriends} // 🔥 FIXED: Use the new function
                            className="flex items-center space-x-2 text-secondary hover:text-primary transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Friends</span>
                        </button>
                        <div className="text-primary font-medium">
                            {profile.displayName || profile.name}'s Profile
                        </div>
                    </div>

                    {/* Profile Header */}
                    <div className="bg-surface rounded-lg p-6 mb-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Profile Picture */}
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-primary bg-background">
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
                                            <div className="w-full h-full bg-surface flex items-center justify-center">
                                                <User size={24} className="text-secondary" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* User Info */}
                                <div>
                                    {/* Display Name */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <h1 className="text-2xl font-bold text-primary">
                                            {profile.displayName || profile.name}
                                        </h1>
                                    </div>

                                    {/* Username */}
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-accent">
                                            @{profile.username}
                                        </p>
                                    </div>

                                    {/* Custom Status */}
                                    {profile.customStatus?.isActive && (
                                        <div className="flex items-center space-x-2 bg-background px-3 py-2 rounded-lg w-fit">
                                            <span className="text-lg">{profile.customStatus.emoji}</span>
                                            <span className="text-primary text-sm">{profile.customStatus.text}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview - Using your exact UI */}
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

                    {/* Achievements - Using your exact UI with modal */}
                    <div className="bg-surface rounded-lg p-6 mb-6">
                        {/* Header - osu! Style */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-primary" />
                                <h2 className="text-lg font-bold text-primary">Medals</h2>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="bg-background px-3 py-1 rounded-full">
                                    <span className="text-primary font-semibold">{totalEarned}</span>
                                    <span className="text-secondary mx-1">/</span>
                                    <span className="text-secondary">50</span>
                                </div>
                                {earnedSecrets.length > 0 && (
                                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-3 py-1 rounded-full border border-purple-500/30">
                                        <span className="text-purple-600 dark:text-purple-300 font-semibold text-xs">
                                            {earnedSecrets.length} secret{earnedSecrets.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Achievements Grid - osu! Circular Medal Layout */}
                        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
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
            {selectedAchievement && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-background rounded-lg shadow-xl w-full max-w-md border border-surface">
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-surface">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    selectedAchievement.earned
                                        ? selectedAchievement.isSecret
                                            ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30'
                                            : 'bg-primary/10 border-2 border-primary/20'
                                        : 'bg-background border-2 border-background'
                                }`}>
                                    {selectedAchievement.earned ? (
                                        <selectedAchievement.icon 
                                            size={24}
                                            className={selectedAchievement.isSecret ? 'text-purple-600 dark:text-purple-300' : 'text-primary'}
                                        />
                                    ) : (
                                        selectedAchievement.isSecret ? (
                                            <Lock size={24} className="text-gray-400" />
                                        ) : (
                                            <selectedAchievement.icon size={24} className="text-gray-400" />
                                        )
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-primary">
                                        {selectedAchievement.earned || !selectedAchievement.isSecret 
                                            ? selectedAchievement.name 
                                            : '???'
                                        }
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            selectedAchievement.isSecret
                                                ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300'
                                                : 'bg-primary/10 text-primary'
                                        }`}>
                                            {selectedAchievement.isSecret ? 'Secret' : selectedAchievement.category}
                                        </span>
                                        {selectedAchievement.earned && (
                                            <span className="text-xs text-green-600 bg-green-500/10 px-2 py-1 rounded-full">
                                                ✓ Earned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-secondary hover:text-primary transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {selectedAchievement.earned || !selectedAchievement.isSecret ? (
                                <>
                                    <p className="text-secondary mb-4">
                                        {getAchievementDetails(selectedAchievement.id).description}
                                    </p>
                                    <div className="bg-surface p-3 rounded-lg mb-4">
                                        <h4 className="text-sm font-medium text-primary mb-1">Requirement:</h4>
                                        <p className="text-sm text-secondary">
                                            {selectedAchievement.isSecret && selectedAchievement.earned 
                                                ? "Secret requirement completed!" 
                                                : getAchievementDetails(selectedAchievement.id).requirement
                                            }
                                        </p>
                                    </div>
                                    {selectedAchievement.earned && selectedAchievement.earnedAt && (
                                        <div className="bg-green-500/10 p-3 rounded-lg">
                                            <h4 className="text-sm font-medium text-green-600 mb-1">Earned On:</h4>
                                            <p className="text-sm text-green-600">
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
                                <div className="text-center py-4">
                                    <Lock size={48} className="text-gray-400 mx-auto mb-4" />
                                    <h4 className="text-lg font-medium text-primary mb-2">Secret Achievement</h4>
                                    <p className="text-secondary text-sm">
                                        This is a secret achievement. Complete it to reveal its details!
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-6 bg-surface/50 border-t border-surface rounded-b-lg">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
