"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import type { TreeDoctorItem } from "../types";

interface ConsultationTabProps {
  treeRequests: TreeDoctorItem[];
}

export default function ConsultationTab({ treeRequests }: ConsultationTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 mt-6 animate-fade-in-up">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
            Plant Healthcare
          </span>
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
  );
}
