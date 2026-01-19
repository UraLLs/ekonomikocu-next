import Link from 'next/link';
import { getDatabaseNews } from '@/services/newsService';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Calendar, ExternalLink } from 'lucide-react';

export const revalidate = 60;

export const metadata = {
    title: 'Finans Haberleri | Ekonomikoçu',
    description: 'Piyasalardan en güncel son dakika haberleri.',
};

export default async function NewsPage() {
    const news = await getDatabaseNews(false); // Only published

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-5xl mx-auto p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black mb-2">Piyasa Haberleri</h1>
                    <p className="text-text-muted">Anlık finans ve ekonomi gelişmeleri.</p>
                </div>

                <div className="space-y-4">
                    {news.length === 0 ? (
                        <div className="text-center py-20 bg-bg-surface rounded-xl border border-white/5">
                            <p className="text-text-muted">Henüz yayınlanmış haber yok.</p>
                        </div>
                    ) : (
                        news.map((item) => (
                            <div key={item.id} className="bg-bg-surface border border-white/5 rounded-xl p-5 hover:border-brand-primary/30 transition-colors">
                                <Link href={`/haberler/${item.slug}`} className="block group">
                                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                                        {item.image_url && (
                                            <div className="w-full md:w-48 h-32 shrink-0 rounded-lg overflow-hidden relative border border-white/5">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 text-xs text-text-muted mb-2">
                                                <span className="bg-white/5 px-2 py-0.5 rounded text-text-secondary font-bold">
                                                    {item.source || 'Haber'}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.published_at).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h2 className="text-lg font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                                                {item.title}
                                            </h2>
                                            {item.summary && (
                                                <p className="text-text-secondary text-sm line-clamp-2">
                                                    {item.summary}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Link>

                                {item.url && (
                                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-text-muted hover:text-white flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-3 h-3" /> Kaynağına Git
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
