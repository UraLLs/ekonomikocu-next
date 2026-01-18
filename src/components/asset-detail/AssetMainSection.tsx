"use client";

import { useState } from "react";
import TradingViewChart from "./TradingViewChart";
import NewsFeed from "./NewsFeed";

// Simple Financials Table Component (Internal)
const FinancialsView = ({ symbol }: { symbol: string }) => {
    return (
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 text-text-primary">Mali Durum</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-text-secondary uppercase bg-bg-surface-hover/50">
                        <tr>
                            <th className="px-4 py-3 rounded-l-lg">Dönem</th>
                            <th className="px-4 py-3">Gelir</th>
                            <th className="px-4 py-3">Net Kâr</th>
                            <th className="px-4 py-3 rounded-r-lg">Kâr Marjı</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {/* Mock Data Simulation */}
                        {[
                            { period: '2025 3. Çeyrek', rev: '185.4 Mrd ₺', net: '45.2 Mrd ₺', margin: '%24.3' },
                            { period: '2025 2. Çeyrek', rev: '162.1 Mrd ₺', net: '38.5 Mrd ₺', margin: '%23.7' },
                            { period: '2025 1. Çeyrek', rev: '145.8 Mrd ₺', net: '32.1 Mrd ₺', margin: '%22.0' },
                            { period: '2024 4. Çeyrek', rev: '138.5 Mrd ₺', net: '29.8 Mrd ₺', margin: '%21.5' },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-bg-surface-hover/30 transition-colors">
                                <td className="px-4 py-3 font-medium text-text-primary">{row.period}</td>
                                <td className="px-4 py-3 text-text-secondary">{row.rev}</td>
                                <td className="px-4 py-3 text-accent-green">{row.net}</td>
                                <td className="px-4 py-3 text-text-primary">{row.margin}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-text-muted mt-4">
                * Veriler yaklaşık değerlerdir ve dağıtım kaynaklarına göre farklılık gösterebilir.
            </p>
        </div>
    );
};

export default function AssetMainSection({ symbol, news }: { symbol: string, news: any[] }) {
    const [activeTab, setActiveTab] = useState<'summary' | 'news' | 'financials'>('summary');

    return (
        <div className="flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-border-subtle">
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`pb-3 text-sm font-bold transition-all ${activeTab === 'summary'
                        ? 'text-accent-blue border-b-2 border-accent-blue'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                >
                    Özet
                </button>
                <button
                    onClick={() => setActiveTab('news')}
                    className={`pb-3 text-sm font-bold transition-all ${activeTab === 'news'
                        ? 'text-accent-blue border-b-2 border-accent-blue'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                >
                    Haberler
                </button>
                <button
                    onClick={() => setActiveTab('financials')}
                    className={`pb-3 text-sm font-bold transition-all ${activeTab === 'financials'
                        ? 'text-accent-blue border-b-2 border-accent-blue'
                        : 'text-text-secondary hover:text-text-primary'
                        }`}
                >
                    Finansallar
                </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'summary' && (
                    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Chart */}
                        <TradingViewChart symbol={symbol} />

                        {/* Integrated News Preview */}
                        <div>
                            <h2 className="text-xl font-bold mb-4 text-text-primary">İlgili Haberler</h2>
                            <NewsFeed news={news} viewMode="preview" />
                        </div>
                    </div>
                )}

                {activeTab === 'news' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <NewsFeed news={news} viewMode="full" />
                    </div>
                )}

                {activeTab === 'financials' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <FinancialsView symbol={symbol} />
                    </div>
                )}
            </div>
        </div>
    );
}
