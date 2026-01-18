"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import SentimentGauge from "./SentimentGauge";
import CommentFeed from "./war-room/CommentFeed";
import MarketPulse from "./war-room/MarketPulse";

interface WarRoomProps {
    symbol: string;
    initialComments: Comment[];
}

// Define Comment Interface (shared effectively)
interface Comment {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    symbol: string | null;
    profiles?: {
        username: string;
        avatar_url?: string;
        level?: number;
        badges?: string[];
    };
}

export default function WarRoom({ symbol, initialComments }: WarRoomProps) {
    const supabase = createClient();
    // Removed Chat state logic as we switched to Market Pulse (Signal Stream)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
            {/* LEFT COLUMN: Main Discussion (Async Comments) - 2/3 width */}
            <div className="lg:col-span-2 h-full max-h-full overflow-hidden">
                <CommentFeed symbol={symbol} initialComments={initialComments} />
            </div>

            {/* RIGHT COLUMN: Live Sentinel (Sentiment + Market Pulse) - 1/3 width */}
            <div className="flex flex-col gap-6 h-full overflow-hidden">
                {/* 1. Sentiment Gauge - Flexible Height (Auto) */}
                <div className="flex-shrink-0 h-auto">
                    <SentimentGauge symbol={symbol} />
                </div>

                {/* 2. Market Pulse (Automated Signals) - Fills remaining height */}
                <div className="flex-1 min-h-0">
                    <MarketPulse />
                </div>
            </div>
        </div>
    );
}
