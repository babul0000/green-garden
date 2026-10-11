"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface NavDrawerQuickActionsProps {
  enable3dWizardLink?: boolean;
  enableEmergencyDoctor?: boolean;
  onTriggerEstimator: () => void;
  onTriggerTreeDoctor: () => void;
  onClose: () => void;
}

export default function NavDrawerQuickActions({
  enable3dWizardLink = true,
  enableEmergencyDoctor = true,
  onTriggerEstimator,
  onTriggerTreeDoctor,
  onClose,
}: NavDrawerQuickActionsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 font-display font-light pt-5 border-t border-[#D6D2C4]">
      {/* 1. 3D Garden Wizard Link */}
      {enable3dWizardLink !== false && (
        <Link
          href="/design-garden"
          onClick={onClose}
          className="text-base sm:text-lg font-normal text-[#2B4D33] hover:text-[#121813] transition-colors block group"
        >
          <div className="flex items-center gap-2">
            <span>🎨 {t("3D Garden Wizard", "3D Garden Wizard")}</span>
            <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
          </div>
          <span className="text-xs font-sans text-[#323232]/70 block mt-0.5 font-normal">
            {t("কাস্টম ছাদবাগান বাজেট ও ইন্টারেক্টিভ নকশা", "Interactive Landscape Estimator & Design")}
          </span>
        </Link>
      )}

      {/* 2. Instant Cost Estimator Modal Trigger */}
      <button
        type="button"
        onClick={onTriggerEstimator}
        className="text-left text-base sm:text-lg font-normal text-[#C85A32] hover:text-[#121813] transition-colors block w-full cursor-pointer group"
      >
        <div className="flex items-center gap-2">
          <span>🧮 {t("Instant Cost Estimator", "Instant Cost Estimator")}</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
        </div>
        <span className="text-xs font-sans text-[#323232]/70 block mt-0.5 font-normal">
          {t("স্কয়ার ফিট হিসাব ও তাৎক্ষণিক বাজেট কোটেশন", "Instant SQFT Budget Calculator")}
        </span>
      </button>

      {/* 3. Emergency Tree Doctor Modal Trigger */}
      {enableEmergencyDoctor !== false && (
        <button
          type="button"
          onClick={onTriggerTreeDoctor}
          className="text-base sm:text-lg font-normal text-rose-800 hover:text-rose-950 transition-colors block cursor-pointer text-left w-full group"
        >
          <div className="flex items-center gap-2">
            <span>🚨 {t("Emergency Tree Doctor", "Emergency Tree Doctor")}</span>
            <span className="text-xs group-hover:translate-x-1 transition-transform">➔</span>
          </div>
          <span className="text-xs font-sans text-rose-800/80 block mt-0.5 font-normal">
            {t("অন-কল ডাক্তার ভিজিট ও জরুরি বৃক্ষ চিকিৎসা", "Urgent Tree Clinic, Surgery & On-Site Visit")}
          </span>
        </button>
      )}
    </div>
  );
}
