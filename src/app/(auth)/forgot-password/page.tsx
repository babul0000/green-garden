"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
  const { getPageHeader, txt, config } = useSiteConfig();
  const pageHeader = getPageHeader("forgotPassword");
  const companyName = config?.site_config?.companyName || "A R Green Garden Studio";

  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setStatusMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request", email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("OTP পাঠানো সম্ভব হয়নি।", "Failed to send verification code."));
        return;
      }
      setStatusMessage(
        data.message ||
          t(
            "যদি আপনার ইমেইল নিবন্ধিত থাকে, তবে ৬ সংখ্যার OTP কোড পাঠানো হয়েছে।",
            "If this email is registered, a 6-digit OTP code has been sent."
          )
      );
      setStep("reset");
    } catch {
      setError(t("সার্ভার সংযোগে সমস্যা হয়েছে।", "Unable to reach recovery server. Please retry."));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError(t("নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।", "Password must be at least 6 characters."));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("পাসওয়ার্ড দুটি মিলছে না।", "Passwords do not match."));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", email, otp: otp.trim(), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("পাসওয়ার্ড রিসেট করা যায়নি।", "Password reset failed."));
        return;
      }
      setStatusMessage(
        data.message || t("আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।", "Your password has been updated.")
      );
      setStep("done");
    } catch {
      setError(t("সার্ভার সংযোগে সমস্যা হয়েছে।", "Unable to complete reset. Please retry."));
    } finally {
      setLoading(false);
    }
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
              {companyName} • {t(pageHeader.badgeBn, pageHeader.badgeEn)}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E4E2D7]">
            {t(pageHeader.titleBn, pageHeader.titleEn)}
          </h1>
          <p className="text-xs text-white/60 font-sans leading-relaxed max-w-sm mx-auto">
            {t(pageHeader.subtitleBn, pageHeader.subtitleEn)}
          </p>
        </div>

        {/* Main Architectural Card */}
        <div className="bg-[#18221A]/90 backdrop-blur-xl border border-white/15 rounded-[32px] p-7 sm:p-9 shadow-2xl space-y-6">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          {step === "done" ? (
            <div className="text-center py-4 flex flex-col gap-4 items-center justify-center animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center text-2xl shadow-inner">
                ✓
              </div>
              <h3 className="text-xl font-display font-bold text-[#E4E2D7]">
                {t("পাসওয়ার্ড আপডেট সম্পন্ন!", "Password Updated!")}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans">{statusMessage}</p>
              <Link
                href="/login"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 mt-2 text-center"
              >
                {t("লগইন পেজে ফিরুন", "Return to Login")}
              </Link>
            </div>
          ) : step === "reset" ? (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              {statusMessage && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-3 rounded-2xl">
                  {statusMessage}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-white/80 uppercase tracking-wider">
                  {t("৬ সংখ্যার OTP কোড", "6-Digit Verification OTP")}
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="bg-black/40 border border-white/15 text-white py-3 px-4 rounded-2xl text-sm tracking-[0.35em] text-center font-mono placeholder:text-white/25 focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-white/80 uppercase tracking-wider">
                  {t("নতুন পাসওয়ার্ড", "New Password")}
                </label>
                <input
                  type="password"
                  minLength={6}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-black/40 border border-white/15 text-white py-3 px-4 rounded-2xl text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono font-bold text-white/80 uppercase tracking-wider">
                  {t("পাসওয়ার্ড নিশ্চিত করুন", "Confirm New Password")}
                </label>
                <input
                  type="password"
                  minLength={6}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-black/40 border border-white/15 text-white py-3 px-4 rounded-2xl text-xs placeholder:text-white/30 focus:outline-none focus:border-emerald-400 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-3.5 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin"></span>
                ) : (
                  t("পাসওয়ার্ড পরিবর্তন করুন", "Confirm New Password")
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setError("");
                }}
                className="text-center text-xs text-white/60 hover:text-emerald-400 font-mono transition-colors cursor-pointer"
              >
                {t("← ইমেইল পরিবর্তন বা পুনরায় কোড পাঠান", "← Change Email / Resend Code")}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRequestOtp} className="flex flex-col gap-5">
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
                  t("রিসেট OTP কোড পাঠান", "Send Verification Code")
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-white/50 pt-2 font-mono">
                <Link href="/login" className="text-emerald-400 font-bold hover:underline">
                  {t("← লগইন করুন", "← Back to Login")}
                </Link>
                <Link href="/" className="hover:text-white transition-colors">
                  {txt("common.backHome", "হোমপেজে ফিরে যান", "Back to Home")}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
