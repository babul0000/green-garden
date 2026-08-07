"use client";

import React from "react";

export default function Header({ setActiveTab, setEditingService, fetchData }) {
  return (
    <header className="h-16 bg-[#06120c] border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shrink-0 text-white">
      <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
        <span className="text-[15px] font-bold text-white">Admin Panel</span>
        <span className="text-[9px] text-white/50">▼</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Input bar */}
        <div className="relative w-64 hidden sm:block">
          <input
            type="text"
            placeholder="Search anything in Siohioma..."
            className="w-full pl-4 pr-10 py-1.5 border border-[#153021] rounded-full text-[11px] focus:outline-none focus:border-[#8fc63f] text-white bg-[#0e2217]/60 placeholder:text-white/30"
          />
          <span className="absolute right-3.5 top-2.5 text-[10px] text-white/40">🔍</span>
        </div>

        {/* Top Icons */}
        <div className="flex gap-4 items-center text-white/60">
          <button 
            type="button"
            onClick={fetchData} 
            className="hover:text-white cursor-pointer text-[10px] font-bold font-mono text-[#91cd3d] bg-[#0e2217] px-2.5 py-1.5 rounded-xl border border-[#153021] transition-all"
            title="Refresh database"
          >
            Refresh ⟳
          </button>
          
          <button type="button" className="hover:text-white cursor-pointer p-1.5 hover:bg-white/5 rounded-full transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </button>
          <button type="button" className="hover:text-white cursor-pointer p-1.5 hover:bg-white/5 rounded-full transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
          
          {/* "+ Add new product" button matching Siohioma Style */}
          <button 
            type="button"
            onClick={() => { setActiveTab("services"); setEditingService(null); }}
            className="bg-[#0e2217] hover:bg-[#153021] text-white border border-[#153021] text-[11px] font-bold py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
          >
            <span>Add new product</span>
            <span className="bg-white/10 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-light">?</span>
          </button>
        </div>
      </div>
    </header>
  );
}
