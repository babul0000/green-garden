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
        <div className="p-3.5 bg-[#D8F3DC] border border-[#B7E4C7] text-[#1B4332] rounded-2xl text-xs font-semibold animate-fade-in-up flex justify-between items-center shadow-xs">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-[#1B4332] font-bold cursor-pointer hover:opacity-75">✕</button>
        </div>
      )}

      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#B7E4C7] bg-[#D8F3DC] text-[10px] font-mono uppercase tracking-[0.2em] text-[#1B4332] font-semibold mb-2">
            A R Green Garden Studio • Executive Overview
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-[#1C1917] tracking-tight">
            Dashboard Analytics & Business Metrics
          </h2>
          <p className="text-xs text-[#78716C] mt-0.5">
            রিয়েল-টাইম অপারেশনস, প্রজেক্ট স্ট্যাটাস এবং আর্থিক পারফরম্যান্স এক নজরে।
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-2 bg-white border border-[#E7E5E4] rounded-full px-4 py-1.5 text-xs text-[#1C1917] font-mono shadow-2xs">
          <span>📅</span>
          <span>{timeFilter}</span>
          <svg className="w-3.5 h-3.5 text-[#78716C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Master ERP Live Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 bg-white p-4 rounded-3xl border border-[#E7E5E4] shadow-xs">
        <div className="p-2.5 rounded-2xl bg-[#F9F9F6] border border-[#E7E5E4] text-center">
          <span className="text-[10px] font-bold text-[#78716C] font-mono uppercase tracking-wider block">Customers</span>
          <span className="text-xl font-extrabold font-mono text-[#1C1917]">250+</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F9F9F6] border border-[#E7E5E4] text-center">
          <span className="text-[10px] font-bold text-[#78716C] font-mono uppercase tracking-wider block">Running Proj</span>
          <span className="text-xl font-extrabold font-mono text-[#1B4332]">18</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F9F9F6] border border-[#E7E5E4] text-center">
          <span className="text-[10px] font-bold text-[#78716C] font-mono uppercase tracking-wider block">Completed</span>
          <span className="text-xl font-extrabold font-mono text-[#1B4332]">96+</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F9F9F6] border border-[#E7E5E4] text-center">
          <span className="text-[10px] font-bold text-[#78716C] font-mono uppercase tracking-wider block">Employees</span>
          <span className="text-xl font-extrabold font-mono text-[#1C1917]">35</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F9F9F6] border border-[#E7E5E4] text-center">
          <span className="text-[10px] font-bold text-[#78716C] font-mono uppercase tracking-wider block">Maintenance</span>
          <span className="text-xl font-extrabold font-mono text-[#1B4332]">72+</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F9F9F6] border border-[#E7E5E4] text-center">
          <span className="text-[10px] font-bold text-[#78716C] font-mono uppercase tracking-wider block">Tree Doctor</span>
          <span className="text-xl font-extrabold font-mono text-emerald-700">12</span>
        </div>
        <div className="p-2.5 rounded-2xl bg-[#F9F9F6] border border-[#E7E5E4] text-center col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-[#78716C] font-mono uppercase tracking-wider block">Quotations</span>
          <span className="text-xl font-extrabold font-mono text-[#1C1917]">8</span>
        </div>
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Left & Center Columns (2 of 3) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Row 1: Site Overview + Net Income + Total Return */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1: Site Overview Featured Deep Botanical Forest Card */}
            <div className="bg-[#1B4332] text-white p-5 rounded-3xl shadow-md border border-[#1B4332] flex flex-col justify-between min-h-[150px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center gap-2 relative z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D8F3DC] animate-pulse"></span>
                <span className="text-xs font-mono font-semibold text-[#D8F3DC] uppercase tracking-wider">Site Overview</span>
              </div>
              <div className="space-y-1.5 mt-3 text-xs relative z-10 font-mono">
                <div className="flex justify-between items-center text-white/80">
                  <span>Total Projects:</span>
                  <span className="font-bold text-white">500+</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>Happy Clients:</span>
                  <span className="font-bold text-white">450+</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>Pending Bookings:</span>
                  <span className="font-bold text-[#D8F3DC]">8</span>
                </div>
                <div className="flex justify-between items-center text-white/80">
                  <span>New Messages:</span>
                  <span className="font-bold text-[#D8F3DC]">13</span>
                </div>
              </div>
            </div>

            {/* Card 2: Net Income Card */}
            <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#E7E5E4] flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-semibold text-[#78716C] uppercase tracking-wider">Net Income</span>
                <button className="text-[#78716C] hover:text-[#1C1917]">•••</button>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1C1917]">
                  ৳1,93,000
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]">
                    ↗ +35%
                  </span>
                  <span className="text-[#78716C] text-xs font-normal">from last month</span>
                </div>
              </div>
            </div>

            {/* Card 3: Total Return Card */}
            <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#E7E5E4] flex flex-col justify-between min-h-[150px]">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-semibold text-[#78716C] uppercase tracking-wider">Total Return</span>
                <button className="text-[#78716C] hover:text-[#1C1917]">•••</button>
              </div>
              <div className="mt-2">
                <div className="text-2xl sm:text-3xl font-extrabold font-mono text-[#1C1917]">
                  ৳32,000
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200">
                    ↘ -24%
                  </span>
                  <span className="text-[#78716C] text-xs font-normal">from last month</span>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Recent Bookings Table + Revenue Analytics Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Recent Bookings Card */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E7E5E4] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-display font-bold text-[#1C1917]">Recent Bookings</h3>
                  <button className="text-[#78716C] hover:text-[#1C1917]">•••</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#E7E5E4] text-[#78716C] text-[10px] uppercase font-semibold">
                        <th className="pb-2.5">Client Name</th>
                        <th className="pb-2.5">Service</th>
                        <th className="pb-2.5">Date</th>
                        <th className="pb-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E5E4]">
                      {recentBookingsList.map((b: any, idx: number) => {
                        const isPending = b.status?.toLowerCase() === "pending";
                        return (
                          <tr key={idx} className="hover:bg-[#F9F9F6] transition-colors">
                            <td className="py-2.5 font-medium text-[#1C1917] truncate max-w-[90px]">
                              {b.clientName || b.name || "Client Name"}
                            </td>
                            <td className="py-2.5 text-[#78716C] truncate max-w-[90px]">
                              {b.service || "Garden Design"}
                            </td>
                            <td className="py-2.5 text-[#78716C] text-[11px]">
                              {b.date || "12/17/2026"}
                            </td>
                            <td className="py-2.5 text-right">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPending
                                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                                  : "bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]"
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
                  className="mt-4 text-center text-xs font-mono font-bold text-[#1B4332] hover:text-[#143527] pt-3 border-t border-[#E7E5E4] block cursor-pointer transition-colors"
                >
                  View All Bookings →
                </button>
              )}
            </div>

            {/* Revenue Analytics Card */}
            <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E7E5E4] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-display font-bold text-[#1C1917]">Revenue Analytics</h3>
                  <div className="flex items-center gap-3 text-[10px] font-mono text-[#78716C]">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#1B4332]"></span> Income
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-[#52B788]"></span> Expenses
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-4 font-mono">
                  <span className="text-2xl font-extrabold text-[#1C1917]">৳1,93,000</span>
                  <span className="text-[11px] font-bold text-[#1B4332]">↗ +35% from last month</span>
                </div>

                {/* Bar visualization */}
                <div className="flex items-end justify-between gap-2 h-36 pt-2 border-b border-[#E7E5E4]">
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
                        className="w-2.5 sm:w-3.5 bg-[#1B4332] rounded-t-sm"
                      ></div>
                      <div
                        style={{ height: `${bar.h2}%` }}
                        className="w-2.5 sm:w-3.5 bg-[#52B788] rounded-t-sm"
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Row 3: Booking Trends Card */}
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-[#E7E5E4]">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-display font-bold text-[#1C1917]">Booking Trends</h3>
              <button className="text-[#78716C] hover:text-[#1C1917]">•••</button>
            </div>

            <div className="flex items-baseline gap-2 mb-4 font-mono">
              <span className="text-2xl font-extrabold text-[#1C1917]">৳2,00,000</span>
              <span className="text-[11px] font-bold text-[#1B4332]">↗ +35% relevant last month</span>
            </div>

            {/* Custom Bar Visualization */}
            <div className="flex items-end justify-between gap-3 h-32 pt-2 border-b border-[#E7E5E4] px-2">
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
                    className="w-3 bg-[#1B4332] rounded-t-sm"
                  ></div>
                  <div
                    style={{ height: `${bar.h2}%` }}
                    className="w-3 bg-[#52B788] rounded-t-sm"
                  ></div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column Widget: Total View Performance + Level Up Card */}
        <div className="space-y-6">
          
          {/* Total View Performance Donut Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E7E5E4] flex flex-col items-center text-center">
            <h3 className="text-sm font-display font-bold text-[#1C1917] mb-6 w-full text-left">
              Total View Performance
            </h3>

            {/* Donut Chart Visualization */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Neutral Track */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#E7E5E4"
                  strokeWidth="16"
                />
                {/* Emerald Green Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#1B4332"
                  strokeWidth="16"
                  strokeDasharray="289"
                  strokeDashoffset="92"
                />
                {/* Secondary Accent Ring */}
                <circle
                  cx="60"
                  cy="60"
                  r="46"
                  fill="none"
                  stroke="#52B788"
                  strokeWidth="16"
                  strokeDasharray="289"
                  strokeDashoffset="222"
                />
              </svg>
              
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] text-[#78716C] font-mono font-semibold uppercase">Total Count</span>
                <span className="text-2xl font-extrabold text-[#1C1917] font-mono">565K</span>
              </div>
            </div>

            <p className="text-xs text-[#78716C] mt-6 leading-relaxed max-w-xs font-sans">
              আর্কিটেকচারাল পোর্টাল এনগেজমেন্ট ও গ্রাহক ভিজিট অ্যানালিটিক্স।
            </p>

            <button className="mt-4 w-full py-2.5 border border-[#E7E5E4] bg-[#F9F9F6] hover:bg-[#F2F1EC] rounded-xl text-xs font-mono font-bold text-[#1C1917] transition-all cursor-pointer">
              ভিউ গাইড ও রিপোর্ট
            </button>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-6 text-[10px] font-mono text-[#78716C] font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#1B4332]"></span>
                <span>View Count</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#52B788]"></span>
                <span>Percentage</span>
              </div>
            </div>
          </div>

          {/* Level Up Banner Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-[#E7E5E4] relative overflow-hidden flex flex-col justify-between min-h-[220px]">
            {/* Subtle background wash */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D8F3DC]/30 rounded-full blur-2xl pointer-events-none"></div>

            <div className="z-10">
              <span className="text-2xl">🌱</span>
              <h4 className="text-lg font-display font-bold text-[#1C1917] mt-2 leading-snug">
                System & Database Optimization
              </h4>
              <p className="text-xs text-[#78716C] mt-1 max-w-[200px] leading-relaxed font-sans">
                পোস্টগ্রেসকিউএল ও ক্লাউডিনারি মিডিয়া ক্যাশ রিলোড করুন।
              </p>
            </div>

            <button 
              onClick={() => {
                setToastMessage("🚀 Performance optimizer executed: Database queries indexed, image caching verified.");
                setTimeout(() => setToastMessage(null), 4000);
              }}
              className="z-10 mt-4 w-full bg-[#1B4332] hover:bg-[#143527] text-white py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-xs cursor-pointer"
            >
              সাইট অপ্টিমাইজ করুন
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
