'use client';

import { useState, useTransition } from 'react';
import { executeTrade } from '@/actions/trade';
import { useRouter } from 'next/navigation';

interface TradeFormProps {
    symbol: string;
    currentPrice: number;
    balance?: number;
    ownedQuantity?: number;
    isLoggedIn?: boolean;
}

export default function TradeForm({ symbol, currentPrice, balance = 0, ownedQuantity = 0, isLoggedIn = false }: TradeFormProps) {
    const [quantity, setQuantity] = useState(1);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState<'BUY' | 'SELL'>('BUY');
    const router = useRouter();

    const handleTrade = async (type: 'BUY' | 'SELL') => {
        if (!isLoggedIn) {
            router.push('/giris');
            return;
        }

        setMessage('');
        startTransition(async () => {
            try {
                const result = await executeTrade(symbol, type, quantity, currentPrice);
                setMessage(result.message);
                if (result.success) {
                    // Reset quantity after successful trade
                    setQuantity(1);
                }
            } catch (e) {
                setMessage('Bir hata oluştu.');
            }
        });
    };

    const total = quantity * currentPrice;
    const maxBuyQuantity = currentPrice > 0 ? Math.floor(balance / currentPrice) : 0;
    const maxSellQuantity = ownedQuantity;

    // Quick quantity buttons
    const quickQuantities = activeTab === 'BUY'
        ? [1, 5, 10, maxBuyQuantity > 0 ? Math.min(25, maxBuyQuantity) : 25]
        : [1, 5, Math.floor(maxSellQuantity / 2) || 1, maxSellQuantity || 1];

    const setQuickQuantity = (percent: number) => {
        if (activeTab === 'BUY') {
            setQuantity(Math.max(1, Math.floor(maxBuyQuantity * percent)));
        } else {
            setQuantity(Math.max(1, Math.floor(maxSellQuantity * percent)));
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="space-y-4 text-center py-6">
                <div className="w-12 h-12 mx-auto rounded-full bg-brand-primary/20 flex items-center justify-center">
                    <span className="text-2xl">🔐</span>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-1">İşlem Yap</h4>
                    <p className="text-sm text-text-muted">Alım-satım yapmak için giriş yapın</p>
                </div>
                <button
                    onClick={() => router.push('/giris')}
                    className="w-full py-3 bg-brand-primary hover:bg-brand-primary/90 text-white font-bold rounded-xl transition-colors"
                >
                    Giriş Yap
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Tab Switcher */}
            <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-xl">
                <button
                    onClick={() => setActiveTab('BUY')}
                    className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'BUY'
                        ? 'bg-accent-green text-white shadow-lg'
                        : 'text-text-muted hover:text-white'
                        }`}
                >
                    AL
                </button>
                <button
                    onClick={() => setActiveTab('SELL')}
                    className={`py-2 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'SELL'
                        ? 'bg-accent-red text-white shadow-lg'
                        : 'text-text-muted hover:text-white'
                        }`}
                >
                    SAT
                </button>
            </div>

            {/* Balance/Holdings Info */}
            <div className="flex justify-between text-xs p-2 bg-white/[0.02] rounded-lg">
                <span className="text-text-muted">
                    {activeTab === 'BUY' ? 'Bakiye:' : 'Sahip olduğunuz:'}
                </span>
                <span className="font-bold text-white font-mono">
                    {activeTab === 'BUY'
                        ? `₺${balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                        : `${ownedQuantity.toLocaleString()} adet`
                    }
                </span>
            </div>

            {/* Quantity Input */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 bg-black/40 p-3 rounded-xl border border-white/10 focus-within:border-brand-primary/50 transition-all">
                    <span className="text-xs text-gray-500 font-bold">ADET</span>
                    <input
                        type="number"
                        min="1"
                        max={activeTab === 'BUY' ? maxBuyQuantity : maxSellQuantity}
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-full bg-transparent text-right font-bold text-lg text-white focus:outline-none font-mono"
                    />
                </div>

                {/* Quick Quantity Buttons */}
                <div className="grid grid-cols-4 gap-1">
                    {[25, 50, 75, 100].map((percent) => (
                        <button
                            key={percent}
                            onClick={() => setQuickQuantity(percent / 100)}
                            className="py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-text-muted hover:text-white"
                        >
                            {percent}%
                        </button>
                    ))}
                </div>
            </div>

            {/* Price & Total */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between px-1">
                    <span className="text-text-muted">Fiyat</span>
                    <span className="font-mono text-white">₺{currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between px-1 py-2 border-t border-white/5">
                    <span className="text-text-muted font-medium">Toplam</span>
                    <span className="font-bold text-lg text-white font-mono">₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`text-xs p-3 rounded-lg border font-medium flex items-center gap-2 ${message.includes('başarılı')
                    ? 'bg-accent-green/10 border-accent-green/20 text-accent-green'
                    : 'bg-accent-red/10 border-accent-red/20 text-accent-red'}`}>
                    <span className={`w-2 h-2 rounded-full ${message.includes('başarılı') ? 'bg-accent-green' : 'bg-accent-red'}`}></span>
                    {message}
                </div>
            )}

            {/* Trade Button */}
            <button
                onClick={() => handleTrade(activeTab)}
                disabled={isPending || (activeTab === 'BUY' ? total > balance : quantity > ownedQuantity)}
                className={`w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'BUY'
                    ? 'bg-accent-green hover:bg-accent-green/90 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                    : 'bg-accent-red hover:bg-accent-red/90 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    }`}
            >
                {isPending ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        İşlem Yapılıyor...
                    </span>
                ) : (
                    <>
                        {activeTab === 'BUY' ? 'SATIN AL' : 'SAT'} - ₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </>
                )}
            </button>

            {/* Warning for insufficient funds */}
            {activeTab === 'BUY' && total > balance && (
                <p className="text-xs text-accent-red text-center">Yetersiz bakiye</p>
            )}
            {activeTab === 'SELL' && quantity > ownedQuantity && (
                <p className="text-xs text-accent-red text-center">Yeterli varlığınız yok</p>
            )}
        </div>
    );
}
