"use client";

import React, { useState, useEffect, useMemo } from "react";
import { IService } from "@/types";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import { toast, ToastContainer } from "@/components/shared/Toast";

interface ServicesTabProps {
  services?: IService[];
  serviceLabel: string;
  setServiceLabel: (val: string) => void;
  serviceDesc: string;
  setServiceDesc: (val: string) => void;
  serviceIcon: string;
  setServiceIcon: (val: string) => void;
  editingService: IService | null;
  setEditingService: (val: IService | null) => void;
  handleCreateOrUpdateService: (e: React.FormEvent, payload?: any) => void;
  handleEditServiceClick: (service: IService) => void;
  handleDeleteService: (id?: string) => void;
}

const PRESET_ICONS = ["🏛️", "🗺️", "🏙️", "🩺", "⛲", "💧", "🌿", "🌳", "🌸", "🌻", "🏡", "🪴"];

const PRESET_CATEGORIES = [
  "Landscape Architecture",
  "Master Planning & Eco Parks",
  "Urban Biophilia",
  "Ecology & Tree Doctor",
  "Water Features & Pergolas",
  "Smart Irrigation",
  "Rooftop Gardening",
  "Indoor Plants",
];

export default function ServicesTab({
  services = [],
  serviceLabel,
  setServiceLabel,
  serviceDesc,
  setServiceDesc,
  serviceIcon,
  setServiceIcon,
  editingService,
  setEditingService,
  handleCreateOrUpdateService,
  handleEditServiceClick,
  handleDeleteService,
}: ServicesTabProps) {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states
  const [banner, setBanner] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [descBn, setDescBn] = useState("");
  const [featuresEn, setFeaturesEn] = useState<string>("");
  const [featuresBn, setFeaturesBn] = useState<string>("");
  const [category, setCategory] = useState("Landscape Architecture");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [showSeo, setShowSeo] = useState(false);

  // Action states
  const [deleteTarget, setDeleteTarget] = useState<IService | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Sync state when editingService changes
  useEffect(() => {
    if (editingService) {
      setBanner(editingService.banner || editingService.bannerImage || "");
      setTitleBn(editingService.titleBn || "");
      setDescBn(editingService.descBn || "");
      setCategory((editingService as any).category || "Landscape Architecture");

      const feats = (editingService as any).features || (editingService as any).scopeEn || [];
      const featsBn = (editingService as any).scopeBn || [];
      setFeaturesEn(Array.isArray(feats) ? feats.join(", ") : "");
      setFeaturesBn(Array.isArray(featsBn) ? featsBn.join(", ") : "");

      setSeoTitle((editingService as any).seoTitle || "");
      setSeoKeywords((editingService as any).seoKeywords || "");
      setSeoDescription((editingService as any).seoDescription || "");

      setIsModalOpen(true);
    }
  }, [editingService]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen && !isSaving) {
        handleCloseModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, isSaving]);

  const handleOpenCreateModal = () => {
    setEditingService(null);
    setServiceLabel("");
    setServiceDesc("");
    setServiceIcon("🌱");
    setTitleBn("");
    setDescBn("");
    setBanner("");
    setFeaturesEn("");
    setFeaturesBn("");
    setCategory("Landscape Architecture");
    setSeoTitle("");
    setSeoKeywords("");
    setSeoDescription("");
    setShowSeo(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setServiceLabel("");
    setServiceDesc("");
    setServiceIcon("🌱");
    setTitleBn("");
    setDescBn("");
    setBanner("");
    setFeaturesEn("");
    setFeaturesBn("");
    setShowSeo(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const parsedFeaturesEn = featuresEn
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);
    const parsedFeaturesBn = featuresBn
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const servicePayload = {
      label: serviceLabel,
      titleBn,
      descBn,
      category,
      icon: serviceIcon || "🌱",
      desc: serviceDesc,
      bannerImage: banner,
      features: parsedFeaturesEn,
      scopeBn: parsedFeaturesBn,
      seoTitle,
      seoKeywords,
      seoDescription,
    };

    try {
      await handleCreateOrUpdateService(e, servicePayload);
      if (editingService) {
        toast.success("সেবা সফলভাবে আপডেট করা হয়েছে! 🌿", { title: "হালনাগাদ সম্পন্ন" });
      } else {
        toast.success("নতুন সেবা সফলভাবে যোগ করা হয়েছে! ✨", { title: "সংরক্ষিত" });
      }
      handleCloseModal();
    } catch (err: any) {
      toast.error(err?.message || "সেবা সংরক্ষণ করতে সমস্যা হয়েছে।", { title: "ব্যর্থ হয়েছে" });
    } finally {
      setIsSaving(false);
    }
  };

  // Up/Down reordering handler
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (isReordering) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const newItems = [...services];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setIsReordering(true);
    try {
      const payload = {
        items: newItems.map((item, idx) => ({
          id: item.id || (item as any)._id,
          order: idx,
        })),
      };
      const res = await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        toast.success("সেবার নতুন ক্রম সংরক্ষণ করা হয়েছে ↕️", { title: "ক্রম পরিবর্তিত" });
        setTimeout(() => window.location.reload(), 600);
      } else {
        toast.error("ক্রম পরিবর্তন করতে সমস্যা হয়েছে।", { title: "এরর" });
      }
    } catch (err) {
      console.error("Failed to reorder services:", err);
    } finally {
      setIsReordering(false);
    }
  };

  // Filtered services list
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase();
    return services.filter((s) => {
      const label = (s.label || s.title || "").toLowerCase();
      const bn = (s.titleBn || "").toLowerCase();
      const desc = (s.desc || s.description || "").toLowerCase();
      const cat = ((s as any).category || "").toLowerCase();
      return label.includes(q) || bn.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [services, searchQuery]);

  // Metrics
  const stats = useMemo(() => {
    const total = services.length;
    const bilingual = services.filter((s) => Boolean(s.titleBn && s.titleBn.trim())).length;
    const withBanner = services.filter((s) => Boolean(s.banner || s.bannerImage)).length;
    return { total, bilingual, withBanner };
  }, [services]);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-fade-in font-sans text-stone-900 max-w-7xl mx-auto w-full px-2 sm:px-0">
      {/* ── TOP HERO & METRICS HEADER ── */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Glow accents */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-mono font-medium">
              <span>🌿 Architectural Disciplines Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-light tracking-tight text-emerald-50">
              সার্ভিস ও সেবা ব্যবস্থাপনা
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              হোমপেজের ফ্লিপ-কার্ড ও সার্ভিস ক্যাটালগের কনটেন্ট, বাংলা-ইংরেজি বিবরণ এবং ক্রম পরিচালনা করুন।
            </p>

            {/* Quick Metrics Pills */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-emerald-100 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                মোট সেবা: <b className="text-white">{stats.total}</b> টি
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-teal-100 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                বাংলা যুক্ত: <b className="text-white">{stats.bilingual}</b> টি
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-amber-100 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                ব্যানারসহ: <b className="text-white">{stats.withBanner}</b> টি
              </span>
            </div>
          </div>

          {/* Primary Action Button: Opens Modal */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/30 transition-all cursor-pointer active:scale-95"
            >
              <span className="text-lg">➕</span>
              <span>নতুন সেবা যোগ করুন</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── SEARCH & CONTROLS BAR ── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 w-full sm:w-auto">
          <span className="text-base">📋</span>
          <span>বিদ্যমান সেবাসমূহ ({services.length})</span>
          {searchQuery && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px]">
              {filteredServices.length}টি ফলাফল
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="সেবা বা বিবরণ দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-8 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[40px] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="sm:hidden shrink-0 px-3 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>➕</span>
            <span>যোগ</span>
          </button>
        </div>
      </div>

      {/* ── SERVICES GRID LIST ── */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-3">
          <span className="text-4xl block">🔍</span>
          <p className="text-sm font-semibold text-stone-700">কোনো সেবা পাওয়া যায়নি</p>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            আপনার অনুসন্ধানের সাথে মেলে এমন কোনো সেবা পাওয়া যায়নি। ফিল্টার রিসেট করুন অথবা নতুন সেবা যোগ করুন।
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                অনুসন্ধান ক্লিয়ার করুন
              </button>
            )}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer"
            >
              ➕ নতুন সেবা যোগ করুন
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredServices.map((s, index) => {
            const serviceId = s.id || (s as any)._id;
            const originalIndex = services.findIndex(
              (item) => (item.id || (item as any)._id) === serviceId
            );

            return (
              <div
                key={serviceId || index}
                className="bg-white border border-stone-200/90 hover:border-emerald-600/40 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all hover:shadow-md group"
              >
                {/* Header Row: Icon, Index, Titles & Reorder */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-2xl shadow-2xs shrink-0 group-hover:scale-105 transition-transform">
                      {s.icon && (s.icon.startsWith("http") || s.icon.startsWith("/")) ? (
                        <img src={s.icon} alt="" className="w-7 h-7 object-contain" />
                      ) : (
                        <span>{s.icon || "🌱"}</span>
                      )}
                    </div>

                    {/* Titles & Status */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                          #{String((s.order ?? originalIndex) + 1).padStart(2, "0")}
                        </span>
                        {s.titleBn ? (
                          <span className="text-[10px] text-teal-700 bg-teal-50 border border-teal-200/50 px-2 py-0.5 rounded-md font-medium">
                            ✓ বাংলা যুক্ত
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/50 px-2 py-0.5 rounded-md font-medium">
                            ⚠️ বাংলা বাকি
                          </span>
                        )}
                        {(s as any).category && (
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-medium truncate max-w-[130px]">
                            {(s as any).category}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-stone-900 text-sm sm:text-base mt-1.5 truncate">
                        {s.label || s.title}
                      </h3>
                      {s.titleBn && (
                        <p className="text-xs text-emerald-800 font-medium truncate mt-0.5">
                          {s.titleBn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Reorder Buttons (▲ / ▼) */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={originalIndex <= 0 || isReordering}
                      onClick={() => handleMoveOrder(originalIndex, "up")}
                      className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 flex items-center justify-center text-[10px] disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors"
                      title="উপরে নিন"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={originalIndex >= services.length - 1 || isReordering}
                      onClick={() => handleMoveOrder(originalIndex, "down")}
                      className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 flex items-center justify-center text-[10px] disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors"
                      title="নিচে নিন"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Description Snippet */}
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed bg-stone-50/60 p-2.5 rounded-xl border border-stone-100">
                  {s.descBn || s.desc || s.description || "কোনো বিবরণ প্রদান করা হয়নি।"}
                </p>

                {/* Footer: Banner Thumbnail & Action Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 gap-3">
                  {/* Banner status/thumbnail */}
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 min-w-0">
                    {s.banner || s.bannerImage ? (
                      <div className="flex items-center gap-1.5">
                        <img
                          src={s.banner || s.bannerImage}
                          alt=""
                          className="w-8 h-6 rounded-md object-cover border border-stone-200"
                        />
                        <span className="text-[11px] text-stone-500 truncate hidden sm:inline">
                          ব্যানার সক্রিয়
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-stone-400">🖼️ ব্যানার নেই</span>
                    )}
                  </div>

                  {/* Edit & Delete Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditServiceClick(s)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-stone-50 hover:bg-emerald-50 text-emerald-800 border border-stone-200 hover:border-emerald-300 rounded-xl text-xs font-bold cursor-pointer transition-all min-h-[36px]"
                    >
                      <span>✏️</span>
                      <span>এডিট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(s)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-stone-50 hover:bg-rose-50 text-rose-700 border border-stone-200 hover:border-rose-300 rounded-xl text-xs font-bold cursor-pointer transition-all min-h-[36px]"
                    >
                      <span>🗑️</span>
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          POPUP MODAL: ADD / EDIT SERVICE (A to Z Fields)
      ══════════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop Click */}
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!isSaving) handleCloseModal();
            }}
          />

          {/* Modal Dialog Card */}
          <div className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-stone-200 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-lg font-bold shadow-sm">
                  {editingService ? "✏️" : "✨"}
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-tight">
                    {editingService
                      ? `সেবা সম্পাদনা: ${editingService.label || editingService.title}`
                      : "নতুন সেবা তৈরি করুন"}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {editingService
                      ? "প্রয়োজনীয় তথ্য পরিবর্তন করে নিচে সংরক্ষণ বাটনে চাপুন"
                      : "সবগুলো ফিল্ড সঠিকভাবে পূরণ করে নতুন সেবা ক্যাটালগে যুক্ত করুন"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="w-9 h-9 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                title="বন্ধ করুন (Esc)"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Scrollable Form */}
            <form id="service-modal-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* ── SECTION 1: BASIC INFO ── */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                  <span>০১</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>মৌলিক তথ্য (Basic Info)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* English Title */}
                  <div className="sm:col-span-6 space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      সেবার ইংরেজি নাম (English Title) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Landscape Architecture"
                      value={serviceLabel}
                      onChange={(e) => setServiceLabel(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] transition-all"
                    />
                  </div>

                  {/* Bangla Title */}
                  <div className="sm:col-span-6 space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      সেবার বাংলা নাম (Bangla Title) <span className="text-emerald-700 text-[11px]">(প্রয়োজনীয়)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ল্যান্ডস্কেপ স্থাপত্য ও নকশা"
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] transition-all"
                    />
                  </div>
                </div>

                {/* Category & Icon */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  {/* Category Selector */}
                  <div className="sm:col-span-8 space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      ক্যাটাগরি (Category)
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] cursor-pointer"
                      >
                        {PRESET_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Emoji / Icon Input */}
                  <div className="sm:col-span-4 space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      আইকন ইমোজি <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="🌱"
                      value={serviceIcon}
                      onChange={(e) => setServiceIcon(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-center text-lg text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] transition-all"
                    />
                  </div>
                </div>

                {/* Quick Icon Selector */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] text-stone-400 font-medium mr-1">ক্লিক করে নির্বাচন করুন:</span>
                  {PRESET_ICONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setServiceIcon(emoji)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-transform active:scale-90 ${
                        serviceIcon === emoji
                          ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-500/30 scale-110"
                          : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── SECTION 2: DESCRIPTIONS ── */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                  <span>০২</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>বিস্তারিত বিবরণ (Descriptions)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* English Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      English Description <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Detailed spatial design integrating built architecture..."
                      value={serviceDesc}
                      onChange={(e) => setServiceDesc(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all"
                    />
                  </div>

                  {/* Bangla Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      বাংলা বিবরণ (Bangla Description) <span className="text-emerald-700 text-[11px]">(কার্ডের পেছনে দেখায়)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="ভবনের মূল স্থাপত্যের সাথে বায়োফিলিক উপাদান এবং জীবন্ত উদ্ভিদের সমন্বয়ে প্রণয়ন..."
                      value={descBn}
                      onChange={(e) => setDescBn(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 3: FEATURES / SCOPES ── */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                  <span>০৩</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>সেবার পরিধি ও ডেলিভারেবলস (Scope & Deliverables)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      Scope Points (English) — <span className="text-stone-400 font-normal">কমা দিয়ে আলাদা করুন</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Concept & 3D, Structural Load, 100% Waterproofing"
                      value={featuresEn}
                      onChange={(e) => setFeaturesEn(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-stone-700 block">
                      সেবার পরিধি পয়েন্ট (বাংলা) — <span className="text-stone-400 font-normal">কমা দিয়ে আলাদা করুন</span>
                    </label>
                    <input
                      type="text"
                      placeholder="কনসেপ্ট ও থ্রিডি ভিজ্যুয়ালাইজেশন, ড্রেনেজ সমন্বয়, টার্ন-কি সাইট বাস্তবায়ন"
                      value={featuresBn}
                      onChange={(e) => setFeaturesBn(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 4: BANNER IMAGE ── */}
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
                  <span>০৪</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>ব্যানার ছবি (Banner Image)</span>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-full sm:w-36 h-24 rounded-xl bg-stone-200 overflow-hidden border border-stone-300 relative shrink-0 flex items-center justify-center">
                    {banner ? (
                      <>
                        <img
                          src={banner}
                          alt="Banner Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/hero_plants.png";
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setBanner("")}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center hover:bg-rose-600 transition-colors"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <div className="text-center p-2">
                        <span className="text-xl block">🖼️</span>
                        <span className="text-[10px] text-stone-400">ছবি নেই</span>
                      </div>
                    )}
                  </div>

                  {/* Uploader & Input */}
                  <div className="flex-1 w-full space-y-2.5">
                    <CloudinaryUploader
                      value={banner}
                      onUpload={(url) => setBanner(url)}
                      label="📁 ছবি আপলোড করুন (Cloudinary)"
                    />
                    <input
                      type="text"
                      placeholder="অথবা সরাসরি ছবির URL: https://... বা /hero_plants.png"
                      value={banner}
                      onChange={(e) => setBanner(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[40px]"
                    />
                  </div>
                </div>
              </div>

              {/* ── SECTION 5: SEO ACCORDION ── */}
              <div className="border-t border-stone-100 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSeo(!showSeo)}
                  className="flex items-center justify-between w-full py-2 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>🔍</span>
                    <span>এসইও মেটাডাটা কনফিগারেশন (ঐচ্ছিক)</span>
                  </span>
                  <span className="text-stone-400 font-mono text-xs">{showSeo ? "▲ লুকান" : "▼ দেখুন"}</span>
                </button>

                {showSeo && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-600">SEO Title</label>
                      <input
                        type="text"
                        placeholder="Page Title"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-600">Keywords</label>
                      <input
                        type="text"
                        placeholder="tag1, tag2"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-stone-600">Description</label>
                      <input
                        type="text"
                        placeholder="Meta description"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Modal Footer: Action Buttons */}
            <div className="px-6 py-4 border-t border-stone-200 bg-stone-50/80 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                form="service-modal-form"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : editingService ? (
                  <>
                    <span>💾</span>
                    <span>সেবা সংরক্ষণ করুন</span>
                  </>
                ) : (
                  <>
                    <span>➕</span>
                    <span>সেবা তৈরি করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOASTIFY CONTAINER ── */}
      <ToastContainer position="top-right" />

      {/* ── CONFIRMATION MODAL FOR DELETION ── */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            const targetId = deleteTarget.id || (deleteTarget as any)._id;
            const name = deleteTarget.label || deleteTarget.title || "সেবা";
            handleDeleteService(targetId);
            toast.info(`"${name}" সেবাটি মুছে ফেলা হয়েছে।`, { title: "মুছে ফেলা হয়েছে" });
            setDeleteTarget(null);
          }}
          title="সেবা মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে "${deleteTarget.label || deleteTarget.title}" সেবাটি মুছে ফেলতে চান? এটি মুছে ফেললে ওয়েবসাইট থেকে সেবাটি প্রদর্শিত হবে না।`}
          itemName={deleteTarget.label || deleteTarget.title}
          confirmLabel="হ্যাঁ, মুছে ফেলুন"
          cancelLabel="বাতিল"
          variant="danger"
        />
      )}
    </div>
  );
}
