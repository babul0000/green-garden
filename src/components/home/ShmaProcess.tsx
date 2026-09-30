"use client";

import React from "react";

interface ProcessStep {
  title: string;
  bnTitle: string;
  desc: string;
  bnDesc: string;
  image: string;
}

const steps: ProcessStep[] = [
  {
    title: "Define the Problem",
    bnTitle: "সমস্যা ও চাহিদা নির্ণয়",
    desc: "Connecting with the client to get to the bottom of the brief—digging to the root of the problem and setting sights on true architectural potential.",
    bnDesc: "ক্লায়েন্টের নির্দিষ্ট চাহিদা ও সাইটের পারিপার্শ্বিক চ্যালেঞ্জ গভীরভাবে পর্যবেক্ষণ করে প্রকল্পের সর্বোচ্চ সম্ভাবনা নিশ্চিত করা।",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_0246-800x600.jpg",
  },
  {
    title: "Idea Creation",
    bnTitle: "নকশা ও সৃজনশীল ধারণা",
    desc: "Going beyond the brief and asking critical questions to seek greater environmental impact through research and site surveys.",
    bnDesc: "সাইট জরিপ ও গবেষণার মাধ্যমে সমাজ এবং প্রকৃতির জন্য টেকসই পরিবেশ সৃষ্টিতে আধুনিক স্থাপত্য নকশার রূপরেখা প্রণয়ন।",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_1020-800x600.jpg",
  },
  {
    title: "Data Driven",
    bnTitle: "বৈজ্ঞানিক তথ্য ও সিমুলেশন",
    desc: "Simulating microclimate, sunlight exposure, soil microbiology, and rainfall catchment to make scientifically grounded interventions.",
    bnDesc: "মাইক্রোক্লাইমেট, সূর্যালোকের ব্যাপ্তি ও বৃষ্টির পানি প্রবাহের ডিজিটাল সিমুলেশন করে বৈজ্ঞানিক ভিত্তিতে পরিকল্পনা চূড়ান্তকরণ।",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/1-11-800x534.jpg",
  },
  {
    title: "Co-Creation",
    bnTitle: "যৌথ সমন্বয় ও কর্মশালা",
    desc: "Engaging clients, arborists, local communities, and multidisciplinary consultants in collaborative dialogue.",
    bnDesc: "ক্লায়েন্ট, অভিজ্ঞ ল্যান্ডস্কেপ আর্কিটেক্ট ও বৃক্ষ বিশেষজ্ঞদের সমন্বিত মতবিনিময়ের মাধ্যমে কার্যকরী নকশার উন্মোচন।",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/S__10559556-800x600.jpg",
  },
  {
    title: "Prototyping",
    bnTitle: "মডেলিং ও চূড়ান্ত বাস্তবায়ন",
    desc: "Transforming concepts into reality through physical models, 1:1 material mockups, biological plant trials, and precision turn-key execution.",
    bnDesc: "থ্রিডি মডেল, পরীক্ষামূলক উদ্ভিদ নির্বাচন এবং শতভাগ ওয়াটারপ্রুফ মেমব্রেনসহ দক্ষ প্রকৌশলীদের দিয়ে সাইটে নিখুঁত বাস্তবায়ন।",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_9771-800x600.jpg",
  },
];

export default function ShmaProcess() {
  return (
    <section id="process" className="py-20 px-6 sm:px-10 max-w-[1380px] mx-auto text-[#323232] bg-white">
      
      {/* Exact Shma Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              Process
            </h2>
            <span className="font-sans text-sm sm:text-base text-[#75787b] font-normal">
              • স্থাপত্য কর্মপদ্ধতি ও বাস্তবায়নের ধাপসমূহ
            </span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            Design Methodology
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* Main Process Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Shma Exact Typography with Bengali Subtitle */}
        <div className="lg:col-span-3 space-y-3">
          <h3 className="font-display font-light text-3xl sm:text-4xl text-[#3d2e17] leading-tight">
            A Thoughtful
            <span className="block">Journey to</span>
            <span className="block text-[#5a9dff] mt-1">Transformative Solutions</span>
          </h3>
          <p className="font-sans text-xs sm:text-sm text-[#75787b] font-light leading-relaxed pt-2">
            একটি সুপরিকল্পিত স্থাপত্যযাত্রা থেকে স্থায়ী ও পরিবেশবান্ধব সমাধান—প্রাথমিক ভাবনা থেকে চূড়ান্ত বাস্তবায়ন পর্যন্ত প্রতিটি ধাপে আন্তর্জাতিক গুণগত মান নিশ্চিতকরণ।
          </p>
        </div>

        {/* Right Columns: Process Steps Grid */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.slice(0, 4).map((step, idx) => (
            <div key={idx} className="space-y-3 group">
              <div className="aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      idx === 0
                        ? "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop"
                        : idx === 1
                        ? "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop"
                        : idx === 2
                        ? "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"
                        : "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop";
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-1">
                  <h4 className="font-display font-light text-lg text-[#3d2e17]">
                    {step.title}
                  </h4>
                  <span className="font-sans text-xs text-[#5a9dff] font-normal">
                    {step.bnTitle}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#54595f] font-light leading-relaxed">
                  {step.desc}
                </p>
                <p className="font-sans text-[11px] text-[#75787b] font-light leading-snug">
                  {step.bnDesc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
