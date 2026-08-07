"use client";

import React from "react";

export default function Sidebar({ activeTab, setActiveTab, sessionData, inboxCount }) {
  // Navigation Menu matching the admin.png screenshot exactly
  const menuItems = [
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
      )
    },
    { 
      id: "users", 
      label: "User Management", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    { 
      id: "roles", 
      label: "Roles & Permissions", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      )
    },
    { 
      id: "content", 
      label: "Content Management", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      )
    },
    { 
      id: "services", 
      label: "Services", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="21 8 21 21 3 21 3 8" />
          <rect x="1" y="3" width="22" height="5" />
          <line x1="10" y1="12" x2="14" y2="12" />
        </svg>
      )
    },
    { 
      id: "projects", 
      label: "Projects", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      )
    },
    { 
      id: "gallery", 
      label: "Gallery", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )
    },
    { 
      id: "blogs", 
      label: "Blogs", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    { 
      id: "bookings", 
      label: "Booking Management", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )
    },
    { 
      id: "reviews", 
      label: "Review Management", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )
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
      badge: inboxCount
    },
    { 
      id: "settings", 
      label: "Settings", 
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <aside className="w-full md:w-[250px] bg-[#06120c] text-white flex flex-col px-4 py-6 md:sticky md:top-0 md:h-screen shrink-0 shadow-2xl border-r border-white/5 z-20">
      
      {/* Brand/Logo (AR Green Garden Style) */}
      <div className="flex items-center gap-3 px-3 py-2 mb-8">
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-emerald-800 shadow-md">
          <svg className="w-5 h-5 text-[#8fc63f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-sans font-bold text-[15px] text-white tracking-wide">A R Green Garden</span>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-col gap-1 flex-grow overflow-y-auto pr-1">
        <p className="text-[10px] uppercase font-bold tracking-wider text-white/20 px-3 mb-2">Menu</p>
        
        <nav className="flex flex-col gap-1">
          {menuItems.map(tab => {
            const isSelected = activeTab === tab.id;
            return (
              <div key={tab.id} className="relative flex items-center w-full">
                {isSelected && (
                  <div className="absolute left-0 w-1 h-6 bg-[#91cd3d] rounded-r-md"></div>
                )}
                <button
                  type="button"
                  onClick={() => { setActiveTab(tab.id); }}
                  className={`flex items-center gap-3 w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isSelected
                      ? "text-[#91cd3d] font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className={`shrink-0 ${isSelected ? "text-[#91cd3d]" : "text-white/50"}`}>{tab.icon}</span>
                  <span className="flex-grow text-left">{tab.label}</span>
                  {tab.badge > 0 && (
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

      {/* User Card bottom (Super Admin: Rahman Khan style) */}
      <div className="mt-auto border-t border-white/10 pt-4 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#91cd3d]/20 flex items-center justify-center bg-emerald-800 text-[#91cd3d] font-bold text-sm">
          R
        </div>
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-wider text-white/40 font-bold leading-none">Super Admin:</p>
          <p className="text-xs font-bold text-white mt-1 truncate">{sessionData?.user?.name || "Rahman Khan"}</p>
        </div>
      </div>

    </aside>
  );
}
