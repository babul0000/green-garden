"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function Login() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setError(result.error || t("ভুল ইমেইল অথবা পাসওয়ার্ড", "Invalid email or password"));
      } else {
        setSuccess(true);
        const role = result.user?.role?.toUpperCase();
        let destination = "/client-dashboard";
        if (role === "ADMIN" || role === "EDITOR") {
          destination = "/admin";
        } else if (role === "MODERATOR") {
          destination = "/moderator";
        } else if (role === "EMPLOYEE") {
          destination = "/employee-portal";
        }
        setTimeout(() => {
          window.location.href = destination;
        }, 600);
      }
    } catch (err: any) {
      console.error("Sign in error:", err);
      setError(t("লগইন করতে সমস্যা হচ্ছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।", "An unexpected error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-[#1a2e1c]">

      {/* ── LEFT PANEL ── Illustration */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col items-center justify-between p-10">
        {/* Ambient blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-emerald-800/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full bg-emerald-900/40 blur-3xl pointer-events-none" />
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
              alt="AR Green Garden Rooftop Illustration"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            {[
              { val: "500+", label: t("প্রকল্প", "Projects") },
              { val: "12+", label: t("বছর", "Years") },
              { val: "98%", label: t("সন্তুষ্টি", "Satisfaction") },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-2xl font-bold text-emerald-300">{s.val}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="relative z-10 font-mono text-[10px] text-white/30 uppercase tracking-widest">
          © 2025 AR Green Garden • Bangladesh
        </p>
      </div>

      {/* ── RIGHT PANEL ── Form */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-[#22382460] backdrop-blur-sm px-6 sm:px-10 py-12 overflow-y-auto">
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

        <div className="w-full max-w-[400px] space-y-7">

          {/* Heading */}
          <div className="space-y-1.5">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t("লগইন করুন", "Login")}
            </h1>
            <p className="text-sm text-white/50 font-sans">
              {t("আপনার পোর্টালে প্রবেশ করুন", "Access your studio portal")}
            </p>
          </div>

          {/* Demo accounts */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
              ⚡ {t("ডেমো অ্যাকাউন্ট", "Quick Demo")}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: "👑", label: t("অ্যাডমিন", "Admin"), email: "admin@argreengarden.com", pass: "admin123" },
                { icon: "🩺", label: t("ডক্টর", "Doctor"), email: "doctor@argreengarden.com", pass: "doctor123" },
                { icon: "👤", label: t("ক্লায়েন্ট", "Client"), email: "client@gmail.com", pass: "client123" },
              ].map((d) => (
                <button
                  key={d.label}
                  type="button"
                  onClick={() => handleDemoFill(d.email, d.pass)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-400/40 transition-all text-white cursor-pointer group"
                >
                  <span className="text-lg">{d.icon}</span>
                  <span className="text-[10px] font-mono font-semibold group-hover:text-emerald-300 transition-colors">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Success state */}
          {success ? (
            <div className="text-center py-10 flex flex-col gap-4 items-center animate-fade-in-up">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-2xl text-emerald-400">
                ✓
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-white">{t("লগইন সফল!", "Login Successful!")}</h3>
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

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm text-white/70 font-sans font-medium">
                  {t("ইমেইল", "Email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@argreengarden.com"
                  className="w-full bg-[#1a2e1c] border border-white/15 text-white placeholder-white/25 py-3.5 px-4 rounded-2xl text-sm font-sans focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-white/70 font-sans font-medium">
                    {t("পাসওয়ার্ড", "Password")}
                  </label>
                  <Link href="/forgot-password" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-sans">
                    {t("ভুলে গেছেন?", "Forgot Password?")}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1a2e1c] border border-white/15 text-white placeholder-white/25 py-3.5 px-4 pr-11 rounded-2xl text-sm font-sans focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors text-base cursor-pointer"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
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
                  <span>{t("লগইন করুন", "Login to Portal")}</span>
                )}
              </button>

              {/* Register link */}
              <p className="text-center text-sm text-white/40 font-sans pt-1">
                {t("অ্যাকাউন্ট নেই?", "Don't have an account?")}{" "}
                <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                  {t("রেজিস্ট্রেশন করুন", "Register Now")}
                </Link>
              </p>
            </form>
          )}

          {/* Terms */}
          <p className="text-center text-[11px] text-white/25 font-mono pt-2">
            <Link href="/terms" className="hover:text-white/50 transition-colors">{t("শর্তাবলী", "Terms")}</Link>
            {" · "}
            <Link href="/privacy-policy" className="hover:text-white/50 transition-colors">{t("গোপনীয়তা", "Privacy")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
