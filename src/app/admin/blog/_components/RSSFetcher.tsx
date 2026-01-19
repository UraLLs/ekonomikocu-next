'use client';

import { useState, useTransition } from 'react';
import { fetchAndSaveNews } from '@/actions/rss';
import { RefreshCw, DownloadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RSSFetcher() {
    const [isPending, startTransition] = useTransition();
    const [lastResult, setLastResult] = useState<{ newAdded: number, totalFound: number } | null>(null);

    const router = useRouter();

    const handleFetch = () => {
        startTransition(async () => {
            try {
                const result = await fetchAndSaveNews();
                setLastResult(result);
                router.refresh();
                // Clear result message after 5 seconds
                setTimeout(() => setLastResult(null), 5000);
            } catch (error) {
                console.error("Failed to fetch news:", error);
                alert("Haberler çekilirken bir hata oluştu.");
            }
        });
    };

    return (
        <div className="flex items-center gap-4">
            {lastResult && (
                <span className="text-xs font-bold text-accent-green animate-in fade-in slide-in-from-right-4">
                    +{lastResult.newAdded} Yeni Haber Eklendi
                </span>
            )}

            <button
                onClick={handleFetch}
                disabled={isPending}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-sm font-medium border border-white/5"
            >
                {isPending ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                    <DownloadCloud className="w-4 h-4" />
                )}
                {isPending ? 'Çekiliyor...' : 'Haberleri Getir'}
            </button>
        </div>
    );
}
