export default function AssetHeader({ symbol }: { symbol: string }) {
    // Mock data for prototype
    const isUp = true;
    const price = "284.50";
    const change = "2.45";
    const changePercent = "1.12%";

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-bg-surface/50 backdrop-blur-md border border-border-subtle rounded-xl shadow-sm mb-6">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center text-2xl font-bold text-text-primary border border-border-subtle">
                    {symbol.substring(0, 1).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-text-primary tracking-tight">{symbol.toUpperCase()}</h1>
                    <span className="text-sm text-text-secondary">Türk Hava Yolları A.O.</span>
                </div>
            </div>

            <div className="flex items-end flex-col">
                <div className="text-4xl font-bold text-text-primary tracking-tight font-mono">
                    ₺{price}
                </div>
                <div className={`flex items-center gap-2 text-lg font-semibold ${isUp ? 'text-accent-green' : 'text-accent-red'}`}>
                    <span className="flex items-center">
                        {isUp ? '▲' : '▼'} {change}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-bg-surface border border-current text-sm">
                        {changePercent}
                    </span>
                </div>
                <div className="text-xs text-text-muted mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                    Piyasa Açık
                </div>
            </div>
        </div>
    );
}
