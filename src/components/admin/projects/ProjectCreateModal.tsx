"use client";

import React, { useState, useRef } from "react";
import { IProject } from "@/types";
import { uploadClientMedia } from "@/lib/clientUpload";

export interface ProjectFormData {
  name: string;
  titleBn?: string;
  slug: string;
  clientName: string;
  clientPhone: string;
  category: string;
  location: string;
  status: string;
  progress: number;
  budget: string;
  totalExpense: string;
  duration: string;
  warrantyMonths: number;
  afterImage: string;
  beforeImage: string;
  galleryImagesText: string;
  description: string;
  descBn?: string;
  challenges: string;
  solution: string;
  testimonialName: string;
  testimonialText: string;
  featured: boolean;
}

interface ProjectCreateModalProps {
  modalMode: "create" | "edit";
  formData: ProjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  activeProject?: IProject | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  categories: string[];
  statusOptions: Array<{ value: string; label: string; color: string }>;
}

export default function ProjectCreateModal({
  modalMode,
  formData,
  setFormData,
  activeProject,
  onClose,
  onSubmit,
  isSubmitting,
  categories,
  statusOptions,
}: ProjectCreateModalProps) {
  const [formActiveSection, setFormActiveSection] = useState<"general" | "scope" | "media" | "casestudy">("general");
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showRawGalleryUrls, setShowRawGalleryUrls] = useState(false);

  const afterFileInputRef = useRef<HTMLInputElement>(null);
  const beforeFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const handleAfterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAfter(true);
    setUploadError(null);
    try {
      const res = await uploadClientMedia(file, "green-garden/projects");
      if (res?.url) {
        setFormData((prev) => ({ ...prev, afterImage: res.url }));
      }
    } catch (err: any) {
      setUploadError("কভার ছবি আপলোড ব্যর্থ হয়েছে: " + err.message);
    } finally {
      setIsUploadingAfter(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleBeforeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBefore(true);
    setUploadError(null);
    try {
      const res = await uploadClientMedia(file, "green-garden/projects");
      if (res?.url) {
        setFormData((prev) => ({ ...prev, beforeImage: res.url }));
      }
    } catch (err: any) {
      setUploadError("পূর্বের ছবি আপলোড ব্যর্থ হয়েছে: " + err.message);
    } finally {
      setIsUploadingBefore(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingGallery(true);
    setUploadError(null);
    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadClientMedia(files[i], "green-garden/projects");
        if (res?.url) newUrls.push(res.url);
      }
      setFormData((prev) => {
        const existing = prev.galleryImagesText
          .split(/[\n,]+/)
          .map((s) => s.trim())
          .filter(Boolean);
        return {
          ...prev,
          galleryImagesText: [...existing, ...newUrls].join("\n"),
        };
      });
    } catch (err: any) {
      setUploadError("গ্যালারি ছবি আপলোড ব্যর্থ হয়েছে: " + err.message);
    } finally {
      setIsUploadingGallery(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDeleteGalleryImage = (indexToDelete: number) => {
    setFormData((prev) => {
      const list = prev.galleryImagesText
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
      const updated = list.filter((_, idx) => idx !== indexToDelete);
      return {
        ...prev,
        galleryImagesText: updated.join("\n"),
      };
    });
  };

  const galleryList = formData.galleryImagesText
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white sm:rounded-3xl rounded-none border sm:border-[#D6D2C4] border-none shadow-2xl w-full max-w-3xl h-full sm:h-auto sm:max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E4E2D7] flex items-center justify-between bg-[#F7F6F2] shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-[#2B4D33] text-white flex items-center justify-center text-lg font-bold shadow-xs">
              {modalMode === "create" ? "🏛️" : "✏️"}
            </span>
            <div>
              <h3 className="font-display font-light text-lg sm:text-xl text-[#121813] uppercase tracking-wide">
                {modalMode === "create" ? "নতুন প্রজেক্ট তৈরি করুন (Create Project)" : `প্রজেক্ট এডিট: ${formData.name}`}
              </h3>
              <p className="text-[11px] text-[#75787B] font-light">
                সম্পূর্ণ এ-টু-জেড কনফিগারেশন — কেস স্টাডিজ, ক্লায়েন্ট তথ্য, বাংলা অনুবাদ ও ফটো গ্যালারি।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 text-[#121813] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer min-w-[44px] min-h-[44px]"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Sub-navigation Tabs */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-[#E4E2D7] bg-white shrink-0 overflow-x-auto custom-scrollbar">
          <button
            type="button"
            onClick={() => setFormActiveSection("general")}
            className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center ${
              formActiveSection === "general"
                ? "border-[#2B4D33] text-[#2B4D33]"
                : "border-transparent text-[#75787B] hover:text-[#121813]"
            }`}
          >
            ১. সাধারণ ও ক্লায়েন্ট তথ্য
          </button>
          <button
            type="button"
            onClick={() => setFormActiveSection("scope")}
            className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center ${
              formActiveSection === "scope"
                ? "border-[#2B4D33] text-[#2B4D33]"
                : "border-transparent text-[#75787B] hover:text-[#121813]"
            }`}
          >
            ২. অগ্রগতি ও বাজেট
          </button>
          <button
            type="button"
            onClick={() => setFormActiveSection("media")}
            className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center ${
              formActiveSection === "media"
                ? "border-[#2B4D33] text-[#2B4D33]"
                : "border-transparent text-[#75787B] hover:text-[#121813]"
            }`}
          >
            ৩. ছবি ও ফটো গ্যালারি
          </button>
          <button
            type="button"
            onClick={() => setFormActiveSection("casestudy")}
            className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center ${
              formActiveSection === "casestudy"
                ? "border-[#2B4D33] text-[#2B4D33]"
                : "border-transparent text-[#75787B] hover:text-[#121813]"
            }`}
          >
            ৪. কেস স্টাডি ও রিভিউ
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={onSubmit} className="flex flex-col flex-grow overflow-hidden">
          <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-5">
            
            {/* SECTION 1: GENERAL & CLIENT INFO */}
            {formActiveSection === "general" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      প্রজেক্টের নাম (Project Name / English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dhanmondi Sky Haven Rooftop"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      বাংলা শিরোনাম (Bengali Title - Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.titleBn || ""}
                      onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                      placeholder="e.g. ধানমন্ডি স্কাই হ্যাভেন ছাদবাগান"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ক্যাটাগরি (Architecture Category)
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      লোকেশন বা এলাকা (Location / City)
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. ধানমন্ডি, ঢাকা"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ক্লায়েন্টের নাম (Client Name)
                    </label>
                    <input
                      type="text"
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      placeholder="e.g. তানভীর রহমান"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ক্লায়েন্ট মোবাইল নম্বর (Client Phone)
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                      placeholder="e.g. 01883012641"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    কাস্টম ইউআরএল স্লাগ (Unique URL Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. dhanmondi-sky-haven-rooftop"
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                  />
                  <p className="text-[10px] text-[#75787B]">ফাঁকা রাখলে স্বয়ংক্রিয়ভাবে প্রজেক্টের নাম থেকে তৈরি হবে।</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    প্রকল্পের সারমর্ম (English / Main Description)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Comprehensive architectural planning and biophilic ecosystem details..."
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-3 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    বাংলা সারমর্ম (Bengali Description - Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.descBn || ""}
                    onChange={(e) => setFormData({ ...formData, descBn: e.target.value })}
                    placeholder="বাংলা ভাষায় প্রজেক্টের বিস্তারিত বিবরণ..."
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-3 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] resize-none"
                  />
                </div>
              </div>
            )}

            {/* SECTION 2: SCOPE, PROGRESS & BUDGET */}
            {formActiveSection === "scope" && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      কাজের স্ট্যাটাস (Project Status)
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] cursor-pointer"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold flex items-center justify-between">
                      <span>কাজের অগ্রগতি শতাংশ (Progress Percentage)</span>
                      <span className="font-bold text-[#2B4D33] font-mono">{formData.progress}%</span>
                    </label>
                    <div className="flex items-center gap-3 pt-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                        className="flex-grow accent-[#2B4D33] cursor-pointer"
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                        className="w-16 bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-2 py-1.5 text-xs text-center font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      মোট বাজেট (Total Budget in ৳)
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g. 350000"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      অনসাইট প্রকৃত খরচ (Total Actual Expense in ৳)
                    </label>
                    <input
                      type="number"
                      value={formData.totalExpense}
                      onChange={(e) => setFormData({ ...formData, totalExpense: e.target.value })}
                      placeholder="e.g. 120000"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      প্রকল্প সময়সীমা (Duration)
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g. ৩ সপ্তাহ / 4 Weeks"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      বোটানিক্যাল ফ্রি ওয়ারেন্টি (Warranty Months)
                    </label>
                    <input
                      type="number"
                      value={formData.warrantyMonths}
                      onChange={(e) => setFormData({ ...formData, warrantyMonths: Number(e.target.value) })}
                      placeholder="e.g. 12"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: MEDIA & PHOTO GALLERY */}
            {formActiveSection === "media" && (
              <div className="space-y-6 animate-fade-in">
                {uploadError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
                    <span>⚠️ {uploadError}</span>
                    <button
                      type="button"
                      onClick={() => setUploadError(null)}
                      className="text-red-500 font-bold ml-2 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                {/* 1. COVER / FINISHED AFTER IMAGE */}
                <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#D6D2C4] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#121813] uppercase tracking-wider flex items-center gap-1.5">
                        <span>🖼️</span> প্রধান কভার ছবি (Cover / Finished Image) *
                      </h4>
                      <p className="text-[10px] text-[#75787B]">
                        ল্যান্ডস্কেপ প্রজেক্টের সমাপ্ত কাজের প্রধান ছবি (কার্ড ও ব্যানারে দেখাবে)।
                      </p>
                    </div>
                    {formData.afterImage && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, afterImage: "" })}
                        className="px-2.5 py-1 text-[11px] font-mono font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-300 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        title="কভার ছবি ডিলিট করুন"
                      >
                        <span>🗑️</span> ছবিটি মুছুন (Delete)
                      </button>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={afterFileInputRef}
                    onChange={handleAfterUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {formData.afterImage ? (
                    <div className="space-y-2">
                      <div className="relative h-44 rounded-xl border border-[#D6D2C4] overflow-hidden bg-stone-100 group">
                        <img
                          src={formData.afterImage}
                          alt="Cover Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => afterFileInputRef.current?.click()}
                            disabled={isUploadingAfter}
                            className="px-3 py-1.5 bg-white text-[#121813] text-xs font-bold rounded-lg shadow-md hover:bg-stone-100 cursor-pointer"
                          >
                            🔄 ছবি পরিবর্তন করুন
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, afterImage: "" })}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-red-700 cursor-pointer"
                          >
                            🗑️ মুছুন
                          </button>
                        </div>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                          বর্তমান কভার ছবি
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => afterFileInputRef.current?.click()}
                          disabled={isUploadingAfter}
                          className="px-3 py-2 bg-white border border-[#D6D2C4] hover:border-[#2B4D33] text-xs font-semibold rounded-xl text-[#121813] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {isUploadingAfter ? "⏳ আপলোড হচ্ছে..." : "📁 নতুন ছবি আপলোড"}
                        </button>
                        <input
                          type="url"
                          value={formData.afterImage}
                          onChange={(e) => setFormData({ ...formData, afterImage: e.target.value })}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-grow bg-white border border-[#D6D2C4] rounded-xl px-3 py-2 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#D6D2C4] rounded-xl p-5 text-center bg-white space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-[#EBF2EC] text-[#2B4D33] flex items-center justify-center text-xl">
                        📸
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#121813]">এখনও কোনো কভার ছবি নির্ধারণ করা হয়নি</p>
                        <p className="text-[10px] text-[#75787B]">কম্পিউটার বা মোবাইল থেকে ছবি আপলোড করুন অথবা নিচে সরাসরি লিংক দিন</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => afterFileInputRef.current?.click()}
                          disabled={isUploadingAfter}
                          className="px-4 py-2 bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
                        >
                          {isUploadingAfter ? "⏳ আপলোড হচ্ছে..." : "📤 কভার ছবি আপলোড করুন"}
                        </button>
                        <span className="text-[10px] text-[#75787B] font-mono">অথবা ইউআরএল:</span>
                        <input
                          type="url"
                          value={formData.afterImage}
                          onChange={(e) => setFormData({ ...formData, afterImage: e.target.value })}
                          placeholder="https://..."
                          className="w-full sm:w-60 bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3 py-1.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. BEFORE IMAGE (OPTIONAL) */}
                <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#D6D2C4] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#121813] uppercase tracking-wider flex items-center gap-1.5">
                        <span>⏳</span> কাজের পূর্বের ছবি (Before Image - Optional)
                      </h4>
                      <p className="text-[10px] text-[#75787B]">
                        কাজ শুরুর আগের সাইট পরিস্থিতি (বিফোর-আফটার কম্প্যারিজনে দেখানো হবে)।
                      </p>
                    </div>
                    {formData.beforeImage && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, beforeImage: "" })}
                        className="px-2.5 py-1 text-[11px] font-mono font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-300 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                        title="পূর্বের ছবি ডিলিট করুন"
                      >
                        <span>🗑️</span> পূর্বের ছবি মুছুন (Delete)
                      </button>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={beforeFileInputRef}
                    onChange={handleBeforeUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {formData.beforeImage ? (
                    <div className="space-y-2">
                      <div className="relative h-44 rounded-xl border border-[#D6D2C4] overflow-hidden bg-stone-100 group">
                        <img
                          src={formData.beforeImage}
                          alt="Before Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => beforeFileInputRef.current?.click()}
                            disabled={isUploadingBefore}
                            className="px-3 py-1.5 bg-white text-[#121813] text-xs font-bold rounded-lg shadow-md hover:bg-stone-100 cursor-pointer"
                          >
                            🔄 ছবি পরিবর্তন করুন
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, beforeImage: "" })}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-md hover:bg-red-700 cursor-pointer"
                          >
                            🗑️ মুছুন
                          </button>
                        </div>
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-mono">
                          কাজের পূর্বের সাইট ছবি
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => beforeFileInputRef.current?.click()}
                          disabled={isUploadingBefore}
                          className="px-3 py-2 bg-white border border-[#D6D2C4] hover:border-[#2B4D33] text-xs font-semibold rounded-xl text-[#121813] flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                        >
                          {isUploadingBefore ? "⏳ আপলোড হচ্ছে..." : "📁 পূর্বের ছবি আপলোড"}
                        </button>
                        <input
                          type="url"
                          value={formData.beforeImage}
                          onChange={(e) => setFormData({ ...formData, beforeImage: e.target.value })}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-grow bg-white border border-[#D6D2C4] rounded-xl px-3 py-2 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-[#D6D2C4] rounded-xl p-5 text-center bg-white space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 text-[#75787B] flex items-center justify-center text-xl">
                        🏚️
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#121813]">কোনো পূর্বের ছবি যুক্ত করা হয়নি (ঐচ্ছিক)</p>
                        <p className="text-[10px] text-[#75787B]">বিফোর/আফটার স্লাইডারে প্রদর্শনের জন্য ছবি আপলোড করতে পারেন</p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => beforeFileInputRef.current?.click()}
                          disabled={isUploadingBefore}
                          className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-mono font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
                        >
                          {isUploadingBefore ? "⏳ আপলোড হচ্ছে..." : "📤 পূর্বের ছবি আপলোড করুন"}
                        </button>
                        <span className="text-[10px] text-[#75787B] font-mono">অথবা ইউআরএল:</span>
                        <input
                          type="url"
                          value={formData.beforeImage}
                          onChange={(e) => setFormData({ ...formData, beforeImage: e.target.value })}
                          placeholder="https://..."
                          className="w-full sm:w-60 bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3 py-1.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. GALLERY IMAGES (MULTIPLE PHOTOS) */}
                <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#D6D2C4] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-[#121813] uppercase tracking-wider flex items-center gap-1.5">
                        <span>📸</span> অতিরিক্ত গ্যালারি ছবি (Project Photo Gallery)
                        <span className="px-2 py-0.5 rounded-full bg-[#2B4D33]/10 text-[#2B4D33] text-[10px] font-mono font-bold">
                          {galleryList.length}টি ছবি
                        </span>
                      </h4>
                      <p className="text-[10px] text-[#75787B]">
                        প্রজেক্টের কাজের বিভিন্ন কোণ, ড্রেনেজ, প্ল্যান্টেশন ইত্যাদির গ্যালারি ফটো।
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {galleryList.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, galleryImagesText: "" })}
                          className="px-2.5 py-1.5 text-[10px] font-mono font-bold text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-all cursor-pointer"
                        >
                          সব মুছুন (Clear All)
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => galleryFileInputRef.current?.click()}
                        disabled={isUploadingGallery}
                        className="px-3.5 py-1.5 bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <span>{isUploadingGallery ? "⏳" : "➕"}</span>
                        <span>{isUploadingGallery ? "আপলোড হচ্ছে..." : "ছবি আপলোড করুন"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Hidden multiple file input */}
                  <input
                    type="file"
                    ref={galleryFileInputRef}
                    onChange={handleGalleryUpload}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  {/* Gallery Visual Grid */}
                  {galleryList.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {galleryList.map((url, idx) => (
                        <div
                          key={idx}
                          className="group relative rounded-xl border border-[#D6D2C4] overflow-hidden bg-stone-100 aspect-square shadow-xs"
                        >
                          <img
                            src={url}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />

                          {/* Index badge */}
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                            #{idx + 1}
                          </span>

                          {/* Delete button on top-right */}
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryImage(idx)}
                            className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center text-xs font-bold shadow-md transition-all cursor-pointer"
                            title="এই ছবিটি গ্যালারি থেকে মুছুন"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-[#D6D2C4] rounded-xl p-4 text-center bg-white">
                      <p className="text-xs text-[#75787B]">
                        বর্তমানে কোনো অতিরিক্ত গ্যালারি ছবি নেই। &quot;ছবি আপলোড করুন&quot; বাটনে ক্লিক করে এক বা একাধিক ছবি যুক্ত করতে পারেন।
                      </p>
                    </div>
                  )}

                  {/* Collapsible raw text editor for power users */}
                  <div className="pt-2 border-t border-[#D6D2C4]/50">
                    <button
                      type="button"
                      onClick={() => setShowRawGalleryUrls(!showRawGalleryUrls)}
                      className="text-[11px] font-mono text-[#2B4D33] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showRawGalleryUrls ? "▲" : "▼"}</span>
                      <span>
                        {showRawGalleryUrls
                          ? "টেক্সট আকারে ইউআরএল লুকান"
                          : "টেক্সট আকারে ইউআরএল দেখুন বা বাল্ক পেস্ট করুন"}
                      </span>
                    </button>

                    {showRawGalleryUrls && (
                      <div className="mt-2 space-y-1 animate-fade-in">
                        <textarea
                          rows={3}
                          value={formData.galleryImagesText}
                          onChange={(e) =>
                            setFormData({ ...formData, galleryImagesText: e.target.value })
                          }
                          placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                          className="w-full bg-white border border-[#D6D2C4] rounded-xl p-3 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                        />
                        <p className="text-[10px] text-[#75787B]">
                          প্রতি লাইনে একটি করে ছবির ইউআরএল দিন। উপরের ভিজ্যুয়াল কার্ডের সাথে এটি স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: CASE STUDY & TESTIMONIAL */}
            {formActiveSection === "casestudy" && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    সাইট চ্যালেঞ্জ ও সীমাবদ্ধতা (Site Challenges & Constraints)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.challenges}
                    onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                    placeholder="ছাদ স্লাবের মাইক্রো ফ্র্যাকচার, অতিরিক্ত তাপ বা ড্রেনেজ সমস্যা..."
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-3 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    আর্কিটেকচারাল ও বায়োফিলিক সমাধান (Architectural Solution)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="৩ স্তরের ওয়াটারপ্রুফিং, ড্রপ ইরিগেশন এবং ক্লাইমেট-রেজিলিয়েন্ট গাছ..."
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-3 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E4E2D7]">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      রিভিউকারী ক্লায়েন্টের নাম (Reviewer Name)
                    </label>
                    <input
                      type="text"
                      value={formData.testimonialName}
                      onChange={(e) => setFormData({ ...formData, testimonialName: e.target.value })}
                      placeholder="e.g. ইঞ্জি. ফারুক হাসান"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                      ক্লায়েন্টের মন্তব্য (Testimonial Quote)
                    </label>
                    <input
                      type="text"
                      value={formData.testimonialText}
                      onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
                      placeholder="e.g. আমাদের ছাদটি এক জীবন্ত মরূদ্যানে রূপ নিয়েছে।"
                      className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                    />
                  </div>
                </div>

                {/* Featured Checkbox */}
                <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#D6D2C4] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#121813]">হোমপেজ ফিচার্ড প্রজেক্ট (Feature on Homepage)</p>
                    <p className="text-[10px] text-[#75787B]">হোমপেজের মূল প্রজেক্ট স্লাইডার ও শোকেসে হাইলাইট করা হবে।</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 accent-[#2B4D33] cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Save Button Controls */}
          <div className="px-6 py-4 border-t border-[#E4E2D7] bg-[#F7F6F2] sticky bottom-0 z-20 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] text-xs font-mono font-semibold transition-all cursor-pointer min-h-[44px]"
            >
              বাতিল (Cancel)
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2 min-h-[44px]"
            >
              <span>💾</span>
              <span>
                {isSubmitting
                  ? "সংরক্ষণ হচ্ছে..."
                  : modalMode === "create"
                  ? "প্রজেক্ট প্রকাশ করুন (Publish)"
                  : "পরিবর্তন সংরক্ষণ করুন (Update)"}
              </span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
