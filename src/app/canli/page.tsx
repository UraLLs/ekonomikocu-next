import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LivePlayer from "@/components/live/LivePlayer";
import LiveChatWrapper from "@/components/live/LiveChatWrapper";
import Schedule from "@/components/live/Schedule";
import LiveSidebar from "@/components/live/LiveSidebar";
import { getOrCreateGeneralRoom } from "@/actions/live";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
    title: 'Canlı Yayınlar | Ekonomikoçu TV',
    description: 'Piyasa analizleri, kripto sinyalleri ve borsa eğitimi canlı yayınlarını kaçırmayın.',
};

export default async function LivePage() {
    // Server-side data fetching
    const room = await getOrCreateGeneralRoom();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col overflow-hidden">
            <Header />

            {/* MAIN CONTAINER: 3 COLUMNS */}
            <div className="flex-1 flex flex-col lg:flex-row max-w-[1920px] mx-auto w-full h-[calc(100vh-64px)]">

                {/* 1. LEFT SIDEBAR (Hidden on mobile) */}
                <div className="hidden lg:block shrink-0 h-full overflow-y-auto custom-scrollbar border-r border-white/5">
                    <LiveSidebar />
                </div>

                {/* 2. CENTER CONTENT (Player & Schedule) */}
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
                    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
                        {/* Player Section */}
                        <div className="w-full">
                            <LivePlayer />
                        </div>

                        {/* Recent/Schedule Section */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-12">
                            <Schedule />

                            {/* Promo / Banner (Placeholder for now, keeping balance) */}
                            <div className="bg-gradient-to-br from-accent-blue/20 to-transparent border border-accent-blue/20 rounded-2xl p-6 flex flex-col justify-center items-start overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
                                <h3 className="text-2xl font-black text-white mb-2">PRO Üyelik</h3>
                                <p className="text-gray-300 mb-6 max-w-md">Reklamsız izle, özel rozetler kazan ve sadece abonelere özel yayınlara katıl.</p>
                                <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-lg shadow-white/10">
                                    Hemen Katıl
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. RIGHT SIDEBAR (Chat) */}
                <div className="h-[600px] lg:h-full w-full lg:w-[350px] shrink-0 border-l border-white/5 bg-black/40 backdrop-blur-md">
                    <LiveChatWrapper room={room} currentUser={user} />
                </div>

            </div>
        </main>
    );
}
