import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AssetHeader from "@/components/asset-detail/AssetHeader";
import TradingViewChart from "@/components/asset-detail/TradingViewChart";
import WarRoom from "@/components/asset-detail/WarRoom";
import ActionPanel from "@/components/asset-detail/ActionPanel";
import NewsWidget from "@/components/asset-detail/NewsWidget";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";

export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }): Promise<Metadata> {
    const { symbol } = await params;
    const upperSymbol = symbol.toUpperCase();

    return {
        title: `${upperSymbol} Hisse Detay ve Yorumları | Ekonomikoçu`,
        description: `${upperSymbol} hissesi için canlı fiyat, grafik, teknik analiz ve yatırımcı yorumlarını inceleyin. Ekonomikoçu ile piyasanın nabzını tutun.`,
        openGraph: {
            title: `${upperSymbol} Canlı Fiyatı - Ekonomikoçu`,
            description: `${upperSymbol} teknik analizi ve uzman yorumları.`,
            siteName: 'Ekonomikoçu',
            locale: 'tr_TR',
            type: 'website',
        },
    };
}

import { getEconomyNews } from "@/services/newsService";

export default async function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const supabase = await createClient();

    // 1. Get Current User (Used implicitly by client components via auth but good to check session if needed)
    // const { data: { user } } = await supabase.auth.getUser();

    // 2. Fetch Data in Parallel
    const [news, { data: comments }] = await Promise.all([
        getEconomyNews(),
        supabase
            .from('comments')
            .select('*')
            .eq('symbol', symbol)
            .order('created_at', { ascending: false })
            .limit(20) // Limit initial load
    ]);

    // 3. Get Profiles for those comments
    let commentsWithProfiles: any[] = [];
    if (comments && comments.length > 0) {
        const userIds = Array.from(new Set(comments.map(c => c.user_id)));
        const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', userIds);

        const profileMap = (profiles || []).reduce((acc: any, profile: any) => {
            acc[profile.id] = profile;
            return acc;
        }, {});

        commentsWithProfiles = comments.map(c => ({
            ...c,
            profiles: profileMap[c.user_id]
        }));
    } else {
        // Fallback for demo if no real comments exist yet (User asked for real data, but if table is empty visually it looks broken, so keeping empty array is fine)
        commentsWithProfiles = [];
    }

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 pb-32">
                {/* Asset Header */}
                <AssetHeader symbol={symbol} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN (Chart & Analysis) - 70% */}
                    <div className="lg:col-span-8 space-y-6">
                        <TradingViewChart symbol={symbol} />

                        {/* War Room takes center stage as the main social/analysis hub */}
                        <WarRoom symbol={symbol} initialComments={commentsWithProfiles} />
                    </div>

                    {/* RIGHT COLUMN (Interaction) - 30% */}
                    <div className="lg:col-span-4 space-y-6">
                        <ActionPanel symbol={symbol} />
                        <NewsWidget news={news} />
                    </div>
                </div>

                <div className="h-24 w-full"></div>
            </div>

            <Footer />
        </main>
    );
}
