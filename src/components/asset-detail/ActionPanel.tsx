import { createClient } from "@/utils/supabase/server";
import TradeForm from "./TradeForm";

export default async function ActionPanel({ symbol }: { symbol: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

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

    // Gerçek fiyat entegrasyonu sonraki adımda detaylı yapılacak
    // Şimdilik sembolik bir fiyat belirleyelim
    const mockPrice = 125.40;

    return (
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary text-sm">İşlem Yap (Sanal)</h3>
                <span className="text-xs text-text-muted font-mono">
                    Bakiye: <span className="text-accent-green font-bold">₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
            </div>

            <TradeForm symbol={symbol} currentPrice={mockPrice} />

            <div className="flex items-center justify-between text-xs text-text-muted bg-bg-elevated p-2 rounded mt-4">
                <span>Portföyünüz:</span>
                <span className="font-bold text-text-primary">{ownedQuantity} Adet</span>
            </div>
        </div>
    );
}
