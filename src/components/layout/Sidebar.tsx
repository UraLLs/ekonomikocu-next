import CurrencyConverter from "@/components/tools/CurrencyConverter";

export default function Sidebar() {
    return (
        <aside className="flex flex-col gap-5 w-full lg:w-[340px] shrink-0">
            {/* UTILITY WIDGET */}
            <CurrencyConverter />

            {/* TREND POSTS WIDGET */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                        Trend Paylaşımlar
                    </h3>
                    <a href="#" className="text-[13px] font-medium text-accent-green hover:underline">Tümü</a>
                </div>
                <div className="p-3">
                    <div className="p-3 rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors mb-2">
                        <div className="flex items-center gap-2.5 mb-2">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=trader42" alt="" className="w-8 h-8 rounded-full bg-bg-elevated" />
                            <div className="flex-1">
                                <div className="text-[13px] font-semibold text-text-primary">Ahmet Yılmaz</div>
                                <div className="text-[11px] text-text-muted">@trader42 • 2s önce</div>
                            </div>
                        </div>
                        <p className="text-[13px] text-text-secondary leading-normal mb-2">
                            BIST 100&apos;de 10.500 direnci kritik. Kırılırsa 11.000&apos;i hızlı görebiliriz. Bankacılık endeksi lokomotif olmaya devam ediyor 📈
                        </p>
                        <div className="flex gap-4 text-[11px] text-text-muted">
                            <span className="flex items-center gap-1">❤️ 234</span>
                            <span className="flex items-center gap-1">💬 42</span>
                            <span className="flex items-center gap-1">🔄 18</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors">
                        <div className="flex items-center gap-2.5 mb-2">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=crypto" alt="" className="w-8 h-8 rounded-full bg-bg-elevated" />
                            <div className="flex-1">
                                <div className="text-[13px] font-semibold text-text-primary">Kripto Analiz</div>
                                <div className="text-[11px] text-text-muted">@kriptoanalist • 15d önce</div>
                            </div>
                        </div>
                        <p className="text-[13px] text-text-secondary leading-normal mb-2">
                            Bitcoin haftalık kapanış kritik. 95K üzeri kapanırsa ATH yolculuğu hızlanır.
                        </p>
                        <div className="flex gap-4 text-[11px] text-text-muted">
                            <span className="flex items-center gap-1">❤️ 189</span>
                            <span className="flex items-center gap-1">💬 31</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* LIVE STREAM WIDGET */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3.5 border-b border-border-subtle">
                    <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                        Canlı Yayın
                    </h3>
                </div>
                <div className="p-3">
                    <div className="relative aspect-video bg-bg-elevated rounded-md mb-3 overflow-hidden group cursor-pointer">
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-accent-red text-white text-[10px] font-bold rounded uppercase">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Canlı
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-[11px] font-medium rounded flex items-center gap-1">
                            👁 1.2K
                        </div>
                        {/* Placeholder play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-text-primary mb-1">Günlük Piyasa Özeti</h4>
                        <p className="text-xs text-text-muted">@ekonomist_mehmet ile canlı analiz</p>
                    </div>
                </div>
            </div>

            {/* EDUCATION WIDGET */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                        Öne Çıkan Eğitimler
                    </h3>
                    <a href="#" className="text-[13px] font-medium text-accent-green hover:underline">Tümü</a>
                </div>
                <div className="p-3 space-y-2">
                    <div className="flex gap-3 p-2 rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors group">
                        <div className="w-16 h-12 bg-bg-elevated rounded flex items-center justify-center text-accent-green group-hover:bg-accent-green-soft shadow-sm">▶</div>
                        <div>
                            <h4 className="text-[13px] font-semibold text-text-primary mb-1">RSI İndikatörü Nedir?</h4>
                            <div className="flex items-center gap-2 text-[11px] text-text-muted">
                                <span>12 dk</span>
                                <span>•</span>
                                <span>Başlangıç</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 p-2 rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors group">
                        <div className="w-16 h-12 bg-bg-elevated rounded flex items-center justify-center text-accent-green group-hover:bg-accent-green-soft shadow-sm">▶</div>
                        <div>
                            <h4 className="text-[13px] font-semibold text-text-primary mb-1">Fibonacci Seviyeleri</h4>
                            <div className="flex items-center gap-2 text-[11px] text-text-muted">
                                <span>18 dk</span>
                                <span>•</span>
                                <span>Orta</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CHAT ROOMS WIDGET */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3.5 border-b border-border-subtle">
                    <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        Aktif Sohbet Odaları
                    </h3>
                </div>
                <div className="p-3 space-y-1">
                    <div className="flex items-center gap-3 p-2.5 rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors">
                        <div className="w-9 h-9 rounded-md bg-accent-green-soft flex items-center justify-center text-base">📈</div>
                        <div className="flex-1">
                            <div className="text-[13px] font-semibold text-text-primary">#borsa-genel</div>
                            <div className="text-[11px] text-text-muted">234 çevrimiçi</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                    </div>
                    <div className="flex items-center gap-3 p-2.5 rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors">
                        <div className="w-9 h-9 rounded-md bg-accent-orange-soft flex items-center justify-center text-base">₿</div>
                        <div className="flex-1">
                            <div className="text-[13px] font-semibold text-text-primary">#kripto-analiz</div>
                            <div className="text-[11px] text-text-muted">189 çevrimiçi</div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                    </div>
                </div>
            </div>

            {/* FORUM WIDGET */}
            <div className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden">
                <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        Sıcak Tartışmalar
                    </h3>
                    <a href="#" className="text-[13px] font-medium text-accent-green hover:underline">Tümü</a>
                </div>
                <div className="p-3 space-y-2">
                    <div className="p-3 rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors">
                        <h4 className="text-[13px] font-semibold text-text-primary mb-1">2026 için en iyi yatırım aracı hangisi?</h4>
                        <div className="flex items-center gap-3 text-[11px] text-text-muted">
                            <span>💬 142 yorum</span>
                            <span>👁 2.3K görüntülenme</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors">
                        <h4 className="text-[13px] font-semibold text-text-primary mb-1">Teknik analiz gerçekten işe yarıyor mu?</h4>
                        <div className="flex items-center gap-3 text-[11px] text-text-muted">
                            <span>💬 89 yorum</span>
                            <span>👁 1.8K görüntülenme</span>
                        </div>
                    </div>
                </div>
            </div>

        </aside>
    );
}
