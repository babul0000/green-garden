"use client";

import React, { useState } from "react";

export default function BeforeAfterSection() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeItem, setActiveItem] = useState(0);

  const transformations = [
    {
      title: "Dhanmondi Penthouse Rooftop",
      location: "Road 9/A, Dhanmondi, Dhaka",
      beforeImg: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=1000&q=80",
      afterImg: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=1000&q=80",
      desc: "কংক্রিটের খালি ছাদকে বদলে দিয়ে ওয়াটারপ্রুফ ড্রেনেজ, জাপানিজ গ্রাস কার্পেট ও আধুনিক পারগোলা সমৃদ্ধ লাক্সারি হ্যাভেন তৈরি।",
      tags: ["Rooftop Garden", "Waterproofing", "Smart Drip Irrigation"],
    },
    {
      title: "Gulshan Corporate Vertical Green Wall",
      location: "Gulshan Avenue, Dhaka",
      beforeImg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1000&q=80",
      afterImg: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=1000&q=80",
      desc: "নির্জীব কংক্রিট দেয়ালকে ৪,০০০+ জীবিত এয়ার-পিউরিফাইং গাছ ও স্বয়ংক্রিয় হাইড্রোপনিক পদ্ধতিতে গ্রিন ওয়ালে রূপান্তর।",
      tags: ["Vertical Garden", "Air Purifying", "Automated Watering"],
    },
  ];

  const current = transformations[activeItem];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
              রূপান্তরের গল্প
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3">
              Before & After Transformation
            </h2>
            <p className="text-sm md:text-base text-gray-600 mt-1 max-w-xl">
              সরাসরি দেখুন কীভাবে আমাদের পেশাদার পরিকল্পনা সাধারণ স্থানকে অসাধারণ সবুজে রূপান্তর করে।
            </p>
          </div>

          {/* Project switchers */}
          <div className="flex gap-2">
            {transformations.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveItem(idx);
                  setSliderPosition(50);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  activeItem === idx
                    ? "bg-emerald-700 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t.title.split(" ")[0]} Project
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Slider */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <div className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden select-none shadow-2xl border-4 border-gray-100">
              {/* After Image (Background) */}
              <img
                src={current.afterImg}
                alt="After Transformation"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-emerald-700/90 text-white px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md shadow">
                AFTER (পরে)
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
                <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md shadow">
                  BEFORE (পূর্বে)
                </div>
              </div>

              {/* Slider Divider Bar */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] cursor-ew-resize flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-9 h-9 bg-white text-emerald-800 rounded-full shadow-lg flex items-center justify-center text-xs font-black border-2 border-emerald-600">
                  ↔
                </div>
              </div>

              {/* Invisible Range Input for Full Cross-device Control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                aria-label="Before and After Comparison Slider"
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              👆 স্লাইডারটি ডানে-বামে টেনে পূর্বে এবং পরের পরিবর্তন দেখুন (Drag slider horizontally)
            </p>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-4 bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-4">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Project Case Study</span>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">{current.title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">📍 {current.location}</p>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">
              {current.desc}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {current.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-white text-emerald-800 border border-emerald-200">
                  ✓ {tag}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-emerald-200/60">
              <a
                href="#contact"
                className="w-full inline-block text-center py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                এই ধরণের বাগান তৈরি করতে চান? কন্টাক্ট করুন
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
