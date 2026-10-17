"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [submitted, setSubmitted] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string, any>>({
    title: "A R GREEN GARDEN",
    tagline: "LANDSCAPE ARCHITECTURE STUDIO",
    phone: "01883012641",
    whatsapp: "8801883012641",
    whatsappMessage: "Hello A R Green Garden, I would like to consult about my garden.",
    email: "admin@argreengarden.com",
    projectEmail: "project@argreengarden.com",
    address: "৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ",
    fbPage: "https://facebook.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
    estYear: "2026",
    bio: "বাংলাদেশজুড়ে আধুনিক ল্যান্ডস্কেপ আর্কিটেকচার, ছাদ বাগান, বায়োফিলিক ইন্টেরিয়র ও সার্টিফাইড বৃক্ষ চিকিৎসা সেবা প্রদানে আমরা নিবেদিতপ্রাণ।",
  });

  // Load master settings dynamically from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.value) {
            setSiteSettings((prev) => ({
              ...prev,
              ...data.value,
            }));
          }
        }
      } catch (err) {
        console.warn("Footer settings fallback to defaults");
      }
    };

    fetchSettings();

    // Listen to live update events from settings tab
    const handleSettingsUpdated = (e: any) => {
      if (e?.detail) {
        setSiteSettings((prev) => ({ ...prev, ...e.detail }));
      }
    };
    window.addEventListener("site-settings-updated", handleSettingsUpdated);
    return () => window.removeEventListener("site-settings-updated", handleSettingsUpdated);
  }, []);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const whatsappHref = `https://wa.me/${siteSettings.whatsapp || "8801883012641"}?text=${encodeURIComponent(
    siteSettings.whatsappMessage || "Hello A R Green Garden, I would like to consult about my garden."
  )}`;

  return (
    <footer id="newsletter" className="relative w-full text-white">
      
      {/* ================= PART 1: NEWSLETTER SECTION ================= */}
      <div className="relative w-full py-20 px-6 sm:px-10 bg-[#16202c] overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 w-full h-full opacity-25">
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1600&auto=format&fit=crop"
            alt="Community background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-[1380px] mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="font-display font-light text-3xl sm:text-5xl md:text-[50px] text-white leading-tight">
              {t("Join Our Community & Be Part of the Vision", "Join Our Community & Be Part of the Vision")}
            </h2>
            <p className="font-sans text-sm sm:text-base text-white/80 font-normal">
              {t(
                "নিয়মিত ল্যান্ডস্কেপ স্থাপত্য আপডেট, ছাদবাগানের আধুনিক টিপস ও গবেষণা পেতে ইমেইল সাবস্ক্রাইব করুন।",
                "Receive monthly landscape architecture case studies, biophilic tips, and ecological insights."
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <input
                  type="text"
                  required
                  placeholder={t("আপনার নাম", "First Name")}
                  className="w-full bg-white text-[#323232] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a9dff]"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder={t("মোবাইল নম্বর", "Phone Number")}
                  className="w-full bg-white text-[#323232] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a9dff]"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder={t("ইমেইল ঠিকানা", "Email Address")}
                  className="w-full bg-white text-[#323232] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#5a9dff]"
                />
              </div>
            </div>

            {/* Area of Interest Checkboxes */}
            <div className="space-y-3">
              <span className="font-sans text-xs uppercase tracking-wider text-white/80 block">
                {t("আপনার আগ্রহের বিষয়সমূহ:", "Areas of Interest:")}
              </span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs sm:text-sm font-light text-white/90">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#5a9dff]" defaultChecked />
                  <span>{t("নতুন প্রকল্প", "New Project")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#5a9dff]" />
                  <span>{t("ছাদবাগান ও ড্রেনেজ", "Rooftop Garden")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#5a9dff]" />
                  <span>{t("ভার্টিক্যাল গ্রিন ওয়াল", "Vertical Living Wall")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#5a9dff]" />
                  <span>{t("বৃক্ষ চিকিৎসা ও ট্রি ক্লিনিক", "Tree Doctor & Surgery")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded accent-[#5a9dff]" />
                  <span>{t("স্মার্ট সেচ প্রযুক্তি", "Smart Drip Irrigation")}</span>
                </label>
              </div>
            </div>

            {/* Pill Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="px-10 py-3 rounded-full bg-[#dedad2] hover:bg-white text-[#3d2e17] font-sans text-sm tracking-wide transition-all shadow-md cursor-pointer font-medium"
              >
                {submitted
                  ? t("ধন্যবাদ! আমরা শীঘ্রই যোগাযোগ করব।", "Thank you! We will reach out soon.")
                  : t("সাবস্ক্রাইব করুন", "Subscribe Now")}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ================= PART 2: FOOTER NAVIGATION & COORDINATES ================= */}
      <div className="w-full bg-[#041a2e] text-white/80 py-16 px-6 sm:px-10 border-t border-white/10">
        <div className="max-w-[1380px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14 items-start">
          
          {/* Col 1: Architectural Outline Vector Logo (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" onClick={handleLogoClick} className="inline-block group">
              <div className="flex flex-col">
                <span className="font-display font-extralight text-2xl sm:text-3xl md:text-4xl tracking-[0.12em] sm:tracking-[0.25em] uppercase text-white group-hover:text-[#5a9dff] transition-colors">
                  {siteSettings.title || "A R GREEN GARDEN"}
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.28em] text-white/60 uppercase mt-1">
                  {siteSettings.tagline || t("LANDSCAPE ARCHITECTURE STUDIO", "LANDSCAPE ARCHITECTURE STUDIO")}
                </span>
              </div>
            </Link>
            <p className="text-xs text-white/70 font-light leading-relaxed max-w-sm pt-2">
              {siteSettings.bio || t(
                "বাংলাদেশজুড়ে আধুনিক ল্যান্ডস্কেপ আর্কিটেকচার, ছাদ বাগান, বায়োফিলিক ইন্টেরিয়র ও সার্টিফাইড বৃক্ষ চিকিৎসা সেবা প্রদানে আমরা নিবেদিতপ্রাণ।",
                "Dedicated to sustainable landscape architecture, biophilic living walls, and expert tree clinic services across Bangladesh."
              )}
            </p>
          </div>

          {/* Col 2: Company Coordinates (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-xs font-sans font-light leading-relaxed">
            <h4 className="font-sans font-bold text-white uppercase tracking-wider text-xs">
              {t("STUDIO COORDINATES", "STUDIO COORDINATES")}
            </h4>
            <div className="space-y-1 text-white/70">
              <p>{siteSettings.address || t("৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ", "42/A, Road 9/A, Dhanmondi, Dhaka-1209, Bangladesh")}</p>
              <p className="pt-1 text-white/95 font-medium">
                {t("হটলাইন:", "Hotline:")} {siteSettings.phone || "01883012641"}
              </p>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:underline font-mono font-bold mt-1"
              >
                <span>💬</span> WhatsApp: +{siteSettings.whatsapp || "8801883012641"}
              </a>
              <p className="pt-1">E: {siteSettings.email || "admin@argreengarden.com"}</p>
            </div>
          </div>

          {/* Col 3: Department Emails (3 cols) */}
          <div className="md:col-span-3 space-y-4 text-xs font-sans font-light leading-relaxed">
            <div className="space-y-1">
              <h4 className="font-sans font-bold text-white uppercase tracking-wider text-xs">
                {t("NEW PROJECTS & INQUIRIES", "NEW PROJECTS & INQUIRIES")}
              </h4>
              <p className="text-white/70">
                {t("নতুন প্রকল্পের জন্য ইমেইল করুন:", "For new commissions and designs:")}
              </p>
              <a href={`mailto:${siteSettings.projectEmail || "project@argreengarden.com"}`} className="text-white hover:text-[#5a9dff] transition-colors">
                {siteSettings.projectEmail || "project@argreengarden.com"}
              </a>
            </div>

            <div className="space-y-1 pt-1">
              <h4 className="font-sans font-bold text-white uppercase tracking-wider text-xs">
                {t("TREE DOCTOR & PRESS", "TREE DOCTOR & PRESS")}
              </h4>
              <p className="text-white/70">
                {t("জরুরি সেবা ও গণমাধ্যম যোগাযোগ:", "Emergency arboriculture and media:")}
              </p>
              <a href={`mailto:${siteSettings.email || "admin@argreengarden.com"}`} className="text-white hover:text-[#5a9dff] transition-colors">
                {siteSettings.email || "admin@argreengarden.com"}
              </a>
            </div>
          </div>

          {/* Col 4: Social Icons & Language Switcher (2 cols) */}
          <div className="md:col-span-2 flex flex-col justify-between h-full space-y-6 text-left md:text-right md:items-end">
            {/* Language Switcher in Footer */}
            <div className="flex items-center gap-2 border border-white/20 rounded-full px-3 py-1 text-xs">
              <button
                onClick={() => setLanguage("bn")}
                className={`transition-colors cursor-pointer ${
                  language === "bn" ? "font-bold text-white underline" : "text-white/60 hover:text-white"
                }`}
              >
                বাংলা
              </button>
              <span className="text-white/40">|</span>
              <button
                onClick={() => setLanguage("en")}
                className={`transition-colors cursor-pointer ${
                  language === "en" ? "font-bold text-white underline" : "text-white/60 hover:text-white"
                }`}
              >
                English
              </button>
            </div>

            {/* Social SVGs */}
            <div className="flex items-center gap-4 text-white">
              {siteSettings.fbPage && (
                <a href={siteSettings.fbPage} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Facebook">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512">
                    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
                  </svg>
                </a>
              )}
              {siteSettings.instagram && (
                <a href={siteSettings.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1z"></path>
                  </svg>
                </a>
              )}
              {siteSettings.linkedin && (
                <a href={siteSettings.linkedin} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                  </svg>
                </a>
              )}
              {siteSettings.youtube && (
                <a href={siteSettings.youtube} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity" aria-label="YouTube">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 576 512">
                    <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.203-142.739 81.203z"></path>
                  </svg>
                </a>
              )}
            </div>

            {/* Bottom Copyright and Legal Bar */}
            <div className="flex flex-col md:items-end gap-2 pt-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/60">
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {t("গোপনীয়তা নীতি", "Privacy Policy")}
                </Link>
                <span className="text-white/30">•</span>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {t("শর্তাবলী", "Terms & Conditions")}
                </Link>
                <span className="text-white/30">•</span>
                <Link href="/refund-policy" className="hover:text-white transition-colors">
                  {t("রিফান্ড পলিসি", "Refund Policy")}
                </Link>
              </div>

              <p className="text-[11px] text-white/50">
                © {siteSettings.estYear || "2026"} {siteSettings.title || "এ আর গ্রিন গার্ডেন"} • {t("সর্বস্বত্ব সংরক্ষিত", "All rights reserved.")}
              </p>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
