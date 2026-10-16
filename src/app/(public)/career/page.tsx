"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

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
    salaryRange: "৳৩৫,০০০ - ৳৪৫,০০০",
    experience: "২+ বছর",
    descriptionEn: "Supervise civil site waterproofing, structural load drainage, soil preparation, and team coordination.",
    descriptionBn: "সাইটের ওয়াটারপ্রুফিং, ড্রেনেজ লেয়ারিং, ড্রিপ ইরিগেশন এবং মালি ও কর্মীদের সাইট তদারকি।",
  },
  {
    id: "job-4",
    titleEn: "Smart Drip Irrigation & IoT Technician",
    titleBn: "স্মার্ট ড্রিপ ইরিগেশন ও আইওটি টেকনিশিয়ান",
    departmentEn: "Irrigation & Automation",
    departmentBn: "ইরিগেশন ও অটোমেশন",
    locationEn: "Dhaka, Bangladesh",
    locationBn: "ঢাকা, বাংলাদেশ",
    typeEn: "Full-Time",
    typeBn: "ফুল-টাইম",
    salaryRange: "৳৩০,০০০ - ৳৪০,০০০",
    experience: "১+ বছর",
    descriptionEn: "Install automated WiFi micro-drip networks, solonoid valves, moisture sensors, and pumps.",
    descriptionBn: "স্বয়ংক্রিয় ড্রিপ সেচ পাইপলাইন, সেন্সর, সোলেনয়েড ভালভ ও ওয়াইফাই কন্ট্রোলার স্থাপন ও সার্ভিসিং।",
  },
];

export default function CareerPage() {
  const { language, t } = useLanguage();
  const [jobs, setJobs] = useState<JobOpening[]>(DEFAULT_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Landscape & 3D Design");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploadingResume, setUploadingResume] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load custom career jobs from database settings if customized by admin
  useEffect(() => {
    const fetchCareerConfig = async () => {
      try {
        const res = await fetch(`/api/settings?key=career_config&_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data?.value?.jobs && Array.isArray(data.value.jobs) && data.value.jobs.length > 0) {
            setJobs(data.value.jobs);
          }
        }
      } catch {
        // Fallback to default job openings
      }
    };
    fetchCareerConfig();
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeFile(file);
    setUploadingResume(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "resumes");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setResumeUrl(data.url);
      } else {
        setErrorMsg(data.error || "Failed to upload resume. PDF/Images up to 10MB permitted.");
      }
    } catch {
      setErrorMsg("Network error during resume upload");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleApply = (job: JobOpening) => {
    setSelectedJob(job);
    setDepartment(job.departmentEn);
    const formElement = document.getElementById("application-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !department) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!resumeUrl && !resumeFile) {
      setErrorMsg("Please upload your CV / Resume (PDF or Document).");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          department,
          coverLetter: coverLetter || `Applied for: ${selectedJob ? selectedJob.titleEn : department}`,
          resumeUrl: resumeUrl || "https://resumes.argreengarden.com/submitted",
        }),
      });

      if (res.ok) {
        setSuccessNotice(true);
        setName("");
        setEmail("");
        setPhone("");
        setCoverLetter("");
        setResumeFile(null);
        setResumeUrl("");
        setSelectedJob(null);
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Failed to submit career application.");
      }
    } catch {
      setErrorMsg("Failed to connect to application server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#121A14] text-white font-sans min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
              {t("Career Opportunities • AR Green Garden", "Career Opportunities • AR Green Garden")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-light text-[#E4E2D7] tracking-tight">
            {t("আমাদের স্টুডিও টিমে যোগ দিন", "Join Our Architecture & Botany Studio")}
          </h1>

          <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
            {t(
              "আমরা দেশের শীর্ষস্থানীয় ল্যান্ডস্কেপ আর্কিটেক্ট, বৃক্ষ চিকিৎসক ও দক্ষ কর্মীদের সমন্বয়ে একটি পরিবেশবান্ধব পরিবার। টেকসই ও আধুনিক সবুজ স্থাপত্য বিনির্মাণে আপনিও হোন আমাদের সহযোগী।",
              "We are building climate-resilient landscapes across Bangladesh. Explore our open positions for landscape architects, arborists, and horticultural engineers."
            )}
          </p>
        </div>

        {/* Current Job Openings Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7]">
              {t("উন্মুক্ত চাকরির পদসমূহ", "Open Positions")} ({jobs.length})
            </h2>
            <span className="text-xs font-mono text-emerald-400">
              {t("সরাসরি অনলাইন আবেদন", "Direct Online Application")}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className={`bg-[#18221A]/85 backdrop-blur-xl border p-6 sm:p-8 rounded-3xl transition-all shadow-xl flex flex-col justify-between gap-6 ${
                  selectedJob?.id === job.id
                    ? "border-emerald-400 shadow-emerald-950/40"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {language === "bn" ? job.departmentBn : job.departmentEn}
                    </span>
                    <span className="text-xs font-mono text-white/50">
                      📍 {language === "bn" ? job.locationBn : job.locationEn}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {language === "bn" ? job.titleBn : job.titleEn}
                  </h3>

                  <p className="text-xs text-white/70 leading-relaxed">
                    {language === "bn" ? job.descriptionBn : job.descriptionEn}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-white/60">
                    <div>
                      <span className="text-white/40 block">বেতন সীমা:</span>
                      <span className="text-emerald-400 font-bold">{job.salaryRange || "আলোচনা সাপেক্ষে"}</span>
                    </div>
                    <div>
                      <span className="text-white/40 block">অভিজ্ঞতা:</span>
                      <span className="text-white">{job.experience || "১-৩ বছর"}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleApply(job)}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-stone-950 border border-white/15 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{selectedJob?.id === job.id ? "✓ নির্বাচিত হয়েছে" : "আবেদন করুন"}</span>
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div id="application-form" className="bg-[#18221A]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
              Application Portal
            </span>
            <h2 className="text-2xl font-display font-bold text-[#E4E2D7] mt-1">
              {selectedJob
                ? `আবেদন: ${language === "bn" ? selectedJob.titleBn : selectedJob.titleEn}`
                : t("অনলাইনে আবেদন করুন", "Submit Your Application")}
            </h2>
            <p className="text-xs text-white/60 mt-1">
              আপনার সঠিক তথ্য ও সিভি/রিজিউম জমা দিন। আমাদের এইচআর টিম আপনার সাথে যোগাযোগ করবে।
            </p>
          </div>

          {successNotice ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
              <span className="text-4xl block">🎉</span>
              <h3 className="text-lg font-bold text-emerald-400">আপনার চাকরির আবেদন সফলভাবে জমা হয়েছে!</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                ধন্যবাদ। আপনার রিজিউম আমাদের এইচআর ও আর্কিটেকচার টিমের পর্যালোচনার জন্য গৃহীত হয়েছে। বাছাইকৃত প্রার্থীদের সরাসরি ফোনে সাক্ষাৎকার জানানো হবে।
              </p>
              <button
                type="button"
                onClick={() => setSuccessNotice(false)}
                className="mt-4 px-6 py-2 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs"
              >
                আরেকটি আবেদন করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs p-3.5 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1.5">আপনার পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. মোঃ তানভীর আহমেদ"
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1.5">মোবাইল ফোন নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1.5">ইমেইল ঠিকানা *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-white/70 mb-1.5">আবেদনের পদ / বিভাগ *</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
                  >
                    <option value="Landscape & 3D Design" className="bg-[#18221A]">Landscape & 3D Design (আর্কিটেকচার)</option>
                    <option value="Tree Doctor & Plant Clinic" className="bg-[#18221A]">Tree Doctor & Plant Clinic (গাছের ডাক্তার)</option>
                    <option value="Project Operations" className="bg-[#18221A]">Project Operations (সাইট সুপারভাইজার)</option>
                    <option value="Irrigation & Automation" className="bg-[#18221A]">Irrigation & Automation (সেচ টেকনিশিয়ান)</option>
                    <option value="Horticulture & Gardening" className="bg-[#18221A]">Horticulture & Gardening (অভিজ্ঞ মালি)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">কভার লেটার / আপনার অভিজ্ঞতা ও বার্তা</label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="আপনার পূর্ববর্তী কাজের অভিজ্ঞতা, সফটওয়্যার দক্ষতা বা শিক্ষাগত যোগ্যতা সংক্ষেপে লিখুন..."
                  className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* CV File Upload */}
              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">সিভি / রিজিউম ফাইল আপলোড (PDF/Doc/Image, Max 10MB) *</label>
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-5 text-center bg-black/20 hover:border-emerald-400/50 transition-colors">
                  <input
                    type="file"
                    id="resume-file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="resume-file" className="cursor-pointer flex flex-col items-center gap-2">
                    <span className="text-2xl">📄</span>
                    <span className="text-xs font-bold text-emerald-400">
                      {uploadingResume ? "আপলোড হচ্ছে..." : resumeFile ? `নির্বাচিত: ${resumeFile.name}` : "আপনার সিভি ফাইল নির্বাচন করুন"}
                    </span>
                    <span className="text-[10px] text-white/40">পিডিএফ বা ডক ফাইল সর্বোচ্চ ১০ মেগাবাইট</span>
                  </label>
                  {resumeUrl && (
                    <span className="text-[10px] text-emerald-400 font-mono block mt-2">
                      ✅ ফাইল সফলভাবে স্টোরেজে আপলোড হয়েছে
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || uploadingResume}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting ? "আবেদন জমা হচ্ছে..." : "আবেদন সম্পন্ন করুন (Submit Application)"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
