// Pages/profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    User, 
    Clock, 
    Target, 
    Calendar, 
    TrendingUp, 
    Award, 
    Settings, 
    Edit3,
    Save,
    X,
    LogOut,
    Upload,
    AlertCircle
} from 'lucide-react';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [imageError, setImageError] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const navigate = useNavigate();

    // Mock data - replace with real data from your backend
    const [stats, setStats] = useState({
        totalSessions: 47,
        totalFocusTime: 1580, // in minutes
        currentStreak: 5,
        longestStreak: 12,
        weeklyGoal: 300, // minutes
        weeklyProgress: 185,
        achievements: [
            { id: 1, name: 'First Session', icon: '🎯', earned: true },
            { id: 2, name: '7-Day Streak', icon: '🔥', earned: true },
            { id: 3, name: '50 Hours Total', icon: '⏰', earned: false },
            { id: 4, name: '30-Day Warrior', icon: '💪', earned: false },
        ]
    });

    useEffect(() => {
        // Get user info from localStorage
        const userInfo = localStorage.getItem('googleUserInfo');
        if (userInfo) {
            try {
                const parsed = JSON.parse(userInfo);
                console.log('User data loaded:', parsed); // Debug log
                setUser(parsed);
                setEditedName(parsed.name);
            } catch (error) {
                console.error('Error parsing user info:', error);
                localStorage.removeItem('googleUserInfo');
                localStorage.removeItem('googleToken');
                navigate('/');
            }
        } else {
            // Redirect to home if not logged in
            console.log('No user info found, redirecting to home');
            navigate('/', { replace: true });
        }
    }, [navigate]);

    const handleSaveEdit = () => {
        if (user && editedName.trim()) {
            const updatedUser = { ...user, name: editedName.trim() };
            setUser(updatedUser);
            localStorage.setItem('googleUserInfo', JSON.stringify(updatedUser));
            setIsEditing(false);
        }
    };

    const handleLogout = () => {
        try {
            console.log('Logging out user...'); // Debug log
            
            // Clear all user data from localStorage
            localStorage.removeItem('googleToken');
            localStorage.removeItem('googleUserInfo');
            
            // Reset component state
            setUser(null);
            setShowLogoutConfirm(false);
            
            console.log('User logged out successfully'); // Debug log
            
            // Force navigation to home with replace to clear history
            navigate('/', { replace: true });
            
            // Optional: Force page reload to ensure clean state
            window.location.href = '/';
            
        } catch (error) {
            console.error('Error during logout:', error);
            // Force navigation even if there's an error
            window.location.href = '/';
        }
    };

    const handleImageError = () => {
        console.log('Profile image failed to load'); // Debug log
        setImageError(true);
    };

    const handleImageLoad = () => {
        console.log('Profile image loaded successfully'); // Debug log
        setImageError(false);
    };

    // Get high-resolution profile picture from Google
    const getHighResProfilePicture = (googlePicture) => {
        if (!googlePicture) return null;
        
        // Google profile pictures come in different sizes
        // Replace size parameters to get higher resolution
        return googlePicture
            .replace('s96-c', 's400-c') // Increase size from 96px to 400px
            .replace('=s96', '=s400')   // Alternative format
            .replace('sz=50', 'sz=400'); // Another alternative format
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const weeklyProgressPercent = (stats.weeklyProgress / stats.weeklyGoal) * 100;

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-secondary">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="bg-surface rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Profile Picture - Enhanced for Google images */}
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-3 border-primary bg-background">
                                    {user.picture && !imageError ? (
                                        <img 
                                            src={getHighResProfilePicture(user.picture)} 
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                            onError={handleImageError}
                                            onLoad={handleImageLoad}
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
                            
                            <div>
                                {isEditing ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="text-xl font-bold bg-background border border-primary rounded px-2 py-1 text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            autoFocus
                                            maxLength={50}
                                        />
                                        <button
                                            onClick={handleSaveEdit}
                                            className="p-1 text-primary hover:text-accent transition-colors"
                                            title="Save changes"
                                        >
                                            <Save size={16} />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditedName(user.name);
                                            }}
                                            className="p-1 text-secondary hover:text-primary transition-colors"
                                            title="Cancel editing"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-primary">{user.name}</h1>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="p-1 text-secondary hover:text-primary transition-colors"
                                            title="Edit name"
                                        >
                                            <Edit3 size={16} />
                                        </button>
                                    </div>
                                )}
                                <p className="text-secondary">{user.email}</p>
                            </div>
                        </div>
                        
                        {/* Logout Button */}
                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-600 rounded-lg transition-all border border-red-500/20 hover:border-red-500"
                            title="Logout from Dorofi"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-surface rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Clock size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Total Focus Time</p>
                                <p className="text-lg font-semibold text-primary">{formatTime(stats.totalFocusTime)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary/10 rounded-lg">
                                <Target size={20} className="text-secondary" />
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Sessions Completed</p>
                                <p className="text-lg font-semibold text-primary">{stats.totalSessions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-accent/10 rounded-lg">
                                <TrendingUp size={20} className="text-accent" />
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Current Streak</p>
                                <p className="text-lg font-semibold text-primary">{stats.currentStreak} days</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Award size={20} className="text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-secondary">Best Streak</p>
                                <p className="text-lg font-semibold text-primary">{stats.longestStreak} days</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Progress */}
                <div className="bg-surface rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-primary">Weekly Goal</h2>
                        <span className="text-sm text-secondary">
                            {formatTime(stats.weeklyProgress)} / {formatTime(stats.weeklyGoal)}
                        </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-3 mb-2">
                        <div 
                            className="bg-primary h-3 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(weeklyProgressPercent, 100)}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-secondary">
                        {weeklyProgressPercent >= 100 
                            ? '🎉 Goal achieved! Great work!' 
                            : `${Math.round(weeklyProgressPercent)}% complete - ${formatTime(stats.weeklyGoal - stats.weeklyProgress)} to go`
                        }
                    </p>
                </div>

                {/* Achievements */}
                <div className="bg-surface rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Achievements</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {stats.achievements.map((achievement) => (
                            <div 
                                key={achievement.id}
                                className={`p-4 rounded-lg border-2 transition-all ${
                                    achievement.earned 
                                        ? 'border-primary bg-primary/5' 
                                        : 'border-surface bg-background opacity-50'
                                }`}
                            >
                                <div className="text-center">
                                    <div className="text-2xl mb-2">{achievement.icon}</div>
                                    <p className={`text-sm font-medium ${
                                        achievement.earned ? 'text-primary' : 'text-secondary'
                                    }`}>
                                        {achievement.name}
                                    </p>
                                    {achievement.earned && (
                                        <p className="text-xs text-accent mt-1">Earned!</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-surface rounded-lg p-6 mt-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">This Week</h2>
                    <div className="grid grid-cols-7 gap-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                            const hasActivity = index < 5; // Mock data - first 5 days have activity
                            return (
                                <div key={day} className="text-center">
                                    <p className="text-xs text-secondary mb-1">{day}</p>
                                    <div className={`w-8 h-8 rounded mx-auto ${
                                        hasActivity ? 'bg-primary' : 'bg-background'
                                    }`}></div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-background rounded-lg shadow-lg w-96 max-w-[90vw] p-6 border border-surface">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <AlertCircle size={20} className="text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-primary">Confirm Logout</h3>
                        </div>
                        
                        <p className="text-secondary mb-6">
                            Are you sure you want to logout? You'll need to sign in again to access your progress.
                        </p>
                        
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 bg-surface hover:bg-background text-secondary hover:text-primary rounded-lg transition-colors border border-surface"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
