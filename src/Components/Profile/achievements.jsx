// components/Profile/Achievements.jsx - osu! Style with Original Colors
import { useEffect, useState } from "react";
import apiService from "../../services/api";
import { 
    // Lucide icons
    Target, Rocket, Zap, Award, Dumbbell, Brain
    , Crown, Trophy, Diamond, Star, Flame, Clock, 
    TrendingUp, User, Users, Timer, Hourglass, Shield, 
    Medal, Sparkles, Calendar, Sword, Clover, Wind, Eye,
    Sun, Moon, Skull, Lock,
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
    );
}
