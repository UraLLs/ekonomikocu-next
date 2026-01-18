
import { Twitter, Instagram, Youtube, Send } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black/80 backdrop-blur-xl border-t border-white/5 mt-auto relative overflow-hidden">
            {/* Ambient Footer Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-accent-blue/5 blur-[80px] pointer-events-none"></div>
            <div className="max-w-[1400px] mx-auto px-6">

                {/* MAIN FOOTER */}
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_2fr] lg:grid-cols-[1.5fr_2fr_1fr] gap-12 py-12 border-b border-border-subtle">

                    {/* Brand Column */}
                    <div>
                        <a href="#" className="flex items-center gap-2.5 text-decoration-none mb-4 group">
                            <div className="relative w-9 h-9 transition-transform group-hover:scale-105">
                                <img src="/logo.png" alt="Ekonomikoçu Logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="font-bold text-lg text-text-primary">
                                ekonomi<span className="text-accent-green">kocu</span>
                            </div>
                        </a>
                        <p className="text-sm text-text-secondary leading-relaxed mb-5">
                            Türkiye&apos;nin en kapsamlı finansal sosyal platformu. Piyasaları takip edin, analizler paylaşın, eğitimlerle gelişin.
                        </p>
                        <div className="flex gap-2">
                            <a href="#" className="w-9 h-9 bg-bg-secondary border border-border-subtle rounded-md flex items-center justify-center text-text-secondary hover:bg-accent-green hover:border-accent-green hover:text-white hover:-translate-y-0.5 transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-bg-secondary border border-border-subtle rounded-md flex items-center justify-center text-text-secondary hover:bg-accent-green hover:border-accent-green hover:text-white hover:-translate-y-0.5 transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-bg-secondary border border-border-subtle rounded-md flex items-center justify-center text-text-secondary hover:bg-accent-green hover:border-accent-green hover:text-white hover:-translate-y-0.5 transition-all">
                                <Youtube className="w-4 h-4" />
                            </a>
                            <a href="#" className="w-9 h-9 bg-bg-secondary border border-border-subtle rounded-md flex items-center justify-center text-text-secondary hover:bg-accent-green hover:border-accent-green hover:text-white hover:-translate-y-0.5 transition-all">
                                <Send className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div>
                            <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wide mb-4">Platform</h4>
                            <nav className="flex flex-col gap-1.5">
                                <a href="/" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Ana Sayfa</a>
                                <a href="/piyasa" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Piyasalar</a>
                                <a href="/canli" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Canlı Yayın</a>
                                <a href="/egitim" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Eğitimler</a>
                                <a href="/forum" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Forum</a>
                            </nav>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wide mb-4">Araçlar</h4>
                            <nav className="flex flex-col gap-1.5">
                                <a href="/araclar/doviz-cevirici" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Döviz Çevirici</a>
                                <a href="/araclar/yatirim-hesapla" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Yatırım Hesapla</a>
                                <a href="/araclar/portfoy-takibi" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Portföy Takibi</a>
                                <a href="/araclar/ekonomik-takvim" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Ekonomik Takvim</a>
                                <a href="/araclar/teknik-analiz" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Teknik Analiz</a>
                            </nav>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wide mb-4">Şirket</h4>
                            <nav className="flex flex-col gap-1.5">
                                <a href="/hakkimizda" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Hakkımızda</a>
                                <a href="/kariyer" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Kariyer</a>
                                <a href="/blog" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Blog</a>
                                <a href="/basin" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Basın</a>
                                <a href="/iletisim" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">İletişim</a>
                            </nav>
                        </div>
                        <div>
                            <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wide mb-4">Destek</h4>
                            <nav className="flex flex-col gap-1.5">
                                <a href="/yardim-merkezi" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Yardım Merkezi</a>
                                <a href="/sss" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">SSS</a>
                                <a href="/guvenlik" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Güvenlik</a>
                                <a href="/kurallar" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Kurallar</a>
                                <a href="/geri-bildirim" className="text-[13px] text-text-secondary hover:text-accent-green transition-colors">Geri Bildirim</a>
                            </nav>
                        </div>
                    </div>

                    {/* Mobile App Column */}
                    <div className="col-span-full lg:col-span-1 mt-6 lg:mt-0">
                        <h4 className="text-[13px] font-semibold text-text-primary uppercase tracking-wide mb-4">Mobil Uygulama</h4>
                        <div className="flex flex-row lg:flex-col gap-2.5">
                            <a href="/mobil-uygulama" className="flex items-center gap-2.5 px-3.5 py-2.5 bg-bg-secondary border border-border-subtle rounded-md hover:border-accent-green hover:bg-bg-surface-hover transition-all text-text-primary group">
                                <svg className="w-5 h-5 text-text-secondary group-hover:text-accent-green" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                                <div>
                                    <span className="block text-[10px] text-text-muted leading-tight">Mevcut</span>
                                    <strong className="block text-[13px] font-semibold">App Store</strong>
                                </div>
                            </a>
                            <a href="/mobil-uygulama" className="flex items-center gap-2.5 px-3.5 py-2.5 bg-bg-secondary border border-border-subtle rounded-md hover:border-accent-green hover:bg-bg-surface-hover transition-all text-text-primary group">
                                <svg className="w-5 h-5 text-text-secondary group-hover:text-accent-green" fill="currentColor" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" /></svg>
                                <div>
                                    <span className="block text-[10px] text-text-muted leading-tight">Mevcut</span>
                                    <strong className="block text-[13px] font-semibold">Google Play</strong>
                                </div>
                            </a>
                        </div>
                    </div>

                </div>

                {/* BOTTOM FOOTER */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 py-6 text-[12px] text-text-muted">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <p>© 2026 Ekonomikocu. Tüm hakları saklıdır.</p>
                        <div className="flex gap-4">
                            <a href="/gizlilik-politikasi" className="hover:text-accent-green transition-colors">Gizlilik</a>
                            <a href="/kullanim-kosullari" className="hover:text-accent-green transition-colors">Kullanım Koşulları</a>
                            <a href="/iletisim" className="hover:text-accent-green transition-colors">İletişim</a>
                        </div>
                    </div>
                    <div className="bg-accent-orange-soft text-text-muted px-3 py-2 rounded-md max-w-md text-center md:text-right text-[11px]">
                        ⚠️ Yatırım tavsiyesi değildir. Finansal kararlarınızı vermeden önce profesyonel danışmanlık alınız.
                    </div>
                </div>
            </div>
        </footer>
    );
}
