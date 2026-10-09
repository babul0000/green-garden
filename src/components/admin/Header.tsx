"use client";

import React from "react";

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  setEditingService: (service: any) => void;
  fetchData: () => void;
}

export default function Header({ setActiveTab, setEditingService, fetchData }: HeaderProps) {
  return (
    <header className="h-16 bg-[#121A14]/90 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-6 sm:px-8 sticky top-0 z-20 shadow-md shrink-0 text-[#E4E2D7] font-sans">
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-[15px] font-display font-bold text-[#E4E2D7]">এডমিন কন্ট্রোল প্যানেল</span>
        <span className="text-[10px] font-mono text-emerald-400/80 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          Studio Active
        </span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search Input bar */}
        <div className="relative w-64 hidden sm:block">
          <input
            type="text"
            placeholder="সার্চ করুন / Search garden..."
            className="w-full pl-4 pr-10 py-1.5 border border-white/15 rounded-full text-xs focus:outline-none focus:border-emerald-400 text-white bg-black/40 placeholder:text-white/30 transition-all"
          />
          <span className="absolute right-3.5 top-2.5 text-[10px] text-white/40">🔍</span>
        </div>

        {/* Top Icons & Actions */}
        <div className="flex gap-3 items-center text-white/70">
          <button 
            type="button"
            onClick={fetchData} 
            className="hover:text-white cursor-pointer text-xs font-bold font-mono text-emerald-400 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all flex items-center gap-1"
            title="Refresh database"
          >
            <span>⟳</span>
            <span className="hidden sm:inline">রিফ্রেশ</span>
          </button>
          
          <button 
            type="button" 
            onClick={() => { setActiveTab("services"); setEditingService(null); }}
            className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold font-mono py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-500/20 cursor-pointer hover:scale-[1.02]"
          >
            <span>+ নতুন সার্ভিস যোগ</span>
          </button>
        </div>
      </div>
    </header>
  );
}
