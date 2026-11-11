import type { Metadata, Viewport } from "next";
import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { SiteConfigProvider } from "@/context/SiteConfigContext";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { prisma } from "@/lib/prisma";
import "./globals.css";

async function getSiteConfigFromDb(): Promise<Record<string, any>> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: "site_config" } });
    return (setting?.value as Record<string, any>) || {};
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const conf = await getSiteConfigFromDb();
  const titleDefault =
    conf.seoTitleDefault ||
    `${conf.title || "A R Green Garden"} - ল্যান্ডস্কেপ আর্কিটেকচার ও গার্ডেন ডিজাইন | Bangladesh`;
  const siteTitle = conf.title || "A R Green Garden";
  const description =
    conf.seoDescription ||
    "বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ স্থাপত্য, ছাদবাগান, বায়োফিলিক গ্রিন ওয়াল ও আধুনিক বৃক্ষ সেবা প্রতিষ্ঠান।";
  const keywordsList =
    typeof conf.seoKeywords === "string" && conf.seoKeywords.trim()
      ? conf.seoKeywords.split(",").map((k: string) => k.trim()).filter(Boolean)
      : [
          "landscape architecture bangladesh",
          "rooftop gardening dhaka",
          "বায়োফিলিক ডিজাইন",
          "ছাদ বাগান",
          "ট্রি ডক্টর",
          "urban forestry",
          "ar green garden",
        ];
  const ogImg = conf.ogImage || conf.logoImage || "/hero_plants.png";

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://argreengarden.com"),
    title: {
      default: titleDefault,
      template: `%s | ${siteTitle}`,
    },
    description,
    keywords: keywordsList,
    openGraph: {
      title: titleDefault,
      description,
      url: "https://argreengarden.com",
      siteName: siteTitle,
      locale: "bn_BD",
      type: "website",
      images: [
        {
          url: ogImg,
          width: 1200,
          height: 630,
          alt: `${siteTitle} - Landscape Architecture Studio`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleDefault,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const conf = await getSiteConfigFromDb();
  return {
    themeColor: conf.themeColor || "#2B4D33",
    width: "device-width",
    initialScale: 1,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conf = await getSiteConfigFromDb();
  const gaId = conf?.googleAnalyticsId || process.env.NEXT_PUBLIC_GA_ID || null;

  return (
    <html lang="bn" className="h-full antialiased">
      <head>
        <GoogleAnalytics gaId={gaId} />
      </head>
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          <SiteConfigProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SiteConfigProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
