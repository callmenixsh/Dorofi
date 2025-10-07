// components/Profile/StatusManager.jsx - Compact Balanced Design
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Eye, EyeOff, Edit3, Check, X, Plus, Smile } from 'lucide-react';

export default function StatusManager({ 
  user, 
  onStatusUpdate, 
  updatePresenceStatus, 
  updateUserCustomStatus, 
  updatePrivacySettings 
}) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [customText, setCustomText] = useState(user.customStatus?.text || '');
    const [customEmoji, setCustomEmoji] = useState(user.customStatus?.emoji || '');
    const [saving, setSaving] = useState(false);
    const [isEditingCustom, setIsEditingCustom] = useState(false);
    const dropdownRef = useRef(null);

    const presenceOptions = [
        { id: 'online', label: 'Available', color: 'bg-green-500' },
        { id: 'away', label: 'Away', color: 'bg-yellow-500' },
        { id: 'busy', label: 'Do Not Disturb', color: 'bg-red-500' },
        { id: 'invisible', label: 'Invisible', color: 'bg-gray-400' },
    ];

    const quickEmojis = ['😊', '💻', '📚', '☕', '🎵', '😴', '💪', '🔥'];
    const quickStatuses = [
        { emoji: '📚', text: 'Studying' },
        { emoji: '💻', text: 'Working' },
        { emoji: '☕', text: 'Break' },
        { emoji: '🎵', text: 'Music' },
    ];

    const currentPresence = user.presence?.status || 'online';
    const hasCustomStatus = user.customStatus?.isActive && user.customStatus?.text;
    const showLastSeen = user.privacy?.showLastSeen !== false;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
                setIsEditingCustom(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePresenceChange = async (newStatus) => {
        try {
            onStatusUpdate({ 
                presence: { ...user.presence, status: newStatus, isManual: true } 
            });
            setShowDropdown(false);
            
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
            setShowDropdown(false);
            
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
            setShowDropdown(false);
            
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
            setShowDropdown(false);
            
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
            : presenceOption?.label || 'Available';
        
        return {
            text: statusText,
            color: presenceOption?.color || 'bg-green-500'
        };
    };

    const currentStatus = getCurrentStatusDisplay();

    return (
        <div className="relative mb-6" ref={dropdownRef}>
            {/* Main Status Card */}
            <div className="bg-surface rounded-xl p-4 border border-background shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                    {/* Status Button */}
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 flex-1 hover:bg-background/50 rounded-lg px-3 py-2 transition-all group"
                    >
                        <div className="relative">
                            <div className={`w-3 h-3 ${currentStatus.color} rounded-full shadow-sm`} />
                            {hasCustomStatus && (
                                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                            )}
                        </div>
                        <div className="text-left flex-1">
                            <div className="text-sm font-medium text-primary truncate">
                                {currentStatus.text}
                            </div>
                        </div>
                        <ChevronDown 
                            size={16} 
                            className={`text-secondary transition-all duration-300 group-hover:text-primary ${
                                showDropdown ? 'rotate-180' : ''
                            }`} 
                        />
                    </button>
                    
                    {/* Privacy Toggle */}
                    <div className="flex items-center gap-2 ml-4 pl-4 border-l border-background">
                        {showLastSeen ? (
                            <Eye size={14} className="text-green-500" />
                        ) : (
                            <EyeOff size={14} className="text-gray-400" />
                        )}
                        <button
                            onClick={toggleLastSeen}
                            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-all ${
                                showLastSeen ? 'bg-primary' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-sm transition-transform ${
                                    showLastSeen ? 'translate-x-3.5' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Compact Dropdown */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-background rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3">
                        {/* Presence Options */}
                        <div className="mb-3">
                            <h3 className="text-xs font-medium text-secondary mb-2">Status</h3>
                            <div className="grid grid-cols-2 gap-1">
                                {presenceOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => handlePresenceChange(option.id)}
                                        className={`flex items-center gap-2 px-2 py-2 rounded text-xs transition-all ${
                                            currentPresence === option.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'hover:bg-background text-secondary'
                                        }`}
                                    >
                                        <div className={`w-2 h-2 ${option.color} rounded-full`} />
                                        <span className="truncate">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Status */}
                        <div className="border-t border-background pt-3">
                            {!isEditingCustom ? (
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xs font-medium text-secondary">Message</h3>
                                        {hasCustomStatus && (
                                            <button 
                                                onClick={clearStatus}
                                                className="text-xs text-red-500 hover:text-red-600"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    
                                    <button
                                        onClick={() => setIsEditingCustom(true)}
                                        className="w-full flex items-center gap-2 p-2 hover:bg-background rounded text-sm text-left mb-2"
                                    >
                                        {hasCustomStatus ? (
                                            <>
                                                <span>{user.customStatus.emoji}</span>
                                                <span className="text-primary flex-1 truncate">{user.customStatus.text}</span>
                                                <Edit3 size={12} className="text-secondary" />
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={14} className="text-secondary" />
                                                <span className="text-secondary">Set message</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Quick Status */}
                                    <div className="grid grid-cols-2 gap-1">
                                        {quickStatuses.map((status, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleQuickStatus(status)}
                                                className="flex items-center gap-1 px-2 py-1.5 hover:bg-background rounded text-xs"
                                            >
                                                <span className="text-sm">{status.emoji}</span>
                                                <span className="text-secondary truncate">{status.text}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-medium text-secondary">Edit Message</h3>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => {
                                                    setIsEditingCustom(false);
                                                    setCustomText(user.customStatus?.text || '');
                                                    setCustomEmoji(user.customStatus?.emoji || '');
                                                }}
                                                className="p-1 text-secondary hover:text-primary"
                                            >
                                                <X size={12} />
                                            </button>
                                            <button
                                                onClick={handleSaveCustom}
                                                disabled={saving}
                                                className="p-1 text-white bg-primary hover:bg-primary/90 rounded disabled:opacity-50"
                                            >
                                                {saving ? (
                                                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Check size={12} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-background border border-background rounded flex items-center justify-center text-lg">
                                            {customEmoji || <Smile size={14} className="text-secondary" />}
                                        </div>
                                        <input
                                            type="text"
                                            value={customText}
                                            onChange={(e) => setCustomText(e.target.value)}
                                            placeholder="Your message"
                                            className="flex-1 px-2 py-1.5 text-sm border border-background rounded bg-background text-primary focus:outline-none focus:border-primary"
                                            maxLength="30"
                                            autoFocus
                                        />
                                    </div>

                                    {/* Emoji Row */}
                                    <div className="flex gap-1 justify-center">
                                        {quickEmojis.map((emoji, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCustomEmoji(emoji)}
                                                className={`w-6 h-6 text-sm hover:bg-background rounded flex items-center justify-center ${
                                                    customEmoji === emoji ? 'bg-primary/20' : ''
                                                }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
