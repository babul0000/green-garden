"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { optimizeImageUrl } from "@/lib/utils";

interface ProcessStep {
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  image: string;
}

// Rich hardcoded defaults — used when admin hasn't saved custom steps
const DEFAULT_STEPS: ProcessStep[] = [
  {
    titleBn: "সমস্যা ও সাইট বিশ্লেষণ",
    titleEn: "Define Problem & Site Survey",
    descBn: "ক্লায়েন্টের নির্দিষ্ট চাহিদা ও সাইটের পারিপার্স্বিক চ্যালেঞ্জ গভীরভাবে পর্যবেক্ষণ করে প্রকল্পের সর্বোচ্চ সম্ভাবনা নিশ্চিত করা।",
    descEn: "Connecting with the client to understand requirements, analyzing spatial constraints, and uncovering true ecological potential.",
    image: "/hero_plants.png",
  },
  {
    titleBn: "নকশা ও সৃজনশীল ধারণা",
    titleEn: "Idea & Biophilic Concept",
    descBn: "সাইট জরিপ ও গবেষণার মাধ্যমে সমাজ এবং প্রকৃতির জন্য টেকসই পরিবেশ সৃষ্টিতে আধুনিক স্থাপত্য নকশার রূপরেখা প্রণয়ন।",
    descEn: "Translating ecological research and client aspiration into cohesive biophilic master concepts and spatial zoning.",
    image: "/featured_plant.png",
  },
  {
    titleBn: "বৈজ্ঞানিক ডেটা ও সিমুলেশন",
    titleEn: "Data Driven & Microclimate",
    descBn: "মাইক্রোক্লাইমেট, সূর্যালোকের ব্যাপ্তি ও বৃষ্টির পানি প্রবাহের ডিজিটাল সিমুলেশন করে বৈজ্ঞানিক ভিত্তিতে পরিকল্পনা চূড়ান্তকরণ।",
    descEn: "Simulating microclimate, sunlight patterns, soil biology, and rainfall catchment for environmentally grounded decisions.",
    image: "/hero_plants.png",
  },
  {
    titleBn: "টার্ন-কি বাস্তবায়ন ও যত্ন",
    titleEn: "Prototyping & Execution",
    descBn: "থ্রিডি মডেল, পরীক্ষামূলক উদ্ভিদ নির্বাচন এবং শতভাগ ওয়াটারপ্রুফ মেমব্রেনসহ দক্ষ প্রকৌশলীদের দিয়ে সাইটে নিখুঁত বাস্তবায়ন।",
    descEn: "Transforming concepts into living landscapes through physical trials, waterproof layers, and turnkey engineering oversight.",
    image: "/featured_plant.png",
  },
];

// Cycling images for steps that have no image set by admin
const STEP_IMAGES = ["/hero_plants.png", "/featured_plant.png", "/hero_plants.png", "/featured_plant.png"];

export interface ProcessConfig {
  titleEn?: string;
  titleBn?: string;
  categoryEn?: string;
  categoryBn?: string;
  headlineEn?: string;
  headlineBn?: string;
  descEn?: string;
  descBn?: string;
  steps?: Array<{
    iconEn?: string;
    titleEn?: string;
    titleBn?: string;
    descEn?: string;
    descBn?: string;
    image?: string;
  }>;
}

export default function ShmaProcess({ processConfig }: { processConfig?: ProcessConfig }) {
  const { language } = useLanguage();
  const [liveConfig, setLiveConfig] = useState<ProcessConfig | undefined>(processConfig);

  useEffect(() => {
    if (processConfig) {
      setLiveConfig(processConfig);
    }
  }, [processConfig]);

  useEffect(() => {
    // 1. Fetch latest live from /api/settings directly
    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/settings?key=homepage_sections&_t=${Date.now()}`, {
          cache: "no-store",
          headers: { Pragma: "no-cache", "Cache-Control": "no-cache" },
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.value?.process) {
            setLiveConfig(data.value.process);
          }
        }
      } catch {
        // Fallback silently
      }
    };
    fetchLatest();

    // 2. Listen to custom event when admin updates in real-time
    const handleUpdate = (e: any) => {
      if (e?.detail?.process) {
        setLiveConfig(e.detail.process);
      }
    };
    window.addEventListener("homepage-config-updated", handleUpdate);
    return () => window.removeEventListener("homepage-config-updated", handleUpdate);
  }, []);

  const currentConfig = liveConfig || processConfig;

  const activeSteps: ProcessStep[] =
    currentConfig?.steps && currentConfig.steps.length > 0
      ? currentConfig.steps.map((s, idx) => ({
          titleBn: s.titleBn || s.titleEn || DEFAULT_STEPS[idx % DEFAULT_STEPS.length].titleBn,
          titleEn: s.titleEn || s.titleBn || DEFAULT_STEPS[idx % DEFAULT_STEPS.length].titleEn,
          descBn: s.descBn || s.descEn || DEFAULT_STEPS[idx % DEFAULT_STEPS.length].descBn,
          descEn: s.descEn || s.descBn || DEFAULT_STEPS[idx % DEFAULT_STEPS.length].descEn,
          // Use admin-set image if available, else cycle through defaults
          image: s.image && s.image.trim().length > 3
            ? s.image
            : DEFAULT_STEPS[idx % DEFAULT_STEPS.length].image || STEP_IMAGES[idx % STEP_IMAGES.length],
        }))
      : DEFAULT_STEPS;

  const sectionTitleEn = currentConfig?.titleEn || "A Thoughtful Journey";
  const sectionTitleBn = currentConfig?.titleBn || "আমাদের কার্যপদ্ধতি";

  const categoryEn = currentConfig?.categoryEn || "DESIGN & DELIVERY STAGES";
  const categoryBn = currentConfig?.categoryBn || "ডিজাইন ও বাস্তবায়ন পর্যায়";

  const headlineEn = currentConfig?.headlineEn || "A Thoughtful Journey to Transformative Solutions";
  const headlineBn = currentConfig?.headlineBn || "টেকসই ও আধুনিক সমাধানের সুপরিকল্পিত যাত্রা";

  const descEn = currentConfig?.descEn || "Ensuring highest architectural standards, native plant health, and waterproofing resilience across every phase.";
  const descBn = currentConfig?.descBn || "প্রাথমিক ভাবনা থেকে চূড়ান্ত বাস্তবায়ন পর্যন্ত প্রতিটি ধাপে আন্তর্জাতিক গুণগত মান, জীববৈচিত্র্য ও ওয়াটারপ্রুফিং সুরক্ষা নিশ্চিতকরণ।";

  // Grid columns class based on number of steps
  const gridColClass =
    activeSteps.length === 1
      ? "grid-cols-1 max-w-sm"
      : activeSteps.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl"
      : activeSteps.length === 3
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="process" className="py-20 text-[#323232] bg-white">
      <div className="px-6 sm:px-10">
      
      {/* Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              {language === "bn" ? sectionTitleBn : sectionTitleEn}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            {language === "bn" ? categoryBn : categoryEn}
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* Main Process Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Headline and Description */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="font-display font-light text-2xl sm:text-3xl text-[#3d2e17] leading-tight">
            {language === "bn" ? headlineBn : headlineEn}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#75787b] font-light leading-relaxed pt-2">
            {language === "bn" ? descBn : descEn}
          </p>
        </div>

        {/* Right Columns: Dynamic Steps Grid */}
        <div className={`lg:col-span-9 grid ${gridColClass} gap-6 sm:gap-8`}>
          {activeSteps.map((step, idx) => (
            <div key={idx} className="space-y-3 group">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100 rounded-xl">
                <img
                  src={optimizeImageUrl(step.image, 600)}
                  alt={step.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/hero_plants.png";
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display font-light text-lg text-[#3d2e17]">
                  {language === "bn" ? step.titleBn : step.titleEn}
                </h4>
                <p className="font-sans text-xs text-[#54595f] font-light leading-relaxed">
                  {language === "bn" ? step.descBn : step.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
      </div>

    </section>
  );
}
