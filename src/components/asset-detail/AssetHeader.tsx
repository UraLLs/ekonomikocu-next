import { getAssetDetail } from "@/services/marketService";

export default async function AssetHeader({ symbol }: { symbol: string }) {
    const data = await getAssetDetail(symbol);

    const isCrypto = ['BTC', 'ETH', 'SOL', 'AVAX', 'XRP', 'DOGE', 'USDT'].includes(symbol.toUpperCase()) || symbol.toUpperCase().endsWith('USDT');
    const isForex = ['USD', 'EUR', 'GOLD', 'ALTIN', 'GA'].includes(symbol.toUpperCase());

    let marketType = 'BIST';
    let marketColorClass = 'text-accent-green bg-accent-green/10 border-accent-green/20';

    if (isCrypto) {
        marketType = 'CRYPTO';
        marketColorClass = 'text-accent-orange bg-accent-orange/10 border-accent-orange/20';
    } else if (isForex) {
        marketType = 'FOREX';
        marketColorClass = 'text-accent-yellow bg-accent-yellow/10 border-accent-yellow/20';
    }

    // --- Market Status Logic ---
    const now = new Date();
    // TR Timezone adjustment (UTC+3)
    const trTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
    const day = trTime.getDay(); // 0=Sun, 6=Sat
    const hour = trTime.getHours();
    const minute = trTime.getMinutes();

    let isMarketOpen = false;
    let marketStatusText = 'Piyasa Kapalı';

    if (isCrypto || isForex) {
        isMarketOpen = true;
        marketStatusText = 'Piyasa Açık • 7/24';
    } else {
        // BIST Logic (Simple: Mon-Fri, 10:00 - 18:00)
        // Ignoring official holidays for MVP simplicity
        const isWeekday = day >= 1 && day <= 5;
        const isTimeOpen = (hour > 9 && hour < 18) || (hour === 18 && minute < 10); // Until 18:10 technically

        if (isWeekday && isTimeOpen) {
            isMarketOpen = true;
            marketStatusText = 'Piyasa Açık';
        } else {
            marketStatusText = 'Piyasa Kapalı';
        }
    }

    return (
        <div className="flex flex-col gap-1 mb-6 border-b border-border-subtle pb-6">
            {/* Top Line: Company • Exchange */}
            <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                <h1 className="text-xl font-bold text-text-primary tracking-tight">
                    {data.name}
                </h1>
                <span className="w-1 h-1 rounded-full bg-text-muted"></span>
                <span className="font-mono text-text-muted">{marketType}</span>
                <span className="w-1 h-1 rounded-full bg-text-muted"></span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border tracking-wider ${marketColorClass}`}>
                    {symbol.toUpperCase()}
                </span>
            </div>

            {/* Second Line: BIG Price */}
            <div className="flex items-baseline gap-4 mt-1">
                <div className="text-6xl font-normal tracking-tighter text-text-primary">
                    <span className="text-3xl align-top mr-1 font-light text-text-muted">{symbol.toUpperCase() === 'BTC' ? '$' : '₺'}</span>
                    {data.price}
                </div>
            </div>

            {/* Third Line: Change & Time */}
            <div className="flex items-center gap-3 mt-2">
                <div className={`flex items-center gap-2 text-xl font-medium ${data.isUp ? 'text-accent-green' : 'text-accent-red'}`}>
                    {data.isUp ? '+' : ''}{data.change}
                    <span className="text-lg">({data.changePercent})</span>
                    {data.isUp ? '▲' : '▼'}
                </div>
                <div className="text-sm text-text-muted font-normal flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-accent-green animate-pulse' : 'bg-text-muted'}`}></span>
                    <span className={isMarketOpen ? 'text-accent-green' : 'text-text-secondary'}>
                        {marketStatusText}
                    </span>
                    <span className="text-text-muted mx-1">•</span>
                    <span>{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>

        </div>
    );
}
