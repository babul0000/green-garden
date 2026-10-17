"use client";

import React, { useEffect } from "react";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "মুছে ফেলার নিশ্চিতকরণ",
  description = "আপনি কি নিশ্চিত যে এই রেকর্ডটি স্থায়ীভাবে মুছে ফেলতে চান? এই পরিবর্তনটি আর ফিরিয়ে আনা যাবে না।",
  itemName,
  confirmLabel = "হ্যাঁ, মুছে ফেলুন",
  cancelLabel = "বাতিল",
  variant = "danger",
  isLoading = false,
}: ConfirmModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div 
        className="w-full max-w-md max-sm:p-5 max-sm:rounded-2xl bg-white border border-[#D6D2C4] rounded-3xl p-6 shadow-2xl animate-scale-in relative text-[#121813] font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Icon Badge */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
            isDanger ? "bg-rose-100 text-rose-600 border border-rose-200" : "bg-amber-100 text-amber-700 border border-amber-200"
          }`}>
            {isDanger ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div>
            <h3 id="confirm-modal-title" className="text-base font-bold font-display uppercase tracking-wide text-[#121813]">
              {title}
            </h3>
            <span className="text-[10px] font-mono text-[#75787B] uppercase tracking-wider">
              ACTION CONFIRMATION
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="text-xs text-[#52575C] leading-relaxed mb-6 font-light">
          <p>{description}</p>
          {itemName && (
            <div className="mt-3 p-3 bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl font-mono text-[11px] text-[#121813] font-medium break-all flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              <span className="truncate">{itemName}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] text-xs font-mono font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          
          <button
            type="button"
            disabled={isLoading}
            onClick={async () => {
              await onConfirm();
            }}
            className={`min-h-[44px] px-5 py-2.5 rounded-xl text-white text-xs font-mono font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50 ${
              isDanger
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                : "bg-[#2B4D33] hover:bg-[#1E3724]"
            }`}
          >
            {isLoading && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
