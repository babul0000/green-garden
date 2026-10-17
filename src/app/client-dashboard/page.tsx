"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import type {
  ProjectItem,
  InvoiceItem,
  TreeDoctorItem,
  PlantHealthItem,
  MaintenanceItem,
} from "./types";
import OverviewTab from "./components/OverviewTab";
import ProjectsTab from "./components/ProjectsTab";
import ConsultationTab from "./components/ConsultationTab";
import PaymentsTab from "./components/PaymentsTab";
import ServiceCardTab from "./components/ServiceCardTab";
import LoyaltyTab from "./components/LoyaltyTab";
import SupportTab from "./components/SupportTab";

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
  const [isPayingInvoice, setIsPayingInvoice] = useState<string | null>(null);

  // Client Notifications State
  const [clientNotifications, setClientNotifications] = useState<any[]>([]);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);
  const [notifsDropdownOpen, setNotifsDropdownOpen] = useState(false);
  const notifsRef = React.useRef<HTMLDivElement>(null);

  const fetchClientNotifications = async () => {
    try {
      const res = await fetch("/api/notifications?limit=20", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setClientNotifications(data.notifications || []);
        setUnreadNotifsCount(data.unreadCount || 0);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
        setNotifsDropdownOpen(false);
      }
    };
    if (notifsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notifsDropdownOpen]);

  useEffect(() => {
    if (user?.id) {
      fetchClientNotifications();
      const timer = setInterval(fetchClientNotifications, 40000);
      return () => clearInterval(timer);
    }
  }, [user]);

  // Fetch real client data from PostgreSQL
  const fetchClientData = async () => {
    setDataLoading(true);
    try {
      const clientQuery = user?.id ? `?clientId=${user.id}` : "";
      const userParam = user?.id ? `?userId=${user.id}` : "";
      const [projRes, invRes, treeRes, plantRes, maintRes] = await Promise.all([
        fetch(`/api/projects${clientQuery}`, { cache: "no-store" }),
        fetch("/api/invoices", { cache: "no-store" }),
        fetch(`/api/tree-doctor${userParam}`, { cache: "no-store" }),
        fetch("/api/plant-health", { cache: "no-store" }),
        fetch("/api/maintenance", { cache: "no-store" }),
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
    0;
  const totalPaid = invoices.reduce((acc, i) => acc + (i.paidAmount || 0), 0);
  const totalDue = Math.max(0, totalBudget - totalPaid);
  const projectProgress = activeProject?.progress ?? 0;

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

              {/* Notification Bell for Client */}
              <div className="relative" ref={notifsRef}>
                <button
                  type="button"
                  onClick={() => setNotifsDropdownOpen((prev) => !prev)}
                  className={`w-10 h-10 rounded-full border transition-all flex items-center justify-center relative cursor-pointer shrink-0 ${
                    notifsDropdownOpen || unreadNotifsCount > 0
                      ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                      : "bg-white/5 border-white/15 text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  title="বিজ্ঞপ্তি"
                  aria-label="Notifications"
                >
                  <span className="text-base leading-none">🔔</span>
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white shadow-sm animate-pulse">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {notifsDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-[#0d1610] border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden font-sans animate-fade-in">
                    <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        বিজ্ঞপ্তি ({clientNotifications.length})
                      </span>
                      {unreadNotifsCount > 0 && (
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch("/api/notifications", {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ markAllRead: true }),
                            });
                            setClientNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                            setUnreadNotifsCount(0);
                          }}
                          className="text-[10px] font-mono text-emerald-300 hover:underline cursor-pointer"
                        >
                          সব পঠিত করুন
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                      {clientNotifications.length === 0 ? (
                        <div className="py-8 text-center text-xs font-mono text-white/40">
                          কোনো নতুন নোটিফিকেশন নেই
                        </div>
                      ) : (
                        clientNotifications.map((notif: any) => (
                          <div
                            key={notif.id}
                            onClick={async () => {
                              if (!notif.isRead) {
                                fetch("/api/notifications", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: notif.id, isRead: true }),
                                });
                                setClientNotifications((prev) =>
                                  prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
                                );
                                setUnreadNotifsCount((c) => Math.max(0, c - 1));
                              }
                              setNotifsDropdownOpen(false);
                              if (notif.link) {
                                if (["projects", "consultation", "payments", "support"].includes(notif.link)) {
                                  setActiveTab(notif.link);
                                }
                              }
                            }}
                            className={`p-3 text-left transition-colors cursor-pointer ${
                              notif.isRead ? "bg-transparent text-white/60 hover:bg-white/5" : "bg-emerald-950/40 text-white hover:bg-emerald-950/60"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h5 className="text-xs font-semibold truncate text-[#E4E2D7]">
                                {notif.title}
                              </h5>
                              {!notif.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                              )}
                            </div>
                            <p className="text-[11px] text-white/60 line-clamp-2">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
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
            <OverviewTab
              projects={projects}
              invoices={invoices}
              treeRequests={treeRequests}
              plantRecords={plantRecords}
              maintenanceList={maintenanceList}
              dataLoading={dataLoading}
              activeProject={activeProject}
              totalBudget={totalBudget}
              totalPaid={totalPaid}
              totalDue={totalDue}
              projectProgress={projectProgress}
              onTabChange={setActiveTab}
            />
          )}

          {/* TAB 2: MY PROJECTS */}
          {activeTab === "projects" && (
            <ProjectsTab projects={projects} onTabChange={setActiveTab} />
          )}

          {/* TAB 3: TREE DOCTOR & VISITS */}
          {activeTab === "consultation" && (
            <ConsultationTab treeRequests={treeRequests} />
          )}

          {/* TAB 4: PAYMENT HISTORY & BILLING */}
          {activeTab === "payments" && (
            <PaymentsTab
              invoices={invoices}
              totalBudget={totalBudget}
              totalPaid={totalPaid}
              totalDue={totalDue}
              handlePayInvoice={handlePayInvoice}
              isPayingInvoice={isPayingInvoice}
            />
          )}

          {/* TAB 5: DIGITAL SERVICE CARD */}
          {activeTab === "service-card" && (
            <ServiceCardTab
              activeProject={activeProject || undefined}
              clientDisplayName={clientDisplayName}
              plantRecords={plantRecords}
            />
          )}

          {/* TAB 6: CUSTOMER LOYALTY & REWARDS */}
          {activeTab === "loyalty" && <LoyaltyTab user={user} />}

          {/* TAB 7: FEEDBACK & REVIEW */}
          {activeTab === "support" && (
            <SupportTab
              reviewRating={reviewRating}
              setReviewRating={setReviewRating}
              reviewText={reviewText}
              setReviewText={setReviewText}
              isSubmittingReview={isSubmittingReview}
              handleReviewSubmit={handleReviewSubmit}
            />
          )}
        </main>
      </div>
    </div>
  );
}
