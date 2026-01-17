import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AssetHeader from "@/components/asset-detail/AssetHeader";
import TradingViewChart from "@/components/asset-detail/TradingViewChart";
import WarRoom from "@/components/asset-detail/WarRoom";
import SentimentGauge from "@/components/asset-detail/SentimentGauge";
import ActionPanel from "@/components/asset-detail/ActionPanel";
import { Metadata } from "next";

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

import { createClient } from "@/utils/supabase/server";
import CommentSection from "@/components/asset-detail/CommentSection";

export default async function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const supabase = await createClient();

    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Get Comments
    const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .eq('symbol', symbol)
        .order('created_at', { ascending: false });

    // 3. Get Profiles for those comments
    let commentsWithProfiles = [];
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
    }

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8">
                {/* Asset Header */}
                <AssetHeader symbol={symbol} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* LEFT COLUMN (Chart & Analysis) - 70% */}
                    <div className="lg:col-span-8 space-y-6">
                        <TradingViewChart symbol={symbol} />

                        {/* Analysis Tabs Stub (Moved logic here or kept separate) */}
                        {/* We insert CommentSection here */}
                        <CommentSection
                            symbol={symbol}
                            currentUser={user}
                            comments={commentsWithProfiles}
                        />
                    </div>

                    {/* RIGHT COLUMN (Interaction) - 30% */}
                    <div className="lg:col-span-4 space-y-6">
                        <ActionPanel symbol={symbol} />
                        <SentimentGauge />
                        <WarRoom symbol={symbol} />
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
