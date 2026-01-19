import { getNewsBySlug } from '@/services/newsService';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const newsItem = await getNewsBySlug(decodedSlug);

    if (!newsItem) {
        return {
            title: 'Haber Bulunamadı',
        };
    }

    return {
        title: `${newsItem.title} | Ekonomikoçu Haber`,
        description: newsItem.summary || newsItem.title,
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug); // Fix 404 on Turkish chars
    const item = await getNewsBySlug(decodedSlug);

    if (!item) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-3xl mx-auto px-4 py-8">
                <Link href="/haberler" className="inline-flex items-center gap-2 text-text-muted hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Tüm Haberler
                </Link>

                <article className="bg-bg-surface border border-white/5 rounded-2xl p-6 md:p-10 shadow-xl">
                    <header className="mb-6">
                        <div className="flex items-center gap-3 text-sm text-text-muted mb-4 font-mono">
                            <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full font-bold">
                                {item.category || 'Genel'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(item.published_at).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}
                            </span>
                        </div>

                        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4">
                            {item.title}
                        </h1>

                        {item.image_url && (
                            <div className="w-full aspect-video relative rounded-xl overflow-hidden mb-6 border border-white/5">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="text-sm text-text-muted">
                            Kaynak: <span className="font-bold text-white">{item.source}</span>
                        </div>
                    </header>

                    <div className="prose prose-invert max-w-none text-text-secondary leading-relaxed">
                        {item.summary && <p className="text-lg font-medium text-white mb-6 border-l-4 border-brand-primary pl-4">{item.summary}</p>}

                        {/* If we had full content, render it here. For RSS, we usually have summary or HTML content */}
                        <div dangerouslySetInnerHTML={{ __html: item.content || '' }} />
                    </div>

                    {item.url && (
                        <div className="mt-8 pt-6 border-t border-white/10">
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-all"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Haberin Devamını Kaynağında Oku
                            </a>
                        </div>
                    )}
                </article>
            </div>

            <Footer />
        </main>
    );
}
