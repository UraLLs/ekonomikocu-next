import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function TA_Page() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <ComingSoon title="Teknik Analiz" description="Tarayıcı üzerinde gelişmiş grafik araçları, indikatörler ve çizim modülleri hazırlanıyor." />
            </div>
            <Footer />
        </main>
    );
}
