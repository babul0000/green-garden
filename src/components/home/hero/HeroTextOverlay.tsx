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
}: HeroTextOverlayProps) {
  if (!enableTextOverlay) return null;

  const tagline = isBn ? taglineBn || taglineEn : taglineEn;
  const headline = isBn ? headlineBn || headlineEn : headlineEn;
  const description = isBn ? descriptionBn || descriptionEn : descriptionEn;

  return (
    <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pointer-events-none">
      {tagline && (
        <span className="inline-block px-4 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-[0.25em] text-emerald-300">
          {tagline}
        </span>
      )}
      {headline && (
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide uppercase font-serif mb-4 drop-shadow-md">
          {headline}
        </h1>
      )}
      {description && (
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/80 font-sans font-light leading-relaxed drop-shadow">
          {description}
        </p>
      )}
    </div>
  );
}
