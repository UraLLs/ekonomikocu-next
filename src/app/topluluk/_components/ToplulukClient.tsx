'use client';

import { useState } from 'react';
import { Post, ForumCategory as ForumCategoryType } from '@/types/post';
import { User } from '@supabase/supabase-js';
import CreatePostForm from '@/components/social/CreatePostForm';
import ChatStyleFeed from '@/components/social/ChatStyleFeed';
import ForumTabs, { FORUM_CATEGORIES } from '@/components/social/ForumTabs';
import Link from 'next/link';

interface ToplulukClientProps {
    chatPosts: Post[];
    forumPosts: Post[];
    currentUser: User | null;
    userProfile: { username?: string; avatar_url?: string } | null;
}

export default function ToplulukClient({ chatPosts, forumPosts, currentUser, userProfile }: ToplulukClientProps) {
    const [activeCategory, setActiveCategory] = useState<ForumCategoryType>('genel');
    const [activeTab, setActiveTab] = useState<'chat' | 'forum'>('chat');

    // Filter forum posts by category
    const filteredForumPosts = forumPosts.filter(post => {
        if (activeCategory === 'genel') return !post.category || post.category === 'genel';
        return post.category === activeCategory;
    });

    return (
        <div className="space-y-6">
            {/* Tab Switch: Chat vs Forum */}
            <div className="flex bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 w-fit">
                <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'chat'
                            ? 'bg-accent-blue text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Canlı Sohbet
                    <span className="px-1.5 py-0.5 bg-white/20 text-white text-[10px] rounded-full">{chatPosts.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('forum')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'forum'
                            ? 'bg-accent-purple text-white shadow-lg'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Tartışma Alanları
                    <span className="px-1.5 py-0.5 bg-white/20 text-white text-[10px] rounded-full">{forumPosts.length}</span>
                </button>
            </div>

            {/* CHAT TAB */}
            {activeTab === 'chat' && (
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    {/* Chat Header */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-white">Canlı</span>
                            <span className="text-xs text-gray-400">• {chatPosts.length} mesaj</span>
                        </div>
                        <span className="text-xs text-gray-500">Son güncelleme: şimdi</span>
                    </div>

                    {/* Chat Messages */}
                    <div className="p-4">
                        <ChatStyleFeed posts={chatPosts} currentUserId={currentUser?.id} />
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-white/10 p-4 bg-white/5">
                        {currentUser ? (
                            <CreatePostForm
                                userAvatar={userProfile?.avatar_url}
                                username={userProfile?.username || currentUser.email?.split('@')[0]}
                                postType="chat"
                            />
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-400 text-sm mb-2">Mesaj göndermek için giriş yapın</p>
                                <Link
                                    href="/giris"
                                    className="inline-block px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-bold rounded-lg transition-colors"
                                >
                                    Giriş Yap
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* FORUM TAB */}
            {activeTab === 'forum' && (
                <div className="space-y-6">
                    {/* Category Tabs */}
                    <ForumTabs
                        activeCategory={activeCategory}
                        onCategoryChange={(id) => setActiveCategory(id as ForumCategoryType)}
                    />

                    {/* Category Description */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">
                                {FORUM_CATEGORIES.find(c => c.id === activeCategory)?.emoji}
                            </span>
                            <div>
                                <h3 className="text-white font-bold">
                                    {FORUM_CATEGORIES.find(c => c.id === activeCategory)?.name}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {FORUM_CATEGORIES.find(c => c.id === activeCategory)?.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Forum Posts */}
                    <div className="space-y-3">
                        {filteredForumPosts.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
                                <div className="text-4xl mb-3">📭</div>
                                <h3 className="text-white font-bold mb-1">Bu kategoride henüz tartışma yok</h3>
                                <p className="text-gray-400 text-sm">İlk tartışmayı başlat!</p>
                            </div>
                        ) : (
                            filteredForumPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all"
                                >
                                    {/* Mini post card for forum style */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm">
                                            {post.profiles?.username?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-white text-sm">
                                                    @{post.profiles?.username || 'anonim'}
                                                </span>
                                                {post.symbol && (
                                                    <span className="px-2 py-0.5 bg-accent-blue/20 text-accent-blue text-xs font-bold rounded">
                                                        ${post.symbol}
                                                    </span>
                                                )}
                                                {post.category && (
                                                    <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded">
                                                        {post.category}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-300 text-sm line-clamp-2">{post.content}</p>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    ❤️ {post.likes_count}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    💬 {post.comments_count}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Create Post for Forum */}
                    {currentUser && (
                        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <span>✍️</span> Yeni Tartışma Başlat ({FORUM_CATEGORIES.find(c => c.id === activeCategory)?.name})
                            </h4>
                            <CreatePostForm
                                userAvatar={userProfile?.avatar_url}
                                username={userProfile?.username || currentUser.email?.split('@')[0]}
                                postType="forum"
                                category={activeCategory}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
