"use client";

import React from "react";

interface SecurityTabProps {
  sessionData?: any;
}

export default function SecurityTab({ sessionData }: SecurityTabProps) {
  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl text-[#E4E2D7] flex flex-col gap-6 animate-fade-in-up">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
          🛡️ Enterprise Security
        </div>
        <h3 className="font-sans font-bold text-xl text-[#E4E2D7]">সিকিউরিটি ও অ্যাক্সেস কন্ট্রোল</h3>
        <p className="text-xs text-white/50 mt-1">প্রশাসনিক ক্রেডেনশিয়ালস, অথেনটিকেশন সেশন এবং রোল-বেসড এক্সেস পর্যবেক্ষণ করুন।</p>
      </div>

      <div className="bg-black/40 p-6 sm:p-8 rounded-2xl border border-white/10 max-w-2xl text-xs flex flex-col gap-5">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <span className="font-mono text-xs uppercase tracking-wider text-emerald-400 font-bold">অ্যাক্টিভ সেশন স্ট্যাটাস</span>
          <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold px-3 py-1 rounded-full uppercase text-[10px] border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE SESSION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 p-3.5 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">ইউজার নাম (User Name)</span>
            <span className="text-white font-semibold text-sm">{sessionData?.user?.name || "A R Green Garden Admin"}</span>
          </div>

          <div className="flex flex-col gap-1 p-3.5 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">অ্যাডমিন ইমেইল (Email Address)</span>
            <span className="text-white font-semibold text-sm font-mono">{sessionData?.user?.email || "admin@argreengarden.com"}</span>
          </div>

          <div className="flex flex-col gap-1 p-3.5 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">অথরিটি রোল (Access Role)</span>
            <span className="text-emerald-400 font-bold font-mono text-sm uppercase tracking-wider">{sessionData?.user?.role || "SUPER_ADMIN"}</span>
          </div>

          <div className="flex flex-col gap-1 p-3.5 bg-white/[0.03] rounded-xl border border-white/5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50">এনক্রিপশন প্রোটোকল</span>
            <span className="text-emerald-400 font-bold font-mono text-xs">TLS 1.3 / NextAuth JWT 256</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mt-2">
          <p className="text-[11px] text-white/50 leading-relaxed font-sans">
            এই কন্ট্রোল প্যানেলটি নিরাপদ NextAuth ক্রেডেনশিয়াল ভেরিফিকেশন, ক্রিপ্টোগ্রাফিক সল্ট হ্যাশিং এবং রিয়েল-টাইম রোল-বেসড পারমিশন মেকানিজম দ্বারা সুরক্ষিত। সকল অ্যাডমিন অ্যাক্টিভিটি কঠোরভাবে পর্যবেক্ষণ ও অডিট করা হয়।
          </p>
        </div>
      </div>
    </div>
  );
}
