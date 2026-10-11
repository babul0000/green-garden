"use client";

import React, { useState } from "react";

interface OverviewTabProps {
  bookings?: any[];
  projects?: any[];
  services?: any[];
  setActiveTab?: (tab: string) => void;
}

export default function OverviewTab({ bookings = [], projects = [], services = [], setActiveTab }: OverviewTabProps) {
  const [timeFilter, setTimeFilter] = useState("Season 2026: Spring & Monsoon");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Masterplan projects styled in Shma Designs architectural typology
  const studioCommissions = [
    {
      name: "Mapletree Urban Wilderness",
      typology: "Workplace & Institution",
      location: "Gulshan Corporate Avenue, Dhaka",
      area: "14,500 sqft",
      status: "In Execution",
      statusBadge: "bg-[#2B4D33]/10 text-[#2B4D33] border-[#2B4D33]/30",
      progress: "75%",
    },
    {
      name: "The Standard Biophilic Villa",
      typology: "Hospitality & Sanctuary",
      location: "Inani Eco-Coast, Cox's Bazar",
      area: "32,000 sqft",
      status: "Concept Design",
      statusBadge: "bg-[#DAB200]/15 text-[#8C7100] border-[#DAB200]/40",
      progress: "40%",
    },
    {
      name: "Dhanmondi Sky Canopy & Terrace",
      typology: "Residential Rooftop",
      location: "Road 9/A, Dhanmondi, Dhaka",
      area: "6,200 sqft",
      status: "Completed",
      statusBadge: "bg-[#2B4D33] text-white border-[#2B4D33]",
      progress: "100%",
    },
    {
      name: "Ancient Banyan Tree Clinic & Surgery",
      typology: "Arboriculture Care",
      location: "Heritage Zone, Chittagong",
      area: "12 Specimen Trees",
      status: "Active Monitoring",
      statusBadge: "bg-[#C85A32]/10 text-[#C85A32] border-[#C85A32]/30",
      progress: "90%",
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-[#E4E2D7] border border-[#D6D2C4] text-[#121813] rounded-xl text-xs font-semibold animate-fade-in flex justify-between items-center shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2B4D33]"></span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#75787B] hover:text-[#121813] font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Architectural Statement & Time Pill */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D2C4] bg-white text-[9px] font-mono uppercase tracking-[0.25em] text-[#2B4D33] font-bold mb-2 shadow-2xs">
            SHMA ARCHITECTURAL TYPOLOGY • EXECUTIVE OVERVIEW
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-light text-[#121813] tracking-[0.14em] uppercase leading-tight">
            STUDIO PERFORMANCE & URBAN WILDERNESS
          </h2>
          <p className="text-xs font-sans font-light text-[#75787B] mt-1">
            ল্যান্ডস্কেপ স্থাপত্য, বায়োফিলিক ডিজাইন ও বৃক্ষ চিকিৎসা পোর্টফোলিও পারফরম্যান্স।
          </p>
        </div>

        {/* Shma Architectural Date Selector Pill */}
        <div className="flex items-center gap-2 bg-white border border-[#D6D2C4] rounded-full px-4 py-2 text-xs text-[#121813] font-mono shadow-2xs">
          <span>📅</span>
          <span>{timeFilter}</span>
          <span className="text-[10px] text-[#75787B]">▾</span>
        </div>
      </div>

      {/* ================= 1. ARCHITECTURAL METRIC CARDS (4 COLUMNS) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Featured Shma Signature Forest Green Block */}
        <div className="bg-[#2B4D33] text-white rounded-2xl p-5 border border-[#2B4D33] shadow-xs flex flex-col justify-between min-h-[150px] relative overflow-hidden group">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-emerald-200">
                ECOLOGICAL PRACTICE
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <div className="text-3xl sm:text-4xl font-display font-light tracking-tight text-white mt-3">
              500+
            </div>
            <p className="text-xs text-white/80 font-light mt-1">
              Commissions Designed & Built
            </p>
          </div>
          <p className="text-[10px] font-mono text-emerald-200/90 pt-3 border-t border-white/10">
            Urban Wilderness in Tropical Climate
          </p>
        </div>

        {/* Card 2: Active Masterplans (Clean White Card) */}
        <div className="bg-white text-[#121813] rounded-2xl p-5 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between min-h-[150px]">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-[#75787B]">
              RUNNING COMMISSIONS
            </span>
            <div className="text-3xl sm:text-4xl font-display font-light tracking-tight text-[#121813] mt-3">
              18 <span className="text-sm font-sans font-normal text-[#75787B]">Sites</span>
            </div>
            <p className="text-xs text-[#75787B] font-light mt-1">
              Institution, Workplace & Residential
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#2B4D33] pt-3 border-t border-[#D6D2C4]">
            <span>↗ 98.4%</span>
            <span className="text-[#75787B] font-normal">on-schedule execution</span>
          </div>
        </div>

        {/* Card 3: Tree Doctor Audits (Clean White Card) */}
        <div className="bg-white text-[#121813] rounded-2xl p-5 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between min-h-[150px]">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-[#75787B]">
              TREE CLINIC & SURGERY
            </span>
            <div className="text-3xl sm:text-4xl font-display font-light tracking-tight text-[#121813] mt-3">
              96+ <span className="text-sm font-sans font-normal text-[#75787B]">Audits</span>
            </div>
            <p className="text-xs text-[#75787B] font-light mt-1">
              Certified Plant Pathologist Visits
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#C85A32] pt-3 border-t border-[#D6D2C4]">
            <span>🌿 12 Emergency</span>
            <span className="text-[#75787B] font-normal">treatments applied</span>
          </div>
        </div>

        {/* Card 4: Shma Linen Signature Card (Studio Financials) */}
        <div className="bg-[#E4E2D7] text-[#121813] rounded-2xl p-5 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between min-h-[150px]">
          <div>
            <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-[#75787B]">
              QUARTERLY CONTRACT VALUE
            </span>
            <div className="text-3xl sm:text-4xl font-display font-light tracking-tight text-[#121813] mt-3">
              ৳1,93,000
            </div>
            <p className="text-xs text-[#75787B] font-light mt-1">
              Net Architectural Commission
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#2B4D33] pt-3 border-t border-[#D6D2C4]">
            <span>↗ +35%</span>
            <span className="text-[#75787B] font-normal">increase from last quarter</span>
          </div>
        </div>

      </div>

      {/* ================= 2. MIDDLE ROW: EXECUTION TIMELINE & TYPOLOGY ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Execution & Seasonality Chart (8 of 12) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                  PROJECT PROGRESSION & SEASONAL EXECUTION
                </h3>
                <p className="text-xs font-sans text-[#75787B] font-light mt-0.5">
                  মৌসুমি বৃক্ষরোপণ, ল্যান্ডস্কেপ হার্ডস্কেপিং ও মেইনটেন্যান্স রেশিও।
                </p>
              </div>

              {/* Legend matching Shma Green & Ochre */}
              <div className="flex items-center gap-3 text-[10px] font-mono text-[#75787B]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#2B4D33]"></span> Landscape
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#DAB200]"></span> Hardscape
                </span>
              </div>
            </div>

            {/* Custom Architectural Bar Visualization */}
            <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-[#D6D2C4] px-4">
              {[
                { label: "Jan", h1: 45, h2: 30 },
                { label: "Feb", h1: 65, h2: 40 },
                { label: "Mar", h1: 85, h2: 60 },
                { label: "Apr", h1: 95, h2: 50 },
                { label: "May", h1: 70, h2: 85 },
                { label: "Jun", h1: 55, h2: 40 },
                { label: "Jul", h1: 90, h2: 65 },
                { label: "Aug", h1: 75, h2: 50 },
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <span 
                      style={{ height: `${bar.h1}%` }} 
                      className="w-3 sm:w-4 bg-[#2B4D33] rounded-t-xs transition-all hover:bg-[#1E3724]"
                    ></span>
                    <span 
                      style={{ height: `${bar.h2}%` }} 
                      className="w-3 sm:w-4 bg-[#DAB200] rounded-t-xs transition-all hover:bg-[#B39200]"
                    ></span>
                  </div>
                  <span className="text-[10px] font-mono text-[#75787B] mt-2">
                    {bar.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 text-xs font-mono text-[#75787B]">
            <span>Optimal Tropical Climate Planting Window: Active</span>
            <span className="text-[#2B4D33] font-bold">Peak Efficiency: 92%</span>
          </div>
        </div>

        {/* Right: Architectural Typology Breakdown (4 of 12) */}
        <div className="lg:col-span-4 bg-[#E4E2D7] text-[#121813] rounded-2xl p-6 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-display font-light text-base text-[#121813] tracking-wide uppercase">
              TYPOLOGY DISTRIBUTION
            </h3>
            <p className="text-xs text-[#75787B] font-light mt-0.5">
              Shma Designs Studio Category Split
            </p>

            <div className="space-y-3.5 mt-5 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[#121813] mb-1">
                  <span>Workplace & Institutional</span>
                  <span className="font-bold">42%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2B4D33] rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#121813] mb-1">
                  <span>Hospitality & Sanctuary</span>
                  <span className="font-bold">28%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#DAB200]" style={{ width: "28%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#121813] mb-1">
                  <span>Residential Rooftops</span>
                  <span className="font-bold">20%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C85A32]" style={{ width: "20%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#121813] mb-1">
                  <span>Arboriculture Tree Care</span>
                  <span className="font-bold">10%</span>
                </div>
                <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-[#121813]" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => {
              setToastMessage("Architectural portfolio index refreshed with latest botanical typologies.");
              setTimeout(() => setToastMessage(null), 4000);
            }}
            className="w-full mt-6 py-2.5 px-4 bg-white hover:bg-stone-50 text-[#121813] border border-[#D6D2C4] rounded-xl text-xs font-mono font-medium tracking-wider uppercase transition-colors shadow-2xs cursor-pointer"
          >
            ক্যাটালগ ও প্রজেক্ট অডিট ➔
          </button>
        </div>

      </div>

      {/* ================= 3. BOTTOM ROW: STUDIO COMMISSIONS PORTFOLIO ================= */}
      <div className="bg-white rounded-2xl p-6 border border-[#D6D2C4] shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div>
            <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
              FEATURED COMMISSIONS & MASTERPLANS
            </h3>
            <p className="text-xs text-[#75787B] font-light">
              বর্তমান চলমান আর্কিটেকচারাল প্রজেক্ট ও সাইট অডিট তালিকা।
            </p>
          </div>

          {setActiveTab && (
            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className="text-xs font-mono font-semibold text-[#2B4D33] hover:underline cursor-pointer"
            >
              সব প্রজেক্ট দেখুন →
            </button>
          )}
        </div>

        {/* Architectural Portfolio Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D6D2C4] text-[#75787B] text-[10px] font-mono uppercase tracking-wider">
                <th className="pb-3 font-semibold">Project Title</th>
                <th className="pb-3 font-semibold">Typology</th>
                <th className="pb-3 font-semibold">Location</th>
                <th className="pb-3 font-semibold">Scope Area</th>
                <th className="pb-3 font-semibold text-center">Execution</th>
                <th className="pb-3 text-right font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E2D7]">
              {studioCommissions.map((proj, idx) => (
                <tr key={idx} className="hover:bg-[#F7F6F2] transition-colors">
                  <td className="py-3.5 pr-2 font-medium text-[#121813] font-display text-sm tracking-wide">
                    {proj.name}
                  </td>
                  <td className="py-3.5 text-[#323232] font-mono text-[11px]">
                    {proj.typology}
                  </td>
                  <td className="py-3.5 text-[#75787B] text-[11px]">
                    {proj.location}
                  </td>
                  <td className="py-3.5 font-mono text-[#121813] text-[11px]">
                    {proj.area}
                  </td>
                  <td className="py-3.5 text-center">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-[#E4E2D7] rounded-full overflow-hidden">
                        <div 
                          style={{ width: proj.progress }} 
                          className="h-full bg-[#2B4D33] rounded-full"
                        ></div>
                      </div>
                      <span className="font-mono text-[10px] font-bold text-[#2B4D33]">{proj.progress}</span>
                    </div>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${proj.statusBadge}`}>
                      {proj.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
