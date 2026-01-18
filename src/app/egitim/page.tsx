import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EducationCatalog from "@/components/education/EducationCatalog";
import EducationSidebar from "@/components/education/EducationSidebar";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
    title: 'Finansal Eğitim Merkezi | Ekonomikoçu',
    description: 'Borsa, teknik analiz ve finansal okuryazarlık eğitimleri ile yatırımlarınıza değer katın.',
};

export default async function EducationPage() {
    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full">
                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                    <EducationCatalog />
                </div>

                {/* Specific Education Sidebar */}
                <div className="hidden lg:block shrink-0">
                    <EducationSidebar />
                </div>
            </div>
            <Footer />
        </main>
    );
}
