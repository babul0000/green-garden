"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import WeatherPlantCareWidget from "@/components/WeatherPlantCareWidget";
import type { ClientDashboardData, ProjectItem } from "../types";

interface OverviewTabProps extends ClientDashboardData {
  activeProject: ProjectItem | null;
  totalBudget: number;
  totalPaid: number;
  totalDue: number;
  projectProgress: number;
  onTabChange: (tab: string) => void;
}

export default function OverviewTab({
  invoices, treeRequests, maintenanceList,
  activeProject, totalBudget, totalPaid, totalDue, projectProgress, onTabChange,
}: OverviewTabProps) {
  const { t } = useLanguage();

  const milestones = [
    { name: "Consultation", done: projectProgress >= 15, active: projectProgress < 25 },
    { name: "Design Plan", done: projectProgress >= 35, active: projectProgress >= 25 && projectProgress < 50 },
    { name: "Approval", done: projectProgress >= 50, active: projectProgress >= 50 && projectProgress < 70 },
    { name: "Implementation", done: projectProgress >= 75, active: projectProgress >= 70 && projectProgress < 100 },
    { name: "Handover", done: projectProgress >= 100, active: projectProgress >= 100 },
  ];

  return (
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

        <WeatherPlantCareWidget />

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0e1c14] text-white p-6 rounded-3xl shadow-xl border border-emerald-500/20 flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
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
                <span className="font-mono text-white/80">{activeProject?.location || "Dhanmondi, Dhaka"}</span>
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
              <h3 className="text-sm font-display font-bold text-[#E4E2D7]">Project Milestones (Phase Progress)</h3>
              <p className="text-[11px] text-white/50 font-mono mt-0.5">
                {t("প্রজেক্টের বর্তমান অগ্রগতি:", "Current progress:")} {projectProgress}%
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              Phase {milestones.filter((m) => m.done).length} of 5
            </span>
          </div>
          <div className="relative py-4 px-2">
            <div className="absolute top-7 left-6 right-6 h-1 bg-white/10 -z-0 rounded-full" />
            <div
              className="absolute top-7 left-6 h-1 bg-emerald-500 -z-0 transition-all duration-500 rounded-full shadow-lg shadow-emerald-500/50"
              style={{ width: `${Math.min(100, projectProgress)}%` }}
            />
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
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    ) : null}
                  </div>
                  <span
                    className={`text-[11px] font-sans text-center max-w-[70px] ${
                      step.active ? "text-emerald-300 font-bold" : step.done ? "text-[#E4E2D7]" : "text-white/40"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tree Doctor & Photos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {t("স্টাফ:", "Doctor:")} {treeRequests[0].assignedDoctor?.name || t("ডাক্তার অ্যাসাইনমেন্ট প্রক্রিয়াধীন", "Assignment pending")}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-white/50 leading-relaxed">
                  {t("বর্তমানে কোনো পেন্ডিং ভিজিট নেই।", "No pending visits currently.")}
                </p>
              )}
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <Link href="/tree-doctor" className="text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300">
                + {t("নতুন ভিজিট বুক করুন →", "Book New Visit →")}
              </Link>
              <button
                onClick={() => onTabChange("consultation")}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-[11px] font-mono rounded-lg transition-colors cursor-pointer"
              >
                {t("বিস্তারিত", "Details")}
              </button>
            </div>
          </div>

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
                      <img src={activeProject?.beforePhotos?.[0] || "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400&q=80"} alt="Before" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <img src={activeProject?.wipPhotos?.[0] || "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"} alt="WIP" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/40">
                      <img src={activeProject?.afterPhotos?.[0] || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&q=80"} alt="After" className="w-full h-full object-cover" />
                    </div>
                  </>
                ) : (
                  <div className="col-span-3 text-center py-6 text-xs text-white/40 font-mono">
                    {t("কোনো ছবি আপলোড করা হয়নি", "No site photos uploaded yet")}
                  </div>
                )}
              </div>
            </div>
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-white/50">Before • WIP • After</span>
              <Link href="/gallery" className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg text-[11px] font-mono transition-colors">
                {t("গ্যালারি দেখুন", "View Gallery")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="space-y-6">
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
              <span>💬</span> {t("হোয়াটসঅ্যাপে যোগাযোগ", "Chat on WhatsApp")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
