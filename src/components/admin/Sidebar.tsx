"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  tag: string;
  iconEmoji: string;
  title: string;
  subtitle: string;
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

  // Search filter query
  const [searchQuery, setSearchQuery] = useState("");

  // Independent section collapse state: ALL sections are OPEN by default!
  // Expanding or collapsing one NEVER affects any other section (real-world modern sidebar system).
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    group_overview: true,
    group_portfolio: true,
    group_operations: true,
    group_studio: true,
    group_settings: true,
  });

  const toggleSection = (groupId: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const expandAll = () => {
    setOpenSections({
      group_overview: true,
      group_portfolio: true,
      group_operations: true,
      group_studio: true,
      group_settings: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      group_overview: false,
      group_portfolio: false,
      group_operations: false,
      group_studio: false,
      group_settings: false,
    });
  };

  // Navigation Menu Groups with clear section separation
  const menuGroups: MenuGroup[] = useMemo(
    () => [
      {
        id: "group_overview",
        tag: "01",
        iconEmoji: "📊",
        title: "OVERVIEW & INSIGHTS",
        subtitle: "ড্যাশবোর্ড অ্যানালিটিক্স ও ইনবক্স",
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
        tag: "02",
        iconEmoji: "🏛️",
        title: "PORTFOLIO & SHOWCASE",
        subtitle: "প্রজেক্ট, গ্যালারি ও পাবলিকেশন",
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
        tag: "03",
        iconEmoji: "🌿",
        title: "SERVICES & OPERATIONS",
        subtitle: "ল্যান্ডস্কেপিং, বুকিং ও কেয়ার",
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
        tag: "04",
        iconEmoji: "👥",
        title: "STUDIO ERP & TEAM",
        subtitle: "টিম মেম্বার, ক্যারিয়ার ও ফাইন্যান্স",
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
        tag: "05",
        iconEmoji: "⚙️",
        title: "WEBSITE STUDIO & SETTINGS",
        subtitle: "হোমপেজ এডিটর, রোল ও সিকিউরিটি",
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
    ],
    [
      unreadMsgCount,
      pendingReviewCount,
      pendingBookingCount,
      newDesignCount,
      newCareerCount,
      pendingCommentCount,
    ]
  );

  // Filter groups and items by search query and RBAC
  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return menuGroups
      .map((group) => {
        const matchingItems = group.items.filter((item) => {
          if (!canAccessTab(user?.role, item.id)) return false;
          if (!q) return true;
          return (
            item.labelBn.toLowerCase().includes(q) ||
            item.labelEn.toLowerCase().includes(q) ||
            item.id.toLowerCase().includes(q) ||
            group.title.toLowerCase().includes(q) ||
            group.subtitle.toLowerCase().includes(q)
          );
        });
        return {
          ...group,
          items: matchingItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [menuGroups, searchQuery, user?.role]);

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
    // Real-world behavior:
    // Does NOT close drawer automatically so the user can easily explore and switch sections!
    // The user has a prominent "Close Menu" button and background overlay tap to close whenever ready.
  };

  const renderSidebarContent = (isMobileView = false) => (
    <div className="flex flex-col h-full min-h-0 select-none">
      
      {/* ── 1. HEADER: BRAND & ARCHITECTURAL BADGE ── */}
      <div className="space-y-3 pb-3 border-b border-[#D6D2C4] shrink-0">
        <div className="flex items-center justify-between px-1">
          <Link
            href="/"
            className="group flex flex-col focus:outline-none cursor-pointer"
            title="A R Green Garden Public Home"
          >
            <span className="font-display font-light text-[17px] sm:text-[18px] tracking-[0.2em] uppercase text-[#121813] group-hover:text-[#2B4D33] transition-colors leading-tight">
              A R GREEN GARDEN
            </span>
            <span className="font-mono text-[9px] tracking-[0.26em] text-[#2B4D33] uppercase mt-0.5 font-semibold">
              LANDSCAPE ARCHITECTURE STUDIO
            </span>
          </Link>

          {/* Close Button on Mobile Drawer */}
          {isMobileView && (
            <button
              type="button"
              onClick={onClose}
              className="min-w-[42px] min-h-[42px] rounded-xl bg-black/5 hover:bg-black/10 active:scale-95 text-[#121813] flex items-center justify-center text-sm font-bold cursor-pointer transition-all focus:outline-none"
              aria-label="Close Sidebar"
              title="Close Drawer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Studio Practice Badge & Role Indicator */}
        <div className="bg-white/80 border border-[#D6D2C4] rounded-xl px-3 py-2 flex items-center justify-between text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2B4D33] animate-pulse"></span>
            <span className="font-mono text-[10px] tracking-wider uppercase text-[#121813] font-bold">
              Studio ERP v2.4
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2B4D33]/10 text-[#2B4D33] font-bold uppercase">
            {user?.role || "ADMIN"}
          </span>
        </div>

        {/* Search Bar for fast menu navigation */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="মেনু বা পেজ খুঁজুন... / Search..."
            className="w-full h-8.5 pl-8 pr-7 text-xs bg-white/90 border border-[#D6D2C4] rounded-xl text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] focus:ring-1 focus:ring-[#2B4D33] transition-all"
          />
          <svg
            className="w-3.5 h-3.5 text-[#75787B] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black/10 hover:bg-black/20 text-[#121813] flex items-center justify-center text-[10px] cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Section Quick Controls */}
        <div className="flex items-center justify-between px-1 text-[10px] font-mono text-[#75787B]">
          <span className="uppercase tracking-wider font-semibold">
            {searchQuery ? `ফলাফল (${filteredGroups.length} সেকশন)` : `সেকশন তালিকা (${filteredGroups.length})`}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-[#2B4D33] font-medium cursor-pointer transition-colors"
              title="সব সেকশন খুলুন"
            >
              সব দেখান [+]
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-[#2B4D33] font-medium cursor-pointer transition-colors"
              title="সব সেকশন সংক্ষেপ করুন"
            >
              সংক্ষেপ [-]
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. SCROLLABLE NAVIGATION MENU: CLEARLY ORGANIZED SECTION CARDS ── */}
      <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto pr-1 py-2 custom-scrollbar my-1">
        {filteredGroups.length === 0 ? (
          <div className="bg-white/80 border border-dashed border-[#D6D2C4] rounded-2xl p-6 text-center text-xs text-[#75787B] my-4 flex flex-col items-center gap-2">
            <span className="text-2xl">🔍</span>
            <p className="font-semibold text-[#121813]">কোনো মেনু আইটেম পাওয়া যায়নি</p>
            <p className="text-[11px]">অন্য কোনো কি-ওয়ার্ড দিয়ে আবার চেষ্টা করুন।</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-2 text-[11px] font-mono font-bold text-[#2B4D33] underline cursor-pointer"
            >
              সার্চ ফিল্টার রিসেট করুন
            </button>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const hasActiveItem = group.items.some((i) => i.id === activeTab);
            // If searching, keep section open; otherwise use individual section state (default true)
            const isSectionOpen = searchQuery ? true : (openSections[group.id] ?? true);

            return (
              <div
                key={group.id}
                className={`rounded-2xl transition-all duration-200 border ${
                  hasActiveItem
                    ? "bg-white/95 border-[#2B4D33]/40 shadow-sm ring-1 ring-[#2B4D33]/15"
                    : "bg-white/75 hover:bg-white/90 border-[#D6D2C4]/80 shadow-2xs"
                } overflow-hidden`}
              >
                {/* ── Section Header Bar ── */}
                <div
                  onClick={() => toggleSection(group.id)}
                  className={`px-3 py-2.5 flex items-center justify-between cursor-pointer transition-colors select-none ${
                    hasActiveItem
                      ? "bg-[#2B4D33]/[0.07] border-b border-[#2B4D33]/15"
                      : "bg-black/[0.02] border-b border-[#D6D2C4]/60 hover:bg-black/[0.04]"
                  }`}
                  title={`${group.title} (ক্লিক করে সেকশনটি খুলুন বা বন্ধ করুন)`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded tracking-wider shrink-0 ${
                        hasActiveItem
                          ? "bg-[#2B4D33] text-white shadow-xs"
                          : "bg-[#D6D2C4] text-[#121813]"
                      }`}
                    >
                      {group.tag}
                    </span>
                    <span className="text-sm shrink-0">{group.iconEmoji}</span>
                    <div className="flex flex-col min-w-0">
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider truncate leading-tight ${
                          hasActiveItem ? "text-[#2B4D33]" : "text-[#121813]"
                        }`}
                      >
                        {group.title}
                      </span>
                      <span className="text-[9px] font-sans text-[#75787B] truncate leading-tight mt-0.5">
                        {group.subtitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    <span
                      className={`text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded-full ${
                        hasActiveItem
                          ? "bg-[#2B4D33]/15 text-[#2B4D33]"
                          : "bg-black/[0.05] text-[#75787B]"
                      }`}
                    >
                      {group.items.length}
                    </span>
                    <span
                      className={`w-5 h-5 flex items-center justify-center text-[#75787B] hover:text-[#121813] transition-transform duration-200 ${
                        isSectionOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* ── Section Menu Items ── */}
                {isSectionOpen && (
                  <nav className="p-1.5 flex flex-col gap-1">
                    {group.items.map((tab) => {
                      const isSelected = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => handleTabClick(tab.id)}
                          className={`w-full min-h-[42px] px-2.5 py-2 rounded-xl text-left flex items-center justify-between transition-all duration-150 cursor-pointer group ${
                            isSelected
                              ? "bg-[#2B4D33] text-white shadow-sm font-semibold"
                              : "text-[#2A2E2B] hover:bg-black/[0.05] hover:text-[#121813]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-black/[0.04] text-[#75787B] group-hover:text-[#2B4D33] group-hover:bg-white border border-black/[0.04]"
                              }`}
                            >
                              {tab.icon}
                            </span>
                            <div className="flex flex-col min-w-0 truncate">
                              <span
                                className={`text-xs truncate leading-snug ${
                                  isSelected ? "text-white font-bold" : "text-[#121813] font-medium"
                                }`}
                              >
                                {tab.labelBn}
                              </span>
                              <span
                                className={`text-[9px] font-mono truncate leading-none mt-0.5 ${
                                  isSelected ? "text-emerald-100" : "text-[#75787B]"
                                }`}
                              >
                                {tab.labelEn}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {tab.badge !== undefined && (
                              <span
                                className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  isSelected
                                    ? "bg-white text-[#2B4D33]"
                                    : typeof tab.badge === "number"
                                    ? "bg-[#C85A32] text-white animate-pulse"
                                    : "bg-[#2B4D33]/15 text-[#2B4D33]"
                                }`}
                              >
                                {tab.badge}
                              </span>
                            )}
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── 3. BOTTOM: USER PROFILE, PORTAL LINK & MOBILE CLOSE ── */}
      <div className="pt-2.5 border-t border-[#D6D2C4] flex flex-col gap-2 shrink-0">
        {/* Public Website Link */}
        <Link
          href="/"
          className="min-h-[40px] flex items-center justify-between py-2 px-3 rounded-xl bg-white/80 hover:bg-white text-[#121813] border border-[#D6D2C4] text-xs font-mono tracking-wider transition-all shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>🌐</span>
            <span className="font-sans font-medium text-xs">ওয়েবসাইটে ফিরে যান</span>
          </div>
          <span className="text-[11px] text-[#2B4D33] group-hover:translate-x-0.5 transition-transform">➔</span>
        </Link>

        {/* User Card & Logout */}
        <div className="min-h-[42px] flex items-center justify-between p-2 rounded-xl bg-white/90 border border-[#D6D2C4] shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#2B4D33] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
              {sessionData?.user?.name ? sessionData.user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase font-mono tracking-wider text-[#2B4D33] font-bold leading-none truncate">
                {user?.role || "STUDIO DIRECTOR"}
              </p>
              <p className="text-xs font-bold text-[#121813] mt-0.5 truncate">
                {sessionData?.user?.name || "Admin User"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => logout()}
            className="w-8 h-8 flex items-center justify-center text-[#75787B] hover:text-rose-600 transition-colors rounded-lg hover:bg-stone-100 cursor-pointer text-xs"
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

        {/* Mobile-only: Close Drawer Action Button */}
        {isMobileView && (
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-[#2B4D33] hover:bg-[#355f3f] active:scale-[0.99] text-white text-xs font-semibold font-sans cursor-pointer transition-all shadow-sm"
          >
            <span>✕</span>
            <span>মেনু বন্ধ করে ড্যাশবোর্ডে দেখুন</span>
          </button>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* ================= 1. DESKTOP PERMANENT SIDEBAR ================= */}
      <aside className="hidden md:flex md:w-[295px] lg:w-[305px] bg-[#E4E2D7] text-[#323232] flex-col px-3.5 py-4 sticky top-0 h-screen shrink-0 shadow-sm border-r border-[#D6D2C4] z-20 font-sans">
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
          className={`relative w-[320px] max-w-[88vw] h-full bg-[#E4E2D7] text-[#323232] flex flex-col px-3.5 py-4 shadow-2xl border-r border-[#D6D2C4] z-10 transition-transform duration-300 ease-out font-sans ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {renderSidebarContent(true)}
        </aside>
      </div>
    </>
  );
}
