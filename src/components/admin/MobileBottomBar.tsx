"use client";

import React from "react";

interface MobileBottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMenu: () => void;
}

export default function MobileBottomBar({
  activeTab,
  setActiveTab,
  onOpenMenu,
}: MobileBottomBarProps) {
  // Determine if activeTab belongs to one of the 4 primary tabs; otherwise Menu is active
  const isHomeActive = activeTab === "analytics";
  const isProjectsActive = activeTab === "projects";
  const isClientsActive = activeTab === "design-requests";
  const isBookingsActive = activeTab === "bookings";
  const isMenuActive = !isHomeActive && !isProjectsActive && !isClientsActive && !isBookingsActive;

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#F7F6F2]/95 backdrop-blur-xl border-t border-[#D6D2C4] shadow-[0_-4px_20px_rgba(0,0,0,0.07)] select-none"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 4px)",
      }}
      aria-label="Mobile Bottom Navigation"
    >
      <div className="grid grid-cols-5 h-14 items-center">
        
        {/* 1. HOME (Dashboard Overview) */}
        <button
          type="button"
          onClick={() => setActiveTab("analytics")}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            isHomeActive ? "text-[#2B4D33]" : "text-[#75787B] hover:text-[#121813]"
          }`}
          aria-label="Home Dashboard"
        >
          {isHomeActive && (
            <span className="w-8 h-0.5 rounded-full bg-[#2B4D33] absolute top-0" />
          )}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill={isHomeActive ? "currentColor" : "none"} stroke="currentColor" strokeWidth={isHomeActive ? "1.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className={`text-[10px] tracking-tight leading-tight mt-0.5 font-sans ${isHomeActive ? "font-bold text-[#2B4D33]" : "font-medium"}`}>
            Home
          </span>
          <span className="text-[8px] leading-none opacity-70">
            হোম
          </span>
        </button>

        {/* 2. PROJECTS (Masterplans) */}
        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            isProjectsActive ? "text-[#2B4D33]" : "text-[#75787B] hover:text-[#121813]"
          }`}
          aria-label="Projects Masterplans"
        >
          {isProjectsActive && (
            <span className="w-8 h-0.5 rounded-full bg-[#2B4D33] absolute top-0" />
          )}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isProjectsActive ? "2.3" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="1" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <span className={`text-[10px] tracking-tight leading-tight mt-0.5 font-sans ${isProjectsActive ? "font-bold text-[#2B4D33]" : "font-medium"}`}>
            Projects
          </span>
          <span className="text-[8px] leading-none opacity-70">
            প্রজেক্ট
          </span>
        </button>

        {/* 3. CLIENTS (Design Commissions & Quotes) */}
        <button
          type="button"
          onClick={() => setActiveTab("design-requests")}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            isClientsActive ? "text-[#2B4D33]" : "text-[#75787B] hover:text-[#121813]"
          }`}
          aria-label="Clients and Design Requests"
        >
          {isClientsActive && (
            <span className="w-8 h-0.5 rounded-full bg-[#2B4D33] absolute top-0" />
          )}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isClientsActive ? "2.3" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className={`text-[10px] tracking-tight leading-tight mt-0.5 font-sans ${isClientsActive ? "font-bold text-[#2B4D33]" : "font-medium"}`}>
            Clients
          </span>
          <span className="text-[8px] leading-none opacity-70">
            ক্লায়েন্ট
          </span>
        </button>

        {/* 4. BOOKINGS (Site Visits) */}
        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            isBookingsActive ? "text-[#2B4D33]" : "text-[#75787B] hover:text-[#121813]"
          }`}
          aria-label="Bookings"
        >
          {isBookingsActive && (
            <span className="w-8 h-0.5 rounded-full bg-[#2B4D33] absolute top-0" />
          )}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isBookingsActive ? "2.3" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className={`text-[10px] tracking-tight leading-tight mt-0.5 font-sans ${isBookingsActive ? "font-bold text-[#2B4D33]" : "font-medium"}`}>
            Bookings
          </span>
          <span className="text-[8px] leading-none opacity-70">
            বুকিং
          </span>
        </button>

        {/* 5. MENU (Opens Drawer) */}
        <button
          type="button"
          onClick={onOpenMenu}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] cursor-pointer transition-colors relative ${
            isMenuActive ? "text-[#2B4D33]" : "text-[#75787B] hover:text-[#121813]"
          }`}
          aria-label="All Navigation Menu"
        >
          {isMenuActive && (
            <span className="w-8 h-0.5 rounded-full bg-[#2B4D33] absolute top-0" />
          )}
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={isMenuActive ? "2.3" : "2"} strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className={`text-[10px] tracking-tight leading-tight mt-0.5 font-sans ${isMenuActive ? "font-bold text-[#2B4D33]" : "font-medium"}`}>
            Menu
          </span>
          <span className="text-[8px] leading-none opacity-70">
            মেনু
          </span>
        </button>

      </div>
    </nav>
  );
}
