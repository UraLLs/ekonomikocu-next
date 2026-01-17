import Parser from 'rss-parser';

const parser = new Parser({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
});

export interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    contentSnippet: string;
    content: string;
    image?: string;
    source: string;
}

export async function getEconomyNews(): Promise<NewsItem[]> {
    console.log("RSS Fetching started (NTV Source)...");
    try {
        const feed = await parser.parseURL('https://www.ntv.com.tr/ekonomi.rss');
        console.log(`RSS Fetched: ${feed.items.length} items found.`);

        return feed.items.map(item => {
            // NTV RSS usually has content in description or content
            // We need to be careful with image extraction.

            let imageUrl: string | undefined = undefined;
            if (item.enclosure?.url) {
                imageUrl = item.enclosure.url;
            } else if (item.content?.includes('<img')) {
                // extract if needed
            }

            return {
                title: item.title || 'Başlıksız Haber',
                link: item.link || '#',
                pubDate: item.pubDate || new Date().toISOString(),
                contentSnippet: item.contentSnippet || '',
                content: item.content || '',
                image: imageUrl,
                source: 'NTV Ekonomi'
            };
        }).slice(0, 10); // Get top 10 news
    } catch (error) {
        console.error("RSS Fetch Error:", error);
        return [];
    }
}
