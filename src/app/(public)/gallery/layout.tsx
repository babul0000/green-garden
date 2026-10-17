import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ফটো গ্যালারি (Visual Showcase)",
  description: "এ আর গ্রিন গার্ডেনের নির্মিত ছাদবাগান, লন, সুইমিং পুল ও ভার্টিক্যাল গ্রিন ওয়ালের চমৎকার আলোকচিত্র সংগ্রহ।",
  openGraph: {
    title: "ফটো গ্যালারি | AR Green Garden",
    description: "এ আর গ্রিন গার্ডেনের নির্মিত ছাদবাগান, লন, সুইমিং পুল ও ভার্টিক্যাল গ্রিন ওয়ালের চমৎকার আলোকচিত্র সংগ্রহ।",
    type: "website",
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
