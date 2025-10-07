// components/Profile/ProfileHeader.jsx - Fixed Logic with Original Styling
import { useState, useEffect } from "react";
import { User, Edit3, Save, X, LogOut, Check } from "lucide-react";
import apiService from "../../services/api.js";

export default function ProfileHeader({ 
    currentUser, 
    isEditingDisplay,
    setIsEditingDisplay,
    editedDisplayName, 
    setEditedDisplayName, 
    isEditingUsername,
    setIsEditingUsername,
    editedUsername,
    setEditedUsername,
    saving, 
    error, 
    setError, 
    onSaveDisplayName,
    onSaveUsername,
    onLogout,
    getHighResProfilePicture 
}) {
    const [imageError, setImageError] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);

    // Only check username availability when actively editing username
    useEffect(() => {
        if (!isEditingUsername || !editedUsername || editedUsername.length < 3) {
            setUsernameAvailable(null);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setCheckingUsername(true);
            try {
                const result = await apiService.checkUsername(editedUsername);
                setUsernameAvailable(result.available);
            } catch (error) {
                setUsernameAvailable(null);
            } finally {
                setCheckingUsername(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [editedUsername, isEditingUsername]);

    const canChangeUsername = () => {
        if (!currentUser.usernameLastChanged) return true;
        
        const lastChanged = new Date(currentUser.usernameLastChanged);
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
        
        return lastChanged < twoMonthsAgo;
    };

    const getNextUsernameChangeDate = () => {
        if (!currentUser.usernameLastChanged) return null;
        
        const nextChange = new Date(currentUser.usernameLastChanged);
        nextChange.setDate(nextChange.getDate() + 60);
        return nextChange.toLocaleDateString();
    };

    const handleStartUsernameEdit = () => {
        setIsEditingUsername(true);
        setUsernameAvailable(null);
        setError("");
    };

    const handleCancelUsernameEdit = () => {
        setIsEditingUsername(false);
        setEditedUsername(currentUser.username || "");
        setUsernameAvailable(null);
        setError("");
    };

    const handleCancelDisplayEdit = () => {
        setIsEditingDisplay(false);
        setEditedDisplayName(currentUser.displayName || currentUser.name || "");
        setError("");
    };

    return (
        <div className="bg-surface rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Profile Picture */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-primary bg-background">
                            {currentUser.picture && !imageError ? (
                                <img
                                    src={getHighResProfilePicture(currentUser.picture)}
                                    alt={currentUser.displayName || currentUser.name}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageError(true)}
                                    onLoad={() => setImageError(false)}
                                    crossOrigin="anonymous"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-full h-full bg-surface flex items-center justify-center">
                                    <User size={24} className="text-secondary" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* User Info */}
                    <div>
                        {/* Display Name */}
                        {isEditingDisplay ? (
                            <div className="flex items-center gap-2 mb-1">
                                <input
                                    type="text"
                                    value={editedDisplayName}
                                    onChange={(e) => {
                                        setEditedDisplayName(e.target.value);
                                        setError("");
                                    }}
                                    className="text-xl font-bold bg-background border border-primary rounded px-2 py-1 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    autoFocus
                                    maxLength={50}
                                    disabled={saving}
                                    placeholder="Display name"
                                />
                                <button
                                    onClick={onSaveDisplayName}
                                    className="p-1 text-primary hover:text-accent transition-colors disabled:opacity-50"
                                    title="Save display name"
                                    disabled={saving || !editedDisplayName.trim()}
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                </button>
                                <button
                                    onClick={handleCancelDisplayEdit}
                                    className="p-1 text-secondary hover:text-primary transition-colors"
                                    title="Cancel"
                                    disabled={saving}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mb-1">
                                <h1 className="text-2xl font-bold text-primary">
                                    {currentUser.displayName || currentUser.name}
                                </h1>
                                <button
                                    onClick={() => setIsEditingDisplay(true)}
                                    className="p-1 text-secondary hover:text-primary transition-colors"
                                    title="Edit display name"
                                >
                                    <Edit3 size={16} />
                                </button>
                            </div>
                        )}

                        {/* Username */}
                        {isEditingUsername ? (
                            <div className="flex items-center gap-2 mb-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={editedUsername}
                                        onChange={(e) => {
                                            const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                                            setEditedUsername(value);
                                            setError("");
                                        }}
                                        className={`text-sm bg-background border rounded px-2 py-1 focus:outline-none focus:ring-2 ${
                                            usernameAvailable === true ? 'border-green-500 text-green-600' :
                                            usernameAvailable === false ? 'border-red-500 text-red-600' :
                                            'border-primary text-primary focus:ring-primary/50'
                                        }`}
                                        autoFocus
                                        maxLength={20}
                                        disabled={saving}
                                        placeholder="username"
                                    />
                                    {checkingUsername && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                    {!checkingUsername && usernameAvailable === true && (
                                        <Check size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500" />
                                    )}
                                    {!checkingUsername && usernameAvailable === false && (
                                        <X size={14} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500" />
                                    )}
                                </div>
                                <button
                                    onClick={onSaveUsername}
                                    className="p-1 text-primary hover:text-accent transition-colors disabled:opacity-50"
                                    title="Save username"
                                    disabled={saving || !editedUsername.trim() || usernameAvailable !== true}
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Save size={14} />
                                    )}
                                </button>
                                <button
                                    onClick={handleCancelUsernameEdit}
                                    className="p-1 text-secondary hover:text-primary transition-colors"
                                    title="Cancel"
                                    disabled={saving}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-accent">
                                    @{currentUser.username || 'Set username'}
                                </p>
                                {canChangeUsername() ? (
                                    <button
                                        onClick={handleStartUsernameEdit}
                                        className="p-1 text-secondary hover:text-primary transition-colors"
                                        title="Edit username"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                ) : (
                                    <span 
                                        className="text-xs text-secondary"
                                        title={`Next change allowed: ${getNextUsernameChangeDate()}`}
                                    >
                                        (Next change: {getNextUsernameChangeDate()})
                                    </span>
                                )}
                            </div>
                        )}

                        <p className="text-sm text-secondary">
                            Member since {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 rounded-lg transition-all border border-red-500/20 hover:border-red-500"
                    title="Logout from Dorofi"
                >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
