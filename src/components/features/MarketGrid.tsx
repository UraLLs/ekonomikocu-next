import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

const MARKET_ITEMS = [
    {
        symbol: "BIST 100",
        value: "9,125.40",
        change: "+1.42%",
        isUp: true,
        icon: "📈"
    },
    {
        symbol: "USD/TRY",
        value: "34.1500",
        change: "+0.12%",
        isUp: true,
        icon: "💵"
    },
    {
        symbol: "EUR/TRY",
        value: "37.2040",
        change: "-0.05%",
        isUp: false,
        icon: "💶"
    },
    {
        symbol: "ALTIN (GR)",
        value: "2,450.00",
        change: "+0.85%",
        isUp: true,
        icon: "🥇"
    },
    {
        symbol: "BITCOIN",
        value: "$64,250",
        change: "-1.20%",
        isUp: false,
        icon: "₿"
    },
    {
        symbol: "BRENT",
        value: "$82.40",
        change: "+0.45%",
        isUp: true,
        icon: "🛢️"
    }
];

export default function MarketGrid() {
    return (
        <section className="relative z-20 -mt-16 px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {MARKET_ITEMS.map((item) => (
                        <div
                            key={item.symbol}
                            className="group bg-ivory p-6 shadow-md hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                            style={{ clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)" }}
                        >
                            {/* Top Accent Line */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-muted-gold to-transparent" />

                            <div className="flex justify-between items-start mb-2 pb-2 border-b border-pearl">
                                <span className="font-display font-bold text-deep-navy text-sm tracking-widest">{item.symbol}</span>
                                <span className="text-lg opacity-80 grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                            </div>

                            <div className="font-mono text-2xl font-bold text-deep-navy mb-2 tracking-tight">
                                {item.value}
                            </div>

                            <div className={`flex items-center gap-1 font-mono text-xs font-bold ${item.isUp ? 'text-emerald' : 'text-ruby'}`}>
                                {item.isUp ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                                {item.change}
                            </div>

                            {/* Sparkline Placeholder */}
                            <div className={`h-10 w-full mt-3 rounded-sm bg-gradient-to-b ${item.isUp ? 'from-emerald/10' : 'from-ruby/10'} to-transparent`} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
