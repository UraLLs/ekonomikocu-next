import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function SentimentGauge({ symbol }: { symbol?: string }) {
    const supabase = createClient();
    const [score, setScore] = useState(50);
    const [totalVotes, setTotalVotes] = useState(0);
    const [userVote, setUserVote] = useState<'BULL' | 'BEAR' | null>(null);
    const [loading, setLoading] = useState(false);

    // Fetch initial sentiment
    useEffect(() => {
        if (!symbol) return;
        const fetchSentiment = async () => {
            const { data } = await supabase
                .from('votes')
                .select('vote_type')
                .eq('symbol', symbol);

            if (data && data.length > 0) {
                const bulls = data.filter(v => v.vote_type === 'BULL').length;
                const total = data.length;
                setScore(Math.round((bulls / total) * 100));
                setTotalVotes(total);
            }
        };

        fetchSentiment();
    }, [symbol]);

    const handleVote = async (type: 'BULL' | 'BEAR') => {
        if (!symbol) return;
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return alert("Oy kullanmak için giriş yapmalısınız.");

            const { error } = await supabase
                .from('votes')
                .insert({
                    symbol,
                    user_id: user.id,
                    vote_type: type
                });

            if (error) throw error;

            setUserVote(type);
            // Re-calc locally for instant feedback
            const isBull = type === 'BULL';
            setScore(prev => {
                const currentBulls = (prev / 100) * totalVotes;
                const newBulls = isBull ? currentBulls + 1 : currentBulls;
                return Math.round((newBulls / (totalVotes + 1)) * 100);
            });
            setTotalVotes(prev => prev + 1);

        } catch (error) {
            console.error("Vote error:", error);
            alert("Daha önce oy kullanmış olabilirsiniz.");
        } finally {
            setLoading(false);
        }
    };

    const label = score > 60 ? "AÇGÖZLÜ" : score < 40 ? "KORKU" : "NÖTR";
    const rotation = (score / 100) * 180 - 90; // -90 to +90 degrees

    return (
        <div className="relative group overflow-hidden bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent-green/10 blur-[80px] rounded-full group-hover:bg-accent-green/20 transition-all duration-700"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h3 className="font-bold text-gray-100/90 text-sm flex items-center gap-2 uppercase tracking-wider">
                    <span className="text-lg">🧭</span> Piyasa Duygusu
                </h3>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono bg-white/5 px-2 py-1 rounded">Canlı Veri</span>
            </div>

            <div className="flex flex-col items-center relative z-10">
                {/* Gauge Container */}
                <div className="relative w-48 h-24 overflow-hidden mb-4">
                    {/* Gauge Arch Background */}
                    <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-white/5 box-border"></div>

                    {/* Gauge Gradient Arch (Simulated with conic gradient masking or just colored borders for now to be safe/simple) */}
                    <div
                        className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-accent-red border-r-accent-orange border-b-accent-green border-l-accent-green rotate-45 opacity-20 blur-sm"
                    ></div>
                    <div
                        className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-transparent border-t-accent-red/80 border-r-accent-orange/80 border-b-accent-green/80 border-l-accent-green/80 rotate-45"
                        style={{ maskImage: 'linear-gradient(to bottom, black 50%, transparent 50%)' }}
                    ></div>

                    {/* Needle */}
                    <div
                        className="absolute bottom-0 left-1/2 w-1.5 h-[90%] bg-gradient-to-t from-white to-transparent origin-bottom transition-transform duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20"
                        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
                    >
                        <div className="w-4 h-4 bg-white rounded-full absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <div className="text-4xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-1 tracking-tight font-mono">
                        {score}
                    </div>
                    <div className="text-xs font-bold text-accent-green uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                        {label}
                    </div>
                </div>
            </div>

            {/* Voting Buttons */}
            <div className="mt-6 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleVote('BULL')}
                    disabled={!!userVote || loading}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all ${userVote === 'BULL' ? 'bg-accent-green text-white border-accent-green' : 'bg-black/20 border-white/5 hover:bg-accent-green/10 hover:border-accent-green/30 text-gray-400'}`}
                >
                    <span className="text-lg mb-1">🚀</span>
                    <span className="text-[10px] font-bold uppercase">Yükseliş</span>
                </button>
                <button
                    onClick={() => handleVote('BEAR')}
                    disabled={!!userVote || loading}
                    className={`p-2 rounded-lg border flex flex-col items-center justify-center transition-all ${userVote === 'BEAR' ? 'bg-accent-red text-white border-accent-red' : 'bg-black/20 border-white/5 hover:bg-accent-red/10 hover:border-accent-red/30 text-gray-400'}`}
                >
                    <span className="text-lg mb-1">🐻</span>
                    <span className="text-[10px] font-bold uppercase">Düşüş</span>
                </button>
            </div>
        </div>
    );
}
