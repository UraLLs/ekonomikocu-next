import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function CalendarPage() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <ComingSoon title="Ekonomik Takvim" description="Dünya piyasalarını etkileyen kritik verileri, beklentileri ve açıklamaları anlık takip edeceğiniz takvim hazırlanıyor." />
            </div>
            <Footer />
        </main>
    );
}
