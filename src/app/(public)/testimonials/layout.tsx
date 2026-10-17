import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "গ্রাহক মতামত ও প্রশংসাপত্র (Client Testimonials)",
  description: "আমাদের বাস্তবায়িত ল্যান্ডস্কেপ ও ছাদবাগান প্রকল্প নিয়ে সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা ও রেটিং।",
  openGraph: {
    title: "গ্রাহক মতামত ও প্রশংসাপত্র | AR Green Garden",
    description: "আমাদের বাস্তবায়িত ল্যান্ডস্কেপ ও ছাদবাগান প্রকল্প নিয়ে সন্তুষ্ট গ্রাহকদের অভিজ্ঞতা ও রেটিং।",
    type: "website",
  },
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
