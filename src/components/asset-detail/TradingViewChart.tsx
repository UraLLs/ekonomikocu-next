"use client";

import { useEffect, useRef, memo } from 'react';

function TradingViewChart({ symbol }: { symbol: string }) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Determine exchange based on symbol
        const upperSymbol = symbol.toUpperCase();
        let tvSymbol = upperSymbol;

        const cryptoCommon = ['BTC', 'ETH', 'SOL', 'AVAX', 'XRP', 'DOGE', 'USDT', 'SHIB', 'PEPE', 'ADA', 'DOT'];

        // 1. CRYPTO (Binance)
        if (cryptoCommon.includes(upperSymbol) || upperSymbol.endsWith('USDT')) {
            if (upperSymbol.endsWith('USDT')) {
                tvSymbol = `BINANCE:${upperSymbol}`;
            } else {
                tvSymbol = `BINANCE:${upperSymbol}USDT`;
            }
        }
        // 2. FOREX / COMMODITIES
        else if (upperSymbol === 'USD' || upperSymbol === 'DOLAR') {
            tvSymbol = 'FX:USDTRY';
        }
        else if (upperSymbol === 'EUR' || upperSymbol === 'EURO') {
            tvSymbol = 'FX:EURTRY';
        }
        else if (upperSymbol === 'GOLD' || upperSymbol === 'ALTIN' || upperSymbol === 'GA') {
            tvSymbol = 'FX:XAUUSD';
        }
        else if (upperSymbol === 'BIST100' || upperSymbol === 'XU100') {
            tvSymbol = 'BIST:XU100';
        }
        // 3. BIST STOCKS (Default)
        else {
            tvSymbol = upperSymbol; // Auto-resolve (removes BIST: prefix to allow better matching)
        }

        const widgetContainerId = `tradingview_${Math.random().toString(36).substring(7)}`;
        container.current.id = widgetContainerId;
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            if (typeof TradingView !== 'undefined') {
                // @ts-ignore
                new TradingView.widget({
                    "width": "100%",
                    "height": "600",
                    "symbol": tvSymbol,
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "tr",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "hide_top_toolbar": false,
                    "hide_legend": false,
                    "save_image": false,
                    "container_id": widgetContainerId,
                    "backgroundColor": "rgba(0, 0, 0, 1)",
                    "gridColor": "rgba(255, 255, 255, 0.05)",
                    "studies": [
                        "RSI@tv-basicstudies"
                    ]
                });
            }
        };
        container.current.appendChild(script);

        return () => {
            if (container.current) {
                container.current.innerHTML = "";
            }
        };
    }, [symbol]);

    return (
        <div className="w-full bg-black border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative group" style={{ height: '600px' }}>
            {/* Loading State or Placeholder if Script hasn't loaded */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-center text-gray-500 font-mono tracking-widest animate-pulse">GRAFIK YÜKLENIYOR...</span>
                </div>
            </div>
            <div ref={container} className="w-full h-full relative z-10" />
        </div>
    );
}

export default memo(TradingViewChart);
