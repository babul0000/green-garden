"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ProcessConfig {
  titleEn?: string;
  titleBn?: string;
  steps?: Array<{
    iconEn?: string;
    titleEn?: string;
    titleBn?: string;
    descEn?: string;
    descBn?: string;
  }>;
}

const figmaStages = [
  {
    step: "01",
    titleEn: "Discovery & Site Analysis",
    titleBn: "অনুসন্ধান ও সাইট বিশ্লেষণ",
    descEn: "Sun, wind, drainage and the way you want to use your space.",
    descBn: "সূর্যকিরণ, বাতাস, ড্রেনেজ ব্যবস্থা এবং আপনার চাহিদার গভীর পর্যবেক্ষণ।",
  },
  {
    step: "02",
    titleEn: "Concept & 3D Landscape Design",
    titleBn: "কনসেপ্ট ও থ্রিডি ল্যান্ডস্কেপ নকশা",
    descEn: "Plant palettes, material choices and a considered spatial direction.",
    descBn: "উদ্ভিদ নির্বাচন, টেকসই উপকরণ এবং আধুনিক স্থাপত্য রূপরেখা প্রণয়ন।",
  },
  {
    step: "03",
    titleEn: "Implementation & Planting",
    titleBn: "বাস্তবায়ন ও বৈজ্ঞানিক রোপণ",
    descEn: "Careful site preparation, planting and irrigation installation.",
    descBn: "নিখুঁত সাইট প্রস্তুতি, বৃক্ষরোপণ এবং স্বয়ংক্রিয় ড্রিপ সেচ স্থাপন।",
  },
  {
    step: "04",
    titleEn: "Lifelong Care & Maintenance",
    titleBn: "আজীবন যত্ন ও দীর্ঘমেয়াদী পরিচর্যা",
    descEn: "Seasonal visits and plant-health records for a living landscape.",
    descBn: "মৌসুমী ভিজিট ও ডিজিটাল হেলথ ট্র্যাকিংয়ের মাধ্যমে দীর্ঘায়ু নিশ্চিতকরণ।",
  },
];

export default function ShmaProcess({ processConfig }: { processConfig?: ProcessConfig }) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <section id="process" className="py-16 sm:py-24 text-[#183A2D] bg-[#FAFAF8] border-b border-[#DADFD5]/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16">
        {/* Header (Figma Spec) */}
        <div className="mb-12 sm:mb-16 space-y-2">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#6B746C] block font-medium">
            {isBn ? "আমরা যেভাবে কাজ করি" : "HOW WE WORK"}
          </span>
          <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-normal tracking-tight text-[#183A2D] leading-[1.1]">
            {isBn ? "সুপরিকল্পিত প্রক্রিয়া। জীবন্ত স্নিগ্ধ ফল।" : "A thoughtful process. A living result."}
          </h2>
        </div>

        {/* Four Stage Process (Figma: Four stage process 1296x169, 300px each) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {figmaStages.map((stg) => (
            <div key={stg.step} className="space-y-4 pt-4 border-t border-[#DADFD5]">
              <span className="font-mono text-xs text-[#6B746C] block">
                {stg.step}
              </span>
              <h3 className="font-serif text-[22px] sm:text-[26px] font-normal text-[#183A2D] leading-snug min-h-[56px]">
                {isBn ? stg.titleBn : stg.titleEn}
              </h3>
              <p className="font-sans text-xs sm:text-[13px] text-[#6B746C] leading-relaxed">
                {isBn ? stg.descBn : stg.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
