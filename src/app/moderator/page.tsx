"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface PendingItem {
  id: string;
  type: "Blog" | "Review" | "Gallery" | "Career" | "Comment";
  title: string;
  submittedBy: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export default function ModeratorPage() {
  const { user, loading: isPending, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState("content-queue");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Initial pending queue
  const [items, setItems] = useState<PendingItem[]>([
    {
      id: "mod-1",
      type: "Blog",
      title: "Content Title: Care Fresh Organic Fertilizer Guidelines",
      submittedBy: "Dr. Farhan (Tree Doctor)",
      date: "01/17/2026",
      status: "PENDING",
    },
    {
      id: "mod-2",
      type: "Blog",
      title: "Content Title: From Stage of Rooftop to Lush Penthouse Oasis",
      submittedBy: "Tanvir Hasan (Landscape Architect)",
      date: "01/17/2026",
      status: "PENDING",
    },
    {
      id: "mod-3",
      type: "Review",
      title: "Review Title: 5-Star Rating for Banani Rooftop Garden",
      submittedBy: "Anisul Huq (Verified Client)",
      date: "01/17/2026",
      status: "PENDING",
    },
    {
      id: "mod-4",
      type: "Gallery",
      title: "Content Title: View Approval Before & After Water Feature",
      submittedBy: "Abdul Halim (Senior Gardener)",
      date: "01/17/2026",
      status: "PENDING",
    },
    {
      id: "mod-5",
      type: "Career",
      title: "Application: Senior Landscape Designer & Project Lead",
      submittedBy: "Nusrat Jahan, B.Arch",
      date: "01/18/2026",
      status: "PENDING",
    },
  ]);

  // Statistics counters
  const [stats, setStats] = useState({
    pendingBlogs: 8,
    pendingReviews: 7,
    awaitingApproval: 5,
    overviewTotal: "119,300.00",
  });

  const handleApprove = (id: string, title: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "APPROVED" } : item)));
    setActionNotice(`✅ Approved: "${title}" has been published.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleReject = (id: string, title: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "REJECTED" } : item)));
    setActionNotice(`❌ Rejected: "${title}" has been declined.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121A14] text-[#E4E2D7] relative overflow-hidden flex p-3 md:p-6 font-sans studio-portal-dark">
      {/* Background Architectural Ambient Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Outer Rounded Container */}
      <div className="w-full max-w-[1600px] mx-auto bg-[#18221A]/85 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-white/10 flex overflow-hidden min-h-[920px] relative z-10">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className="w-64 bg-[#0d1610]/95 backdrop-blur-xl border-r border-white/10 text-white flex flex-col justify-between p-6 shrink-0">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg shadow-inner text-emerald-400">
                🌿
              </div>
              <div>
                <span className="text-base font-display font-bold tracking-tight text-[#E4E2D7] block leading-none">
                  A R Green Garden
                </span>
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mt-1 block">
                  Moderator Studio
                </span>
              </div>
            </div>

            {/* Menu Label */}
            <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-white/40 mb-4 px-2">
              Menu
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1.5">
              {[
                {
                  id: "dashboard",
                  label: "Dashboard Overview",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ),
                },
                {
                  id: "content-queue",
                  label: "Content Queue",
                  badge: "15 Pending",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  ),
                },
                {
                  id: "blogs",
                  label: "Blog Approvals",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  ),
                },
                {
                  id: "reviews",
                  label: "Review Moderation",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                },
                {
                  id: "support",
                  label: "Customer Support Inbox",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  ),
                },
                {
                  id: "careers",
                  label: "Career Applications",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                },
              ].map((item) => {
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMenu(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer relative ${
                      isActive
                        ? "text-stone-950 bg-emerald-400 font-bold shadow-lg shadow-emerald-500/20"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                        isActive
                          ? "bg-stone-950 text-emerald-300"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer User Profile */}
          <div className="pt-6 border-t border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-emerald-950 border border-emerald-500/40 flex items-center justify-center font-bold text-sm text-emerald-300 shadow-inner">
              {user?.name ? user.name[0] : "R"}
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Moderator:</span>
              <span className="text-xs font-bold text-[#E4E2D7] truncate max-w-[140px]">
                {user?.name || "Rahman Khan"}
              </span>
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          
          {/* Topbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7] tracking-tight">
                Moderator Studio
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Live Queue
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  placeholder="Search anything in system..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-full px-4 py-2 pl-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400 transition-all shadow-sm"
                />
                <svg className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Action Buttons */}
              <button 
                title="Notifications"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <button className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold font-mono px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer hover:scale-[1.02]">
                <span>+ Add Item</span>
              </button>
            </div>
          </div>

          {/* Action Notification Toast */}
          {actionNotice && (
            <div className="mt-4 p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-2xl text-xs font-semibold animate-fade-in-up flex justify-between items-center">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice(null)} className="text-emerald-400 font-bold cursor-pointer">✕</button>
            </div>
          )}

          {/* Grid Layout: Main Columns + Right Side Widget Column */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            
            {/* Left 2 Columns (Content Queue, Stats, Pending Table, Activity Chart) */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Header Title */}
              <div>
                <h2 className="text-xl font-bold font-sans text-[#E4E2D7]">কন্টেন্ট ও মডারেশন কিউ</h2>
                <p className="text-xs text-white/50 mt-0.5">
                  ব্যবহারকারীদের সাবমিট করা ব্লগ, রিভিউ, গ্যালারি ও কেরিয়ার আবেদনসমূহ যাচাই ও অনুমোদন করুন।
                </p>
              </div>

              {/* 2 Top Metric Cards (Site Overview + Moderation Status) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Site Overview Dark Emerald Card */}
                <div className="bg-[#0b261b] text-white p-6 rounded-3xl shadow-lg border border-emerald-900/60 flex flex-col justify-between min-h-[140px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-emerald-200/80">Site Overview</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-3xl font-extrabold tracking-tight font-mono text-white">
                      ৳{stats.overviewTotal}
                    </div>
                  </div>
                </div>

                {/* Moderation Status Card */}
                <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10 flex flex-col justify-between min-h-[140px]">
                  <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">Moderation Status</span>
                  
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        <span className="text-white/60 font-medium">Pending Blogs:</span>
                      </div>
                      <span className="font-bold text-white font-mono">{stats.pendingBlogs}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                        <span className="text-white/60 font-medium">Pending Reviews:</span>
                      </div>
                      <span className="font-bold text-white font-mono">{stats.pendingReviews}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                        <span className="text-white/60 font-medium">Awaiting Approval:</span>
                      </div>
                      <span className="font-bold text-white font-mono">{stats.awaitingApproval}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Items Table Card */}
              <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-[#E4E2D7]">পেন্ডিং কন্টেন্ট কিউ</h3>
                  <span className="text-xs font-mono text-emerald-400">{filteredItems.length} টি আইটেম</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/50 font-mono uppercase text-[10px]">
                        <th className="pb-3 font-semibold">ধরণ</th>
                        <th className="pb-3 font-semibold">কন্টেন্ট শিরোনাম</th>
                        <th className="pb-3 font-semibold">প্রেরক</th>
                        <th className="pb-3 font-semibold">তারিখ</th>
                        <th className="pb-3 text-right font-semibold">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 font-medium">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              item.type === "Blog" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                              item.type === "Review" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                              item.type === "Gallery" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                              "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3 text-white max-w-xs truncate font-medium">
                            {item.title}
                          </td>
                          <td className="py-3 text-white/60 text-[11px]">
                            {item.submittedBy}
                          </td>
                          <td className="py-3 text-white/50 font-mono text-[11px]">
                            {item.date}
                          </td>
                          <td className="py-3 text-right">
                            {item.status === "PENDING" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprove(item.id, item.title)}
                                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-[11px] font-mono font-bold shadow-md transition-all cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(item.id, item.title)}
                                  className="px-3 py-1 bg-red-600/80 hover:bg-red-500 text-white rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                                item.status === "APPROVED" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                              }`}>
                                {item.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Moderation Activity Weekly Bar Chart */}
              <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-[#E4E2D7]">মডারেশন অ্যাক্টিভিটি ট্রেন্ডস</h3>
                  <span className="text-[10px] font-mono text-emerald-400">সাপ্তাহিক ট্র্যাকিং</span>
                </div>

                {/* Custom Bar Visualization with Y-axis scale */}
                <div className="flex items-end gap-6 h-52 pt-4 px-2">
                  {/* Y-axis markers */}
                  <div className="flex flex-col justify-between h-full text-[10px] text-white/40 font-mono pb-6">
                    <span>500</span>
                    <span>400</span>
                    <span>300</span>
                    <span>200</span>
                    <span>100</span>
                    <span>0</span>
                  </div>

                  {/* Day Columns */}
                  <div className="flex-1 flex justify-around items-end h-full pb-6 border-b border-white/10">
                    {[
                      { day: "Mon", h1: 45, h2: 70 },
                      { day: "Tue", h1: 35, h2: 95 },
                      { day: "Wed", h1: 75, h2: 40 },
                      { day: "Thu", h1: 25, h2: 45 },
                      { day: "Fri", h1: 60, h2: 155 },
                      { day: "Sat", h1: 30, h2: 50 },
                      { day: "Sun", h1: 85, h2: 30 },
                    ].map((bar, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 group">
                        <div className="flex items-end gap-1.5 h-36">
                          {/* Dark Green Bar */}
                          <div
                            style={{ height: `${bar.h1}%` }}
                            className="w-3.5 bg-emerald-800 rounded-t-sm transition-all group-hover:brightness-125"
                          ></div>
                          {/* Light Lime Bar */}
                          <div
                            style={{ height: `${bar.h2}%` }}
                            className="w-3.5 bg-emerald-400 rounded-t-sm transition-all group-hover:brightness-110"
                          ></div>
                        </div>
                        <span className="text-[11px] font-mono text-white/50">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Donut Chart & Promo Banner Card */}
            <div className="space-y-6">
              
              {/* Total View Performance Card */}
              <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10 flex flex-col items-center text-center">
                <h3 className="text-sm font-bold text-[#E4E2D7] mb-6 w-full text-left font-mono">
                  Total View Performance
                </h3>

                {/* Donut Chart Visualization */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Ring 1 (68% Lime Green) */}
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
                    {/* Ring 2 (23% Dark Teal/Emerald) */}
                    <circle
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      stroke="#065f46"
                      strokeWidth="16"
                      strokeDasharray="289"
                      strokeDashoffset="222"
                    />
                    {/* Ring 3 (16% Amber / Orange) */}
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
                  
                  {/* Inside Center Text */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[10px] text-white/40 font-semibold uppercase font-mono">Total Count</span>
                    <span className="text-xl font-extrabold text-white font-mono">565K</span>
                  </div>
                </div>

                <p className="text-xs text-white/50 mt-6 leading-relaxed max-w-xs font-sans">
                  কন্টেন্ট ভিউ ও অ্যানালিটিক্স স্কোর সরাসরি ভিজিটর এনগেজমেন্ট বৃদ্ধি করছে।
                </p>

                <button className="mt-4 w-full py-2.5 border border-white/15 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono font-bold text-white transition-all cursor-pointer">
                  Guide Views
                </button>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-6 text-[10px] text-white/60 font-semibold font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
                    <span>View Count</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-700"></span>
                    <span>Percentage</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500"></span>
                    <span>Sales</span>
                  </div>
                </div>
              </div>

              {/* Level Up Banner Card */}
              <div className="bg-gradient-to-br from-emerald-950/80 via-[#18221A] to-black rounded-3xl p-6 shadow-xl border border-emerald-500/20 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                {/* Decorative Sunburst SVG */}
                <div className="absolute right-0 top-0 bottom-0 w-36 opacity-15 pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="#34d399">
                    <polygon points="50,0 60,35 100,50 60,65 50,100 40,65 0,50 40,35" />
                  </svg>
                </div>

                <div className="z-10">
                  <span className="text-2xl">🌱</span>
                  <h4 className="text-lg font-bold font-sans text-[#E4E2D7] mt-2 leading-snug">
                    স্টুডিও সিস্টেম অপ্টিমাইজেশন
                  </h4>
                  <p className="text-xs text-white/60 mt-1 max-w-[200px] leading-relaxed">
                    ক্যাশ ক্লিনআপ, থাম্বনেইল কম্প্রেশন ও ডাটাবেজ ইনডেক্সিং পরিচালনা করুন।
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setActionNotice("✨ Optimization scan running: Cached pages purged, image thumbnails compressed, queries verified.");
                    setTimeout(() => setActionNotice(null), 4000);
                  }}
                  className="z-10 mt-4 w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 py-2.5 rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  Optimize Site Now
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
