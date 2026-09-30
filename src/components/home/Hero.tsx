"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"residential" | "commercial" | "resort">("residential");

  const highlights = {
    residential: {
      tag: "Residential Penthouse",
      title: "Dhanmondi Sky Retreat & Forest Oasis",
      location: "Road 9/A, Dhanmondi, Dhaka",
      area: "3,800 sq.ft Rooftop",
      img: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
      badge: "Completed • 100% Leakproof",
    },
    commercial: {
      tag: "Institution & Workplace",
      title: "Gulshan Corporate Living Biosphere",
      location: "Gulshan Avenue, Dhaka",
      area: "4,200 sq.ft Vertical Wall",
      img: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200&auto=format&fit=crop",
      badge: "Commercial Biophilia",
    },
    resort: {
      tag: "Hospitality & Eco-Resort",
      title: "Sreemangal Hill Valley Retreat",
      location: "Sreemangal, Sylhet",
      area: "2.5 Acres Landscape",
      img: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200&auto=format&fit=crop",
      badge: "Eco-Park Masterplan",
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
        
        {/* Left Column: Typographic Architectural Manifesto (Inspired by Shma Designs) */}
        <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in-up">
          
          {/* Pre-title Studio Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md self-start">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
              Shma-Inspired Landscape Architecture Studio
            </span>
          </div>

          {/* Shma Signature Typographic Statement */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white">
                NURTURING
              </span>
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-emerald-400">
                NATURE,
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white">
                CRAFTING
              </span>
              <span className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
                LIVING SPACES
              </span>
            </div>
            {/* Bengali Prominent Headline */}
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-[#E4E2D7] pt-2 tracking-normal">
              প্রকৃতির ছোঁয়ায় বদলে দিন আপনার চারপাশ
            </h1>
          </div>

          {/* Architectural Subheadline Narrative */}
          <p className="text-sm sm:text-base text-white/70 font-sans leading-relaxed max-w-2xl">
            আপনার স্বপ্নের সবুজায়ন, আমাদের দক্ষতায়। কংক্রিটের ছাদ, ব্যক্তিগত বাড়ি কিংবা বাণিজ্যিক ভবন — 
            ১০০% ওয়াটারপ্রুফিং প্রযুক্তি, স্মার্ট ড্রিপ ইরিগেশন এবং বিশেষজ্ঞ ট্রি ডক্টর চিকিৎসা নিয়ে 
            আন্তর্জাতিক মানের পরিবেশবান্ধব স্থাপত্য নকশা।
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
              <span>🎨</span> 3D Design Garden
            </button>

            <a
              href="#contact"
              className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-full border border-white/20 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>🌿</span> Free Consultation
            </a>

            <Link
              href="/tree-doctor?emergency=true"
              className="px-5 py-3.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs uppercase tracking-wider font-bold rounded-full transition-all shadow-md hover:shadow-red-600/30 hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>🚨</span> Emergency Tree Doctor
            </Link>

            <a
              href="tel:01620692449"
              className="px-4 py-3.5 bg-white/5 hover:bg-white/10 text-emerald-300 font-mono text-xs tracking-wider font-semibold rounded-full border border-emerald-500/30 transition-all flex items-center gap-2"
            >
              <span>📞</span> 01620692449
            </a>

            <a
              href="https://wa.me/8801620692449?text=Hello%20AR%20Green%20Garden,%20I%20am%20interested%20in%20a%20landscape%20design%20consultation."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3.5 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-mono text-xs tracking-wider font-semibold rounded-full transition-all flex items-center gap-2"
            >
              <span>💬</span> WhatsApp
            </a>
          </div>

        </div>

        {/* Right Column: Signature Architectural Project Showcase Card */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          
          {/* Typology Switcher Tabs (Inspired by Shma's Highlight Project category pills) */}
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
                {tab === "residential" ? "Penthouse" : tab === "commercial" ? "Workplace" : "Resort"}
              </button>
            ))}
          </div>

          {/* Cinematic Architectural Media Frame */}
          <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border border-white/15 bg-stone-900 group">
            <img
              src={currentHighlight.img}
              alt={currentHighlight.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20"></div>

            {/* Top Project Badge */}
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-emerald-300 font-semibold">
                [ {currentHighlight.tag} ]
              </span>
              <span className="font-mono text-[10px] bg-emerald-500 text-stone-950 px-2.5 py-1 rounded-full font-bold">
                {currentHighlight.badge}
              </span>
            </div>

            {/* Bottom Architectural Project Narrative Box */}
            <div className="absolute bottom-5 left-5 right-5 p-5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 text-white space-y-2">
              <div className="flex items-center justify-between text-xs text-white/60 font-mono">
                <span>📍 {currentHighlight.location}</span>
                <span>📐 {currentHighlight.area}</span>
              </div>
              <h3 className="font-display text-lg font-bold leading-snug text-white">
                {currentHighlight.title}
              </h3>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-mono tracking-wider">
                  PostgreSQL Verified Project
                </span>
                <Link
                  href="/projects"
                  className="font-mono text-[11px] uppercase tracking-wider text-white hover:text-emerald-300 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  View Blueprint →
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Bottom Credibility Strip (Architectural Studio Metrics) */}
      <div className="max-w-7xl mx-auto w-full pt-8 mt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-left relative z-10">
        <div className="space-y-0.5">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">350+</span>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">Gardens Built in BD</p>
          <span className="text-[11px] text-white/50 block">Residential, Commercial & Resorts</span>
        </div>
        <div className="space-y-0.5">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">100%</span>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">Leakproof Guarantee</p>
          <span className="text-[11px] text-white/50 block">Multi-layer Membrane Engineering</span>
        </div>
        <div className="space-y-0.5">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">35+</span>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">Multidisciplinary Team</p>
          <span className="text-[11px] text-white/50 block">Landscape Architects & Tree Doctors</span>
        </div>
        <div className="space-y-0.5">
          <span className="font-display text-2xl sm:text-3xl font-extrabold text-white">9+ Yrs</span>
          <p className="font-mono text-xs uppercase tracking-wider text-emerald-400">Studio Experience</p>
          <span className="text-[11px] text-white/50 block">Headquartered in Dhanmondi, Dhaka</span>
        </div>
      </div>

    </section>
  );
}
