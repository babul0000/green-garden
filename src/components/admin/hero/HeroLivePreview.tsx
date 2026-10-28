"use client";

import React from "react";
import type { IHeroSettings } from "@/types";

interface HeroLivePreviewProps {
  config: IHeroSettings;
  previewLang: "en" | "bn";
  setPreviewLang: (lang: "en" | "bn") => void;
  previewHover: boolean;
  onPreviewEnter: () => void;
  onPreviewLeave: () => void;
}

export default function HeroLivePreview({
  config,
  previewLang,
  setPreviewLang,
  previewHover,
  onPreviewEnter,
  onPreviewLeave,
}: HeroLivePreviewProps) {
  const isBnPreview = previewLang === "bn";
  const previewProjectsLabel = isBnPreview
    ? config.btnProjectsTextBn || config.btnProjectsTextEn
    : config.btnProjectsTextEn;
  const previewContactLabel = isBnPreview
    ? config.btnContactTextBn || config.btnContactTextEn
    : config.btnContactTextEn;

  return (
    <div className="bg-[#0b1410] border border-white/10 rounded-2xl p-5 shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            ● Live Interactive Preview
          </span>
          <span className="text-[11px] text-white/40 font-mono hidden sm:inline">
            (মাউস বাম পাশে নিয়ে হোভার স্লাইড টেস্ট করুন)
          </span>
        </div>

        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-white/10 text-xs">
          <span className="text-[10px] uppercase font-mono text-white/40 pl-1">Language:</span>
          <button
            type="button"
            onClick={() => setPreviewLang("en")}
            className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-bold transition-all ${
              previewLang === "en" ? "bg-emerald-400 text-stone-950" : "text-white/60 hover:text-white"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setPreviewLang("bn")}
            className={`px-2 py-0.5 rounded text-[11px] font-mono uppercase font-bold transition-all ${
              previewLang === "bn" ? "bg-emerald-400 text-stone-950" : "text-white/60 hover:text-white"
            }`}
          >
            BN
          </button>
        </div>
      </div>

      {/* The Mini Screen Hero */}
      <div
        onMouseEnter={onPreviewEnter}
        onMouseLeave={onPreviewLeave}
        className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden bg-black select-none border border-white/10 shadow-inner group cursor-crosshair"
      >
        {/* Ambient Blur Backdrop when Contain / Full View is active */}
        {config.mediaFit === "contain" && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40 select-none" aria-hidden="true">
            <img
              src={config.imageUrl || config.posterImageUrl}
              alt=""
              className="w-full h-full object-cover blur-2xl scale-125"
            />
          </div>
        )}

        {/* Media */}
        {config.mediaType === "video" ? (
          <video
            key={config.videoUrl}
            autoPlay={config.autoPlay}
            muted={config.muted}
            loop={config.loop}
            playsInline
            poster={config.posterImageUrl}
            className={`w-full h-full relative z-0 ${
              config.mediaFit === "contain"
                ? "object-contain"
                : config.mediaFit === "fill"
                ? "object-fill"
                : "object-cover"
            } ${
              config.mediaPosition === "top"
                ? "object-top"
                : config.mediaPosition === "bottom"
                ? "object-bottom"
                : "object-center"
            }`}
          >
            <source src={config.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <img
            src={config.imageUrl || config.posterImageUrl}
            alt="Preview"
            className={`w-full h-full relative z-0 ${
              config.mediaFit === "contain"
                ? "object-contain"
                : config.mediaFit === "fill"
                ? "object-fill"
                : "object-cover"
            } ${
              config.mediaPosition === "top"
                ? "object-top"
                : config.mediaPosition === "bottom"
                ? "object-bottom"
                : "object-center"
            }`}
          />
        )}

        {/* Overlay Darkness */}
        <div
          className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
          style={{ opacity: (config.overlayDarkness || 0) / 100 }}
        />

        {/* Vignettes */}
        {config.showTopVignette && (
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        )}
        {config.showBottomVignette && (
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        )}

        {/* Fake Navbar Header */}
        <div className="absolute top-4 inset-x-6 flex items-center justify-between text-white/90 text-xs font-mono z-10 pointer-events-none">
          <span className="tracking-[0.2em] font-bold">A R GREEN GARDEN</span>
          <span className="text-[10px] text-white/60 bg-black/40 px-2.5 py-1 rounded-full border border-white/10">
            Header Vignette Preview
          </span>
        </div>

        {/* Text Overlay if enabled */}
        {config.enableTextOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white pointer-events-none z-10">
            <span className="inline-block px-3 py-0.5 mb-2 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono uppercase tracking-widest text-emerald-300">
              {isBnPreview ? config.taglineBn || config.taglineEn : config.taglineEn}
            </span>
            <h3 className="text-xl sm:text-2xl font-light uppercase font-serif drop-shadow mb-2">
              {isBnPreview ? config.headlineBn || config.headlineEn : config.headlineEn}
            </h3>
            <p className="text-xs text-white/70 max-w-md drop-shadow">
              {isBnPreview ? config.descriptionBn || config.descriptionEn : config.descriptionEn}
            </p>
          </div>
        )}

        {/* Left Catchment Zone (Highlighted on preview when hovered) */}
        {config.ctaEnabled && config.ctaTriggerMode === "hover" && (
          <div
            className={`absolute left-0 top-0 bottom-0 w-32 border-r border-dashed transition-all pointer-events-none z-15 ${
              previewHover
                ? "border-emerald-400/50 bg-emerald-500/10"
                : "border-white/10 bg-transparent"
            }`}
          >
            <span className="absolute top-1/2 left-2 -translate-y-1/2 text-[9px] font-mono uppercase tracking-wider text-emerald-300/60 -rotate-90">
              Hover Trigger Zone
            </span>
          </div>
        )}

        {/* Slide-Out CTA Preview */}
        {config.ctaEnabled && (
          <div
            className={`absolute bottom-6 left-6 z-30 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              config.ctaTriggerMode === "always_visible" || previewHover
                ? "translate-x-0 opacity-100 scale-100"
                : "-translate-x-[calc(100%+3rem)] opacity-0 scale-95"
            }`}
          >
            <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/85 backdrop-blur-xl border border-white/25 text-white shadow-2xl">
              {config.btnProjectsVisible && (
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1 ${
                    config.btnProjectsStyle === "dark-glass"
                      ? "bg-black/50 border border-white/20 text-white"
                      : config.btnProjectsStyle === "emerald"
                      ? "bg-emerald-950 border border-emerald-400/80 text-emerald-200"
                      : "bg-white/15 border border-white/30 text-white"
                  }`}
                >
                  <span>{previewProjectsLabel}</span>
                  <span>↓</span>
                </span>
              )}

              {config.btnProjectsVisible && config.btnContactVisible && (
                <span className="w-[1px] h-3.5 bg-white/30"></span>
              )}

              {config.btnContactVisible && (
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1 ${
                    config.btnContactStyle === "white-pill"
                      ? "bg-white text-stone-900 border border-white/50"
                      : config.btnContactStyle === "dark-glass"
                      ? "bg-black/50 border border-white/20 text-white"
                      : "bg-emerald-500 text-stone-950 font-bold border border-emerald-400 shadow-md"
                  }`}
                >
                  <span>{previewContactLabel}</span>
                  <span>➔</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Hover hint */}
        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-white/50 bg-black/50 px-2 py-0.5 rounded border border-white/10 pointer-events-none">
          {config.ctaTriggerMode === "hover"
            ? previewHover
              ? "✓ Hover Active: CTA Revealed"
              : "Hover mouse on left edge to test slide-out"
            : "Mode: Always Visible"}
        </div>
      </div>
    </div>
  );
}
