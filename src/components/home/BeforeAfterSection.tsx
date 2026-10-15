"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function BeforeAfterSection() {
  const { language, t } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeItem, setActiveItem] = useState(0);

  const transformations = [
    {
      titleBn: "ধানমন্ডি স্কাই ফরেস্ট পেন্টহাউস",
      titleEn: "Dhanmondi Sky Forest Penthouse",
      locationBn: "রোড ৯/এ, ধানমন্ডি, ঢাকা",
      locationEn: "Road 9/A, Dhanmondi, Dhaka",
      beforeImg: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80",
      descBn: "কংক্রিটের শুষ্ক খালি ছাদকে বদলে দিয়ে মাল্টি-লেয়ার ওয়াটারপ্রুফ ড্রেনেজ, জাপানিজ কার্পেট ঘাস ও আধুনিক মেহগনি পারগোলা সমৃদ্ধ লাক্সারি বায়োফিলিক স্বর্গে রূপান্তর।",
      descEn: "Transforming a barren concrete roof into a luxury biophilic retreat with multi-layer waterproof drainage, Japanese carpet sod, and handcrafted pergola.",
      tagsBn: ["ছাদবাগান", "১০০% ওয়াটারপ্রুফিং", "স্মার্ট ড্রিপ সেচ"],
      tagsEn: ["Rooftop Garden", "100% Waterproofing", "Smart Drip Irrigation"],
      area: "3,800 sq.ft",
    },
    {
      titleBn: "গুলশান করপোরেট লিভিং গ্রিন ওয়াল",
      titleEn: "Gulshan Corporate Living Vertical Wall",
      locationBn: "গুলশান এভিনিউ, ঢাকা",
      locationEn: "Gulshan Avenue, Dhaka",
      beforeImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=1200&q=80",
      descBn: "নির্জীব কংক্রিট দেয়ালকে ৪,২০০+ জীবিত এয়ার-পিউরিফাইং গাছ ও স্বয়ংক্রিয় হাইড্রোপনিক ফার্টিগেশন পদ্ধতিতে সতেজ গ্রিন ওয়ালে রূপান্তর।",
      descEn: "Revitalizing a lifeless exterior wall with 4,200+ living air-purifying plants powered by automated hydroponic fertigation.",
      tagsBn: ["ভার্টিক্যাল গার্ডেন", "বায়ু বিশুদ্ধকরণ", "স্মার্ট ফার্টিগেশন"],
      tagsEn: ["Vertical Garden", "Air Purifying", "Automated Fertigation"],
      area: "4,200 sq.ft",
    },
    {
      titleBn: "বনানী রয়েল এস্টেট বাগান ও ফোয়ারা",
      titleEn: "Banani Royal Estate Courtyard & Fountain",
      locationBn: "রোড ১১, বনানী, ঢাকা",
      locationEn: "Road 11, Banani, Dhaka",
      beforeImg: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?w=1200&q=80",
      descBn: "অনাবাদি ফাঁকা উঠানকে সাজিয়ে তোলা হয়েছে মার্বেল পাথরের জলপ্রপাত, উষ্ণ ল্যান্ডস্কেপ লাইটিং এবং দুর্লভ বাগান উদ্ভিদের সমাহারে।",
      descEn: "Unused courtyard reimagined with marble water cascades, warm architectural lighting, and curated exotic perennial landscaping.",
      tagsBn: ["মার্বেল ফোয়ারা", "ল্যান্ডস্কেপ লাইটিং", "প্রাকৃতিক ঘাসের লন"],
      tagsEn: ["Water Feature", "Landscape Lighting", "Bespoke Sodding"],
      area: "5,500 sq.ft",
    },
  ];

  const current = transformations[activeItem];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#121813] border-b border-stone-300 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                {t("Transformation Case Studies", "Transformation Case Studies")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                {t("Before & After Evolution", "Before & After Evolution")}
              </h2>
            </div>
            
            {/* Project Switcher Buttons */}
            <div className="flex flex-wrap gap-2">
              {transformations.map((tItem, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveItem(idx);
                    setSliderPosition(50);
                  }}
                  className={`px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    activeItem === idx
                      ? "bg-[#18221A] text-white shadow font-bold"
                      : "bg-white text-[#75787B] hover:text-[#121813] border border-stone-300"
                  }`}
                >
                  {language === "bn" ? tItem.titleBn.split(" ")[0] : tItem.titleEn.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center bg-white p-4 sm:p-10 rounded-2xl sm:rounded-[32px] border border-stone-300 shadow-sm">
          
          {/* Comparison Slider Frame (Left) */}
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden select-none shadow-xl border border-stone-200">
              
              {/* After Image (Background) */}
              <img
                src={current.afterImg}
                alt="After Transformation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#2B4D33] text-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-mono text-[9px] sm:text-[10px] uppercase tracking-widest font-bold shadow-md z-10">
                {t("রূপান্তরের পরে", "AFTER")}
              </div>

              {/* Before Image (Clipped Foreground with clipPath - never distorts) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
              >
                <img
                  src={current.beforeImg}
                  alt="Before Transformation"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-black/80 text-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-mono text-[9px] sm:text-[10px] uppercase tracking-widest font-bold shadow-md z-10">
                  {t("পূর্ববর্তী অবস্থা", "BEFORE")}
                </div>
              </div>

              {/* Slider Divider Bar */}
              <div
                className="absolute top-0 bottom-0 w-0.5 sm:w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-ew-resize flex items-center justify-center pointer-events-none z-10"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#18221A] text-white border-2 border-white flex items-center justify-center shadow-xl text-xs font-mono font-bold">
                  ↔
                </div>
              </div>

              {/* Range Input Overlay for Dragging */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20 touch-none"
                aria-label="Before and after transformation slider"
              />
            </div>
            
            <p className="text-center font-mono text-[11px] sm:text-xs text-[#75787B] mt-2.5">
              {t("← স্লাইডারটি টেনে রূপান্তর তুলনা করুন →", "← Drag slider horizontally to compare →")}
            </p>
          </div>

          {/* Project Narrative Specifications (Right) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#2B4D33] font-bold">
                📍 {language === "bn" ? current.locationBn : current.locationEn}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#121813] leading-tight">
                {current.titleEn}
              </h3>
              <p className="font-sans text-xs font-bold text-[#2B4D33]">
                {current.area}
              </p>
              <p className="font-sans text-xs sm:text-sm text-[#75787B] leading-relaxed pt-1">
                {language === "bn" ? current.descBn : current.descEn}
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#75787B] font-semibold block">
                {t("প্রকল্পের বিশেষ বৈশিষ্ট্য", "Engineering Specifications")}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(language === "bn" ? current.tagsBn : current.tagsEn).map((tag, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] bg-[#E4E2D7] text-[#121813] px-3 py-1 rounded-full border border-stone-300"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-stone-200 flex flex-col gap-2">
              <Link
                href="/design-garden"
                className="w-full py-3 bg-[#18221A] hover:bg-[#2B4D33] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-full transition-all text-center cursor-pointer shadow"
              >
                {t("এমন বাগানের বাজেট হিসাব করুন", "Estimate Similar Project")}
              </Link>
              <Link
                href="/projects"
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#121813] font-mono text-xs uppercase tracking-wider font-semibold rounded-full transition-all text-center"
              >
                {t("সকল প্রকল্প দেখুন", "View All Projects")}
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
