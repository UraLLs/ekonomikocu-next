import { getAssetDetail } from "@/services/marketService";

export default async function AssetHeader({ symbol }: { symbol: string }) {
    const data = await getAssetDetail(symbol);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl mb-6 relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 blur-[100px] rounded-full group-hover:bg-accent-blue/10 transition-all duration-700"></div>

            <div className="flex items-center gap-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-3xl font-black text-gray-100 border border-white/10 shadow-lg backdrop-blur-md">
                    {symbol.substring(0, 1).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md flex items-center gap-3">
                        {symbol.toUpperCase()}
                        <span className="text-xs font-mono font-normal text-accent-green bg-accent-green/10 px-2 py-0.5 rounded border border-accent-green/20 uppercase tracking-widest">
                            BIST
                        </span>
                    </h1>
                    <span className="text-sm text-gray-400 font-medium tracking-wide uppercase">{data.name}</span>
                </div>
            </div>

            <div className="flex items-end flex-col relative z-10">
                <div className="text-5xl font-bold text-white tracking-tighter font-mono drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    {symbol.toUpperCase() === 'BTC' ? '$' : '₺'}{data.price}
                </div>
                <div className={`flex items-center gap-3 text-lg font-bold mt-1 ${data.isUp ? 'text-accent-green drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-accent-red drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}>
                    <span className="flex items-center">
                        {data.isUp ? '▲' : '▼'} {data.change}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-sm border ${data.isUp ? 'bg-accent-green/10 border-accent-green/30' : 'bg-accent-red/10 border-accent-red/30'}`}>
                        {data.changePercent}
                    </span>
                </div>
                <div className="text-[10px] text-gray-500 mt-2 flex items-center gap-1.5 font-mono uppercase tracking-widest bg-black/20 px-2 py-1 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
                    MARKET OPEN • REALTIME
                </div>
            </div>
        </div>
    );
}
