import YahooFinance from 'yahoo-finance2';
import { unstable_cache } from 'next/cache';

// Instantiate the class as required by v2.x+
const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey']
});

export interface MarketTicker {
    symbol: string;
    price: string;
    changePercent: string;
    up: boolean;
}

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
    if (s === 'EUR') return 'EURTRY=X';

    // BIST (Assume 4-5 chars is BIST if not crypto)
    if (!s.includes('.') && s.length >= 4 && !['USDT', 'USD'].includes(s)) {
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
            console.error(`Error fetching quote for ${symbol}:`, error);
            return null;
        }
    },
    ['market-quote'],
    { revalidate: 60 } // Cache for 60 seconds
);

export async function getAssetDetail(symbol: string) {
    const quote = await getQuoteCached(symbol);

    if (!quote) {
        // Fallback Mock Data on Error
        const isCrypto = ['BTC', 'ETH', 'SOL', 'AVAX', 'USDT'].includes(symbol.toUpperCase());
        if (symbol.toUpperCase() === 'THYAO') return { name: 'TÜRK HAVA YOLLARI A.O.', price: '284.50', change: '2.45', changePercent: '1.12%', isUp: true };
        if (isCrypto) return { name: symbol, price: '0.00', change: '0.00', changePercent: '0.00%', isUp: true };

        return {
            name: symbol.toUpperCase(),
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

export async function getBinanceTicker(): Promise<MarketTicker[]> {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22USDTTRY%22,%22BNBUSDT%22,%22SOLUSDT%22%5D', {
            next: { revalidate: 60 }
        });

        if (!response.ok) throw new Error('Api Error');
        const data = await response.json();

        return data.map((item: any) => {
            const isUp = parseFloat(item.priceChangePercent) >= 0;
            let displayName = item.symbol;
            let price = parseFloat(item.lastPrice);
            let formattedPrice = price.toFixed(2);

            if (item.symbol === 'BTCUSDT') {
                displayName = 'BTC/USD';
                formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else if (item.symbol === 'ETHUSDT') {
                displayName = 'ETH/USD';
                formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else if (item.symbol === 'USDTTRY') {
                displayName = 'DOLAR/TL';
                formattedPrice = price.toFixed(4);
            }

            return {
                symbol: displayName,
                price: formattedPrice,
                changePercent: `%${Math.abs(item.priceChangePercent).toFixed(2)}`,
                up: isUp
            };
        });
    } catch (e) {
        return [
            { symbol: "BTC/USD", price: "97,500.00", changePercent: "%0.00", up: true },
            { symbol: "DOLAR/TL", price: "32.5000", changePercent: "%0.00", up: true },
        ];
    }
}
