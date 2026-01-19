'use client';

import { Post } from '@/types/post';
import { toggleLike, deletePost } from '@/actions/posts';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostCardProps {
    post: Post;
    currentUserId?: string | null;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
    const [isLiked, setIsLiked] = useState(post.is_liked || false);
    const [likesCount, setLikesCount] = useState(post.likes_count);
    const [isLiking, setIsLiking] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    const handleLike = async () => {
        if (!currentUserId) {
            router.push('/giris');
            return;
        }

        setIsLiking(true);
        // Optimistic update
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);

        const result = await toggleLike(post.id);
        
        if (!result.success) {
            // Revert on error
            setIsLiked(isLiked);
            setLikesCount(likesCount);
        }
        setIsLiking(false);
    };

    const handleDelete = async () => {
        if (!confirm('Bu gonderiyi silmek istediginize emin misiniz?')) return;
        
        const result = await deletePost(post.id);
        if (result.success) {
            router.refresh();
        } else {
            alert(result.error || 'Silme islemi basarisiz');
        }
    };

    const getTimeAgo = () => {
        try {
            return formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: tr });
        } catch {
            return 'Az once';
        }
    };

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

    const username = post.profiles?.username || 'Anonim';
    const avatarUrl = post.profiles?.avatar_url;
    const level = post.profiles?.level || 1;

    return (
        <article className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all group">
            <div className="flex gap-3">
                {/* Avatar */}
                <Link href={`/profil/${username}`} className="shrink-0">
                    {avatarUrl ? (
                        <img 
                            src={avatarUrl} 
                            alt={username} 
                            className="w-10 h-10 rounded-full border border-white/10 hover:border-accent-blue transition-colors"
                        />
                    ) : (
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(username)} flex items-center justify-center text-white font-bold text-sm border border-white/10`}>
                            {username[0].toUpperCase()}
                        </div>
                    )}
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                            <Link href={`/profil/${username}`} className="font-bold text-white hover:text-accent-blue transition-colors truncate">
                                @{username}
                            </Link>
                            <span className="px-1.5 py-0.5 bg-accent-purple/20 text-accent-purple text-[10px] font-bold rounded">
                                Lv{level}
                            </span>
                            <span className="text-gray-500 text-xs">
                                {getTimeAgo()}
                            </span>
                        </div>

                        {/* Menu (only for post owner) */}
                        {currentUserId === post.user_id && (
                            <div className="relative">
                                <button 
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="p-1 text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <circle cx="12" cy="5" r="2"/>
                                        <circle cx="12" cy="12" r="2"/>
                                        <circle cx="12" cy="19" r="2"/>
                                    </svg>
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 top-6 bg-bg-elevated border border-white/10 rounded-lg shadow-xl py-1 z-10 min-w-[100px]">
                                        <button 
                                            onClick={handleDelete}
                                            className="w-full px-3 py-2 text-left text-sm text-accent-red hover:bg-white/5 transition-colors"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Symbol & Sentiment Badge */}
                    {(post.symbol || post.sentiment) && (
                        <div className="flex items-center gap-2 mb-2">
                            {post.symbol && (
                                <Link 
                                    href={`/piyasa/${post.symbol}`}
                                    className="px-2 py-0.5 bg-accent-blue/20 text-accent-blue text-xs font-bold rounded hover:bg-accent-blue/30 transition-colors"
                                >
                                    ${post.symbol}
                                </Link>
                            )}
                            {post.sentiment && (
                                <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                                    post.sentiment === 'BULL' 
                                        ? 'bg-accent-green/20 text-accent-green' 
                                        : 'bg-accent-red/20 text-accent-red'
                                }`}>
                                    {post.sentiment === 'BULL' ? 'YUKSELIS' : 'DUSUS'}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Post Content */}
                    <p className="text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                        {post.content}
                    </p>

                    {/* Image (if exists) */}
                    {post.image_url && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-white/10">
                            <img 
                                src={post.image_url} 
                                alt="Post image" 
                                className="w-full max-h-[400px] object-cover"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-6 mt-3 pt-2">
                        {/* Like */}
                        <button 
                            onClick={handleLike}
                            disabled={isLiking}
                            className={`flex items-center gap-1.5 text-sm transition-colors ${
                                isLiked 
                                    ? 'text-accent-red' 
                                    : 'text-gray-500 hover:text-accent-red'
                            }`}
                        >
                            <svg className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{likesCount}</span>
                        </button>

                        {/* Comments */}
                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent-blue transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{post.comments_count}</span>
                        </button>

                        {/* Share */}
                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent-green transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
