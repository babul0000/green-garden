"use client";

import React from "react";
import Link from "next/link";

export default function WhyUs() {
  const points = [
    {
      number: "01",
      icon: "🛡️",
      title: "১০০% ওয়াটারপ্রুফ গ্যারান্টি",
      subtitle: "100% Leak-Proof Rooftop Guarantee",
      desc: "উন্নত মাল্টি-লেয়ার মেমব্রেন ও জার্মান ড্রেনেজ সেল প্রযুক্তি ব্যবহারের ফলে আপনার ছাদ বা ভবনে কোনো প্রকার ড্যাম্প বা পানির লিকেজ হওয়ার কোনো ঝুঁকি থাকে না।",
    },
    {
      number: "02",
      icon: "🩺",
      title: "বিশেষজ্ঞ ট্রি ডক্টর সার্ভিস",
      subtitle: "Certified Tree Doctor & Plant Pathology",
      desc: "শুধু গাছ লাগানো নয়, গাছের রোগ নির্ণয়, পোকা দমন, ভিটামিন প্রয়োগ এবং গাছ সুস্থ রাখার জন্য আমাদের রয়েছে অভিজ্ঞ ডেডিকেটেড ট্রি ডক্টর টিম।",
    },
    {
      number: "03",
      icon: "💧",
      title: "স্মার্ট অটোমেটিক ইরিগেশন",
      subtitle: "Smart Automated Drip & Sprinkler",
      desc: "ডিজিটাল টাইমার নিয়ন্ত্রিত ড্রিপ ও স্প্রিংকলার সিস্টেম, যা ৭০% পর্যন্ত পানি সাশ্রয় করে এবং মানুষের অনুপস্থিতিতেও গাছে সঠিক পরিমাণে পানি নিশ্চিত করে।",
    },
    {
      number: "04",
      icon: "🗓️",
      title: "নিয়মিত মেইনটেন্যান্স সাপোর্ট",
      subtitle: "Scheduled Garden Maintenance",
      desc: "সাপ্তাহিক ও মাসিক শিডিউল অনুযায়ী মালীদের নিয়মিত পরিচর্যা, লন কাটিং, প্রুনিং এবং জৈব সার প্রয়োগের নিশ্চয়তা।",
    },
    {
      number: "05",
      icon: "💰",
      title: "স্বচ্ছ কোটেশন ও ফেয়ার প্রাইসিং",
      subtitle: "Itemized & Transparent Pricing",
      desc: "প্রতিটি গাছ, মাটি, টব, লেবার ও ম্যাটেরিয়ালের আলাদা হিসাবসহ স্মার্ট কোটেশন দেওয়া হয়, যাতে কোনো গোপন বা অতিরিক্ত খরচ থাকে না।",
    },
    {
      number: "06",
      icon: "🏆",
      title: "৩৫+ অভিজ্ঞ ল্যান্ডস্কেপ টিম",
      subtitle: "Decade of Urban Greening Expertise",
      desc: "ধানমন্ডি, গুলশান, বনানী, উত্তরা সহ ঢাকা শহরের শত শত লাক্সারি ভিলা, পেন্টহাউস এবং কর্পোরেট অফিসে ল্যান্ডস্কেপিংয়ের বাস্তব অভিজ্ঞতা।",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Shma Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                Why AR Green Garden • কেন এ আর গ্রিন গার্ডেন?
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                Guaranteed <span className="font-bold text-[#2B4D33]">Excellence</span>
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              We engineer living ecosystems that endure. Our structural guarantees and horticultural expertise set the benchmark for landscape architecture in Bangladesh.
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
                    {p.title}
                  </h3>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#2B4D33] font-semibold block mt-1">
                    {p.subtitle}
                  </span>
                </div>

                <p className="font-sans text-xs text-[#75787B] leading-relaxed">
                  {p.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Verified Standard
                </span>
                <Link
                  href="/contact"
                  className="font-mono text-[11px] text-[#2B4D33] font-semibold group-hover:translate-x-1 transition-transform"
                >
                  Inquire →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
