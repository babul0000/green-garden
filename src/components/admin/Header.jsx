"use client";

import React from "react";

export default function Header({ setActiveTab, setEditingService, fetchData }) {
  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shrink-0">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold text-[#0c1911]">Sales Admin</span>
        <span className="text-[8px] text-slate-400">▼</span>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Input bar (Magnifying glass on right) */}
        <div className="relative w-64 hidden sm:block">
          <input
            type="text"
            placeholder="Search anything in Siohioma..."
            className="w-full pl-4 pr-10 py-1.5 border border-slate-200 rounded-full text-[11px] focus:outline-none focus:border-[#0c1911] text-slate-700 bg-slate-50/50"
          />
          <span className="absolute right-3.5 top-2.5 text-[10px] text-slate-400">🔍</span>
        </div>

        {/* Top Icons */}
        <div className="flex gap-4 items-center text-slate-400">
          <button onClick={fetchData} className="hover:text-slate-600 cursor-pointer text-xs font-bold font-mono text-[#8ac343] bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100" title="Refresh database">
            Refresh ⟳
          </button>
          
          <button className="hover:text-slate-600 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <button className="hover:text-slate-600 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
          
          {/* "+ Add new product" button matching Siohioma Style */}
          <button 
            type="button"
            onClick={() => { setActiveTab("services"); setEditingService(null); }}
            className="bg-[#0c1911] hover:bg-black text-white text-[11px] font-bold py-1.5 px-4 rounded-full flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
          >
            <span>Add new product</span>
            <span className="text-sm font-light">+</span>
          </button>
        </div>
      </div>
    </header>
  );
}
