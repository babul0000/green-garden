"use client";

import React, { useState, useEffect } from "react";
import {
  ROLE_PERMISSION_MATRIX,
  RoleMatrixItem,
  AdminSection,
  getCustomRoleMatrix,
  setCustomRoleMatrix,
} from "@/lib/rbac";

export default function RolesTab() {
  const [matrix, setMatrix] = useState<RoleMatrixItem[]>(() => getCustomRoleMatrix());
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // 1. Fetch saved matrix from DB settings on mount
  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const res = await fetch("/api/settings?key=custom_rbac_permissions&_t=" + Date.now(), {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const savedMatrix = data?.value || data?.custom_rbac_permissions;
          if (Array.isArray(savedMatrix) && savedMatrix.length > 0) {
            setMatrix(savedMatrix);
            setCustomRoleMatrix(savedMatrix);
            try {
              localStorage.setItem("custom_rbac_matrix", JSON.stringify(savedMatrix));
            } catch {}
          }
        }
      } catch (err) {
        console.warn("Failed to fetch custom RBAC matrix:", err);
      }
    };

    fetchMatrix();
  }, []);

  // 2. Toggle permission for a role in a section
  const handleToggle = (
    sectionId: AdminSection,
    role: "moderator" | "editor" | "employee" | "client"
  ) => {
    setMatrix((prev) =>
      prev.map((row) => {
        if (row.sectionId === sectionId) {
          return {
            ...row,
            [role]: !row[role],
          };
        }
        return row;
      })
    );
    setHasChanges(true);
    setSaveSuccess(false);
  };

  // 3. Save permissions to database and local cache
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "custom_rbac_permissions",
          value: matrix,
        }),
      });

      if (res.ok) {
        setCustomRoleMatrix(matrix);
        try {
          localStorage.setItem("custom_rbac_matrix", JSON.stringify(matrix));
        } catch {}
        // Dispatch live event to notify all dashboard components (e.g., Sidebar)
        window.dispatchEvent(new CustomEvent("rbac-permissions-updated", { detail: matrix }));
        setSaveSuccess(true);
        setHasChanges(false);
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        const err = await res.json();
        alert("পারমিশন সংরক্ষণ ব্যর্থ হয়েছে: " + (err.error || "সার্ভার ত্রুটি"));
      }
    } catch (err: any) {
      alert("পারমিশন সংরক্ষণ করতে সমস্যা হয়েছে: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 4. Reset to system default matrix
  const handleResetDefaults = () => {
    if (!confirm("আপনি কি নিশ্চিত যে সকল পারমিশন সিস্টেমের ডিফল্ট মানে রিসেট করতে চান?")) return;
    setMatrix(ROLE_PERMISSION_MATRIX);
    setHasChanges(true);
    setSaveSuccess(false);
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-5 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7] font-sans">
      
      {/* Header with Save / Reset Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
            🛡️ Dynamic Role-Based Access Control (RBAC)
          </div>
          <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
            <span>রোল ও পারমিশন কন্ট্রোল প্যানেল</span>
            <span className="text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              লাইভ এডিটেবল
            </span>
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
            এডমিন হিসেবে আপনি প্রতিটি রোলের (মডারেটর, এডিটর, এমপ্লয়ী, ক্লায়েন্ট) জন্য যেকোনো মডিউলের এক্সেস পারমিশন পরিবর্তন করতে পারেন। পরিবর্তন করার পর <strong>&ldquo;সংরক্ষণ করুন&rdquo;</strong> বাটনে ক্লিক করুন।
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white border border-white/10 text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>↺</span> ডিফল্ট রিস্টোর
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className={`px-5 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-2 shadow-lg ${
              hasChanges
                ? "bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-emerald-500/20 animate-pulse"
                : "bg-emerald-600/80 hover:bg-emerald-500 text-white"
            } disabled:opacity-50`}
          >
            {isSaving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin"></span>
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>{hasChanges ? "পরিবর্তনগুলো সংরক্ষণ করুন *" : "পারমিশন সংরক্ষিত"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-3.5 text-xs text-emerald-200 flex items-center gap-3 animate-fade-in shadow-md">
          <span className="text-lg">✓</span>
          <span className="font-semibold">
            রোল পারমিশন সফলভাবে ডাটাবেজে সংরক্ষিত হয়েছে! ড্যাশবোর্ডের সকল সংশ্লিষ্ট ব্যবহারকারীর জন্য নতুন পারমিশন অবিলম্বে কার্যকর করা হয়েছে।
          </span>
        </div>
      )}

      {/* Interactive RBAC Table */}
      <div className="overflow-x-auto w-full rounded-2xl border border-white/10 bg-black/40 shadow-inner">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04] text-stone-200 font-bold font-mono uppercase tracking-wider text-[11px]">
              <th className="py-4 px-4 min-w-[220px]">মডিউল ও সেকশন (Scope)</th>
              <th className="py-4 px-3 text-center min-w-[120px]">Super Admin</th>
              <th className="py-4 px-3 text-center min-w-[130px]">Moderator</th>
              <th className="py-4 px-3 text-center min-w-[130px]">Editor</th>
              <th className="py-4 px-3 text-center min-w-[130px]">Employee</th>
              <th className="py-4 px-3 text-center min-w-[130px]">Client</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {matrix.map((row: RoleMatrixItem) => (
              <tr key={row.sectionId} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-4 px-4">
                  <div className="font-bold text-white text-xs">{row.titleBn}</div>
                  <div className="text-[11px] text-emerald-400 font-mono">{row.titleEn}</div>
                  <div className="text-[10px] text-stone-400 mt-0.5 leading-snug">{row.scope}</div>
                </td>

                {/* Super Admin — Always Full Access */}
                <td className="py-4 px-3 text-center">
                  <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 cursor-not-allowed select-none shadow-xs">
                    🔒 Full Access
                  </span>
                </td>

                {/* Moderator Toggle */}
                <td className="py-4 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(row.sectionId, "moderator")}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                      row.moderator
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-xs"
                        : "bg-white/[0.03] text-stone-500 border-white/10 hover:border-white/20 hover:text-stone-400"
                    }`}
                  >
                    <span>{row.moderator ? "✓ অনুমোদিত" : "✕ সীমাবদ্ধ"}</span>
                  </button>
                </td>

                {/* Editor Toggle */}
                <td className="py-4 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(row.sectionId, "editor")}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                      row.editor
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-xs"
                        : "bg-white/[0.03] text-stone-500 border-white/10 hover:border-white/20 hover:text-stone-400"
                    }`}
                  >
                    <span>{row.editor ? "✓ অনুমোদিত" : "✕ সীমাবদ্ধ"}</span>
                  </button>
                </td>

                {/* Employee Toggle */}
                <td className="py-4 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(row.sectionId, "employee")}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                      row.employee
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-xs"
                        : "bg-white/[0.03] text-stone-500 border-white/10 hover:border-white/20 hover:text-stone-400"
                    }`}
                  >
                    <span>{row.employee ? "✓ অনুমোদিত" : "✕ সীমাবদ্ধ"}</span>
                  </button>
                </td>

                {/* Client Toggle */}
                <td className="py-4 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(row.sectionId, "client")}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-bold border transition-all cursor-pointer ${
                      row.client
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30 shadow-xs"
                        : "bg-white/[0.03] text-stone-500 border-white/10 hover:border-white/20 hover:text-stone-400"
                    }`}
                  >
                    <span>{row.client ? "✓ অনুমোদিত" : "✕ নো অ্যাক্সেস"}</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Helpful Action Reminder Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/[0.02] p-4 rounded-2xl border border-white/10 text-xs">
        <div className="flex items-center gap-2 text-stone-300">
          <span className="text-base">💡</span>
          <span>যেকোনো রোলের পারমিশন পরিবর্তন করতে সরাসরি বাটনটিতে ক্লিক করে টগল করুন।</span>
        </div>
        {hasChanges && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono rounded-xl text-xs transition-all cursor-pointer shadow-md"
          >
            {isSaving ? "সংরক্ষণ হচ্ছে..." : "পরিবর্তনগুলো সেভ করুন ➔"}
          </button>
        )}
      </div>

    </div>
  );
}
