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
      setError(t("লগইন করতে সমস্যা হচ্ছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।", "An unexpected error occurred. Please try again."));
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
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center bg-[#121A14] text-white px-4 sm:px-6 py-16 overflow-hidden">
      {/* Background Architectural Ambient Grid & Glow matching Home Page */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6 animate-fade-in-up">
        
        {/* Studio Identity Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
              A R Green Garden Studio • Portal
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E4E2D7]">
            Sign In to Portal
          </h1>
          <p className="text-xs text-white/60 font-sans leading-relaxed max-w-sm mx-auto">
            {t(
              "আপনার আর্কিটেকচারাল প্রজেক্ট ড্যাশবোর্ড ও সার্ভিস পোর্টালে প্রবেশ করুন।",
              "Access your architectural projects, plant health records & studio management."
            )}
          </p>
        </div>

        {/* Main Architectural Card */}
        <div className="bg-[#18221A]/90 backdrop-blur-xl border border-white/15 rounded-[32px] p-7 sm:p-9 shadow-2xl space-y-6">
          
          {/* Quick 1-Click Demo Accounts */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-emerald-300">
              <span>⚡ {t("ডেমো অ্যাকাউন্ট (১-ক্লিক)", "Quick Demo Login")}</span>
              <span className="text-white/40 text-[10px]">{t("ক্লিক করে টেস্ট করুন", "1-click autofill")}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill("admin@argreengarden.com", "admin123")}
                className="px-2 py-2 bg-white/5 hover:bg-emerald-500 hover:text-stone-950 text-white border border-white/10 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group"
              >
                <span className="text-sm">👑</span>
                <span>{t("অ্যাডমিন", "Admin")}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("doctor@argreengarden.com", "doctor123")}
                className="px-2 py-2 bg-white/5 hover:bg-emerald-500 hover:text-stone-950 text-white border border-white/10 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group"
              >
                <span className="text-sm">🩺</span>
                <span>{t("ট্রি ডক্টর", "Doctor")}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill("client@gmail.com", "client123")}
                className="px-2 py-2 bg-white/5 hover:bg-emerald-500 hover:text-stone-950 text-white border border-white/10 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 group"
              >
                <span className="text-sm">👤</span>
                <span>{t("ক্লায়েন্ট", "Client")}</span>
              </button>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6 flex flex-col gap-3 items-center justify-center animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                {t("লগইন সফল হয়েছে!", "Login Successful!")}
              </h3>
              <p className="text-xs text-white/60 font-sans leading-relaxed">
                {t("আপনাকে অনুমোদিত ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...", "Redirecting to your authorized dashboard...")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-medium p-3 rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70 block">
                  {t("ইমেইল ঠিকানা", "Email Address")}
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@argreengarden.com"
                  className="w-full bg-black/40 border border-white/15 text-white placeholder-white/30 py-3 px-4 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-white/70">
                    {t("পাসওয়ার্ড", "Password")}
                  </label>
                  <Link href="/forgot-password" className="text-[11px] text-emerald-400 font-mono hover:underline">
                    {t("ভুলে গেছেন?", "Forgot?")}
                  </Link>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/15 text-white placeholder-white/30 py-3 px-4 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin"></span>
                ) : (
                  <span>{t("লগইন করুন →", "Sign In to Portal →")}</span>
                )}
              </button>

              {/* Registration Link */}
              <p className="text-center text-xs text-white/50 pt-2 font-sans">
                {t("অ্যাকাউন্ট নেই?", "Don't have an account?")}{" "}
                <Link href="/register" className="text-emerald-400 hover:underline font-semibold">
                  {t("নতুন অ্যাকাউন্ট খুলুন", "Create an account")}
                </Link>
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
