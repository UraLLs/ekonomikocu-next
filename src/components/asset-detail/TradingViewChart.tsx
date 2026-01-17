"use client";

import { useEffect, useRef, memo } from 'react';

function TradingViewChart({ symbol }: { symbol: string }) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Determine exchange based on symbol
        // If symbol is like BTC, ETH, SOL or ends with USDT -> BINANCE
        // Otherwise just use the symbol (works better with Symbol Overview widget for BIST)
        const upperSymbol = symbol.toUpperCase();
        let tvSymbol = upperSymbol;

        const cryptoCommon = ['BTC', 'ETH', 'SOL', 'AVAX', 'XRP', 'DOGE', 'USDT'];
        if (cryptoCommon.includes(upperSymbol) || upperSymbol.endsWith('USDT')) {
            tvSymbol = `BINANCE:${upperSymbol}USDT`;
            // If it's already full pair like BTCUSDT, keep it, otherwise append USDT
            if (upperSymbol.endsWith('USDT')) {
                tvSymbol = `BINANCE:${upperSymbol}`;
            }
        }

        // Clear previous content
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js"; // USING SYMBOL OVERVIEW (Allows BIST)
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "symbols": [
                [
                    symbol.toUpperCase(),
                    tvSymbol
                ]
            ],
            "chartOnly": false,
            "width": "100%",
            "height": "100%",
            "locale": "tr",
            "colorTheme": "dark",
            "autosize": true,
            "showVolume": true,
            "showMA": false,
            "hideDateRanges": false,
            "hideMarketStatus": false,
            "hideSymbolLogo": false,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            "fontSize": "10",
            "noTimeScale": false,
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "chartType": "candlesticks", // MUM GRAFIK (CANDLES)
            "maLineColor": "#2962FF",
            "maLineWidth": 1,
            "maLength": 9,
            "upColor": "#22ab94",
            "downColor": "#f7525f",
            "borderUpColor": "#22ab94",
            "borderDownColor": "#f7525f",
            "wickUpColor": "#22ab94",
            "wickDownColor": "#f7525f",
            "dateRanges": [
                "1d|1",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ],
            "dateFormat": "dd MMM",
            "backgroundColor": "rgba(13, 13, 13, 1)"
        });
        container.current.appendChild(script);
    }, [symbol]);

    return (
        <div className="h-[500px] w-full bg-bg-surface border border-border-subtle rounded-lg overflow-hidden shadow-lg relative" ref={container}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                <span className="text-text-muted text-sm animate-pulse">Grafik Yükleniyor...</span>
            </div>
        </div>
    );
}

export default memo(TradingViewChart);
