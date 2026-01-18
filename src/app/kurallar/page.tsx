import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function RulesPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <h1 className="text-3xl font-black text-white mb-6">Topluluk Kuralları</h1>
                <div className="space-y-6 text-text-secondary">
                    <p>Ekonomikoçu, saygılı ve yapıcı bir finans topluluğu olmayı hedefler.</p>

                    <div className="bg-bg-surface p-6 rounded-xl border border-white/5">
                        <h3 className="text-white font-bold mb-2">1. Saygı ve Nezaket</h3>
                        <p className="text-sm">Diğer kullanıcılara karşı hakaret, küfür veya aşağılayıcı dil kullanmak kesinlikle yasaktır.</p>
                    </div>

                    <div className="bg-bg-surface p-6 rounded-xl border border-white/5">
                        <h3 className="text-white font-bold mb-2">2. Manipülasyon Yasağı</h3>
                        <p className="text-sm">Piyasaları manipüle etmeye yönelik yalan haber veya yanıltıcı sinyal paylaşımı yasaktır (SPK mevzuatına uygunluk esastır).</p>
                    </div>

                    <div className="bg-bg-surface p-6 rounded-xl border border-white/5">
                        <h3 className="text-white font-bold mb-2">3. Reklam ve Spam</h3>
                        <p className="text-sm">İziniz ürün satışı, referans linki paylaşımı veya spam yapmak yasaktır.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
