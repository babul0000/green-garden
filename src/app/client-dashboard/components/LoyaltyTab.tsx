"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LoyaltyTabProps {
  user: { id?: string; name?: string; email?: string } | null;
}

export default function LoyaltyTab({ user }: LoyaltyTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 mt-6 animate-fade-in-up">
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
            Exclusive Privileges
          </span>
          <h3 className="text-2xl font-display font-bold text-[#E4E2D7]">
            Customer Loyalty & Rewards Program
          </h3>
          <p className="text-xs text-white/60 mt-1">
            {t("আমাদের নিয়মিত ক্লায়েন্টদের জন্য বিশেষ ছাড়, মেইনটেন্যান্স প্যাকেজ এবং রেফারেল রিওয়ার্ড।", "Exclusive discounts, maintenance packages, and referral bonuses for our valued clients.")}
          </p>
        </div>
        <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
          <span>👑</span>
          <span>VIP Gold Member</span>
        </div>
      </div>

      {/* 4 Loyalty Offer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Special Repeat Customer Discount */}
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xl text-emerald-400">
            🎟️
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold block">
              {t("রিপিট কাস্টমার অফার", "Repeat Customer Offer")}
            </span>
            <h4 className="text-lg font-display font-bold text-white mt-1">
              10% Flat Renovation Discount
            </h4>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              {t("আপনার পরবর্তী ছাদবাগান রেনোভেশন, ড্রিপ ইরিগেশন আপগ্রেড কিংবা পারগোলা নির্মাণে এই কুপন ব্যবহার করুন।", "Apply this exclusive voucher for your next garden renovation, irrigation upgrade, or pergola install.")}
            </p>
          </div>
          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/10">
            <span className="font-mono text-xs font-bold text-emerald-300 tracking-wider">GREENVIP10</span>
            <span className="text-[10px] font-mono text-white/50">{t("সক্রিয় ভাউচার", "Active Code")}</span>
          </div>
        </div>

        {/* 2. Maintenance Subscription Package */}
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xl text-blue-400">
            🌿
          </div>
          <div>
            <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block">
              {t("মেইনটেন্যান্স প্যাকেজ", "Maintenance Package")}
            </span>
            <h4 className="text-lg font-display font-bold text-white mt-1">
              Quarterly Eco-Care Subscription
            </h4>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              {t("প্রতি মাসে ২টি রুটিন ভিজিট, নিয়মিত প্রুনিং, মাটি রিচার্জ ও কীটনাশক নিয়ন্ত্রণ সেবা অন্তর্ভুক্ত।", "Includes 2 scheduled monthly visits, organic pruning, soil recharge, and pest prevention.")}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-white/50">{t("প্যাকেজ রেট:", "Package Fee:")}</span>
              <span className="font-mono font-bold text-white text-base ml-2">৳১২,০০০ / ৩ মাস</span>
            </div>
            <a
              href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20am%20interested%20in%20the%20Quarterly%20Eco-Care%20Subscription."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-mono font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-1"
            >
              <span>💬</span> {t("সাবস্ক্রাইব করুন", "Subscribe")}
            </a>
          </div>
        </div>

        {/* 3. Referral Reward Program */}
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-xl text-purple-400">
            🎁
          </div>
          <div>
            <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest font-bold block">
              {t("রেফারেল রিওয়ার্ড", "Referral Reward")}
            </span>
            <h4 className="text-lg font-display font-bold text-white mt-1">
              Refer a Friend & Earn ৳1,500
            </h4>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              {t("আপনার রেফারেল কোড ব্যবহার করে কোনো বন্ধু নতুন প্রজেক্ট বুক করলে আপনি পাবেন ১টি ফ্রি ট্রি ডক্টর ভিজিট অথবা ১,৫০০ টাকা ডিসকাউন্ট।", "Share your referral code. When a friend books a new landscape project, you both receive bonus rewards.")}
            </p>
          </div>
          <div className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/10">
            <span className="font-mono text-xs font-bold text-purple-300">REF-{user?.id?.slice(0, 6)?.toUpperCase() || "ARGG2026"}</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`REF-${user?.id?.slice(0, 6)?.toUpperCase() || "ARGG2026"}`);
                alert("রেফারেল কোড কপি করা হয়েছে!");
              }}
              className="text-[10px] font-mono font-bold text-emerald-400 hover:underline cursor-pointer"
            >
              {t("কোড কপি করুন", "Copy Code")}
            </button>
          </div>
        </div>

        {/* 4. Special Service Package */}
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 relative overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl text-amber-400">
            🩺
          </div>
          <div>
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-bold block">
              {t("স্পেশাল সার্ভিস প্যাকেজ", "Special Service Package")}
            </span>
            <h4 className="text-lg font-display font-bold text-white mt-1">
              Complimentary Soil Diagnostic Check
            </h4>
            <p className="text-xs text-white/60 mt-1 leading-relaxed">
              {t("বর্ষা ও শীত মৌসুমের প্রাক্কালে গাছের শিকড় ও মাটির পিএইচ (pH) ব্যালান্স পরীক্ষা করতে আমাদের বিশেষজ্ঞ দল আপনার সাইট পরিদর্শন করবে।", "Free annual diagnostic soil test to measure nitrogen, potassium, and soil pH levels before monsoon.")}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono font-bold">
              {t("বিনামূল্যে অন্তর্ভুক্ত", "Complimentary")}
            </span>
            <button
              onClick={() => alert("আপনার ফ্রি সয়েল টেস্ট রিকোয়েস্ট অ্যাডমিন টিমের কাছে পাঠানো হয়েছে!")}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer"
            >
              {t("ক্লেম করুন", "Claim Service")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
