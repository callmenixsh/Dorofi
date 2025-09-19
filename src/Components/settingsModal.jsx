import { X, LogOut, Palette } from 'lucide-react';
import { useState, useEffect } from 'react';
import ThemeToggle from './toggletheme';

export default function SettingsModal({ onClose, user, onLogout, toggleColorScheme }) {
    const [currentTheme, setCurrentTheme] = useState(() => {
        return document.documentElement.getAttribute("data-theme") || 'dorofi-light';
    });

    // Listen for theme changes
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

    const handleColorSchemeChange = () => {
        console.log('Color scheme button clicked'); // Debug log
        toggleColorScheme();
    };

    const getCurrentColorScheme = () => {
        return currentTheme.includes('ocean') ? 'Ocean' : 'Dorofi';
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background rounded-lg shadow-lg w-96 max-w-[90vw] p-6 border border-surface">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-primary">Settings</h2>
                    <button 
                        onClick={onClose}
                        className="rounded-full p-1 hover:bg-surface transition-colors"
                        aria-label="Close Settings"
                    >
                        <X size={20} className="text-secondary" />
                    </button>
                </div>

                {/* Settings Content */}
                <div className="space-y-6">
                    {/* Theme Section */}
                    <div>
                        <h3 className="text-sm font-medium text-primary mb-3">Appearance</h3>
                        
                        {/* Dark/Light Mode */}
                        <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-primary">Dark Mode</span>
                            </div>
                            <ThemeToggle />
                        </div>

                        {/* Color Scheme */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Palette size={16} className="text-secondary" />
                                <span className="text-primary">Color Scheme</span>
                            </div>
                            <button 
                                onClick={handleColorSchemeChange}
                                className="flex items-center gap-2 px-3 py-2 bg-surface hover:bg-primary hover:text-background rounded-lg transition-all text-sm font-medium"
                            >
                                {getCurrentColorScheme()}
                                <div className={`w-3 h-3 rounded-full ${
                                    getCurrentColorScheme() === 'Ocean' 
                                        ? 'bg-blue-500' 
                                        : 'bg-purple-500'
                                }`}></div>
                            </button>
                        </div>
                        
                        {/* Debug info - remove this later */}
                        <div className="text-xs text-secondary mt-2">
                            Current: {currentTheme}
                        </div>
                    </div>

                    {/* User Section */}
                    {user && (
                        <div className="border-t border-surface pt-4">
                            <h3 className="text-sm font-medium text-primary mb-3">Account</h3>
                            <div className="flex items-center gap-3 mb-4">
                                <img 
                                    src={user.picture} 
                                    alt={user.name}
                                    className="w-10 h-10 rounded-full border-2 border-surface"
                                />
                                <div>
                                    <p className="text-primary font-medium">{user.name}</p>
                                    <p className="text-secondary text-sm">{user.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full px-3 py-2 bg-surface hover:bg-red-500 hover:text-white rounded-lg transition-colors text-secondary hover:text-white"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
