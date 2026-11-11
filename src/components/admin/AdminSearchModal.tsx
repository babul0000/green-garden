"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { canAccessTab } from "@/lib/rbac";
import {
  DASHBOARD_SEARCH_REGISTRY,
  searchDashboard,
  DashboardSearchItem,
} from "./adminSearchRegistry";

interface AdminSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tabId: string, subTab?: string) => void;
}

export default function AdminSearchModal({
  isOpen,
  onClose,
  onSelect,
}: AdminSearchModalProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 40);
    }
  }, [isOpen]);

  // All accessible items when query is empty, or filtered results when typing
  const results = useMemo(() => {
    const base = query.trim()
      ? searchDashboard(query, user?.role)
      : DASHBOARD_SEARCH_REGISTRY;
    return base.filter((item) => canAccessTab(user?.role, item.tabId));
  }, [query, user?.role]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown" && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp" && results.length > 0) {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const chosen = results[selectedIndex] || results[0];
        if (chosen) {
          onSelect(chosen.tabId, chosen.sub);
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onSelect, onClose]);

  if (!isOpen) return null;

  const quickTags = [
    { label: "📖 স্টুডিও পরিচিতি (About)", q: "about" },
    { label: "👥 টিম ও কর্মী", q: "কর্মী" },
    { label: "📅 হাজিরা শিট", q: "হাজিরা" },
    { label: "🧾 ইনভয়েস ও বিল", q: "ইনভয়েস" },
    { label: "📐 ৪-ধাপ প্রসেস", q: "প্রসেস" },
    { label: "🎥 হিরো ভিডিও", q: "হিরো" },
    { label: "🔍 এসইও (SEO)", q: "এসইও" },
    { label: "🛡️ রোল পারমিশন", q: "পারমিশন" },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] sm:pt-[12vh] px-3 sm:px-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Universal Dashboard Search"
    >
      <div
        className="w-full max-w-2xl bg-[#FAF9F5] border border-[#D6D2C4] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[78vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input */}
        <div className="p-4 bg-white border-b border-[#E4E2D7] flex items-center gap-3">
          <svg
            className="w-5 h-5 text-[#2B4D33] shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ড্যাশবোর্ডের যেকোনো সেকশন, About, টিম, হাজিরা বা সেটিংস খুঁজুন..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#121813] placeholder-[#75787B] focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="px-2 py-1 text-[11px] font-mono bg-[#E4E2D7] hover:bg-[#D6D2C4] text-[#121813] rounded-lg cursor-pointer"
            >
              মুছুন
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-[11px] font-mono border border-[#D6D2C4] rounded-lg text-[#75787B] hover:text-[#121813] hover:bg-[#FAF9F5] cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Chips */}
        <div className="px-4 py-2.5 bg-[#F4F2EC] border-b border-[#E4E2D7] flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[10px] font-mono font-bold text-[#75787B] uppercase shrink-0 mr-1">
            জনপ্রিয়:
          </span>
          {quickTags.map((tag) => (
            <button
              key={tag.q}
              type="button"
              onClick={() => {
                setQuery(tag.q);
                inputRef.current?.focus();
              }}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border transition-all cursor-pointer shrink-0 ${
                query.toLowerCase() === tag.q.toLowerCase()
                  ? "bg-[#2B4D33] text-white border-[#2B4D33]"
                  : "bg-white hover:bg-[#E4E2D7] text-[#121813] border-[#D6D2C4]"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
          <div className="px-2 pb-1 flex items-center justify-between text-[11px] font-mono text-[#75787B]">
            <span>
              {query.trim()
                ? `"${query}" এর জন্য ${results.length}টি অপশন পাওয়া গেছে`
                : `সকল ড্যাশবোর্ড সেকশন ও ফিচার (${results.length}টি)`}
            </span>
            <span className="hidden sm:inline">↑↓ নেভিগেট • Enter খুলুন</span>
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#75787B]">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="font-bold text-[#121813]">কোনো মিল পাওয়া যায়নি</p>
              <p className="mt-1">ইংরেজি বা বাংলা অন্য শব্দ দিয়ে চেষ্টা করুন (যেমন: about, team, invoice, seo)</p>
            </div>
          ) : (
            results.map((item: DashboardSearchItem, idx: number) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(idx)}
                  onClick={() => {
                    onSelect(item.tabId, item.sub);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 border cursor-pointer ${
                    isSelected
                      ? "bg-[#2B4D33] text-white border-[#2B4D33] shadow-md"
                      : "bg-white hover:bg-[#F5F4EE] text-[#121813] border-[#D6D2C4]/80"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                      isSelected
                        ? "bg-white/20 border-white/30 text-white"
                        : "bg-[#FAF9F5] border-[#D6D2C4] text-[#121813]"
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs sm:text-sm truncate">
                        {item.titleBn}
                      </span>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                            isSelected
                              ? "bg-white/25 text-white"
                              : "bg-[#2B4D33]/10 text-[#2B4D33]"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-[10.5px] font-mono truncate mt-0.5 ${
                        isSelected ? "text-white/80" : "text-[#75787B]"
                      }`}
                    >
                      {item.categoryBn} • {item.titleEn}
                    </p>
                    <p
                      className={`text-[11px] line-clamp-1 mt-0.5 ${
                        isSelected ? "text-white/90" : "text-[#4F5255]"
                      }`}
                    >
                      {item.descriptionBn}
                    </p>
                  </div>
                  <span
                    className={`text-sm font-bold shrink-0 ${
                      isSelected ? "text-white" : "text-[#2B4D33]"
                    }`}
                  >
                    ➔
                  </span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

