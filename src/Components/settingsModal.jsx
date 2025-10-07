import { X, LogOut, Palette, Moon, Sun, User, Settings as SettingsIcon, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function SettingsModal({ onClose, user, onLogout, onThemeChange }) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return localStorage.getItem('theme') || 
               document.documentElement.getAttribute("data-theme") || 
               'celestial-light';
    });

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

    const themes = [
        {
            id: 'celestial',
            name: 'Celestial',
            description: 'Purple & Pink',
            colors: ['#7C3AED', '#DB2777'],
            icon: '💜'
        },
        {
            id: 'ocean',
            name: 'Ocean',
            description: 'Blue & Cyan',
            colors: ['#0891b2', '#0ea5e9'],
            icon: '🌊'
        },
        {
            id: 'flame',
            name: 'Flame',
            description: 'Red & Orange',
            colors: ['#dc2626', '#ea580c'],
            icon: '🔥'
        },
        {
            id: 'void',
            name: 'Void',
            description: 'High Contrast',
            colors: ['#000000', '#FFFFFF'],
            icon: '⚫'
        },
    ];

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute("data-theme");
                    setCurrentTheme(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        return () => observer.disconnect();
    }, []);

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    const handleThemeSelect = (themeId) => {
        const isDark = currentTheme.includes('-dark');
        const newTheme = `${themeId}-${isDark ? 'dark' : 'light'}`;
        
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        setCurrentTheme(newTheme);
        
        if (onThemeChange) {
            onThemeChange(newTheme);
        }
    };

    const toggleDarkMode = () => {
        const currentThemeBase = currentTheme.split('-')[0];
        const isDark = currentTheme.includes('-dark');
        const newTheme = `${currentThemeBase}-${isDark ? 'light' : 'dark'}`;
        
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        setCurrentTheme(newTheme);
        
        if (onThemeChange) {
            onThemeChange(newTheme);
        }
    };

    const getCurrentThemeBase = () => {
        return currentTheme.split('-')[0];
    };

    const isDarkMode = () => {
        return currentTheme.includes('-dark');
    };

    return (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-lg border border-primary/20">
                {/* Header */}
                <div className="relative px-6 py-4 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10">
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-2 hover:bg-surface/80 transition-colors"
                        aria-label="Close Settings"
                    >
                        <X size={20} className="text-secondary hover:text-primary transition-colors" />
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                            <SettingsIcon size={20} className="text-background" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-primary">Settings</h2>
                            <p className="text-sm text-secondary">Customize your experience</p>
                        </div>
                    </div>
                </div>

                {/* Settings Content */}
                <div className="p-6 space-y-6">
                    {/* Appearance Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                            <Palette size={18} />
                            Appearance
                        </h3>
                        
                        {/* Dark/Light Mode Toggle */}
                        <div className="flex justify-between items-center mb-6 p-4 bg-surface/50 rounded-lg border border-surface/30 hover:bg-surface/60 transition-colors">
                            <div className="flex items-center gap-3">
                                {isDarkMode() ? (
                                    <Moon size={18} className="text-secondary" />
                                ) : (
                                    <Sun size={18} className="text-secondary" />
                                )}
                                <div>
                                    <span className="text-primary font-medium">Dark Mode</span>
                                    <p className="text-xs text-secondary">Switch between light and dark themes</p>
                                </div>
                            </div>
                            <button
                                onClick={toggleDarkMode}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    isDarkMode() ? 'bg-primary' : 'bg-surface'
                                } border-2 ${isDarkMode() ? 'border-primary' : 'border-primary/30'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                                        isDarkMode() ? 'translate-x-6 bg-background' : 'translate-x-1 bg-primary'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Theme Selection */}
                        <div>
                            <p className="text-sm font-medium text-primary mb-3">Color Theme</p>
                            <div className="grid grid-cols-2 gap-3">
                                {themes.map((theme) => {
                                    const isSelected = getCurrentThemeBase() === theme.id;
                                    return (
                                        <button
                                            key={theme.id}
                                            onClick={() => handleThemeSelect(theme.id)}
                                            className={`group relative p-4 rounded-lg border-2 transition-all hover:scale-105 hover:shadow-md ${
                                                isSelected
                                                    ? 'border-primary bg-primary/10'
                                                    : 'border-surface hover:border-primary/50 bg-surface/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{theme.icon}</span>
                                                <div className="text-left flex-1">
                                                    <p className="font-medium text-primary text-sm">{theme.name}</p>
                                                    <p className="text-xs text-secondary">{theme.description}</p>
                                                </div>
                                                
                                                {/* Split Color Circle with checkmark overlay */}
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm border border-background/30 flex-shrink-0">
                                                    {/* Left half */}
                                                    <div 
                                                        className="absolute inset-0 w-1/2"
                                                        style={{ backgroundColor: theme.colors[0] }}
                                                    />
                                                    {/* Right half */}
                                                    <div 
                                                        className="absolute inset-0 left-1/2 w-1/2"
                                                        style={{ backgroundColor: theme.colors[1] }}
                                                    />
                                                    
                                                    {/* Checkmark overlay for active theme */}
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                                                            <Check size={16} className="text-primary drop-shadow-sm" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* User Section */}
                    {user && (
                        <div className="border-t border-surface/50 pt-6">
                            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                                <User size={18} />
                                Account
                            </h3>
                            
                            <div className="flex items-center gap-4 p-4 bg-surface/50 rounded-lg mb-4 border border-surface/30">
                                <img 
                                    src={user.picture} 
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                                />
                                <div className="flex-1">
                                    <p className="text-primary font-semibold">{user.name}</p>
                                    <p className="text-secondary text-sm">{user.email}</p>
                                    {user.username && (
                                        <p className="text-secondary text-xs">@{user.username}</p>
                                    )}
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleLogout}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent/10 hover:bg-accent hover:text-background border border-accent/20 hover:border-accent rounded-lg transition-all text-accent font-medium hover:shadow-md"
                            >
                                <LogOut size={16} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
