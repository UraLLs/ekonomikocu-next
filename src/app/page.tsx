import Header from "@/components/layout/Header";
import Ticker from "@/components/layout/Ticker";
import HeroSection from "@/components/features/HeroSection";
import KapStories from "@/components/features/KapStories";
import NewsSection from "@/components/features/NewsSection";
import FinanceTools from "@/components/features/FinanceTools";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

import { createClient } from "@/utils/supabase/server";


export const revalidate = 60; // Revalidate every minute

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

  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Ticker />
      <Header />

      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Premium Hero Section */}
            <HeroSection />

            {/* KAP Stories */}
            <KapStories />

            <NewsSection />
            <FinanceTools />
          </div>

          {/* SIDEBAR AREA - Passing feedData here */}
          <Sidebar comments={feedData} />

        </div>
      </div>

      <Footer />
    </main>
  );
}
