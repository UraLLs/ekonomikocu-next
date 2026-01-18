import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function FeedbackPage() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <ComingSoon title="Geri Bildirim" description="Görüşleriniz bizim için değerli. Geri bildirim formu hazırlanıyor." />
            </div>
            <Footer />
        </main>
    );
}
