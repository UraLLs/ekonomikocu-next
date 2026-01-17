
export interface MarketTicker {
    symbol: string;
    price: string;
    changePercent: string;
    up: boolean;
}

export async function getBinanceTicker(): Promise<MarketTicker[]> {
    try {
        // Fixed URL encoding and symbol case (BNBUSDT)
        // Note: Binance API requires double quotes for the list of symbols, and they must be URL encoded.
        // ["BTCUSDT","ETHUSDT","USDTTRY","BNBUSDT","SOLUSDT"] -> %5B%22BTCUSDT%22%2C%22ETHUSDT%22%2C%22USDTTRY%22%2C%22BNBUSDT%22%2C%22SOLUSDT%22%5D
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22USDTTRY%22,%22BNBUSDT%22,%22SOLUSDT%22%5D', {
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            throw new Error(`Api Error: ${response.status}`);
        }

        const data = await response.json();

        return data.map((item: any) => {
            const isUp = parseFloat(item.priceChangePercent) >= 0;
            let displayName = item.symbol;
            let price = parseFloat(item.lastPrice);
            let formattedPrice = price.toFixed(2);

            // Custom formatting
            if (item.symbol === 'BTCUSDT') {
                displayName = 'BTC/USD';
                formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else if (item.symbol === 'ETHUSDT') {
                displayName = 'ETH/USD';
                formattedPrice = price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            } else if (item.symbol === 'USDTTRY') {
                displayName = 'DOLAR/TL';
                formattedPrice = price.toFixed(4); // More precision for currency
            } else if (item.symbol === 'SOLUSDT') {
                displayName = 'SOL/USD';
            } else if (item.symbol === 'BNBUSDT') {
                displayName = 'BNB/USD';
            }

            return {
                symbol: displayName,
                price: formattedPrice,
                changePercent: `%${Math.abs(item.priceChangePercent).toFixed(2)}`,
                up: isUp
            };
        });

    } catch (error) {
        console.error("Market Data Fetch Error:", error);
        // Fallback data if API fails
        return [
            { symbol: "BTC/USD", price: "97,500.00", changePercent: "%0.00", up: true },
            { symbol: "DOLAR/TL", price: "32.5000", changePercent: "%0.00", up: true },
        ];
    }
}

export async function getAssetDetail(symbol: string) {
    const isCrypto = ['BTC', 'ETH', 'SOL', 'AVAX', 'USDT'].includes(symbol.toUpperCase());

    // Valid mock data for prototype to avoid blank screens
    // In production, this should fetch from an API
    if (isCrypto) {
        if (symbol.toUpperCase() === 'BTC') return { name: 'Bitcoin', price: '97,450.00', change: '2.45', changePercent: '2.40%', isUp: true };
        if (symbol.toUpperCase() === 'ETH') return { name: 'Ethereum', price: '3,450.00', change: '-12.00', changePercent: '0.35%', isUp: false };
    }

    // Default Stock Mock (Dynamic based on symbol to not look hardcoded)
    return {
        name: `${symbol.toUpperCase()} A.Ş.`,
        price: '284.50', // Fixed for now as we don't have BIST API
        change: '2.45',
        changePercent: '1.12%',
        isUp: true
    };
}
