// src/hooks/useThemeAssets.js
import { useEffect, useState } from 'react';

// Debug helper
const debug = (message, ...args) => {
    console.log(`[ThemeAssets] ${message}`, ...args);
};

// Theme mapping to match settings modal
const themeMapping = {
    'celestial-light': 'celestial',
    'celestial-dark': 'celestial',
    'ocean-light': 'ocean',
    'ocean-dark': 'ocean',
    'flame-light': 'flame',
    'flame-dark': 'flame',
    'void-light': 'void',
    'void-dark': 'void'
};

// Theme assets configuration
const themeAssets = {
    'celestial': {
        favicon: '/public/assets/celestial.png',
        logo: '/public/assets/celestial.png',
        logoClass: 'filter hue-rotate-[0deg] brightness-100 saturate-100'
    },
    'ocean': {
        favicon: '/public/assets/celestial.png',
        logo: '/public/assets/celestial.png',
        logoClass: 'filter hue-rotate-[260deg] brightness-100 saturate-100'
    },
    'flame': {
        favicon: '/public/assets/celestial.png',
        logo: '/public/assets/celestial.png',
        logoClass: 'filter hue-rotate-[70deg] brightness-100 saturate-100'
    },
    'void': {
        favicon: '/public/assets/celestial.png',
        logo: '/public/assets/celestial.png',
        logoClass: 'filter hue-rotate-0 brightness-100 saturate-0'
    }
};

const getBaseTheme = (fullTheme) => {
    debug('Getting base theme for:', fullTheme);
    const baseTheme = themeMapping[fullTheme];
    debug('Mapped to base theme:', baseTheme);
    return baseTheme || 'celestial';
};

export const useThemeAssets = () => {
    debug('Hook initialized');

    const [currentTheme, setCurrentTheme] = useState(() => {
        const fullTheme = document.documentElement.getAttribute('data-theme') || 
                         localStorage.getItem('theme') || 
                         'celestial-light';
        debug('Initial full theme:', fullTheme);
        const baseTheme = getBaseTheme(fullTheme);
        debug('Initial base theme:', baseTheme);
        return baseTheme;
    });

    useEffect(() => {
        const updateFavicon = (theme) => {
            const faviconElement = document.querySelector("link[rel*='icon']");
            if (faviconElement && themeAssets[theme]) {
                faviconElement.href = themeAssets[theme].favicon;
            }
        };

        const handleThemeChange = () => {
            const fullTheme = document.documentElement.getAttribute('data-theme') || 
                            localStorage.getItem('theme') || 
                            'celestial-light';
            const baseTheme = themeMapping[fullTheme] || 'celestial';
            
            if (baseTheme !== currentTheme) {
                console.log('Theme changed:', fullTheme, '→', baseTheme);
                setCurrentTheme(baseTheme);
                updateFavicon(baseTheme);
            }
        };

        // Initial setup
        handleThemeChange();

        // Listen for theme changes
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });

        // Clean up
        return () => observer.disconnect();
    }, [currentTheme]);

    // Return the current theme's assets
    const assets = themeAssets[currentTheme] || themeAssets['celestial'];
    debug('Returning assets for theme:', currentTheme, assets);
    return assets;
};