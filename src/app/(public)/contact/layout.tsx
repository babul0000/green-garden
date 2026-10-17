import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "যোগাযোগ ও স্টুডিও কোঅর্ডিনেটস (Contact Us)",
  description: "এ আর গ্রিন গার্ডেনের সাথে সরাসরি যোগাযোগ করুন। হটলাইন: 01883012641, ধানমন্ডি, ঢাকা, বাংলাদেশ।",
  openGraph: {
    title: "যোগাযোগ ও স্টুডিও কোঅর্ডিনেটস | AR Green Garden",
    description: "এ আর গ্রিন গার্ডেনের সাথে সরাসরি যোগাযোগ করুন। হটলাইন: 01883012641, ধানমন্ডি, ঢাকা, বাংলাদেশ।",
    type: "website",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
