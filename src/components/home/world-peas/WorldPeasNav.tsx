"use client";

import React, { useState } from "react";
import Link from "next/link";

interface WorldPeasNavProps {
  activeTab?: string;
  basketCount?: number;
}

export default function WorldPeasNav({
  activeTab = "Shop",
  basketCount = 0,
}: WorldPeasNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white text-black pt-8 pb-12 sm:pb-16 select-none">
      <div className="max-w-[1216px] mx-auto px-4 sm:px-8 space-y-10 sm:space-y-12">
        {/* ================= PRIMARY NAVIGATION BAR ================= */}
        <div className="flex items-center justify-between border-b border-black/10 pb-4">
          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-1.5 text-black hover:opacity-70 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Nav Links (Desktop) */}
          <nav className="hidden sm:flex items-center gap-8 md:gap-12 text-[17px] md:text-[18px] font-sans text-black">
            <Link
              href="/"
              className={`relative py-1 transition-colors hover:text-black/70 ${
                activeTab === "Shop" ? "font-medium" : "font-normal"
              }`}
            >
              Shop
              {activeTab === "Shop" && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
              )}
            </Link>

            <Link
              href="#newsstand"
              className={`relative py-1 transition-colors hover:text-black/70 ${
                activeTab === "Newsstand" ? "font-medium" : "font-normal"
              }`}
            >
              Newsstand
              {activeTab === "Newsstand" && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black rounded-full" />
              )}
            </Link>

            <Link
              href="#about"
              className={`relative py-1 transition-colors hover:text-black/70 ${
                activeTab === "Who we are" ? "font-medium" : "font-normal"
              }`}
            >
              Who we are
            </Link>

            <Link
              href="/client-dashboard"
              className={`relative py-1 transition-colors hover:text-black/70 ${
                activeTab === "My profile" ? "font-medium" : "font-normal"
              }`}
            >
              My profile
            </Link>
          </nav>

          {/* Basket Button (Right) */}
          <Link
            href="/cart"
            className="flex items-center gap-2 text-[17px] md:text-[18px] font-sans text-black hover:opacity-70 transition-opacity"
          >
            {/* Basket Bag Icon */}
            <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Basket</span>
            <span className="font-mono text-sm opacity-80">({String(basketCount).padStart(2, "0")})</span>
          </Link>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden flex flex-col gap-4 p-4 bg-stone-50 rounded-2xl border border-black/10 text-base">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="font-medium">Shop</Link>
            <Link href="#newsstand" onClick={() => setMobileMenuOpen(false)}>Newsstand</Link>
            <Link href="#about" onClick={() => setMobileMenuOpen(false)}>Who we are</Link>
            <Link href="/client-dashboard" onClick={() => setMobileMenuOpen(false)}>My profile</Link>
          </div>
        )}

        {/* ================= ICONIC WORDMARK LOGO (FIGMA: 854x142) ================= */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <Link href="/" className="inline-block group">
            <h1 className="font-['Newsreader',serif] text-[58px] sm:text-[96px] md:text-[124px] lg:text-[142px] font-light leading-[0.9] text-black tracking-[-0.03em] select-none group-hover:opacity-90 transition-opacity">
              World Peas
            </h1>
          </Link>

          {/* Circular Pea Pod Art Icon (Figma: 48x48) */}
          <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 border-black flex items-center justify-center p-2 relative">
            <svg className="w-full h-full stroke-black fill-none" viewBox="0 0 48 48" strokeWidth="2.5">
              <circle cx="24" cy="24" r="20" stroke="black" fill="none" strokeWidth="2.5" />
              <path d="M14 34 Q 24 10, 34 34" stroke="black" fill="none" strokeWidth="2" strokeLinecap="round" />
              <circle cx="21" cy="24" r="3" fill="black" />
              <circle cx="28" cy="27" r="3" fill="black" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

