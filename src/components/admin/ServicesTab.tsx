"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { IService } from "@/types";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";

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
  const [deleteTarget, setDeleteTarget] = useState<IService | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (editingService) {
      setBanner(editingService.banner || editingService.bannerImage || "");
      setTitleBn(editingService.titleBn || "");
      setDescBn(editingService.descBn || "");
      setCategory((editingService as any).category || "Landscape Architecture");

      // Features / Scopes
      const feats = (editingService as any).features || (editingService as any).scopeEn || [];
      const featsBn = (editingService as any).scopeBn || [];
      setFeaturesEn(Array.isArray(feats) ? feats.join(", ") : "");
      setFeaturesBn(Array.isArray(featsBn) ? featsBn.join(", ") : "");

      setSeoTitle((editingService as any).seoTitle || "");
      setSeoKeywords((editingService as any).seoKeywords || "");
      setSeoDescription((editingService as any).seoDescription || "");
    } else {
      setBanner("");
      setTitleBn("");
      setDescBn("");
      setFeaturesEn("");
      setFeaturesBn("");
      setCategory("Landscape Architecture");
      setSeoTitle("");
      setSeoKeywords("");
      setSeoDescription("");
    }
  }, [editingService]);

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
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingService(null);
    setServiceLabel("");
    setServiceDesc("");
    setServiceIcon("🌱");
    setTitleBn("");
    setDescBn("");
    setBanner("");
    setFeaturesEn("");
    setFeaturesBn("");
  };

  const handleEditClickWithScroll = (srv: IService) => {
    handleEditServiceClick(srv);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
      await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to reorder services:", err);
    } finally {
      setIsReordering(false);
    }
  };

  // Filtered services
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase();
    return services.filter((s) => {
      const label = (s.label || s.title || "").toLowerCase();
      const bn = (s.titleBn || "").toLowerCase();
      const desc = (s.desc || s.description || "").toLowerCase();
      return label.includes(q) || bn.includes(q) || desc.includes(q);
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
      {/* ── TOP HERO & METRICS BAR ── */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-mono font-medium">
              <span>🌿 Architectural Disciplines & Catalog</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-light tracking-tight text-emerald-50">
              সার্ভিস ও সেবা ব্যবস্থাপনা
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 font-light leading-relaxed">
              হোমপেজের ফ্লিপ-কার্ড ও সেবা পেইজের কনটেন্ট, বাংলা-ইংরেজি বিবরণ, ব্যানার এবং ক্রম সজ্জা সহজেই পরিচালনা করুন।
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
                {stats.total}
              </span>
              <span className="text-[11px] sm:text-xs text-white/70 block mt-0.5">মোট সেবা</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-teal-300">
                {stats.bilingual}
              </span>
              <span className="text-[11px] sm:text-xs text-white/70 block mt-0.5">বাংলা যুক্ত</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10 text-center">
              <span className="block text-2xl sm:text-3xl font-bold font-mono text-amber-300">
                {stats.withBanner}
              </span>
              <span className="text-[11px] sm:text-xs text-white/70 block mt-0.5">ব্যানারসহ</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── CREATE / EDIT FORM CONTAINER ── */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        autoComplete="off"
        className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm flex flex-col gap-6 transition-all"
      >
        {/* Form Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-xl font-bold">
              {editingService ? "✏️" : "✨"}
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-800">
                {editingService
                  ? `সেবা সম্পাদনা: ${editingService.label || editingService.title}`
                  : "নতুন সেবা যোগ করুন"}
              </h3>
              <p className="text-xs text-stone-400">
                {editingService
                  ? "তথ্য পরিবর্তন শেষে 'সেবা সংরক্ষণ করুন' বাটনে ক্লিক করুন"
                  : "ফর্মটি পূরণ করে নতুন সেবা ক্যাটালগে অন্তর্ভুক্ত করুন"}
              </p>
            </div>
          </div>

          {editingService && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer min-h-[44px]"
            >
              ✕ এডিট বাতিল করুন
            </button>
          )}
        </div>

        {/* ── SECTION 1: BASIC INFORMATION ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
            <span>০১</span>
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>মৌলিক তথ্য (Basic Info)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* English Title */}
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                সেবার নাম (English) <span className="text-rose-500">*</span>
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
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                সেবার বাংলা নাম (Bangla Title) <span className="text-emerald-700 text-[11px]">(হোমপেজের জন্য জরুরি)</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: ল্যান্ডস্কেপ স্থাপত্য ও নকশা"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] transition-all"
              />
            </div>

            {/* Icon / Emoji Input & Picker */}
            <div className="md:col-span-2 space-y-1.5">
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

          {/* Quick Preset Icons Picker */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-stone-400 font-medium mr-1">ক্লিক করে আইকন বাছুন:</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* English Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                English Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                placeholder="Comprehensive spatial design integrating built architecture with biophilic elements..."
                value={serviceDesc}
                onChange={(e) => setServiceDesc(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all"
              />
            </div>

            {/* Bangla Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                বাংলা বিবরণ (Bangla Description) <span className="text-emerald-700 text-[11px]">(হোমপেজের ব্যাক সাইডে দেখায়)</span>
              </label>
              <textarea
                rows={3}
                placeholder="ভবনের মূল স্থাপত্যের সাথে বায়োফিলিক উপাদান, মাটির আর্দ্রতা এবং জীবন্ত উদ্ভিদের সমন্বয়ে প্রণয়ন..."
                value={descBn}
                onChange={(e) => setDescBn(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: FEATURES & SCOPE OF WORK ── */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono">
            <span>০৩</span>
            <div className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>সেবার পরিধি ও বৈশিষ্ট্য (Scope & Deliverables)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700 block">
                Scope Points (English) — <span className="text-stone-400 font-normal">কমা দিয়ে আলাদা করুন</span>
              </label>
              <input
                type="text"
                placeholder="Concept & 3D, Structural Load, 100% Waterproofing"
                value={featuresEn}
                onChange={(e) => setFeaturesEn(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] transition-all"
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
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px] transition-all"
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

          <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80 flex flex-col md:flex-row items-start md:items-center gap-5">
            {/* Thumbnail Preview */}
            <div className="w-full sm:w-44 h-28 rounded-xl bg-stone-200 overflow-hidden border border-stone-300 relative shrink-0 flex items-center justify-center">
              {banner ? (
                <>
                  <img
                    src={banner}
                    alt="Service Banner Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/hero_plants.png";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setBanner("")}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center hover:bg-rose-600 transition-colors"
                    title="Remove Image"
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div className="text-center p-2">
                  <span className="text-2xl block">🖼️</span>
                  <span className="text-[10px] text-stone-400">ছবি নেই</span>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 w-full space-y-3">
              <CloudinaryUploader
                value={banner}
                onUpload={(url) => setBanner(url)}
                label="📁 ক্লাউডিনারি থেকে ছবি আপলোড করুন"
              />
              <div className="relative">
                <input
                  type="text"
                  placeholder="অথবা সরাসরি ছবির URL পেস্ট করুন: https://... বা /hero_plants.png"
                  value={banner}
                  onChange={(e) => setBanner(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[44px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: SEO ACCORDION ── */}
        <div className="border-t border-stone-100 pt-4">
          <button
            type="button"
            onClick={() => setShowSeo(!showSeo)}
            className="flex items-center justify-between w-full py-2 text-xs font-semibold text-stone-700 hover:text-emerald-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <span>🔍</span>
              <span>এসইও ও মেটাডাটা কনফিগারেশন (ঐচ্ছিক)</span>
            </span>
            <span className="text-stone-400 font-mono text-xs">{showSeo ? "▲ বন্ধ করুন" : "▼ খুলুন"}</span>
          </button>

          {showSeo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600">SEO Title Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Best Landscape Architecture in Dhaka"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 min-h-[40px]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600">SEO Keywords</label>
                <input
                  type="text"
                  placeholder="landscape, rooftop garden, biophilic"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 min-h-[40px]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-stone-600">SEO Meta Description</label>
                <input
                  type="text"
                  placeholder="Meta description for search engines..."
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 min-h-[40px]"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── FORM ACTION BAR ── */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-stone-100">
          {editingService && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold transition-all min-h-[44px]"
            >
              বাতিল
            </button>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-semibold text-sm px-7 py-3 rounded-xl shadow-md hover:shadow-lg transition-all min-h-[44px] cursor-pointer"
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
                <span>নতুন সেবা যোগ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── EXISTING SERVICES LIST & REORDER SECTION ── */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm flex flex-col gap-6">
        {/* Section Header with Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <span>📋</span>
              <span>বিদ্যমান সেবাসমূহ ({services.length})</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              ক্রম পরিবর্তন করতে ▲ / ▼ বাটন চাপুন · সম্পাদনা বা মুছতে কার্ডের ডান পাশের বাটন ব্যবহার করুন
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="সেবা খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 min-h-[40px] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="py-12 text-center text-stone-400 space-y-2">
            <span className="text-4xl block">🔍</span>
            <p className="text-sm font-medium">কোনো সেবা পাওয়া যায়নি</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                অনুসন্ধান ক্লিয়ার করুন
              </button>
            )}
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredServices.map((s, index) => {
            const serviceId = s.id || (s as any)._id;
            const originalIndex = services.findIndex(
              (item) => (item.id || (item as any)._id) === serviceId
            );
            const isEditingThis =
              editingService && (editingService.id || editingService._id) === serviceId;

            return (
              <div
                key={serviceId || index}
                className={`bg-stone-50/70 border rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-md ${
                  isEditingThis
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/30"
                    : "border-stone-200 hover:border-emerald-600/40"
                }`}
              >
                {/* Top Row: Icon, Index, Titles, Reorder */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Icon Box */}
                    <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      {s.icon && (s.icon.startsWith("http") || s.icon.startsWith("/")) ? (
                        <img src={s.icon} alt="" className="w-7 h-7 object-contain" />
                      ) : (
                        <span>{s.icon || "🌱"}</span>
                      )}
                    </div>

                    {/* Titles */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
                          #{String((s.order ?? originalIndex) + 1).padStart(2, "0")}
                        </span>
                        {s.titleBn ? (
                          <span className="text-[10px] text-teal-700 bg-teal-50 border border-teal-200/50 px-1.5 py-0.2 rounded font-medium">
                            ✓ বাংলা যুক্ত
                          </span>
                        ) : (
                          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200/50 px-1.5 py-0.2 rounded font-medium">
                            ⚠️ বাংলা বাকি
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-stone-900 text-sm sm:text-base mt-1 truncate">
                        {s.label || s.title}
                      </h4>
                      {s.titleBn && (
                        <p className="text-xs text-emerald-800 font-medium truncate mt-0.5">
                          {s.titleBn}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Up / Down Order Buttons */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={originalIndex <= 0 || isReordering}
                      onClick={() => handleMoveOrder(originalIndex, "up")}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 flex items-center justify-center text-[10px] disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors shadow-2xs"
                      title="উপরে নিন"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={originalIndex >= services.length - 1 || isReordering}
                      onClick={() => handleMoveOrder(originalIndex, "down")}
                      className="w-7 h-7 rounded-lg bg-white border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 flex items-center justify-center text-[10px] disabled:opacity-25 disabled:pointer-events-none cursor-pointer transition-colors shadow-2xs"
                      title="নিচে নিন"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {s.descBn || s.desc || s.description || "কোনো বিবরণ প্রদান করা হয়নি।"}
                </p>

                {/* Card Footer: Banner thumbnail & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-200/70 gap-3">
                  {/* Banner status or mini thumbnail */}
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 min-w-0">
                    {s.banner || s.bannerImage ? (
                      <div className="flex items-center gap-1.5">
                        <img
                          src={s.banner || s.bannerImage}
                          alt=""
                          className="w-8 h-6 rounded object-cover border border-stone-200"
                        />
                        <span className="text-[10px] text-stone-400 truncate hidden sm:inline">
                          ব্যানার সক্রিয়
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-stone-400">🖼️ ব্যানার নেই</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditClickWithScroll(s)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-stone-200 hover:border-emerald-300 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition-all min-h-[36px]"
                    >
                      <span>✏️</span>
                      <span>এডিট</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(s)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-stone-200 hover:border-rose-300 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition-all min-h-[36px]"
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
      </div>

      {/* ── CONFIRMATION MODAL ── */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            const targetId = deleteTarget.id || (deleteTarget as any)._id;
            handleDeleteService(targetId);
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
