// import yahooFinance from 'yahoo-finance2'; // Commented out for now
// import { unstable_cache } from 'next/cache';

export interface MarketTicker {
    symbol: string;
    price: string;
    changePercent: string;
    up: boolean;
}

// Temporary Fallback Mock Service
// We will re-enable Yahoo Finance after verifying the import in isolation.

export async function getAssetDetail(symbol: string) {
    // Mock Data Logic moved back here
    const isCrypto = ['BTC', 'ETH', 'SOL', 'AVAX', 'USDT'].includes(symbol.toUpperCase());

    if (isCrypto) {
        if (symbol.toUpperCase() === 'BTC') return { name: 'Bitcoin', price: '97,450.00', change: '2,450.00', changePercent: '2.40%', isUp: true };
        if (symbol.toUpperCase() === 'ETH') return { name: 'Ethereum', price: '3,450.00', change: '-12.00', changePercent: '0.35%', isUp: false };
        if (symbol.toUpperCase() === 'SOL') return { name: 'Solana', price: '145.00', change: '5.00', changePercent: '3.50%', isUp: true };
    }

    return {
        name: `${symbol.toUpperCase()} A.Ş.`,
        price: '284.50',
        change: '2.45',
        changePercent: '1.12%',
        isUp: true
    };
}

export async function getBinanceTicker(): Promise<MarketTicker[]> {
    // Return mock ticker or fetch from Binance (Binance fetch is usually fine, but let's keep it simple)
    // Actually Binance API was working fine before, but let's just return mock to be 100% safe for now.
    // Or we can try to use the fetch again from previous working state.

    // Let's restore the working Binance fetch as it was separate from Yahoo.
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
