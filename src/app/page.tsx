import Header from "@/components/layout/Header";
import KapStories from "@/components/features/KapStories";
import NewsSection from "@/components/features/NewsSection";
import IPOArena from "@/components/features/IPOArena";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/server";
import { Suspense } from "react";
import NewsSectionSkeleton from "@/components/features/skeletons/NewsSectionSkeleton";
import DashboardLoader from "@/components/features/DashboardLoader";
import { getCurrencyRates } from "@/services/marketService";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  // Fetch Currency Rates & IPOs
  const [rates, { data: ipos }] = await Promise.all([
    getCurrencyRates(),
    supabase.from('ipos').select('*').in('status', ['active', 'upcoming']).order('created_at', { ascending: false })
  ]);

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Header />

      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Piyasa Dashboard */}
            <Suspense fallback={<div className="h-64 bg-bg-surface animate-pulse rounded-2xl border border-border-subtle" />}>
              <DashboardLoader />
            </Suspense>

            {/* KAP Haberleri */}
            <KapStories />

            {/* TOPLULUK TANITIM */}
            <section className="bg-gradient-to-br from-accent-purple/10 to-accent-blue/10 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-accent-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Yatırımcı Topluluğu
                  </h2>
                  <p className="text-sm text-gray-400">Piyasalar hakkında konuş, tartış, öğren.</p>
                </div>
                <a
                  href="/topluluk"
                  className="px-4 py-2 bg-accent-purple hover:bg-accent-purple/80 text-white text-sm font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  Topluluğa Git
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </section>

            {/* Ekonomi Haberleri */}
            <Suspense fallback={<NewsSectionSkeleton />}>
              <NewsSection />
            </Suspense>

            {/* Halka Arz */}
            <IPOArena ipos={ipos || []} />
          </div>

          {/* SIDEBAR */}
          <Sidebar rates={rates} />

        </div>
      </div>

      <Footer />
    </main>
  );
}
