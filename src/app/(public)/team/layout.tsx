import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "আমাদের বিশেষজ্ঞ দল (Our Architecture & Botanical Team)",
  description: "এ আর গ্রিন গার্ডেনের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেক্ট, হর্টিকালচারিস্ট ও প্রজেক্ট ইঞ্জিনিয়ারদের পরিচিতি।",
  openGraph: {
    title: "আমাদের বিশেষজ্ঞ দল | AR Green Garden",
    description: "এ আর গ্রিন গার্ডেনের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেক্ট, হর্টিকালচারিস্ট ও প্রজেক্ট ইঞ্জিনিয়ারদের পরিচিতি।",
    type: "website",
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
