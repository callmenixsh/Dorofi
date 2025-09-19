// components/toggletheme.jsx
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
    const [currentTheme, setCurrentTheme] = useState('dorofi-light');
    const [mounted, setMounted] = useState(false);
    const [hovered, setHovered] = useState(false);

    useEffect(() => {
        // Get saved theme from localStorage or detect system preference
        const savedTheme = localStorage.getItem('dorofi-theme');
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        let initialTheme;
        
        if (savedTheme) {
            // Use saved theme
            initialTheme = savedTheme;
        } else {
            // Use system preference for first visit
            const savedColorScheme = localStorage.getItem('dorofi-color-scheme') || 'dorofi';
            initialTheme = prefersDark ? `${savedColorScheme}-dark` : `${savedColorScheme}-light`;
        }
        
        // Apply theme
        document.documentElement.setAttribute("data-theme", initialTheme);
        setCurrentTheme(initialTheme);
        
        // Save to localStorage
        localStorage.setItem('dorofi-theme', initialTheme);
        
        // Save color scheme separately
        const colorScheme = initialTheme.includes('ocean') ? 'ocean' : 'dorofi';
        localStorage.setItem('dorofi-color-scheme', colorScheme);
        
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        // Get current color scheme (dorofi or ocean)
        const currentColorScheme = currentTheme.includes('ocean') ? 'ocean' : 'dorofi';
        
        // Toggle between light and dark while preserving color scheme
        const isDark = currentTheme.includes('dark');
        const newTheme = isDark ? `${currentColorScheme}-light` : `${currentColorScheme}-dark`;
        
        // Apply new theme
        document.documentElement.setAttribute("data-theme", newTheme);
        setCurrentTheme(newTheme);
        
        // Save to localStorage
        localStorage.setItem('dorofi-theme', newTheme);
        
        // Color scheme stays the same, no need to update it
    };

    if (!mounted) {
        return (
            <button className="rounded-full p-2 transition-all duration-300">
                <div className="w-7 h-7" />
            </button>
        );
    }

    const isDark = currentTheme.includes('dark');

    return (
        <button
            onClick={toggleTheme}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-pressed={isDark}
            aria-label="Toggle Dark/Light Mode"
            className="focus:outline-none rounded-full p-2 hover:bg-surface transition-all duration-300 text-secondary"
            style={{
                boxShadow: hovered
                    ? '0 0 8px rgba(var(--color-primary-rgb), 0.6)'
                    : 'none',
            }}
        >
            {isDark ? (
                <Sun 
                    size={28} 
                    strokeWidth={2}
                    className="transition-all duration-300" 
                />
            ) : (
                <Moon 
                    size={28} 
                    strokeWidth={2}
                    className="transition-all duration-300" 
                />
            )}
        </button>
    );
};

export default ThemeToggle;
