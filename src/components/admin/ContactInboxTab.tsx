"use client";

import React, { useState } from "react";
import { IMessage } from "@/types";

interface ContactInboxTabProps {
  messages?: any[];
  handleDeleteMessage: (id: string) => void;
}

export default function ContactInboxTab({
  messages = [],
  handleDeleteMessage,
}: ContactInboxTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const filtered = messages.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.name?.toLowerCase().includes(term) ||
      m.email?.toLowerCase().includes(term) ||
      m.phone?.toLowerCase().includes(term) ||
      m.subject?.toLowerCase().includes(term) ||
      m.message?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans text-[#E4E2D7]">
      {/* Header Banner */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
            📬 Public Inquiries & Communications
          </div>
          <h3 className="font-serif font-bold text-xl text-white">গ্রাহক বার্তা ও কন্টাক্ট ইনবক্স</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            ওয়েবসাইটের যোগাযোগ ফর্ম থেকে আসা গ্রাহকদের সরাসরি বার্তা এবং অনুসন্ধানসমূহ।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono text-stone-300">
            মোট বার্তা: <b className="text-emerald-400 text-sm font-bold">{messages.length}</b>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#18221A]/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="নাম, ইমেইল বা বিষয় দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/15 pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <span className="absolute left-3 top-3 text-xs text-stone-400">🔍</span>
        </div>

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="text-xs text-stone-400 hover:text-white font-mono cursor-pointer transition-colors"
          >
            ক্লিয়ার ফিল্টার ✕
          </button>
        )}
      </div>

      {/* Messages List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.length === 0 ? (
          <div className="bg-[#18221A]/85 backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center flex flex-col items-center justify-center gap-3">
            <span className="text-4xl">📭</span>
            <p className="font-serif text-base text-white font-bold">কোনো নতুন বার্তা পাওয়া যায়নি</p>
            <p className="text-xs text-stone-400 font-mono">
              {searchTerm ? "আপনার সার্চে কোনো বার্তা মেলেনি।" : "ইনবক্স সম্পূর্ণ পরিষ্কার রয়েছে।"}
            </p>
          </div>
        ) : (
          filtered.map((m: any) => (
            <div
              key={m.id || m._id}
              className="bg-[#18221A]/85 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 p-5 sm:p-6 rounded-2xl flex flex-col gap-4 shadow-lg transition-all"
            >
              {/* Message Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                    {m.name ? m.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight">{m.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-stone-400 font-mono mt-0.5 flex-wrap">
                      {m.email && <span>✉️ {m.email}</span>}
                      {m.phone && <span>📞 {m.phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-stone-400 bg-white/[0.03] px-2.5 py-1 rounded-lg border border-white/5">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString("bn-BD", { dateStyle: "medium", timeStyle: "short" }) : "Recent"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("আপনি কি নিশ্চিতভাবে এই বার্তাটি মুছে ফেলতে চান?")) {
                        handleDeleteMessage(m.id || m._id);
                      }
                    }}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-mono transition-colors cursor-pointer"
                    title="Delete message"
                    aria-label="Delete message"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {/* Subject & Body */}
              <div className="space-y-2">
                {m.subject && (
                  <div className="inline-block px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-xs">
                    বিষয়: {m.subject}
                  </div>
                )}
                <div className="bg-black/40 border border-white/5 p-4 rounded-xl text-xs text-stone-200 leading-relaxed font-sans whitespace-pre-wrap">
                  {m.message}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
