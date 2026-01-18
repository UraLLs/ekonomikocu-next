import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from "@heroicons/react/24/outline";

export const metadata = {
    title: 'İletişim | Ekonomikoçu',
    description: 'Bize ulaşın. Sorularınız, önerileriniz ve işbirlikleri için iletişim kanallarımız.',
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left: Info */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-4">Bize Ulaşın</h1>
                            <p className="text-text-secondary text-lg">
                                Bir sorunuz mu var veya işbirliği mi yapmak istiyorsunuz?
                                Aşağıdaki formu doldurun veya doğrudan bizimle iletişime geçin.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-surface border border-white/5">
                                <div className="p-3 bg-accent-blue/10 rounded-lg text-accent-blue">
                                    <EnvelopeIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">E-posta</h3>
                                    <p className="text-sm text-text-muted mb-1">Genel sorular ve destek için</p>
                                    <a href="mailto:info@ekonomikocu.com" className="text-accent-blue hover:underline">info@ekonomikocu.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-surface border border-white/5">
                                <div className="p-3 bg-accent-green/10 rounded-lg text-accent-green">
                                    <MapPinIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Ofis</h3>
                                    <p className="text-sm text-text-muted mb-1">Ziyaret etmek isterseniz (Randevu ile)</p>
                                    <p className="text-text-secondary">Maslak Mah. Büyükdere Cad. No:123<br />Sarıyer, İstanbul</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-surface border border-white/5">
                                <div className="p-3 bg-accent-orange/10 rounded-lg text-accent-orange">
                                    <PhoneIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Telefon</h3>
                                    <p className="text-sm text-text-muted mb-1">Hafta içi 09:00 - 18:00</p>
                                    <a href="tel:+902120000000" className="text-text-secondary hover:text-white transition-colors">+90 (212) 000 00 00</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-white/10 shadow-2xl">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">Adınız</label>
                                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-blue focus:outline-none transition-colors" placeholder="Adınız" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary">Soyadınız</label>
                                    <input type="text" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-blue focus:outline-none transition-colors" placeholder="Soyadınız" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">E-posta Adresi</label>
                                <input type="email" className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-blue focus:outline-none transition-colors" placeholder="ornek@email.com" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-secondary">Mesajınız</label>
                                <textarea rows={4} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-accent-blue focus:outline-none transition-colors resize-none" placeholder="Size nasıl yardımcı olabiliriz?" />
                            </div>

                            <button type="button" className="w-full bg-accent-blue hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent-blue/20">
                                Gönder
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
