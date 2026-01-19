import Parser from 'rss-parser';

type RssFeedItem = {
    title: string;
    link: string;
    pubDate: string;
    content: string;
    contentSnippet: string;
    guid: string;
    isoDate: string;
};

const parser = new Parser();

export const RSS_FEEDS = [
    {
        name: 'Bloomberg HT',
        url: 'https://www.bloomberght.com/rss',
        category: 'Finans'
    },
    {
        name: 'CoinTelegraph TR',
        url: 'https://tr.cointelegraph.com/rss',
        category: 'Kripto'
    }
];

export async function fetchRssFeed(url: string) {
    try {
        const feed = await parser.parseURL(url);
        return feed.items as unknown as RssFeedItem[];
    } catch (error) {
        console.error(`Error fetching RSS feed from ${url}:`, error);
        return [];
    }
}
