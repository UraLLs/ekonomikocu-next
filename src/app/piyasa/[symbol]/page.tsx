import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AssetHeader from "@/components/asset-detail/AssetHeader";
import TradingViewChart from "@/components/asset-detail/TradingViewChart";
import WarRoom from "@/components/asset-detail/WarRoom";
import SentimentGauge from "@/components/asset-detail/SentimentGauge";
import ActionPanel from "@/components/asset-detail/ActionPanel";

export default async function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
                {/* Asset Header */}
                <AssetHeader symbol={symbol} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN (Chart & Analysis) - 70% */}
                    <div className="lg:col-span-8 space-y-6">
                        <TradingViewChart symbol={symbol} />

                        {/* Analysis Tabs Stub */}
                        <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 min-h-[300px]">
                            <div className="flex gap-4 border-b border-border-default pb-2">
                                <button className="text-sm font-bold text-accent-green border-b-2 border-accent-green pb-2">Haberler</button>
                                <button className="text-sm font-medium text-text-secondary hover:text-text-primary pb-2">Finansallar</button>
                                <button className="text-sm font-medium text-text-secondary hover:text-text-primary pb-2">Teknik Analiz</button>
                                <button className="text-sm font-medium text-text-secondary hover:text-text-primary pb-2">Şirket Profili</button>
                            </div>
                            <div className="py-4 text-text-secondary text-sm">
                                {symbol.toUpperCase()} ile ilgili en son gelişmeler burada yer alacak. (Yakında)
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN (Interaction) - 30% */}
                    <div className="lg:col-span-4 space-y-6">
                        <ActionPanel symbol={symbol} />
                        <SentimentGauge />
                        <WarRoom symbol={symbol} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
