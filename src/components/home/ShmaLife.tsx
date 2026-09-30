"use client";

import React from "react";

export default function ShmaLife() {
  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[620px] overflow-hidden bg-black flex items-center">
      {/* Studio Office Atmosphere Background Image */}
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
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"></div>
      </div>

      {/* Narrative Overlay with Bilingual Harmony */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-6 sm:px-10 py-16 text-white space-y-6">
        <div className="flex flex-wrap items-baseline gap-4 mb-4">
          <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl tracking-tight text-white">
            Studio Life
          </h2>
          <span className="font-sans text-lg sm:text-2xl text-white/70 font-normal">
            • আমাদের স্টুডিও ও কর্মসংস্কৃতি
          </span>
        </div>

        <div className="max-w-2xl space-y-4 font-sans text-sm sm:text-base font-light text-white/90 leading-relaxed">
          <p>
            In the heart of Dhanmondi is the location of the A R Green Garden Campus. ঢাকার প্রাণকেন্দ্র ধানমন্ডিতে অবস্থিত আমাদের স্টুডিও ক্যাম্পাসে নবীন-প্রবীণ ল্যান্ডস্কেপ আর্কিটেক্ট, আরবারিস্ট এবং সিভিল ইঞ্জিনিয়াররা একসাথে কাজ করেন উদ্ভাবনী পরিবেশবান্ধব ধারণার বিকাশে। এটি শুধু একটি অফিস নয়, বরং গবেষণাধর্মী শিক্ষা ও সবুজ ধারণার মিলনমেলা।
          </p>
          <p>
            Our studio goes beyond an ordinary work environment. এটি ধানমন্ডির বুকে এক জীবন্ত সবুজ পকেট স্পেস, যা প্রকৃতিপ্রেমী শিক্ষার্থী, গবেষক ও গ্রাহকদের জন্য টেকসই ল্যান্ডস্কেপ ডিজাইন শেখা ও অভিজ্ঞতা বিনিময়ের এক উন্মুক্ত দ্বার উন্মোচন করে।
          </p>
        </div>
      </div>
    </section>
  );
}
