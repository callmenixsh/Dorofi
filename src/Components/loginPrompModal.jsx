// components/LoginPromptModal.jsx
import { X, Users, Star, TrendingUp, Trophy } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';
import { useEffect } from 'react';

export default function LoginPromptModal({ onClose, onLogin, featureType = "features", isLoading = false }) {
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
                    description: 'Join the social study experience',
                    icon: <Users size={32} className="text-secondary" />,
                    benefits: [
                        'Add study buddies and track their progress',
                        'Compete on leaderboards and daily streaks',
                        'Share custom statuses and study sessions',
                    ]
                };
            case 'rooms':
                return {
                    title: 'Join Study Rooms',
                    description: 'Study together in real-time',
                    icon: <Trophy size={32} className="text-accent" />,
                    benefits: [
                        'Create or join group study sessions',
                        'Real-time sync with other students',
                        'Motivate each other with live progress',
                        'Access exclusive group features'
                    ]
                };
            default:
                return {
                    title: 'Unlock Premium Features',
                    description: 'Sign in to access all features',
                    icon: <Star size={32} className="text-primary" />,
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

    return (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-xl shadow-2xl w-full max-w-md border border-surface/50">
                {/* Header */}
                <div className="relative p-6 pb-4">
                    <button 
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full p-2 hover:bg-surface/80 transition-colors"
                        aria-label="Close"
                    >
                        <X size={20} className="text-secondary hover:text-primary transition-colors" />
                    </button>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl mx-auto mb-4 flex items-center justify-center border border-primary/20">
                            {content.icon}
                        </div>
                        <h2 className="text-xl font-bold text-primary mb-2">{content.title}</h2>
                        <p className="text-secondary text-sm">{content.description}</p>
                    </div>
                </div>

                {/* Benefits */}
                <div className="px-6 pb-6 space-y-3">
                    {content.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-surface/30 rounded-lg border border-surface/20 hover:bg-surface/40 transition-colors">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <p className="text-sm text-primary">{benefit}</p>
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 space-y-3">
                    <button
                        onClick={onLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-primary hover:bg-primary/90 text-background rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <FaGoogle size={18} />
                        )}
                        <span>{isLoading ? "Signing in..." : "Continue with Google"}</span>
                    </button>
                    
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-secondary hover:text-primary transition-colors text-sm hover:bg-surface/30 rounded-lg"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
}
