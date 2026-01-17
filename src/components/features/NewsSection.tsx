
export default function NewsSection() {
    return (
        <section className="flex flex-col gap-5">
            {/* SECTION HEADER */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1m2 13a2 2 0 0 1-2-2V7m2 13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                    Son Haberler
                </h2>
                <a href="#" className="text-[13px] font-medium text-accent-green hover:underline flex items-center gap-1">
                    Tümünü Gör
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </a>
            </div>

            {/* HERO NEWS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4">
                {/* Main Card */}
                <article className="md:row-span-2 bg-bg-surface border border-border-subtle rounded-xl overflow-hidden cursor-pointer hover:border-border-default hover:-translate-y-0.5 hover:shadow-lg transition-all group">
                    <div className="w-full aspect-video md:aspect-[16/10] relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop" alt="Borsa" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-accent-red-soft text-accent-red mb-2.5">
                            🔴 Son Dakika
                        </span>
                        <h3 className="text-[22px] font-semibold text-text-primary leading-tight mb-2 group-hover:text-accent-green transition-colors">
                            Merkez Bankası faiz kararını açıkladı: Piyasalar hareketlendi
                        </h3>
                        <p className="text-[13px] text-text-secondary leading-normal line-clamp-2 mb-3">
                            TCMB Para Politikası Kurulu, politika faizini 500 baz puan artırarak %50&apos;ye yükseltti. Karar sonrası dolar ve euro sert düştü.
                        </p>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                            <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg> 5 dk önce</span>
                            <span className="flex items-center gap-1"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg> 2.4K</span>
                        </div>
                    </div>
                </article>

                {/* Side Card 1 */}
                <article className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden cursor-pointer hover:border-border-default hover:-translate-y-0.5 hover:shadow-md transition-all group flex flex-col sm:flex-row md:flex-col">
                    <div className="w-full sm:w-1/3 md:w-full aspect-video relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop" alt="Kripto" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-accent-orange-soft text-accent-orange mb-2">
                            Kripto
                        </span>
                        <h3 className="text-[15px] font-semibold text-text-primary leading-snug mb-2 group-hover:text-accent-orange transition-colors">
                            Bitcoin 100.000 dolar sınırını test ediyor
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                            <span>32 dk önce</span>
                            <span>847 görüntülenme</span>
                        </div>
                    </div>
                </article>

                {/* Side Card 2 */}
                <article className="bg-bg-surface border border-border-subtle rounded-xl overflow-hidden cursor-pointer hover:border-border-default hover:-translate-y-0.5 hover:shadow-md transition-all group flex flex-col sm:flex-row md:flex-col">
                    <div className="w-full sm:w-1/3 md:w-full aspect-video relative overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=400&h=225&fit=crop" alt="Dolar" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 flex-1">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded bg-accent-blue-soft text-accent-blue mb-2">
                            Ekonomi
                        </span>
                        <h3 className="text-[15px] font-semibold text-text-primary leading-snug mb-2 group-hover:text-accent-blue transition-colors">
                            Enflasyon verileri beklentilerin altında geldi
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                            <span>1 saat önce</span>
                            <span>1.2K görüntülenme</span>
                        </div>
                    </div>
                </article>
            </div>

            {/* MORE NEWS HEADER */}
            <div className="flex items-center justify-between mt-2">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>
                    Piyasa Haberleri
                </h2>
            </div>

            {/* SMALL NEWS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { t: "BIST 100'de yükseliş devam ediyor: Bankacılık hisseleri lider", m: "2 saat önce • Borsa", img: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=160&h=120&fit=crop" },
                    { t: "Altın fiyatları tüm zamanların en yüksek seviyesinde", m: "3 saat önce • Emtia", img: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=160&h=120&fit=crop" },
                    { t: "Ethereum'da kritik güncelleme: Fiyat beklentileri", m: "4 saat önce • Kripto", img: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?w=160&h=120&fit=crop" },
                    { t: "FED toplantısı öncesi piyasalarda temkinli bekleyiş", m: "5 saat önce • Dünya", img: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=160&h=120&fit=crop" },
                    { t: "Konut kredisi faizlerinde yeni düzenleme yolda", m: "6 saat önce • Ekonomi", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=160&h=120&fit=crop" },
                    { t: "Solana'da %15 rally: Kurumsal ilgi artıyor", m: "7 saat önce • Kripto", img: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=160&h=120&fit=crop" }
                ].map((item, i) => (
                    <article key={i} className="bg-bg-surface border border-border-subtle rounded-lg p-3.5 flex gap-3 cursor-pointer hover:border-border-default hover:bg-bg-surface-hover transition-all">
                        <img src={item.img} alt="" className="w-20 h-15 rounded-md object-cover bg-bg-elevated shrink-0" />
                        <div className="min-w-0 flex-1">
                            <h4 className="text-[13px] font-semibold text-text-primary leading-snug line-clamp-2 mb-1.5 group-hover:text-accent-green">{item.t}</h4>
                            <div className="text-[11px] text-text-muted">{item.m}</div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
