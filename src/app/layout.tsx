import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ekonomikocu - Türkiye'nin Finansal Sosyal Platformu",
  description: "Borsa, ekonomi, kripto para ve altın piyasalarını takip edin.",
};

import { Providers } from "@/components/providers/Providers";
import Ticker from "@/components/layout/Ticker";
import TickerWrapper from "@/components/layout/TickerWrapper";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-3F88MMWKCF"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-3F88MMWKCF');
          `}
        </Script>

        <Providers>
          <TickerWrapper>
            <Ticker />
          </TickerWrapper>
          {children}
        </Providers>
      </body>
    </html>
  );
}
