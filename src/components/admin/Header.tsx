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
    <header className="h-16 bg-[#0c1610]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shadow-md shrink-0 text-[#E4E2D7] font-sans">
      
      {/* Left: Hamburger Button (Mobile) + Studio Brand Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/15 text-[#E4E2D7] hover:bg-white/10 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Open Navigation Drawer"
          title="Open Menu Drawer"
        >
          <div className="flex flex-col gap-1 w-5">
            <span className="w-full h-[1.5px] bg-[#E4E2D7]"></span>
            <span className="w-full h-[1.5px] bg-[#E4E2D7]"></span>
            <span className="w-full h-[1.5px] bg-[#E4E2D7]"></span>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <div className="flex items-center gap-2">
            <span className="text-[13px] sm:text-[15px] font-display font-bold text-[#E4E2D7] tracking-wide whitespace-nowrap">
              এডমিন কন্ট্রোল প্যানেল
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
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
            className="w-full pl-4 pr-9 py-1.5 border border-white/15 rounded-full text-xs focus:outline-none focus:border-emerald-400 text-white bg-black/40 placeholder:text-white/30 transition-all font-sans"
          />
          <span className="absolute right-3 top-2 text-[10px] text-white/40">🔍</span>
        </div>

        {/* Database Refresh Button */}
        <button 
          type="button"
          onClick={fetchData} 
          className="hover:text-white cursor-pointer text-xs font-mono font-bold text-emerald-400 bg-white/5 hover:bg-white/10 px-2.5 sm:px-3 py-1.5 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 shrink-0"
          title="Refresh database records"
        >
          <span>⟳</span>
          <span className="hidden sm:inline">রিফ্রেশ</span>
        </button>
        
        {/* New Service Quick Action */}
        <button 
          type="button" 
          onClick={() => { setActiveTab("services"); setEditingService(null); }}
          className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold font-mono py-1.5 px-3 sm:px-4 rounded-full flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-105 active:scale-95 shrink-0"
        >
          <span>+</span>
          <span className="hidden sm:inline">নতুন সার্ভিস</span>
        </button>

        {/* Direct Landing Page Link */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-mono transition-colors shrink-0"
          title="Open Landing Page in new tab"
        >
          <span>🌐</span>
          <span className="hidden md:inline">সাইট দেখুন</span>
        </Link>
      </div>

    </header>
  );
}
