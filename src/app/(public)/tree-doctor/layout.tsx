import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "ট্রি ডক্টর ও আরবান ফরেস্ট্রি ক্লিনিক (Tree Doctor)",
  description: "গাছের রোগ নির্ণয়, পোকা মাকড় দমন, সার্জারি ও উদ্ভিদের জরুরি চিকিৎসা সেবা। ২৪/৭ অন-কল ডাক্তার ভিজিট।",
  openGraph: {
    title: "ট্রি ডক্টর ও আরবান ফরেস্ট্রি ক্লিনিক | AR Green Garden",
    description: "গাছের রোগ নির্ণয়, পোকা মাকড় দমন, সার্জারি ও উদ্ভিদের জরুরি চিকিৎসা সেবা। ২৪/৭ অন-কল ডাক্তার ভিজিট।",
    type: "website",
  },
};

export default function TreeDoctorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
