"use client";

import React, { useState, useEffect } from "react";

const campaigns = [
  {
    title: "A R GREEN GARDEN 10 TH",
    subtitle: "Participating in the future • আগামীর সবুজ বাংলাদেশ বিনির্মাণে",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/Banner-Website-Shma-19th_Artboard-1_01-1.jpg",
  },
  {
    title: "BIOPHILIC BANGLADESH",
    subtitle: "Restoring Urban Ecosystems • শহুরে কংক্রিটে জীবন্ত ইকোসিস্টেমের রূপান্তর",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1600&auto=format&fit=crop",
  },
];

export default function ShmaCampaign() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % campaigns.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const active = campaigns[currentSlide];

  return (
    <section className="relative w-full h-[450px] sm:h-[550px] overflow-hidden bg-black flex items-center justify-center">
      {/* Background Image with Smooth Crossfade */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={active.image}
          alt={active.title}
          className="w-full h-full object-cover transition-all duration-1000 scale-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1600&auto=format&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-black/45"></div>
      </div>

      {/* Centered Campaign Typography with Bilingual Subtitle */}
      <div className="relative z-10 text-center text-white px-6 space-y-4 max-w-4xl mx-auto">
        <h2 className="font-display font-light text-4xl sm:text-6xl md:text-7xl tracking-wider uppercase">
          {active.title}
        </h2>
        <p className="font-display font-light text-lg sm:text-2xl md:text-[26px] text-white/95 tracking-wide">
          {active.subtitle}
        </p>
      </div>

      {/* Carousel Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {campaigns.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
              currentSlide === idx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
