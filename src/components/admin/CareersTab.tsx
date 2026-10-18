"use client";

import React, { useState } from "react";
import JobPostingsManager from "./careers/JobPostingsManager";
import CvApplicationsTracker from "./careers/CvApplicationsTracker";

import type { ICareerApplication, IMessage } from "@/types";

interface CareersTabProps {
  messages?: IMessage[];
  careers?: ICareerApplication[];
  handleDeleteMessage?: (id: string) => void;
  handleUpdateCareerStatus: (id: string, status: string) => void;
  handleDeleteCareer: (id: string) => void;
}

export default function CareersTab({
  careers = [],
  handleUpdateCareerStatus,
  handleDeleteCareer,
}: CareersTabProps) {
  const [subTab, setSubTab] = useState<"openings" | "applications">("openings");

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans text-[#E4E2D7]">
      {/* Top Banner with Subtab Switcher */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <span>💼</span> ক্যারিয়ার ও রিক্রুটমেন্ট • Talent Acquisition
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Job Openings Management & Candidate Applications
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            চাকরির সার্কুলার প্রকাশ এবং প্রার্থীদের সিভি যাচাই ও সরাসরি ডাউনলোড।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab("openings")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "openings"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            📢 নিয়োগ সার্কুলার
          </button>
          <button
            type="button"
            onClick={() => setSubTab("applications")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "applications"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            📄 সিভি ট্র্যাকার ({careers.length})
          </button>
        </div>
      </div>

      {/* Subtab 1: Job Openings Manager */}
      {subTab === "openings" && <JobPostingsManager />}

      {/* Subtab 2: CV Applications Tracker */}
      {subTab === "applications" && (
        <CvApplicationsTracker
          careers={careers}
          onUpdateStatus={handleUpdateCareerStatus}
          onDeleteCareer={handleDeleteCareer}
        />
      )}
    </div>
  );
}
