"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { canAccessTab } from "@/lib/rbac";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sessionData?: any;
  inboxCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

interface MenuItem {
  id: string;
  labelBn: string;
  labelEn: string;
  icon: React.ReactNode;
  badge?: number | string;
}

interface MenuGroup {
  id: string;
  title: string;
  items: MenuItem[];
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sessionData,
  inboxCount = 0,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const { user, logout } = useAuth();

  // Lightweight counts fetched from /api/admin/counts for real-time notification badges
  const [counts, setCounts] = useState<{
    unreadMessages?: number;
    pendingReviews?: number;
    pendingBookings?: number;
    newDesignRequests?: number;
    newCareerApps?: number;
    pendingComments?: number;
  }>({});

  useEffect(() => {
    let active = true;
    const fetchCounts = async () => {
      if (typeof document !== "undefined" && document.hidden) return;
      try {
        const res = await fetch("/api/admin/counts");
        if (res.ok && active) {
          const data = await res.json();
          setCounts(data);
        }
      } catch {
        // Silently ignore background polling errors
      }
    };
    fetchCounts();
    const timer = setInterval(fetchCounts, 90000);
    const handleVisibility = () => {
      if (!document.hidden && active) fetchCounts();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      active = false;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Compute live badge counts
  const unreadMsgCount = counts.unreadMessages !== undefined ? counts.unreadMessages : inboxCount;
  const pendingReviewCount = counts.pendingReviews || 0;
  const pendingBookingCount = counts.pendingBookings || 0;
  const newDesignCount = counts.newDesignRequests || 0;
  const newCareerCount = counts.newCareerApps || 0;
  const pendingCommentCount = counts.pendingComments || 0;

  // Navigation Menu Groups ordered strictly per requirement
  const menuGroups: MenuGroup[] = [
    {
      id: "group_overview",
      title: "1. OVERVIEW & INSIGHTS",
      items: [
        {
          id: "analytics",
          labelBn: "ড্যাশবোর্ড ওভারভিউ",
          labelEn: "Dashboard Overview",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          ),
        },
        {
          id: "messages",
          labelBn: "কন্টাক্ট ইনবক্স",
          labelEn: "Messages Inbox",
          badge: unreadMsgCount > 0 ? unreadMsgCount : undefined,
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          ),
        },
      ],
    },
    {
      id: "group_portfolio",
      title: "2. PORTFOLIO & SHOWCASE",
      items: [
        {
          id: "projects",
          labelBn: "প্রজেক্ট মাস্টারপ্ল্যান",
          labelEn: "Masterplans & Portfolio",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="1" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          ),
        },
        {
          id: "gallery",
          labelBn: "ফটো গ্যালারি",
          labelEn: "Visual Gallery Showcase",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="1" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          ),
        },
        {
          id: "reviews",
          labelBn: "গ্রাহক রিভিউ",
          labelEn: "Reviews Approval",
          badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
        },
        {
          id: "blogs",
          labelBn: "জার্নাল ও ব্লগ",
          labelEn: "Botanical Blogs & Journal",
          badge: pendingCommentCount > 0 ? pendingCommentCount : undefined,
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          ),
        },
      ],
    },
    {
      id: "group_operations",
      title: "3. SERVICES & OPERATIONS",
      items: [
        {
          id: "services",
          labelBn: "ল্যান্ডস্কেপ সার্ভিসেস",
          labelEn: "Landscape Services",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          ),
        },
        {
          id: "design-requests",
          labelBn: "ডিজাইন কমিশন",
          labelEn: "Design Commissions & Quotes",
          badge: newDesignCount > 0 ? newDesignCount : undefined,
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 8 8 12 12 16 16 12 12 8" />
            </svg>
          ),
        },
        {
          id: "bookings",
          labelBn: "ক্লায়েন্ট বুকিং",
          labelEn: "Bookings & Site Visits",
          badge: pendingBookingCount > 0 ? pendingBookingCount : undefined,
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          ),
        },
        {
          id: "tree-doctor",
          labelBn: "ট্রি ডক্টর ও ক্লিনিক",
          labelEn: "Tree Doctor & Urban Forest",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
          ),
        },
        {
          id: "maintenance",
          labelBn: "বোটানিক্যাল মেইনটেনেন্স",
          labelEn: "Maintenance Schedules",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          ),
        },
        {
          id: "service-card",
          labelBn: "ডিজিটাল সার্ভিস কার্ড",
          labelEn: "Digital Service Card (NFC)",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="1" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          ),
        },
      ],
    },
    {
      id: "group_studio",
      title: "4. STUDIO ERP & TEAM",
      items: [
        {
          id: "employees",
          labelBn: "আর্কিটেক্ট ও সাইট স্টাফ",
          labelEn: "Staff & Architects Directory",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        },
        {
          id: "careers",
          labelBn: "ক্যারিয়ার ও আবেদনপত্র",
          labelEn: "Careers & Candidate CVs",
          badge: newCareerCount > 0 ? newCareerCount : undefined,
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          ),
        },
        {
          id: "finance",
          labelBn: "ফাইন্যান্স ও ইনভেন্টরি",
          labelEn: "Studio Accounts & P&L",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          ),
        },
      ],
    },
    {
      id: "group_settings",
      title: "5. WEBSITE STUDIO & SETTINGS",
      items: [
        {
          id: "header-nav",
          labelBn: "হেডার ও নেভবার",
          labelEn: "Header & Navbar Studio",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="21" x2="9" y2="9" />
            </svg>
          ),
        },
        {
          id: "hero",
          labelBn: "হিরো ও ভিডিও স্টুডিও",
          labelEn: "Hero & Cinematic Studio",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ),
        },
        {
          id: "homepage-sections",
          labelBn: "হোমপেজ সেকশন (DnD)",
          labelEn: "Homepage Sections Reorder",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          ),
        },
        {
          id: "content-manager",
          labelBn: "কনটেন্ট ম্যানেজার",
          labelEn: "Content Manager (Dynamic)",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          ),
        },
        {
          id: "settings",
          labelBn: "মাস্টার সেটিংস হাব",
          labelEn: "Master Settings (A-Z Hub)",
          badge: "A-Z",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
        {
          id: "users",
          labelBn: "ইউজার ম্যানেজমেন্ট",
          labelEn: "User Accounts & Roles",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          ),
        },
        {
          id: "security",
          labelBn: "সিকিউরিটি ও অ্যাক্সেস",
          labelEn: "Security Credentials",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ),
        },
        {
          id: "roles",
          labelBn: "রোল পারমিশন ম্যাট্রিক্স",
          labelEn: "Role Matrix (Read-Only)",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          ),
        },
        {
          id: "activity-logs",
          labelBn: "অ্যাক্টিভিটি ও অডিট লগ",
          labelEn: "Activity & Audit Trail",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          ),
        },
      ],
    },
  ];

  // Groups are always expanded — no collapse state needed

  // Prevent background scroll when mobile drawer is open
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
    // DO NOT close drawer on mobile — user should freely navigate all sections
    // The drawer has its own Close button (X and bottom button)
  };

  const handleGroupHeaderClick = (group: MenuGroup) => {
    // Clicking a group header navigates to its first accessible item
    const firstItem = group.items.find((i) => canAccessTab(user?.role, i.id));
    if (firstItem) {
      handleTabClick(firstItem.id);
    }
  };

  const renderSidebarContent = (isMobileView = false) => (
    <div className="flex flex-col h-full min-h-0 select-none">
      
      {/* 1. Header / Architectural Logo */}
      <div className="space-y-4 pb-4 border-b border-[#D6D2C4] shrink-0">
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="group flex flex-col focus:outline-none cursor-pointer"
            title="A R Green Garden Public Home"
          >
            <span className="font-display font-light text-[17px] sm:text-[19px] tracking-[0.22em] uppercase text-[#121813] group-hover:text-[#2B4D33] transition-colors leading-tight">
              A R GREEN GARDEN
            </span>
            <span className="font-mono text-[9px] tracking-[0.28em] text-[#2B4D33] uppercase mt-1 font-semibold">
              LANDSCAPE ARCHITECTURE STUDIO
            </span>
          </Link>

          {/* Close Button on Mobile Drawer (Minimum 44px touch target) */}
          {isMobileView && (
            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] rounded-xl bg-black/5 hover:bg-black/10 text-[#121813] flex items-center justify-center text-sm cursor-pointer transition-colors focus:outline-none"
              aria-label="Close Sidebar"
              title="Close Drawer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Studio Practice Badge */}
        <div className="bg-white/70 border border-[#D6D2C4] rounded-xl px-3 py-2 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2B4D33] animate-pulse"></span>
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#121813] font-bold">
              Studio ERP Active
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#75787B]">
            {user?.role || "ADMIN"}
          </span>
        </div>
      </div>

      {/* 2. Scrollable Navigation Menu — Always Expanded Groups */}
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar my-3">
        {menuGroups.map((group) => {
          // Filter items based strictly on RBAC
          const visibleItems = group.items.filter((tab) => canAccessTab(user?.role, tab.id));
          if (visibleItems.length === 0) return null;

          const hasActiveItem = visibleItems.some((i) => i.id === activeTab);

          return (
            <div key={group.id} className="flex flex-col">
              
              {/* Group Label — clickable, navigates to first item, never collapses */}
              <button
                type="button"
                onClick={() => handleGroupHeaderClick(group)}
                className={`flex items-center justify-between px-2 py-1.5 mb-1 rounded-lg transition-colors cursor-pointer text-left group ${
                  hasActiveItem ? "text-[#2B4D33]" : "text-[#75787B] hover:text-[#4A4D50]"
                }`}
                title={`Go to ${group.title}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                    hasActiveItem ? "bg-[#2B4D33]" : "bg-[#D6D2C4] group-hover:bg-[#75787B]"
                  }`} />
                  <span className="text-[10px] uppercase font-mono font-bold tracking-[0.18em] truncate">
                    {group.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#D6D2C4] shrink-0">
                  {visibleItems.length}
                </span>
              </button>

              {/* Group Items — always visible, no collapse */}
              <nav className="flex flex-col gap-0.5 pl-1">
                {visibleItems.map((tab) => {
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleTabClick(tab.id)}
                      className={`min-h-[40px] flex items-center justify-between w-full py-2 px-3 rounded-xl text-xs tracking-wide transition-all cursor-pointer ${
                        isSelected
                          ? "text-white bg-[#2B4D33] font-semibold shadow-xs"
                          : "text-[#323232] hover:text-[#121813] hover:bg-black/[0.05]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate min-w-0">
                        <span className={`shrink-0 transition-colors ${isSelected ? "text-emerald-200" : "text-[#75787B]"}`}>
                          {tab.icon}
                        </span>
                        <div className="flex flex-col text-left truncate min-w-0">
                          <span className="truncate leading-snug">{tab.labelBn}</span>
                          <span className={`text-[9px] font-mono truncate leading-none mt-0.5 ${
                            isSelected ? "text-emerald-100/75" : "text-[#75787B]"
                          }`}>
                            {tab.labelEn}
                          </span>
                        </div>
                      </div>

                      {tab.badge !== undefined && (
                        <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                          isSelected ? "bg-white text-[#2B4D33]" : "bg-[#C85A32] text-white"
                        }`}>
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* 3. Bottom: Profile + Close Button (mobile) + Portal Link */}
      <div className="pt-3 border-t border-[#D6D2C4] flex flex-col gap-2 shrink-0">
        {/* Public Landing Page Link */}
        <Link
          href="/"
          className="min-h-[44px] flex items-center justify-between py-2 px-3 rounded-xl bg-white hover:bg-stone-50 text-[#121813] border border-[#D6D2C4] text-xs font-mono tracking-wider transition-all shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>🌐</span>
            <span>ওয়েবসাইটে ফিরে যান</span>
          </div>
          <span className="text-[11px] text-[#2B4D33] group-hover:translate-x-0.5 transition-transform">➔</span>
        </Link>

        {/* User Card & Logout */}
        <div className="min-h-[44px] flex items-center justify-between p-2 rounded-xl bg-white/80 border border-[#D6D2C4] shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#2B4D33] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
              {sessionData?.user?.name ? sessionData.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-mono tracking-wider text-[#2B4D33] font-bold leading-none truncate">
                {user?.role || "STUDIO DIRECTOR"}
              </p>
              <p className="text-xs font-bold text-[#121813] mt-0.5 truncate">{sessionData?.user?.name || "Admin User"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#75787B] hover:text-rose-600 transition-colors rounded-lg hover:bg-stone-100 cursor-pointer text-xs"
            title="Log Out"
            aria-label="Log Out"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>

        {/* Mobile-only: Close Drawer Button */}
        {isMobileView && (
          <button
            type="button"
            onClick={onClose}
            className="min-h-[48px] w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B4D33] text-white text-sm font-semibold font-sans cursor-pointer hover:bg-[#3a6645] transition-colors shadow-sm"
          >
            <span>✕</span>
            <span>মেনু বন্ধ করুন</span>
          </button>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* ================= 1. DESKTOP PERMANENT SIDEBAR ================= */}
      <aside className="hidden md:flex md:w-[285px] bg-[#E4E2D7] text-[#323232] flex-col px-3.5 py-4 sticky top-0 h-screen shrink-0 shadow-sm border-r border-[#D6D2C4] z-20 font-sans">
        {renderSidebarContent(false)}
      </aside>

      {/* ================= 2. MOBILE & TABLET SLIDE-IN DRAWER ================= */}
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
          className={`relative w-[310px] max-w-[85vw] h-full bg-[#E4E2D7] text-[#323232] flex flex-col px-4 py-5 shadow-2xl border-r border-[#D6D2C4] z-10 transition-transform duration-300 ease-out font-sans ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarContent(true)}
        </aside>
      </div>
    </>
  );
}
