// components/Profile/Achievements.jsx - WITH ACHIEVEMENT MODAL
import { useEffect, useState } from "react";
import apiService from "../../services/api";
import { 
    // Lucide icons
    Target, Rocket, Zap, Award, Dumbbell, Brain
    , Crown, Trophy, Diamond, Star, Flame, Clock, 
    TrendingUp, User, Users, Timer, Hourglass, Shield, 
    Medal, Sparkles, Calendar, Sword, Clover, Wind, Eye,
    Sun, Moon, Skull, Lock, X,
    Swords,
    RailSymbol,
    TrainTrack,
    ClubIcon,
    FlameKindling,
    FireExtinguisher
} from "lucide-react";
import { 
    // React Icons
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

export default function Achievements() {
    const [earnedAchievements, setEarnedAchievements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAchievement, setSelectedAchievement] = useState(null);

    // Fetch achievements on mount
    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                setIsLoading(true);
                const result = await apiService.getAchievements();
                setEarnedAchievements(result.achievements || []);
            } catch (error) {
                console.error("Failed to fetch achievements:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    // 🔥 NEW: Achievement descriptions and requirements
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

    // All 50 achievements definition with unique icons
    const allAchievements = [
        // 🎯 BEGINNER CATEGORY (5 achievements)
        { id: 1, name: "First Steps", icon: Target, category: "beginner" },
        { id: 2, name: "Getting Started", icon: Rocket, category: "beginner" },
        { id: 3, name: "Building Momentum", icon: Zap, category: "beginner" },
        { id: 4, name: "On Track", icon: TrainTrack, category: "beginner" },
        { id: 5, name: "Committed Beginner", icon: Award, category: "beginner" },

        // 💪 SESSIONS CATEGORY (10 achievements)
        { id: 6, name: "Dedicated", icon: Dumbbell, category: "sessions" },
        { id: 7, name: "Focused Mind", icon: Brain, category: "sessions" },
        { id: 8, name: "Century Club", icon: ClubIcon, category: "sessions" },
        { id: 9, name: "Session Master", icon: Crown, category: "sessions" },
        { id: 10, name: "Focus Veteran", icon: Trophy, category: "sessions" },
        { id: 11, name: "Elite Focuser", icon: Diamond, category: "sessions" },
        { id: 12, name: "Focus Legend", icon: Star, category: "sessions" },
        { id: 13, name: "Session Overlord", icon: FaFire, category: "sessions" },
        { id: 14, name: "Ultimate Focus", icon: FaBolt, category: "sessions" },
        { id: 15, name: "Focus God", icon: FaGem, category: "sessions" },

        // ⏰ TIME CATEGORY (10 achievements)
        { id: 16, name: "First Hour", icon: Clock, category: "time" },
        { id: 17, name: "Time Investment", icon: TrendingUp, category: "time" },
        { id: 18, name: "Focus Marathon", icon: User, category: "time" },
        { id: 19, name: "Time Master", icon: Timer, category: "time" },
        { id: 20, name: "Focus Warrior", icon: Sword, category: "time" },
        { id: 21, name: "Time Lord", icon: Hourglass, category: "time" },
        { id: 22, name: "Focus Champion", icon: Medal, category: "time" },
        { id: 23, name: "Time Sage", icon: FaMagic, category: "time" },
        { id: 24, name: "Focus Emperor", icon: FaCrown, category: "time" },
        { id: 25, name: "Time Immortal", icon: FaInfinity, category: "time" },

        // 🔥 STREAK CATEGORY (8 achievements)
        { id: 26, name: "Streak Starter", icon: Flame, category: "streak" },
        { id: 27, name: "Consistent", icon: BsThunderbolt, category: "streak" },
        { id: 28, name: "Week Warrior", icon: Swords, category: "streak" },
        { id: 29, name: "Monthly Master", icon: Calendar, category: "streak" },
        { id: 30, name: "Consistency King", icon: FlameKindling, category: "streak" },
        { id: 31, name: "Streak Legend", icon: FireExtinguisher, category: "streak" },
        { id: 32, name: "Unstoppable", icon: HiLightningBolt, category: "streak" },
        { id: 33, name: "Streak Immortal", icon: GiCrystalBall, category: "streak" },

        // 🎖️ ACHIEVEMENT CATEGORY (5 achievements)
        { id: 34, name: "Achievement Hunter", icon: Target, category: "achievement" },
        { id: 35, name: "Badge Collector", icon: Medal, category: "achievement" },
        { id: 36, name: "Trophy Master", icon: Trophy, category: "achievement" },
        { id: 37, name: "Achievement Lord", icon: Crown, category: "achievement" },
        { id: 38, name: "Perfect Collector", icon: Diamond, category: "achievement" },

        // 👥 SOCIAL CATEGORY (3 achievements)
        { id: 39, name: "Social Butterfly", icon: FaHeart, category: "social" },
        { id: 40, name: "Friend Circle", icon: Users, category: "social" },
        { id: 41, name: "Community Leader", icon: Crown, category: "social" },

        // 🔒 SECRET ACHIEVEMENTS (9 achievements)
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
    const earnedIds = new Set((earnedAchievements || []).map(a => a.achievementId));
    const achievements = allAchievements.map(achievement => ({
        ...achievement,
        earned: earnedIds.has(achievement.id),
        earnedAt: earnedAchievements.find(a => a.achievementId === achievement.id)?.earnedAt
    }));

    const secretAchievements = achievements.filter(a => a.isSecret);
    const earnedSecrets = secretAchievements.filter(a => a.earned);
    const totalEarned = achievements.filter(a => a.earned).length;

    // 🔥 NEW: Handle achievement click
    const handleAchievementClick = (achievement) => {
        setSelectedAchievement(achievement);
    };

    // 🔥 NEW: Close modal
    const closeModal = () => {
        setSelectedAchievement(null);
    };

    if (isLoading) {
        return (
            <div className="bg-surface rounded-lg p-6 mb-6 animate-pulse">
                <div className="h-6 w-32 bg-background rounded mb-6"></div>
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                    {Array.from({length: 50}, (_, i) => (
                        <div key={i} className="aspect-square rounded-full bg-background"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
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
                    {achievements.map((achievement) => {
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
                                {/* Medal Icon - Fixed color inheritance */}
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

                                {/* Achievement name tooltip on hover - osu! style */}
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
