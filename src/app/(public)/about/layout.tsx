import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে (About Us)",
  description: "এ আর গ্রিন গার্ডেনের ইতিহাস, স্থপতি দল, ভিশন ও বায়োফিলিক ল্যান্ডস্কেপ স্থাপত্যে আমাদের এক দশকের অভিজ্ঞতা।",
  openGraph: {
    title: "আমাদের সম্পর্কে | AR Green Garden",
    description: "এ আর গ্রিন গার্ডেনের ইতিহাস, স্থপতি দল, ভিশন ও বায়োফিলিক ল্যান্ডস্কেপ স্থাপত্যে আমাদের এক দশকের অভিজ্ঞতা।",
    type: "website",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
