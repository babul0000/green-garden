"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Register() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("client");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError(t("পাসওয়ার্ড দুটি মিলছে না", "Passwords do not match"));
      setLoading(false);
      return;
    }

    try {
      const result = await register({ name, email, password, role });

      if (!result.success) {
        setError(result.error || t("অ্যাকাউন্ট তৈরি করতে সমস্যা হচ্ছে", "Failed to create account"));
      } else {
        setSuccess(true);
        const destination =
          result.user?.role === "admin" || result.user?.role === "editor"
            ? "/admin"
            : "/client-dashboard";
        setTimeout(() => {
          window.location.href = destination;
        }, 700);
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(t("অপ্রত্যাশিত সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।", "An unexpected error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#1a2e1c]">

      {/* ── LEFT PANEL ── Illustration */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col items-center justify-between p-10">
        {/* Ambient blobs */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full bg-emerald-800/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full bg-emerald-900/40 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#2d4a2f_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />

        {/* Logo top-left */}
        <div className="relative z-10 w-full flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-base font-bold shadow-lg">
            AR
          </div>
          <div>
            <p className="font-display font-semibold text-white text-sm leading-tight">AR Green Garden</p>
            <p className="font-mono text-[10px] text-emerald-300/80 uppercase tracking-widest">Studio Portal</p>
          </div>
        </div>

        {/* Center illustration */}
        <div className="relative z-10 flex flex-col items-center gap-8 flex-1 justify-center">
          <div className="w-[340px] h-[340px] xl:w-[400px] xl:h-[400px]">
            <img
              src="/auth_illustration.jpg"
              alt="AR Green Garden Garden Illustration"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              t("🌿 ছাদবাগান পরিচালনা", "🌿 Rooftop Garden Management"),
              t("📐 প্রজেক্ট ট্র্যাকিং", "📐 Project Tracking"),
              t("🩺 ট্রি ডক্টর সার্ভিস", "🩺 Tree Doctor Service"),
            ].map((chip) => (
              <span
                key={chip}
                className="px-3 py-1.5 bg-white/8 border border-white/10 rounded-full text-[11px] font-mono text-white/60"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="relative z-10 font-mono text-[10px] text-white/30 uppercase tracking-widest">
          © 2025 AR Green Garden • Bangladesh
        </p>
      </div>

      {/* ── RIGHT PANEL ── Form */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-[#22382460] backdrop-blur-sm px-6 sm:px-10 py-10 overflow-y-auto">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-base font-bold shadow-lg">
            AR
          </div>
          <div>
            <p className="font-display font-semibold text-white text-sm leading-tight">AR Green Garden</p>
            <p className="font-mono text-[10px] text-emerald-300/80 uppercase tracking-widest">Studio Portal</p>
          </div>
        </div>

        <div className="w-full max-w-[400px] space-y-6">

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t("অ্যাকাউন্ট খুলুন", "Create Account")}
            </h1>
            <p className="text-sm text-white/50 font-sans">
              {t("আমাদের ক্লায়েন্ট পোর্টালে যোগ দিন", "Join our landscape architecture platform")}
            </p>
          </div>

          {/* Success state */}
          {success ? (
            <div className="text-center py-10 flex flex-col gap-4 items-center animate-fade-in-up">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl text-emerald-400">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">{t("রেজিস্ট্রেশন সফল!", "Registration Successful!")}</h3>
                <p className="text-xs text-white/50 mt-1 font-sans">{t("ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...", "Redirecting to dashboard...")}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-950/60 border border-red-500/30 text-red-300 text-xs p-3 rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm text-white/70 font-sans font-medium">
                  {t("পূর্ণ নাম", "Full Name")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("তানভীর আহমেদ", "Your full name")}
                  className="w-full bg-[#1a2e1c] border border-white/15 text-white placeholder-white/25 py-3.5 px-4 rounded-2xl text-sm font-sans focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm text-white/70 font-sans font-medium">
                  {t("ইমেইল ঠিকানা", "Email Address")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full bg-[#1a2e1c] border border-white/15 text-white placeholder-white/25 py-3.5 px-4 rounded-2xl text-sm font-sans focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
                />
              </div>

              {/* Password row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="block text-sm text-white/70 font-sans font-medium">
                    {t("পাসওয়ার্ড", "Password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1a2e1c] border border-white/15 text-white placeholder-white/25 py-3.5 px-4 pr-10 rounded-2xl text-sm font-sans focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors text-sm cursor-pointer"
                    >
                      {showPassword ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm text-white/70 font-sans font-medium">
                    {t("নিশ্চিত করুন", "Confirm")}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1a2e1c] border border-white/15 text-white placeholder-white/25 py-3.5 px-4 pr-10 rounded-2xl text-sm font-sans focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition-colors text-sm cursor-pointer"
                    >
                      {showConfirm ? "🙈" : "👁"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-[#0d1a0e] font-sans font-bold text-sm rounded-2xl transition-all shadow-lg shadow-emerald-900/40 hover:shadow-emerald-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-[#0d1a0e]/30 border-t-[#0d1a0e] rounded-full animate-spin" />
                ) : (
                  <span>{t("রেজিস্ট্রেশন সম্পন্ন করুন", "Create Account →")}</span>
                )}
              </button>

              {/* Login link */}
              <p className="text-center text-sm text-white/40 font-sans pt-1">
                {t("ইতিমধ্যে অ্যাকাউন্ট আছে?", "Already have an account?")}{" "}
                <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  {t("লগইন করুন", "Sign In")}
                </Link>
              </p>
            </form>
          )}

          {/* Terms */}
          <p className="text-center text-[11px] text-white/25 font-mono">
            <Link href="/terms" className="hover:text-white/50 transition-colors">{t("শর্তাবলী", "Terms")}</Link>
            {" · "}
            <Link href="/privacy-policy" className="hover:text-white/50 transition-colors">{t("গোপনীয়তা", "Privacy")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
