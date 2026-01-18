import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface IPOArenaProps {
    ipos: any[];
}

export default function IPOArena({ ipos }: IPOArenaProps) {
    if (!ipos || ipos.length === 0) return null;

    return (
        <div className="mt-8 mb-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-accent-blue flex items-center justify-center text-white shadow-lg shadow-brand-primary/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            Halka Arz Arenası
                        </h2>
                        <p className="text-xs text-text-muted">Yaklaşan fırsatları kaçırma</p>
                    </div>
                </div>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/5">
                    Tüm Takvim <ArrowRightIcon className="w-3 h-3" />
                </button>
            </div>

            {/* SCROLL CONTAINER */}
            <div className="relative group">
                {/* Fade Gradients for Scroll Indication */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none md:hidden" />
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

                <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory custom-scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {ipos.map((ipo) => (
                        <div
                            key={ipo.id}
                            className="snap-start shrink-0 w-[240px] h-[140px] relative rounded-2xl overflow-hidden cursor-pointer group/card transition-transform hover:-translate-y-1 shadow-2xl"
                        >
                            {/* PREMIUM BACKGROUND IMAGE */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/card:scale-110"
                                style={{ backgroundImage: "url('/images/ipo-bg.png')" }}
                            />

                            {/* Aggressive Gradient Overlay for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />

                            <div className="absolute inset-0 p-4 flex flex-col justify-between">
                                {/* Top Row: Code & Status */}
                                <div className="flex justify-between items-start">
                                    <div className={`px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-sm tracking-wider shadow-lg`}>
                                        {ipo.code}
                                    </div>
                                    {ipo.status === 'active' ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" title="Talep Toplanıyor" />
                                    ) : ipo.status === 'completed' ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-gray-500" title="Tamamlandı" />
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full bg-accent-orange" title="Onay Bekliyor" />
                                    )}
                                </div>

                                {/* Bottom Row: Info */}
                                <div>
                                    <h3 className="text-base font-bold text-white leading-tight mb-2 drop-shadow-md line-clamp-1">
                                        {ipo.company_name}
                                    </h3>

                                    <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-gray-300">
                                        <div className="bg-black/40 rounded px-2 py-1 border border-white/5 backdrop-blur-sm">
                                            <span className="block text-gray-500 text-[9px] uppercase">Fiyat</span>
                                            <span className="text-white font-bold">{ipo.price}</span>
                                        </div>
                                        <div className="bg-black/40 rounded px-2 py-1 border border-white/5 backdrop-blur-sm text-right">
                                            <span className="block text-gray-500 text-[9px] uppercase">Tarih</span>
                                            <span className="text-white font-bold">{ipo.date_range}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Border Glow on Hover */}
                            <div className="absolute inset-0 border border-white/10 rounded-2xl group-hover/card:border-brand-primary/50 transition-colors pointer-events-none" />
                        </div>
                    ))}

                    {/* "See More" Card */}
                    <div className="snap-start shrink-0 w-[80px] h-[140px] relative rounded-2xl overflow-hidden cursor-pointer group bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex flex-col items-center justify-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                            <ArrowRightIcon className="w-4 h-4" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
