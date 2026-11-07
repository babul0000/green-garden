"use client";

import React, { useState } from "react";
import { Employee } from "./types";
import { formatTaka } from "@/lib/formatters";
import { toast, ToastContainer } from "@/components/shared/Toast";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";

interface EmployeeDirectoryProps {
  employees: Employee[];
  loading: boolean;
  onRefresh: () => void;
}

const DEPARTMENTS = [
  "Landscape Design",
  "Tree Doctor & Plant Health",
  "Site Execution & Engineering",
  "Horticulture & Plant Care",
  "Garden Maintenance",
  "Accounts & Studio ERP",
  "General Administration",
];

const ROLES = [
  { key: "EMPLOYEE", label: "🌱 Employee (সাধারণ কর্মী)", desc: "অপারেশনাল বুকিং ও টাস্ক অ্যাক্সেস" },
  { key: "MODERATOR", label: "🛡️ Moderator (মডারেটর)", desc: "রিভিউ অনুমোদন ও গ্রাহক বার্তা পর্যবেক্ষণ" },
  { key: "EDITOR", label: "✏️ Editor (কনটেন্ট এডিটর)", desc: "পোর্টফোলিও, প্রজেক্ট, গ্যালারি ও ওয়েবসাইট" },
  { key: "ADMIN", label: "👑 Admin (সুপার অ্যাডমিন)", desc: "ফাইন্যান্স, সিকিউরিটি ও ফুল মাস্টার কন্ট্রোল" },
];

export default function EmployeeDirectory({ employees, loading, onRefresh }: EmployeeDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [empId, setEmpId] = useState("");
  const [empName, setEmpName] = useState("");
  const [empDesignation, setEmpDesignation] = useState("");
  const [empDept, setEmpDept] = useState("Landscape Design");
  const [empJoiningDate, setEmpJoiningDate] = useState("2024-01-15");
  const [empSalary, setEmpSalary] = useState("45000");
  const [empPhone, setEmpPhone] = useState("");
  const [empAddress, setEmpAddress] = useState("Dhaka");
  const [empSkills, setEmpSkills] = useState("Rooftop Gardening, 3D Modeling, Tree Surgery");
  const [empPhoto, setEmpPhoto] = useState("");
  const [empStatus, setEmpStatus] = useState<string>("ACTIVE");
  const [empRole, setEmpRole] = useState<string>("EMPLOYEE");
  const [empResponsibility, setEmpResponsibility] = useState("");

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("gg_auth_token");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  // Experience Calculator
  const calculateExperienceLive = (dateStr: string) => {
    if (!dateStr) return "০ বছর";
    const start = new Date(dateStr);
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    let months = now.getMonth() - start.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    return `${years > 0 ? `${years} বছর ` : ""}${months} মাস`;
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingEmployee(null);
    setEmpId(`EMP-${Math.floor(100 + Math.random() * 900)}`);
    setEmpName("");
    setEmpDesignation("Senior Landscape Architect");
    setEmpDept("Landscape Design");
    setEmpJoiningDate(new Date().toISOString().split("T")[0]);
    setEmpSalary("45000");
    setEmpPhone("");
    setEmpAddress("Dhaka");
    setEmpSkills("Landscape Planning, 3D Visualization, Site Execution");
    setEmpPhoto("");
    setEmpStatus("ACTIVE");
    setEmpRole("EMPLOYEE");
    setEmpResponsibility("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setEmpId(emp.employeeId || "");
    setEmpName(emp.name || "");
    setEmpDesignation(emp.designation || "");
    setEmpDept(emp.department || "Landscape Design");
    setEmpJoiningDate(
      emp.joiningDate ? new Date(emp.joiningDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
    );
    setEmpSalary(emp.salary ? String(emp.salary) : "0");
    setEmpPhone(emp.personalPhone || "");
    setEmpAddress(emp.personalAddress || "Dhaka");
    setEmpSkills(Array.isArray(emp.skills) ? emp.skills.join(", ") : "");
    setEmpPhoto(emp.photo || "");
    setEmpStatus(emp.status || "ACTIVE");
    setEmpRole(emp.role || emp.user?.role || "EMPLOYEE");
    setEmpResponsibility(emp.responsibility || "");
    setIsModalOpen(true);
  };

  // Handle Save (Create or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empId.trim()) {
      toast.warning("কর্মীর নাম ও আইডি প্রদান করা আবশ্যক");
      return;
    }

    setIsSaving(true);
    try {
      const parsedSkills = empSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        employeeId: empId.trim(),
        name: empName.trim(),
        designation: empDesignation.trim(),
        department: empDept,
        joiningDate: empJoiningDate,
        salary: parseFloat(empSalary) || 0,
        personalPhone: empPhone.trim() || null,
        personalAddress: empAddress.trim() || null,
        skills: parsedSkills,
        status: empStatus,
        photo: empPhoto.trim() || null,
        role: empRole,
        responsibility: empResponsibility.trim() || null,
      };

      let res: Response;
      if (editingEmployee) {
        // UPDATE via PUT
        res = await fetch("/api/employees", {
          method: "PUT",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ id: editingEmployee.id, ...payload }),
        });
      } else {
        // CREATE via POST
        res = await fetch("/api/employees", {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        toast.success(
          editingEmployee
            ? `কর্মী "${empName}"-এর তথ্য ও পারমিশন সফলভাবে হালনাগাদ হয়েছে! ✨`
            : `নতুন কর্মী "${empName}" সফলভাবে যুক্ত হয়েছে! 🌿`,
          { title: editingEmployee ? "হালনাগাদ সম্পন্ন" : "কর্মী যুক্ত হয়েছে" }
        );
        setIsModalOpen(false);
        onRefresh();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।", { title: "ব্যর্থ হয়েছে" });
      }
    } catch (err: any) {
      toast.error(err.message || "নেটওয়ার্ক সমস্যা: সার্ভারের সাথে সংযোগ করা যায়নি।", { title: "নেটওয়ার্ক এরর" });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingEmployee) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/employees?id=${deletingEmployee.id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (res.ok) {
        toast.info(`কর্মী "${deletingEmployee.name}" (ID: ${deletingEmployee.employeeId}) সফলভাবে মুছে ফেলা হয়েছে।`, {
          title: "মুছে ফেলা হয়েছে",
        });
        setDeletingEmployee(null);
        onRefresh();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "কর্মী মুছে ফেলতে ব্যর্থ হয়েছে।", { title: "ডিলিট ব্যর্থ" });
      }
    } catch (err: any) {
      toast.error(err.message || "নেটওয়ার্ক সমস্যা", { title: "এরর" });
    } finally {
      setIsDeleting(false);
    }
  };

  // Department and Status Filters
  const allDepts = Array.from(new Set([...DEPARTMENTS, ...employees.map((e) => e.department).filter(Boolean)]));

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      (emp.personalPhone && emp.personalPhone.includes(q));

    const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;
    const matchesStatus = statusFilter === "ALL" || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      <ToastContainer position="top-right" />

      {/* ── ACTION TOOLBAR & FILTERS ── */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#18221A]/85 backdrop-blur-xl p-4 rounded-3xl border border-white/10 shadow-lg">
        <div className="flex flex-wrap items-center gap-2.5 flex-grow">
          {/* Search box */}
          <div className="relative flex-grow sm:max-w-xs">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-xs">🔍</span>
            <input
              type="text"
              placeholder="কর্মী খুঁজুন (নাম, আইডি, পদবী, ফোন)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/15 rounded-2xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30 transition-all"
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-black/50 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-stone-200 font-medium focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="ALL" className="bg-[#18221A]">সব ডিপার্টমেন্ট ({employees.length})</option>
            {allDepts.map((d) => (
              <option key={d} value={d} className="bg-[#18221A]">{d}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/50 border border-white/15 rounded-2xl px-3.5 py-2.5 text-xs text-stone-200 font-medium focus:outline-none focus:border-emerald-400 cursor-pointer"
          >
            <option value="ALL" className="bg-[#18221A]">সব স্ট্যাটাস</option>
            <option value="ACTIVE" className="bg-[#18221A]">🟢 সক্রিয় (Active)</option>
            <option value="ON_LEAVE" className="bg-[#18221A]">🟡 ছুটিতে (On Leave)</option>
            <option value="INACTIVE" className="bg-[#18221A]">⚪ নিষ্ক্রিয় (Inactive)</option>
          </select>
        </div>

        {/* Add Employee Button */}
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-2xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-emerald-500/20 active:scale-95 shrink-0 min-h-[42px]"
        >
          <span>➕</span>
          <span>নতুন স্টাফ যোগ করুন</span>
        </button>
      </div>

      {/* ── EMPLOYEE CARDS GRID ── */}
      {loading ? (
        <div className="p-16 text-center text-stone-400 text-xs bg-[#18221A]/50 rounded-3xl border border-white/10">
          <span className="w-7 h-7 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin inline-block mb-3"></span>
          <p className="font-medium tracking-wide">কর্মী তালিকা ডাটাবেজ থেকে লোড হচ্ছে...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="p-16 text-center text-stone-400 text-xs italic bg-[#18221A]/50 rounded-3xl border border-white/10">
          কোনো কর্মী পাওয়া যায়নি। অনুসন্ধান ফিল্টার পরিবর্তন করুন অথবা নতুন কর্মী যোগ করুন।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => {
            const roleKey = (emp.role || emp.user?.role || "EMPLOYEE").toUpperCase();
            const roleObj = ROLES.find((r) => r.key === roleKey) || ROLES[0];

            return (
              <div
                key={emp.id}
                className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl group relative overflow-hidden"
              >
                {/* Top Header & Badges */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Photo or Initial */}
                      <div className="w-13 h-13 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-lg shadow-inner shrink-0 overflow-hidden relative">
                        {emp.photo && emp.photo.trim().length > 3 ? (
                          <img
                            src={emp.photo}
                            alt={emp.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <span>{emp.name ? emp.name[0].toUpperCase() : "👤"}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-base font-serif leading-tight truncate">
                          {emp.name}
                        </h4>
                        <span className="text-xs text-emerald-400 font-semibold block truncate mt-0.5">
                          {emp.designation}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 block mt-0.5">
                          {emp.employeeId}
                        </span>
                      </div>
                    </div>

                    {/* Status & Role Badges */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          emp.status === "ACTIVE"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : emp.status === "ON_LEAVE"
                            ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                            : "bg-stone-500/15 text-stone-400 border-stone-500/30"
                        }`}
                      >
                        {emp.status === "ACTIVE" ? "🟢 ACTIVE" : emp.status === "ON_LEAVE" ? "🟡 ON LEAVE" : "⚪ INACTIVE"}
                      </span>

                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-stone-300">
                        {roleKey === "ADMIN" ? "👑 ADMIN" : roleKey === "MODERATOR" ? "🛡️ MOD" : roleKey === "EDITOR" ? "✏️ EDITOR" : "🌱 STAFF"}
                      </span>
                    </div>
                  </div>

                  {/* Info Card */}
                  <div className="bg-black/35 rounded-2xl p-3.5 border border-white/5 space-y-2 text-xs mt-3.5">
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 text-[11px]">ডিপার্টমেন্ট:</span>
                      <span className="font-semibold text-stone-200 text-right truncate max-w-[65%]">{emp.department}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-stone-400 text-[11px]">অভিজ্ঞতা:</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {calculateExperienceLive(emp.joiningDate)}
                      </span>
                    </div>
                    {emp.salary !== undefined && emp.salary !== null && (
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 text-[11px]">মাসিক বেতন:</span>
                        <span className="font-mono text-white font-bold">{formatTaka(emp.salary)}</span>
                      </div>
                    )}
                    {emp.user?.email && (
                      <div className="flex justify-between items-center">
                        <span className="text-stone-400 text-[11px]">ইমেইল:</span>
                        <span className="font-mono text-stone-300 text-[10px] truncate max-w-[65%]">{emp.user.email}</span>
                      </div>
                    )}
                  </div>

                  {/* Skills tags */}
                  {emp.skills && emp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {emp.skills.slice(0, 4).map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-white/5 border border-white/10 text-stone-300 text-[9px] px-2 py-0.5 rounded-md font-mono"
                        >
                          {s}
                        </span>
                      ))}
                      {emp.skills.length > 4 && (
                        <span className="text-stone-400 text-[9px] px-1 py-0.5 font-mono">
                          +{emp.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Contact + EDIT + DELETE */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  {/* Phone & Direct Call/WhatsApp */}
                  {emp.personalPhone && (
                    <div className="flex items-center justify-between text-xs pb-1">
                      <span className="font-mono text-stone-400 text-[11px]">{emp.personalPhone}</span>
                      <div className="flex gap-1.5">
                        <a
                          href={`tel:${emp.personalPhone}`}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-emerald-400 rounded-lg text-[10px] font-semibold border border-white/10 transition-colors"
                        >
                          📞 কল
                        </a>
                        <a
                          href={`https://wa.me/${emp.personalPhone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-lg text-[10px] font-semibold border border-[#25D366]/20 transition-colors"
                        >
                          💬 WhatsApp
                        </a>
                      </div>
                    </div>
                  )}

                  {/* ✏️ EDIT & 🗑️ DELETE Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(emp)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer hover:border-emerald-500/60"
                    >
                      <span>✏️</span>
                      <span>এডিট ও পারমিশন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeletingEmployee(emp)}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer hover:border-rose-500/60"
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
          POPUP MODAL: CREATE & EDIT EMPLOYEE + PERMISSIONS
      ══════════════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0" onClick={() => !isSaving && setIsModalOpen(false)} />

          <div className="relative z-10 bg-[#162118] text-[#E4E2D7] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-white/15 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-black/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-lg font-bold">
                  {editingEmployee ? "✏️" : "✨"}
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-white font-serif leading-tight">
                    {editingEmployee ? `কর্মী সম্পাদনা ও পারমিশন: ${editingEmployee.name}` : "নতুন কর্মী নিবন্ধন"}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    ব্যক্তিগত তথ্য, পদবী, বেতন, স্ট্যাটাস ও সিস্টেম অ্যাক্সেস রোল নির্ধারণ করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form id="emp-form" onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* SECTION 1: মৌলিক তথ্য ও রোল পারমিশন */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <span>০১</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>মৌলিক তথ্য ও সিস্টেম রোল (Basic & Role Permissions)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      Employee ID <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={empId}
                      onChange={(e) => setEmpId(e.target.value)}
                      placeholder="e.g. EMP-101"
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      কর্মীর পুরো নাম <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: মোঃ তানভীর আহমেদ"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      পদবী (Designation) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Landscape Architect"
                      value={empDesignation}
                      onChange={(e) => setEmpDesignation(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/30"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      বিভাগ (Department) <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={empDept}
                      onChange={(e) => setEmpDept(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      {allDepts.map((d) => (
                        <option key={d} value={d} className="bg-[#18221A]">{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* 🛡️ SYSTEM ROLE & PERMISSION SELECTOR */}
                  <div>
                    <label className="font-semibold text-emerald-400 block mb-1">
                      🛡️ সিস্টেম রোল ও পারমিশন (Access Role)
                    </label>
                    <select
                      value={empRole}
                      onChange={(e) => setEmpRole(e.target.value)}
                      className="w-full bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-3.5 py-2.5 text-white font-semibold focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      {ROLES.map((r) => (
                        <option key={r.key} value={r.key} className="bg-[#18221A]">
                          {r.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-stone-400 mt-1">
                      {ROLES.find((r) => r.key === empRole)?.desc}
                    </p>
                  </div>

                  {/* STATUS SELECTOR */}
                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      কাজের স্ট্যাটাস (Status)
                    </label>
                    <select
                      value={empStatus}
                      onChange={(e) => setEmpStatus(e.target.value)}
                      className="w-full bg-black/50 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="ACTIVE" className="bg-[#18221A]">🟢 ACTIVE (সক্রিয়)</option>
                      <option value="ON_LEAVE" className="bg-[#18221A]">🟡 ON_LEAVE (ছুটিতে)</option>
                      <option value="INACTIVE" className="bg-[#18221A]">⚪ INACTIVE (নিষ্ক্রিয়)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 2: বেতন, তারিখ ও দায়িত্ব */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <span>০২</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>বেতন ও যোগদানের তারিখ (Salary & Experience)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      যোগদানের তারিখ (Joining Date)
                    </label>
                    <input
                      type="date"
                      value={empJoiningDate}
                      onChange={(e) => setEmpJoiningDate(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-[10px] font-mono text-emerald-400 mt-1 block">
                      বর্তমান অভিজ্ঞতা: {calculateExperienceLive(empJoiningDate)}
                    </span>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      মাসিক বেতন (টাকা)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 45000"
                      value={empSalary}
                      onChange={(e) => setEmpSalary(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-stone-300 block mb-1">
                      মূল দায়িত্ব ও দায়িত্বের সারসংক্ষেপ (Responsibilities)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ছাদবাগান ডিজাইন, সাইট ইঞ্জিনিয়ারিং তদারকি ও ওয়াটারপ্রুফিং পরীক্ষণ"
                      value={empResponsibility}
                      onChange={(e) => setEmpResponsibility(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: যোগাযোগ ও স্কিলস */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <span>০৩</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>যোগাযোগ ও প্রফেশনাল স্কিলস (Contact & Skills)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      মোবাইল নম্বর
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={empPhone}
                      onChange={(e) => setEmpPhone(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-300 block mb-1">
                      ঠিকানা (Address)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: ধানমন্ডি, ঢাকা"
                      value={empAddress}
                      onChange={(e) => setEmpAddress(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-semibold text-stone-300 block mb-1">
                      দক্ষতা ও স্কিলস (কমা দিয়ে একাধিক স্কিল লিখুন)
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: Rooftop Gardening, 3D Modeling, Tree Surgery"
                      value={empSkills}
                      onChange={(e) => setEmpSkills(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: প্রোফাইল ছবি */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  <span>০৪</span>
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>প্রোফাইল ছবি (Profile Photo)</span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-black/35 p-4 rounded-2xl border border-white/10">
                  {/* Photo Preview */}
                  <div className="w-20 h-20 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 overflow-hidden shrink-0 flex items-center justify-center font-bold text-emerald-400 text-xl relative">
                    {empPhoto && empPhoto.trim().length > 3 ? (
                      <img
                        src={empPhoto}
                        alt="Employee preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span>{empName ? empName[0].toUpperCase() : "👤"}</span>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <CloudinaryUploader
                      value={empPhoto}
                      onUpload={(url) => setEmpPhoto(url)}
                      label="📁 ডিভাইস বা ক্লাউডিনারি থেকে ছবি আপলোড"
                    />
                    <input
                      type="text"
                      placeholder="অথবা সরাসরি ছবির লিঙ্ক: https://... বা /step_sample.jpg"
                      value={empPhoto}
                      onChange={(e) => setEmpPhoto(e.target.value)}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-stone-300 hover:bg-white/10 text-xs font-semibold transition-all cursor-pointer min-h-[42px]"
              >
                বাতিল করুন
              </button>

              <button
                type="submit"
                form="emp-form"
                disabled={isSaving}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2 min-h-[42px] disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>সংরক্ষণ হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>💾</span>
                    <span>{editingEmployee ? "পরিবর্তন সংরক্ষণ করুন" : "কর্মী যুক্ত করুন"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          CONFIRM MODAL: DELETE EMPLOYEE
      ══════════════════════════════════════════════════════════════════════════ */}
      {deletingEmployee && (
        <ConfirmModal
          isOpen={true}
          isLoading={isDeleting}
          onClose={() => setDeletingEmployee(null)}
          onConfirm={handleDeleteConfirm}
          title="কর্মী মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে কর্মী "${deletingEmployee.name}" (ID: ${deletingEmployee.employeeId}) কে স্থায়ীভাবে ডিলিট করতে চান? তার সমস্ত কাজের রেকর্ড ও অ্যাসাইনমেন্ট ডাটাবেজ থেকে মুছে ফেলা হবে।`}
          itemName={`${deletingEmployee.name} (${deletingEmployee.designation})`}
          confirmLabel="হ্যাঁ, মুছে ফেলুন"
          cancelLabel="বাতিল"
          variant="danger"
        />
      )}
    </div>
  );
}
