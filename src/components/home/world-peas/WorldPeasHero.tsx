"use client";

import React, { useState } from "react";

export default function WorldPeasHero() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full bg-white text-black py-4 sm:py-6">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-8 space-y-6">
        {/* Section Heading (Figma: We are World Peas, Inter 18px w500) */}
        <div>
          <h2 className="text-[17px] sm:text-[18px] font-sans font-medium text-black">
            We are World Peas
          </h2>
        </div>

        {/* Hero Video / Media Box (Figma: 1216x684, rounded-2xl) */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[1216/684] rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 shadow-sm group">
          <img
            src="/world-peas/hero_video_poster.png"
            alt="We are World Peas"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/hero_plants.png";
            }}
          />

          {/* Ambient Film Gradient */}
          <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors duration-500" />

          {/* Play Video Button (Figma: Button/Primary 162x49, bg-white, text-black) */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 sm:px-8 py-3 rounded-full bg-white/95 hover:bg-white text-black font-sans text-sm sm:text-base font-normal flex items-center gap-3 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-black/10"
              aria-label="Play video"
            >
              {/* Play Triangle Icon */}
              <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Play video</span>
              <span className="font-mono text-xs opacity-60">(00)</span>
            </button>
          </div>
        </div>

        {/* Subheadline Statement (Figma: Inter 32px w400, max-w: 840px) */}
        <div className="pt-16 sm:pt-24 pb-8 sm:pb-16 max-w-[840px]">
          <p className="font-sans text-[22px] sm:text-[28px] md:text-[32px] font-normal leading-[1.35] text-black tracking-[-0.01em]">
            Sustainability is at the heart of what World Peas stands for—that’s why we only partner with farmers that pledge to use environmentally-friendly farming methods.
          </p>
        </div>
      </div>
    </section>
  );
}

