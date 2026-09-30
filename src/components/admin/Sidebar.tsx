"use client";

import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sessionData?: any;
  inboxCount?: number;
}

export default function Sidebar({ activeTab, setActiveTab, sessionData, inboxCount = 0 }: SidebarProps) {
  // Navigation Menu matching the admin.png screenshot and 10-step masterplan
  const menuSections: {
    sectionTitle: string;
    items: { id: string; label: string; icon: React.ReactNode; badge?: number; highlight?: boolean }[];
  }[] = [
    {
      sectionTitle: "Overview & Analytics",
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
      sectionTitle: "Core Operations (ধাপ ৪ - ১০)",
      items: [
        {
          id: "design-requests",
          label: "Design Requests (ধাপ ৪)",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="12 8 8 12 12 16 16 12 12 8" />
            </svg>
          ),
        },
        {
          id: "tree-doctor",
          label: "Tree Doctor & Health (ধাপ ৫-৬)",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
          ),
        },
        {
          id: "employees",
          label: "Employees & Attendance (ধাপ ৭)",
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
          label: "Projects & Scheduling (ধাপ ৮)",
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
          label: "Quotes, Stock & P&L (ধাপ ৯)",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          ),
        },
        {
          id: "service-card",
          label: "Digital Service Card (ধাপ ১০)",
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
      sectionTitle: "Website & Content",
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
          label: "Services Catalog",
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
          label: "Projects Gallery",
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
          label: "Reviews & Ratings",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ),
        },
        {
          id: "careers",
          label: "Messages & Applications",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          ),
          badge: inboxCount,
        },
        {
          id: "settings",
          label: "System Settings",
          icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-[260px] bg-[#06120c] text-white flex flex-col px-3.5 py-6 md:sticky md:top-0 md:h-screen shrink-0 shadow-2xl border-r border-white/5 z-20">
      {/* Brand/Logo */}
      <div className="flex items-center gap-3 px-3 py-1 mb-6">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-800 shadow-md">
          <svg className="w-5 h-5 text-[#8fc63f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <span className="font-sans font-bold text-[14px] text-white tracking-wide block leading-none">
            A R Green Garden
          </span>
          <span className="text-[9px] text-[#91cd3d] font-semibold tracking-wider uppercase mt-1 block">
            Master ERP Control
          </span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex flex-col gap-4 flex-grow overflow-y-auto pr-1 custom-scrollbar">
        {menuSections.map((sec, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <p className="text-[9px] uppercase font-bold tracking-wider text-white/30 px-3 mb-1">
              {sec.sectionTitle}
            </p>
            <nav className="flex flex-col gap-0.5">
              {sec.items.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <div key={tab.id} className="relative flex items-center w-full">
                    {isSelected && (
                      <div className="absolute left-0 w-1 h-5 bg-[#91cd3d] rounded-r-md"></div>
                    )}
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2.5 w-full py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                        isSelected
                          ? "text-[#91cd3d] font-bold bg-white/5"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className={`shrink-0 ${isSelected ? "text-[#91cd3d]" : "text-white/50"}`}>
                        {tab.icon}
                      </span>
                      <span className="flex-grow text-left truncate">{tab.label}</span>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="bg-[#91cd3d] text-[#0c1911] text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
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

      {/* Super Admin Bottom Card */}
      <div className="mt-auto border-t border-white/10 pt-3 flex items-center gap-3 px-2">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#91cd3d]/30 flex items-center justify-center bg-emerald-800 text-[#91cd3d] font-bold text-xs shrink-0">
          R
        </div>
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold leading-none">Super Admin:</p>
          <p className="text-xs font-bold text-white mt-0.5 truncate">{sessionData?.user?.name || "Rahman Khan"}</p>
        </div>
      </div>
    </aside>
  );
}
