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

  // Initial pending queue matching modaretor.png
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
    <div className="min-h-screen bg-[#e8ece9] flex p-3 md:p-6 font-sans text-gray-800">
      {/* Outer Rounded Container */}
      <div className="w-full max-w-[1600px] mx-auto bg-[#eef1ee] rounded-[36px] shadow-2xl border border-gray-300/40 flex overflow-hidden min-h-[920px]">
        
        {/* ================= LEFT SIDEBAR (Dark Forest Green) ================= */}
        <aside className="w-64 bg-[#081c14] text-white flex flex-col justify-between p-6 shrink-0">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-9 h-9 rounded-full bg-emerald-700/80 flex items-center justify-center text-lg shadow-inner border border-emerald-500/30">
                🌿
              </div>
              <span className="text-base font-serif font-bold tracking-tight text-emerald-100">
                A R Green Garden
              </span>
            </div>

            {/* Menu Label */}
            <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-300/60 mb-4 px-2">
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
                        ? "text-[#8ce228] bg-white/10 shadow-sm"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isActive && (
                        <span className="absolute -left-6 top-2.5 bottom-2.5 w-1.5 bg-[#8ce228] rounded-r-full"></span>
                      )}
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#8ce228]/20 text-[#8ce228] border border-[#8ce228]/40">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer User Profile (matching modaretor.png) */}
          <div className="pt-6 border-t border-emerald-900/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-800 border border-emerald-600/40 flex items-center justify-center font-bold text-sm text-emerald-200">
              {user?.name ? user.name[0] : "R"}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[11px] text-gray-400 font-medium">Super Admin:</span>
              <span className="text-xs font-bold text-white truncate max-w-[140px]">
                {user?.name || "Rahman Khan"}
              </span>
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          
          {/* Topbar matching modaretor.png */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-300/60">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-gray-900 tracking-tight">
                Moderator Panel
              </h1>
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  placeholder="Search anything in system..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 border border-gray-300 rounded-full px-4 py-2 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-sm"
                />
                <svg className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Action Buttons */}
              <button 
                title="Notifications"
                className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-emerald-800 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <button className="bg-[#0b281b] hover:bg-[#061810] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer">
                <span>Add new item</span>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">+</span>
              </button>
            </div>
          </div>

          {/* Action Notification Toast */}
          {actionNotice && (
            <div className="mt-4 p-3 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-2xl text-xs font-semibold animate-fade-in-up flex justify-between items-center">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice(null)} className="text-emerald-700 font-bold cursor-pointer">✕</button>
            </div>
          )}

          {/* Grid Layout: Main Columns + Right Side Widget Column */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            
            {/* Left 2 Columns (Content Queue, Stats, Pending Table, Activity Chart) */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* Header Title */}
              <div>
                <h2 className="text-xl font-bold font-serif text-gray-900">Content Queue</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  An easy way to manage sales with care and precision.
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
                      ${stats.overviewTotal}
                    </div>
                  </div>
                </div>

                {/* Moderation Status Card */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 flex flex-col justify-between min-h-[140px]">
                  <span className="text-xs font-bold text-gray-800">Moderation Status</span>
                  
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                        <span className="text-gray-600 font-medium">Pending Blogs:</span>
                      </div>
                      <span className="font-bold text-gray-900 font-mono">{stats.pendingBlogs}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                        <span className="text-gray-600 font-medium">Pending Reviews:</span>
                      </div>
                      <span className="font-bold text-gray-900 font-mono">{stats.pendingReviews}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                        <span className="text-gray-600 font-medium">Awaiting Approval:</span>
                      </div>
                      <span className="font-bold text-gray-900 font-mono">{stats.awaitingApproval}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Items Table Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Pending Items</h3>
                  <button className="text-gray-400 hover:text-gray-600">•••</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500 font-semibold">
                        <th className="pb-3 font-semibold">Item Type</th>
                        <th className="pb-3 font-semibold">Content Title</th>
                        <th className="pb-3 font-semibold">Submitted By</th>
                        <th className="pb-3 font-semibold">Date</th>
                        <th className="pb-3 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="py-3 font-medium text-gray-800">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              item.type === "Blog" ? "bg-amber-100 text-amber-800" :
                              item.type === "Review" ? "bg-purple-100 text-purple-800" :
                              item.type === "Gallery" ? "bg-emerald-100 text-emerald-800" :
                              "bg-sky-100 text-sky-800"
                            }`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3 text-gray-700 max-w-xs truncate font-medium">
                            {item.title}
                          </td>
                          <td className="py-3 text-gray-500 text-[11px]">
                            {item.submittedBy}
                          </td>
                          <td className="py-3 text-gray-500 font-mono text-[11px]">
                            {item.date}
                          </td>
                          <td className="py-3 text-right">
                            {item.status === "PENDING" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApprove(item.id, item.title)}
                                  className="px-3 py-1 bg-[#195b3e] hover:bg-[#11402b] text-white rounded-lg text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(item.id, item.title)}
                                  className="px-3 py-1 bg-[#ba3832] hover:bg-[#962c27] text-white rounded-lg text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === "APPROVED" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
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

              {/* Moderation Activity Weekly Bar Chart (matching modaretor.png) */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-gray-900">Moderation Activity</h3>
                  <button className="text-gray-400 hover:text-gray-600">•••</button>
                </div>

                {/* Custom Bar Visualization with Y-axis scale */}
                <div className="flex items-end gap-6 h-52 pt-4 px-2">
                  {/* Y-axis markers */}
                  <div className="flex flex-col justify-between h-full text-[10px] text-gray-400 font-mono pb-6">
                    <span>500</span>
                    <span>400</span>
                    <span>300</span>
                    <span>200</span>
                    <span>100</span>
                    <span>0</span>
                  </div>

                  {/* Day Columns */}
                  <div className="flex-1 flex justify-around items-end h-full pb-6 border-b border-gray-200">
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
                            className="w-3.5 bg-[#0e3b2b] rounded-t-sm transition-all group-hover:brightness-125"
                          ></div>
                          {/* Light Lime Bar */}
                          <div
                            style={{ height: `${bar.h2}%` }}
                            className="w-3.5 bg-[#8ce228] rounded-t-sm transition-all group-hover:brightness-110"
                          ></div>
                        </div>
                        <span className="text-[11px] font-semibold text-gray-500">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Donut Chart & Promo Banner Card */}
            <div className="space-y-6">
              
              {/* Total View Performance Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col items-center text-center">
                <h3 className="text-sm font-bold text-gray-900 mb-6 w-full text-left">
                  Total View Performance
                </h3>

                {/* Donut Chart Visualization (matching modaretor.png) */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    {/* Ring 1 (68% Lime Green) */}
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
                    {/* Ring 2 (23% Dark Teal/Emerald) */}
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
                    {/* Ring 3 (16% Amber / Orange) */}
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
                  
                  {/* Inside Center Text */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Total Count</span>
                    <span className="text-xl font-extrabold text-gray-900 font-mono">565K</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mt-6 leading-relaxed max-w-xs">
                  Here are some tips on how to improve your score and efficiency.
                </p>

                <button className="mt-4 w-full py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer">
                  Guide Views
                </button>

                {/* Legend */}
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

              {/* Level Up Banner Card (matching modaretor.png) */}
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
                    Maintain up your business next level.
                  </h4>
                  <p className="text-xs text-gray-700 mt-1 max-w-[200px] leading-relaxed">
                    An easy way to manage sales with care and precision.
                  </p>
                </div>

                <button 
                  onClick={() => {
                    setActionNotice("✨ Optimization scan running: Cached pages purged, image thumbnails compressed, queries verified.");
                    setTimeout(() => setActionNotice(null), 4000);
                  }}
                  className="z-10 mt-4 w-full bg-[#1b4332] hover:bg-[#123124] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Optimize Site
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
