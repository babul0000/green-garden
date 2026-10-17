import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "প্ল্যান্ট নার্সারি ও গার্ডেনিং শপ",
  description: "দেশি-বিদেশি এক্সোটিক ইনডোর ও আউটডোর গাছ, সিরামিক প্ল্যান্টার, জিওটেক্সটাইল ড্রেনেজ সেল ও অর্গানিক সাবস্ট্রেট শপ।",
  openGraph: {
    title: "প্ল্যান্ট নার্সারি ও গার্ডেনিং শপ | AR Green Garden",
    description: "দেশি-বিদেশি এক্সোটিক ইনডোর ও আউটডোর গাছ, সিরামিক প্ল্যান্টার, জিওটেক্সটাইল ড্রেনেজ সেল ও অর্গানিক সাবস্ট্রেট শপ।",
    type: "website",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
