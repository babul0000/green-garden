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
    <header className="h-16 bg-white/95 backdrop-blur-xl border-b border-[#E7E5E4] flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-xs shrink-0 text-[#1C1917] font-sans">
      
      {/* Left: Hamburger Button (Mobile) + Studio Brand Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden flex items-center justify-center p-2 rounded-xl bg-[#F9F9F6] border border-[#E7E5E4] text-[#1C1917] hover:bg-[#F2F1EC] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
          aria-label="Open Navigation Drawer"
          title="Open Menu Drawer"
        >
          <div className="flex flex-col gap-1 w-5">
            <span className="w-full h-[1.5px] bg-[#1C1917]"></span>
            <span className="w-full h-[1.5px] bg-[#1C1917]"></span>
            <span className="w-full h-[1.5px] bg-[#1C1917]"></span>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1B4332] animate-pulse shrink-0"></span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] sm:text-[15px] font-display font-bold text-[#1C1917] tracking-wide whitespace-nowrap">
              এডমিন কন্ট্রোল প্যানেল
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#1B4332] font-bold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] border border-[#B7E4C7]">
              Studio Active
            </span>
          </div>
        </div>
      </div>

      {/* Right: Search, Quick Actions & Live Site Link */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Search Input bar (Desktop) */}
        <div className="relative w-56 lg:w-64 hidden lg:block">
          <input
            type="text"
            placeholder="সার্চ করুন / Search..."
            className="w-full pl-4 pr-9 py-1.5 border border-[#E7E5E4] rounded-full text-xs focus:outline-none focus:border-[#1B4332] text-[#1C1917] bg-[#F9F9F6] placeholder:text-[#78716C] transition-all font-sans"
          />
          <span className="absolute right-3 top-2 text-[10px] text-[#78716C]">🔍</span>
        </div>

        {/* Database Refresh Button */}
        <button 
          type="button"
          onClick={fetchData} 
          className="hover:text-[#1C1917] cursor-pointer text-xs font-mono font-bold text-[#1B4332] bg-[#F9F9F6] hover:bg-[#EDEBE5] px-2.5 sm:px-3 py-1.5 rounded-xl border border-[#E7E5E4] transition-all flex items-center gap-1.5 shrink-0"
          title="Refresh database records"
        >
          <span>⟳</span>
          <span className="hidden sm:inline">রিফ্রেশ</span>
        </button>
        
        {/* New Service Quick Action */}
        <button 
          type="button" 
          onClick={() => { setActiveTab("services"); setEditingService(null); }}
          className="bg-[#1B4332] hover:bg-[#133225] text-white text-xs font-bold font-mono py-1.5 px-3 sm:px-4 rounded-full flex items-center gap-1.5 transition-all shadow-sm shadow-[#1B4332]/20 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
        >
          <span>+</span>
          <span className="hidden sm:inline">নতুন সার্ভিস</span>
        </button>

        {/* Direct Landing Page Link */}
        <Link
          href="/"
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#E7E5E4] bg-white hover:bg-[#F9F9F6] text-[#1C1917] text-xs font-mono transition-colors shrink-0 shadow-2xs cursor-pointer"
          title="Visit Home Page"
        >
          <span>🌐</span>
          <span className="hidden md:inline">সাইট দেখুন</span>
        </Link>
      </div>

    </header>
  );
}
