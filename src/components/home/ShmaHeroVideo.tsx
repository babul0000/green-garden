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
  const [config, setConfig] = useState<IHeroSettings>(defaultHeroSettings);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch dynamic settings from /api/settings
  useEffect(() => {
    const fetchHeroConfig = async () => {
      try {
        const res = await fetch(`/api/settings?_t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        });
        if (res.ok) {
          const data = await res.json();
          const heroConfig =
            data?.hero_config ||
            data?.value?.hero_config ||
            (data?.key === "hero_config" ? data?.value : null);

          if (heroConfig && (heroConfig.videoUrl || heroConfig.mediaType)) {
            setConfig((prev) => ({
              ...prev,
              ...heroConfig,
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

  return (
    <section className="relative w-full h-[100dvh] min-h-[560px] overflow-hidden bg-[#041a2e] flex items-center justify-center select-none">
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
    </section>
  );
}
