"use client";

import React from "react";
import type { IHeroSettings } from "@/types";

interface VideoPreset {
  name: string;
  desc: string;
  videoUrl: string;
  posterUrl: string;
}

interface HeroSettingsPanelsProps {
  config: IHeroSettings;
  setConfig: React.Dispatch<React.SetStateAction<IHeroSettings>>;
  activeTab: "media" | "cta" | "style" | "text";
  setActiveTab: (tab: "media" | "cta" | "style" | "text") => void;
  videoPresets: VideoPreset[];
  uploadingPoster: boolean;
  uploadingVideo: boolean;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  saving: boolean;
  onSave: () => void;
}

export default function HeroSettingsPanels({
  config,
  setConfig,
  activeTab,
  setActiveTab,
  videoPresets,
  uploadingPoster,
  uploadingVideo,
  handleFileUpload,
  handleVideoUpload,
  saving,
  onSave,
}: HeroSettingsPanelsProps) {
  return (
    <div className="space-y-6">
      {/* ================= CONTROLLER TABS ================= */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === "media"
              ? "bg-emerald-400 text-stone-950 shadow-md"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          <span>🎬</span>
          <span>1. মিডিয়া ও ভিডিও সোর্স</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {videoPresets.map((p, idx) => {
                const isSelected = config.videoUrl === p.videoUrl && config.posterImageUrl === p.posterUrl;
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
                  {config.videoUrl && (
                    <a
                      href={config.videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono uppercase tracking-wider border border-white/10 shrink-0"
                    >
                      Test URL ↗
                    </a>
                  )}
                </div>
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
                    placeholder="/hero_plants.png"
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
                      const matchedPreset = videoPresets.find((p) => p.videoUrl === config.videoUrl);
                      const defaultPoster = matchedPreset ? matchedPreset.posterUrl : videoPresets[0].posterUrl;
                      setConfig({ ...config, posterImageUrl: defaultPoster, imageUrl: defaultPoster });
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider border border-white/10 shrink-0 cursor-pointer"
                    title="ভিডিও ফ্রেমের সাথে পোস্টার ছবি সিঙ্ক করুন"
                  >
                    ভিডিওর সাথে সিঙ্ক 🔄
                  </button>
                </div>
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
                    <span className="text-[10px] text-white/50 font-mono">শব্দ বন্ধ</span>
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
                  placeholder="/hero_plants.png"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  ট্যাগলাইন (English):
                </label>
                <input
                  type="text"
                  value={config.taglineEn}
                  onChange={(e) => setConfig({ ...config, taglineEn: e.target.value })}
                  placeholder="Ecological Urban Architecture"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  ট্যাগলাইন (বাংলা):
                </label>
                <input
                  type="text"
                  value={config.taglineBn}
                  onChange={(e) => setConfig({ ...config, taglineBn: e.target.value })}
                  placeholder="বাস্তুতান্ত্রিক আরবান আর্কিটেকচার"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  মূল শিরোনাম (English Headline):
                </label>
                <input
                  type="text"
                  value={config.headlineEn}
                  onChange={(e) => setConfig({ ...config, headlineEn: e.target.value })}
                  placeholder="Nature. City. Architecture."
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-serif uppercase tracking-wider focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  মূল শিরোনাম (বাংলা):
                </label>
                <input
                  type="text"
                  value={config.headlineBn}
                  onChange={(e) => setConfig({ ...config, headlineBn: e.target.value })}
                  placeholder="প্রকৃতি। শহর। স্থাপত্য।"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-serif uppercase tracking-wider focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  সংক্ষিপ্ত বিবরণী (English Description):
                </label>
                <input
                  type="text"
                  value={config.descriptionEn}
                  onChange={(e) => setConfig({ ...config, descriptionEn: e.target.value })}
                  placeholder="Transforming urban landscapes into living ecological ecosystems."
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-white/60 mb-1">
                  সংক্ষিপ্ত বিবরণী (বাংলা):
                </label>
                <input
                  type="text"
                  value={config.descriptionBn}
                  onChange={(e) => setConfig({ ...config, descriptionBn: e.target.value })}
                  placeholder="টেকসই ও মনোরম ল্যান্ডস্কেপ তৈরির মাধ্যমে প্রতিটি স্থানকে একটি জীবন্ত মরূদ্যানে রূপান্তর করি।"
                  className="w-full bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-black/30 border border-dashed border-white/10 text-center text-white/50 text-xs">
              টেক্সট ওভারলে বর্তমানে বন্ধ রয়েছে। ক্লিন সিনেমাটিক ভিডিও চালু রাখতে এটি বন্ধ রাখাই প্রস্তাবিত।
            </div>
          )}
        </div>
      )}

      {/* Floating Save Trigger */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-emerald-400 hover:bg-emerald-300 text-stone-950 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 cursor-pointer disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save All Changes ➔"}
        </button>
      </div>
    </div>
  );
}
