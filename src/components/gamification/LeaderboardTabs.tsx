'use client';

import { useState } from 'react';
import XPLeaderboard from './XPLeaderboard';
import PortfolioLeaderboard from './PortfolioLeaderboard';
import { type RankedUser } from '@/actions/leaderboard';

interface LeaderboardTabsProps {
    xpUsers: RankedUser[];
    portfolioUsers: RankedUser[];
}

export default function LeaderboardTabs({ xpUsers, portfolioUsers }: LeaderboardTabsProps) {
    const [activeTab, setActiveTab] = useState<'xp' | 'portfolio'>('xp');

    return (
        <div className="space-y-8">
            {/* Tab Switcher */}
            <div className="flex justify-center">
                <div className="inline-flex bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative">
                    {/* Active Background Pill Animation can be added here */}
                    <button
                        onClick={() => setActiveTab('xp')}
                        className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'xp'
                                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span>🔥</span>
                        <span>En Sosyal</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('portfolio')}
                        className={`relative px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeTab === 'portfolio'
                                ? 'bg-accent-green text-white shadow-lg shadow-accent-green/20'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <span>💰</span>
                        <span>En Zengin</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {activeTab === 'xp' ? (
                    <XPLeaderboard users={xpUsers} />
                ) : (
                    <PortfolioLeaderboard users={portfolioUsers} />
                )}
            </div>
        </div>
    );
}
