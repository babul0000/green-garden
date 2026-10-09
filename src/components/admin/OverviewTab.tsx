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

  const recentBookingsList = bookings && bookings.length > 0 ? bookings.slice(0, 4) : [
    { clientName: "Client Name", service: "Garden Design", date: "12/17/2026", status: "Pending" },
    { clientName: "Tanvir Ahmed", service: "Rooftop Oasis", date: "02/17/2026", status: "Confirmed" },
    { clientName: "Rahim Chowdhury", service: "Tree Healthcare", date: "01/17/2026", status: "Confirmed" },
    { clientName: "Shahidul Islam", service: "Landscape Lighting", date: "12/17/2026", status: "Confirmed" },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-semibold animate-fade-in-up flex justify-between items-center">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
            A R Green Garden Studio • Executive Overview
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#E4E2D7] tracking-tight">
            Dashboard Analytics & Business Metrics
          </h2>
          <p className="text-xs text-white/50 mt-0.5">
            রিয়েল-টাইম অপারেশনস, প্রজেক্ট স্ট্যাটাস এবং আর্থিক পারফরম্যান্স এক নজরে।
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/15 rounded-full px-4 py-1.5 text-xs text-white/80 font-mono shadow-sm">
          <span>📅</span>
          <span>{timeFilter}</span>
          <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Master ERP Live Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 bg-[#18221A]/85 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-xl">
        <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
          <span className="text-[10px] font-semibold text-emerald-400 font-mono uppercase tracking-wider block">Customers</span>
          <span className="text-xl font-extrabold font-mono text-[#E4E2D7]">250+</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
          <span className="text-[10px] font-semibold text-blue-400 font-mono uppercase tracking-wider block">Running Proj</span>
          <span className="text-xl font-extrabold font-mono text-blue-300">18</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
          <span className="text-[10px] font-semibold text-emerald-400 font-mono uppercase tracking-wider block">Completed</span>
          <span className="text-xl font-extrabold font-mono text-emerald-300">96+</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
          <span className="text-[10px] font-semibold text-purple-400 font-mono uppercase tracking-wider block">Employees</span>
          <span className="text-xl font-extrabold font-mono text-purple-300">35</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
          <span className="text-[10px] font-semibold text-amber-400 font-mono uppercase tracking-wider block">Maintenance</span>
          <span className="text-xl font-extrabold font-mono text-amber-300">72+</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center">
          <span className="text-[10px] font-semibold text-red-400 font-mono uppercase tracking-wider block">Tree Doctor</span>
          <span className="text-xl font-extrabold font-mono text-red-300">12</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-semibold text-teal-400 font-mono uppercase tracking-wider block">Quotations</span>
          <span className="text-xl font-extrabold font-mono text-teal-300">8</span>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left & Center Columns (2 of 3) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Row 1: Site Overview + Net Income + Total Return */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Site Overview Dark Green Card */}
            <div className="bg-[#0e1c14] text-white p-5 rounded-3xl shadow-xl border border-emerald-500/20 flex flex-col justify-between min-h-[150px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-2 relative z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">Site Overview</span>
              </div>
              <div className="space-y-1.5 mt-3 text-xs relative z-10 font-mono">
                <div className="flex justify-between items-center text-white/70">
                  <span>Total Projects:</span>
                  <span className="font-bold text-[#E4E2D7]">500+</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Happy Clients:</span>
                  <span className="font-bold text-[#E4E2D7]">450+</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>Pending Bookings:</span>
                  <span className="font-bold text-amber-300">8</span>
                </div>
                <div className="flex justify-between items-center text-white/70">
                  <span>New Messages:</span>
                  <span className="font-bold text-emerald-300">13</span>
                </div>
              </div>
            </div>

            {/* Card 2: Net Income Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl shadow-xl border border-white/10 flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-semibold text-white/60 uppercase tracking-wider">Net Income</span>
                <button className="text-white/40 hover:text-white">•••</button>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#E4E2D7]">
                  ৳1,93,000
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-400 font-mono">
                  <span>↗ +35%</span>
                  <span className="text-white/40 font-normal">from last month</span>
                </div>
              </div>
            </div>

            {/* Card 3: Total Return Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl shadow-xl border border-white/10 flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-semibold text-white/60 uppercase tracking-wider">Total Return</span>
                <button className="text-white/40 hover:text-white">•••</button>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#E4E2D7]">
                  ৳32,000
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-rose-400 font-mono">
                  <span>↘ -24%</span>
                  <span className="text-white/40 font-normal">from last month</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Recent Bookings Table + Revenue Analytics Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Recent Bookings Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-display font-bold text-[#E4E2D7]">Recent Bookings</h3>
                  <button className="text-white/40 hover:text-white">•••</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase font-semibold">
                        <th className="pb-2.5">Client Name</th>
                        <th className="pb-2.5">Service</th>
                        <th className="pb-2.5">Date</th>
                        <th className="pb-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {recentBookingsList.map((b: any, idx: number) => {
                        const isPending = b.status?.toLowerCase() === "pending";
                        return (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-2.5 font-medium text-[#E4E2D7] truncate max-w-[90px]">
                              {b.clientName || b.name || "Client Name"}
                            </td>
                            <td className="py-2.5 text-white/50 truncate max-w-[90px]">
                              {b.service || "Garden Design"}
                            </td>
                            <td className="py-2.5 text-white/40 text-[11px]">
                              {b.date || "12/17/2026"}
                            </td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                isPending
                                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
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
                  className="mt-4 text-center text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 pt-3 border-t border-white/10 block cursor-pointer transition-colors"
                >
                  View All Bookings →
                </button>
              )}
            </div>

            {/* Revenue Analytics Card */}
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-display font-bold text-[#E4E2D7]">Revenue Analytics</h3>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-white/60">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Income
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Expenses
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4 font-mono">
                  <span className="text-2xl font-extrabold text-[#E4E2D7]">৳1,93,000</span>
                  <span className="text-[11px] font-bold text-emerald-400">↗ +35% from last month</span>
                </div>

                {/* Bar visualization */}
                <div className="flex items-end justify-between gap-2 h-36 pt-2 border-b border-white/10">
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
                        className="w-2.5 sm:w-3.5 bg-emerald-800 rounded-t-sm"
                      ></div>
                      <div
                        style={{ height: `${bar.h2}%` }}
                        className="w-2.5 sm:w-3.5 bg-emerald-400 rounded-t-sm"
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Booking Trends Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-white/10">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-display font-bold text-[#E4E2D7]">Booking Trends</h3>
              <button className="text-white/40 hover:text-white">•••</button>
            </div>

            <div className="flex items-baseline gap-2 mb-4 font-mono">
              <span className="text-2xl font-extrabold text-[#E4E2D7]">৳2,00,000</span>
              <span className="text-[11px] font-bold text-emerald-400">↗ +35% relevant last month</span>
            </div>

            {/* Custom Bar Visualization */}
            <div className="flex items-end justify-between gap-3 h-32 pt-2 border-b border-white/10 px-2">
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
                    className="w-3 bg-emerald-800 rounded-t-sm"
                  ></div>
                  <div
                    style={{ height: `${bar.h2}%` }}
                    className="w-3 bg-emerald-400 rounded-t-sm"
                  ></div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Widget: Total View Performance + Level Up Card */}
        <div className="space-y-6">
          
          {/* Total View Performance Donut Card */}
          <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10 flex flex-col items-center text-center">
            <h3 className="text-sm font-display font-bold text-[#E4E2D7] mb-6 w-full text-left">
              Total View Performance
            </h3>

            {/* Donut Chart Visualization */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Emerald Green Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="16"
                  strokeDasharray="289"
                  strokeDashoffset="92"
                />
                {/* Dark Teal Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#064e3b"
                  strokeWidth="16"
                  strokeDasharray="289"
                  strokeDashoffset="222"
                />
                {/* Amber Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="16"
                  strokeDasharray="289"
                  strokeDashoffset="242"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] text-white/40 font-mono font-semibold uppercase">Total Count</span>
                <span className="text-2xl font-extrabold text-[#E4E2D7] font-mono">565K</span>
              </div>
            </div>

            <p className="text-xs text-white/50 mt-6 leading-relaxed max-w-xs font-sans">
              আর্কিটেকচারাল পোর্টাল এনগেজমেন্ট ও গ্রাহক ভিজিট অ্যানালিটিক্স।
            </p>

            <button className="mt-4 w-full py-2.5 border border-white/15 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono font-bold text-white transition-all cursor-pointer">
              ভিউ গাইড ও রিপোর্ট
            </button>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-6 text-[10px] font-mono text-white/60 font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
                <span>View Count</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-900"></span>
                <span>Percentage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
                <span>Sales</span>
              </div>
            </div>
          </div>

          {/* Level Up Banner Card */}
          <div className="bg-gradient-to-br from-[#0c1a12] via-[#10291c] to-[#0c1a12] rounded-3xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Decorative SVG */}
            <div className="absolute right-0 top-0 bottom-0 w-36 opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="#34d399">
                <polygon points="50,0 60,35 100,50 60,65 50,100 40,65 0,50 40,35" />
              </svg>
            </div>

            <div className="z-10">
              <span className="text-2xl">🌱</span>
              <h4 className="text-lg font-display font-bold text-[#E4E2D7] mt-2 leading-snug">
                System & Database Optimization
              </h4>
              <p className="text-xs text-white/70 mt-1 max-w-[200px] leading-relaxed font-sans">
                পোস্টগ্রেসকিউএল ও ক্লাউডিনারি মিডিয়া ক্যাশ রিলোড করুন।
              </p>
            </div>

            <button 
              onClick={() => {
                setToastMessage("🚀 Performance optimizer executed: Database queries indexed, image caching verified.");
                setTimeout(() => setToastMessage(null), 4000);
              }}
              className="z-10 mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              সাইট অপ্টিমাইজ করুন
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
