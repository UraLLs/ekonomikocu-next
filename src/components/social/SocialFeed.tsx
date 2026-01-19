import { getPosts } from '@/actions/posts';
import { createClient } from '@/utils/supabase/server';
import CreatePostForm from './CreatePostForm';
import PostFeed from './PostFeed';
import Link from 'next/link';

export default async function SocialFeed() {
    const supabase = await createClient();
    
    // Kullanici bilgisi
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

    // Postlari getir
    const posts = await getPosts(10);

    return (
        <section className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Topluluk
                </h2>
            </div>

            {/* Create Post Form */}
            {user ? (
                <CreatePostForm 
                    userAvatar={userProfile?.avatar_url}
                    username={userProfile?.username || user.email?.split('@')[0]}
                />
            ) : (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                    <p className="text-gray-400 mb-3">Paylasim yapmak icin giris yap</p>
                    <Link 
                        href="/giris"
                        className="inline-block px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-bold rounded-lg transition-colors"
                    >
                        Giris Yap
                    </Link>
                </div>
            )}

            {/* Post Feed */}
            <PostFeed posts={posts} currentUserId={user?.id} />
        </section>
    );
}
