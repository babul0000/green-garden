"use client";

import React, { useEffect, useState } from "react";
import { StandaloneToast } from "@/components/shared/Toast";
import { emitSettingsSync } from "@/context/SiteConfigContext";
import { DEFAULT_LEGAL_CONFIG, LegalConfig, LegalPageData, LegalSection } from "@/types/cms";
import { BilingualInput, StudioHeader } from "./AdminStudioPrimitives";

type PolicyTab = "privacy" | "terms" | "refund";

export default function LegalPagesStudioTab() {
  const [active, setActive] = useState<PolicyTab>("privacy");
  const [config, setConfig] = useState<LegalConfig>(DEFAULT_LEGAL_CONFIG);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`/api/settings?key=legal_config&_t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.value) {
          setConfig((prev) => ({
            privacy: { ...prev.privacy, ...(d.value.privacy || {}) },
            terms: { ...prev.terms, ...(d.value.terms || {}) },
            refund: { ...prev.refund, ...(d.value.refund || {}) },
          }));
        }
      })
      .catch(() => {});
  }, []);

  const current: LegalPageData = config[active];

  const updateCurrent = (patch: Partial<LegalPageData>) => {
    setConfig((prev) => ({
      ...prev,
      [active]: { ...prev[active], ...patch },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "legal_config", value: config }),
      });
      if (res.ok) {
        emitSettingsSync("legal-config-updated");
        setToast("✅ আইনি নীতিমালা সফলভাবে সেভ হয়েছে!");
      } else {
        setToast("❌ সংরক্ষণ করতে সমস্যা হয়েছে।");
      }
    } catch {
      setToast("❌ নেটওয়ার্ক ত্রুটি।");
    } finally {
      setSaving(false);
      setTimeout(() => setToast(""), 3500);
    }
  };

  const addSection = () => {
    const newSec: LegalSection = {
      id: `sec-${Date.now()}`,
      headingBn: "নতুন অনুচ্ছেদ",
      headingEn: "New Policy Clause",
      bodyBn: "",
      bodyEn: "",
      bulletsBn: [],
      bulletsEn: [],
    };
    updateCurrent({ sections: [...current.sections, newSec] });
  };

  const updateSection = (idx: number, patch: Partial<LegalSection>) => {
    const next = [...current.sections];
    next[idx] = { ...next[idx], ...patch };
    updateCurrent({ sections: next });
  };

  const deleteSection = (idx: number) => {
    updateCurrent({ sections: current.sections.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-6">
      <StudioHeader
        icon="📜"
        title="লিগ্যাল ও পলিসি স্টুডিও (Privacy, Terms & Refund)"
        subtitle="গোপনীয়তা নীতি, ব্যবহারের শর্তাবলী এবং রিফান্ড পলিসির প্রতিটি অনুচ্ছেদ যোগ, এডিট ও ডিলিট করুন।"
        saving={saving}
        onSave={handleSave}
      />

      <div className="flex gap-2 flex-wrap">
        {[
          { key: "privacy", label: "🔒 Privacy Policy (/privacy-policy)" },
          { key: "terms", label: "⚖️ Terms & Conditions (/terms)" },
          { key: "refund", label: "💳 Refund Policy (/refund-policy)" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key as PolicyTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              active === tab.key
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
        <BilingualInput
          label="পেজ ব্যাজ (Page Badge)"
          bnValue={current.badgeBn}
          enValue={current.badgeEn}
          onBnChange={(v) => updateCurrent({ badgeBn: v })}
          onEnChange={(v) => updateCurrent({ badgeEn: v })}
        />
        <BilingualInput
          label="মূল শিরোনাম (Main Title)"
          bnValue={current.titleBn}
          enValue={current.titleEn}
          onBnChange={(v) => updateCurrent({ titleBn: v })}
          onEnChange={(v) => updateCurrent({ titleEn: v })}
        />
        <BilingualInput
          label="সাবটাইটেল (Subtitle)"
          multiline
          rows={2}
          bnValue={current.subtitleBn}
          enValue={current.subtitleEn}
          onBnChange={(v) => updateCurrent({ subtitleBn: v })}
          onEnChange={(v) => updateCurrent({ subtitleEn: v })}
        />
        <BilingualInput
          label="কার্যকর তারিখ (Effective Date)"
          bnValue={current.effectiveDateBn}
          enValue={current.effectiveDateEn}
          onBnChange={(v) => updateCurrent({ effectiveDateBn: v })}
          onEnChange={(v) => updateCurrent({ effectiveDateEn: v })}
        />

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
          <label className="flex items-center gap-2 text-xs font-bold text-amber-900 cursor-pointer">
            <input
              type="checkbox"
              checked={current.noticeBannerActive}
              onChange={(e) => updateCurrent({ noticeBannerActive: e.target.checked })}
              className="w-4 h-4 accent-amber-600"
            />
            বিশেষ নোটিশ ব্যানার প্রদর্শন করুন (Highlight Notice Banner)
          </label>
          {current.noticeBannerActive && (
            <BilingualInput
              label="নোটিশ ব্যানার টেক্সট"
              bnValue={current.noticeBannerBn}
              enValue={current.noticeBannerEn}
              onBnChange={(v) => updateCurrent({ noticeBannerBn: v })}
              onEnChange={(v) => updateCurrent({ noticeBannerEn: v })}
            />
          )}
        </div>
      </div>

      {/* Policy Sections CRUD */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <h3 className="font-bold text-stone-800 text-sm">
            ধারা / অনুচ্ছেদসমূহ ({current.sections.length})
          </h3>
          <button
            type="button"
            onClick={addSection}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            + নতুন অনুচ্ছেদ যোগ করুন
          </button>
        </div>

        <div className="space-y-4">
          {current.sections.map((sec, idx) => (
            <div key={sec.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-mono text-xs font-bold text-emerald-700">CLAUSE #{idx + 1}</span>
                <button
                  type="button"
                  onClick={() => deleteSection(idx)}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  ✕ ডিলিট করুন
                </button>
              </div>
              <BilingualInput
                label="অনুচ্ছেদের শিরোনাম"
                bnValue={sec.headingBn}
                enValue={sec.headingEn}
                onBnChange={(v) => updateSection(idx, { headingBn: v })}
                onEnChange={(v) => updateSection(idx, { headingEn: v })}
              />
              <BilingualInput
                label="বিস্তারিত বক্তব্য"
                multiline
                rows={3}
                bnValue={sec.bodyBn}
                enValue={sec.bodyEn}
                onBnChange={(v) => updateSection(idx, { bodyBn: v })}
                onEnChange={(v) => updateSection(idx, { bodyEn: v })}
              />
              <BilingualInput
                label="বুলেট পয়েন্ট (প্রতি লাইনে একটি করে — অপশনাল)"
                multiline
                rows={2}
                bnValue={(sec.bulletsBn || []).join("\n")}
                enValue={(sec.bulletsEn || []).join("\n")}
                onBnChange={(v) =>
                  updateSection(idx, {
                    bulletsBn: v
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                onEnChange={(v) =>
                  updateSection(idx, {
                    bulletsEn: v
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <StandaloneToast
        message={toast}
        type={toast.startsWith("❌") ? "error" : "success"}
        visible={!!toast}
      />
    </div>
  );
}

