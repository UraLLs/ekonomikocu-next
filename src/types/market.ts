export interface MarketTicker {
    symbol: string;
    price: string;
    changePercent: string;
    up: boolean;
}

export interface AssetDetail {
    name: string;
    price: string;
    change: string;
    changePercent: string;
    isUp: boolean;
    symbol?: string; // Optional because sometimes it's added later
    code?: string;
}

export interface BinanceTickerItem {
    symbol: string;
    priceChange: string;
    priceChangePercent: string;
    weightedAvgPrice: string;
    prevClosePrice: string;
    lastPrice: string;
    lastQty: string;
    bidPrice: string;
    bidQty: string;
    askPrice: string;
    askQty: string;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
    volume: string;
    quoteVolume: string;
    openTime: number;
    closeTime: number;
    firstId: number;
    lastId: number;
    count: number;
}

export interface KapStory {
    id: string;
    title: string;
    company: string; // e.g. "THYAO", "KAP"
    time: string; // e.g. "10:45"
    fullDate: string;
    url?: string;
    viewed: boolean;
    isLive?: boolean;
}
