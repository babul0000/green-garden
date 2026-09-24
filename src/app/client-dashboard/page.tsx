"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ClientDashboardPage() {
  const { user, loading: isPending, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Digital Service Card Data (PDF Requirement #28)
  const serviceCard = {
    cardNumber: "DSC-2026-DHANMONDI",
    projectName: "Rooftop Oasis — Luxury Penthouse Retreat",
    handoverDate: "15 August 2026",
    location: "42/A, Road 9/A, Dhanmondi, Dhaka",
    services: [
      "3-Layer Waterproof Membrane & Drainage Cell",
      "Japanese Grass Lawn Installation",
      "Automated Micro-Drip Irrigation Grid",
      "Outdoor Treated Timber Pergola",
    ],
    plantsList: [
      { name: "Ficus Benjamina (Large)", count: 2, condition: "Thriving" },
      { name: "Areca Palm (6ft)", count: 4, condition: "Healthy" },
      { name: "Japanese Grass Sod", count: "450 sqft", condition: "Lush Green" },
      { name: "Bonsai Bougainvillea", count: 1, condition: "In Bloom" },
    ],
    maintenanceSchedule: [
      { date: "05 September 2026", status: "Completed", staff: "Md. Rahim" },
      { date: "12 September 2026", status: "Completed", staff: "Abdul Halim" },
      { date: "19 September 2026", status: "Upcoming", staff: "Abdul Halim" },
      { date: "26 September 2026", status: "Scheduled", staff: "Md. Belal" },
    ],
    followUpDate: "15 October 2026",
    warrantyPeriod: "1 Year Waterproofing & 6 Months Plant Replacement Guarantee",
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText) return;
    setIsSubmittingReview(true);
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "Verified Client",
          rating: reviewRating,
          text: reviewText,
          service: "Rooftop Garden Design",
          location: "Dhanmondi, Dhaka",
          userId: user?.id,
        }),
      });
      setReviewSubmitted(true);
      setActionNotice("⭐ Your review has been submitted for moderation approval!");
      setTimeout(() => setActionNotice(null), 4000);
    } catch {
      setReviewSubmitted(true);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e8ece9]">
        <span className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 py-12 bg-[#e8ece9]">
        <div className="max-w-md w-full bg-white border border-emerald-100 rounded-3xl p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto">
            🌿
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Customer Portal</h1>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              আপনার প্রজেক্ট প্রোগ্রেস, ডিজিটাল সার্ভিস কার্ড, পেমেন্ট হিস্ট্রি ও মেইনটেন্যান্স দেখতে সাইন ইন করুন।
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-3.5 rounded-xl transition-all text-center shadow"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold py-3.5 rounded-xl transition-all text-center"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const clientDisplayName = user?.name || "Rafiq Ahmed";

  return (
    <div className="min-h-screen bg-[#e8ece9] flex p-3 md:p-6 font-sans text-gray-800">
      {/* Outer Rounded Frame matching user.png */}
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
              MENU
            </div>

            {/* Navigation items matching user.png */}
            <nav className="space-y-1.5">
              {[
                {
                  id: "overview",
                  label: "Dashboard Overview",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  ),
                },
                {
                  id: "projects",
                  label: "My Projects",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  ),
                },
                {
                  id: "consultation",
                  label: "Consultation Bookings",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  id: "payments",
                  label: "Payment History",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ),
                },
                {
                  id: "saved-designs",
                  label: "Saved Plant Designs",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  ),
                },
                {
                  id: "service-card",
                  label: "Digital Service Card",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  ),
                },
                {
                  id: "support",
                  label: "Support Requests",
                  icon: (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  ),
                },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
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
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer User Profile matching user.png */}
          <div className="pt-6 border-t border-emerald-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-800 border border-emerald-600/40 flex items-center justify-center font-bold text-sm text-emerald-200">
                {clientDisplayName[0]}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] text-gray-400 font-medium">Client:</span>
                <span className="text-xs font-bold text-white truncate max-w-[110px]">
                  {clientDisplayName}
                </span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Logout"
              className="text-gray-400 hover:text-rose-400 text-xs transition-colors p-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          
          {/* Topbar matching user.png */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-300/60">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-gray-900 tracking-tight">
                Welcome {clientDisplayName.split(" ")[0]}
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

              {/* Notification Button */}
              <button 
                title="Notifications"
                className="w-9 h-9 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-emerald-800 shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <Link
                href="/design-garden"
                className="bg-[#0b281b] hover:bg-[#061810] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Add new request</span>
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">+</span>
              </Link>
            </div>
          </div>

          {/* Action Notification Toast */}
          {actionNotice && (
            <div className="mt-4 p-3 bg-emerald-100 border border-emerald-400 text-emerald-900 rounded-2xl text-xs font-semibold animate-fade-in-up flex justify-between items-center">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice(null)} className="text-emerald-700 font-bold cursor-pointer">✕</button>
            </div>
          )}

          {/* Tab 1: Dashboard Overview matching user.png */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 animate-fade-in-up">
              
              {/* Left 2 Columns */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Header Title */}
                <div>
                  <h2 className="text-xl font-bold font-serif text-gray-900">My Garden Portal</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    An easy way to manage sales with care and precision.
                  </p>
                </div>

                {/* Row 1: Site Overview + Project Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Site Overview Dark Emerald Card */}
                  <div className="bg-[#0b261b] text-white p-6 rounded-3xl shadow-lg border border-emerald-900/60 flex flex-col justify-between min-h-[140px]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-semibold text-emerald-200/80">Site Overview</span>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-extrabold tracking-tight font-mono text-white">
                        $199,000.00
                      </div>
                    </div>
                  </div>

                  {/* Project Status Card */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 flex flex-col justify-between min-h-[140px]">
                    <span className="text-xs font-bold text-gray-800">Project Status</span>
                    
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                          <span className="text-gray-600 font-medium">Active Project:</span>
                        </div>
                        <span className="font-bold text-gray-900 font-serif">Rooftop Oasis</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                          <span className="text-gray-600 font-medium">Phase:</span>
                        </div>
                        <span className="font-bold text-emerald-800 font-medium">Implementation</span>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                          <span className="text-gray-600 font-medium">Timeline:</span>
                        </div>
                        <span className="font-bold text-gray-900 font-mono">70% Complete</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Project Milestones Horizontal Stepper matching user.png */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-900">Project Milestones</h3>
                    <button className="text-gray-400 hover:text-gray-600">•••</button>
                  </div>

                  {/* Stepper with progress bar */}
                  <div className="relative py-4 px-2">
                    {/* Background track line */}
                    <div className="absolute top-7 left-6 right-6 h-1 bg-gray-200 -z-0"></div>
                    {/* Active completed track line */}
                    <div className="absolute top-7 left-6 w-[70%] h-1 bg-[#1a5d3c] -z-0"></div>

                    {/* Nodes */}
                    <div className="flex justify-between items-center relative z-10">
                      {[
                        { name: "Consultation", status: "completed" },
                        { name: "Design", status: "completed" },
                        { name: "Approval", status: "completed" },
                        { name: "Implementation", status: "active" },
                        { name: "Handover", status: "pending" },
                      ].map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                            step.status === "completed"
                              ? "bg-[#1a5d3c] border-[#1a5d3c] text-white"
                              : step.status === "active"
                              ? "bg-white border-[#1a5d3c] ring-4 ring-emerald-100"
                              : "bg-white border-gray-300"
                          }`}>
                            {step.status === "completed" && (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {step.status === "active" && (
                              <span className="w-2 h-2 rounded-full bg-[#1a5d3c]"></span>
                            )}
                          </div>
                          <span className={`text-[11px] font-semibold ${
                            step.status === "active" ? "text-emerald-900 font-bold" : "text-gray-600"
                          }`}>
                            {step.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Row 3: Upcoming Consultation + Latest Project Photos Cards matching user.png */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Card 1: Upcoming Consultation */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">📋</span>
                        <h4 className="text-xs font-bold text-gray-900">Upcoming Consultation</h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Consultation &gt; Design plan for rooftop garden implementation.
                      </p>
                      <button 
                        onClick={() => setActiveTab("service-card")}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 underline mt-2 block"
                      >
                        View this stage →
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                          👨‍🌾
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-gray-800">Consultant Visit</span>
                          <span className="text-[10px] text-gray-400">Dr. Farhan (Tree Doctor)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setActionNotice("📅 Consultation request confirmed! Team will arrive as scheduled.");
                          setTimeout(() => setActionNotice(null), 3500);
                        }}
                        className="px-3 py-1 bg-[#195b3e] hover:bg-[#11402b] text-white rounded-lg text-[11px] font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>

                  {/* Card 2: Latest Project Photos */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold text-gray-900">Latest Project Photos</h4>
                        <button className="text-gray-400 hover:text-gray-600">•••</button>
                      </div>

                      {/* Photo Grid matching user.png */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
                          <img
                            src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&q=80"
                            alt="Before"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
                          <img
                            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"
                            alt="WIP"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-inner group">
                          <img
                            src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80"
                            alt="After"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📷</span>
                        <span className="text-[11px] font-bold text-gray-800">Approved Photos</span>
                      </div>
                      <Link
                        href="/gallery"
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold transition-all shadow-sm"
                      >
                        View All
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column Widget: Total View Performance + Promo Banner matching user.png */}
              <div className="space-y-6">
                
                {/* Total View Performance Donut Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col items-center text-center">
                  <h3 className="text-sm font-bold text-gray-900 mb-6 w-full text-left">
                    Total View Performance
                  </h3>

                  {/* Donut Chart Visualization matching user.png */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
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

                {/* Explore New Garden Ideas Banner Card matching user.png */}
                <div className="bg-[#cbdcc9] rounded-3xl p-6 shadow-sm border border-emerald-300/40 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                  {/* Decorative Sunburst SVG */}
                  <div className="absolute right-0 top-0 bottom-0 w-36 opacity-30 pointer-events-none">
                    <svg viewBox="0 0 100 100" fill="#8ce228">
                      <polygon points="50,0 60,35 100,50 60,65 50,100 40,65 0,50 40,35" />
                    </svg>
                  </div>

                  <div className="z-10">
                    <span className="text-2xl">🌿</span>
                    <h4 className="text-lg font-bold font-serif text-gray-900 mt-2 leading-snug">
                      Explore New Garden Ideas
                    </h4>
                    <p className="text-xs text-gray-700 mt-1 max-w-[200px] leading-relaxed">
                      An easy way to manage sales with care and precision.
                    </p>
                  </div>

                  <Link 
                    href="/gallery"
                    className="z-10 mt-4 w-full text-center bg-[#1b4332] hover:bg-[#123124] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer block"
                  >
                    Dream Garden Awaits
                  </Link>
                </div>

              </div>
            </div>
          )}

          {/* Tab 2: Digital Service Card (PDF #28) */}
          {activeTab === "service-card" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Official Certificate</span>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">
                    Digital Service Card (ডিজিটাল সার্ভিস কার্ড)
                  </h3>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  🖨️ Print Card
                </button>
              </div>

              {/* Printable Digital Certificate Design */}
              <div className="bg-gradient-to-br from-[#081c14] to-[#123828] text-white p-7 sm:p-9 rounded-[32px] shadow-2xl border-4 border-emerald-600/40 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] text-emerald-300 font-mono tracking-widest uppercase">
                      A R GREEN GARDEN • CLIENT WARRANTY & SERVICE PASSPORT
                    </span>
                    <h4 className="text-xl font-bold font-serif text-white mt-1">{serviceCard.projectName}</h4>
                    <p className="text-xs text-emerald-200/80 mt-0.5">Card ID: {serviceCard.cardNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600/80 rounded-full text-xs font-bold border border-emerald-400">
                    Active Warranty
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="font-bold text-emerald-300 uppercase tracking-wider block text-[11px]">
                      প্রকল্পের সেবাসমূহ (Services):
                    </span>
                    <ul className="space-y-1.5 text-emerald-100">
                      {serviceCard.services.map((s, i) => (
                        <li key={i} className="flex items-center gap-2">✓ {s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="font-bold text-emerald-300 uppercase tracking-wider block text-[11px]">
                      গাছের তালিকা (Plants Planted):
                    </span>
                    <ul className="space-y-1.5 text-emerald-100">
                      {serviceCard.plantsList.map((p, i) => (
                        <li key={i} className="flex justify-between">
                          <span>• {p.name} ({p.count})</span>
                          <span className="text-emerald-400 font-mono">{p.condition}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/10">
                  <div>
                    <span className="text-emerald-400 block text-[11px] font-bold">ওয়ারেন্টি শর্তাবলী (Warranty):</span>
                    <p className="text-white mt-0.5">{serviceCard.warrantyPeriod}</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 block text-[11px] font-bold">পরবর্তী ভিজিট / ফলো-আপ ডেট:</span>
                    <p className="text-white mt-0.5 font-bold font-mono text-sm">{serviceCard.followUpDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Payment History & Billing */}
          {activeTab === "payments" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Billing & Payments</span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">ইনভয়েস ও পেমেন্ট হিস্ট্রি</h3>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-gray-500 block">মোট প্রজেক্ট বাজেট:</span>
                  <span className="text-lg font-bold text-gray-900 font-mono">৳৩,৫০,০০০</span>
                </div>
                <div>
                  <span className="text-gray-500 block">পরিশোধিত (Paid Amount):</span>
                  <span className="text-lg font-bold text-emerald-700 font-mono">৳২,০০,০০০</span>
                </div>
                <div>
                  <span className="text-gray-500 block">বাকি টাকা (Due Amount):</span>
                  <span className="text-lg font-bold text-amber-600 font-mono">৳১,৫০,০০০</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500 uppercase border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">পরিমাণ</th>
                      <th className="py-3 px-4">পদ্ধতি</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">INV-2026-001</td>
                      <td className="py-3 px-4 text-gray-600">10 Aug 2026</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">৳১,০০,০০০</td>
                      <td className="py-3 px-4 text-gray-600">bKash Merchant</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">PAID</span></td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">INV-2026-002</td>
                      <td className="py-3 px-4 text-gray-600">01 Sep 2026</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">৳১,০০,০০০</td>
                      <td className="py-3 px-4 text-gray-600">Bank Transfer</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">PAID</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 4: Consultation Bookings & Tree Doctor */}
          {activeTab === "consultation" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Consultation & Healthcare</span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">ট্রি ডক্টর ও কন্সাল্টেশন শিডিউল</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">Dr. Farhan (Senior Tree Doctor)</h4>
                      <p className="text-xs text-gray-500">Rooftop Oasis Routine Inspection</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Confirmed</span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>📅 Scheduled: 28 September 2026 (11:00 AM)</p>
                    <p>📍 Location: 42/A, Road 9/A, Dhanmondi</p>
                    <p>🩺 Diagnosis: Ficus soil aeration & nutrient balance check</p>
                  </div>
                </div>

                <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-emerald-950">জরুরি ট্রি ডক্টর বুকিং প্রয়োজন?</h4>
                    <p className="text-xs text-emerald-800 mt-1">গাছের কোনো রোগ বা হঠাৎ পাতা শুকিয়ে যাওয়ার সমস্যা হলে তাৎক্ষণিক সহায়তা পান।</p>
                  </div>
                  <Link
                    href="/tree-doctor"
                    className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold text-center transition-all shadow-sm"
                  >
                    Emergency Tree Doctor বুক করুন
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Review & Feedback Submission */}
          {activeTab === "support" && (
            <div className="space-y-6 mt-6 max-w-2xl animate-fade-in-up">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Client Feedback & Review</span>
                <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">আপনার মূল্যবান রিভিউ ও রেটিং দিন</h3>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-2">রেটিং নির্বাচন করুন:</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                            star <= reviewRating ? "text-amber-400" : "text-gray-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">আপনার অভিজ্ঞতা লিখুন:</label>
                    <textarea
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="এ আর গ্রিন গার্ডেনের কাজের মান, সময়ানুবর্তিতা এবং ডিজাইন কেমন লেগেছে তা শেয়ার করুন..."
                      className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewText}
                    className="w-full py-3 bg-[#0b281b] hover:bg-[#061810] text-white rounded-xl text-xs font-bold transition-all shadow disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingReview ? "সাবমিট হচ্ছে..." : "রিভিউ সাবমিট করুন"}
                  </button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
