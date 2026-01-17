
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAssetDetail } from "@/services/marketService";
import { redirect } from "next/navigation";

export const revalidate = 0; // Dynamic page, always fresh

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/giris'); // Redirect to login if not authenticated
    }

    // 1. Fetch Profile (Balance)
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, balance')
        .eq('id', user.id)
        .single();

    if (error) {
        console.error("Profile Fetch Error:", error);
    }

    // 2. Fetch Portfolio
    const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .order('quantity', { ascending: false });

    // 3. Fetch Transactions
    const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

    if (!profile) {
        return <div className="p-10 text-center">Profil bulunamadı.</div>;
    }

    // 4. Calculate Portfolio Value & P/L
    let totalPortfolioValue = 0;
    let totalCost = 0;

    // We need to fetch current price for each asset
    // Since getAssetDetail is async, we use Promise.all
    const portfolioWithPrices = await Promise.all((portfolio || []).map(async (item) => {
        const detail = await getAssetDetail(item.symbol);
        const currentPriceRaw = detail.price.replace(/[$,₺]/g, '').replace(/,/g, '');
        let currentPrice = parseFloat(currentPriceRaw);

        // Crypto currency fix (Mock returns USD, we want TRY for total calculation?)
        // Assuming user balance is in TRY.
        // If symbol is crypto, we might need conversion or just display as is.
        // For simplicity in MVP, let's treat the number as "Units of Value" (TRY).
        // If BTC is 97450 and Balance is 100000, it's consistent if both are same currency.
        // But BTC is likely USD. 
        // Let's assume Mock returns USD for Crypto and TRY for BIST.
        // To be accurate, we should multiply USD by 35 (Mock Rate).
        const isCrypto = ['BTC', 'ETH', 'SOL', 'AVAX', 'USDT'].includes(item.symbol.toUpperCase());
        if (isCrypto) {
            currentPrice = currentPrice * 35;
        }

        const quantity = Number(item.quantity);
        const avgCost = Number(item.average_cost);
        const currentValue = quantity * currentPrice;
        const totalItemCost = quantity * avgCost;

        totalPortfolioValue += currentValue;
        totalCost += totalItemCost;

        return {
            ...item,
            currentPrice,
            currentValue,
            profit: currentValue - totalItemCost,
            profitPercent: totalItemCost > 0 ? ((currentValue - totalItemCost) / totalItemCost) * 100 : 0,
            isCrypto
        };
    }));

    const totalNetWorth = (profile.balance || 0) + totalPortfolioValue;
    const totalProfit = totalPortfolioValue - totalCost;
    const totalProfitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary">
            <Header />

            <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary">Portföyüm</h1>
                        <p className="text-text-secondary">Hoş geldin, {profile.username || user.email}</p>
                    </div>
                    <a href="/profil/duzenle" className="flex items-center gap-2 px-4 py-2 bg-bg-elevated hover:bg-bg-surface-hover border border-border-subtle rounded-lg text-sm font-medium transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                        Profili Düzenle
                    </a>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" /></svg>
                        </div>
                        <h3 className="text-text-secondary font-medium mb-1">Toplam Varlık</h3>
                        <div className="text-3xl font-bold font-mono">
                            ₺{totalNetWorth.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-xs text-text-muted mt-2">Nakit + Portföy Değeri</div>
                    </div>

                    <div className="bg-bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm">
                        <h3 className="text-text-secondary font-medium mb-1">Kullanılabilir Bakiye</h3>
                        <div className="text-3xl font-bold font-mono text-text-primary">
                            ₺{profile.balance?.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                        </div>
                        <div className="text-xs text-text-muted mt-2">Alım gücünüz</div>
                    </div>

                    <div className="bg-bg-surface p-6 rounded-2xl border border-border-subtle shadow-sm">
                        <h3 className="text-text-secondary font-medium mb-1">Toplam Kâr/Zarar</h3>
                        <div className={`text-3xl font-bold font-mono ${totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {totalProfit >= 0 ? '+' : ''}₺{totalProfit.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                        </div>
                        <div className={`text-sm mt-1 font-bold ${totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            %{totalProfitPercent.toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Portfolio Table */}
                <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-border-subtle flex justify-between items-center">
                        <h2 className="text-xl font-bold text-text-primary">Varlıklarım</h2>
                    </div>

                    {portfolioWithPrices.length === 0 ? (
                        <div className="p-10 text-center text-text-muted">
                            Portföyünüz boş. Piyasa sayfasından işlem yapmaya başlayın.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-bg-elevated text-left text-xs font-bold text-text-muted uppercase tracking-wider">
                                        <th className="p-4">Sembol</th>
                                        <th className="p-4 text-right">Adet</th>
                                        <th className="p-4 text-right">Ort. Maliyet</th>
                                        <th className="p-4 text-right">Güncel Fiyat</th>
                                        <th className="p-4 text-right">Değer</th>
                                        <th className="p-4 text-right">Kâr/Zarar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-subtle">
                                    {portfolioWithPrices.map((item) => (
                                        <tr key={item.symbol} className="hover:bg-bg-elevated/50 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-text-primary">{item.symbol}</div>
                                                <div className="text-xs text-text-muted">{item.isCrypto ? 'Kripto' : 'Hisse'}</div>
                                            </td>
                                            <td className="p-4 text-right font-mono text-text-primary">{Number(item.quantity).toLocaleString()}</td>
                                            <td className="p-4 text-right font-mono text-text-secondary">₺{Number(item.average_cost).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                            <td className="p-4 text-right font-mono text-text-secondary">₺{item.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                            <td className="p-4 text-right font-mono font-bold text-text-primary">₺{item.currentValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</td>
                                            <td className="p-4 text-right">
                                                <div className={`font-bold font-mono ${item.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                                                    {item.profit >= 0 ? '+' : ''}₺{item.profit.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}
                                                </div>
                                                <div className={`text-xs ${item.profit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                                                    %{item.profitPercent.toFixed(2)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Transactions History */}
                <div className="bg-bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-lg">
                    <div className="p-6 border-b border-border-subtle">
                        <h2 className="text-xl font-bold text-text-primary">Son İşlemler</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-bg-elevated text-left text-xs font-bold text-text-muted uppercase tracking-wider">
                                    <th className="p-4">Tarih</th>
                                    <th className="p-4">İşlem</th>
                                    <th className="p-4">Sembol</th>
                                    <th className="p-4 text-right">Adet</th>
                                    <th className="p-4 text-right">Fiyat</th>
                                    <th className="p-4 text-right">Toplam</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-subtle">
                                {transactions?.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-bg-elevated/50 transition-colors">
                                        <td className="p-4 text-text-secondary whitespace-nowrap">
                                            {new Date(tx.created_at).toLocaleString('tr-TR')}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'BUY' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'}`}>
                                                {tx.type === 'BUY' ? 'ALIM' : 'SATIM'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-text-primary">{tx.symbol}</td>
                                        <td className="p-4 text-right font-mono text-text-secondary">{Number(tx.quantity).toLocaleString()}</td>
                                        <td className="p-4 text-right font-mono text-text-secondary">₺{Number(tx.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                        <td className="p-4 text-right font-mono font-bold text-text-primary">₺{Number(tx.total_amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                    </tr>
                                ))}
                                {(!transactions || transactions.length === 0) && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-text-muted">Henüz işlem geçmişi yok.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
