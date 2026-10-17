"use client";

import React, { useState, useEffect, useCallback } from "react";

interface OverviewTabProps {
  bookings?: any[];
  projects?: any[];
  services?: any[];
  setActiveTab?: (tab: string) => void;
}

interface MonthlyStat {
  key: string;
  labelEn: string;
  labelBn: string;
  bookings: number;
  revenue: number;
}

interface ProjectCategory {
  category: string;
  count: number;
  percentage: number;
}

interface RecentDesignRequest {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  spaceType: string;
  designStyle: string;
  approxArea?: string | null;
  budgetRange?: string | null;
  status: string;
  createdAt: string;
}

interface RecentBooking {
  id: string;
  clientName: string;
  service: string;
  phone?: string | null;
  address?: string | null;
  budgetRange?: string | null;
  status: string;
  bookingDate: string;
  createdAt: string;
}

interface OverviewData {
  range: string;
  filterLabel: string;
  totalProjects: number;
  runningProjects: number;
  completedProjects: number;
  planningProjects: number;
  totalRevenue: number;
  periodRevenue: number;
  totalDue: number;
  invoiceTotal: number;
  dueInvoicesCount: number;
  totalClients: number;
  totalBookings: number;
  pendingBookings: number;
  rangeBookings: number;
  unreadMessages: number;
  pendingReviews: number;
  pendingDesignRequests: number;
  pendingCareerApps: number;
  totalEmployees: number;
  activeMaintenances: number;
  pendingTreeDoctors: number;
  emergencyTreeDoctors: number;
  monthlyStats: MonthlyStat[];
  projectsByCategory: ProjectCategory[];
  recentDesignRequests: RecentDesignRequest[];
  recentBookings: RecentBooking[];
}

export default function OverviewTab({ setActiveTab }: OverviewTabProps) {
  // Date range filter: "month" | "3months" | "year"
  const [timeFilter, setTimeFilter] = useState<"month" | "3months" | "year">("month");
  const [activeTableTab, setActiveTableTab] = useState<"design" | "booking">("design");

  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async (range: "month" | "3months" | "year") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/overview?range=${range}`);
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err?.message || "ড্যাশবোর্ড ডাটা লোড করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview(timeFilter);
  }, [timeFilter, fetchOverview]);

  // Color tokens for project typologies
  const categoryColors = [
    { bg: "bg-[#2B4D33]", text: "text-[#2B4D33]" },
    { bg: "bg-[#DAB200]", text: "text-[#8C7100]" },
    { bg: "bg-[#C85A32]", text: "text-[#C85A32]" },
    { bg: "bg-[#121813]", text: "text-[#121813]" },
    { bg: "bg-[#4A7C59]", text: "text-[#4A7C59]" },
    { bg: "bg-[#8A7968]", text: "text-[#8A7968]" },
  ];

  // Calculate highest booking count for chart scaling
  const maxMonthlyBookings = data?.monthlyStats?.reduce((max, s) => Math.max(max, s.bookings), 0) || 0;
  const hasBookingData = maxMonthlyBookings > 0;
  const hasCategoryData = (data?.projectsByCategory?.length || 0) > 0 && (data?.totalProjects || 0) > 0;

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* ================= HEADER & DATE FILTER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D2C4] bg-white text-[9px] font-mono uppercase tracking-[0.25em] text-[#2B4D33] font-bold mb-2 shadow-2xs">
            SHMA ARCHITECTURAL TYPOLOGY • EXECUTIVE OVERVIEW
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-light text-[#121813] tracking-[0.14em] uppercase leading-tight">
            STUDIO PERFORMANCE & URBAN WILDERNESS
          </h2>
          <p className="text-xs font-sans font-light text-[#75787B] mt-1">
            ল্যান্ডস্কেপ স্থাপত্য, বায়োফিলিক ডিজাইন ও বৃক্ষ চিকিৎসা রিয়েল-টাইম অ্যানালিটিক্স।
          </p>
        </div>

        {/* Date Filter Tabs: এই মাস | ৩ মাস | ১ বছর */}
        <div className="flex items-center bg-white border border-[#D6D2C4] rounded-2xl p-1 shadow-2xs self-stretch sm:self-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => setTimeFilter("month")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              timeFilter === "month"
                ? "bg-[#2B4D33] text-white shadow-xs font-bold"
                : "text-[#75787B] hover:text-[#121813] hover:bg-black/5"
            }`}
          >
            এই মাস
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("3months")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              timeFilter === "3months"
                ? "bg-[#2B4D33] text-white shadow-xs font-bold"
                : "text-[#75787B] hover:text-[#121813] hover:bg-black/5"
            }`}
          >
            ৩ মাস
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter("year")}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              timeFilter === "year"
                ? "bg-[#2B4D33] text-white shadow-xs font-bold"
                : "text-[#75787B] hover:text-[#121813] hover:bg-black/5"
            }`}
          >
            ১ বছর
          </button>
        </div>
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchOverview(timeFilter)}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-mono font-semibold rounded-lg transition-colors cursor-pointer"
          >
            পুনরায় চেষ্টা করুন
          </button>
        </div>
      )}

      {/* ================= 1. METRIC CARDS (4 COLUMNS / 1 COL ON MOBILE) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: প্রজেক্ট মাস্টারপ্ল্যান (Total / Running / Completed) */}
        {loading ? (
          <div className="bg-[#2B4D33]/20 rounded-2xl p-5 min-h-[160px] animate-pulse"></div>
        ) : (
          <div 
            onClick={() => setActiveTab && setActiveTab("projects")}
            className="bg-[#2B4D33] text-white rounded-2xl p-5 border border-[#2B4D33] shadow-xs flex flex-col justify-between min-h-[160px] relative overflow-hidden group cursor-pointer hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-emerald-200">
                  PROJECT PORTFOLIO
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-light tracking-tight text-white mt-3">
                {data?.totalProjects || 0}
                <span className="text-sm font-sans font-normal text-emerald-200/80 ml-1.5">সাইট</span>
              </div>
              <p className="text-xs text-white/80 font-light mt-1">
                রানিং: {data?.runningProjects || 0} • সম্পন্ন: {data?.completedProjects || 0}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/15 text-[10px] font-mono text-emerald-200/90">
              <span>প্ল্যানিং স্টেজে: {data?.planningProjects || 0}</span>
              <span className="group-hover:translate-x-1 transition-transform">মাস্টারপ্ল্যান ➔</span>
            </div>
          </div>
        )}

        {/* Card 2: রেভিনিউ ও পেমেন্ট (Payment Aggregate & Invoices Due) */}
        {loading ? (
          <div className="bg-white rounded-2xl p-5 border border-[#D6D2C4] min-h-[160px] animate-pulse"></div>
        ) : (
          <div 
            onClick={() => setActiveTab && setActiveTab("finance")}
            className="bg-white text-[#121813] rounded-2xl p-5 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between min-h-[160px] cursor-pointer hover:border-[#2B4D33]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-[#75787B]">
                  REVENUE (PAYMENTS)
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {data?.filterLabel}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-light tracking-tight text-[#121813] mt-3 truncate">
                ৳{(data?.periodRevenue || 0).toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-[#75787B] font-light mt-1 truncate">
                সর্বমোট আদায়: ৳{(data?.totalRevenue || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#D6D2C4] text-[10px] font-mono">
              <span className="text-[#C85A32] font-semibold truncate">
                বকেয়া: ৳{(data?.totalDue || 0).toLocaleString("en-IN")} ({data?.dueInvoicesCount || 0}টি)
              </span>
              <span className="text-[#2B4D33] font-bold">অডিট ➔</span>
            </div>
          </div>
        )}

        {/* Card 3: অ্যাক্টিভ ক্লায়েন্ট ও নতুন বুকিং */}
        {loading ? (
          <div className="bg-white rounded-2xl p-5 border border-[#D6D2C4] min-h-[160px] animate-pulse"></div>
        ) : (
          <div 
            onClick={() => setActiveTab && setActiveTab("bookings")}
            className="bg-white text-[#121813] rounded-2xl p-5 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between min-h-[160px] cursor-pointer hover:border-[#2B4D33]/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-[#75787B]">
                  CLIENTS & BOOKINGS
                </span>
                {data?.pendingBookings ? (
                  <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-ping"></span>
                ) : null}
              </div>
              <div className="text-3xl sm:text-4xl font-display font-light tracking-tight text-[#121813] mt-3">
                {data?.totalClients || 0}
                <span className="text-sm font-sans font-normal text-[#75787B] ml-1.5">ক্লায়েন্ট</span>
              </div>
              <p className="text-xs text-[#75787B] font-light mt-1">
                মোট বুকিং: {data?.totalBookings || 0} • নতুন এই মেয়াদে: {data?.rangeBookings || 0}
              </p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#D6D2C4] text-[10px] font-mono">
              <span className="text-[#C85A32] font-bold">
                {data?.pendingBookings || 0} পেন্ডিং বুকিং
              </span>
              <span className="text-[#2B4D33] font-bold">তালিকা ➔</span>
            </div>
          </div>
        )}

        {/* Card 4: ইনবক্স, রিভিউ ও অ্যাকশন সেন্টার */}
        {loading ? (
          <div className="bg-[#E4E2D7] rounded-2xl p-5 border border-[#D6D2C4] min-h-[160px] animate-pulse"></div>
        ) : (
          <div className="bg-[#E4E2D7] text-[#121813] rounded-2xl p-5 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between min-h-[160px]">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold tracking-[0.25em] uppercase text-[#75787B]">
                  COMMUNICATION & ACTION
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#2B4D33] text-white">
                  {(data?.unreadMessages || 0) + (data?.pendingReviews || 0) + (data?.pendingDesignRequests || 0)} অ্যাকশন
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-light tracking-tight text-[#121813] mt-3">
                {data?.unreadMessages || 0} <span className="text-sm font-sans font-normal text-[#75787B]">অপঠিত</span>
              </div>
              <div className="text-xs text-[#75787B] font-light mt-1 space-y-0.5">
                <p>অপেক্ষমাণ রিভিউ: <strong className="text-[#121813] font-mono">{data?.pendingReviews || 0}</strong></p>
                <p>নতুন ডিজাইন রিকোয়েস্ট: <strong className="text-[#121813] font-mono">{data?.pendingDesignRequests || 0}</strong></p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#D6D2C4] text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab("messages")}
                className="text-[#2B4D33] font-bold hover:underline cursor-pointer"
              >
                ইনবক্স
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab("reviews")}
                className="text-[#2B4D33] font-bold hover:underline cursor-pointer"
              >
                রিভিউ
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab("design-requests")}
                className="text-[#2B4D33] font-bold hover:underline cursor-pointer"
              >
                কমিশন
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ================= 2. MIDDLE ROW: CHARTS (MONTHLY BOOKINGS & TYPOLOGY) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Monthly Bookings (Last 12 Months) (8 of 12) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
              <div>
                <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                  MONTHLY BOOKINGS & VISITS (LAST 12 MONTHS)
                </h3>
                <p className="text-xs font-sans text-[#75787B] font-light mt-0.5">
                  বিগত ১২ মাসের ক্লায়েন্ট সাইট ভিজিট ও বুকিং ট্রেন্ড।
                </p>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono text-[#75787B]">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-[#2B4D33]"></span> বুকিং সংখ্যা
                </span>
              </div>
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <span className="w-8 h-8 border-2 border-[#2B4D33]/20 border-t-[#2B4D33] rounded-full animate-spin"></span>
              </div>
            ) : !hasBookingData ? (
              <div className="h-48 border border-dashed border-[#D6D2C4] rounded-xl flex flex-col items-center justify-center p-6 text-center text-[#75787B]">
                <span className="text-3xl mb-1.5 opacity-60">📅</span>
                <p className="font-mono text-xs font-bold text-[#121813] uppercase tracking-wider">এখনো ডাটা নেই</p>
                <p className="text-[11px] font-light text-[#75787B] mt-0.5">
                  বিগত ১২ মাসে কোনো বুকিং রেকর্ড নথিভুক্ত হয়নি। নতুন বুকিং আসলে এখানে মাসিক গ্রাফ দেখা যাবে।
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[500px] h-48 flex items-end justify-between gap-2 pt-6 border-b border-[#D6D2C4] px-2">
                  {data?.monthlyStats.map((item) => {
                    const heightPercent = maxMonthlyBookings > 0 
                      ? Math.max(12, Math.round((item.bookings / maxMonthlyBookings) * 100))
                      : 8;
                    const isZero = item.bookings === 0;

                    return (
                      <div key={item.key} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                        {/* Tooltip on Hover */}
                        <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#121813] text-white text-[10px] font-mono py-1 px-2 rounded-md whitespace-nowrap shadow-md z-20">
                          {item.labelEn}: {item.bookings} বুকিং
                        </div>

                        {/* Booking Value above bar */}
                        <span className={`text-[9px] font-mono mb-1 transition-opacity ${
                          isZero ? "text-stone-300 opacity-60" : "text-[#2B4D33] font-bold"
                        }`}>
                          {item.bookings}
                        </span>

                        {/* Bar */}
                        <div className="w-full flex justify-center items-end h-[120px]">
                          <span
                            style={{ height: `${heightPercent}%` }}
                            className={`w-3.5 sm:w-5 rounded-t-xs transition-all ${
                              isZero 
                                ? "bg-stone-200" 
                                : "bg-[#2B4D33] group-hover:bg-[#1E3724]"
                            }`}
                          ></span>
                        </div>

                        {/* Month Label */}
                        <span className="text-[9px] font-mono text-[#75787B] mt-2 whitespace-nowrap group-hover:text-[#121813]">
                          {item.labelBn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-3 text-xs font-mono text-[#75787B] gap-1">
            <span>সর্বোচ্চ মাসিক বুকিং: <strong className="text-[#121813] font-mono">{maxMonthlyBookings}</strong></span>
            {setActiveTab && (
              <button 
                type="button"
                onClick={() => setActiveTab("bookings")}
                className="text-[#2B4D33] font-bold hover:underline cursor-pointer"
              >
                সব বুকিং রেকর্ড পরিচালনা করুন →
              </button>
            )}
          </div>
        </div>

        {/* Right: Architectural Typology Breakdown (4 of 12) */}
        <div className="lg:col-span-4 bg-[#E4E2D7] text-[#121813] rounded-2xl p-6 border border-[#D6D2C4] shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-light text-base text-[#121813] tracking-wide uppercase">
                TYPOLOGY DISTRIBUTION
              </h3>
              <span className="text-[10px] font-mono text-[#75787B]">
                {data?.totalProjects || 0} প্রজেক্ট
              </span>
            </div>
            <p className="text-xs text-[#75787B] font-light">
              ক্যাটাগরি অনুযায়ী প্রজেক্ট পোর্টফোলিও অনুপাত
            </p>

            {loading ? (
              <div className="space-y-4 mt-6">
                <div className="h-4 bg-black/5 rounded-full animate-pulse"></div>
                <div className="h-4 bg-black/5 rounded-full animate-pulse"></div>
                <div className="h-4 bg-black/5 rounded-full animate-pulse"></div>
              </div>
            ) : !hasCategoryData ? (
              <div className="h-48 border border-dashed border-[#D6D2C4] rounded-xl flex flex-col items-center justify-center p-6 text-center text-[#75787B] mt-4">
                <span className="text-3xl mb-1.5 opacity-60">🌿</span>
                <p className="font-mono text-xs font-bold text-[#121813] uppercase tracking-wider">এখনো ডাটা নেই</p>
                <p className="text-[11px] font-light text-[#75787B] mt-0.5">
                  এখনো কোনো প্রজেক্ট ডাটাবেসে যুক্ত করা হয়নি।
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 mt-5 font-mono text-xs">
                {data?.projectsByCategory.map((item, idx) => {
                  const palette = categoryColors[idx % categoryColors.length];
                  return (
                    <div key={item.category}>
                      <div className="flex justify-between text-[#121813] mb-1">
                        <span className="truncate pr-2">{item.category}</span>
                        <span className="font-bold shrink-0">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-black/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${palette.bg} rounded-full transition-all`}
                          style={{ width: `${Math.max(5, item.percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {setActiveTab && (
            <button 
              type="button"
              onClick={() => setActiveTab("projects")}
              className="w-full mt-6 py-2.5 px-4 bg-white hover:bg-stone-50 text-[#121813] border border-[#D6D2C4] rounded-xl text-xs font-mono font-medium tracking-wider uppercase transition-colors shadow-2xs cursor-pointer text-center"
            >
              প্রজেক্ট মাস্টারপ্ল্যান ও ক্যাটালগ ➔
            </button>
          )}
        </div>

      </div>

      {/* ================= 3. BOTTOM ROW: RECENT COMMISSIONS & BOOKINGS TABLE ================= */}
      <div className="bg-white rounded-2xl p-6 border border-[#D6D2C4] shadow-2xs">
        
        {/* Table Header with Switcher Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
              RECENT ACTIVITY & COMMISSIONS
            </h3>
            
            {/* Table Type Selector */}
            <div className="flex bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-0.5 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTableTab("design")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTableTab === "design"
                    ? "bg-[#2B4D33] text-white font-bold"
                    : "text-[#75787B] hover:text-[#121813]"
                }`}
              >
                ডিজাইন কমিশন ({data?.recentDesignRequests?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setActiveTableTab("booking")}
                className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                  activeTableTab === "booking"
                    ? "bg-[#2B4D33] text-white font-bold"
                    : "text-[#75787B] hover:text-[#121813]"
                }`}
              >
                ক্লায়েন্ট বুকিং ({data?.recentBookings?.length || 0})
              </button>
            </div>
          </div>

          {setActiveTab && (
            <button
              type="button"
              onClick={() => setActiveTab(activeTableTab === "design" ? "design-requests" : "bookings")}
              className="text-xs font-mono font-semibold text-[#2B4D33] hover:underline cursor-pointer"
            >
              {activeTableTab === "design" ? "সব ডিজাইন কমিশন →" : "সব বুকিং দেখুন →"}
            </button>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="space-y-3 py-4">
            <div className="h-8 bg-black/5 rounded-lg animate-pulse"></div>
            <div className="h-8 bg-black/5 rounded-lg animate-pulse"></div>
            <div className="h-8 bg-black/5 rounded-lg animate-pulse"></div>
          </div>
        ) : activeTableTab === "design" ? (
          /* ================= Table 1: Recent Design Requests ================= */
          (data?.recentDesignRequests?.length || 0) === 0 ? (
            <div className="py-12 border border-dashed border-[#D6D2C4] rounded-xl text-center text-[#75787B]">
              <span className="text-3xl mb-1.5 opacity-60">📐</span>
              <p className="font-mono text-xs font-bold text-[#121813] uppercase tracking-wider">এখনো কোনো ডিজাইন রিকোয়েস্ট নেই</p>
              <p className="text-[11px] font-light text-[#75787B] mt-0.5">
                নতুন গ্রাহক ফর্ম পূরণ করলে এখানে দেখতে পাবেন।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#D6D2C4] text-[#75787B] text-[10px] font-mono uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Client Name</th>
                    <th className="pb-3 font-semibold">Space & Style</th>
                    <th className="pb-3 font-semibold">Area / Budget</th>
                    <th className="pb-3 font-semibold">Contact</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E2D7]">
                  {data?.recentDesignRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-[#F7F6F2] transition-colors">
                      <td className="py-3.5 pr-2 font-medium text-[#121813] font-display text-sm tracking-wide">
                        {req.name}
                      </td>
                      <td className="py-3.5 text-[#323232] font-mono text-[11px]">
                        {req.spaceType} • {req.designStyle}
                      </td>
                      <td className="py-3.5 text-[#75787B] text-[11px] font-mono">
                        {req.approxArea || "—"} / {req.budgetRange || "—"}
                      </td>
                      <td className="py-3.5 font-mono text-[#121813] text-[11px]">
                        {req.phone}
                      </td>
                      <td className="py-3.5 font-mono text-[#75787B] text-[10px]">
                        {new Date(req.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${
                          req.status === "NEW"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : req.status === "QUOTED"
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : req.status === "CONVERTED"
                            ? "bg-[#2B4D33] text-white border-[#2B4D33]"
                            : "bg-stone-100 text-stone-700 border-stone-300"
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          /* ================= Table 2: Recent Bookings ================= */
          (data?.recentBookings?.length || 0) === 0 ? (
            <div className="py-12 border border-dashed border-[#D6D2C4] rounded-xl text-center text-[#75787B]">
              <span className="text-3xl mb-1.5 opacity-60">📋</span>
              <p className="font-mono text-xs font-bold text-[#121813] uppercase tracking-wider">এখনো কোনো বুকিং নেই</p>
              <p className="text-[11px] font-light text-[#75787B] mt-0.5">
                কোনো ক্লায়েন্ট বুকিং পাওয়া যায়নি।
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#D6D2C4] text-[#75787B] text-[10px] font-mono uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Client Name</th>
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">Phone / Location</th>
                    <th className="pb-3 font-semibold">Budget</th>
                    <th className="pb-3 font-semibold">Booking Date</th>
                    <th className="pb-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E2D7]">
                  {data?.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-[#F7F6F2] transition-colors">
                      <td className="py-3.5 pr-2 font-medium text-[#121813] font-display text-sm tracking-wide">
                        {b.clientName}
                      </td>
                      <td className="py-3.5 text-[#323232] font-mono text-[11px]">
                        {b.service}
                      </td>
                      <td className="py-3.5 text-[#75787B] text-[11px]">
                        {b.phone || "—"} {b.address ? `(${b.address})` : ""}
                      </td>
                      <td className="py-3.5 font-mono text-[#121813] text-[11px]">
                        {b.budgetRange || "—"}
                      </td>
                      <td className="py-3.5 font-mono text-[#75787B] text-[10px]">
                        {new Date(b.bookingDate || b.createdAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-3.5 text-right">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${
                          b.status === "Pending"
                            ? "bg-amber-50 text-amber-700 border-amber-300"
                            : b.status === "Confirmed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : b.status === "Completed"
                            ? "bg-[#2B4D33] text-white border-[#2B4D33]"
                            : "bg-stone-100 text-stone-700 border-stone-300"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

    </div>
  );
}
