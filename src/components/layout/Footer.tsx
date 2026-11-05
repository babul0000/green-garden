"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const isBn = language === "bn";
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [interests, setInterests] = useState<string[]>(["Rooftop garden", "Tree care"]);

  const toggleInterest = (item: string) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setPhone("");
      setEmail("");
    }, 4000);
  };

  return (
    <footer id="newsletter" className="w-full bg-[#194B37] text-white overflow-hidden select-none">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16 py-16 sm:py-20 space-y-12 sm:space-y-14">
        {/* ================= PART 1: NEWSLETTER (FIGMA SPEC) ================= */}
        <div className="space-y-3">
          <h2 className="font-serif text-[38px] sm:text-[48px] lg:text-[56px] font-normal leading-[1.08] text-white tracking-tight">
            {isBn ? "একসাথে, আরেকটু সবুজ।" : "A little greener, together."}
          </h2>
          <p className="text-xs sm:text-[14px] text-[#E8EEE4] leading-relaxed font-sans max-w-2xl">
            {isBn
              ? "মৌসুমী ল্যান্ডস্কেপ নোটস, ব্যবহারিক গাছের পরিচর্যা ও আপনার পরবর্তী সবুজ আঙ্গিনার নতুন ভাবনা।"
              : "Seasonal notes, practical care and ideas for your next green space."}
          </p>
        </div>

        {/* Subscribe Form (Figma: 3 Input Cards + Subscribe Button) */}
        <form onSubmit={handleSubscribe} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            {/* Field 1: Name */}
            <div className="lg:col-span-3 bg-white rounded-xl p-3 sm:p-3.5 shadow-sm text-left">
              <label className="block text-[10px] font-mono text-[#6B746C] uppercase tracking-wider">
                {isBn ? "নাম" : "Name"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isBn ? "আপনার নাম লিখুন" : "Enter name"}
                className="w-full text-xs sm:text-sm font-sans text-[#183A2D] bg-transparent focus:outline-none placeholder:text-stone-400 mt-0.5"
              />
            </div>

            {/* Field 2: Phone */}
            <div className="lg:col-span-3 bg-white rounded-xl p-3 sm:p-3.5 shadow-sm text-left">
              <label className="block text-[10px] font-mono text-[#6B746C] uppercase tracking-wider">
                {isBn ? "ফোন" : "Phone"}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={isBn ? "মোবাইল নম্বর" : "Enter phone"}
                className="w-full text-xs sm:text-sm font-sans text-[#183A2D] bg-transparent focus:outline-none placeholder:text-stone-400 mt-0.5"
              />
            </div>

            {/* Field 3: Email */}
            <div className="lg:col-span-4 bg-white rounded-xl p-3 sm:p-3.5 shadow-sm text-left">
              <label className="block text-[10px] font-mono text-[#6B746C] uppercase tracking-wider">
                {isBn ? "ইমেইল" : "Email"}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isBn ? "ইমেইল ঠিকানা লিখুন" : "Enter email"}
                className="w-full text-xs sm:text-sm font-sans text-[#183A2D] bg-transparent focus:outline-none placeholder:text-stone-400 mt-0.5"
              />
            </div>

            {/* Action: Subscribe */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                className="w-full group/btn inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-white hover:bg-[#DDE8AA] text-[#183A2D] text-xs sm:text-sm font-medium tracking-wide shadow-md transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>{submitted ? (isBn ? "সাবস্ক্রাইবড!" : "Subscribed!") : (isBn ? "সাবস্ক্রাইব" : "Subscribe")}</span>
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Interest Checkboxes (Figma: Rooftop garden / Drainage / Tree care / Drip irrigation) */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-2 text-xs text-[#E8EEE4]">
            {[
              { id: "Rooftop garden", labelBn: "ছাদবাগান", labelEn: "Rooftop garden" },
              { id: "Drainage", labelBn: "ড্রেনেজ", labelEn: "Drainage" },
              { id: "Tree care", labelBn: "বৃক্ষ চিকিৎসা", labelEn: "Tree care" },
              { id: "Drip irrigation", labelBn: "ড্রিপ সেচ", labelEn: "Drip irrigation" },
            ].map((item) => {
              const checked = interests.includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className="inline-flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-100"
                >
                  <span className={`w-3.5 h-3.5 rounded-xs flex items-center justify-center text-[10px] font-bold border ${
                    checked ? "bg-white text-[#183A2D] border-white" : "border-white/60 bg-transparent text-transparent"
                  }`}>
                    ✓
                  </span>
                  <span className={checked ? "font-medium text-white" : "text-[#E8EEE4]/85"}>
                    {isBn ? item.labelBn : item.labelEn}
                  </span>
                </button>
              );
            })}
          </div>
        </form>

        {/* Footer Rule (Figma: 1328x1) */}
        <div className="w-full h-[1px] bg-white/20" />

        {/* ================= PART 2: OFFICE AND MISSION (FIGMA SPEC) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 items-start text-left">
          {/* Col 1: Mission */}
          <div className="space-y-3">
            <h3 className="font-mono text-base sm:text-lg font-medium text-white tracking-[0.15em] uppercase">
              A R GREEN GARDEN
            </h3>
            <p className="text-xs sm:text-[13px] text-[#E8EEE4] leading-relaxed max-w-sm">
              {isBn
                ? "মানুষ, উদ্ভিদ ও আমাদের অভিন্ন পরিবেশের জন্য আধুনিক ও সুপরিকল্পিত ল্যান্ডস্কেপ স্থাপত্য।"
                : "Thoughtful landscapes for people, plants and the places we share."}
            </p>
            <div className="flex items-center gap-3 pt-1 text-xs text-[#E8EEE4]/80 font-mono">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Facebook</a>
              <span>/</span>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Instagram</a>
              <span>/</span>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <span>/</span>
              <a href="https://wa.me/8801883012641" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
            </div>
          </div>

          {/* Col 2: Visit the studio */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs sm:text-[13px] font-medium tracking-wider uppercase text-white">
              {isBn ? "স্টুডিও ভিজিট করুন" : "VISIT THE STUDIO"}
            </h4>
            <p className="text-xs sm:text-[13px] text-[#E8EEE4] leading-relaxed">
              ৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা
            </p>
            <p className="text-[11px] sm:text-xs text-[#E8EEE4]/75 font-mono">
              42/A, Road 9/A, Dhanmondi, Dhaka
            </p>
          </div>

          {/* Col 3: Departments (Let's Talk) */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs sm:text-[13px] font-medium tracking-wider uppercase text-white">
              {isBn ? "যোগাযোগ করুন" : "LET’S TALK"}
            </h4>
            <div className="space-y-1 text-xs text-[#E8EEE4] font-sans">
              <p>
                <span className="opacity-75 font-mono">{isBn ? "প্রকল্প শাখা:" : "Projects ·"}</span>{" "}
                <a href="mailto:project@argreengarden.com" className="hover:underline text-white font-medium">project@argreengarden.com</a>
              </p>
              <p>
                <span className="opacity-75 font-mono">{isBn ? "বৃক্ষ চিকিৎসা:" : "Tree Doctor ·"}</span>{" "}
                <a href="mailto:doctor@argreengarden.com" className="hover:underline text-white font-medium">doctor@argreengarden.com</a>
              </p>
              <p>
                <span className="opacity-75 font-mono">{isBn ? "হটলাইন:" : "Hotline ·"}</span>{" "}
                <a href="tel:01883012641" className="hover:underline text-white font-medium">01883-012641</a>
              </p>
            </div>
          </div>
        </div>

        {/* ================= PART 3: BOTTOM COPYRIGHT & LEGAL BAR ================= */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] sm:text-[11px] font-mono text-[#E8EEE4]/70">
          <span>
            © 2026 A R GREEN GARDEN. All rights reserved.
          </span>

          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy</Link>
            <span>/</span>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>/</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLanguage("bn")}
                className={`cursor-pointer transition-colors ${language === "bn" ? "text-white font-bold underline" : "hover:text-white"}`}
              >
                বাংলা
              </button>
              <span>|</span>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`cursor-pointer transition-colors ${language === "en" ? "text-white font-bold underline" : "hover:text-white"}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
