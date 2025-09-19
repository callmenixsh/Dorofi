// contexts/AuthContext.jsx - Add useActivityDetection here
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useActivityDetection } from '../hooks/userActivityDetection.js';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                const userInfo = localStorage.getItem('googleUserInfo');

                if (!token || !userInfo) {
                    if (mounted) {
                        setLoading(false);
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                    return;
                }

                const parsedUser = JSON.parse(userInfo);
                
                if (mounted) {
                    setUser(parsedUser);
                    setIsAuthenticated(true);
                    setLoading(false);
                }

                // Optional: verify token with backend
                try {
                    const profileData = await apiService.getProfile();
                    if (profileData.user && mounted) {
                        const updatedUser = { ...parsedUser, ...profileData.user };
                        setUser(updatedUser);
                        localStorage.setItem('googleUserInfo', JSON.stringify(updatedUser));
                    }
                } catch (error) {
                    console.log('Backend verification failed:', error.message);
                    
                    if (error.message.includes('Invalid token') || error.message.includes('malformed')) {
                        console.log('🧹 Clearing invalid token');
                        localStorage.removeItem('token');
                        localStorage.removeItem('googleUserInfo');
                        if (mounted) {
                            setUser(null);
                            setIsAuthenticated(false);
                        }
                    }
                }

            } catch (error) {
                console.error('Auth initialization failed:', error);
                if (mounted) {
                    setUser(null);
                    setIsAuthenticated(false);
                    setLoading(false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('googleUserInfo');
                }
            }
        };

        initializeAuth();

        return () => {
            mounted = false;
        };
    }, []);

    // 🎯 ADD ACTIVITY DETECTION HERE - Only when authenticated
    useActivityDetection(isAuthenticated);

    const login = (userData, token) => {
        try {
            setUser(userData);
            setIsAuthenticated(true);
            
            if (token) {
                localStorage.setItem('token', token);
            }
            localStorage.setItem('googleUserInfo', JSON.stringify(userData));
            
            console.log('✅ User logged in via context:', userData.email);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('googleUserInfo');
        console.log('👋 User logged out');
    };

    const updateUser = (updates) => {
        setUser(prevUser => {
            const updatedUser = { ...prevUser, ...updates };
            localStorage.setItem('googleUserInfo', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
