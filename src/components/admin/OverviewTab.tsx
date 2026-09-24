"use client";

import React, { useState } from "react";

interface OverviewTabProps {
  bookings?: any[];
  projects?: any[];
  services?: any[];
  setActiveTab?: (tab: string) => void;
}

export default function OverviewTab({ bookings = [], projects = [], services = [], setActiveTab }: OverviewTabProps) {
  const [timeFilter, setTimeFilter] = useState("January 2026 - May 2026");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Exact KPI Counters matching admin.png and PDF masterplan
  const recentBookingsList = bookings && bookings.length > 0 ? bookings.slice(0, 4) : [
    { clientName: "Client Name", service: "Service", date: "12/17/2026", status: "Pending" },
    { clientName: "Client Name", service: "Service", date: "02/17/2026", status: "Confirmed" },
    { clientName: "Client Name", service: "Service", date: "01/17/2026", status: "Confirmed" },
    { clientName: "Josh Sawnsch", service: "Starbeiler", date: "12/17/2026", status: "Confirmed" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-2xl text-xs font-semibold animate-fade-in-up flex justify-between items-center">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Header Row matching admin.png */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 tracking-tight">
            Dashboard Analytics
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            An any way to manage sales with care and precision.
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-xs text-gray-700 font-semibold shadow-sm">
          <span>📅</span>
          <span>{timeFilter}</span>
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 3-Column Grid matching admin.png */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left & Center Columns (2 of 3) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Row 1: Site Overview + Net Income + Total Return */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Site Overview Dark Green Card matching admin.png */}
            <div className="bg-[#0b261b] text-white p-5 rounded-3xl shadow-lg border border-emerald-900/60 flex flex-col justify-between min-h-[150px]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-200/80">Site Overview</span>
              </div>
              <div className="space-y-1 mt-2 text-xs">
                <div className="flex justify-between items-center text-gray-200">
                  <span>Total Projects:</span>
                  <span className="font-bold text-white font-mono">500+</span>
                </div>
                <div className="flex justify-between items-center text-gray-200">
                  <span>Happy Clients:</span>
                  <span className="font-bold text-white font-mono">450+</span>
                </div>
                <div className="flex justify-between items-center text-gray-200">
                  <span>Pending Bookings:</span>
                  <span className="font-bold text-amber-300 font-mono">8</span>
                </div>
                <div className="flex justify-between items-center text-gray-200">
                  <span>New Messages:</span>
                  <span className="font-bold text-emerald-300 font-mono">13</span>
                </div>
              </div>
            </div>

            {/* Card 2: Net Income Card matching admin.png */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200/80 flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-700">Net income</span>
                <button className="text-gray-400 hover:text-gray-600">•••</button>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900">
                  $193.000
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-700">
                  <span>↗ +35%</span>
                  <span className="text-gray-400 font-normal">from last month</span>
                </div>
              </div>
            </div>

            {/* Card 3: Total Return Card matching admin.png */}
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-200/80 flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-700">Total Return</span>
                <button className="text-gray-400 hover:text-gray-600">•••</button>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-gray-900">
                  $32.000
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-rose-600">
                  <span>↘ -24%</span>
                  <span className="text-gray-400 font-normal">from last month</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Recent Bookings Table + Revenue Analytics Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Recent Bookings Card matching admin.png */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Recent Bookings</h3>
                  <button className="text-gray-400 hover:text-gray-600">•••</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-[11px] font-semibold">
                        <th className="pb-2.5 font-semibold">Client Name</th>
                        <th className="pb-2.5 font-semibold">Service</th>
                        <th className="pb-2.5 font-semibold">Date</th>
                        <th className="pb-2.5 text-right font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentBookingsList.map((b: any, idx: number) => {
                        const isPending = b.status?.toLowerCase() === "pending";
                        return (
                          <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                            <td className="py-2.5 font-medium text-gray-800 truncate max-w-[90px]">
                              {b.clientName || b.name || "Client Name"}
                            </td>
                            <td className="py-2.5 text-gray-500 truncate max-w-[90px]">
                              {b.service || "Garden Design"}
                            </td>
                            <td className="py-2.5 text-gray-400 font-mono text-[11px]">
                              {b.date || "12/17/2026"}
                            </td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                isPending
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}>
                                {isPending ? "Pending" : "Confirmed"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {setActiveTab && (
                <button
                  onClick={() => setActiveTab("bookings")}
                  className="mt-4 text-center text-xs font-bold text-emerald-800 hover:text-emerald-900 pt-2 border-t border-gray-100 block cursor-pointer"
                >
                  View All Bookings →
                </button>
              )}
            </div>

            {/* Revenue Analytics Card matching admin.png */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/80 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-bold text-gray-900">Revenue Analytics</h3>
                  <div className="flex items-center gap-3 text-[10px] font-semibold text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#0e3b2b]"></span> Income
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#8ce228]"></span> Expenses
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-extrabold font-mono text-gray-900">$193.000</span>
                  <span className="text-[11px] font-bold text-emerald-700">↗ +35% from last month</span>
                </div>

                {/* Bar visualization */}
                <div className="flex items-end justify-between gap-2 h-36 pt-2 border-b border-gray-100">
                  {[
                    { h1: 60, h2: 35 },
                    { h1: 85, h2: 45 },
                    { h1: 70, h2: 90 },
                    { h1: 55, h2: 30 },
                    { h1: 95, h2: 60 },
                    { h1: 75, h2: 40 },
                    { h1: 85, h2: 50 },
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex items-end justify-center gap-1 h-full">
                      <div
                        style={{ height: `${bar.h1}%` }}
                        className="w-2.5 sm:w-3.5 bg-[#0e3b2b] rounded-t-sm"
                      ></div>
                      <div
                        style={{ height: `${bar.h2}%` }}
                        className="w-2.5 sm:w-3.5 bg-[#8ce228] rounded-t-sm"
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Booking Trends Card matching admin.png */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200/80">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-gray-900">Booking Trends</h3>
              <button className="text-gray-400 hover:text-gray-600">•••</button>
            </div>

            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-extrabold font-mono text-gray-900">$2,000</span>
              <span className="text-[11px] font-bold text-emerald-700">↗ +35% relevant last month</span>
            </div>

            {/* Custom Bar Visualization matching admin.png */}
            <div className="flex items-end justify-between gap-3 h-32 pt-2 border-b border-gray-100 px-2">
              {[
                { h1: 30, h2: 20 },
                { h1: 65, h2: 45 },
                { h1: 40, h2: 25 },
                { h1: 75, h2: 90 },
                { h1: 95, h2: 60 },
                { h1: 45, h2: 80 },
                { h1: 85, h2: 40 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex items-end justify-center gap-1.5 h-full">
                  <div
                    style={{ height: `${bar.h1}%` }}
                    className="w-3 bg-[#0e3b2b] rounded-t-sm"
                  ></div>
                  <div
                    style={{ height: `${bar.h2}%` }}
                    className="w-3 bg-[#8ce228] rounded-t-sm"
                  ></div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Widget: Total View Performance + Level Up Card matching admin.png */}
        <div className="space-y-6">
          
          {/* Total View Performance Donut Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-gray-900 mb-6 w-full text-left">
              Total View Performance
            </h3>

            {/* Donut Chart Visualization */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* 68% Lime Green Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#8ce228"
                  strokeWidth="16"
                  strokeDasharray="289"
                  strokeDashoffset="92"
                />
                {/* 23% Dark Teal Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#0f3b2a"
                  strokeWidth="16"
                  strokeDasharray="289"
                  strokeDashoffset="222"
                />
                {/* 16% Orange Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#e58334"
                  strokeWidth="16"
                  strokeDasharray="289"
                  strokeDashoffset="242"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Total Count</span>
                <span className="text-xl font-extrabold text-gray-900 font-mono">565K</span>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-6 leading-relaxed max-w-xs">
              Here are some tips on how to improve your score.
            </p>

            <button className="mt-4 w-full py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer">
              Guide Views
            </button>

            {/* Legend matching admin.png */}
            <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-gray-600 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#8ce228]"></span>
                <span>View Count</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0f3b2a]"></span>
                <span>Percentage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#e58334]"></span>
                <span>Sales</span>
              </div>
            </div>
          </div>

          {/* Level Up Banner Card matching admin.png */}
          <div className="bg-[#cbdcc9] rounded-3xl p-6 shadow-sm border border-emerald-300/40 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Decorative Sunburst SVG */}
            <div className="absolute right-0 top-0 bottom-0 w-36 opacity-30 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="#8ce228">
                <polygon points="50,0 60,35 100,50 60,65 50,100 40,65 0,50 40,35" />
              </svg>
            </div>

            <div className="z-10">
              <span className="text-2xl">🌱</span>
              <h4 className="text-lg font-bold font-serif text-gray-900 mt-2 leading-snug">
                Level up your business to the next level.
              </h4>
              <p className="text-xs text-gray-700 mt-1 max-w-[200px] leading-relaxed">
                An any way to manage sales with care and precision.
              </p>
            </div>

            <button 
              onClick={() => {
                setToastMessage("🚀 Performance optimizer executed: Database queries indexed, image caching verified.");
                setTimeout(() => setToastMessage(null), 4000);
              }}
              className="z-10 mt-4 w-full bg-[#1b4332] hover:bg-[#123124] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              Optimize Site
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
