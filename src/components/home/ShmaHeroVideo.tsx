"use client";

import React, { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { IHeroSettings, defaultHeroSettings } from "@/types";
import HeroBackgroundMedia from "./hero/HeroBackgroundMedia";
import HeroOverlay from "./hero/HeroOverlay";
import HeroTextOverlay from "./hero/HeroTextOverlay";
import HeroSlideOutCTA from "./hero/HeroSlideOutCTA";

export default function ShmaHeroVideo() {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const [config, setConfig] = useState<IHeroSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("cached_hero_config");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && (parsed.imageUrl || parsed.videoUrl || parsed.posterImageUrl || parsed.mediaType)) {
            return { ...defaultHeroSettings, ...parsed };
          }
        }
      } catch {}
    }
    return defaultHeroSettings;
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };
  const [isHovered, setIsHovered] = useState(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch dynamic settings from /api/settings
  useEffect(() => {
    const fetchHeroConfig = async () => {
      try {
        const res = await fetch("/api/settings?key=hero_config");
        if (res.ok) {
          const data = await res.json();
          const heroConfig =
            data?.hero_config ||
            data?.value?.hero_config ||
            (data?.key === "hero_config" ? data?.value : null);

          if (heroConfig && (heroConfig.videoUrl || heroConfig.mediaType || heroConfig.imageUrl || heroConfig.posterImageUrl)) {
            setConfig((prev) => ({
              ...prev,
              ...heroConfig,
            }));
            try {
              localStorage.setItem("cached_hero_config", JSON.stringify(heroConfig));
            } catch {}
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
        try {
          localStorage.setItem("cached_hero_config", JSON.stringify(e.detail));
        } catch {}
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

  // 2. Control video element playback & speed (seamless sync)
  useEffect(() => {
    if (videoRef.current && config.mediaType === "video") {
      videoRef.current.defaultMuted = config.muted;
      videoRef.current.muted = config.muted;
      videoRef.current.playbackRate = config.playbackSpeed || 1.0;
      if (config.autoPlay && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [config.mediaType, config.muted, config.autoPlay, config.playbackSpeed]);

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

  const desktopHeightClass =
    config.desktopHeight === "85vh"
      ? "lg:h-[85vh] lg:min-h-[520px]"
      : config.desktopHeight === "75vh"
      ? "lg:h-[75vh] lg:min-h-[460px]"
      : config.desktopHeight === "auto"
      ? "lg:h-auto lg:min-h-[500px]"
      : "lg:h-[100dvh] lg:min-h-[560px]";

  const mobileHeightClass =
    config.mobileHeight === "100svh"
      ? "h-[100svh] min-h-[100svh]"
      : config.mobileHeight === "70svh"
      ? "h-[70svh] min-h-[70svh]"
      : config.mobileHeight === "auto"
      ? "h-auto min-h-[50svh]"
      : "h-[82svh] min-h-[82svh]";

  return (
    <section className={`relative w-full ${mobileHeightClass} ${desktopHeightClass} overflow-hidden bg-[#194B37] flex items-center justify-center select-none`}>
      {/* 1. Dynamic Video / Image Background Media with Anti-Cache Version */}
      <HeroBackgroundMedia
        mediaType={config.mediaType}
        videoUrl={config.videoUrl}
        posterImageUrl={config.posterImageUrl}
        imageUrl={config.imageUrl}
        autoPlay={config.autoPlay}
        muted={config.muted}
        loop={config.loop}
        videoRef={videoRef}
        version={config.version || config.updatedAt}
        mediaFit={config.mediaFit}
        mediaPosition={config.mediaPosition}
        mobileMediaFit={config.mobileMediaFit}
      />

      {/* 2. Visual Depth & Cinematic Vignette Overlays */}
      <HeroOverlay
        overlayDarkness={config.overlayDarkness}
        showTopVignette={config.showTopVignette}
        showBottomVignette={config.showBottomVignette}
      />

      {/* 3. Optional Headline, Tagline & Text Overlay */}
      <HeroTextOverlay
        enableTextOverlay={config.enableTextOverlay}
        isBn={isBn}
        taglineEn={config.taglineEn}
        taglineBn={config.taglineBn}
        headlineEn={config.headlineEn}
        headlineBn={config.headlineBn}
        descriptionEn={config.descriptionEn}
        descriptionBn={config.descriptionBn}
        textPosition={config.textPosition}
      />

      {/* 4. Interactive Slide-Out CTA (Hover Trigger & Action Buttons) */}
      <HeroSlideOutCTA
        ctaEnabled={config.ctaEnabled}
        ctaTriggerMode={config.ctaTriggerMode}
        showCta={showCta}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        btnProjectsVisible={config.btnProjectsVisible}
        btnProjectsLink={config.btnProjectsLink}
        btnProjectsStyle={config.btnProjectsStyle}
        projectsLabel={projectsLabel}
        onProjectsClick={handleProjectsClick}
        btnContactVisible={config.btnContactVisible}
        btnContactLink={config.btnContactLink}
        btnContactStyle={config.btnContactStyle}
        contactLabel={contactLabel}
      />

      {/* 5. Figma Architectural Film Controls Bar */}
      <div className="absolute bottom-3 sm:bottom-5 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-12 lg:px-16 flex items-center justify-between">
          <span className="text-white/75 text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase hidden md:inline-block drop-shadow">
            DHAKA, BANGLADESH &nbsp; / &nbsp; A NEW WAY TO LIVE WITH NATURE
          </span>

          <div className="flex items-center gap-3 pointer-events-auto bg-black/45 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-mono shadow-md">
            <button
              type="button"
              onClick={togglePlay}
              className="hover:text-[#DDE8AA] transition-colors p-1 cursor-pointer"
              aria-label={isPlaying ? "Pause Video" : "Play Video"}
            >
              {isPlaying ? (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              className="hover:text-[#DDE8AA] transition-colors p-1 cursor-pointer"
              aria-label={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>

            <span className="opacity-40">|</span>
            <span className="tracking-widest uppercase">GARDEN FILM &nbsp; 01:24</span>
          </div>
        </div>
      </div>

      {/* 6. Emergency Tree Doctor Floating Pill Badge (Figma: 202x52) */}
      <button
        type="button"
        onClick={() => {
          window.dispatchEvent(new CustomEvent("open-tree-doctor"));
        }}
        className="fixed bottom-6 right-4 sm:right-8 z-40 bg-white hover:bg-stone-50 text-[#183A2D] px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-[0_12px_36px_rgba(0,0,0,0.22)] border border-stone-200/90 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer group"
        aria-label="Tree Doctor Get Help"
      >
        <div className="w-7 h-7 rounded-full bg-[#183A2D]/10 flex items-center justify-center text-[#183A2D]">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
            <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
            <circle cx="20" cy="10" r="2" />
          </svg>
        </div>
        <div className="text-left font-sans">
          <span className="text-xs sm:text-[13px] font-semibold block leading-tight text-[#183A2D]">
            Tree Doctor · Get help ↗
          </span>
          <span className="text-[9px] text-[#6B746C] block leading-tight">
            অন-কল বৃক্ষ চিকিৎসা
          </span>
        </div>
      </button>

      {/* 5. Mobile-Only Subtle Scroll Hint (respects prefers-reduced-motion) */}
      <button
        type="button"
        onClick={() => {
          const nextSec =
            document.getElementById("manifesto") ||
            document.querySelector("main section:nth-of-type(2)") ||
            document.querySelector("section:nth-of-type(2)");
          if (nextSec) {
            nextSec.scrollIntoView({ behavior: "smooth" });
          }
        }}
        className="lg:hidden absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 text-white/75 hover:text-white transition-colors cursor-pointer select-none pointer-events-auto motion-safe:animate-bounce motion-reduce:animate-none"
        aria-label="Scroll to next section"
      >
        <span className="text-[10px] font-sans font-medium tracking-widest uppercase text-white/80">
          স্ক্রল করুন
        </span>
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </section>
  );
}
