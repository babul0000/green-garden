"use client";

import React, { useState } from "react";
import Link from "next/link";

interface PhilosophyPillar {
  number: string;
  title: string;
  bengaliTitle: string;
  tagline: string;
  description: string;
  bengaliDescription: string;
  metric: string;
  metricLabel: string;
  icon: string;
}

const pillars: PhilosophyPillar[] = [
  {
    number: "01",
    title: "Biophilic Urbanism & Microclimates",
    bengaliTitle: "বায়োফিলিক আরবান রূপরেখা",
    tagline: "Reconnecting human well-being with living nature",
    description: "Dhaka's concrete density produces intense urban heat islands. We counteract this by designing multi-strata plant canopies that filter PM2.5 particulates, absorb acoustic noise, and reduce surrounding ambient temperatures by 3°C to 5°C.",
    bengaliDescription: "ঢাকার তীব্র কংক্রিট তাপদাহ কমাতে আমরা সৃষ্টি করি স্তরভিত্তিক উদ্ভিদ স্তর, যা বাতাসে অক্সিজেন বৃদ্ধি করে এবং আশপাশের তাপমাত্রা ৩° থেকে ৫° সেলসিয়াস পর্যন্ত কমায়।",
    metric: "3° - 5°C",
    metricLabel: "Ambient Temperature Drop",
    icon: "🍃",
  },
  {
    number: "02",
    title: "100% Zero-Leak Structural Hydraulics",
    bengaliTitle: "শতভাগ ওয়াটারপ্রুফিং ও ড্রেনেজ ইঞ্জিনিয়ারিং",
    tagline: "Structural protection with multi-tier membrane integrity",
    description: "Rooftop landscaping requires rigorous civil and hydraulic engineering. We deploy elastomeric waterproofing membranes, high-density dimple drainage cells, and lightweight non-compacting organic substrate mixes to guarantee decades of building safety.",
    bengaliDescription: "জার্মান প্রযুক্তির ড্রেনেজ সেল, ফিল্টার ফ্যাব্রিক ও এলাস্টোমেরিক মেমব্রেনের মাধ্যমে ভবনের ছাদকে পানি চুইয়ে পড়া থেকে সম্পূর্ণ নিরাপদ রাখা হয়।",
    metric: "100%",
    metricLabel: "Waterproofing Guarantee",
    icon: "🛡️",
  },
  {
    number: "03",
    title: "Tree Doctor Clinical Healthcare",
    bengaliTitle: "বিশেষজ্ঞ ট্রি ডক্টর ও উদ্ভিদের রোগতত্ত্ব",
    tagline: "Scientific botany, disease surgery & nutrient revival",
    description: "Every tree is a living companion. Our agronomists and plant doctors conduct on-site root inspection, fungal diagnosis, trunk surgery, and soil pH optimization, ensuring plants thrive throughout changing seasons.",
    bengaliDescription: "গাছের পাতা হলুদ হওয়া, শিকড় পচা কিংবা ছত্রাক আক্রমণ—আমাদের রেজিস্টার্ড কৃষিবিদ অন-সাইট ডায়াগনস্টিক ভিজিট করে প্রেসক্রিপশন ও চিকিৎসা প্রদান করেন।",
    metric: "2,400+",
    metricLabel: "Trees Successfully Treated",
    icon: "🩺",
  },
  {
    number: "04",
    title: "Smart Micro-Drip Irrigation Systems",
    bengaliTitle: "স্মার্ট অটোমেটেড মাইক্রো-ড্রিপ ইরিগেশন",
    tagline: "Precision hydraulics delivering drops where needed",
    description: "Water scarcity demands intelligence. Our automated drip networks use WiFi timers, soil moisture probes, and root-zone emitters to deliver calibrated moisture, reducing water consumption by 70% while eliminating manual labor.",
    bengaliDescription: "স্মার্টফোন নিয়ন্ত্রিত স্বয়ংক্রিয় সেচ ব্যবস্থা—যা ৭০% পানি সাশ্রয় করে প্রতিটি গাছের গোড়ায় প্রয়োজনমাফিক আর্দ্রতা পৌঁছে দেয়।",
    metric: "70%",
    metricLabel: "Water Consumption Saved",
    icon: "💧",
  },
];

export default function ShmaPhilosophy() {
  const [activePillar, setActivePillar] = useState<number>(0);

  const current = pillars[activePillar];

  return (
    <section id="philosophy" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#18221A] text-white border-b border-white/10 relative overflow-hidden">
      
      {/* Background Subtle Architectural Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#2F4533_1px,transparent_1px)] [background-size:40px_40px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-emerald-400 font-bold block mb-2">
                Studio Philosophy • আমাদের মূল দর্শন
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white">
                Resilience, Ecology & <br />
                <span className="font-extrabold text-[#E4E2D7]">Architectural Precision</span>
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-white/70 max-w-md leading-relaxed">
              Inspired by global landscape architecture studios like Shma, AR Green Garden combines botanical science, ecological biodiversity, and structural engineering.
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-white/10"></div>
        </div>

        {/* Interactive 4 Pillars Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Pillar Selector Tabs (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {pillars.map((p, idx) => (
              <div
                key={p.number}
                onClick={() => setActivePillar(idx)}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between ${
                  activePillar === idx
                    ? "bg-[#243527] border-emerald-500/60 shadow-lg text-white"
                    : "bg-white/5 border-white/10 hover:border-white/20 text-white/70 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold text-emerald-400">
                    {p.number}
                  </span>
                  <div>
                    <h4 className="font-display text-base font-bold text-white">
                      {p.title.split("&")[0]}
                    </h4>
                    <span className="text-xs text-white/50 block font-sans">
                      {p.bengaliTitle}
                    </span>
                  </div>
                </div>
                <span className="text-xl">{p.icon}</span>
              </div>
            ))}
          </div>

          {/* Active Pillar Deep-Dive Display (Right) */}
          <div className="lg:col-span-7 bg-[#121A14] p-8 sm:p-10 rounded-3xl border border-white/15 flex flex-col justify-between space-y-6 shadow-2xl">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400 font-bold px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-500/30">
                  Pillar {current.number} • Architectural Standard
                </span>
                <span className="text-3xl">{current.icon}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {current.title}
              </h3>
              <p className="font-sans text-sm font-semibold text-emerald-300">
                {current.bengaliTitle}
              </p>
              <p className="font-sans text-sm text-white/80 leading-relaxed">
                {current.description}
              </p>
              <p className="font-sans text-xs sm:text-sm text-white/60 bg-white/5 p-4 rounded-xl border border-white/10 leading-relaxed">
                {current.bengaliDescription}
              </p>
            </div>

            {/* Metric Banner & Action */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">
                  {current.metric}
                </span>
                <p className="font-mono text-xs text-white/60 uppercase tracking-wider">
                  {current.metricLabel}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/services"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-full transition-all shadow"
                >
                  Explore Services
                </Link>
                <Link
                  href="/tree-doctor"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-full transition-all"
                >
                  Tree Clinic
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
