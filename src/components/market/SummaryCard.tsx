import { AssetDetail, MarketTicker } from "@/types/market";

interface SummaryCardProps {
    title: string;
    data: AssetDetail | MarketTicker | undefined;
    icon: string;
}

export default function SummaryCard({ title, data, icon }: SummaryCardProps) {
    if (!data) return <div className="h-24 bg-white/5 rounded-xl animate-pulse"></div>;

    // Type Guard or loose check since both types have similar structure (price, changePercent, up/isUp)
    const isUp = 'up' in data ? data.up : (data as AssetDetail).isUp;

    return (
        <div className="bg-black/40 border border-white/5 rounded-xl p-4 hover:border-accent-blue/30 transition-all cursor-pointer group backdrop-blur-xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{title}</span>
                <span className="text-lg opacity-50 grayscale group-hover:grayscale-0 transition-all filter">{icon}</span>
            </div>
            <div className="flex items-end gap-2 relative z-10">
                <span className="text-xl font-black text-text-primary tracking-tight">{data.price}</span>
            </div>
            <div className={`text-xs font-bold mt-1 flex items-center gap-1 relative z-10 ${isUp ? 'text-accent-green' : 'text-accent-red'}`}>
                <span>{isUp ? '▲' : '▼'}</span>
                {data.changePercent}
            </div>
        </div>
    );
}
