import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "বিফোর-আফটার রূপান্তর (Before & After Transformation)",
  description: "পরিত্যক্ত ছাদ ও খালি জায়গাকে কীভাবে সবুজ ও মনোরম বায়োফিলিক স্বর্গে রূপান্তর করা হয়েছে তার বাস্তব রূপরেখা।",
  openGraph: {
    title: "বিফোর-আফটার রূপান্তর | AR Green Garden",
    description: "পরিত্যক্ত ছাদ ও খালি জায়গাকে কীভাবে সবুজ ও মনোরম বায়োফিলিক স্বর্গে রূপান্তর করা হয়েছে তার বাস্তব রূপরেখা।",
    type: "website",
  },
};

export default function BeforeAfterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
