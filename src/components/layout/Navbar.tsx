"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface IMenuLink {
  id: string;
  titleBn: string;
  titleEn: string;
  url: string;
  badge?: string;
  isVisible: boolean;
  order: number;
}

interface INavbarSettings {
  logoType: "TEXT" | "IMAGE";
  logoText: string;
  logoImage?: string;
  logoHeight?: number;
  logoTracking?: string;
  hotlinePhone: string;
  hotlineDisplay: string;
  hotlineVisible: boolean;
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappVisible: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  socialVisible: boolean;
  enableLanguageSwitch: boolean;
  enable3dWizardLink: boolean;
  enableEmergencyDoctor: boolean;
  menuLinks: IMenuLink[];
}

const DEFAULT_NAVBAR_SETTINGS: INavbarSettings = {
  logoType: "TEXT",
  logoText: "A R GREEN GARDEN",
  logoImage: "",
  logoHeight: 28,
  logoTracking: "0.22em",
  hotlinePhone: "01883012641",
  hotlineDisplay: "০১88৩-০১২৬৪১",
  hotlineVisible: true,
  whatsappNumber: "8801883012641",
  whatsappMessage: "Hello A R Green Garden, I would like to consult about my garden.",
  whatsappVisible: true,
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "https://linkedin.com",
  youtubeUrl: "https://youtube.com",
  socialVisible: true,
  enableLanguageSwitch: true,
  enable3dWizardLink: true,
  enableEmergencyDoctor: true,
  menuLinks: [
    { id: "1", titleBn: "প্রকল্পসমূহ (Portfolio)", titleEn: "Projects & Portfolio", url: "/projects", isVisible: true, order: 1 },
    { id: "2", titleBn: "সেবাসমূহ", titleEn: "Landscape Services", url: "/services", isVisible: true, order: 2 },
    { id: "3", titleBn: "মেথডোলজি ও কাজের ধাপ", titleEn: "Methodology & Process", url: "#process", isVisible: true, order: 3 },
    { id: "4", titleBn: "প্ল্যান্ট নার্সারি ও শপ", titleEn: "Plant Nursery & Shop", url: "/shop", badge: "SHOP", isVisible: true, order: 4 },
    { id: "5", titleBn: "ফটো গ্যালারি", titleEn: "Photo Gallery", url: "/gallery", isVisible: true, order: 5 },
    { id: "6", titleBn: "বিফোর-আফটার রূপান্তর", titleEn: "Before & After Showcase", url: "/before-after", badge: "NEW", isVisible: true, order: 6 },
    { id: "7", titleBn: "আমাদের টিম", titleEn: "Our Landscape Team", url: "/team", isVisible: true, order: 7 },
    { id: "8", titleBn: "স্টুডিও পরিচিতি", titleEn: "About Studio", url: "/about", isVisible: true, order: 8 },
    { id: "9", titleBn: "গ্রাহক মতামত", titleEn: "Client Testimonials", url: "/testimonials", isVisible: true, order: 9 },
    { id: "10", titleBn: "সংবাদ ও ব্লগ", titleEn: "Articles & Blog", url: "/blog", isVisible: true, order: 10 },
    { id: "11", titleBn: "সাধারণ জিজ্ঞাসা (FAQ)", titleEn: "Frequently Asked Questions", url: "/faq", isVisible: true, order: 11 },
    { id: "12", titleBn: "ক্যারিয়ার সুযোগ", titleEn: "Careers at Studio", url: "/career", isVisible: true, order: 12 },
    { id: "13", titleBn: "যোগাযোগ ও কনসাল্টেশন", titleEn: "Contact & Consultation", url: "/contact", isVisible: true, order: 13 },
  ],
};

interface NavbarProps {
  onOpenEstimator?: () => void;
}

export default function Navbar({ onOpenEstimator }: NavbarProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navConfig, setNavConfig] = useState<INavbarSettings>(DEFAULT_NAVBAR_SETTINGS);

  // Automatically make header solid with readable dark text on non-home pages
  const isHome = pathname === "/" || pathname === "" || !pathname;
  const isHeaderSolid = isScrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dynamic navbar settings from database
  useEffect(() => {
    const fetchNavbarConfig = async () => {
      try {
        const res = await fetch(`/api/settings?_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.value?.navbar_config) {
            setNavConfig({
              ...DEFAULT_NAVBAR_SETTINGS,
              ...data.value.navbar_config,
              menuLinks: data.value.navbar_config.menuLinks || DEFAULT_NAVBAR_SETTINGS.menuLinks,
            });
          } else if (data?.value) {
            setNavConfig((prev) => ({
              ...prev,
              logoText: data.value.title || prev.logoText,
              hotlinePhone: data.value.phone || prev.hotlinePhone,
              facebookUrl: data.value.fbPage || prev.facebookUrl,
            }));
          }
        }
      } catch (err) {
        console.warn("Failed to load navbar settings:", err);
      }
    };

    fetchNavbarConfig();

    const handleCustomUpdate = (e: CustomEvent<INavbarSettings>) => {
      if (e.detail) {
        setNavConfig((prev) => ({
          ...prev,
          ...e.detail,
          menuLinks: e.detail.menuLinks || prev.menuLinks,
        }));
      }
    };

    window.addEventListener("navbar-config-updated" as any, handleCustomUpdate as any);
    return () => {
      window.removeEventListener("navbar-config-updated" as any, handleCustomUpdate as any);
    };
  }, []);

  // Prevent background scrolling when menu popup is active
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const activeLinks = (navConfig.menuLinks || DEFAULT_NAVBAR_SETTINGS.menuLinks)
    .filter((l) => l.isVisible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <>
      {/* DYNAMIC SHMA ARCHITECTURAL HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isHeaderSolid
            ? "bg-white/95 backdrop-blur-md shadow-xs py-3 sm:py-4 border-b border-black/5 text-[#323232]"
            : "bg-gradient-to-b from-black/60 via-black/25 to-transparent py-4 sm:py-6 text-white"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 md:px-8 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Column 1: Minimalist Thin 3-Line Hamburger Icon + Compact Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMenuOpen(true)}
              className="group flex items-center p-1.5 -ml-1 text-inherit transition-opacity hover:opacity-70 cursor-pointer focus:outline-none"
              aria-label={t("মেন্যু খুলুন", "Open Navigation Menu")}
            >
              <div className="flex flex-col gap-1 w-6 sm:w-7">
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isHeaderSolid ? "bg-[#323232]" : "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  }`}
                ></span>
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isHeaderSolid ? "bg-[#323232]" : "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  }`}
                ></span>
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isHeaderSolid ? "bg-[#323232]" : "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  }`}
                ></span>
              </div>
            </button>

            {/* Language Switcher Pill Toggle */}
            {navConfig.enableLanguageSwitch !== false && (
              <button
                onClick={toggleLanguage}
                className={`text-[11px] sm:text-xs font-mono tracking-wider px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border transition-all flex items-center gap-1 cursor-pointer select-none ${
                  isHeaderSolid
                    ? "border-[#323232]/25 hover:border-[#323232] text-[#323232] bg-black/[0.03]"
                    : "border-white/50 hover:border-white text-white bg-black/20 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
                }`}
                title={t("Switch to English", "বাংলা ভাষায় পরিবর্তন করুন")}
              >
                <span className={language === "bn" ? "font-bold underline underline-offset-2" : "opacity-75"}>
                  বাং
                </span>
                <span className="opacity-40">|</span>
                <span className={language === "en" ? "font-bold underline underline-offset-2" : "opacity-75"}>
                  EN
                </span>
              </button>
            )}
          </div>

          {/* Column 2: Responsive Center Logo */}
          <div className="flex-1 flex items-center justify-center text-center px-1 min-w-0">
            <Link href="/" className="group inline-block max-w-[160px] xs:max-w-[190px] sm:max-w-none">
              {navConfig.logoType === "IMAGE" && navConfig.logoImage ? (
                <img
                  src={navConfig.logoImage}
                  alt={navConfig.logoText || "A R GREEN GARDEN"}
                  style={{ height: `${navConfig.logoHeight || 28}px` }}
                  className="object-contain max-h-[48px]"
                />
              ) : (
                <span
                  className={`font-display font-light text-xs xs:text-sm sm:text-lg md:text-[22px] lg:text-[25px] uppercase transition-colors truncate block ${
                    isHeaderSolid ? "text-[#323232]" : "text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
                  }`}
                  style={{ letterSpacing: navConfig.logoTracking || "0.22em" }}
                >
                  {navConfig.logoText || "A R GREEN GARDEN"}
                </span>
              )}
            </Link>
          </div>

          {/* Column 3: Hotline, WhatsApp & Dashboard */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
            {/* Social Icons */}
            {navConfig.socialVisible !== false && (
              <div className="hidden xl:flex items-center gap-3.5 text-inherit">
                {navConfig.facebookUrl && (
                  <a
                    href={navConfig.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-inherit hover:opacity-60 transition-opacity"
                    aria-label="Facebook"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512">
                      <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
                    </svg>
                  </a>
                )}

                {navConfig.instagramUrl && (
                  <a
                    href={navConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-inherit hover:opacity-60 transition-opacity"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1z"></path>
                    </svg>
                  </a>
                )}

                {navConfig.linkedinUrl && (
                  <a
                    href={navConfig.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-inherit hover:opacity-60 transition-opacity"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                    </svg>
                  </a>
                )}
              </div>
            )}

            {/* Hotline Phone */}
            {navConfig.hotlineVisible !== false && (
              <a
                href={`tel:${navConfig.hotlinePhone || "01883012641"}`}
                className={`text-xs font-mono tracking-wider hover:opacity-75 transition-opacity border-b pb-0.5 whitespace-nowrap hidden lg:inline ${
                  isHeaderSolid ? "text-[#323232] border-[#323232]/35" : "text-white border-white/50 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
                }`}
              >
                {navConfig.hotlineDisplay || navConfig.hotlinePhone || "০১88৩-০১২৬৪১"}
              </a>
            )}

            {/* Direct WhatsApp Action */}
            {navConfig.whatsappVisible !== false && (
              <a
                href={`https://wa.me/${navConfig.whatsappNumber || "8801883012641"}?text=${encodeURIComponent(
                  navConfig.whatsappMessage || "Hello A R Green Garden, I would like to consult about my garden."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 sm:px-3 sm:py-1 bg-[#25D366] hover:bg-[#20ba59] text-stone-950 font-bold rounded-full text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="WhatsApp"
              >
                <span className="text-sm sm:text-xs">💬</span>
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            {/* Login / Dashboard Link */}
            {user ? (
              <Link
                href={
                  user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "editor"
                    ? "/admin"
                    : user.role?.toLowerCase() === "employee"
                    ? "/employee-portal"
                    : user.role?.toLowerCase() === "moderator"
                    ? "/moderator"
                    : "/client-dashboard"
                }
                className="pl-1 pr-2 sm:pl-1.5 sm:pr-3.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-[11px] sm:text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap border border-emerald-600/40"
                title={user.name ? `Logged in as ${user.name}` : "Dashboard"}
              >
                <div className="w-5 h-5 rounded-full overflow-hidden bg-emerald-950 border border-white/60 flex items-center justify-center shrink-0 shadow-inner">
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=064e3b&color=ffffff&bold=true&size=64`
                    }
                    alt={user.name || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="tracking-wide hidden xs:inline">Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-semibold shadow-xs transition-all flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                  isHeaderSolid
                    ? "bg-stone-100 hover:bg-stone-200 text-[#323232] border border-stone-300"
                    : "bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xs"
                }`}
              >
                <span>👤</span>
                <span className="hidden xs:inline">{t("লগইন", "Login")}</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* SHMA POPUP: FULL-HEIGHT SLIDE-IN DRAWER MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer transition-opacity"
          ></div>

          {/* Left Slide Menu Container: Deep Architectural Emerald #142017 */}
          <div className="relative w-full max-w-[420px] bg-[#142017] text-white h-full overflow-y-auto px-6 sm:px-10 py-8 flex flex-col justify-between z-10 shadow-2xl border-r border-white/10 animate-fade-in-up">
            
            {/* Top Close Hamburger & Language Toggle */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <button
                onClick={() => setMenuOpen(false)}
                className="group flex items-center p-2 -ml-2 text-white hover:opacity-70 cursor-pointer focus:outline-none"
                aria-label="Close Navigation Menu"
              >
                <div className="flex flex-col gap-1 w-6">
                  <span className="w-full h-[1.5px] bg-white"></span>
                  <span className="w-full h-[1.5px] bg-white"></span>
                  <span className="w-full h-[1.5px] bg-white"></span>
                </div>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {navConfig.enableLanguageSwitch !== false && (
                  <>
                    <button
                      onClick={() => setLanguage("bn")}
                      className={`px-2.5 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                        language === "bn"
                          ? "bg-emerald-500 text-stone-950 font-bold shadow"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      বাংলা
                    </button>
                    <button
                      onClick={() => setLanguage("en")}
                      className={`px-2.5 py-1 rounded-full text-xs font-sans transition-all cursor-pointer ${
                        language === "en"
                          ? "bg-emerald-500 text-stone-950 font-bold shadow"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      English
                    </button>
                  </>
                )}

                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-white hover:opacity-70 text-xl p-1.5 ml-1 cursor-pointer focus:outline-none rounded-full bg-white/10"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Navigation Links (Dynamic from Database) */}
            <div className="space-y-6 my-auto py-4">
              
              <div className="space-y-2.5 font-display font-light">
                {activeLinks.map((link) => {
                  const title = language === "bn" ? (link.titleBn || link.titleEn) : (link.titleEn || link.titleBn);
                  const isAnchor = link.url.startsWith("#");

                  if (isAnchor) {
                    return (
                      <div key={link.id} className="flex items-center justify-between">
                        <a
                          href={link.url}
                          onClick={() => setMenuOpen(false)}
                          className="text-2xl sm:text-[28px] font-light hover:text-[#dedad2] transition-colors block leading-tight text-white/95"
                        >
                          {title}
                        </a>
                        {link.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                            {link.badge}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div key={link.id} className="flex items-center justify-between">
                      <Link
                        href={link.url}
                        onClick={() => setMenuOpen(false)}
                        className="text-2xl sm:text-[28px] font-light hover:text-[#dedad2] transition-colors block leading-tight text-white/95"
                      >
                        {title}
                      </Link>
                      {link.badge && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {link.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Special Feature Links */}
              <div className="space-y-2.5 font-display font-light pt-4 border-t border-white/20">
                {navConfig.enable3dWizardLink !== false && (
                  <div className="pt-1">
                    <Link
                      href="/design-garden"
                      onClick={() => setMenuOpen(false)}
                      className="text-base sm:text-lg font-normal text-[#dedad2] hover:text-white transition-colors block"
                    >
                      <span>{t("3D Garden Wizard 🎨", "3D Garden Wizard 🎨")}</span>
                      <span className="text-xs font-sans text-emerald-200/80 block mt-0.5 font-normal">
                        {t("কাস্টম ছাদবাগান বাজেট ও নকশা", "Interactive Landscape Estimator & Design")}
                      </span>
                    </Link>
                  </div>
                )}

                {navConfig.enableEmergencyDoctor !== false && (
                  <div>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        window.dispatchEvent(new CustomEvent("open-tree-doctor"));
                      }}
                      className="text-base sm:text-lg font-normal text-red-200 hover:text-white transition-colors block cursor-pointer text-left w-full"
                    >
                      <span>{t("Emergency Tree Doctor 🚨", "Emergency Tree Doctor 🚨")}</span>
                      <span className="text-xs font-sans text-red-200/80 block mt-0.5 font-normal">
                        {t("অন-কল ডাক্তার ভিজিট ও রোগ নির্ণয়", "Urgent Tree Clinic, Surgery & Visit")}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Drawer Auth / Dashboard Actions */}
              <div className="pt-3 border-t border-white/20">
                {user ? (
                  <div className="flex items-center justify-between bg-black/25 p-3 rounded-2xl">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-950 border border-emerald-400/40 shrink-0 flex items-center justify-center shadow-inner">
                        <img
                          src={
                            user.avatar ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=064e3b&color=ffffff&bold=true&size=64`
                          }
                          alt={user.name || "User"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-bold text-white truncate max-w-[110px]">{user.name}</p>
                        <p className="text-[10px] text-emerald-300 font-mono uppercase tracking-wider">{user.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={
                          user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "editor"
                            ? "/admin"
                            : user.role?.toLowerCase() === "employee"
                            ? "/employee-portal"
                            : user.role?.toLowerCase() === "moderator"
                            ? "/moderator"
                            : "/client-dashboard"
                        }
                        onClick={() => setMenuOpen(false)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        className="px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        {t("লগআউট", "Logout")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow"
                    >
                      👤 {t("লগইন করুন", "Sign In")}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all"
                    >
                      ✨ {t("রেজিস্ট্রেশন", "Register")}
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Studio Info */}
            <div className="pt-6 border-t border-white/20 text-xs font-sans text-white/80 grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-white">
                  {t("এ আর গ্রিন গার্ডেন কোং লি.", "A R Green Garden Co., Ltd.")}
                </p>
                <p className="text-[11px] text-white/70">
                  {t("ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও", "Landscape Architecture Studio")}
                </p>
                <p className="pt-1 text-[11px] leading-relaxed text-white/60">
                  {t("৪২/এ, রোড ৯/এ, ধানমন্ডি,", "42/A, Road 9/A, Dhanmondi,")}<br />
                  {t("ঢাকা-১২০৯, বাংলাদেশ", "Dhaka-1209, Bangladesh")}
                </p>
              </div>
              <div className="text-[11px] leading-relaxed">
                <p className="font-semibold text-white">
                  {t("হটলাইন: ০১৮৮৩-০১২৬৪১", `Hotline: ${navConfig.hotlineDisplay || navConfig.hotlinePhone}`)}
                </p>
                <a
                  href={`https://wa.me/${navConfig.whatsappNumber || "8801883012641"}?text=${encodeURIComponent(
                    navConfig.whatsappMessage || "Hello A R Green Garden, I would like to consult about my garden."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-[#25D366] text-stone-950 font-bold text-xs shadow"
                >
                  <span>💬</span> WhatsApp Chat
                </a>
                <p className="pt-2 text-white/70">admin@argreengarden.com</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
