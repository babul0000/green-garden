"use client";

import React, { useEffect, useState } from "react";
import { StandaloneToast } from "@/components/shared/Toast";
import { emitSettingsSync } from "@/context/SiteConfigContext";
import {
  DEFAULT_ESTIMATOR_CONFIG,
  DEFAULT_LOYALTY_CONFIG,
  DEFAULT_TREE_DOCTOR_CONFIG,
  DEFAULT_WIZARD_CONFIG,
  EstimatorConfig,
  LoyaltyConfig,
  TreeDoctorConfig,
  WizardConfig,
} from "@/types/cms";
import { BilingualInput, StudioHeader } from "./AdminStudioPrimitives";

type ToolsSubTab = "estimator" | "wizard" | "loyalty" | "tree-doctor" | "newsletter";

interface SubscriberRow {
  id: string;
  email: string;
  name?: string;
  source?: string;
  subscribedAt: string;
}

export default function InteractiveToolsStudioTab() {
  const [sub, setSub] = useState<ToolsSubTab>("estimator");
  const [estimator, setEstimator] = useState<EstimatorConfig>(DEFAULT_ESTIMATOR_CONFIG);
  const [wizard, setWizard] = useState<WizardConfig>(DEFAULT_WIZARD_CONFIG);
  const [loyalty, setLoyalty] = useState<LoyaltyConfig>(DEFAULT_LOYALTY_CONFIG);
  const [treeDoc, setTreeDoc] = useState<TreeDoctorConfig>(DEFAULT_TREE_DOCTOR_CONFIG);
  const [subscribers, setSubscribers] = useState<SubscriberRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/settings?_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const d = await res.json();
          if (d.estimator_config) setEstimator((p) => ({ ...p, ...d.estimator_config }));
          if (d.wizard_config) setWizard((p) => ({ ...p, ...d.wizard_config }));
          if (d.loyalty_config) setLoyalty((p) => ({ ...p, ...d.loyalty_config }));
          if (d.tree_doctor_config) setTreeDoc((p) => ({ ...p, ...d.tree_doctor_config }));
        }
        const subRes = await fetch(`/api/newsletter?_t=${Date.now()}`, { cache: "no-store" });
        if (subRes.ok) {
          const sData = await subRes.json();
          if (Array.isArray(sData.subscribers)) setSubscribers(sData.subscribers);
        }
      } catch {
        // fallback defaults
      }
    };
    load();
  }, []);

  const saveCurrentTab = async () => {
    const keyMap: Record<Exclude<ToolsSubTab, "newsletter">, { key: string; val: any }> = {
      estimator: { key: "estimator_config", val: estimator },
      wizard: { key: "wizard_config", val: wizard },
      loyalty: { key: "loyalty_config", val: loyalty },
      "tree-doctor": { key: "tree_doctor_config", val: treeDoc },
    };
    if (sub === "newsletter") return;
    setSaving(true);
    try {
      const target = keyMap[sub];
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: target.key, value: target.val }),
      });
      if (res.ok) {
        emitSettingsSync("tools-config-updated");
        notify("✅ টুলস কনফিগারেশন সফলভাবে সেভ হয়েছে!");
      } else {
        notify("❌ সংরক্ষণ ব্যর্থ হয়েছে।");
      }
    } catch {
      notify("❌ নেটওয়ার্ক ত্রুটি।");
    } finally {
      setSaving(false);
    }
  };

  const deleteSubscriber = async (id: string) => {
    if (!confirm("সাবস্ক্রাইবার তালিকা থেকে মুছবেন?")) return;
    const res = await fetch(`/api/newsletter?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setSubscribers((p) => p.filter((s) => s.id !== id));
      notify("🗑️ সাবস্ক্রাইবার সরানো হয়েছে।");
    }
  };

  const exportSubscribersCsv = () => {
    const header = "Email,Source,SubscribedAt\n";
    const rows = subscribers.map((s) => `${s.email},${s.source || "footer"},${s.subscribedAt}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ar-green-newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <StudioHeader
        icon="⚙️"
        title="ইন্টার‍্যাক্টিভ টুলস ও মেম্বারশিপ স্টুডিও (Tools & Club)"
        subtitle="বাজেট এস্টিমেটর রেট, ৩ডি ডিজাইন উইজার্ড, লয়্যালটি রিওয়ার্ডস, ট্রি ডক্টর ও নিউজলেটার নিয়ন্ত্রণ করুন।"
        saving={saving}
        onSave={saveCurrentTab}
        saveLabel={sub === "newsletter" ? "⬇️ এক্সপোর্ট CSV" : "💾 সেভ করুন"}
      />

      <div className="flex gap-2 flex-wrap">
        {[
          { id: "estimator", label: "🧮 বাজেট এস্টিমেটর" },
          { id: "wizard", label: "📐 ডিজাইন উইজার্ড (/design-garden)" },
          { id: "loyalty", label: "💎 লয়্যালটি ও কেয়ার প্যাকেজ" },
          { id: "tree-doctor", label: "🩺 ট্রি ডক্টর পেজ" },
          { id: "newsletter", label: `✉️ নিউজলেটার (${subscribers.length})` },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSub(t.id as ToolsSubTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              sub === t.id
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. ESTIMATOR */}
      {sub === "estimator" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <BilingualInput
            label="এসটিমেটর শিরোনাম (Estimator Title)"
            bnValue={estimator.titleBn}
            enValue={estimator.titleEn}
            onBnChange={(v) => setEstimator((p) => ({ ...p, titleBn: v }))}
            onEnChange={(v) => setEstimator((p) => ({ ...p, titleEn: v }))}
          />
          <BilingualInput
            label="সাবটাইটেল (Subtitle)"
            bnValue={estimator.subtitleBn}
            enValue={estimator.subtitleEn}
            onBnChange={(v) => setEstimator((p) => ({ ...p, subtitleBn: v }))}
            onEnChange={(v) => setEstimator((p) => ({ ...p, subtitleEn: v }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-600 block mb-1">সর্বনিম্ন স্কয়ার ফিট</label>
              <input type="number" value={estimator.minAreaSqft} onChange={(e) => setEstimator((p) => ({ ...p, minAreaSqft: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono" />
            </div>
            <div>
              <label className="font-bold text-stone-600 block mb-1">সর্বোচ্চ স্কয়ার ফিট</label>
              <input type="number" value={estimator.maxAreaSqft} onChange={(e) => setEstimator((p) => ({ ...p, maxAreaSqft: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono" />
            </div>
            <div>
              <label className="font-bold text-stone-600 block mb-1">ডিফল্ট এরিয়া (SqFt)</label>
              <input type="number" value={estimator.defaultAreaSqft} onChange={(e) => setEstimator((p) => ({ ...p, defaultAreaSqft: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono" />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-stone-100">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-stone-800 text-sm">বাগানের ধরন ও প্রতি বর্গফুট রেট (Types & Rates)</h4>
              <button
                type="button"
                onClick={() =>
                  setEstimator((p) => ({
                    ...p,
                    types: [...p.types, { id: `type-${Date.now()}`, labelBn: "নতুন ধরন", labelEn: "New Type", ratePerSqft: 250 }],
                  }))
                }
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                + যোগ করুন
              </button>
            </div>
            {estimator.types.map((t, idx) => (
              <div key={t.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs items-center">
                <input type="text" placeholder="বাংলা নাম" value={t.labelBn} onChange={(e) => { const next = [...estimator.types]; next[idx] = { ...t, labelBn: e.target.value }; setEstimator((p) => ({ ...p, types: next })); }} className="px-3 py-2 rounded-lg bg-white border border-stone-200" />
                <input type="text" placeholder="English Name" value={t.labelEn} onChange={(e) => { const next = [...estimator.types]; next[idx] = { ...t, labelEn: e.target.value }; setEstimator((p) => ({ ...p, types: next })); }} className="px-3 py-2 rounded-lg bg-white border border-stone-200" />
                <input type="number" placeholder="৳ / SqFt" value={t.ratePerSqft} onChange={(e) => { const next = [...estimator.types]; next[idx] = { ...t, ratePerSqft: Number(e.target.value) }; setEstimator((p) => ({ ...p, types: next })); }} className="px-3 py-2 rounded-lg bg-white border border-stone-200 font-mono font-bold" />
                <button type="button" onClick={() => setEstimator((p) => ({ ...p, types: p.types.filter((x) => x.id !== t.id) }))} className="text-rose-600 font-bold text-right cursor-pointer">✕ মুছুন</button>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-3 border-t border-stone-100">
            <h4 className="font-bold text-stone-800 text-sm">ফিনিশিং প্যাকেজ ও গুণিতক (Tier Multipliers)</h4>
            {estimator.tiers.map((tier, idx) => (
              <div key={tier.id} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs items-center">
                <input type="text" value={tier.labelBn} onChange={(e) => { const next = [...estimator.tiers]; next[idx] = { ...tier, labelBn: e.target.value }; setEstimator((p) => ({ ...p, tiers: next })); }} className="px-3 py-2 rounded-lg bg-white border border-stone-200" />
                <input type="text" value={tier.labelEn} onChange={(e) => { const next = [...estimator.tiers]; next[idx] = { ...tier, labelEn: e.target.value }; setEstimator((p) => ({ ...p, tiers: next })); }} className="px-3 py-2 rounded-lg bg-white border border-stone-200" />
                <input type="number" step="0.1" value={tier.multiplier} onChange={(e) => { const next = [...estimator.tiers]; next[idx] = { ...tier, multiplier: Number(e.target.value) }; setEstimator((p) => ({ ...p, tiers: next })); }} className="px-3 py-2 rounded-lg bg-white border border-stone-200 font-mono font-bold" />
                <input type="text" value={tier.descBn} onChange={(e) => { const next = [...estimator.tiers]; next[idx] = { ...tier, descBn: e.target.value }; setEstimator((p) => ({ ...p, tiers: next })); }} className="px-3 py-2 rounded-lg bg-white border border-stone-200" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. DESIGN WIZARD */}
      {sub === "wizard" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <BilingualInput
            label="উইজার্ড শিরোনাম (/design-garden)"
            bnValue={wizard.titleBn}
            enValue={wizard.titleEn}
            onBnChange={(v) => setWizard((p) => ({ ...p, titleBn: v }))}
            onEnChange={(v) => setWizard((p) => ({ ...p, titleEn: v }))}
          />
          <BilingualInput
            label="উইজার্ড সাবটাইটেল"
            multiline
            rows={2}
            bnValue={wizard.subtitleBn}
            enValue={wizard.subtitleEn}
            onBnChange={(v) => setWizard((p) => ({ ...p, subtitleBn: v }))}
            onEnChange={(v) => setWizard((p) => ({ ...p, subtitleEn: v }))}
          />

          {(["spaces", "styles", "features", "budgets"] as const).map((groupKey) => {
            const labels: Record<string, string> = {
              spaces: "১. স্পেস ধরন (Space Types)",
              styles: "২. আর্কিটেকচারাল স্টাইল (Architecture Styles)",
              features: "৩. বিশেষ ফিচারসমূহ (Add-on Features)",
              budgets: "৪. বাজেট রেঞ্জ অপশন (Budget Tiers)",
            };
            const list = wizard[groupKey];
            return (
              <div key={groupKey} className="pt-4 border-t border-stone-100 space-y-2.5">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-stone-800 text-sm">{labels[groupKey]}</h4>
                  <button
                    type="button"
                    onClick={() =>
                      setWizard((p) => ({
                        ...p,
                        [groupKey]: [...p[groupKey], { id: `opt-${Date.now()}`, labelBn: "নতুন অপশন", labelEn: "New Option", icon: "🌿" }],
                      }))
                    }
                    className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                  >
                    + অপশন যোগ
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {list.map((opt, idx) => (
                    <div key={opt.id} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex gap-2 items-center text-xs">
                      <input type="text" value={opt.icon || ""} onChange={(e) => { const next = [...list]; next[idx] = { ...opt, icon: e.target.value }; setWizard((p) => ({ ...p, [groupKey]: next })); }} placeholder="Icon" className="w-10 text-center px-1 py-1.5 rounded-lg bg-white border border-stone-200" />
                      <input type="text" value={opt.labelBn} onChange={(e) => { const next = [...list]; next[idx] = { ...opt, labelBn: e.target.value }; setWizard((p) => ({ ...p, [groupKey]: next })); }} placeholder="বাংলা" className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200" />
                      <input type="text" value={opt.labelEn} onChange={(e) => { const next = [...list]; next[idx] = { ...opt, labelEn: e.target.value }; setWizard((p) => ({ ...p, [groupKey]: next })); }} placeholder="English" className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200" />
                      <button type="button" onClick={() => setWizard((p) => ({ ...p, [groupKey]: p[groupKey].filter((x) => x.id !== opt.id) }))} className="text-rose-600 font-bold px-1.5 cursor-pointer">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. LOYALTY & CARE PACKAGES */}
      {sub === "loyalty" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <BilingualInput
            label="লয়্যালটি ক্লাব শিরোনাম"
            bnValue={loyalty.titleBn}
            enValue={loyalty.titleEn}
            onBnChange={(v) => setLoyalty((p) => ({ ...p, titleBn: v }))}
            onEnChange={(v) => setLoyalty((p) => ({ ...p, titleEn: v }))}
          />
          <BilingualInput
            label="রেফারেল বোনাস শিরোনাম"
            bnValue={loyalty.referralBonusTitleBn}
            enValue={loyalty.referralBonusTitleEn}
            onBnChange={(v) => setLoyalty((p) => ({ ...p, referralBonusTitleBn: v }))}
            onEnChange={(v) => setLoyalty((p) => ({ ...p, referralBonusTitleEn: v }))}
          />
          <div className="text-xs max-w-xs">
            <label className="font-bold text-stone-600 block mb-1">VIP মেম্বার হতে প্রয়োজনীয় পয়েন্ট</label>
            <input type="number" value={loyalty.vipThresholdPoints} onChange={(e) => setLoyalty((p) => ({ ...p, vipThresholdPoints: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono font-bold" />
          </div>

          <div className="pt-4 border-t border-stone-100 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-stone-800 text-sm">রিওয়ার্ড অফারসমূহ (Redeemable Rewards)</h4>
              <button
                type="button"
                onClick={() =>
                  setLoyalty((p) => ({
                    ...p,
                    rewards: [
                      ...p.rewards,
                      { id: `rew-${Date.now()}`, titleBn: "নতুন রিওয়ার্ড", titleEn: "New Reward", pointsCost: 300, descBn: "", descEn: "", icon: "🎁" },
                    ],
                  }))
                }
                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                + নতুন রিওয়ার্ড
              </button>
            </div>
            {loyalty.rewards.map((rew, idx) => (
              <div key={rew.id} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex gap-2 items-center flex-1">
                    <input type="text" value={rew.icon} onChange={(e) => { const next = [...loyalty.rewards]; next[idx] = { ...rew, icon: e.target.value }; setLoyalty((p) => ({ ...p, rewards: next })); }} className="w-12 text-center px-2 py-1.5 rounded-lg bg-white border border-stone-200" />
                    <input type="number" value={rew.pointsCost} onChange={(e) => { const next = [...loyalty.rewards]; next[idx] = { ...rew, pointsCost: Number(e.target.value) }; setLoyalty((p) => ({ ...p, rewards: next })); }} className="w-24 px-2 py-1.5 rounded-lg bg-white border border-stone-200 font-mono font-bold" />
                    <span className="text-stone-400">Pts</span>
                  </div>
                  <button type="button" onClick={() => setLoyalty((p) => ({ ...p, rewards: p.rewards.filter((r) => r.id !== rew.id) }))} className="text-rose-600 font-bold cursor-pointer">✕ ডিলিট</button>
                </div>
                <BilingualInput
                  label="রিওয়ার্ড নাম"
                  bnValue={rew.titleBn}
                  enValue={rew.titleEn}
                  onBnChange={(v) => { const next = [...loyalty.rewards]; next[idx] = { ...rew, titleBn: v }; setLoyalty((p) => ({ ...p, rewards: next })); }}
                  onEnChange={(v) => { const next = [...loyalty.rewards]; next[idx] = { ...rew, titleEn: v }; setLoyalty((p) => ({ ...p, rewards: next })); }}
                />
                <BilingualInput
                  label="বিবরণ"
                  bnValue={rew.descBn}
                  enValue={rew.descEn}
                  onBnChange={(v) => { const next = [...loyalty.rewards]; next[idx] = { ...rew, descBn: v }; setLoyalty((p) => ({ ...p, rewards: next })); }}
                  onEnChange={(v) => { const next = [...loyalty.rewards]; next[idx] = { ...rew, descEn: v }; setLoyalty((p) => ({ ...p, rewards: next })); }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TREE DOCTOR PAGE CONFIG */}
      {sub === "tree-doctor" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-5">
          <BilingualInput label="ট্রি ডক্টর ব্যাজ" bnValue={treeDoc.badgeBn} enValue={treeDoc.badgeEn} onBnChange={(v) => setTreeDoc((p) => ({ ...p, badgeBn: v }))} onEnChange={(v) => setTreeDoc((p) => ({ ...p, badgeEn: v }))} />
          <BilingualInput label="ট্রি ডক্টর শিরোনাম" bnValue={treeDoc.titleBn} enValue={treeDoc.titleEn} onBnChange={(v) => setTreeDoc((p) => ({ ...p, titleBn: v }))} onEnChange={(v) => setTreeDoc((p) => ({ ...p, titleEn: v }))} />
          <BilingualInput label="ট্রি ডক্টর বিবরণ" multiline rows={2} bnValue={treeDoc.subtitleBn} enValue={treeDoc.subtitleEn} onBnChange={(v) => setTreeDoc((p) => ({ ...p, subtitleBn: v }))} onEnChange={(v) => setTreeDoc((p) => ({ ...p, subtitleEn: v }))} />
          <BilingualInput label="ডাক্তার ভিজিট ফি" bnValue={treeDoc.visitFeeBn} enValue={treeDoc.visitFeeEn} onBnChange={(v) => setTreeDoc((p) => ({ ...p, visitFeeBn: v }))} onEnChange={(v) => setTreeDoc((p) => ({ ...p, visitFeeEn: v }))} />
          <BilingualInput label="রেসপন্স সময়সীমা" bnValue={treeDoc.responseTimeBn} enValue={treeDoc.responseTimeEn} onBnChange={(v) => setTreeDoc((p) => ({ ...p, responseTimeBn: v }))} onEnChange={(v) => setTreeDoc((p) => ({ ...p, responseTimeEn: v }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-stone-600 block mb-1">জরুরি হটলাইন নম্বর</label>
              <input type="text" value={treeDoc.hotline} onChange={(e) => setTreeDoc((p) => ({ ...p, hotline: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono" />
            </div>
            <div>
              <label className="font-bold text-stone-600 block mb-1">হোয়াটসঅ্যাপ নম্বর</label>
              <input type="text" value={treeDoc.whatsapp} onChange={(e) => setTreeDoc((p) => ({ ...p, whatsapp: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 font-mono" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
            <input type="checkbox" checked={treeDoc.showShowcaseRecords} onChange={(e) => setTreeDoc((p) => ({ ...p, showShowcaseRecords: e.target.checked }))} className="w-4 h-4 accent-emerald-600" />
            লাইভ প্ল্যান্ট হেলথ কেস স্টাডি দেখান
          </label>
        </div>
      )}

      {/* 5. NEWSLETTER SUBSCRIBERS */}
      {sub === "newsletter" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-800 text-sm">সাবস্ক্রাইবকৃত ইমেইল তালিকা ({subscribers.length})</h3>
            <button type="button" onClick={exportSubscribersCsv} className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold cursor-pointer">⬇️ CSV ডাউনলোড</button>
          </div>
          {subscribers.length === 0 ? (
            <p className="text-center py-8 text-xs text-stone-400">এখনো কোনো নিউজলেটার সাবস্ক্রাইবার নেই।</p>
          ) : (
            <div className="divide-y divide-stone-100">
              {subscribers.map((s) => (
                <div key={s.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-stone-800">{s.email}</p>
                    <p className="text-stone-400 font-mono">Source: {s.source || "footer"} • {new Date(s.subscribedAt).toLocaleDateString()}</p>
                  </div>
                  <button type="button" onClick={() => deleteSubscriber(s.id)} className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 font-bold cursor-pointer">✕ মুছুন</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <StandaloneToast message={toast} type={toast.startsWith("❌") ? "error" : "success"} visible={!!toast} />
    </div>
  );
}

