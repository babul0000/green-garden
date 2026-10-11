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
    <header className="h-20 bg-[#F4F6F4]/95 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30 shrink-0 text-[#111813] font-sans">
      
      {/* Left: Mobile Hamburger Trigger + Dashboard Title */}
      <div className="flex items-center gap-3.5">
        {/* Mobile Hamburger Trigger */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-2xl bg-white border border-stone-200/80 text-[#111813] shadow-xs hover:bg-stone-50 transition-all cursor-pointer focus:outline-none"
          aria-label="Open Navigation Drawer"
          title="Open Menu Drawer"
        >
          <div className="flex flex-col gap-1 w-5">
            <span className="w-full h-[1.5px] bg-[#111813]"></span>
            <span className="w-full h-[1.5px] bg-[#111813]"></span>
            <span className="w-full h-[1.5px] bg-[#111813]"></span>
          </div>
        </button>

        <div>
          <h1 className="text-2xl sm:text-[28px] font-display font-extrabold text-[#111813] tracking-tight leading-none">
            Dashboard
          </h1>
          <p className="hidden sm:block text-[11px] font-mono text-stone-500 mt-1">
            Studio Performance & Live Ecological Operations
          </p>
        </div>
      </div>

      {/* Right: Notification Bell & Dark "Add Custom Widget" Button matching AeuxGlobal */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Database Refresh */}
        <button 
          type="button"
          onClick={fetchData} 
          className="w-10 h-10 rounded-full bg-white hover:bg-stone-50 text-stone-700 hover:text-black border border-stone-200/80 flex items-center justify-center transition-all shadow-xs cursor-pointer text-sm"
          title="Refresh database records"
        >
          <span>⟳</span>
        </button>

        {/* Circular Notification Bell with Glow dot */}
        <button 
          type="button"
          className="relative w-10 h-10 rounded-full bg-white hover:bg-stone-50 border border-stone-200/80 flex items-center justify-center transition-all shadow-xs cursor-pointer text-sm text-stone-700 hover:text-black"
          title="Notifications"
        >
          <span>🔔</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#00E676] rounded-full border border-white"></span>
        </button>

        {/* Dark AeuxGlobal-Style Action Button: "Add Custom Widget" / "+ নতুন সার্ভিস" */}
        <button 
          type="button" 
          onClick={() => { setActiveTab("services"); setEditingService(null); }}
          className="bg-[#111813] hover:bg-[#1E2922] text-white text-xs font-bold font-mono py-2.5 px-4 sm:px-5 rounded-2xl flex items-center gap-2 transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span>+</span>
          <span className="whitespace-nowrap">Add Custom Widget</span>
        </button>

        {/* Direct Landing Page Link */}
        <Link
          href="/"
          className="hidden lg:flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-stone-200/80 bg-white hover:bg-stone-50 text-[#111813] text-xs font-mono transition-colors shrink-0 shadow-xs cursor-pointer"
          title="Visit Home Page"
        >
          <span>🌐</span>
          <span>সাইট দেখুন</span>
        </Link>
      </div>

    </header>
  );
}
