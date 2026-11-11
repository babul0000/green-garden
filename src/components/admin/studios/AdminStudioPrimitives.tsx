"use client";

import React from "react";

interface BilingualInputProps {
  label: string;
  bnValue: string;
  enValue: string;
  onBnChange: (val: string) => void;
  onEnChange: (val: string) => void;
  multiline?: boolean;
  rows?: number;
  bnPlaceholder?: string;
  enPlaceholder?: string;
}

export function BilingualInput({
  label,
  bnValue,
  enValue,
  onBnChange,
  onEnChange,
  multiline = false,
  rows = 2,
  bnPlaceholder = "বাংলায় লিখুন...",
  enPlaceholder = "Write in English...",
}: BilingualInputProps) {
  const inputCls =
    "w-full px-3.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors";

  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-bold text-stone-600 uppercase tracking-wider block">
        {label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        <div>
          <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase block mb-0.5">
            🇧🇩 বাংলা (BN)
          </span>
          {multiline ? (
            <textarea
              rows={rows}
              value={bnValue || ""}
              onChange={(e) => onBnChange(e.target.value)}
              placeholder={bnPlaceholder}
              className={`${inputCls} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={bnValue || ""}
              onChange={(e) => onBnChange(e.target.value)}
              placeholder={bnPlaceholder}
              className={inputCls}
            />
          )}
        </div>
        <div>
          <span className="text-[9px] font-mono text-stone-500 font-bold uppercase block mb-0.5">
            🇬🇧 English (EN)
          </span>
          {multiline ? (
            <textarea
              rows={rows}
              value={enValue || ""}
              onChange={(e) => onEnChange(e.target.value)}
              placeholder={enPlaceholder}
              className={`${inputCls} resize-y`}
            />
          ) : (
            <input
              type="text"
              value={enValue || ""}
              onChange={(e) => onEnChange(e.target.value)}
              placeholder={enPlaceholder}
              className={inputCls}
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface StudioHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  saving: boolean;
  onSave: () => void;
  saveLabel?: string;
  extraActions?: React.ReactNode;
}

export function StudioHeader({
  icon,
  title,
  subtitle,
  saving,
  onSave,
  saveLabel = "💾 পরিবর্তন সেভ করুন",
  extraActions,
}: StudioHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-stone-800 flex items-center gap-2">
          <span>{icon}</span>
          <span>{title}</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2.5 flex-wrap">
        {extraActions}
        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-2"
        >
          {saving ? "⏳ সংরক্ষণ হচ্ছে..." : saveLabel}
        </button>
      </div>
    </div>
  );
}

