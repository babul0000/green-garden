"use client";

import React from "react";
import Link from "next/link";

interface HeroSlideOutCTAProps {
  ctaEnabled: boolean;
  ctaTriggerMode: "hover" | "always_visible";
  showCta: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  btnProjectsVisible: boolean;
  btnProjectsLink: string;
  btnProjectsStyle: "white-pill" | "dark-glass" | "emerald";
  projectsLabel: string;
  onProjectsClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  btnContactVisible: boolean;
  btnContactLink: string;
  btnContactStyle: "emerald-glow" | "white-pill" | "dark-glass";
  contactLabel: string;
}

export default function HeroSlideOutCTA({
  ctaEnabled,
  ctaTriggerMode,
  showCta,
  onMouseEnter,
  onMouseLeave,
  btnProjectsVisible,
  btnProjectsLink,
  btnProjectsStyle,
  projectsLabel,
  onProjectsClick,
  btnContactVisible,
  btnContactLink,
  btnContactStyle,
  contactLabel,
}: HeroSlideOutCTAProps) {
  if (!ctaEnabled) return null;

  return (
    <>
      {/* ================= LEFT-EDGE HOVER DETECTION ZONES (Desktop only) ================= */}
      {ctaTriggerMode === "hover" && (
        <div className="hidden md:block">
          {/* Vertical Left Edge Zone */}
          <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 z-20 pointer-events-auto"
            aria-hidden="true"
          />

          {/* Bottom-Left Catchment Zone */}
          <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className="absolute left-0 bottom-0 w-72 sm:w-[420px] h-48 sm:h-64 z-20 pointer-events-auto"
            aria-hidden="true"
          />
        </div>
      )}

      {/* ================= SLIDE-OUT CTA BUTTONS CONTAINER ================= */}
      <div
        onMouseEnter={ctaTriggerMode === "hover" ? onMouseEnter : undefined}
        onMouseLeave={ctaTriggerMode === "hover" ? onMouseLeave : undefined}
        className={`hidden md:flex absolute bottom-8 sm:bottom-16 left-4 sm:left-12 z-30 items-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showCta
            ? "translate-x-0 opacity-100 pointer-events-auto scale-100"
            : "-translate-x-[calc(100%+4rem)] opacity-0 pointer-events-none scale-95"
        }`}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="flex items-center gap-3 p-2 sm:p-2.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/25 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          {/* Button 1: Projects */}
          {btnProjectsVisible && (
            <a
              href={btnProjectsLink}
              onClick={onProjectsClick}
              className={`relative group/btn overflow-hidden px-5 sm:px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                btnProjectsStyle === "dark-glass"
                  ? "border border-white/20 bg-black/40 text-white"
                  : btnProjectsStyle === "emerald"
                  ? "border border-emerald-400/80 bg-emerald-950/80 text-emerald-200"
                  : "border border-white/30 bg-white/10 text-white"
              }`}
            >
              <span className="absolute inset-0 bg-white -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out"></span>
              <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-[#121813] flex items-center gap-1.5">
                <span>{projectsLabel}</span>
                <span className="text-[12px] group-hover/btn:translate-y-0.5 transition-transform duration-200">
                  ↓
                </span>
              </span>
            </a>
          )}

          {btnProjectsVisible && btnContactVisible && (
            <span className="w-[1px] h-5 bg-white/30"></span>
          )}

          {/* Button 2: Contact */}
          {btnContactVisible && (
            <Link
              href={btnContactLink}
              className={`relative group/btn overflow-hidden px-5 sm:px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                btnContactStyle === "white-pill"
                  ? "border border-white/30 bg-white/10 text-white"
                  : btnContactStyle === "dark-glass"
                  ? "border border-white/20 bg-black/40 text-white"
                  : "border border-emerald-400/80 bg-emerald-950/80 text-emerald-200 hover:border-emerald-300"
              }`}
            >
              <span
                className={`absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out ${
                  btnContactStyle === "white-pill" ? "bg-white" : "bg-emerald-400"
                }`}
              ></span>
              <span className="relative z-10 transition-colors duration-300 group-hover/btn:text-[#0a1c12] flex items-center gap-1.5 font-bold">
                <span>{contactLabel}</span>
                <span className="text-[12px] group-hover/btn:translate-x-0.5 transition-transform duration-200">
                  ➔
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
