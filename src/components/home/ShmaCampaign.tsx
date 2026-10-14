"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface CampaignItem {
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  image: string;
}

const campaigns: CampaignItem[] = [
  {
    titleBn: "এ আর গ্রিন গার্ডেন ১০ম বর্ষপূর্তি",
    titleEn: "A R GREEN GARDEN 10TH",
    subtitleBn: "আগামীর টেকসই ও সবুজ বাংলাদেশ বিনির্মাণে আমাদের অগ্রযাত্রা",
    subtitleEn: "Participating in the Sustainable Future of Bangladesh",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/Banner-Website-Shma-19th_Artboard-1_01-1.jpg",
  },
  {
    titleBn: "বায়োফিলিক বাংলাদেশ ভিশন",
    titleEn: "BIOPHILIC BANGLADESH",
    subtitleBn: "শহুরে ধূসর কংক্রিটে জীবন্ত ইকোসিস্টেম ও নির্মল বাতাসের মেলবন্ধন",
    subtitleEn: "Restoring Living Natural Ecosystems to Urban Architecture",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1600&auto=format&fit=crop",
  },
];

interface CampaignConfig {
  textEn?: string;
  textBn?: string;
  items?: CampaignItem[];
}

export default function ShmaCampaign({ campaignConfig }: { campaignConfig?: CampaignConfig }) {
  const { language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeCampaigns = campaignConfig?.items && campaignConfig.items.length > 0
    ? campaignConfig.items
    : campaignConfig?.textEn
    ? [
        {
          titleBn: campaignConfig.textBn || campaigns[0].titleBn,
          titleEn: campaignConfig.textEn || campaigns[0].titleEn,
          subtitleBn: campaigns[0].subtitleBn,
          subtitleEn: campaigns[0].subtitleEn,
          image: campaigns[0].image,
        },
        ...campaigns.slice(1)
      ]
    : campaigns;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeCampaigns.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeCampaigns.length]);

  const active = activeCampaigns[currentSlide % activeCampaigns.length] || campaigns[0];

  return (
    <section className="relative w-full h-[450px] sm:h-[550px] overflow-hidden bg-black flex items-center justify-center">
      {/* Background Image with Smooth Crossfade */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={active.image}
          alt={language === "bn" ? active.titleBn : active.titleEn}
          className="w-full h-full object-cover transition-all duration-1000 scale-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1600&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Centered Campaign Typography */}
      <div className="relative z-10 text-center text-white px-6 space-y-4 max-w-4xl mx-auto">
        <h2 className="font-display font-light text-3xl sm:text-5xl md:text-6xl tracking-wider uppercase">
          {active.titleEn}
        </h2>
        <p className="font-display font-light text-base sm:text-xl md:text-2xl text-white/90 tracking-wide">
          {language === "bn" ? active.subtitleBn : active.subtitleEn}
        </p>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {campaigns.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === idx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
