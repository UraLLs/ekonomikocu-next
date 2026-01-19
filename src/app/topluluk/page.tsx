import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { getPosts } from "@/actions/posts";
import { createClient } from "@/utils/supabase/server";
import CreatePostForm from "@/components/social/CreatePostForm";
import PostFeed from "@/components/social/PostFeed";
import { getCurrencyRates } from "@/services/marketService";
import Link from "next/link";
import { Metadata } from "next";

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

    const [posts, rates] = await Promise.all([
        getPosts(50),
        getCurrencyRates()
    ]);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
                <div className="flex flex-col xl:flex-row gap-8">

                    {/* MAIN CONTENT */}
                    <div className="flex-1 min-w-0">
                        {/* Page Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-[11px] font-medium text-text-muted mb-3 uppercase tracking-wider">
                                <Link href="/" className="hover:text-accent-blue transition-colors">Ana Sayfa</Link>
                                <span className="text-white/20">/</span>
                                <span className="text-gray-400">Topluluk</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
                                Yatırımcı Topluluğu
                            </h1>
                            <p className="text-text-muted text-sm">
                                Piyasalar hakkında fikirlerini paylaş, diğer yatırımcılarla tartış.
                            </p>
                        </div>

                        {/* Create Post */}
                        {user ? (
                            <div className="mb-6">
                                <CreatePostForm
                                    userAvatar={userProfile?.avatar_url}
                                    username={userProfile?.username || user.email?.split('@')[0]}
                                />
                            </div>
                        ) : (
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center mb-6">
                                <p className="text-gray-400 mb-3">Topluluga katılmak için giriş yap</p>
                                <Link
                                    href="/giris"
                                    className="inline-block px-6 py-2.5 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-bold rounded-xl transition-colors"
                                >
                                    Giriş Yap
                                </Link>
                            </div>
                        )}

                        {/* Feed */}
                        <PostFeed posts={posts} currentUserId={user?.id} />

                        {posts.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💬</div>
                                <h2 className="text-xl font-bold text-white mb-2">Henüz paylaşım yok</h2>
                                <p className="text-text-muted">İlk paylaşımı sen yap!</p>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <Sidebar rates={rates} />

                </div>
            </div>

            <Footer />
        </main>
    );
}
