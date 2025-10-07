// components/Footer.jsx - With dynamic backend status checking
import React, { useState, useEffect } from "react";
import { Timer, Heart, Github, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const navigate = useNavigate();
    const [backendStatus, setBackendStatus] = useState({
        isOnline: true,
        isChecking: true,
        lastChecked: null
    });

    const handleNavigation = (path) => {
        navigate(path);
    };

    // Backend health check function
    const checkBackendHealth = async () => {
        try {
            setBackendStatus(prev => ({ ...prev, isChecking: true }));
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/health`, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                setBackendStatus({
                    isOnline: true,
                    isChecking: false,
                    lastChecked: new Date()
                });
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            console.warn('Backend health check failed:', error);
            setBackendStatus({
                isOnline: false,
                isChecking: false,
                lastChecked: new Date()
            });
        }
    };

    // Initial check and periodic checks
    useEffect(() => {
        checkBackendHealth();
        
        // Check every 2 minutes
        const interval = setInterval(checkBackendHealth, 2 * 60 * 1000);
        
        return () => clearInterval(interval);
    }, []);

    // Status component
    const StatusIndicator = () => {
        if (backendStatus.isChecking) {
            return (
                <div className="flex items-center gap-2 text-xs text-secondary">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span>Checking status...</span>
                </div>
            );
        }

        if (backendStatus.isOnline) {
            return (
                <div className="flex items-center gap-2 text-xs text-secondary">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>All systems operational</span>
                </div>
            );
        }

        return (
            <div className="flex items-center gap-2 text-xs">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600">Service temporarily unavailable</span>
            </div>
        );
    };

    return (
        <footer className="bg-gradient-to-r from-surface/50 to-surface/30 border-t border-surface/50 mt-24">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    
                    {/* Brand Section - Wider */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                                <Timer size={20} className="text-background" />
                            </div>
                            <span
                                className="text-2xl font-bold text-primary"
                                style={{ fontFamily: "Joti One" }}
                            >
                                Dorofi
                            </span>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed mb-4">
                            Master focused work with the enhanced Pomodoro technique. 
                            Built for everyone who wants to get things done without burning out.
                        </p>
                        
                        {/* Subtle Developer Link */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.open('https://github.com/callmenixsh/Dorofi', '_blank')}
                                className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-sm group"
                            >
                                <Github size={16} className="group-hover:scale-110 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* App Features */}
                    <div>
                        <h4 className="font-semibold text-primary mb-4">Features</h4>
                        <div className="space-y-2 text-sm">
                            <button
                                onClick={() => handleNavigation('/timer')}
                                className="block text-left text-secondary hover:text-primary transition-colors"
                            >
                                Focus Timer
                            </button>
                            <button
                                onClick={() => handleNavigation('/friends')}
                                className="block text-left text-secondary hover:text-primary transition-colors"
                            >
                                Friends & Leaderboard
                            </button>
                            <button
                                onClick={() => handleNavigation('/profile')}
                                className="block text-left text-secondary hover:text-primary transition-colors"
                            >
                                Progress Analytics
                            </button>
                            <button
                                onClick={() => handleNavigation('/rooms')}
                                className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                            >
                                <span>Study Rooms</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                    Coming Soon
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Support & Resources */}
                    <div>
                        <h4 className="font-semibold text-primary mb-4">Resources</h4>
                        <div className="space-y-2 text-sm">
                            <button
                                onClick={() => handleNavigation('/about')}
                                className="block text-left text-secondary hover:text-primary transition-colors"
                            >
                                About Dorofi
                            </button>
                            <button
                                onClick={() => handleNavigation('/guide')}
                                className="block text-left text-secondary hover:text-primary transition-colors"
                            >
                                How to Use
                            </button>
                            <button
                                onClick={() => handleNavigation('/policies?tab=faq')}
                                className="flex items-center gap-1 text-secondary hover:text-primary transition-colors"
                            >
                                <span>FAQs</span>
                            </button>
                            <button
                                onClick={() => handleNavigation('/support')}
                                className="block text-left text-secondary hover:text-primary transition-colors"
                            >
                                Contact Support
                            </button>
                        </div>
                        
                        {/* Dynamic Status Indicator */}
                        <div className="mt-4 pt-4 border-t border-surface/30">
                            <StatusIndicator />
                            {backendStatus.lastChecked && (
                                <div className="text-xs text-secondary/60 mt-1">
                                    Last checked: {backendStatus.lastChecked.toLocaleTimeString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-surface/30 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-secondary">
                        <div className="flex items-center gap-1.5">
                            <span>© {currentYear} Dorofi.</span>
                            <span>Made with</span>
                            <Heart size={14} className="text-red-500 fill-current animate-pulse" />
                            <span>for better productivity</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => handleNavigation('/policies?tab=privacy')}
                                className="hover:text-primary transition-colors"
                            >
                                Privacy Policy
                            </button>
                            <button
                                onClick={() => handleNavigation('/policies?tab=terms')}
                                className="hover:text-primary transition-colors"
                            >
                                Terms of Service
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
