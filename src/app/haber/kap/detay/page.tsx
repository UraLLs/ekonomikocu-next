
import React from 'react';
import Link from 'next/link';
import { getKapNewsDetail } from '@/services/marketService';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';


interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function KapDetayPage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const url = typeof sp.url === 'string' ? sp.url : null;


    if (!url) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-text-primary p-4">
                <h1 className="text-2xl font-bold mb-4">Haber Bulunamadı</h1>
                <p className="mb-4">Geçersiz URL parametresi.</p>
                <Link href="/" className="text-brand-primary hover:underline">Anasayfaya Dön</Link>
            </div>
        );
    }

    const news = await getKapNewsDetail(url);

    if (!news) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-text-primary p-4">
                <h1 className="text-2xl font-bold mb-4">Haber Yüklenemedi</h1>
                <p className="mb-4">KAP haberi kaynaktan alınırken bir hata oluştu veya içerik silinmiş olabilir.</p>
                <Link href="/" className="text-brand-primary hover:underline">Anasayfaya Dön</Link>
            </div>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-6">
                <Link href="/" className="text-sm text-text-secondary hover:text-brand-primary transition-colors flex items-center gap-1">
                    ← Geri Dön
                </Link>
            </div>

            <article className="bg-bg-elevated border border-border-subtle rounded-xl p-6 md:p-10 shadow-lg">
                <header className="mb-8 border-b border-border-subtle pb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            KAP Haberi
                        </span>
                        <span className="text-text-secondary text-xs">
                            {news.date}
                        </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-3 leading-tight">
                        {news.title}
                    </h1>

                    {news.description && (
                        <h2 className="text-lg md:text-xl text-text-secondary leading-relaxed">
                            {news.description}
                        </h2>
                    )}
                </header>

                <div className="prose prose-invert max-w-none prose-a:text-brand-primary prose-headings:text-text-primary prose-strong:text-text-primary prose-td:border-border-subtle prose-th:text-text-secondary">
                    <div dangerouslySetInnerHTML={{ __html: news.content }} />
                </div>

                <footer className="mt-10 pt-6 border-t border-border-subtle flex justify-between items-center text-sm text-text-secondary">
                    <div>
                        Kaynak: Bloomberg HT
                    </div>
                    <Link href="/" className="text-brand-primary hover:underline">
                        Anasayfaya Dön
                    </Link>
                </footer>
            </article>
        </main>
    );
}
