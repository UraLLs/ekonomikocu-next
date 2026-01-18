
import { NewsItem } from '@/services/newsService';
import slugify from 'slugify';
import Parser from 'rss-parser';

const parser = new Parser();

// Curated High-Quality Finance Images (Unsplash)
const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=500', // Stock Chart Blue
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=500', // Stock Chart Dark
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500', // Data Screen
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=500', // Stock Chart Dark (Replaced broken blue chart)
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=500', // Bitcoin/Crypto (Abstract)
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=500', // Business/Analytics
    'https://images.unsplash.com/photo-1565514020176-dbf2277f3a67?auto=format&fit=crop&q=80&w=500'  // Turkish Lira Coins
];

export async function getProfessionalNews(query?: string): Promise<NewsItem[]> {
    try {
        // Construct Google News TR Query
        // If general -> "Ekonomi" or "Borsa"
        // If asset -> "THYAO", "BIST100", etc.
        const searchTerm = (!query || query === 'general') ? 'Ekonomi' : query;

        // URL for Google News RSS (Turkey Edition)
        // hl=tr (Turkish Interface), gl=TR (Turkey Region), ceid=TR:tr (Country:Language)
        // Use 'search' endpoint in RSS
        const url = `https://news.google.com/rss/search?q=${encodeURIComponent(searchTerm)}&hl=tr&gl=TR&ceid=TR:tr`;

        console.log(`Fetching Google RSS (TR): ${searchTerm}`);


        const feed = await parser.parseURL(url);

        if (!feed.items || feed.items.length === 0) {
            throw new Error("RSS returned no items");
        }

        // Return Top 15 Items
        const initialItems = feed.items.slice(0, 15).map((item, index) => {
            const title = item.title || 'Başlıksız Haber';
            const slug = slugify(title, { lower: true, strict: true, locale: 'tr' }) + '-' + Math.floor(Math.random() * 1000);

            // 1. Try to find real image in various RSS fields
            let image = undefined;

            // Check content string for img tag
            if (!image && item.content) {
                const imgMatch = item.content.match(/src=["'](.*?)["']/);
                if (imgMatch) image = imgMatch[1];
            }

            // Check 'content:encoded' if available
            if (!image && item['content:encoded']) {
                const imgMatch = item['content:encoded'].match(/src=["'](.*?)["']/);
                if (imgMatch) image = imgMatch[1];
            }

            // Check description if available
            if (!image && item.description) {
                const imgMatch = item.description.match(/src=["'](.*?)["']/);
                if (imgMatch) image = imgMatch[1];
            }

            // Filter out tracking pixels or tiny icons (common in Google RSS)
            if (image && image.includes('tracker')) image = undefined;
            if (image && image.includes('1x1')) image = undefined;

            // 2. Fallback to Random Professional Image (Deterministic based on title length or random slug)
            if (!image) {
                // Pick an image based on title length to keep it consistent for same news, but varied across list
                const imageIndex = (title.length + index) % FALLBACK_IMAGES.length;
                image = FALLBACK_IMAGES[imageIndex];
            }

            // Clean source name (Google News format: "Title - Source")
            let finalTitle = title;
            let sourceName = 'Google News';

            const lastDash = title.lastIndexOf(' - ');
            if (lastDash > -1) {
                sourceName = title.substring(lastDash + 3);
                finalTitle = title.substring(0, lastDash);
            }

            return {
                id: slug,
                title: finalTitle,
                slug: slug,
                link: item.link || '#',
                pubDate: item.pubDate || new Date().toISOString(),
                contentSnippet: item.contentSnippet || item.content || finalTitle,
                source: sourceName,
                image: image,
                sentiment: 'NEUTRAL' as const
            };
        });

        // 2. SMART NEWS ENRICHMENT (Gemini + Market Data)
        // Extract plain objects for Gemini (Top 6 only to save tokens)
        const newsItems = [...initialItems]; // Clone

        // !!! STABILIZATION: BYPASSING ENRICHMENT TO ENSURE NEWS DISPLAY !!!
        return newsItems;

    } catch (error) {
        // Warn instead of error for cleaner logs on expected RSS failures
        console.warn("Google News RSS failed or empty, switching to Yahoo Finance fallback.");

        // --- FALLBACK: YAHOO FINANCE SEARCH ---
        try {
            const { default: YahooFinance } = await import('yahoo-finance2');
            const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

            const result = await yahooFinance.search(query || 'Ekonomi', { newsCount: 10 });

            // Type assertion to handle potential v2 interface (Date or number)
            const newsResult = result as unknown as { news?: Array<{ uuid?: string; title: string; link: string; providerPublishTime: Date | number; publisher?: string }> };

            if (newsResult.news && newsResult.news.length > 0) {
                return newsResult.news.map((item, index) => {
                    const imageIndex = (item.title.length + index) % FALLBACK_IMAGES.length;
                    const image = FALLBACK_IMAGES[imageIndex];

                    // Handle Date or Number for time
                    const pubTime = item.providerPublishTime instanceof Date
                        ? item.providerPublishTime.toISOString()
                        : new Date((item.providerPublishTime || 0) * 1000).toISOString();

                    return {
                        id: item.uuid || `yf-${index}`,
                        title: item.title,
                        slug: slugify(item.title, { lower: true, strict: true, locale: 'tr' }),
                        link: item.link,
                        pubDate: pubTime,
                        contentSnippet: item.title,
                        source: item.publisher || 'Yahoo Finance',
                        image: image,
                        sentiment: 'NEUTRAL' as const
                    };
                });
            }
        } catch (fallbackError) {
            console.error("Fallback Yahoo News also failed:", fallbackError);
        }

        // --- ULTIMATE FALLBACK: STATIC MOCK DATA ---
        // If everything fails (Network, API, Parsing), show these generic items so UI is not empty.
        console.warn("Using Component-Level Mock Data for News");
        return [
            {
                id: 'mock-1',
                title: 'Borsa İstanbul güne yükselişle başladı',
                slug: 'borsa-istanbul-gune-yukselisle-basladi',
                link: 'https://www.kap.org.tr',
                pubDate: new Date().toISOString(),
                contentSnippet: 'BIST 100 endeksi, güne önceki kapanışa göre artışla başladı.',
                source: 'Borsa Gündem',
                image: FALLBACK_IMAGES[0],
                sentiment: 'POSITIVE'
            },
            {
                id: 'mock-2',
                title: 'Küresel piyasalarda gözler enflasyon verilerinde',
                slug: 'kuresel-piyasalar-enflasyon',
                link: 'https://www.bloomberght.com',
                pubDate: new Date(Date.now() - 3600000).toISOString(),
                contentSnippet: 'ABD ve Avrupa enflasyon verileri piyasaların yönü üzerinde etkili olacak.',
                source: 'Bloomberg HT',
                image: FALLBACK_IMAGES[1],
                sentiment: 'NEUTRAL'
            },
            {
                id: 'mock-3',
                title: 'Teknoloji hisselerinde ralli beklentisi',
                slug: 'teknoloji-hisselerinde-ralli',
                link: 'https://www.investing.com',
                pubDate: new Date(Date.now() - 7200000).toISOString(),
                contentSnippet: 'Yapay zeka odaklı şirketlere olan ilgi artarak devam ediyor.',
                source: 'Investing.com',
                image: FALLBACK_IMAGES[2],
                sentiment: 'POSITIVE'
            },
            {
                id: 'mock-4',
                title: 'Altın fiyatları rekor seviyelere yaklaşıyor',
                slug: 'altin-fiyatlari-rekor',
                link: 'https://www.doviz.com',
                pubDate: new Date(Date.now() - 10800000).toISOString(),
                contentSnippet: 'Merkez bankalarının alımları altını desteklemeye devam ediyor.',
                source: 'Döviz.com',
                image: FALLBACK_IMAGES[3],
                sentiment: 'POSITIVE'
            }
        ];
    }
}
