// src/main.jsx - Updated with Redux Provider
import React, { useEffect, useState, useRef } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
    useLocation,
} from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import Home from "./Pages/home.jsx";
import Rooms from "./Pages/rooms.jsx";
import RoomSession from "./Pages/RoomSession.jsx";
import About from "./Pages/about.jsx";
import Friends from "./Pages/friends.jsx";
import Profile from "./Pages/profile.jsx";
import FriendProfile from "./Pages/friendprofile.jsx";
import Support from "./Pages/support.jsx";
import Guide from "./Pages/guide.jsx";
import Navbar from "./Components/navbar.jsx";
import Footer from "./Components/footer.jsx";
import Notfound from "./Components/notfound.jsx";
import UniversalMusicPlayer from "./Components/Player/musicPlayer.jsx";
import Policies from "./Pages/policies.jsx";
import "./index.css";

// Get Google Client ID with validation
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
    console.error("❌ VITE_GOOGLE_CLIENT_ID is not set in environment variables");
}

// Theme Initialization Component
const ThemeInitializer = ({ children }) => {
    useEffect(() => {
        // Initialize theme on app startup
        const savedTheme = localStorage.getItem("theme") || "celestial-light";
        document.documentElement.setAttribute("data-theme", savedTheme);
        console.log("🎨 Theme initialized on startup:", savedTheme);
    }, []);

    return children;
};

// Layout Component with page transitions and loading indicator
const Layout = () => {
    const location = useLocation();
    const [showLoading, setShowLoading] = useState(false);
    const [pageKey, setPageKey] = useState(location.key);
    const firstLoad = useRef(true);
    const timerRef = useRef(null);

    // Detect route changes
    useEffect(() => {
        if (firstLoad.current) {
            firstLoad.current = false;
            setPageKey(location.key);
            return;
        }

        setShowLoading(true);
        setPageKey(location.key);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setShowLoading(false), 400);

        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [location.key]);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Loading bar */}
            <div className="relative h-0">
                <div
                    className={`absolute top-0 left-0 right-0 h-[2px] z-50 overflow-hidden transition-opacity duration-150 ${
                        showLoading ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <div
                        className="h-full rounded-full"
                        style={{
                            backgroundColor: 'var(--color-primary)',
                            animation: 'progress-slide 0.4s ease-out forwards',
                        }}
                    />
                </div>
            </div>

            {/* Page content with fade-in animation */}
            <div key={pageKey} className="flex-grow min-h-full animate-page-in">
                <Outlet />
            </div>

            <UniversalMusicPlayer />
            <Footer />
        </div>
    );
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="text-secondary">Checking authentication...</div>
                </div>
            </div>
        );
    }

    // Redirect to home if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Error Layout (standalone, no Outlet needed)
const ErrorLayout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow min-h-full">{children}</div>
        <UniversalMusicPlayer />
        <Footer />
    </div>
);

// Router Configuration
const router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: (
            <ErrorLayout>
                <Notfound />
            </ErrorLayout>
        ),
        children: [
            { path: "/", element: <Home /> },
            { path: "/about", element: <About /> },
            { path: "/rooms", element: <Rooms /> },
            { path: "/rooms/:roomId", element: <RoomSession /> },
            { path: "/policies", element: <Policies /> },
            { path: "/guide", element: <Guide /> },
            { path: "/support", element: <Support /> },
            {
                path: "/friends",
                element: (
                    <ProtectedRoute>
                        <Friends />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile/:username",
                element: (
                    <ProtectedRoute>
                        <FriendProfile />
                    </ProtectedRoute>
                ),
            },
            { path: "*", element: <Notfound /> },
        ],
    },
]);

// App Component with Error Boundary
const AppWithErrorBoundary = () => {
    // Check for required environment variables
    if (!googleClientId) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">
                            Configuration Error
                        </h1>
                        <p className="text-secondary mb-4">
                            Google OAuth is not configured properly. Please check your
                            environment variables.
                        </p>
                        <p className="text-sm text-secondary">
                            Missing:{" "}
                            <code className="bg-background px-2 py-1 rounded">
                                VITE_GOOGLE_CLIENT_ID
                            </code>
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <Provider store={store}> {/* 🆕 Redux Provider wrapping everything */}
                <ThemeInitializer>
                    <AuthProvider>
                        <RouterProvider router={router} />
                    </AuthProvider>
                </ThemeInitializer>
            </Provider>
        </GoogleOAuthProvider>
    );
};

// Render App
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AppWithErrorBoundary />
    </StrictMode>
);
