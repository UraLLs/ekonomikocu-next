import Image from "next/image";
import { type RankedUser } from "@/actions/leaderboard";

export default function PortfolioLeaderboard({ users }: { users: RankedUser[] }) {
    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5">
                        <tr>
                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider w-20 text-center">Sıra</th>
                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Yatırımcı</th>
                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Ünvan</th>
                            <th className="px-6 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Portföy Değeri</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users && users.length > 0 ? (
                            users.map((user, index) => {
                                const rank = index + 1;
                                let rankIcon = null;
                                let rankClass = "text-gray-400 font-bold font-mono";

                                if (rank === 1) {
                                    rankIcon = "👑";
                                    rankClass = "text-3xl filter drop-shadow-lg text-accent-gold";
                                } else if (rank === 2) {
                                    rankIcon = "🥈";
                                    rankClass = "text-2xl filter drop-shadow-lg";
                                } else if (rank === 3) {
                                    rankIcon = "🥉";
                                    rankClass = "text-2xl filter drop-shadow-lg";
                                }

                                return (
                                    <tr key={user.username} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4 text-center">
                                            <div className={`flex items-center justify-center ${rankClass}`}>
                                                {rankIcon || <span className="text-sm opacity-60">#{rank}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-800 border-2 border-white/10 group-hover:border-accent-green/50 transition-colors shadow-lg">
                                                    {user.avatar_url ? (
                                                        <Image
                                                            src={user.avatar_url}
                                                            alt={user.username}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-gray-500 bg-gray-800">
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-100 text-lg group-hover:text-accent-green transition-colors">
                                                        {user.username}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {user.full_name || 'Gizli Yatırımcı'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-xs text-gray-400 font-medium">
                                            {index === 0 ? 'Balina 🐳' : 'Yatırımcı'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="font-mono font-bold text-accent-green text-lg tracking-tight">
                                                ₺{user.portfolioValue?.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    Henüz portföy verisi oluşmadı. İlk sen ol!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
