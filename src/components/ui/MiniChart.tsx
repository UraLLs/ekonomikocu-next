"use client";

import { memo, useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

interface MiniChartProps {
    symbol: string;
    displayName?: string;
    price?: string;
    changePercent?: string;
    isUp?: boolean;
}

// Simulated historical data generator (in production, fetch from API)
function generateSparklineData(isUp: boolean, volatility: number = 0.02): { value: number }[] {
    const points = 20;
    const data: { value: number }[] = [];
    let value = 100;

    // Trend direction based on isUp
    const trend = isUp ? 0.003 : -0.003;

    for (let i = 0; i < points; i++) {
        // Add some randomness + trend
        const change = (Math.random() - 0.5) * volatility * 100 + trend * 100;
        value = Math.max(value + change, 1);
        data.push({ value });
    }

    // Ensure last point reflects the trend
    if (isUp && data[data.length - 1].value < data[0].value) {
        data[data.length - 1].value = data[0].value * 1.02;
    } else if (!isUp && data[data.length - 1].value > data[0].value) {
        data[data.length - 1].value = data[0].value * 0.98;
    }

    return data;
}

// Display name mapping for symbols
const symbolDisplayNames: Record<string, string> = {
    'XU100': 'BIST 100',
    'XU030': 'BIST 30',
    'USDTRY': 'Dolar/TL',
    'EURTRY': 'Euro/TL',
    'GOLD': 'Altın',
    'BRENT': 'Brent Petrol',
    'BTCUSDT': 'Bitcoin',
    'ETHUSDT': 'Ethereum',
    'SOLUSDT': 'Solana',
    'BNBUSDT': 'BNB',
};

function MiniChart({ symbol, displayName, price, changePercent, isUp = true }: MiniChartProps) {
    const [chartData, setChartData] = useState<{ value: number }[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Generate sparkline data based on trend
        setChartData(generateSparklineData(isUp));
    }, [isUp, symbol]);

    const name = displayName || symbolDisplayNames[symbol] || symbol;
    const chartColor = isUp ? "#22c55e" : "#ef4444"; // green-500 / red-500
    const gradientId = `gradient-${symbol.replace(/[^a-zA-Z0-9]/g, '')}`;

    if (!mounted) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
                <div className="animate-pulse text-gray-500 text-xs">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col p-3 relative">
            {/* Header */}
            <div className="flex items-start justify-between mb-1 z-10">
                <div>
                    <h3 className="font-bold text-sm text-white truncate max-w-[140px]">
                        {name}
                    </h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                        {symbol}
                    </p>
                </div>
            </div>

            {/* Price & Change */}
            <div className="flex items-baseline gap-2 mb-2 z-10">
                <span className="text-lg font-bold text-white">
                    {price || '—'}
                </span>
                <span className={`text-xs font-semibold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                    {isUp ? '▲' : '▼'} {changePercent || '%0.00'}
                </span>
            </div>

            {/* Sparkline Chart */}
            <div className="flex-1 min-h-0 -mx-3 -mb-3">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis domain={['dataMin', 'dataMax']} hide />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            strokeWidth={2}
                            fill={`url(#${gradientId})`}
                            isAnimationActive={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default memo(MiniChart);
