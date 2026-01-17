export default function SentimentGauge() {
    const score = 76; // Greed
    const label = "AÇGÖZLÜ";

    return (
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-green/5 blur-[50px] rounded-full"></div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary text-sm flex items-center gap-2">
                    🧭 Duygu Pusulası
                </h3>
                <span className="text-[10px] text-text-muted">Son güncelleme: 1dk önce</span>
            </div>

            <div className="flex flex-col items-center">
                {/* Gauge Graphic - Simplified for CSS */}
                <div className="relative w-40 h-20 overflow-hidden mb-2">
                    <div className="w-40 h-40 rounded-full border-[12px] border-bg-elevated border-t-accent-red border-r-accent-orange border-b-accent-green border-l-accent-green rotate-45"></div>
                    {/* Needle */}
                    <div className="absolute bottom-0 left-1/2 w-1 h-20 bg-text-primary origin-bottom -translate-x-1/2 rotate-[45deg] transition-transform duration-1000" style={{ transform: `translateX(-50%) rotate(${(score / 100 * 180) - 90}deg)` }}></div>
                    <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-text-primary rounded-full -translate-x-1/2 translate-y-1/2"></div>
                </div>

                <div className="text-center">
                    <div className="text-2xl font-bold text-accent-green mb-1">{score}</div>
                    <div className="text-xs font-bold text-text-primary tracking-widest">{label}</div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border-subtle grid grid-cols-2 gap-2 text-center">
                <div>
                    <div className="text-[10px] text-text-muted">Dün</div>
                    <div className="text-xs font-semibold text-text-secondary">64 (Açgözlü)</div>
                </div>
                <div>
                    <div className="text-[10px] text-text-muted">Geçen Hafta</div>
                    <div className="text-xs font-semibold text-text-secondary">45 (Nötr)</div>
                </div>
            </div>
        </div>
    );
}
