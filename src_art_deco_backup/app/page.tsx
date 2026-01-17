import Header from "@/components/layout/Header";
import LiveTicker from "@/components/features/LiveTicker";
import MarketDashboard from "@/components/features/MarketDashboard";
import MarketGrid from "@/components/features/MarketGrid";
import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import CenterContent from "@/components/features/CenterContent";

export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <Header />
      <LiveTicker />
      <MarketDashboard />
      <MarketGrid />

      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <LeftSidebar />
          <CenterContent />
          <RightSidebar />
        </div>
      </div>
    </main>
  );
}
