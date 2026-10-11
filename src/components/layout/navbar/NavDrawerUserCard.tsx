"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface NavDrawerUserCardProps {
  user: any;
  onLogout: () => void;
  onClose: () => void;
}

export default function NavDrawerUserCard({
  user,
  onLogout,
  onClose,
}: NavDrawerUserCardProps) {
  const { t } = useLanguage();

  return (
    <div className="pt-4 border-t border-[#D6D2C4]">
      {user ? (
        <div className="flex items-center justify-between bg-white/80 p-3.5 rounded-2xl border border-[#D6D2C4] shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-emerald-950 border border-emerald-500/40 shrink-0 flex items-center justify-center shadow-inner">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=064e3b&color=ffffff&bold=true&size=64`
                }
                alt={user.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-[#121813] truncate max-w-[120px]">
                {user.name}
              </p>
              <p className="text-[10px] text-emerald-800 font-mono uppercase tracking-wider">
                {user.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={
                user.role?.toLowerCase() === "admin" || user.role?.toLowerCase() === "editor"
                  ? "/admin"
                  : user.role?.toLowerCase() === "employee"
                  ? "/employee-portal"
                  : user.role?.toLowerCase() === "moderator"
                  ? "/moderator"
                  : "/client-dashboard"
              }
              onClick={onClose}
              className="px-3 py-1.5 bg-[#2B4D33] hover:bg-[#1E3724] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              type="button"
              className="px-2.5 py-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {t("লগআউট", "Logout")}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2.5">
          <Link
            href="/login"
            onClick={onClose}
            className="flex-1 text-center py-2.5 bg-[#2B4D33] hover:bg-[#1E3724] text-white rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            👤 {t("লগইন করুন", "Sign In")}
          </Link>
          <Link
            href="/register"
            onClick={onClose}
            className="flex-1 text-center py-2.5 bg-white/60 hover:bg-white text-[#323232] border border-[#D6D2C4] rounded-xl text-xs font-bold transition-all"
          >
            ✨ {t("রেজিস্ট্রেশন", "Register")}
          </Link>
        </div>
      )}
    </div>
  );
}
