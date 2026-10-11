"use client";

import React, { useState } from "react";

interface SettingsTabProps {
  settings?: Record<string, any>;
  settingsSaving?: boolean;
  settingsSuccess?: boolean;
  handleSaveSettings: (e: React.FormEvent) => void;
  handleSettingsChange: (key: string, value: any) => void;
  onOpenNavbarStudio?: () => void;
  onOpenHeroStudio?: () => void;
}

export default function SettingsTab({
  settings = {},
  settingsSaving = false,
  settingsSuccess = false,
  handleSaveSettings,
  handleSettingsChange,
  onOpenNavbarStudio,
  onOpenHeroStudio,
}: SettingsTabProps) {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [testNotification, setTestNotification] = useState<string | null>(null);

  // Settings Sub-Navigation Categories (Facebook Page & Business Suite style)
  const categories = [
    { id: "general", label: "সাধারণ ও পেজ প্রোফাইল", en: "General & Branding", icon: "🏢" },
    { id: "contact", label: "যোগাযোগ ও স্থানাঙ্ক", en: "Contact & Location", icon: "📍" },
    { id: "social", label: "সোশ্যাল ও মেটা লিঙ্কসমূহ", en: "Social & Meta Links", icon: "🌐" },
    { id: "branding", label: "ব্র্যান্ড থিম ও ব্যানার", en: "Theme & Announcement", icon: "🎨" },
    { id: "operations", label: "সার্ভিস ও স্টুডিও অপারেশনস", en: "Operations & Pricing", icon: "🌿" },
    { id: "seo", label: "সার্চ ইঞ্জিন ও মেটা পিক্সেল", en: "SEO & Webmaster", icon: "🔍" },
    { id: "notifications", label: "অটো-নোটিফিকেশন ও অ্যালার্ট", en: "Email & Alerts", icon: "🔔" },
    { id: "backup", label: "ব্যাকআপ ও রিস্টোর স্ন্যাপশট", en: "Data Backup & Sync", icon: "💾" },
  ];

  // Helper for Exporting Settings as JSON File
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ar_green_garden_settings_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTestNotification("📥 সেটিংস ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে!");
    setTimeout(() => setTestNotification(null), 4000);
  };

  // Helper for Importing JSON Settings
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && typeof parsed === "object") {
            Object.keys(parsed).forEach((k) => handleSettingsChange(k, parsed[k]));
            setTestNotification("✓ ব্যাকআপ ফাইল লোড হয়েছে। 'পরিবর্তন সংরক্ষণ করুন' বাটনে ক্লিক করে সেভ করুন।");
            setTimeout(() => setTestNotification(null), 5000);
          }
        } catch (err) {
          alert("ভুল ফাইল ফরম্যাট! দয়া করে সঠিক JSON ফাইল নির্বাচন করুন।");
        }
      };
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      
      {/* 1. TOP FACEBOOK-STYLE PAGE SETTINGS HEADER */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#2B4D33] text-white flex items-center justify-center text-2xl font-bold shadow-xs shrink-0">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-display font-light text-[#121813] tracking-wide uppercase">
                {settings.title || "A R Green Garden"}
              </h2>
              <span className="w-5 h-5 rounded-full bg-[#2B4D33] text-white flex items-center justify-center text-[10px] font-bold" title="Verified Studio Control Hub">
                ✓
              </span>
            </div>
            <p className="text-xs text-[#75787B] font-light mt-0.5">
              ফেসবুক বিজনেস স্যুটের মতো প্রজেক্টের এ-টু-জেড (A to Z) কনফিগারেশন ও লাইভ কন্ট্রোল হাব।
            </p>
          </div>
        </div>

        {/* Quick Save Status & Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl border border-[#D6D2C4] bg-[#F7F6F2] hover:bg-[#E4E2D7] text-[#121813] text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Download JSON Snapshot"
          >
            <span>📥</span>
            <span>ব্যাকআপ</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl border border-[#D6D2C4] bg-white hover:bg-[#F7F6F2] text-[#121813] text-xs font-mono font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>🌐</span>
            <span>লাইভ প্রিভিউ</span>
          </a>
        </div>
      </div>

      {/* Temporary Toast Alert */}
      {(settingsSuccess || testNotification) && (
        <div className="p-4 bg-[#E4E2D7] border border-[#2B4D33]/40 text-[#121813] rounded-2xl text-xs font-semibold animate-fade-in flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2B4D33] animate-ping"></span>
            <span>{testNotification || "✓ গ্লোবাল সেটিংস ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে! পুরো ওয়েবসাইটে পরিবর্তন কার্যকর হয়েছে।"}</span>
          </div>
          <button onClick={() => setTestNotification(null)} className="text-[#75787B] hover:text-[#121813] font-bold">✕</button>
        </div>
      )}

      {/* 2. MAIN SPLIT INTERFACE: LEFT CATEGORIES NAVIGATION + RIGHT FORM PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================= LEFT SUB-NAV (4 OF 12 COLS) ================= */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-3 border border-[#D6D2C4] shadow-2xs sticky top-24">
          <div className="px-3 py-2 border-b border-[#E4E2D7] mb-2">
            <p className="text-[9px] uppercase font-mono font-bold tracking-[0.2em] text-[#75787B]">
              সেটিংস মেন্যু (SETTINGS CATEGORIES)
            </p>
          </div>

          <nav className="flex flex-col gap-1">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl text-xs text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#2B4D33] text-white font-semibold shadow-xs"
                      : "text-[#323232] hover:bg-[#F7F6F2] hover:text-[#121813]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base shrink-0">{cat.icon}</span>
                    <div>
                      <p className="font-bold leading-tight">{cat.label}</p>
                      <p className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-emerald-200" : "text-[#75787B]"}`}>
                        {cat.en}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs ${isSelected ? "text-white" : "text-[#75787B]"}`}>➔</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Studio Shortcuts */}
          <div className="mt-4 pt-3 border-t border-[#E4E2D7] space-y-2">
            {onOpenHeroStudio && (
              <button
                type="button"
                onClick={onOpenHeroStudio}
                className="w-full py-2 px-3 rounded-xl bg-[#F7F6F2] hover:bg-[#E4E2D7] text-[#121813] text-xs font-mono font-medium border border-[#D6D2C4] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>📹 হিরো ভিডিও স্টুডিও</span>
                <span>➔</span>
              </button>
            )}
            {onOpenNavbarStudio && (
              <button
                type="button"
                onClick={onOpenNavbarStudio}
                className="w-full py-2 px-3 rounded-xl bg-[#F7F6F2] hover:bg-[#E4E2D7] text-[#121813] text-xs font-mono font-medium border border-[#D6D2C4] flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>🎨 ন্যাভবার মেনু স্টুডিও</span>
                <span>➔</span>
              </button>
            )}
          </div>
        </div>

        {/* ================= RIGHT MAIN PANEL (8 OF 12 COLS) ================= */}
        <div className="lg:col-span-8">
          <form onSubmit={handleSaveSettings} className="flex flex-col gap-6">

            {/* TAB 1: GENERAL & BRANDING */}
            {activeCategory === "general" && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                    🏢 সাধারণ ও ব্র্যান্ডিং তথ্য (General & Profile Info)
                  </h3>
                  <p className="text-xs text-[#75787B] font-light mt-0.5">
                    আপনার প্রতিষ্ঠানের মূল নাম, ট্যাগলাইন, স্টুডিও স্টোরি ও লোগো লিংক পরিবর্তন করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      প্রতিষ্ঠানের নাম (Studio / Business Name)
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.title || ""}
                      onChange={(e) => handleSettingsChange("title", e.target.value)}
                      placeholder="A R Green Garden"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ক্যাচলাইন বা ট্যাগলাইন (Tagline / Slogan)
                    </label>
                    <input
                      type="text"
                      value={settings.tagline || ""}
                      onChange={(e) => handleSettingsChange("tagline", e.target.value)}
                      placeholder="Landscape Architecture & Biophilic Studio"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>
                </div>

                {/* Logo URL & Live Preview */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    ব্র্যান্ড লোগো ইমেজ ইউআরএল (Logo Image URL)
                  </label>
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={settings.logoImage || ""}
                      onChange={(e) => handleSettingsChange("logoImage", e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="flex-grow bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                    {settings.logoImage && (
                      <div className="w-12 h-10 rounded-xl border border-[#D6D2C4] bg-white p-1 flex items-center justify-center shrink-0">
                        <img src={settings.logoImage} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    স্টুডিও পরিচিতি বা সংক্ষিপ্ত বায়ো (Short Bio / Story)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.bio || ""}
                    onChange={(e) => handleSettingsChange("bio", e.target.value)}
                    placeholder="বাংলাদেশজুড়ে আধুনিক ল্যান্ডস্কেপ আর্কিটেকচার, ছাদ বাগান, বায়োফিলিক ইন্টেরিয়র ও সার্টিফাইড বৃক্ষ চিকিৎসা সেবা প্রদানে আমরা নিবেদিতপ্রাণ।"
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-4 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-[#E4E2D7]">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      প্রতিষ্ঠার সাল (Established Year)
                    </label>
                    <input
                      type="text"
                      value={settings.estYear || "2026"}
                      onChange={(e) => handleSettingsChange("estYear", e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ট্রেড লাইসেন্স বা স্টুডিও কোড (Reg Code)
                    </label>
                    <input
                      type="text"
                      value={settings.licenseCode || "AR-GG-BD-01"}
                      onChange={(e) => handleSettingsChange("licenseCode", e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CONTACT COORDINATES */}
            {activeCategory === "contact" && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                    📍 যোগাযোগ ও স্থানাঙ্ক (Contact Coordinates & Office)
                  </h3>
                  <p className="text-xs text-[#75787B] font-light mt-0.5">
                    ওয়েবসাইট, ফুটার ও ড্রয়ার মেনুতে প্রদর্শিত ফোন, হোয়াটসঅ্যাপ, ইমেইল ও ঠিকানা।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      প্রধান হটলাইন (Primary Phone / Hotline)
                    </label>
                    <input
                      type="text"
                      required
                      value={settings.phone || ""}
                      onChange={(e) => handleSettingsChange("phone", e.target.value)}
                      placeholder="01883012641"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] font-mono font-bold"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      হোয়াটসঅ্যাপ নম্বর (WhatsApp Number)
                    </label>
                    <input
                      type="text"
                      value={settings.whatsapp || "8801883012641"}
                      onChange={(e) => handleSettingsChange("whatsapp", e.target.value)}
                      placeholder="8801883012641"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    হোয়াটসঅ্যাপ স্বয়ংক্রিয় প্রারম্ভিক বার্তা (WhatsApp Greeting)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappMessage || "Hello A R Green Garden, I would like to consult about my garden."}
                    onChange={(e) => handleSettingsChange("whatsappMessage", e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      অফিসিয়াল প্রধান ইমেইল (General Inquiries Email)
                    </label>
                    <input
                      type="email"
                      required
                      value={settings.email || ""}
                      onChange={(e) => handleSettingsChange("email", e.target.value)}
                      placeholder="info@argreengarden.com"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      নতুন প্রজেক্ট ও কমিশন ইমেইল (Projects Email)
                    </label>
                    <input
                      type="email"
                      value={settings.projectEmail || "project@argreengarden.com"}
                      onChange={(e) => handleSettingsChange("projectEmail", e.target.value)}
                      placeholder="project@argreengarden.com"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    স্টুডিও পূর্ণ ঠিকানা (Official Address)
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.address || ""}
                    onChange={(e) => handleSettingsChange("address", e.target.value)}
                    placeholder="৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ"
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    গুগল ম্যাপস এমবেড ইউআরএল (Google Maps Embed Link)
                  </label>
                  <input
                    type="text"
                    value={settings.googleMapUrl || ""}
                    onChange={(e) => handleSettingsChange("googleMapUrl", e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] font-mono"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: SOCIAL & META INTEGRATIONS */}
            {activeCategory === "social" && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                    🌐 সোশ্যাল মিডিয়া ও মেটা লিঙ্কসমূহ (Social Profiles)
                  </h3>
                  <p className="text-xs text-[#75787B] font-light mt-0.5">
                    ফুটার, ড্রয়ার ও শেয়ার বাটনে আপনার ফেসবুক, ইনস্টাগ্রাম, ইউটিউব ও লিঙ্কডইন প্রোফাইল যুক্ত করুন।
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold flex items-center justify-between">
                      <span>অফিসিয়াল ফেসবুক পেজ (Facebook Page URL)</span>
                      {settings.fbPage && (
                        <a href={settings.fbPage} target="_blank" rel="noreferrer" className="text-[#2B4D33] hover:underline">
                          পেজ ভিজিট করুন ➔
                        </a>
                      )}
                    </label>
                    <input
                      type="url"
                      value={settings.fbPage || ""}
                      onChange={(e) => handleSettingsChange("fbPage", e.target.value)}
                      placeholder="https://facebook.com/argreengarden"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ইনস্টাগ্রাম প্রোফাইল (Instagram URL)
                    </label>
                    <input
                      type="url"
                      value={settings.instagram || ""}
                      onChange={(e) => handleSettingsChange("instagram", e.target.value)}
                      placeholder="https://instagram.com/argreengarden"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ইউটিউব চ্যানেল (YouTube Channel URL)
                    </label>
                    <input
                      type="url"
                      value={settings.youtube || ""}
                      onChange={(e) => handleSettingsChange("youtube", e.target.value)}
                      placeholder="https://youtube.com/@argreengarden"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      লিঙ্কডইন কোম্পানি পেজ (LinkedIn URL)
                    </label>
                    <input
                      type="url"
                      value={settings.linkedin || ""}
                      onChange={(e) => handleSettingsChange("linkedin", e.target.value)}
                      placeholder="https://linkedin.com/company/argreengarden"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: THEME & ANNOUNCEMENT */}
            {activeCategory === "branding" && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                    🎨 থিম কালার ও টপ অ্যানাউন্সমেন্ট ব্যানার (Theme & Notice)
                  </h3>
                  <p className="text-xs text-[#75787B] font-light mt-0.5">
                    ওয়েবসাইটের প্রাইমারি কালার স্কিম এবং সাইটের একদম উপরে নোটিশ ব্যানার পরিচালনা করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      প্রাইমারি আর্কিটেকচারাল কালার (Theme Hex)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.themeColor || "#2B4D33"}
                        onChange={(e) => handleSettingsChange("themeColor", e.target.value)}
                        className="w-12 h-10 rounded-xl cursor-pointer border border-[#D6D2C4] p-1 bg-white"
                      />
                      <input
                        type="text"
                        value={settings.themeColor || "#2B4D33"}
                        onChange={(e) => handleSettingsChange("themeColor", e.target.value)}
                        className="w-32 bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#121813]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      সেকেন্ডারি অ্যাকসেন্ট কালার (Secondary Accent)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={settings.secondaryColor || "#DAB200"}
                        onChange={(e) => handleSettingsChange("secondaryColor", e.target.value)}
                        className="w-12 h-10 rounded-xl cursor-pointer border border-[#D6D2C4] p-1 bg-white"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor || "#DAB200"}
                        onChange={(e) => handleSettingsChange("secondaryColor", e.target.value)}
                        className="w-32 bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#121813]"
                      />
                    </div>
                  </div>
                </div>

                {/* Top Announcement Bar Toggle */}
                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#D6D2C4] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#121813]">টপ নোটিশ ব্যানার (Announcement Bar)</p>
                      <p className="text-[10px] text-[#75787B]">হোমপেজের একদম উপরে জরুরি নোটিশ বা ছাড়ের অফার প্রদর্শন করুন।</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(settings.enableAnnouncement)}
                        onChange={(e) => handleSettingsChange("enableAnnouncement", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2B4D33]"></div>
                    </label>
                  </div>

                  {settings.enableAnnouncement && (
                    <div className="space-y-3 pt-2">
                      <input
                        type="text"
                        value={settings.announcementText || ""}
                        onChange={(e) => handleSettingsChange("announcementText", e.target.value)}
                        placeholder="🌿 এই মৌসুমে ছাদবাগান বুকিংয়ে ১০% আর্কিটেকচারাল কনসাল্টেশন ছাড়!"
                        className="w-full bg-white border border-[#D6D2C4] rounded-xl px-4 py-2 text-xs text-[#121813]"
                      />
                      <input
                        type="text"
                        value={settings.announcementLink || ""}
                        onChange={(e) => handleSettingsChange("announcementLink", e.target.value)}
                        placeholder="বাটন লিংক: /design-garden"
                        className="w-full bg-white border border-[#D6D2C4] rounded-xl px-4 py-2 text-xs text-[#121813] font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: OPERATIONS & PRICING */}
            {activeCategory === "operations" && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                    🌿 সার্ভিস ও স্টুডিও অপারেশনস (Operations & Pricing)
                  </h3>
                  <p className="text-xs text-[#75787B] font-light mt-0.5">
                    ইমার্জেন্সি বৃক্ষ চিকিৎসক সেবা টগল, কোটেশন বেস রেট ও স্লট লিমিট নিয়ন্ত্রণ করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      কারেন্সি সিম্বল (Currency)
                    </label>
                    <input
                      type="text"
                      value={settings.currencySymbol || "৳"}
                      onChange={(e) => handleSettingsChange("currencySymbol", e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] font-mono font-bold text-center"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ছাদবাগান বেস রেট (৳ / SqFt)
                    </label>
                    <input
                      type="number"
                      value={settings.baseCostPerSqft || 280}
                      onChange={(e) => handleSettingsChange("baseCostPerSqft", Number(e.target.value))}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] font-mono font-bold text-center"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      অনসাইট ভিজিট ফি (Consultation Fee)
                    </label>
                    <input
                      type="text"
                      value={settings.consultationFee || "১,৫০০"}
                      onChange={(e) => handleSettingsChange("consultationFee", e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813] font-mono font-bold text-center"
                    />
                  </div>
                </div>

                {/* Operations Toggles */}
                <div className="space-y-3 pt-3 border-t border-[#E4E2D7]">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F6F2] border border-[#D6D2C4]">
                    <div>
                      <p className="text-xs font-bold text-[#121813]">২৪/৭ ইমার্জেন্সি ট্রি ডক্টর সেবা সক্রিয় (Emergency Hotline Active)</p>
                      <p className="text-[10px] text-[#75787B]">হোমপেজের ফ্লোটিং ট্রি ডক্টর বাটন এবং ইমার্জেন্সি মডেল সক্রিয় রাখবে।</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emergencyDoctorActive !== false}
                      onChange={(e) => handleSettingsChange("emergencyDoctorActive", e.target.checked)}
                      className="w-5 h-5 accent-[#2B4D33] cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F6F2] border border-[#D6D2C4]">
                    <div>
                      <p className="text-xs font-bold text-[#121813]">অনলাইন বুকিং স্লট উন্মুক্ত (Booking System Open)</p>
                      <p className="text-[10px] text-[#75787B]">গ্রাহকরা নতুন সাইট অডিট ও বুকিং আবেদন করতে পারবে।</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.bookingActive !== false}
                      onChange={(e) => handleSettingsChange("bookingActive", e.target.checked)}
                      className="w-5 h-5 accent-[#2B4D33] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: SEO & WEBMASTER */}
            {activeCategory === "seo" && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                    🔍 সার্চ ইঞ্জিন অপ্টিমাইজেশন ও ট্র্যাকিং (SEO & Pixel)
                  </h3>
                  <p className="text-xs text-[#75787B] font-light mt-0.5">
                    গুগল সার্চ স্ন্যাপশট, সোশ্যাল মিডিয়া শেয়ার প্রিভিউ এবং ফেসবুক পিক্সেল আইডি।
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ডিফল্ট মেটা টাইটেল (Default SEO Title Tag)
                    </label>
                    <input
                      type="text"
                      value={settings.seoTitleDefault || ""}
                      onChange={(e) => handleSettingsChange("seoTitleDefault", e.target.value)}
                      placeholder="A R Green Garden - Landscape Architecture & Biophilic Studio"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      মেটা ডেসক্রিপশন (SEO Meta Description)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.seoDescription || ""}
                      onChange={(e) => handleSettingsChange("seoDescription", e.target.value)}
                      placeholder="বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার, ছাদ বাগান ও বৃক্ষ চিকিৎসা সেবা।"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-4 text-xs text-[#121813] resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      টার্গেট কি-ওয়ার্ডস (SEO Keywords)
                    </label>
                    <input
                      type="text"
                      value={settings.seoKeywords || ""}
                      onChange={(e) => handleSettingsChange("seoKeywords", e.target.value)}
                      placeholder="ল্যান্ডস্কেপ ডিজাইন, ছাদবাগান, rooftop garden dhaka, tree doctor bangladesh"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                        ফেসবুক মেটা পিক্সেল আইডি (Meta Pixel ID)
                      </label>
                      <input
                        type="text"
                        value={settings.fbPixelId || ""}
                        onChange={(e) => handleSettingsChange("fbPixelId", e.target.value)}
                        placeholder="e.g. 123456789012345"
                        className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs font-mono text-[#121813]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                        গুগল অ্যানালিটিক্স মেজারমেন্ট আইডি (GA4 ID)
                      </label>
                      <input
                        type="text"
                        value={settings.googleAnalyticsId || ""}
                        onChange={(e) => handleSettingsChange("googleAnalyticsId", e.target.value)}
                        placeholder="e.g. G-XXXXXXXXXX"
                        className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs font-mono text-[#121813]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: NOTIFICATIONS */}
            {activeCategory === "notifications" && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                    🔔 স্বয়ংক্রিয় নোটিফিকেশন ও অ্যালার্ট (Email & Alerts)
                  </h3>
                  <p className="text-xs text-[#75787B] font-light mt-0.5">
                    ক্লায়েন্ট মেসেজ পাঠালে বা বুকিং করলে কোন ইমেইলে অ্যালার্ট যাবে এবং অটো-রেসপন্স টেমপ্লেট।
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      অ্যাডমিন অ্যালার্ট প্রাপক ইমেইল (Admin Alert Email)
                    </label>
                    <input
                      type="email"
                      value={settings.adminNotificationEmail || ""}
                      onChange={(e) => handleSettingsChange("adminNotificationEmail", e.target.value)}
                      placeholder="admin@argreengarden.com"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-4 py-2.5 text-xs text-[#121813]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      বুকিং নিশ্চিতকরণ ক্লায়েন্ট ইমেইল টেমপ্লেট (HTML)
                    </label>
                    <textarea
                      rows={3}
                      value={settings.emailBookingTemplate || "<h3>Dear {{name}},</h3><p>Your garden audit booking for <b>{{service}}</b> has been received and confirmed!</p>"}
                      onChange={(e) => handleSettingsChange("emailBookingTemplate", e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-3 text-xs font-mono text-[#121813]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      কন্টাক্ট মেসেজ অটো-রেসপন্স বার্তা (Auto Reply)
                    </label>
                    <textarea
                      rows={2}
                      value={settings.emailContactTemplate || "ধন্যবাদ! আমরা আপনার বার্তাটি পেয়েছি, খুব শীঘ্রই আমাদের ল্যান্ডস্কেপ আর্কিটেক্ট আপনার সাথে যোগাযোগ করবেন।"}
                      onChange={(e) => handleSettingsChange("emailContactTemplate", e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-3 text-xs text-[#121813]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: BACKUP & DATA SYNC */}
            {activeCategory === "backup" && (
              <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs space-y-6">
                <div>
                  <h3 className="font-display font-light text-lg text-[#121813] tracking-wide uppercase">
                    💾 ডাটাবেজ ব্যাকআপ ও রিস্টোর স্ন্যাপশট (Backup & Recovery)
                  </h3>
                  <p className="text-xs text-[#75787B] font-light mt-0.5">
                    এক ক্লিকে আপনার সমস্ত কনফিগারেশন এক্সপোর্ট করে সুরক্ষিত রাখুন অথবা পুরনো ব্যাকআপ রিস্টোর করুন।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Export Box */}
                  <div className="p-5 rounded-xl bg-[#F7F6F2] border border-[#D6D2C4] flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#121813]">📥 সেটিংস ব্যাকআপ ডাউনলোড</p>
                      <p className="text-xs text-[#75787B] mt-1">আপনার সমস্ত সেটিংস একটি নিরাপদ JSON ফাইল হিসেবে আপনার ডিভাইসে সংরক্ষণ করুন।</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="w-full py-2.5 px-4 bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      ডাউনলোড করুন (Export JSON)
                    </button>
                  </div>

                  {/* Import Box */}
                  <div className="p-5 rounded-xl bg-[#F7F6F2] border border-[#D6D2C4] flex flex-col justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#121813]">📤 ব্যাকআপ ফাইল রিস্টোর</p>
                      <p className="text-xs text-[#75787B] mt-1">পূর্বে ডাউনলোড করা যেকোনো JSON ব্যাকআপ আপলোড করে সমস্ত সেটিংস তাৎক্ষণিক পুনরুদ্ধার করুন।</p>
                    </div>
                    <label className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 border border-[#D6D2C4] text-[#121813] text-xs font-mono font-bold rounded-xl transition-all cursor-pointer shadow-xs text-center block">
                      <span>ফাইল নির্বাচন করুন (Import JSON)</span>
                      <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 3. STICKY / FLOATING SAVE TOOLBAR (Facebook Style) */}
            <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#D6D2C4] shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2B4D33] animate-pulse"></span>
                <span className="text-xs font-mono text-[#75787B]">
                  {settingsSaving ? "ডাটাবেজে সেভ হচ্ছে..." : "সমস্ত পরিবর্তন লাইভ কার্যকর হতে প্রস্তুত"}
                </span>
              </div>

              <button
                type="submit"
                disabled={settingsSaving}
                className="bg-[#2B4D33] hover:bg-[#1E3724] text-white font-bold font-mono text-xs py-3 px-6 sm:px-8 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 shrink-0 active:scale-95"
              >
                <span>💾</span>
                <span>{settingsSaving ? "সেভ হচ্ছে..." : "পরিবর্তন সংরক্ষণ করুন (Save All Settings)"}</span>
              </button>
            </div>

          </form>
        </div>

      </div>

    </div>
  );
}
