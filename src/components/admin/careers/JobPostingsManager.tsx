"use client";

import React, { useState, useEffect } from "react";
import { JobOpening } from "./types";

const DEFAULT_JOBS: JobOpening[] = [
  {
    id: "job-1",
    titleEn: "Senior Landscape Architect",
    titleBn: "সিনিয়র ল্যান্ডস্কেপ আর্কিটেক্ট",
    departmentEn: "Landscape & 3D Design",
    departmentBn: "ল্যান্ডস্কেপ ও থ্রিডি ডিজাইন",
    locationEn: "Dhanmondi, Dhaka",
    locationBn: "ধানমন্ডি, ঢাকা",
    typeEn: "Full-Time",
    typeBn: "ফুল-টাইম",
    salaryRange: "৳৬৫,০০০ - ৳৮৫,০০০",
    experience: "৪+ বছর",
    descriptionEn: "Lead bespoke rooftop and botanical landscape projects with AutoCAD, SketchUp, and Lumion mastery.",
    descriptionBn: "অটোক্যাড, স্কেচআপ ও লুমিয়ন ব্যবহারে দক্ষ এবং ছাদবাগান ও বৃহৎ ল্যান্ডস্কেপ প্রকল্পের প্রধান নকশাকার হিসেবে নেতৃত্ব প্রদান।",
  },
  {
    id: "job-2",
    titleEn: "Certified Tree Doctor & Plant Pathologist",
    titleBn: "সার্টিফাইড ট্রি ডক্টর ও উদ্ভিদ রোগতত্ত্ববিদ",
    departmentEn: "Tree Doctor & Plant Clinic",
    departmentBn: "ট্রি ডক্টর ও প্ল্যান্ট ক্লিনিক",
    locationEn: "Dhaka Metro (Site Visits)",
    locationBn: "ঢাকা মেট্রো (অন-সাইট ভিজিট)",
    typeEn: "Full-Time",
    typeBn: "ফুল-টাইম",
    salaryRange: "৳৪৫,০০০ - ৳৬০,০০০",
    experience: "২+ বছর",
    descriptionEn: "Diagnose urban tree diseases, prescribe organic treatments, perform tree surgery, and manage pest infestation.",
    descriptionBn: "গাছের রোগ নির্ণয়, ওষুধ প্রয়োগ, বৃক্ষ সার্জারি এবং সাইটে গিয়ে জরুরি চিকিৎসা সেবা পরিচালনা।",
  },
  {
    id: "job-3",
    titleEn: "Landscape Civil & Site Supervisor",
    titleBn: "ল্যান্ডস্কেপ সিভিল ও সাইট সুপারভাইজার",
    departmentEn: "Project Operations",
    departmentBn: "প্রজেক্ট অপারেশন",
    locationEn: "Dhaka (On-site)",
    locationBn: "ঢাকা (সাইট বাস্তবায়ন)",
    typeEn: "Full-Time",
    typeBn: "ফুল-টাইম",
    salaryRange: "৳৩৫,০০০ - ৳৫০,০০০",
    experience: "৩+ বছর",
    descriptionEn: "Oversee site civil works, waterproofing integrity, drainage membrane placement, and hardscape construction.",
    descriptionBn: "সাইটের সিভিল নির্মাণ, ছাদের ওয়াটারপ্রুফিং, ড্রেনেজ ব্যবস্থা ও হার্ডস্কেপ কাজের প্রত্যক্ষ তদারকি।",
  },
];

export default function JobPostingsManager() {
  const [openings, setOpenings] = useState<JobOpening[]>(DEFAULT_JOBS);
  const [loadingOpenings, setLoadingOpenings] = useState(true);
  const [savingOpenings, setSavingOpenings] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  const [formData, setFormData] = useState<Partial<JobOpening>>({
    titleEn: "",
    titleBn: "",
    departmentEn: "Landscape & 3D Design",
    departmentBn: "ল্যান্ডস্কেপ ও থ্রিডি ডিজাইন",
    locationEn: "Dhaka, Bangladesh",
    locationBn: "ঢাকা, বাংলাদেশ",
    typeEn: "Full-Time",
    typeBn: "ফুল-টাইম",
    salaryRange: "Negotiable",
    experience: "২+ বছর",
    descriptionEn: "",
    descriptionBn: "",
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  useEffect(() => {
    fetch("/api/settings?key=job_openings", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.value) {
          try {
            const parsed = JSON.parse(data.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setOpenings(parsed);
            }
          } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoadingOpenings(false));
  }, []);

  const saveToBackend = async (newJobs: JobOpening[]) => {
    setSavingOpenings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "job_openings",
          value: JSON.stringify(newJobs),
        }),
      });
      if (res.ok) {
        setOpenings(newJobs);
        showToast("✓ ক্যারিয়ার বিজ্ঞপ্তি সফলভাবে সংরক্ষিত হয়েছে!");
      } else {
        showToast("⚠️ সংরক্ষণে ব্যর্থ হয়েছে।");
      }
    } catch {
      showToast("⚠️ নেটওয়ার্ক ত্রুটি।");
    } finally {
      setSavingOpenings(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleBn || !formData.titleEn) {
      alert("Please provide both English & Bengali job titles.");
      return;
    }

    let updated: JobOpening[];
    if (editingJobId) {
      updated = openings.map((j) =>
        j.id === editingJobId ? ({ ...j, ...formData } as JobOpening) : j
      );
    } else {
      const newJob: JobOpening = {
        id: `job-${Date.now()}`,
        titleEn: formData.titleEn || "",
        titleBn: formData.titleBn || "",
        departmentEn: formData.departmentEn || "Landscape & 3D Design",
        departmentBn: formData.departmentBn || "ল্যান্ডস্কেপ ও থ্রিডি ডিজাইন",
        locationEn: formData.locationEn || "Dhaka",
        locationBn: formData.locationBn || "ঢাকা",
        typeEn: formData.typeEn || "Full-Time",
        typeBn: formData.typeBn || "ফুল-টাইম",
        salaryRange: formData.salaryRange || "Negotiable",
        experience: formData.experience || "২+ বছর",
        descriptionEn: formData.descriptionEn || "",
        descriptionBn: formData.descriptionBn || "",
      };
      updated = [newJob, ...openings];
    }

    await saveToBackend(updated);
    setShowAddForm(false);
    setEditingJobId(null);
  };

  const handleEditClick = (job: JobOpening) => {
    setFormData(job);
    setEditingJobId(job.id);
    setShowAddForm(true);
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm("Are you sure you want to delete this job circular?")) return;
    const updated = openings.filter((j) => j.id !== id);
    await saveToBackend(updated);
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl space-y-6">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-stone-950 font-bold px-4 py-2.5 rounded-2xl shadow-2xl text-xs animate-bounce">
          {toastMsg}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">নিয়োগ বিজ্ঞপ্তি পরিচালনা • Job Openings</h3>
          <p className="text-xs text-stone-400 mt-0.5">
            পাবলিক ক্যারিয়ার পেজে প্রদর্শিত চাকরির সার্কুলার এডিট, অ্যাড বা ডিলিট করুন।
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            if (showAddForm) {
              setShowAddForm(false);
              setEditingJobId(null);
            } else {
              setFormData({
                titleEn: "",
                titleBn: "",
                departmentEn: "Landscape & 3D Design",
                departmentBn: "ল্যান্ডস্কেপ ও থ্রিডি ডিজাইন",
                locationEn: "Dhaka, Bangladesh",
                locationBn: "ঢাকা, বাংলাদেশ",
                typeEn: "Full-Time",
                typeBn: "ফুল-টাইম",
                salaryRange: "Negotiable",
                experience: "২+ বছর",
                descriptionEn: "",
                descriptionBn: "",
              });
              setEditingJobId(null);
              setShowAddForm(true);
            }
          }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
        >
          {showAddForm ? "✕ বন্ধ করুন" : "+ নতুন সার্কুলার যোগ করুন"}
        </button>
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-black/40 border border-white/15 p-6 rounded-2xl space-y-4 animate-fade-in-up"
        >
          <div className="font-bold text-emerald-400 text-sm">
            {editingJobId ? "সার্কুলার তথ্য পরিবর্তন করুন" : "নতুন চাকরির সার্কুলার এন্ট্রি"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-stone-300 font-mono block mb-1">পদবীর নাম (বাংলা) *</label>
              <input
                type="text"
                required
                value={formData.titleBn || ""}
                onChange={(e) => setFormData((p) => ({ ...p, titleBn: e.target.value }))}
                placeholder="e.g. সিনিয়র ল্যান্ডস্কেপ আর্কিটেক্ট"
                className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-stone-300 font-mono block mb-1">Title in English *</label>
              <input
                type="text"
                required
                value={formData.titleEn || ""}
                onChange={(e) => setFormData((p) => ({ ...p, titleEn: e.target.value }))}
                placeholder="e.g. Senior Landscape Architect"
                className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-stone-300 font-mono block mb-1">বিভাগ (বাংলা)</label>
              <input
                type="text"
                value={formData.departmentBn || ""}
                onChange={(e) => setFormData((p) => ({ ...p, departmentBn: e.target.value }))}
                className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-stone-300 font-mono block mb-1">Department (English)</label>
              <input
                type="text"
                value={formData.departmentEn || ""}
                onChange={(e) => setFormData((p) => ({ ...p, departmentEn: e.target.value }))}
                className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-stone-300 font-mono block mb-1">লোকেশন ও কাজের ধরন</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.locationBn || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, locationBn: e.target.value }))}
                  placeholder="ধানমন্ডি, ঢাকা"
                  className="w-full bg-black/60 border border-white/15 px-2.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
                <input
                  type="text"
                  value={formData.typeBn || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, typeBn: e.target.value }))}
                  placeholder="ফুল-টাইম"
                  className="w-full bg-black/60 border border-white/15 px-2.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="text-stone-300 font-mono block mb-1">বেতন ও অভিজ্ঞতা</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.salaryRange || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, salaryRange: e.target.value }))}
                  placeholder="৳৪৫,০০০ - ৳৬০,০০০"
                  className="w-full bg-black/60 border border-white/15 px-2.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
                <input
                  type="text"
                  value={formData.experience || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                  placeholder="৩+ বছর"
                  className="w-full bg-black/60 border border-white/15 px-2.5 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-stone-300 font-mono block mb-1">চাকরির বিবরণ (বাংলা)</label>
              <textarea
                rows={2}
                value={formData.descriptionBn || ""}
                onChange={(e) => setFormData((p) => ({ ...p, descriptionBn: e.target.value }))}
                placeholder="দায়িত্ব ও যোগ্যতার বিবরণ..."
                className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingJobId(null);
              }}
              className="px-4 py-2 rounded-xl bg-white/10 text-white/70 hover:text-white text-xs cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={savingOpenings}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {savingOpenings ? "সংরক্ষণ হচ্ছে..." : editingJobId ? "আপডেট করুন" : "✓ প্রকাশ করুন"}
            </button>
          </div>
        </form>
      )}

      {/* Openings Grid */}
      {loadingOpenings ? (
        <div className="p-8 text-center text-xs text-stone-400">বিজ্ঞপ্তি লোড হচ্ছে...</div>
      ) : openings.length === 0 ? (
        <div className="p-8 text-center text-xs text-stone-400 italic">কোনো সক্রিয় নিয়োগ বিজ্ঞপ্তি নেই।</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {openings.map((job) => (
            <div
              key={job.id}
              className="bg-black/30 border border-white/10 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-emerald-500/30 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-white text-sm">{job.titleBn}</span>
                  <span className="text-xs text-stone-400 font-mono">({job.titleEn})</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold">
                    {job.typeBn || job.typeEn}
                  </span>
                </div>
                <div className="flex gap-4 text-[11px] text-stone-400 mt-1 font-mono flex-wrap">
                  <span>🏢 {job.departmentBn}</span>
                  <span>📍 {job.locationBn}</span>
                  <span>💰 {job.salaryRange || "আলোচনা সাপেক্ষে"}</span>
                  <span>⏳ {job.experience || "অভিজ্ঞতা আবশ্যক"}</span>
                </div>
                {job.descriptionBn && (
                  <p className="text-xs text-stone-300 mt-2 max-w-2xl line-clamp-2">{job.descriptionBn}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleEditClick(job)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  ✏️ এডিট
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteJob(job.id)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 text-xs font-semibold cursor-pointer transition-colors"
                >
                  🗑️ মুছুন
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
