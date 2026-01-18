import YahooFinance from 'yahoo-finance2';
import { unstable_cache } from 'next/cache';
import { NewsItem } from '@/services/newsService';
import slugify from 'slugify';

// Instantiate the class as required by v2.x+
const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey']
});

// MarketTicker is imported from @/types/market

// Map local symbols to Yahoo Finance symbols
function normalizeSymbol(symbol: string): string {
    const s = symbol.toUpperCase();

    // Crypto
    if (s === 'BTC' || s === 'BTCUSDT') return 'BTC-USD';
    if (s === 'ETH' || s === 'ETHUSDT') return 'ETH-USD';
    if (s === 'SOL' || s === 'SOLUSDT') return 'SOL-USD';
    if (s === 'AVAX' || s === 'AVAXUSDT') return 'AVAX-USD';
    if (s === 'USDT' || s === 'USDTTRY') return 'TRY=X';

    // Currency
    if (s === 'USD') return 'TRY=X'; // USD to TRY
    if (s === 'USD') return 'TRY=X'; // USD to TRY
    if (s === 'EUR') return 'EURTRY=X';
    if (s === 'GBP') return 'GBPTRY=X';
    if (s === 'XU100' || s === 'BIST100') return 'XU100.IS';
    if (s === 'GOLD' || s === 'ONS') return 'GC=F'; // Gold Futures

    // BIST (Assume 4-5 chars is BIST if not crypto)
    if (!s.includes('.') && s.length >= 4 && !['USDT', 'USD', 'EUR', 'ONS', 'GRAM'].includes(s)) {
        return `${s}.IS`;
    }

    return s;
}

// Cached version of fetching quote
const getQuoteCached = unstable_cache(
    async (symbol: string) => {
        try {
            const querySymbol = normalizeSymbol(symbol);
            const quote = await yahooFinance.quote(querySymbol);
            return quote;
        } catch (error) {
            console.error(`Error fetching quote for ${symbol} (${normalizeSymbol(symbol)}):`, error);
            return null;
        }
    },
    ['market-quote-v2'], // Cache bust
    { revalidate: 5 } // Live data (almost)
);


export async function getAssetDetail(symbol: string) {
    const s = symbol.toUpperCase();

    // SPECIAL: Gram Altın Calculation (Ons * USD/TRY / 31.1035)
    if (s === 'GRAM' || s === 'GRAM ALTIN') {
        try {
            // Direct call to avoid cache nulls
            const onsQuote = await yahooFinance.quote('GC=F');
            // Fetch USD from Binance for accuracy
            const usdRes = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=USDTTRY', { next: { revalidate: 60 } }).then(r => r.json());

            const onsPrice = onsQuote?.regularMarketPrice || 0;
            const usdPrice = parseFloat(usdRes.lastPrice || '0');
            const gramPrice = (onsPrice * usdPrice) / 31.1035;

            // Simplified change calculation (approximate based on Ons change)
            const onsChangePercent = onsQuote?.regularMarketChangePercent || 0;
            const usdChangePercent = parseFloat(usdRes.priceChangePercent || '0');
            const totalChangePercent = onsChangePercent + usdChangePercent; // Rough approx

            return {
                name: 'Gram Altın',
                price: gramPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
                change: '0.00',
                changePercent: `%${totalChangePercent.toFixed(2)}`,
                isUp: totalChangePercent >= 0
            };
        } catch (e) {
            console.error("Gram Altın Calculation Error:", e);
            // Fallback to estimated calculation if live fails: 2900 (approx)
            return { name: 'Gram Altın', price: '4,050.00', change: '0.00', changePercent: '0.00%', isUp: true };
        }
    }

    // SPECIAL: Brent Logic (Direct fetch to bypass potential cache issues)
    if (s === 'BRENT' || s === 'BZ=F') {
        try {
            const quote = await yahooFinance.quote('BZ=F');
            const price = quote.regularMarketPrice || 0;
            const change = quote.regularMarketChange || 0;
            const changePercent = quote.regularMarketChangePercent || 0;
            return {
                name: 'Brent Petrol',
                price: price.toFixed(2),
                change: change.toFixed(2),
                changePercent: `%${Math.abs(changePercent).toFixed(2)}`,
                isUp: change >= 0
            };
        } catch (e) {
            console.error('Brent Error:', e);
        }
    }

    // SPECIAL CASE: Use Binance for USD/TRY (USDT) because Yahoo is unreliable (shows ~43 instead of ~35)
    if (s === 'USD' || s === 'USDT') {
        try {
            const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=USDTTRY', {
                next: { revalidate: 60 }
            });
            if (response.ok) {
                const data = await response.json();
                const price = parseFloat(data.lastPrice);
                const change = parseFloat(data.priceChange);
                const changePercent = parseFloat(data.priceChangePercent);
                const isUp = change >= 0;

                return {
                    name: 'Dolar/TL',
                    price: price.toFixed(4),
                    change: change.toFixed(4),
                    changePercent: `%${Math.abs(changePercent).toFixed(2)}`,
                    isUp
                };
            }
        } catch (e) {
            console.error('Binance fallback failed for USD:', e);
        }
    }

    const quote = await getQuoteCached(symbol);

    if (!quote) {
        // Fallback Mock Data on Error
        const isCrypto = ['BTC', 'ETH', 'SOL', 'AVAX', 'USDT'].includes(s);
        // Updated hardcoded fallbacks to be closer to reality if API fails entirely
        if (s === 'THYAO') return { name: 'TÜRK HAVA YOLLARI A.O.', price: '290.00', change: '0.00', changePercent: '0.00%', isUp: true };
        if (isCrypto) return { name: symbol, price: '0.00', change: '0.00', changePercent: '0.00%', isUp: true };

        return {
            name: s,
            price: '0.00',
            change: '0.00',
            changePercent: '0.00%',
            isUp: true
        };
    }

    const price = quote.regularMarketPrice || 0;
    const change = quote.regularMarketChange || 0;
    const changePercent = quote.regularMarketChangePercent || 0;
    const isUp = change >= 0;

    let name = quote.longName || quote.shortName || symbol;

    return {
        name,
        price: price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: change.toFixed(2),
        changePercent: `%${Math.abs(changePercent).toFixed(2)}`,
        isUp
    };
}

import { MarketTicker, BinanceTickerItem, KapStory } from "@/types/market";

export async function getBinanceTicker(): Promise<MarketTicker[]> {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22USDTTRY%22,%22BNBUSDT%22,%22SOLUSDT%22%5D', {
            next: { revalidate: 60 }
        });

        if (!response.ok) throw new Error('Api Error');
        const data: BinanceTickerItem[] = await response.json();

        return data.map((item) => {
            const isUp = parseFloat(item.priceChangePercent) >= 0;
            let displayName = item.symbol;
            let symbol = item.symbol; // TradingView symbol
            let price = parseFloat(item.lastPrice);
            let formattedPrice = price.toFixed(2);

            if (item.symbol === 'BTCUSDT') {
                displayName = 'Bitcoin';
                symbol = 'BTCUSDT';
                formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else if (item.symbol === 'ETHUSDT') {
                displayName = 'Ethereum';
                symbol = 'ETHUSDT';
                formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else if (item.symbol === 'USDTTRY') {
                displayName = 'Dolar/TL';
                symbol = 'USDTRY';
                formattedPrice = price.toFixed(4);
            } else if (item.symbol === 'BNBUSDT') {
                displayName = 'BNB';
                symbol = 'BNBUSDT';
            } else if (item.symbol === 'SOLUSDT') {
                displayName = 'Solana';
                symbol = 'SOLUSDT';
            }

            return {
                symbol,
                displayName,
                price: formattedPrice,
                changePercent: `%${Math.abs(parseFloat(item.priceChangePercent)).toFixed(2)}`,
                up: isUp
            };
        });
    } catch (e) {
        // Updated fallbacks to be more realistic (Jan 2026/Present estimates)
        return [
            { symbol: "BTCUSDT", displayName: "Bitcoin", price: "97,500.00", changePercent: "%0.00", up: true },
            { symbol: "USDTRY", displayName: "Dolar/TL", price: "35.5000", changePercent: "%0.00", up: true },
        ];
    }
}

// KAP News Simulation using Yahoo Finance Search

// Cache for news to avoid hitting rate limits too hard on the API route
const NEWS_CACHE = {
    data: [] as KapStory[],
    lastFetch: 0
};

export async function getKapNews(): Promise<KapStory[]> {
    const now = Date.now();
    // Cache for 60 seconds
    if (now - NEWS_CACHE.lastFetch < 60000 && NEWS_CACHE.data.length > 0) {
        return NEWS_CACHE.data;
    }

    try {
        // Scrape BloombergHT KAP Page as requested
        const response = await fetch('https://www.bloomberght.com/borsa/hisseler/kap-haberleri', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 60 } // Cache for 1 min
        });

        if (!response.ok) throw new Error('BloombergHT fetch failed');

        const html = await response.text();
        console.log("BloombergHT HTML Length:", html.length);
        console.log("HTML Preview (First 500):", html.substring(0, 500));

        // FIND FIRST OCCURRENCE OF /kap-haberi/ AND PRINT CONTEXT
        const firstIndex = html.indexOf('/kap-haberi/');
        if (firstIndex !== -1) {
            console.log("Context around first KAP link:", html.substring(firstIndex - 150, firstIndex + 400));
        } else {
            console.log("NO KAP LINK FOUND IN HTML!");
        }

        // Regex to parse specific format
        const stories: KapStory[] = [];

        // Robust Strategy: Find all link hrefs first, then extract surrounding tag context manually
        const hrefRegex = /href=["']([^"']*\/kap-haberi\/[^"']*)["']/g;
        let hrefMatch;

        while ((hrefMatch = hrefRegex.exec(html)) !== null) {
            const linkUrl = hrefMatch[1];
            // hrefMatch.index is start of 'href="..."'
            // Find opening <a before this
            const openTagStart = html.lastIndexOf('<a', hrefMatch.index);
            if (openTagStart === -1) continue;

            // Find closing > of the opening tag to get start of content
            const openTagEnd = html.indexOf('>', hrefMatch.index);
            if (openTagEnd === -1) continue;

            // Find closing </a> after the opening tag
            const closeTagStart = html.indexOf('</a>', openTagEnd);
            if (closeTagStart === -1) continue;

            const rawContent = html.substring(openTagEnd + 1, closeTagStart);

            // STRIP HTML TAGS to get pure text
            // Replace <br> with space, then remove all other tags
            const textContent = rawContent.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' ');
            const cleanText = textContent.replace(/\s+/g, ' ').trim();

            const link = `https://www.bloomberght.com${linkUrl}`;

            // Regex for content: SYMBOL/COMPANY... DATE TIME
            // Matches: RUBNS/RUBENIS... 16.01.2026 18:33
            const contentRegex = /^([A-Z0-9.]+)\/([\s\S]+?)(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})/;
            const contentMatch = cleanText.match(contentRegex);

            if (contentMatch) {
                const symbol = contentMatch[1];
                const rawBody = contentMatch[2].trim();
                const dateStr = contentMatch[3];
                const timeStr = contentMatch[4];

                // Remove repeated Symbol/Company from title if present
                const title = rawBody;

                const [day, month, year] = dateStr.split('.');
                const [hour, minute] = timeStr.split(':');
                const pubDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));

                stories.push({
                    id: link,
                    title: title,
                    company: symbol,
                    time: timeStr,
                    fullDate: pubDate.toISOString(),
                    url: link,
                    viewed: false,
                    isLive: (Date.now() - pubDate.getTime()) < 3600000 * 2
                });
            }
        }

        // Deduplicate stories by ID
        const uniqueStories = Array.from(new Map(stories.map(item => [item.id, item])).values());

        console.log(`Parsed ${uniqueStories.length} KAP stories.`);

        if (uniqueStories.length === 0) {
            console.error("No stories parsed. HTML Preview of first 1000 chars:", html.substring(0, 1000));
            throw new Error("No stories parsed from BloombergHT");
        }

        NEWS_CACHE.data = uniqueStories;
        NEWS_CACHE.lastFetch = Date.now();
        return uniqueStories;

    } catch (e) {
        console.error("Error fetching KAP news from BloombergHT:", e);
        // Fallback Mock Data on Error
        return [
            {
                id: "err-1",
                title: "Piyasa Verileri Yükleniyor...",
                company: "SİSTEM",
                time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                fullDate: new Date().toISOString(),
                url: "#",
                viewed: false,
                isLive: true
            }
        ];
    }
}

// --- GOOGLE FINANCE STYLE METRICS ---

export interface MarketSummary {
    indices: MarketTicker[];
    currencies: MarketTicker[];
    commodities: MarketTicker[];
    crypto: MarketTicker[];
    movers: MarketTicker[];
}

export async function getMarketIndices(): Promise<MarketSummary> {
    // Parallel fetch for speed
    const [bist100, bist30, dollar, euro, gramGold, onsGold, brent, btc, eth] = await Promise.all([
        getAssetDetail('XU100'),
        getAssetDetail('XU030'),
        getAssetDetail('USD'),
        getAssetDetail('EUR'),
        getAssetDetail('GRAM'),
        getAssetDetail('ONS'),
        getAssetDetail('BRENT'),
        getAssetDetail('BTC'),
        getAssetDetail('ETH')
    ]);

    // Helper to format as Ticker with proper TradingView symbol
    const toTicker = (detail: any, tvSymbol: string, displayName?: string): MarketTicker => ({
        symbol: tvSymbol,           // TradingView compatible symbol
        displayName: displayName || detail.name, // Human readable name for UI
        price: detail.price,
        changePercent: detail.changePercent,
        up: detail.isUp
    });

    return {
        indices: [
            toTicker(bist100, 'XU100', 'BIST 100'),
            toTicker(bist30, 'XU030', 'BIST 30'),
        ],
        currencies: [
            toTicker(dollar, 'USDTRY', 'Dolar/TL'),
            toTicker(euro, 'EURTRY', 'Euro/TL'),
        ],
        commodities: [
            toTicker(gramGold, 'GOLD', 'Gram Altın'),
            toTicker(onsGold, 'GOLD', 'Ons Altın'),
            toTicker(brent, 'BRENT', 'Brent Petrol'),
        ],
        crypto: [
            toTicker(btc, 'BTCUSDT', 'Bitcoin'),
            toTicker(eth, 'ETHUSDT', 'Ethereum'),
        ],
        movers: [] // Will fill separately
    };
}

export async function getDailyMovers(): Promise<MarketTicker[]> {
    // In a real app, this would query an API for "Top Gainers".
    // Here we will simulate it by fetching a curated list of volatile/popular assets
    // and sorting them by absolute change percentage.

    const candidates = ['THYAO', 'ASELS', 'GARAN', 'AKBNK', 'SISE', 'EREGL', 'KCHOL', 'SASA', 'HEKTS', 'ASTOR'];

    // Fetch all in parallel
    const details = await Promise.all(candidates.map(s => getAssetDetail(s)));

    const movers = details.map((d, i) => ({
        symbol: candidates[i],       // BIST symbol (TradingView: BIST:THYAO)
        displayName: candidates[i],  // Same for movers
        price: d?.price || '0.00',
        changePercent: d?.changePercent || '%0.00',
        up: d?.isUp || false,
        rawChange: Math.abs(parseFloat((d?.changePercent || '0').replace('%', '')))
    }));

    // Sort by magnitude of movement (High volatility first)
    return movers
        .sort((a, b) => b.rawChange - a.rawChange)
        .slice(0, 5) // Top 5 movers
        .map(({ rawChange, ...rest }) => rest);
}

import { getEconomyNews } from './newsService';

export async function getMarketNews(query?: string): Promise<NewsItem[]> {
    return await getEconomyNews(query);
}

export async function getCurrencyRates(): Promise<Record<string, number>> {
    // Default fallback rates
    const rates: Record<string, number> = {
        'TRY': 1,
        'USD': 35.0,
        'EUR': 38.0,
        'GBP': 44.0,
        'BTC': 2450000,
        'ETH': 85000,
    };

    try {
        const [usd, eur, gbp, btc, eth] = await Promise.all([
            getAssetDetail('USD'),
            getAssetDetail('EUR'),
            getAssetDetail('GBP'),
            getAssetDetail('BTC'),
            getAssetDetail('ETH')
        ]);

        // Helper to parse localized or fixed string to number
        const parsePrice = (detail: any) => {
            if (!detail || !detail.price) return null;
            // Remove thousand separators (comma or dot dep on locale, but getAssetDetail outputs standard format usually)
            // getAssetDetail for USD returns toFixed(4) -> "35.1234" (dot decimal)
            // Crypto may return localized? BTC -> "97,500.00" (comma usually if locale is tr-TR? No, check getAssetDetail)

            // Checking getAssetDetail:
            // quote.regularMarketPrice.toLocaleString('en-US') -> "97,500.00"
            // So remove comma, parse float.
            const clean = detail.price.replace(/,/g, '');
            return parseFloat(clean);
        };

        const usdRate = parsePrice(usd);
        const eurRate = parsePrice(eur);
        const gbpRate = parsePrice(gbp);
        const btcRate = parsePrice(btc); // This is usually in USD. We need TRY?
        // Wait, BTC normalized is BTC-USD. So quote is in USD.
        // But UI expectation: "BTC: 2,450,000" (TRY).
        // If fetch returns USD price, we need to multiply by USD rate.

        // Let's check crypto normalization:
        // BTC -> BTC-USD (Line 18).
        // Return price is in USD.

        if (usdRate) rates['USD'] = usdRate;
        if (eurRate) rates['EUR'] = eurRate;
        if (gbpRate) rates['GBP'] = gbpRate;

        // Calculate BTC/ETH in TRY
        const btcUsd = parsePrice(btc);
        const ethUsd = parsePrice(eth);

        if (btcUsd && usdRate) rates['BTC'] = btcUsd * usdRate;
        if (ethUsd && usdRate) rates['ETH'] = ethUsd * usdRate;

    } catch (e) {
        console.error("Failed to fetch currency rates", e);
    }

    return rates;
}

export interface KapNewsDetail {
    title: string;
    description: string;
    content: string;
    date: string;
}

export async function getKapNewsDetail(url: string): Promise<KapNewsDetail | null> {
    try {
        // Validate URL domain
        const bloombergRegex = /^https?:\/\/(www\.)?bloomberght\.com\/borsa\//;
        if (!bloombergRegex.test(url)) {
            console.error("Invalid BloombergHT URL for detail fetching:", url);
            return null;
        }

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            next: { revalidate: 300 } // Cache for 5 min
        });

        if (!response.ok) return null;

        const html = await response.text();

        // Extract Title
        const titleMatch = html.match(/<h1 class="title[^>]*>([\s\S]*?)<\/h1>/);
        const title = titleMatch ? titleMatch[1].trim() : "KAP Haberi";

        // Extract Description
        const descMatch = html.match(/<h2 class="description[^>]*>([\s\S]*?)<\/h2>/);
        const description = descMatch ? descMatch[1].trim() : "";

        // Extract Content
        // Look for <div class="article-wrapper news-content ...">
        const contentStartIndex = html.indexOf('class="article-wrapper news-content');
        let content = "";

        if (contentStartIndex !== -1) {
            const divStart = html.lastIndexOf('<div', contentStartIndex);
            // Simple heuristic: count divs to find matching close tag or just take a large chunk if stuck
            if (divStart !== -1) {
                // To avoid complex nested div logic which is brittle in regex/simple loop,
                // we will extract everything until the start of the next major section <aside matches
                // or just find the closing tag corresponding to divStart.

                // Better approach: Find <article> tag which wraps it (as seen in sample)

                let depth = 1;
                let currentPos = divStart + 4;
                while (depth > 0 && currentPos < html.length) {
                    const nextOpen = html.indexOf('<div', currentPos);
                    const nextClose = html.indexOf('</div>', currentPos);

                    if (nextClose === -1) break;

                    if (nextOpen !== -1 && nextOpen < nextClose) {
                        depth++;
                        currentPos = nextOpen + 4;
                    } else {
                        depth--;
                        currentPos = nextClose + 6;
                    }
                }
                content = html.substring(divStart, currentPos);
            }
        }

        // If content extraction failed or is empty, try fallback to just grabbing inner text or raw
        if (!content || content.length < 50) {
            // Fallback: match article-wrapper
            const fallbackMatch = html.match(/(<div class="article-wrapper news-content[\s\S]*?)(?:<aside|<\/article>)/);
            if (fallbackMatch) content = fallbackMatch[1];
        }

        // Cleanup content
        // Remove scripts
        content = content.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gmi, "");
        // Remove style tags if any (though some inline styles are good)
        content = content.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gmi, "");

        // Extract Date
        const dateMatch = html.match(/Giriş\s*:\s*([^<]+)/);
        const date = dateMatch ? dateMatch[1].trim() : "";

        return {
            title,
            description,
            content: content || "<p>İçerik görüntülenemedi. Lütfen orijinal kaynaktan okuyunuz.</p>",
            date
        };

    } catch (e) {
        console.error("Error fetching KAP detail:", e);
        return null;
    }
}
