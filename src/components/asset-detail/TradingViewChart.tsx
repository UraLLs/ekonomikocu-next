"use client";

import { useEffect, useRef, memo } from 'react';

function TradingViewChart({ symbol }: { symbol: string }) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clear previous content to avoid duplicates
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": `BIST:${symbol.toUpperCase()}`,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "tr",
            "enable_publishing": false,
            "backgroundColor": "rgba(0, 0, 0, 1)",
            "gridColor": "rgba(42, 46, 57, 0.06)",
            "hide_top_toolbar": false,
            "hide_legend": false,
            "save_image": false,
            "calendar": false,
            "hide_volume": true,
            "support_host": "https://www.tradingview.com"
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
