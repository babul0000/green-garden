"use client";

import React from "react";

export default function SecurityTab({ sessionData }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-serif font-bold text-lg text-[#0c1911]">Security Control</h3>
        <p className="text-xs text-slate-400 mt-0.5">Manage administrative credentials, permissions and active session logs.</p>
      </div>

      <div className="bg-[#f8faf9] p-6 rounded-[24px] border border-slate-200/60 max-w-xl text-xs flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
          <span className="font-bold text-slate-500">Active Admin Session:</span>
          <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full uppercase text-[9px] border border-emerald-100">Active</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-500">User Identification:</span>
          <span className="text-[#0c1911] font-semibold">{sessionData?.user?.name || "Fandaww Punx"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-500">Email Address:</span>
          <span className="text-[#0c1911] font-semibold">{sessionData?.user?.email || "fandaww6@gmail.com"}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-bold text-slate-500">Workspace Authority Level:</span>
          <span className="text-[#8ac343] font-bold uppercase tracking-wider">{sessionData?.user?.role || "Admin"}</span>
        </div>
        <div className="border-t border-slate-200/60 pt-4 mt-2">
          <p className="text-[10px] text-slate-400 leading-normal">
            This control panel uses secure MongoDB database connection and encryption keys. Permissions are synced using NextAuth credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
