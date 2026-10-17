import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "কাস্টম গার্ডেন ডিজাইন ও থ্রিডি কনসেপ্ট কমিশন",
  description: "আপনার ছাদ বা আঙিনার জন্য ব্যক্তিগত রুচিসম্মত ৩ডি আর্কিটেকচারাল নকশা ও কনসালটেন্সির সরাসরি আবেদন করুন।",
  openGraph: {
    title: "কাস্টম গার্ডেন ডিজাইন কমিশন | AR Green Garden",
    description: "আপনার ছাদ বা আঙিনার জন্য ব্যক্তিগত রুচিসম্মত ৩ডি আর্কিটেকচারাল নকশা ও কনসালটেন্সির সরাসরি আবেদন করুন।",
    type: "website",
  },
};

export default function DesignGardenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
