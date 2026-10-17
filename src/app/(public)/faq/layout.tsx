import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "সাধারণ জিজ্ঞাসা ও উত্তর (FAQ)",
  description: "ল্যান্ডস্কেপিং খরচ, ছাদবাগানের ড্রেনেজ সিস্টেম, সময়সীমা ও ওয়ারেন্টি সম্পর্কিত সচরাচর জিজ্ঞাসিত প্রশ্নাবলী।",
  openGraph: {
    title: "সাধারণ জিজ্ঞাসা (FAQ) | AR Green Garden",
    description: "ল্যান্ডস্কেপিং খরচ, ছাদবাগানের ড্রেনেজ সিস্টেম, সময়সীমা ও ওয়ারেন্টি সম্পর্কিত সচরাচর জিজ্ঞাসিত প্রশ্নাবলী।",
    type: "website",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
