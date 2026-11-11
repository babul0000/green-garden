"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { DEFAULT_LOYALTY_CONFIG, type LoyaltyConfig } from "@/types/cms";
import type { AuthUser } from "@/lib/auth";

interface LoyaltyTabProps {
  user: AuthUser | null;
}

export default function LoyaltyTab({ user }: LoyaltyTabProps) {
  const { t } = useLanguage();
  const { getSection, config, txt } = useSiteConfig();

  const loyalty = getSection<LoyaltyConfig>("loyalty_config", DEFAULT_LOYALTY_CONFIG);
  const phone = config?.site_config?.phone || "01883012641";
  const whatsappRaw = String(config?.site_config?.whatsapp || "8801883012641").replace(/[^0-9]/g, "");

  const userPoints = Number((user as any)?.loyaltyPoints ?? 0);
  const vipThreshold = Math.max(100, Number(loyalty.vipThresholdPoints || 1000));
  const progressPercent = Math.min(100, Math.round((userPoints / vipThreshold) * 100));
  const referralCode = user?.id ? `ARGG-${user.id.slice(-6).toUpperCase()}` : "ARGG-STUDIO";

  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleClaimItem = async (itemId: string, label: string, details: string) => {
    setClaimingId(itemId);
    setNotice(null);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: user?.name || "VIP Client",
          clientPhone: user?.phone || phone,
          serviceCategory: label,
          siteAddress: "Client Registered Property",
          notes: `${details} | Email: ${user?.email || "N/A"} | Ref Code: ${referralCode}`,
          userId: user?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({
          type: "error",
          text: data.error || t("অনুরোধ পাঠানো সম্ভব হয়নি।", "Could not submit your claim request."),
        });
        return;
      }
      setNotice({
        type: "success",
        text: t(
          `সফল! "${label}" এর জন্য আপনার অনুরোধ কনসিয়ার্জ টিমের কাছে পাঠানো হয়েছে।`,
          `Confirmed! Your request for "${label}" has been queued with our concierge team.`
        ),
      });
    } catch {
      setNotice({
        type: "error",
        text: t("সার্ভার সংযোগে সমস্যা হয়েছে।", "Network error submitting your claim."),
      });
    } finally {
      setClaimingId(null);
    }
  };

  const referralShareText = encodeURIComponent(
    `Join ${config?.site_config?.companyName || "A R Green Garden"} with my referral code ${referralCode}!`
  );

  return (
    <div className="space-y-8 mt-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
            {t(loyalty.badgeBn, loyalty.badgeEn)}
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7] mt-0.5">
            {t(loyalty.titleBn, loyalty.titleEn)}
          </h3>
          <p className="text-xs text-white/60 mt-1 max-w-2xl leading-relaxed">
            {t(loyalty.subtitleBn, loyalty.subtitleEn)}
          </p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl px-4 py-2.5 text-right shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 block">
            {t("আপনার অর্জিত পয়েন্ট", "Earned Green Points")}
          </span>
          <span className="text-2xl font-display font-bold text-white">
            {userPoints.toLocaleString()} <span className="text-xs font-mono text-emerald-400">PTS</span>
          </span>
        </div>
      </div>

      {notice && (
        <div
          className={`px-4 py-3 rounded-2xl border text-xs font-medium flex items-center justify-between ${
            notice.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} className="text-white/50 hover:text-white ml-3 cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* VIP Progress + Referral Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
              🏆 {t("ভিআইপি স্ট্যাটাস প্রগ্রেস", "VIP Tier Progress")}
            </span>
            <span className="text-xs font-mono text-white/60">
              {userPoints} / {vipThreshold} PTS
            </span>
          </div>
          <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-white/60">
            {userPoints >= vipThreshold
              ? t("অভিনন্দন! আপনি স্টুডিওর ভিআইপি প্রিভিলেজ সদস্য হিসেবে প্রাধান্য পাচ্ছেন।", "Congratulations! You have unlocked full Studio VIP priority care.")
              : t(
                  `ভিআইপি স্তরে পৌঁছাতে আরও ${Math.max(0, vipThreshold - userPoints)} পয়েন্ট প্রয়োজন।`,
                  `${Math.max(0, vipThreshold - userPoints)} more Green Points to unlock Studio VIP Priority Care.`
                )}
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#0e2116] to-[#132f1e] rounded-3xl p-6 border border-emerald-500/30 space-y-3">
          <h4 className="text-base font-display font-bold text-[#E4E2D7]">
            🎁 {t(loyalty.referralBonusTitleBn, loyalty.referralBonusTitleEn)}
          </h4>
          <p className="text-xs text-white/70 leading-relaxed">
            {t(loyalty.referralBonusDescBn, loyalty.referralBonusDescEn)}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 font-mono text-xs font-bold text-emerald-300">
              {referralCode}
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-mono font-bold text-white transition-all cursor-pointer"
            >
              {copiedCode ? t("✓ কপি হয়েছে", "✓ Copied") : t("কোড কপি করুন", "Copy Code")}
            </button>
            <a
              href={`https://wa.me/${whatsappRaw}?text=${referralShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20b858] text-stone-950 text-xs font-mono font-bold transition-all"
            >
              💬 {t("হোয়াটসঅ্যাপে শেয়ার", "Share on WhatsApp")}
            </a>
          </div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="space-y-4">
        <h4 className="text-lg font-display font-bold text-[#E4E2D7]">
          🌿 {t("উপলব্ধ লয়্যালটি রিওয়ার্ডস", "Available Loyalty Rewards")}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(loyalty.rewards || []).map((reward) => {
            const title = t(reward.titleBn, reward.titleEn);
            const busy = claimingId === reward.id;
            return (
              <div
                key={reward.id}
                className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-5 border border-white/10 flex flex-col justify-between gap-4 hover:border-emerald-500/40 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{reward.icon || "🎁"}</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                      {reward.pointsCost} PTS
                    </span>
                  </div>
                  <h5 className="font-display font-bold text-base text-[#E4E2D7]">{title}</h5>
                  <p className="text-xs text-white/60 leading-relaxed">{t(reward.descBn, reward.descEn)}</p>
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    handleClaimItem(
                      reward.id,
                      `Loyalty Reward: ${title}`,
                      `Points Cost: ${reward.pointsCost} | Reward ID: ${reward.id}`
                    )
                  }
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-stone-950 font-mono font-bold text-xs transition-all cursor-pointer"
                >
                  {busy
                    ? txt("common.loading", "লোড হচ্ছে...", "Loading...")
                    : txt("portal.claimBtn", "রিওয়ার্ড ক্লেইম করুন", "Claim Reward")}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Annual Care Packages */}
      {(loyalty.packages || []).length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-display font-bold text-[#E4E2D7]">
            🛡️ {t("বার্ষিক ও মাসিক গার্ডেন কেয়ার প্যাকেজ", "Garden Care Subscription Packages")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loyalty.packages.map((pkg) => {
              const pkgName = t(pkg.nameBn, pkg.nameEn);
              const features = t("bn", "en") === "bn" ? pkg.featuresBn : pkg.featuresEn;
              const busy = claimingId === pkg.id;
              return (
                <div
                  key={pkg.id}
                  className={`rounded-3xl p-6 border flex flex-col justify-between gap-5 transition-all ${
                    pkg.highlighted
                      ? "bg-gradient-to-b from-emerald-950/60 to-black/50 border-emerald-400/50 shadow-xl"
                      : "bg-white/[0.03] border-white/10"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                        {t(pkg.frequencyBn, pkg.frequencyEn)}
                      </span>
                      {pkg.highlighted && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-stone-950 text-[10px] font-mono font-bold">
                          ★ {t("জনপ্রিয়", "Popular")}
                        </span>
                      )}
                    </div>
                    <h5 className="text-lg font-display font-bold text-[#E4E2D7]">{pkgName}</h5>
                    <p className="text-2xl font-display font-bold text-emerald-300">
                      {t(pkg.priceBn, pkg.priceEn)}
                    </p>
                    <ul className="space-y-1.5 pt-2 border-t border-white/10 text-xs text-white/75">
                      {(features || []).map((f, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      handleClaimItem(
                        pkg.id,
                        `Care Package Subscription: ${pkgName}`,
                        `Package Price: ${t(pkg.priceBn, pkg.priceEn)} (${t(pkg.frequencyBn, pkg.frequencyEn)})`
                      )
                    }
                    className={`w-full py-2.5 px-4 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer disabled:opacity-50 ${
                      pkg.highlighted
                        ? "bg-emerald-400 hover:bg-emerald-300 text-stone-950"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {busy
                      ? txt("common.loading", "লোড হচ্ছে...", "Loading...")
                      : t("প্যাকেজ অ্যাক্টিভেট করুন", "Activate Care Plan")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
