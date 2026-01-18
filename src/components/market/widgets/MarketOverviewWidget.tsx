'use client';

import React from 'react';
import TradingViewWidget from '../TradingViewWidget';

export default function MarketOverviewWidget() {
    const config = JSON.stringify({
        "colorTheme": "dark",
        "dateRange": "12M",
        "showChart": true,
        "locale": "tr",
        "largeChartUrl": "",
        "isTransparent": true,
        "showSymbolLogo": true,
        "showFloatingTooltip": true,
        "width": "100%",
        "height": "500",
        "plotLineColorGrowing": "rgba(34, 197, 94, 1)",
        "plotLineColorFalling": "rgba(239, 68, 68, 1)",
        "gridLineColor": "rgba(255, 255, 255, 0.05)",
        "scaleFontColor": "rgba(209, 213, 219, 1)",
        "belowLineFillColorGrowing": "rgba(34, 197, 94, 0.12)",
        "belowLineFillColorFalling": "rgba(239, 68, 68, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(34, 197, 94, 0)",
        "belowLineFillColorFallingBottom": "rgba(239, 68, 68, 0)",
        "symbolActiveColor": "rgba(34, 197, 94, 0.12)",
        "tabs": [
            {
                "title": "Endeksler",
                "symbols": [
                    { "s": "BIST:XU100", "d": "BIST 100" },
                    { "s": "BIST:XU030", "d": "BIST 30" },
                    { "s": "INDEX:SPX", "d": "S&P 500" },
                    { "s": "INDEX:NDX", "d": "Nasdaq 100" },
                    { "s": "TVC:DXY", "d": "Dolar Endeksi" }
                ],
                "originalTitle": "Indices"
            },
            {
                "title": "Emtia & Döviz",
                "symbols": [
                    { "s": "FX:USDTRY", "d": "Dolar/TL" },
                    { "s": "FX:EURTRY", "d": "Euro/TL" },
                    { "s": "TVC:GOLD", "d": "Ons Altın" },
                    { "s": "TVC:UKOIL", "d": "Brent Petrol" },
                    { "s": "FX:GBPTRY", "d": "Sterlin/TL" }
                ],
                "originalTitle": "Futures"
            },
            {
                "title": "Kripto",
                "symbols": [
                    { "s": "BINANCE:BTCUSDT", "d": "Bitcoin" },
                    { "s": "BINANCE:ETHUSDT", "d": "Ethereum" },
                    { "s": "BINANCE:SOLUSDT", "d": "Solana" },
                    { "s": "BINANCE:AVAXUSDT", "d": "Avalanche" },
                    { "s": "BINANCE:XRPUSDT", "d": "Ripple" }
                ],
                "originalTitle": "Crypto"
            }
        ]
    });

    return (
        <div className="w-full h-[500px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl mb-8">
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2">
                    🌐 Küresel Piyasalar
                </h3>
            </div>
            <TradingViewWidget
                containerId="market-overview-widget"
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js"
                scriptHTML={config}
                className="w-full h-full"
            />
        </div>
    );
}
