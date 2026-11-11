"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { DEFAULT_ESTIMATOR_CONFIG, EstimatorConfig } from "@/types/cms";

interface EstimateResult {
  min: number;
  max: number;
  typeLabel: string;
  tierLabel: string;
}

interface EstimatorProps {
  isModal?: boolean;
  onClose?: () => void;
}

export default function Estimator({ isModal, onClose }: EstimatorProps) {
  const { language, t } = useLanguage();
  const { getSection, txt } = useSiteConfig();
  const cfg = getSection<EstimatorConfig>("estimator_config", DEFAULT_ESTIMATOR_CONFIG);

  const types = cfg.types?.length ? cfg.types : DEFAULT_ESTIMATOR_CONFIG.types;
  const tiers = cfg.tiers?.length ? cfg.tiers : DEFAULT_ESTIMATOR_CONFIG.tiers;
  const minArea = Number(cfg.minAreaSqft) > 0 ? Number(cfg.minAreaSqft) : 30;
  const maxArea = Number(cfg.maxAreaSqft) > minArea ? Number(cfg.maxAreaSqft) : 1200;

  const [gardenType, setGardenType] = useState<string>(types[0]?.id || "rooftop");
  const [gardenSize, setGardenSize] = useState<number>(
    Math.min(maxArea, Math.max(minArea, Number(cfg.defaultAreaSqft) || 150))
  );
  const [budgetTier, setBudgetTier] = useState<string>(tiers[1]?.id || tiers[0]?.id || "premium");
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);

  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [estimatorSubmitted, setEstimatorSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (types.length && !types.some((item) => item.id === gardenType)) {
      setGardenType(types[0].id);
    }
  }, [types, gardenType]);

  useEffect(() => {
    if (tiers.length && !tiers.some((item) => item.id === budgetTier)) {
      setBudgetTier(tiers[0].id);
    }
  }, [tiers, budgetTier]);

  useEffect(() => {
    const def = Number(cfg.defaultAreaSqft);
    if (def >= minArea && def <= maxArea) {
      setGardenSize(def);
    }
  }, [cfg.defaultAreaSqft, minArea, maxArea]);

  const handleCalculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    setEstimatorSubmitted(false);
    setSubmitError("");

    const selectedType = types.find((item) => item.id === gardenType) || types[0];
    const selectedTier = tiers.find((item) => item.id === budgetTier) || tiers[0];

    const rate = Number(selectedType?.ratePerSqft) || 120;
    const multiplier = Number(selectedTier?.multiplier) || 1.0;

    const baseCost = gardenSize * rate * multiplier;
    const min = Math.round(baseCost * 0.85);
    const max = Math.round(baseCost * 1.15);

    setEstimateResult({
      min,
      max,
      typeLabel: language === "bn" ? selectedType.labelBn : selectedType.labelEn,
      tierLabel: language === "bn" ? selectedTier.labelBn : selectedTier.labelEn,
    });
  };

  const handleSendToDesignTeam = async () => {
    const cleanPhone = contactPhone.trim();
    if (!cleanPhone) {
      setSubmitError(t("অনুগ্রহ করে মোবাইল নম্বর দিন।", "Please enter your phone number."));
      return;
    }
    if (!estimateResult) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const sanitized = cleanPhone.replace(/[^0-9a-zA-Z]/g, "") || "visitor";
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: contactName.trim() || t("এস্টিমেটর ভিজিটর", "Estimator Visitor"),
          clientEmail: `${sanitized}@estimate.argreengarden.local`,
          phone: cleanPhone,
          service: "Budget Estimator Quote",
          budgetRange: `৳${estimateResult.min.toLocaleString()} - ৳${estimateResult.max.toLocaleString()} ${cfg.currencyLabel || "BDT"}`,
          message: `Category: ${estimateResult.typeLabel} | Area: ${gardenSize} Sq.Ft | Finishing: ${estimateResult.tierLabel}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(data.error || t("পাঠানো যায়নি, আবার চেষ্টা করুন।", "Submission failed. Please try again."));
        return;
      }
      setEstimatorSubmitted(true);
    } catch {
      setSubmitError(t("নেটওয়ার্ক ত্রুটি, অনুগ্রহ করে কল করুন।", "Network error. Please call us directly."));
    } finally {
      setSubmitting(false);
    }
  };

  const activeTierObj = tiers.find((item) => item.id === budgetTier);

  const formContent = (
    <div className="w-full">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-3 mb-8">
        <span className="text-[13px] font-semibold tracking-wider text-emerald-800 uppercase">
          {language === "bn" ? cfg.badgeBn : cfg.badgeEn}
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
          {language === "bn" ? cfg.titleBn : cfg.titleEn}
        </h2>
        <p className="text-gray-600 text-xs md:text-sm">
          {language === "bn" ? cfg.subtitleBn : cfg.subtitleEn}
        </p>
      </div>

      <form onSubmit={handleCalculateEstimate} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Input Side */}
        <div className="flex flex-col gap-6">
          {/* Garden Type Select */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              {t("প্রজেক্ট ক্যাটাগরি", "Project Category")}
            </label>
            <select
              value={gardenType}
              onChange={(e) => setGardenType(e.target.value)}
              className="bg-white border border-gray-200 text-gray-800 py-3 px-4 rounded-xl text-xs md:text-sm focus:outline-none focus:border-emerald-700 transition-all"
            >
              {types.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {language === "bn" ? opt.labelBn : opt.labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Slider for size */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[14px]">
              <span className="font-bold text-gray-800">
                {t("জায়গার আয়তন", "Project Area Size")}
              </span>
              <span className="text-emerald-800 font-semibold">{gardenSize} Sq. Ft.</span>
            </div>
            <input
              type="range"
              min={minArea}
              max={maxArea}
              step={10}
              value={gardenSize}
              onChange={(e) => setGardenSize(parseInt(e.target.value, 10))}
              aria-label="Garden Size Slider"
              className="w-full accent-emerald-700 h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{minArea.toLocaleString()} sq ft</span>
              <span>{maxArea.toLocaleString()} sq ft</span>
            </div>
          </div>

          {/* Budget Tier Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              {t("ম্যাটেরিয়াল ও ফিনিশিং কোয়ালিটি", "Material Quality Standard")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {tiers.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setBudgetTier(tier.id)}
                  className={`py-2.5 px-2 rounded-xl text-[13px] font-semibold border transition-all duration-300 cursor-pointer ${
                    budgetTier === tier.id
                      ? "bg-emerald-800 text-white border-emerald-800 shadow"
                      : "bg-white text-gray-700 border-gray-200 hover:border-emerald-600"
                  }`}
                >
                  {language === "bn" ? tier.labelBn : tier.labelEn}
                </button>
              ))}
            </div>
            {activeTierObj && (activeTierObj.descBn || activeTierObj.descEn) && (
              <p className="text-[11px] text-emerald-700/80 font-medium mt-0.5">
                ✦ {language === "bn" ? activeTierObj.descBn : activeTierObj.descEn}
              </p>
            )}
          </div>

          {/* Submit btn */}
          <button
            type="submit"
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-[15px] py-4 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
          >
            {txt("estimator.calculateBtn", "বাজেট হিসাব করুন", "Calculate Valuation")}
          </button>
        </div>

        {/* Results Side */}
        <div className="h-full flex flex-col justify-center items-center bg-white/70 border border-gray-200 rounded-2xl p-8 min-h-[280px] text-center">
          {estimateResult ? (
            <div className="flex flex-col gap-5 animate-fade-in-up w-full">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl text-emerald-800 mx-auto">
                💰
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">
                  {t("আনুমানিক বাজেট রেঞ্জ", "Estimated Budget Range")}
                </p>
                <p className="text-2xl md:text-3xl font-serif font-bold text-emerald-800 mt-2">
                  ৳{estimateResult.min.toLocaleString()} - ৳{estimateResult.max.toLocaleString()}{" "}
                  {cfg.currencyLabel || "BDT"}
                </p>
                <p className="text-[11px] text-gray-500 mt-2">
                  {language === "bn" ? cfg.disclaimerBn : cfg.disclaimerEn}
                </p>
              </div>

              {estimatorSubmitted ? (
                <div className="bg-emerald-100 text-emerald-800 text-[14px] font-medium p-3.5 rounded-xl border border-emerald-200">
                  ✅{" "}
                  {t(
                    "রিকোয়েস্ট সংরক্ষিত হয়েছে! আমাদের আর্কিটেক্ট টিম শীঘ্রই যোগাযোগ করবে।",
                    "Request saved to our studio desk! Our design team will contact you shortly."
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <input
                    type="text"
                    placeholder={t("আপনার নাম (ঐচ্ছিক)", "Your Name (Optional)")}
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-700 text-center"
                  />
                  <input
                    type="tel"
                    required
                    placeholder={t("আপনার মোবাইল নম্বর *", "Your Phone Number *")}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-700 text-center"
                  />
                  {submitError && (
                    <p className="text-xs text-rose-600 font-semibold">{submitError}</p>
                  )}
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleSendToDesignTeam}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[14px] px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer disabled:opacity-60"
                  >
                    {submitting
                      ? t("পাঠানো হচ্ছে...", "Sending...")
                      : language === "bn"
                      ? cfg.submitLabelBn
                      : cfg.submitLabelEn}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-gray-400">
              <div className="text-4xl">📊</div>
              <h4 className="font-bold font-serif text-lg text-gray-700">
                {t("ইনপুট প্রদান করুন", "Awaiting Inputs")}
              </h4>
              <p className="text-sm max-w-[250px] leading-relaxed">
                {t(
                  "প্রজেক্টের ধরন, সাইজ এবং কোয়ালিটি নির্বাচন করে 'বাজেট হিসাব করুন' বাটনে চাপ দিন।",
                  "Set your project type, select sizes and quality tiers, and hit calculate to generate estimates instantly."
                )}
              </p>
            </div>
          )}
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 md:p-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors p-2 text-xl font-bold cursor-pointer"
            aria-label={t("বন্ধ করুন", "Close")}
          >
            ✕
          </button>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <section id="estimator" className="py-20 px-6 max-w-5xl mx-auto">
      {formContent}
    </section>
  );
}
