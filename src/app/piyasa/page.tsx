import Header from "@/components/layout/Header";
import Ticker from "@/components/layout/Ticker";
import Footer from "@/components/layout/Footer";
import { getBinanceTicker, getAssetDetail } from "@/services/marketService";
import Link from "next/link";
import SummaryCard from '@/components/market/SummaryCard';

export const revalidate = 60;

import MarketOverviewWidget from "@/components/market/widgets/MarketOverviewWidget";
import EconomicCalendar from "@/components/market/widgets/EconomicCalendar";
import CryptoHeatmapWidget from "@/components/market/widgets/CryptoHeatmapWidget";

export default async function MarketsPage() {
    // 1. Fetch Market Overview Data (Kept for basic SSR data if needed, but Widget does heavy lifting)
    const [bist100, usd, eur, gramAltin, onsAltin, brent] = await Promise.all([
        getAssetDetail('XU100'),
        getAssetDetail('USD'),
        getAssetDetail('EUR'),
        getAssetDetail('GRAM'),
        getAssetDetail('ONS'),
        getAssetDetail('BZ=F'),
    ]);

    // 2. Fetch Lists
    const cryptoData = await getBinanceTicker();

    const bistSymbols = ['THYAO', 'GARAN', 'ASELS', 'KCHOL', 'SASA', 'AKBNK', 'EREGL'];
    const bistData = await Promise.all(
        bistSymbols.map(async (s) => {
            const detail = await getAssetDetail(s);
            return { ...detail, symbol: s };
        })
    );

    const commodities = [
        { ...gramAltin, symbol: 'Gram Altın', code: 'GRAM' },
        { ...onsAltin, symbol: 'Ons Altın', code: 'ONS' },
        { ...brent, symbol: 'Brent Petrol', code: 'BRENT' },
        { ...usd, symbol: 'Dolar', code: 'USD/TRY' },
        { ...eur, symbol: 'Euro', code: 'EUR/TRY' },
    ];

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-[1400px] mx-auto p-4 md:p-6 min-h-[60vh]">

                {/* PAGE HEADER */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-accent-blue bg-clip-text text-transparent">
                            Piyasa Analizi
                        </h1>
                        <p className="text-text-secondary mt-1 text-sm">Canlı Borsa, Döviz ve Kripto Varlıklar</p>
                    </div>
                </div>

                {/* 1. TRADINGVIEW MARKET OVERVIEW (Top Section) */}
                <div className="mb-8">
                    <MarketOverviewWidget />
                </div>

                {/* 2. CUSTOM DATA TABLES (BIST & Commodities) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* BIST TABLE */}
                    <div className="bg-black/40 rounded-2xl border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                            <h2 className="font-bold text-lg flex items-center gap-2 text-gray-100">
                                <span className="text-accent-blue bg-accent-blue/10 w-8 h-8 rounded-lg flex items-center justify-center">📊</span> Borsa İstanbul
                            </h2>
                            <Link href="/piyasa/bist" className="text-xs font-bold text-accent-blue uppercase tracking-wider hover:underline">Tümü</Link>
                        </div>
                        <div className="p-2 overflow-x-auto">
                            <table className="w-full min-w-[300px]">
                                <thead className="text-[10px] uppercase font-bold text-gray-500 bg-white/[0.02]">
                                    <tr>
                                        <th className="py-2 px-3 text-left rounded-l-md">Hisse</th>
                                        <th className="py-2 px-3 text-right">Fiyat</th>
                                        <th className="py-2 px-3 text-right rounded-r-md">Değ.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {bistData.map((item, i) => (
                                        <tr key={i} className="group hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0">
                                            <td className="py-3 px-3">
                                                <Link href={`/piyasa/${item.symbol}`} className="block">
                                                    <div className="font-bold text-sm text-gray-200 group-hover:text-accent-blue transition-colors">{item.symbol}</div>
                                                    <div className="text-[10px] text-gray-500 truncate max-w-[100px] font-mono">{item.name}</div>
                                                </Link>
                                            </td>
                                            <td className="py-3 px-3 text-right font-mono text-sm text-gray-300 font-bold">{item.price}</td>
                                            <td className={`py-3 px-3 text-right font-mono text-xs font-bold ${item.isUp ? 'text-accent-green' : 'text-accent-red'}`}>
                                                <span className={`inline-block px-1.5 py-0.5 rounded ${item.isUp ? 'bg-accent-green/10' : 'bg-accent-red/10'}`}>
                                                    {item.changePercent}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ECONOMIC CALENDAR (Right Column) */}
                    <div>
                        <EconomicCalendar />
                    </div>
                </div>

                {/* 3. CRYPTO SECTION (Heatmap + Table) */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="text-accent-orange">₿</span> Kripto Piyasası
                    </h2>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Heatmap (2/3 width) */}
                        <div className="xl:col-span-2">
                            <CryptoHeatmapWidget />
                        </div>

                        {/* Custom Table (1/3 width) - Good for quick list */}
                        <div className="xl:col-span-1 bg-black/40 rounded-2xl border border-white/5 backdrop-blur-xl overflow-hidden shadow-2xl h-fit">
                            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h2 className="font-bold text-base flex items-center gap-2 text-gray-100">
                                    Popüler Coinler
                                </h2>
                                <Link href="/piyasa/kripto" className="text-xs font-bold text-accent-orange uppercase tracking-wider hover:underline">Tümü</Link>
                            </div>
                            <div className="p-2 overflow-x-auto">
                                <table className="w-full min-w-[300px]">
                                    <thead className="text-[10px] uppercase font-bold text-gray-500 bg-white/[0.02]">
                                        <tr>
                                            <th className="py-2 px-3 text-left rounded-l-md">Coin</th>
                                            <th className="py-2 px-3 text-right">Fiyat ($)</th>
                                            <th className="py-2 px-3 text-right rounded-r-md">Değ.</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {cryptoData.slice(0, 8).map((item, i) => (
                                            <tr key={i} className="group hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0">
                                                <td className="py-3 px-3 font-medium text-sm">
                                                    <Link href={`/piyasa/${item.symbol === 'USDTRY' ? 'USD' : item.symbol}`} className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-gray-500 font-bold border border-white/10 group-hover:border-accent-orange/50 group-hover:text-accent-orange transition-colors">
                                                            {item.symbol[0]}
                                                        </div>
                                                        <span className="font-bold text-gray-200 group-hover:text-accent-orange transition-colors">{item.symbol.split('/')[0]}</span>
                                                    </Link>
                                                </td>
                                                <td className="py-3 px-3 text-right font-mono text-sm text-gray-300 font-bold">{item.price}</td>
                                                <td className={`py-3 px-3 text-right font-mono text-xs font-bold ${item.up ? 'text-accent-green' : 'text-accent-red'}`}>
                                                    <span className={`inline-block px-1.5 py-0.5 rounded ${item.up ? 'bg-accent-green/10' : 'bg-accent-red/10'}`}>
                                                        {item.changePercent}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </main>
    );
}


