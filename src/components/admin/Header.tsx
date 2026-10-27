"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface HeaderProps {
  setActiveTab: (tab: string) => void;
  setEditingService: (service: any) => void;
  fetchData: () => void;
  onToggleSidebar?: () => void;
  activeTab?: string;
}

interface NotificationItem {
  id: string;
  userId?: string | null;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

const TAB_TITLES: Record<string, { bn: string; en: string }> = {
  analytics: { bn: "ড্যাশবোর্ড ওভারভিউ", en: "Overview" },
  messages: { bn: "কন্টাক্ট ইনবক্স", en: "Inbox" },
  projects: { bn: "প্রজেক্ট মাস্টারপ্ল্যান", en: "Projects" },
  gallery: { bn: "ফটো গ্যালারি", en: "Gallery" },
  reviews: { bn: "গ্রাহক রিভিউ", en: "Reviews" },
  blogs: { bn: "জার্নাল ও ব্লগ", en: "Blogs" },
  services: { bn: "ল্যান্ডস্কেপ সার্ভিসেস", en: "Services" },
  "design-requests": { bn: "ডিজাইন কমিশন", en: "Clients" },
  bookings: { bn: "ক্লায়েন্ট বুকিং", en: "Bookings" },
  "tree-doctor": { bn: "ট্রি ডক্টর ও ক্লিনিক", en: "Tree Doctor" },
  maintenance: { bn: "বোটানিক্যাল কেয়ার", en: "Maintenance" },
  "service-card": { bn: "ডিজিটাল সার্ভিস কার্ড", en: "Service Card" },
  employees: { bn: "আর্কিটেক্ট ও স্টাফ", en: "Employees" },
  careers: { bn: "ক্যারিয়ার ও আবেদন", en: "Careers" },
  finance: { bn: "স্টুডিও ফাইন্যান্স", en: "Finance" },
  "header-nav": { bn: "হেডার ও নেভবার", en: "Navbar" },
  hero: { bn: "হিরো ভিডিও স্টুডিও", en: "Hero Studio" },
  "homepage-sections": { bn: "হোমপেজ সেকশন", en: "Sections" },
  "content-manager": { bn: "কনটেন্ট ম্যানেজার", en: "Content" },
  content: { bn: "কনটেন্ট হাব", en: "Content Hub" },
  settings: { bn: "মাস্টার সেটিংস হাব", en: "Settings" },
  users: { bn: "ইউজার অ্যাকাউন্টস", en: "Users" },
  security: { bn: "সিকিউরিটি অ্যাক্সেস", en: "Security" },
  roles: { bn: "রোল পারমিশন", en: "Roles" },
  "activity-logs": { bn: "অ্যাক্টিভিটি ও অডিট লগ", en: "Audit Logs" },
};

function formatTimeAgoBn(dateString: string): string {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return "এইমাত্র";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} মি. আগে`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour} ঘণ্টা আগে`;
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay === 1) return "গতকাল";
    if (diffDay < 7) return `${diffDay} দিন আগে`;
    return new Date(dateString).toLocaleDateString("bn-BD");
  } catch {
    return "";
  }
}

export default function Header({
  setActiveTab,
  setEditingService,
  fetchData,
  onToggleSidebar,
  activeTab = "analytics",
}: HeaderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [overflowOpen, setOverflowOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from /api/notifications
  const fetchNotifications = async () => {
    if (typeof document !== "undefined" && document.hidden) return;
    try {
      const res = await fetch("/api/notifications?limit=30", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(typeof data.unreadCount === "number" ? data.unreadCount : 0);
      }
    } catch {
      // Silently ignore polling network errors
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Smart visibility-aware polling every 90s, plus instant refresh on tab focus
    const interval = setInterval(fetchNotifications, 90000);
    const handleVisibility = () => {
      if (!document.hidden) fetchNotifications();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Handle click outside to dismiss notification popover and overflow menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setOverflowOpen(false);
      }
    };
    if (isOpen || overflowOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, overflowOpen]);

  // Mark all notifications as read
  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    } finally {
      setMarkingAll(false);
    }
  };

  // Click on a notification: mark as read and navigate to tab
  const handleNotificationClick = async (item: NotificationItem) => {
    // 1. Mark as read on server if unread
    if (!item.isRead) {
      try {
        fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id, isRead: true }),
        });
        setNotifications((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (err) {
        console.error("Failed to mark single notification as read:", err);
      }
    }

    // 2. Navigate to appropriate tab based on link or type
    setIsOpen(false);
    const linkStr = (item.link || "").toLowerCase();
    const typeStr = (item.type || "").toUpperCase();

    if (linkStr === "bookings" || linkStr.includes("booking") || typeStr.includes("BOOKING")) {
      setActiveTab("bookings");
    } else if (linkStr === "messages" || linkStr.includes("message") || typeStr.includes("MESSAGE")) {
      setActiveTab("messages");
    } else if (
      linkStr === "design-requests" ||
      linkStr === "design_requests" ||
      linkStr.includes("design") ||
      typeStr.includes("REQUEST")
    ) {
      setActiveTab("design-requests");
    } else if (
      linkStr === "tree-doctor" ||
      linkStr === "tree_doctor" ||
      linkStr.includes("tree") ||
      typeStr.includes("TREE_DOCTOR")
    ) {
      setActiveTab("tree-doctor");
    } else if (linkStr === "careers" || linkStr.includes("career") || typeStr.includes("CAREER")) {
      setActiveTab("careers");
    } else if (linkStr === "reviews" || linkStr.includes("review") || typeStr.includes("REVIEW")) {
      setActiveTab("reviews");
    } else if (linkStr === "blogs" || linkStr.includes("blog") || linkStr.includes("comment")) {
      setActiveTab("blogs");
    } else if (item.link) {
      setActiveTab(item.link);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "TREE_DOCTOR_EMERGENCY":
        return "🚨";
      case "TREE_DOCTOR":
        return "🩺";
      case "REQUEST":
        return "📋";
      case "PROJECT":
        return "🌿";
      case "INFO":
        return "📩";
      default:
        return "🔔";
    }
  };

  return (
    <header className="h-14 lg:h-20 bg-[#F7F6F2]/95 backdrop-blur-md border-b border-[#D6D2C4] flex items-center justify-between px-3.5 sm:px-6 lg:px-8 sticky top-0 z-30 shrink-0 text-[#121813] font-sans">
      
      {/* Left: Mobile Hamburger Trigger + Dynamic Page Title (Mobile) / Studio Title (Desktop) */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
        {/* Mobile Hamburger Trigger (Minimum 44px touch target) */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-[#D6D2C4] text-[#121813] shadow-xs hover:bg-[#E4E2D7] active:scale-95 transition-all cursor-pointer focus:outline-none shrink-0"
          aria-label="Open Navigation Drawer"
          title="Open Menu Drawer"
        >
          <div className="flex flex-col gap-1 w-4.5">
            <span className="w-full h-[1.5px] bg-[#121813]"></span>
            <span className="w-full h-[1.5px] bg-[#121813]"></span>
            <span className="w-full h-[1.5px] bg-[#121813]"></span>
          </div>
        </button>

        {/* Dynamic Mobile Page Title (below lg) */}
        <div className="lg:hidden min-w-0 flex items-center gap-2 truncate">
          <h1 className="text-base sm:text-lg font-display font-bold text-[#121813] tracking-tight truncate leading-tight">
            {(TAB_TITLES[activeTab] || { bn: "ড্যাশবোর্ড", en: "Dashboard" }).bn}
          </h1>
          <span className="text-[10px] font-mono text-[#2B4D33] font-bold px-1.5 py-0.5 rounded-full bg-[#2B4D33]/10 hidden xs:inline-block shrink-0">
            {(TAB_TITLES[activeTab] || { bn: "ড্যাশবোর্ড", en: "Dashboard" }).en}
          </span>
        </div>

        {/* Full Desktop Architectural Header (lg and above, unchanged) */}
        <div className="hidden lg:block min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-light text-[#121813] tracking-[0.14em] uppercase leading-tight truncate">
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

      {/* Right: Notifications + Actions (Compact on mobile, full on desktop) */}
      <div className="flex items-center gap-2 shrink-0">
        
        {/* Notification Bell Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className={`min-h-[40px] min-w-[40px] lg:min-h-[44px] lg:min-w-[44px] px-2.5 lg:px-3 py-1.5 rounded-xl lg:rounded-full border transition-all flex items-center justify-center gap-1.5 relative cursor-pointer shadow-2xs ${
              isOpen || unreadCount > 0
                ? "bg-white border-[#2B4D33] text-[#2B4D33]"
                : "bg-white hover:bg-[#E4E2D7] border-[#D6D2C4] text-[#121813]"
            }`}
            title="নোটিফিকেশন সেন্টার"
            aria-label="Open Notifications"
            aria-expanded={isOpen}
          >
            <span className="text-base leading-none">🔔</span>
            <span className="hidden lg:inline text-xs font-mono font-semibold">বিজ্ঞপ্তি</span>
            
            {/* Unread Counter Badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] lg:h-5 lg:min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-600 text-[9px] lg:text-[10px] font-mono font-bold text-white shadow-sm animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Menu Modal */}
          {isOpen && (
            <div className="absolute right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 mt-2 w-[calc(100vw-24px)] sm:w-96 max-w-[400px] bg-[#FDFBF7] border border-[#D6D2C4] rounded-2xl shadow-2xl z-50 overflow-hidden font-sans animate-fade-in">
              {/* Popover Header */}
              <div className="px-4 py-3 bg-[#F4F1EA] border-b border-[#D6D2C4] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#121813]">
                    নোটিফিকেশন
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#2B4D33] text-white">
                      {unreadCount} অপঠিত
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    disabled={markingAll}
                    className="text-[11px] font-mono text-[#2B4D33] hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {markingAll ? "আপডেট হচ্ছে..." : "সব পঠিত করুন"}
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E4E2D7]">
                {notifications.length === 0 ? (
                  <div className="py-12 px-4 text-center">
                    <span className="text-3xl block mb-2 opacity-50">🌱</span>
                    <p className="text-xs font-mono text-[#75787B]">
                      বর্তমানে কোনো নোটিফিকেশন নেই
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNotificationClick(item)}
                      className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                        item.isRead
                          ? "hover:bg-[#F4F1EA]/80 opacity-75"
                          : "bg-white hover:bg-[#F2EFE9] font-medium"
                      } ${item.type === "TREE_DOCTOR_EMERGENCY" ? "border-l-4 border-l-rose-500" : ""}`}
                    >
                      <div className="text-xl shrink-0 mt-0.5 p-1.5 rounded-xl bg-[#F7F6F2] border border-[#D6D2C4]">
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-xs font-bold text-[#121813] truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] font-mono text-[#75787B] shrink-0">
                            {formatTimeAgoBn(item.createdAt)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4F5255] line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#2B4D33] shrink-0 mt-2"></span>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-2.5 bg-[#F4F1EA] border-t border-[#D6D2C4] text-center">
                <span className="text-[10px] font-mono text-[#75787B]">
                  ক্লিক করলে সংশ্লিষ্ট ড্যাশবোর্ড সেকশনে নিয়ে যাবে
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Overflow Menu Button (below lg) */}
        <div className="relative lg:hidden" ref={overflowRef}>
          <button
            type="button"
            onClick={() => setOverflowOpen((prev) => !prev)}
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
              overflowOpen
                ? "bg-[#2B4D33] text-white border-[#2B4D33]"
                : "bg-white hover:bg-[#E4E2D7] border-[#D6D2C4] text-[#121813]"
            }`}
            title="More Actions"
            aria-label="More Quick Actions"
            aria-expanded={overflowOpen}
          >
            <span className="text-lg leading-none font-bold">⋮</span>
          </button>

          {overflowOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-[#D6D2C4] rounded-2xl shadow-xl py-2 z-50 font-sans animate-fade-in text-xs divide-y divide-[#E4E2D7]/60">
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    fetchData();
                    setOverflowOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-[#F7F6F2] flex items-center gap-2.5 text-left text-[#121813] font-medium transition-colors cursor-pointer"
                >
                  <span className="text-sm text-[#2B4D33]">⟳</span>
                  <span>ডাটাবেস রিফ্রেশ</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("settings");
                    setOverflowOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-[#F7F6F2] flex items-center gap-2.5 text-left text-[#121813] font-medium transition-colors cursor-pointer"
                >
                  <span className="text-sm">⚙️</span>
                  <span>মাস্টার সেটিংস হাব</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("services");
                    setEditingService(null);
                    setOverflowOpen(false);
                  }}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-[#F7F6F2] flex items-center gap-2.5 text-left text-[#121813] font-medium transition-colors cursor-pointer"
                >
                  <span className="text-sm text-[#2B4D33] font-bold">+</span>
                  <span>নতুন কমিশন / সার্ভিস</span>
                </button>
              </div>

              <div className="p-1">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOverflowOpen(false)}
                  className="w-full px-3 py-2.5 rounded-xl hover:bg-[#F7F6F2] flex items-center justify-between text-left text-[#121813] font-medium transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">🌐</span>
                    <span>মূল ওয়েবসাইট দেখুন</span>
                  </div>
                  <span className="text-[10px] text-[#75787B]">➔</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Desktop-Only Action Buttons (lg and above, unchanged) */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Database Refresh */}
          <button 
            type="button"
            onClick={fetchData} 
            className="min-h-[44px] hover:text-[#121813] cursor-pointer text-xs font-mono font-semibold text-[#2B4D33] bg-white hover:bg-[#E4E2D7] px-3.5 py-1.5 rounded-full border border-[#D6D2C4] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
            title="Refresh database records"
          >
            <span>⟳</span>
            <span>রিফ্রেশ</span>
          </button>

          {/* Master Project Settings Hub Shortcut */}
          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className="min-h-[44px] hover:text-[#121813] cursor-pointer text-xs font-mono font-semibold text-[#121813] bg-white hover:bg-[#E4E2D7] px-3.5 py-1.5 rounded-full border border-[#D6D2C4] transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
            title="Master Project Settings (Facebook Hub A to Z)"
          >
            <span>⚙️</span>
            <span>সেটিংস হাব</span>
          </button>

          {/* New Commission / Service Action */}
          <button 
            type="button" 
            onClick={() => { setActiveTab("services"); setEditingService(null); }}
            className="min-h-[44px] bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono tracking-wider py-1.5 px-4 rounded-full flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0 font-medium"
          >
            <span>+</span>
            <span className="whitespace-nowrap text-xs">নতুন কমিশন</span>
          </button>

          {/* Direct Landing Page Link */}
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D6D2C4] bg-white hover:bg-[#E4E2D7] text-[#121813] text-xs font-mono transition-colors shrink-0 shadow-2xs cursor-pointer"
            title="Visit Home Page"
          >
            <span>🌐</span>
            <span>সাইট দেখুন</span>
          </Link>
        </div>

      </div>

    </header>
  );
}
