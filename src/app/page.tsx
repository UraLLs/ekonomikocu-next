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
import SocialFeed from "@/components/social/SocialFeed";
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

            {/* SOSYAL AKIS - Topluluk Paylasimlari */}
            <Suspense fallback={<div className="h-48 bg-bg-surface animate-pulse rounded-2xl border border-border-subtle" />}>
              <SocialFeed />
            </Suspense>

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
