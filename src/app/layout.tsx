import type { Metadata, Viewport } from "next";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { prisma } from "@/lib/prisma";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://argreengarden.com"),
  title: {
    default: "AR Green Garden - ল্যান্ডস্কেপ আর্কিটেকচার ও গার্ডেন ডিজাইন | Bangladesh",
    template: "%s | AR Green Garden",
  },
  description: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ স্থাপত্য, ছাদবাগান, বায়োফিলিক গ্রিন ওয়াল ও আধুনিক বৃক্ষ সেবা প্রতিষ্ঠান।",
  keywords: [
    "landscape architecture bangladesh",
    "rooftop gardening dhaka",
    "বায়োফিলিক ডিজাইন",
    "ছাদ বাগান",
    "ট্রি ডক্টর",
    "urban forestry",
    "ar green garden",
  ],
  openGraph: {
    title: "AR Green Garden - ল্যান্ডস্কেপ আর্কিটেকচার ও গার্ডেন ডিজাইন | Bangladesh",
    description: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ স্থাপত্য, ছাদবাগান, বায়োফিলিক গ্রিন ওয়াল ও আধুনিক বৃক্ষ সেবা প্রতিষ্ঠান।",
    url: "https://argreengarden.com",
    siteName: "AR Green Garden",
    locale: "bn_BD",
    type: "website",
    images: [
      {
        url: "/hero_plants.png",
        width: 1200,
        height: 630,
        alt: "AR Green Garden - Landscape Architecture Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AR Green Garden - ল্যান্ডস্কেপ আর্কিটেকচার ও গার্ডেন ডিজাইন",
    description: "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ স্থাপত্য, ছাদবাগান, বায়োফিলিক গ্রিন ওয়াল ও আধুনিক বৃক্ষ সেবা প্রতিষ্ঠান।",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#2B4D33",
  width: "device-width",
  initialScale: 1,
};

async function getGaId(): Promise<string | null> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "site_config" } });
    const val = setting?.value as any;
    return val?.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || null;
  } catch {
    return process.env.NEXT_PUBLIC_GA_ID || null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = await getGaId();

  return (
    <html lang="bn" className="h-full antialiased">
      <head>
        <GoogleAnalytics gaId={gaId} />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
