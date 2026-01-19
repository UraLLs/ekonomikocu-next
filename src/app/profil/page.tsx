
import { createClient } from "@/utils/supabase/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getAssetDetail } from "@/services/marketService";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GraduationCap, BookOpen, TrendingUp, Wallet, Clock, User, Settings, ChevronRight } from "lucide-react";

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
        .select('username, balance, avatar_url')
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
        .limit(10);

    // 4. Fetch Education Progress
    const { data: lessonProgress } = await supabase
        .from('lesson_progress')
        .select('lesson_id, course_id, completed_at')
        .eq('user_id', user.id);

    // Get unique courses with progress
    const courseIds = [...new Set(lessonProgress?.map(p => p.course_id) || [])];
    let coursesWithProgress: any[] = [];

    if (courseIds.length > 0) {
        const { data: courses } = await supabase
            .from('courses')
            .select('id, title, thumbnail_url, lessons(count)')
            .in('id', courseIds);

        coursesWithProgress = (courses || []).map(course => {
            const completedLessons = lessonProgress?.filter(p => p.course_id === course.id).length || 0;
            const totalLessons = course.lessons?.[0]?.count || 0;
            const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
            return { ...course, completedLessons, totalLessons, progress };
        });
    }

    if (!profile) {
        return <div className="p-10 text-center">Profil bulunamadı.</div>;
    }

    // 5. Calculate Portfolio Value & P/L
    let totalPortfolioValue = 0;
    let totalCost = 0;

    const portfolioWithPrices = await Promise.all((portfolio || []).map(async (item) => {
        const detail = await getAssetDetail(item.symbol);
        const currentPriceRaw = detail.price.replace(/[$,₺]/g, '').replace(/,/g, '');
        let currentPrice = parseFloat(currentPriceRaw);

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

                {/* User Profile Card */}
                <div className="bg-gradient-to-br from-brand-primary/10 via-transparent to-accent-blue/10 border border-white/5 rounded-3xl p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-primary to-accent-blue flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                            {profile.username?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl md:text-3xl font-black text-white">
                                {profile.username || 'Yatırımcı'}
                            </h1>
                            <p className="text-text-muted">{user.email}</p>
                        </div>

                        {/* Actions */}
                        <Link
                            href="/profil/duzenle"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors"
                        >
                            <Settings className="w-4 h-4" />
                            Profili Düzenle
                        </Link>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-accent-green/10 to-transparent border border-accent-green/20 rounded-2xl p-5">
                        <Wallet className="w-6 h-6 text-accent-green mb-2" />
                        <div className="text-2xl font-black text-white">₺{totalNetWorth.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</div>
                        <div className="text-xs text-text-muted">Toplam Varlık</div>
                    </div>
                    <div className="bg-gradient-to-br from-accent-blue/10 to-transparent border border-accent-blue/20 rounded-2xl p-5">
                        <TrendingUp className="w-6 h-6 text-accent-blue mb-2" />
                        <div className={`text-2xl font-black ${totalProfit >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                            {totalProfit >= 0 ? '+' : ''}%{totalProfitPercent.toFixed(1)}
                        </div>
                        <div className="text-xs text-text-muted">Toplam Getiri</div>
                    </div>
                    <div className="bg-gradient-to-br from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-2xl p-5">
                        <GraduationCap className="w-6 h-6 text-brand-primary mb-2" />
                        <div className="text-2xl font-black text-white">{coursesWithProgress.length}</div>
                        <div className="text-xs text-text-muted">Başlanan Kurs</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-5">
                        <BookOpen className="w-6 h-6 text-yellow-500 mb-2" />
                        <div className="text-2xl font-black text-white">{lessonProgress?.length || 0}</div>
                        <div className="text-xs text-text-muted">Tamamlanan Ders</div>
                    </div>
                </div>

                {/* Education Progress Section */}
                {coursesWithProgress.length > 0 && (
                    <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
                        <div className="p-5 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-brand-primary/20 text-brand-primary">
                                    <GraduationCap className="w-5 h-5" />
                                </div>
                                <h2 className="text-lg font-bold text-white">Eğitim İlerlemem</h2>
                            </div>
                            <Link href="/egitim" className="text-sm text-brand-primary hover:underline flex items-center gap-1">
                                Tümünü Gör <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="divide-y divide-white/5">
                            {coursesWithProgress.map((course) => (
                                <Link
                                    key={course.id}
                                    href={`/egitim/${course.id}`}
                                    className="p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-colors"
                                >
                                    <div className="w-16 h-10 rounded-lg bg-white/5 overflow-hidden relative flex-shrink-0">
                                        {course.thumbnail_url ? (
                                            <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-white/20">
                                                <GraduationCap className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-white truncate">{course.title}</h3>
                                        <div className="text-xs text-text-muted mt-1">
                                            {course.completedLessons} / {course.totalLessons} ders tamamlandı
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${course.progress === 100 ? 'bg-accent-green' : 'bg-brand-primary'}`}
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                        <span className={`text-sm font-bold ${course.progress === 100 ? 'text-accent-green' : 'text-white'}`}>
                                            %{course.progress}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Portfolio Table */}
                <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/5 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent-green/20 text-accent-green">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Varlıklarım</h2>
                        </div>
                    </div>

                    {portfolioWithPrices.length === 0 ? (
                        <div className="p-10 text-center">
                            <Wallet className="w-12 h-12 mx-auto mb-4 text-white/10" />
                            <p className="text-text-muted">Portföyünüz boş.</p>
                            <Link href="/piyasa" className="text-brand-primary hover:underline text-sm mt-2 inline-block">
                                Piyasa sayfasına git →
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white/[0.02] text-left text-xs font-bold text-text-muted uppercase tracking-wider">
                                        <th className="p-4">Sembol</th>
                                        <th className="p-4 text-right">Adet</th>
                                        <th className="p-4 text-right">Ort. Maliyet</th>
                                        <th className="p-4 text-right">Güncel Fiyat</th>
                                        <th className="p-4 text-right">Değer</th>
                                        <th className="p-4 text-right">Kâr/Zarar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {portfolioWithPrices.map((item) => (
                                        <tr key={item.symbol} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-white">{item.symbol}</div>
                                                <div className="text-xs text-text-muted">{item.isCrypto ? 'Kripto' : 'Hisse'}</div>
                                            </td>
                                            <td className="p-4 text-right font-mono text-text-secondary">{Number(item.quantity).toLocaleString()}</td>
                                            <td className="p-4 text-right font-mono text-text-secondary">₺{Number(item.average_cost).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                            <td className="p-4 text-right font-mono text-text-secondary">₺{item.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                            <td className="p-4 text-right font-mono font-bold text-white">₺{item.currentValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 })}</td>
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
                <div className="bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent-blue/20 text-accent-blue">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-white">Son İşlemler</h2>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-white/[0.02] text-left text-xs font-bold text-text-muted uppercase tracking-wider">
                                    <th className="p-4">Tarih</th>
                                    <th className="p-4">İşlem</th>
                                    <th className="p-4">Sembol</th>
                                    <th className="p-4 text-right">Adet</th>
                                    <th className="p-4 text-right">Fiyat</th>
                                    <th className="p-4 text-right">Toplam</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {transactions?.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 text-text-secondary whitespace-nowrap">
                                            {new Date(tx.created_at).toLocaleString('tr-TR')}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'BUY' ? 'bg-accent-green/20 text-accent-green' : 'bg-accent-red/20 text-accent-red'}`}>
                                                {tx.type === 'BUY' ? 'ALIM' : 'SATIM'}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-white">{tx.symbol}</td>
                                        <td className="p-4 text-right font-mono text-text-secondary">{Number(tx.quantity).toLocaleString()}</td>
                                        <td className="p-4 text-right font-mono text-text-secondary">₺{Number(tx.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
                                        <td className="p-4 text-right font-mono font-bold text-white">₺{Number(tx.total_amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</td>
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
