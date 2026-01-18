'use client';

import React, { useEffect, useRef, memo } from 'react';

export interface TradingViewWidgetProps {
    containerId: string;
    scriptSrc: string;
    scriptHTML?: string; // For widgets that require inner JSON config
    className?: string;
}

const TradingViewWidget = ({ containerId, scriptSrc, scriptHTML, className }: TradingViewWidgetProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Check if script is already injected to prevent duplicates
        if (containerRef.current.querySelector('script')) return;

        const script = document.createElement('script');
        script.src = scriptSrc;
        script.type = 'text/javascript';
        script.async = true;

        if (scriptHTML) {
            script.innerHTML = scriptHTML;
        }

        containerRef.current.appendChild(script);

        return () => {
            // Cleanup often not possible/needed for these widgets as they mutate global state sometimes,
            // but we can try removing the script container content.
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [scriptSrc, scriptHTML]);

    return (
        <div className={`tradingview-widget-container ${className || ''}`} ref={containerRef}>
            <div className="tradingview-widget-container__widget" id={containerId}></div>
        </div>
    );
};

export default memo(TradingViewWidget);
