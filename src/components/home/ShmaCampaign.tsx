"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface CampaignConfig {
  textEn?: string;
  textBn?: string;
}

export default function ShmaCampaign({ campaignConfig }: { campaignConfig?: CampaignConfig }) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <section className="w-full bg-[#194B37] text-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[610px] items-stretch">
        {/* Left Column: Campaign Story (Figma: 720x535) */}
        <div className="lg:col-span-6 px-6 sm:px-12 lg:px-16 py-14 sm:py-20 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Kicker (Figma: 10TH ANNIVERSARY / GREEN-CITY CAMPAIGN, Inter 11px, #DDE8AA) */}
            <span className="text-[#DDE8AA] font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-medium block">
              {isBn ? "১০ম বর্ষপূর্তি / গ্রিন-সিটি ক্যাম্পেইন" : "10TH ANNIVERSARY / GREEN-CITY CAMPAIGN"}
            </span>

            {/* Headline (Figma: Cormorant Garamond 64px) */}
            <h2 className="font-serif text-[38px] sm:text-[52px] lg:text-[62px] font-normal leading-[1.08] text-white tracking-tight">
              {isBn ? "আগামীর অধ্যায় একটি সবুজ নগরী।" : "The next chapter is a greener city."}
            </h2>

            {/* Description (Figma: Inter 15px, #E8EEE4) */}
            <p className="text-sm sm:text-[15px] text-[#E8EEE4] leading-[1.65] font-sans max-w-xl">
              {isBn
                ? "ছায়া, বৃষ্টির পানি ও জীববৈচিত্র্যকে আপন করে নেওয়ার এক আন্তরিক আহ্বান। জলবায়ু-সহনশীল বৃক্ষরোপণ, পানি-শোষণকারী ড্রেনেজ ও বাংলাদেশের ঋতুবৈচিত্র্যের উপযোগী আধুনিক ছাদবাগানের অভিযাত্রা।"
                : "An invitation to make room for shade, rain and biodiversity. Explore climate-resilient planting, permeable surfaces and gardens designed for Bangladesh’s changing seasons."}
            </p>
          </div>

          <div className="space-y-6 pt-4">
            <span className="text-[11px] font-mono tracking-wider text-[#E8EEE4]/80 block">
              {isBn ? "ক্যাম্পেইন কনসেপ্ট · বিশেষ বর্ষপূর্তি বার্তা" : "Campaign concept · An anniversary communication direction"}
            </span>

            {/* Action Button: Start a climate-conscious garden ↗ */}
            <Link
              href="/contact?topic=climate-garden"
              className="group/btn inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 rounded-full bg-white hover:bg-[#DDE8AA] text-[#183A2D] text-xs sm:text-sm font-medium tracking-wide shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer self-start"
            >
              <span>{isBn ? "জলবায়ু-সচেতন বাগান শুরু করুন" : "Start a climate-conscious garden"}</span>
              <svg
                className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Column: Garden Photography (Figma: 720x610) */}
        <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-full overflow-hidden bg-[#123829]">
          <img
            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80"
            alt="A R Green Garden 10th Anniversary"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/hero_plants.png";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#194B37] via-transparent to-transparent opacity-80 lg:opacity-60" />
        </div>
      </div>
    </section>
  );
}
