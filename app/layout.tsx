import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "ClearCut AI - Premium AI Background Remover",
    template: "%s | ClearCut AI"
  },
  description:
    "Remove image backgrounds instantly with a modern AI SaaS workflow for creators, ecommerce teams, and developers.",
  keywords: ["AI background remover", "remove background", "image API", "SaaS", "Next.js"],
  openGraph: {
    title: "ClearCut AI",
    description: "Instant AI background removal with batch workflows, API access, and HD exports.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
