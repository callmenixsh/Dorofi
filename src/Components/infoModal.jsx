// InfoModal.jsx - COMPLETE with Features Tab
import { X, Keyboard, Zap, Play, Timer, Users, Settings, Trophy, Volume2, TrendingUp, Bug, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function InfoModal({ onClose, user, onLoginPrompt }) {
    const [activeTab, setActiveTab] = useState('shortcuts');

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    const shortcuts = [
        { key: 'Space', action: 'Start/Pause timer', category: 'Timer Control' },
        { key: 'R', action: 'Reset timer', category: 'Timer Control' },
        { key: 'S', action: 'Skip break', category: 'Timer Control' },
        { key: 'F', action: 'Toggle focus mode', category: 'Display' },
        { key: 'N', action: 'Next Lofi', category: 'Audio' },
        { key: 'M', action: 'Play/Pause Lofi', category: 'Audio' },
        { key: '1-4', action: 'Toggle White Noises', category: 'Audio' },
    ];

    const tabs = [
        { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
        { id: 'basics', label: 'Getting Started', icon: Play },
    ];

    const handleReportBug = () => {
        window.open("https://github.com/callmenixsh/Dorofi/issues/new", "_blank");
    };

    return (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-primary/20 flex flex-col relative">
                {/* Header */}
                <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                            <Zap size={24} className="text-background" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-primary">
                                Welcome to Dorofi
                            </h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="rounded-full p-2 hover:bg-surface/80 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} className="text-secondary hover:text-primary" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-surface/50 bg-surface/20 flex-shrink-0">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-8 py-4 text-sm font-medium transition-all flex-1 justify-center ${
                                activeTab === tab.id
                                    ? 'text-primary bg-background border-b-2 border-primary'
                                    : 'text-secondary hover:text-primary hover:bg-surface/50'
                            }`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {/* Shortcuts Tab */}
                    {activeTab === 'shortcuts' && (
                        <div className="space-y-6">
                            <div className="grid lg:grid-cols-2 gap-4">
                                {shortcuts.map((shortcut, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-surface/50 rounded-xl border border-surface hover:bg-surface/80 transition-colors">
                                        <div>
                                            <span className="text-base text-primary font-medium">{shortcut.action}</span>
                                            <p className="text-xs text-secondary">{shortcut.category}</p>
                                        </div>
                                        <kbd className="px-4 py-2 bg-background border border-surface rounded-lg text-sm font-mono text-primary shadow-sm ml-4">
                                            {shortcut.key}
                                        </kbd>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Basics Tab */}
                    {activeTab === 'basics' && (
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-6">
                                {!user ? (
                                    <div className="p-6 bg-gradient-to-br from-accent/10 to-accent/5 rounded-xl border-2 border-accent/20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-accent/20 rounded-xl">
                                                <Trophy size={24} className="text-accent" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary">Why Sign In?</h3>
                                        </div>
                                        <div className="space-y-2 text-sm text-secondary">
                                            <p>• Track your progress and streaks</p>
                                            <p>• Sync data across all devices</p>
                                            <p>• Unlock social features</p>
                                            <p>• Join study rooms with friends</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-primary/20 rounded-xl">
                                                <Timer size={24} className="text-primary" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary">Start Your First Session</h3>
                                        </div>
                                        <p className="text-sm text-secondary mb-4">
                                            Click the play button or press <kbd className="px-2 py-1 bg-surface rounded text-xs font-mono mx-1">Space</kbd> to begin a 25-minute Pomodoro session.
                                        </p>
                                        <div className="text-sm text-secondary bg-background/50 p-3 rounded-lg">
                                            💡 The timer has multiple modes and settings, try them out.
                                        </div>
                                    </div>
                                )}

                                {!user ? (
                                    <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-primary/20 rounded-xl">
                                                <Timer size={24} className="text-primary" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary">Start Your First Session</h3>
                                        </div>
                                        <p className="text-sm text-secondary mb-4">
                                            Click the play button or press <kbd className="px-2 py-1 bg-surface rounded text-xs font-mono mx-1">Space</kbd> to begin a 25-minute Pomodoro session.
                                        </p>
                                        <div className="text-sm text-secondary bg-background/50 p-3 rounded-lg">
                                            💡 The timer has multiple modes and settings, try them out.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-secondary/20 rounded-xl">
                                                <Users size={24} className="text-secondary" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary">Add Friends</h3>
                                        </div>
                                        <p className="text-sm text-secondary mb-4">
                                            Add friends to see their profiles and progress.
                                        </p>
                                        <div className="text-sm text-secondary bg-background/50 p-3 rounded-lg">
                                            🎯 Compete on leaderboards and motivate each other
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                {!user ? (
                                    <div className="p-6 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl border border-secondary/10">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-secondary/20 rounded-xl">
                                                    <Users size={24} className="text-secondary" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-primary">Add Friends</h3>
                                            </div>
                                            <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full border border-accent/20">
                                                Login Required
                                            </span>
                                        </div>
                                        <p className="text-sm text-secondary mb-4">
                                            Add friends to see their profiles and progress.
                                        </p>
                                        <div className="text-sm text-secondary bg-background/50 p-3 rounded-lg">
                                            🎯 Compete on leaderboards and motivate each other
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-primary/20 rounded-xl">
                                                <Volume2 size={24} className="text-primary" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary">Background Sounds</h3>
                                        </div>
                                        <p className="text-sm text-secondary mb-4">
                                            Choose from lofi beats, nature sounds, or white noise to enhance your focus environment.
                                        </p>
                                        <div className="text-sm text-secondary bg-background/50 p-3 rounded-lg">
                                            🎵 Access the sound menu from the bottom player
                                        </div>
                                    </div>
                                )}

                                {!user ? (
                                    <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-primary/20 rounded-xl">
                                                <Volume2 size={24} className="text-primary" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary">Background Sounds</h3>
                                        </div>
                                        <p className="text-sm text-secondary mb-4">
                                            Choose from lofi beats, nature sounds, or white noise to enhance your focus environment.
                                        </p>
                                        <div className="text-sm text-secondary bg-background/50 p-3 rounded-lg">
                                            🎵 Access the sound menu from the bottom player
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gradient-to-br from-orange-500/5 to-orange-500/10 rounded-xl border border-orange-500/20">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-3 bg-orange-500/20 rounded-xl">
                                                <Bug size={24} className="text-orange-500" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-primary">Report Bugs</h3>
                                        </div>
                                        <p className="text-sm text-secondary mb-4">
                                            Found a bug or have a suggestion? Help us fix it by reporting the issue on GitHub.
                                        </p>
                                        <button
                                            onClick={handleReportBug}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                                        >
                                            <Bug size={16} />
                                            <span>Report Bug</span>
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
