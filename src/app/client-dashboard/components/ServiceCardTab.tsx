"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { ProjectItem, PlantHealthItem } from "../types";

interface ServiceCardTabProps {
  activeProject?: ProjectItem;
  clientDisplayName: string;
  plantRecords: PlantHealthItem[];
}

export default function ServiceCardTab({
  activeProject,
  clientDisplayName,
  plantRecords,
}: ServiceCardTabProps) {
  const { t } = useLanguage();

  return (
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
        <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 flex flex-col sm:row justify-between items-start sm:items-center gap-3">
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
  );
}
