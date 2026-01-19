import { createClient } from "@/utils/supabase/server";
import TradeForm from "./TradeForm";
import { getAssetDetail } from "@/services/marketService";

export default async function ActionPanel({ symbol }: { symbol: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch User Data
    let balance = 0;
    let ownedQuantity = 0;

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', user.id)
            .single();
        balance = profile?.balance || 0;

        const { data: portfolio } = await supabase
            .from('portfolios')
            .select('quantity')
            .eq('user_id', user.id)
            .eq('symbol', symbol)
            .single();
        ownedQuantity = Number(portfolio?.quantity) || 0;
    }

    // 2. Fetch Real Price
    const detail = await getAssetDetail(symbol);
    // Parse price string "97,450.00" -> 97450.00 or "35.50" -> 35.50
    const rawPrice = String(detail?.price || '0').replace(/[$,₺]/g, '').replace(/,/g, '');
    const currentPrice = parseFloat(rawPrice) || 0;

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-accent-green/10 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <span className="text-lg">⚡</span> Hızlı İşlem
                </h3>
                <span className="text-xs text-text-muted font-mono">
                    {symbol}
                </span>
            </div>

            <div className="relative z-10">
                <TradeForm
                    symbol={symbol}
                    currentPrice={currentPrice}
                    balance={balance}
                    ownedQuantity={ownedQuantity}
                    isLoggedIn={!!user}
                />
            </div>
        </div>
    );
}
