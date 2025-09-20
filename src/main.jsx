// src/main.jsx - Updated with Redux Provider
import React, { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";
import { Provider } from 'react-redux'; // 🆕 Redux Provider
import { store } from './store'; // 🆕 Redux Store
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import Home from "./Pages/home.jsx";
import Rooms from "./Pages/rooms.jsx";
import About from "./Pages/about.jsx";
import Friends from "./Pages/friends.jsx";
import Profile from "./Pages/profile.jsx";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Notfound from "./components/notfound.jsx";
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

// Layout Component
const Layout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow min-h-full">{children}</div>
        <UniversalMusicPlayer />
        <Footer />
    </div>
);

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

// Router Configuration
const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <Home />
            </Layout>
        ),
        errorElement: (
            <Layout>
                <Notfound />
            </Layout>
        ),
    },
    {
        path: "/about",
        element: (
            <Layout>
                <About />
            </Layout>
        ),
    },
    {
        path: "/rooms",
        element: (
            <Layout>
                <Rooms />
            </Layout>
        ),
    },
    {
        path: "/policies",
        element: (
            <Layout>
                <Policies />
            </Layout>
        ),
    },
    // PROTECTED ROUTES - Require authentication
    {
        path: "/friends",
        element: (
            <Layout>
                <ProtectedRoute>
                    <Friends />
                </ProtectedRoute>
            </Layout>
        ),
    },
    {
        path: "/profile",
        element: (
            <Layout>
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            </Layout>
        ),
    },
    // 404 Route
    {
        path: "*",
        element: (
            <Layout>
                <Notfound />
            </Layout>
        ),
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
