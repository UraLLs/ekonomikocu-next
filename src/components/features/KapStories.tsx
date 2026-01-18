"use client";

import { useEffect, useState } from "react";
import { KapStory } from "@/types/market";

export default function KapStories() {
    const [stories, setStories] = useState<KapStory[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchStories = async () => {
        try {
            const res = await fetch('/api/kap');
            const data = await res.json();
            if (data.success) {
                setStories(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch KAP stories", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStories();
        // Poll every 60 seconds
        const interval = setInterval(fetchStories, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading && stories.length === 0) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex flex-col items-center gap-2 min-w-[72px]">
                        <div className="w-[66px] h-[66px] rounded-full bg-bg-elevated animate-pulse border-2 border-border-subtle"></div>
                        <div className="w-12 h-2 bg-bg-elevated rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide select-none">
            {stories.map((story) => (
                <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer group min-w-[72px]" title={story.title}>
                    <div className={`p-[3px] rounded-full ${story.viewed ? 'bg-border-subtle' : 'bg-gradient-to-tr from-brand-primary to-accent-blue'}`}>
                        <div className="p-[2px] bg-bg-primary rounded-full relative">
                            <div className="w-14 h-14 rounded-full bg-bg-elevated flex items-center justify-center border-2 border-bg-primary group-hover:scale-105 transition-transform overflow-hidden relative">
                                {/* Company Logo Placeholder or Text */}
                                <span className="font-bold text-[10px] text-text-primary z-10">{story.company}</span>

                                {/* Background Effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                            </div>

                            {/* Live Indicator */}
                            {story.isLive && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-red border-2 border-bg-primary rounded-full animate-bounce"></div>
                            )}
                        </div>
                    </div>
                    <span className="text-[11px] font-medium text-text-secondary text-center truncate w-full group-hover:text-text-primary transition-colors max-w-[72px]">
                        {story.time}
                    </span>
                </div>
            ))}
        </div>
    );
}
