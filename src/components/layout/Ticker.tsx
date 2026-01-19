import { getMarketIndices } from "@/services/marketService";
import Link from "next/link";

export default async function Ticker() {
    const summary = await getMarketIndices();

    // Flatten all categories into a single list for the ticker
    const items = [
        ...summary.indices,
        ...summary.currencies,
        ...summary.commodities,
        ...summary.crypto
    ];

    // Duplicate for seamless scroll
    const allItems = [...items, ...items];

    return (
        <div className="hidden md:block bg-bg-secondary border-b border-border-subtle overflow-hidden py-2 h-[42px]">
            <div className="flex w-max animate-ticker hover:[animation-play-state:paused] gap-8 px-4">
                {allItems.map((item, i) => (
                    <Link
                        key={`${item.symbol}-${i}`}
                        href={`/piyasa/${item.symbol}`}
                        className="flex items-center gap-2 px-3 py-0.5 bg-bg-surface rounded-md border border-border-subtle cursor-pointer hover:border-accent-green hover:-translate-y-[1px] transition-all group min-w-max"
                    >
                        <span className="font-semibold text-xs text-text-primary group-hover:text-accent-green transition-colors">
                            {item.displayName || item.symbol}
                        </span>
                        <span className="font-bold text-[13px] text-text-primary tracking-wide">{item.price}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] min-w-[50px] text-center ${item.up
                            ? "text-accent-green bg-accent-green-soft"
                            : "text-accent-red bg-accent-red-soft"
                            }`}>
                            {item.up ? '▲' : '▼'} {item.changePercent}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
