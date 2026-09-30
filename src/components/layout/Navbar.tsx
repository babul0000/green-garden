"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface NavbarProps {
  onOpenEstimator?: () => void;
}

export default function Navbar({ onOpenEstimator }: NavbarProps) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
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

  return (
    <>
      {/* EXACT SHMA FLOATING / TRANSPARENT HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-4 border-b border-black/5 text-[#323232]"
            : "bg-transparent py-6 text-white"
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Column 1: Minimalist Thin 3-Line Hamburger Icon */}
          <div className="w-1/3 flex items-center justify-start">
            <button
              onClick={() => setMenuOpen(true)}
              className="group flex items-center gap-2 text-inherit p-2 -ml-2 transition-opacity hover:opacity-70 cursor-pointer focus:outline-none"
              aria-label="Open Navigation Menu"
            >
              <div className="flex flex-col gap-1.5 w-7">
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isScrolled ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isScrolled ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
                <span
                  className={`w-full h-[1.5px] transition-all duration-300 ${
                    isScrolled ? "bg-[#323232]" : "bg-white"
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Column 2: Exact Shma Centered Architectural Outline Logo */}
          <div className="w-1/3 flex items-center justify-center text-center">
            <Link href="/" className="group inline-block">
              <span className="font-display font-extralight text-xl sm:text-2xl md:text-[26px] tracking-[0.25em] uppercase transition-colors">
                A R GREEN GARDEN
              </span>
            </Link>
          </div>

          {/* Column 3: Exact Shma Social Icons & Hotline */}
          <div className="w-1/3 flex items-center justify-end gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-4">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit hover:opacity-60 transition-opacity"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 512 512">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"></path>
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit hover:opacity-60 transition-opacity"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1z"></path>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit hover:opacity-60 transition-opacity"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 448 512">
                  <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-inherit hover:opacity-60 transition-opacity"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 576 512">
                  <path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"></path>
                </svg>
              </a>
            </div>

            <a
              href="tel:01620692449"
              className="text-xs font-mono tracking-wider hover:opacity-75 transition-opacity border-b border-current pb-0.5"
            >
              01620692449
            </a>
          </div>

        </div>
      </header>

      {/* EXACT SHMA POPUP 2433: FULL-HEIGHT SLIDE-IN DRAWER MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer transition-opacity"
          ></div>

          {/* Left Slide Menu Container: Exact Shma Background #6f7375 */}
          <div className="relative w-full max-w-[480px] bg-[#6f7375] text-white h-full overflow-y-auto px-8 sm:px-12 py-10 flex flex-col justify-between z-10 shadow-2xl animate-fade-in-up">
            
            {/* Top Close Hamburger */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => setMenuOpen(false)}
                className="group flex items-center p-2 -ml-2 text-white hover:opacity-70 cursor-pointer focus:outline-none"
                aria-label="Close Navigation Menu"
              >
                <div className="flex flex-col gap-1.5 w-7">
                  <span className="w-full h-[1.5px] bg-white"></span>
                  <span className="w-full h-[1.5px] bg-white"></span>
                  <span className="w-full h-[1.5px] bg-white"></span>
                </div>
              </button>

              <button
                onClick={() => setMenuOpen(false)}
                className="text-white hover:opacity-70 text-2xl p-1 cursor-pointer focus:outline-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Navigation Links (Matching Shma exact hierarchy) */}
            <div className="space-y-6 my-auto">
              
              {/* Primary Large Links (Project, Process, People) */}
              <div className="space-y-3 font-display font-light">
                <div>
                  <a
                    href="#projects"
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl sm:text-[44px] font-light hover:text-[#dedad2] transition-colors flex items-baseline justify-between leading-tight"
                  >
                    <span>Project</span>
                    <span className="text-sm font-sans text-white/60 tracking-normal font-normal">প্রকল্পসমূহ</span>
                  </a>
                </div>
                <div>
                  <a
                    href="#process"
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl sm:text-[44px] font-light hover:text-[#dedad2] transition-colors flex items-baseline justify-between leading-tight"
                  >
                    <span>Process</span>
                    <span className="text-sm font-sans text-white/60 tracking-normal font-normal">কর্মপদ্ধতি</span>
                  </a>
                </div>
                <div>
                  <a
                    href="#activities"
                    onClick={() => setMenuOpen(false)}
                    className="text-4xl sm:text-[44px] font-light hover:text-[#dedad2] transition-colors flex items-baseline justify-between leading-tight"
                  >
                    <span>People</span>
                    <span className="text-sm font-sans text-white/60 tracking-normal font-normal">আমাদের দল</span>
                  </a>
                </div>
              </div>

              {/* Secondary Medium Links */}
              <div className="space-y-2.5 font-display font-light pt-4 border-t border-white/20">
                <div>
                  <a
                    href="#container"
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl sm:text-[25px] font-light text-white/90 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>About</span>
                    <span className="text-xs font-sans text-white/50 font-normal">পরিচিতি</span>
                  </a>
                </div>
                <div>
                  <a
                    href="#service"
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl sm:text-[25px] font-light text-white/90 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Service</span>
                    <span className="text-xs font-sans text-white/50 font-normal">সেবাসমূহ</span>
                  </a>
                </div>
                <div>
                  <a
                    href="#activities"
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl sm:text-[25px] font-light text-white/90 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Research</span>
                    <span className="text-xs font-sans text-white/50 font-normal">গবেষণা ও প্রকাশনা</span>
                  </a>
                </div>
                <div>
                  <a
                    href="#newsletter"
                    onClick={() => setMenuOpen(false)}
                    className="text-2xl sm:text-[25px] font-light text-white/90 hover:text-white transition-colors flex items-center justify-between"
                  >
                    <span>Contact</span>
                    <span className="text-xs font-sans text-white/50 font-normal">যোগাযোগ</span>
                  </a>
                </div>
                <div className="pt-2">
                  <Link
                    href="/design-garden"
                    onClick={() => setMenuOpen(false)}
                    className="text-lg sm:text-[20px] font-light text-[#dedad2] hover:text-white transition-colors block"
                  >
                    <span>3D Garden Wizard 🎨</span>
                    <span className="text-xs font-sans text-emerald-200/80 block mt-0.5 font-normal">
                      থ্রিডি গার্ডেন ক্যালকুলেটর ও কাস্টম ডিজাইন
                    </span>
                  </Link>
                </div>
                <div>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      window.dispatchEvent(new CustomEvent("open-tree-doctor"));
                    }}
                    className="text-lg sm:text-[20px] font-light text-red-200 hover:text-white transition-colors block cursor-pointer text-left w-full"
                  >
                    <span>Emergency Tree Doctor 🚨</span>
                    <span className="text-xs font-sans text-red-200/80 block mt-0.5 font-normal">
                      জরুরি বৃক্ষ চিকিৎসা, রোগ নির্ণয় ও সার্জারি
                    </span>
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Studio Info (Exact Shma 2-column layout) */}
            <div className="pt-6 border-t border-white/20 text-xs font-sans text-white/80 grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-white">A R Green Garden Co., Ltd.</p>
                <p className="text-[11px] text-white/70">ল্যান্ডস্কেপ আর্কিটেকচার স্টুডিও</p>
                <p className="pt-1 text-[11px] leading-relaxed text-white/60">
                  ৪২/এ, রোড ৯/এ, ধানমন্ডি,<br />
                  ঢাকা-১২০৯, বাংলাদেশ
                </p>
              </div>
              <div className="text-[11px] leading-relaxed">
                <p className="font-semibold text-white">হটলাইন: ০১৬২০-৬৯২৪৪৯</p>
                <p className="pt-1 text-white/70">admin@argreengarden.com</p>
                <p className="text-white/70">contact@argreengarden.com</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
