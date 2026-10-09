"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"residential" | "commercial" | "resort">("residential");

  const highlights = {
    residential: {
      tagBn: "আবাসিক পেন্টহাউস",
      tagEn: "Residential Penthouse",
      titleBn: "ধানমন্ডি স্কাই রিট্রিট ও রুফটপ ফরেস্ট",
      titleEn: "Dhanmondi Sky Retreat & Forest Oasis",
      locationBn: "রোড ৯/এ, ধানমন্ডি, ঢাকা",
      locationEn: "Road 9/A, Dhanmondi, Dhaka",
      areaBn: "৩,৮০০ বর্গফুট ছাদবাগান",
      areaEn: "3,800 sq.ft Rooftop",
      img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
      badgeBn: "সম্পন্ন • শতভাগ লিকপ্রুফ",
      badgeEn: "Completed • 100% Leakproof",
    },
    commercial: {
      tagBn: "বাণিজ্যিক ও করপোরেট",
      tagEn: "Institution & Workplace",
      titleBn: "গুলশান করপোরেট লিভিং বায়োস্ফিয়ার",
      titleEn: "Gulshan Corporate Living Biosphere",
      locationBn: "গুলশান এভিনিউ, ঢাকা",
      locationEn: "Gulshan Avenue, Dhaka",
      areaBn: "৪,২০০ বর্গফুট ভার্টিক্যাল ওয়াল",
      areaEn: "4,200 sq.ft Vertical Wall",
      img: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop",
      badgeBn: "বাণিজ্যিক বায়োফিলিয়া",
      badgeEn: "Commercial Biophilia",
    },
    resort: {
      tagBn: "হসপিটালিটি ও ইকো রিসোর্ট",
      tagEn: "Hospitality & Eco-Resort",
      titleBn: "শ্রীমঙ্গল হিল ভ্যালি নেচার রিট্রিট",
      titleEn: "Sreemangal Hill Valley Retreat",
      locationBn: "শ্রীমঙ্গল, সিলেট",
      locationEn: "Sreemangal, Sylhet",
      areaBn: "২.৫ একর প্রাকৃতিক ল্যান্ডস্কেপ",
      areaEn: "2.5 Acres Landscape",
      img: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop",
      badgeBn: "ইকো পার্ক মাস্টারপ্ল্যান",
      badgeEn: "Eco-Park Masterplan",
    },
  };

  const currentHighlight = highlights[activeTab];

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-between bg-[#121A14] text-white overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10">
      
      {/* Background Architectural Ambient Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-950/40 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-24 left-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10 my-auto">
        
        {/* Left Column: Typographic Architectural Manifesto */}
        <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up">
          
          {/* Pre-title Studio Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
              {t("Premier Landscape Architecture Studio • Bangladesh", "Premier Landscape Architecture Studio • Bangladesh")}
            </span>
          </div>

          {/* Typographic Statement */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white">
                {t("NURTURING", "NURTURING")}
              </span>
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-emerald-400">
                {t("NATURE,", "NATURE,")}
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
                {t("CRAFTING LIVING SPACES", "CRAFTING LIVING SPACES")}
              </span>
            </div>
            {/* Prominent Headline */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-[#E4E2D7] pt-2 tracking-normal">
              {t("Elevate Your Built Environment with Verdant Living Design", "Elevate Your Built Environment with Verdant Living Design")}
            </h1>
          </div>

          {/* Architectural Subheadline Narrative */}
          <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed max-w-2xl">
            {t(
              "আপনার স্বপ্নের সবুজায়ন, আমাদের দক্ষতায়। কংক্রিটের ছাদ, ব্যক্তিগত বাড়ি কিংবা বাণিজ্যিক ভবন — ১০০% ওয়াটারপ্রুফিং প্রযুক্তি, স্মার্ট ড্রিপ ইরিগেশন এবং বিশেষজ্ঞ ট্রি ডক্টর চিকিৎসা নিয়ে আন্তর্জাতিক মানের পরিবেশবান্ধব স্থাপত্য নকশা।",
              "Transforming concrete roofs, estates, and workspaces into lush, living ecosystems. Built with multi-layer leakproof waterproofing, automated drip irrigation, and dedicated botanical tree care."
            )}
          </p>

          {/* 5 CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                const el = document.getElementById("estimator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else window.location.href = "/design-garden";
              }}
              className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono text-xs uppercase tracking-wider font-bold rounded-full transition-all shadow-lg hover:shadow-emerald-500/25 hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
            >
              <span>🎨</span> {t("থ্রিডি গার্ডেন ডিজাইন", "3D Design Garden")}
            </button>

            <a
              href="#contact"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-full border border-white/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>🌿</span> {t("বিনামূল্যে পরামর্শ", "Free Consultation")}
            </a>

            <Link
              href="/tree-doctor?emergency=true"
              className="px-5 py-3.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-full transition-all shadow-md hover:shadow-red-600/30 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>🚨</span> {t("জরুরি ট্রি ডক্টর", "Emergency Tree Doctor")}
            </Link>

            <a
              href="tel:01883012641"
              className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-emerald-300 font-mono text-xs tracking-wider font-semibold rounded-full border border-emerald-500/30 transition-all flex items-center gap-2"
            >
              <span>📞</span> 01883012641
            </a>

            <a
              href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20would%20like%20to%20consult%20about%20my%20garden."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-mono text-xs tracking-wider font-semibold rounded-full transition-all flex items-center gap-2"
            >
              <span>💬</span> {t("হোয়াটসঅ্যাপ", "WhatsApp")}
            </a>
          </div>

        </div>

        {/* Right Column: Signature Architectural Project Showcase Card */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          
          {/* Typology Switcher Tabs */}
          <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-full mb-4 self-center sm:self-end">
            {(["residential", "commercial", "resort"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-emerald-500 text-stone-950 font-bold shadow-sm"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {tab === "residential" 
                  ? t("পেন্টহাউস", "Penthouse") 
                  : tab === "commercial" 
                  ? t("বাণিজ্যিক", "Workplace") 
                  : t("রিসোর্ট", "Resort")}
              </button>
            ))}
          </div>

          {/* Cinematic Architectural Media Frame */}
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border border-white/15 bg-stone-900 group">
            <img
              src={currentHighlight.img}
              alt={t(currentHighlight.titleBn, currentHighlight.titleEn)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20"></div>

            {/* Top Project Badge */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-emerald-300 font-semibold">
                [ {t(currentHighlight.tagBn, currentHighlight.tagEn)} ]
              </span>
              <span className="font-mono text-[10px] bg-emerald-500 text-stone-950 px-2.5 py-1 rounded-full font-bold">
                {t(currentHighlight.badgeBn, currentHighlight.badgeEn)}
              </span>
            </div>

            {/* Bottom Architectural Project Narrative Box */}
            <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 text-white space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60 font-mono">
                <span>📍 {t(currentHighlight.locationBn, currentHighlight.locationEn)}</span>
                <span>📐 {t(currentHighlight.areaBn, currentHighlight.areaEn)}</span>
              </div>
              <h3 className="font-display text-lg font-bold leading-snug text-white">
                {t(currentHighlight.titleBn, currentHighlight.titleEn)}
              </h3>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-mono tracking-wider">
                  {t("যাচাইকৃত বাস্তবায়িত প্রকল্প", "Verified Architectural Project")}
                </span>
                <Link
                  href="/projects"
                  className="font-mono text-[11px] uppercase tracking-wider text-white hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  {t("বিস্তারিত দেখুন →", "View Blueprint →")}
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Credibility Strip (Architectural Studio Metrics) */}
      <div className="max-w-7xl mx-auto w-full pt-8 mt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left relative z-10">
        <div className="space-y-0.5">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {t("৩৫০+", "350+")}
          </span>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">
            {t("বাংলাদেশে সফল প্রজেক্ট", "Gardens Built in BD")}
          </p>
          <span className="text-[11px] text-white/50 block">
            {t("আবাসিক, বাণিজ্যিক ও রিসোর্ট", "Residential, Commercial & Resorts")}
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {t("১০০%", "100%")}
          </span>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">
            {t("লিকপ্রুফ গ্যারান্টি", "Leakproof Guarantee")}
          </p>
          <span className="text-[11px] text-white/50 block">
            {t("মাল্টিলেয়ার ওয়াটারপ্রুফিং প্রযুক্তি", "Multi-layer Membrane Engineering")}
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {t("৩৫+", "35+")}
          </span>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">
            {t("বিশেষজ্ঞ কর্মীদল", "Multidisciplinary Team")}
          </p>
          <span className="text-[11px] text-white/50 block">
            {t("ল্যান্ডস্কেপ স্থপতি ও ট্রি ডক্টর", "Landscape Architects & Tree Doctors")}
          </span>
        </div>
        <div className="space-y-0.5">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {t("৯+ বছর", "9+ Yrs")}
          </span>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">
            {t("স্টুডিওর অভিজ্ঞতা", "Studio Experience")}
          </p>
          <span className="text-[11px] text-white/50 block">
            {t("ধানমন্ডি হেডকোয়ার্টার, ঢাকা", "Headquartered in Dhanmondi, Dhaka")}
          </span>
        </div>
      </div>

    </section>
  );
}
