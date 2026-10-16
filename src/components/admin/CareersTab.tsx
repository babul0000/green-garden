"use client";

import React, { useState, useEffect } from "react";

interface JobOpening {
  id: string;
  titleEn: string;
  titleBn: string;
  departmentEn: string;
  departmentBn: string;
  locationEn: string;
  locationBn: string;
  typeEn: string;
  typeBn: string;
  salaryRange?: string;
  experience?: string;
  descriptionEn: string;
  descriptionBn: string;
}

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

interface CareersTabProps {
  messages?: any[];
  careers?: any[];
  handleDeleteMessage: (id: string) => void;
  handleUpdateCareerStatus: (id: string, status: string) => void;
  handleDeleteCareer: (id: string) => void;
}

export default function CareersTab({
  messages = [],
  careers = [],
  handleDeleteMessage,
  handleUpdateCareerStatus,
  handleDeleteCareer,
}: CareersTabProps) {
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
    experience: "১+ বছর",
    descriptionEn: "",
    descriptionBn: "",
  });

  useEffect(() => {
    fetchOpenings();
  }, []);

  const fetchOpenings = async () => {
    try {
      setLoadingOpenings(true);
      const res = await fetch(`/api/settings?key=career_config&_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json?.value?.openings && Array.isArray(json.value.openings) && json.value.openings.length > 0) {
          setOpenings(json.value.openings);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch openings:", err);
    } finally {
      setLoadingOpenings(false);
    }
  };

  const handleSaveOpeningsToDb = async (newOpenings: JobOpening[]) => {
    try {
      setSavingOpenings(true);
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "career_config",
          value: { openings: newOpenings },
        }),
      });

      if (res.ok) {
        setOpenings(newOpenings);
        setToastMsg("✅ চাকরির বিজ্ঞপ্তি সফলভাবে সংরক্ষিত হয়েছে!");
        setShowAddForm(false);
        setEditingJobId(null);
      } else {
        setToastMsg("❌ সংরক্ষণ করা যায়নি");
      }
    } catch {
      setToastMsg("❌ নেটওয়ার্ক সমস্যা");
    } finally {
      setSavingOpenings(false);
      setTimeout(() => setToastMsg(""), 4000);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titleEn || !formData.titleBn) return;

    if (editingJobId) {
      const updated = openings.map((job) =>
        job.id === editingJobId ? ({ ...job, ...formData, id: editingJobId } as JobOpening) : job
      );
      handleSaveOpeningsToDb(updated);
    } else {
      const newJob: JobOpening = {
        id: `job-${Date.now()}`,
        titleEn: formData.titleEn || "",
        titleBn: formData.titleBn || "",
        departmentEn: formData.departmentEn || "Landscape Design",
        departmentBn: formData.departmentBn || "ল্যান্ডস্কেপ ডিজাইন",
        locationEn: formData.locationEn || "Dhaka",
        locationBn: formData.locationBn || "ঢাকা",
        typeEn: formData.typeEn || "Full-Time",
        typeBn: formData.typeBn || "ফুল-টাইম",
        salaryRange: formData.salaryRange || "আলোচনা সাপেক্ষে",
        experience: formData.experience || "১+ বছর",
        descriptionEn: formData.descriptionEn || "",
        descriptionBn: formData.descriptionBn || "",
      };
      handleSaveOpeningsToDb([...openings, newJob]);
    }
  };

  const handleEditClick = (job: JobOpening) => {
    setEditingJobId(job.id);
    setFormData(job);
    setShowAddForm(true);
  };

  const handleDeleteJob = (id: string) => {
    if (confirm("আপনি কি নিশ্চিতভাবে এই চাকরির বিজ্ঞপ্তিটি মুছে ফেলতে চান?")) {
      const filtered = openings.filter((j) => j.id !== id);
      handleSaveOpeningsToDb(filtered);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up font-sans text-[#E4E2D7]">
      {toastMsg && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl text-xs font-bold">
          {toastMsg}
        </div>
      )}

      {/* 1. Job Openings / Postings Manager */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
              💼 Careers & Vacancies Manager
            </div>
            <h3 className="font-serif font-bold text-lg text-white">চাকরি ও পদবী বিজ্ঞপ্তি ব্যবস্থাপনা</h3>
            <p className="text-xs text-stone-400 mt-0.5">
              ওয়েবসাইটের /career পেজে প্রদর্শিত চাকরির পদসমূহ যোগ, এডিট বা ডিলিট করুন।
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (showAddForm) {
                setShowAddForm(false);
                setEditingJobId(null);
              } else {
                setEditingJobId(null);
                setFormData({
                  titleEn: "",
                  titleBn: "",
                  departmentEn: "Landscape & 3D Design",
                  departmentBn: "ল্যান্ডস্কেপ ও থ্রিডি ডিজাইন",
                  locationEn: "Dhaka, Bangladesh",
                  locationBn: "ঢাকা, বাংলাদেশ",
                  typeEn: "Full-Time",
                  typeBn: "ফুল-টাইম",
                  salaryRange: "আলোচনা সাপেক্ষে",
                  experience: "১+ বছর",
                  descriptionEn: "",
                  descriptionBn: "",
                });
                setShowAddForm(true);
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <span>{showAddForm ? "✕ বন্ধ করুন" : "+ নতুন পদ বিজ্ঞপ্তি যোগ করুন"}</span>
          </button>
        </div>

        {/* Add / Edit Form Modal / Box */}
        {showAddForm && (
          <form onSubmit={handleFormSubmit} className="bg-black/50 border border-emerald-500/30 p-6 rounded-2xl space-y-4">
            <h4 className="text-sm font-bold text-emerald-300">
              {editingJobId ? "✏️ চাকরির বিজ্ঞপ্তি এডিট করুন" : "➕ নতুন চাকরির বিজ্ঞপ্তি প্রকাশ করুন"}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1">Job Title (English) *</label>
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
                <label className="text-[10px] font-mono text-white/50 block mb-1">পদের নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={formData.titleBn || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, titleBn: e.target.value }))}
                  placeholder="যেমন: সিনিয়র ল্যান্ডস্কেপ আর্কিটেক্ট"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1">Department (English)</label>
                <input
                  type="text"
                  value={formData.departmentEn || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, departmentEn: e.target.value }))}
                  placeholder="e.g. Landscape & 3D Design"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1">বিভাগ (বাংলা)</label>
                <input
                  type="text"
                  value={formData.departmentBn || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, departmentBn: e.target.value }))}
                  placeholder="যেমন: ল্যান্ডস্কেপ ও থ্রিডি ডিজাইন"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1">Job Type</label>
                <input
                  type="text"
                  value={formData.typeEn || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, typeEn: e.target.value }))}
                  placeholder="Full-Time / Part-Time / Internship"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1">বেতন সীমা (Salary)</label>
                <input
                  type="text"
                  value={formData.salaryRange || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, salaryRange: e.target.value }))}
                  placeholder="যেমন: ৳৪৫,০০০ - ৳৬০,০০০"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1">অভিজ্ঞতা (Experience)</label>
                <input
                  type="text"
                  value={formData.experience || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                  placeholder="যেমন: ২+ বছর"
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1">Description (English)</label>
                <textarea
                  rows={3}
                  value={formData.descriptionEn || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, descriptionEn: e.target.value }))}
                  placeholder="Job roles and requirements..."
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1">কাজের বিবরণ (বাংলা)</label>
                <textarea
                  rows={3}
                  value={formData.descriptionBn || ""}
                  onChange={(e) => setFormData((p) => ({ ...p, descriptionBn: e.target.value }))}
                  placeholder="দায়িত্ব ও যোগ্যতার বিবরণ..."
                  className="w-full bg-black/60 border border-white/15 px-3 py-2 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
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
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {savingOpenings ? "সংরক্ষণ হচ্ছে..." : editingJobId ? "আপডেট করুন" : "বিজ্ঞপ্তি প্রকাশ করুন"}
              </button>
            </div>
          </form>
        )}

        {/* Existing Openings List */}
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
                <p className="text-xs text-stone-300 mt-2 max-w-2xl line-clamp-2">{job.descriptionBn}</p>
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
      </div>

      {/* 2. Messages Inbox */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">গ্রাহক বার্তা ও যোগাযোগ • Messages Inquiries</h3>
          <p className="text-xs text-stone-400 mt-0.5 mb-2">View and manage customer contact messages.</p>
        </div>

        <div className="flex flex-col gap-3">
          {messages.length === 0 ? (
            <p className="text-xs text-stone-400 italic bg-black/40 p-6 rounded-2xl text-center border border-white/10 font-mono">
              No messages in inbox.
            </p>
          ) : (
            messages.map((m: any) => (
              <div
                key={m.id || m._id}
                className="bg-black/30 border border-white/10 p-5 rounded-2xl text-xs flex justify-between items-start shadow-lg"
              >
                <div className="flex-grow min-w-0 pr-4">
                  <div className="flex justify-between items-center text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-2">
                    <span>
                      From: <b className="text-white">{m.name}</b> ({m.email})
                    </span>
                    <span>{new Date(m.createdAt).toLocaleDateString()}</span>
                  </div>
                  {m.subject && <span className="block font-bold text-emerald-300 mb-1.5 text-sm">{m.subject}</span>}
                  <p className="text-stone-300 leading-relaxed bg-black/40 border border-white/10 p-3.5 rounded-xl">
                    {m.message}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteMessage(m.id || m._id)}
                  className="text-rose-400 hover:text-rose-300 text-xs font-bold p-1 cursor-pointer transition-colors font-mono"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. Careers application tracker */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-4">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">চাকরি ও ইন্টার্নশিপ আবেদন • Job Applications</h3>
          <p className="text-xs text-stone-400 mt-0.5 mb-2">
            Shortlist or reject job applicants for engineering or design positions.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {careers.length === 0 ? (
            <p className="text-xs text-stone-400 italic bg-black/40 p-6 rounded-2xl text-center border border-white/10 font-mono">
              No candidates submitted CVs.
            </p>
          ) : (
            careers.map((car: any) => (
              <div
                key={car.id || car._id}
                className="bg-black/30 border border-white/10 p-5 rounded-2xl text-xs flex justify-between items-start shadow-lg"
              >
                <div>
                  <span className="font-bold text-white text-sm block">{car.name}</span>
                  <span className="block text-[10px] text-stone-400 font-mono mt-0.5">
                    Email: {car.email} • Phone: {car.phone}
                  </span>
                  <span className="block font-bold text-emerald-400 mt-2 font-mono">Department: {car.department}</span>
                  {car.coverLetter && (
                    <p className="text-stone-300 leading-relaxed mt-2 italic bg-black/40 border border-white/10 p-3 rounded-xl">
                      &ldquo;{car.coverLetter}&rdquo;
                    </p>
                  )}

                  <div className="flex gap-2 items-center mt-4">
                    <span className="text-[10px] font-bold text-stone-400 font-mono uppercase tracking-wider">
                      Change Status:
                    </span>
                    {["Reviewing", "Shortlisted", "Rejected"].map((state) => (
                      <button
                        key={state}
                        type="button"
                        onClick={() => handleUpdateCareerStatus(car.id || car._id, state)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold font-mono border transition-all cursor-pointer ${
                          car.status === state
                            ? "bg-emerald-500 text-stone-950 border-emerald-500 font-bold shadow-md shadow-emerald-500/20"
                            : "bg-white/5 text-stone-400 border-white/10 hover:border-emerald-500/50 hover:text-white"
                        }`}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0 ml-4 font-mono">
                  <a
                    href={car.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 px-3.5 py-2 rounded-xl font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    View CV Resume ➔
                  </a>
                  <div className="flex gap-2 items-center mt-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        car.status === "Shortlisted"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : car.status === "Rejected"
                          ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {car.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteCareer(car.id || car._id)}
                      className="text-rose-400 hover:text-rose-300 text-xs font-bold p-1 cursor-pointer transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
