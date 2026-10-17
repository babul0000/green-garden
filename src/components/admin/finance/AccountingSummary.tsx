"use client";

import React from "react";
import { AccountingData } from "./types";

interface AccountingSummaryProps {
  accounting: AccountingData | null;
  loading?: boolean;
}

export default function AccountingSummary({ accounting, loading }: AccountingSummaryProps) {
  if (loading && !accounting) {
    return (
      <div className="p-8 text-center text-stone-400 font-mono text-xs">
        হিসাবের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  if (!accounting) {
    return (
      <div className="p-8 text-center text-stone-400 font-mono text-xs">
        কোনো আর্থিক হিসাবের ডাটা পাওয়া যায়নি।
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#0e1c14] text-white p-6 rounded-3xl shadow-xl border border-emerald-500/30 flex flex-col justify-between">
          <span className="text-xs text-emerald-300 uppercase tracking-widest font-mono font-semibold block">মোট আয় (Total Income)</span>
          <div className="text-3xl font-extrabold font-mono mt-2 text-white">
            ৳{accounting.summary.totalIncome.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-1">প্রজেক্ট, মেইনটেন্যান্স ও গাছ বিক্রি</p>
        </div>

        <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10 text-[#E4E2D7] flex flex-col justify-between">
          <span className="text-xs text-stone-400 uppercase tracking-widest font-mono font-semibold block">মোট ব্যয় (Total Expense)</span>
          <div className="text-3xl font-extrabold font-mono mt-2 text-rose-400">
            ৳{accounting.summary.totalExpense.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">বেতন, কাঁচামাল ও পরিচালন ব্যয়</p>
        </div>

        <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-emerald-500/30 text-[#E4E2D7] flex flex-col justify-between">
          <span className="text-xs text-emerald-400 uppercase tracking-widest font-mono font-semibold block">নিট লাভ (Net Profit)</span>
          <div className="text-3xl font-extrabold font-mono mt-2 text-emerald-400">
            ৳{accounting.summary.netProfit.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-400/90 font-bold font-mono mt-1">মার্জিন: {accounting.summary.profitMargin}</p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Income Streams */}
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 text-[#E4E2D7]">
          <h4 className="font-bold text-white text-sm font-serif border-b border-white/10 pb-2 flex items-center justify-between">
            <span>📈 আয়ের উৎসসমূহ (Income Streams)</span>
            <span className="text-emerald-400 font-mono font-bold text-xs">
              ৳{accounting.summary.totalIncome.toLocaleString()}
            </span>
          </h4>
          <div className="space-y-3 text-xs">
            {Object.values(accounting.incomeBreakdown).map((inc, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-stone-300 font-medium">{inc.label}</span>
                <span className="font-mono font-bold text-white">৳{inc.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Streams */}
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4 text-[#E4E2D7]">
          <h4 className="font-bold text-white text-sm font-serif border-b border-white/10 pb-2 flex items-center justify-between">
            <span>📉 ব্যয়ের খাতসমূহ (Expense Breakdown)</span>
            <span className="text-rose-400 font-mono font-bold text-xs">
              ৳{accounting.summary.totalExpense.toLocaleString()}
            </span>
          </h4>
          <div className="space-y-3 text-xs">
            {Object.values(accounting.expenseBreakdown).map((exp, i) => (
              <div key={i} className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-stone-300 font-medium">{exp.label}</span>
                <span className="font-mono font-bold text-white">৳{exp.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
