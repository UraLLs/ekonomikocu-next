"use client";

import { LIVE_CONFIG } from "@/data/live";

export default function LivePlayer() {
    return (
        <div
            className="relative w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 group"
            style={{ aspectRatio: '16/9' }}
        >
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none z-10" />

            {/* LIVE Badge */}
            {LIVE_CONFIG.isLive && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-accent-red text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wide shadow-lg animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full" />
                    Canlı Yayın
                </div>
            )}

            {/* Viewer Count */}
            {LIVE_CONFIG.isLive && (
                <div className="absolute top-4 left-32 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-md border border-white/10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    {LIVE_CONFIG.viewers.toLocaleString()}
                </div>
            )}

            {/* Embed */}
            <iframe
                src={`https://www.youtube.com/embed/${LIVE_CONFIG.videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`}
                title="Live Stream"
                className="absolute inset-0 w-full h-full z-0 object-cover"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />

            {/* Title Overlay (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-black to-transparent pt-20">
                <h1 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight drop-shadow-lg">
                    {LIVE_CONFIG.title}
                </h1>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center border border-accent-blue/50 text-accent-blue font-bold">
                        EK
                    </div>
                    <span className="text-gray-300 font-medium">{LIVE_CONFIG.host}</span>
                </div>
            </div>
        </div>
    );
}
