// InfoModal.jsx - Fixed scrolling and body lock
import { X, Play, Users, Settings, Keyboard, Zap, Timer, Volume2, TrendingUp, Trophy, Clock, Star, Shield, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function InfoModal({ onClose, user, onLoginPrompt }) {
    const [activeTab, setActiveTab] = useState('basics');

    // Lock body scroll when modal opens
    useEffect(() => {
        // Store original body style
        const originalStyle = window.getComputedStyle(document.body).overflow;
        
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        
        // Cleanup: restore original scroll when modal closes
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const shortcuts = [
        { key: 'Space', action: 'Start/Pause timer', category: 'Timer Control', premium: false },
        { key: 'R', action: 'Reset current session', category: 'Timer Control', premium: false },
        { key: 'S', action: 'Skip to break/work', category: 'Timer Control', premium: false },
        { key: 'M', action: 'Mute/Unmute sounds', category: 'Audio', premium: false },
        { key: 'F', action: 'Toggle fullscreen mode', category: 'Display', premium: false },
        { key: 'Esc', action: 'Close modals', category: 'Navigation', premium: false },
        { key: '1-5', action: 'Quick timer presets', category: 'Quick Actions', premium: false },
    ];

    const tabs = [
        { id: 'basics', label: 'Basics', icon: Play },
        { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
        { id: 'features', label: 'Features', icon: Zap }
    ];

    const handleLoginPrompt = (featureType) => {
        if (onLoginPrompt) {
            onLoginPrompt(featureType);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-hidden">
            <div className="bg-background rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-2xl lg:max-w-4xl h-[95vh] sm:h-[90vh] lg:h-[85vh] overflow-hidden border border-primary/20 flex flex-col">
                {/* Header - Fixed */}
                <div className="relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
                    <button 
                        onClick={onClose}
                        className="absolute right-3 sm:right-4 lg:right-6 top-3 sm:top-4 lg:top-6 rounded-full p-1.5 sm:p-2 hover:bg-surface/80 transition-colors"
                        aria-label="Close Tutorial"
                    >
                        <X size={18} className="sm:w-5 sm:h-5 text-secondary hover:text-primary transition-colors" />
                    </button>
                    
                    <div className="flex items-center gap-3 sm:gap-4 pr-8 sm:pr-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary/60 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <Zap size={20} className="sm:w-6 sm:h-6 text-background" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-primary truncate">
                                {user ? 'Master Dorofi' : 'Welcome to Dorofi'}
                            </h2>
                            <p className="text-sm sm:text-base text-secondary truncate">
                                {user ? 'Learn how to maximize your productivity' : 'Your productivity companion'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs - Fixed */}
                <div className="flex border-b border-surface/50 bg-surface/20 overflow-x-auto flex-shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-all flex-1 justify-center relative whitespace-nowrap ${
                                activeTab === tab.id
                                    ? 'text-primary bg-background border-b-2 border-primary shadow-sm'
                                    : 'text-secondary hover:text-primary hover:bg-surface/50'
                            }`}
                        >
                            <tab.icon size={16} className="sm:w-[18px] sm:h-[18px] flex-shrink-0" />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                        </button>
                    ))}
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {activeTab === 'basics' && (
                        <div className="space-y-4 sm:space-y-6">
                            {/* Login Benefits Card for Non-Users Only */}
                            {!user && (
                                <div className="p-4 sm:p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                                    <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                        <div className="p-2 sm:p-3 bg-primary/30 rounded-lg sm:rounded-xl flex-shrink-0">
                                            <Star size={20} className="sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-primary">Why Sign In?</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <div className="space-y-1.5 sm:space-y-2 text-sm text-secondary">
                                            <p>• Track your progress and streaks</p>
                                            <p>• Sync data across all devices</p>
                                        </div>
                                        <div className="space-y-1.5 sm:space-y-2 text-sm text-secondary">
                                            <p>• Unlock social features</p>
                                            <p>• Join study rooms with friends</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Feature Cards Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                            <div className="p-2 sm:p-3 bg-primary/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                                <Timer size={20} className="sm:w-6 sm:h-6 text-primary" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-primary">Start Your First Session</h3>
                                        </div>
                                        <p className="text-sm sm:text-base text-secondary mb-3 sm:mb-4">
                                            Click the Solo Focus button or press <kbd className="px-2 sm:px-3 py-1 bg-surface rounded-lg text-xs font-mono border border-surface shadow-sm text-primary">Space</kbd> to begin a 25-minute Pomodoro session.
                                        </p>
                                        <div className="text-xs sm:text-sm text-secondary bg-background/50 p-2 sm:p-3 rounded-lg">
                                            💡 The timer automatically switches between work and break periods
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/10">
                                        <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4">
                                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                                                <div className="p-2 sm:p-3 bg-secondary/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                                    <Users size={20} className="sm:w-6 sm:h-6 text-secondary" />
                                                </div>
                                                <h3 className="text-base sm:text-lg font-semibold text-primary">Join Study Rooms</h3>
                                            </div>
                                            {!user && (
                                                <span className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20 flex-shrink-0 ml-2">
                                                    Login Required
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm sm:text-base text-secondary mb-3 sm:mb-4">
                                            Create or join group study sessions. Your progress syncs in real-time with friends!
                                        </p>
                                        <div className="text-xs sm:text-sm text-secondary bg-background/50 p-2 sm:p-3 rounded-lg">
                                            🎯 Compete on leaderboards and motivate each other
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/10">
                                        <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4">
                                            <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0">
                                                <div className="p-2 sm:p-3 bg-accent/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                                    <Trophy size={20} className="sm:w-6 sm:h-6 text-accent" />
                                                </div>
                                                <h3 className="text-base sm:text-lg font-semibold text-primary">Compete with Friends</h3>
                                            </div>
                                            {!user && (
                                                <span className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20 flex-shrink-0 ml-2">
                                                    Login Required
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm sm:text-base text-secondary mb-3 sm:mb-4">
                                            Add friends and compete on daily streaks and focus time leaderboards.
                                        </p>
                                        <div className="text-xs sm:text-sm text-secondary bg-background/50 p-2 sm:p-3 rounded-lg">
                                            🏆 Turn productivity into a fun competition
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <div className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                            <div className="p-2 sm:p-3 bg-primary/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                                <Volume2 size={20} className="sm:w-6 sm:h-6 text-primary" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-primary">Background Sounds</h3>
                                        </div>
                                        <p className="text-sm sm:text-base text-secondary mb-3 sm:mb-4">
                                            Choose from lofi beats, nature sounds, or white noise to enhance your focus environment.
                                        </p>
                                        <div className="text-xs sm:text-sm text-secondary bg-background/50 p-2 sm:p-3 rounded-lg">
                                            🎵 Access the sound menu from the bottom toolbar
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/10">
                                        <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                            <div className="p-2 sm:p-3 bg-secondary/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                                <Settings size={20} className="sm:w-6 sm:h-6 text-secondary" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-primary">Customize Everything</h3>
                                        </div>
                                        <p className="text-sm sm:text-base text-secondary mb-3 sm:mb-4">
                                            Adjust timer lengths, themes, and preferences in Settings.
                                        </p>
                                        <div className="text-xs sm:text-sm text-secondary bg-background/50 p-2 sm:p-3 rounded-lg">
                                            ⚙️ Make Dorofi work exactly how you want it to
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shortcuts' && (
                        <div className="space-y-4 sm:space-y-6">
                            <div className="text-center mb-6 sm:mb-8">
                                <h3 className="text-lg sm:text-xl font-semibold text-primary mb-2">Keyboard Shortcuts</h3>
                                <p className="text-sm sm:text-base text-secondary">Master these shortcuts to boost your productivity</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                                {shortcuts.map((shortcut, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-surface/50 rounded-xl border border-surface hover:bg-surface/80 transition-colors">
                                        <div className="min-w-0 flex-1">
                                            <span className="text-sm sm:text-base text-primary font-medium">{shortcut.action}</span>
                                            <p className="text-xs text-secondary">{shortcut.category}</p>
                                        </div>
                                        <kbd className="px-3 sm:px-4 py-1.5 sm:py-2 bg-background border border-surface rounded-lg text-xs sm:text-sm font-mono text-primary shadow-sm flex-shrink-0 ml-3">
                                            {shortcut.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div className="space-y-4 sm:space-y-6">
                                <div className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                        <div className="p-2 sm:p-3 bg-primary/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                            <Timer size={20} className="sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-primary">Smart Pomodoro Timer</h3>
                                    </div>
                                    <ul className="text-sm sm:text-base text-secondary space-y-1.5 sm:space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                            Automatic break reminders
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                            Customizable work/break intervals
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                            Session history and analytics
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                            Smart notifications
                                        </li>
                                    </ul>
                                </div>

                                <div className={`p-4 sm:p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/10 ${!user ? 'opacity-75' : ''}`}>
                                    <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4">
                                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                                            <div className="p-2 sm:p-3 bg-secondary/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                                <Users size={20} className="sm:w-6 sm:h-6 text-secondary" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-primary">Social Features</h3>
                                        </div>
                                        {!user && (
                                            <span className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20 flex-shrink-0 ml-2">
                                                Login Required
                                            </span>
                                        )}
                                    </div>
                                    <ul className="text-sm sm:text-base text-secondary space-y-1.5 sm:space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                                            Real-time study rooms
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                                            Friends leaderboard
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                                            Daily/weekly challenges
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></div>
                                            Friend status sharing
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                <div className={`p-4 sm:p-6 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl border border-accent/10 ${!user ? 'opacity-75' : ''}`}>
                                    <div className="flex items-start sm:items-center justify-between mb-3 sm:mb-4">
                                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 min-w-0">
                                            <div className="p-2 sm:p-3 bg-accent/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                                <Zap size={20} className="sm:w-6 sm:h-6 text-accent" />
                                            </div>
                                            <h3 className="text-base sm:text-lg font-semibold text-primary">Productivity Tools</h3>
                                        </div>
                                        {!user && (
                                            <span className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20 flex-shrink-0 ml-2">
                                                Login Required
                                            </span>
                                        )}
                                    </div>
                                    <ul className="text-sm sm:text-base text-secondary space-y-1.5 sm:space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                                            Focus streak tracking
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                                            Achievement badges
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                                            Detailed statistics
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0"></div>
                                            Goal setting & tracking
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                                        <div className="p-2 sm:p-3 bg-primary/20 rounded-lg sm:rounded-xl flex-shrink-0">
                                            <Settings size={20} className="sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                        <h3 className="text-base sm:text-lg font-semibold text-primary">Customization</h3>
                                    </div>
                                    <ul className="text-sm sm:text-base text-secondary space-y-1.5 sm:space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                            Multiple themes
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                            Custom timer lengths
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                            Notification preferences
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                                            Background sounds
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
