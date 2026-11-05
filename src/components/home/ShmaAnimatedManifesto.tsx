"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface ManifestoConfig {
  lineEn?: string;
  lineBn?: string;
  descriptionEn?: string;
  descriptionBn?: string;
}

export default function ShmaAnimatedManifesto({ manifestoConfig }: { manifestoConfig?: ManifestoConfig }) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <section id="manifesto" className="w-full bg-[#FAFAF8] text-[#183A2D] py-16 sm:py-24 border-b border-[#DADFD5]/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16">
        {/* Kicker (Figma: OUR MANIFESTO, Inter 11px, #6B746C) */}
        <div className="mb-8 sm:mb-12">
          <span className="text-[#6B746C] font-mono text-[10px] sm:text-[11px] tracking-[0.25em] uppercase font-medium">
            {isBn ? "আমাদের দর্শন ও অঙ্গীকার" : "OUR MANIFESTO"}
          </span>
        </div>

        {/* 2-Column Architectural Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Big Grand Serif Headline (Figma: 78px Cormorant Garamond, #183A2D) */}
          <div className="lg:col-span-7">
            <h2 className="font-serif text-[36px] sm:text-[54px] lg:text-[72px] font-normal text-[#183A2D] leading-[1.08] tracking-tight">
              {isBn ? (
                <>
                  <span className="block text-[#194B37] font-medium">ENABLE CHANGE</span>
                  <span>FOR A BETTER EARTH.</span>
                </>
              ) : (
                manifestoConfig?.lineEn || "ENABLE CHANGE FOR A BETTER EARTH"
              )}
            </h2>
            <p className="mt-4 text-xs sm:text-sm font-mono tracking-widest uppercase text-[#6B746C]">
              {isBn ? "ইকোলজিক্যাল আর্কিটেকচার ও বায়োফিলিক ল্যান্ডস্কেপ" : "ECOLOGICAL LANDSCAPE ARCHITECTURE"}
            </p>
          </div>

          {/* Right Column: Studio Intent & Action Button (Figma: 446px wide, Inter 15px, #6B746C) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5 sm:space-y-6 pt-2 lg:pt-4">
            <div className="space-y-4">
              <p className="text-[14px] sm:text-[15px] text-[#6B746C] leading-[1.65] font-sans">
                {isBn
                  ? "একটি বাগান কেবল একটি সুন্দর স্থান নয়। এটি নগরজীবনের প্রতি পরম যত্ন ও ভালোবাসার একটি ক্ষুদ্র নিবেদন।"
                  : "A garden is more than a beautiful place. It is a small act of care for the city around it."}
              </p>
              <p className="text-[14px] sm:text-[15px] text-[#6B746C] leading-[1.65] font-sans">
                {isBn
                  ? "আমরা ল্যান্ডস্কেপ ডিজাইন, বৈজ্ঞানিক বৃক্ষরোপণ এবং দীর্ঘমেয়াদী পরিচর্যাকে একত্র করি — ঢাকার একটি ব্যক্তিগত ব্যালকনি থেকে শুরু করে উন্মুক্ত সবুজ প্রাঙ্গণ পর্যন্ত।"
                  : "We bring landscape design, thoughtful planting and long-term care together — from a balcony in Dhaka to a shared courtyard."}
              </p>
            </div>

            {/* Action: Meet the studio ↗ (Figma: Action 179x48 box, #183A2D text) */}
            <div className="pt-2">
              <Link
                href="/about"
                className="group/btn inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white hover:bg-[#183A2D] text-[#183A2D] hover:text-white border border-[#183A2D]/25 hover:border-[#183A2D] text-xs sm:text-sm font-medium tracking-wide shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{isBn ? "স্টুডিও পরিচিতি" : "Meet the studio"}</span>
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
      </div>
    </section>
  );
}
