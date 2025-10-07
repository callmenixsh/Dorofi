// DorofiNavbar.jsx - With sliding down action buttons
import { Home, Users, Settings, User, Info, Globe, AlarmCheck, Timer, Menu, X, MoreVertical, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext.jsx";
import SettingsModal from "./settingsModal";
import InfoModal from "./infoModal";
import LoginPromptModal from "./loginPrompModal";
import apiService from "../services/api.js";

export default function DorofiNavbar() {
    // Use AuthContext
    const { user, login: contextLogin, logout: contextLogout, loading: authLoading } = useAuth();
    
    // Local state
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isInfoOpen, setIsInfoOpen] = useState(false);
    const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
    const [loginPromptType, setLoginPromptType] = useState('features');
    const [isLoading, setIsLoading] = useState(false);
    const [profileImageError, setProfileImageError] = useState(false);
    const [showActionTray, setShowActionTray] = useState(false);
    const actionTrayRef = useRef(null);
    const navigate = useNavigate();

    // Close action tray when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionTrayRef.current && !actionTrayRef.current.contains(event.target)) {
                setShowActionTray(false);
            }
        };

        if (showActionTray) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [showActionTray]);

    // Add this helper function at the top of your component
    const safeBase64Encode = (str) => {
        try {
            // Convert to UTF-8 first, then encode
            return btoa(unescape(encodeURIComponent(str)));
        } catch (error) {
            console.error('Base64 encoding failed:', error);
            const safeStr = str.replace(/[^\x00-\x7F]/g, ""); 
            return btoa(safeStr);
        }
    };

    const login = useGoogleLogin({
        onSuccess: async (response) => {
            setIsLoading(true);
            try {
                const userInfoResponse = await fetch(
                    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.access_token}`
                );
                const userInfo = await userInfoResponse.json();

                console.log("✅ Google login success:", userInfo.email);
                console.log("User name:", userInfo.name); 

                setProfileImageError(false);
                localStorage.setItem("googleToken", response.access_token);

                try {
                    console.log("🔄 Attempting backend authentication...");
                    
                    const tokenData = {
                        sub: userInfo.sub,
                        email: userInfo.email,
                        name: userInfo.name,
                        picture: userInfo.picture,
                        aud: import.meta.env.VITE_GOOGLE_CLIENT_ID || "mock-client-id",
                        iss: "https://accounts.google.com",
                        exp: Math.floor(Date.now() / 1000) + 3600
                    };

                    const mockIdToken = safeBase64Encode(JSON.stringify(tokenData));

                    const backendResponse = await apiService.googleLogin(mockIdToken);
                    
                    if (backendResponse.token && backendResponse.user) {
                        contextLogin(backendResponse.user, backendResponse.token);
                        console.log("✅ Backend authentication successful");
                    } else {
                        throw new Error("Invalid backend response");
                    }
                    
                } catch (backendError) {
                    console.log("⚠️ Backend authentication failed:", backendError.message);
                    contextLogin(userInfo, null);
                }

            } catch (error) {
                console.error("❌ Login failed:", error);
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error("❌ Google Login Failed:", error);
            setIsLoading(false);
        },
    });

    // Logout handler using context
    const handleLogout = () => {
        try {
            console.log("🚪 Navbar logout triggered");
            setProfileImageError(false);
            contextLogout(); // Context handles everything
        } catch (error) {
            console.error("Logout error:", error);
            // Fallback
            window.location.href = "/";
        }
    };

    // Utility functions
    const getHighResProfilePicture = (googlePicture) => {
        if (!googlePicture) return null;
        return googlePicture
            .replace("s96-c", "s200-c")
            .replace("=s96", "=s200")
            .replace("sz=50", "sz=200");
    };

    // Updated navigation handler with login prompt
    const handleNavigation = (path) => {
        setShowActionTray(false); // Close action tray on navigation
        
        // Check if route requires authentication
        const protectedRoutes = ['/friends', '/rooms', '/profile'];
        
        if (!user && protectedRoutes.includes(path)) {
            // Show login prompt instead of navigating
            const featureType = path === '/friends' ? 'friends' : 
                               path === '/rooms' ? 'rooms' : 'features';
            setLoginPromptType(featureType);
            setIsLoginPromptOpen(true);
            return;
        }
        
        // Navigate normally if authenticated or public route
        navigate(path);
    };

    // Handle login from prompt
    const handleLoginFromPrompt = () => {
        setIsLoginPromptOpen(false);
        login(); // Your existing login function
    };

    const openSettings = () => {
        setIsSettingsOpen(true);
        setShowActionTray(false);
    };

    const closeSettings = () => {
        setIsSettingsOpen(false);
    };

    const openInfo = () => {
        setIsInfoOpen(true);
        setShowActionTray(false);
    };

    const closeInfo = () => {
        setIsInfoOpen(false);
    };

    const toggleActionTray = () => {
        setShowActionTray(!showActionTray);
    };

    const toggleColorScheme = () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const isDark = currentTheme?.includes("dark");
        const mode = isDark ? "dark" : "light";

        let newTheme;
        if (currentTheme?.includes("dorofi")) {
            newTheme = `ocean-${mode}`;
        } else if (currentTheme?.includes("ocean")) {
            newTheme = `dorofi-${mode}`;
        } else {
            newTheme = "ocean-light";
        }

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("dorofi-theme", newTheme);
        const colorScheme = newTheme.includes("ocean") ? "ocean" : "dorofi";
        localStorage.setItem("dorofi-color-scheme", colorScheme);
    };

    return (
        <>
            <nav className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-background relative">
                {/* Desktop Layout - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-3 items-center">
                    
                    {/* Left side: Brand */}
                    <div className="flex items-center justify-start">
                        <div className="flex items-center gap-2 text-primary text-xl lg:text-2xl">
                            <button
                                onClick={() => handleNavigation("/about")}
                                className="focus:outline-none rounded-full p-2 hover:bg-surface transition-colors"
                                aria-label="About Dorofi"
                                title="What is Dorofi?"
                                style={{ fontFamily: "Joti One" }}
                            >
                                Dorofi
                            </button>
                        </div>
                    </div>

                    {/* Center: Navigation - Always Centered */}
                    <div className="flex items-center justify-center gap-3 lg:gap-5 text-accent">
                        <button
                            onClick={() => handleNavigation("/")}
                            className="rounded-full p-2 hover:bg-surface transition-colors"
                            aria-label="Solo Focus Session"
                            title="Solo Focus Session"
                        >
                            <Timer size={24} className="lg:w-7 lg:h-7" strokeWidth={2.25} />
                        </button>
                        <button
                            onClick={() => handleNavigation("/rooms")}
                            className={`rounded-full p-2 hover:bg-surface transition-colors ${
                                !user ? 'hover:bg-primary/10' : ''
                            }`}
                            aria-label="Study Rooms"
                            title={!user ? "Login to access Study Rooms" : "Study Rooms"}
                        >
                            <Globe size={24} className="lg:w-7 lg:h-7" strokeWidth={2.25} />
                        </button>
                        <button
                            onClick={() => handleNavigation("/friends")}
                            className={`rounded-full p-2 hover:bg-surface transition-colors ${
                                !user ? 'hover:bg-primary/10' : ''
                            }`}
                            aria-label="Friends"
                            title={!user ? "Login to access Friends" : "Friends"}
                        >
                            <Users size={24} className="lg:w-7 lg:h-7" strokeWidth={2.25} />
                        </button>
                    </div>

                    {/* Right: Auth & Settings */}
                    <div className="flex items-center justify-end gap-1 lg:gap-2">
                        {user ? (
                            <>
                                <button
                                    onClick={openInfo}
                                    className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
                                    aria-label="How to use app"
                                    title="How to Use Dorofi"
                                >
                                    <Info size={20} className="lg:w-6 lg:h-6" strokeWidth={2} />
                                </button>
                                <button
                                    onClick={openSettings}
                                    className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
                                    aria-label="Settings"
                                    title="Settings"
                                >
                                    <Settings size={24} className="lg:w-7 lg:h-7" strokeWidth={2.25} />
                                </button>
                                <button
                                    onClick={() => handleNavigation("/profile")}
                                    className="rounded-full p-1 hover:bg-surface transition-colors"
                                    aria-label="Profile"
                                    title={`${user.displayName || user.name}'s Profile`}
                                    disabled={authLoading}
                                >
                                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full overflow-hidden border-2 border-secondary bg-surface">
                                        {user?.picture && !profileImageError ? (
                                            <img
                                                src={getHighResProfilePicture(user.picture)}
                                                alt={user.displayName || user.name || "Profile"}
                                                className="w-full h-full object-cover"
                                                onError={() => setProfileImageError(true)}
                                                onLoad={() => setProfileImageError(false)}
                                                crossOrigin="anonymous"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-surface flex items-center justify-center">
                                                <User
                                                    size={16}
                                                    className="lg:w-[18px] lg:h-[18px] text-secondary"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={openInfo}
                                    className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
                                    aria-label="Why login?"
                                    title="Why Should I Login?"
                                >
                                    <Info size={18} className="lg:w-5 lg:h-5" strokeWidth={2} />
                                </button>
                                <button
                                    onClick={openSettings}
                                    className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
                                    aria-label="Settings"
                                    title="Settings"
                                >
                                    <Settings size={24} className="lg:w-7 lg:h-7" strokeWidth={2.25} />
                                </button>
                                <button
                                    onClick={() => login()}
                                    disabled={isLoading || authLoading}
                                    className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-primary hover:bg-accent text-background rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Login to track progress"
                                    title="Login with Google to track your progress"
                                >
                                    {isLoading || authLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <FaGoogle size={16} className="lg:w-[18px] lg:h-[18px]" />
                                    )}
                                    <span className="text-sm">
                                        {isLoading ? "Signing in..." : 
                                         authLoading ? "Loading..." : 
                                         "SignUp/Login"}
                                    </span>
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Layout */}
                <div className="md:hidden flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-2 text-primary text-lg">
                        <button
                            onClick={() => handleNavigation("/about")}
                            className="focus:outline-none rounded-full p-1.5 hover:bg-surface transition-colors"
                            style={{ fontFamily: "Joti One" }}
                        >
                            Dorofi
                        </button>
                    </div>

                    {/* Center: Main Navigation */}
                    <div className="flex items-center gap-3 text-accent">
                        <button
                            onClick={() => handleNavigation("/")}
                            className="rounded-full p-2 hover:bg-surface transition-colors"
                            aria-label="Solo Focus Session"
                            title="Solo Focus Session"
                        >
                            <Timer size={22} strokeWidth={2.25} />
                        </button>
                        <button
                            onClick={() => handleNavigation("/rooms")}
                            className={`rounded-full p-2 hover:bg-surface transition-colors ${
                                !user ? 'hover:bg-primary/10' : ''
                            }`}
                            aria-label="Study Rooms"
                            title={!user ? "Login to access Study Rooms" : "Study Rooms"}
                        >
                            <Globe size={22} strokeWidth={2.25} />
                        </button>
                        <button
                            onClick={() => handleNavigation("/friends")}
                            className={`rounded-full p-2 hover:bg-surface transition-colors ${
                                !user ? 'hover:bg-primary/10' : ''
                            }`}
                            aria-label="Friends"
                            title={!user ? "Login to access Friends" : "Friends"}
                        >
                            <Users size={22} strokeWidth={2.25} />
                        </button>
                    </div>

                    {/* Right side - Profile/Login + Action Menu */}
                    <div className="flex items-center gap-2 relative" ref={actionTrayRef}>
                        {user ? (
                            <button
                                onClick={() => handleNavigation("/profile")}
                                className="rounded-full p-1 hover:bg-surface transition-colors"
                                disabled={authLoading}
                            >
                                <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-secondary bg-surface">
                                    {user?.picture && !profileImageError ? (
                                        <img
                                            src={getHighResProfilePicture(user.picture)}
                                            alt={user.displayName || user.name || "Profile"}
                                            className="w-full h-full object-cover"
                                            onError={() => setProfileImageError(true)}
                                            onLoad={() => setProfileImageError(false)}
                                            crossOrigin="anonymous"
                                            referrerPolicy="no-referrer"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-surface flex items-center justify-center">
                                            <User size={14} strokeWidth={2} className="text-secondary" />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ) : (
                            <button
                                onClick={() => login()}
                                disabled={isLoading || authLoading}
                                className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-accent text-background rounded-lg transition-colors font-medium disabled:opacity-50 text-sm"
                            >
                                {isLoading || authLoading ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <FaGoogle size={14} />
                                )}
                                <span>Login</span>
                            </button>
                        )}

                        {/* Action Menu Button */}
                        <button
                            onClick={toggleActionTray}
                            className="rounded-full p-2 hover:bg-surface transition-all text-secondary relative"
                            aria-label="Menu"
                        >
                            {showActionTray ? <ChevronUp size={20} /> : <MoreVertical size={20} />}
                        </button>

                        {/* Sliding Action Buttons */}
                        <div 
                            className={`absolute top-full right-0 mt-2 flex flex-col gap-2 transition-all duration-300 transform-gpu ${
                                showActionTray 
                                    ? 'opacity-100 translate-y-0 scale-100' 
                                    : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
                            }`}
                        >
                            {/* Info Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openInfo();
                                }}
                                className="w-10 h-10 rounded-full bg-surface/95 backdrop-blur-sm hover:bg-primary/20 flex items-center justify-center transition-all shadow-lg border border-primary/20"
                                title="How to Use Dorofi"
                            >
                                <Info size={16} className="text-secondary hover:text-primary transition-colors" />
                            </button>

                            {/* Settings Button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openSettings();
                                }}
                                className="w-10 h-10 rounded-full bg-surface/95 backdrop-blur-sm hover:bg-primary/20 flex items-center justify-center transition-all shadow-lg border border-primary/20"
                                title="Settings"
                            >
                                <Settings size={16} className="text-secondary hover:text-primary transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <SettingsModal
                    onClose={closeSettings}
                    user={user}
                    onLogout={handleLogout}
                    toggleColorScheme={toggleColorScheme}
                />
            )}

            {/* Info Modal */}
            {isInfoOpen && <InfoModal onClose={closeInfo} user={user} />}

            {/* Login Prompt Modal */}
            {isLoginPromptOpen && (
                <LoginPromptModal
                    onClose={() => setIsLoginPromptOpen(false)}
                    onLogin={handleLoginFromPrompt}
                    featureType={loginPromptType}
                    isLoading={isLoading}
                />
            )}
        </>
    );
}
