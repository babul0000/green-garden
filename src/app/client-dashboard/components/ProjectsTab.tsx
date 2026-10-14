"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { ProjectItem } from "../types";

interface ProjectsTabProps {
  projects: ProjectItem[];
  onTabChange: (tab: string) => void;
}

export default function ProjectsTab({ projects, onTabChange }: ProjectsTabProps) {
  const { t } = useLanguage();

  return (
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
          <div
            key={proj.id}
            className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
          >
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-emerald-300">
                  {proj.category}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    proj.status === "COMPLETED"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                  }`}
                >
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
                />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] font-mono text-white/40 block">{t("বাজেট", "Budget")}</span>
                <span className="font-mono font-bold text-[#E4E2D7]">৳{(proj.budget || 0).toLocaleString()}</span>
              </div>
              <button
                onClick={() => onTabChange("service-card")}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-emerald-300 font-mono font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                {t("সার্ভিস কার্ড দেখুন →", "Service Card →")}
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="col-span-3 text-center py-12 bg-white/[0.02] rounded-3xl border border-white/10">
            <p className="text-sm text-white/50">{t("আপনার কোনো সক্রিয় প্রজেক্ট নেই।", "You have no active projects currently.")}</p>
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
  );
}
