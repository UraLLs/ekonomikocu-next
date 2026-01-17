'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface Comment {
    id: string;
    content: string;
    created_at: string;
    symbol: string;
    user_id: string;
    profiles?: {
        username: string;
        avatar_url?: string;
    };
}

interface HomeFeedProps {
    comments: Comment[];
}

export default function HomeFeed({ comments }: HomeFeedProps) {
    if (!comments || comments.length === 0) {
        return (
            <div className="bg-bg-surface border border-border-subtle rounded-xl p-6 text-center text-text-secondary">
                Henüz tartışma yok. İlk yorumu sen yap!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                    <span className="text-2xl">💬</span> Piyasa Gündemi
                </h2>
                <Link href="/piyasa" className="text-sm text-accent-green hover:underline">
                    Tümünü Gör
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {comments.map((comment) => (
                    <Link
                        href={`/piyasa/${comment.symbol}`}
                        key={comment.id}
                        className="block bg-bg-surface border border-border-subtle rounded-xl p-4 hover:border-accent-green/50 hover:shadow-lg hover:shadow-accent-green/5 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                {comment.profiles?.avatar_url ? (
                                    <img
                                        src={comment.profiles.avatar_url}
                                        alt={comment.profiles.username}
                                        className="w-10 h-10 rounded-full object-cover border border-border-default"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-text-secondary font-bold border border-border-default">
                                        {comment.profiles?.username?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-text-primary text-sm">
                                            {comment.profiles?.username || 'Anonim'}
                                        </span>
                                        <span className="text-xs text-text-muted">•</span>
                                        <span className="text-xs text-text-muted">
                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                    <span className="px-2 py-0.5 bg-bg-elevated rounded text-xs font-bold text-text-primary group-hover:text-accent-green transition-colors border border-border-subtle">
                                        {comment.symbol}
                                    </span>
                                </div>

                                <p className="text-text-secondary text-sm line-clamp-2 group-hover:text-text-primary transition-colors">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
