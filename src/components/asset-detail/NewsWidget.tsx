"use client";

import { NewsItem } from "@/services/newsService";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface NewsWidgetProps {
    news: NewsItem[];
}

export default function NewsWidget({ news }: NewsWidgetProps) {
    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                <h3 className="font-bold text-gray-100 text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">📰</span> Son Dakika
                </h3>
                <span className="text-[10px] text-accent-blue uppercase tracking-widest font-mono animate-pulse">
                    LIVE FEED
                </span>
            </div>

            {/* News List */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-2">
                {news.length === 0 ? (
                    <div className="text-sm text-gray-500 text-center py-4">Haber akışı bekleniyor...</div>
                ) : (
                    news.map((item, index) => (
                        <a key={index} href={`/haber/${item.slug}?url=${encodeURIComponent(item.link)}&title=${encodeURIComponent(item.title)}&date=${encodeURIComponent(item.pubDate)}&image=${encodeURIComponent(item.image || "")}`} className="flex gap-3 group relative p-2 rounded-xl border border-transparent hover:border-white/10 hover:bg-white/5 transition-all duration-300">
                            {/* Image Thumbnail */}
                            {item.image && (
                                <div className="w-[60px] h-[60px] flex-shrink-0 rounded-lg overflow-hidden relative border border-white/10">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none'; // Hide if broken
                                        }}
                                    />
                                </div>
                            )}

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    {index === 0 && (
                                        <span className="absolute top-2 right-2 flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-red"></span>
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-xs font-semibold text-gray-200 leading-snug group-hover:text-accent-blue transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                                <div className="text-[10px] text-gray-500 font-mono mt-1 flex items-center gap-1 flex-wrap">
                                    <span>{formatDistanceToNow(new Date(item.pubDate), { addSuffix: true, locale: tr })}</span>
                                    <span className="w-0.5 h-0.5 rounded-full bg-gray-600"></span>
                                    <span>{item.source}</span>
                                    {item.relatedTicker && (
                                        <>
                                            <span className="w-0.5 h-0.5 rounded-full bg-gray-600"></span>
                                            <span className={`font-bold ${item.relatedTicker.isUp ? 'text-accent-green' : 'text-accent-red'}`}>
                                                {item.relatedTicker.symbol} {item.relatedTicker.changePercent}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </a>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 text-center">
                <a href="https://www.ntv.com.tr/ekonomi" target="_blank" className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors">
                    Tüm Haberleri Gör →
                </a>
            </div>
        </div>
    );
}
