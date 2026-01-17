import CurrencyConverter from "@/components/tools/CurrencyConverter";
import Link from 'next/link'; // Import Link for client-side navigation
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    symbol: string;
    profiles?: {
        username: string;
        avatar_url?: string;
    };
}

interface SidebarProps {
    comments?: Comment[];
}

export default function Sidebar({ comments = [] }: SidebarProps) {
    return (
        <aside className="flex flex-col gap-5 w-full lg:w-[340px] shrink-0 sticky top-24 h-fit">
            {/* UTILITY WIDGET */}
            <CurrencyConverter />

            {/* ÖNE ÇIKAN EĞİTİMLER */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                        Öne Çıkan Eğitimler
                    </h3>
                    <a href="#" className="text-[11px] font-bold text-accent-green uppercase tracking-wider hover:underline">TÜMÜ</a>
                </div>
                <div className="p-3 space-y-2">
                    <div className="flex gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-accent-green/20 group-hover:scale-105 transition-all border border-white/5 shrink-0">
                            <svg className="w-5 h-5 text-accent-green fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-gray-200 mb-1 group-hover:text-accent-green transition-colors">RSI İndikatörü Nedir?</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                <span>12 dk</span>
                                <span>•</span>
                                <span className="text-gray-400">Başlangıç</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-accent-green/20 group-hover:scale-105 transition-all border border-white/5 shrink-0">
                            <svg className="w-5 h-5 text-accent-green fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-gray-200 mb-1 group-hover:text-accent-green transition-colors">Fibonacci Seviyeleri</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                <span>18 dk</span>
                                <span>•</span>
                                <span className="text-gray-400">Orta</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AKTİF SOHBET ODALARI */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                        Aktif Sohbet Odaları
                    </h3>
                </div>
                <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-colors group border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <div>
                                <div className="text-[13px] font-bold text-gray-200 group-hover:text-accent-blue transition-colors">#borsa-genel</div>
                                <div className="text-[10px] text-gray-500">234 çevrimiçi</div>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-colors group border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-accent-orange/10 flex items-center justify-center text-accent-orange">
                                <span className="font-bold">₿</span>
                            </div>
                            <div>
                                <div className="text-[13px] font-bold text-gray-200 group-hover:text-accent-orange transition-colors">#kripto-analiz</div>
                                <div className="text-[10px] text-gray-500">189 çevrimiçi</div>
                            </div>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* CANLI YAYIN (LIVE STREAM) */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-4 py-3.5 border-b border-white/5 bg-white/5">
                    <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                        Canlı Yayın
                    </h3>
                </div>
                <div className="p-3">
                    <div className="relative aspect-video bg-gray-900 rounded-lg mb-3 overflow-hidden group cursor-pointer border border-white/5">
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-accent-red text-white text-[10px] font-bold rounded uppercase shadow-lg shadow-accent-red/20">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> Canlı
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-medium rounded flex items-center gap-1 border border-white/10">
                            👁 1.2K
                        </div>
                        {/* Play button */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-gray-200 mb-1 hover:text-accent-blue transition-colors cursor-pointer">Günlük Piyasa Özeti</h4>
                        <p className="text-xs text-gray-500">@ekonomist_mehmet ile canlı analiz</p>
                    </div>
                </div>
            </div>

            {/* SICAK TARTIŞMALAR (GÜNDEM) */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        Sıcak Tartışmalar
                    </h3>
                    <Link href="#" className="text-[11px] font-bold text-accent-green uppercase tracking-wider hover:underline">TÜMÜ</Link>
                </div>
                <div className="p-3 space-y-3">
                    <div className="group cursor-pointer">
                        <h4 className="text-[13px] font-bold text-gray-200 group-hover:text-accent-blue transition-colors leading-snug mb-1.5">
                            2026 için en iyi yatırım aracı hangisi?
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg> 142 yorum</span>
                            <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> 2.3K görüntülenme</span>
                        </div>
                    </div>
                    <div className="group cursor-pointer">
                        <h4 className="text-[13px] font-bold text-gray-200 group-hover:text-accent-blue transition-colors leading-snug mb-1.5">
                            Teknik analiz gerçekten işe yarıyor mu?
                        </h4>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-medium">
                            <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg> 89 yorum</span>
                            <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> 1.8K görüntülenme</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
