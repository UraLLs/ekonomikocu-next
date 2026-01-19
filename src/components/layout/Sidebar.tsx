import CurrencyConverter from "@/components/tools/CurrencyConverter";
import Link from 'next/link';

interface SidebarProps {
    rates?: Record<string, number>;
}

export default function Sidebar({ rates }: SidebarProps) {
    return (
        <aside className="flex flex-col gap-5 w-full lg:w-[340px] shrink-0 sticky top-24 h-fit">
            {/* DOVIZ CEVIRICI */}
            <CurrencyConverter initialRates={rates} />

            {/* ONE CIKAN EGITIMLER */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
                        Egitimler
                    </h3>
                    <Link href="/egitim" className="text-[11px] font-bold text-accent-green uppercase tracking-wider hover:underline">TUMU</Link>
                </div>
                <div className="p-3 space-y-2">
                    <Link href="/egitim" className="flex gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
                        <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-accent-green/20 group-hover:scale-105 transition-all border border-white/5 shrink-0">
                            <svg className="w-5 h-5 text-accent-green fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-bold text-gray-200 mb-1 group-hover:text-accent-green transition-colors">RSI Indikatoru Nedir?</h4>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                                <span>12 dk</span>
                                <span>•</span>
                                <span className="text-gray-400">Baslangic</span>
                            </div>
                        </div>
                    </Link>
                    <Link href="/egitim" className="flex gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
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
                    </Link>
                </div>
            </div>

            {/* CANLI YAYIN */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-4 py-3.5 border-b border-white/5 flex items-center justify-between bg-white/5">
                    <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-red" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                        Canli Yayin
                    </h3>
                    <Link href="/canli" className="text-[11px] font-bold text-accent-green uppercase tracking-wider hover:underline">IZLE</Link>
                </div>
                <div className="p-3">
                    <Link href="/canli" className="block relative aspect-video bg-gray-900 rounded-lg mb-3 overflow-hidden group cursor-pointer border border-white/5">
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                        </div>
                    </Link>
                    <div>
                        <h4 className="text-sm font-bold text-gray-200 mb-1">Gunluk Piyasa Ozeti</h4>
                        <p className="text-xs text-gray-500">Canli yayinlara katil, soru sor</p>
                    </div>
                </div>
            </div>

            {/* HIZLI ERISIM */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="px-4 py-3.5 border-b border-white/5 bg-white/5">
                    <h3 className="text-sm font-bold text-gray-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Hizli Erisim
                    </h3>
                </div>
                <div className="p-3 space-y-2">
                    <Link href="/haberler" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-colors group border border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                        </div>
                        <div>
                            <div className="text-[13px] font-bold text-gray-200 group-hover:text-accent-purple transition-colors">Ekonomi Haberleri</div>
                            <div className="text-[10px] text-gray-500">AI destekli analizler</div>
                        </div>
                    </Link>
                    <Link href="/piyasa" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-colors group border border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center text-accent-green">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <div>
                            <div className="text-[13px] font-bold text-gray-200 group-hover:text-accent-green transition-colors">Piyasalar</div>
                            <div className="text-[10px] text-gray-500">Canli fiyatlar ve grafikler</div>
                        </div>
                    </Link>
                    <Link href="/liderlik" className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 cursor-pointer transition-colors group border border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-accent-orange/10 flex items-center justify-center text-accent-orange">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                        </div>
                        <div>
                            <div className="text-[13px] font-bold text-gray-200 group-hover:text-accent-orange transition-colors">Liderlik Tablosu</div>
                            <div className="text-[10px] text-gray-500">En basarili yatirimcilar</div>
                        </div>
                    </Link>
                </div>
            </div>
        </aside>
    );
}
