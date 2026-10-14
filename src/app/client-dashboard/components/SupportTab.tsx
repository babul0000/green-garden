"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SupportTabProps {
  reviewRating: number;
  setReviewRating: (r: number) => void;
  reviewText: string;
  setReviewText: (t: string) => void;
  isSubmittingReview: boolean;
  handleReviewSubmit: (e: React.FormEvent) => void;
}

export default function SupportTab({
  reviewRating,
  setReviewRating,
  reviewText,
  setReviewText,
  isSubmittingReview,
  handleReviewSubmit,
}: SupportTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 mt-6 max-w-2xl animate-fade-in-up">
      <div>
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
          Client Feedback & Review
        </span>
        <h3 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7] mt-1">
          Share Your Experience & Rating
        </h3>
      </div>

      <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl space-y-4">
        <form onSubmit={handleReviewSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono font-bold text-white/80 block mb-2">
              {t("রেটিং নির্বাচন করুন:", "Select Rating:")}
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`text-2xl transition-transform hover:scale-125 cursor-pointer ${
                    star <= reviewRating ? "text-amber-400" : "text-white/20"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-mono font-bold text-white/80 block mb-1">
              {t("আপনার অভিজ্ঞতা লিখুন:", "Write Your Feedback:")}
            </label>
            <textarea
              rows={4}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder={t(
                "এ আর গ্রিন গার্ডেনের কাজের মান, সময়ানুবর্তিতা এবং ডিজাইন কেমন লেগেছে তা শেয়ার করুন...",
                "Share your experience with A R Green Garden design quality and punctuality..."
              )}
              className="w-full p-3 bg-black/40 border border-white/15 rounded-xl text-xs text-white placeholder:text-white/30 focus:border-emerald-400 outline-none transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmittingReview || !reviewText}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isSubmittingReview ? t("সাবমিট হচ্ছে...", "Submitting...") : t("রিভিউ সাবমিট করুন", "Submit Review")}
          </button>
        </form>
      </div>
    </div>
  );
}
