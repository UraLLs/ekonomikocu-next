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
        <div className="space-y-4">
            <div className="flex items-center gap-2 bg-bg-elevated p-2 rounded-lg border border-border-subtle">
                <span className="text-xs text-text-secondary">Adet:</span>
                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full bg-transparent text-right font-bold text-text-primary focus:outline-none"
                />
            </div>

            <div className="flex justify-between text-xs px-1">
                <span className="text-text-muted">Tahmini Tutar:</span>
                <span className="font-bold text-text-primary">₺{total}</span>
            </div>

            {message && (
                <div className={`text-[10px] p-2 rounded ${message.includes('başarılı') ? 'bg-accent-green-soft text-accent-green' : 'bg-accent-red-soft text-accent-red'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleTrade('BUY')}
                    disabled={loading}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent-green hover:bg-accent-green/90 text-white transition-colors disabled:opacity-50"
                >
                    <span className="text-lg font-bold">AL</span>
                    <span className="text-[10px] opacity-80">Limit: {currentPrice}</span>
                </button>
                <button
                    onClick={() => handleTrade('SELL')}
                    disabled={loading}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent-red hover:bg-accent-red/90 text-white transition-colors disabled:opacity-50"
                >
                    <span className="text-lg font-bold">SAT</span>
                    <span className="text-[10px] opacity-80">Limit: {currentPrice}</span>
                </button>
            </div>
        </div>
    );
}
