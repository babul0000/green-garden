"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface NavLanguageToggleProps {
  isLightHeader?: boolean;
  rotateDeg: number;
  onToggle: () => void;
  inDrawer?: boolean;
}

export default function NavLanguageToggle({
  isLightHeader = false,
  rotateDeg,
  onToggle,
  inDrawer = false,
}: NavLanguageToggleProps) {
  const { language } = useLanguage();

  if (inDrawer) {
    return (
      <button
        onClick={onToggle}
        type="button"
        className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.06] hover:bg-black/[0.12] text-[#323232] border border-[#323232]/20 text-xs font-mono transition-all cursor-pointer select-none hover:scale-105 active:scale-95 duration-200"
        title={language === "bn" ? "Switch to English" : "বাংলা ভাষায় পরিবর্তন করুন"}
        aria-label="Toggle Language"
      >
        <svg
          style={{ transform: `rotate(${rotateDeg}deg)` }}
          className="w-3.5 h-3.5 transition-transform duration-500 ease-in-out shrink-0 text-[#2B4D33]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span className="font-bold text-xs tracking-wider">
          {language === "bn" ? "বাংলা" : "English"}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onToggle}
      type="button"
      className={`group text-xs font-mono tracking-wider px-2.5 sm:px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none hover:scale-105 active:scale-95 duration-200 ${
        isLightHeader
          ? "border-[#323232]/25 hover:border-[#323232] text-[#323232] bg-black/[0.03] hover:bg-black/[0.07]"
          : "border-white/35 hover:border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
      }`}
      title={language === "bn" ? "Switch to English" : "বাংলা ভাষায় পরিবর্তন করুন"}
      aria-label="Toggle Language"
    >
      <svg
        style={{ transform: `rotate(${rotateDeg}deg)` }}
        className="w-3.5 h-3.5 transition-transform duration-500 ease-in-out shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      <span className="font-bold text-xs tracking-wider transition-opacity duration-200">
        {language === "bn" ? "বাংলা" : "English"}
      </span>
    </button>
  );
}
