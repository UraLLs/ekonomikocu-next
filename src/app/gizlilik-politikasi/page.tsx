import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: 'Gizlilik Politikası | Ekonomikoçu',
    description: 'Verilerinizi nasıl topluyor, saklıyor ve koruyoruz.',
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <h1 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">Gizlilik Politikası</h1>

                <div className="space-y-8 text-text-secondary leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Veri Toplama</h2>
                        <p>
                            Ekonomikoçu olarak, hizmetlerimizi sunabilmek için belirli kişisel verilerinizi topluyoruz.
                            Bu veriler; kayıt olurken verdiğiniz isim, e-posta adresi ve platform üzerindeki etkileşimlerinizi kapsar.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Veri Kullanımı</h2>
                        <p>
                            Toplanan veriler, size daha iyi bir deneyim sunmak, içerikleri kişiselleştirmek ve platform güvenliğini sağlamak amacıyla kullanılır.
                            Verileriniz üçüncü taraflarla ticari amaçlarla paylaşılmaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Çerezler (Cookies)</h2>
                        <p>
                            Sitemizde kullanıcı deneyimini iyileştirmek ve trafik analizi yapmak için çerezler kullanmaktayız.
                            Tarayıcı ayarlarınızdan çerez tercihlerini değiştirebilirsiniz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Güvenlik</h2>
                        <p>
                            Verilerinizin güvenliği bizim için önceliklidir. Endüstri standardı şifreleme yöntemleri ile verilerinizi koruyor
                            ancak internet üzerinden veri iletiminin %100 güvenli olacağının garantisini veremiyoruz.
                        </p>
                    </section>

                    <div className="bg-bg-surface p-4 rounded-xl border border-white/10 text-sm">
                        <p className="text-text-muted">
                            Bu politika en son <strong>18 Ocak 2026</strong> tarihinde güncellenmiştir. Sorularınız için
                            <a href="/iletisim" className="text-accent-blue hover:underline ml-1">bizimle iletişime geçin.</a>
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
