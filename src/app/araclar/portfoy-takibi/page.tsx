import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PortfolioPage() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <ComingSoon title="Portföy Takibi" description="Tüm yatırımlarınızı tek ekranda, canlı verilerle takip edebileceğiniz gelişmiş portföy yönetim aracı hazırlanıyor." />
            </div>
            <Footer />
        </main>
    );
}
