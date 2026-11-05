"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface FieldNote {
  id: string;
  locationEn: string;
  locationBn: string;
  titleEn: string;
  titleBn: string;
  image: string;
  link: string;
}

const figmaFieldNotes: FieldNote[] = [
  {
    id: "1",
    locationEn: "Site analysis · Dhanmondi",
    locationBn: "সাইট পরিদর্শন · ধানমন্ডি",
    titleEn: "Reading the rooftop",
    titleBn: "ছাদের পরিবেশ পাঠ",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80",
    link: "/gallery?filter=rooftop",
  },
  {
    id: "2",
    locationEn: "Planting · Uttara",
    locationBn: "বৃক্ষরোপণ · উত্তরা",
    titleEn: "A new citrus home",
    titleBn: "লেবুজাতীয় গাছের নতুন ঘর",
    image: "/featured_plant.png",
    link: "/gallery?filter=planting",
  },
  {
    id: "3",
    locationEn: "Irrigation · Mirpur",
    locationBn: "সেচ ব্যবস্থা · মিরপুর",
    titleEn: "Water, wisely",
    titleBn: "পরিমিত ও বুদ্ধিমান সেচ",
    image: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?w=600&q=80",
    link: "/gallery?filter=irrigation",
  },
  {
    id: "4",
    locationEn: "Tree care · Banani",
    locationBn: "গাছের যত্ন · বনানী",
    titleEn: "Listening to leaves",
    titleBn: "পাতার ভাষা বোঝা",
    image: "/hero_plants.png",
    link: "/tree-doctor",
  },
  {
    id: "5",
    locationEn: "Lighting · Gazipur",
    locationBn: "গার্ডেন লাইটিং · গাজীপুর",
    titleEn: "After the sun sets",
    titleBn: "সূর্যাস্তের পর আলোর স্নিগ্ধতা",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80",
    link: "/gallery?filter=lighting",
  },
];

export default function ShmaRecentActivities() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <section id="activities" className="py-16 sm:py-24 text-[#183A2D] bg-[#FAFAF8] border-b border-[#DADFD5]/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16">
        {/* Header (Figma Spec) */}
        <div className="mb-10 sm:mb-14 space-y-2">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#6B746C] block font-medium">
            {isBn ? "সাম্প্রতিক মাঠ কার্যক্রম / সচিত্র জার্নাল" : "RECENT FIELD ACTIVITIES / ILLUSTRATIVE JOURNAL"}
          </span>
          <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-normal tracking-tight text-[#183A2D] leading-[1.1]">
            {isBn ? "মাঠ পর্যায় থেকে আমাদের অভিজ্ঞতা।" : "Notes from the field."}
          </h2>
        </div>

        {/* 5-Column Field Activity Grid (Figma: 243x303 each) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-6">
          {figmaFieldNotes.map((note) => (
            <Link
              key={note.id}
              href={note.link}
              className="group flex flex-col space-y-3 cursor-pointer"
            >
              <div className="relative aspect-[243/210] w-full overflow-hidden rounded-xl bg-stone-200">
                <img
                  src={note.image}
                  alt={note.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/hero_plants.png";
                  }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#6B746C] block">
                  {isBn ? note.locationBn : note.locationEn}
                </span>
                <h3 className="font-serif text-[20px] sm:text-[22px] font-normal text-[#183A2D] group-hover:text-[#194B37] transition-colors leading-snug">
                  {isBn ? note.titleBn : note.titleEn}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#183A2D] group-hover:underline pt-1">
                  <span>{isBn ? "জার্নাল পড়ুন" : "Read the field note"}</span>
                  <span className="text-[14px]">↗</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
