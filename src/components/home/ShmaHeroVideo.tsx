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
    <section className={`relative w-full ${mobileHeightClass} ${desktopHeightClass} overflow-hidden bg-[#041a2e] flex items-center justify-center select-none`}>
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
