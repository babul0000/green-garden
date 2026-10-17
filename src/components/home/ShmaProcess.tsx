"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ProcessStep {
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  image: string;
}

const steps: ProcessStep[] = [
  {
    titleBn: "সমস্যা ও সাইট বিশ্লেষণ",
    titleEn: "Define Problem & Site Survey",
    descBn: "ক্লায়েন্টের নির্দিষ্ট চাহিদা ও সাইটের পারিপার্শ্বিক চ্যালেঞ্জ গভীরভাবে পর্যবেক্ষণ করে প্রকল্পের সর্বোচ্চ সম্ভাবনা নিশ্চিত করা।",
    descEn: "Connecting with the client to understand requirements, analyzing spatial constraints, and uncovering true ecological potential.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
  },
  {
    titleBn: "নকশা ও সৃজনশীল ধারণা",
    titleEn: "Idea & Biophilic Concept",
    descBn: "সাইট জরিপ ও গবেষণার মাধ্যমে সমাজ এবং প্রকৃতির জন্য টেকসই পরিবেশ সৃষ্টিতে আধুনিক স্থাপত্য নকশার রূপরেখা প্রণয়ন।",
    descEn: "Translating ecological research and client aspiration into cohesive biophilic master concepts and spatial zoning.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
  },
  {
    titleBn: "বৈজ্ঞানিক ডেটা ও সিমুলেশন",
    titleEn: "Data Driven & Microclimate",
    descBn: "মাইক্রোক্লাইমেট, সূর্যালোকের ব্যাপ্তি ও বৃষ্টির পানি প্রবাহের ডিজিটাল সিমুলেশন করে বৈজ্ঞানিক ভিত্তিতে পরিকল্পনা চূড়ান্তকরণ।",
    descEn: "Simulating microclimate, sunlight patterns, soil biology, and rainfall catchment for environmentally grounded decisions.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop",
  },
  {
    titleBn: "টার্ন-কি বাস্তবায়ন ও যত্ন",
    titleEn: "Prototyping & Execution",
    descBn: "থ্রিডি মডেল, পরীক্ষামূলক উদ্ভিদ নির্বাচন এবং শতভাগ ওয়াটারপ্রুফ মেমব্রেনসহ দক্ষ প্রকৌশলীদের দিয়ে সাইটে নিখুঁত বাস্তবায়ন।",
    descEn: "Transforming concepts into living landscapes through physical trials, waterproof layers, and turnkey engineering oversight.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800&auto=format&fit=crop",
  },
];

interface ProcessConfig {
  titleEn?: string;
  titleBn?: string;
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
  const { language, t } = useLanguage();

  const activeSteps = processConfig?.steps && processConfig.steps.length > 0
    ? processConfig.steps.map((s, idx) => ({
        titleBn: s.titleBn || steps[idx % steps.length]?.titleBn || "",
        titleEn: s.titleEn || steps[idx % steps.length]?.titleEn || "",
        descBn: s.descBn || steps[idx % steps.length]?.descBn || "",
        descEn: s.descEn || steps[idx % steps.length]?.descEn || "",
        image: s.image || steps[idx % steps.length]?.image || "",
      }))
    : steps;

  return (
    <section id="process" className="py-20 px-6 sm:px-10 max-w-[1380px] mx-auto text-[#323232] bg-white">
      
      {/* Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              {t("আমাদের কার্যপ্রণালী", "Our Methodology")}
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            {t("ডিজাইন ও বাস্তবায়ন পর্যায়", "Design & Delivery Stages")}
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* Main Process Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="font-display font-light text-2xl sm:text-3xl text-[#3d2e17] leading-tight">
            {language === "bn" ? (
              processConfig?.titleBn || (
                <>
                  টেকসই ও আধুনিক সমাধানের
                  <span className="block text-[#5a9dff] mt-1">সুপরিকল্পিত যাত্রা</span>
                </>
              )
            ) : (
              processConfig?.titleEn || (
                <>
                  A Thoughtful Journey to
                  <span className="block text-[#5a9dff] mt-1">Transformative Solutions</span>
                </>
              )
            )}
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#75787b] font-light leading-relaxed pt-2">
            {t(
              "প্রাথমিক ভাবনা থেকে চূড়ান্ত বাস্তবায়ন পর্যন্ত প্রতিটি ধাপে আন্তর্জাতিক গুণগত মান, জীববৈচিত্র্য ও ওয়াটারপ্রুফিং সুরক্ষা নিশ্চিতকরণ।",
              "Ensuring highest architectural standards, native plant health, and waterproofing resilience across every phase."
            )}
          </p>
        </div>

        {/* Right Columns: Steps Grid */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {activeSteps.map((step, idx) => (
            <div key={idx} className="space-y-3 group">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={step.image}
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

    </section>
  );
}
