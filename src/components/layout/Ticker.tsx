export default function Ticker() {
    const items = [
        { s: "BIST 100", p: "10.234,56", c: "▲ 1.24%", up: true },
        { s: "USD/TRY", p: "32,4521", c: "▲ 0.32%", up: true },
        { s: "EUR/TRY", p: "35,1234", c: "▼ 0.18%", up: false },
        { s: "Gram Altın", p: "2.145,00", c: "▲ 0.56%", up: true },
        { s: "BTC/USD", p: "97.432", c: "▲ 2.14%", up: true },
        { s: "ETH/USD", p: "3.421", c: "▼ 0.87%", up: false },
        { s: "Gümüş", p: "28,45", c: "▲ 0.92%", up: true },
        { s: "Brent", p: "78,23", c: "▼ 1.23%", up: false },
    ];

    // duplicate for seamless scroll
    const allItems = [...items, ...items, ...items];

    return (
        <div className="bg-bg-secondary border-b border-border-subtle overflow-hidden py-2">
            <div className="flex w-max animate-ticker hover:[animation-play-state:paused] gap-8 px-4">
                {allItems.map((item, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-1 bg-bg-surface rounded-md border border-border-subtle cursor-pointer hover:border-accent-green hover:-translate-y-[1px] transition-all group"
                    >
                        <span className="font-semibold text-xs text-text-primary group-hover:text-accent-green transition-colors">{item.s}</span>
                        <span className="font-bold text-[13px] text-text-primary">{item.p}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] ${item.up
                                ? "text-accent-green bg-accent-green-soft"
                                : "text-accent-red bg-accent-red-soft"
                            }`}>
                            {item.c}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
