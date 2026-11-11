"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { DEFAULT_LEGAL_CONFIG, LegalConfig, LegalPageData } from "@/types/cms";

interface LegalPageClientProps {
  pageKey: keyof LegalConfig;
}

export default function LegalPageClient({ pageKey }: LegalPageClientProps) {
  const { language, t } = useLanguage();
  const { getSection, txt, config } = useSiteConfig();

  const legalCfg = getSection<LegalConfig>("legal_config", DEFAULT_LEGAL_CONFIG);
  const data: LegalPageData = legalCfg[pageKey] || DEFAULT_LEGAL_CONFIG[pageKey];
  const bn = language === "bn";

  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-stone-200 rounded-[28px] p-8 md:p-12 shadow-sm">
          {/* Header */}
          <div className="border-b border-stone-100 pb-8 mb-8">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-800 mb-4">
              {bn ? data.badgeBn : data.badgeEn}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#142a1b] tracking-tight">
              {bn ? data.titleBn : data.titleEn}
            </h1>
            <p className="text-stone-600 text-sm md:text-base mt-3 leading-relaxed">
              {bn ? data.subtitleBn : data.subtitleEn}
            </p>
            <p className="text-xs font-mono text-stone-400 mt-4">
              {bn ? data.effectiveDateBn : data.effectiveDateEn}
            </p>
          </div>

          {/* Optional Admin Notice Banner */}
          {data.noticeBannerActive && (bn ? data.noticeBannerBn : data.noticeBannerEn) && (
            <div className="mb-8 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm font-medium flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{bn ? data.noticeBannerBn : data.noticeBannerEn}</span>
            </div>
          )}

          {/* Sections */}
          <div className="space-y-8 text-stone-700 leading-relaxed">
            {(data.sections || []).map((sec, idx) => {
              const bullets = bn ? sec.bulletsBn : sec.bulletsEn;
              return (
                <section key={sec.id || idx} className="space-y-2.5">
                  <h2 className="text-lg md:text-xl font-bold text-[#142a1b] font-serif">
                    {bn ? sec.headingBn : sec.headingEn}
                  </h2>
                  {(bn ? sec.bodyBn : sec.bodyEn) && (
                    <p className="text-sm md:text-[15px] text-stone-600 whitespace-pre-line">
                      {bn ? sec.bodyBn : sec.bodyEn}
                    </p>
                  )}
                  {Array.isArray(bullets) && bullets.length > 0 && (
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-stone-600 pt-1">
                      {bullets.map((b, bIdx) => (
                        <li key={bIdx}>{b}</li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })}
          </div>

          {/* Footer Contact Note */}
          <div className="mt-12 pt-8 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-stone-500">
            <div>
              <p className="font-semibold text-stone-700">
                {bn ? config.site_config.companyNameBn : config.site_config.companyName}
              </p>
              <p>
                {config.site_config.contactEmail} • {config.site_config.phone}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/contact"
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-semibold hover:bg-emerald-900 transition-colors"
              >
                {t("যোগাযোগ করুন", "Contact Studio")}
              </Link>
              <Link
                href="/"
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 font-semibold hover:bg-stone-50 transition-colors"
              >
                {txt("common.backHome", "হোমপেজে ফিরে যান", "Back to Home")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

