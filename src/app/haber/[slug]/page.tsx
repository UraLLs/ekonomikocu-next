
import { getNewsDetail } from '@/services/newsService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { notFound } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';

// Increase timeout for AI generation
export const maxDuration = 60;

type Props = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { slug } = await params;
    const sp = await searchParams;
    const title = typeof sp.title === 'string' ? sp.title : 'Haber Detayı';

    return {
        title: `${title} - Ekonomikoçu AI`,
        description: 'Yapay zeka destekli piyasa analizi ve haber özeti.',
    };
}

import Sidebar from '@/components/layout/Sidebar';

// ... imports remain the same

export default async function NewsDetailPage({ params, searchParams }: Props) {
    const { slug } = await params;
    const sp = await searchParams;

    // Extract query params for initial generation
    const originalLink = typeof sp.url === 'string' ? sp.url : undefined;
    const title = typeof sp.title === 'string' ? sp.title : undefined;
    const image = typeof sp.image === 'string' ? sp.image : undefined; // Now extracting image

    // Default to current time if missing
    const dateStr = typeof sp.date === 'string' ? sp.date : new Date().toISOString();

    const article = await getNewsDetail(slug, originalLink, title, image, dateStr);

    if (!article) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary selection:bg-accent-blue/30">
            <Header />

            <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-8">

                {/* LEFT COLUMN: ARTICLE CONTENT */}
                <article className="flex-1 min-w-0">
                    {/* BREADCRUMB */}
                    <div className="flex items-center gap-2 text-[11px] font-medium text-text-muted mb-6 uppercase tracking-wider">
                        <a href="/" className="hover:text-accent-blue transition-colors">Ana Sayfa</a>
                        <span className="text-white/20">/</span>
                        <a href="/" className="hover:text-accent-blue transition-colors">Haberler</a>
                        <span className="text-white/20">/</span>
                        <span className="text-gray-400 truncate max-w-[200px] md:max-w-none">{article.title}</span>
                    </div>

                    {/* HERO IMAGE */}
                    {article.image && (
                        <div className="w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden mb-8 relative shadow-2xl border border-white/10 group">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-60"></div>

                            {/* Source Badge on Image */}
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded border border-white/10 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse"></span>
                                    {article.source || 'NTV Ekonomi'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* HERO HEADER */}
                    <header className="mb-10">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <span className="px-2.5 py-1 bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-bold uppercase tracking-wider rounded">
                                ✨ AI Analizi
                            </span>
                            {article.sentiment && (
                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${article.sentiment === 'POSITIVE' ? 'bg-accent-green/10 border-accent-green/20 text-accent-green' :
                                    article.sentiment === 'NEGATIVE' ? 'bg-accent-red/10 border-accent-red/20 text-accent-red' :
                                        'bg-gray-500/10 border-gray-500/20 text-gray-500'
                                    }`}>
                                    Piyasa Yönü: {article.sentiment === 'POSITIVE' ? 'POZİTİF 🚀' : article.sentiment === 'NEGATIVE' ? 'NEGATİF 📉' : 'NÖTR 😐'}
                                </span>
                            )}
                            <span className="text-xs text-text-muted font-mono ml-auto">
                                {formatDistanceToNow(new Date(article.pubDate), { addSuffix: true, locale: tr })}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.15] mb-6 tracking-tight">
                            {article.title}
                        </h1>

                        {/* AI SUMMARY CARD (PREMIUM) */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group hover:border-accent-blue/30 transition-colors">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-accent-blue/20 transition-all duration-500"></div>

                            <h3 className="flex items-center gap-2 text-accent-blue font-bold mb-5 text-sm md:text-base uppercase tracking-widest relative z-10">
                                <div className="p-1.5 rounded-lg bg-accent-blue/20">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </div>
                                Ekonomikoçu Özeti
                            </h3>

                            <div className="prose prose-invert prose-sm max-w-none text-gray-300 relative z-10">
                                {article.summary?.startsWith('⚠️') ? (
                                    <div className="p-4 bg-accent-red/10 border border-accent-red/20 rounded-lg text-red-200 text-xs whitespace-pre-wrap font-mono relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-red"></div>
                                        {article.summary}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {article.summary?.split('- ').map((line, i) => (
                                            line.trim() ? (
                                                <div key={i} className="flex gap-3 items-start group/item">
                                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent-blue group-hover/item:scale-125 group-hover/item:bg-accent-green transition-all shrink-0"></span>
                                                    <span className="leading-relaxed">{line}</span>
                                                </div>
                                            ) : null
                                        )) || <p>{article.contentSnippet}</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* CONTENT BODY */}
                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:text-gray-300 prose-p:leading-relaxed prose-li:text-gray-300 prose-strong:text-white prose-a:text-accent-blue">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-10 mb-6 flex items-center gap-3 after:content-[''] after:flex-1 after:h-px after:bg-white/10" {...props} />,
                                h2: ({ node, ...props }) => <h3 className="text-xl font-bold text-gray-100 mt-8 mb-4 border-l-4 border-accent-green pl-4" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-6 text-[17px] leading-8 text-gray-300/90 font-normal" {...props} />,
                                ul: ({ node, ...props }) => <ul className="space-y-3 my-6 bg-white/5 p-6 rounded-2xl border border-white/5" {...props} />,
                                li: ({ node, ...props }) => <li className="flex gap-3 items-start" {...props}><span className="mt-2 w-1 h-1 bg-gray-500 rounded-full shrink-0"></span><span>{props.children}</span></li>,
                                strong: ({ node, ...props }) => <strong className="text-white font-bold decoration-accent-blue/30 underline decoration-2 underline-offset-2" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-accent-purple/50 pl-6 py-4 my-8 bg-gradient-to-r from-accent-purple/5 to-transparent italic text-lg text-gray-300 rounded-r-xl" {...props} />,
                            }}
                        >
                            {article.content || article.contentSnippet || ''}
                        </ReactMarkdown>
                    </div>

                    {/* SOURCE FOOTER */}
                    <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
                        <div className="flex items-center gap-2 text-text-muted">
                            <svg className="w-5 h-5 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>Bu içerik yapay zeka ile özetlenmiştir.</span>
                        </div>
                        <a href={article.link} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 group">
                            Kaynağa Git (NTV)
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        </a>
                    </div>
                </article>

                {/* RIGHT COLUMN: SIDEBAR */}
                <Sidebar />
            </div>

            <Footer />
        </main>
    );
}
