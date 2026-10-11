"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface NavUserAuthBtnProps {
  isLightHeader?: boolean;
  user: any;
}

export default function NavUserAuthBtn({
  isLightHeader = false,
  user,
}: NavUserAuthBtnProps) {
  const { t } = useLanguage();

  if (user) {
    const dashboardRoute =
      user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "editor"
        ? "/admin"
        : user.role?.toLowerCase() === "employee"
        ? "/employee-portal"
        : user.role?.toLowerCase() === "moderator"
        ? "/moderator"
        : "/client-dashboard";

    return (
      <Link
        href={dashboardRoute}
        className="hidden sm:flex pl-1.5 pr-3.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-semibold shadow-xs transition-all items-center gap-2 cursor-pointer whitespace-nowrap border border-emerald-600/40 hover:scale-105 active:scale-95 duration-200 shrink-0"
        title={user.name ? `Logged in as ${user.name}` : "Dashboard"}
      >
        <div className="w-5 h-5 rounded-full overflow-hidden bg-emerald-950 border border-white/60 flex items-center justify-center shrink-0 shadow-inner">
          <img
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=064e3b&color=ffffff&bold=true&size=64`
            }
            alt={user.name || "User"}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="tracking-wide">Dashboard</span>
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className={`hidden sm:flex px-3.5 py-1 rounded-full text-xs font-semibold shadow-xs transition-all items-center gap-1.5 cursor-pointer whitespace-nowrap hover:scale-105 active:scale-95 duration-200 shrink-0 ${
        isLightHeader
          ? "bg-stone-100 hover:bg-stone-200 text-[#323232] border border-stone-300"
          : "bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-xs"
      }`}
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span>{t("লগইন", "Login")}</span>
    </Link>
  );
}
