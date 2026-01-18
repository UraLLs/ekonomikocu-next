import Link from 'next/link';
import React from 'react';

export default function LiveSidebar() {
    return (
        <aside className="w-full lg:w-[280px] bg-black/60 backdrop-blur-xl border-r border-white/5 h-full min-h-screen sticky top-0 flex flex-col gap-6 p-4">

            {/* 1. TAVSİYE EDİLEN KANALLAR */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                    Tavsiye Edilen Kanallar
                </h3>
                <div className="space-y-1">
                    {[
                        { name: 'Ekonomist Mehmet', title: 'Piyasa Analizi', viewers: '1.2K', live: true, avatar: '👨‍💼' },
                        { name: 'Crypto King', title: 'Altcoin Avı', viewers: '856', live: true, avatar: '🦁' },
                        { name: 'Teknik Hoca', title: 'Grafik Eğitimi', viewers: '432', live: true, avatar: '📊' },
                        { name: 'Borsa Gündem', title: 'Haber Akışı', viewers: 'offline', live: false, avatar: '📰' },
                    ].map((channel, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-colors">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl border border-white/10">
                                    {channel.avatar}
                                </div>
                                {channel.live && (
                                    <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 bg-black rounded-full">
                                        <div className="w-2.5 h-2.5 bg-accent-red rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-bold text-gray-200 truncate group-hover:text-accent-red transition-colors">{channel.name}</h4>
                                    {channel.live && (
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <span className="w-1 h-1 bg-accent-red rounded-full"></span>
                                            {channel.viewers}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[11px] text-gray-500 truncate">{channel.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. KATEGORİLER */}
            <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2 pt-4 border-t border-white/5">
                    Kategoriler
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { name: 'BIST 100', color: 'bg-blue-500' },
                        { name: 'Kripto', color: 'bg-orange-500' },
                        { name: 'Forex', color: 'bg-green-500' },
                        { name: 'Emtia', color: 'bg-yellow-500' },
                    ].map((cat, i) => (
                        <div key={i} className="relative h-20 rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-white/20 transition-all">
                            <div className={`absolute inset-0 ${cat.color} opacity-20 group-hover:opacity-30 transition-opacity`}></div>
                            <div className="absolute inset-0 flex items-end p-2">
                                <span className="text-[11px] font-bold text-white leading-tight">{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. PLATFORM HABERLERİ */}
            <div className="mt-auto bg-gradient-to-br from-accent-purple/20 to-transparent p-4 rounded-2xl border border-accent-purple/20">
                <h4 className="text-sm font-bold text-white mb-1">Yayıncı Ol!</h4>
                <p className="text-xs text-gray-400 mb-3">Topluluğunu kur ve kazanmaya başla.</p>
                <button className="w-full py-2 bg-accent-purple hover:bg-accent-purple/80 text-white text-xs font-bold rounded-lg transition-colors">
                    Başvur
                </button>
            </div>

        </aside>
    );
}
