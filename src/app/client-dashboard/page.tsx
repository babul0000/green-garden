"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ClientDashboardPage() {
  const { user, loading: isPending, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Digital Service Card Data (PDF Requirement #28)
  const serviceCard = {
    cardNumber: "DSC-2026-DHANMONDI",
    projectName: "Dhanmondi Luxury Penthouse Retreat",
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
    } catch {
      setReviewSubmitted(true);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sage-light/30">
        <span className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-6 py-12 bg-emerald-50/20">
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

  return (
    <div className="bg-emerald-50/20 text-gray-900 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white border border-emerald-100 p-6 sm:p-8 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-serif font-bold text-2xl flex items-center justify-center shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold font-serif text-gray-900">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Verified Client
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Client ID: CLT-108 • Email: {user.email} • Location: Dhanmondi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto">
            <Link
              href="/#contact"
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              + New Service Request
            </Link>
            <button
              onClick={() => logout()}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Sidebar Tabs */}
          <div className="bg-white border border-emerald-100 p-3 rounded-2xl flex flex-col gap-1.5 shadow-sm">
            {[
              { id: "overview", label: "📊 প্রজেক্ট প্রোগ্রেস (Progress)" },
              { id: "service-card", label: "🪪 ডিজিটাল সার্ভিস কার্ড (Card)" },
              { id: "invoices", label: "🧾 কোটেশন ও ইনভয়েস (Billing)" },
              { id: "maintenance", label: "🔧 মেইনটেন্যান্স ও ট্রি ডক্টর" },
              { id: "review", label: "⭐ কাস্টমার রিভিউ ও রেটিং" },
              { id: "loyalty", label: "🎁 লয়্যালটি ও স্পেশাল অফার" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-left py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-emerald-800 text-white shadow-sm"
                    : "text-gray-700 hover:bg-emerald-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 bg-white border border-emerald-100 rounded-[32px] p-6 sm:p-8 shadow-sm min-h-[460px]">
            
            {/* TAB 1: Live Project Progress (Requirement #14 & #15) */}
            {activeTab === "overview" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Live Project Tracker</span>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">
                      {serviceCard.projectName}
                    </h3>
                    <p className="text-xs text-gray-500">📍 {serviceCard.location}</p>
                  </div>
                  <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    ৭৫% সম্পন্ন (Phase 3)
                  </span>
                </div>

                {/* Milestone Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>প্রোগ্রেস মাইলস্টোন</span>
                    <span className="text-emerald-800">75% Complete</span>
                  </div>
                  <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-700" style={{ width: "75%" }}></div>
                  </div>
                </div>

                {/* Milestones Flow */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
                  {[
                    { step: "0%", name: "Planning & Soil Test", status: "completed" },
                    { step: "25%", name: "Waterproofing", status: "completed" },
                    { step: "50%", name: "Irrigation Setup", status: "completed" },
                    { step: "75%", name: "Planting & Grass", status: "current" },
                    { step: "100%", name: "Final Handover", status: "upcoming" },
                  ].map((m, idx) => (
                    <div key={idx} className="p-3 rounded-xl border bg-gray-50 space-y-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                        m.status === "current" ? "bg-amber-100 text-amber-800 font-extrabold" : "text-gray-400"
                      }`}>
                        {m.step}
                      </span>
                      <p className="font-semibold text-gray-800 text-[11px] mt-1">{m.name}</p>
                    </div>
                  ))}
                </div>

                {/* Approved Progress Photos: Before -> WIP -> After (Requirement #15) */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  <h4 className="font-bold text-sm text-gray-900 font-serif">
                    অনুমোদিত প্রজেক্ট ফটো টাইমলাইন (Project Photos)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-gray-500 uppercase">Before (পূর্বাবস্থা)</span>
                      <div className="aspect-[16/11] rounded-2xl overflow-hidden border shadow-sm">
                        <img
                          src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&q=80"
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-600 uppercase">Work in Progress (চলমান)</span>
                      <div className="aspect-[16/11] rounded-2xl overflow-hidden border shadow-sm">
                        <img
                          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80"
                          alt="WIP"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-700 uppercase">Target After Design (চূড়ান্ত)</span>
                      <div className="aspect-[16/11] rounded-2xl overflow-hidden border shadow-sm">
                        <img
                          src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80"
                          alt="After"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Digital Service Card (Requirement #28) */}
            {activeTab === "service-card" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Official Certificate</span>
                    <h3 className="text-2xl font-serif font-bold text-gray-900">
                      Digital Service Card (ডিজিটাল সার্ভিস কার্ড)
                    </h3>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold shadow-sm transition-all"
                  >
                    🖨️ Print Card
                  </button>
                </div>

                {/* Printable Digital Certificate Design */}
                <div className="bg-gradient-to-br from-emerald-950 to-teal-900 text-white p-7 sm:p-9 rounded-[32px] shadow-2xl border-4 border-emerald-700/60 space-y-6 relative overflow-hidden">
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

                  {/* 2-column details */}
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

                  {/* Warranty & Followup */}
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

            {/* TAB 3: Invoices & Payment (Requirement #17) */}
            {activeTab === "invoices" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Billing & Payments</span>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">ইনভয়েস ও পেমেন্ট হিস্ট্রি</h3>
                </div>

                <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
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

                {/* Invoices Table */}
                <div className="border border-gray-200 rounded-2xl overflow-hidden">
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
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">INV-2026-001</td>
                        <td className="py-3.5 px-4">10 Aug 2026</td>
                        <td className="py-3.5 px-4 font-bold">৳১,৫০,০০০</td>
                        <td className="py-3.5 px-4">Bank Transfer</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Paid</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">INV-2026-002</td>
                        <td className="py-3.5 px-4">01 Sep 2026</td>
                        <td className="py-3.5 px-4 font-bold">৳৫০,০০০</td>
                        <td className="py-3.5 px-4">Bkash Merchant</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Paid</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">INV-2026-003</td>
                        <td className="py-3.5 px-4">25 Sep 2026</td>
                        <td className="py-3.5 px-4 font-bold">৳১,৫০,০০০</td>
                        <td className="py-3.5 px-4">-</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Due</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Maintenance & Tree Doctor Visits */}
            {activeTab === "maintenance" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Scheduled Care</span>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">মেইনটেন্যান্স ও ট্রি ডক্টর শিডিউল</h3>
                  <p className="text-xs text-gray-500">আপনার বাগানের পরিচর্যা ও ডাক্তারের পরিদর্শন লগ।</p>
                </div>

                <div className="space-y-3">
                  {serviceCard.maintenanceSchedule.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-gray-900 font-mono">{item.date}</span>
                        <p className="text-gray-500 mt-0.5">Assigned Specialist: {item.staff}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${
                        item.status === "Completed" ? "bg-emerald-100 text-emerald-800" :
                        item.status === "Upcoming" ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-700"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Link
                    href="/tree-doctor"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    <span>🩺</span> ট্রি ডক্টর ভিজিট রিকোয়েস্ট করুন
                  </Link>
                </div>
              </div>
            )}

            {/* TAB 5: Review & Rating (Requirement #26) */}
            {activeTab === "review" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Share Your Feedback</span>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">প্রজেক্ট রিভিউ ও রেটিং দিন</h3>
                  <p className="text-xs text-gray-500">আপনার মূল্যবান মতামত সরাসরি আমাদের ওয়েবসাইটে প্রদর্শিত হবে।</p>
                </div>

                {reviewSubmitted ? (
                  <div className="text-center py-10 bg-emerald-50/50 rounded-2xl p-6 space-y-3">
                    <span className="text-4xl">🌟</span>
                    <h4 className="text-lg font-bold font-serif text-gray-900">ধন্যবাদ আপনার চমৎকার মতামতের জন্য!</h4>
                    <p className="text-xs text-gray-600">আপনার রিভিউটি হোমপেজের 'Customer Reviews' সেকশনে যুক্ত করা হয়েছে।</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="font-bold text-gray-700 uppercase tracking-wider block mb-1">স্টার রেটিং (Rating)</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className={`text-2xl cursor-pointer transition-transform ${
                              star <= reviewRating ? "text-amber-400 scale-110" : "text-gray-300"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-700 uppercase tracking-wider block">আপনার রিভিউ লিখুন</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="আমাদের সার্ভিস, কাজের মান ও গার্ডেনের রূপান্তর কেমন লেগেছে তা লিখুন..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 py-3 px-4 rounded-xl focus:border-emerald-600 focus:outline-none resize-none text-xs"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                    >
                      {isSubmittingReview ? "রিভিউ জমা হচ্ছে..." : "✓ সাবমিট রিভিউ"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 6: Loyalty Rewards (Requirement #27) */}
            {activeTab === "loyalty" && (
              <div className="space-y-6 animate-fade-in-up">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Loyalty Perks</span>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">কাস্টমার লয়্যালটি ও সুবিধা</h3>
                  <p className="text-xs text-gray-500">নিয়মিত গ্রাহক হিসেবে আপনার জন্য বিশেষ ছাড় ও উপহার।</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 space-y-2">
                    <span className="text-2xl">🎁</span>
                    <h4 className="font-bold text-sm text-gray-900">Repeat Customer 10% Discount</h4>
                    <p className="text-gray-600">পরবর্তী যেকোনো গার্ডেন রেনোভেশন বা নতুন গাছে পাচ্ছেন ফ্ল্যাট ১০% ডিসকাউন্ট।</p>
                    <div className="bg-white p-2 rounded-lg font-mono font-bold text-emerald-800 text-center border border-emerald-200">
                      PROMO: ARGREEN-VIP10
                    </div>
                  </div>

                  <div className="bg-teal-50 p-5 rounded-2xl border border-teal-200 space-y-2">
                    <span className="text-2xl">🤝</span>
                    <h4 className="font-bold text-sm text-gray-900">Referral Reward Program</h4>
                    <p className="text-gray-600">আপনার রেফারেন্সে কোনো বন্ধু বা পরিচিত ল্যান্ডস্কেপিং করালে ১ মাসের ফ্রি মালী সার্ভিস পাবেন।</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
