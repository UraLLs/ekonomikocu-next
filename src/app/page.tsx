import Header from "@/components/layout/Header";


import KapStories from "@/components/features/KapStories";
import NewsSection from "@/components/features/NewsSection";
import FinanceTools from "@/components/features/FinanceTools";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/utils/supabase/server";


import { Suspense } from "react";
import NewsSectionSkeleton from "@/components/features/skeletons/NewsSectionSkeleton";
import DashboardLoader from "@/components/features/DashboardLoader";

export const revalidate = 60; // Revalidate every minute


import { getCurrencyRates } from "@/services/marketService";

export default async function Home() {
  const supabase = await createClient();

  // 1. Fetch Comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  // 2. Fetch Profiles for these comments
  let feedData = [];
  if (comments && comments.length > 0) {
    const userIds = Array.from(new Set(comments.map(c => c.user_id)));
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds);

    type ProfileMap = Record<string, { id: string; username: string; avatar_url: string }>;

    const profileMap = (profiles || []).reduce<ProfileMap>((acc, profile) => {
      acc[profile.id] = profile;
      return acc;
    }, {});

    feedData = comments.map(c => ({
      ...c,
      profiles: profileMap[c.user_id]
    }));
  }

  // 3. Fetch Currency Rates
  const rates = await getCurrencyRates();

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Header />

      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Google Finance Style Dashboard (Main Focus) */}
            <Suspense fallback={<div className="h-64 bg-bg-surface animate-pulse rounded-2xl border border-border-subtle" />}>
              <DashboardLoader />
            </Suspense>

            {/* KAP Stories */}
            <KapStories />

            <Suspense fallback={<NewsSectionSkeleton />}>
              <NewsSection />
            </Suspense>

            <FinanceTools />
          </div>

          {/* SIDEBAR AREA - Passing feedData here */}
          <Sidebar comments={feedData} rates={rates} />

        </div>
      </div>

      <Footer />
    </main>
  );
}
