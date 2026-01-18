import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { awardXP } from "@/actions/gamification"; // IMPORT 1
import UserBadge from "@/components/gamification/UserBadge"; // IMPORT 2

// Using same interface but mock data for now or props
// In a real app this would fetch async comments
interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
        username: string;
        avatar_url?: string;
        level?: number; // ADDED
    };
    // Supabase usually returns these, or we count them. For now optional
    likes?: number;
    replies?: number;
}

interface CommentFeedProps {
    symbol: string;
    initialComments: Comment[];
}

const getAvatarGradient = (username: string) => {
    const gradients = [
        "from-red-500 to-orange-500",
        "from-amber-500 to-yellow-500",
        "from-lime-500 to-green-500",
        "from-emerald-500 to-teal-500",
        "from-cyan-500 to-sky-500",
        "from-blue-500 to-indigo-500",
        "from-violet-500 to-purple-500",
        "from-fuchsia-500 to-pink-500",
        "from-rose-500 to-red-500"
    ];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
};

export default function CommentFeed({ symbol, initialComments }: CommentFeedProps) {
    const supabase = createClient();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState<{ id: string; user_metadata?: { username?: string; avatar_url?: string }; email?: string } | null>(null);
    const [userProfile, setUserProfile] = useState<{ username?: string; avatar_url?: string; level?: number; xp?: number } | null>(null); // ADDED
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                // Fetch extended profile data
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                setUserProfile(profile);
            }
        };
        fetchUser();
    }, []);

    const handlePostComment = async () => {
        if (!newComment.trim() || !user) return;
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    content: newComment,
                    symbol: symbol,
                    user_id: user.id
                })
                .select()
                .single();

            if (error) throw error;

            if (data) {
                // Award XP
                const xpResult = await awardXP(user.id, 'COMMENT');
                if (xpResult.success && xpResult.isLevelUp) {
                    // TODO: Toast notification for level up
                    console.log("LEVEL UP!", xpResult.newLevel);
                }

                // Manually construct the comment object with profile data since we have it locally
                // and want to avoid complex FK joins that might fail if schema isn't perfect
                const newCommentObj: Comment = {
                    ...data,
                    profiles: {
                        username: userProfile?.username || user.user_metadata?.username || user.email?.split('@')[0] || "Anonim",
                        avatar_url: userProfile?.avatar_url || user.user_metadata?.avatar_url,
                        level: xpResult.success ? xpResult.newLevel : (userProfile?.level || 1)
                    }
                };

                // Optimistic update
                setComments(prev => [newCommentObj, ...prev]);
                setNewComment("");

                // Update local profile state if XP changed
                if (xpResult.success) {
                    setUserProfile(prev => prev ? ({
                        ...prev,
                        xp: xpResult.newXP,
                        level: xpResult.newLevel
                    }) : null);
                }
            }
        } catch (error) {
            console.error("Error posting comment:", error);
            alert("Yorum gönderilirken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-h-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden">
            {/* Detailed Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 flex items-center justify-center text-accent-purple border border-white/10">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-100 text-lg tracking-tight">Yatırımcı Görüşleri</h2>
                        <p className="text-xs text-gray-500">Derinlemesine analiz ve tartışmalar</p>
                    </div>
                </div>
                {/* Button Removed */}
            </div>

            {/* Content - STRICT SCROLLING */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                {comments.map((comment) => (
                    <div key={comment.id} className="group">
                        <div className="flex gap-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0 pt-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white border border-white/10 shadow-lg bg-gradient-to-br ${getAvatarGradient(comment.profiles?.username || "?")}`}>
                                    {(comment.profiles?.username || "?")[0].toUpperCase()}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline justify-between mb-1">
                                    <div className="flex items-center gap-2 truncate">
                                        <span className="font-bold text-gray-200 text-sm group-hover:text-accent-blue transition-colors cursor-pointer truncate">
                                            @{comment.profiles?.username}
                                        </span>
                                        <UserBadge level={comment.profiles?.level || 1} />
                                    </div>
                                    <span className="text-[10px] text-gray-600 font-mono flex-shrink-0 ml-2">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl rounded-tl-none border border-white/5 hover:border-white/10 transition-colors break-words">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inline Input Area */}
            <div className="p-3 border-t border-white/5 bg-white/5 backdrop-blur-md">
                <div className="flex flex-col gap-2">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Yorum yaz..."
                        className="w-full bg-black/50 text-gray-200 text-sm rounded-xl border border-white/10 p-3 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all resize-none h-[60px] scrollbar-hide placeholder:text-gray-600"
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={handlePostComment}
                            disabled={!newComment.trim()}
                            className="px-4 py-2 rounded-lg bg-accent-blue text-white text-xs font-bold shadow-lg shadow-accent-blue/20 hover:bg-accent-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Gönder
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
