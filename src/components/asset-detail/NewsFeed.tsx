"use client";

import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

// Match the NewsItem interface from newsService/newsApiService
interface NewsItem {
    title: string;
    link: string;       // Changed from 'url' 
    slug?: string;
    source: string;
    pubDate: string;    // Changed from 'published_at'
    image?: string;     // Changed from 'image_url'
    contentSnippet?: string;
}

interface NewsFeedProps {
    news: NewsItem[];
    viewMode?: 'preview' | 'full';
}

// Helper for safe date formatting
const formatDateSafe = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            return "Az önce"; // Fallback for invalid date
        }
        return formatDistanceToNow(date, { addSuffix: true, locale: tr });
    } catch (e) {
        return "Az önce";
    }
};

export default function NewsFeed({ news, viewMode = 'preview' }: NewsFeedProps) {
    if (!news || news.length === 0) {
        return (
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-gray-400 text-sm text-center">
                Bu varlık için güncel haber bulunamadı.
            </div>
        );
    }

    // Filter out items with missing link or title
    const validNews = news.filter(item => item.link && item.title && item.link !== '#');
    const displayNews = viewMode === 'preview' ? validNews.slice(0, 3) : validNews;

    if (validNews.length === 0) {
        return (
            <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-gray-400 text-sm text-center">
                Bu varlık için güncel haber bulunamadı.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {displayNews.map((item, index) => (
                <Link
                    key={index}
                    href={item.link}
                    target="_blank"
                    className="group bg-bg-surface border border-border-subtle rounded-xl p-4 flex gap-4 hover:border-accent-blue/50 transition-all hover:bg-bg-surface-hover"
                >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden relative border border-white/5">
                        <ImageWithFallback
                            src={item.image ?? undefined}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded">
                                    {item.source}
                                </span>
                                <span className="text-xs text-text-muted">
                                    {formatDateSafe(item.pubDate)}
                                </span>
                            </div>
                            <h3 className="font-bold text-text-primary text-sm leading-snug group-hover:text-accent-blue transition-colors line-clamp-2">
                                {item.title}
                            </h3>
                        </div>
                    </div>
                </Link>
            ))}

            {viewMode === 'preview' && news.length > 3 && (
                <div className="text-center mt-2">
                    <span className="text-sm text-accent-blue font-bold cursor-pointer hover:underline">
                        Daha fazla haber göster
                    </span>
                </div>
            )}
        </div>
    );
}
