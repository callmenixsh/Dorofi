// components/Profile/StatusManager.jsx - FIXED HEADER CORNER BLEEDING
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Eye, EyeOff, Edit3, Check, X, Plus, Smile, Zap } from 'lucide-react';

export default function StatusManager({ 
  user, 
  onStatusUpdate, 
  updatePresenceStatus, 
  updateUserCustomStatus, 
  updatePrivacySettings 
}) {
    const [showModal, setShowModal] = useState(false);
    const [customText, setCustomText] = useState(user.customStatus?.text || '');
    const [customEmoji, setCustomEmoji] = useState(user.customStatus?.emoji || '');
    const [saving, setSaving] = useState(false);
    const [isEditingCustom, setIsEditingCustom] = useState(false);
    const modalRef = useRef(null);

    const presenceOptions = [
        { id: 'online', label: 'Online', color: 'bg-green-500' },
        { id: 'away', label: 'Away', color: 'bg-yellow-500' },
        { id: 'busy', label: 'Do Not Disturb', color: 'bg-red-500' },
        { id: 'invisible', label: 'Invisible', color: 'bg-gray-400' },
    ];

    const quickEmojis = ['😊', '💻', '📚', '☕', '🎵', '😴', '💪', '🔥', '🎮', '📱', '💡', '🌟'];
    
    const quickStatuses = [
        { emoji: '📚', text: 'Studying' },
        { emoji: '💻', text: 'Working' },
        { emoji: '☕', text: 'On Break' },
        { emoji: '🎵', text: 'Listening to Music' },
        { emoji: '🎮', text: 'Gaming' },
        { emoji: '😴', text: 'Sleeping' },
    ];

    const currentPresence = user.presence?.status || 'online';
    const hasCustomStatus = user.customStatus?.isActive && user.customStatus?.text;
    const showLastSeen = user.privacy?.showLastSeen !== false;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
                setIsEditingCustom(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
                setIsEditingCustom(false);
            }
        };

        if (showModal) {
            // Prevent background scrolling
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = originalStyle;
            };
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [showModal]);

    const handlePresenceChange = async (newStatus) => {
        try {
            onStatusUpdate({ 
                presence: { ...user.presence, status: newStatus, isManual: true } 
            });
            
            if (updatePresenceStatus) {
                await updatePresenceStatus(newStatus);
            }
        } catch (error) {
            console.error('Failed to update presence:', error);
        }
    };

    const handleQuickStatus = async (status) => {
        try {
            setSaving(true);
            
            onStatusUpdate({
                customStatus: {
                    text: status.text,
                    emoji: status.emoji,
                    isActive: true
                }
            });
            
            setCustomText(status.text);
            setCustomEmoji(status.emoji);
            setShowModal(false);
            
            if (updateUserCustomStatus) {
                await updateUserCustomStatus({
                    text: status.text,
                    emoji: status.emoji,
                    isActive: true
                });
            }
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveCustom = async () => {
        try {
            setSaving(true);
            const isActive = !!(customText.trim() || customEmoji);
            
            onStatusUpdate({
                customStatus: {
                    text: customText.trim(),
                    emoji: customEmoji,
                    isActive
                }
            });
            
            setIsEditingCustom(false);
            setShowModal(false);
            
            if (updateUserCustomStatus) {
                await updateUserCustomStatus({
                    text: customText.trim(),
                    emoji: customEmoji,
                    isActive
                });
            }
        } catch (error) {
            console.error('Failed to update custom status:', error);
        } finally {
            setSaving(false);
        }
    };

    const clearStatus = async () => {
        try {
            onStatusUpdate({ customStatus: { text: '', emoji: '', isActive: false } });
            setCustomText('');
            setCustomEmoji('');
            setShowModal(false);
            
            if (updateUserCustomStatus) {
                await updateUserCustomStatus({ text: '', emoji: '', isActive: false });
            }
        } catch (error) {
            console.error('Failed to clear status:', error);
        }
    };

    const toggleLastSeen = async () => {
        try {
            const newValue = !showLastSeen;
            
            onStatusUpdate({
                privacy: { ...user.privacy, showLastSeen: newValue }
            });
            
            if (updatePrivacySettings) {
                await updatePrivacySettings({ showLastSeen: newValue });
            }
        } catch (error) {
            console.error('Failed to update privacy:', error);
        }
    };

    const getCurrentStatusDisplay = () => {
        const presenceOption = presenceOptions.find(opt => opt.id === currentPresence);
        const statusText = hasCustomStatus 
            ? `${user.customStatus.emoji} ${user.customStatus.text}`
            : presenceOption?.label || 'Online';
        
        return {
            text: statusText,
            color: presenceOption?.color || 'bg-green-500'
        };
    };

    const currentStatus = getCurrentStatusDisplay();

    return (
        <>
            {/* Simple Status Button */}
            <div className="mb-6">
                <button 
                    onClick={() => setShowModal(true)}
                    className="w-full bg-surface rounded-lg p-4 border border-background hover:border-primary/20 transition-all duration-200 group"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className={`w-3 h-3 ${currentStatus.color} rounded-full`} />
                                {hasCustomStatus && (
                                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full"></div>
                                )}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-medium text-primary group-hover:text-accent transition-colors">
                                    {currentStatus.text}
                                </div>
                                <div className="text-xs text-secondary">
                                    Click to change status
                                </div>
                            </div>
                        </div>
                        <ChevronDown size={16} className="text-secondary group-hover:text-primary transition-colors" />
                    </div>
                </button>
            </div>

            {/* Cool Modal Background */}
            {showModal && (
                <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 min-h-screen">

                    <div 
                        ref={modalRef}
                        className="relative w-full max-w-sm sm:max-w-md bg-background/95 backdrop-blur-xl rounded-xl border border-primary/20 shadow-2xl max-h-[85vh] flex flex-col overflow-hidden"
                    >
                        {/* 🔥 FIXED: Header with proper corner clipping */}
                        <div className="relative overflow-hidden rounded-t-xl">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-primary/20"></div>
                            <div className="relative flex items-center justify-between p-4 sm:p-6 border-b border-primary/20">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg">
                                        <Zap size={18} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-primary">Status</h2>
                                        <p className="text-xs text-secondary">Show the world what you're up to</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    className="p-2 rounded-lg hover:bg-surface/80 text-secondary hover:text-primary transition-all duration-200"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                            {/* Presence Status */}
                            <div>
                                <h3 className="text-sm font-medium text-primary mb-3">Presence</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {presenceOptions.map((option) => {
                                        const isSelected = currentPresence === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => handlePresenceChange(option.id)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                                                    isSelected
                                                        ? 'bg-primary/5 border-primary/20 text-primary'
                                                        : 'bg-surface border-background hover:border-primary/20 text-secondary hover:text-primary'
                                                }`}
                                            >
                                                <div className={`w-2.5 h-2.5 ${option.color} rounded-full flex-shrink-0`} />
                                                <span className="text-sm font-medium">{option.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Custom Message */}
                            <div className="border-t border-surface pt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium text-primary">Custom Message</h3>
                                    {hasCustomStatus && !isEditingCustom && (
                                        <button 
                                            onClick={clearStatus}
                                            className="text-xs text-red-500 hover:text-red-600 transition-colors"
                                        >
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {!isEditingCustom ? (
                                    <div className="space-y-3">
                                        {/* Current Status */}
                                        <button
                                            onClick={() => setIsEditingCustom(true)}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-surface hover:bg-surface/80 border border-background hover:border-primary/20 transition-all text-left"
                                        >
                                            <span className="text-lg">{user.customStatus?.emoji || '😊'}</span>
                                            <span className="flex-1 text-sm text-primary">
                                                {user.customStatus?.text || 'Set a custom message'}
                                            </span>
                                            <Edit3 size={16} className="text-secondary flex-shrink-0" />
                                        </button>

                                        {/* Quick Options */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {quickStatuses.map((status, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleQuickStatus(status)}
                                                    className="flex items-center gap-2 p-2.5 rounded-lg bg-surface hover:bg-primary/5 border border-background hover:border-primary/20 transition-all text-left"
                                                    disabled={saving}
                                                >
                                                    <span className="text-sm">{status.emoji}</span>
                                                    <span className="text-xs text-secondary truncate">{status.text}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Custom Input */}
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-background">
                                            <button
                                                className="w-10 h-10 bg-background border border-background rounded-lg flex items-center justify-center text-lg hover:bg-surface transition-colors flex-shrink-0"
                                                onClick={() => {/* Could add emoji picker */}}
                                            >
                                                {customEmoji || <Smile size={16} className="text-secondary" />}
                                            </button>
                                            <input
                                                type="text"
                                                value={customText}
                                                onChange={(e) => setCustomText(e.target.value)}
                                                placeholder="What's your status?"
                                                className="flex-1 bg-transparent text-sm text-primary placeholder-secondary focus:outline-none"
                                                maxLength="50"
                                                autoFocus
                                            />
                                        </div>

                                        {/* Emoji Grid */}
                                        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                                            {quickEmojis.map((emoji, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCustomEmoji(emoji)}
                                                    className={`w-8 h-8 text-sm hover:bg-surface rounded-lg flex items-center justify-center transition-all ${
                                                        customEmoji === emoji ? 'bg-primary/10' : ''
                                                    }`}
                                                >
                                                    {emoji}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setIsEditingCustom(false);
                                                    setCustomText(user.customStatus?.text || '');
                                                    setCustomEmoji(user.customStatus?.emoji || '');
                                                }}
                                                className="flex-1 px-4 py-2 rounded-lg bg-surface hover:bg-surface/80 text-secondary hover:text-primary border border-background transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveCustom}
                                                disabled={saving}
                                                className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-all disabled:opacity-50"
                                            >
                                                {saving ? (
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                                                ) : (
                                                    'Save'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Privacy Setting */}
                            <div className="border-t border-surface pt-6">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-surface">
                                    <div className="flex items-center gap-3">
                                        {showLastSeen ? (
                                            <Eye size={16} className="text-green-500 flex-shrink-0" />
                                        ) : (
                                            <EyeOff size={16} className="text-gray-400 flex-shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-primary">Show Last Seen</p>
                                            <p className="text-xs text-secondary">Let others see when you were last active</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleLastSeen}
                                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all flex-shrink-0 ${
                                            showLastSeen ? 'bg-primary' : 'bg-gray-300'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${
                                                showLastSeen ? 'translate-x-5' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
