import { format } from "date-fns";
import { tr } from "date-fns/locale";

interface MarketSignal {
    id: number;
    type: 'BULL' | 'BEAR' | 'NEUTRAL' | 'VOL' | 'WHALE';
    title: string;
    description: string;
    time: Date;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

// Mock Signals Generator
const generateSignals = (): MarketSignal[] => [
    {
        id: 1,
        type: 'WHALE',
        title: 'Balina Aktivitesi',
        description: '1.2M TL hacimli blok alım gerçekleşti.',
        time: new Date(),
        impact: 'HIGH'
    },
    {
        id: 2,
        type: 'BULL',
        title: 'Teknik Kırılım',
        description: 'RSI 14 (30m) aşırı satım bölgesinden yukarı döndü.',
        time: new Date(Date.now() - 1000 * 60 * 5),
        impact: 'MEDIUM'
    },
    {
        id: 3,
        type: 'VOL',
        title: 'Hacim Artışı',
        description: 'Son 15 dakikada işlem hacmi ortalamanın %30 üzerinde.',
        time: new Date(Date.now() - 1000 * 60 * 12),
        impact: 'MEDIUM'
    },
    {
        id: 4,
        type: 'BEAR',
        title: 'Direnç Testi',
        description: '305.50 seviyesindeki direnç aşılamadı.',
        time: new Date(Date.now() - 1000 * 60 * 25),
        impact: 'LOW'
    },
    {
        id: 5,
        type: 'NEUTRAL',
        title: 'Piyasa Yatay',
        description: 'Bollinger bantları daralıyor, volatilite düşük.',
        time: new Date(Date.now() - 1000 * 60 * 45),
        impact: 'LOW'
    }
];

export default function MarketPulse() {
    const signals = generateSignals();

    const getIcon = (type: MarketSignal['type']) => {
        switch (type) {
            case 'BULL': return '🚀';
            case 'BEAR': return '🔻';
            case 'WHALE': return '🐋';
            case 'VOL': return '📊';
            default: return '⚖️';
        }
    };

    const getColor = (type: MarketSignal['type']) => {
        switch (type) {
            case 'BULL': return 'text-accent-green';
            case 'BEAR': return 'text-accent-red';
            case 'WHALE': return 'text-accent-blue';
            case 'VOL': return 'text-accent-purple';
            default: return 'text-gray-400';
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden relative group">
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
                    </span>
                    <span className="font-bold text-gray-100 text-xs tracking-wider uppercase">Piyasa Nabzı</span>
                </div>
                <div className="text-[10px] font-mono text-gray-500">
                    SİNYAL AKIŞI
                </div>
            </div>

            {/* Signal List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 p-4 space-y-3">
                {signals.map((signal) => (
                    <div key={signal.id} className="relative pl-3 border-l-2 border-white/5 hover:border-white/20 transition-colors group/item">
                        {/* Dot indicator */}
                        <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-black ${signal.type === 'BULL' ? 'bg-accent-green' : signal.type === 'BEAR' ? 'bg-accent-red' : 'bg-gray-500'}`}></div>

                        <div className="flex justify-between items-start mb-0.5">
                            <span className={`text-xs font-bold ${getColor(signal.type)} flex items-center gap-1.5`}>
                                <span>{getIcon(signal.type)}</span>
                                {signal.title}
                            </span>
                            <span className="text-[10px] text-gray-600 font-mono">
                                {format(signal.time, 'HH:mm', { locale: tr })}
                            </span>
                        </div>

                        <p className="text-[11px] text-gray-400 leading-snug group-hover/item:text-gray-300 transition-colors">
                            {signal.description}
                        </p>

                        {signal.impact === 'HIGH' && (
                            <div className="mt-1.5 inline-block px-1.5 py-0.5 rounded bg-accent-blue/10 border border-accent-blue/20 text-[9px] font-bold text-accent-blue uppercase tracking-wider">
                                Yüksek Etki
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Footer / Status */}
            <div className="p-2 border-t border-white/5 bg-white/5 text-center shrink-0">
                <span className="text-[10px] text-gray-500 flex items-center justify-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green"></span>
                    Sistem Aktif & Analiz Ediliyor...
                </span>
            </div>
        </div>
    );
}
