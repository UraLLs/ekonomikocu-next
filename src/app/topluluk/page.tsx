import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPosts } from "@/actions/posts";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Metadata } from "next";
import ToplulukClient from "./_components/ToplulukClient";

export const metadata: Metadata = {
    title: "Topluluk - Ekonomikoçu",
    description: "Türkiye'nin en aktif yatırımcı topluluğu. Borsa, kripto ve döviz hakkında fikir paylaş, tartış.",
};

export const revalidate = 30;

export default async function ToplulukPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    let userProfile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();
        userProfile = data;
    }

    // Fetch chat and forum posts separately
    const [chatPosts, forumPosts] = await Promise.all([
        getPosts(50, 0, 'chat'),
        getPosts(50, 0, 'forum')
    ]);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
                {/* Page Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-[11px] font-medium text-text-muted mb-3 uppercase tracking-wider">
                        <Link href="/" className="hover:text-accent-blue transition-colors">Ana Sayfa</Link>
                        <span className="text-white/20">/</span>
                        <span className="text-gray-400">Topluluk</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                                Yatırımcı Topluluğu
                            </h1>
                            <p className="text-text-muted text-sm">
                                Canlı sohbet ve tartışma alanı
                            </p>
                        </div>
                        <Link
                            href="/liderlik"
                            className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent-gold/10 text-accent-gold text-sm font-bold rounded-xl hover:bg-accent-gold/20 transition-colors"
                        >
                            🏆 Liderlik Tablosu
                        </Link>
                    </div>
                </div>

                {/* Client Component for Interactive Parts */}
                <ToplulukClient
                    chatPosts={chatPosts}
                    forumPosts={forumPosts}
                    currentUser={user}
                    userProfile={userProfile}
                />
            </div>

            <Footer />
        </main>
    );
}
