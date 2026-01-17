'use client';

import { useState, useEffect } from 'react';

const MOCK_RATES: Record<string, number> = {
    'TRY': 1,
    'USD': 35.0, // Mock rate
    'EUR': 38.0,
    'GBP': 44.0,
    'BTC': 2450000,
    'ETH': 85000,
};

export default function CurrencyConverter() {
    const [amount, setAmount] = useState<number>(100);
    const [from, setFrom] = useState<string>('USD');
    const [to, setTo] = useState<string>('TRY');
    const [result, setResult] = useState<number>(0);

    const convert = () => {
        const fromRate = MOCK_RATES[from];
        const toRate = MOCK_RATES[to];
        if (fromRate && toRate) {
            // Convert 'From' to Base (TRY) then to 'To'
            // Base is TRY (Value 1)
            // If From is USD (35), Amount 100
            // Value in TRY = 100 * 35 = 3500
            // Convert to EUR (38)
            // 3500 / 38 = 92.1
            const valueInTry = amount * fromRate;
            const finalValue = valueInTry / toRate;
            setResult(finalValue);
        }
    };

    useEffect(() => {
        convert();
    }, [amount, from, to]);

    return (
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
            <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
                <span className="text-xl">💱</span> Döviz Çevirici
            </h3>

            <div className="space-y-3">
                <div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-bg-elevated border border-border-subtle rounded-lg px-3 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-green font-mono"
                    />
                </div>

                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                    <select
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="bg-bg-elevated border border-border-subtle rounded-lg px-2 py-2 text-text-primary text-xs focus:outline-none cursor-pointer"
                    >
                        {Object.keys(MOCK_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <button
                        onClick={() => { setFrom(to); setTo(from); }}
                        className="p-1.5 text-text-secondary hover:text-accent-blue transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </button>

                    <select
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="bg-bg-elevated border border-border-subtle rounded-lg px-2 py-2 text-text-primary text-xs focus:outline-none cursor-pointer"
                    >
                        {Object.keys(MOCK_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="bg-bg-elevated/50 rounded-lg p-3 text-center">
                    <div className="text-xs text-text-secondary mb-1">Sonuç</div>
                    <div className="text-xl font-bold text-accent-green font-mono">
                        {result.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} <span className="text-sm text-text-muted">{to}</span>
                    </div>
                </div>
            </div>

            <div className="mt-2 text-[10px] text-text-muted text-center">
                *Veriler gecikmeli olabilir.
            </div>
        </div>
    );
}
