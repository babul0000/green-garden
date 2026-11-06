"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

import { optimizeImageUrl } from "@/lib/utils";

interface ActivityItem {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  image: string;
  dateBn: string;
  dateEn: string;
}

export default function ShmaRecentActivities() {
  const { language, t } = useLanguage();
  const [activityList, setActivityList] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data?.items || [];
          if (items.length > 0) {
            const mapped: ActivityItem[] = items.slice(0, 5).map((g: any, idx: number) => {
              return {
                id: g._id || g.id || `act-${idx}`,
                titleBn: g.titleBn || g.title || "স্টুডিও ল্যান্ডস্কেপ প্রকল্প",
                titleEn: g.titleEn || g.title || "Studio Landscape Showcase",
                subtitleBn: g.category || g.descBn || "স্থাপত্য ও সবুজায়ন",
                subtitleEn: g.category || g.descEn || "Landscape Architecture",
                image: g.imageUrl || g.image || (idx % 2 === 0 ? "/hero_plants.png" : "/featured_plant.png"),
                dateBn: g.dateBn || "২০২৬",
                dateEn: g.dateEn || "2026",
              };
            });
            setActivityList(mapped);
          }
        }
      } catch (e) {
        // Silently preserve empty state
      }
    };
    fetchGallery();
  }, []);

  if (activityList.length === 0) {
    return null;
  }

  return (
    <section id="activities" className="py-20 text-[#323232] bg-white">
      <div className="px-6 sm:px-10">
      
      {/* Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              Recent Activities
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            {t("স্টুডিও সংবাদ ও ইভেন্ট", "Studio News & Events")}
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* 5-Column Photo Stream */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {activityList.map((item, idx) => (
          <div key={item.id} className="space-y-3 group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
              <img
                src={optimizeImageUrl(item.image, 600)}
                alt={item.titleEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/hero_plants.png";
                }}
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="space-y-1">
              <p className="font-sans text-[11px] text-[#75787b] font-light">
                {language === "bn" ? item.dateBn : item.dateEn}
              </p>
              <h3 className="font-sans text-xs sm:text-[13px] font-medium text-[#3d2e17] leading-snug line-clamp-2 group-hover:text-[#5a9dff] transition-colors">
                {item.titleEn || item.titleBn}
              </h3>
              <p className="font-sans text-[11px] text-[#75787b] leading-tight line-clamp-2">
                {item.subtitleBn || item.subtitleEn}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>

    </section>
  );
}
