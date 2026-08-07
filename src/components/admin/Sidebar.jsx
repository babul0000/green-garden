"use client";

import React from "react";

export default function Sidebar({ activeTab, setActiveTab, sessionData, inboxCount }) {
  return (
    <aside className="w-full md:w-[250px] bg-[#0c1911] text-white flex flex-col px-4 py-6 md:sticky md:top-0 md:h-screen shrink-0 shadow-2xl border-r border-white/5 z-20">
      
      {/* Brand/Logo (Siohioma Style) */}
      <div className="flex items-center gap-3 px-3 py-2 mb-8">
        <svg className="w-6 h-6 text-[#8ac343]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="3.5" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
        <span className="font-sans font-bold text-lg text-white tracking-wide">Siohioma</span>
      </div>

      {/* Navigation Menu */}
      <div className="flex flex-col gap-6 flex-grow overflow-y-auto pr-1">
        
        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-white/20 px-3 mb-3">Menu</p>
          <nav className="flex flex-col gap-1">
            {[
              { 
                id: "analytics", 
                label: "Overview", 
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
                id: "projects", 
                label: "Statistics", 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                )
              },
              { 
                id: "gallery", 
                label: "Customers", 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                )
              },
              { 
                id: "services", 
                label: "Product", 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="21 8 21 21 3 21 3 8" />
                    <rect x="1" y="3" width="22" height="5" />
                    <line x1="10" y1="12" x2="14" y2="12" />
                  </svg>
                )
              },
              { 
                id: "careers", 
                label: "Messages", 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                ),
                badge: inboxCount
              },
              { 
                id: "bookings", 
                label: "Transactions", 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" />
                    <line x1="6" y1="8" x2="18" y2="8" />
                    <line x1="6" y1="12" x2="18" y2="12" />
                    <line x1="6" y1="16" x2="12" y2="16" />
                  </svg>
                )
              },
              { 
                id: "blogs", 
                label: "Blogs", 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                )
              }
            ].map(tab => (
              <div key={tab.id} className="relative flex items-center w-full">
                {activeTab === tab.id && (
                  <div className="absolute left-0 w-1.5 h-6 bg-[#8ac343] rounded-r-md"></div>
                )}
                <button
                  type="button"
                  onClick={() => { setActiveTab(tab.id); }}
                  className={`flex items-center gap-3 w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#12241a] text-white font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span className="flex-grow text-left">{tab.label}</span>
                  {tab.badge > 0 && (
                    <span className="bg-[#8ac343] text-[#0c1911] text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                      {tab.badge}
                    </span>
                  )}
                </button>
              </div>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-[10px] uppercase font-bold tracking-wider text-white/20 px-3 mb-3">General</p>
          <nav className="flex flex-col gap-1">
            {[
              { 
                id: "settings", 
                label: "Settings", 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                )
              },
              { 
                id: "security", 
                label: "Security", 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )
              }
            ].map(tab => (
              <div key={tab.id} className="relative flex items-center w-full">
                {activeTab === tab.id && (
                  <div className="absolute left-0 w-1.5 h-6 bg-[#8ac343] rounded-r-md"></div>
                )}
                <button
                  type="button"
                  onClick={() => { setActiveTab(tab.id); }}
                  className={`flex items-center gap-3 w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#12241a] text-white font-bold"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              </div>
            ))}
          </nav>
        </div>

      </div>

      {/* User Card bottom (Siohioma Fandaww style) */}
      <div className="mt-auto border-t border-white/10 pt-4 flex items-center gap-3 px-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#8ac343]/20 flex items-center justify-center bg-emerald-800 text-[#8ac343] font-bold text-sm">
          {sessionData?.user?.name ? sessionData.user.name[0].toUpperCase() : "F"}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white truncate">{sessionData?.user?.name || "Fandaww Punx"}</p>
          <p className="text-[9px] text-white/50 truncate font-mono">{sessionData?.user?.email || "fandaww6@gmail.com"}</p>
        </div>
      </div>

    </aside>
  );
}
