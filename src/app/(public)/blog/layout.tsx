import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "জার্নাল ও বোটানিক্যাল ব্লগ",
  description: "ছাদবাগান পরিচর্যা, ল্যান্ডস্কেপ আর্কিটেকচার মেথডোলজি, বৃক্ষরোপণ গাইড ও বোটানিক্যাল গবেষণামূলক নিবন্ধ।",
  openGraph: {
    title: "জার্নাল ও বোটানিক্যাল ব্লগ | AR Green Garden",
    description: "ছাদবাগান পরিচর্যা, ল্যান্ডস্কেপ আর্কিটেকচার মেথডোলজি, বৃক্ষরোপণ গাইড ও বোটানিক্যাল গবেষণামূলক নিবন্ধ।",
    type: "website",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
