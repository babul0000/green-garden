"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function BeforeAfterSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeItem, setActiveItem] = useState(0);

  const transformations = [
    {
      title: "Dhanmondi Sky Forest Penthouse",
      bengaliTitle: "ধানমন্ডি পেন্টহাউস রূপান্তর",
      location: "Road 9/A, Dhanmondi, Dhaka",
      beforeImg: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1200&q=80",
      desc: "কংক্রিটের শুষ্ক খালি ছাদকে বদলে দিয়ে মাল্টি-লেয়ার ওয়াটারপ্রুফ ড্রেনেজ, জাপানিজ কার্পেট ঘাস ও আধুনিক মেহগনি পারগোলা সমৃদ্ধ লাক্সারি বায়োফিলিক স্বর্গে রূপান্তর।",
      tags: ["Rooftop Garden", "100% Waterproofing", "Smart Drip Irrigation"],
      area: "3,800 sq.ft",
    },
    {
      title: "Gulshan Corporate Living Vertical Wall",
      bengaliTitle: "গুলশান করপোরেট গ্রিন ওয়াল",
      location: "Gulshan Avenue, Dhaka",
      beforeImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=1200&q=80",
      desc: "নির্জীব কংক্রিট দেয়ালকে ৪,২০০+ জীবিত এয়ার-পিউরিফাইং গাছ ও স্বয়ংক্রিয় হাইড্রোপনিক ফার্টিগেশন পদ্ধতিতে সতেজ গ্রিন ওয়ালে রূপান্তর।",
      tags: ["Vertical Garden", "Air Purifying", "Automated Fertigation"],
      area: "4,200 sq.ft",
    },
    {
      title: "Banani Royal Estate Courtyard & Fountain",
      bengaliTitle: "বনানী রয়েল এস্টেট বাগান",
      location: "Road 11, Banani, Dhaka",
      beforeImg: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=1200&q=80",
      afterImg: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?w=1200&q=80",
      desc: "অনাবাদি ফাঁকা উঠানকে সাজিয়ে তোলা হয়েছে মার্বেল পাথরের জলপ্রপাত, উষ্ণ ল্যান্ডস্কেপ লাইটিং এবং দুর্লভ বাগান উদ্ভিদের সমাহারে।",
      tags: ["Water Feature", "Landscape Lighting", "Bespoke Sodding"],
      area: "5,500 sq.ft",
    },
  ];

  const current = transformations[activeItem];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#121813] border-b border-stone-300 overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Shma Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                Transformation Case Studies • রূপান্তরের গল্প
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                Before & After <span className="font-bold text-[#2B4D33]">Evolution</span>
              </h2>
            </div>
            
            {/* Project Switcher Buttons */}
            <div className="flex flex-wrap gap-2">
              {transformations.map((t, idx) => (
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
                  {t.title.split(" ")[0]} Case
                </button>
              ))}
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-6 sm:p-10 rounded-[32px] border border-stone-300 shadow-sm">
          
          {/* Comparison Slider Frame (Left) */}
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden select-none shadow-xl border border-stone-200">
              
              {/* After Image (Background) */}
              <img
                src={current.afterImg}
                alt="After Transformation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-[#2B4D33] text-white px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold shadow-md">
                AFTER (পরবর্তী রূপ)
              </div>

              {/* Before Image (Clipped Foreground) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={current.beforeImg}
                  alt="Before Transformation"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: "100%", height: "100%" }}
                />
                <div className="absolute top-4 left-4 bg-black/80 text-white px-3.5 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-widest font-bold shadow-md">
                  BEFORE (পূর্ববর্তী অবস্থা)
                </div>
              </div>

              {/* Slider Divider Bar */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-ew-resize flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-9 h-9 rounded-full bg-[#18221A] text-white border-2 border-white flex items-center justify-center shadow-xl text-xs font-mono font-bold">
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
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Before and after transformation slider"
              />
            </div>
            
            <p className="text-center font-mono text-xs text-[#75787B] mt-3">
              ← স্লাইডারটি ডানে বা বামে টেনে রূপান্তর দেখুন (Drag slider horizontally) →
            </p>
          </div>

          {/* Project Narrative Specifications (Right) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-[#2B4D33] font-bold">
                📍 {current.location}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#121813] leading-tight">
                {current.title}
              </h3>
              <p className="font-sans text-xs font-bold text-[#2B4D33]">
                {current.bengaliTitle} • {current.area}
              </p>
              <p className="font-sans text-xs sm:text-sm text-[#75787B] leading-relaxed pt-1">
                {current.desc}
              </p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#75787B] font-semibold block">
                Engineering Specifications
              </span>
              <div className="flex flex-wrap gap-1.5">
                {current.tags.map((tag, i) => (
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
              <button
                onClick={() => {
                  const el = document.getElementById("estimator");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                  else window.location.href = "/design-garden";
                }}
                className="w-full py-3 bg-[#18221A] hover:bg-[#2B4D33] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-full transition-all text-center cursor-pointer shadow"
              >
                Estimate Similar Rooftop
              </button>
              <Link
                href="/before-after"
                className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-[#121813] font-mono text-xs uppercase tracking-wider font-semibold rounded-full transition-all text-center"
              >
                View All Case Studies
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
