import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LeaderboardTabs from "@/components/gamification/LeaderboardTabs";
import { getTopXPUsers, getTopPortfolioUsers } from "@/actions/leaderboard";

export const metadata = {
    title: 'Liderlik Tablosu | Ekonomikoçu',
    description: 'En başarılı yatırımcılar ve analizciler.'
};

export const revalidate = 60; // Revalidate every minute

export default async function LeaderboardPage() {
    // Parallel fetching for performance
    const [xpUsers, portfolioUsers] = await Promise.all([
        getTopXPUsers(50),
        getTopPortfolioUsers(20) // Limit portfolio calculation as it's expensive
    ]);

    return (
        <main className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Header />

            <div className="flex-1 max-w-[1000px] w-full mx-auto p-6 md:p-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-gold via-yellow-200 to-accent-gold mb-4 animate-text-shimmer">
                        Liderlik Tablosu
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Topluluğumuzun en prestijli listesi. Hem sosyal etkileşim hem de portföy başarısı burada ödüllendirilir.
                    </p>
                </div>

                {/* Dual-Tab Leaderboard */}
                <LeaderboardTabs xpUsers={xpUsers} portfolioUsers={portfolioUsers} />
            </div>

            <Footer />
        </main>
    );
}
