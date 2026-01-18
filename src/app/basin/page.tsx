import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function PressPage() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center p-6">
                <ComingSoon title="Basın Odası" description="Basın bültenleri ve medya kiti yakında burada olacak." />
            </div>
            <Footer />
        </main>
    );
}
