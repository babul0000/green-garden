"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface PhilosophyPillar {
  number: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  metric: string;
  metricLabelBn: string;
  metricLabelEn: string;
  icon: string;
}

const pillars: PhilosophyPillar[] = [
  {
    number: "01",
    titleBn: "বায়োফিলিক নগর ও মাইক্রোক্লাইমেট রূপরেখা",
    titleEn: "Biophilic Urbanism & Microclimates",
    descBn: "ঢাকার তীব্র কংক্রিট তাপদাহ কমাতে আমরা সৃষ্টি করি স্তরভিত্তিক জীবন্ত সবুজ উদ্ভিদের বলয়, যা বাতাসে অক্সিজেন বৃদ্ধি করে এবং আশপাশের তাপমাত্রা ৩° থেকে ৫° সেলসিয়াস পর্যন্ত কমায়।",
    descEn: "Dhaka's concrete density creates intense urban heat islands. We counteract this by designing multi-layer plant canopies that filter dust, absorb noise, and reduce surrounding temperature by 3°C to 5°C.",
    metric: "3° - 5°C",
    metricLabelBn: "তাপমাত্রা হ্রাস ক্ষমতা",
    metricLabelEn: "Ambient Temperature Drop",
    icon: "🍃",
  },
  {
    number: "02",
    titleBn: "শতভাগ ওয়াটারপ্রুফিং ও ড্রেনেজ ইঞ্জিনিয়ারিং",
    titleEn: "100% Zero-Leak Structural Hydraulics",
    descBn: "জার্মান প্রযুক্তির ড্রেনেজ সেল, ফিল্টার ফ্যাব্রিক ও আধুনিক এলাস্টোমেরিক মেমব্রেনের মাধ্যমে ভবনের ছাদকে পানি চুইয়ে পড়া থেকে সম্পূর্ণ নিরাপদ ও দীর্ঘস্থায়ী রাখা হয়।",
    descEn: "Deploying elastomeric membranes, high-density dimple drainage cells, and lightweight non-compacting organic substrates to guarantee decades of building safety.",
    metric: "100%",
    metricLabelBn: "ওয়াটারপ্রুফিং নিশ্চয়তা",
    metricLabelEn: "Waterproofing Guarantee",
    icon: "🛡️",
  },
  {
    number: "03",
    titleBn: "বিশেষজ্ঞ ট্রি ডক্টর ও উদ্ভিদের ক্লিনিক্যাল সেবা",
    titleEn: "Tree Doctor Clinical Healthcare",
    descBn: "গাছের পাতা হলুদ হওয়া, শিকড় পচন কিংবা ছত্রাক আক্রমণ—আমাদের রেজিস্টার্ড কৃষিবিদ অন-সাইট ডায়াগনস্টিক ভিজিট করে কার্যকর প্রেসক্রিপশন ও সার্জারি প্রদান করেন।",
    descEn: "Our agronomists conduct on-site root inspection, fungal diagnosis, trunk surgery, and soil pH optimization to ensure trees flourish across changing seasons.",
    metric: "2,400+",
    metricLabelBn: "চিকিৎসাপ্রাপ্ত গাছপালা",
    metricLabelEn: "Trees Successfully Treated",
    icon: "🩺",
  },
  {
    number: "04",
    titleBn: "স্মার্ট অটোমেটেড মাইক্রো-ড্রিপ ইরিগেশন",
    titleEn: "Smart Micro-Drip Irrigation Systems",
    descBn: "স্মার্টফোন ও ওয়াইফাই নিয়ন্ত্রিত স্বয়ংক্রিয় সেচ ব্যবস্থা—যা ৭০% পানি সাশ্রয় করে প্রতিটি গাছের গোড়ায় স্বয়ংক্রিয়ভাবে প্রয়োজনমাফিক আর্দ্রতা পৌঁছে দেয়।",
    descEn: "Automated drip networks using WiFi timers, soil moisture probes, and root-zone emitters to deliver calibrated moisture, reducing water consumption by 70%.",
    metric: "70%",
    metricLabelBn: "পানি সাশ্রয় শতকরা হার",
    metricLabelEn: "Water Saved via Automation",
    icon: "💧",
  },
];

export default function ShmaPhilosophy() {
  const { language, t } = useLanguage();
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
                {t("আমাদের মূল দর্শন", "Studio Philosophy")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white">
                {t("পরিবেশবান্ধব স্থাপত্য ও স্থায়িত্বের মেলবন্ধন", "Resilience, Ecology & Architectural Precision")}
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-white/70 max-w-md leading-relaxed">
              {t(
                "এ আর গ্রিন গার্ডেন উদ্ভিদ বিজ্ঞান, জীববৈচিত্র্য এবং আধুনিক স্ট্রাকচারাল ইঞ্জিনিয়ারিংয়ের মেলবন্ধনে বিশ্বমানের ল্যান্ডস্কেপ সৃষ্টি করে।",
                "A R Green Garden blends botanical science, ecological biodiversity, and structural engineering for world-class landscapes."
              )}
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
                      {language === "bn" ? p.titleBn : p.titleEn}
                    </h4>
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
                  {t(`দর্শন ${current.number}`, `Pillar ${current.number}`)}
                </span>
                <span className="text-3xl">{current.icon}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                {language === "bn" ? current.titleBn : current.titleEn}
              </h3>
              <p className="font-sans text-sm text-white/80 leading-relaxed">
                {language === "bn" ? current.descBn : current.descEn}
              </p>
            </div>

            {/* Metric Banner & Action */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">
                  {current.metric}
                </span>
                <p className="font-mono text-xs text-white/60 uppercase tracking-wider">
                  {language === "bn" ? current.metricLabelBn : current.metricLabelEn}
                </p>
              </div>

              <div className="flex gap-2">
                <Link
                  href="/services"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-full transition-all shadow"
                >
                  {t("সেবাসমূহ দেখুন", "Explore Services")}
                </Link>
                <Link
                  href="/tree-doctor"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-full transition-all"
                >
                  {t("ট্রি ক্লিনিক", "Tree Clinic")}
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
