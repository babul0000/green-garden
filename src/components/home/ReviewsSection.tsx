"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ReviewItem {
  name: string;
  roleBn: string;
  roleEn: string;
  locationBn: string;
  locationEn: string;
  rating: number;
  dateBn: string;
  dateEn: string;
  textBn: string;
  textEn: string;
  avatar: string;
  projectTypeBn: string;
  projectTypeEn: string;
}

const initialReviews: ReviewItem[] = [
  {
    name: "প্রকৌ. জাহিদ হাসান",
    roleBn: "পেন্টহাউস স্বত্বাধিকারী",
    roleEn: "Penthouse Owner",
    locationBn: "রোড ৯/এ, ধানমন্ডি, ঢাকা",
    locationEn: "Road 9/A, Dhanmondi, Dhaka",
    rating: 5,
    dateBn: "আগস্ট ২০২৬",
    dateEn: "August 2026",
    textBn: "এ আর গ্রিন গার্ডেন আমাদের ধানমন্ডির ছাদকে পুরোপুরি একটি স্বর্গীয় আশ্রয়ে পরিণত করেছে। বিশেষ করে তাদের ওয়াটারপ্রুফিং আর অটো-ড্রিপ ইরিগেশন অসাধারণ। গাছের কোনো যত্ন নিতে ঝামেলা পোহাতে হয় না।",
    textEn: "A R Green Garden transformed our Dhanmondi rooftop into a breathtaking sanctuary. Their waterproofing and automated irrigation give us complete peace of mind.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    projectTypeBn: "লাক্সারি ছাদবাগান",
    projectTypeEn: "Luxury Rooftop Garden",
  },
  {
    name: "ডা. ফারহানা চৌধুরী",
    roleBn: "বাসিন্দা ও গৃহমালিক",
    roleEn: "Resident & Homeowner",
    locationBn: "গুলশান-২, ঢাকা",
    locationEn: "Gulshan-2, Dhaka",
    rating: 5,
    dateBn: "জুলাই ২০২৬",
    dateEn: "July 2026",
    textBn: "আমাদের বাগানের ২০ বছরের পুরনো আম গাছটি পোকার আক্রমণে প্রায় মরতে বসেছিল। তাদের ট্রি ডক্টর টিম এসে ৩টি সেশনের ট্রিটমেন্টে গাছটিকে সম্পূর্ণ সুস্থ করে তুলেছেন। তাদের জ্ঞান সত্যিই প্রশংসনীয়।",
    textEn: "Our 20-year-old mango tree was dying from severe pest infestation. The Tree Doctor team successfully revived it in 3 sessions. Exceptional botanical expertise.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    projectTypeBn: "ট্রি ডক্টর চিকিৎসা",
    projectTypeEn: "Tree Doctor Care",
  },
  {
    name: "মাহমুদুর রহমান",
    roleBn: "ম্যানেজিং ডিরেক্টর",
    roleEn: "Managing Director",
    locationBn: "বনানী, ঢাকা",
    locationEn: "Banani, Dhaka",
    rating: 5,
    dateBn: "সেপ্টেম্বর ২০২৬",
    dateEn: "September 2026",
    textBn: "আমাদের অফিসের এন্ট্রান্সে তাদের তৈরি করা ভার্টিক্যাল গ্রিন ওয়াল ক্লায়েন্টদের প্রথম দেখাতেই মুগ্ধ করে। মেইনটেন্যান্স টিমও সময়মতো এসে নিয়মিত পরিচর্যা করে যায়।",
    textEn: "The living green wall installed at our corporate reception captivates every visitor. Their maintenance team is punctual and highly professional.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    projectTypeBn: "করপোরেট গ্রিন ওয়াল",
    projectTypeEn: "Commercial Vertical Wall",
  },
];

export default function ReviewsSection() {
  const { language, t } = useLanguage();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                {t("Client Testimonials", "Client Testimonials")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                {t("Client Endorsements & Stories", "Client Endorsements & Stories")}
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              {t(
                "ঢাকা ও সারা বাংলাদেশের পেন্টহাউস মালিক, করপোরেট হেডকোয়ার্টার্স এবং এস্টেট ক্লায়েন্টদের বাস্তব অভিজ্ঞতা।",
                "Direct testimonials from penthouse owners, corporate headquarters, and residential estates across Dhaka."
              )}
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-stone-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:border-[#2B4D33]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 text-sm">
                    {"★".repeat(r.rating)}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider bg-[#E4E2D7] text-[#121813] px-2.5 py-0.5 rounded-full font-bold">
                    {language === "bn" ? r.projectTypeBn : r.projectTypeEn}
                  </span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#54595F] leading-relaxed italic">
                  "{language === "bn" ? r.textBn : r.textEn}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-11 h-11 rounded-full object-cover border border-stone-300"
                />
                <div>
                  <h4 className="font-display font-bold text-sm text-[#121813]">
                    {r.name}
                  </h4>
                  <p className="font-mono text-[11px] text-[#2B4D33] font-semibold">
                    {language === "bn" ? r.roleBn : r.roleEn}
                  </p>
                  <p className="font-mono text-[10px] text-[#75787B]">
                    {language === "bn" ? r.locationBn : r.locationEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
