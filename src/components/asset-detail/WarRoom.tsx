"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import CommentFeed from "./war-room/CommentFeed";

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

    return (
        <div className="h-full">
            <CommentFeed symbol={symbol} initialComments={initialComments} />
        </div>
    );
}
