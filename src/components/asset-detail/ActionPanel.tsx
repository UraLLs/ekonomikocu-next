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
        ownedQuantity = portfolio?.quantity || 0;
    }

    // 2. Fetch Real Price
    const detail = await getAssetDetail(symbol);
    // Parse price string "97,450.00" -> 97450.00 or "35.50" -> 35.50
    // Remove currency symbols and commas if used as thousands separator
    const rawPrice = String(detail?.price || '0').replace(/[$,₺]/g, '').replace(/,/g, '');
    const currentPrice = parseFloat(rawPrice) || 0;

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-purple/10 blur-[60px] rounded-full pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <h3 className="font-bold text-gray-100 text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="text-lg">⚡</span> Hızlı İşlem
                </h3>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono mb-0.5">Kullanılabilir Bakiye</span>
                    <span className="text-accent-green font-bold font-mono text-sm tracking-tight">₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="relative z-10">
                <TradeForm symbol={symbol} currentPrice={currentPrice} />
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-gray-400 font-medium">Toplam Varlık</span>
                <span className="font-bold text-white font-mono text-sm">{ownedQuantity} <span className="text-[10px] text-gray-500 font-sans font-normal">ADET</span></span>
            </div>
        </div>
    );
}
