import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: 'Sıkça Sorulan Sorular | Ekonomikoçu',
    description: 'Platform hakkında en çok merak edilen soruların cevapları.',
};

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-20">
                <h1 className="text-3xl font-black text-white mb-8 text-center">Sıkça Sorulan Sorular</h1>

                <div className="space-y-6">
                    <FAQItem
                        q="Ekonomikoçu ücretli mi?"
                        a="Hayır, Ekonomikoçu'nun temel özellikleri (piyasa verileri, haberler, forum vb.) tamamen ücretsizdir. İleride profesyonel yatırımcılar için PRO özellikler gelebilir."
                    />
                    <FAQItem
                        q="Borsa verileri anlık mı?"
                        a="Döviz, Kripto ve Emtia verilerimiz global sağlayıcılardan anlık (real-time) olarak çekilmektedir. BIST verileri yasal düzenlemeler gereği 15 dakika gecikmeli olabilir."
                    />
                    <FAQItem
                        q="Nasıl yayıncı olabilirim?"
                        a="Canlı yayın özelliğimiz şu an davetiye usulü çalışmaktadır. Finansal uzmanlığınız varsa iletişim sayfasından başvuruda bulunabilirsiniz."
                    />
                    <FAQItem
                        q="Mobil uygulamanız var mı?"
                        a="Mobil uygulamamız şu an geliştirme aşamasındadır. Çok yakında App Store ve Google Play'de yerimizi alacağız."
                    />
                    <FAQItem
                        q="Kendi analizlerimi paylaşabilir miyim?"
                        a="Evet, sosyal akış (feed) üzerinden grafiklerinizi ve piyasa yorumlarınızı tüm toplulukla paylaşabilirsiniz."
                    />
                </div>
            </div>

            <Footer />
        </main>
    );
}

function FAQItem({ q, a }: { q: string, a: string }) {
    return (
        <div className="bg-bg-surface border border-white/5 rounded-xl p-6 hover:border-brand-primary/30 transition-colors">
            <h3 className="text-lg font-bold text-white mb-2">{q}</h3>
            <p className="text-text-secondary text-sm leading-relaxed">{a}</p>
        </div>
    )
}
