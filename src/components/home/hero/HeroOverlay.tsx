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
        <div
          className="absolute inset-x-0 top-0 h-40 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      )}
      {showBottomVignette && (
        <div
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none z-10"
          style={{
            background: "linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.35) 50%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
      )}
    </>
  );
}
