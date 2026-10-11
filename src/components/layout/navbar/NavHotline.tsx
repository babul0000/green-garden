"use client";

import React from "react";

interface NavHotlineProps {
  isLightHeader?: boolean;
  hotlinePhone?: string;
  hotlineDisplay?: string;
}

export default function NavHotline({
  isLightHeader = false,
  hotlinePhone = "01883012641",
  hotlineDisplay,
}: NavHotlineProps) {
  return (
    <a
      href={`tel:${hotlinePhone}`}
      className={`text-xs font-mono tracking-wider hover:opacity-75 transition-opacity border-b pb-0.5 whitespace-nowrap hidden lg:inline ${
        isLightHeader ? "text-[#323232] border-[#323232]/35" : "text-white border-white/40"
      }`}
      title="Call Studio Hotline"
    >
      {hotlineDisplay || hotlinePhone || "০১88৩-০১২৬৪১"}
    </a>
  );
}
