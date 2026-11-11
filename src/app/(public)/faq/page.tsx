"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface FaqItem {
  id: string;
  questionBn: string;
  questionEn: string;
  answerBn: string;
  answerEn: string;
  category?: string;
}

interface FaqConfig {
  badgeEn?: string;
  badgeBn?: string;
  titleEn?: string;
  titleBn?: string;
  subtitleEn?: string;
  subtitleBn?: string;
  items?: FaqItem[];
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "def-1",
    category: "Architecture & Safety",
    questionBn: "ছাদবাগানের জন্য ছাদে আলাদা ওয়াটারপ্রুফিং বা ড্যাম্প প্রোটেকশন কিভাবে করা হয়?",
    questionEn: "How do you waterproof slabs before rooftop landscaping?",
    answerBn:
      "আমরা টরচ-অন বিটুমিন মেমব্রেন, পলিউরেথেন কোট এবং ইতালিয়ান ডিম্পল ড্রেনেজ সেল ব্যবহার করি যাতে বিল্ডিং ছাদ সম্পূর্ণ সুরক্ষিত থাকে।",
    answerEn:
      "We install multi-layer elastomeric coatings, root barriers, and drainage cell mats engineered to keep your concrete slab 100% dry.",
  },
  {
    id: "def-2",
    category: "Pricing & Timeline",
    questionBn: "একটি ছাদবাগান তৈরি করতে কত দিন সময় এবং কেমন খরচ লাগে?",
    questionEn: "What is the typical timeline and cost range for a rooftop project?",
    answerBn:
      "গড়পড়তা ১,০০০ বর্গফুটের একটি সম্পূর্ণ আর্কিটেকচারাল ছাদবাগান ডিজাইন ও বাস্তবায়নে ১৮ থেকে ২৫ কর্মদিবস লাগে। প্রতি বর্গফুটের হিসাব আমাদের এস্টিমেটর পেজ থেকে দেখা যাবে।",
    answerEn:
      "A typical 1,000 sq. ft. bespoke rooftop garden takes 18–25 working days from architectural drawing to handover.",
  },
];

export default function FAQPage() {
  const { language } = useLanguage();
  const { config, txt } = useSiteConfig();
  const bn = language === "bn";

  const hideStaticFallbacks = Boolean(config.homepage_sections?.hideStaticFallbacks);
  const [faqCfg, setFaqCfg] = useState<FaqConfig>((config.faq_config as FaqConfig) || {});
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/settings?key=faq_config&_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.value) setFaqCfg(data.value);
      })
      .catch(() => {});
  }, []);

  const items: FaqItem[] =
    Array.isArray(faqCfg.items) && faqCfg.items.length > 0
      ? faqCfg.items
      : hideStaticFallbacks
      ? []
      : DEFAULT_FAQS;

  const badge = bn
    ? faqCfg.badgeBn || "নলেজ বেস • সাধারণ জিজ্ঞাসা"
    : faqCfg.badgeEn || "Knowledge Base • FAQ";
  const title = bn
    ? faqCfg.titleBn || "প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী"
    : faqCfg.titleEn || "Frequently Asked Questions";
  const subtitle = bn
    ? faqCfg.subtitleBn || txt("faq.subtitle", "ছাদবাগান, মেইনটেনেন্স ও খরচ সম্পর্কে সর্বাধিক জিজ্ঞাসিত প্রশ্নোত্তর।", "")
    : faqCfg.subtitleEn || txt("faq.subtitle", "", "Frequently asked questions about rooftop architecture, pricing, and plant care.");

  return (
    <div className="min-h-screen bg-[#fafafa] pt-28 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/70 text-[11px] font-mono uppercase tracking-[0.18em] text-emerald-800">
            {badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#142a1b]">{title}</h1>
          <p className="text-sm md:text-base text-stone-600 leading-relaxed">{subtitle}</p>
        </div>

        {/* Accordion */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-3xl text-stone-400 text-sm">
            {bn ? "এখনো কোনো প্রশ্নোত্তর যোগ করা হয়নি।" : "No FAQ entries available yet."}
          </div>
        ) : (
          <div className="space-y-3.5">
            {items.map((item, idx) => {
              const id = item.id || `faq-${idx}`;
              const isOpen = openId === id;
              const q = bn ? item.questionBn || item.questionEn : item.questionEn || item.questionBn;
              const a = bn ? item.answerBn || item.answerEn : item.answerEn || item.answerBn;

              return (
                <div
                  key={id}
                  className="bg-white border border-stone-200/90 rounded-2xl p-5 md:p-6 shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : id)}
                    className="w-full flex items-center justify-between gap-4 text-left font-bold text-[#142a1b] text-sm md:text-base cursor-pointer"
                  >
                    <div className="space-y-1">
                      {item.category && (
                        <span className="block text-[10px] font-mono uppercase tracking-wider text-emerald-700">
                          {item.category}
                        </span>
                      )}
                      <span>{q}</span>
                    </div>
                    <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center text-lg shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-4 pt-4 border-t border-stone-100 text-xs md:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
                      {a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 bg-[#142a1b] text-white rounded-3xl p-8 md:p-10 text-center space-y-4">
          <h3 className="text-xl md:text-2xl font-serif font-bold">
            {txt("faq.ctaTitle", "আরও কোনো প্রশ্ন আছে?", "Still have a specific architectural question?")}
          </h3>
          <p className="text-xs md:text-sm text-emerald-100/80 max-w-lg mx-auto">
            {bn
              ? "আমাদের ল্যান্ডস্কেপ আর্কিটেক্টদের সাথে সরাসরি কথা বলে আপনার প্রজেক্টের সঠিক পরামর্শ নিন।"
              : "Consult directly with our senior landscape architects and agronomists for tailored advice."}
          </p>
          <div className="pt-2 flex justify-center gap-3 flex-wrap">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs transition-colors"
            >
              {txt("common.bookConsultation", "সাইট ভিজিট বুক করুন", "Book Site Audit")}
            </Link>
            <a
              href={`tel:${(config.site_config.phone || "").replace(/\s+/g, "")}`}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
            >
              📞 {txt("common.callNow", "সরাসরি কল করুন", "Call Studio")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
