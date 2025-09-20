// components/Profile/StatusManager.jsx - Fixed error handling
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Eye, EyeOff, Edit3, Check, X } from 'lucide-react';

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
        { id: 'online', label: 'Online', color: 'bg-green-500' },
        { id: 'away', label: 'Away', color: 'bg-yellow-500' },
        { id: 'busy', label: 'Do Not Disturb', color: 'bg-red-500' },
        { id: 'invisible', label: 'Invisible', color: 'bg-gray-400' },
    ];

    const commonEmojis = [
        '😊', '😴', '📚', '💻', '☕', '🎵', '🎮', '🍕', 
        '💪', '🧠', '🔥', '❤️', '🎉', '👀', '🤔', '😅'
    ];

    const quickStatuses = [
        { emoji: '📚', text: 'Studying' },
        { emoji: '💻', text: 'Working' },
        { emoji: '☕', text: 'On break' },
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

    // 🔧 Fixed handlers with better error handling
    const handlePresenceChange = async (newStatus) => {
        try {
            // Update UI immediately for better UX
            onStatusUpdate({ 
                presence: { ...user.presence, status: newStatus, isManual: true } 
            });
            setShowDropdown(false);
            
            // Then try to update on server
            if (updatePresenceStatus) {
                await updatePresenceStatus(newStatus);
            }
        } catch (error) {
            console.error('Failed to update presence:', error);
            // UI is already updated, no need to revert
        }
    };

    const handleQuickStatus = async (status) => {
        try {
            setSaving(true);
            
            // Update UI immediately
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
            
            // Then try to update on server
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
            
            // Update UI immediately
            onStatusUpdate({
                customStatus: {
                    text: customText.trim(),
                    emoji: customEmoji,
                    isActive
                }
            });
            
            setIsEditingCustom(false);
            setShowDropdown(false);
            
            // Then try to update on server
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
            // Update UI immediately
            onStatusUpdate({ customStatus: { text: '', emoji: '', isActive: false } });
            setCustomText('');
            setCustomEmoji('');
            setShowDropdown(false);
            
            // Then try to update on server
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
            
            // Update UI immediately
            onStatusUpdate({
                privacy: { ...user.privacy, showLastSeen: newValue }
            });
            
            // Then try to update on server
            if (updatePrivacySettings) {
                await updatePrivacySettings({ showLastSeen: newValue });
            }
        } catch (error) {
            console.error('Failed to update privacy:', error);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setCustomEmoji(emoji);
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
        <div className="relative mb-6" ref={dropdownRef}>
            {/* Your existing JSX - exactly the same */}
            <div className="bg-surface rounded-lg p-2">
                <div className="flex items-center justify-between">
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 flex-1 hover:bg-background rounded px-2 py-1 transition-colors"
                    >
                        <div className={`w-3 h-3 ${currentStatus.color} rounded-full`} />
                        <span className="text-sm text-primary truncate">
                            {currentStatus.text}
                        </span>
                        <ChevronDown 
                            size={14} 
                            className={`text-secondary transition-transform ml-auto ${
                                showDropdown ? 'rotate-180' : ''
                            }`} 
                        />
                    </button>
                    
                    <div className="flex items-center gap-1.5 ml-2 p-3">
                        {showLastSeen ? (
                            <Eye size={12} className="text-secondary" />
                        ) : (
                            <EyeOff size={12} className="text-secondary" />
                        )}
                        <span className="text-xs text-secondary">Last seen</span>
                        <button
                            onClick={toggleLastSeen}
                            className={`relative inline-flex h-3.5 w-6 items-center rounded-full transition-colors ${
                                showLastSeen ? 'bg-primary' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-2 w-2 transform rounded-full bg-white transition-transform ${
                                    showLastSeen ? 'translate-x-3' : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Keep all your existing dropdown JSX exactly the same */}
            {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-background rounded-lg shadow-lg z-50 p-3">
                    {/* Presence options - In a grid */}
                    <div className="mb-3">
                        <p className="text-xs text-secondary font-medium mb-2">STATUS</p>
                        <div className="grid grid-cols-4 gap-1">
                            {presenceOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handlePresenceChange(option.id)}
                                    className={`flex items-center gap-2 px-2 py-2 rounded text-sm transition-colors ${
                                        currentPresence === option.id
                                            ? 'bg-primary/10 text-primary'
                                            : 'hover:bg-background text-secondary'
                                    }`}
                                >
                                    <div className={`w-2.5 h-2.5 ${option.color} rounded-full`} />
                                    <span className="text-xs">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="border-t border-background pt-3">
                        {/* Custom status section */}
                        {!isEditingCustom ? (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs text-secondary font-medium">CUSTOM STATUS</p>
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
                                    <Edit3 size={14} className="text-secondary" />
                                    <span className="text-secondary">
                                        {hasCustomStatus 
                                            ? `${user.customStatus.emoji} ${user.customStatus.text}`
                                            : 'Set a custom status'
                                        }
                                    </span>
                                </button>

                                <div className="flex gap-1">
                                    {quickStatuses.map((status, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleQuickStatus(status)}
                                            disabled={saving}
                                            className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 hover:bg-background rounded text-xs transition-colors disabled:opacity-50"
                                            title={status.text}
                                        >
                                            <span>{status.emoji}</span>
                                            <span className="text-secondary truncate">{status.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-xs text-secondary font-medium">CUSTOM STATUS</p>
                                
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 flex items-center justify-center bg-background border border-background rounded text-sm">
                                        {customEmoji || '😀'}
                                    </div>
                                    <input
                                        type="text"
                                        value={customText}
                                        onChange={(e) => setCustomText(e.target.value)}
                                        placeholder="What's your status?"
                                        className="flex-1 px-2 py-1.5 text-sm border border-background rounded bg-background text-primary focus:outline-none focus:border-primary"
                                        maxLength="30"
                                        autoFocus
                                    />
                                </div>

                                <div className="flex flex-wrap gap-1 p-2 bg-background rounded">
                                    {commonEmojis.map((emoji, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleEmojiSelect(emoji)}
                                            className={`w-6 h-6 text-sm hover:bg-primary/10 rounded transition-colors flex items-center justify-center ${
                                                customEmoji === emoji ? 'bg-primary/20 ring-1 ring-primary' : ''
                                            }`}
                                            title={`Select ${emoji}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setIsEditingCustom(false);
                                            setCustomText(user.customStatus?.text || '');
                                            setCustomEmoji(user.customStatus?.emoji || '');
                                        }}
                                        className="p-1.5 text-secondary hover:text-primary"
                                    >
                                        <X size={14} />
                                    </button>
                                    <button
                                        onClick={handleSaveCustom}
                                        disabled={saving}
                                        className="p-1.5 text-green-500 hover:text-green-600 disabled:opacity-50"
                                    >
                                        {saving ? (
                                            <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Check size={14} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
