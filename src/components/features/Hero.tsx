import { ShieldCheckIcon, UserGroupIcon, StarIcon } from "@heroicons/react/24/outline";

export default function Hero() {
    return (
        <section className="relative bg-gradient-to-br from-deep-navy to-midnight py-20 overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 20% 50%, #B8985F 0px, transparent 2px),
            radial-gradient(circle at 80% 80%, #B8985F 0px, transparent 2px)
          `,
                    backgroundSize: '100px 100px'
                }}
            />

            <div className="relative z-10 max-w-[900px] mx-auto text-center px-6">
                {/* Ornament */}
                <div className="w-20 h-1 bg-gradient-to-r from-transparent via-bright-gold to-transparent mx-auto mb-6" />

                {/* Headlines */}
                <h1 className="text-6xl md:text-7xl font-display font-black text-ivory mb-4 tracking-widest uppercase leading-tight">
                    ART DECO <br /> FINANCIAL
                </h1>
                <p className="text-2xl text-bright-gold font-light italic mb-4 font-body">
                    Yeni Nesil Yatırım Deneyimi
                </p>
                <p className="text-lg text-pearl mb-10 leading-relaxed max-w-2xl mx-auto">
                    Piyasaların nabzını tutan, estetik ve güçlü finansal analiz platformu.
                    Veri odaklı kararlar için profesyonel araçlar.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
                    <div className="text-center group">
                        <div className="text-3xl md:text-4xl font-bold text-bright-gold font-mono mb-1 group-hover:scale-110 transition-transform">500K+</div>
                        <div className="text-xs text-pearl uppercase tracking-widest flex items-center justify-center gap-1">
                            <UserGroupIcon className="w-4 h-4" /> Kullanıcı
                        </div>
                    </div>
                    <div className="text-center group">
                        <div className="text-3xl md:text-4xl font-bold text-bright-gold font-mono mb-1 group-hover:scale-110 transition-transform">1M+</div>
                        <div className="text-xs text-pearl uppercase tracking-widest flex items-center justify-center gap-1">
                            <ShieldCheckIcon className="w-4 h-4" /> İşlem
                        </div>
                    </div>
                    <div className="text-center group">
                        <div className="text-3xl md:text-4xl font-bold text-bright-gold font-mono mb-1 group-hover:scale-110 transition-transform">4.9★</div>
                        <div className="text-xs text-pearl uppercase tracking-widest flex items-center justify-center gap-1">
                            <StarIcon className="w-4 h-4" /> Rating
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        className="px-8 py-4 bg-gradient-to-br from-muted-gold to-bright-gold text-deep-navy font-bold text-sm tracking-widest uppercase hover:-translate-y-1 hover:shadow-gold transition-all duration-300"
                        style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                    >
                        Hemen Başla
                    </button>

                    <button
                        className="px-8 py-4 bg-transparent text-ivory border-2 border-muted-gold font-bold text-sm tracking-widest uppercase hover:bg-white/10 transition-all duration-300"
                        style={{ clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)" }}
                    >
                        Detaylı Bilgi
                    </button>
                </div>
            </div>
        </section>
    );
}
