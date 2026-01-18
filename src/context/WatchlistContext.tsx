"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WatchlistContextType {
    favorites: string[];
    addFavorite: (symbol: string) => void;
    removeFavorite: (symbol: string) => void;
    isFavorite: (symbol: string) => boolean;
    toggleFavorite: (symbol: string) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        // Load from localStorage on mount
        const stored = localStorage.getItem('user_favorites');
        if (stored) {
            try {
                setFavorites(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse favorites", e);
            }
        }
    }, []);

    useEffect(() => {
        // Save to localStorage whenever favorites change
        localStorage.setItem('user_favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addFavorite = (symbol: string) => {
        if (!favorites.includes(symbol)) {
            setFavorites(prev => [...prev, symbol]);
        }
    };

    const removeFavorite = (symbol: string) => {
        setFavorites(prev => prev.filter(s => s !== symbol));
    };

    const isFavorite = (symbol: string) => {
        return favorites.includes(symbol);
    };

    const toggleFavorite = (symbol: string) => {
        if (isFavorite(symbol)) {
            removeFavorite(symbol);
        } else {
            addFavorite(symbol);
        }
    };

    return (
        <WatchlistContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
            {children}
        </WatchlistContext.Provider>
    );
}

export function useWatchlist() {
    const context = useContext(WatchlistContext);
    if (context === undefined) {
        throw new Error('useWatchlist must be used within a WatchlistProvider');
    }
    return context;
}
