
import Header from "@/components/layout/Header";
import Ticker from "@/components/layout/Ticker";
import Stories from "@/components/features/Stories";
import NewsSection from "@/components/features/NewsSection";
import FinanceTools from "@/components/features/FinanceTools";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg-primary text-text-primary">
      <Ticker />
      <Header />

      <div className="max-w-[1400px] mx-auto p-6 md:p-8">
        <div className="flex flex-col xl:flex-row gap-8">

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            <Stories />
            <NewsSection />
            <FinanceTools />
          </div>

          {/* SIDEBAR AREA */}
          <Sidebar />

        </div>
      </div>

      <Footer />
    </main>
  );
}
