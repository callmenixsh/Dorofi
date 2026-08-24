// components/LoginPromptModal.jsx
import { X, Users, Star, TrendingUp, Trophy } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export default function LoginPromptModal({ onClose, onLogin, featureType = "features", isLoading = false }) {
    const [closing, setClosing] = useState(false);

    const handleClose = useCallback(() => {
        setClosing(true);
        setTimeout(() => onClose(), 140);
    }, [onClose]);
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

    const getFeatureContent = () => {
        switch (featureType) {
            case 'friends':
                return {
                    title: 'Connect with Friends',
                    icon: <Users size={24} className="text-background" />,
                    benefits: [
                        'Add study buddies and track their progress',
                        'Compete on leaderboards and daily streaks',
                        'Share custom statuses and study sessions',
                    ]
                };
            case 'rooms':
                return {
                    title: 'Join Study Rooms',
                    icon: <Trophy size={24} className="text-background" />,
                    benefits: [
                        'Create or join group study sessions',
                        'Real-time sync with other students',
                        'Motivate each other with live progress',
                        'Access exclusive group features'
                    ]
                };
            default:
                return {
                    title: 'Unlock Features',
                    description: 'Sign in to access all features',
                    icon: <Star size={24} className="text-background" />,
                    benefits: [
                        'Track your productivity statistics',
                        'Connect with study partners',
                        'Join collaborative study rooms',
                        'Earn achievements and badges'
                    ]
                };
        }
    };

    const content = getFeatureContent();

    return createPortal(
        <div className={`fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}>
            <div className={`bg-background rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-primary/20 flex flex-col relative ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}>
                {/* Header */}
                <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shrink-0">
                            {content.icon}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-primary">{content.title}</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-full p-2 hover:bg-surface/80 transition-colors"
                            aria-label="Close"
                        >
                            <X size={20} className="text-secondary hover:text-primary transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Benefits */}
                    <div className="space-y-3">
                        {content.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 p-3.5 bg-surface/50 rounded-xl border border-surface hover:bg-surface/80 transition-colors">
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                                <p className="text-sm font-medium text-primary leading-tight">{benefit}</p>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2">
                        <button
                            onClick={onLogin}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 text-background rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <FaGoogle size={18} />
                            )}
                            <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
                        </button>
                        
                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-2.5 text-secondary hover:text-primary transition-colors text-sm hover:bg-surface/50 rounded-xl font-medium"
                        >
                            Maybe later
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
