"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sessionData?: any;
  inboxCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sessionData,
  inboxCount = 0,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const { logout } = useAuth();

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle ESC key to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onClose) {
      onClose();
    }
  };

  // Navigation Menu matching AeuxGlobal design system
  const menuSections: {
    sectionTitle: string;
    items: { id: string; label: string; icon: React.ReactNode; badge?: number | string; highlight?: boolean }[];
  }[] = [
    {
      sectionTitle: "NAVIGATION",
      items: [
        {
          id: "analytics",
          label: "Dashboard",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
          ),
        },
        {
          id: "design-requests",
          label: "Analytics & Design",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
              <path d="M22 12A10 10 0 0 0 12 2v10z" />
            </svg>
          ),
        },
        {
          id: "employees",
          label: "Team Structure",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        },
        {
          id: "bookings",
          label: "Reports & Bookings",
          badge: 1,
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          ),
        },
        {
          id: "careers",
          label: "Support & Inbox",
          badge: inboxCount > 0 ? inboxCount : "New",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ),
        },
      ],
    },
    {
      sectionTitle: "STUDIO ERP & OPERATIONS",
      items: [
        {
          id: "tree-doctor",
          label: "Tree Doctor Clinic",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
          ),
        },
        {
          id: "maintenance",
          label: "Maintenance Schedules",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          ),
        },
        {
          id: "finance",
          label: "Accounts & Inventory",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          ),
        },
        {
          id: "service-card",
          label: "Digital Service Card",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          ),
        },
        {
          id: "services",
          label: "Services Catalog",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          ),
        },
        {
          id: "projects",
          label: "Portfolio Projects",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          ),
        },
        {
          id: "gallery",
          label: "Gallery Showcase",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          ),
        },
      ],
    },
  ];

  const renderSidebarContent = (isMobileView = false) => (
    <div className="flex flex-col h-full justify-between select-none">
      
      {/* 1. Header / Brand Bar with 3 Neon Green Bars */}
      <div className="space-y-4 pb-3">
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none cursor-pointer"
            title="A R Green Garden Public Home"
          >
            {/* 3 Green Vertical Bars Icon matching AeuxGlobal */}
            <div className="flex items-end gap-[3px] h-5 py-0.5">
              <span className="w-1.5 h-3 bg-[#00E676] rounded-full group-hover:scale-y-110 transition-transform"></span>
              <span className="w-1.5 h-4.5 bg-[#00E676] rounded-full group-hover:scale-y-110 transition-transform"></span>
              <span className="w-1.5 h-3.5 bg-[#00E676] rounded-full group-hover:scale-y-110 transition-transform"></span>
            </div>
            <span className="font-display font-extrabold text-base tracking-tight text-white group-hover:text-[#00E676] transition-colors">
              A R Green Garden
            </span>
          </Link>

          {/* Close Button on Mobile Drawer */}
          {isMobileView && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm cursor-pointer transition-colors focus:outline-none"
              aria-label="Close Sidebar"
            >
              ✕
            </button>
          )}
        </div>

        {/* Workspace Dropdown Pill */}
        <div className="bg-[#141F18] border border-white/10 hover:border-white/20 rounded-2xl p-2.5 flex items-center justify-between text-xs cursor-pointer transition-all shadow-xs group">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-[#00E676]/15 text-[#00E676] flex items-center justify-center font-bold text-xs shrink-0 border border-[#00E676]/30 shadow-xs group-hover:scale-105 transition-transform">
              ✦
            </div>
            <div className="min-w-0 truncate">
              <p className="text-[9px] uppercase font-mono text-stone-400 font-semibold leading-none">Team Workspace</p>
              <p className="text-xs font-bold text-white mt-0.5 truncate">A R Green Garden</p>
            </div>
          </div>
          <span className="text-stone-400 text-xs shrink-0 ml-1">▾</span>
        </div>

        {/* Quick Search Input with ⌘+F */}
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-stone-400 text-xs">🔍</span>
          <input
            type="text"
            placeholder="Search for..."
            className="w-full bg-[#141F18] border border-white/10 rounded-2xl pl-8 pr-12 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#00E676] transition-all font-sans"
          />
          <span className="absolute right-2.5 top-2 px-1.5 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-stone-300 font-bold">
            ⌘+F
          </span>
        </div>
      </div>

      {/* 2. Scrollable Navigation Menu */}
      <div className="flex flex-col gap-4 flex-grow overflow-y-auto pr-1 custom-scrollbar my-2">
        {menuSections.map((sec, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <p className="text-[9px] uppercase font-mono font-bold tracking-[0.2em] text-stone-500 px-3 mb-1">
              {sec.sectionTitle}
            </p>
            <nav className="flex flex-col gap-1">
              {sec.items.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center justify-between w-full py-2.5 px-3.5 rounded-2xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                      isSelected
                        ? "text-white bg-[#1A261F] border border-white/10 shadow-sm font-bold"
                        : "text-stone-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate min-w-0">
                      <span className={`shrink-0 transition-colors ${isSelected ? "text-[#00E676]" : "text-stone-400"}`}>
                        {tab.icon}
                      </span>
                      <span className="truncate">{tab.label}</span>
                    </div>

                    {tab.badge !== undefined && (
                      <span className="bg-[#00E676] text-stone-950 font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 shadow-xs">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Settings Pill */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => handleTabClick("settings")}
            className={`flex items-center gap-3 w-full py-2.5 px-3.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "text-white bg-[#1A261F] border border-white/10 font-bold"
                : "text-stone-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* 3. Bottom User Account Card & Portal Link */}
      <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
        <p className="text-[9px] uppercase font-mono font-bold tracking-[0.2em] text-stone-500 px-3">
          USER ACCOUNT
        </p>

        {/* User Profile Pill matching AeuxGlobal */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-[#141F18] border border-white/10 hover:border-white/20 transition-all shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Avatar with Green Dot */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#1A261F] border border-[#00E676]/40 text-[#00E676] flex items-center justify-center font-bold text-xs shrink-0">
                {sessionData?.user?.name ? sessionData.user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#00E676] rounded-full border-2 border-[#0B120E]"></span>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">
                {sessionData?.user?.name || "Alex Williamson"}
              </p>
              <p className="text-[10px] font-mono text-stone-400 truncate mt-0.5">
                #dela-1974
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="text-stone-400 hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer text-xs"
            title="Log Out"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Live Site Portal Link */}
        <Link
          href="/"
          className="flex items-center justify-between py-2 px-3 rounded-2xl bg-[#141F18]/80 hover:bg-[#141F18] text-stone-300 hover:text-white border border-white/10 text-xs font-mono transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>🌐</span>
            <span>ল্যান্ডিং পেজ দেখুন</span>
          </div>
          <span className="text-[11px] text-[#00E676] group-hover:translate-x-0.5 transition-transform">➔</span>
        </Link>
      </div>

    </div>
  );

  return (
    <>
      {/* ================= 1. DESKTOP PERMANENT SIDEBAR (Laptop & Large Screens) ================= */}
      <aside className="hidden md:flex md:w-[275px] bg-[#0B120E] text-white flex-col px-3.5 py-5 sticky top-0 h-screen shrink-0 shadow-2xl border-r border-[#16221A] z-20 font-sans">
        {renderSidebarContent(false)}
      </aside>

      {/* ================= 2. MOBILE & TABLET SLIDE-IN DRAWER (< md Screens) ================= */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Drawer"
      >
        {/* Backdrop Overlay */}
        <div
          onClick={onClose}
          className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 cursor-pointer ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Left Slide-out Drawer Container */}
        <aside
          className={`relative w-[300px] max-w-[85vw] h-full bg-[#0B120E] text-white flex flex-col px-4 py-5 shadow-2xl border-r border-[#16221A] z-10 transition-transform duration-300 ease-out font-sans ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarContent(true)}
        </aside>
      </div>
    </>
  );
}
