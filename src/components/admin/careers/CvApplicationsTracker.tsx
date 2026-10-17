"use client";

import React, { useState, useMemo } from "react";
import { CareerApplication } from "./types";

interface CvApplicationsTrackerProps {
  careers: CareerApplication[];
  onUpdateStatus: (id: string, status: string) => void;
  onDeleteCareer: (id: string) => void;
}

export default function CvApplicationsTracker({
  careers,
  onUpdateStatus,
  onDeleteCareer,
}: CvApplicationsTrackerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deptFilter, setDeptFilter] = useState("ALL");

  const departments = useMemo(() => {
    return Array.from(new Set(careers.map((c) => c.department).filter(Boolean)));
  }, [careers]);

  const filtered = useMemo(() => {
    return careers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        c.department.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      const matchesDept = deptFilter === "ALL" || c.department === deptFilter;

      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [careers, searchQuery, statusFilter, deptFilter]);

  // Handle direct CV download helper
  const handleDownloadCv = (url: string, candidateName: string) => {
    if (!url) return;
    try {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = `CV-${candidateName.replace(/\s+/g, "_")}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">চাকরি ও ইন্টার্নশিপ আবেদন • CV Applications</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            প্রার্থীদের বায়োডাটা পর্যালোচনা, শর্টলিস্ট বা রিজেক্ট এবং সিভি সরাসরি ডাউনলোড করুন।
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
          মোট আবেদন: {careers.length}টি
        </span>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="প্রার্থীর নাম, ইমেইল বা ফোন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 flex-grow sm:max-w-xs"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-stone-200 font-semibold focus:outline-none focus:border-emerald-400"
        >
          <option value="ALL" className="bg-[#18221A]">সব স্ট্যাটাস</option>
          <option value="Pending" className="bg-[#18221A]">পেন্ডিং (Pending)</option>
          <option value="Reviewing" className="bg-[#18221A]">পর্যালোচনাধীন (Reviewing)</option>
          <option value="Shortlisted" className="bg-[#18221A]">শর্টলিস্টেড (Shortlisted)</option>
          <option value="Rejected" className="bg-[#18221A]">বাতিল (Rejected)</option>
        </select>

        {departments.length > 0 && (
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-stone-200 font-semibold focus:outline-none focus:border-emerald-400"
          >
            <option value="ALL" className="bg-[#18221A]">সব বিভাগ</option>
            {departments.map((d) => (
              <option key={d} value={d} className="bg-[#18221A]">{d}</option>
            ))}
          </select>
        )}
      </div>

      {/* Candidates List */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-xs text-stone-400 italic bg-black/40 p-8 rounded-2xl text-center border border-white/10 font-mono">
            কোনো আবেদন পাওয়া যায়নি।
          </p>
        ) : (
          filtered.map((car) => (
            <div
              key={car.id}
              className="bg-black/35 border border-white/10 p-5 rounded-2xl text-xs flex flex-col md:flex-row justify-between md:items-start gap-4 shadow-lg hover:border-emerald-500/30 transition-all"
            >
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{car.name}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono border ${
                      car.status === "Shortlisted"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : car.status === "Rejected"
                        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {car.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-400 font-mono mt-1">
                  <span>✉️ {car.email}</span>
                  <span>📞 {car.phone}</span>
                  <span>🏢 {car.department}</span>
                  <span>📅 {new Date(car.createdAt).toLocaleDateString("bn-BD")}</span>
                </div>

                {car.coverLetter && (
                  <p className="text-stone-300 leading-relaxed mt-2.5 italic bg-black/40 border border-white/10 p-3 rounded-xl">
                    &ldquo;{car.coverLetter}&rdquo;
                  </p>
                )}

                <div className="flex gap-2 items-center mt-3 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-stone-400 font-mono uppercase tracking-wider">
                    স্ট্যাটাস পরিবর্তন:
                  </span>
                  {["Reviewing", "Shortlisted", "Rejected"].map((state) => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => onUpdateStatus(car.id, state)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono border transition-all cursor-pointer ${
                        car.status === state
                          ? "bg-emerald-500 text-stone-950 border-emerald-500 font-bold shadow-md shadow-emerald-500/20"
                          : "bg-white/5 text-stone-400 border-white/10 hover:border-emerald-500/50 hover:text-white"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons Right */}
              <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 font-mono">
                {car.resumeUrl && (
                  <div className="flex gap-1.5">
                    <a
                      href={car.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl font-semibold text-xs border border-white/10 transition-all flex items-center gap-1"
                    >
                      👁️ ভিউ
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDownloadCv(car.resumeUrl, car.name)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      📥 ডাউনলোড
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteCareer(car.id)}
                  className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer text-xs"
                  title="আবেদন মুছে ফেলুন"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
