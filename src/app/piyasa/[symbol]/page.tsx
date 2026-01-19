import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AssetHeader from "@/components/asset-detail/AssetHeader";
import AssetMainSection from "@/components/asset-detail/AssetMainSection";
import WarRoom from "@/components/asset-detail/WarRoom";
import KeyStatistics from "@/components/asset-detail/KeyStatistics";
import ActionPanel from "@/components/asset-detail/ActionPanel";
import { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { getProfessionalNews } from "@/services/newsApiService";
import { getAssetDetail } from "@/services/marketService";

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

export default async function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const supabase = await createClient();

    // 0. Fetch Market Data & News (Parallel)
    // We use Promise.all for performance
    const [newsData, commentsData] = await Promise.all([
        getProfessionalNews(symbol),
        supabase
            .from('comments')
            .select('*')
            .eq('symbol', symbol)
            .order('created_at', { ascending: false })
            .limit(20)
    ]);

    // 1. Comments Processing (Existing Logic)
    const { data: comments } = commentsData;

    // 2. Get Profiles for those comments
    type EnrichedComment = {
        id: string;
        content: string;
        created_at: string;
        user_id: string;
        symbol: string | null;
        profiles?: { id: string; username: string; avatar_url?: string; level?: number };
    };

    let commentsWithProfiles: EnrichedComment[] = [];
    if (comments && comments.length > 0) {
        const userIds = Array.from(new Set(comments.map(c => c.user_id)));
        const { data: profiles } = await supabase
            .from('profiles')
            .select('*') // Select all to get avatar_url and level
            .in('id', userIds);

        interface Profile {
            id: string;
            username: string;
            avatar_url?: string;
            level?: number;
        }
        type ProfileMap = Record<string, Profile>;

        const profileMap = ((profiles as Profile[]) || []).reduce<ProfileMap>((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
        }, {});

        commentsWithProfiles = comments.map(c => ({
            ...c,
            profiles: profileMap[c.user_id]
        }));
    } else {
        commentsWithProfiles = [];
    }

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 pb-32">
                {/* 1. Header (Full Width) */}
                <AssetHeader symbol={symbol} />

                {/* 2. Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN (Tabs & Content) - 2/3 */}
                    <div className="lg:col-span-2">
                        <AssetMainSection symbol={symbol} news={newsData} />
                    </div>

                    {/* RIGHT COLUMN (Trading & Stats & Community) - 1/3 */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                        {/* Trading Panel */}
                        <ActionPanel symbol={symbol} />

                        {/* Key Statistics Table */}
                        <KeyStatistics symbol={symbol} />

                        {/* War Room (Chat) */}
                        <div className="h-[600px]">
                            <WarRoom symbol={symbol} initialComments={commentsWithProfiles} />
                        </div>
                    </div>
                </div>

                <div className="h-24 w-full"></div>
            </div>

            <Footer />
        </main>
    );
}
