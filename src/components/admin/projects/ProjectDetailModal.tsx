"use client";

import React from "react";
import Link from "next/link";
import { IProject } from "@/types";

interface ProjectDetailModalProps {
  activeProject: IProject;
  activeViewMediaTab: "after" | "before";
  setActiveViewMediaTab: (tab: "after" | "before") => void;
  onClose: () => void;
  onEdit: (project: IProject) => void;
  onDelete: (project: IProject) => void;
  getStatusBadge: (status: string) => { label: string; color: string };
}

export default function ProjectDetailModal({
  activeProject,
  activeViewMediaTab,
  setActiveViewMediaTab,
  onClose,
  onEdit,
  onDelete,
  getStatusBadge,
}: ProjectDetailModalProps) {
  const statusInfo = getStatusBadge(activeProject.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/70 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white sm:rounded-3xl rounded-none border sm:border-[#D6D2C4] border-none shadow-2xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E4E2D7] flex items-center justify-between bg-[#F7F6F2] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#2B4D33] text-white flex items-center justify-center text-lg font-bold shadow-xs">
              👁️
            </span>
            <div>
              <h3 className="font-display font-light text-lg sm:text-xl text-[#121813] uppercase tracking-wide truncate max-w-md">
                {activeProject.name}
              </h3>
              <p className="text-[11px] text-[#75787B] font-light">
                আর্কিটেকচারাল কেস স্টাডি ও পূর্ণাঙ্গ প্রকল্পের বিস্তারিত স্ন্যাপশট।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(activeProject)}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-white border border-[#2B4D33]/40 text-[#2B4D33] text-xs font-mono font-bold hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1"
              title="Edit This Project"
            >
              ✏️ <span className="hidden sm:inline">এডিট করুন</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 text-[#121813] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
          
          {/* Hero Image Showcase with Before/After Switcher */}
          <div className="space-y-3">
            <div className="relative h-60 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden bg-stone-900 border border-[#D6D2C4] shadow-inner">
              <img
                src={
                  activeViewMediaTab === "before" && activeProject.beforeImage
                    ? activeProject.beforeImage
                    : activeProject.afterImage || activeProject.imageUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop"
                }
                alt={activeProject.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/95 text-[#121813] backdrop-blur-md shadow-sm">
                  {activeProject.category}
                </span>
                {activeProject.featured && (
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-400 text-stone-950 shadow-sm">
                    ★ Homepage Featured
                  </span>
                )}
              </div>

              {/* Bottom Info on Image */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <p className="text-xs font-mono text-emerald-300 uppercase tracking-widest font-semibold">
                    {activeProject.location || "Bangladesh"}
                  </p>
                  <h4 className="text-lg sm:text-2xl font-display font-light uppercase tracking-wide drop-shadow-md">
                    {activeProject.name}
                  </h4>
                  {activeProject.titleBn && (
                    <p className="text-sm font-sans text-stone-200 mt-0.5">
                      {activeProject.titleBn}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Media Switcher Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveViewMediaTab("after")}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeViewMediaTab === "after"
                    ? "bg-[#2B4D33] text-white shadow-xs"
                    : "bg-[#F7F6F2] text-[#75787B] hover:text-[#121813] border border-[#D6D2C4]"
                }`}
              >
                🌿 কাজের পরের দৃশ্য (After)
              </button>

              {activeProject.beforeImage && (
                <button
                  type="button"
                  onClick={() => setActiveViewMediaTab("before")}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    activeViewMediaTab === "before"
                      ? "bg-[#2B4D33] text-white shadow-xs"
                      : "bg-[#F7F6F2] text-[#75787B] hover:text-[#121813] border border-[#D6D2C4]"
                  }`}
                >
                  🧱 পূর্বের অবস্থা (Before)
                </button>
              )}
            </div>
          </div>

          {/* Progress Milestones */}
          <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-[#D6D2C4] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#121813]">কাজের সার্বিক অগ্রগতি (Execution Progress)</span>
              <span className="font-bold text-[#2B4D33] text-sm">{activeProject.progress || 50}%</span>
            </div>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#D6D2C4]">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-[#2B4D33] rounded-full transition-all duration-700"
                style={{ width: `${activeProject.progress || 50}%` }}
              />
            </div>
          </div>

          {/* 4-Card Scope & Financial Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-[#D6D2C4] shadow-2xs">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">প্রকল্প বাজেট</p>
              <p className="text-sm sm:text-base font-mono font-bold text-[#121813] mt-1">
                {activeProject.budget ? `৳ ${Number(activeProject.budget).toLocaleString()}` : (activeProject.budgetRange || "কোটেশন")}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#D6D2C4] shadow-2xs">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">মোট ব্যয়</p>
              <p className="text-sm sm:text-base font-mono font-bold text-[#2B4D33] mt-1">
                {activeProject.totalExpense ? `৳ ${Number(activeProject.totalExpense).toLocaleString()}` : "—"}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#D6D2C4] shadow-2xs">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">সময়সীমা</p>
              <p className="text-sm sm:text-base font-mono font-bold text-[#121813] mt-1">
                {activeProject.duration || "৪ সপ্তাহ"}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#D6D2C4] shadow-2xs">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">ওয়ারেন্টি</p>
              <p className="text-sm sm:text-base font-mono font-bold text-[#121813] mt-1">
                {activeProject.warrantyMonths || 12} মাস
              </p>
            </div>
          </div>

          {/* Client & Coordinates Info Box */}
          <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-[#D6D2C4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">ক্লায়েন্ট ও পরিচিতি</p>
              <p className="text-sm font-bold text-[#121813] mt-0.5">{activeProject.clientName || activeProject.client || "ব্যক্তিগত ক্লায়েন্ট"}</p>
              <p className="text-xs text-[#75787B]">📍 {activeProject.location || "ঢাকা, বাংলাদেশ"}</p>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">স্লাগ লিংক</p>
              <code className="text-xs font-mono text-[#2B4D33] bg-white px-2 py-1 rounded-md border border-[#D6D2C4]">
                /projects/{activeProject.slug}
              </code>
            </div>
          </div>

          {/* Architectural Narrative Case Study */}
          <div className="space-y-4">
            {(activeProject.description || activeProject.descBn) && (
              <div className="space-y-1">
                <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2B4D33]">
                  📌 প্রকল্পের পরিচিতি ও উদ্দেশ্য (Project Overview)
                </h5>
                {activeProject.description && (
                  <p className="text-xs text-[#323232] leading-relaxed bg-[#F7F6F2] p-3.5 rounded-xl border border-[#D6D2C4]">
                    {activeProject.description}
                  </p>
                )}
                {activeProject.descBn && (
                  <p className="text-xs text-[#121813] leading-relaxed bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                    <span className="font-bold text-[11px] text-[#2B4D33] block mb-1">বাংলা বিবরণ:</span>
                    {activeProject.descBn}
                  </p>
                )}
              </div>
            )}

            {(activeProject.challenges || (activeProject.materialsUsed as any)?.challenges) && (
              <div className="space-y-1">
                <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-800">
                  ⚠️ সাইটের চ্যালেঞ্জ ও সীমাবদ্ধতা (Site Challenges)
                </h5>
                <p className="text-xs text-[#323232] leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                  {activeProject.challenges || (activeProject.materialsUsed as any)?.challenges}
                </p>
              </div>
            )}

            {(activeProject.solution || (activeProject.materialsUsed as any)?.solution) && (
              <div className="space-y-1">
                <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2B4D33]">
                  🌱 বায়োফিলিক ও আর্কিটেকচারাল সমাধান (Studio Solution)
                </h5>
                <p className="text-xs text-[#323232] leading-relaxed bg-[#E8F5E9]/60 p-3.5 rounded-xl border border-emerald-200">
                  {activeProject.solution || (activeProject.materialsUsed as any)?.solution}
                </p>
              </div>
            )}
          </div>

          {/* Client Testimonial Showcase */}
          {(activeProject.clientTestimonial?.text || (activeProject.materialsUsed as any)?.testimonial?.text) && (
            <div className="p-4 rounded-2xl bg-white border border-[#D6D2C4] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-500 text-sm">★★★★★</span>
                <span className="text-[10px] font-mono text-[#75787B] uppercase">Verified Client Review</span>
              </div>
              <p className="text-xs italic text-[#121813] font-serif leading-relaxed">
                &ldquo;{activeProject.clientTestimonial?.text || (activeProject.materialsUsed as any)?.testimonial?.text}&rdquo;
              </p>
              <p className="text-xs font-bold text-[#2B4D33] text-right">
                — {activeProject.clientTestimonial?.name || (activeProject.materialsUsed as any)?.testimonial?.name || activeProject.clientName || "Client"}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-[#E4E2D7] bg-[#F7F6F2] flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => onDelete(activeProject)}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono font-bold border border-rose-200 transition-colors cursor-pointer"
          >
            🗑️ প্রজেক্ট ডিলিট করুন
          </button>

          <div className="flex items-center gap-2">
            <Link
              href={`/projects`}
              target="_blank"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-[#D6D2C4] text-[#121813] text-xs font-mono font-semibold hover:bg-stone-50 transition-colors flex items-center"
            >
              🌐 পাবলিক পোর্টফোলিও ➔
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#2B4D33] text-white text-xs font-mono font-bold hover:bg-[#1E3724] transition-colors cursor-pointer"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
