"use client";

import React, { useState } from "react";

export default function SettingsTab({
  settings = {},
  settingsSaving,
  settingsSuccess,
  handleSaveSettings,
  handleSettingsChange
}) {
  const [showEmailConfig, setShowEmailConfig] = useState(false);

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-sans font-bold text-lg text-[#06120c]">System Settings</h3>
        <p className="text-xs text-slate-400 mt-0.5">Modify default telephone numbers, office addresses, theme color codes, SEO tags, and transactional email templates.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 max-w-2xl">
        {settingsSuccess && (
          <div className="bg-emerald-50 text-emerald-600 text-xs font-bold p-4 rounded-xl border border-emerald-100">
            ✓ Global configurations published successfully!
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Name</label>
            <input 
              type="text" 
              required
              value={settings.title || ""}
              onChange={(e) => handleSettingsChange("title", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#06120c]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Phone</label>
            <input 
              type="text" 
              required
              value={settings.phone || ""}
              onChange={(e) => handleSettingsChange("phone", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#06120c]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Business Email</label>
            <input 
              type="email" 
              required
              value={settings.email || ""}
              onChange={(e) => handleSettingsChange("email", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#06120c]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Office Address</label>
            <input 
              type="text" 
              required
              value={settings.address || ""}
              onChange={(e) => handleSettingsChange("address", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#06120c]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Theme Color Code</label>
            <input 
              type="text" 
              required
              value={settings.themeColor || ""}
              onChange={(e) => handleSettingsChange("themeColor", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#06120c] font-mono text-center"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facebook Page Link</label>
            <input 
              type="text" 
              value={settings.fbPage || ""}
              onChange={(e) => handleSettingsChange("fbPage", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#06120c]"
            />
          </div>
        </div>

        {/* SEO configs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Target Keywords</label>
            <input 
              type="text" 
              value={settings.seoKeywords || ""}
              placeholder="landscaping, garden design, rooftop garden"
              onChange={(e) => handleSettingsChange("seoKeywords", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#06120c]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Title Tag Default</label>
            <input 
              type="text" 
              value={settings.seoTitleDefault || ""}
              placeholder="AR Green Garden - Premium Landscaping Services"
              onChange={(e) => handleSettingsChange("seoTitleDefault", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Meta Description</label>
          <textarea 
            rows={2}
            value={settings.seoDescription || ""}
            onChange={(e) => handleSettingsChange("seoDescription", e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#06120c] resize-none"
          />
        </div>

        {/* Transactional Email templates collapsible */}
        <div className="border-t border-slate-200 pt-3">
          <button 
            type="button" 
            onClick={() => setShowEmailConfig(!showEmailConfig)} 
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <span>{showEmailConfig ? "▼ Hide" : "▶ Show"} Transactional Email Templates Config</span>
          </button>
          
          {showEmailConfig && (
            <div className="flex flex-col gap-4 mt-3 animate-fade-in-up">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booking Confirmation Email Template (HTML)</label>
                <textarea 
                  rows={3}
                  value={settings.emailBookingTemplate || "<h3>Dear {{name}},</h3><p>Your garden audit booking for <b>{{service}}</b> has been confirmed! Assigned Expert: <b>{{expert}}</b>.</p>"}
                  onChange={(e) => handleSettingsChange("emailBookingTemplate", e.target.value)}
                  className="bg-white border border-slate-200 text-slate-800 font-mono p-3 rounded-xl text-[10px]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Form Inquiry Auto-Response Template (HTML)</label>
                <textarea 
                  rows={3}
                  value={settings.emailContactTemplate || "<h3>Hello {{name}},</h3><p>Thank you for reaching out to AR Green Garden. We have received your inquiry: <i>\"{{message}}\"</i>. Our support staff will contact you shortly.</p>"}
                  onChange={(e) => handleSettingsChange("emailContactTemplate", e.target.value)}
                  className="bg-white border border-slate-200 text-slate-800 font-mono p-3 rounded-xl text-[10px]"
                />
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={settingsSaving}
          className="bg-[#06120c] hover:bg-black text-[#8fc63f] font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer w-fit shadow-md mt-2"
        >
          {settingsSaving ? "Saving Configs..." : "Publish Config Settings"}
        </button>
      </form>
    </div>
  );
}
