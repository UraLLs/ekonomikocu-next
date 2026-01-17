import { createClient } from "@/utils/supabase/server";

export default async function ActionPanel({ symbol }: { symbol: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let balance = 0;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('balance')
            .eq('id', user.id)
            .single();
        balance = profile?.balance || 0;
    }
    return (
        <div className="bg-bg-surface border border-border-subtle rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-text-primary text-sm">İşlem Yap (Sanal)</h3>
                <span className="text-xs text-text-muted font-mono">
                    Bakiye: <span className="text-accent-green font-bold">₺{balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent-green hover:bg-accent-green/90 text-white transition-colors group">
                    <span className="text-lg font-bold">AL</span>
                    <span className="text-[10px] opacity-80 group-hover:opacity-100">Long</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-lg bg-accent-red hover:bg-accent-red/90 text-white transition-colors group">
                    <span className="text-lg font-bold">SAT</span>
                    <span className="text-[10px] opacity-80 group-hover:opacity-100">Short</span>
                </button>
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted bg-bg-elevated p-2 rounded">
                <span>Pozisyon:</span>
                <span className="font-bold text-text-primary">Yok</span>
            </div>
        </div>
    );
}
