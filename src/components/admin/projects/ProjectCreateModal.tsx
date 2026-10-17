"use client";

import React, { useState } from "react";
import { IProject } from "@/types";

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
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    প্রধান ছবি / কাজের পরের ছবি (Cover / Finished After Image URL) *
                  </label>
                  <input
                    type="url"
                    value={formData.afterImage}
                    onChange={(e) => setFormData({ ...formData, afterImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                  />
                  {formData.afterImage && (
                    <div className="mt-2 h-36 rounded-xl border border-[#D6D2C4] overflow-hidden bg-stone-100 flex items-center justify-center">
                      <img src={formData.afterImage} alt="After Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    কাজের পূর্বের ছবি (Before Image URL - Optional)
                  </label>
                  <input
                    type="url"
                    value={formData.beforeImage}
                    onChange={(e) => setFormData({ ...formData, beforeImage: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                  />
                  {formData.beforeImage && (
                    <div className="mt-2 h-36 rounded-xl border border-[#D6D2C4] overflow-hidden bg-stone-100 flex items-center justify-center">
                      <img src={formData.beforeImage} alt="Before Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                    অতিরিক্ত গ্যালারি ছবি (Gallery Image URLs — প্রতি লাইনে একটি করে লিংক দিন)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.galleryImagesText}
                    onChange={(e) => setFormData({ ...formData, galleryImagesText: e.target.value })}
                    placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                    className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-3 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                  />
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
