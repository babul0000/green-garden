"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate OTP / Reset email send
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center bg-[#121A14] text-white px-4 sm:px-6 py-16 overflow-hidden font-sans">
      {/* Background Architectural Ambient Grid & Glow matching Home Page */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6 animate-fade-in-up">
        {/* Studio Identity Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
              A R Green Garden Studio • Security
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E4E2D7]">
            Reset Password
          </h1>
          <p className="text-xs text-white/60 font-sans leading-relaxed max-w-sm mx-auto">
            {t(
              "আপনার একাউন্টের ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাব।",
              "Enter your registered email address to receive secure recovery instructions."
            )}
          </p>
        </div>

        {/* Main Architectural Card */}
        <div className="bg-[#18221A]/90 backdrop-blur-xl border border-white/15 rounded-[32px] p-7 sm:p-9 shadow-2xl space-y-6">
          {success ? (
            <div className="text-center py-4 flex flex-col gap-4 items-center justify-center animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl shadow-inner">
                ✓
              </div>
              <h3 className="text-xl font-display font-bold text-[#E4E2D7]">
                {t("রিকভারি ইমেইল পাঠানো হয়েছে!", "Recovery Link Dispatched!")}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">
                {t("আমরা একটি সিকিউর ভেরিফিকেশন কোড পাঠিয়েছি:", "We have dispatched a secure recovery verification code to:")}{" "}
                <b className="text-emerald-400 font-mono">{email}</b>. {t("ইনবক্স চেক করুন।", "Please check your inbox.")}
              </p>
              <Link 
                href="/login" 
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 mt-2 text-center"
              >
                {t("লগইন পেজে ফিরুন", "Return to Login")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-mono font-bold text-white/80 uppercase tracking-wider">
                  {t("ইমেইল এড্রেস", "Email Address")}
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@argreengarden.com"
                  className="bg-black/40 border border-white/15 text-white py-3 px-4 rounded-2xl text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01]"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin"></span>
                ) : (
                  t("রিসেট কোড পাঠান", "Send Reset Link")
                )}
              </button>

              <p className="text-center text-xs text-white/50 pt-2 font-mono">
                {t("মনে পড়েছে?", "Remember your password?")}{" "}
                <Link href="/login" className="text-emerald-400 font-bold hover:underline">
                  {t("লগইন করুন", "Back to Login")}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
