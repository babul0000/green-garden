"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import WeatherPlantCareWidget from "@/components/WeatherPlantCareWidget";

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
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get("payment");
      const tranId = params.get("tran_id");
      if (paymentStatus === "success") {
        setActionNotice(`✅ ধন্যবাদ! আপনার পেমেন্ট সফলভাবে সম্পন্ন হয়েছে। (ট্রানজ্যাকশন: ${tranId || ""})`);
      } else if (paymentStatus === "cancelled") {
        setActionNotice("⚠️ পেমেন্ট বাতিল করা হয়েছে।");
      } else if (paymentStatus === "failed") {
        setActionNotice("❌ পেমেন্ট সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
      }
    }
  }, [user]);

  const [isPayingInvoice, setIsPayingInvoice] = useState<string | null>(null);

  const handlePayInvoice = async (inv: InvoiceItem) => {
    setIsPayingInvoice(inv.id);
    try {
      const res = await fetch("/api/payments/sslcommerz/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: inv.dueAmount || inv.totalAmount,
          customerName: user?.name || "Client",
          customerPhone: user?.phone || "01883012641",
          customerEmail: user?.email || "babulhossan.dev@gmail.com",
          productName: `ইনভয়েস #${inv.invoiceNumber} পেমেন্ট`,
          invoiceId: inv.id,
        }),
      });
      const data = await res.json();
      if (data.gatewayUrl) {
        window.location.href = data.gatewayUrl;
      } else {
        alert(data.error || "পেমেন্ট গেটওয়ে লোড করা সম্ভব হয়নি");
      }
    } catch {
      alert("পেমেন্ট প্রক্রিয়া শুরু করতে ব্যর্থ হয়েছে");
    } finally {
      setIsPayingInvoice(null);
    }
  };

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
      <div className="flex items-center justify-center min-h-screen bg-[#121A14] text-white">
        <span className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-[92vh] flex flex-col items-center justify-center bg-[#121A14] text-white px-4 sm:px-6 py-16 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md w-full bg-[#18221A]/90 backdrop-blur-xl border border-white/15 rounded-[32px] p-8 text-center shadow-2xl space-y-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🌿
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
              A R Green Garden Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#E4E2D7]">
              {t("ক্লায়েন্ট পোর্টাল", "Client Portal")}
            </h1>
            <p className="text-xs text-white/60 mt-2 leading-relaxed">
              {t(
                "আপনার প্রজেক্ট প্রোগ্রেস, ডিজিটাল সার্ভিস কার্ড, পেমেন্ট হিস্ট্রি ও মেইনটেন্যান্স দেখতে সাইন ইন করুন।",
                "Sign in to view your landscape progress, digital service card, invoice history and maintenance calendar."
              )}
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Link
              href="/login"
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold font-mono py-3.5 rounded-xl transition-all text-center shadow-lg shadow-emerald-500/20"
            >
              {t("সাইন ইন", "Sign In")}
            </Link>
            <Link
              href="/register"
              className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs font-bold font-mono py-3.5 rounded-xl transition-all text-center"
            >
              {t("রেজিস্টার", "Register")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const clientDisplayName = user?.name || "Client Member";

  return (
    <div className="min-h-screen bg-[#121A14] text-[#E4E2D7] relative overflow-hidden font-sans p-3 md:p-6">
      {/* Background Architectural Ambient Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Outer Studio Glass Frame */}
      <div className="w-full max-w-[1600px] mx-auto bg-[#18221A]/85 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-white/10 flex overflow-hidden min-h-[920px] relative z-10">
        
        {/* ================= 1. DESKTOP PERMANENT SIDEBAR (Laptop/Desktop) ================= */}
        <aside className="hidden lg:flex w-64 bg-[#0d1610]/95 backdrop-blur-xl border-r border-white/10 text-white flex-col justify-between p-6 shrink-0">
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
                  Client Portal
                </span>
              </div>
            </div>

            {/* Menu Label */}
            <div className="text-[10px] font-mono uppercase font-bold tracking-widest text-white/40 mb-4 px-2">
              {t("মেন্যু", "MENU")}
            </div>

            {/* Navigation items */}
            <nav className="space-y-1.5">
              {[
                { id: "overview", label: "Dashboard Overview", icon: "📊" },
                { id: "projects", label: `My Projects (${projects.length})`, icon: "🌿" },
                { id: "consultation", label: `Tree Doctor & Visits (${treeRequests.length})`, icon: "🩺" },
                { id: "payments", label: `Payment History (${invoices.length})`, icon: "💳" },
                { id: "service-card", label: "Digital Service Card", icon: "🪪" },
                { id: "loyalty", label: "Loyalty & Rewards", icon: "🎁" },
                { id: "support", label: "Feedback & Review", icon: "⭐" },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
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
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer User Profile */}
          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-950 border border-emerald-500/40 flex items-center justify-center font-bold text-sm text-emerald-300">
                {clientDisplayName[0]}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Client:</span>
                <span className="text-xs font-bold text-[#E4E2D7] truncate max-w-[110px]">
                  {clientDisplayName}
                </span>
              </div>
            </div>
            <button
              onClick={() => logout()}
              title="Logout"
              className="text-white/40 hover:text-rose-400 text-xs transition-colors p-1.5 cursor-pointer rounded-lg hover:bg-white/5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ================= 2. MOBILE SLIDE-IN DRAWER (< lg screens) ================= */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
            mobileDrawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className={`fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ${
              mobileDrawerOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <aside
            className={`relative w-[280px] max-w-[85vw] h-full bg-[#0d1610]/98 backdrop-blur-2xl border-r border-white/15 text-white flex flex-col justify-between p-6 z-10 transition-transform duration-300 ease-out ${
              mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-base text-emerald-400">
                    🌿
                  </div>
                  <div>
                    <span className="text-sm font-display font-bold text-[#E4E2D7] block leading-tight">
                      A R Green Garden
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest block">
                      Client Portal
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 text-white/70 hover:text-white flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>

              <nav className="space-y-1.5">
                {[
                  { id: "overview", label: "Dashboard Overview", icon: "📊" },
                  { id: "projects", label: `My Projects (${projects.length})`, icon: "🌿" },
                  { id: "consultation", label: `Tree Doctor & Visits (${treeRequests.length})`, icon: "🩺" },
                  { id: "payments", label: `Payment History (${invoices.length})`, icon: "💳" },
                  { id: "service-card", label: "Digital Service Card", icon: "🪪" },
                  { id: "loyalty", label: "Loyalty & Rewards", icon: "🎁" },
                  { id: "support", label: "Feedback & Review", icon: "⭐" },
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "text-stone-950 bg-emerald-400 font-bold shadow-lg shadow-emerald-500/20"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center font-bold text-xs text-emerald-300">
                  {clientDisplayName[0]}
                </div>
                <span className="text-xs font-bold text-[#E4E2D7] truncate max-w-[120px]">
                  {clientDisplayName}
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="text-xs text-rose-400 hover:text-rose-300 font-mono"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>

        {/* ================= MAIN CONTENT AREA ================= */}
        <main className="flex-1 flex flex-col p-6 md:p-8 overflow-y-auto">
          {/* Topbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Mobile Drawer Button */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden flex items-center justify-center p-2 rounded-xl bg-white/5 border border-white/15 text-[#E4E2D7] hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Open Navigation Drawer"
              >
                <div className="flex flex-col gap-1 w-5">
                  <span className="w-full h-[1.5px] bg-[#E4E2D7]"></span>
                  <span className="w-full h-[1.5px] bg-[#E4E2D7]"></span>
                  <span className="w-full h-[1.5px] bg-[#E4E2D7]"></span>
                </div>
              </button>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7] tracking-tight">
                Welcome, {clientDisplayName.split(" ")[0]}
              </h1>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Verified Client
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <input
                  type="text"
                  placeholder={t("প্রজেক্ট বা সেবা খুঁজুন...", "Search projects or services...")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/15 rounded-full px-4 py-2 pl-9 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400 transition-all shadow-sm"
                />
                <svg className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <Link
                href="/design-garden"
                className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold font-mono px-4 py-2 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <span>+ {t("নতুন ডিজাইন রিকোয়েস্ট", "New Design Request")}</span>
              </Link>
            </div>
          </div>

          {/* Action Notification Toast */}
          {actionNotice && (
            <div className="mt-4 p-3.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs font-semibold animate-fade-in-up flex justify-between items-center">
              <span>{actionNotice}</span>
              <button onClick={() => setActionNotice(null)} className="text-emerald-400 font-bold cursor-pointer">✕</button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6 animate-fade-in-up">
              <div className="xl:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7]">
                    Live Project Dashboard
                  </h2>
                  <p className="text-xs text-white/60 mt-1 font-sans">
                    {t("আপনার চলমান ল্যান্ডস্কেপিং প্রজেক্টের লাইভ অগ্রগতি ও আর্থিক বিবরণ।", "Real-time project tracking, progress milestones and financial overview.")}
                  </p>
                </div>

                {/* Weather-Adaptive Plant Care Advisory Widget */}
                <WeatherPlantCareWidget />

                {/* Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Site Budget Overview */}
                  <div className="bg-[#0e1c14] text-white p-6 rounded-3xl shadow-xl border border-emerald-500/20 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-mono font-semibold text-emerald-300 uppercase tracking-wider">
                          {t("Project Budget & Invoices", "Project Budget & Invoices")}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded-full text-emerald-300 border border-white/10">
                        {invoices.length > 0 ? `${invoices.length} Invoices` : "Standard"}
                      </span>
                    </div>
                    <div className="mt-4 relative z-10">
                      <div className="text-3xl font-extrabold tracking-tight font-mono text-white">
                        ৳{totalBudget.toLocaleString()}
                      </div>
                      <div className="flex justify-between items-center text-xs mt-3 text-white/70 border-t border-white/10 pt-2 font-mono">
                        <span>{t("পরিশোধ:", "Paid:")} ৳{totalPaid.toLocaleString()}</span>
                        <span className="text-emerald-400 font-bold">{t("বাকি:", "Due:")} ৳{totalDue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Project Status Card */}
                  <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10 flex flex-col justify-between min-h-[140px]">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                        {t("Running Project Status", "Running Project Status")}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        {activeProject?.status || "RUNNING"}
                      </span>
                    </div>

                    <div className="space-y-2.5 mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60 font-sans">{t("প্রজেক্টের নাম:", "Project Name:")}</span>
                        <span className="font-bold text-[#E4E2D7] font-display truncate max-w-[160px]">
                          {activeProject?.name || "Rooftop Garden Oasis"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60 font-sans">{t("লোকেশন:", "Location:")}</span>
                        <span className="font-mono text-white/80">
                          {activeProject?.location || "Dhanmondi, Dhaka"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60 font-sans">{t("অগ্রগতি:", "Progress:")}</span>
                        <span className="font-bold text-emerald-400 font-mono">
                          {projectProgress}% {t("সম্পন্ন", "Completed")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-sm font-display font-bold text-[#E4E2D7]">
                        Project Milestones (Phase Progress)
                      </h3>
                      <p className="text-[11px] text-white/50 font-mono mt-0.5">
                        {t("প্রজেক্টের বর্তমান অগ্রগতি:", "Current progress:")} {projectProgress}%
                      </p>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                      Phase {milestones.filter((m) => m.done).length} of 5
                    </span>
                  </div>

                  <div className="relative py-4 px-2">
                    <div className="absolute top-7 left-6 right-6 h-1 bg-white/10 -z-0 rounded-full"></div>
                    <div
                      className="absolute top-7 left-6 h-1 bg-emerald-500 -z-0 transition-all duration-500 rounded-full shadow-lg shadow-emerald-500/50"
                      style={{ width: `${Math.min(100, projectProgress)}%` }}
                    ></div>

                    <div className="flex justify-between items-center relative z-10">
                      {milestones.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                              step.done
                                ? "bg-emerald-500 border-emerald-500 text-stone-950 font-bold"
                                : step.active
                                ? "bg-[#121A14] border-emerald-400 ring-4 ring-emerald-500/20 text-emerald-400"
                                : "bg-[#18221A] border-white/20 text-white/30"
                            }`}
                          >
                            {step.done ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : step.active ? (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            ) : null}
                          </div>
                          <span
                            className={`text-[11px] font-sans text-center max-w-[70px] ${
                              step.active
                                ? "text-emerald-300 font-bold"
                                : step.done
                                ? "text-[#E4E2D7]"
                                : "text-white/40"
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
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">🩺</span>
                        <h4 className="text-xs font-display font-bold text-[#E4E2D7]">
                          {t("Upcoming Tree Doctor Visit", "Upcoming Tree Doctor Visit")}
                        </h4>
                      </div>
                      {treeRequests.length > 0 ? (
                        <div className="text-xs text-white/70 space-y-1.5 bg-black/30 p-3.5 rounded-2xl border border-white/5">
                          <p className="font-bold text-[#E4E2D7] font-display">{treeRequests[0].treeName}</p>
                          <p className="text-white/60">{t("সমস্যা:", "Problem:")} {treeRequests[0].problem}</p>
                          <p className="text-emerald-400 font-mono text-[11px]">
                            {t("স্টাফ:", "Doctor:")} {treeRequests[0].assignedDoctor?.name || t("ডাক্তার অ্যাসাইনমেন্ট প্রক্রিয়াধীন", "Assignment pending")}
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-white/50 leading-relaxed">
                          {t("বর্তমানে কোনো পেন্ডিং ভিজিট নেই। যেকোনো সময় জরুরি ট্রি ডক্টর কল করতে পারেন।", "No pending visits currently. Feel free to request an emergency tree doctor visit.")}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                      <Link
                        href="/tree-doctor"
                        className="text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300"
                      >
                        + {t("নতুন ভিজিট বুক করুন →", "Book New Visit →")}
                      </Link>
                      <button
                        onClick={() => setActiveTab("consultation")}
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[11px] font-mono rounded-lg transition-colors cursor-pointer"
                      >
                        {t("বিস্তারিত", "Details")}
                      </button>
                    </div>
                  </div>

                  {/* Project Photos */}
                  <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-display font-bold text-[#E4E2D7]">
                          {t("Site Photo Timeline", "Site Photo Timeline")}
                        </h4>
                        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Live Studio</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {(activeProject?.beforePhotos?.[0] || activeProject?.wipPhotos?.[0] || activeProject?.afterPhotos?.[0]) ? (
                          <>
                            <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                              <img
                                src={activeProject?.beforePhotos?.[0] || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&q=80"}
                                alt="Before"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                              <img
                                src={activeProject?.wipPhotos?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"}
                                alt="WIP"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                              <img
                                src={activeProject?.afterPhotos?.[0] || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80"}
                                alt="After"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </>
                        ) : (
                          <div className="col-span-3 text-center py-6 text-xs text-white/40 font-mono">
                            {t("কোনো ছবি আপলোড করা হয়নি", "No site photos uploaded yet")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-white/50">Before • WIP • After</span>
                      <Link
                        href="/gallery"
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-[11px] font-mono transition-colors"
                      >
                        {t("গ্যালারি দেখুন", "View Gallery")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar Widget */}
              <div className="space-y-6">
                {/* Maintenance Card */}
                <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10">
                  <h3 className="text-sm font-display font-bold text-[#E4E2D7] mb-4 flex items-center justify-between">
                    <span>🗓️ {t("Maintenance Schedule", "Maintenance Schedule")}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                      {maintenanceList.length} Scheduled
                    </span>
                  </h3>

                  <div className="space-y-2.5">
                    {maintenanceList.slice(0, 4).map((m, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-mono font-bold text-[#E4E2D7] block">
                            📅 {new Date(m.scheduledDate).toLocaleDateString("bn-BD")}
                          </span>
                          <span className="text-[10px] text-white/50">{m.notes || m.frequency}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          m.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    ))}
                    {maintenanceList.length === 0 && (
                      <p className="text-xs text-white/40 text-center py-4 font-mono">
                        {t("বর্তমানে কোনো শিডিউল নেই", "No scheduled maintenance")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Hotline Banner */}
                <div className="bg-gradient-to-br from-[#0c1a12] via-[#10291c] to-[#0c1a12] text-white rounded-3xl p-6 shadow-xl border border-emerald-500/30 relative overflow-hidden">
                  <span className="text-2xl">🌱</span>
                  <h4 className="text-base font-display font-bold text-[#E4E2D7] mt-2">
                    {t("24/7 Expert Horticultural Hotline", "24/7 Expert Horticultural Hotline")}
                  </h4>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed">
                    {t("আপনার বাগানের যেকোনো সমস্যা বা নতুন ডিজাইনের জন্য সরাসরি হটলাইনে যোগাযোগ করুন।", "Connect with our certified landscape architects & tree doctors anytime.")}
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-400">01883012641</span>
                    <a
                      href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20would%20like%20to%20consult%20about%20my%20garden."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-[#25D366] hover:bg-[#20b858] text-stone-950 font-bold font-mono rounded-xl transition-all shadow-md flex items-center gap-1.5"
                    >
                      <span>💬</span> {t("হোয়াটসঅ্যাপে যোগাযোগ", "Chat on WhatsApp")}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">Project Portfolio</span>
                  <h3 className="text-2xl font-display font-bold text-[#E4E2D7]">
                    My Landscape Projects ({projects.length})
                  </h3>
                </div>
                <Link
                  href="/design-garden"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono shadow-lg shadow-emerald-500/20 transition-all"
                >
                  + {t("নতুন প্রজেক্ট শুরু করুন", "Start New Project")}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div key={proj.id} className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-300">
                          {proj.category}
                        </span>
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          proj.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                      <h4 className="font-display font-bold text-[#E4E2D7] text-lg">{proj.name}</h4>
                      <p className="text-xs text-white/50">📍 {proj.location}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-white/60 font-sans">
                        <span>{t("অগ্রগতি", "Progress")}</span>
                        <span className="font-mono font-bold text-emerald-400">{proj.progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-md shadow-emerald-500/40"
                          style={{ width: `${proj.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-mono text-white/40 block">{t("বাজেট", "Budget")}</span>
                        <span className="font-mono font-bold text-[#E4E2D7]">৳{(proj.budget || 0).toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab("service-card")}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300 font-mono font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        {t("সার্ভিস কার্ড দেখুন →", "Service Card →")}
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <div className="col-span-3 text-center py-12 bg-white/[0.02] rounded-3xl border border-white/10">
                    <p className="text-sm text-white/50">{t("আপনার কোনো সক্রিয় প্রজেক্ট নেই।", "You have no active projects currently.")}</p>
                    <Link
                      href="/design-garden"
                      className="mt-3 inline-block px-5 py-2.5 bg-emerald-500 text-stone-950 font-bold font-mono rounded-xl text-xs shadow-lg shadow-emerald-500/20"
                    >
                      {t("এখনই গার্ডেন ডিজাইন করুন", "Design Garden Now")}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TREE DOCTOR & VISITS */}
          {activeTab === "consultation" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">Plant Healthcare</span>
                  <h3 className="text-2xl font-display font-bold text-[#E4E2D7]">
                    Tree Doctor & Health Visits ({treeRequests.length})
                  </h3>
                </div>
                <Link
                  href="/tree-doctor"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono shadow-lg shadow-emerald-500/20 transition-all"
                >
                  + {t("জরুরি ট্রি ডক্টর কল করুন", "Emergency Tree Doctor")}
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {treeRequests.map((req) => (
                  <div key={req.id} className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                          {t("Plant & Symptoms", "Plant & Symptoms")}
                        </span>
                        <h4 className="font-bold text-[#E4E2D7] text-base font-display">{req.treeName}</h4>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono">
                        {req.isEmergency && (
                          <span className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            🚨 Emergency
                          </span>
                        )}
                        <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {req.status}
                        </span>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 text-xs space-y-1.5">
                      <p className="text-white/80"><strong className="text-[#E4E2D7]">{t("সমস্যা:", "Problem:")}</strong> {req.problem}</p>
                      <p className="text-white/80"><strong className="text-[#E4E2D7]">{t("লোকেশন:", "Location:")}</strong> {req.location}</p>
                      <p className="text-emerald-400 font-mono">
                        <strong>{t("দায়িত্বপ্রাপ্ত ডাক্তার:", "Assigned Doctor:")}</strong> {req.assignedDoctor?.name || t("ডাক্তার অ্যাসাইনমেন্ট প্রক্রিয়াধীন", "Assignment pending")}
                      </p>
                    </div>

                    <div className="text-[11px] text-white/50 flex justify-between items-center pt-2 font-mono">
                      <span>{t("বুকিং তারিখ:", "Booked:")} {new Date(req.createdAt).toLocaleDateString("bn-BD")}</span>
                      <a
                        href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20need%20Tree%20Doctor%20consultation."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#25D366] font-bold hover:underline flex items-center gap-1"
                      >
                        💬 {t("ডাক্তারের সাথে কথা বলুন", "Chat with Doctor")}
                      </a>
                    </div>
                  </div>
                ))}

                {treeRequests.length === 0 && (
                  <div className="col-span-2 text-center py-12 bg-white/[0.02] rounded-3xl border border-white/10">
                    <p className="text-sm text-white/50">{t("বর্তমানে কোনো ট্রি ডক্টর অনুরোধ নেই।", "No current tree doctor requests.")}</p>
                    <Link
                      href="/tree-doctor"
                      className="mt-3 inline-block px-4 py-2 bg-emerald-500 text-stone-950 font-bold font-mono rounded-xl text-xs"
                    >
                      {t("ট্রি ডক্টর বুক করুন", "Book Tree Doctor")}
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
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">Billing & Financials</span>
                <h3 className="text-2xl font-display font-bold text-[#E4E2D7]">
                  Invoices & Payment History
                </h3>
              </div>

              {/* Financial KPI bar */}
              <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-xl">
                <div>
                  <span className="text-white/50 block font-mono text-[11px]">{t("Total Project Budget:", "Total Project Budget:")}</span>
                  <span className="text-2xl font-extrabold text-[#E4E2D7] font-mono">৳{totalBudget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-white/50 block font-mono text-[11px]">{t("Paid Amount:", "Paid Amount:")}</span>
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">৳{totalPaid.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-white/50 block font-mono text-[11px]">{t("Due Balance:", "Due Balance:")}</span>
                  <span className="text-2xl font-extrabold text-amber-400 font-mono">৳{totalDue.toLocaleString()}</span>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="border border-white/10 rounded-3xl overflow-hidden bg-black/40 shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-white/50 font-mono uppercase tracking-wider text-[11px] border-b border-white/10">
                    <tr>
                      <th className="py-3.5 px-4">Invoice #</th>
                      <th className="py-3.5 px-4">{t("Date", "Date")}</th>
                      <th className="py-3.5 px-4">{t("Total Amount", "Total Amount")}</th>
                      <th className="py-3.5 px-4">{t("Paid", "Paid")}</th>
                      <th className="py-3.5 px-4">{t("Due", "Due")}</th>
                      <th className="py-3.5 px-4">{t("Status & Payment", "Status & Payment")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-emerald-400">{inv.invoiceNumber}</td>
                        <td className="py-3.5 px-4 text-white/70">{new Date(inv.createdAt).toLocaleDateString("bn-BD")}</td>
                        <td className="py-3.5 px-4 font-bold text-[#E4E2D7]">৳{inv.totalAmount.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-emerald-400">৳{inv.paidAmount.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-amber-400 font-bold">৳{inv.dueAmount.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === "PAID"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                            }`}>
                              {inv.status}
                            </span>
                            {inv.status !== "PAID" && (
                              <button
                                onClick={() => handlePayInvoice(inv)}
                                disabled={isPayingInvoice === inv.id}
                                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
                              >
                                <span>💳</span>
                                <span>{isPayingInvoice === inv.id ? t("লোড হচ্ছে...", "Processing...") : t("বিকাশ/কার্ডে পে", "bKash / Card Pay")}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {invoices.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-white/40 font-mono">
                          {t("কোনো ইনভয়েস পাওয়া যায়নি", "No invoices found")}
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
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">Official Certificate</span>
                  <h3 className="text-2xl font-display font-bold text-[#E4E2D7]">
                    Digital Service Card
                  </h3>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl text-xs font-mono font-bold shadow-sm transition-all cursor-pointer"
                >
                  🖨️ {t("প্রিন্ট সার্টিফিকেট", "Print Certificate")}
                </button>
              </div>

              {/* Printable Certificate */}
              <div className="bg-gradient-to-br from-[#0a1710] via-[#12281b] to-[#0a1710] text-white p-7 sm:p-9 rounded-[32px] shadow-2xl border-2 border-emerald-500/40 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[11px] text-emerald-300 font-mono tracking-widest uppercase block">
                      A R GREEN GARDEN • CLIENT WARRANTY & SERVICE PASSPORT
                    </span>
                    <h4 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7] mt-1">
                      {activeProject?.name || "Rooftop Oasis Luxury Retreat"}
                    </h4>
                    <p className="text-xs text-white/70 mt-1">
                      {t("লোকেশন:", "Location:")} {activeProject?.location || "Dhanmondi, Dhaka"} • {t("ক্লায়েন্ট:", "Client:")} {clientDisplayName}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/40 rounded-full text-xs font-mono text-emerald-400 font-bold">
                    Active Guarantee
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="font-mono font-bold text-emerald-300 uppercase tracking-wider block text-[11px]">
                      {t("প্রকল্পের বৈশিষ্ট্য ও কাজ:", "Scope of Work & Features:")}
                    </span>
                    <ul className="space-y-1.5 text-white/80 font-sans">
                      <li className="flex items-center gap-2">✓ 3-Layer Waterproofing & Drainage Grid</li>
                      <li className="flex items-center gap-2">✓ Automated Smart Micro-Drip Irrigation</li>
                      <li className="flex items-center gap-2">✓ Premium Lawn & Garden Landscaping</li>
                      <li className="flex items-center gap-2">✓ Soil Nutrient Balancing & Bio-Fertilizing</li>
                    </ul>
                  </div>

                  <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                    <span className="font-mono font-bold text-emerald-300 uppercase tracking-wider block text-[11px]">
                      {t("রোপিত মূল্যবান গাছের হেলথ রেকর্ড:", "Planted Specimen Health Records:")}
                    </span>
                    <ul className="space-y-1.5 text-white/80 font-mono">
                      {plantRecords.slice(0, 4).map((p, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>• {p.plantName}</span>
                          <span className="text-emerald-400 text-[10px]">
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

                {/* Plant Replacement Warranty & Renewal Engine */}
                <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🛡️</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-emerald-300 font-mono">
                          {t("🌿 প্ল্যান্ট রিপ্লেসমেন্ট ওয়ারেন্টি: আর ৪ মাস বাকি", "🌿 Plant Replacement Warranty: 4 Months Remaining")}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {t("সক্রিয় গ্যারান্টি", "Active Guarantee")}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/60 mt-0.5">
                        {t("১ বছরের মধ্যে গাছের কোনো ক্ষতি হলে বিনামূল্যে রিপ্লেসমেন্ট সুবিধা পাবেন।", "Free plant replacement & horticultural diagnosis coverage under active warranty.")}
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20would%20like%20to%20renew%20my%20plant%20maintenance%20and%20warranty%20package."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-mono font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer"
                  >
                    <span>🔄</span> {t("রিনিউ মেইনটেন্যান্স প্যাকেজ", "Renew Warranty Package")}
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-3 border-t border-white/10">
                  <div>
                    <span className="text-emerald-400 block text-[11px] font-mono font-bold">{t("ওয়ারেন্টি শর্তাবলী:", "Warranty Terms:")}</span>
                    <p className="text-white/80 mt-0.5">{t("১ বছরের ওয়াটারপ্রুফিং ও ৬ মাসের ফ্রি গাছ প্রতিস্থাপন গ্যারান্টি।", "1 Year Waterproofing warranty & 6 months plant replacement guarantee.")}</p>
                  </div>
                  <div>
                    <span className="text-emerald-400 block text-[11px] font-mono font-bold">{t("জরুরি ট্রি ডক্টর হটলাইন:", "Tree Doctor Hotline:")}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-white font-mono font-bold text-sm">01883012641</p>
                      <a
                        href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20would%20like%20to%20consult%20about%20my%20garden."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-[#25D366] font-bold hover:underline"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CUSTOMER LOYALTY & REWARDS (PDF Requirement #27) */}
          {activeTab === "loyalty" && (
            <div className="space-y-6 mt-6 animate-fade-in-up">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                    Exclusive Privileges
                  </span>
                  <h3 className="text-2xl font-display font-bold text-[#E4E2D7]">
                    Customer Loyalty & Rewards Program
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    {t("আমাদের নিয়মিত ক্লায়েন্টদের জন্য বিশেষ ছাড়, মেইনটেন্যান্স প্যাকেজ এবং রেফারেল রিওয়ার্ড。", "Exclusive discounts, maintenance packages, and referral bonuses for our valued clients.")}
                  </p>
                </div>
                <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
                  <span>👑</span>
                  <span>VIP Gold Member</span>
                </div>
              </div>

              {/* 4 Loyalty Offer Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Special Repeat Customer Discount */}
                <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400">
                    🎟️
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
                      {t("রিপিট কাস্টমার অফার", "Repeat Customer Offer")}
                    </span>
                    <h4 className="text-lg font-display font-bold text-white mt-1">
                      10% Flat Renovation Discount
                    </h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {t("আপনার পরবর্তী ছাদবাগান রেনোভেশন, ড্রিপ ইরিগেশন আপগ্রেড কিংবা পারগোলা নির্মাণে এই কুপন ব্যবহার করুন।", "Apply this exclusive voucher for your next garden renovation, irrigation upgrade, or pergola install.")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/10">
                    <span className="font-mono text-xs font-bold text-emerald-300 tracking-wider">GREENVIP10</span>
                    <span className="text-[10px] font-mono text-white/50">{t("সক্রিয় ভাউচার", "Active Code")}</span>
                  </div>
                </div>

                {/* 2. Maintenance Subscription Package */}
                <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xl text-blue-400">
                    🌿
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block">
                      {t("মেইনটেন্যান্স প্যাকেজ", "Maintenance Package")}
                    </span>
                    <h4 className="text-lg font-display font-bold text-white mt-1">
                      Quarterly Eco-Care Subscription
                    </h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {t("প্রতি মাসে ২টি রুটিন ভিজিট, নিয়মিত প্রুনিং, মাটি রিচার্জ ও কীটনাশক নিয়ন্ত্রণ সেবা অন্তর্ভুক্ত।", "Includes 2 scheduled monthly visits, organic pruning, soil recharge, and pest prevention.")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-white/50">{t("প্যাকেজ রেট:", "Package Fee:")}</span>
                      <span className="font-mono font-bold text-white text-base ml-2">৳১২,০০০ / ৩ মাস</span>
                    </div>
                    <a
                      href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20am%20interested%20in%20the%20Quarterly%20Eco-Care%20Subscription."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-mono font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>💬</span> {t("সাবস্ক্রাইব করুন", "Subscribe")}
                    </a>
                  </div>
                </div>

                {/* 3. Referral Reward Program */}
                <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl text-purple-400">
                    🎁
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block">
                      {t("রেফারেল রিওয়ার্ড", "Referral Reward")}
                    </span>
                    <h4 className="text-lg font-display font-bold text-white mt-1">
                      Refer a Friend & Earn ৳1,500
                    </h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {t("আপনার রেফারেল কোড ব্যবহার করে কোনো বন্ধু নতুন প্রজেক্ট বুক করলে আপনি পাবেন ১টি ফ্রি ট্রি ডক্টর ভিজিট অথবা ১,৫০০ টাকা ডিসকাউন্ট।", "Share your referral code. When a friend books a new landscape project, you both receive bonus rewards.")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/10">
                    <span className="font-mono text-xs font-bold text-purple-300">REF-{user?.id?.slice(0, 6)?.toUpperCase() || "ARGG2026"}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(`REF-${user?.id?.slice(0, 6)?.toUpperCase() || "ARGG2026"}`);
                        alert("রেফারেল কোড কপি করা হয়েছে!");
                      }}
                      className="text-[10px] font-mono font-bold text-emerald-400 hover:underline cursor-pointer"
                    >
                      {t("কোড কপি করুন", "Copy Code")}
                    </button>
                  </div>
                </div>

                {/* 4. Special Service Package */}
                <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400">
                    🩺
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
                      {t("স্পেশাল সার্ভিস প্যাকেজ", "Special Service Package")}
                    </span>
                    <h4 className="text-lg font-display font-bold text-white mt-1">
                      Complimentary Soil Diagnostic Check
                    </h4>
                    <p className="text-xs text-white/60 mt-1 leading-relaxed">
                      {t("বর্ষা ও শীত মৌসুমের প্রাক্কালে গাছের শিকড় ও মাটির পিএইচ (pH) ব্যালান্স পরীক্ষা করতে আমাদের বিশেষজ্ঞ দল আপনার সাইট পরিদর্শন করবে।", "Free annual diagnostic soil test to measure nitrogen, potassium, and soil pH levels before monsoon.")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
                      {t("বিনামূল্যে অন্তর্ভুক্ত", "Complimentary")}
                    </span>
                    <button
                      onClick={() => alert("আপনার ফ্রি সয়েল টেস্ট রিকোয়েস্ট অ্যাডমিন টিমের কাছে পাঠানো হয়েছে!")}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      {t("ক্লেম করুন", "Claim Service")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: FEEDBACK & REVIEW */}
          {activeTab === "support" && (
            <div className="space-y-6 mt-6 max-w-2xl animate-fade-in-up">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">Client Feedback & Review</span>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7] mt-1">
                  Share Your Experience & Rating
                </h3>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-white/80 block mb-2">{t("রেটিং নির্বাচন করুন:", "Select Rating:")}</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                            star <= reviewRating ? "text-amber-400" : "text-white/20"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-white/80 block mb-1">{t("আপনার অভিজ্ঞতা লিখুন:", "Write Your Feedback:")}</label>
                    <textarea
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={t("এ আর গ্রিন গার্ডেনের কাজের মান, সময়ানুবর্তিতা এবং ডিজাইন কেমন লেগেছে তা শেয়ার করুন...", "Share your experience with A R Green Garden design quality and punctuality...")}
                      className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder:text-white/30 focus:border-emerald-400 outline-none transition-all"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingReview || !reviewText}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingReview ? t("সাবমিট হচ্ছে...", "Submitting...") : t("রিভিউ সাবমিট করুন", "Submit Review")}
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
