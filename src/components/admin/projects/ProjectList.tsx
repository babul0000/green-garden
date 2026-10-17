"use client";

import React, { useState, useMemo } from "react";
import { IProject } from "@/types";

interface ProjectListProps {
  projects: IProject[];
  onOpenCreate: () => void;
  onOpenView: (p: IProject) => void;
  onOpenEdit: (p: IProject) => void;
  onOpenDelete: (p: IProject) => void;
  getStatusBadge: (status: string) => { label: string; color: string };
  categories: string[];
  statusOptions: Array<{ value: string; label: string; color: string }>;
  toastMessage?: string | null;
  onClearToast?: () => void;
}

export default function ProjectList({
  projects,
  onOpenCreate,
  onOpenView,
  onOpenEdit,
  onOpenDelete,
  getStatusBadge,
  categories,
  statusOptions,
  toastMessage,
  onClearToast,
}: ProjectListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewLayout, setViewLayout] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Stats calculation
  const stats = useMemo(() => {
    return {
      total: projects.length,
      running: projects.filter((p) => p.status === "RUNNING").length,
      completed: projects.filter((p) => p.status === "COMPLETED").length,
      featured: projects.filter((p) => p.featured).length,
    };
  }, [projects]);

  // Filtering
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        searchQuery.trim() === "" ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.titleBn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
      const matchStatus = statusFilter === "all" || p.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [projects, searchQuery, categoryFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / pageSize) || 1;
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProjects.slice(start, start + pageSize);
  }, [filteredProjects, currentPage, pageSize]);

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
            onClick={onOpenCreate}
            className="min-h-[44px] bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold tracking-wider py-2.5 px-5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <span className="text-sm">+</span>
            <span>নতুন প্রজেক্ট যোগ করুন</span>
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
          {onClearToast && (
            <button onClick={onClearToast} className="text-[#75787B] hover:text-[#121813] font-bold cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center">
              ✕
            </button>
          )}
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="প্রজেক্টের নাম, বাংলা নাম, ক্লায়েন্ট বা এলাকা খুঁজুন..."
            className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl pl-9 pr-4 py-2 text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33]"
          />
          <span className="absolute left-3 top-2.5 text-xs text-[#75787B]">🔍</span>
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3 py-2 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] cursor-pointer font-sans min-h-[44px]"
          >
            <option value="all">সব ক্যাটাগরি (All Categories)</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl px-3 py-2 text-xs text-[#121813] focus:outline-none focus:border-[#2B4D33] cursor-pointer font-sans min-h-[44px]"
          >
            <option value="all">সব স্ট্যাটাস (All Status)</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => setViewLayout("grid")}
              className={`p-2 rounded-lg text-xs transition-colors cursor-pointer min-h-[40px] ${
                viewLayout === "grid" ? "bg-white text-[#2B4D33] shadow-xs font-bold" : "text-[#75787B] hover:text-[#121813]"
              }`}
              title="Grid View"
            >
              ⊞ গ্রিড
            </button>
            <button
              type="button"
              onClick={() => setViewLayout("table")}
              className={`p-2 rounded-lg text-xs transition-colors cursor-pointer min-h-[40px] ${
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
            onClick={onOpenCreate}
            className="min-h-[44px] mt-2 bg-[#2B4D33] hover:bg-[#1E3724] text-white text-xs font-mono font-bold py-2 px-5 rounded-xl cursor-pointer"
          >
            + নতুন প্রজেক্ট যোগ করুন
          </button>
        </div>
      ) : viewLayout === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {paginatedProjects.map((p) => {
            const statusBadge = getStatusBadge(p.status);
            const coverImage = p.afterImage || p.imageUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop";
            const progressVal = typeof p.progress === "number" ? p.progress : 50;

            return (
              <div
                key={p.id || (p as any)._id}
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
                    {p.titleBn && (
                      <p className="text-xs text-[#2B4D33] font-medium line-clamp-1 mt-0.5">
                        {p.titleBn}
                      </p>
                    )}

                    <p className="text-[11px] text-[#75787B] font-light mt-1 flex items-center gap-1.5">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-[#E4E2D7] text-[11px]">
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
                      onClick={() => onOpenView(p)}
                      className="min-h-[44px] py-1.5 px-2 bg-[#F7F6F2] hover:bg-[#E4E2D7] text-[#121813] text-[11px] font-mono font-semibold rounded-xl border border-[#D6D2C4] flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                      title="View Details Modal"
                    >
                      <span>👁️</span>
                      <span>দেখুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenEdit(p)}
                      className="min-h-[44px] py-1.5 px-2 bg-white hover:bg-stone-50 text-[#2B4D33] text-[11px] font-mono font-bold rounded-xl border border-[#2B4D33]/30 flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                      title="Edit Project Modal"
                    >
                      <span>✏️</span>
                      <span>এডিট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenDelete(p)}
                      className="min-h-[44px] py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-mono font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
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
                {paginatedProjects.map((p) => {
                  const statusBadge = getStatusBadge(p.status);
                  const coverImage = p.afterImage || p.imageUrl || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=200&auto=format&fit=crop";
                  const progressVal = typeof p.progress === "number" ? p.progress : 50;

                  return (
                    <tr key={p.id || (p as any)._id} className="hover:bg-[#F7F6F2]/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={coverImage}
                            alt=""
                            className="w-12 h-10 object-cover rounded-lg border border-[#D6D2C4] shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[#121813] hover:text-[#2B4D33] cursor-pointer" onClick={() => onOpenView(p)}>
                              {p.name}
                            </p>
                            {p.titleBn && (
                              <p className="text-[11px] text-[#2B4D33] font-medium">{p.titleBn}</p>
                            )}
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
                            onClick={() => onOpenView(p)}
                            className="min-h-[44px] min-w-[44px] p-2 bg-[#F7F6F2] hover:bg-[#E4E2D7] text-[#121813] rounded-lg border border-[#D6D2C4] cursor-pointer flex items-center justify-center"
                            title="View Details Modal"
                          >
                            👁️
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenEdit(p)}
                            className="min-h-[44px] min-w-[44px] p-2 bg-white hover:bg-stone-50 text-[#2B4D33] rounded-lg border border-[#2B4D33]/30 cursor-pointer flex items-center justify-center"
                            title="Edit Project Modal"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDelete(p)}
                            className="min-h-[44px] min-w-[44px] p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg border border-rose-200 cursor-pointer flex items-center justify-center"
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-[#D6D2C4] shadow-2xs text-xs font-mono">
          <span className="text-[#75787B]">
            মোট {filteredProjects.length} টি প্রজেক্টের মধ্যে পৃষ্ঠা {currentPage} / {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl border border-[#D6D2C4] bg-[#F7F6F2] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E4E2D7] transition-colors cursor-pointer font-bold"
            >
              ← আগের পৃষ্ঠা
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="min-h-[44px] px-3.5 py-1.5 rounded-xl border border-[#D6D2C4] bg-[#F7F6F2] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#E4E2D7] transition-colors cursor-pointer font-bold"
            >
              পরের পৃষ্ঠা →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
