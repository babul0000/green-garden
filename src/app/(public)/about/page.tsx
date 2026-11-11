"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { canAccessTab } from "@/lib/rbac";
import { AboutPageConfig, DEFAULT_ABOUT_CONFIG } from "@/types/about";

export default function AboutPage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const canEditAbout = Boolean(user && canAccessTab(user.role, "about-studio"));
  const [config, setConfig] = useState<AboutPageConfig>(DEFAULT_ABOUT_CONFIG);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const res = await fetch(`/api/settings?key=about_page_config&_t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.value) {
            setConfig({
              hero: { ...DEFAULT_ABOUT_CONFIG.hero, ...(data.value.hero || {}) },
              storySection: { ...DEFAULT_ABOUT_CONFIG.storySection, ...(data.value.storySection || {}) },
              statsSection: { ...DEFAULT_ABOUT_CONFIG.statsSection, ...(data.value.statsSection || {}) },
              milestonesSection: { ...DEFAULT_ABOUT_CONFIG.milestonesSection, ...(data.value.milestonesSection || {}) },
              teamSection: { ...DEFAULT_ABOUT_CONFIG.teamSection, ...(data.value.teamSection || {}) },
              ctaSection: { ...DEFAULT_ABOUT_CONFIG.ctaSection, ...(data.value.ctaSection || {}) },
            });
          }
        }
      } catch (err) {
        console.warn("Using default about page configuration", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();

    // Listen to real-time custom update event from admin preview
    const handleLiveUpdate = (e: any) => {
      if (e.detail) {
        setConfig((prev) => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener("about-config-updated", handleLiveUpdate);
    return () => window.removeEventListener("about-config-updated", handleLiveUpdate);
  }, []);

  const isBn = language === "bn";

  // Helpers for localized text fallback
  const getLocalized = (bnVal?: string, enVal?: string, fallback = ""): string => {
    if (isBn) {
      return bnVal?.trim() ? bnVal : enVal || fallback;
    }
    return enVal?.trim() ? enVal : bnVal || fallback;
  };

  const { hero, storySection, statsSection, milestonesSection, teamSection, ctaSection } = config;

  return (
    <div className="bg-[#FAF9F5] text-[#121813] font-sans min-h-screen py-16 sm:py-24 px-4 sm:px-6 lg:px-8 relative selection:bg-[#2B4D33] selection:text-white">
      {/* Background Architectural Ambient Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#D6D2C4_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto flex flex-col gap-20 sm:gap-28 relative z-10">

        {/* ── ADMIN QUICK EDIT BAR (Visible only to logged-in Admin / Editor) ── */}
        {canEditAbout && (
          <div className="bg-[#18221A] text-white px-4 sm:px-6 py-3 rounded-2xl border border-emerald-500/30 shadow-lg flex flex-wrap items-center justify-between gap-3 -mb-10 sm:-mb-16">
            <div className="flex items-center gap-2.5 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="font-mono text-emerald-300 font-bold uppercase tracking-wider">Admin Mode</span>
              <span className="text-stone-300 hidden sm:inline">
                এই পেজের প্রতিটি লেখা, ছবি, মাইলস্টোন ও টিম মেম্বার সরাসরি এডিট ও ডিলিট করুন
              </span>
            </div>
            <Link
              href="/admin?tab=about-studio"
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-all shadow-xs"
            >
              <span>✏️</span>
              <span>About Studio খুলুন</span>
              <span>➔</span>
            </Link>
          </div>
        )}
        
        {/* ── SECTION 1: HERO BANNER ── */}
        {hero.visible !== false && (
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-6 animate-fade-in-up">
            {/* Architectural Sub-badge */}
            <span className="text-xs sm:text-[13px] font-mono font-bold tracking-[0.2em] text-[#2B4D33] uppercase px-3.5 py-1 rounded-full bg-[#2B4D33]/10 border border-[#2B4D33]/20 shadow-2xs">
              {getLocalized(hero.badgeBn, hero.badgeEn, "OUR JOURNEY")}
            </span>

            {/* Page Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#121813] tracking-tight leading-[1.15]">
              {getLocalized(hero.titleBn, hero.titleEn)}
            </h1>

            {/* Architectural Separator */}
            <div className="w-16 h-1 bg-[#2B4D33]/30 rounded-full mx-auto"></div>

            {/* Subtitle / Description */}
            <p className="text-sm sm:text-base md:text-lg text-[#4F5255] leading-relaxed max-w-2xl font-light">
              {getLocalized(hero.descriptionBn, hero.descriptionEn)}
            </p>

            {/* Optional Cover Image */}
            {hero.coverImage && (
              <div className="w-full mt-4 rounded-3xl overflow-hidden border border-[#D6D2C4] shadow-xl max-h-[380px]">
                <img
                  src={hero.coverImage}
                  alt="A R Green Garden Studio"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* ── SECTION 2: STATS COUNTERS BAR ── */}
        {statsSection.visible !== false && statsSection.items.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white/80 backdrop-blur-md border border-[#D6D2C4] rounded-3xl p-6 sm:p-8 shadow-sm">
            {statsSection.items.map((stat, idx) => (
              <div
                key={stat.id || idx}
                className="text-center flex flex-col items-center justify-center p-3 border-r last:border-r-0 border-[#E4E2D7]"
              >
                <span className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold text-[#2B4D33] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-mono text-[#75787B] uppercase tracking-wider mt-1 font-semibold">
                  {getLocalized(stat.labelBn, stat.labelEn)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ── SECTION 3: STORY, MISSION & VISION ── */}
        {storySection.visible !== false && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-stretch">
            {/* Our Story Card */}
            <div className="bg-white/80 backdrop-blur-md border border-[#D6D2C4] rounded-3xl p-7 sm:p-9 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#2B4D33] block mb-2">
                  {isBn ? "প্রতিষ্ঠার পটভূমি" : "ORIGIN STORY"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#121813] mb-4">
                  {getLocalized(storySection.storyTitleBn, storySection.storyTitleEn, "Our Story")}
                </h3>
                <p className="text-sm sm:text-[15px] text-[#4F5255] leading-relaxed font-light whitespace-pre-line">
                  {getLocalized(storySection.storyBn, storySection.storyEn)}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E4E2D7] flex items-center justify-between text-xs font-mono text-[#75787B]">
                <span>A R GREEN GARDEN</span>
                <span>EST. 2016</span>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="flex flex-col gap-6 justify-center">
              {/* Mission */}
              <div className="bg-white/80 backdrop-blur-md border border-[#D6D2C4] rounded-2xl p-6 sm:p-7 shadow-sm flex items-start gap-4 sm:gap-5 hover:border-[#2B4D33]/40 transition-colors">
                <span className="text-3xl sm:text-4xl shrink-0 p-3 rounded-2xl bg-[#2B4D33]/10 border border-[#2B4D33]/15">
                  🎯
                </span>
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-serif text-[#121813]">
                    {getLocalized(storySection.missionTitleBn, storySection.missionTitleEn, "Our Mission")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4F5255] mt-1.5 leading-relaxed font-light">
                    {getLocalized(storySection.missionBn, storySection.missionEn)}
                  </p>
                </div>
              </div>

              {/* Vision */}
              <div className="bg-white/80 backdrop-blur-md border border-[#D6D2C4] rounded-2xl p-6 sm:p-7 shadow-sm flex items-start gap-4 sm:gap-5 hover:border-[#2B4D33]/40 transition-colors">
                <span className="text-3xl sm:text-4xl shrink-0 p-3 rounded-2xl bg-[#2B4D33]/10 border border-[#2B4D33]/15">
                  👁️
                </span>
                <div>
                  <h4 className="text-base sm:text-lg font-bold font-serif text-[#121813]">
                    {getLocalized(storySection.visionTitleBn, storySection.visionTitleEn, "Our Vision")}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#4F5255] mt-1.5 leading-relaxed font-light">
                    {getLocalized(storySection.visionBn, storySection.visionEn)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── SECTION 4: MILESTONES TIMELINE ── */}
        {milestonesSection.visible !== false && milestonesSection.items.length > 0 && (
          <div className="flex flex-col gap-10 sm:gap-14">
            <div className="text-center max-w-xl mx-auto flex flex-col items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#2B4D33]">
                {isBn ? "অগ্রযাত্রার মাইলফলক" : "ARCHITECTURAL TIMELINE"}
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#121813] tracking-tight">
                {getLocalized(milestonesSection.headingBn, milestonesSection.headingEn, "Company Milestones")}
              </h3>
              <p className="text-xs sm:text-sm text-[#75787B] font-light">
                {getLocalized(milestonesSection.subheadingBn, milestonesSection.subheadingEn)}
              </p>
            </div>

            {/* Timeline Stream */}
            <div className="relative border-l-2 border-[#2B4D33]/25 ml-4 md:mx-auto max-w-2xl flex flex-col gap-10">
              {milestonesSection.items.map((m, idx) => (
                <div key={m.id || idx} className="relative pl-8 sm:pl-10 group">
                  {/* Timeline Node Dot */}
                  <span className="absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#2B4D33] border-4 border-[#FAF9F5] shadow-xs group-hover:scale-125 transition-transform"></span>

                  <span className="inline-block bg-[#2B4D33] text-white text-xs font-mono font-bold px-3 py-1 rounded-full mb-2 shadow-xs">
                    {m.year}
                  </span>

                  <h4 className="text-base sm:text-lg font-bold font-serif text-[#121813] tracking-tight">
                    {getLocalized(m.titleBn, m.titleEn)}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#4F5255] mt-1.5 leading-relaxed font-light">
                    {getLocalized(m.descBn, m.descEn)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 5: LEADERSHIP & TEAM ── */}
        {teamSection.visible !== false && teamSection.members.length > 0 && (
          <div className="flex flex-col gap-10 sm:gap-14">
            <div className="text-center max-w-xl mx-auto flex flex-col items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#2B4D33]">
                {isBn ? "অভিজ্ঞ নেতৃত্ব" : "OUR PRACTICE TEAM"}
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#121813] tracking-tight">
                {getLocalized(teamSection.headingBn, teamSection.headingEn, "Meet Our Leadership")}
              </h3>
              <p className="text-xs sm:text-sm text-[#75787B] font-light">
                {getLocalized(teamSection.subheadingBn, teamSection.subheadingEn)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {teamSection.members.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className="bg-white/80 backdrop-blur-md border border-[#D6D2C4] rounded-3xl p-6 sm:p-7 text-center flex flex-col items-center shadow-sm hover:shadow-xl hover:border-[#2B4D33]/40 transition-all duration-300 group"
                >
                  {/* Photo or Icon */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-[#FAF9F5] border-2 border-[#2B4D33]/20 flex items-center justify-center text-4xl mx-auto mb-4 shadow-inner group-hover:scale-105 transition-transform">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.nameEn}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{member.icon || "👨‍💼"}</span>
                    )}
                  </div>

                  <h4 className="font-serif font-bold text-base sm:text-lg text-[#121813]">
                    {getLocalized(member.nameBn, member.nameEn)}
                  </h4>

                  <p className="text-xs font-mono font-semibold text-[#2B4D33] uppercase tracking-wider mt-1">
                    {getLocalized(member.roleBn, member.roleEn)}
                  </p>

                  <p className="text-xs text-[#555] mt-3 leading-relaxed font-light line-clamp-3">
                    {getLocalized(member.bioBn, member.bioEn)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SECTION 6: CALL TO ACTION (CTA) BANNER ── */}
        {ctaSection.visible !== false && (
          <div className="bg-[#18221A] text-white rounded-[32px] p-8 sm:p-12 md:p-16 text-center flex flex-col items-center gap-6 shadow-2xl border border-white/10 relative overflow-hidden">
            {/* Ambient Lighting Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-emerald-400 uppercase">
              {isBn ? "প্রজেক্ট কনসালটেশন" : "START A COMMISSION"}
            </span>

            <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight max-w-2xl leading-tight">
              {getLocalized(ctaSection.titleBn, ctaSection.titleEn, "Ready to Remodel Your Space?")}
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 max-w-lg leading-relaxed font-light">
              {getLocalized(ctaSection.descBn, ctaSection.descEn)}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 mt-2">
              {/* Primary Button */}
              {ctaSection.primaryBtnLink === "#estimate" ? (
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new Event("open-estimator"))}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-95"
                >
                  {getLocalized(ctaSection.primaryBtnTextBn, ctaSection.primaryBtnTextEn, "Get Free Estimate")}
                </button>
              ) : (
                <Link
                  href={ctaSection.primaryBtnLink || "#estimate"}
                  className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all shadow-lg shadow-emerald-950/40 cursor-pointer text-center"
                >
                  {getLocalized(ctaSection.primaryBtnTextBn, ctaSection.primaryBtnTextEn, "Get Free Estimate")}
                </Link>
              )}

              {/* Secondary Button */}
              <Link
                href={ctaSection.secondaryBtnLink || "/contact"}
                className="w-full sm:w-auto border border-white/20 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm px-7 py-3.5 rounded-full transition-all text-center"
              >
                {getLocalized(ctaSection.secondaryBtnTextBn, ctaSection.secondaryBtnTextEn, "Contact Us")}
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
