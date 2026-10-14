"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

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

const activities: ActivityItem[] = [
  {
    id: "act-1",
    titleBn: "বুয়েট স্থাপত্য বিভাগের সাথে মাইক্রোক্লাইমেট গবেষণা",
    titleEn: "Microclimate Landscape Research with BUET Architecture",
    subtitleBn: "নগর তাপমাত্রা হ্রাস ও বায়োফিলিক নকশার প্রভাব নিয়ে যৌথ সমীক্ষা",
    subtitleEn: "Joint study evaluating urban heat island reduction & biophilia",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_0246-800x600.jpg",
    dateBn: "সেপ্টেম্বর ২০২৬",
    dateEn: "September 2026",
  },
  {
    id: "act-2",
    titleBn: "ধানমন্ডি পেন্টহাউস বায়োফিলিক গার্ডেন হস্তান্তর",
    titleEn: "Completion of Dhanmondi Penthouse Bio-Terrace",
    subtitleBn: "৩,৮০০ বর্গফুটের রুফটপ ফরেস্ট ও ওয়াটারপ্রুফ ড্রেনেজ প্রকল্প সফল সম্পন্ন",
    subtitleEn: "3,800 sq.ft rooftop forest with multi-layer waterproof drainage",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_1020-800x600.jpg",
    dateBn: "আগস্ট ২০২৬",
    dateEn: "August 2026",
  },
  {
    id: "act-3",
    titleBn: "গুলশানে হেরিটেজ গাছের সফল সার্জারি ও ট্রি ক্লিনিক",
    titleEn: "Heritage Tree Surgery & Clinical Care in Gulshan",
    subtitleBn: "অন-কল ট্রি ডক্টর টিম দ্বারা শতবর্ষী দুর্লভ রেইনট্রির জীবন রক্ষা",
    subtitleEn: "Emergency arborist team rescued a diseased century-old rain tree",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/1-11-800x534.jpg",
    dateBn: "জুলাই ২০২৬",
    dateEn: "July 2026",
  },
  {
    id: "act-4",
    titleBn: "ঢাকা ক্লাইমেট আর্কিটেকচার সামিটে মূল প্রবন্ধ উপস্থাপন",
    titleEn: "Keynote at Dhaka Climate Architecture Summit",
    subtitleBn: "ভার্টিক্যাল গ্রিন ওয়াল ও রেইনওয়াটার হারভেস্টিং কৌশল প্রদর্শনী",
    subtitleEn: "Showcasing living wall engineering and stormwater harvesting",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/S__10559556-800x600.jpg",
    dateBn: "জুন ২০২৬",
    dateEn: "June 2026",
  },
  {
    id: "act-5",
    titleBn: "কমিউনিটি ছাদবাগান ও ড্রিপ সেচ প্রশিক্ষণ কর্মশালা",
    titleEn: "Community Rooftop & Drip Irrigation Workshop",
    subtitleBn: "গৃহমালিক ও প্রকৃতিপ্রেমীদের জন্য আধুনিক বাগান ব্যবস্থাপনার হাতে-কলমে প্রশিক্ষণ",
    subtitleEn: "Hands-on masterclass for home gardeners on organic soils and micro-drip",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_9771-800x600.jpg",
    dateBn: "মে ২০২৬",
    dateEn: "May 2026",
  },
];

export default function ShmaRecentActivities() {
  const { language, t } = useLanguage();
  const [activityList, setActivityList] = useState<ActivityItem[]>(activities);

  React.useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch(`/api/gallery?_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data?.items || [];
          if (items.length > 0) {
            const mapped: ActivityItem[] = items.slice(0, 5).map((g: any, idx: number) => ({
              id: g._id || g.id || `act-${idx}`,
              titleBn: g.titleBn || g.title || activities[idx % activities.length].titleBn,
              titleEn: g.titleEn || g.title || activities[idx % activities.length].titleEn,
              subtitleBn: g.category || g.descBn || activities[idx % activities.length].subtitleBn,
              subtitleEn: g.category || g.descEn || activities[idx % activities.length].subtitleEn,
              image: g.imageUrl || g.image || activities[idx % activities.length].image,
              dateBn: g.dateBn || "২০২৬",
              dateEn: g.dateEn || "2026",
            }));
            setActivityList(mapped);
          }
        }
      } catch (e) {
        // fallback to default
      }
    };
    fetchGallery();
  }, []);

  return (
    <section id="activities" className="py-20 px-6 sm:px-10 max-w-[1380px] mx-auto text-[#323232] bg-white">
      
      {/* Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              Recent Activities
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            Studio News & Events
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* 5-Column Photo Stream */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {activityList.map((item) => (
          <div key={item.id} className="space-y-3 group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
              <img
                src={item.image}
                alt={item.titleEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="space-y-1">
              <p className="font-sans text-[11px] text-[#75787b] font-light">
                {language === "bn" ? item.dateBn : item.dateEn}
              </p>
              <h3 className="font-sans text-xs sm:text-[13px] font-medium text-[#3d2e17] leading-snug line-clamp-2 group-hover:text-[#5a9dff] transition-colors">
                {item.titleEn}
              </h3>
              <p className="font-sans text-[11px] text-[#75787b] leading-tight line-clamp-2">
                {language === "bn" ? item.subtitleBn : item.subtitleEn}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
