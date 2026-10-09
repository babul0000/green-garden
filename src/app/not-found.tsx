"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#121A14] text-white px-4 sm:px-6 py-20 overflow-hidden font-sans">
      {/* Background Architectural Ambient Grid & Glow matching Home Page */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-40 pointer-events-none"></div>
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10 text-center space-y-8 animate-fade-in-up">
        {/* Studio Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
            A R Green Garden Studio • 404 Error
          </span>
        </div>

        {/* 404 Architectural Display */}
        <div className="space-y-4">
          <h1 className="font-display text-8xl sm:text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-[#E4E2D7] via-white/80 to-emerald-500/30">
            404
          </h1>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#E4E2D7]">
            {t("পৃষ্ঠাটি খুঁজে পাওয়া যায়নি", "Page Not Found in our Studio")}
          </h2>
          <p className="text-sm text-white/60 font-sans leading-relaxed max-w-md mx-auto">
            {t(
              "আপনি যে পাতাটি খুঁজছেন তা হয়তো সরানো হয়েছে, নাম পরিবর্তন করা হয়েছে অথবা সাময়িকভাবে অনুপলব্ধ।",
              "The architectural page or portal resource you are looking for might have been removed, had its name changed, or is temporarily unavailable."
            )}
          </p>
        </div>

        {/* Glassmorphic Navigation Card */}
        <div className="bg-[#18221A]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400">
            {t("প্রয়োজনীয় লিংকসমূহ", "Helpful Quick Destinations")}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 hover:scale-[1.02] cursor-pointer"
            >
              <span>🏡</span>
              <span>{t("হোম পেজে ফিরে যান", "Return to Home")}</span>
            </Link>

            <Link
              href="/client-dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-2xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>📊</span>
              <span>{t("ক্লায়েন্ট ড্যাশবোর্ড", "Client Dashboard")}</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-2xl text-xs uppercase tracking-wider transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>🔐</span>
              <span>{t("লগইন পোর্টাল", "Login Portal")}</span>
            </Link>
          </div>
        </div>

        {/* Footer help text */}
        <p className="text-[11px] text-white/40 font-mono">
          A R Green Garden • Sustainable Landscape Architecture & Garden ERP • Bangladesh
        </p>
      </div>
    </div>
  );
}
