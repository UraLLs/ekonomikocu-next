import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CurrencyConverter from "@/components/tools/CurrencyConverter";
import { getCurrencyRates } from "@/services/marketService";

export const metadata = {
    title: 'Canlı Döviz Çevirici | Ekonomikoçu',
    description: 'Güncel kur verileriyle anlık döviz, altın ve kripto para çevirici.',
};

export default async function ConverterPage() {
    const rates = await getCurrencyRates();

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-20 flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Döviz Çevirici</h1>
                    <p className="text-xl text-text-secondary">
                        Tüm dünya para birimleri, kripto paralar ve emtialar arasında anlık çeviri yapın.
                    </p>
                </div>

                <div className="w-full max-w-md scale-110">
                    <CurrencyConverter initialRates={rates} />
                </div>

                <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="bg-bg-surface p-6 rounded-xl border border-white/5">
                        <div className="text-3xl mb-2">⚡</div>
                        <h3 className="font-bold text-white mb-1">Anlık Veri</h3>
                        <p className="text-sm text-text-muted">Piyasa verileri saniyelik güncellenir.</p>
                    </div>
                    <div className="bg-bg-surface p-6 rounded-xl border border-white/5">
                        <div className="text-3xl mb-2">🌍</div>
                        <h3 className="font-bold text-white mb-1">Evrensel</h3>
                        <p className="text-sm text-text-muted">Döviz, Altın ve Kripto bir arada.</p>
                    </div>
                    <div className="bg-bg-surface p-6 rounded-xl border border-white/5">
                        <div className="text-3xl mb-2">🔒</div>
                        <h3 className="font-bold text-white mb-1">Ücretsiz</h3>
                        <p className="text-sm text-text-muted">Tamamen ücretsiz ve sınırsız kullanım.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
