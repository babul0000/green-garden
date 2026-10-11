"use client";

import React from "react";
import NavLanguageToggle from "./NavLanguageToggle";

interface NavDrawerHeaderProps {
  onClose: () => void;
  rotateDeg: number;
  onToggleLang: () => void;
}

export default function NavDrawerHeader({
  onClose,
  rotateDeg,
  onToggleLang,
}: NavDrawerHeaderProps) {
  return (
    <div className="sticky top-0 z-20 bg-[#E4E2D7]/95 backdrop-blur-md pb-4 pt-1 border-b border-[#D6D2C4] flex justify-between items-center -mx-6 px-6 sm:-mx-10 sm:px-10 mb-6">
      {/* 3-Line Hamburger Close Icon */}
      <button
        onClick={onClose}
        className="group flex items-center p-2 -ml-2 text-[#323232] hover:opacity-70 cursor-pointer focus:outline-none"
        aria-label="Close Navigation Menu"
      >
        <div className="flex flex-col gap-1.5 w-7">
          <span className="w-full h-[1.5px] bg-[#323232]"></span>
          <span className="w-full h-[1.5px] bg-[#323232]"></span>
          <span className="w-full h-[1.5px] bg-[#323232]"></span>
        </div>
      </button>

      <div className="flex items-center gap-2">
        {/* Language Switcher in Drawer */}
        <NavLanguageToggle
          rotateDeg={rotateDeg}
          onToggle={onToggleLang}
          inDrawer={true}
        />

        {/* Close Button "✕" */}
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#323232] flex items-center justify-center text-sm ml-1 cursor-pointer transition-all hover:rotate-90 duration-300 focus:outline-none"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
