"use client";

import { WatchlistProvider } from '@/context/WatchlistContext';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <WatchlistProvider>
            {children}
        </WatchlistProvider>
    );
}
