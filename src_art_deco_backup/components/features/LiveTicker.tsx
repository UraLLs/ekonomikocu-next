import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

const TICKER_DATA = [
    { symbol: "BIST 100", value: "9,125.40", change: "+1.42%", isUp: true },
    { symbol: "USD/TRY", value: "34.15", change: "+0.12%", isUp: true },
    { symbol: "EUR/TRY", value: "37.20", change: "-0.05%", isUp: false },
    { symbol: "ALTIN (GR)", value: "2,450.00", change: "+0.85%", isUp: true },
    { symbol: "BITCOIN", value: "$64,250", change: "-1.20%", isUp: false },
    { symbol: "BRENT", value: "$82.40", change: "+0.45%", isUp: true },
    { symbol: "NASDAQ", value: "16,240.50", change: "+0.90%", isUp: true },
    { symbol: "S&P 500", value: "5,150.20", change: "+0.65%", isUp: true },
];

export default function LiveTicker() {
    // Triple the data for smoother loop on wide screens
    const items = [...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA];

    return (
        <div className="bg-midnight border-b border-slate-blue overflow-hidden py-3">
            <div className="flex gap-12 animate-scroll w-max hover:[animation-play-state:paused]">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm font-mono whitespace-nowrap">
                        <span className="font-bold text-bright-gold tracking-wider">{item.symbol}</span>
                        <span className="font-medium text-pearl">{item.value}</span>
                        <span className={`flex items-center gap-1 font-bold ${item.isUp ? 'text-emerald' : 'text-ruby'}`}>
                            {item.isUp ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                            {item.change}
                        </span>
                        <span className="text-slate-blue font-light">|</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
