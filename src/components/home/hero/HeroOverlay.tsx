"use client";

import React from "react";

interface HeroOverlayProps {
  overlayDarkness?: number;
  showTopVignette?: boolean;
  showBottomVignette?: boolean;
}

export default function HeroOverlay({
  overlayDarkness = 10,
  showTopVignette = true,
  showBottomVignette = true,
}: HeroOverlayProps) {
  return (
    <>
      {/* Dynamic Overlay Darkness */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: (overlayDarkness || 0) / 100 }}
      />

      {/* Top & Bottom Vignettes for Header Readability & Cinematic Depth */}
      {showTopVignette && (
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none"></div>
      )}
      {showBottomVignette && (
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none"></div>
      )}
    </>
  );
}
