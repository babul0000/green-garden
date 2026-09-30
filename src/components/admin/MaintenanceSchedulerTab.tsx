"use client";

import React, { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  clientName?: string;
  location: string;
  category: string;
  budget: number;
  totalExpense?: number;
  progress: number;
  status: string;
  startDate?: string;
  deadline?: string;
  beforePhotos?: string[];
  wipPhotos?: string[];
  afterPhotos?: string[];
}

interface MaintenanceSchedule {
  id: string;
  clientName: string;
  clientPhone?: string | null;
  location: string;
  frequency: "WEEKLY" | "MONTHLY" | "REGULAR" | "ONE_TIME" | string;
  scheduledDate: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED" | string;
  assignedStaff?: { name: string; designation: string } | null;
  notes?: string | null;
  project?: { name: string } | null;
}

export default function MaintenanceSchedulerTab() {
  const [activeSubTab, setActiveSubTab] = useState<"projects" | "maintenance">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [smartAreaTip, setSmartAreaTip] = useState<string | null>(null);

  // New Maintenance Form State
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [schedClientName, setSchedClientName] = useState("");
  const [schedPhone, setSchedPhone] = useState("");
  const [schedLocation, setSchedLocation] = useState("Gulshan, Dhaka");
  const [schedFrequency, setSchedFrequency] = useState<"WEEKLY" | "MONTHLY" | "REGULAR" | "ONE_TIME">("WEEKLY");
  const [schedStartDate, setSchedStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [schedNotes, setSchedNotes] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Projects
      const projRes = await fetch("/api/projects");
      if (projRes.ok) {
        const pData = await projRes.json();
        setProjects(pData);
      }

      // 2. Fetch Maintenance
      const mRes = await fetch("/api/maintenance");
      if (mRes.ok) {
        const mData = await mRes.json();
        setSchedules(mData.schedules || []);
        if (mData.smartAreaTip) setSmartAreaTip(mData.smartAreaTip);
      }
    } catch (err) {
      console.error("Error fetching scheduler data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateProgress = async (id: string, newProgress: number) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, progress: newProgress } : p))
    );
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: newProgress }),
      });
    } catch (err) {
      console.error("Failed to update project progress in DB:", err);
    }
  };

  const handleUpdateMaintenanceStatus = async (id: string, newStatus: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    try {
      await fetch("/api/maintenance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update maintenance schedule:", err);
    }
  };

  const handleDeleteMaintenance = async (id: string) => {
    if (!confirm("Are you sure you want to delete this maintenance schedule?")) return;
    try {
      const res = await fetch(`/api/maintenance?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setSchedules((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete schedule:", err);
    }
  };

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedClientName || !schedLocation) return;

    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: schedClientName,
          clientPhone: schedPhone,
          location: schedLocation,
          frequency: schedFrequency,
          startDate: schedStartDate,
          notes: schedNotes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.smartAreaTip) {
          setSmartAreaTip(data.smartAreaTip);
        }
        setIsAddingSchedule(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setIsAddingSchedule(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <span>🔧</span> ধাপ ৮ • Running Project Lifecycle & Smart Maintenance Scheduler
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 tracking-tight">
            চলমান প্রজেক্টের ধাপভিত্তিক প্রোগ্রেস ও স্মার্ট এরিয়া শিডিউলিং
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            মাইলস্টোন অগ্রগতি ট্র্যাকিং, ফটো টাইমলাইন এবং যাতায়াত খরচ বাঁচাতে নিকটবর্তী এরিয়া-ভিত্তিক রক্ষণাবেক্ষণ শিডিউলিং।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("projects")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "projects" ? "bg-[#06120c] text-[#91cd3d] shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📋 চলমান প্রজেক্টস ({projects.length})
          </button>
          <button
            onClick={() => setActiveSubTab("maintenance")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeSubTab === "maintenance" ? "bg-[#06120c] text-[#91cd3d] shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🗓️ মেইনটেন্যান্স শিডিউলার ({schedules.length})
          </button>
        </div>
      </div>

      {/* Smart Area-Based Suggestion Tip Banner (as required in PDF page 16) */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-5 shadow-lg flex items-start gap-4">
        <span className="text-3xl">💡</span>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
            Smart Area-Based Scheduling Engine (বুদ্ধিমান এলাকাভিত্তিক শিডিউলিং)
          </h4>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            {smartAreaTip ||
              "যদি একজন মালি বা টেকনিশিয়ান আজ Gulshan বা Banani-তে শিডিউল থাকে, তবে সিস্টেম একই এলাকার অন্যান্য পেন্ডিং বা আসন্ন মেইনটেন্যান্স কাজগুলোকে একই দিনে ক্লাস্টার করার পরামর্শ দেবে। এতে কোম্পানির ফুয়েল খরচ, যাতায়াত সময় এবং জনবলের সময় ৫০% সাশ্রয় হবে।"}
          </p>
        </div>
      </div>

      {/* SUBTAB 1: RUNNING PROJECTS BOARD */}
      {activeSubTab === "projects" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((proj) => {
              const progressVal = proj.progress !== undefined ? proj.progress : 50;
              return (
                <div
                  key={proj.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-gray-400 block">{proj.location}</span>
                        <h4 className="font-bold text-gray-900 text-lg font-serif">{proj.name}</h4>
                        <p className="text-xs text-gray-500">গ্রাহক: <span className="font-semibold text-gray-800">{proj.clientName || "কাস্টমার"}</span></p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full">
                        {proj.status || "RUNNING"}
                      </span>
                    </div>

                    {/* Progress Milestone Tracker (0% -> 25% -> 50% -> 75% -> 100%) */}
                    <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-700">কাজের অগ্রগতি (Milestone Progress):</span>
                        <span className="font-extrabold font-mono text-emerald-700 text-sm">{progressVal}%</span>
                      </div>

                      {/* Custom Step Nodes */}
                      <div className="grid grid-cols-5 gap-1 text-center pt-2">
                        {[0, 25, 50, 75, 100].map((step) => {
                          const isDone = progressVal >= step;
                          return (
                            <button
                              key={step}
                              onClick={() => handleUpdateProgress(proj.id, step)}
                              className={`py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                isDone
                                  ? "bg-emerald-600 text-white shadow-sm"
                                  : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-100"
                              }`}
                            >
                              {step}% {step === 100 && "✓"}
                            </button>
                          );
                        })}
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressVal}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Budget & Expense Breakdown */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-400 text-[10px] block">অনুমোদিত বাজেট:</span>
                        <span className="font-bold font-mono text-gray-900">৳{proj.budget ? proj.budget.toLocaleString() : "২,৫০,০০০"}</span>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <span className="text-gray-400 text-[10px] block">ব্যয়িত খরচ:</span>
                        <span className="font-bold font-mono text-emerald-800">৳{proj.totalExpense ? proj.totalExpense.toLocaleString() : "১,২০,০০০"}</span>
                      </div>
                    </div>

                    {/* Photo Stage Timeline Pill */}
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <span>📸 ছবির টাইমলাইন:</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 font-semibold text-[10px]">Before (২)</span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold text-[10px]">WIP (৪)</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-semibold text-[10px]">After (৩)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBTAB 2: GARDEN MAINTENANCE SCHEDULER */}
      {activeSubTab === "maintenance" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
            <div>
              <h3 className="font-bold text-gray-900 text-sm font-serif">স্বয়ংক্রিয় গার্ডেন মেইনটেন্যান্স শিডিউলার</h3>
              <p className="text-xs text-gray-500">Weekly, Monthly বা Regular প্ল্যান নির্বাচন করলে সিস্টেম স্বয়ংক্রিয়ভাবে পরবর্তী তারিখসমূহ ক্যালকুলেট করে।</p>
            </div>
            <button
              onClick={() => setIsAddingSchedule(!isAddingSchedule)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              {isAddingSchedule ? "✕ বন্ধ করুন" : "+ নতুন শিডিউল যোগ করুন"}
            </button>
          </div>

          {/* Add Maintenance Schedule Form */}
          {isAddingSchedule && (
            <form onSubmit={handleCreateMaintenance} className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-md space-y-4 animate-fade-in-up">
              <h4 className="font-bold text-emerald-900 text-sm border-b pb-2">নতুন মেইনটেন্যান্স শিডিউল তৈরি</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">ক্লায়েন্টের নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. জনাব আহমেদ"
                    value={schedClientName}
                    onChange={(e) => setSchedClientName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">মোবাইল নম্বর</label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={schedPhone}
                    onChange={(e) => setSchedPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">সাইট লোকেশন *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gulshan-2, Dhaka"
                    value={schedLocation}
                    onChange={(e) => setSchedLocation(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">ফ্রিকোয়েন্সি (Frequency) *</label>
                  <select
                    value={schedFrequency}
                    onChange={(e: any) => setSchedFrequency(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-semibold text-emerald-900"
                  >
                    <option value="WEEKLY">Weekly (সাপ্তাহিক ৪টি ভিজিট)</option>
                    <option value="MONTHLY">Monthly (মাসিক ৩টি ভিজিট)</option>
                    <option value="REGULAR">Regular (দ্বি-সাপ্তাহিক ২টি ভিজিট)</option>
                    <option value="ONE_TIME">One-time (এককালীন সেবা)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">প্রথম ভিজিটের তারিখ *</label>
                  <input
                    type="date"
                    required
                    value={schedStartDate}
                    onChange={(e) => setSchedStartDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div className="sm:col-span-2 md:col-span-3">
                  <label className="font-semibold text-gray-700 block mb-1">বিশেষ কাজের নোট</label>
                  <input
                    type="text"
                    placeholder="e.g. লন কাটিং, ড্রিপ ইরিগেশন টেস্ট ও নাইট্রোজেন ফার্টিলাইজার"
                    value={schedNotes}
                    onChange={(e) => setSchedNotes(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSchedule(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-md"
                >
                  ✓ শিডিউল তৈরি ও রিমাইন্ডার সেট করুন
                </button>
              </div>
            </form>
          )}

          {/* Schedule List Table */}
          <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">রক্ষণাবেক্ষণ শিডিউল ক্যালেন্ডার</span>
              <span className="text-xs text-gray-500">মোট শিডিউল: {schedules.length}টি</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/60 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">গ্রাহক ও লোকেশন</th>
                    <th className="py-3 px-4">প্ল্যান (Frequency)</th>
                    <th className="py-3 px-4">শিডিউল তারিখ</th>
                    <th className="py-3 px-4">দায়িত্বপ্রাপ্ত স্টাফ</th>
                    <th className="py-3 px-4">কাজের নোট</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {schedules.map((sc) => (
                    <tr key={sc.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {sc.clientName}
                        <span className="block text-[10px] text-gray-400 font-normal">📍 {sc.location}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded-md text-[10px]">
                          {sc.frequency}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-900">
                        📅 {new Date(sc.scheduledDate).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        {sc.assignedStaff?.name || "👨‍🌾 মালি টিম ১"}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 max-w-[200px] truncate">
                        {sc.notes || "লনের পরিচর্যা ও ড্রিপ চেকিং"}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateMaintenanceStatus(sc.id, sc.status === "COMPLETED" ? "SCHEDULED" : "COMPLETED")}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                              sc.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            }`}
                            title="ক্লিক করে স্ট্যাটাস পরিবর্তন করুন"
                          >
                            {sc.status || "SCHEDULED"}
                          </button>
                          <button
                            onClick={() => handleDeleteMaintenance(sc.id)}
                            className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs transition-colors cursor-pointer"
                            title="শিডিউল মুছুন"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
