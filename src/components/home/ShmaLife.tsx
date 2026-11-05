"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ShmaLife() {
  const { language, t } = useLanguage();
  const isBn = language === "bn";

  return (
    <div className="w-full bg-[#FAFAF8] text-[#183A2D]">
      {/* 1. STUDIO LIFE & CULTURE (FIGMA SPEC: 1440x470, #E9E3D8) */}
      <section className="w-full border-b border-[#DADFD5]/50 overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left: Garden Photography (Figma: 720x470) */}
          <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-[470px] bg-stone-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1530731141654-59610f3b729f?w=1200&q=80"
              alt="A R Green Garden Studio Life"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/hero_plants.png";
              }}
            />
          </div>

          {/* Right: Studio Story (Figma: 720x421 on #E9E3D8) */}
          <div className="lg:col-span-6 bg-[#E9E3D8] px-6 sm:px-12 lg:px-16 py-12 sm:py-16 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#183A2D] block font-medium">
                {isBn ? "স্টুডিও জীবন ও সংস্কৃতি" : "LIFE AT THE STUDIO"}
              </span>
              <h2 className="font-serif text-[32px] sm:text-[44px] lg:text-[50px] font-normal text-[#183A2D] leading-[1.1] tracking-tight">
                {isBn ? "মাটিতে হাত। সৃজনে নতুন ভাবনা।" : "Hands in the soil. Ideas in the making."}
              </h2>
              <p className="text-sm sm:text-[15px] text-[#6B746C] leading-[1.65] font-sans max-w-xl">
                {isBn
                  ? "আমাদের শ্রেষ্ঠ ধারণাগুলা শুরু হয় খোলামেলা আলাপ, সাইট পরিদর্শন এবং উদ্ভিদের প্রকৃত জীবনধারা নিবিড় পর্যবেক্ষণের মধ্য দিয়ে। আসুন পরিচিত হোন সেই দলটির সাথে, যারা এই অনুরাগকে রূপ দেন স্নিগ্ধ বাগানে।"
                  : "Our best ideas begin with a conversation, a site walk and a close look at how plants actually live. Meet the people who turn that curiosity into gardens."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="group/btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-[#183A2D] text-[#183A2D] hover:text-white border border-[#183A2D]/25 text-xs sm:text-sm font-medium tracking-wide shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer self-start"
              >
                <span>{isBn ? "আমাদের স্টুডিওর ভেতরে" : "Inside our studio"}</span>
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
        </div>
      </section>

      {/* 2. GARDEN TOOLS (FIGMA SPEC: 1440x431, 2 CARDS) */}
      <section className="py-16 sm:py-24 border-b border-[#DADFD5]/50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Tool 1: What could your garden become? (Figma: 632x284) */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#DADFD5] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#6B746C] block font-medium">
                  {isBn ? "আপনার বাগান পরিকল্পনা" : "DESIGN YOUR GARDEN"}
                </span>
                <h3 className="font-serif text-[26px] sm:text-[30px] font-normal text-[#183A2D] leading-snug">
                  {isBn ? "আপনার বাগান কেমন হতে পারে?" : "What could your garden become?"}
                </h3>
                <p className="text-xs sm:text-sm text-[#6B746C] leading-relaxed">
                  {isBn
                    ? "আপনার জায়গা, রোপণ শৈলী এবং উপকরণ নির্বাচন করুন। একটি আনুমানিক বাজেট দিয়ে শুরু করুন, তারপর আমাদের দলের সাথে এটি চূড়ান্ত করুন।"
                    : "Choose your space, planting style and materials. Start with an indicative budget, then refine it with our team."}
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs font-mono text-[#183A2D] opacity-80">
                  <span>Rooftop · 600 sq ft</span>
                  <span>•</span>
                  <span>Tropical calm</span>
                </div>
              </div>

              <div>
                <Link
                  href="/design-garden"
                  className="group/btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#194B37] hover:bg-[#206349] text-white text-xs sm:text-sm font-medium tracking-wide shadow-md transition-all hover:scale-105 active:scale-95"
                >
                  <span>{isBn ? "গার্ডেন প্ল্যানার খুলুন" : "Open garden planner"}</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Tool 2: Care for the season. (Figma: 632x303) */}
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#DADFD5] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#6B746C] block font-medium">
                  {isBn ? "উদ্ভিদের যত্ন ও আবহাওয়া পরামর্শ" : "PLANT CARE / WEATHER EXAMPLE"}
                </span>
                <h3 className="font-serif text-[26px] sm:text-[30px] font-normal text-[#183A2D] leading-snug">
                  {isBn ? "চলতি মৌসুমের সঠিক যত্ন।" : "Care for the season."}
                </h3>

                {/* Example Weather Row (Figma: 584x45) */}
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200/60">
                  <span className="text-2xl">🌦️</span>
                  <div>
                    <span className="font-serif text-base sm:text-lg font-medium text-[#183A2D] block">
                      Dhaka · 29°C · Showers
                    </span>
                    <span className="text-[10px] font-mono text-[#6B746C] block">
                      {isBn ? "মৌসুমী নির্দেশক তথ্য" : "Illustrative weather guidance"}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#6B746C] leading-relaxed">
                  {isBn
                    ? "বৃষ্টিপাতের পূর্বে ছাদের ড্রেনেজ আউটলেট পরীক্ষা করুন। মাটির উপরিভাগ শুকিয়ে এলে তবেই গাছে পানি দিন; বৃষ্টির পর ছাদবাগানের টব দীর্ঘক্ষণ ভেজা থাকতে পারে।"
                    : "Check drainage outlets before rainfall. Water only when the upper soil feels dry; rooftop pots can stay wet after a shower."}
                </p>
              </div>

              <div>
                <Link
                  href="/ai-tools"
                  className="group/btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-stone-100 text-[#183A2D] border border-[#183A2D]/30 text-xs sm:text-sm font-medium tracking-wide shadow-xs transition-all hover:scale-105 active:scale-95"
                >
                  <span>{isBn ? "ল্যান্ডস্কেপ সহকারীকে জিজ্ঞাসা করুন" : "Ask the landscape assistant"}</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
