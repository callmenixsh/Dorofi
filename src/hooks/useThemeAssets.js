// src/hooks/useThemeAssets.js
import { useEffect, useState } from 'react';


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
        favicon: './assets/celestial.png',
        logo: '/assets/celestial.png',
        logoClass: 'filter hue-rotate-[0deg] brightness-100 saturate-100'
    },
    'ocean': {
        favicon: '/assets/celestial.png',
        logo: '/assets/celestial.png',
        logoClass: 'filter hue-rotate-[260deg] brightness-100 saturate-100'
    },
    'flame': {
        favicon: '/assets/celestial.png',
        logo: '/assets/celestial.png',
        logoClass: 'filter hue-rotate-[70deg] brightness-100 saturate-100'
    },
    'void': {
        favicon: '/assets/celestial.png',
        logo: '/assets/celestial.png',
        logoClass: 'filter hue-rotate-0 brightness-100 saturate-0'
    }
};

const getBaseTheme = (fullTheme) => {
    const baseTheme = themeMapping[fullTheme];
    return baseTheme || 'celestial';
};

export const useThemeAssets = () => {

    const [currentTheme, setCurrentTheme] = useState(() => {
        const fullTheme = document.documentElement.getAttribute('data-theme') || 
                         localStorage.getItem('theme') || 
                         'celestial-light';
        const baseTheme = getBaseTheme(fullTheme);
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
    return assets;
};