"use client";

import React from "react";
import DesignYourGardenWizard from "@/components/home/DesignYourGardenWizard";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function DesignGardenPage() {
  const { language } = useLanguage();
  const { getPageHeader, txt } = useSiteConfig();
  const bn = language === "bn";
  const header = getPageHeader("designGarden");

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <Link href="/" className="hover:text-emerald-700">
            {txt("common.backHome", "হোম", "Home")}
          </Link>
          <span>/</span>
          <span className="text-emerald-800 font-semibold">
            {bn ? header.titleBn : header.titleEn}
          </span>
        </div>

        <div className="max-w-3xl space-y-2 pb-2">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
            {bn ? header.badgeBn : header.badgeEn}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-gray-900">
            {bn ? header.titleBn : header.titleEn}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {bn ? header.subtitleBn : header.subtitleEn}
          </p>
        </div>

        <DesignYourGardenWizard />
      </div>
    </div>
  );
}
