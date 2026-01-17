import { createClient } from "@/utils/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAssetDetail } from "@/services/marketService";

export const revalidate = 60; // Cache for 60 seconds

export default async function LeaderboardPage() {
    const supabase = await createClient();

    // 1. Fetch Users & Balances
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, balance');

    // 2. Fetch All Portfolios
    const { data: portfolios, error: portfoliosError } = await supabase
        .from('portfolios')
        .select('user_id, symbol, quantity');

    if (profilesError || portfoliosError) {
        console.error("Leaderboard Error:", profilesError, portfoliosError);
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold text-accent-red mb-2">Veri Yüklenemedi</h2>
                <div className="text-sm text-text-secondary bg-bg-surface p-4 rounded border border-border-subtle inline-block text-left">
                    {profilesError && <p>Profiles Error: {profilesError.message}</p>}
                    {portfoliosError && <p>Portfolios Error: {portfoliosError.message}</p>}
                </div>
            </div>
        );
    }

    // Check for null data even if no error (shouldn't happen with Supabase usually, but for safety)
    if (!profiles || !portfolios) {
        return <div>Bilinmeyen hata: Veri boş geldi.</div>;
    }

    // 3. Get Unique Symbols & Prices
    const uniqueSymbols = Array.from(new Set(portfolios.map(p => p.symbol)));
    const priceMap: Record<string, number> = {};

    await Promise.all(uniqueSymbols.map(async (sym) => {
        const detail = await getAssetDetail(sym);
        // Replace currency symbols and parse float
        const cleanPrice = detail.price.replace(/[$,₺]/g, '').replace(/,/g, '');
        // Note: The mock returns "97,450.00" (US format with comma?) or "284.50"
        // Need to handle locale. My mock returns:
        // BTC: '97,450.00' (en-US like) -> 97450.00
        // THYAO: '284.50' -> 284.50
        // Wait, my mock uses '.' as decimal separator for both?
        // Let's check marketService again.
        // Yes: price: '97,450.00' and '284.50'.

        // Remove comma (thousands separator)
        const normalized = detail.price.replace(/,/g, '');
        priceMap[sym] = parseFloat(normalized);
    }));

    // 4. Calculate Net Worth
    const leaderboard = profiles.map(user => {
        const userPortfolios = portfolios.filter(p => p.user_id === user.id);
        let portfolioValue = 0;

        userPortfolios.forEach(p => {
            const price = priceMap[p.symbol] || 0;
            // If crypto (USD price), convert to TRY approximately? 
            // My mock returns BTC in Dollars? '97,450.00'. 
            // AssetHeader displays '$'.
            // Profile balance is '₺'. 
            // Logic gap: Mixed currencies.
            // For now, assume USD=35 TRY (Simulated) or just sum it up raw if lazy.
            // Better: Convert USD symbols to TRY.

            let itemValue = Number(p.quantity) * price;
            if (['BTC', 'ETH', 'SOL'].includes(p.symbol.toUpperCase())) {
                itemValue = itemValue * 35; // Mock USD/TRY rate
            }
            portfolioValue += itemValue;
        });

        return {
            ...user,
            portfolioValue,
            totalNetWorth: (user.balance || 0) + portfolioValue
        };
    })
        .sort((a, b) => b.totalNetWorth - a.totalNetWorth)
        .slice(0, 50); // Top 50

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-4xl mx-auto p-6 md:py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-green to-accent-blue bg-clip-text text-transparent mb-4">
                        Liderlik Tablosu
                    </h1>
                    <p className="text-text-secondary">
                        En başarılı yatırımcılar ve portföy değerleri.
                    </p>
                </div>

                <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-xl">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-bg-elevated border-b border-border-subtle text-xs font-bold text-text-muted uppercase tracking-wider">
                        <div className="col-span-1 text-center">#</div>
                        <div className="col-span-5">Yatırımcı</div>
                        <div className="col-span-3 text-right">Net Varlık</div>
                        <div className="col-span-3 text-right text-accent-green">Portföy</div>
                    </div>

                    <div className="divide-y divide-border-subtle">
                        {leaderboard.map((user, index) => (
                            <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-bg-elevated/50 transition-colors">
                                <div className="col-span-1 text-center font-bold text-lg text-text-muted">
                                    {index + 1}
                                </div>
                                <div className="col-span-5 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-white font-bold text-sm">
                                        {user.full_name?.substring(0, 1) || user.username?.substring(0, 1) || '?'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-text-primary">
                                            {user.full_name || user.username || 'Anonim Kullanıcı'}
                                        </div>
                                        <div className="text-xs text-text-secondary">
                                            {index === 0 ? '👑 Haftanın Lideri' : 'Yatırımcı'}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3 text-right font-mono font-bold text-text-primary">
                                    ₺{user.totalNetWorth.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                </div>
                                <div className="col-span-3 text-right font-mono text-sm text-text-secondary">
                                    ₺{user.portfolioValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {leaderboard.length === 0 && (
                        <div className="p-10 text-center text-text-muted">
                            Henüz kimse işlem yapmamış. İlk hareketi sen yap!
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
