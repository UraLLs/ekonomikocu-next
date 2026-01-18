import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: 'Kullanım Koşulları | Ekonomikoçu',
    description: 'Platform kullanım kuralları ve yasal uyarılar.',
};

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <h1 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">Kullanım Koşulları</h1>

                <div className="space-y-8 text-text-secondary leading-relaxed">

                    {/* YASAL UYARI */}
                    <section className="bg-accent-red/10 border border-accent-red/20 p-6 rounded-2xl">
                        <h2 className="text-lg font-bold text-accent-red mb-2 flex items-center gap-2">
                            ⚠️ Yasal Uyarı
                        </h2>
                        <p className="text-sm">
                            Ekonomikoçu platformunda yer alan hiçbir içerik, yorum, grafik veya analiz <strong>Yatırım Tavsiyesi Değildir</strong>.
                            Burada paylaşılanlar yalnızca bilgi ve eğitim amaçlıdır. Yatırım kararlarınızı kendi araştırmalarınız ve profesyonel
                            yatırım danışmanları eşliğinde almalısınız. Oluşabilecek zararlardan Ekonomikoçu sorumlu tutulamaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Kabul Edilen Şartlar</h2>
                        <p>
                            Bu siteye erişerek ve kullanarak, bu kullanım koşullarını kabul etmiş sayılırsınız.
                            Koşulları kabul etmiyorsanız, lütfen siteyi kullanmayınız.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. İçerik ve Telif Hakkı</h2>
                        <p>
                            Platformdaki tüm logolar, metinler ve grafikler Ekonomikoçu'nun mülkiyetindedir.
                            İzinsiz kopyalanamaz veya ticari amaçla kullanılamaz.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Kullanıcı Davranışları</h2>
                        <p>
                            Topluluk kurallarına aykırı, hakaret içeren, manipülatif veya yasa dışı içerik paylaşan hesaplar
                            uyarı yapılmaksızın askıya alınabilir veya silinebilir.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Değişiklik Hakkı</h2>
                        <p>
                            Ekonomikoçu, bu koşulları dilediği zaman güncelleme hakkını saklı tutar. Değişiklikler yayınlandığı tarihte yürürlüğe girer.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
