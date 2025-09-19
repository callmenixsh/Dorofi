import React from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Home from "./Pages/home.jsx";
import Rooms from "./Pages/rooms.jsx";
import About from "./Pages/about.jsx";
import Friends from "./Pages/friends.jsx";
import Profile from "./Pages/profile.jsx";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Notfound from "./components/notfound.jsx";

const Layout = ({ children }) => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow min-h-full">{children}</div>
        <Footer />
    </div>
);

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Layout>
                <Home />
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
        path: "/about",
        element: (
            <Layout>
                <About />
            </Layout>
        ),
    },
    {
        path: "/friends",
        element: (
            <Layout>
                <Friends />
            </Layout>
        ),
    },
    {
        path: "/profile",
        element: (
            <Layout>
                <Profile />
            </Layout>
        ),
    },
    {
        path: "*",
        element: (
            <Layout>
                <Notfound />
            </Layout>
        ),
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <RouterProvider router={router} />
        </GoogleOAuthProvider>
    </StrictMode>
);
