"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function WhyUs() {
  const { language, t } = useLanguage();

  const points = [
    {
      number: "01",
      icon: "🛡️",
      titleBn: "১০০% ওয়াটারপ্রুফ গ্যারান্টি",
      titleEn: "100% Leak-Proof Rooftop Guarantee",
      descBn: "উন্নত মাল্টি-লেয়ার মেমব্রেন ও জার্মান ড্রেনেজ সেল প্রযুক্তি ব্যবহারের ফলে আপনার ছাদ বা ভবনে কোনো প্রকার ড্যাম্প বা পানির লিকেজ হওয়ার কোনো ঝুঁকি থাকে না।",
      descEn: "Using multi-layer elastomeric membranes and German dimple drainage cell technology, ensuring absolute zero water leakage or building dampness.",
    },
    {
      number: "02",
      icon: "🩺",
      titleBn: "বিশেষজ্ঞ ট্রি ডক্টর সার্ভিস",
      titleEn: "Certified Tree Doctor & Plant Care",
      descBn: "গাছের রোগ নির্ণয়, পোকা দমন, ভিটামিন প্রয়োগ এবং গাছ সুস্থ রাখার জন্য আমাদের রয়েছে অভিজ্ঞ ডেডিকেটেড ট্রি ডক্টর টিম।",
      descEn: "Beyond planting, our dedicated agronomists and plant pathologists provide clinical diagnosis, pest management, and ongoing tree health revival.",
    },
    {
      number: "03",
      icon: "💧",
      titleBn: "স্মার্ট অটোমেটিক ইরিগেশন",
      titleEn: "Smart Automated Drip Irrigation",
      descBn: "ডিজিটাল টাইমার নিয়ন্ত্রিত ড্রিপ ও স্প্রিংকলার সিস্টেম, যা ৭০% পর্যন্ত পানি সাশ্রয় করে এবং মানুষের অনুপস্থিতিতেও গাছে সঠিক পরিমাণে পানি নিশ্চিত করে।",
      descEn: "WiFi and timer-controlled micro-drip networks that save up to 70% water while delivering precise root-zone hydration effortlessly.",
    },
    {
      number: "04",
      icon: "🗓️",
      titleBn: "নিয়মিত মেইনটেন্যান্স সাপোর্ট",
      titleEn: "Scheduled Garden Maintenance",
      descBn: "সাপ্তাহিক ও মাসিক শিডিউল অনুযায়ী মালীদের নিয়মিত পরিচর্যা, লন কাটিং, প্রুনিং এবং জৈব সার প্রয়োগের নিশ্চয়তা।",
      descEn: "Regular scheduled visits by trained gardeners for grass mowing, canopy pruning, soil aeration, and balanced organic fertilizing.",
    },
    {
      number: "05",
      icon: "💰",
      titleBn: "স্বচ্ছ কোটেশন ও ফেয়ার প্রাইসিং",
      titleEn: "Itemized & Transparent Pricing",
      descBn: "প্রতিটি গাছ, মাটি, টব, লেবার ও ম্যাটেরিয়ালের আলাদা হিসাবসহ স্পষ্ট কোটেশন দেওয়া হয়, যাতে কোনো গোপন বা অতিরিক্ত খরচ থাকে না।",
      descEn: "Clear, itemized proposals accounting for every plant, substrate mix, planter, and labor hour with no hidden expenses.",
    },
    {
      number: "06",
      icon: "🏆",
      titleBn: "এক দশকের বাস্তব অভিজ্ঞতা",
      titleEn: "A Decade of Urban Greening",
      descBn: "ধানমন্ডি, গুলশান, বনানী, উত্তরা সহ ঢাকা শহরের শত শত লাক্সারি ভিলা, পেন্টহাউস এবং কর্পোরেট অফিসে ল্যান্ডস্কেপিংয়ের বাস্তব অভিজ্ঞতা।",
      descEn: "Proven delivery track record across hundreds of luxury penthouses, commercial headquarters, and private villas in Dhaka and beyond.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                {t("Why Choose AR Green Garden?", "Why Choose AR Green Garden?")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                {t("Guaranteed Architectural Excellence", "Guaranteed Architectural Excellence")}
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              {t(
                "আমরা এমন জীবন্ত ল্যান্ডস্কেপ গড়ে তুলি যা দীর্ঘস্থায়ী হয়। আমাদের কাঠামোগত নিরাপত্তা ও বোটানিক্যাল দক্ষতা বাংলাদেশের মানদণ্ড নির্ধারণ করে।",
                "We engineer living ecosystems that endure. Our structural guarantees and horticultural expertise set the benchmark for landscape architecture in Bangladesh."
              )}
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        {/* 6 Trust Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((p) => (
            <div
              key={p.number}
              className="bg-white rounded-3xl p-8 border border-stone-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#2B4D33] flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#E4E2D7] text-[#121813] flex items-center justify-center text-xl shadow-inner">
                    {p.icon}
                  </div>
                  <span className="font-mono text-xs font-bold text-[#75787B] group-hover:text-[#2B4D33] transition-colors">
                    {p.number}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-[#121813] leading-snug">
                    {p.titleEn}
                  </h3>
                </div>

                <p className="font-sans text-xs sm:text-sm text-[#75787B] leading-relaxed">
                  {language === "bn" ? p.descBn : p.descEn}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <span className="font-mono text-[11px] text-[#2B4D33] font-semibold">
                  {t("বিশ্বস্ত নিশ্চয়তা", "Engineered Standard")}
                </span>
                <span className="text-sm font-bold text-[#2B4D33]">✓</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#18221A] text-white p-8 sm:p-12 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="font-display text-2xl font-bold">
              {t("Ready to Bring Nature to Your Space?", "Ready to Bring Nature to Your Space?")}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-stone-300">
              {t(
                "আমাদের আর্কিটেক্ট দল আপনার সাইট ভিজিট করে সম্পূর্ণ বিনামূল্যে প্রাথমিক পরামর্শ প্রদান করবেন।",
                "Our architectural team can visit your site to evaluate structural load, sunlight, and drainage."
              )}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/design-garden"
              className="px-6 py-3 bg-[#E4E2D7] hover:bg-white text-[#18221A] font-mono text-xs uppercase tracking-wider font-bold rounded-full transition-all shadow"
            >
              {t("ক্যালকুলেটর শুরু করুন", "Launch Wizard")}
            </Link>
            <a
              href="tel:01883012641"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider font-semibold rounded-full transition-all border border-white/20"
            >
              {t("হটলাইনে কল করুন", "Call Hotline")}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
