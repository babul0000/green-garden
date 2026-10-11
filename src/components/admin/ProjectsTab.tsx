"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { IProject } from "@/types";

interface ProjectsTabProps {
  projects?: IProject[];
  onRefresh?: () => void;
  // Optional backward compatible props:
  projName?: string;
  setProjName?: (val: string) => void;
  projClient?: string;
  setProjClient?: (val: string) => void;
  projCategory?: string;
  setProjCategory?: (val: string) => void;
  projUrl?: string;
  setProjUrl?: (val: string) => void;
  projLocation?: string;
  setProjLocation?: (val: string) => void;
  projDuration?: string;
  setProjDuration?: (val: string) => void;
  projBudget?: string;
  setProjBudget?: (val: string) => void;
  projChallenges?: string;
  setProjChallenges?: (val: string) => void;
  projSolution?: string;
  setProjSolution?: (val: string) => void;
  projTestimonialName?: string;
  setProjTestimonialName?: (val: string) => void;
  projTestimonialText?: string;
  setProjTestimonialText?: (val: string) => void;
  projFeatured?: boolean;
  setProjFeatured?: (val: boolean) => void;
  editingProject?: IProject | null;
  handleCreateOrUpdateProject?: (e: React.FormEvent) => void;
  handleEditProjectClick?: (proj: IProject) => void;
  handleDeleteProject?: (id?: string) => void;
  resetProjectForm?: () => void;
}

const CATEGORIES = [
  "Residential",
  "Commercial",
  "Villa",
  "Rooftop Garden",
  "Vertical Living Wall",
  "Resort & Hospitality",
  "Urban Forestry",
];

const STATUS_OPTIONS = [
  { value: "RUNNING", label: "চলমান (Running)", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "COMPLETED", label: "সম্পন্ন (Completed)", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "PLANNING", label: "পরিকল্পনাধীন (Planning)", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "MAINTENANCE", label: "রক্ষণাবেক্ষণাধীন (Maintenance)", color: "bg-purple-100 text-purple-800 border-purple-300" },
];

export default function ProjectsTab({
  projects = [],
  onRefresh,
}: ProjectsTabProps) {
  // Modal State: 'create' | 'edit' | 'view' | 'delete' | null
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view" | "delete" | null>(null);
  const [activeProject, setActiveProject] = useState<IProject | null>(null);

  // Form Fields State for Create & Edit
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    clientName: "",
    clientPhone: "",
    category: "Residential",
    location: "",
    status: "RUNNING",
    progress: 50,
    budget: "",
    totalExpense: "",
    duration: "4 Weeks",
    warrantyMonths: 12,
    afterImage: "",
    beforeImage: "",
    galleryImagesText: "",
    description: "",
    challenges: "",
    solution: "",
    testimonialName: "",
    testimonialText: "",
    featured: false,
  });

  // UI Filtering & Searching State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewLayout, setViewLayout] = useState<"grid" | "table">("grid");
  const [activeViewMediaTab, setActiveViewMediaTab] = useState<"after" | "before" | "gallery">("after");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formActiveSection, setFormActiveSection] = useState<"general" | "scope" | "media" | "casestudy">("general");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // KPI Calculations
  const stats = useMemo(() => {
    const total = projects.length;
    const running = projects.filter((p) => (p.status || "RUNNING").toUpperCase() === "RUNNING").length;
    const completed = projects.filter((p) => (p.status || "").toUpperCase() === "COMPLETED").length;
    const featured = projects.filter((p) => p.featured).length;
    return { total, running, completed, featured };
  }, [projects]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        searchQuery === "" ||
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.clientName && p.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.client && p.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory =
        categoryFilter === "all" || (p.category && p.category.toLowerCase() === categoryFilter.toLowerCase());

      const matchStatus =
        statusFilter === "all" || (p.status && p.status.toUpperCase() === statusFilter.toUpperCase());

      return matchSearch && matchCategory && matchStatus;
    });
  }, [projects, searchQuery, categoryFilter, statusFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setFormData({
      name: "",
      slug: "",
      clientName: "",
      clientPhone: "",
      category: "Residential",
      location: "ধানমন্ডি, ঢাকা",
      status: "RUNNING",
      progress: 30,
      budget: "350000",
      totalExpense: "120000",
      duration: "3 Weeks",
      warrantyMonths: 12,
      afterImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
      beforeImage: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1200&auto=format&fit=crop",
      galleryImagesText: "",
      description: "আধুনিক বায়োফিলিক ল্যান্ডস্কেপ আর্কিটেকচার ও উন্নত ড্রেনেজ সিস্টেম সমন্বিত ছাদবাগান প্রকল্প।",
      challenges: "ছাদ স্লাবের মাইক্রো ফ্র্যাকচার ওয়াটারপ্রুফিং ও অতিরিক্ত ওজন বহন করার সীমাবদ্ধতা।",
      solution: "৩ স্তরের ইলাস্টোমেরিক মেমব্রেন এবং হালকা ওজনের প্রসারিত ক্লে অ্যাগ্রিগেট সাবস্ট্রেট স্থাপন।",
      testimonialName: "",
      testimonialText: "",
      featured: false,
    });
    setFormActiveSection("general");
    setActiveProject(null);
    setModalMode("create");
  };

  // Open Edit Modal
  const handleOpenEditModal = (proj: IProject) => {
    const materials = proj.materialsUsed as any;
    const notesStr = proj.notes || "";
    
    // Extract duration from notes if available
    let dur = proj.duration || "";
    if (!dur && notesStr.includes("Duration:")) {
      const match = notesStr.match(/Duration:\s*([^|]+)/);
      if (match) dur = match[1].trim();
    }

    setFormData({
      name: proj.name || proj.title || "",
      slug: proj.slug || "",
      clientName: proj.clientName || proj.client || "",
      clientPhone: proj.clientPhone || "",
      category: proj.category || "Residential",
      location: proj.location || "",
      status: proj.status || "RUNNING",
      progress: typeof proj.progress === "number" ? proj.progress : 50,
      budget: proj.budget ? String(proj.budget) : (proj.budgetRange || ""),
      totalExpense: proj.totalExpense ? String(proj.totalExpense) : "",
      duration: dur || "4 Weeks",
      warrantyMonths: proj.warrantyMonths || 12,
      afterImage: proj.afterImage || proj.imageUrl || "",
      beforeImage: proj.beforeImage || "",
      galleryImagesText: Array.isArray(proj.images) ? proj.images.join("\n") : "",
      description: proj.description || "",
      challenges: proj.challenges || materials?.challenges || "",
      solution: proj.solution || materials?.solution || "",
      testimonialName: proj.clientTestimonial?.name || materials?.testimonial?.name || "",
      testimonialText: proj.clientTestimonial?.text || materials?.testimonial?.text || "",
      featured: Boolean(proj.featured),
    });
    setFormActiveSection("general");
    setActiveProject(proj);
    setModalMode("edit");
  };

  // Open View Details Modal
  const handleOpenViewModal = (proj: IProject) => {
    setActiveProject(proj);
    setActiveViewMediaTab("after");
    setModalMode("view");
  };

  // Open Delete Modal
  const handleOpenDeleteModal = (proj: IProject) => {
    setActiveProject(proj);
    setModalMode("delete");
  };

  // Close Any Modal
  const handleCloseModal = () => {
    setModalMode(null);
    setActiveProject(null);
  };

  // Submit Handler: Create or Edit
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("প্রজেক্টের নাম আবশ্যক!");
      return;
    }

    setIsSubmitting(true);
    try {
      const allGalleryImages = formData.galleryImagesText
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        slug:
          formData.slug.trim() ||
          formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now()}`,
        clientName: formData.clientName.trim(),
        clientPhone: formData.clientPhone.trim(),
        category: formData.category,
        location: formData.location.trim(),
        status: formData.status,
        progress: Number(formData.progress) || 0,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        totalExpense: formData.totalExpense ? parseFloat(formData.totalExpense) : 0,
        afterImage: formData.afterImage.trim() || null,
        beforeImage: formData.beforeImage.trim() || null,
        images: allGalleryImages.length > 0 ? allGalleryImages : formData.afterImage ? [formData.afterImage] : [],
        description: formData.description.trim() || null,
        notes: `Duration: ${formData.duration} | Challenges: ${formData.challenges} | Solution: ${formData.solution} | Warranty: ${formData.warrantyMonths} Months`,
        materialsUsed: {
          duration: formData.duration,
          challenges: formData.challenges,
          solution: formData.solution,
          warrantyMonths: formData.warrantyMonths,
          testimonial: {
            name: formData.testimonialName,
            text: formData.testimonialText,
          },
        },
        featured: formData.featured,
      };

      if (modalMode === "create") {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "প্রজেক্ট সংরক্ষণ ব্যর্থ হয়েছে");
        }

        showToast("✓ নতুন প্রজেক্ট সফলভাবে ডাটাবেজে তৈরি হয়েছে!");
      } else if (modalMode === "edit" && activeProject) {
        const projId = activeProject.id || activeProject._id;
        const res = await fetch(`/api/projects/${projId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "প্রজেক্ট আপডেট ব্যর্থ হয়েছে");
        }

        showToast("✓ প্রজেক্টের যাবতীয় তথ্য সফলভাবে আপডেট হয়েছে!");
      }

      handleCloseModal();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert("ত্রুটি: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Handler: Delete
  const handleConfirmDelete = async () => {
    if (!activeProject) return;
    const projId = activeProject.id || activeProject._id;
    if (!projId) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${projId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "প্রজেক্ট ডিলিট করা যায়নি");
      }
      showToast("🗑️ প্রজেক্ট সফলভাবে ডাটাবেজ থেকে মুছে ফেলা হয়েছে!");
      handleCloseModal();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert("ত্রুটি: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (statusName?: string) => {
    const s = (statusName || "RUNNING").toUpperCase();
    const found = STATUS_OPTIONS.find((opt) => opt.value === s);
    return found || STATUS_OPTIONS[0];
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans text-[#121813]">
      
      {/* 1. TOP HEADER & ACTION BAR */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-display font-light tracking-wide uppercase text-[#121813]">
              🏛️ প্রজেক্ট মাস্টারপ্ল্যান ও পোর্টফোলিও
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2B4D33] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] border border-[#2B4D33]/20">
              Live Projects Hub
            </span>
          </div>
          <p className="text-xs text-[#75787B] font-light mt-1">
            ল্যান্ডস্কেপ প্রজেক্টের এ-টু-জেড কনফিগারেশন — নতুন প্রজেক্ট তৈরি, এডিট, রিয়েল-টাইম প্রগ্রেস ও আর্কিটেকচারাল কেস স্টাডিজ।
          </p>
        </div>

        {/* Primary CTA: Add New Project Modal Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold tracking-wider py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-sm">+</span>
            <span>নতুন প্রজেক্ট যোগ করুন (Modal)</span>
          </button>
        </div>
      </div>

      {/* Temporary Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-[#E8F5E9] border border-[#2B4D33]/40 text-[#121813] rounded-2xl text-xs font-semibold animate-fade-in flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2B4D33] animate-ping"></span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#75787B] hover:text-[#121813] font-bold cursor-pointer">✕</button>
        </div>
      )}

      {/* 2. STATS KPI BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#D6D2C4] shadow-2xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">মোট প্রজেক্ট</p>
          <p className="text-2xl font-display font-light text-[#121813] mt-1">{stats.total}</p>
          <p className="text-[10px] text-[#75787B] mt-0.5 font-mono">Total Database Portfolio</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D6D2C4] shadow-2xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-[#2B4D33] font-bold">চলমান সাইট (Running)</p>
          <p className="text-2xl font-display font-light text-[#2B4D33] mt-1">{stats.running}</p>
          <p className="text-[10px] text-[#75787B] mt-0.5 font-mono">Under Construction</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D6D2C4] shadow-2xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-blue-700 font-bold">সম্পন্ন (Completed)</p>
          <p className="text-2xl font-display font-light text-blue-900 mt-1">{stats.completed}</p>
          <p className="text-[10px] text-[#75787B] mt-0.5 font-mono">Finished Masterplans</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#D6D2C4] shadow-2xs">
          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-700 font-bold">ফিচার্ড কেস স্টাডি</p>
          <p className="text-2xl font-display font-light text-amber-900 mt-1">{stats.featured}</p>
          <p className="text-[10px] text-[#75787B] mt-0.5 font-mono">Homepage Showcase</p>
        </div>
      </div>

      {/* 3. TOOLBAR: SEARCH & FILTERS */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#D6D2C4] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রজেক্টের নাম, ক্লায়েন্ট বা এলাকা খুঁজুন..."
            className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl pl-9 pr-4 py-2 text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#75787B]">🔍</span>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3 py-2 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] cursor-pointer font-sans"
          >
            <option value="all">সব ক্যাটাগরি (All Categories)</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3 py-2 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] cursor-pointer font-sans"
          >
            <option value="all">সব স্ট্যাটাস (All Status)</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewLayout("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewLayout === "grid" ? "bg-white text-[#2B4D33] shadow-xs font-bold" : "text-[#75787B] hover:text-[#121813]"
              }`}
              title="Grid View"
            >
              ⊞ গ্রিড
            </button>
            <button
              type="button"
              onClick={() => setViewLayout("table")}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                viewLayout === "table" ? "bg-white text-[#2B4D33] shadow-xs font-bold" : "text-[#75787B] hover:text-[#121813]"
              }`}
              title="Table View"
            >
              ☰ টেবিল
            </button>
          </div>
        </div>
      </div>

      {/* 4. MAIN PROJECTS LISTING (GRID OR TABLE) */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-[#D6D2C4] shadow-2xs text-center flex flex-col items-center justify-center gap-3">
          <span className="text-4xl">🌿</span>
          <p className="text-base font-bold text-[#121813]">কোনো প্রজেক্ট পাওয়া যায়নি</p>
          <p className="text-xs text-[#75787B] max-w-sm">
            বর্তমান ফিল্টারে কোনো তথ্য মিলেনি অথবা এখনো কোনো প্রজেক্ট যোগ করা হয়নি। নতুন প্রজেক্ট তৈরি করতে নিচের বাটনে চাপ দিন।
          </p>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="mt-2 bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold py-2 px-5 rounded-xl cursor-pointer"
          >
            + নতুন প্রজেক্ট যোগ করুন
          </button>
        </div>
      ) : viewLayout === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p) => {
            const statusBadge = getStatusBadge(p.status);
            const coverImage = p.afterImage || p.imageUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop";
            const progressVal = typeof p.progress === "number" ? p.progress : 50;

            return (
              <div
                key={p.id || p._id}
                className="bg-white rounded-2xl border border-[#D6D2C4] shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                {/* Image & Top Badges */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={coverImage}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#121813] backdrop-blur-xs shadow-xs">
                      {p.category}
                    </span>
                    {p.featured && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 shadow-xs">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  {/* Status Pill on Bottom Right of Image */}
                  <div className="absolute bottom-2.5 right-3">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${statusBadge.color}`}>
                      {statusBadge.label.split(" ")[0]}
                    </span>
                  </div>

                  {/* Location Tag */}
                  {p.location && (
                    <div className="absolute bottom-2.5 left-3 text-white text-[11px] flex items-center gap-1 font-light drop-shadow-xs">
                      <span>📍</span>
                      <span className="truncate max-w-[160px]">{p.location}</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-4 flex flex-col gap-3 flex-grow justify-between">
                  <div>
                    <h3 className="font-display font-light text-base text-[#121813] tracking-wide uppercase leading-snug line-clamp-1 group-hover:text-[#2B4D33] transition-colors">
                      {p.name}
                    </h3>

                    <p className="text-[11px] text-[#75787B] font-light mt-0.5 flex items-center gap-1.5">
                      <span>👤</span>
                      <span>{p.clientName || p.client || "ব্যক্তিগত ক্লায়েন্ট (Private Client)"}</span>
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#75787B]">কাজের অগ্রগতি (Progress)</span>
                        <span className="font-bold text-[#2B4D33]">{progressVal}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E4E2D7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#2B4D33] rounded-full transition-all duration-500"
                          style={{ width: `${progressVal}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#E4E2D7] text-[11px]">
                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#75787B] block">বাজেট (Budget)</span>
                        <span className="font-mono font-bold text-[#121813]">
                          {p.budget ? `৳ ${Number(p.budget).toLocaleString()}` : (p.budgetRange || "কোটেশন ভিত্তিক")}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-mono text-[#75787B] block">খরচ (Expense)</span>
                        <span className="font-mono font-medium text-[#75787B]">
                          {p.totalExpense ? `৳ ${Number(p.totalExpense).toLocaleString()}` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Prominent Action Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-[#E4E2D7]">
                    <button
                      type="button"
                      onClick={() => handleOpenViewModal(p)}
                      className="py-1.5 px-2 bg-[#F7F6F2] hover:bg-[#E4E2D7] text-[#121813] text-[11px] font-mono font-semibold rounded-xl border border-[#D6D2C4] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                      title="View Details Modal"
                    >
                      <span>👁️</span>
                      <span>দেখুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(p)}
                      className="py-1.5 px-2 bg-white hover:bg-stone-50 text-[#2B4D33] text-[11px] font-mono font-bold rounded-xl border border-[#2B4D33]/30 flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                      title="Edit Project Modal"
                    >
                      <span>✏️</span>
                      <span>এডিট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDeleteModal(p)}
                      className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-mono font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                      title="Delete Project Modal"
                    >
                      <span>🗑️</span>
                      <span>ডিলিট</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-[#D6D2C4] shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F7F6F2] border-b border-[#D6D2C4] text-[10px] font-mono uppercase tracking-wider text-[#75787B]">
                <tr>
                  <th className="py-3 px-4">প্রজেক্ট ও কাভার</th>
                  <th className="py-3 px-4">ক্লায়েন্ট ও এলাকা</th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4">অগ্রগতি ও স্ট্যাটাস</th>
                  <th className="py-3 px-4">বাজেট</th>
                  <th className="py-3 px-4 text-right">অ্যাকশনস (Modal)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E2D7]">
                {filteredProjects.map((p) => {
                  const statusBadge = getStatusBadge(p.status);
                  const coverImage = p.afterImage || p.imageUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop";
                  const progressVal = typeof p.progress === "number" ? p.progress : 50;

                  return (
                    <tr key={p.id || p._id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coverImage}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg border border-[#D6D2C4] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#121813] hover:text-[#2B4D33] cursor-pointer" onClick={() => handleOpenViewModal(p)}>
                              {p.name}
                            </p>
                            <p className="text-[10px] font-mono text-[#75787B] truncate max-w-xs">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-[#121813]">{p.clientName || p.client || "—"}</p>
                        <p className="text-[10px] text-[#75787B] font-light">{p.location || "—"}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E4E2D7] text-[#121813] font-bold">
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={`px-1.5 py-0.2 rounded-full font-mono font-bold text-[9px] border ${statusBadge.color}`}>
                              {statusBadge.label.split(" ")[0]}
                            </span>
                            <span className="font-mono font-bold text-[#2B4D33]">{progressVal}%</span>
                          </div>
                          <div className="w-full h-1 bg-[#E4E2D7] rounded-full overflow-hidden">
                            <div className="h-full bg-[#2B4D33]" style={{ width: `${progressVal}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#121813]">
                        {p.budget ? `৳ ${Number(p.budget).toLocaleString()}` : (p.budgetRange || "—")}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenViewModal(p)}
                            className="p-1.5 bg-[#F7F6F2] hover:bg-[#E4E2D7] text-[#121813] rounded-lg border border-[#D6D2C4] cursor-pointer"
                            title="View Details Modal"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 bg-white hover:bg-stone-50 text-[#2B4D33] rounded-lg border border-[#2B4D33]/30 cursor-pointer"
                            title="Edit Project Modal"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDeleteModal(p)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 cursor-pointer"
                            title="Delete Modal"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL 1 & 2: ADD / EDIT PROJECT MODAL (A TO Z DYNAMIC INPUTS)          */}
      {/* ========================================================================= */}
      {(modalMode === "create" || modalMode === "edit") && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl border border-[#D6D2C4] shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
            
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
                    সম্পূর্ণ এ-টু-জেড কনফিগারেশন — কেস স্টাডিজ, ক্লায়েন্ট তথ্য ও ফটো গ্যালারি।
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#121813] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Sub-navigation Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-[#E4E2D7] bg-white shrink-0 overflow-x-auto custom-scrollbar">
              <button
                type="button"
                onClick={() => setFormActiveSection("general")}
                className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
                className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
                className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap ${
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
                className={`pb-2.5 px-3 text-xs font-mono font-bold tracking-wide border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  formActiveSection === "casestudy"
                    ? "border-[#2B4D33] text-[#2B4D33]"
                    : "border-transparent text-[#75787B] hover:text-[#121813]"
                }`}
              >
                ৪. কেস স্টাডি ও রিভিউ
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitForm} className="flex flex-col flex-grow overflow-hidden">
              <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-5">
                
                {/* SECTION 1: GENERAL & CLIENT INFO */}
                {formActiveSection === "general" && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                          প্রজেক্টের নাম (Project Name) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. ধানমন্ডি স্কাই হ্যাভেন রুফটপ"
                          className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
                          ক্যাটাগরি (Architecture Category)
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] cursor-pointer"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          type="text"
                          value={formData.clientPhone}
                          onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                          placeholder="e.g. 01883012641"
                          className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3.5 py-2.5 text-xs text-[#121813] font-mono focus:outline-none focus:border-[#2B4D33]"
                        />
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
                        প্রকল্পের সংক্ষিপ্ত সারমর্ম (Short Overview)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="প্রকল্পের মূল লক্ষ্য ও নকশার সংক্ষিপ্ত বর্ণনা..."
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
                          {STATUS_OPTIONS.map((opt) => (
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

              {/* Modal Footer Controls */}
              <div className="px-6 py-4 border-t border-[#E4E2D7] bg-[#F7F6F2] flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] text-xs font-mono font-semibold transition-all cursor-pointer"
                >
                  বাতিল (Cancel)
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold tracking-wider transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
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
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL 3: VIEW DETAILS MODAL (বিউটিফুল আর্কিটেকচারাল প্রিভিউ)          */}
      {/* ========================================================================= */}
      {modalMode === "view" && activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl border border-[#D6D2C4] shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#E4E2D7] flex items-center justify-between bg-[#F7F6F2] shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-[#2B4D33] text-white flex items-center justify-center text-lg font-bold shadow-xs">
                  👁️
                </span>
                <div>
                  <h3 className="font-display font-light text-lg sm:text-xl text-[#121813] uppercase tracking-wide">
                    {activeProject.name}
                  </h3>
                  <p className="text-[11px] text-[#75787B] font-light">
                    আর্কিটেকচারাল কেস স্টাডি ও পূর্ণাঙ্গ প্রকল্পের বিস্তারিত স্ন্যাপশট।
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(activeProject)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#2B4D33]/40 text-[#2B4D33] text-xs font-mono font-bold hover:bg-emerald-50 transition-colors cursor-pointer"
                  title="Edit This Project"
                >
                  ✏️ এডিট করুন
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 text-[#121813] flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-grow space-y-6">
              
              {/* Hero Image Showcase with Before/After Switcher */}
              <div className="space-y-3">
                <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-stone-900 border border-[#D6D2C4] shadow-inner">
                  {/* Active Photo Render */}
                  <img
                    src={
                      activeViewMediaTab === "before" && activeProject.beforeImage
                        ? activeProject.beforeImage
                        : activeProject.afterImage || activeProject.imageUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={activeProject.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                  {/* Badges on Top */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-white/95 text-[#121813] backdrop-blur-md shadow-sm">
                      {activeProject.category}
                    </span>
                    {activeProject.featured && (
                      <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-400 text-stone-950 shadow-sm">
                        ★ Homepage Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Info on Image */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                    <div>
                      <p className="text-xs font-mono text-emerald-300 uppercase tracking-widest font-semibold">
                        {activeProject.location || "Bangladesh"}
                      </p>
                      <h4 className="text-xl sm:text-2xl font-display font-light uppercase tracking-wide drop-shadow-md">
                        {activeProject.name}
                      </h4>
                    </div>

                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border shadow-sm ${getStatusBadge(activeProject.status).color}`}>
                        {getStatusBadge(activeProject.status).label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Media Switcher Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveViewMediaTab("after")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      activeViewMediaTab === "after"
                        ? "bg-[#2B4D33] text-white shadow-xs"
                        : "bg-[#F7F6F2] text-[#75787B] hover:text-[#121813] border border-[#D6D2C4]"
                    }`}
                  >
                    🌿 কাজের পরের দৃশ্য (After)
                  </button>

                  {activeProject.beforeImage && (
                    <button
                      type="button"
                      onClick={() => setActiveViewMediaTab("before")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        activeViewMediaTab === "before"
                          ? "bg-[#2B4D33] text-white shadow-xs"
                          : "bg-[#F7F6F2] text-[#75787B] hover:text-[#121813] border border-[#D6D2C4]"
                      }`}
                    >
                      🧱 পূর্বের অবস্থা (Before)
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-[#D6D2C4] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#121813]">কাজের সার্বিক অগ্রগতি (Execution Progress)</span>
                  <span className="font-bold text-[#2B4D33] text-sm">{activeProject.progress || 50}%</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-[#D6D2C4]">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-[#2B4D33] rounded-full transition-all duration-700"
                    style={{ width: `${activeProject.progress || 50}%` }}
                  />
                </div>
              </div>

              {/* 4-Card Scope & Financial Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-[#D6D2C4] shadow-2xs">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">প্রকল্প বাজেট</p>
                  <p className="text-sm sm:text-base font-mono font-bold text-[#121813] mt-1">
                    {activeProject.budget ? `৳ ${Number(activeProject.budget).toLocaleString()}` : (activeProject.budgetRange || "কোটেশন")}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#D6D2C4] shadow-2xs">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">মোট ব্যয়</p>
                  <p className="text-sm sm:text-base font-mono font-bold text-[#2B4D33] mt-1">
                    {activeProject.totalExpense ? `৳ ${Number(activeProject.totalExpense).toLocaleString()}` : "—"}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#D6D2C4] shadow-2xs">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">সময়সীমা</p>
                  <p className="text-sm sm:text-base font-mono font-bold text-[#121813] mt-1">
                    {activeProject.duration || "৪ সপ্তাহ"}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-[#D6D2C4] shadow-2xs">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">ওয়ারেন্টি</p>
                  <p className="text-sm sm:text-base font-mono font-bold text-[#121813] mt-1">
                    {activeProject.warrantyMonths || 12} মাস
                  </p>
                </div>
              </div>

              {/* Client & Coordinates Info Box */}
              <div className="bg-[#F7F6F2] p-4 rounded-2xl border border-[#D6D2C4] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">ক্লায়েন্ট ও পরিচিতি</p>
                  <p className="text-sm font-bold text-[#121813] mt-0.5">{activeProject.clientName || activeProject.client || "ব্যক্তিগত ক্লায়েন্ট"}</p>
                  <p className="text-xs text-[#75787B]">📍 {activeProject.location || "ঢাকা, বাংলাদেশ"}</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] font-bold">স্লাগ লিংক</p>
                  <code className="text-xs font-mono text-[#2B4D33] bg-white px-2 py-1 rounded-md border border-[#D6D2C4]">
                    /projects/{activeProject.slug}
                  </code>
                </div>
              </div>

              {/* Architectural Narrative Case Study */}
              <div className="space-y-4">
                {activeProject.description && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2B4D33]">
                      📌 প্রকল্পের পরিচিতি ও উদ্দেশ্য (Project Overview)
                    </h5>
                    <p className="text-xs text-[#323232] leading-relaxed bg-[#F7F6F2] p-3.5 rounded-xl border border-[#D6D2C4]">
                      {activeProject.description}
                    </p>
                  </div>
                )}

                {(activeProject.challenges || (activeProject.materialsUsed as any)?.challenges) && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-amber-800">
                      ⚠️ সাইটের চ্যালেঞ্জ ও সীমাবদ্ধতা (Site Challenges)
                    </h5>
                    <p className="text-xs text-[#323232] leading-relaxed bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                      {activeProject.challenges || (activeProject.materialsUsed as any)?.challenges}
                    </p>
                  </div>
                )}

                {(activeProject.solution || (activeProject.materialsUsed as any)?.solution) && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2B4D33]">
                      🌱 বায়োফিলিক ও আর্কিটেকচারাল সমাধান (Studio Solution)
                    </h5>
                    <p className="text-xs text-[#323232] leading-relaxed bg-[#E8F5E9]/60 p-3.5 rounded-xl border border-emerald-200">
                      {activeProject.solution || (activeProject.materialsUsed as any)?.solution}
                    </p>
                  </div>
                )}
              </div>

              {/* Client Testimonial Showcase */}
              {(activeProject.clientTestimonial?.text || (activeProject.materialsUsed as any)?.testimonial?.text) && (
                <div className="p-4 rounded-2xl bg-white border border-[#D6D2C4] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-500 text-sm">★★★★★</span>
                    <span className="text-[10px] font-mono text-[#75787B] uppercase">Verified Client Review</span>
                  </div>
                  <p className="text-xs italic text-[#121813] font-serif leading-relaxed">
                    &ldquo;{activeProject.clientTestimonial?.text || (activeProject.materialsUsed as any)?.testimonial?.text}&rdquo;
                  </p>
                  <p className="text-xs font-bold text-[#2B4D33] text-right">
                    — {activeProject.clientTestimonial?.name || (activeProject.materialsUsed as any)?.testimonial?.name || activeProject.clientName || "Client"}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 border-t border-[#E4E2D7] bg-[#F7F6F2] flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => handleOpenDeleteModal(activeProject)}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-mono font-bold border border-rose-200 transition-colors cursor-pointer"
              >
                🗑️ প্রজেক্ট ডিলিট করুন
              </button>

              <div className="flex items-center gap-2">
                <Link
                  href={`/projects`}
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-white border border-[#D6D2C4] text-[#121813] text-xs font-mono font-semibold hover:bg-stone-50 transition-colors"
                >
                  🌐 পাবলিক পোর্টফোলিও দেখুন ➔
                </Link>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2 rounded-xl bg-[#2B4D33] text-white text-xs font-mono font-bold hover:bg-[#1E3724] transition-colors cursor-pointer"
                >
                  বন্ধ করুন (Close)
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL 4: DELETE CONFIRMATION MODAL                                    */}
      {/* ========================================================================= */}
      {modalMode === "delete" && activeProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-3xl border border-[#D6D2C4] shadow-2xl w-full max-w-md p-6 space-y-5 animate-scale-up text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              ⚠️
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#121813]">প্রজেক্টটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-[#75787B] mt-1.5 leading-relaxed">
                আপনি কি নিশ্চিত যে <span className="font-bold text-[#121813]">&ldquo;{activeProject.name}&rdquo;</span> প্রজেক্টটি স্থায়ীভাবে মুছে ফেলতে চান? এই অ্যাকশনটি পূর্বাবস্থায় ফিরিয়ে নেওয়া সম্ভব হবে না।
              </p>
            </div>

            {/* Quick Preview Badge */}
            <div className="p-3 bg-stone-50 rounded-xl border border-[#E4E2D7] flex items-center gap-3 text-left">
              <img
                src={activeProject.afterImage || activeProject.imageUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=150&auto=format&fit=crop"}
                alt=""
                className="w-12 h-10 object-cover rounded-lg border border-[#D6D2C4]"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#121813] truncate">{activeProject.name}</p>
                <p className="text-[10px] font-mono text-[#75787B]">{activeProject.category} • {activeProject.location || "Dhaka"}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] text-xs font-mono font-semibold transition-all cursor-pointer"
              >
                বাতিল (Cancel)
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? "মুছে ফেলা হচ্ছে..." : "হ্যাঁ, মুছে ফেলুন (Delete)"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
