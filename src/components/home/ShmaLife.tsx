"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { optimizeImageUrl } from "@/lib/utils";

interface IStudioLifeData {
  titleEn: string;
  titleBn: string;
  image: string;
  paragraph1Bn: string;
  paragraph2Bn: string;
  paragraph1En: string;
  paragraph2En: string;
}

const DEFAULT_STUDIO_LIFE: IStudioLifeData = {
  titleEn: "Studio Life & Culture",
  titleBn: "স্টুডিও লাইফ ও কালচার",
  image: "/hero_plants.png",
  paragraph1Bn: "ঢাকার প্রাণকেন্দ্র ধানমন্ডিতে অবস্থিত এ আর গ্রিন গার্ডেনের স্টুডিও ক্যাম্পাস। এখানে নবীন ও অভিজ্ঞ ল্যান্ডস্কেপ আর্কিটেক্ট, আরবারিস্ট এবং সিভিল ইঞ্জিনিয়াররা মিলেমিশে গড়ে তুলেছেন এক উন্মুক্ত উদ্ভাবনী পরিবেশ। প্রকৃতি ও আধুনিক স্থাপত্যের মেলবন্ধনে পরিবেশবান্ধব নগরায়ন গড়ে তোলাই আমাদের প্রতিটি কাজের মূল প্রেরণা।",
  paragraph2Bn: "আমাদের স্টুডিও কেবল গতানুগতিক কাজের জায়গা নয়, বরং এটি ধানমন্ডির বুকে এক জীবন্ত সবুজ গবেষণাগার—যেখানে পরিবেশপ্রেমী শিক্ষার্থী, নগর পরিকল্পনাবিদ ও গ্রাহকদের জন্য টেকসই ল্যান্ডস্কেপ ডিজাইন শেখা ও অভিজ্ঞতা বিনিময়ের এক উন্মুক্ত দ্বার সবসময় প্রস্তুত।",
  paragraph1En: "Located in the heart of Dhanmondi, the A R Green Garden studio is an open collaborative space where landscape architects, arborists, and civil engineers unite around climate-resilient design. Our primary motivation is to blend living botany with contemporary architecture to enrich the urban fabric of Bangladesh.",
  paragraph2En: "Beyond a traditional architectural studio, our campus serves as a biophilic learning laboratory. It welcomes students, researchers, and clients to explore native flora cultivation, structural waterproofing, and sustainable water conservation firsthand."
};

export default function ShmaLife() {
  const { language } = useLanguage();
  const [data, setData] = useState<IStudioLifeData>(DEFAULT_STUDIO_LIFE);

  useEffect(() => {
    const fetchStudioLife = async () => {
      try {
        const res = await fetch("/api/settings?key=homepage_sections");
        if (res.ok) {
          const json = await res.json();
          if (json?.value?.studioLife) {
            setData((prev) => ({ ...prev, ...json.value.studioLife }));
          }
        }
      } catch (e) {
        // Fallback to default
      }
    };

    fetchStudioLife();

    const handleUpdate = (e: CustomEvent) => {
      if (e.detail?.studioLife) {
        setData((prev) => ({ ...prev, ...e.detail.studioLife }));
      }
    };

    window.addEventListener("homepage-config-updated" as any, handleUpdate as any);
    return () => {
      window.removeEventListener("homepage-config-updated" as any, handleUpdate as any);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[520px] sm:min-h-[620px] overflow-hidden bg-black flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={optimizeImageUrl(data.image || DEFAULT_STUDIO_LIFE.image, 1600)}
          alt={language === "bn" ? data.titleBn : data.titleEn}
          className="w-full h-full object-cover transition-opacity duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/hero_plants.png";
          }}
        />
        <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]"></div>
      </div>

      {/* Narrative Overlay */}
      <div className="relative z-10 max-w-[1380px] mx-auto px-6 sm:px-10 py-16 text-white space-y-6">
        <div className="flex flex-wrap items-baseline gap-4 mb-4">
          <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl tracking-tight text-white">
            {data.titleEn || data.titleBn || "Studio Life & Culture"}
          </h2>
        </div>

        <div className="max-w-2xl space-y-4 font-sans text-sm sm:text-base font-light text-white/90 leading-relaxed">
          {language === "bn" ? (
            <>
              <p>{data.paragraph1Bn}</p>
              {data.paragraph2Bn && <p>{data.paragraph2Bn}</p>}
            </>
          ) : (
            <>
              <p>{data.paragraph1En}</p>
              {data.paragraph2En && <p>{data.paragraph2En}</p>}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
