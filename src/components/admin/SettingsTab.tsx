"use client";

import React, { useState } from "react";

interface SettingsTabProps {
  settings?: Record<string, any>;
  settingsSaving?: boolean;
  settingsSuccess?: boolean;
  handleSaveSettings: (e: React.FormEvent) => void;
  handleSettingsChange: (key: string, value: any) => void;
  onOpenNavbarStudio?: () => void;
}

export default function SettingsTab({
  settings = {},
  settingsSaving = false,
  settingsSuccess = false,
  handleSaveSettings,
  handleSettingsChange,
  onOpenNavbarStudio,
}: SettingsTabProps) {
  const [showEmailConfig, setShowEmailConfig] = useState(false);

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl text-[#E4E2D7] flex flex-col gap-6 animate-fade-in-up">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
          ⚙️ Studio Configuration
        </div>
        <h3 className="font-sans font-bold text-xl text-[#E4E2D7]">সিস্টেম ও স্টুডিও কনফিগারেশন</h3>
        <p className="text-xs text-white/50 mt-1">অফিসিয়াল যোগাযোগ নম্বর, ঠিকানা, ব্র্যান্ড কালার কোড, SEO মেটা ট্যাগ এবং অটোমেটেড ইমেইল টেমপ্লেট পরিচালনা করুন।</p>
      </div>

      {/* QUICK LINK TO FULL NAVBAR STUDIO */}
      {onOpenNavbarStudio && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-emerald-900/40 to-black/50 border border-emerald-500/30 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0">
              🎨
            </div>
            <div>
              <p className="text-xs font-bold text-white">হেডার ও ন্যাভবার ম্যানেজমেন্ট সেন্টার (Live Navbar Studio)</p>
              <p className="text-[11px] text-white/50">লোগো ইমেজ আপলোড, হটলাইন, হোয়াটসঅ্যাপ ও ড্রয়ার মেনু লিঙ্কসমূহ কাস্টমাইজ করুন।</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenNavbarStudio}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow"
          >
            <span>🚀 Open Full Navbar Studio</span>
          </button>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-6 max-w-3xl">
        {settingsSuccess && (
          <div className="bg-emerald-500/15 text-emerald-400 text-xs font-bold p-4 rounded-2xl border border-emerald-500/30 flex items-center gap-2">
            <span>✓</span>
            <span>গ্লোবাল কনফিগারেশন সফলভাবে আপডেট করা হয়েছে!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">প্রতিষ্ঠানের নাম (Business Name)</label>
            <input 
              type="text" 
              required
              value={settings.title || ""}
              onChange={(e) => handleSettingsChange("title", e.target.value)}
              className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">প্রধান হেল্পলাইন (Primary Phone)</label>
            <input 
              type="text" 
              required
              value={settings.phone || ""}
              onChange={(e) => handleSettingsChange("phone", e.target.value)}
              className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">বিজনেস ইমেইল (Business Email)</label>
            <input 
              type="email" 
              required
              value={settings.email || ""}
              onChange={(e) => handleSettingsChange("email", e.target.value)}
              className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">হেড অফিস ঠিকানা (Office Address)</label>
            <input 
              type="text" 
              required
              value={settings.address || ""}
              onChange={(e) => handleSettingsChange("address", e.target.value)}
              className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">ব্র্যান্ড কালার কোড (Theme Hex)</label>
            <input 
              type="text" 
              required
              value={settings.themeColor || "#8fc63f"}
              onChange={(e) => handleSettingsChange("themeColor", e.target.value)}
              className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors font-mono text-center"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">অফিসিয়াল ফেসবুক পেজ (FB Page Link)</label>
            <input 
              type="text" 
              value={settings.fbPage || ""}
              placeholder="https://facebook.com/argreengarden"
              onChange={(e) => handleSettingsChange("fbPage", e.target.value)}
              className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
            />
          </div>
        </div>

        {/* SEO configs */}
        <div className="bg-black/30 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
            🔍 সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO Tags)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider font-mono">টার্গেট কি-ওয়ার্ডস (SEO Keywords)</label>
              <input 
                type="text" 
                value={settings.seoKeywords || ""}
                placeholder="ল্যান্ডস্কেপ ডিজাইন, ছাদবাগান, গার্ডেনিং বিডি, rooftop garden dhaka"
                onChange={(e) => handleSettingsChange("seoKeywords", e.target.value)}
                className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider font-mono">ডিফল্ট পেজ টাইটেল (SEO Title Tag)</label>
              <input 
                type="text" 
                value={settings.seoTitleDefault || ""}
                placeholder="AR Green Garden - প্রিমিয়াম ল্যান্ডস্কেপ ও ছাদবাগান ডিজাইন আর্কিটেকচার"
                onChange={(e) => handleSettingsChange("seoTitleDefault", e.target.value)}
                className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider font-mono">মেটা ডেসক্রিপশন (SEO Meta Description)</label>
            <textarea 
              rows={2}
              value={settings.seoDescription || ""}
              placeholder="এ আর গ্রিন গার্ডেন - বাংলাদেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেকচার ও ছাদবাগান বাস্তবায়ন স্টুডিও।"
              onChange={(e) => handleSettingsChange("seoDescription", e.target.value)}
              className="bg-black/50 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-400 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Transactional Email templates collapsible */}
        <div className="border-t border-white/10 pt-4">
          <button 
            type="button" 
            onClick={() => setShowEmailConfig(!showEmailConfig)} 
            className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-all"
          >
            <span>{showEmailConfig ? "▼ বন্ধ করুন" : "▶ দেখুন ও পরিবর্তন করুন"}</span>
            <span>স্বয়ংক্রিয় ইমেইল নোটিফিকেশন টেমপ্লেট (HTML)</span>
          </button>
          
          {showEmailConfig && (
            <div className="flex flex-col gap-4 mt-4 p-5 bg-black/40 rounded-2xl border border-white/10 animate-fade-in-up">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">বুকিং নিশ্চিতকরণ ইমেইল টেমপ্লেট (Booking Email HTML)</label>
                <textarea 
                  rows={3}
                  value={settings.emailBookingTemplate || "<h3>Dear {{name}},</h3><p>Your garden audit booking for <b>{{service}}</b> has been confirmed! Assigned Expert: <b>{{expert}}</b>.</p>"}
                  onChange={(e) => handleSettingsChange("emailBookingTemplate", e.target.value)}
                  className="bg-black/60 border border-white/15 text-emerald-300 font-mono p-3 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">কন্টাক্ট মেসেজ অটো-রেসপন্স টেমপ্লেট (Inquiry Response HTML)</label>
                <textarea 
                  rows={3}
                  value={settings.emailContactTemplate || "<h3>Hello {{name}},</h3><p>Thank you for reaching out to AR Green Garden. We have received your inquiry: <i>\"{{message}}\"</i>. Our support staff will contact you shortly.</p>"}
                  onChange={(e) => handleSettingsChange("emailContactTemplate", e.target.value)}
                  className="bg-black/60 border border-white/15 text-emerald-300 font-mono p-3 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={settingsSaving}
          className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-3 px-8 rounded-xl transition-all cursor-pointer w-fit shadow-lg shadow-emerald-500/20 mt-2 flex items-center gap-2"
        >
          <span>💾</span>
          <span>{settingsSaving ? "সেভ হচ্ছে..." : "কনফিগারেশন সংরক্ষণ করুন"}</span>
        </button>
      </form>
    </div>
  );
}
