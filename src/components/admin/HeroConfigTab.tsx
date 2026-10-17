"use client";

import React, { useState, useEffect, useRef } from "react";
import { IHeroSettings, defaultHeroSettings } from "@/types";

// Curated Video & Poster Presets for Instant One-Click Selection
const VIDEO_PRESETS = [
  {
    name: "Shma Official Reel",
    desc: "Bangkok Modern Botanical Landscape & Waterways",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2026/04/Homepage-260408.mp4",
    posterUrl: "https://shmadesigns.com/wp-content/uploads/al_opt_content/IMAGE/shmadesigns.com/wp-content/uploads/2025/06/Shma_MBCII_Photo_0013.jpg.bv.webp",
  },
  {
    name: "Sky-Forest Penthouse",
    desc: "Lush residential forest rooftop with automated irrigation",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/04/Shma_Sky-Forest.mp4",
    posterUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Mapletree Urban Park",
    desc: "Biophilic commercial architecture with water cascade & lawns",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/04/Shma_Mapletree-Business-City-II.mp4",
    posterUrl: "https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function HeroConfigTab() {
  const [config, setConfig] = useState<IHeroSettings>(defaultHeroSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<"media" | "cta" | "style" | "text">("media");
  const [previewHover, setPreviewHover] = useState(false);
  const [previewLang, setPreviewLang] = useState<"en" | "bn">("en");
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch current settings from database
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.value?.hero_config) {
          setConfig({
            ...defaultHeroSettings,
            ...data.value.hero_config,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load hero settings:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Save settings to /api/settings
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setSavedSuccess(false);

      // Fetch existing site_config to preserve other properties
      const resGet = await fetch("/api/settings", { cache: "no-store" });
      let currentVal = {};
      if (resGet.ok) {
        const d = await resGet.json();
        currentVal = d.value || {};
      }

      const timestamp = Date.now();
      const updatedHeroConfig = {
        ...config,
        version: timestamp,
        updatedAt: timestamp,
      };

      const updatedVal = {
        ...currentVal,
        hero_config: updatedHeroConfig,
      };

      // 1. Save within site_config
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVal),
      });

      // 2. Also save to dedicated key hero_config for direct lookup
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "hero_config",
          value: updatedHeroConfig,
        }),
      });

      if (res.ok) {
        setConfig(updatedHeroConfig);
        setSavedSuccess(true);
        // Dispatch live event to immediately update any open homepage components
        window.dispatchEvent(
          new CustomEvent("hero-config-updated", { detail: updatedHeroConfig })
        );
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert("সংরক্ষণ ব্যর্থ হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch (err) {
      console.error("Error saving hero settings:", err);
      alert("সংরক্ষণ করতে সমস্যা হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  // 3. Reset to default
  const handleResetToDefault = () => {
    if (window.confirm("আপনি কি হিরো সেকশনের সকল সেটিংস ডিফল্ট মানে রিসেট করতে চান?")) {
      setConfig({ ...defaultHeroSettings });
    }
  };

  // 4. Handle poster image file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingPoster(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero-posters");

      const res = await fetch("/api/upload/admin", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setConfig((prev) => ({
            ...prev,
            posterImageUrl: data.url,
            imageUrl: data.url,
          }));
        }
      } else {
        alert("ফাইল আপলোড ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("ছবি আপলোড করার সময় সমস্যা হয়েছে।");
    } finally {
      setUploadingPoster(false);
    }
  };

  // 5. Handle video file upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "hero-videos");

      const res = await fetch("/api/upload/admin", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          const timestamp = Date.now();
          setConfig((prev) => ({
            ...prev,
            videoUrl: data.url,
            mediaType: "video",
            version: timestamp,
            updatedAt: timestamp,
          }));
        }
      } else {
        alert("ভিডিও ফাইল আপলোড ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      console.error("Video upload error:", err);
      alert("ভিডিও আপলোড করার সময় সমস্যা হয়েছে।");
    } finally {
      setUploadingVideo(false);
    }
  };

  // Preview hover simulation
  const handlePreviewEnter = () => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    setPreviewHover(true);
  };

  const handlePreviewLeave = () => {
    previewTimerRef.current = setTimeout(() => {
      setPreviewHover(false);
    }, 400);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-white/50">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-mono tracking-widest uppercase">Loading Hero Configuration...</p>
      </div>
    );
  }

  const isBnPreview = previewLang === "bn";
  const previewProjectsLabel = isBnPreview
    ? config.btnProjectsTextBn || config.btnProjectsTextEn
    : config.btnProjectsTextEn;
  const previewContactLabel = isBnPreview
    ? config.btnContactTextBn || config.btnContactTextEn
    : config.btnContactTextEn;

  return (
    <div className="space-y-8 pb-16 font-sans">
      {/* ================= HEADER BAR ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d1c13] border border-emerald-500/20 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold">
              Dynamic Homepage Banner Controller
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            হিরো সেকশন ও সিনেমাটিক ভিডিও কন্ট্রোল (A to Z)
          </h2>
          <p className="text-xs text-white/60 mt-1 max-w-2xl">
            ব্যাকগ্রাউন্ড ভিডিও, পোস্টার ছবি, বাম পাশের স্লাইড-আউট CTA বাটন, ডার্ক ওভারলে এবং টেক্সট কন্টেন্ট সম্পূর্ণ ক্লায়েন্ট ডাইনামিক।
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-emerald-400 hover:bg-emerald-300 text-stone-950 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-stone-900 border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </>
            ) : savedSuccess ? (
              <>
                <span>✓</span>
                Saved Successfully!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🎉</span>
            <span>হিরো সেকশনের সেটিংস সফলভাবে সেভ হয়েছে এবং মূল হোমপেজে রিয়েল-টাইমে আপডেট করা হয়েছে!</span>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="underline font-bold hover:text-white"
          >
            ওয়েবসাইট দেখুন ➔
          </a>
        </div>
      )}

      {/* ================= INTERACTIVE LIVE PREVIEW BOX ================= */}
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
          onMouseEnter={handlePreviewEnter}
          onMouseLeave={handlePreviewLeave}
          className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden bg-black select-none border border-white/10 shadow-inner group cursor-crosshair"
        >
          {/* Media */}
          {config.mediaType === "video" ? (
            <video
              key={config.videoUrl}
              autoPlay={config.autoPlay}
              muted={config.muted}
              loop={config.loop}
              playsInline
              poster={config.posterImageUrl}
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={config.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <img
              src={config.imageUrl || config.posterImageUrl}
              alt="Preview"
              className="absolute inset-0 w-full h-full object-cover"
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

      {/* ================= CONTROLLER TABS ================= */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === "media"
              ? "bg-emerald-400 text-stone-950 shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>📹</span>
          <span>1. ব্যাকগ্রাউন্ড ভিডিও ও মিডিয়া</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("cta")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === "cta"
              ? "bg-emerald-400 text-stone-950 shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>✨</span>
          <span>2. স্লাইড-আউট CTA বাটন কন্ট্রোলার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("style")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === "style"
              ? "bg-emerald-400 text-stone-950 shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>🎨</span>
          <span>3. ওভারলে ও সিনেম্যাটিক ভিজ্যুয়াল</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === "text"
              ? "bg-emerald-400 text-stone-950 shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>📝</span>
          <span>4. হেডলাইন ও টেক্সট কন্টেন্ট</span>
        </button>
      </div>

      {/* ================= TAB 1: MEDIA CONFIGURATION ================= */}
      {activeTab === "media" && (
        <div className="space-y-6 bg-[#0c1811] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">ব্যাকগ্রাউন্ড মিডিয়া ও ভিডিও সোর্স</h3>
              <p className="text-xs text-white/50">হিরো ব্যানারের ভিডিও লিংক, পোস্টার ছবি ও প্লেব্যাক অপশন নির্বাচন করুন।</p>
            </div>

            {/* Media Type Switcher */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setConfig({ ...config, mediaType: "video" })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                  config.mediaType === "video"
                    ? "bg-emerald-400 text-stone-950"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Video Reel
              </button>
              <button
                type="button"
                onClick={() => setConfig({ ...config, mediaType: "image" })}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase font-bold transition-all ${
                  config.mediaType === "image"
                    ? "bg-emerald-400 text-stone-950"
                    : "text-white/60 hover:text-white"
                }`}
              >
                Static Image
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-2">
              ⚡ রেডিমেড প্রিমিয়াম ভিডিও প্রিসেটস (One-Click Select):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {VIDEO_PRESETS.map((p, idx) => {
                const isSelected = config.videoUrl === p.videoUrl;
                return (
                  <div
                    key={idx}
                    onClick={() =>
                      setConfig({
                        ...config,
                        videoUrl: p.videoUrl,
                        posterImageUrl: p.posterUrl,
                        mediaType: "video",
                      })
                    }
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-emerald-500/15 border-emerald-400 text-white shadow-lg"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">{p.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                          Active ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-white/50 leading-snug">{p.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Video URL */}
          {config.mediaType === "video" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  ভিডিও লিঙ্ক (MP4 Video URL):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={config.videoUrl}
                    onChange={(e) => setConfig({ ...config, videoUrl: e.target.value })}
                    placeholder="https://your-domain.com/path-to-video.mp4"
                    className="flex-grow bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-wider border border-emerald-500/30 shrink-0 cursor-pointer">
                    {uploadingVideo ? "Uploading..." : "Upload MP4 📹"}
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                      disabled={uploadingVideo}
                    />
                  </label>
                  <a
                    href={config.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono uppercase tracking-wider border border-white/10 shrink-0"
                  >
                    Test URL ↗
                  </a>
                </div>
                <p className="text-[11px] text-white/40 mt-1 font-mono">
                  সরাসরি যেকোনো ডিরেক্ট MP4 ভিডিও ফাইল বা ক্লাউডিনারি লিংক ব্যবহার করুন।
                </p>
              </div>

              {/* Poster Image URL */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                  ভিডিও পোস্টার / ফলব্যাক ছবি (Poster Image URL):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={config.posterImageUrl}
                    onChange={(e) => setConfig({ ...config, posterImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-grow bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                  <label className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-wider border border-emerald-500/30 shrink-0 cursor-pointer">
                    {uploadingPoster ? "Uploading..." : "Upload Image 📁"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploadingPoster}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const matchedPreset = VIDEO_PRESETS.find((p) => p.videoUrl === config.videoUrl);
                      const defaultPoster = matchedPreset ? matchedPreset.posterUrl : VIDEO_PRESETS[0].posterUrl;
                      setConfig({ ...config, posterImageUrl: defaultPoster, imageUrl: defaultPoster });
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider border border-white/10 shrink-0 cursor-pointer"
                    title="ভিডিও ফ্রেমের সাথে পোস্টার ছবি সিঙ্ক করুন"
                  >
                    ভিডিওর সাথে সিঙ্ক 🔄
                  </button>
                </div>
                <p className="text-[11px] text-emerald-400/80 mt-1 font-mono">
                  ভিডিও লোড হওয়ার মুহূর্তে এই ছবিটি দেখাবে। ভিডিওর সাথে মিল রাখতে &quot;ভিডিওর সাথে সিঙ্ক 🔄&quot; বাটনে ক্লিক করতে পারেন।
                </p>
              </div>

              {/* Playback Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                  <div>
                    <span className="text-xs font-bold text-white block">AutoPlay</span>
                    <span className="text-[10px] text-white/50 font-mono">ভিডিও স্বয়ংক্রিয় চালু</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.autoPlay}
                    onChange={(e) => setConfig({ ...config, autoPlay: e.target.checked })}
                    className="w-4 h-4 accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                  <div>
                    <span className="text-xs font-bold text-white block">Loop Video</span>
                    <span className="text-[10px] text-white/50 font-mono">পুনরাবৃত্তি চলবে</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.loop}
                    onChange={(e) => setConfig({ ...config, loop: e.target.checked })}
                    className="w-4 h-4 accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10">
                  <div>
                    <span className="text-xs font-bold text-white block">Muted Audio</span>
                    <span className="text-[10px] text-white/50 font-mono">শব্দ বন্ধ (ব্রাউজার রুল)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.muted}
                    onChange={(e) => setConfig({ ...config, muted: e.target.checked })}
                    className="w-4 h-4 accent-emerald-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">Speed</span>
                    <span className="text-[11px] font-mono text-emerald-400">{config.playbackSpeed || 1.0}x</span>
                  </div>
                  <select
                    value={config.playbackSpeed || 1.0}
                    onChange={(e) => setConfig({ ...config, playbackSpeed: parseFloat(e.target.value) })}
                    className="w-full bg-black/60 border border-white/20 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
                  >
                    <option value="0.75">0.75x (Cinematic Slow)</option>
                    <option value="1.0">1.0x (Standard Normal)</option>
                    <option value="1.25">1.25x (Dynamic Motion)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Static Image URL */}
          {config.mediaType === "image" && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-white/70 mb-1.5">
                ছবি লিঙ্ক (Image URL):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={config.imageUrl || config.posterImageUrl}
                  onChange={(e) =>
                    setConfig({ ...config, imageUrl: e.target.value, posterImageUrl: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/..."
                  className="flex-grow bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
                <label className="px-3.5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono uppercase tracking-wider border border-emerald-500/30 shrink-0 cursor-pointer">
                  {uploadingPoster ? "Uploading..." : "Upload Image 📁"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingPoster}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: SLIDE-OUT CTA BUTTON CONTROLLER ================= */}
      {activeTab === "cta" && (
        <div className="space-y-6 bg-[#0c1811] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">হিরো CTA বাটন কন্ট্রোলার (স্লাইড-আউট অ্যানিমেশন)</h3>
              <p className="text-xs text-white/50">
                হোভার অ্যানিমেশন মোড, বাটন নাম (ইংরেজি ও বাংলা), স্ক্রোল বা লিঙ্ক অ্যাকশন পরিবর্তন করুন।
              </p>
            </div>

            {/* Master Switch */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-white/60">CTA Enable:</span>
              <input
                type="checkbox"
                checked={config.ctaEnabled}
                onChange={(e) => setConfig({ ...config, ctaEnabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Trigger Mode */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
              ডিসপ্লে ও অ্যানিমেশন মোড (Display Trigger Behavior):
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setConfig({ ...config, ctaTriggerMode: "hover" })}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  config.ctaTriggerMode === "hover"
                    ? "bg-emerald-500/15 border-emerald-400 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">
                    🎯 Hover-Only Slide Out (Client Preferred)
                  </span>
                  {config.ctaTriggerMode === "hover" && (
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                      Active ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/50">
                  স্বাভাবিক অবস্থায় সম্পূর্ণ অদৃশ্য থাকবে; মাউস বাম পাশে নিলে অ্যানিমেশনে স্লাইড হয়ে বের হবে।
                </p>
              </div>

              <div
                onClick={() => setConfig({ ...config, ctaTriggerMode: "always_visible" })}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  config.ctaTriggerMode === "always_visible"
                    ? "bg-emerald-500/15 border-emerald-400 text-white shadow-lg"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white">📌 Always Visible</span>
                  {config.ctaTriggerMode === "always_visible" && (
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                      Active ✓
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/50">
                  বাটনটি সর্বদা স্ক্রিনের নিচে বাম কর্নারে দৃশ্যমান থাকবে।
                </p>
              </div>
            </div>
          </div>

          {/* Button 1: Projects Settings */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <span>📁 বাটন ১: Projects</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/50">Show Button:</span>
                <input
                  type="checkbox"
                  checked={config.btnProjectsVisible}
                  onChange={(e) => setConfig({ ...config, btnProjectsVisible: e.target.checked })}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  English Label:
                </label>
                <input
                  type="text"
                  value={config.btnProjectsTextEn}
                  onChange={(e) => setConfig({ ...config, btnProjectsTextEn: e.target.value })}
                  placeholder="Projects"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  বাংলা লেবেল (Bengali Label):
                </label>
                <input
                  type="text"
                  value={config.btnProjectsTextBn}
                  onChange={(e) => setConfig({ ...config, btnProjectsTextBn: e.target.value })}
                  placeholder="প্রকল্পসমূহ"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  ক্লিক অ্যাকশন মোড:
                </label>
                <select
                  value={config.btnProjectsAction}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      btnProjectsAction: e.target.value as "scroll" | "navigate",
                    })
                  }
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                >
                  <option value="scroll">Smooth Scroll to ID (যেমন: #projects)</option>
                  <option value="navigate">Navigate to Page (যেমন: /projects)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  টার্গেট লিংক বা সেকশন আইডি:
                </label>
                <input
                  type="text"
                  value={config.btnProjectsLink}
                  onChange={(e) => setConfig({ ...config, btnProjectsLink: e.target.value })}
                  placeholder="#projects অথবা /projects"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Button 2: Contact Settings */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-2">
                <span>💬 বাটন ২: Contact</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-white/50">Show Button:</span>
                <input
                  type="checkbox"
                  checked={config.btnContactVisible}
                  onChange={(e) => setConfig({ ...config, btnContactVisible: e.target.checked })}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  English Label:
                </label>
                <input
                  type="text"
                  value={config.btnContactTextEn}
                  onChange={(e) => setConfig({ ...config, btnContactTextEn: e.target.value })}
                  placeholder="Contact"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  বাংলা লেবেল (Bengali Label):
                </label>
                <input
                  type="text"
                  value={config.btnContactTextBn}
                  onChange={(e) => setConfig({ ...config, btnContactTextBn: e.target.value })}
                  placeholder="যোগাযোগ"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  টার্গেট পেজ লিঙ্ক:
                </label>
                <input
                  type="text"
                  value={config.btnContactLink}
                  onChange={(e) => setConfig({ ...config, btnContactLink: e.target.value })}
                  placeholder="/contact অথবা https://wa.me/..."
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  বাটন কালার থিম:
                </label>
                <select
                  value={config.btnContactStyle}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      btnContactStyle: e.target.value as "emerald-glow" | "white-pill" | "dark-glass",
                    })
                  }
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                >
                  <option value="emerald-glow">Emerald Glow Pill (Recommended)</option>
                  <option value="white-pill">White Solid Pill</option>
                  <option value="dark-glass">Frosted Dark Glass</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: OVERLAY & VIGNETTES ================= */}
      {activeTab === "style" && (
        <div className="space-y-6 bg-[#0c1811] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-bold text-white">ওভারলে ও সিনেম্যাটিক ভিজ্যুয়াল</h3>
            <p className="text-xs text-white/50">ডার্ক ওভারলে ও গ্রেডিয়েন্ট ভিনিয়েটের মাধ্যমে ভিডিওর ভিজ্যুয়াল ব্যালান্স করুন।</p>
          </div>

          <div className="space-y-5">
            {/* Dark Overlay Slider */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">
                  Dark Overlay Opacity (কালো ওভারলে ঘনত্ব)
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  {config.overlayDarkness || 0}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={config.overlayDarkness || 0}
                onChange={(e) => setConfig({ ...config, overlayDarkness: parseInt(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <p className="text-[11px] text-white/40 mt-1">
                ভিডিওর উপর হালকা কালো প্রলেপ যুক্ত করে যাতে মেনু বা টেক্সট সহজে পড়া যায় (১০%-২৫% সাজেস্টেড)।
              </p>
            </div>

            {/* Top & Bottom Vignettes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Top Vignette</span>
                  <span className="text-[11px] text-white/50">উপরের হালকা গ্রেডিয়েন্ট (Navbar স্পষ্ট রাখতে)</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showTopVignette}
                  onChange={(e) => setConfig({ ...config, showTopVignette: e.target.checked })}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Bottom Vignette</span>
                  <span className="text-[11px] text-white/50">নিচের গ্রেডিয়েন্ট (CTA বাটন স্পষ্ট রাখতে)</span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showBottomVignette}
                  onChange={(e) => setConfig({ ...config, showBottomVignette: e.target.checked })}
                  className="w-4 h-4 accent-emerald-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: HEADLINE & TEXT OVERLAY ================= */}
      {activeTab === "text" && (
        <div className="space-y-6 bg-[#0c1811] border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">হেডলাইন ও টেক্সট কন্টেন্ট (ঐচ্ছিক)</h3>
              <p className="text-xs text-white/50">
                ভিডিওর উপরে কোনো শিরোনাম বা ট্যাগলাইন দেখাতে চাইলে এটি সক্রিয় করতে পারেন।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-white/60">Show Text Overlay:</span>
              <input
                type="checkbox"
                checked={config.enableTextOverlay}
                onChange={(e) => setConfig({ ...config, enableTextOverlay: e.target.checked })}
                className="w-5 h-5 accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          {config.enableTextOverlay ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                    ট্যাগলাইন (English Tagline):
                  </label>
                  <input
                    type="text"
                    value={config.taglineEn || ""}
                    onChange={(e) => setConfig({ ...config, taglineEn: e.target.value })}
                    placeholder="LANDSCAPE ARCHITECTURE & URBAN GREENERY"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                    ট্যাগলাইন (বাংলা):
                  </label>
                  <input
                    type="text"
                    value={config.taglineBn || ""}
                    onChange={(e) => setConfig({ ...config, taglineBn: e.target.value })}
                    placeholder="ল্যান্ডস্কেপ আর্কিটেকচার ও নগর সবুজায়ন"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                    প্রধান শিরোনাম (English Headline):
                  </label>
                  <input
                    type="text"
                    value={config.headlineEn || ""}
                    onChange={(e) => setConfig({ ...config, headlineEn: e.target.value })}
                    placeholder="WEAVING NATURE INTO MODERN SPACES"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-serif uppercase tracking-wide focus:border-emerald-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                    প্রধান শিরোনাম (বাংলা):
                  </label>
                  <input
                    type="text"
                    value={config.headlineBn || ""}
                    onChange={(e) => setConfig({ ...config, headlineBn: e.target.value })}
                    placeholder="প্রকৃতিকে আধুনিক স্থাপত্যের সাথে সমন্বিত করা"
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  বিবরণ (English Description):
                </label>
                <textarea
                  rows={2}
                  value={config.descriptionEn || ""}
                  onChange={(e) => setConfig({ ...config, descriptionEn: e.target.value })}
                  placeholder="Creating living, breathing ecosystems that enhance well-being and biodiversity."
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  বিবরণ (বাংলা):
                </label>
                <textarea
                  rows={2}
                  value={config.descriptionBn || ""}
                  onChange={(e) => setConfig({ ...config, descriptionBn: e.target.value })}
                  placeholder="টেকসই ও মনোরম ল্যান্ডস্কেপ তৈরির মাধ্যমে প্রতিটি স্থানকে একটি জীবন্ত মরূদ্যানে রূপান্তর করি।"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-black/30 border border-dashed border-white/10 text-center text-white/50 text-xs">
              টেক্সট ওভারলে বর্তমানে বন্ধ রয়েছে। Shma-স্টাইল ক্লিন সিনেমাটিক ভিডিও চালু রাখতে এটি বন্ধ রাখাই প্রস্তাবিত।
            </div>
          )}
        </div>
      )}

      {/* Floating Save Trigger */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={() => handleSave()}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-emerald-400 hover:bg-emerald-300 text-stone-950 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save All Changes ➔"}
        </button>
      </div>
    </div>
  );
}
