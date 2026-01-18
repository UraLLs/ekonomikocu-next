"use client";

import { useState } from 'react';
import { MarketSummary } from '@/services/marketService';
import Link from 'next/link';
import MiniChart from '@/components/ui/MiniChart';
import { useWatchlist } from '@/context/WatchlistContext';

type TabType = 'indices' | 'currencies' | 'commodities' | 'crypto';

interface MarketDashboardProps {
    summary: MarketSummary;
}

export default function MarketDashboard({ summary }: MarketDashboardProps) {
    const { favorites, toggleFavorite, isFavorite } = useWatchlist();
    const [activeTab, setActiveTab] = useState<TabType | 'favorites'>('indices');

    const tabs: { id: TabType | 'favorites'; label: string }[] = [
        { id: 'favorites', label: 'Favorilerim' },
        { id: 'indices', label: 'Endeksler' },
        { id: 'currencies', label: 'Döviz' },
        { id: 'commodities', label: 'Emtia' },
        { id: 'crypto', label: 'Kripto' },
    ];

    // Aggregate all data for favorites lookup
    const allData = [
        ...summary.indices,
        ...summary.currencies,
        ...summary.commodities,
        ...summary.crypto,
        ...summary.movers
    ];

    let activeData = activeTab === 'favorites'
        // Filter unique items by symbol that are in favorites
        ? Array.from(new Map(allData.filter(item => isFavorite(item.symbol)).map(item => [item.symbol, item])).values())
        : (summary[activeTab as TabType] || []);

    return (
        <section className="relative overflow-hidden rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl shadow-lg z-10 transition-all hover:bg-black/50 hover:border-white/10">

            {/* Header / Tabs */}
            <div className="flex items-center gap-2 p-2 border-b border-white/5 overflow-x-auto scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative px-4 py-2 text-xs font-bold transition-all duration-300 rounded-lg whitespace-nowrap ${activeTab === tab.id
                            ? 'text-white bg-white/10 shadow-sm'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.id === 'favorites' && <span className="mr-1">★</span>}
                        {tab.label}
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-2 px-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest hidden sm:inline-block">Canlı</span>
                </div>
            </div>

            {/* Content Area - Compact Horizontal Scroll with Mini Charts */}
            <div className="p-4">
                {activeTab === 'favorites' && activeData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                        <span className="text-2xl mb-2">★</span>
                        <p className="text-sm">Henüz favori eklemediniz.</p>
                        <p className="text-xs opacity-50">Listelerden varlıkların üzerindeki yıldıza tıklayarak ekleyebilirsiniz.</p>
                    </div>
                ) : (
                    <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 h-48">
                        {activeData.map((item, i) => (
                            <Link
                                key={`${item.symbol}-${i}`}
                                href={`/piyasa/${item.symbol}`}
                                className="flex-shrink-0 w-64 h-full rounded-xl bg-white/5 border border-white/5 hover:border-accent-blue/30 hover:bg-white/10 transition-all group relative overflow-hidden block"
                            >
                                {/* Favorite Button - Absolute Top Right */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleFavorite(item.symbol);
                                    }}
                                    className={`absolute top-2 right-2 z-50 p-1.5 rounded-full bg-black/40 backdrop-blur-sm transition-all hover:bg-white/20 ${isFavorite(item.symbol) ? 'text-yellow-400' : 'text-gray-600 hover:text-white'
                                        }`}
                                    title={isFavorite(item.symbol) ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                                >
                                    <svg className="w-4 h-4" fill={isFavorite(item.symbol) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.243.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.567-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </button>

                                {/* Custom Mini Chart with all data */}
                                <MiniChart
                                    symbol={item.symbol}
                                    displayName={item.displayName}
                                    price={item.price}
                                    changePercent={item.changePercent}
                                    isUp={item.up}
                                />
                            </Link>
                        ))}
                    </div>
                )}

                {/* Market Movers Section - Compact Grid */}
                <div className="mt-4 pt-4 border-t border-white/5">
                    <h3 className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center gap-2">
                        <svg className="w-3 h-3 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Günün Öne Çıkanları
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {summary.movers.map((mover, i) => (
                            <Link
                                key={i}
                                href={`/piyasa/${mover.symbol}`}
                                className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all group"
                            >
                                <span className="font-bold text-xs text-text-primary group-hover:text-accent-blue transition-colors">
                                    {mover.displayName || mover.symbol}
                                </span>
                                <span className={`text-[10px] font-mono font-bold ${mover.up ? 'text-green-400' : 'text-red-400'}`}>
                                    {mover.changePercent}
                                </span>
                            </Link>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
