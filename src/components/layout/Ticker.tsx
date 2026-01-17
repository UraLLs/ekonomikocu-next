import { getBinanceTicker } from "@/services/marketService";

export default async function Ticker() {
    const items = await getBinanceTicker();

    // duplicate for seamless scroll (more duplication because items are fewer)
    const allItems = [...items, ...items, ...items, ...items];

    return (
        <div className="bg-bg-secondary border-b border-border-subtle overflow-hidden py-2 h-[42px]">
            <div className="flex w-max animate-ticker hover:[animation-play-state:paused] gap-8 px-4">
                {allItems.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-0.5 bg-bg-surface rounded-md border border-border-subtle cursor-pointer hover:border-accent-green hover:-translate-y-[1px] transition-all group min-w-max"
                    >
                        <span className="font-semibold text-xs text-text-primary group-hover:text-accent-green transition-colors">{item.symbol}</span>
                        <span className="font-bold text-[13px] text-text-primary tracking-wide">{item.price}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] min-w-[50px] text-center ${item.up
                            ? "text-accent-green bg-accent-green-soft"
                            : "text-accent-red bg-accent-red-soft"
                            }`}>
                            {item.up ? '▲' : '▼'} {item.changePercent}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
