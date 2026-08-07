"use client";

import React from "react";

export default function SettingsTab({
  settings = {},
  settingsSaving,
  settingsSuccess,
  handleSaveSettings,
  handleSettingsChange
}) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-serif font-bold text-lg text-[#0c1911]">Settings (Global Configurations)</h3>
        <p className="text-xs text-slate-400 mt-0.5">Modify default telephone numbers, office addresses, theme color codes, and SEO metadata tags.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="flex flex-col gap-5 max-w-xl">
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
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#0c1911]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Phone</label>
            <input 
              type="text" 
              required
              value={settings.phone || ""}
              onChange={(e) => handleSettingsChange("phone", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#0c1911]"
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
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#0c1911]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Office Address</label>
            <input 
              type="text" 
              required
              value={settings.address || ""}
              onChange={(e) => handleSettingsChange("address", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#0c1911]"
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
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#0c1911] font-mono text-center"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Facebook Page Link</label>
            <input 
              type="text" 
              value={settings.fbPage || ""}
              onChange={(e) => handleSettingsChange("fbPage", e.target.value)}
              className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#0c1911]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SEO Description</label>
          <textarea 
            rows={2}
            value={settings.seoDescription || ""}
            onChange={(e) => handleSettingsChange("seoDescription", e.target.value)}
            className="bg-white border border-slate-200 text-slate-800 py-2.5 px-4 rounded-xl text-xs focus:outline-none focus:border-[#0c1911] resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={settingsSaving}
          className="bg-[#0c1911] hover:bg-black text-[#8ac343] font-bold text-xs py-3 px-6 rounded-xl transition-all cursor-pointer w-fit shadow-md"
        >
          {settingsSaving ? "Saving Configs..." : "Publish Config Settings"}
        </button>
      </form>
    </div>
  );
}
