'use client';

import { useState } from "react";

export default function InvestmentCalculator() {
    const [activeTab, setActiveTab] = useState<'profit' | 'compound'>('profit');

    return (
        <div className="flex flex-col items-center">
            {/* TABS */}
            <div className="flex gap-4 mb-8 bg-bg-surface p-1.5 rounded-xl border border-white/5">
                <button
                    onClick={() => setActiveTab('profit')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'profit' ? 'bg-brand-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                    Kâr/Zarar Hesapla
                </button>
                <button
                    onClick={() => setActiveTab('compound')}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'compound' ? 'bg-brand-primary text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                >
                    Bileşik Getiri
                </button>
            </div>

            {/* CALCULATOR CONTAINER */}
            <div className="w-full max-w-xl bg-bg-surface border border-white/5 rounded-3xl p-8 shadow-2xl">
                {activeTab === 'profit' ? <ProfitCalculator /> : <CompoundCalculator />}
            </div>
        </div>
    );
}

function ProfitCalculator() {
    const [buyPrice, setBuyPrice] = useState(100);
    const [sellPrice, setSellPrice] = useState(120);
    const [amount, setAmount] = useState(1000);

    const profit = (sellPrice - buyPrice) * amount;
    const profitPercent = ((sellPrice - buyPrice) / buyPrice) * 100;
    const isProfit = profit >= 0;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Basit Kâr/Zarar</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Alış Fiyatı (₺)</label>
                    <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Satış Fiyatı (₺)</label>
                    <input type="number" value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm text-text-muted">Adet / Lot</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
            </div>

            <div className={`p-6 rounded-xl border ${isProfit ? 'bg-accent-green/10 border-accent-green/30' : 'bg-accent-red/10 border-accent-red/30'} text-center mt-6`}>
                <div className="text-sm opacity-75 mb-1">{isProfit ? 'TOPLAM KÂR' : 'TOPLAM ZARAR'}</div>
                <div className={`text-4xl font-black ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
                    {profit.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                </div>
                <div className={`text-lg font-bold mt-2 ${isProfit ? 'text-accent-green' : 'text-accent-red'}`}>
                    %{profitPercent.toFixed(2)}
                </div>
            </div>
        </div>
    );
}

function CompoundCalculator() {
    const [initial, setInitial] = useState(10000);
    const [monthly, setMonthly] = useState(1000);
    const [rate, setRate] = useState(10);
    const [years, setYears] = useState(5);

    // FV = P(1 + r/n)^(nt) + PMT * ... (Simplified monthly compound)
    // Monthly rate = rate / 100 / 12
    const r = rate / 100 / 12;
    const n = years * 12;

    // Future value of initial investment
    let futureValue = initial * Math.pow(1 + r, n);

    // Future value of monthly contributions
    if (r !== 0) {
        futureValue += monthly * ((Math.pow(1 + r, n) - 1) / r);
    } else {
        futureValue += monthly * n;
    }

    const totalInvested = initial + (monthly * n);
    const totalInterest = futureValue - totalInvested;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Bileşik Getiri</h2>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Başlangıç (₺)</label>
                    <input type="number" value={initial} onChange={(e) => setInitial(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Aylık Ekleme (₺)</label>
                    <input type="number" value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Yıllık Getiri (%)</label>
                    <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-text-muted">Süre (Yıl)</label>
                    <input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-brand-primary focus:outline-none" />
                </div>
            </div>

            <div className="bg-bg-elevated p-6 rounded-xl border border-white/5 space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-text-muted">Toplam Yatırılan</span>
                    <span className="text-xl font-bold text-white">{totalInvested.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-text-muted">Kazanılan Faiz</span>
                    <span className="text-xl font-bold text-accent-green">+{totalInterest.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                    <span className="text-text-secondary font-bold">Toplam Birikim</span>
                    <span className="text-3xl font-black text-brand-primary">{futureValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</span>
                </div>
            </div>
        </div>
    )
}
