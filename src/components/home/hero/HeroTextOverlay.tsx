"use client";

import React from "react";
import Link from "next/link";

interface HeroTextOverlayProps {
  enableTextOverlay?: boolean;
  isBn: boolean;
  taglineEn?: string;
  taglineBn?: string;
  headlineEn?: string;
  headlineBn?: string;
  descriptionEn?: string;
  descriptionBn?: string;
  textPosition?: "center" | "bottom-left";
  onProjectsClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function HeroTextOverlay({
  enableTextOverlay = true,
  isBn,
  taglineEn,
  taglineBn,
  headlineEn,
  headlineBn,
  descriptionEn,
  descriptionBn,
  textPosition = "bottom-left",
  onProjectsClick,
}: HeroTextOverlayProps) {
  if (!enableTextOverlay) return null;

  // Figma Specs:
  // Kicker: "LANDSCAPES FOR A LIVING CITY" font: Inter 11px w400 rgba(221, 232, 170, 1) [#DDE8AA]
  // Main Hero: "প্রকৃতির ছোঁয়ায় বদলে দিন আপনার চারপাশ" font: Noto Sans Bengali 54px w400 rgba(255, 255, 255, 1)
  // Supporting Slogan: "আপনার স্বপ্নের সবুজায়ন, আমাদের দক্ষতায়" font: Noto Sans Bengali 20px w400 rgba(255, 255, 255, 1)
  const kicker = taglineEn || "LANDSCAPES FOR A LIVING CITY";
  const mainHeadline = isBn
    ? headlineBn || "প্রকৃতির ছোঁয়ায় বদলে দিন আপনার চারপাশ"
    : headlineEn || "LANDSCAPES FOR A LIVING CITY";
  const supportingSlogan = isBn
    ? descriptionBn || "আপনার স্বপ্নের সবুজায়ন, আমাদের দক্ষতায়"
    : descriptionEn || "Dhaka, Bangladesh — Spaces for a greener everyday";

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end px-4 sm:px-12 lg:px-16 pb-20 sm:pb-24 max-w-[1440px] mx-auto w-full">
      <div className="max-w-3xl space-y-3 sm:space-y-4">
        {/* Kicker (Figma: LANDSCAPES FOR A LIVING CITY, #DDE8AA) */}
        <span className="inline-block text-[#DDE8AA] font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-medium drop-shadow-xs">
          {kicker}
        </span>

        {/* Bengali Main Hero Slogan (Figma: 54px) */}
        <h1 className="text-[30px] xs:text-[36px] sm:text-5xl lg:text-[54px] font-normal leading-[1.15] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          {mainHeadline}
        </h1>

        {/* Bengali Supporting Slogan (Figma: 20px) */}
        <p className="text-sm sm:text-lg lg:text-[20px] font-normal text-white/95 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
          {supportingSlogan}
        </p>

        {/* Hero Actions (Figma: 514x48 box, rgba(25, 75, 55, 1) / #194B37) */}
        <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3 pointer-events-auto">
          {/* Action 1: Explore Projects */}
          <Link
            href="/projects"
            onClick={onProjectsClick}
            className="group/btn inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#194B37] hover:bg-[#226248] text-white text-xs sm:text-sm font-medium tracking-wide border border-white/35 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{isBn ? "প্রজেক্টসমূহ দেখুন" : "Explore Projects"}</span>
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

          {/* Action 2: Free Consultation */}
          <Link
            href="/contact"
            className="group/btn inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#194B37] hover:bg-[#226248] text-white text-xs sm:text-sm font-medium tracking-wide border border-white/35 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>{isBn ? "ফ্রি পরামর্শ" : "Free Consultation"}</span>
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

          {/* Action 3: Call Now */}
          <a
            href="tel:01883012641"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium text-white/95 hover:text-[#DDE8AA] transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4 fill-current opacity-90"
              viewBox="0 0 24 24"
            >
              <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
            <span>{isBn ? "সরাসরি কল করুন" : "Call Now"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
