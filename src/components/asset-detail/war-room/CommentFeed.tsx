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

export default function CommentFeed({ symbol, initialComments }: CommentFeedProps) {
    const supabase = createClient();
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null); // ADDED
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
                    setUserProfile((prev: any) => ({
                        ...prev,
                        xp: xpResult.newXP,
                        level: xpResult.newLevel
                    }));
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
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                {comments.map((comment) => (
                    <div key={comment.id} className="group">
                        <div className="flex gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm font-bold text-gray-300 border border-white/10 shadow-lg">
                                    {(comment.profiles?.username || "?")[0].toUpperCase()}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-200 text-sm group-hover:text-accent-blue transition-colors cursor-pointer">
                                            @{comment.profiles?.username}
                                        </span>
                                        {/* Badge logic */}
                                        <UserBadge level={comment.profiles?.level || 1} />
                                    </div>
                                    <span className="text-xs text-gray-600 font-mono">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: tr })}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-300 leading-relaxed bg-white/5 p-4 rounded-xl rounded-tl-none border border-white/5 hover:border-white/10 transition-colors">
                                    {comment.content}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-4 mt-2 pl-2">
                                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent-green transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                                        {comment.likes || 0}
                                    </button>
                                    <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent-blue transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                        {comment.replies || 0} Yanıt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Inline Input Area */}
            <div className="p-4 border-t border-white/5 bg-white/5 backdrop-blur-md">
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Bu hisse hakkında düşüncelerin nedir?"
                            className="w-full bg-black/50 text-gray-200 text-sm rounded-xl border border-white/10 p-3 pr-10 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/50 transition-all resize-none h-[50px] scrollbar-hide"
                        />
                    </div>
                    <button
                        onClick={handlePostComment}
                        disabled={!newComment.trim()}
                        className="h-[50px] px-6 rounded-xl bg-accent-blue text-white text-sm font-bold shadow-lg shadow-accent-blue/20 hover:bg-accent-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                    >
                        Gönder
                    </button>
                </div>
            </div>
        </div>
    );
}
