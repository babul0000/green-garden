"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface ProjectItem {
  id: string;
  name: string;
  category: string;
  location: string;
  budget?: number;
  totalExpense?: number;
  progress: number;
  status: string;
  clientName?: string;
  startDate?: string;
  deadline?: string;
  beforePhotos?: string[];
  wipPhotos?: string[];
  afterPhotos?: string[];
}

interface InvoiceItem {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  createdAt: string;
  payments?: { amount: number; paymentMethod: string; paymentDate: string }[];
}

interface TreeDoctorItem {
  id: string;
  treeName: string;
  problem: string;
  location: string;
  status: string;
  isEmergency: boolean;
  preferredVisitTime?: string;
  treePhotoUrl?: string;
  assignedDoctor?: { name: string; designation: string };
  createdAt: string;
}

interface PlantHealthItem {
  id: string;
  plantName: string;
  location: string;
  diseaseHistory?: string;
  treatment?: string;
  fertilizer?: string;
  nextMaintenanceDate?: string;
  doctorReport?: string;
}

interface MaintenanceItem {
  id: string;
  frequency: string;
  scheduledDate: string;
  status: string;
  location: string;
  notes?: string;
  assignedStaff?: { name: string; designation: string };
}

export default function ClientDashboardPage() {
  const { user, loading: isPending, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Real Database States
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [treeRequests, setTreeRequests] = useState<TreeDoctorItem[]>([]);
  const [plantRecords, setPlantRecords] = useState<PlantHealthItem[]>([]);
  const [maintenanceList, setMaintenanceList] = useState<MaintenanceItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch real client data from PostgreSQL
  const fetchClientData = async () => {
    setDataLoading(true);
    try {
      const [projRes, invRes, treeRes, plantRes, maintRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/invoices"),
        fetch("/api/tree-doctor"),
        fetch("/api/plant-health"),
        fetch("/api/maintenance"),
      ]);

      if (projRes.ok) {
        const pData = await projRes.json();
        setProjects(Array.isArray(pData) ? pData : []);
      }
      if (invRes.ok) {
        const iData = await invRes.json();
        setInvoices(Array.isArray(iData) ? iData : []);
      }
      if (treeRes.ok) {
        const tData = await treeRes.json();
        setTreeRequests(Array.isArray(tData) ? tData : []);
      }
      if (plantRes.ok) {
        const plData = await plantRes.json();
        setPlantRecords(Array.isArray(plData) ? plData : []);
      }
      if (maintRes.ok) {
        const mData = await maintRes.json();
        setMaintenanceList(mData.schedules || []);
      }
    } catch (err) {
      console.error("Error loading client dashboard data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [user]);

  // Active Project (first running or latest project)
  const activeProject =
    projects.find((p) => p.status === "RUNNING") || projects[0] || null;

  // Real calculations
  const totalBudget =
    activeProject?.budget ||
    invoices.reduce((acc, i) => acc + (i.totalAmount || 0), 0) ||
    250000;
  const totalPaid = invoices.reduce((acc, i) => acc + (i.paidAmount || 0), 0);
  const totalDue = Math.max(0, totalBudget - totalPaid);
  const projectProgress = activeProject?.progress ?? 70;

  // Dynamic Milestones
  const milestones = [
    { name: "Consultation", done: projectProgress >= 15, active: projectProgress < 25 },
    { name: "Design Plan", done: projectProgress >= 35, active: projectProgress >= 25 && projectProgress < 50 },
    { name: "Approval", done: projectProgress >= 50, active: projectProgress >= 50 && projectProgress < 70 },
    { name: "Implementation", done: projectProgress >= 75, active: projectProgress >= 70 && projectProgress < 100 },
    { name: "Handover", done: projectProgress >= 100, active: projectProgress >= 100 },
  ];

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
          service: activeProject?.category || "Rooftop Garden Design",
          location: activeProject?.location || "Dhaka, Bangladesh",
          userId: user?.id,
        }),
      });
      setReviewSubmitted(true);
      setActionNotice("⭐ আপনার রিভিউ অ্যাডমিন অ্যাপ্রুভালের জন্য জমা হয়েছে! ধন্যবাদ।");
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

  const clientDisplayName = user?.name || "Client Member";

  return (
    <div className="min-h-screen bg-[#e8ece9] flex p-3 md:p-6 font-sans text-gray-800">
      {/* Outer Frame */}
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

            {/* Navigation items */}
            <nav className="space-y-1.5">
              {[
                {
                  id: "overview",
                  label: "Dashboard Overview",
                  icon: "📊",
                },
                {
                  id: "projects",
                  label: `My Projects (${projects.length})`,
                  icon: "🌿",
                },
                {
                  id: "consultation",
                  label: `Tree Doctor & Visits (${treeRequests.length})`,
                  icon: "🩺",
                },
                {
                  id: "payments",
                  label: `Payment History (${invoices.length})`,
                  icon: "💳",
                },
                {
                  id: "service-card",
                  label: "Digital Service Card",
                  icon: "🪪",
                },
                {
                  id: "support",
                  label: "Feedback & Review",
                  icon: "⭐",
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

          {/* Footer User Profile */}
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
              className="text-gray-400 hover:text-rose-400 text-xs transition-colors p-1.5 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          {/* Topbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-300/60">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-gray-900 tracking-tight">
                স্বাগতম, {clientDisplayName.split(" ")[0]}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Verified Client
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  placeholder="প্রজেক্ট বা সেবা খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/80 border border-gray-300 rounded-full px-4 py-2 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700 shadow-sm"
                />
                <svg className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <Link
                href="/design-garden"
                className="bg-[#0b281b] hover:bg-[#061810] text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>+ নতুন প্রজেক্ট রিকোয়েস্ট</span>
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

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 animate-fade-in-up">
              <div className="xl:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold font-serif text-gray-900">লাইভ প্রজেক্ট ড্যাশবোর্ড</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    আপনার চলমান ল্যান্ডস্কেপিং প্রজেক্টের লাইভ অগ্রগতি ও আর্থিক বিবরণ।
                  </p>
                </div>

                {/* Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Site Budget Overview */}
                  <div className="bg-[#0b261b] text-white p-6 rounded-3xl shadow-lg border border-emerald-900/60 flex flex-col justify-between min-h-[140px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-semibold text-emerald-200/80">প্রজেক্ট বাজেট ও ইনভয়েস</span>
                      </div>
                      <span className="text-[10px] bg-emerald-800/80 px-2 py-0.5 rounded-full text-emerald-200">
                        {invoices.length > 0 ? `${invoices.length}টি ইনভয়েস` : "Standard"}
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="text-3xl font-extrabold tracking-tight font-mono text-white">
                        ৳{totalBudget.toLocaleString()}
                      </div>
                      <div className="flex justify-between items-center text-xs mt-2 text-emerald-200/80 border-t border-emerald-800/60 pt-2">
                        <span>পরিশোধ: ৳{totalPaid.toLocaleString()}</span>
                        <span className="text-[#91cd3d] font-bold">বাকি: ৳{totalDue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Status */}
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/80 flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800">চলমান প্রজেক্ট স্ট্যাটাস</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {activeProject?.status || "RUNNING"}
                      </span>
                    </div>

                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">প্রজেক্টের নাম:</span>
                        <span className="font-bold text-gray-900 font-serif truncate max-w-[160px]">
                          {activeProject?.name || "Rooftop Garden Oasis"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">লোকেশন:</span>
                        <span className="font-bold text-gray-700 font-sans">
                          {activeProject?.location || "Dhanmondi, Dhaka"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 font-medium">অগ্রগতি:</span>
                        <span className="font-bold text-emerald-800 font-mono">
                          {projectProgress}% সম্পন্ন
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">Project Milestones (ধাপভিত্তিক অগ্রগতি)</h3>
                      <p className="text-[11px] text-gray-500">প্রজেক্টের বর্তমান অগ্রগতি: {projectProgress}%</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Phase {milestones.filter((m) => m.done).length} of 5
                    </span>
                  </div>

                  <div className="relative py-4 px-2">
                    <div className="absolute top-7 left-6 right-6 h-1 bg-gray-200 -z-0"></div>
                    <div
                      className="absolute top-7 left-6 h-1 bg-[#1a5d3c] -z-0 transition-all duration-500"
                      style={{ width: `${Math.min(100, projectProgress)}%` }}
                    ></div>

                    <div className="flex justify-between items-center relative z-10">
                      {milestones.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              step.done
                                ? "bg-[#1a5d3c] border-[#1a5d3c] text-white"
                                : step.active
                                ? "bg-white border-[#1a5d3c] ring-4 ring-emerald-100"
                                : "bg-white border-gray-300"
                            }`}
                          >
                            {step.done ? (
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : step.active ? (
                              <span className="w-2 h-2 rounded-full bg-[#1a5d3c]"></span>
                            ) : null}
                          </div>
                          <span
                            className={`text-[11px] font-semibold ${
                              step.active
                                ? "text-emerald-900 font-bold"
                                : step.done
                                ? "text-gray-800"
                                : "text-gray-400"
                            }`}
                          >
                            {step.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Upcoming Consultation & Project Photos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tree Doctor / Visit Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🩺</span>
                        <h4 className="text-xs font-bold text-gray-900">আসন্ন পরিদর্শন ও ট্রি ডক্টর</h4>
                      </div>
                      {treeRequests.length > 0 ? (
                        <div className="text-xs text-gray-600 space-y-1">
                          <p className="font-bold text-gray-900">{treeRequests[0].treeName}</p>
                          <p className="text-gray-500">সমস্যা: {treeRequests[0].problem}</p>
                          <p className="text-emerald-700 font-medium">
                            স্টাফ: {treeRequests[0].assignedDoctor?.name || "ডাক্তার অ্যাসাইনমেন্ট প্রক্রিয়াধীন"}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">
                          বর্তমানে কোনো পেন্ডিং ভিজিট নেই। যেকোনো সময় জরুরি ট্রি ডক্টর কল করতে পারেন।
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        href="/tree-doctor"
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900"
                      >
                        + নতুন ভিজিট বুক করুন →
                      </Link>
                      <button
                        onClick={() => setActiveTab("consultation")}
                        className="px-3 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-[11px] font-bold rounded-lg"
                      >
                        বিস্তারিত
                      </button>
                    </div>
                  </div>

                  {/* Project Photos */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-bold text-gray-900">সাইট ফটো টাইমলাইন</h4>
                        <span className="text-[10px] text-gray-400">PostgreSQL Verified</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(activeProject?.beforePhotos?.[0] || activeProject?.wipPhotos?.[0] || activeProject?.afterPhotos?.[0]) ? (
                          <>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                              <img
                                src={activeProject?.beforePhotos?.[0] || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&q=80"}
                                alt="Before"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                              <img
                                src={activeProject?.wipPhotos?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"}
                                alt="WIP"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                              <img
                                src={activeProject?.afterPhotos?.[0] || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80"}
                                alt="After"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="col-span-3 text-center py-6 text-xs text-gray-400">
                            কোনো ছবি আপলোড করা হয়নি
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-gray-500">Before • WIP • After</span>
                      <Link
                        href="/gallery"
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-bold"
                      >
                        গ্যালারি দেখুন
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Widget */}
              <div className="space-y-6">
                {/* Maintenance Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200/80">
                  <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
                    <span>🗓️ রক্ষণাবেক্ষণ শিডিউল</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                      {maintenanceList.length}টি শিডিউল
                    </span>
                  </h3>

                  <div className="space-y-2.5">
                    {maintenanceList.slice(0, 4).map((m, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-gray-900 block">
                            📅 {new Date(m.scheduledDate).toLocaleDateString("bn-BD")}
                          </span>
                          <span className="text-[10px] text-gray-500">{m.notes || m.frequency}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          m.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-blue-50 text-blue-700"
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                    {maintenanceList.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">বর্তমানে কোনো শিডিউল নেই</p>
                    )}
                  </div>
                </div>

                {/* Hotline Banner */}
                <div className="bg-gradient-to-br from-[#06120c] to-[#0f3822] text-white rounded-3xl p-6 shadow-lg border border-emerald-800/40 relative overflow-hidden">
                  <span className="text-2xl">🌱</span>
                  <h4 className="text-base font-bold font-serif text-white mt-2">
                    ২৪/৭ বিশেষজ্ঞ সহায়তা
                  </h4>
                  <p className="text-xs text-emerald-200/80 mt-1 leading-relaxed">
                    আপনার বাগানের যেকোনো সমস্যা বা নতুন ডিজাইনের জন্য সরাসরি হটলাইনে যোগাযোগ করুন।
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#91cd3d]">01620692449</span>
                    <a
                      href="tel:01620692449"
                      className="px-3 py-1 bg-[#91cd3d] text-[#06120c] font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      কল করুন
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Project Portfolio</span>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">আমার সকল প্রজেক্টসমূহ ({projects.length})</h3>
                </div>
                <Link
                  href="/design-garden"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  + নতুন প্রজেক্ট শুরু করুন
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                          {proj.category}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          proj.status === "COMPLETED" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-gray-900 text-lg">{proj.name}</h4>
                      <p className="text-xs text-gray-500">📍 {proj.location}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600 font-medium">
                        <span>অগ্রগতি</span>
                        <span className="font-mono font-bold text-emerald-800">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-gray-400 block">বাজেট</span>
                        <span className="font-mono font-bold text-gray-900">৳{(proj.budget || 0).toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab("service-card")}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        সার্ভিস কার্ড দেখুন →
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="col-span-3 text-center py-12 bg-white rounded-3xl border border-gray-200">
                    <p className="text-sm text-gray-500">আপনার কোনো সক্রিয় প্রজেক্ট নেই।</p>
                    <Link
                      href="/design-garden"
                      className="mt-3 inline-block px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      এখনই গার্ডেন ডিজাইন করুন
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TREE DOCTOR & VISITS */}
          {activeTab === "consultation" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Plant Healthcare</span>
                  <h3 className="text-2xl font-serif font-bold text-gray-900">ট্রি ডক্টর ও স্বাস্থ্য পরিদর্শন ({treeRequests.length})</h3>
                </div>
                <Link
                  href="/tree-doctor"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  + জরুরি ট্রি ডক্টর কল করুন
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {treeRequests.map((req) => (
                  <div key={req.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">গাছ ও সমস্যা</span>
                        <h4 className="font-bold text-gray-900 text-base font-serif">{req.treeName}</h4>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {req.isEmergency && (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            🚨 Emergency
                          </span>
                        )}
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-xs space-y-1.5">
                      <p className="text-gray-700"><strong className="text-gray-900">সমস্যা:</strong> {req.problem}</p>
                      <p className="text-gray-700"><strong className="text-gray-900">লোকেশন:</strong> {req.location}</p>
                      <p className="text-emerald-800 font-semibold">
                        <strong>দায়িত্বপ্রাপ্ত ডাক্তার:</strong> {req.assignedDoctor?.name || "অ্যাসাইনমেন্ট প্রক্রিয়াধীন"}
                      </p>
                    </div>

                    <div className="text-[11px] text-gray-400 flex justify-between items-center pt-2">
                      <span>বুকিং তারিখ: {new Date(req.createdAt).toLocaleDateString("bn-BD")}</span>
                      <a
                        href="tel:01620692449"
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        📞 ডাক্তারের সাথে কথা বলুন
                      </a>
                    </div>
                  </div>
                ))}

                {treeRequests.length === 0 && (
                  <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-gray-200">
                    <p className="text-sm text-gray-500">বর্তমানে কোনো ট্রি ডক্টর অনুরোধ নেই।</p>
                    <Link
                      href="/tree-doctor"
                      className="mt-3 inline-block px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      ট্রি ডক্টর বুক করুন
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT HISTORY & BILLING */}
          {activeTab === "payments" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Billing & Financials</span>
                <h3 className="text-2xl font-serif font-bold text-gray-900">ইনভয়েস ও পেমেন্ট হিস্ট্রি</h3>
              </div>

              {/* Financial KPI bar */}
              <div className="bg-white p-5 rounded-3xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-sm">
                <div>
                  <span className="text-gray-500 block">মোট প্রজেক্ট বাজেট:</span>
                  <span className="text-xl font-bold text-gray-900 font-mono">৳{totalBudget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">পরিশোধিত (Paid Amount):</span>
                  <span className="text-xl font-bold text-emerald-700 font-mono">৳{totalPaid.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">বাকি টাকা (Due Amount):</span>
                  <span className="text-xl font-bold text-amber-600 font-mono">৳{totalDue.toLocaleString()}</span>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="border border-gray-200 rounded-3xl overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 font-bold uppercase border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">মোট বিল</th>
                      <th className="py-3 px-4">পরিশোধ</th>
                      <th className="py-3 px-4">বাকি</th>
                      <th className="py-3 px-4">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{inv.invoiceNumber}</td>
                        <td className="py-3.5 px-4 text-gray-600">{new Date(inv.createdAt).toLocaleDateString("bn-BD")}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">৳{inv.totalAmount.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-mono text-emerald-700">৳{inv.paidAmount.toLocaleString()}</td>
                        <td className="py-3.5 px-4 font-mono text-red-600 font-bold">৳{inv.dueAmount.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === "PAID" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-400">
                          কোনো ইনভয়েস পাওয়া যায়নি
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: DIGITAL SERVICE CARD */}
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
                  🖨️ Print Certificate
                </button>
              </div>

              {/* Printable Certificate */}
              <div className="bg-gradient-to-br from-[#081c14] to-[#123828] text-white p-7 sm:p-9 rounded-[32px] shadow-2xl border-4 border-emerald-600/40 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] text-emerald-300 font-mono tracking-widest uppercase">
                      A R GREEN GARDEN • CLIENT WARRANTY & SERVICE PASSPORT
                    </span>
                    <h4 className="text-xl font-bold font-serif text-white mt-1">
                      {activeProject?.name || "Rooftop Oasis Luxury Retreat"}
                    </h4>
                    <p className="text-xs text-emerald-200/80 mt-0.5">
                      লোকেশন: {activeProject?.location || "Dhanmondi, Dhaka"} • ক্লায়েন্ট: {clientDisplayName}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600/80 rounded-full text-xs font-bold border border-emerald-400">
                    Active Guarantee
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="font-bold text-emerald-300 uppercase tracking-wider block text-[11px]">
                      প্রকল্পের বৈশিষ্ট্য ও কাজ:
                    </span>
                    <ul className="space-y-1.5 text-emerald-100">
                      <li className="flex items-center gap-2">✓ 3-Layer Waterproofing & Drainage Grid</li>
                      <li className="flex items-center gap-2">✓ Automated Smart Micro-Drip Irrigation</li>
                      <li className="flex items-center gap-2">✓ Premium Lawn & Garden Landscaping</li>
                      <li className="flex items-center gap-2">✓ Soil Nutrient Balancing & Bio-Fertilizing</li>
                    </ul>
                  </div>

                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="font-bold text-emerald-300 uppercase tracking-wider block text-[11px]">
                      রোপিত মূল্যবান গাছের হেলথ রেকর্ড:
                    </span>
                    <ul className="space-y-1.5 text-emerald-100">
                      {plantRecords.slice(0, 4).map((p, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>• {p.plantName}</span>
                          <span className="text-emerald-400 font-mono text-[10px]">
                            {p.diseaseHistory ? "Treated" : "Thriving"}
                          </span>
                        </li>
                      ))}
                      {plantRecords.length === 0 && (
                        <>
                          <li className="flex justify-between"><span>• Ficus Benjamina</span><span className="text-emerald-400">Healthy</span></li>
                          <li className="flex justify-between"><span>• Areca Palm</span><span className="text-emerald-400">Healthy</span></li>
                          <li className="flex justify-between"><span>• Japanese Grass</span><span className="text-emerald-400">Lush Green</span></li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-white/10">
                  <div>
                    <span className="text-emerald-400 block text-[11px] font-bold">ওয়ারেন্টি শর্তাবলী:</span>
                    <p className="text-white mt-0.5">১ বছরের ওয়াটারপ্রুফিং ও ৬ মাসের ফ্রি গাছ প্রতিস্থাপন গ্যারান্টি।</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 block text-[11px] font-bold">জরুরি ট্রি ডক্টর হটলাইন:</span>
                    <p className="text-white mt-0.5 font-mono font-bold text-sm">01620692449</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FEEDBACK & REVIEW */}
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
