import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartLedger LK | AI Bookkeeping for Sri Lankan Micro-SMEs",
  description:
    "Simple, voice & photo-driven AI ledger for home bakers, tailors, and Instagram/Facebook sellers in Sri Lanka. Track income, expenses, and generate reports in English, Sinhala, and Tamil.",
  keywords: "bookkeeping, Sri Lanka, SME, accounting, AI, Sinhala, ledger",
  authors: [{ name: "SmartLedger LK" }],
  openGraph: {
    title: "SmartLedger LK | AI Bookkeeping",
    description: "AI-powered bookkeeping designed for Sri Lankan micro-businesses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} antialiased`}
    >
      <body className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
