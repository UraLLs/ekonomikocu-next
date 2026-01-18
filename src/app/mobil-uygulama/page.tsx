import ComingSoon from "@/components/ui/ComingSoon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

export default function MobileAppPage() {
    return (
        <main className="min-h-screen bg-bg-primary flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-accent-blue/10 rounded-3xl flex items-center justify-center mb-8 border border-accent-blue/20 shadow-lg shadow-accent-blue/10">
                    <DevicePhoneMobileIcon className="w-12 h-12 text-accent-blue" />
                </div>
                <ComingSoon title="Mobil Uygulama Geliyor" description="Cebinizdeki finans asistanı çok yakında App Store ve Google Play Store'da!" />

                <div className="flex gap-4 mt-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="h-12 w-36 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 cursor-not-allowed">
                        App Store
                    </div>
                    <div className="h-12 w-36 bg-white/10 rounded-lg flex items-center justify-center border border-white/5 cursor-not-allowed">
                        Google Play
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
