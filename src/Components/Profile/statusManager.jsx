// components/Profile/StatusManager.jsx - FIXED HEADER CORNER BLEEDING
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Edit3, 
  Check, 
  X, 
  Smile, 
  Zap, 
  Circle, 
  Shield, 
  Clock,
  Trash2
} from 'lucide-react';

export default function StatusManager({ 
  user, 
  onStatusUpdate, 
  updatePresenceStatus, 
  updateUserCustomStatus, 
  updatePrivacySettings 
}) {
    const [showModal, setShowModal] = useState(false);
    const [closing, setClosing] = useState(false);
    const [customText, setCustomText] = useState(user.customStatus?.text || '');
    const [customEmoji, setCustomEmoji] = useState(user.customStatus?.emoji || '');
    const [saving, setSaving] = useState(false);
    const [isEditingCustom, setIsEditingCustom] = useState(false);
    const modalRef = useRef(null);

    const presenceOptions = [
        { id: 'online', label: 'Online', color: 'bg-green-500', icon: Circle },
        { id: 'away', label: 'Away', color: 'bg-yellow-500', icon: Clock },
        { id: 'busy', label: 'Do Not Disturb', color: 'bg-red-500', icon: X },
        { id: 'invisible', label: 'Invisible', color: 'bg-gray-400', icon: EyeOff },
    ];

    const quickEmojis = ['😊', '💻', '📚', '☕', '🎵', '😴', '💪', '🔥', '🎮', '📱', '💡', '🌟', '🎯', '🚀', '🌈', '✨'];
    
    const quickStatuses = [
        { emoji: '📚', text: 'Studying' },
        { emoji: '💻', text: 'Working' },
        { emoji: '☕', text: 'On Break' },
        { emoji: '🎵', text: 'Vibing' },
        { emoji: '🎮', text: 'Gaming' },
        { emoji: '😴', text: 'Sleeping' },
    ];

    const currentPresence = user.presence?.status || 'online';
    const hasCustomStatus = user.customStatus?.isActive && user.customStatus?.text;
    const showLastSeen = user.privacy?.showLastSeen !== false;

    const handleCloseModal = useCallback(() => {
        setClosing(true);
        setTimeout(() => {
            setShowModal(false);
            setClosing(false);
            setIsEditingCustom(false);
        }, 140);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleCloseModal();
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                handleCloseModal();
            }
        };

        if (showModal) {
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
    }, [showModal, handleCloseModal]);

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
            handleCloseModal();
            
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
            
            handleCloseModal();
            
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
            handleCloseModal();
            
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
            <div className="mb-6">
                <button 
                    onClick={() => setShowModal(true)}
                    className="w-full bg-surface rounded-xl p-4 border border-surface/50 hover:border-primary/20 transition-all duration-200 group shadow-sm hover:shadow-md"
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
                                <div className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                                    {currentStatus.text}
                                </div>
                                <div className="text-xs text-secondary font-medium">
                                    Click to change status
                                </div>
                            </div>
                        </div>
                        <ChevronDown size={16} className="text-secondary group-hover:text-primary transition-colors" />
                    </div>
                </button>
            </div>

            {showModal && createPortal(
                <div className={`fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 ${closing ? 'animate-backdrop-out' : 'animate-backdrop-in'}`}>
                    <div 
                        ref={modalRef}
                        className={`bg-background rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden border border-primary/20 flex flex-col relative ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-surface/50 bg-gradient-to-r from-surface/30 to-surface/10 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center shrink-0">
                                    <Zap size={24} className="text-background" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-primary">Status</h2>
                                    <p className="text-xs text-secondary mt-0.5">Show the world what you're up to</p>
                                </div>
                                <button 
                                    onClick={handleCloseModal}
                                    className="rounded-full p-2 hover:bg-surface/80 transition-colors"
                                    aria-label="Close"
                                >
                                    <X size={20} className="text-secondary hover:text-primary transition-colors" />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
                            {/* Presence Status */}
                            <section>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    <h3 className="text-sm font-bold text-primary uppercase tracking-tight">Presence</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {presenceOptions.map((option) => {
                                        const isSelected = currentPresence === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                onClick={() => handlePresenceChange(option.id)}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left group relative overflow-hidden text-secondary  ${
                                                    isSelected
                                                        ? 'bg-primary/10 border-primary/40 shadow-sm'
                                                        : 'bg-surface/50 border-surface hover:bg-surface/80 hover:text-primary'
                                                }`}
                                            >
                                                <div className={`w-2.5 h-2.5 ${option.color} rounded-full ring-4 ring-offset-2 ring-transparent transition-all duration-300`} />
                                                <span className="text-sm font-bold truncate">{option.label}</span>
                                                {isSelected && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Check size={14} className="text-primary" />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* Custom Message */}
                            <section className="border-t border-surface/50 pt-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                        <h3 className="text-sm font-bold text-primary uppercase tracking-tight">Status Message</h3>
                                    </div>
                                    {hasCustomStatus && !isEditingCustom && (
                                        <button 
                                            onClick={clearStatus}
                                            className="group flex items-center gap-1.5 text-xs text-rose-500 hover:text-rose-600 font-bold transition-all px-2 py-1 rounded-lg hover:bg-rose-500/5"
                                        >
                                            <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
                                            Clear
                                        </button>
                                    )}
                                </div>

                                {!isEditingCustom ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setIsEditingCustom(true)}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-surface/50 hover:bg-surface/80 border border-surface transition-all text-left shadow-sm group"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform duration-300 border border-surface">
                                                {user.customStatus?.emoji || '😊'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-primary font-bold truncate">
                                                    {user.customStatus?.text || 'Set a custom message...'}
                                                </p>
                                                <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">Click to edit status</p>
                                            </div>
                                            <div className="p-2 rounded-xl bg-background/50 group-hover:bg-primary/10 transition-colors">
                                                <Edit3 size={16} className="text-secondary group-hover:text-primary transition-colors" />
                                            </div>
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            {quickStatuses.map((status, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuickStatus(status)}
                                                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-surface/30 hover:bg-surface/50 border border-surface transition-all text-left group shadow-sm"
                                                    disabled={saving}
                                                >
                                                    <span className="text-lg group-hover:scale-125 transition-transform duration-300">{status.emoji}</span>
                                                    <span className="text-xs text-primary font-bold truncate">{status.text}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-5 animate-fade-in">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-surface/50 border border-primary/20 shadow-inner group transition-all">
                                            <div className="w-12 h-12 bg-background border border-surface rounded-xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ring-4 ring-primary/5">
                                                {customEmoji || <Smile size={24} className="text-secondary/50" />}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    value={customText}
                                                    onChange={(e) => setCustomText(e.target.value)}
                                                    placeholder="What's happening?"
                                                    className="w-full bg-transparent text-sm text-primary placeholder-secondary/50 focus:outline-none font-bold"
                                                    maxLength="50"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-surface/30 p-4 rounded-2xl border border-surface shadow-sm">
                                            <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                                                {quickEmojis.map((emoji, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCustomEmoji(emoji)}
                                                        className={`w-10 h-10 text-xl hover:bg-surface/80 rounded-xl flex items-center justify-center transition-all hover:scale-125 duration-200 ${
                                                            customEmoji === emoji ? 'bg-surface/100 scale-110 shadow-md ring-2 ring-primary/20' : 'opacity-70 hover:opacity-100'
                                                        }`}
                                                    >
                                                        {emoji}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => {
                                                    setIsEditingCustom(false);
                                                    setCustomText(user.customStatus?.text || '');
                                                    setCustomEmoji(user.customStatus?.emoji || '');
                                                }}
                                                className="flex-1 px-6 py-3 rounded-xl bg-surface/50 hover:bg-surface/80 text-secondary hover:text-primary border border-surface transition-all font-bold text-sm shadow-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSaveCustom}
                                                disabled={saving}
                                                className="flex-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 text-background font-bold transition-all text-sm disabled:opacity-50 shadow-sm"
                                            >
                                                {saving ? (
                                                    <div className="w-5 h-5 border-3 border-background border-t-transparent rounded-full animate-spin mx-auto" />
                                                ) : (
                                                    'Update Status'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Privacy Setting */}
                            <section className="border-t border-surface/50 pt-6 pb-2">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-surface/30 border border-surface shadow-sm group hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl transition-all duration-500 ${showLastSeen ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-secondary/10 text-secondary'}`}>
                                            {showLastSeen ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-primary">Show Last Seen</p>
                                            <p className="text-[11px] text-secondary font-medium leading-tight mt-0.5">Let others see your activity history</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={toggleLastSeen}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all flex-shrink-0 ${
                                            showLastSeen ? 'bg-primary' : 'bg-surface'
                                        } border-2 ${showLastSeen ? 'border-primary' : 'border-surface'}`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full transition-all duration-300 ${
                                                showLastSeen ? 'translate-x-6 bg-background' : 'translate-x-1 bg-primary/40'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}
