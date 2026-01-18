import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LivePlayer from "@/components/live/LivePlayer";
import LiveChatWrapper from "@/components/live/LiveChatWrapper";
import Schedule from "@/components/live/Schedule";
import { getOrCreateGeneralRoom } from "@/actions/live";
import { createClient } from "@/utils/supabase/server";

export default async function LivePage() {
    // Server-side data fetching
    const room = await getOrCreateGeneralRoom();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-6 lg:p-8">
                {/* THEATER MODE LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-screen lg:min-h-[600px]">

                    {/* LEFT: PLAYER & INFO (3 Cols) */}
                    <div className="lg:col-span-3 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar pr-2">
                        {/* Player */}
                        <LivePlayer />

                        {/* Schedule (Below Player) */}
                        <div className="mt-4">
                            <Schedule />
                        </div>
                    </div>

                    {/* RIGHT: CHAT (1 Col) */}
                    <div className="lg:col-span-1 h-[600px] lg:h-full sticky top-0">
                        <LiveChatWrapper room={room} currentUser={user} />
                    </div>

                </div>
            </div>

            <Footer />
        </main>
    );
}
