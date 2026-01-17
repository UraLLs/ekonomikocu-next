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
                        <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="block group relative">
                            <div className="flex justify-between items-start mb-1">
                                {index === 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-red opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-red"></span>
                                    </span>
                                )}
                                <div className="text-[10px] text-gray-500 font-mono mb-1">
                                    {formatDistanceToNow(new Date(item.pubDate), { addSuffix: true, locale: tr })}
                                </div>
                            </div>
                            <h4 className="text-sm font-medium text-gray-200 leading-snug group-hover:text-accent-blue transition-colors cursor-pointer">
                                {item.title}
                            </h4>
                            <div className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                {item.source}
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
