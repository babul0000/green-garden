"use client";

import React from "react";
import Link from "next/link";

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  setEditingService: (service: any) => void;
  fetchData: () => void;
  onToggleSidebar?: () => void;
}

export default function Header({
  setActiveTab,
  setEditingService,
  fetchData,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="h-20 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#D6D2C4] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shrink-0 text-[#121813] font-sans">
      
      {/* Left: Mobile Hamburger Trigger + Studio Title */}
      <div className="flex items-center gap-3.5">
        {/* Mobile Hamburger Trigger (Minimum 44px touch target) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-[#D6D2C4] text-[#121813] shadow-xs hover:bg-[#E4E2D7] transition-all cursor-pointer focus:outline-none"
          aria-label="Open Navigation Drawer"
          title="Open Menu Drawer"
        >
          <div className="flex flex-col gap-1 w-5">
            <span className="w-full h-[1.5px] bg-[#121813]"></span>
            <span className="w-full h-[1.5px] bg-[#121813]"></span>
            <span className="w-full h-[1.5px] bg-[#121813]"></span>
          </div>
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm xs:text-base sm:text-2xl font-display font-light text-[#121813] tracking-[0.06em] sm:tracking-[0.14em] uppercase leading-tight truncate">
              STUDIO DASHBOARD
            </h1>
            <span className="hidden sm:inline-block text-[9px] font-mono uppercase tracking-[0.2em] text-[#2B4D33] font-bold px-2 py-0.5 rounded-full bg-[#2B4D33]/10 border border-[#2B4D33]/20">
              Live Operations
            </span>
          </div>
          <p className="hidden sm:block text-[11px] font-sans font-light text-[#75787B] mt-0.5">
            Landscape Architecture, Biophilic Living & Arboriculture Management
          </p>
        </div>
      </div>

      {/* Right: Search (hidden until active), Database Refresh, Primary Commissions Button */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Search input is hidden until full backend search indexing is implemented */}

        {/* Database Refresh */}
        <button 
          type="button"
          onClick={fetchData} 
          className="min-h-[44px] hover:text-[#121813] cursor-pointer text-xs font-mono font-semibold text-[#2B4D33] bg-white hover:bg-[#E4E2D7] px-3 py-1.5 rounded-full border border-[#D6D2C4] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
          title="Refresh database records"
        >
          <span>⟳</span>
          <span className="hidden sm:inline">রিফ্রেশ</span>
        </button>

        {/* Master Project Settings Hub Shortcut (Facebook Style) */}
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className="min-h-[44px] hover:text-[#121813] cursor-pointer text-xs font-mono font-semibold text-[#121813] bg-white hover:bg-[#E4E2D7] px-3 py-1.5 rounded-full border border-[#D6D2C4] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
          title="Master Project Settings (Facebook Hub A to Z)"
        >
          <span>⚙️</span>
          <span className="hidden md:inline">সেটিংস হাব</span>
        </button>

        {/* New Commission / Service Action */}
        <button 
          type="button" 
          onClick={() => { setActiveTab("services"); setEditingService(null); }}
          className="min-h-[44px] bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono tracking-wider py-1.5 px-3 sm:px-4 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0 font-medium"
        >
          <span>+</span>
          <span className="whitespace-nowrap text-[11px] sm:text-xs">নতুন কমিশন</span>
        </button>

        {/* Direct Landing Page Link */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D6D2C4] bg-white hover:bg-[#E4E2D7] text-[#121813] text-xs font-mono transition-colors shrink-0 shadow-2xs cursor-pointer"
          title="Visit Home Page"
        >
          <span>🌐</span>
          <span>সাইট দেখুন</span>
        </Link>
      </div>

    </header>
  );
}
