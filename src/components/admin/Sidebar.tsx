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

  // Navigation Menu matching Landing Page architectural theme & clean standard Bengali
  const menuSections: {
    sectionTitle: string;
    items: { id: string; label: string; icon: React.ReactNode; badge?: number; highlight?: boolean }[];
  }[] = [
    {
      sectionTitle: "OVERVIEW & ANALYTICS",
      items: [
        {
          id: "analytics",
          label: "Dashboard Analytics",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          ),
        },
      ],
    },
    {
      sectionTitle: "CORE OPERATIONS & ERP",
      items: [
        {
          id: "design-requests",
          label: "Landscape Design Requests",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 8 8 12 12 16 16 12 12 8" />
            </svg>
          ),
        },
        {
          id: "tree-doctor",
          label: "Tree Doctor & Plant Clinic",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
          ),
        },
        {
          id: "employees",
          label: "Staff & Attendance",
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
          id: "maintenance",
          label: "Maintenance & Schedules",
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
      ],
    },
    {
      sectionTitle: "WEBSITE & CONTENT MANAGEMENT",
      items: [
        {
          id: "users",
          label: "User Management",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          ),
        },
        {
          id: "roles",
          label: "Roles & Permissions",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ),
        },
        {
          id: "services",
          label: "Service Catalog",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="21 8 21 21 3 21 3 8" />
              <rect x="1" y="3" width="22" height="5" />
              <line x1="10" y1="12" x2="14" y2="12" />
            </svg>
          ),
        },
        {
          id: "projects",
          label: "Project Portfolio",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          ),
        },
        {
          id: "gallery",
          label: "Before & After Gallery",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          ),
        },
        {
          id: "bookings",
          label: "General Bookings",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          ),
        },
        {
          id: "reviews",
          label: "Reviews & Feedback",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
        },
        {
          id: "careers",
          label: "Messages & Inquiries",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          ),
          badge: inboxCount,
        },
        {
          id: "hero",
          label: "Hero Section & Video",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          ),
        },
        {
          id: "header-nav",
          label: "Header & Navigation",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="5" rx="1" />
              <line x1="5" y1="5.5" x2="8" y2="5.5" />
              <line x1="16" y1="5.5" x2="19" y2="5.5" />
              <rect x="2" y="10" width="20" height="11" rx="2" />
            </svg>
          ),
        },
        {
          id: "settings",
          label: "System Settings",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
      ],
    },
  ];

  // Inner reusable navigation content matching Landing Page Signature Linen Light Theme
  const renderSidebarContent = (isMobileView = false) => (
    <div className="flex flex-col h-full justify-between">
      {/* 1. Header / Brand Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E4] mb-3 px-2">
        <Link
          href="/"
          className="flex items-center gap-3 group focus:outline-none cursor-pointer"
          title="Visit Public Landing Page"
        >
          <div className="w-9 h-9 rounded-2xl bg-[#1B4332] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <span className="font-display font-bold text-[13px] sm:text-[14px] text-[#1C1917] uppercase tracking-[0.18em] block leading-tight group-hover:text-[#1B4332] transition-colors">
              A R Green Garden
            </span>
            <span className="text-[9px] font-mono text-[#1B4332] font-semibold tracking-[0.2em] uppercase block mt-0.5">
              Studio ERP Control
            </span>
          </div>
        </Link>

        {/* Close Button on Mobile Drawer */}
        {isMobileView && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#1C1917] flex items-center justify-center text-sm cursor-pointer transition-colors focus:outline-none"
            aria-label="Close Sidebar"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. Scrollable Navigation Menu */}
      <div className="flex flex-col gap-3.5 flex-grow overflow-y-auto pr-1 custom-scrollbar">
        {menuSections.map((sec, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            <p className="text-[9px] uppercase font-mono font-bold tracking-[0.25em] text-[#78716C] px-3 mb-1">
              {sec.sectionTitle}
            </p>
            <nav className="flex flex-col gap-0.5">
              {sec.items.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <div key={tab.id} className="relative flex items-center w-full">
                    {isSelected && (
                      <div className="absolute left-0 w-1 h-5 bg-[#1B4332] rounded-r-md"></div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleTabClick(tab.id)}
                      className={`flex items-center gap-2.5 w-full py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isSelected
                          ? "text-white bg-[#1B4332] shadow-sm shadow-[#1B4332]/25 font-bold"
                          : "text-[#1C1917]/80 hover:text-[#1C1917] hover:bg-black/[0.04]"
                      }`}
                    >
                      <span className={`shrink-0 transition-colors ${isSelected ? "text-[#D8F3DC]" : "text-[#78716C]"}`}>
                        {tab.icon}
                      </span>
                      <span className="flex-grow text-left truncate">{tab.label}</span>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          isSelected ? "bg-white text-[#1B4332]" : "bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]/60"
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* 3. Bottom Links & Admin Profile Card */}
      <div className="mt-auto pt-3 border-t border-[#E7E5E4] flex flex-col gap-2">
        {/* Quick Landing Page Portal Link */}
        <Link
          href="/"
          className="flex items-center justify-between py-2 px-3 rounded-xl bg-white hover:bg-stone-50 text-[#1C1917] border border-[#E7E5E4] text-xs font-mono tracking-wider transition-all shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>🌐</span>
            <span>ল্যান্ডিং পেজ দেখুন</span>
          </div>
          <span className="text-[11px] text-[#1B4332] group-hover:translate-x-0.5 transition-transform">➔</span>
        </Link>

        {/* Super Admin Info Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#E7E5E4] shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#1B4332] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
              {sessionData?.user?.name ? sessionData.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-mono tracking-wider text-[#1B4332] font-bold leading-none">Super Admin</p>
              <p className="text-xs font-bold text-[#1C1917] mt-0.5 truncate">{sessionData?.user?.name || "Rahman Khan"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="text-[#78716C] hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-stone-100 cursor-pointer text-xs"
            title="Log Out"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ================= 1. DESKTOP PERMANENT SIDEBAR (Laptop & Large Screens) ================= */}
      <aside className="hidden md:flex md:w-[270px] bg-[#F4F3EE] text-[#1C1917] flex-col px-3.5 py-5 sticky top-0 h-screen shrink-0 shadow-xs border-r border-[#E7E5E4] z-20 font-sans">
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
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 cursor-pointer ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Left Slide-out Drawer Container */}
        <aside
          className={`relative w-[300px] max-w-[85vw] h-full bg-[#F4F3EE] text-[#1C1917] flex flex-col px-4 py-5 shadow-2xl border-r border-[#E7E5E4] z-10 transition-transform duration-300 ease-out font-sans ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarContent(true)}
        </aside>
      </div>
    </>
  );
}
