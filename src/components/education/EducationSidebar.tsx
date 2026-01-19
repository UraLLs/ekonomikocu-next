import Link from 'next/link';
import React from 'react';

export default function EducationSidebar() {
    return (
        <aside className="w-full lg:w-[320px] bg-black/40 backdrop-blur-xl border-l border-white/5 h-full min-h-screen sticky top-0 flex flex-col gap-6 p-6">

            {/* 1. KATEGORİLER CARD */}
            <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </div>
                    <h3 className="font-bold text-gray-100">Kategoriler</h3>
                </div>
                <div className="p-2">
                    <nav className="flex flex-col gap-1">
                        {[
                            { name: 'Teknik Analiz', icon: '📊', count: 12, active: true },
                            { name: 'Temel Analiz', icon: '📑', count: 8 },
                            { name: 'Kripto 101', icon: '₿', count: 15 },
                            { name: 'Yatırım Psikolojisi', icon: '🧠', count: 5 },
                            { name: 'İleri Düzey Stratejiler', icon: '🚀', count: 7 },
                        ].map((cat, i) => (
                            <Link
                                href="#"
                                key={i}
                                className={`flex items-center justify-between p-3 rounded-xl transition-all group ${cat.active
                                        ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                                        : 'hover:bg-white/5 text-gray-400 hover:text-white border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg opacity-80 group-hover:scale-110 transition-transform">{cat.icon}</span>
                                    <span className="font-medium text-sm">{cat.name}</span>
                                </div>
                                <span className={`text-[10px] py-0.5 px-2 rounded-full border ${cat.active
                                        ? 'bg-brand-primary/20 border-brand-primary/30'
                                        : 'bg-white/5 border-white/10'
                                    }`}>
                                    {cat.count}
                                </span>
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* 2. LEARNING PATH (ÖĞRENME YOLU) */}
            <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/5 to-transparent overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-3xl -z-10 transition-all group-hover:bg-yellow-500/20"></div>

                <div className="p-5">
                    <h3 className="font-bold text-lg text-yellow-500 mb-2">Sıfırdan Zirveye 🦁</h3>
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                        Borsa dünyasına yeni mi girdin? Adım adım ilerleyen müfredatımızla profesyonel trader ol.
                    </p>

                    <div className="space-y-4 relative">
                        {/* Progress Line */}
                        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-white/10"></div>

                        {[
                            { title: 'Borsa Nedir?', status: 'completed' },
                            { title: 'Mum Grafikleri Okuma', status: 'current' },
                            { title: 'Destek & Direnç', status: 'locked' },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3 relative z-10">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${step.status === 'completed' ? 'bg-green-500 border-green-500 text-black' :
                                        step.status === 'current' ? 'bg-yellow-500 border-yellow-500 text-black animate-pulse' :
                                            'bg-transparent border-white/20 text-gray-600'
                                    }`}>
                                    {step.status === 'completed' ? '✓' : i + 1}
                                </div>
                                <div className={`${step.status === 'locked' ? 'opacity-50 blur-[0.5px]' : ''}`}>
                                    <h4 className="text-sm font-bold text-gray-200">{step.title}</h4>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                        {step.status === 'completed' ? 'Tamamlandı' :
                                            step.status === 'current' ? 'Devam Ediyor' : 'Kilitli'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="mt-6 w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl text-sm transition-colors shadow-lg shadow-yellow-500/20">
                        Eğitime Devam Et
                    </button>
                </div>
            </div>

            {/* 3. POPULER EGITIMLER */}
            <div className="rounded-2xl border border-white/5 bg-black/20 overflow-hidden">
                <div className="p-4 border-b border-white/5">
                    <h3 className="font-bold text-gray-100 flex items-center gap-2">
                        <span className="text-red-500">🔥</span> Popüler
                    </h3>
                </div>
                <div className="divide-y divide-white/5">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="p-3 hover:bg-white/5 cursor-pointer flex gap-3 group">
                            <div className="w-16 h-10 bg-gray-800 rounded-md overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-gray-300 group-hover:text-white transition-colors line-clamp-2">
                                    Price Action ile İleri Seviye Trade
                                </h4>
                                <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-500">
                                    <span className="text-yellow-500">★★★★★</span>
                                    <span>(48)</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </aside>
    );
}
