"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ShmaLife() {
  const { language } = useLanguage();

  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[620px] overflow-hidden bg-black flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://shmadesigns.com/wp-content/uploads/2025/06/Banner-Website-Shma-19th_Artboard-1_01-1.jpg"
          alt="Studio Life"
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]"></div>
      </div>

      {/* Narrative Overlay */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-6 sm:px-10 py-16 text-white space-y-6">
        <div className="flex flex-wrap items-baseline gap-4 mb-4">
          <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl tracking-tight text-white">
            {language === "bn" ? "স্টুডিও ও কর্মসংস্কৃতি" : "Studio Life & Culture"}
          </h2>
        </div>

        <div className="max-w-2xl space-y-4 font-sans text-sm sm:text-base font-light text-white/90 leading-relaxed">
          {language === "bn" ? (
            <>
              <p>
                ঢাকার প্রাণকেন্দ্র ধানমন্ডিতে অবস্থিত এ আর গ্রিন গার্ডেনের স্টুডিও ক্যাম্পাস। এখানে নবীন ও অভিজ্ঞ ল্যান্ডস্কেপ আর্কিটেক্ট, আরবারিস্ট এবং সিভিল ইঞ্জিনিয়াররা মিলেমিশে গড়ে তুলেছেন এক উন্মুক্ত উদ্ভাবনী পরিবেশ। প্রকৃতি ও আধুনিক স্থাপত্যের মেলবন্ধনে পরিবেশবান্ধব নগরায়ন গড়ে তোলাই আমাদের প্রতিটি কাজের মূল প্রেরণা।
              </p>
              <p>
                আমাদের স্টুডিও কেবল গতানুগতিক কাজের জায়গা নয়, বরং এটি ধানমন্ডির বুকে এক জীবন্ত সবুজ গবেষণাগার—যেখানে পরিবেশপ্রেমী শিক্ষার্থী, নগর পরিকল্পনাবিদ ও গ্রাহকদের জন্য টেকসই ল্যান্ডস্কেপ ডিজাইন শেখা ও অভিজ্ঞতা বিনিময়ের এক উন্মুক্ত দ্বার সবসময় প্রস্তুত।
              </p>
            </>
          ) : (
            <>
              <p>
                Located in the heart of Dhanmondi, the A R Green Garden studio is an open collaborative space where landscape architects, arborists, and civil engineers unite around climate-resilient design. Our primary motivation is to blend living botany with contemporary architecture to enrich the urban fabric of Bangladesh.
              </p>
              <p>
                Beyond a traditional architectural studio, our campus serves as a biophilic learning laboratory. It welcomes students, researchers, and clients to explore native flora cultivation, structural waterproofing, and sustainable water conservation firsthand.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
