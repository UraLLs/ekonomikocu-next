import { CalendarDaysIcon, ChartBarIcon, CalculatorIcon } from "@heroicons/react/24/outline";

const TOP_WATCHED = [
    { symbol: "THYAO", value: "287.50", change: "+2.34%", isUp: true },
    { symbol: "GARAN", value: "112.80", change: "-0.85%", isUp: false },
    { symbol: "ASELS", value: "89.75", change: "+4.52%", isUp: true },
    { symbol: "SASA", value: "45.20", change: "+1.23%", isUp: true },
    { symbol: "KCHOL", value: "198.20", change: "+1.52%", isUp: true },
];

const CALENDAR = [
    { time: "14:00", event: "TCMB Faiz Kararı", impact: "high" },
    { time: "15:30", event: "ABD İşsizlik", impact: "medium" },
    { time: "16:45", event: "Hizmet PMI", impact: "low" },
];

export default function RightSidebar() {
    return (
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6 sticky top-32 self-start">

            {/* Widget 1: Top Watched */}
            <div className="bg-ivory p-5 shadow-md border-t-4 border-deep-navy" style={{ clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)" }}>
                <h3 className="font-display font-bold text-deep-navy text-lg mb-4 flex items-center gap-2">
                    🔥 En Çok İzlenenler
                </h3>
                <ul className="space-y-3">
                    {TOP_WATCHED.map((stock) => (
                        <li key={stock.symbol} className="flex justify-between items-center border-b border-pearl pb-2 last:border-0 last:pb-0">
                            <span className="font-bold text-deep-navy">{stock.symbol}</span>
                            <div className="text-right">
                                <div className="font-mono text-sm">{stock.value}</div>
                                <div className={`font-mono text-xs font-bold ${stock.isUp ? 'text-emerald' : 'text-ruby'}`}>
                                    {stock.change}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Widget 2: Economic Calendar */}
            <div className="bg-ivory p-5 shadow-md">
                <h3 className="font-display font-bold text-deep-navy text-lg mb-4 flex items-center gap-2">
                    <CalendarDaysIcon className="w-5 h-5 text-muted-gold" /> Ekonomik Takvim
                </h3>
                <ul className="space-y-3">
                    {CALENDAR.map((item, idx) => (
                        <li key={idx} className="flex gap-3 items-start text-sm">
                            <span className="font-mono font-bold text-slate-blue bg-pearl px-2 py-1 rounded-sm">{item.time}</span>
                            <div>
                                <div className="font-medium text-charcoal">{item.event}</div>
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3].map(i => (
                                        <div
                                            key={i}
                                            className={`w-2 h-2 rounded-full ${(item.impact === 'high' && i <= 3) ||
                                                    (item.impact === 'medium' && i <= 2) ||
                                                    (item.impact === 'low' && i === 1)
                                                    ? 'bg-ruby'
                                                    : 'bg-pearl'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Widget 3: Market Sentiment */}
            <div className="bg-deep-navy p-5 shadow-lg text-ivory relative overflow-hidden">
                {/* Decorative BG */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-bright-gold opacity-10 rounded-full -translate-y-10 translate-x-10" />

                <h3 className="font-display font-bold text-bright-gold text-lg mb-4 flex items-center gap-2">
                    <ChartBarIcon className="w-5 h-5" /> Piyasa Algısı
                </h3>

                <div className="mb-4">
                    <div className="flex justify-between text-xs uppercase tracking-widest mb-2 text-pearl">
                        <span>Korku</span>
                        <span>Açgözlülük</span>
                    </div>
                    <div className="h-4 bg-midnight rounded-full overflow-hidden relative">
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-ruby via-bright-gold to-emerald w-[75%]" />
                    </div>
                    <div className="text-right mt-1 text-emerald font-bold font-mono">75 (Pozitif)</div>
                </div>
            </div>

            {/* Widget 4: Quick Tools */}
            <div className="bg-ivory p-5 shadow-md border-b-4 border-muted-gold">
                <h3 className="font-display font-bold text-deep-navy text-lg mb-4 flex items-center gap-2">
                    <CalculatorIcon className="w-5 h-5 text-muted-gold" /> Araçlar
                </h3>
                <div className="grid grid-cols-2 gap-2">
                    {["Bileşik Faiz", "Risk Analizi", "Portföy", "Karşılaştır"].map((tool) => (
                        <button key={tool} className="text-xs font-bold text-slate-blue border border-pearl py-2 hover:bg-deep-navy hover:text-bright-gold transition-colors">
                            {tool}
                        </button>
                    ))}
                </div>
            </div>

        </aside>
    );
}
