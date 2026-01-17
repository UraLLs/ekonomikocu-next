"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CurrencyDollarIcon, BanknotesIcon } from "@heroicons/react/24/solid";

const DATA = [
    { time: '09:00', value: 9050 },
    { time: '10:00', value: 9080 },
    { time: '11:00', value: 9120 },
    { time: '12:00', value: 9100 },
    { time: '13:00', value: 9150 },
    { time: '14:00', value: 9200 },
    { time: '15:00', value: 9180 },
    { time: '16:00', value: 9220 },
    { time: '17:00', value: 9125 },
];

const TABS = ["BIST 100", "USD/TRY", "ALTIN", "BITCOIN"];

export default function MarketDashboard() {
    const [activeTab, setActiveTab] = useState("BIST 100");

    return (
        <section className="bg-gradient-to-br from-deep-navy to-midnight py-10 text-ivory relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-bright-gold opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-[1400px] mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT: Main Chart */}
                    <div className="lg:col-span-2 bg-slate-blue/20 rounded-lg border border-slate-blue/50 p-6 backdrop-blur-sm relative">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-2">
                                {TABS.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all rounded-sm ${activeTab === tab
                                                ? 'bg-muted-gold text-deep-navy shadow-gold'
                                                : 'bg-transparent text-pearl border border-pearl/30 hover:border-muted-gold'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-mono font-bold text-bright-gold">9,125.40</div>
                                <div className="text-xs text-emerald font-bold flex items-center justify-end gap-1">
                                    <ArrowTrendingUpIcon className="w-3 h-3" /> +1.42% (Günlük)
                                </div>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={DATA}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374B5C" opacity={0.3} vertical={false} />
                                    <XAxis dataKey="time" stroke="#E8E6E0" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis hide domain={['auto', 'auto']} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1B2A41', borderColor: '#B8985F', color: '#FDFDF5' }}
                                        itemStyle={{ color: '#D4AF37' }}
                                    />
                                    <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* RIGHT: Market Summary */}
                    <div className="bg-ivory text-deep-navy p-6 rounded-lg shadow-lg relative" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-muted-gold to-bright-gold" />

                        <h3 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                            📊 Piyasa Özeti
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-3 bg-cream rounded-md border border-pearl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald/10 text-emerald rounded-full">
                                        <CurrencyDollarIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-graphite font-bold uppercase">Dolar / TL</div>
                                        <div className="font-mono font-bold text-lg">34.1500</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald font-bold text-sm">+0.12%</div>
                                    <div className="text-[10px] text-graphite">Güçlü Al</div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-cream rounded-md border border-pearl">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-ruby/10 text-ruby rounded-full">
                                        <BanknotesIcon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-graphite font-bold uppercase">Euro / TL</div>
                                        <div className="font-mono font-bold text-lg">37.2040</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-ruby font-bold text-sm">-0.05%</div>
                                    <div className="text-[10px] text-graphite">Nötr</div>
                                </div>
                            </div>

                            {/* Market Sentiment Mini Bar */}
                            <div className="mt-6">
                                <div className="flex justify-between text-xs font-bold mb-2 text-charcoal">
                                    <span>Piyasa Yönü</span>
                                    <span className="text-emerald">Pozitif</span>
                                </div>
                                <div className="h-2 bg-pearl rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-muted-gold to-emerald w-[70%]" />
                                </div>
                            </div>

                            <button className="w-full mt-4 py-3 bg-deep-navy text-bright-gold font-bold text-xs uppercase tracking-widest hover:bg-midnight transition-colors">
                                Tüm Verileri Gör
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
