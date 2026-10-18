"use client";

import React, { useState } from "react";

interface SecurityTabProps {
  sessionData?: any;
}

export default function SecurityTab({ sessionData }: SecurityTabProps) {
  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Logout all devices state
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutFeedback, setLogoutFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!oldPassword || !newPassword) {
      setFeedback({ type: "error", message: "বর্তমান এবং নতুন উভয় পাসওয়ার্ড প্রদান করুন।" });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({ type: "error", message: "নতুন পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: "error", message: "নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি।" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: data.message || "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setFeedback({ type: "error", message: data.error || "পাসওয়ার্ড পরিবর্তন করতে সমস্যা হয়েছে।" });
      }
    } catch {
      setFeedback({ type: "error", message: "সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি।" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutAllDevices = async () => {
    const confirmAction = window.confirm(
      "আপনি কি নিশ্চিত যে আপনার বর্তমান ব্রাউজার ব্যতীত অন্য সকল সক্রিয় ডিভাইস ও সেশন থেকে লগআউট করতে চান?"
    );
    if (!confirmAction) return;

    setLogoutLoading(true);
    setLogoutFeedback(null);
    try {
      const res = await fetch("/api/auth/logout-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        setLogoutFeedback({
          type: "success",
          message: data.message || "অন্যান্য সকল ডিভাইস থেকে সফলভাবে লগআউট করা হয়েছে!",
        });
      } else {
        setLogoutFeedback({
          type: "error",
          message: data.error || "ডিভাইস লগআউট করতে ব্যর্থ হয়েছে।",
        });
      }
    } catch {
      setLogoutFeedback({ type: "error", message: "সার্ভারে অনুরোধ পাঠানো যায়নি।" });
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      {/* Top Header */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl text-[#E4E2D7] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
            🛡️ Enterprise Security Hub
          </div>
          <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#E4E2D7]">সিকিউরিটি ও অ্যাক্সেস কন্ট্রোল</h3>
          <p className="text-xs text-white/60 mt-1">
            প্রশাসনিক ক্রেডেনশিয়ালস, পাসওয়ার্ড পরিবর্তন, এবং সেশন টোকেন সিকিউরিটি নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500/20 text-emerald-300 font-mono font-bold px-3 py-1.5 rounded-full uppercase text-[10px] border border-emerald-500/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ACTIVE SESSION SECURE
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Password Change Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-xs flex flex-col gap-5">
          <div className="border-b border-[#E4E2D7] pb-4">
            <h4 className="text-base font-bold text-[#121813] flex items-center gap-2">
              <span className="text-lg">🔑</span> পাসওয়ার্ড পরিবর্তন (Password Change)
            </h4>
            <p className="text-xs text-[#75787B] mt-1">
              আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিয়মিত শক্তিশালী পাসওয়ার্ড ব্যবহার করুন।
            </p>
          </div>

          {feedback && (
            <div
              className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-red-50 text-red-800 border-red-200"
              }`}
            >
              <span>{feedback.type === "success" ? "✓" : "⚠️"}</span>
              <span>{feedback.message}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#2D3B2D]">বর্তমান পাসওয়ার্ড *</label>
              <input
                type={showPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="বর্তমান পাসওয়ার্ড প্রদান করুন"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6D2C4] bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4D33]/30 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#2D3B2D]">নতুন পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর) *</label>
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="একটি শক্তিশালী নতুন পাসওয়ার্ড দিন"
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6D2C4] bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4D33]/30 text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-[#2D3B2D]">নতুন পাসওয়ার্ড নিশ্চিত করুন *</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ডটি আবার লিখুন"
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D6D2C4] bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4D33]/30 text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-[#555] select-none text-xs">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded text-[#2B4D33] focus:ring-[#2B4D33]"
                />
                পাসওয়ার্ড প্রদর্শন করুন
              </label>
              <span className="text-[11px] text-[#888]">সর্বনিম্ন ৮ অক্ষর</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full min-h-[44px] bg-[#2B4D33] hover:bg-[#1E3624] text-white font-medium rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  সংরক্ষণ করা হচ্ছে...
                </>
              ) : (
                <>
                  <span>🔒</span>
                  পাসওয়ার্ড আপডেট করুন
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Active Session & Logout From All Devices */}
        <div className="flex flex-col gap-6">
          {/* Active Session Credentials Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-xs flex flex-col gap-4">
            <div className="border-b border-[#E4E2D7] pb-3">
              <h4 className="text-base font-bold text-[#121813] flex items-center gap-2">
                <span>👤</span> বর্তমান অ্যাক্টিভ সেশন বিবরণী
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#F9F9FB] rounded-xl border border-[#EAE7DC]">
                <span className="text-[10px] text-[#75787B] uppercase tracking-wider block font-medium">ব্যবহারকারীর নাম</span>
                <span className="text-sm font-semibold text-[#121813] mt-0.5 block truncate">
                  {sessionData?.user?.name || "A R Green Garden Admin"}
                </span>
              </div>

              <div className="p-3 bg-[#F9F9FB] rounded-xl border border-[#EAE7DC]">
                <span className="text-[10px] text-[#75787B] uppercase tracking-wider block font-medium">নিবন্ধিত ইমেইল</span>
                <span className="text-sm font-semibold text-[#121813] mt-0.5 block truncate font-mono">
                  {sessionData?.user?.email || "admin@argreengarden.com"}
                </span>
              </div>

              <div className="p-3 bg-[#F9F9FB] rounded-xl border border-[#EAE7DC]">
                <span className="text-[10px] text-[#75787B] uppercase tracking-wider block font-medium">রোল পারমিশন</span>
                <span className="text-xs font-bold text-[#2B4D33] uppercase tracking-wider mt-1 block">
                  {sessionData?.user?.role || "ADMIN"}
                </span>
              </div>

              <div className="p-3 bg-[#F9F9FB] rounded-xl border border-[#EAE7DC]">
                <span className="text-[10px] text-[#75787B] uppercase tracking-wider block font-medium">টোকেন অ্যালগরিদম</span>
                <span className="text-xs font-mono text-[#555] mt-1 block">
                  HS256 (JWT Signed Cookie)
                </span>
              </div>
            </div>
          </div>

          {/* Logout from all devices card */}
          <div className="bg-[#FFF9F5] rounded-2xl p-6 sm:p-7 border border-[#F0D5C3] shadow-xs flex flex-col gap-4">
            <div className="border-b border-[#F0D5C3] pb-3">
              <h4 className="text-base font-bold text-[#8A3814] flex items-center gap-2">
                <span>🚨</span> সমস্ত ডিভাইস থেকে লগআউট (Logout All Devices)
              </h4>
              <p className="text-xs text-[#8A5A44] mt-1">
                আপনার পাসওয়ার্ড হ্যাক বা সেশন চুরির আশঙ্কা থাকলে এই বাটনে ক্লিক করুন। এটি তাৎক্ষণিকভাবে অন্য সব ফোন, ট্যাবলেট ও কম্পিউটারের টোকেন অবৈধ করে দেবে।
              </p>
            </div>

            {logoutFeedback && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 border ${
                  logoutFeedback.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                <span>{logoutFeedback.type === "success" ? "✓" : "⚠️"}</span>
                <span>{logoutFeedback.message}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLogoutAllDevices}
              disabled={logoutLoading}
              className="w-full min-h-[44px] bg-[#C84B31] hover:bg-[#A83820] text-white font-medium rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {logoutLoading ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  টোকেন অবৈধ করা হচ্ছে...
                </>
              ) : (
                <>
                  <span>📱🚫</span>
                  অন্যান্য সকল ডিভাইস থেকে অবিলম্বে লগআউট করুন
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
