"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface ServiceCategory {
  id: string;
  slug: string;
  titleEn: string;
  titleBn: string;
  image: string;
}

const figmaServices: ServiceCategory[] = [
  {
    id: "01",
    slug: "landscape-design",
    titleEn: "Landscape design",
    titleBn: "ল্যান্ডস্কেপ ডিজাইন",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
  },
  {
    id: "02",
    slug: "rooftop-gardens",
    titleEn: "Rooftop gardens",
    titleBn: "ছাদবাগান ও ড্রেনেজ",
    image: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?w=800&q=80",
  },
  {
    id: "03",
    slug: "planting-maintenance",
    titleEn: "Planting & maintenance",
    titleBn: "রোপণ ও নিয়মিত পরিচর্যা",
    image: "/featured_plant.png",
  },
  {
    id: "04",
    slug: "tree-doctor",
    titleEn: "Tree Doctor",
    titleBn: "বৃক্ষ চিকিৎসা ও ক্লিনিক",
    image: "/hero_plants.png",
  },
];

export default function ShmaServicesFlip({ columns }: { columns?: number } = {}) {
  const { language, t } = useLanguage();
  const isBn = language === "bn";

  return (
    <section id="service" className="py-16 sm:py-24 text-[#183A2D] bg-[#FAFAF8] border-b border-[#DADFD5]/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16">
        {/* 1. Header (Figma Spec) */}
        <div className="mb-10 sm:mb-14 space-y-2">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#6B746C] block font-medium">
            {isBn ? "আমরা যা করি" : "WHAT WE DO"}
          </span>
          <h2 className="font-serif text-[32px] sm:text-[42px] lg:text-[48px] font-normal tracking-tight text-[#183A2D] leading-[1.1]">
            {isBn ? "বীজ রোপণ থেকে চিরস্থায়ী ছায়া পর্যন্ত।" : "From first seed to lasting shade."}
          </h2>
        </div>

        {/* 2. Four Service Imagery Cards (Figma: 306x346 each) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {figmaServices.map((srv) => (
            <Link
              key={srv.id}
              href={`/services/${srv.slug}`}
              className="group flex flex-col space-y-4 cursor-pointer"
            >
              <div className="relative aspect-[306/300] w-full overflow-hidden rounded-xl bg-stone-200">
                <img
                  src={srv.image}
                  alt={srv.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/hero_plants.png";
                  }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-[24px] sm:text-[28px] font-normal text-[#183A2D] group-hover:text-[#194B37] transition-colors flex items-center gap-1.5">
                  <span>{isBn ? srv.titleBn : srv.titleEn}</span>
                  <span className="text-[18px] opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    ↗
                  </span>
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* 3. Sub-note (Figma: Also in our practice...) */}
        <div className="mt-8 sm:mt-10 pt-4 border-t border-[#DADFD5]/60">
          <p className="text-xs sm:text-[13px] text-[#6B746C] font-sans">
            {isBn
              ? "আমাদের বিশেষজ্ঞ সেবাসমূহের মধ্যে আরও অন্তর্ভুক্ত: স্মার্ট ড্রিপ সেচ ব্যবস্থা, ওয়াটারপ্রুফ ড্রেনেজ এবং অ্যাম্বিয়েন্ট গার্ডেন লাইটিং।"
              : "Also in our practice: irrigation, drainage and garden lighting."}
          </p>
        </div>
      </div>
    </section>
  );
}
