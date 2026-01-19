'use client';

import { Post } from '@/types/post';
import PostCard from './PostCard';
import { useEffect, useRef } from 'react';

interface ChatStyleFeedProps {
    posts: Post[];
    currentUserId?: string | null;
}

export default function ChatStyleFeed({ posts, currentUserId }: ChatStyleFeedProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new posts (chat-like behavior)
    useEffect(() => {
        if (containerRef.current) {
            // Don't auto-scroll if user has scrolled up
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
            if (isNearBottom) {
                containerRef.current.scrollTop = containerRef.current.scrollHeight;
            }
        }
    }, [posts]);

    if (posts.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-bold text-white mb-2">Henüz mesaj yok</h3>
                <p className="text-gray-400 text-sm">İlk paylaşımı sen yap!</p>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            style={{ maxHeight: '500px' }}
        >
            {posts.map((post) => (
                <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))}
        </div>
    );
}
