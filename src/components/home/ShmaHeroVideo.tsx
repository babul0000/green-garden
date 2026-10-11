"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { IHeroSettings, defaultHeroSettings } from "@/types";

export default function ShmaHeroVideo() {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const [config, setConfig] = useState<IHeroSettings>(defaultHeroSettings);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch dynamic settings from /api/settings
  useEffect(() => {
    const fetchHeroConfig = async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.value?.hero_config) {
            setConfig((prev) => ({
              ...prev,
              ...data.value.hero_config,
            }));
          }
        }
      } catch (err) {
        console.warn("Hero config fallback to default:", err);
      }
    };

    fetchHeroConfig();

    // Listen for live updates dispatched from Admin Panel
    const handleLiveUpdate = (e: any) => {
      if (e.detail) {
        setConfig((prev) => ({ ...prev, ...e.detail }));
      }
    };

    window.addEventListener("hero-config-updated", handleLiveUpdate);

    return () => {
      window.removeEventListener("hero-config-updated", handleLiveUpdate);
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  // 2. Control video element playback & speed
  useEffect(() => {
    if (videoRef.current && config.mediaType === "video") {
      videoRef.current.defaultMuted = config.muted;
      videoRef.current.muted = config.muted;
      videoRef.current.playbackRate = config.playbackSpeed || 1.0;
      if (config.autoPlay) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [config.mediaType, config.videoUrl, config.muted, config.autoPlay, config.playbackSpeed]);

  const handleMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 350);
  };

  const handleProjectsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (config.btnProjectsAction === "scroll" && config.btnProjectsLink.startsWith("#")) {
      e.preventDefault();
      const targetId = config.btnProjectsLink.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const showCta = config.ctaEnabled && (config.ctaTriggerMode === "always_visible" || isHovered);

  // Labels based on language & user preference
  const projectsLabel = isBn
    ? config.btnProjectsTextBn || config.btnProjectsTextEn
    : config.btnProjectsTextEn;
  const contactLabel = isBn
    ? config.btnContactTextBn || config.btnContactTextEn
    : config.btnContactTextEn;

  return (
    <section className="relative w-full h-[100dvh] min-h-[560px] overflow-hidden bg-[#041a2e] flex items-center justify-center select-none">
      {/* ================= BACKGROUND MEDIA (VIDEO / IMAGE) ================= */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {config.mediaType === "video" ? (
          <video
            ref={videoRef}
            key={config.videoUrl}
            autoPlay={config.autoPlay}
            muted={config.muted}
            loop={config.loop}
            playsInline
            controls={false}
            poster={config.posterImageUrl}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          >
            <source src={config.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={config.imageUrl || config.posterImageUrl}
            alt="Hero Background"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          />
        )}
      </div>

      {/* Dynamic Overlay Darkness */}
      <div
        className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-500"
        style={{ opacity: (config.overlayDarkness || 0) / 100 }}
      />

      {/* Top & Bottom Vignettes for Header Readability & Cinematic Depth */}
      {config.showTopVignette && (
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none"></div>
      )}
      {config.showBottomVignette && (
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/60 via-black/25 to-transparent pointer-events-none"></div>
      )}

      {/* ================= OPTIONAL HEADLINE & TEXT OVERLAY ================= */}
      {config.enableTextOverlay && (
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white pointer-events-none">
          {(config.taglineEn || config.taglineBn) && (
            <span className="inline-block px-4 py-1 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-mono uppercase tracking-[0.25em] text-emerald-300">
              {isBn ? config.taglineBn || config.taglineEn : config.taglineEn}
            </span>
          )}
          {(config.headlineEn || config.headlineBn) && (
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-wide uppercase font-serif mb-4 drop-shadow-md">
              {isBn ? config.headlineBn || config.headlineEn : config.headlineEn}
            </h1>
          )}
          {(config.descriptionEn || config.descriptionBn) && (
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/80 font-sans font-light leading-relaxed drop-shadow">
              {isBn ? config.descriptionBn || config.descriptionEn : config.descriptionEn}
            </p>
          )}
        </div>
      )}

      {/* ================= LEFT-EDGE HOVER DETECTION ZONES ================= */}
      {/* ট্র্রিগার জোন: যখন CTA মোড 'hover' সিলেক্ট করা থাকবে, তখনই সক্রিয় হবে */}
      {config.ctaEnabled && config.ctaTriggerMode === "hover" && (
        <>
          {/* Vertical Left Edge Zone */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 top-0 bottom-0 w-32 sm:w-64 z-20 pointer-events-auto"
            aria-hidden="true"
          />

          {/* Bottom-Left Catchment Zone */}
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="absolute left-0 bottom-0 w-72 sm:w-[420px] h-48 sm:h-64 z-20 pointer-events-auto"
            aria-hidden="true"
          />
        </>
      )}

      {/* ================= SLIDE-OUT CTA BUTTONS CONTAINER ================= */}
      {config.ctaEnabled && (
        <div
          onMouseEnter={config.ctaTriggerMode === "hover" ? handleMouseEnter : undefined}
          onMouseLeave={config.ctaTriggerMode === "hover" ? handleMouseLeave : undefined}
          className={`absolute bottom-12 sm:bottom-16 left-6 sm:left-12 z-30 flex items-center transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            showCta
              ? "translate-x-0 opacity-100 pointer-events-auto scale-100"
              : "-translate-x-[calc(100%+4rem)] opacity-0 pointer-events-none scale-95"
          }`}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="flex items-center gap-3 p-2 sm:p-2.5 rounded-full bg-black/85 backdrop-blur-2xl border border-white/25 text-white shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
            {/* Button 1: Projects */}
            {config.btnProjectsVisible && (
              <a
                href={config.btnProjectsLink}
                onClick={handleProjectsClick}
                className={`relative group/btn overflow-hidden px-5 sm:px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                  config.btnProjectsStyle === "dark-glass"
                    ? "border border-white/20 bg-black/40 text-white"
                    : config.btnProjectsStyle === "emerald"
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

            {config.btnProjectsVisible && config.btnContactVisible && (
              <span className="w-[1px] h-5 bg-white/30"></span>
            )}

            {/* Button 2: Contact */}
            {config.btnContactVisible && (
              <Link
                href={config.btnContactLink}
                className={`relative group/btn overflow-hidden px-5 sm:px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-[0.2em] transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105 active:scale-95 shadow-md cursor-pointer ${
                  config.btnContactStyle === "white-pill"
                    ? "border border-white/30 bg-white/10 text-white"
                    : config.btnContactStyle === "dark-glass"
                    ? "border border-white/20 bg-black/40 text-white"
                    : "border border-emerald-400/80 bg-emerald-950/80 text-emerald-200 hover:border-emerald-300"
                }`}
              >
                <span
                  className={`absolute inset-0 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out ${
                    config.btnContactStyle === "white-pill" ? "bg-white" : "bg-emerald-400"
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
      )}
    </section>
  );
}

