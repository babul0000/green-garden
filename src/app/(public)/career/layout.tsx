import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ক্যারিয়ার ও কর্মসংস্থান (Careers at Studio)",
  description: "এ আর গ্রিন গার্ডেনের সাথে যুক্ত হয়ে বাংলাদেশের সবুজায়ন ও ল্যান্ডস্কেপ স্থাপত্যে ক্যারিয়ার গড়ুন।",
  openGraph: {
    title: "ক্যারিয়ার ও কর্মসংস্থান | AR Green Garden",
    description: "এ আর গ্রিন গার্ডেনের সাথে যুক্ত হয়ে বাংলাদেশের সবুজায়ন ও ল্যান্ডস্কেপ স্থাপত্যে ক্যারিয়ার গড়ুন।",
    type: "website",
  },
};

export default function CareerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
