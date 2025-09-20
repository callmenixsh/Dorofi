// DorofiNavbar.jsx - Updated with perfect centering
import { Home, Users, Settings, User, Info, Globe, AlarmCheck, Timer } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FaGoogle } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext.jsx";
import SettingsModal from "./settingsModal";
import InfoModal from "./InfoModal";
import LoginPromptModal from "./loginPrompModal";
import apiService from "../services/api.js";
import { BiStopwatch } from "react-icons/bi";
import { GiStopwatch } from "react-icons/gi";
import { TbFriends } from "react-icons/tb";
import { IoIosStopwatch } from "react-icons/io";

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
    const navigate = useNavigate();

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
    };

    const closeSettings = () => {
        setIsSettingsOpen(false);
    };

    const openInfo = () => {
        setIsInfoOpen(true);
    };

    const closeInfo = () => {
        setIsInfoOpen(false);
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
            <nav className="px-8 py-4 bg-background">
                {/* Grid Layout for Perfect Centering */}
                <div className="grid grid-cols-3 items-center">
                    
                    {/* Left side: Brand */}
                    <div className="flex items-center justify-start">
                        <div className="flex items-center gap-2 text-primary text-2xl">
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
                    <div className="flex items-center justify-center gap-5 text-accent">
                        <button
                            onClick={() => handleNavigation("/")}
                            className="rounded-full p-2 hover:bg-surface transition-colors"
                            aria-label="Solo Focus Session"
                            title="Solo Focus Session"
                        >
                            <Timer size={28} strokeWidth={2.25} />
                        </button>
                        <button
                            onClick={() => handleNavigation("/rooms")}
                            className={`rounded-full p-2 hover:bg-surface transition-colors ${
                                !user ? 'hover:bg-primary/10' : ''
                            }`}
                            aria-label="Study Rooms"
                            title={!user ? "Login to access Study Rooms" : "Study Rooms"}
                        >
                            <Globe size={28} strokeWidth={2.25} />
                        </button>
                        <button
                            onClick={() => handleNavigation("/friends")}
                            className={`rounded-full p-2 hover:bg-surface transition-colors ${
                                !user ? 'hover:bg-primary/10' : ''
                            }`}
                            aria-label="Friends"
                            title={!user ? "Login to access Friends" : "Friends"}
                        >
                            <Users size={28} strokeWidth={2.25} />
                        </button>
                    </div>

                    {/* Right: Auth & Settings */}
                    <div className="flex items-center justify-end gap-2">
                        {user ? (
                            <>
                                <button
                                    onClick={openInfo}
                                    className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
                                    aria-label="How to use app"
                                    title="How to Use Dorofi"
                                >
                                    <Info size={24} strokeWidth={2} />
                                </button>
                                <button
                                    onClick={openSettings}
                                    className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
                                    aria-label="Settings"
                                    title="Settings"
                                >
                                    <Settings size={28} strokeWidth={2.25} />
                                </button>
                                <button
                                    onClick={() => handleNavigation("/profile")}
                                    className="rounded-full p-1 hover:bg-surface transition-colors"
                                    aria-label="Profile"
                                    title={`${user.displayName || user.name}'s Profile`}
                                    disabled={authLoading}
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-secondary bg-surface">
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
                                                    size={18}
                                                    strokeWidth={2}
                                                    className="text-secondary"
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
                                    <Info size={20} strokeWidth={2} />
                                </button>
                                <button
                                    onClick={openSettings}
                                    className="rounded-full p-2 hover:bg-surface transition-colors text-secondary"
                                    aria-label="Settings"
                                    title="Settings"
                                >
                                    <Settings size={28} strokeWidth={2.25} />
                                </button>
                                <button
                                    onClick={() => login()}
                                    disabled={isLoading || authLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-background rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Login to track progress"
                                    title="Login with Google to track your progress"
                                >
                                    {isLoading || authLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <FaGoogle size={18} />
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
