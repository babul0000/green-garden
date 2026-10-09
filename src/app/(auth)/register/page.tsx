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
      const result = await register({
        name,
        email,
        password,
        role
      });

      if (!result.success) {
        setError(result.error || t("অ্যাকাউন্ট তৈরি করতে সমস্যা হচ্ছে", "Failed to create account"));
      } else {
        setSuccess(true);
        const destination = result.user?.role === "admin" || result.user?.role === "editor" 
          ? "/admin" 
          : "/client-dashboard";
        setTimeout(() => {
          window.location.href = destination;
        }, 700);
      }
    } catch (err: any) {
      console.error("Sign up error:", err);
      setError(t("অপ্রত্যাশিত সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।", "An unexpected error occurred. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col items-center justify-center bg-[#121A14] text-white px-4 sm:px-6 py-16 overflow-hidden">
      {/* Background Architectural Ambient Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 space-y-6 animate-fade-in-up">
        
        {/* Studio Identity Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/80">
              A R Green Garden Studio • Registration
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#E4E2D7]">
            {t("নতুন অ্যাকাউন্ট তৈরি করুন", "Create Your Account")}
          </h1>
          <p className="text-xs text-white/60 font-sans leading-relaxed max-w-sm mx-auto">
            {t(
              "ছাদবাগান ও ল্যান্ডস্কেপ প্রজেক্ট পরিচালনা ও ক্লায়েন্ট সার্ভিসের জন্য যুক্ত হোন।",
              "Join our landscape architecture & rooftop ecosystem client platform."
            )}
          </p>
        </div>

        {/* Main Architectural Card */}
        <div className="bg-[#18221A]/90 backdrop-blur-xl border border-white/15 rounded-[32px] p-7 sm:p-9 shadow-2xl space-y-5">
          
          {success ? (
            <div className="text-center py-6 flex flex-col gap-3 items-center justify-center animate-fade-in-up">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-display font-bold text-white">
                {t("রেজিস্ট্রেশন সফল হয়েছে!", "Registration Successful!")}
              </h3>
              <p className="text-xs text-white/60 font-sans leading-relaxed">
                {t("আপনার অ্যাকাউন্ট তৈরি সম্পন্ন হয়েছে। ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...", "Your account has been created. Redirecting to dashboard...")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-medium p-3 rounded-xl flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70 block">
                  {t("পূর্ণ নাম", "Full Name")}
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="তানভীর আহমেদ"
                  className="w-full bg-black/40 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-white/70 block">
                  {t("ইমেইল ঠিকানা", "Email Address")}
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full bg-black/40 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-white/70 block">
                    {t("পাসওয়ার্ড", "Password")}
                  </label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-white/70 block">
                    {t("নিশ্চিত করুন", "Confirm")}
                  </label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/40 border border-white/15 text-white placeholder-white/30 py-2.5 px-4 rounded-xl text-xs font-mono focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-mono text-xs uppercase tracking-wider font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-stone-950/30 border-t-stone-950 rounded-full animate-spin"></span>
                ) : (
                  <span>{t("রেজিস্ট্রেশন সম্পন্ন করুন →", "Complete Registration →")}</span>
                )}
              </button>

              {/* Back to Login */}
              <p className="text-center text-xs text-white/50 pt-2 font-sans">
                {t("ইতিমধ্যে অ্যাকাউন্ট আছে?", "Already have an account?")}{" "}
                <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
                  {t("লগইন করুন", "Sign In")}
                </Link>
              </p>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
