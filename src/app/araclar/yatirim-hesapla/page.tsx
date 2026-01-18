import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InvestmentCalculator from "@/components/tools/InvestmentCalculator";

export const metadata = {
    title: 'Yatırım Hesaplama Araçları | Ekonomikoçu',
    description: 'Kâr/Zarar ve Bileşik Faiz hesaplama araçlarıyla yatırımlarınızı planlayın.',
};

export default function InvestmentCalculatorPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-20 flex flex-col items-center">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Yatırım Hesaplama Araçları</h1>
                    <p className="text-xl text-text-secondary">
                        Kâr/Zarar oranlarını hesaplayın veya bileşik getirinin gücünü keşfedin.
                    </p>
                </div>

                <InvestmentCalculator />
            </div>

            <Footer />
        </main>
    );
}
