"use client";

import React, { useState } from "react";

interface OverviewTabProps {
  bookings?: any[];
  projects?: any[];
  services?: any[];
  setActiveTab?: (tab: string) => void;
}

export default function OverviewTab({ bookings = [], projects = [], services = [], setActiveTab }: OverviewTabProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("2 month");
  const [selectedRegion, setSelectedRegion] = useState("All regions");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Region Data matching AeuxGlobal table
  const regionsList = [
    {
      flag: "🇺🇸",
      region: "USA",
      sub: "America (Dhaka Metro)",
      factory: "253+",
      recycled: "35%",
      trend: "up",
      tech: "Mechanical",
      techColor: "bg-[#FFF4E5] text-[#B76E00] border-[#FFE2B8]",
      totalValue: "4,167,987 tons",
    },
    {
      flag: "🇩🇪",
      region: "German",
      sub: "Europe (Chittagong)",
      factory: "211+",
      recycled: "60%",
      trend: "down",
      tech: "Mechanical",
      techColor: "bg-[#FFF4E5] text-[#B76E00] border-[#FFE2B8]",
      totalValue: "2,571,193 tons",
    },
    {
      flag: "🇯🇵",
      region: "Japan",
      sub: "Asia (Sylhet Eco)",
      factory: "364+",
      recycled: "85%",
      trend: "up",
      tech: "Energy recovery",
      techColor: "bg-[#EBF7EE] text-[#1B5E20] border-[#C8E6C9]",
      totalValue: "1,864,275 tons",
    },
    {
      flag: "🇨🇳",
      region: "China",
      sub: "Asia (Rajshahi Belt)",
      factory: "855+",
      recycled: "25%",
      trend: "down",
      tech: "Chemical",
      techColor: "bg-[#FBE9E7] text-[#D84315] border-[#FFCCBC]",
      totalValue: "8,643,742 tons",
    },
  ];

  return (
    <div className="flex flex-col gap-5 sm:gap-6 animate-fade-in font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-[#111914] border border-[#00E676]/30 text-white rounded-2xl text-xs font-semibold animate-fade-in flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-white font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* ================= 1. TOP ROW: 3 METRIC CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        
        {/* Card 1: Air Pollution Level (Dark Obsidian Card with Neon Bars) */}
        <div className="bg-[#111914] text-white rounded-3xl p-5 border border-white/5 shadow-md flex items-center justify-between min-h-[140px] relative overflow-hidden group">
          <div className="space-y-1 z-10">
            <p className="text-xs text-stone-400 font-mono tracking-wide">
              Air Pollution Level
            </p>
            <div className="text-2xl sm:text-[28px] font-extrabold font-mono tracking-tight text-white mt-1">
              35.05 <span className="text-xs font-normal text-stone-400">µg/m³</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#00E676] font-bold pt-1">
              <span>↗ 2.3%</span>
              <span className="text-stone-400 font-normal">than last month</span>
            </div>
          </div>

          {/* Mini Neon Green Vertical Bar Chart */}
          <div className="flex items-end gap-1.5 h-12 shrink-0 pr-1 z-10">
            <span className="w-2 h-5 bg-[#00E676] rounded-sm transition-all group-hover:scale-y-110"></span>
            <span className="w-2 h-9 bg-[#00E676] rounded-sm transition-all group-hover:scale-y-110"></span>
            <span className="w-2 h-4 bg-[#00E676] rounded-sm transition-all group-hover:scale-y-110"></span>
            <span className="w-2 h-12 bg-[#00E676] rounded-sm transition-all group-hover:scale-y-110"></span>
          </div>

          {/* Ambient Glow */}
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#00E676]/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Card 2: Environmental Quality Index (Clean White Card with Coral Bars) */}
        <div className="bg-white text-[#111813] rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between min-h-[140px] group">
          <div className="space-y-1">
            <p className="text-xs text-stone-400 font-mono tracking-wide">
              Environmental Quality Index
            </p>
            <div className="text-2xl sm:text-[28px] font-extrabold font-mono tracking-tight text-[#111813] mt-1">
              75.50<span className="text-xs font-normal text-stone-400">/100%</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-rose-500 font-bold pt-1">
              <span>↘ 1.4%</span>
              <span className="text-stone-400 font-normal">than last month</span>
            </div>
          </div>

          {/* Mini Coral Bar Chart */}
          <div className="flex items-end gap-1.5 h-12 shrink-0 pr-1">
            <span className="w-2 h-8 bg-rose-400 rounded-sm transition-all group-hover:scale-y-110"></span>
            <span className="w-2 h-4 bg-rose-400 rounded-sm transition-all group-hover:scale-y-110"></span>
            <span className="w-2 h-11 bg-rose-400 rounded-sm transition-all group-hover:scale-y-110"></span>
          </div>
        </div>

        {/* Card 3: Investments in Clean Technologies (Clean White Card with Emerald Bars) */}
        <div className="bg-white text-[#111813] rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-center justify-between min-h-[140px] group">
          <div className="space-y-1">
            <p className="text-xs text-stone-400 font-mono tracking-wide">
              Investments in Clean Technologies
            </p>
            <div className="text-2xl sm:text-[28px] font-extrabold font-mono tracking-tight text-[#111813] mt-1">
              $967,570
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 font-bold pt-1">
              <span>↗ 5.1%</span>
              <span className="text-stone-400 font-normal">than last month</span>
            </div>
          </div>

          {/* Mini Emerald Bar Chart */}
          <div className="flex items-end gap-1.5 h-12 shrink-0 pr-1">
            <span className="w-2 h-4 bg-[#22C55E] rounded-sm transition-all group-hover:scale-y-110"></span>
            <span className="w-2 h-7 bg-[#22C55E] rounded-sm transition-all group-hover:scale-y-110"></span>
            <span className="w-2 h-11 bg-[#22C55E] rounded-sm transition-all group-hover:scale-y-110"></span>
          </div>
        </div>

      </div>

      {/* ================= 2. MIDDLE ROW: BAR CHART & SAGE HIGHLIGHT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* 2A: Climate Change Index Chart (7 of 12 columns) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-extrabold text-base text-[#111813] tracking-tight">
              Climate Change Index
            </h3>

            {/* Dark Filter Dropdown Pill */}
            <button 
              type="button"
              className="bg-[#111813] hover:bg-[#1E2922] text-white text-xs font-mono font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <span>{selectedPeriod}</span>
              <span className="text-[10px] text-stone-400">▾</span>
            </button>
          </div>

          {/* Interactive Chart with Dotted Guide & Peak Badge */}
          <div className="relative pt-6 pb-2">
            
            {/* Dotted Guideline at 80 mark */}
            <div className="absolute top-12 left-0 right-0 border-b border-dashed border-stone-300 z-0">
              <span className="absolute -top-3 left-0 text-[10px] font-mono text-stone-400">80</span>
            </div>
            <div className="absolute top-24 left-0 right-0 border-b border-dashed border-stone-200 z-0">
              <span className="absolute -top-3 left-0 text-[10px] font-mono text-stone-400">40</span>
            </div>

            {/* Bars Container */}
            <div className="h-44 flex items-end justify-between gap-1.5 sm:gap-2 px-6 relative z-10">
              
              {/* W1 Past bars (Grey) */}
              <div className="flex-1 flex items-end justify-center gap-1 h-full">
                <span className="w-2.5 h-[35%] bg-stone-200 rounded-xs"></span>
                <span className="w-2.5 h-[55%] bg-stone-200 rounded-xs"></span>
              </div>
              <div className="flex-1 flex items-end justify-center gap-1 h-full">
                <span className="w-2.5 h-[40%] bg-stone-200 rounded-xs"></span>
                <span className="w-2.5 h-[65%] bg-stone-200 rounded-xs"></span>
              </div>
              <div className="flex-1 flex items-end justify-center gap-1 h-full">
                <span className="w-2.5 h-[50%] bg-stone-200 rounded-xs"></span>
                <span className="w-2.5 h-[75%] bg-stone-200 rounded-xs"></span>
              </div>

              {/* W4 PEAK HIGHLIGHT with "82.6 CCI" Dark Pill */}
              <div className="flex-1 flex flex-col items-center justify-end h-full relative">
                {/* 82.6 CCI Tooltip Badge */}
                <div className="absolute -top-2 bg-[#111914] text-white border border-[#00E676]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-md z-20 whitespace-nowrap">
                  82.6 CCI
                </div>
                <div className="flex items-end gap-1 h-full">
                  <span className="w-3 h-[90%] bg-[#00E676] rounded-xs shadow-sm"></span>
                  <span className="w-3 h-[60%] bg-[#22C55E] rounded-xs"></span>
                </div>
              </div>

              {/* W5-W8 (Bright Green Bars) */}
              <div className="flex-1 flex items-end justify-center gap-1 h-full">
                <span className="w-2.5 h-[45%] bg-[#22C55E] rounded-xs"></span>
                <span className="w-2.5 h-[65%] bg-[#22C55E] rounded-xs"></span>
              </div>
              <div className="flex-1 flex items-end justify-center gap-1 h-full">
                <span className="w-2.5 h-[30%] bg-[#22C55E] rounded-xs"></span>
                <span className="w-2.5 h-[80%] bg-[#22C55E] rounded-xs"></span>
              </div>
              <div className="flex-1 flex items-end justify-center gap-1 h-full">
                <span className="w-2.5 h-[40%] bg-[#22C55E] rounded-xs"></span>
                <span className="w-2.5 h-[70%] bg-[#22C55E] rounded-xs"></span>
              </div>
              <div className="flex-1 flex items-end justify-center gap-1 h-full">
                <span className="w-2.5 h-[55%] bg-[#22C55E] rounded-xs"></span>
                <span className="w-2.5 h-[45%] bg-[#22C55E] rounded-xs"></span>
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between px-6 pt-3 text-[10px] font-mono text-stone-400 border-t border-stone-200">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span className="text-[#111813] font-bold">W4</span>
              <span>W5</span>
              <span>W6</span>
              <span>W7</span>
              <span>W8</span>
            </div>
          </div>
        </div>

        {/* 2B: Sage Green Highlight Card (99,681m TONS) (4 of 12 columns) */}
        <div className="lg:col-span-4 bg-[#DCE8DE] text-[#0E1712] rounded-3xl p-6 border border-[#C5D8C8] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-[#0E1712]">
                99,681m
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-600">
                TONS
              </span>
            </div>

            <p className="text-xs font-mono font-bold text-emerald-800 mt-1 flex items-center gap-1">
              <span>↗ 20% reduced CO2</span>
            </p>
          </div>

          {/* 2 Feature Rows matching AeuxGlobal */}
          <div className="space-y-4 pt-6">
            {/* Row 1: Mechanical recycling */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/70 border border-[#B8CEBC] flex items-center justify-center text-sm shrink-0 shadow-xs">
                ♻️
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#0E1712] leading-tight">
                  Mechanical recycling
                </p>
                <p className="text-[10px] font-mono text-stone-600 mt-0.5">
                  1,697 TONS
                </p>
              </div>
            </div>

            {/* Row 2: Chemical recycling */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/70 border border-[#B8CEBC] flex items-center justify-center text-sm shrink-0 shadow-xs">
                🧪
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#0E1712] leading-tight">
                  Chemical recycling
                </p>
                <p className="text-[10px] font-mono text-stone-600 mt-0.5">
                  913 TONS
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ================= 3. BOTTOM ROW: REGIONS TABLE & DARK MAP ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* 3A: Plastic Recycling by Region Table (8 of 12 columns) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-extrabold text-base text-[#111813] tracking-tight">
                Plastic Recycling by Region
              </h3>

              {/* Dark Dropdown Filter: All regions ▾ */}
              <button 
                type="button"
                className="bg-[#111914] hover:bg-[#1E2922] text-white text-xs font-mono font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span>{selectedRegion}</span>
                <span className="text-[10px] text-stone-400">▾</span>
              </button>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-400 text-[10px] uppercase font-semibold">
                    <th className="pb-3 font-normal">Region</th>
                    <th className="pb-3 font-normal">Factory</th>
                    <th className="pb-3 font-normal">Recycled</th>
                    <th className="pb-3 font-normal text-center">Dynamic</th>
                    <th className="pb-3 font-normal">Main Technologies</th>
                    <th className="pb-3 font-normal">Total Value</th>
                    <th className="pb-3 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {regionsList.map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                      {/* Region & Flag */}
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{row.flag}</span>
                          <div>
                            <p className="font-bold text-[#111813] font-sans text-xs leading-none">
                              {row.region}
                            </p>
                            <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                              {row.sub}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Factory */}
                      <td className="py-3 font-semibold text-stone-800">
                        {row.factory}
                      </td>

                      {/* Recycled % */}
                      <td className="py-3 font-semibold text-stone-800">
                        {row.recycled}
                      </td>

                      {/* Dynamic Sparkline Wave (SVG) */}
                      <td className="py-3 text-center px-2">
                        {row.trend === "up" ? (
                          <svg className="w-14 h-4 mx-auto text-[#22C55E]" viewBox="0 0 60 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M2 12 Q 15 2, 28 9 T 58 3" />
                          </svg>
                        ) : (
                          <svg className="w-14 h-4 mx-auto text-rose-400" viewBox="0 0 60 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M2 4 Q 15 14, 28 7 T 58 13" />
                          </svg>
                        )}
                      </td>

                      {/* Tech Badge */}
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border font-mono ${row.techColor}`}>
                          {row.tech}
                        </span>
                      </td>

                      {/* Total Value */}
                      <td className="py-3 font-bold text-stone-800">
                        {row.totalValue}
                      </td>

                      {/* 3-dots Menu */}
                      <td className="py-3 text-right">
                        <button className="text-stone-400 hover:text-black cursor-pointer px-1">
                          ⋮
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3B: Global Pollution / Interactive Territory Map (4 of 12 columns) */}
        <div className="lg:col-span-4 bg-[#111914] text-white rounded-3xl p-6 border border-white/5 shadow-md flex flex-col justify-between relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between z-10">
            <h3 className="font-display font-extrabold text-base text-white tracking-tight">
              Global pollution
            </h3>

            {/* Region Dropdown Pill */}
            <button 
              type="button"
              className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono px-2.5 py-1 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Europe</span>
              <span className="text-[10px] text-stone-400">▾</span>
            </button>
          </div>

          {/* Stylized Visual Map Illustration */}
          <div className="relative h-44 my-2 flex items-center justify-center z-10">
            {/* SVG Geographical Outline with Neon Green Hotspot */}
            <svg className="w-full h-full opacity-80" viewBox="0 0 240 140" fill="none">
              {/* Background Continents in Dark Slate */}
              <path d="M20,30 Q40,10 70,25 T120,40 T160,20 T210,35 L220,100 Q180,120 140,110 T80,125 T30,90 Z" fill="#18231C" />
              <path d="M60,40 L100,50 L110,80 L80,95 L50,70 Z" fill="#1F2E24" />
              
              {/* High Activity Hotspot (Ukraine / Active Zone in Neon Green) */}
              <path 
                d="M130,50 Q150,45 165,55 T180,75 T155,90 T135,70 Z" 
                fill="#00E676" 
                className="animate-pulse"
                opacity="0.85"
              />
              <circle cx="150" cy="65" r="4" fill="#FFFFFF" />
            </svg>

            {/* Floating Tooltip Pill matching AeuxGlobal */}
            <div className="absolute top-10 left-8 bg-black/85 backdrop-blur-md border border-white/20 p-2.5 rounded-xl shadow-xl flex items-center gap-3 z-20">
              <div>
                <p className="text-[10px] font-mono text-stone-400 leading-none">
                  Ukraine
                </p>
                <p className="text-[9px] font-mono text-[#00E676] font-bold mt-0.5">
                  High Level
                </p>
              </div>
              <span className="text-xs font-mono font-extrabold text-[#00E676] bg-[#00E676]/10 px-1.5 py-0.5 rounded-md border border-[#00E676]/30">
                89% ↗
              </span>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10">
            {/* Help Question Mark */}
            <button 
              type="button" 
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center text-xs font-mono cursor-pointer transition-colors"
              title="Map Guide & Legend"
            >
              ?
            </button>
            <span className="text-[10px] font-mono text-stone-500">
              Live Satellite Sync
            </span>
          </div>

          {/* Ambient Map Glow */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#00E676]/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

      </div>

    </div>
  );
}
