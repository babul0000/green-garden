"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export interface NavbarProps {
  onOpenEstimator?: () => void;
}

export interface IMenuLink {
  id: string;
  titleBn: string;
  titleEn: string;
  url: string;
  badge?: string;
  isVisible: boolean;
  order: number;
}

export interface INavbarConfig {
  logoType?: "TEXT" | "IMAGE";
  logoText?: string;
  logoImage?: string;
  logoHeight?: number;
  logoTracking?: string;
  hotlinePhone?: string;
  hotlineDisplay?: string;
  hotlineVisible?: boolean;
  whatsappNumber?: string;
  whatsappMessage?: string;
  whatsappVisible?: boolean;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  socialVisible?: boolean;
  enableLanguageSwitch?: boolean;
  enable3dWizardLink?: boolean;
  enableEmergencyDoctor?: boolean;
  menuLinks?: IMenuLink[];
}

const defaultNavbarConfig: INavbarConfig = {
  logoType: "TEXT",
  logoText: "A R GREEN GARDEN",
  logoImage: "",
  logoHeight: 28,
  logoTracking: "0.24em",
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
    { id: "1", titleBn: "প্রকল্পসমূহ", titleEn: "Projects", url: "/projects", isVisible: true, order: 1 },
    { id: "2", titleBn: "মেথডোলজি", titleEn: "Methodology", url: "#process", isVisible: true, order: 2 },
    { id: "3", titleBn: "আমাদের টিম", titleEn: "Our Team", url: "/team", isVisible: true, order: 3 },
    { id: "4", titleBn: "স্টুডিও পরিচিতি", titleEn: "About Studio", url: "/about", isVisible: true, order: 4 },
    { id: "5", titleBn: "সেবাসমূহ", titleEn: "Services", url: "/services", isVisible: true, order: 5 },
    { id: "6", titleBn: "প্ল্যান্ট শপ ও নার্সারি", titleEn: "Plant Nursery & Shop", url: "/shop", badge: "SHOP", isVisible: true, order: 6 },
    { id: "7", titleBn: "বিফোর-আফটার রূপান্তর", titleEn: "Before & After", url: "/before-after", badge: "NEW", isVisible: true, order: 7 },
    { id: "8", titleBn: "ফটো গ্যালারি", titleEn: "Gallery", url: "/gallery", isVisible: true, order: 8 },
    { id: "9", titleBn: "গ্রাহক মতামত", titleEn: "Testimonials", url: "/testimonials", isVisible: true, order: 9 },
    { id: "10", titleBn: "সংবাদ ও ইভেন্টস", titleEn: "Recent News & Events", url: "/blog", isVisible: true, order: 10 },
    { id: "11", titleBn: "সাধারণ জিজ্ঞাসা", titleEn: "FAQ", url: "/faq", isVisible: true, order: 11 },
    { id: "12", titleBn: "ক্যারিয়ার", titleEn: "Careers", url: "/career", isVisible: true, order: 12 },
    { id: "13", titleBn: "যোগাযোগ", titleEn: "Contact Us", url: "/contact", isVisible: true, order: 13 },
  ],
};

export default function Navbar({ onOpenEstimator }: NavbarProps) {
  const { user, logout } = useAuth();
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [config, setConfig] = useState<INavbarConfig>(defaultNavbarConfig);
  const [rotateDeg, setRotateDeg] = useState(0);

  const handleToggleLang = () => {
    setRotateDeg((prev) => prev + 360);
    toggleLanguage();
  };

  // Check if current page is the homepage with dark video hero
  const isHomePage = pathname === "/";
  // On interior pages, always keep the crisp light header style; on homepage, switch on scroll
  const isLightHeader = !isHomePage || isScrolled;

  // Load navbar settings from API
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.value?.navbar_config) {
            setConfig({
              ...defaultNavbarConfig,
              ...data.value.navbar_config,
              menuLinks: data.value.navbar_config.menuLinks || defaultNavbarConfig.menuLinks,
            });
          } else if (data?.value) {
            setConfig((prev) => ({
              ...prev,
              logoText: data.value.title || prev.logoText,
              hotlinePhone: data.value.phone || prev.hotlinePhone,
              facebookUrl: data.value.fbPage || prev.facebookUrl,
            }));
          }
        }
      } catch (err) {
        console.warn("Navbar config fetch fallback to default");
      }
    };

    loadConfig();

    // Listen for live update events from admin panel
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setConfig((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener("navbar-config-updated", handleUpdate);
    return () => window.removeEventListener("navbar-config-updated", handleUpdate);
  }, []);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Handle ESC key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Handle link click with smooth scroll for hash anchors on homepage or router navigation on subpages
  const handleLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetUrl: string) => {
      setMenuOpen(false);

      if (targetUrl.startsWith("#")) {
        if (isHomePage) {
          e.preventDefault();
          const el = document.querySelector(targetUrl);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
            window.history.pushState(null, "", targetUrl);
          }
        } else {
          // If on a subpage, navigate to home with hash
          e.preventDefault();
          router.push(`/${targetUrl}`);
        }
      }
    },
    [isHomePage, router]
  );

  // Handle opening cost estimator modal
  const handleTriggerEstimator = () => {
    setMenuOpen(false);
    if (onOpenEstimator) {
      onOpenEstimator();
    } else {
      window.dispatchEvent(new CustomEvent("open-estimator"));
    }
  };

  // Handle opening emergency tree doctor modal
  const handleTriggerTreeDoctor = () => {
    setMenuOpen(false);
    window.dispatchEvent(new CustomEvent("open-tree-doctor"));
  };

  const visibleMenuLinks = (config.menuLinks || defaultNavbarConfig.menuLinks!).filter(
    (link) => link.isVisible !== false
  );

  const whatsappLink = `https://wa.me/${config.whatsappNumber || "8801883012641"}?text=${encodeURIComponent(
    config.whatsappMessage || "Hello A R Green Garden, I would like to consult about my garden."
  )}`;

  return (
    <>
      {/* ================= EXACT SHMA ARCHITECTURAL HEADER ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
          isLightHeader
            ? "bg-white/95 backdrop-blur-md shadow-xs py-3.5 sm:py-4 border-b border-black/5 text-[#323232]"
            : "bg-transparent py-5 sm:py-6 text-white"
        }`}
        role="banner"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-3 sm:gap-4">
          
          {/* Column 1: Minimalist Thin 3-Line Hamburger + Language Switcher */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-2 text-inherit p-2 -ml-2 transition-opacity hover:opacity-70 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B4D33] rounded-lg"
              aria-label={t("মেন্যু খুলুন", "Open Navigation Menu")}
              aria-expanded={menuOpen}
            >
              <div className="flex flex-col gap-1.5 w-7">
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isLightHeader ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isLightHeader ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isLightHeader ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
              </div>
            </button>

            {/* Single Language Switcher with Smooth 360-Degree Rotating Sync Icon */}
            {config.enableLanguageSwitch !== false && (
              <button
                onClick={handleToggleLang}
                type="button"
                className={`group text-xs font-mono tracking-wider px-2.5 sm:px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 cursor-pointer select-none hover:scale-105 active:scale-95 duration-200 ${
                  isLightHeader
                    ? "border-[#323232]/25 hover:border-[#323232] text-[#323232] bg-black/[0.03] hover:bg-black/[0.07]"
                    : "border-white/35 hover:border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                }`}
                title={language === "bn" ? "Switch to English" : "বাংলা ভাষায় পরিবর্তন করুন"}
                aria-label="Toggle Language"
              >
                <svg
                  style={{ transform: `rotate(${rotateDeg}deg)` }}
                  className="w-3.5 h-3.5 transition-transform duration-500 ease-in-out shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="font-bold text-xs tracking-wider transition-opacity duration-200">
                  {language === "bn" ? "বাংলা" : "English"}
                </span>
              </button>
            )}
          </div>

          {/* Column 2: Exact Shma Centered Brand Logo (Image or Text) */}
          <div className="flex-1 flex items-center justify-center text-center px-2 overflow-hidden">
            <Link href="/" className="group inline-block whitespace-nowrap focus:outline-none">
              {config.logoType === "IMAGE" && config.logoImage ? (
                <img
                  src={config.logoImage}
                  alt={config.logoText || "A R Green Garden Logo"}
                  style={{ height: `${config.logoHeight || 28}px` }}
                  className="object-contain max-w-[200px] sm:max-w-[280px] inline-block transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <span
                  className="font-display font-extralight text-base sm:text-xl md:text-[22px] lg:text-[25px] uppercase transition-colors tracking-[0.16em] sm:tracking-[0.24em]"
                  style={{ letterSpacing: config.logoTracking || "0.24em" }}
                >
                  {config.logoText || "A R GREEN GARDEN"}
                </span>
              )}
            </Link>
          </div>

          {/* Column 3: Hotline, WhatsApp & Dashboard */}
          <div className="flex items-center justify-end gap-2 sm:gap-3.5 shrink-0">
            {/* Social Icons (Large Screens) */}
            {config.socialVisible !== false && (
              <div className="hidden xl:flex items-center gap-3.5 text-inherit">
                {/* Facebook */}
                {config.facebookUrl && (
                  <a
                    href={config.facebookUrl}
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

                {/* Instagram */}
                {config.instagramUrl && (
                  <a
                    href={config.instagramUrl}
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

                {/* LinkedIn */}
                {config.linkedinUrl && (
                  <a
                    href={config.linkedinUrl}
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
            {config.hotlineVisible !== false && (
              <a
                href={`tel:${config.hotlinePhone || "01883012641"}`}
                className={`text-xs font-mono tracking-wider hover:opacity-75 transition-opacity border-b pb-0.5 whitespace-nowrap hidden lg:inline ${
                  isLightHeader ? "text-[#323232] border-[#323232]/35" : "text-white border-white/40"
                }`}
                title="Call Studio Hotline"
              >
                {config.hotlineDisplay || config.hotlinePhone || "০১88৩-০১২৬৪১"}
              </a>
            )}

            {/* Direct WhatsApp Action (Icon Only) */}
            {config.whatsappVisible !== false && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-stone-950 flex items-center justify-center shadow-xs transition-all hover:scale-110 active:scale-95 duration-200 shrink-0 cursor-pointer"
                title="Chat on WhatsApp"
                aria-label="Chat on WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </a>
            )}

            {/* Login / Dashboard Link (Hidden on Mobile, accessible inside Hamburger Menu) */}
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
                className="hidden sm:flex pl-1.5 pr-3.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-semibold shadow-xs transition-all items-center gap-2 cursor-pointer whitespace-nowrap border border-emerald-600/40 hover:scale-105 active:scale-95 duration-200 shrink-0"
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
                <span className="tracking-wide">Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className={`hidden sm:flex px-3.5 py-1 rounded-full text-xs font-semibold shadow-xs transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 duration-200 shrink-0 ${
                  isLightHeader
                    ? "bg-stone-100 hover:bg-stone-200 text-[#323232] border border-stone-300"
                    : "bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xs"
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{t("লগইন", "Login")}</span>
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* ================= EXACT SHMA ARCHITECTURAL LINEN SLIDE-IN MENU ================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex animate-fade-in" role="dialog" aria-modal="true">
          {/* Backdrop Overlay with Ambient Blur */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer transition-opacity duration-300"
            aria-hidden="true"
          ></div>

          {/* Left Slide Menu Container: Exact Shma Signature Linen / Off-White Tone #E4E2D7 / #F7F6F2 */}
          <div className="relative w-full max-w-[480px] bg-[#E4E2D7] text-[#323232] h-full max-h-screen overflow-y-auto overscroll-contain px-6 sm:px-10 py-8 flex flex-col justify-between z-10 shadow-2xl border-r border-[#D6D2C4] animate-slide-right">
            
            {/* 1. Top Close Hamburger & Language Toggle */}
            <div className="sticky top-0 z-20 bg-[#E4E2D7]/95 backdrop-blur-md pb-4 pt-1 border-b border-[#D6D2C4] flex justify-between items-center -mx-6 px-6 sm:-mx-10 sm:px-10 mb-6">
              <button
                onClick={() => setMenuOpen(false)}
                className="group flex items-center p-2 -ml-2 text-[#323232] hover:opacity-70 cursor-pointer focus:outline-none"
                aria-label="Close Navigation Menu"
              >
                <div className="flex flex-col gap-1.5 w-7">
                  <span className="w-full h-[1.5px] bg-[#323232]"></span>
                  <span className="w-full h-[1.5px] bg-[#323232]"></span>
                  <span className="w-full h-[1.5px] bg-[#323232]"></span>
                </div>
              </button>

              <div className="flex items-center gap-2">
                {/* Single Rotating Language Switcher in Drawer */}
                <button
                  onClick={handleToggleLang}
                  type="button"
                  className="group flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/[0.06] hover:bg-black/[0.12] text-[#323232] border border-[#323232]/20 text-xs font-mono transition-all cursor-pointer select-none hover:scale-105 active:scale-95 duration-200"
                  title={language === "bn" ? "Switch to English" : "বাংলা ভাষায় পরিবর্তন করুন"}
                  aria-label="Toggle Language"
                >
                  <svg
                    style={{ transform: `rotate(${rotateDeg}deg)` }}
                    className="w-3.5 h-3.5 transition-transform duration-500 ease-in-out shrink-0 text-[#2B4D33]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="font-bold text-xs tracking-wider">
                    {language === "bn" ? "বাংলা" : "English"}
                  </span>
                </button>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#323232] flex items-center justify-center text-sm ml-1 cursor-pointer transition-all hover:rotate-90 duration-300 focus:outline-none"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* 2. Iconic Shma Large Architectural Menu Links Body */}
            <div className="space-y-6 my-auto py-2">
              
              {/* Dynamic Menu Links with Exact Shma Large Display Typography */}
              <nav className="space-y-3 font-display font-light" aria-label="Main Navigation">
                {visibleMenuLinks.map((link) => {
                  const isInternalAnchor = link.url.startsWith("#");
                  const isActive = !isInternalAnchor && pathname === link.url;

                  return (
                    <div key={link.id} className="group flex items-center justify-between">
                      {isInternalAnchor ? (
                        <a
                          href={isHomePage ? link.url : `/${link.url}`}
                          onClick={(e) => handleLinkClick(e, link.url)}
                          className="text-2xl sm:text-3xl md:text-[34px] font-light text-[#323232] hover:text-[#2B4D33] hover:translate-x-1.5 transition-all block leading-tight tracking-tight duration-200"
                        >
                          {link.titleEn}
                        </a>
                      ) : (
                        <Link
                          href={link.url}
                          onClick={() => setMenuOpen(false)}
                          className={`text-2xl sm:text-3xl md:text-[34px] font-light hover:translate-x-1.5 transition-all block leading-tight tracking-tight duration-200 ${
                            isActive
                              ? "text-[#2B4D33] font-normal"
                              : "text-[#323232] hover:text-[#2B4D33]"
                          }`}
                        >
                          {link.titleEn}
                        </Link>
                      )}

                      {link.badge && (
                        <span className="text-[9px] font-mono px-2.5 py-0.5 rounded-full bg-[#323232]/10 text-[#323232] border border-[#323232]/20 font-bold uppercase tracking-wider">
                          {link.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Action Feature Links (3D Wizard, Cost Estimator, Tree Doctor) */}
              <div className="space-y-3 font-display font-light pt-5 border-t border-[#D6D2C4]">
                {config.enable3dWizardLink !== false && (
                  <Link
                    href="/design-garden"
                    onClick={() => setMenuOpen(false)}
                    className="text-base sm:text-lg font-normal text-[#2B4D33] hover:text-[#121813] transition-colors block group"
                  >
                    <div className="flex items-center gap-2">
                      <span>🎨 {t("3D Garden Wizard", "3D Garden Wizard")}</span>
                      <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
                    </div>
                    <span className="text-xs font-sans text-[#323232]/70 block mt-0.5 font-normal">
                      {t("কাস্টম ছাদবাগান বাজেট ও ইন্টারেক্টিভ নকশা", "Interactive Landscape Estimator & Design")}
                    </span>
                  </Link>
                )}

                {/* Instant Cost Estimator */}
                <button
                  type="button"
                  onClick={handleTriggerEstimator}
                  className="text-left text-base sm:text-lg font-normal text-[#C85A32] hover:text-[#121813] transition-colors block w-full cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <span>🧮 {t("Instant Cost Estimator", "Instant Cost Estimator")}</span>
                    <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
                  </div>
                  <span className="text-xs font-sans text-[#323232]/70 block mt-0.5 font-normal">
                    {t("স্কয়ার ফিট হিসাব ও তাৎক্ষণিক বাজেট কোটেশন", "Instant SQFT Budget Calculator")}
                  </span>
                </button>

                {/* Emergency Tree Doctor */}
                {config.enableEmergencyDoctor !== false && (
                  <button
                    type="button"
                    onClick={handleTriggerTreeDoctor}
                    className="text-base sm:text-lg font-normal text-rose-800 hover:text-rose-950 transition-colors block cursor-pointer text-left w-full group"
                  >
                    <div className="flex items-center gap-2">
                      <span>🚨 {t("Emergency Tree Doctor", "Emergency Tree Doctor")}</span>
                      <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
                    </div>
                    <span className="text-xs font-sans text-rose-800/80 block mt-0.5 font-normal">
                      {t("অন-কল ডাক্তার ভিজিট ও জরুরি বৃক্ষ চিকিৎসা", "Urgent Tree Clinic, Surgery & On-Site Visit")}
                    </span>
                  </button>
                )}
              </div>

              {/* Drawer Auth / Dashboard Card */}
              <div className="pt-4 border-t border-[#D6D2C4]">
                {user ? (
                  <div className="flex items-center justify-between bg-white/80 p-3.5 rounded-2xl border border-[#D6D2C4] shadow-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-950 border border-emerald-500/40 shrink-0 flex items-center justify-center shadow-inner">
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
                        <p className="text-xs font-bold text-[#121813] truncate max-w-[120px]">{user.name}</p>
                        <p className="text-[10px] text-emerald-800 font-mono uppercase tracking-wider">{user.role}</p>
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
                        className="px-3 py-1.5 bg-[#2B4D33] hover:bg-[#1E3724] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          logout();
                        }}
                        type="button"
                        className="px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        {t("লগআউট", "Logout")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-2.5 bg-[#2B4D33] hover:bg-[#1E3724] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      👤 {t("লগইন করুন", "Sign In")}
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 text-center py-2.5 bg-white/60 hover:bg-white text-[#323232] border border-[#D6D2C4] rounded-xl text-xs font-bold transition-all"
                    >
                      ✨ {t("রেজিস্ট্রেশন", "Register")}
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* 3. Exact Shma Studio Coordinates Footer */}
            <div className="pt-6 border-t border-[#D6D2C4] text-xs font-sans text-[#323232]/85 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-[#121813]">
                  A R Green Garden Co., Ltd.
                </p>
                <p className="text-[11px] text-[#323232]/70">
                  {t("ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও", "Landscape Architecture Studio")}
                </p>
                <p className="pt-1 text-[11px] leading-relaxed text-[#323232]/60">
                  {t("৪২/এ, রোড ৯/এ, ধানমন্ডি,", "42/A, Road 9/A, Dhanmondi,")}<br />
                  {t("ঢাকা-১২০৯, বাংলাদেশ", "Dhaka-1209, Bangladesh")}
                </p>
              </div>
              <div className="text-[11px] leading-relaxed flex flex-col justify-between">
                <div>
                  <p className="font-semibold text-[#121813]">
                    {t(
                      `হটলাইন: ${config.hotlineDisplay || config.hotlinePhone || "০১৮৮৩-০১২৬৪১"}`,
                      `Hotline: ${config.hotlinePhone || "01883012641"}`
                    )}
                  </p>
                  <p className="pt-0.5 text-[#323232]/70">admin@argreengarden.com</p>
                </div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 mt-2 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-stone-950 font-bold text-xs shadow-xs transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 448 512">
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
