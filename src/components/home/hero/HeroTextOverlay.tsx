"use client";

import React from "react";

interface HeroTextOverlayProps {
  enableTextOverlay?: boolean;
  isBn: boolean;
  taglineEn?: string;
  taglineBn?: string;
  headlineEn?: string;
  headlineBn?: string;
  descriptionEn?: string;
  descriptionBn?: string;
  textPosition?: "center" | "bottom-left";
}

export default function HeroTextOverlay({
  enableTextOverlay,
  isBn,
  taglineEn,
  taglineBn,
  headlineEn,
  headlineBn,
  descriptionEn,
  descriptionBn,
  textPosition = "bottom-left",
}: HeroTextOverlayProps) {
  if (!enableTextOverlay) return null;

  const tagline = isBn ? taglineBn || taglineEn : taglineEn;
  // Headlines always stay in English in both English and Bengali themes
  const headline = headlineEn || headlineBn;
  const description = isBn ? descriptionBn || descriptionEn : descriptionEn;

  if (textPosition === "bottom-left") {
    return (
      <div className="absolute bottom-24 sm:bottom-28 left-6 sm:left-12 lg:left-16 z-20 max-w-2xl text-left text-white pointer-events-none space-y-3 drop-shadow-md">
        {tagline && (
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#E4E2D7] block font-medium">
            {tagline}
          </span>
        )}
        {headline && (
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-light tracking-tight leading-[1.08] uppercase text-white drop-shadow-lg">
            {headline}
          </h1>
        )}
        {description && (
          <p className="max-w-xl text-xs sm:text-sm text-white/80 font-sans font-light leading-relaxed drop-shadow">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="relative z-20 max-w-4xl mx-auto px-6 text-center text-white pointer-events-none space-y-4">
      {tagline && (
        <span className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-[0.25em] text-[#E4E2D7]">
          {tagline}
        </span>
      )}
      {headline && (
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light font-display tracking-tight uppercase drop-shadow-lg">
          {headline}
        </h1>
      )}
      {description && (
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/85 font-sans font-light leading-relaxed drop-shadow">
          {description}
        </p>
      )}
    </div>
  );
}
