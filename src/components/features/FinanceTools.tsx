
export default function FinanceTools() {
    return (
        <div className="mt-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                    Finansal Araçlar
                </h2>
                <a href="#" className="text-[13px] font-medium text-accent-green hover:underline flex items-center gap-1">
                    Tüm Araçlar
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {/* Converter */}
                <div className="bg-bg-surface/30 backdrop-blur-xl border border-border-subtle border-t-white/10 rounded-md p-3.5 hover:border-border-default hover:bg-bg-surface-hover/50 transition-all group shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">💱</span>
                        <h4 className="text-xs font-semibold text-text-primary">Döviz Çevirici</h4>
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1.5">
                            <input type="number" defaultValue="1000" className="w-[70px] px-2 py-1.5 bg-bg-secondary/50 border border-border-subtle rounded text-xs font-semibold text-text-primary focus:outline-none focus:border-accent-green" />
                            <select className="px-1.5 bg-bg-secondary/50 border border-border-subtle rounded text-[11px] text-text-secondary cursor-pointer focus:outline-none">
                                <option>TRY</option>
                                <option>USD</option>
                            </select>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-accent-green-soft rounded group-hover:bg-accent-green/20 transition-colors">
                            <span className="text-base font-bold text-accent-green">30.82</span>
                            <span className="text-[11px] text-text-muted">USD</span>
                        </div>
                    </div>
                </div>

                {/* Market Summary */}
                <div className="bg-bg-surface/30 backdrop-blur-xl border border-border-subtle border-t-white/10 rounded-md p-3.5 hover:border-border-default hover:bg-bg-surface-hover/50 transition-all shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">📊</span>
                        <h4 className="text-xs font-semibold text-text-primary">Piyasa Özeti</h4>
                    </div>
                    <div className="flex gap-1.5 mb-2">
                        <div className="flex-1 text-center py-2 px-1 rounded bg-accent-green-soft">
                            <span className="block text-sm font-bold text-accent-green">284</span>
                            <span className="text-[9px] text-text-muted uppercase">Yükselen</span>
                        </div>
                        <div className="flex-1 text-center py-2 px-1 rounded bg-accent-red-soft">
                            <span className="block text-sm font-bold text-accent-red">156</span>
                            <span className="text-[9px] text-text-muted uppercase">Düşen</span>
                        </div>
                    </div>
                    {/* Sparkline */}
                    <div className="h-6 w-full opacity-50">
                        <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                            <path d="M0,10 Q20,20 40,5 T70,15 T100,0" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-green" />
                        </svg>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-bg-surface/30 backdrop-blur-xl border border-border-subtle border-t-white/10 rounded-md p-3.5 hover:border-border-default hover:bg-bg-surface-hover/50 transition-all shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">📅</span>
                        <h4 className="text-xs font-semibold text-text-primary">Eko Takvim</h4>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 p-1.5 bg-bg-secondary/50 rounded">
                            <span className="text-[10px] font-bold text-accent-blue min-w-[34px]">14:30</span>
                            <div className="flex-1 min-w-0">
                                <div className="text-[11px] text-text-primary truncate">ABD İstihdam</div>
                                <div className="h-1 w-full bg-border-subtle rounded-full mt-0.5 overflow-hidden">
                                    <div className="h-full bg-accent-blue w-2/3"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-1.5 bg-bg-secondary/50 rounded">
                            <span className="text-[10px] font-bold text-accent-blue min-w-[34px]">16:00</span>
                            <span className="flex-1 text-[11px] text-text-primary truncate">TCMB Faiz</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse"></span>
                        </div>
                    </div>
                </div>

                {/* Calculator */}
                <div className="bg-bg-surface/30 backdrop-blur-xl border border-border-subtle border-t-white/10 rounded-md p-3.5 hover:border-border-default hover:bg-bg-surface-hover/50 transition-all group shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">🧮</span>
                        <h4 className="text-xs font-semibold text-text-primary">Getiri Hesapla</h4>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <div className="text-[11px] text-text-secondary">₺10.000 → 12 ay</div>
                        <div className="flex justify-between items-center p-2 bg-accent-green-soft rounded group-hover:bg-accent-green/20 transition-colors">
                            <span className="text-[10px] text-text-muted">Tahmini:</span>
                            <span className="text-sm font-bold text-accent-green">₺14.200</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-bg-surface/30 backdrop-blur-xl border border-border-subtle border-t-white/10 rounded-md p-3.5 hover:border-border-default hover:bg-bg-surface-hover/50 transition-all shadow-lg">
                    <div className="grid grid-cols-2 gap-1.5 h-full">
                        <a href="#" className="flex items-center gap-1.5 p-2 bg-bg-secondary/50 rounded hover:bg-accent-green-soft hover:text-accent-green text-[11px] text-text-secondary transition-colors">
                            <span className="text-xs">📈</span> Borsa
                        </a>
                        <a href="#" className="flex items-center gap-1.5 p-2 bg-bg-secondary/50 rounded hover:bg-accent-green-soft hover:text-accent-green text-[11px] text-text-secondary transition-colors">
                            <span className="text-xs">💰</span> Altın
                        </a>
                        <a href="#" className="flex items-center gap-1.5 p-2 bg-bg-secondary/50 rounded hover:bg-accent-green-soft hover:text-accent-green text-[11px] text-text-secondary transition-colors">
                            <span className="text-xs">₿</span> Kripto
                        </a>
                        <a href="#" className="flex items-center gap-1.5 p-2 bg-bg-secondary/50 rounded hover:bg-accent-green-soft hover:text-accent-green text-[11px] text-text-secondary transition-colors">
                            <span className="text-xs">🏦</span> Faiz
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
