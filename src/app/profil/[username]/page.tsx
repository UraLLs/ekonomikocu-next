import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FollowButton from '@/components/social/FollowButton';
import PostCard from '@/components/social/PostCard';
import { getUserProfile, getUserPosts, checkFollowStatus } from '@/actions/follows';
import Link from 'next/link';

interface Props {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { username } = await params;
    return {
        title: `@${username} - Ekonomikocu`,
        description: `${username} kullanicisinin profil sayfasi`,
    };
}

export default async function UserProfilePage({ params }: Props) {
    const { username } = await params;
    const supabase = await createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    // Get profile by username
    const profile = await getUserProfile(username);
    
    if (!profile) {
        notFound();
    }
    
    // Check if current user is following this user
    const isFollowing = user ? await checkFollowStatus(profile.id) : false;
    
    // Get user's posts
    const posts = await getUserPosts(profile.id, 20);
    
    // Check if viewing own profile
    const isOwnProfile = user?.id === profile.id;
    
    const getAvatarGradient = (name: string) => {
        const gradients = [
            "from-red-500 to-orange-500",
            "from-amber-500 to-yellow-500",
            "from-lime-500 to-green-500",
            "from-emerald-500 to-teal-500",
            "from-cyan-500 to-sky-500",
            "from-blue-500 to-indigo-500",
            "from-violet-500 to-purple-500",
            "from-fuchsia-500 to-pink-500",
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return gradients[Math.abs(hash) % gradients.length];
    };

    const getLevelTitle = (level: number) => {
        if (level >= 50) return 'Efsane';
        if (level >= 30) return 'Usta';
        if (level >= 20) return 'Uzman';
        if (level >= 10) return 'Deneyimli';
        if (level >= 5) return 'Ogrenci';
        return 'Cirak';
    };

    const xpForNextLevel = (level: number) => level * 100;
    const xpProgress = profile.xp % 100;
    const xpNeeded = xpForNextLevel(profile.level);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-4xl mx-auto p-4 md:p-8">
                {/* Profile Header */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar */}
                        <div className="relative">
                            {profile.avatar_url ? (
                                <img 
                                    src={profile.avatar_url} 
                                    alt={profile.username} 
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-accent-purple/50 object-cover"
                                />
                            ) : (
                                <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${getAvatarGradient(profile.username)} flex items-center justify-center text-white font-bold text-4xl md:text-5xl border-4 border-white/20`}>
                                    {profile.username[0].toUpperCase()}
                                </div>
                            )}
                            {/* Level Badge */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent-purple text-white text-xs font-bold rounded-full shadow-lg">
                                Lv{profile.level}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    @{profile.username}
                                </h1>
                                <span className="px-3 py-1 bg-accent-purple/20 text-accent-purple text-sm font-bold rounded-lg w-fit">
                                    {getLevelTitle(profile.level)}
                                </span>
                            </div>

                            {profile.bio && (
                                <p className="text-gray-400 mb-4 max-w-lg">
                                    {profile.bio}
                                </p>
                            )}

                            {/* Stats */}
                            <div className="flex items-center gap-6 mb-4">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-white">{posts.length}</div>
                                    <div className="text-xs text-gray-500">Gonderi</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-white">{profile.followers_count}</div>
                                    <div className="text-xs text-gray-500">Takipci</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-white">{profile.following_count}</div>
                                    <div className="text-xs text-gray-500">Takip</div>
                                </div>
                            </div>

                            {/* XP Progress */}
                            <div className="max-w-xs">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>XP</span>
                                    <span>{profile.xp} / {xpNeeded}</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-accent-purple to-accent-blue rounded-full transition-all"
                                        style={{ width: `${Math.min((xpProgress / xpNeeded) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            {isOwnProfile ? (
                                <Link 
                                    href="/profil/duzenle"
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                    Duzenle
                                </Link>
                            ) : (
                                <FollowButton 
                                    targetUserId={profile.id}
                                    isFollowing={isFollowing}
                                    currentUserId={user?.id}
                                    size="lg"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Member Since */}
                <div className="text-center text-gray-500 text-sm mb-6">
                    {new Date(profile.created_at).toLocaleDateString('tr-TR', { 
                        year: 'numeric', 
                        month: 'long' 
                    })} tarihinden beri uye
                </div>

                {/* Posts Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        Gonderiler
                    </h2>

                    {posts.length === 0 ? (
                        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
                            <div className="text-gray-500 mb-2">Henuz gonderi yok</div>
                            {isOwnProfile && (
                                <Link 
                                    href="/"
                                    className="text-accent-blue hover:underline text-sm"
                                >
                                    Ilk gonderini paylas
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <PostCard 
                                    key={post.id} 
                                    post={post} 
                                    currentUserId={user?.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
