"use client";

import React, { useState, useEffect, useRef } from "react";
import { IHeroSettings, defaultHeroSettings } from "@/types";
import HeroLivePreview from "./hero/HeroLivePreview";
import HeroSettingsPanels from "./hero/HeroSettingsPanels";
import { uploadClientMedia } from "@/lib/clientUpload";

// Curated Video & Poster Presets for Instant One-Click Selection
const VIDEO_PRESETS = [
  {
    name: "Architectural Botany Reel",
    desc: "Modern Botanical Landscape & Waterways",
    videoUrl: "",
    posterUrl: "/hero_plants.png",
  },
  {
    name: "Sky-Forest Penthouse",
    desc: "Lush residential forest rooftop with automated irrigation",
    videoUrl: "",
    posterUrl: "/featured_plant.png",
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
    } catch {
      // Error handled silently
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
        try {
          localStorage.setItem("cached_hero_config", JSON.stringify(updatedHeroConfig));
        } catch {}
        // Dispatch live event to immediately update any open homepage components
        window.dispatchEvent(
          new CustomEvent("hero-config-updated", { detail: updatedHeroConfig })
        );
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        alert("সংরক্ষণ ব্যর্থ হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch {
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
      const result = await uploadClientMedia(file, "hero-posters");
      if (result.url) {
        setConfig((prev) => ({
          ...prev,
          posterImageUrl: result.url,
          imageUrl: result.url,
        }));
      }
    } catch (err: any) {
      alert(err?.message || "ছবি আপলোড করার সময় সমস্যা হয়েছে।");
    } finally {
      setUploadingPoster(false);
      e.target.value = "";
    }
  };

  // 5. Handle video file upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      const result = await uploadClientMedia(file, "hero-videos");
      if (result.url) {
        const timestamp = Date.now();
        setConfig((prev) => ({
          ...prev,
          videoUrl: result.url,
          mediaType: "video",
          version: timestamp,
          updatedAt: timestamp,
        }));
      }
    } catch (err: any) {
      alert(err?.message || "ভিডিও আপলোড করার সময় সমস্যা হয়েছে।");
    } finally {
      setUploadingVideo(false);
      e.target.value = "";
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
      <HeroLivePreview
        config={config}
        previewLang={previewLang}
        setPreviewLang={setPreviewLang}
        previewHover={previewHover}
        onPreviewEnter={handlePreviewEnter}
        onPreviewLeave={handlePreviewLeave}
      />

      {/* ================= SETTINGS CONTROLLER TABS & PANELS ================= */}
      <HeroSettingsPanels
        config={config}
        setConfig={setConfig}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        videoPresets={VIDEO_PRESETS}
        uploadingPoster={uploadingPoster}
        uploadingVideo={uploadingVideo}
        handleFileUpload={handleFileUpload}
        handleVideoUpload={handleVideoUpload}
        saving={saving}
        onSave={() => handleSave()}
      />
    </div>
  );
}
