"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface EstimatorProps {
  isModal?: boolean;
  onClose?: () => void;
}

interface EstimateResult {
  min: string;
  max: string;
}

export default function Estimator({ isModal, onClose }: EstimatorProps) {
  const { language, t } = useLanguage();
  const [gardenType, setGardenType] = useState<string>("rooftop");
  const [gardenSize, setGardenSize] = useState<number>(150);
  const [budgetTier, setBudgetTier] = useState<string>("premium");
  const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null);
  const [estimatorSubmitted, setEstimatorSubmitted] = useState<boolean>(false);
  const [contactPhone, setContactPhone] = useState<string>("");

  const handleCalculateEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rates: Record<string, number> = {
      rooftop: 120,
      vertical: 220,
      backyard: 95,
      indoor: 70
    };

    const multipliers: Record<string, number> = {
      standard: 1.0,
      premium: 1.6,
      luxury: 2.5
    };

    const baseRate = rates[gardenType] || 100;
    const multiplier = multipliers[budgetTier] || 1.0;
    
    const calculatedBase = baseRate * gardenSize * multiplier;
    const minEstimate = Math.round(calculatedBase * 0.9);
    const maxEstimate = Math.round(calculatedBase * 1.15);

    setEstimateResult({
      min: minEstimate.toLocaleString("en-US"),
      max: maxEstimate.toLocaleString("en-US")
    });
    setEstimatorSubmitted(false);
  };

  const formContent = (
    <div className="w-full">
      <div className="text-center max-w-2xl mx-auto flex flex-col gap-3 mb-8">
        <span className="text-[13px] font-semibold tracking-wider text-emerald-800 uppercase">
          {t("তাৎক্ষণিক খরচ নিরূপণ", "Instant Valuation")}
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
          {t("বাগানের সাইজ ও বাজেট ক্যালকুলেটর", "Garden Size & Budget Estimator")}
        </h2>
        <p className="text-gray-600 text-xs md:text-sm">
          {t(
            "আপনার কাঙ্ক্ষিত ল্যান্ডস্কেপিং প্রকল্পের জন্য আমাদের স্ট্যান্ডার্ড প্রাইসিং মডেলের ভিত্তিতে তাৎক্ষণিক বাজেট অনুমান দেখুন।",
            "Get an instant cost assessment range for your customized landscaping project based on our standard pricing model."
          )}
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
              <option value="rooftop">{t("ছাদবাগান সেটআপ (Rooftop Garden)", "Rooftop Garden Setup")}</option>
              <option value="vertical">{t("ভার্টিক্যাল গ্রিন ওয়াল (Vertical Wall)", "Vertical Wall Greenery")}</option>
              <option value="backyard">{t("বাড়ির আঙিনা ও ল্যান্ডস্কেপ (Backyard)", "Backyard Landscaping")}</option>
              <option value="indoor">{t("ইনডোর প্ল্যান্ট কালেকশন (Indoor)", "Indoor Plant Collection")}</option>
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
              min="30" 
              max="1200" 
              step="10"
              value={gardenSize} 
              onChange={(e) => setGardenSize(parseInt(e.target.value, 10))}
              aria-label="Garden Size Slider"
              className="w-full accent-emerald-700 h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>30 sq ft</span>
              <span>1,200 sq ft</span>
            </div>
          </div>

          {/* Budget Tier Buttons */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-gray-800">
              {t("ম্যাটেরিয়াল ও ফিনিশিং কোয়ালিটি", "Material Quality Standard")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "standard", labelBn: "স্ট্যান্ডার্ড", labelEn: "Standard" },
                { id: "premium", labelBn: "প্রিমিয়াম", labelEn: "Premium" },
                { id: "luxury", labelBn: "লাক্সারি", labelEn: "Luxury" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setBudgetTier(tier.id)}
                  className={`py-2.5 rounded-xl text-[13px] font-semibold border transition-all duration-300 cursor-pointer ${
                    budgetTier === tier.id 
                      ? "bg-emerald-800 text-white border-emerald-800 shadow"
                      : "bg-white text-gray-700 border-gray-200 hover:border-emerald-600"
                  }`}
                >
                  {language === "bn" ? tier.labelBn : tier.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Submit btn */}
          <button 
            type="submit" 
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-[15px] py-4 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
          >
            {t("বাজেট হিসাব করুন", "Calculate Valuation")}
          </button>
        </div>

        {/* Results Side */}
        <div className="h-full flex flex-col justify-center items-center bg-white/70 border border-gray-200 rounded-2xl p-8 min-h-[280px] text-center">
          {estimateResult ? (
            <div className="flex flex-col gap-6 animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl text-emerald-800 mx-auto">
                💰
              </div>
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-gray-500">
                  {t("আনুমানিক বাজেট রেঞ্জ", "Estimated Budget Range")}
                </p>
                <p className="text-2xl md:text-3xl font-serif font-bold text-emerald-800 mt-2">
                  ৳{estimateResult.min} - ৳{estimateResult.max} BDT
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {t(
                    "গাছপালা, জৈব মাটির মিশ্রণ, ড্রেনেজ লেয়ার এবং প্রাথমিক ডিজাইনিং অন্তর্ভুক্ত",
                    "Estimations include plants, substrate media, drainage, and structural styling"
                  )}
                </p>
              </div>
              
              {estimatorSubmitted ? (
                <div className="bg-emerald-100 text-emerald-800 text-[14px] font-medium p-3 rounded-lg">
                  {t("রিকোয়েস্ট পাঠানো হয়েছে! আমাদের টিম শীঘ্রই যোগাযোগ করবে।", "Request Sent! Our team will contact you.")}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <input 
                    type="tel"
                    required
                    placeholder={t("আপনার মোবাইল নম্বর", "Your Phone Number")}
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="bg-white border border-gray-200 text-gray-800 py-2 px-3 rounded-lg text-xs w-full focus:outline-none focus:border-emerald-700 text-center"
                  />
                  <button
                    type="button"
                    onClick={() => { if (contactPhone) setEstimatorSubmitted(true); }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[14px] px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    {t("ডিজাইন টিমের সাথে শেয়ার করুন", "Send This Estimate to Design Team")}
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
