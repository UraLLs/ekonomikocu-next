import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function SecurityPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />
            <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <h1 className="text-3xl font-black text-white mb-6">Güvenlik Politikası</h1>
                <div className="space-y-4 text-text-secondary">
                    <p>Ekonomikoçu olarak kullanıcı verilerinin güvenliğini en üst seviyede tutuyoruz.</p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Tüm veri iletişimi SSL/TLS şifrelemesi ile korunmaktadır.</li>
                        <li>Kullanıcı şifreleri veritabanlarımızda hash'lenmiş (şifrelenmiş) olarak saklanır.</li>
                        <li>Düzenli güvenlik taramaları ve altyapı güncellemeleri yapılmaktadır.</li>
                        <li>İki faktörlü doğrulama (2FA) desteği yakında eklenecektir.</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </main>
    );
}
