"use client";

import React, { useEffect, useMemo, useState } from "react";
import { StandaloneToast } from "@/components/shared/Toast";
import { emitSettingsSync } from "@/context/SiteConfigContext";
import {
  DEFAULT_CAREER_CONFIG,
  DEFAULT_PAGES_CONFIG,
  DEFAULT_UI_TEXT_ITEMS,
  PagesConfig,
  PageSlugKey,
  UiTextItem,
} from "@/types/cms";
import { BilingualInput, StudioHeader } from "./AdminStudioPrimitives";

const PAGE_LABELS: Record<PageSlugKey, string> = {
  projects: "🏗️ Projects Page (/projects)",
  services: "🌿 Services Page (/services)",
  gallery: "🖼️ Gallery Page (/gallery)",
  beforeAfter: "↔️ Before & After (/before-after)",
  blog: "📰 Blog Journal (/blog)",
  testimonials: "⭐ Testimonials (/testimonials)",
  designGarden: "📐 Design Garden (/design-garden)",
  aiTools: "🤖 AI Botanical Tools (/ai-tools)",
  login: "🔐 Login Page (/login)",
  register: "📝 Register Page (/register)",
  forgotPassword: "🔑 Forgot Password (/forgot-password)",
  maintenance: "🛠️ Maintenance Screen",
};

export default function SiteTextsStudioTab() {
  const [mode, setMode] = useState<"micro" | "pages">("micro");
  const [items, setItems] = useState<UiTextItem[]>(DEFAULT_UI_TEXT_ITEMS);
  const [deletedKeys, setDeletedKeys] = useState<string[]>([]);
  const [pages, setPages] = useState<PagesConfig>(DEFAULT_PAGES_CONFIG);
  const [careerHeader, setCareerHeader] = useState({
    badgeBn: DEFAULT_CAREER_CONFIG.badgeBn,
    badgeEn: DEFAULT_CAREER_CONFIG.badgeEn,
    titleBn: DEFAULT_CAREER_CONFIG.titleBn,
    titleEn: DEFAULT_CAREER_CONFIG.titleEn,
    subtitleBn: DEFAULT_CAREER_CONFIG.subtitleBn,
    subtitleEn: DEFAULT_CAREER_CONFIG.subtitleEn,
  });

  const [selectedPageFilter, setSelectedPageFilter] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<PageSlugKey>("projects");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customDraft, setCustomDraft] = useState({ key: "", page: "Custom", label: "", bn: "", en: "" });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    fetch(`/api/settings?_t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        if (d.ui_texts_config?.items) setItems(d.ui_texts_config.items);
        if (Array.isArray(d.ui_texts_config?.deletedKeys)) setDeletedKeys(d.ui_texts_config.deletedKeys);
        if (d.pages_config) setPages((p) => ({ ...p, ...d.pages_config }));
        if (d.career_config) {
          setCareerHeader((p) => ({
            badgeBn: d.career_config.badgeBn || p.badgeBn,
            badgeEn: d.career_config.badgeEn || p.badgeEn,
            titleBn: d.career_config.titleBn || p.titleBn,
            titleEn: d.career_config.titleEn || p.titleEn,
            subtitleBn: d.career_config.subtitleBn || p.subtitleBn,
            subtitleEn: d.career_config.subtitleEn || p.subtitleEn,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const pageGroups = useMemo(() => {
    const set = new Set<string>(["All", ...items.map((i) => i.page)]);
    return Array.from(set);
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((it) => {
      if (selectedPageFilter !== "All" && it.page !== selectedPageFilter) return false;
      if (!q) return true;
      return (
        it.key.toLowerCase().includes(q) ||
        it.label.toLowerCase().includes(q) ||
        it.bn.toLowerCase().includes(q) ||
        it.en.toLowerCase().includes(q)
      );
    });
  }, [items, selectedPageFilter, search]);

  const saveAll = async () => {
    setSaving(true);
    try {
      const careerRes = await fetch("/api/settings?key=career_config", { cache: "no-store" });
      const careerExisting = careerRes.ok ? (await careerRes.json())?.value || DEFAULT_CAREER_CONFIG : DEFAULT_CAREER_CONFIG;

      const [r1, r2, r3] = await Promise.all([
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "ui_texts_config", value: { items, deletedKeys } }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "pages_config", value: pages }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "career_config", value: { ...careerExisting, ...careerHeader } }),
        }),
      ]);

      if (r1.ok && r2.ok && r3.ok) {
        emitSettingsSync("ui-texts-updated");
        emitSettingsSync("pages-config-updated");
        notify("✅ সকল পেজ হেডার ও ক্ষুদ্র টেক্সট সেভ হয়েছে!");
      } else {
        notify("❌ কিছু অংশ সেভ করতে সমস্যা হয়েছে।");
      }
    } catch {
      notify("❌ নেটওয়ার্ক ত্রুটি।");
    } finally {
      setSaving(false);
    }
  };

  const addCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = customDraft.key.trim().replace(/\s+/g, ".");
    if (!cleanKey || items.some((x) => x.key === cleanKey)) {
      notify("❌ ইউনিক Key দিন (যেমন custom.banner.btn)");
      return;
    }
    setItems((prev) => [
      {
        key: cleanKey,
        page: customDraft.page || "Custom",
        label: customDraft.label || cleanKey,
        bn: customDraft.bn,
        en: customDraft.en,
        isCustom: true,
      },
      ...prev,
    ]);
    setDeletedKeys((prev) => prev.filter((k) => k !== cleanKey));
    setCustomDraft({ key: "", page: "Custom", label: "", bn: "", en: "" });
    setShowAddCustom(false);
  };

  const resetKey = (key: string) => {
    const def = DEFAULT_UI_TEXT_ITEMS.find((d) => d.key === key);
    if (!def) return;
    setItems((prev) => prev.map((it) => (it.key === key ? { ...def } : it)));
  };

  const deleteTextKey = (key: string) => {
    if (!confirm(`"${key}" টেক্সট কীটি তালিকা থেকে মুছবেন?`)) return;
    setItems((prev) => prev.filter((it) => it.key !== key));
    setDeletedKeys((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  return (
    <div className="space-y-6">
      <StudioHeader
        icon="🔤"
        title="সব পেজ হেডার ও ক্ষুদ্র টেক্সট স্টুডিও (100% Dynamic Micro-Texts)"
        subtitle="ওয়েবসাইটের যেকোনো পেজের শিরোনাম, সাবটাইটেল, বাটন লেবেল, প্লেসহোল্ডার বা ছোট নোটিশ টেক্সট সরাসরি এখান থেকে বদলান।"
        saving={saving}
        onSave={saveAll}
        extraActions={
          mode === "micro" ? (
            <button
              type="button"
              onClick={() => setShowAddCustom((p) => !p)}
              className="px-4 py-2.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {showAddCustom ? "✕ বন্ধ করুন" : "+ নতুন কাস্টম টেক্সট কী"}
            </button>
          ) : null
        }
      />

      {/* Top Mode Switcher */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setMode("micro")}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            mode === "micro"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white border border-stone-200 text-stone-600"
          }`}
        >
          🎛️ ক্ষুদ্র টেক্সট, বাটন ও লেবেল ({items.length})
        </button>
        <button
          type="button"
          onClick={() => setMode("pages")}
          className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
            mode === "pages"
              ? "bg-emerald-700 text-white shadow-sm"
              : "bg-white border border-stone-200 text-stone-600"
          }`}
        >
          🗂️ সকল পেজ হেডার ও মেইনটেনেন্স পেজ ({Object.keys(PAGE_LABELS).length + 1})
        </button>
      </div>

      {/* MODE 1: UNIVERSAL MICRO-TEXT DICTIONARY */}
      {mode === "micro" && (
        <div className="space-y-4">
          {showAddCustom && (
            <form onSubmit={addCustomText} className="bg-white p-5 rounded-2xl border border-emerald-200 space-y-3 text-xs">
              <h4 className="font-bold text-stone-800">➕ নতুন মাইক্রো-টেক্সট কী যোগ করুন</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input required type="text" placeholder="Key (e.g. home.promo.btn)" value={customDraft.key} onChange={(e) => setCustomDraft((p) => ({ ...p, key: e.target.value }))} className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono" />
                <input type="text" placeholder="Page Group (e.g. Home)" value={customDraft.page} onChange={(e) => setCustomDraft((p) => ({ ...p, page: e.target.value }))} className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200" />
                <input type="text" placeholder="Human Label" value={customDraft.label} onChange={(e) => setCustomDraft((p) => ({ ...p, label: e.target.value }))} className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200" />
              </div>
              <BilingualInput
                label="টেক্সট মান (Value)"
                bnValue={customDraft.bn}
                enValue={customDraft.en}
                onBnChange={(v) => setCustomDraft((p) => ({ ...p, bn: v }))}
                onEnChange={(v) => setCustomDraft((p) => ({ ...p, en: v }))}
              />
              <div className="flex justify-end gap-2">
                <button type="submit" className="px-4 py-2 bg-emerald-700 text-white rounded-xl font-bold cursor-pointer">যোগ করুন</button>
              </div>
            </form>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            <input
              type="text"
              placeholder="🔍 যেকোনো বাটন বা টেক্সট খুঁজুন (যেমন: সাবস্ক্রাইব, Add to Bag, প্রজেক্ট)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-96 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-emerald-600"
            />
            <div className="flex gap-1.5 flex-wrap">
              {pageGroups.map((pg) => (
                <button
                  key={pg}
                  type="button"
                  onClick={() => setSelectedPageFilter(pg)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                    selectedPageFilter === pg
                      ? "bg-stone-900 text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>
          </div>

          {/* Items List */}
          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map((it) => (
              <div key={it.key} className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2.5">
                <div className="flex flex-wrap justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase">
                      {it.page}
                    </span>
                    <span className="font-bold text-stone-800 text-xs">{it.label}</span>
                    <code className="text-[10px] font-mono text-stone-400 bg-stone-50 px-2 py-0.5 rounded">{it.key}</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {DEFAULT_UI_TEXT_ITEMS.some((d) => d.key === it.key) && (
                      <button type="button" onClick={() => resetKey(it.key)} className="text-blue-600 hover:underline font-semibold cursor-pointer">
                        ↺ রিসেট
                      </button>
                    )}
                    <button type="button" onClick={() => deleteTextKey(it.key)} className="text-rose-600 hover:underline font-semibold cursor-pointer">
                      ✕ ডিলিট
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={it.bn}
                    onChange={(e) =>
                      setItems((prev) => prev.map((x) => (x.key === it.key ? { ...x, bn: e.target.value } : x)))
                    }
                    placeholder="বাংলা..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  />
                  <input
                    type="text"
                    value={it.en}
                    onChange={(e) =>
                      setItems((prev) => prev.map((x) => (x.key === it.key ? { ...x, en: e.target.value } : x)))
                    }
                    placeholder="English..."
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: PER-PAGE HEADERS STUDIO */}
      {mode === "pages" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-3 space-y-1.5 h-fit">
            {(Object.keys(PAGE_LABELS) as PageSlugKey[]).map((slug) => (
              <button
                key={slug}
                type="button"
                onClick={() => setSelectedSlug(slug)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedSlug === slug
                    ? "bg-emerald-700 text-white"
                    : "text-stone-700 hover:bg-stone-50"
                }`}
              >
                {PAGE_LABELS[slug]}
              </button>
            ))}
            <div className="pt-2 border-t border-stone-100 mt-2 px-2">
              <p className="text-[11px] font-bold text-stone-400 uppercase mb-1">Career Page Header (/career)</p>
              <p className="text-[11px] text-stone-500">নিচে ডান পাশে ক্যারিয়ার পেজের হেডার এডিট বক্সও যুক্ত রয়েছে।</p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-5">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
              <h3 className="font-bold text-stone-800 text-sm border-b border-stone-100 pb-2">
                {PAGE_LABELS[selectedSlug]}
              </h3>
              <BilingualInput
                label="ব্যাজ / ক্যাটাগরি ট্যাগ"
                bnValue={pages[selectedSlug]?.badgeBn || ""}
                enValue={pages[selectedSlug]?.badgeEn || ""}
                onBnChange={(v) => setPages((p) => ({ ...p, [selectedSlug]: { ...p[selectedSlug], badgeBn: v } }))}
                onEnChange={(v) => setPages((p) => ({ ...p, [selectedSlug]: { ...p[selectedSlug], badgeEn: v } }))}
              />
              <BilingualInput
                label="মূল শিরোনাম (Main Heading)"
                bnValue={pages[selectedSlug]?.titleBn || ""}
                enValue={pages[selectedSlug]?.titleEn || ""}
                onBnChange={(v) => setPages((p) => ({ ...p, [selectedSlug]: { ...p[selectedSlug], titleBn: v } }))}
                onEnChange={(v) => setPages((p) => ({ ...p, [selectedSlug]: { ...p[selectedSlug], titleEn: v } }))}
              />
              <BilingualInput
                label="সাবটাইটেল / বিবরণ (Subtitle)"
                multiline
                rows={3}
                bnValue={pages[selectedSlug]?.subtitleBn || ""}
                enValue={pages[selectedSlug]?.subtitleEn || ""}
                onBnChange={(v) => setPages((p) => ({ ...p, [selectedSlug]: { ...p[selectedSlug], subtitleBn: v } }))}
                onEnChange={(v) => setPages((p) => ({ ...p, [selectedSlug]: { ...p[selectedSlug], subtitleEn: v } }))}
              />
            </div>

            {/* Career Header Convenience Editor */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
              <h3 className="font-bold text-stone-800 text-sm border-b border-stone-100 pb-2">
                💼 ক্যারিয়ার পেজ হেডার (/career Header)
              </h3>
              <BilingualInput
                label="ক্যারিয়ার ব্যাজ"
                bnValue={careerHeader.badgeBn}
                enValue={careerHeader.badgeEn}
                onBnChange={(v) => setCareerHeader((p) => ({ ...p, badgeBn: v }))}
                onEnChange={(v) => setCareerHeader((p) => ({ ...p, badgeEn: v }))}
              />
              <BilingualInput
                label="ক্যারিয়ার শিরোনাম"
                bnValue={careerHeader.titleBn}
                enValue={careerHeader.titleEn}
                onBnChange={(v) => setCareerHeader((p) => ({ ...p, titleBn: v }))}
                onEnChange={(v) => setCareerHeader((p) => ({ ...p, titleEn: v }))}
              />
              <BilingualInput
                label="ক্যারিয়ার বিবরণ"
                multiline
                rows={2}
                bnValue={careerHeader.subtitleBn}
                enValue={careerHeader.subtitleEn}
                onBnChange={(v) => setCareerHeader((p) => ({ ...p, subtitleBn: v }))}
                onEnChange={(v) => setCareerHeader((p) => ({ ...p, subtitleEn: v }))}
              />
            </div>
          </div>
        </div>
      )}

      <StandaloneToast message={toast} type={toast.startsWith("❌") ? "error" : "success"} visible={!!toast} />
    </div>
  );
}

