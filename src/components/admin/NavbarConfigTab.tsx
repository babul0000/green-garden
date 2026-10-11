"use client";

import React, { useState, useEffect } from "react";

export interface IMenuLink {
  id: string;
  titleBn: string;
  titleEn: string;
  url: string;
  badge?: string;
  isVisible: boolean;
  order: number;
}

export interface INavbarSettings {
  // Logo
  logoType: "TEXT" | "IMAGE";
  logoText: string;
  logoImage?: string;
  logoHeight?: number;
  logoTracking?: string;
  
  // Hotline
  hotlinePhone: string;
  hotlineDisplay: string;
  hotlineVisible: boolean;
  
  // WhatsApp
  whatsappNumber: string;
  whatsappMessage: string;
  whatsappVisible: boolean;
  
  // Social Links
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  youtubeUrl?: string;
  socialVisible: boolean;
  
  // Feature Toggles
  enableLanguageSwitch: boolean;
  enable3dWizardLink: boolean;
  enableEmergencyDoctor: boolean;
  
  // Drawer Links
  menuLinks: IMenuLink[];
}

const defaultNavbarSettings: INavbarSettings = {
  logoType: "TEXT",
  logoText: "A R GREEN GARDEN",
  logoImage: "",
  logoHeight: 28,
  logoTracking: "0.22em",
  
  hotlinePhone: "01883012641",
  hotlineDisplay: "০১88৩-০১২৬৪১",
  hotlineVisible: true,
  
  whatsappNumber: "8801883012641",
  whatsappMessage: "Hello A R Green Garden, I would like to consult about my garden.",
  whatsappVisible: true,
  
  facebookUrl: "https://facebook.com",
  instagramUrl: "https://instagram.com",
  linkedinUrl: "https://linkedin.com",
  youtubeUrl: "https://youtube.com",
  socialVisible: true,
  
  enableLanguageSwitch: true,
  enable3dWizardLink: true,
  enableEmergencyDoctor: true,
  
  menuLinks: [
    { id: "1", titleBn: "প্রকল্পসমূহ (Portfolio)", titleEn: "Projects & Portfolio", url: "/projects", isVisible: true, order: 1 },
    { id: "2", titleBn: "সেবাসমূহ", titleEn: "Landscape Services", url: "/services", isVisible: true, order: 2 },
    { id: "3", titleBn: "মেথডোলজি ও কাজের ধাপ", titleEn: "Methodology & Process", url: "#process", isVisible: true, order: 3 },
    { id: "4", titleBn: "প্ল্যান্ট নার্সারি ও শপ", titleEn: "Plant Nursery & Shop", url: "/shop", badge: "SHOP", isVisible: true, order: 4 },
    { id: "5", titleBn: "ফটো গ্যালারি", titleEn: "Photo Gallery", url: "/gallery", isVisible: true, order: 5 },
    { id: "6", titleBn: "বিফোর-আফটার রূপান্তর", titleEn: "Before & After Showcase", url: "/before-after", badge: "NEW", isVisible: true, order: 6 },
    { id: "7", titleBn: "আমাদের টিম", titleEn: "Our Landscape Team", url: "/team", isVisible: true, order: 7 },
    { id: "8", titleBn: "স্টুডিও পরিচিতি", titleEn: "About Studio", url: "/about", isVisible: true, order: 8 },
    { id: "9", titleBn: "গ্রাহক মতামত", titleEn: "Client Testimonials", url: "/testimonials", isVisible: true, order: 9 },
    { id: "10", titleBn: "সংবাদ ও ব্লগ", titleEn: "Articles & Blog", url: "/blog", isVisible: true, order: 10 },
    { id: "11", titleBn: "সাধারণ জিজ্ঞাসা (FAQ)", titleEn: "Frequently Asked Questions", url: "/faq", isVisible: true, order: 11 },
    { id: "12", titleBn: "ক্যারিয়ার সুযোগ", titleEn: "Careers at Studio", url: "/career", isVisible: true, order: 12 },
    { id: "13", titleBn: "যোগাযোগ ও কনসাল্টেশন", titleEn: "Contact & Consultation", url: "/contact", isVisible: true, order: 13 },
  ],
};

export default function NavbarConfigTab() {
  const [config, setConfig] = useState<INavbarSettings>(defaultNavbarSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [previewMode, setPreviewMode] = useState<"transparent" | "scrolled">("scrolled");

  // Load existing settings
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data?.value?.navbar_config) {
          setConfig({
            ...defaultNavbarSettings,
            ...data.value.navbar_config,
            menuLinks: data.value.navbar_config.menuLinks || defaultNavbarSettings.menuLinks,
          });
        } else if (data?.value) {
          // Merge top-level settings if any
          setConfig((prev) => ({
            ...prev,
            logoText: data.value.title || prev.logoText,
            hotlinePhone: data.value.phone || prev.hotlinePhone,
            facebookUrl: data.value.fbPage || prev.facebookUrl,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load navbar settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      setSavedSuccess(false);

      // Fetch current site_config first to merge
      const resGet = await fetch("/api/settings");
      let currentVal = {};
      if (resGet.ok) {
        const d = await resGet.json();
        currentVal = d.value || {};
      }

      const updatedVal = {
        ...currentVal,
        title: config.logoText,
        phone: config.hotlinePhone,
        fbPage: config.facebookUrl,
        navbar_config: config,
      };

      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVal),
      });

      if (res.ok) {
        setSavedSuccess(true);
        // Trigger live refresh in other tabs/windows
        window.dispatchEvent(new CustomEvent("navbar-config-updated", { detail: config }));
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to save navbar configuration:", err);
    } finally {
      setSaving(false);
    }
  };

  // Upload logo image to Cloudinary
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "green-garden/branding");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setConfig((prev) => ({
          ...prev,
          logoType: "IMAGE",
          logoImage: data.url,
        }));
      } else {
        alert(data.error || "Logo upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload logo image");
    } finally {
      setUploadingLogo(false);
    }
  };

  // Add new menu link
  const handleAddLink = () => {
    const newLink: IMenuLink = {
      id: Date.now().toString(),
      titleBn: "নতুন লিংক",
      titleEn: "New Link",
      url: "#",
      isVisible: true,
      order: config.menuLinks.length + 1,
    };
    setConfig((prev) => ({
      ...prev,
      menuLinks: [...prev.menuLinks, newLink],
    }));
  };

  // Update menu link
  const handleUpdateLink = (id: string, field: keyof IMenuLink, value: any) => {
    setConfig((prev) => ({
      ...prev,
      menuLinks: prev.menuLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    }));
  };

  // Delete menu link
  const handleDeleteLink = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      menuLinks: prev.menuLinks.filter((link) => link.id !== id),
    }));
  };

  // Reorder links
  const handleMoveLink = (index: number, direction: "up" | "down") => {
    const newLinks = [...config.menuLinks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLinks.length) return;

    const temp = newLinks[index];
    newLinks[index] = newLinks[targetIndex];
    newLinks[targetIndex] = temp;

    setConfig((prev) => ({ ...prev, menuLinks: newLinks }));
  };

  if (loading) {
    return (
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center py-20">
        <div className="inline-block animate-spin text-3xl mb-3">🌿</div>
        <p className="text-white/60 text-sm">ন্যাভবার কনফিগারেশন লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Title Banner */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
            🎨 Live Header & Navbar Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#E4E2D7]">
            হেডার ও ন্যাভবার ম্যানেজমেন্ট সেন্টার
          </h2>
          <p className="text-xs text-white/50 mt-1 max-w-xl">
            লোগো (ইমেজ বা টেক্সট আপলোড), হটলাইন, হোয়াটসঅ্যাপ, সোশ্যাল মিডিয়া লিঙ্ক এবং ড্রয়ার মেনুর সমস্ত আইটেম লাইভ কাস্টমাইজ করুন।
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>সংরক্ষণ হচ্ছে...</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>পরিবর্তন সেভ করুন</span>
            </>
          )}
        </button>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/20 text-emerald-300 text-xs font-bold p-4 rounded-2xl border border-emerald-500/40 flex items-center gap-3 animate-fade-in-up">
          <span className="text-lg">✓</span>
          <span>ন্যাভবার কনফিগারেশন সফলভাবে ডাটাবেজে সংরক্ষিত ও ওয়েবসাইটে লাইভ আপডেট হয়েছে!</span>
        </div>
      )}

      {/* ================= 1. LIVE NAVBAR PREVIEW BAR ================= */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-400">👁️ লাইভ প্রিভিউ (Live Preview):</span>
            <span className="text-[11px] text-white/40">রিয়েল-টাইমে ন্যাভবার কেমন দেখাবে</span>
          </div>
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setPreviewMode("scrolled")}
              className={`px-3 py-1 rounded-lg transition-all ${
                previewMode === "scrolled" ? "bg-white text-stone-900 font-bold shadow" : "text-white/60 hover:text-white"
              }`}
            >
              Scrolled State (White)
            </button>
            <button
              onClick={() => setPreviewMode("transparent")}
              className={`px-3 py-1 rounded-lg transition-all ${
                previewMode === "transparent" ? "bg-emerald-600 text-white font-bold shadow" : "text-white/60 hover:text-white"
              }`}
            >
              Hero State (Transparent)
            </button>
          </div>
        </div>

        {/* Live Container Preview Frame */}
        <div
          className={`w-full rounded-2xl p-4 transition-all duration-300 border ${
            previewMode === "scrolled"
              ? "bg-white text-[#323232] border-black/10 shadow-md"
              : "bg-[#041a2e] text-white border-white/15"
          }`}
        >
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
            {/* Left: Hamburger + Language */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col gap-1 w-5 cursor-pointer">
                <span className={`h-[1.5px] w-full ${previewMode === "scrolled" ? "bg-[#323232]" : "bg-white"}`}></span>
                <span className={`h-[1.5px] w-full ${previewMode === "scrolled" ? "bg-[#323232]" : "bg-white"}`}></span>
                <span className={`h-[1.5px] w-full ${previewMode === "scrolled" ? "bg-[#323232]" : "bg-white"}`}></span>
              </div>
              {config.enableLanguageSwitch && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    previewMode === "scrolled"
                      ? "border-[#323232]/25 text-[#323232] bg-black/[0.03]"
                      : "border-white/35 text-white bg-white/10"
                  }`}
                >
                  বাংলা | EN
                </span>
              )}
            </div>

            {/* Center: Brand Logo Preview */}
            <div className="flex-1 flex items-center justify-center text-center">
              {config.logoType === "IMAGE" && config.logoImage ? (
                <img
                  src={config.logoImage}
                  alt={config.logoText}
                  style={{ height: `${config.logoHeight || 28}px` }}
                  className="object-contain max-w-[240px]"
                />
              ) : (
                <span
                  className="font-display font-light uppercase tracking-[0.18em] text-sm sm:text-base whitespace-nowrap"
                  style={{ letterSpacing: config.logoTracking || "0.22em" }}
                >
                  {config.logoText || "A R GREEN GARDEN"}
                </span>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-2.5 shrink-0">
              {config.hotlineVisible && (
                <span className="text-[11px] font-mono hidden md:inline opacity-80 border-b pb-0.5">
                  {config.hotlineDisplay || config.hotlinePhone}
                </span>
              )}
              {config.whatsappVisible && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#25D366] text-stone-950 font-bold text-[10px] shadow-xs">
                  💬 WhatsApp
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-emerald-700 text-white font-bold text-[10px] shadow-xs">
                👤 Dashboard
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. LOGO & BRANDING CONTROLS ================= */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-base font-bold text-[#E4E2D7] flex items-center gap-2">
            <span>🖼️</span> লোগো ও ব্র্যান্ডিং সেটিংস (Logo & Branding)
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            অ্যাডমিন চাইলে টেক্সট লোগো রাখতে পারেন অথবা যেকোনো SVG / PNG ইমেজ লোগো আপলোড করতে পারেন।
          </p>
        </div>

        {/* Logo Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            onClick={() => setConfig((p) => ({ ...p, logoType: "TEXT" }))}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
              config.logoType === "TEXT"
                ? "bg-emerald-500/15 border-emerald-400 text-white"
                : "bg-black/30 border-white/10 text-white/60 hover:border-white/20"
            }`}
          >
            <input
              type="radio"
              name="logoType"
              checked={config.logoType === "TEXT"}
              onChange={() => setConfig((p) => ({ ...p, logoType: "TEXT" }))}
              className="accent-emerald-500 w-4 h-4"
            />
            <div>
              <p className="text-xs font-bold text-white">টেক্সট লোগো (Minimalist Text Logo)</p>
              <p className="text-[11px] text-white/50">আর্কিটেকচারাল ফন্ট ও ওয়াইড লেটার স্পেসিং টেক্সট</p>
            </div>
          </label>

          <label
            onClick={() => setConfig((p) => ({ ...p, logoType: "IMAGE" }))}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
              config.logoType === "IMAGE"
                ? "bg-emerald-500/15 border-emerald-400 text-white"
                : "bg-black/30 border-white/10 text-white/60 hover:border-white/20"
            }`}
          >
            <input
              type="radio"
              name="logoType"
              checked={config.logoType === "IMAGE"}
              onChange={() => setConfig((p) => ({ ...p, logoType: "IMAGE" }))}
              className="accent-emerald-500 w-4 h-4"
            />
            <div>
              <p className="text-xs font-bold text-white">ইমেজ লোগো আপলোড (Custom Image / SVG / PNG)</p>
              <p className="text-[11px] text-white/50">ক্লাউডিনারিতে আপলোড করে সরাসরি ইমেজ লোগো প্রদর্শন</p>
            </div>
          </label>
        </div>

        {/* Text Logo Options */}
        {config.logoType === "TEXT" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                ব্র্যান্ড নাম / টেক্সট (Brand Name)
              </label>
              <input
                type="text"
                value={config.logoText}
                onChange={(e) => setConfig((p) => ({ ...p, logoText: e.target.value }))}
                placeholder="A R GREEN GARDEN"
                className="w-full bg-black/50 border border-white/15 text-white px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                লেটার স্পেসিং (Letter Tracking)
              </label>
              <select
                value={config.logoTracking || "0.22em"}
                onChange={(e) => setConfig((p) => ({ ...p, logoTracking: e.target.value }))}
                className="w-full bg-black/50 border border-white/15 text-white px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
              >
                <option value="0.12em">Tight (0.12em)</option>
                <option value="0.18em">Standard (0.18em)</option>
                <option value="0.22em">Architectural Wide (0.22em - Recommended)</option>
                <option value="0.28em">Ultra Wide (0.28em)</option>
              </select>
            </div>
          </div>
        ) : (
          /* Image Logo Upload Options */
          <div className="space-y-5 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Image Preview Box */}
              <div className="md:col-span-4 bg-black/40 border border-white/15 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] text-center">
                {config.logoImage ? (
                  <div className="space-y-2">
                    <img
                      src={config.logoImage}
                      alt="Logo preview"
                      style={{ height: `${config.logoHeight || 32}px` }}
                      className="object-contain mx-auto"
                    />
                    <p className="text-[10px] text-emerald-400 font-mono">✓ আপলোডকৃত লোগো প্রস্তুত</p>
                  </div>
                ) : (
                  <div className="text-white/40 text-xs">
                    <span className="text-2xl block mb-1">🖼️</span>
                    <span>কোনো লোগো আপলোড করা হয়নি</span>
                  </div>
                )}
              </div>

              {/* Upload Input & Height Slider */}
              <div className="md:col-span-8 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider font-mono block">
                    লোগো ফাইল নির্বাচন করুন (PNG, SVG, WebP, JPG)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="w-full text-xs text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer bg-black/50 border border-white/15 p-2 rounded-xl"
                  />
                  {uploadingLogo && (
                    <p className="text-[11px] text-emerald-400 animate-pulse">
                      ☁️ ক্লাউডিনারিতে আপলোড হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।
                    </p>
                  )}
                </div>

                {/* Direct Image URL fallback */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-white/50 uppercase">
                    অথবা সরাসরি ইমেজ URL লিংক পেস্ট করুন:
                  </label>
                  <input
                    type="text"
                    value={config.logoImage || ""}
                    onChange={(e) => setConfig((p) => ({ ...p, logoImage: e.target.value }))}
                    placeholder="https://res.cloudinary.com/.../logo.png"
                    className="w-full bg-black/50 border border-white/15 text-white px-4 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-400 font-mono text-[11px]"
                  />
                </div>

                {/* Logo Height Control Slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">লোগো উচ্চতা (Logo Height):</span>
                    <span className="font-mono text-emerald-400 font-bold">{config.logoHeight || 28}px</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="56"
                    value={config.logoHeight || 28}
                    onChange={(e) => setConfig((p) => ({ ...p, logoHeight: Number(e.target.value) }))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= 3. HOTLINE & WHATSAPP ================= */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h3 className="text-base font-bold text-[#E4E2D7] flex items-center gap-2">
            <span>📞</span> হটলাইন ও হোয়াটসঅ্যাপ কল-আউট (Hotline & WhatsApp)
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            ন্যাভবারের ডানপাশে প্রদর্শিত প্রধান কল ও হোয়াটসঅ্যাপ চ্যাট সেটিংস।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hotline Box */}
          <div className="bg-black/30 p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span>📱</span> প্রাইমারি হটলাইন (Call Hotline)
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={config.hotlineVisible}
                  onChange={(e) => setConfig((p) => ({ ...p, hotlineVisible: e.target.checked }))}
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                <span>প্রদর্শন করুন</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-white/50 font-mono block mb-1">
                  সরাসরি ডায়াল নম্বর (Dialable Format):
                </label>
                <input
                  type="text"
                  value={config.hotlinePhone}
                  onChange={(e) => setConfig((p) => ({ ...p, hotlinePhone: e.target.value }))}
                  placeholder="01883012641"
                  className="w-full bg-black/50 border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 font-mono block mb-1">
                  ডিসপ্লে টেক্সট (বাংলা বা ইংরেজি):
                </label>
                <input
                  type="text"
                  value={config.hotlineDisplay}
                  onChange={(e) => setConfig((p) => ({ ...p, hotlineDisplay: e.target.value }))}
                  placeholder="০১88৩-০১২৬৪১"
                  className="w-full bg-black/50 border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Box */}
          <div className="bg-black/30 p-5 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#25D366] flex items-center gap-2">
                <span>💬</span> হোয়াটসঅ্যাপ বিজনেস চ্যাট
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={config.whatsappVisible}
                  onChange={(e) => setConfig((p) => ({ ...p, whatsappVisible: e.target.checked }))}
                  className="accent-[#25D366] w-4 h-4 rounded"
                />
                <span>প্রদর্শন করুন</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-white/50 font-mono block mb-1">
                  হোয়াটসঅ্যাপ নম্বর (Country code সহ):
                </label>
                <input
                  type="text"
                  value={config.whatsappNumber}
                  onChange={(e) => setConfig((p) => ({ ...p, whatsappNumber: e.target.value }))}
                  placeholder="8801883012641"
                  className="w-full bg-black/50 border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div>
                <label className="text-[10px] text-white/50 font-mono block mb-1">
                  প্রি-ফিল্ড কাস্টমার মেসেজ:
                </label>
                <input
                  type="text"
                  value={config.whatsappMessage}
                  onChange={(e) => setConfig((p) => ({ ...p, whatsappMessage: e.target.value }))}
                  placeholder="Hello A R Green Garden..."
                  className="w-full bg-black/50 border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-[#25D366]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 4. SOCIAL MEDIA LINKS ================= */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#E4E2D7] flex items-center gap-2">
              <span>🌐</span> সোশ্যাল মিডিয়া লিঙ্কস (Social Media)
            </h3>
            <p className="text-xs text-white/50 mt-0.5">ন্যাভবারে সোশ্যাল আইকন লিঙ্কসমূহ।</p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-xs text-white/70">
            <input
              type="checkbox"
              checked={config.socialVisible}
              onChange={(e) => setConfig((p) => ({ ...p, socialVisible: e.target.checked }))}
              className="accent-emerald-500 w-4 h-4 rounded"
            />
            <span>আইকনসমূহ প্রদর্শন করুন</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase block mb-1">Facebook Page</label>
            <input
              type="text"
              value={config.facebookUrl || ""}
              onChange={(e) => setConfig((p) => ({ ...p, facebookUrl: e.target.value }))}
              placeholder="https://facebook.com/argreengarden"
              className="w-full bg-black/50 border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase block mb-1">Instagram</label>
            <input
              type="text"
              value={config.instagramUrl || ""}
              onChange={(e) => setConfig((p) => ({ ...p, instagramUrl: e.target.value }))}
              placeholder="https://instagram.com/argreengarden"
              className="w-full bg-black/50 border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase block mb-1">LinkedIn Profile</label>
            <input
              type="text"
              value={config.linkedinUrl || ""}
              onChange={(e) => setConfig((p) => ({ ...p, linkedinUrl: e.target.value }))}
              placeholder="https://linkedin.com/company/argreengarden"
              className="w-full bg-black/50 border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-white/60 uppercase block mb-1">YouTube Channel</label>
            <input
              type="text"
              value={config.youtubeUrl || ""}
              onChange={(e) => setConfig((p) => ({ ...p, youtubeUrl: e.target.value }))}
              placeholder="https://youtube.com/@argreengarden"
              className="w-full bg-black/50 border border-white/15 text-white px-3.5 py-2 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>
      </div>

      {/* ================= 5. DRAWER NAVIGATION MENU ITEMS ================= */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
          <div>
            <h3 className="text-base font-bold text-[#E4E2D7] flex items-center gap-2">
              <span>📋</span> ড্রয়ার ন্যাভিগেশন মেনু আইটেমস (Menu Items Manager)
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              হ্যামবার্গার মেনুতে ক্লিক করলে যে পেজ লিংকগুলো আসে তা যোগ, এডিট বা লুকান।
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddLink}
            className="px-4 py-2 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>+</span> নতুন মেনু আইটেম যোগ করুন
          </button>
        </div>

        {/* Links Table / List */}
        <div className="space-y-3">
          {config.menuLinks.map((link, index) => (
            <div
              key={link.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                link.isVisible
                  ? "bg-black/40 border-white/10"
                  : "bg-black/20 border-white/5 opacity-50"
              }`}
            >
              {/* Order & Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                <div>
                  <label className="text-[9px] font-mono text-white/40 uppercase block mb-1">
                    বাংলা নাম (Bangla Title):
                  </label>
                  <input
                    type="text"
                    value={link.titleBn}
                    onChange={(e) => handleUpdateLink(link.id, "titleBn", e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-white/40 uppercase block mb-1">
                    ইংরেজি নাম (English Title):
                  </label>
                  <input
                    type="text"
                    value={link.titleEn}
                    onChange={(e) => handleUpdateLink(link.id, "titleEn", e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-white/40 uppercase block mb-1">
                    টার্গেট লিঙ্ক / URL:
                  </label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => handleUpdateLink(link.id, "url", e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono text-white/40 uppercase block mb-1">
                    ব্যাজ / লেবেল (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NEW, HOT"
                    value={link.badge || ""}
                    onChange={(e) => handleUpdateLink(link.id, "badge", e.target.value)}
                    className="w-full bg-black/60 border border-white/10 text-emerald-300 font-mono px-3 py-1.5 rounded-lg text-xs uppercase"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                {/* Visibility Toggle */}
                <button
                  type="button"
                  onClick={() => handleUpdateLink(link.id, "isVisible", !link.isVisible)}
                  className={`p-2 rounded-lg text-xs transition-colors cursor-pointer ${
                    link.isVisible ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/40"
                  }`}
                  title={link.isVisible ? "লিংক সক্রিয় আছে" : "লিংক লুকানো আছে"}
                >
                  {link.isVisible ? "👁️ Show" : "🚫 Hidden"}
                </button>

                {/* Move Up */}
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveLink(index, "up")}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 disabled:opacity-20 cursor-pointer"
                  title="উপরে নিন"
                >
                  ▲
                </button>

                {/* Move Down */}
                <button
                  type="button"
                  disabled={index === config.menuLinks.length - 1}
                  onClick={() => handleMoveLink(index, "down")}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 disabled:opacity-20 cursor-pointer"
                  title="নিচে নিন"
                >
                  ▼
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => handleDeleteLink(link.id)}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                  title="মুছে ফেলুন"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Bottom Floating Action */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "💾 সমস্ত ন্যাভবার সেটিংস সংরক্ষণ করুন"}
        </button>
      </div>
    </div>
  );
}
