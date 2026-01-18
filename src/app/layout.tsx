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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <Ticker />
          {children}
        </Providers>
      </body>
    </html>
  );
}
