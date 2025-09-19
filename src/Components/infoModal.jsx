// InfoModal.jsx - Fixed shortcuts tab visibility
import { X, Play, Users, Settings, Keyboard, Zap, Timer, Volume2, TrendingUp, Trophy, Clock, Star, Shield } from 'lucide-react';
import { useState } from 'react';

export default function InfoModal({ onClose, user }) {
    const [activeTab, setActiveTab] = useState('basics');

    const shortcuts = [
        { key: 'Space', action: 'Start/Pause timer', category: 'Timer Control' },
        { key: 'R', action: 'Reset current session', category: 'Timer Control' },
        { key: 'S', action: 'Skip to break/work', category: 'Timer Control' },
        { key: 'M', action: 'Mute/Unmute sounds', category: 'Audio' },
        { key: 'F', action: 'Toggle fullscreen mode', category: 'Display' },
        { key: 'Esc', action: 'Close modals', category: 'Navigation' },
        { key: '1-5', action: 'Quick timer presets', category: 'Quick Actions' },
    ];

    // Fixed: Changed 'key' to 'id' for shortcuts tab
    const tabs = [
        { id: 'basics', label: 'Getting Started', icon: Play },
        { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard }, // Fixed: was 'key'
        { id: 'features', label: 'Features', icon: Zap }
    ];

    // If user is not logged in, show "Why Login?" content
    if (!user) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-background rounded-xl shadow-2xl w-full max-w-md border border-surface/50">
                    {/* Header */}
                    <div className="relative p-6 pb-0">
                        <button 
                            onClick={onClose}
                            className="absolute right-4 top-4 rounded-full p-2 hover:bg-surface/80 transition-colors"
                            aria-label="Close Info"
                        >
                            <X size={20} className="text-secondary" />
                        </button>
                        
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                                <Star size={28} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-primary mb-2">Unlock Your Full Potential</h2>
                            <p className="text-secondary">Sign in to access more features</p>
                        </div>
                    </div>

                    {/* Benefits Content */}
                    <div className="px-6 pb-6 space-y-4">
                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/10">
                            <div className="p-2 bg-primary/20 rounded-lg flex-shrink-0">
                                <TrendingUp size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary mb-1">Track Your Progress</h3>
                                <p className="text-sm text-secondary">Monitor daily focus time, streaks, and productivity patterns with detailed analytics.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-500/5 to-blue-500/10 rounded-lg border border-blue-500/10">
                            <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                                <Users size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary mb-1">Study with Friends</h3>
                                <p className="text-sm text-secondary">Join study rooms, compete on leaderboards, and motivate each other.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 rounded-lg border border-yellow-500/10">
                            <div className="p-2 bg-yellow-500/20 rounded-lg flex-shrink-0">
                                <Trophy size={20} className="text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary mb-1">Earn Achievements</h3>
                                <p className="text-sm text-secondary">Unlock badges and celebrate milestones in your focus journey.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-500/5 to-green-500/10 rounded-lg border border-green-500/10">
                            <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                                <Clock size={20} className="text-green-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-primary mb-1">Sync Across Devices</h3>
                                <p className="text-sm text-secondary">Access your data anywhere with cloud sync and personalized goals.</p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="px-6 pb-6">
                        <div className="flex items-center gap-3 p-4 bg-surface/80 rounded-lg border border-surface">
                            <Shield size={18} className="text-green-500 flex-shrink-0" />
                            <p className="text-xs text-secondary">
                                <span className="font-medium text-primary">Privacy Protected:</span> We only use your Google account for secure authentication and basic profile information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If user is logged in, show tutorial content
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden border border-surface/50">
                {/* Header */}
                <div className="relative px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 rounded-full p-2 hover:bg-surface/80 transition-colors"
                        aria-label="Close Tutorial"
                    >
                        <X size={20} className="text-secondary" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                            <Zap size={24} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-primary">Master Dorofi</h2>
                            <p className="text-secondary">Learn how to maximize your productivity</p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-surface/50 bg-surface/20">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-8 py-4 text-sm font-medium transition-all flex-1 justify-center relative ${
                                activeTab === tab.id
                                    ? 'text-primary bg-background border-b-2 border-primary shadow-sm'
                                    : 'text-secondary hover:text-primary hover:bg-surface/50'
                            }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 180px)' }}>
                    {activeTab === 'basics' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-primary/20 rounded-xl">
                                            <Timer size={24} className="text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Start Your First Session</h3>
                                    </div>
                                    <p className="text-secondary mb-4">
                                        Click the Solo Focus button or press <kbd className="px-3 py-1 bg-surface rounded-lg text-xs font-mono border border-surface shadow-sm">Space</kbd> to begin a 25-minute Pomodoro session.
                                    </p>
                                    <div className="text-xs text-secondary bg-background/50 p-3 rounded-lg">
                                        💡 The timer automatically switches between work and break periods
                                    </div>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl border border-blue-500/10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-blue-500/20 rounded-xl">
                                            <Users size={24} className="text-blue-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Join Study Rooms</h3>
                                    </div>
                                    <p className="text-secondary mb-4">
                                        Click "Group Rooms" to create or join study sessions. Your progress syncs in real-time with friends!
                                    </p>
                                    <div className="text-xs text-secondary bg-background/50 p-3 rounded-lg">
                                        🎯 Compete on leaderboards and motivate each other
                                    </div>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-orange-500/5 to-red-500/10 rounded-xl border border-red-500/10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-red-500/20 rounded-xl">
                                            <Trophy size={24} className="text-orange-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Compete with Friends</h3>
                                    </div>
                                    <p className="text-secondary mb-4">
                                        Add friends and compete on daily streaks and focus time leaderboards.
                                    </p>
                                    <div className="text-xs text-secondary bg-background/50 p-3 rounded-lg">
                                        🏆 Turn productivity into a fun competition
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl border border-purple-500/10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-purple-500/20 rounded-xl">
                                            <Volume2 size={24} className="text-purple-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Background Sounds</h3>
                                    </div>
                                    <p className="text-secondary mb-4">
                                        Choose from lofi beats, nature sounds, or white noise to enhance your focus environment.
                                    </p>
                                    <div className="text-xs text-secondary bg-background/50 p-3 rounded-lg">
                                        🎵 Access the sound menu from the bottom toolbar
                                    </div>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl border border-green-500/10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-green-500/20 rounded-xl">
                                            <Settings size={24} className="text-green-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Customize Everything</h3>
                                    </div>
                                    <p className="text-secondary mb-4">
                                        Adjust timer lengths, workspaces, themes, and more in Settings.
                                    </p>
                                    <div className="text-xs text-secondary bg-background/50 p-3 rounded-lg">
                                        ⚙️ Make Dorofi work exactly how you want it to
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shortcuts' && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h3 className="text-xl font-semibold text-primary mb-2">Keyboard Shortcuts</h3>
                                <p className="text-secondary">Master these shortcuts to boost your productivity</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {shortcuts.map((shortcut, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-surface hover:bg-surface/80 transition-colors">
                                        <div>
                                            <span className="text-primary font-medium">{shortcut.action}</span>
                                            <p className="text-xs text-secondary">{shortcut.category}</p>
                                        </div>
                                        <kbd className="px-4 py-2 bg-background border border-surface rounded-lg text-sm font-mono text-primary shadow-sm">
                                            {shortcut.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>

                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-primary/20 rounded-xl">
                                            <Timer size={24} className="text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Smart Pomodoro Timer</h3>
                                    </div>
                                    <ul className="text-secondary space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                            Automatic break reminders
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                            Customizable work/break intervals
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                            Session history and analytics
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                            Smart notifications
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-xl border border-blue-500/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-blue-500/20 rounded-xl">
                                            <Users size={24} className="text-blue-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Social Features</h3>
                                    </div>
                                    <ul className="text-secondary space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            Real-time study rooms
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            Friends leaderboard
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            Daily/weekly challenges
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            Friend status sharing
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-xl border border-purple-500/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-purple-500/20 rounded-xl">
                                            <Zap size={24} className="text-purple-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Productivity Tools</h3>
                                    </div>
                                    <ul className="text-secondary space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            Focus streak tracking
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            Achievement badges
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            Detailed statistics
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            Goal setting & tracking
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 rounded-xl border border-green-500/10">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-3 bg-green-500/20 rounded-xl">
                                            <Settings size={24} className="text-green-500" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-primary">Customization</h3>
                                    </div>
                                    <ul className="text-secondary space-y-2">
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            Multiple themes
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            Custom timer lengths
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            Notification preferences
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
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
