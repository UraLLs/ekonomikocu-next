'use client';

import { useState } from 'react';
import { createPost } from '@/actions/posts';
import { useRouter } from 'next/navigation';

interface CreatePostFormProps {
    userAvatar?: string | null;
    username?: string;
}

export default function CreatePostForm({ userAvatar, username }: CreatePostFormProps) {
    const [content, setContent] = useState('');
    const [symbol, setSymbol] = useState('');
    const [sentiment, setSentiment] = useState<'BULL' | 'BEAR' | 'NEUTRAL' | ''>('');
    const [loading, setLoading] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const router = useRouter();

    const handleSubmit = async () => {
        if (!content.trim()) return;
        
        setLoading(true);
        try {
            const result = await createPost({
                content: content.trim(),
                symbol: symbol.trim().toUpperCase() || undefined,
                sentiment: sentiment || undefined,
            });

            if (result.success) {
                setContent('');
                setSymbol('');
                setSentiment('');
                setShowOptions(false);
                router.refresh();
            } else {
                alert(result.error || 'Bir hata olustu');
            }
        } catch (error) {
            console.error('Post error:', error);
            alert('Bir hata olustu');
        } finally {
            setLoading(false);
        }
    };

    const getInitial = () => {
        if (username) return username[0].toUpperCase();
        return '?';
    };

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
            <div className="flex gap-3">
                {/* Avatar */}
                <div className="shrink-0">
                    {userAvatar ? (
                        <img 
                            src={userAvatar} 
                            alt={username} 
                            className="w-10 h-10 rounded-full border border-white/10"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center text-white font-bold text-sm border border-white/10">
                            {getInitial()}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setShowOptions(true)}
                        placeholder="Piyasalar hakkinda ne dusunuyorsun?"
                        className="w-full bg-transparent text-white placeholder:text-gray-500 resize-none focus:outline-none text-[15px] leading-relaxed min-h-[60px]"
                        maxLength={500}
                    />

                    {/* Options */}
                    {showOptions && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                {/* Sembol */}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">Sembol:</span>
                                    <input
                                        type="text"
                                        value={symbol}
                                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                        placeholder="THYAO"
                                        className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white w-20 focus:outline-none focus:border-accent-blue"
                                        maxLength={10}
                                    />
                                </div>

                                {/* Sentiment */}
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setSentiment(sentiment === 'BULL' ? '' : 'BULL')}
                                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                                            sentiment === 'BULL'
                                                ? 'bg-accent-green text-white'
                                                : 'bg-white/5 text-gray-400 hover:bg-accent-green/20 hover:text-accent-green'
                                        }`}
                                    >
                                        YUKSELIS
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSentiment(sentiment === 'BEAR' ? '' : 'BEAR')}
                                        className={`px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                                            sentiment === 'BEAR'
                                                ? 'bg-accent-red text-white'
                                                : 'bg-white/5 text-gray-400 hover:bg-accent-red/20 hover:text-accent-red'
                                        }`}
                                    >
                                        DUSUS
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-gray-500">
                            {content.length}/500
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() || loading}
                            className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Gonderiliyor...' : 'Paylas'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
