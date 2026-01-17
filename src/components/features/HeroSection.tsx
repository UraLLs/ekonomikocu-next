import Link from "next/link";

export default function HeroSection() {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/5 p-8 md:p-12 mb-8 group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-accent-blue/30 transition-all duration-1000"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-green/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none group-hover:bg-accent-green/20 transition-all duration-1000"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-green/10 border border-accent-green/20 text-accent-green text-xs font-bold uppercase tracking-wider mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
                        </span>
                        Piyasalar Canlı
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
                        Finansal Özgürlüğünü <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-green via-emerald-400 to-accent-blue animate-gradient-x">
                            Yönet ve Büyüt
                        </span>
                    </h1>

                    <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-lg">
                        Türkiye'nin en gelişmiş sosyal finans platformunda yerini al.
                        Yapay zeka destekli analizler, canlı piyasa verileri ve uzman topluluk seninle.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link href="/piyasa" className="px-8 py-4 bg-accent-green hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-accent-green/25 hover:shadow-accent-green/40 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                            Hemen Başla
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </Link>
                        <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-300">
                            Detaylı Bilgi
                        </button>
                    </div>
                </div>

                {/* Abstract Visual / Mini Dashboard */}
                <div className="hidden lg:block relative w-[400px] h-[300px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-white/10 shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-500">
                        {/* Mock Chart Area */}
                        <div className="p-4 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="text-xs font-mono text-gray-500">BIST 100</div>
                        </div>
                        <div className="p-6 relative h-full">
                            <div className="flex items-end justify-between h-32 gap-2 mb-4">
                                {[40, 65, 55, 80, 70, 90, 85, 95].map((h, i) => (
                                    <div key={i} className="w-full bg-accent-green/20 rounded-t-sm relative group">
                                        <div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-accent-green rounded-t-sm group-hover:bg-accent-blue transition-colors duration-300"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center justify-between text-white font-mono text-sm">
                                <span>10.450,23</span>
                                <span className="text-accent-green">+2.4%</span>
                            </div>
                        </div>
                    </div>
                    {/* Floating Cards */}
                    <div className="absolute -bottom-6 -left-6 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-lg shadow-xl animate-float">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 font-bold">₿</div>
                            <div>
                                <div className="text-xs text-gray-400">Bitcoin</div>
                                <div className="text-sm font-bold text-white">$98,420</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
