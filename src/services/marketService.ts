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
        // Search news for major BIST companies to simulate KAP stream
        const symbols = ["THYAO.IS", "GARAN.IS", "ASELS.IS", "KCHOL.IS", "AKBNK.IS", "EREGL.IS", "SISE.IS", "BIMAS.IS"];

        // "Ekonomi" seems to return better results than "Borsa Istanbul" or "Turkey Economy" currently
        // Alternatively use "BIST" combined with specific companies if needed.
        // For KAP stream simulation, let's use "Turkish Economy" or "Borsa Istanbul" 
        // Although test showed "Borsa Istanbul" matches some reports.
        const result = await yahooFinance.search("Ekonomi", { newsCount: 10 });

        const rawNews = result.news || [];

        if (rawNews.length === 0) {
            throw new Error("No news found");
        }

        const stories: KapStory[] = rawNews.map((item: any) => {
            // Generate a realistic "Company" tag if possible, otherwise generic
            let company = "KAP";
            if (item.title.includes("THY")) company = "THYAO";
            else if (item.title.includes("Garanti")) company = "GARAN";
            else if (item.title.includes("Aselsan")) company = "ASELS";
            else if (item.title.includes("Koç")) company = "KCHOL";
            else if (item.title.includes("Akbank")) company = "AKBNK";
            else if (item.title.includes("Ereğli")) company = "EREGL";
            else if (item.title.includes("Borsa")) company = "BIST";
            else company = "BIST";

            return {
                id: item.uuid || Buffer.from(item.title).toString('base64').substring(0, 10),
                title: item.title,
                company,
                time: new Date(item.providerPublishTime * 1000).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                fullDate: new Date(item.providerPublishTime * 1000).toISOString(),
                url: item.link,
                viewed: false,
                isLive: true
            };
        });

        NEWS_CACHE.data = stories;
        NEWS_CACHE.lastFetch = now;
        return stories;

    } catch (e) {
        console.error("Error fetching KAP news:", e);
        // NO MOCK DATA as requested
        return [];
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
