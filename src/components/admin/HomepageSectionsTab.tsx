"use client";

import React, { useState, useEffect } from "react";
import SortableList, { DragHandle } from "@/components/shared/SortableList";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import { StandaloneToast } from "@/components/shared/Toast";

interface HomeSection {
  id: string;
  label: string;
  visible: boolean;
  order: number;
  width?: "full" | "contained" | "compact";
  columns?: 1 | 2 | 3 | 4;
  padding?: "none" | "small" | "normal" | "large";
}

interface HomepageConfig {
  sections: HomeSection[];
  manifesto: { lineEn: string; lineBn: string };
  process: {
    titleEn: string;
    titleBn: string;
    steps: { iconEn: string; titleEn: string; titleBn: string; descEn: string; descBn: string }[];
  };
  campaign: { textEn: string; textBn: string };
  whyUs?: {
    titleEn: string;
    titleBn: string;
    points: { iconEn: string; titleEn: string; titleBn: string; descEn: string; descBn: string }[];
  };
  studioLife?: {
    titleEn: string;
    titleBn: string;
    image: string;
    paragraph1Bn: string;
    paragraph2Bn: string;
    paragraph1En: string;
    paragraph2En: string;
  };
}

const DEFAULT_CONFIG: HomepageConfig = {
  sections: [
    { id: "hero", label: "🎥 Hero Video", visible: true, order: 1, width: "full", columns: 1, padding: "none" },
    { id: "manifesto", label: "✨ Animated Manifesto", visible: true, order: 2, width: "contained", columns: 1, padding: "normal" },
    { id: "projects", label: "🏗️ Highlight Projects", visible: true, order: 3, width: "contained", columns: 3, padding: "normal" },
    { id: "services", label: "🌿 Services Flip Cards", visible: true, order: 4, width: "contained", columns: 3, padding: "normal" },
    { id: "process", label: "📐 Our Process", visible: true, order: 5, width: "contained", columns: 4, padding: "normal" },
    { id: "campaign", label: "📣 Campaign Banner", visible: true, order: 6, width: "full", columns: 1, padding: "small" },
    { id: "activities", label: "📸 Recent Activities", visible: true, order: 7, width: "contained", columns: 3, padding: "normal" },
    { id: "life", label: "🌱 Studio Life", visible: true, order: 8, width: "contained", columns: 2, padding: "normal" },
  ],
  manifesto: {
    lineEn: "ENABLE CHANGE FOR A BETTER EARTH",
    lineBn: "একটি সুন্দর পৃথিবীর জন্য পরিবর্তন আনুন",
  },
  process: {
    titleEn: "A Thoughtful Journey to Transformative Solutions",
    titleBn: "রূপান্তরমূলক সমাধানের দিকে একটি সুচিন্তিত যাত্রা",
    steps: [
      { iconEn: "💬", titleEn: "Consultation", titleBn: "পরামর্শ", descEn: "Free site visit & discussion", descBn: "বিনামূল্যে সাইট ভিজিট ও আলোচনা" },
      { iconEn: "📐", titleEn: "Design", titleBn: "ডিজাইন", descEn: "Custom 3D concept design", descBn: "কাস্টম ৩ডি কনসেপ্ট ডিজাইন" },
      { iconEn: "🌿", titleEn: "Implementation", titleBn: "বাস্তবায়ন", descEn: "Expert team execution", descBn: "দক্ষ দলের বাস্তবায়ন" },
      { iconEn: "🔧", titleEn: "Maintenance", titleBn: "রক্ষণাবেক্ষণ", descEn: "Ongoing care & support", descBn: "নিয়মিত পরিচর্যা ও সহায়তা" },
    ],
  },
  campaign: {
    textEn: "A R GREEN GARDEN — 10TH ANNIVERSARY — Participating in the Future",
    textBn: "এ আর গ্রিন গার্ডেন — ১০ম বার্ষিকী — ভবিষ্যতের সাথে অংশীদারিত্ব",
  },
  studioLife: {
    titleEn: "Studio Life & Culture",
    titleBn: "স্টুডিও লাইফ ও কালচার",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/Banner-Website-Shma-19th_Artboard-1_01-1.jpg",
    paragraph1Bn: "ঢাকার প্রাণকেন্দ্র ধানমন্ডিতে অবস্থিত এ আর গ্রিন গার্ডেনের স্টুডিও ক্যাম্পাস। এখানে নবীন ও অভিজ্ঞ ল্যান্ডস্কেপ আর্কিটেক্ট, আরবারিস্ট এবং সিভিল ইঞ্জিনিয়াররা মিলেমিশে গড়ে তুলেছেন এক উন্মুক্ত উদ্ভাবনী পরিবেশ।",
    paragraph2Bn: "আমাদের স্টুডিও কেবল গতানুগতিক কাজের জায়গা নয়, বরং এটি ধানমন্ডির বুকে এক জীবন্ত সবুজ গবেষণাগার।",
    paragraph1En: "Located in the heart of Dhanmondi, the A R Green Garden studio is an open collaborative space where landscape architects, arborists, and civil engineers unite around climate-resilient design.",
    paragraph2En: "Beyond a traditional architectural studio, our campus serves as a biophilic learning laboratory."
  }
};

export default function HomepageSectionsTab() {
  const [config, setConfig] = useState<HomepageConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [activeTab, setActiveTab] = useState<"sections" | "manifesto" | "process" | "campaign" | "studioLife">("sections");

  useEffect(() => { fetchConfig(); }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/settings?key=homepage_sections&_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data?.value) {
          setConfig((prev) => ({ ...DEFAULT_CONFIG, ...data.value }));
        }
      }
    } catch (e) {
      console.warn("Fallback to defaults");
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "homepage_sections", value: config }),
      });
      if (res.ok) {
        setToast("✅ হোমপেজ কনফিগারেশন সেভ হয়েছে!");
        // Dispatch live update event
        window.dispatchEvent(new CustomEvent("homepage-config-updated", { detail: config }));
      } else {
        setToast("❌ সেভ করতে সমস্যা হয়েছে।");
      }
    } catch {
      setToast("❌ নেটওয়ার্ক এরর।");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 4000);
    }
  };

  const toggleSection = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => s.id === id ? { ...s, visible: !s.visible } : s),
    }));
  };

  const reorderSections = (newSections: HomeSection[]) => {
    setConfig((prev) => ({
      ...prev,
      sections: newSections.map((s, i) => ({ ...s, order: i + 1 })),
    }));
  };

  const updateSectionSize = (id: string, width: "full" | "contained" | "compact") => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, width } : s)),
    }));
  };

  const updateSectionColumns = (id: string, columns: 1 | 2 | 3 | 4) => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, columns } : s)),
    }));
  };

  const updateSectionPadding = (id: string, padding: "none" | "small" | "normal" | "large") => {
    setConfig((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, padding } : s)),
    }));
  };

  const updateProcessStep = (index: number, field: string, value: string) => {
    setConfig((prev) => ({
      ...prev,
      process: {
        ...prev.process,
        steps: prev.process.steps.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
      },
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-gray-500">লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-2xl">🏠</div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">হোমপেজ সেকশন ও সাইজ কন্ট্রোলার</h2>
            <p className="text-sm text-gray-500">ড্র্যাগ করে ক্রম সাজান · ইচ্ছামতো সাইজ ও গ্রিড কলাম পরিবর্তন করুন</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer shadow-md"
        >
          {saving ? (
            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />সেভ হচ্ছে...</>
          ) : "💾 সেভ করুন"}
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "sections", label: "📋 Section Order & Dynamic Sizes" },
          { key: "manifesto", label: "✨ Manifesto Text" },
          { key: "process", label: "📐 Process Steps" },
          { key: "campaign", label: "📣 Campaign Banner" },
          { key: "studioLife", label: "🌱 Studio Life & Culture" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-600 hover:border-emerald-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Section Order & Sizing Tab ── */}
      {activeTab === "sections" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-700 mb-0.5">সেকশন ক্রম, উইডথ ও গ্রিড সাইজিং কন্ট্রোল</h3>
              <p className="text-xs text-gray-400">ড্র্যাগ করে সাজান · প্রতিটি সেকশনের সাইজ ও কলাম ইচ্ছামতো কাস্টমাইজ করুন</p>
            </div>
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
              ৮টি সেকশন অ্যাক্টিভ
            </span>
          </div>

          <SortableList
            items={config.sections.map((s) => ({ ...s }))}
            onReorder={reorderSections}
            renderItem={(item, dragHandleProps, isDragging) => (
              <div className={`flex flex-col md:flex-row md:items-center gap-4 p-4 bg-gray-50 rounded-2xl border transition-all ${isDragging ? "border-emerald-400 shadow-lg bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}>
                <div className="flex items-center gap-3 flex-1">
                  <DragHandle dragHandleProps={dragHandleProps} />
                  <span className="text-xl">{item.label.split(" ")[0]}</span>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{item.label.substring(item.label.indexOf(" ") + 1)}</span>
                    <span className="text-[11px] text-gray-400">ID: {item.id} · অবস্থান #{item.order}</span>
                  </div>
                </div>

                {/* Sizing Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Width selector */}
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200">
                    <span className="text-[11px] text-gray-400 font-medium">উইডথ:</span>
                    <select
                      value={item.width || "contained"}
                      onChange={(e) => updateSectionSize(item.id, e.target.value as any)}
                      className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="full">ফুল স্ক্রিন (Full)</option>
                      <option value="contained">বক্সড (Container)</option>
                      <option value="compact">কমপ্যাক্ট (Compact)</option>
                    </select>
                  </div>

                  {/* Columns selector */}
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200">
                    <span className="text-[11px] text-gray-400 font-medium">কলাম:</span>
                    <select
                      value={item.columns || 3}
                      onChange={(e) => updateSectionColumns(item.id, parseInt(e.target.value) as any)}
                      className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value={1}>১ কলাম (Hero)</option>
                      <option value={2}>২ কলাম (Split)</option>
                      <option value={3}>৩ কলাম (Standard)</option>
                      <option value={4}>৪ কলাম (Compact Grid)</option>
                    </select>
                  </div>

                  {/* Padding selector */}
                  <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-gray-200">
                    <span className="text-[11px] text-gray-400 font-medium">স্পেসিং:</span>
                    <select
                      value={item.padding || "normal"}
                      onChange={(e) => updateSectionPadding(item.id, e.target.value as any)}
                      className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="none">জিরো (0px)</option>
                      <option value="small">কম (Small)</option>
                      <option value="normal">স্ট্যান্ডার্ড (Normal)</option>
                      <option value="large">প্রশস্ত (Large)</option>
                    </select>
                  </div>

                  {/* Visibility Toggle */}
                  <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                    <button
                      onClick={() => toggleSection(item.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${item.visible ? "bg-emerald-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.visible ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                    <span className={`text-xs font-bold ${item.visible ? "text-emerald-600" : "text-gray-400"}`}>
                      {item.visible ? "অন" : "অফ"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}

      {/* ── Manifesto Tab ── */}
      {activeTab === "manifesto" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">✨ Animated Manifesto টেক্সট</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">English Text</label>
              <input
                type="text"
                value={config.manifesto.lineEn}
                onChange={(e) => setConfig((p) => ({ ...p, manifesto: { ...p.manifesto, lineEn: e.target.value } }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">বাংলা টেক্সট</label>
              <input
                type="text"
                value={config.manifesto.lineBn}
                onChange={(e) => setConfig((p) => ({ ...p, manifesto: { ...p.manifesto, lineBn: e.target.value } }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
          {/* Live Preview */}
          <div className="mt-4 bg-black rounded-2xl p-8 text-center">
            <p className="text-white/40 text-xs tracking-widest mb-2 uppercase">Preview</p>
            <h2 className="text-white text-2xl font-black tracking-wider uppercase">{config.manifesto.lineEn}</h2>
            <p className="text-white/60 text-sm mt-1">{config.manifesto.lineBn}</p>
          </div>
        </div>
      )}

      {/* ── Process Steps Tab ── */}
      {activeTab === "process" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-5">
          <div>
            <h3 className="font-semibold text-gray-700">📐 Process Section</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">Section Title (English)</label>
              <input type="text" value={config.process.titleEn}
                onChange={(e) => setConfig((p) => ({ ...p, process: { ...p.process, titleEn: e.target.value } }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">সেকশন শিরোনাম (বাংলা)</label>
              <input type="text" value={config.process.titleBn}
                onChange={(e) => setConfig((p) => ({ ...p, process: { ...p.process, titleBn: e.target.value } }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {config.process.steps.map((step, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <input type="text" value={step.iconEn}
                    onChange={(e) => updateProcessStep(i, "iconEn", e.target.value)}
                    className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1.5 text-xl"
                  />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">ধাপ {i + 1}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Title (EN)" value={step.titleEn}
                    onChange={(e) => updateProcessStep(i, "titleEn", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <input type="text" placeholder="শিরোনাম (বাংলা)" value={step.titleBn}
                    onChange={(e) => updateProcessStep(i, "titleBn", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <input type="text" placeholder="Description (EN)" value={step.descEn}
                    onChange={(e) => updateProcessStep(i, "descEn", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <input type="text" placeholder="বিবরণ (বাংলা)" value={step.descBn}
                    onChange={(e) => updateProcessStep(i, "descBn", e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Campaign Banner Tab ── */}
      {activeTab === "campaign" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="font-semibold text-gray-700">📣 Campaign Banner Text</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">English Text</label>
              <textarea rows={3} value={config.campaign.textEn}
                onChange={(e) => setConfig((p) => ({ ...p, campaign: { ...p.campaign, textEn: e.target.value } }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">বাংলা টেক্সট</label>
              <textarea rows={3} value={config.campaign.textBn}
                onChange={(e) => setConfig((p) => ({ ...p, campaign: { ...p.campaign, textBn: e.target.value } }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>
          {/* Live Preview */}
          <div className="bg-emerald-900 rounded-2xl py-6 px-8 overflow-hidden">
            <div className="whitespace-nowrap animate-marquee text-emerald-300 text-lg font-bold tracking-widest uppercase">
              {config.campaign.textEn} &nbsp;·&nbsp; {config.campaign.textBn} &nbsp;·&nbsp;
            </div>
          </div>
        </div>
      )}

      {/* ── Studio Life & Culture Tab ── */}
      {activeTab === "studioLife" && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-gray-800 text-base">🌱 স্টুডিও লাইফ ও কালচার সেকশন এডিটর</h3>
            <p className="text-xs text-gray-500 mt-0.5">হোমপেজে স্টুডিও পরিচিতি, ব্যাকগ্রাউন্ড ইমেজ ও টেক্সট পরিবর্তন করুন।</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Title (English)</label>
              <input
                type="text"
                value={config.studioLife?.titleEn || ""}
                onChange={(e) => setConfig((p) => ({
                  ...p,
                  studioLife: { ...p.studioLife!, titleEn: e.target.value }
                }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Title (বাংলা)</label>
              <input
                type="text"
                value={config.studioLife?.titleBn || ""}
                onChange={(e) => setConfig((p) => ({
                  ...p,
                  studioLife: { ...p.studioLife!, titleBn: e.target.value }
                }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Background Image URL</label>
            <input
              type="text"
              value={config.studioLife?.image || ""}
              onChange={(e) => setConfig((p) => ({
                ...p,
                studioLife: { ...p.studioLife!, image: e.target.value }
              }))}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
            />
            {config.studioLife?.image && (
              <div className="mt-3 w-full h-36 rounded-xl overflow-hidden border border-gray-200 relative">
                <img src={config.studioLife.image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Paragraph 1 (English)</label>
              <textarea
                rows={4}
                value={config.studioLife?.paragraph1En || ""}
                onChange={(e) => setConfig((p) => ({
                  ...p,
                  studioLife: { ...p.studioLife!, paragraph1En: e.target.value }
                }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Paragraph 1 (বাংলা)</label>
              <textarea
                rows={4}
                value={config.studioLife?.paragraph1Bn || ""}
                onChange={(e) => setConfig((p) => ({
                  ...p,
                  studioLife: { ...p.studioLife!, paragraph1Bn: e.target.value }
                }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Paragraph 2 (English)</label>
              <textarea
                rows={4}
                value={config.studioLife?.paragraph2En || ""}
                onChange={(e) => setConfig((p) => ({
                  ...p,
                  studioLife: { ...p.studioLife!, paragraph2En: e.target.value }
                }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Paragraph 2 (বাংলা)</label>
              <textarea
                rows={4}
                value={config.studioLife?.paragraph2Bn || ""}
                onChange={(e) => setConfig((p) => ({
                  ...p,
                  studioLife: { ...p.studioLife!, paragraph2Bn: e.target.value }
                }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>
        </div>
      )}

      <StandaloneToast message={toast} type={toast.startsWith("✅") ? "success" : "error"} visible={!!toast} />
    </div>
  );
}
