import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: 'Hakkımızda | Ekonomikoçu',
    description: 'Türkiye\'nin yeni nesil finansal sosyal medya platformu Ekonomikoçu hakkında bilgi edinin.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/10 to-transparent pointer-events-none" />
                    <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                            Finansın <span className="text-accent-green">Sosyal Hali</span>
                        </h1>
                        <p className="text-xl text-text-secondary leading-relaxed">
                            Ekonomikoçu, yatırımcıları, analistleri ve finans meraklılarını bir araya getiren,
                            bilginin özgürce paylaşıldığı yeni nesil bir ekosistemdir.
                        </p>
                    </div>
                </section>

                {/* Content Section */}
                <section className="max-w-3xl mx-auto px-6 pb-24 space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Vizyonumuz</h2>
                        <p className="text-text-secondary leading-relaxed">
                            Türkiye'de finansal okuryazarlığı tabana yaymak ve yatırım yapmayı korkulan bir eylem olmaktan çıkarıp,
                            bilinçli bir tercihe dönüştürmek. Karmaşık piyasa verilerini anlaşılır hale getiriyor,
                            doğru bilgiye erişimi demokratikleştiriyoruz.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-bg-surface p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-accent-blue mb-2">Şeffaflık</h3>
                            <p className="text-sm text-text-muted">
                                Veriye dayalı analizleri ve objektif yorumları önceliklendiriyoruz. Manipülasyona kapalı,
                                dürüst bir tartışma ortamı sağlıyoruz.
                            </p>
                        </div>
                        <div className="bg-bg-surface p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-accent-green mb-2">Topluluk</h3>
                            <p className="text-sm text-text-muted">
                                Birlikte öğrenen ve kazanan bir topluluğuz. Her seviyeden yatırımcının birbirine
                                destek olduğu, kapsayıcı bir platformuz.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Neden Biz?</h2>
                        <ul className="space-y-3 list-disc list-inside text-text-secondary">
                            <li>Anlık piyasa verileri ve profesyonel grafikler.</li>
                            <li>Doğrulanmış uzman analistler ve eğitmenler.</li>
                            <li>Kullanıcı dostu arayüz ve mobil uyumlu deneyim.</li>
                            <li>Yatırımcı psikolojisi ve strateji odaklı eğitimler.</li>
                        </ul>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
