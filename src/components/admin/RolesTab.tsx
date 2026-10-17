"use client";

import React from "react";
import { ROLE_PERMISSION_MATRIX, RoleMatrixItem } from "@/lib/rbac";

export default function RolesTab() {
  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7] font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
            🛡️ RBAC Access Security Matrix
          </div>
          <h3 className="font-serif font-bold text-lg text-white">রোল ও পারমিশন ম্যাট্রিক্স (শুধু দেখার জন্য)</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            সিস্টেমের রোল-বেসড অ্যাক্সেস কন্ট্রোল (RBAC) পলিসি। এটি সার্ভার-সাইডে (rbac.ts ও apiAuth.ts) স্থায়ীভাবে কনফিগার করা।
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>সার্ভার-এনফোর্সড পলিসি</span>
        </div>
      </div>

      {/* Read-Only RBAC Table */}
      <div className="overflow-x-auto w-full rounded-2xl border border-white/10 bg-black/40">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04] text-stone-300 font-bold font-mono uppercase tracking-wider text-[10px]">
              <th className="py-3.5 px-4 min-w-[200px]">মডিউল ও সেকশন (Scope)</th>
              <th className="py-3.5 px-3 text-center">Super Admin</th>
              <th className="py-3.5 px-3 text-center">Moderator</th>
              <th className="py-3.5 px-3 text-center">Editor</th>
              <th className="py-3.5 px-3 text-center">Employee</th>
              <th className="py-3.5 px-3 text-center">Client</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {ROLE_PERMISSION_MATRIX.map((row: RoleMatrixItem) => (
              <tr key={row.sectionId} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-white text-xs">{row.titleBn}</div>
                  <div className="text-[11px] text-emerald-400/90 font-mono">{row.titleEn}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5 leading-snug">{row.scope}</div>
                </td>

                {/* Admin */}
                <td className="py-3.5 px-3 text-center">
                  <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ✓ Full Access
                  </span>
                </td>

                {/* Moderator */}
                <td className="py-3.5 px-3 text-center">
                  {row.moderator ? (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      ✓ অনুমোদিত
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-mono text-stone-500 bg-white/[0.02]">
                      — সীমাবদ্ধ
                    </span>
                  )}
                </td>

                {/* Editor */}
                <td className="py-3.5 px-3 text-center">
                  {row.editor ? (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      ✓ অনুমোদিত
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-mono text-stone-500 bg-white/[0.02]">
                      — সীমাবদ্ধ
                    </span>
                  )}
                </td>

                {/* Employee */}
                <td className="py-3.5 px-3 text-center">
                  {row.employee ? (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      ✓ অ্যাসাইনড
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-mono text-stone-500 bg-white/[0.02]">
                      — সীমাবদ্ধ
                    </span>
                  )}
                </td>

                {/* Client */}
                <td className="py-3.5 px-3 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-mono text-stone-500 bg-white/[0.02]">
                    — নো অ্যাক্সেস
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Accurate System Note */}
      <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/20 text-xs text-stone-300 flex items-start gap-3">
        <span className="text-base shrink-0">🔒</span>
        <div className="space-y-1">
          <p className="font-bold text-white">সিস্টেম অথেনটিকেশন ও পারমিশন নোট:</p>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            এই পারমিশন রুলগুলো কোডবেসে <code>src/lib/rbac.ts</code> এবং নেক্সটজেএস এপিআই রুটে <code>requireAdmin</code>, <code>requireModerator</code>, <code>requireEditor</code>, <code>requireEmployee</code> গার্ডের মাধ্যমে ব্যাকএন্ডে কঠোরভাবে প্রয়োগ করা হয়। কোনো ব্যবহারকারীর ভূমিকা পরিবর্তন করতে ইউজার ম্যানেজমেন্ট (UsersTab) ব্যবহার করুন।
          </p>
        </div>
      </div>

    </div>
  );
}
