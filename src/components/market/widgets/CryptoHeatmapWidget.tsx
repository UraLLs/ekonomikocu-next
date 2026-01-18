'use client';

import React from 'react';
import TradingViewWidget from '../TradingViewWidget';

export default function CryptoHeatmapWidget() {
    const config = JSON.stringify({
        "dataSource": "Crypto",
        "blockSize": "market_cap_calc",
        "blockColor": "change",
        "locale": "tr",
        "symbolUrl": "",
        "colorTheme": "dark",
        "hasTopBar": false,
        "isTransparent": true,
        "ranges": [
            "vol",
            "5d",
            "1m",
            "3m",
            "6m",
            "ytd",
            "1y",
            "all"
        ],
        "width": "100%",
        "height": "500"
    });

    return (
        <div className="w-full h-[540px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2">
                    🔥 Kripto Isı Haritası
                </h3>
            </div>
            <TradingViewWidget
                containerId="crypto-heatmap-widget"
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js"
                scriptHTML={config}
                className="w-full h-full pb-4"
            />
        </div>
    );
}
