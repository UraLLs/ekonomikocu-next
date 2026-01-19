import { getEconomyNews, NewsItem } from '@/services/newsService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Ekonomi Haberleri - Ekonomikocu',
    description: 'Guncel ekonomi haberleri, piyasa analizleri ve finansal gelismeler. Yapay zeka destekli haber ozetleri.',
};

// Revalidate every 5 minutes
export const revalidate = 300;

function getTimeAgo(dateString?: string): string {
    if (!dateString) return 'Az once';
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: tr });
    } catch {
        return 'Az once';
    }
}

export default async function HaberlerPage() {
    const news = await getEconomyNews();

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-blue/30">
            <Header />

            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
                {/* MAIN CONTENT */}
                <div className="flex-1 min-w-0">
                    {/* PAGE HEADER */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-text-muted mb-4 uppercase tracking-wider">
                            <Link href="/" className="hover:text-accent-blue transition-colors">Ana Sayfa</Link>
                            <span className="text-white/20">/</span>
                            <span className="text-gray-400">Haberler</span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
                            Ekonomi Haberleri
                        </h1>
                        <p className="text-text-muted text-sm md:text-base">
                            Guncel ekonomi haberleri ve yapay zeka destekli analizler
                        </p>
                    </div>

                    {/* NEWS GRID */}
                    {news.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-6xl mb-4">📰</div>
                            <h2 className="text-xl font-bold text-white mb-2">Haber Bulunamadi</h2>
                            <p className="text-text-muted">Su anda gosterilecek haber bulunmuyor.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {/* FEATURED NEWS (First Item) */}
                            {news[0] && (
                                <Link
                                    href={`/haber/${news[0].slug}?url=${encodeURIComponent(news[0].link || '')}&title=${encodeURIComponent(news[0].title || '')}&image=${encodeURIComponent(news[0].image || '')}&date=${encodeURIComponent(news[0].pubDate || '')}`}
                                    className="group block"
                                >
                                    <article className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-accent-blue/50 transition-all duration-300 hover:shadow-xl hover:shadow-accent-blue/10">
                                        <div className="flex flex-col md:flex-row">
                                            {/* Image */}
                                            <div className="md:w-1/2 aspect-video md:aspect-auto relative overflow-hidden">
                                                {news[0].image ? (
                                                    <img
                                                        src={news[0].image}
                                                        alt={news[0].title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full min-h-[200px] bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center">
                                                        <span className="text-6xl">📊</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1.5 bg-accent-blue text-white text-[10px] font-bold uppercase tracking-wider rounded">
                                                        One Cikan
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="px-2 py-1 bg-white/10 text-text-muted text-[10px] font-medium rounded">
                                                        {news[0].source}
                                                    </span>
                                                    <span className="text-text-muted text-xs">
                                                        {getTimeAgo(news[0].pubDate)}
                                                    </span>
                                                </div>
                                                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-accent-blue transition-colors line-clamp-3">
                                                    {news[0].title}
                                                </h2>
                                                <p className="text-text-muted text-sm line-clamp-2 mb-4">
                                                    {news[0].contentSnippet}
                                                </p>
                                                <div className="flex items-center gap-2 text-accent-blue text-sm font-medium">
                                                    <span>AI Analizi Oku</span>
                                                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            )}

                            {/* REST OF NEWS */}
                            <div className="grid md:grid-cols-2 gap-4">
                                {news.slice(1).map((item, index) => (
                                    <Link
                                        key={item.slug + index}
                                        href={`/haber/${item.slug}?url=${encodeURIComponent(item.link || '')}&title=${encodeURIComponent(item.title || '')}&image=${encodeURIComponent(item.image || '')}&date=${encodeURIComponent(item.pubDate || '')}`}
                                        className="group block"
                                    >
                                        <article className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-accent-blue/30 hover:bg-white/10 transition-all duration-300 h-full flex flex-col">
                                            {/* Image */}
                                            <div className="aspect-video relative overflow-hidden">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                                                        <span className="text-4xl">📰</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 flex-1 flex flex-col">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
                                                        {item.source}
                                                    </span>
                                                    <span className="text-white/20">•</span>
                                                    <span className="text-[10px] text-text-muted">
                                                        {getTimeAgo(item.pubDate)}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-semibold text-white group-hover:text-accent-blue transition-colors line-clamp-2 flex-1">
                                                    {item.title}
                                                </h3>
                                                <div className="mt-3 flex items-center gap-1 text-accent-blue/80 text-xs font-medium">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                    <span>AI Ozet</span>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* SIDEBAR */}
                <Sidebar />
            </div>

            <Footer />
        </main>
    );
}
