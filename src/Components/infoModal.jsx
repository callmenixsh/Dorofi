// InfoModal.jsx
import { X, Play, Users, Settings, Keyboard, Zap, Timer, Volume2, TrendingUp, Trophy, Clock } from 'lucide-react';
import { useState } from 'react';

export default function InfoModal({ onClose, user }) {
    const [activeTab, setActiveTab] = useState('basics');

    const shortcuts = [
        { key: 'Space', action: 'Start/Pause timer' },
        { key: 'R', action: 'Reset current session' },
        { key: 'S', action: 'Skip to break/work' },
        { key: 'M', action: 'Mute/Unmute sounds' },
        { key: 'F', action: 'Toggle fullscreen mode' },
        { key: 'Esc', action: 'Close modals' },
        { key: '1-5', action: 'Quick timer presets' },
    ];

    const tabs = [
        { id: 'basics', label: 'Getting Started', icon: Play },
        { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
        { id: 'features', label: 'Features', icon: Zap }
    ];

    // If user is not logged in, show "Why Login?" content
    if (!user) {
        return (
            <div className="fixed inset-0 bg-background/95 bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-background rounded-lg shadow-lg w-96 max-w-[90vw] p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-primary">Why Login?</h2>
                        <button 
                            onClick={onClose}
                            className="rounded-full p-1 hover:bg-surface transition-colors"
                            aria-label="Close Info"
                        >
                            <X size={20} className="text-secondary" />
                        </button>
                    </div>

                    {/* Benefits Content */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <TrendingUp size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium text-primary mb-1">Track Your Progress</h3>
                                <p className="text-sm text-secondary">Monitor your daily focus time, streaks, and productivity patterns.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <Users size={20} className="text-secondary" />
                            </div>
                            <div>
                                <h3 className="font-medium text-primary mb-1">Join Friends</h3>
                                <p className="text-sm text-secondary">Study together in rooms and compete with friends on leaderboards.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <Trophy size={20} className="text-accent" />
                            </div>
                            <div>
                                <h3 className="font-medium text-primary mb-1">Earn Achievements</h3>
                                <p className="text-sm text-secondary">Unlock badges and celebrate milestones in your focus journey.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Clock size={20} className="text-primary" />
                            </div>
                            <div>
                                <h3 className="font-medium text-primary mb-1">Daily Goals</h3>
                                <p className="text-sm text-secondary">Set and track personalized focus goals that sync across all devices.</p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Note */}
                    <div className="mt-6 p-3 bg-surface rounded-lg">
                        <p className="text-xs text-secondary">
                            🔒 We only use your Google account for authentication and basic profile info. 
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // If user is logged in, show tutorial content
    return (
        <div className="fixed inset-0 bg-background/95 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg shadow-lg w-[32rem] max-w-[90vw] max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-surface">
                    <h2 className="text-xl font-semibold text-primary">How to Use Dorofi</h2>
                    <button 
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-surface transition-colors"
                        aria-label="Close Tutorial"
                    >
                        <X size={20} className="text-secondary" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-surface">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors flex-1 justify-center ${
                                activeTab === tab.id
                                    ? 'text-primary border-b-2 border-primary bg-surface/50'
                                    : 'text-secondary hover:text-primary hover:bg-surface/30'
                            }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-96">
                    {activeTab === 'basics' && (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Timer size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-primary mb-1">Starting Your First Session</h3>
                                    <p className="text-sm text-secondary mb-2">
                                        Click the Solo Focus button or hit <kbd className="px-2 py-1 bg-surface rounded text-xs font-mono">Space</kbd> to start a 25-minute Pomodoro session.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-secondary/10 rounded-lg">
                                    <Users size={20} className="text-secondary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-primary mb-1">Joining Study Rooms</h3>
                                    <p className="text-sm text-secondary mb-2">
                                        Click "Group Rooms" to join or create study sessions with friends. Your progress syncs in real-time!
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-accent/10 rounded-lg">
                                    <Volume2 size={20} className="text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-primary mb-1">Background Sounds</h3>
                                    <p className="text-sm text-secondary mb-2">
                                        Click the sound button at the bottom to choose from lofi beats, nature sounds, or white noise.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Settings size={20} className="text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-primary mb-1">Customizing Your Experience</h3>
                                    <p className="text-sm text-secondary mb-2">
                                        Open Settings to adjust timer lengths, notification preferences, and choose your favorite theme.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'shortcuts' && (
                        <div className="space-y-3">
                            <p className="text-sm text-secondary mb-4">Master these keyboard shortcuts to boost your productivity:</p>
                            {shortcuts.map((shortcut, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
                                    <span className="text-sm text-primary">{shortcut.action}</span>
                                    <kbd className="px-3 py-1 bg-background border border-surface rounded text-xs font-mono text-secondary">
                                        {shortcut.key}
                                    </kbd>
                                </div>
                            ))}
                            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                                <p className="text-xs text-secondary">
                                    💡 <strong>Pro tip:</strong> Use number keys (1-5) for quick timer presets: 1 = 15min, 2 = 25min, 3 = 45min, 4 = 60min, 5 = 90min
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'features' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-primary/5 rounded-lg">
                                <h3 className="font-medium text-primary mb-2 flex items-center gap-2">
                                    <Timer size={18} />
                                    Smart Pomodoro Timer
                                </h3>
                                <ul className="text-sm text-secondary space-y-1">
                                    <li>• Automatic break reminders</li>
                                    <li>• Customizable work/break intervals</li>
                                    <li>• Session history and analytics</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-secondary/5 rounded-lg">
                                <h3 className="font-medium text-primary mb-2 flex items-center gap-2">
                                    <Users size={18} />
                                    Social Features
                                </h3>
                                <ul className="text-sm text-secondary space-y-1">
                                    <li>• Study rooms with real-time sync</li>
                                    <li>• Friends leaderboard</li>
                                    <li>• Daily/weekly challenges</li>
                                </ul>
                            </div>

                            <div className="p-4 bg-accent/5 rounded-lg">
                                <h3 className="font-medium text-primary mb-2 flex items-center gap-2">
                                    <Zap size={18} />
                                    Productivity Tools
                                </h3>
                                <ul className="text-sm text-secondary space-y-1">
                                    <li>• Task management integration</li>
                                    <li>• Focus streak tracking</li>
                                    <li>• Achievement badges</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
