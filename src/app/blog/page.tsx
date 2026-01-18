import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <ComingSoon title="Blog" description="Finans dünyasından makaleler, uzman görüşleri ve eğitim içerikleri yakında yayında." />
            </div>
            <Footer />
        </main>
    );
}
