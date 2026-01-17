import { PlayCircleIcon } from "@heroicons/react/24/solid";

export default function CenterContent() {
    return (
        <section className="flex-1 min-w-0">

            {/* Featured News Card */}
            <div
                className="bg-ivory p-6 shadow-sm mb-8 group hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer"
                style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}
            >
                <div className="w-full h-[300px] bg-gradient-to-br from-slate-blue to-midnight mb-6 relative overflow-hidden">
                    {/* Placeholder for Image */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <span className="absolute top-4 left-4 bg-deep-navy text-bright-gold text-xs font-bold px-3 py-1 uppercase tracking-widest">
                        Günün Analizi
                    </span>
                </div>

                <h2 className="font-display font-bold text-3xl text-deep-navy mb-4 leading-tight group-hover:text-muted-gold transition-colors">
                    Borsa İstanbul'da Rekor Seviyeler: Yabancı Yatırımcı Geri mi Dönüyor?
                </h2>
                <p className="text-charcoal leading-relaxed mb-4 text-lg">
                    Merkez Bankası'nın son faiz kararı sonrası piyasalarda pozitif rüzgarlar esiyor. Bankacılık endeksi öncülüğünde başlayan yükseliş, sanayi hisselerine de yansıdı.
                </p>
                <div className="flex gap-4 text-xs text-graphite uppercase tracking-wider font-medium">
                    <span>2 Saat Önce</span>
                    <span className="text-muted-gold">•</span>
                    <span>Ali Perşembe</span>
                </div>
            </div>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-ivory p-5 shadow-sm group hover:shadow-md transition-all cursor-pointer"
                        style={{ clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)" }}
                    >
                        <div className="w-full h-32 bg-pearl mb-4 relative">
                            <div className="absolute bottom-0 left-0 bg-deep-navy text-ivory text-[10px] font-bold px-2 py-1">
                                KRİPTO
                            </div>
                        </div>
                        <h3 className="font-display font-bold text-lg text-deep-navy mb-2 leading-snug group-hover:text-muted-gold transition-colors">
                            Bitcoin Halving Öncesi Son Durum: Madenciler Ne Yapıyor?
                        </h3>
                        <span className="text-xs text-graphite">15 Dakika Önce</span>
                    </div>
                ))}
            </div>

            {/* Video Section */}
            <div className="bg-ivory p-6 shadow-sm mb-8" style={{ clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)" }}>
                <h3 className="font-display font-bold text-xl text-deep-navy mb-6 flex items-center gap-2 uppercase">
                    <PlayCircleIcon className="w-6 h-6 text-ruby" /> Video Analiz
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="aspect-video bg-midnight mb-2 relative flex items-center justify-center">
                                <PlayCircleIcon className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform" />
                            </div>
                            <h4 className="font-bold text-sm text-deep-navy group-hover:text-ruby transition-colors">Haftalık Piyasa Bakışı: Altın Nereye Gidiyor?</h4>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    );
}
