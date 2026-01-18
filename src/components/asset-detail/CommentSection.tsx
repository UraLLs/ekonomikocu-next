'use client'

import { useState } from "react";
// import { postComment } from "@/actions/social"; // REMOVED: Social actions are deprecated
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
        username: string;
        full_name: string;
        avatar_url: string;
    };
}

interface CommentSectionProps {
    symbol: string;
    currentUser: any; // User object if logged in
    comments: Comment[]; // Initial comments passed from server
}

export default function CommentSection({ symbol, currentUser, comments }: CommentSectionProps) {
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setIsSubmitting(true);
        setError(null);

        // TODO: Re-implement comment submission or remove entirely
        // const result = await postComment(symbol, content);
        const result = { success: false, message: "Yorum sistemi geçici olarak devre dışıdır." };

        if (result.success) {
            setContent(""); // Clear form
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-sm mt-6">
            <div className="p-6 border-b border-border-subtle">
                <h3 className="text-xl font-bold text-text-primary">Yorumlar ve Analizler</h3>
                <p className="text-sm text-text-secondary mt-1">{symbol} hakkında topluluk ne diyor?</p>
            </div>

            {/* Comment List */}
            <div className="divide-y divide-border-subtle max-h-[600px] overflow-y-auto">
                {comments.length === 0 ? (
                    <div className="p-8 text-center text-text-muted">
                        Henüz yorum yapılmamış. İlk yorumu sen yap!
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="p-6 hover:bg-bg-elevated/50 transition-colors">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center text-text-primary font-bold border border-border-subtle">
                                        {comment.profiles?.username?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <span className="font-bold text-text-primary mr-2">
                                                {comment.profiles?.username || 'Anonim Kullanıcı'}
                                            </span>
                                            <span className="text-xs text-text-muted">
                                                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Comment Form */}
            <div className="p-6 bg-bg-elevated border-t border-border-subtle">
                {currentUser ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {error && (
                            <div className="text-sm text-accent-red bg-accent-red/10 p-3 rounded">
                                {error}
                            </div>
                        )}
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={`${symbol} hakkında düşüncelerin neler?`}
                            className="w-full bg-bg-surface border border-border-subtle rounded-lg p-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue min-h-[100px] resize-y"
                            required
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || content.trim().length === 0}
                                className="px-6 py-2 bg-accent-blue hover:bg-accent-blue-hover text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Gönderiliyor...' : 'Yorum Yap'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="text-center p-4 bg-bg-surface rounded-lg border border-border-dashed border-border-subtle">
                        <p className="text-text-secondary mb-2">Yorum yapmak için giriş yapmalısın.</p>
                        <a href="/giris" className="text-accent-blue hover:underline font-medium">Giriş Yap</a>
                    </div>
                )}
            </div>
        </div>
    );
}
