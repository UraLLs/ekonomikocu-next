'use client';

import { useState } from 'react';
import { executeTrade } from '@/actions/trade';

interface TradeFormProps {
    symbol: string;
    currentPrice: number;
}

export default function TradeForm({ symbol, currentPrice }: TradeFormProps) {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleTrade = async (type: 'BUY' | 'SELL') => {
        setLoading(true);
        setMessage('');

        try {
            const result = await executeTrade(symbol, type, quantity, currentPrice);
            setMessage(result.message);
            if (result.success) {
                // Optional: Play a sound or show confetti
            }
        } catch (e) {
            setMessage('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const total = (quantity * currentPrice).toLocaleString('tr-TR', { maximumFractionDigits: 2 });

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm p-3 rounded-xl border border-white/10 focus-within:border-accent-blue/50 focus-within:ring-1 focus-within:ring-accent-blue/50 transition-all group">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider group-focus-within:text-accent-blue transition-colors">Adet:</span>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-transparent text-right font-bold text-xl text-white focus:outline-none font-mono tracking-tight"
                />
            </div>

            <div className="flex justify-between text-xs px-1">
                <span className="text-gray-500 font-medium">Tahmini Tutar</span>
                <span className="font-bold text-gray-100 font-mono text-base">₺{total}</span>
            </div>

            {message && (
                <div className={`text-[10px] p-3 rounded-lg border font-medium flex items-center gap-2 ${message.includes('başarılı')
                    ? 'bg-accent-green/10 border-accent-green/20 text-accent-green'
                    : 'bg-accent-red/10 border-accent-red/20 text-accent-red'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${message.includes('başarılı') ? 'bg-accent-green' : 'bg-accent-red'}`}></span>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleTrade('BUY')}
                    disabled={loading}
                    className="relative group overflow-hidden flex flex-col items-center justify-center p-3 rounded-xl bg-accent-green hover:bg-accent-green/90 transition-all disabled:opacity-50 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-white/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-lg font-black text-white tracking-widest relative z-10">AL</span>
                    <span className="text-[9px] text-white/80 font-mono relative z-10">{currentPrice} TL</span>
                </button>
                <button
                    onClick={() => handleTrade('SELL')}
                    disabled={loading}
                    className="relative group overflow-hidden flex flex-col items-center justify-center p-3 rounded-xl bg-accent-red hover:bg-accent-red/90 transition-all disabled:opacity-50 active:scale-95 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-white/10"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-lg font-black text-white tracking-widest relative z-10">SAT</span>
                    <span className="text-[9px] text-white/80 font-mono relative z-10">{currentPrice} TL</span>
                </button>
            </div>
        </div>
    );
}
