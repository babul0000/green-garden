"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { CareerConfig, CareerJobOpening, DEFAULT_CAREER_CONFIG } from "@/types/cms";

export default function CareerPage() {
  const { language, t } = useLanguage();
  const { getSection, txt, config } = useSiteConfig();
  const bn = language === "bn";

  const hideStaticFallbacks = Boolean(config.homepage_sections?.hideStaticFallbacks);
  const careerCfg = getSection<CareerConfig>("career_config", DEFAULT_CAREER_CONFIG);

  const [jobs, setJobs] = useState<CareerJobOpening[]>(
    careerCfg.jobs?.length ? careerCfg.jobs : hideStaticFallbacks ? [] : DEFAULT_CAREER_CONFIG.jobs
  );
  const [selectedJob, setSelectedJob] = useState<CareerJobOpening | null>(null);

  // Application Form State
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

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const res = await fetch(`/api/settings?key=career_config&_t=${Date.now()}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.value?.jobs && Array.isArray(data.value.jobs)) {
            setJobs(data.value.jobs);
            return;
          }
        }
        const legacyRes = await fetch(`/api/settings?key=job_openings&_t=${Date.now()}`, {
          cache: "no-store",
        });
        if (legacyRes.ok) {
          const legacyData = await legacyRes.json();
          if (Array.isArray(legacyData?.value?.jobs)) {
            setJobs(legacyData.value.jobs);
            return;
          }
        }
      } catch {
        // fallback handled by context
      }
      if (!careerCfg.jobs?.length && hideStaticFallbacks) {
        setJobs([]);
      }
    };
    loadJobs();
  }, [hideStaticFallbacks, careerCfg.jobs]);

  const handleSelectJob = (job: CareerJobOpening) => {
    setSelectedJob(job);
    setDepartment(job.departmentEn || job.titleEn);
    const formEl = document.getElementById("career-apply-form");
    formEl?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setUploadingResume(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setResumeUrl(data.url || data.secure_url || "");
      } else {
        setErrorMsg(t("ফাইল আপলোডে সমস্যা হয়েছে।", "Resume upload failed. Please try again."));
      }
    } catch {
      setErrorMsg(t("নেটওয়ার্ক ত্রুটি, অনুগ্রহ করে পুনরায় চেষ্টা করুন।", "Network error while uploading resume."));
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setErrorMsg(t("সব প্রয়োজনীয় ঘর পূরণ করুন।", "Please fill in all required fields."));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          department,
          coverLetter: coverLetter.trim() || `Applied for: ${selectedJob ? selectedJob.titleEn : department}`,
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
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || t("আবেদন জমা দেওয়া যায়নি।", "Could not submit application."));
      }
    } catch {
      setErrorMsg(t("নেটওয়ার্ক ত্রুটি, অনুগ্রহ করে আবার চেষ্টা করুন।", "Network error. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const deptOptions = Array.from(
    new Set([
      ...jobs.map((j) => j.departmentEn).filter(Boolean),
      "Landscape & 3D Design",
      "Tree Doctor & Plant Clinic",
      "Project Operations",
      "Irrigation & Automation",
      "Horticulture & Gardening",
    ])
  );

  return (
    <div className="bg-[#121A14] text-white font-sans min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-950/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
              {bn ? careerCfg.badgeBn : careerCfg.badgeEn}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-light text-[#E4E2D7] tracking-tight">
            {bn ? careerCfg.titleBn : careerCfg.titleEn}
          </h1>

          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {bn ? careerCfg.subtitleBn : careerCfg.subtitleEn}
          </p>
        </div>

        {/* Open Positions Grid */}
        <div className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
            <h2 className="text-xl sm:text-2xl font-display font-bold text-[#E4E2D7]">
              {bn ? careerCfg.openingsTitleBn : careerCfg.openingsTitleEn} ({jobs.length})
            </h2>
            <span className="text-xs font-mono text-emerald-400">Dhaka, Bangladesh</span>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center text-white/60 text-sm">
              {t(
                "বর্তমানে কোনো নির্ধারিত সার্কুলার নেই, তবে নিচের ফর্মের মাধ্যমে সাধারণ আবেদন ও সিভি জমা দিতে পারেন।",
                "No specific openings listed right now — feel free to submit a general application below."
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => {
                const isSelected = selectedJob?.id === job.id;
                return (
                  <div
                    key={job.id}
                    className={`bg-white/5 border rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                      isSelected
                        ? "border-emerald-400 bg-emerald-950/30 shadow-xl"
                        : "border-white/10 hover:border-emerald-500/40"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {bn ? job.departmentBn : job.departmentEn}
                        </span>
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono bg-white/10 text-white/75">
                          {bn ? job.typeBn : job.typeEn}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-xl font-serif font-bold text-[#E4E2D7]">
                          {bn ? job.titleBn : job.titleEn}
                        </h3>
                        <p className="text-xs text-white/50 mt-1">
                          📍 {bn ? job.locationBn : job.locationEn}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                        {bn ? job.descriptionBn : job.descriptionEn}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-mono text-white/60">
                        <div>
                          <span className="text-white/40 block">
                            {t("বেতন সীমা:", "Salary Range:")}
                          </span>
                          <span className="text-emerald-300 font-bold">{job.salaryRange}</span>
                        </div>
                        <div>
                          <span className="text-white/40 block">
                            {t("অভিজ্ঞতা:", "Experience:")}
                          </span>
                          <span>{job.experience}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectJob(job)}
                      className={`mt-6 w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isSelected
                          ? "bg-emerald-400 text-stone-950"
                          : "bg-white/10 hover:bg-emerald-500 hover:text-stone-950 text-white"
                      }`}
                    >
                      {isSelected
                        ? txt("career.selectedBtn", "✓ নির্বাচিত হয়েছে", "✓ Selected")
                        : txt("career.applyNow", "আবেদন করুন", "Apply Now")}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Application Form Section */}
        <div
          id="career-apply-form"
          className="bg-[#18221A] border border-white/15 rounded-[32px] p-7 sm:p-10 max-w-3xl mx-auto shadow-2xl space-y-6"
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
              {bn ? careerCfg.formBadgeBn : careerCfg.formBadgeEn}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#E4E2D7]">
              {bn ? careerCfg.formTitleBn : careerCfg.formTitleEn}
            </h2>
            <p className="text-xs text-white/60">
              {selectedJob
                ? `${t("নির্বাচিত পদ:", "Selected Role:")} ${bn ? selectedJob.titleBn : selectedJob.titleEn}`
                : bn
                ? careerCfg.formSubtitleBn
                : careerCfg.formSubtitleEn}
            </p>
          </div>

          {successNotice ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">
                {t("আবেদন সফলভাবে জমা হয়েছে!", "Application Submitted Successfully!")}
              </h3>
              <p className="text-xs text-white/70 max-w-md mx-auto">
                {t(
                  "আমাদের HR ও স্টুডিও টিম আপনার সিভি পর্যালোচনা করে শীঘ্রই যোগাযোগ করবে।",
                  "Our HR desk will review your CV and reach out to shortlisted candidates shortly."
                )}
              </p>
              <button
                type="button"
                onClick={() => setSuccessNotice(false)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 text-stone-950 font-bold text-xs cursor-pointer"
              >
                {t("আরেকটি আবেদন করুন", "Submit Another Application")}
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
                  <label className="block text-xs font-mono text-white/70 mb-1.5">
                    {t("আপনার পূর্ণ নাম *", "Full Name *")}
                  </label>
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
                  <label className="block text-xs font-mono text-white/70 mb-1.5">
                    {t("মোবাইল ফোন নম্বর *", "Phone Number *")}
                  </label>
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
                  <label className="block text-xs font-mono text-white/70 mb-1.5">
                    {t("ইমেইল ঠিকানা *", "Email Address *")}
                  </label>
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
                  <label className="block text-xs font-mono text-white/70 mb-1.5">
                    {t("আবেদনের পদ / বিভাগ *", "Role / Department *")}
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white focus:border-emerald-400 focus:outline-none cursor-pointer"
                  >
                    {deptOptions.map((dept) => (
                      <option key={dept} value={dept} className="bg-[#18221A]">
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  {t("কভার লেটার / আপনার অভিজ্ঞতা ও বার্তা", "Cover Letter / Experience Summary")}
                </label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder={t(
                    "আপনার পূর্ববর্তী কাজের অভিজ্ঞতা, সফটওয়্যার দক্ষতা বা শিক্ষাগত যোগ্যতা সংক্ষেপে লিখুন...",
                    "Briefly describe your background, software skills, or botanical credentials..."
                  )}
                  className="w-full bg-black/40 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-white/70 mb-1.5">
                  {t("সিভি / রিজিউম ফাইল আপলোড (PDF/Doc/Image) *", "Upload CV / Resume (PDF/Doc/Image) *")}
                </label>
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
                      {uploadingResume
                        ? t("আপলোড হচ্ছে...", "Uploading...")
                        : resumeFile
                        ? `${t("নির্বাচিত:", "Selected:")} ${resumeFile.name}`
                        : t("আপনার সিভি ফাইল নির্বাচন করুন", "Choose Your CV File")}
                    </span>
                    <span className="text-[10px] text-white/40">
                      {t("পিডিএফ বা ডক ফাইল সর্বোচ্চ ১০ মেগাবাইট", "PDF, DOC or Image up to 10MB")}
                    </span>
                  </label>
                  {resumeUrl && (
                    <span className="text-[10px] text-emerald-400 font-mono block mt-2">
                      ✅ {t("ফাইল সফলভাবে স্টোরেজে আপলোড হয়েছে", "Uploaded securely")}
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || uploadingResume}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {submitting
                  ? t("আবেদন জমা হচ্ছে...", "Submitting...")
                  : txt("career.submitApp", "আবেদন জমা দিন", "Submit Application")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
