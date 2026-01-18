'use client';

import React from 'react';
import TradingViewWidget from '../TradingViewWidget';

export default function EconomicCalendar() {
    const config = JSON.stringify({
        "width": "100%",
        "height": "600",
        "colorTheme": "dark",
        "isTransparent": true,
        "locale": "tr",
        "importanceFilter": "0,1",
        "countryFilter": "tr,us,eu,gb,de,cn,jp",
    });

    return (
        <div className="w-full h-[600px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                <h3 className="font-bold text-lg text-gray-100 flex items-center gap-2">
                    📅 Ekonomik Takvim
                </h3>
            </div>
            <TradingViewWidget
                containerId="economic-calendar-widget"
                scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-events.js"
                scriptHTML={config}
                className="w-full h-full"
            />
        </div>
    );
}
