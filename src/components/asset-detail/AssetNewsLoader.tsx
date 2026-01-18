
import { getMarketNews } from "@/services/marketService";
import NewsWidget from "./NewsWidget";

interface AssetNewsLoaderProps {
    symbol: string;
}

export default async function AssetNewsLoader({ symbol }: AssetNewsLoaderProps) {
    // Determine query similarly to how page did it
    const upper = symbol.toUpperCase();
    const map: Record<string, string> = {
        'BTC': 'Bitcoin Crypto',
        'ETH': 'Ethereum Crypto',
        'XRP': 'Ripple Crypto',
        'SOL': 'Solana Crypto',
        'AVAX': 'Avalanche Crypto',
        'GARAN': 'Garanti BBVA Turkey',
        'THYAO': 'Turkish Airlines',
        'ASELS': 'Aselsan Turkey',
        'KCHOL': 'Koc Holding',
        'AKBNK': 'Akbank Turkey',
        'SISE': 'Sisecam',
        'BIST100': 'Borsa Istanbul',
        'USD': 'USD TRY Economy',
        'EUR': 'Euro TRY Economy',
        'BTCUSDT': 'Bitcoin Crypto',
        'ETHUSDT': 'Ethereum Crypto'
    };

    let newsQuery = `${symbol} Turkey`; // Default
    if (map[upper]) {
        newsQuery = map[upper];
    } else if (upper.includes('USDT')) {
        newsQuery = 'Crypto Market';
    }

    const news = await getMarketNews(newsQuery);

    return <NewsWidget news={news} />;
}
