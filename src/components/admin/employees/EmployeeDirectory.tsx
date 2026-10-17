"use client";

import React, { useState } from "react";
import { Employee } from "./types";
import { formatTaka } from "@/lib/formatters";

interface EmployeeDirectoryProps {
  employees: Employee[];
  loading: boolean;
  onRefresh: () => void;
}

export default function EmployeeDirectory({ employees, loading, onRefresh }: EmployeeDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [isAddingEmp, setIsAddingEmp] = useState(false);

  // New Employee Form
  const [empId, setEmpId] = useState(`EMP-${Math.floor(100 + Math.random() * 900)}`);
  const [empName, setEmpName] = useState("");
  const [empDesignation, setEmpDesignation] = useState("Senior Landscape Architect");
  const [empDept, setEmpDept] = useState("Landscape Design");
  const [empJoiningDate, setEmpJoiningDate] = useState("2024-01-15");
  const [empSalary, setEmpSalary] = useState("45000");
  const [empPhone, setEmpPhone] = useState("");
  const [empAddress, setEmpAddress] = useState("Dhaka");
  const [empSkills, setEmpSkills] = useState("Rooftop Gardening, 3D Modeling, Tree Surgery");
  const [submitting, setSubmitting] = useState(false);

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

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: empId,
          name: empName,
          designation: empDesignation,
          department: empDept,
          joiningDate: empJoiningDate,
          salary: parseFloat(empSalary) || 0,
          personalPhone: empPhone || null,
          personalAddress: empAddress || null,
          skills: empSkills.split(",").map((s) => s.trim()).filter(Boolean),
          status: "ACTIVE",
        }),
      });

      if (res.ok) {
        onRefresh();
        setIsAddingEmp(false);
        setEmpName("");
        setEmpPhone("");
        setEmpId(`EMP-${Math.floor(100 + Math.random() * 900)}`);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create employee");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const departments = Array.from(new Set(employees.map((e) => e.department).filter(Boolean)));

  const filteredEmployees = employees.filter((emp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      emp.name.toLowerCase().includes(q) ||
      emp.employeeId.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q);

    const matchesDept = deptFilter === "ALL" || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#18221A]/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2 flex-grow">
          <input
            type="text"
            placeholder="কর্মী খুঁজুন (নাম, আইডি, পদবী)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 flex-grow sm:max-w-xs"
          />

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-stone-200 font-semibold focus:outline-none focus:border-emerald-400"
          >
            <option value="ALL" className="bg-[#18221A]">সব ডিপার্টমেন্ট ({employees.length})</option>
            {departments.map((d) => (
              <option key={d} value={d} className="bg-[#18221A]">{d}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddingEmp(!isAddingEmp)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          {isAddingEmp ? "✕ ফর্ম বন্ধ করুন" : "+ নতুন স্টাফ যোগ করুন"}
        </button>
      </div>

      {/* Add Employee Form Modal */}
      {isAddingEmp && (
        <form
          onSubmit={handleCreateEmployee}
          className="bg-[#18221A] p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 animate-fade-in-up"
        >
          <h4 className="font-bold text-emerald-400 text-sm border-b border-white/10 pb-2">নতুন কর্মী তথ্য নিবন্ধন</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">Employee ID *</label>
              <input
                type="text"
                required
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">কর্মীর পুরো নাম *</label>
              <input
                type="text"
                required
                placeholder="e.g. মোঃ তানভীর আহমেদ"
                value={empName}
                onChange={(e) => setEmpName(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">পদবী (Designation) *</label>
              <input
                type="text"
                required
                value={empDesignation}
                onChange={(e) => setEmpDesignation(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">বিভাগ (Department) *</label>
              <select
                value={empDept}
                onChange={(e) => setEmpDept(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-400"
              >
                <option value="Landscape Design" className="bg-[#18221A]">Landscape Design</option>
                <option value="Site Execution" className="bg-[#18221A]">Site Execution</option>
                <option value="Horticulture & Plant Care" className="bg-[#18221A]">Horticulture & Plant Care</option>
                <option value="Garden Maintenance" className="bg-[#18221A]">Garden Maintenance</option>
                <option value="Accounts & Admin" className="bg-[#18221A]">Accounts & Admin</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">যোগদানের তারিখ</label>
              <input
                type="date"
                value={empJoiningDate}
                onChange={(e) => setEmpJoiningDate(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">মাসিক বেতন (টাকা)</label>
              <input
                type="number"
                value={empSalary}
                onChange={(e) => setEmpSalary(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">মোবাইল নম্বর</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={empPhone}
                onChange={(e) => setEmpPhone(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-300 font-mono block mb-1">দক্ষতা ও স্কিলস (কমা দিয়ে লিখুন)</label>
              <input
                type="text"
                value={empSkills}
                onChange={(e) => setEmpSkills(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAddingEmp(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl text-xs font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
            >
              {submitting ? "সংরক্ষণ হচ্ছে..." : "✓ কর্মী সংরক্ষণ করুন"}
            </button>
          </div>
        </form>
      )}

      {/* Employee Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-stone-400 text-xs">
          <span className="w-6 h-6 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin inline-block mb-2"></span>
          <p>কর্মী তালিকা লোড হচ্ছে...</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="p-12 text-center text-stone-400 text-xs italic bg-[#18221A]/50 rounded-3xl border border-white/10">
          কোনো কর্মী পাওয়া যায়নি।
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all flex flex-col justify-between space-y-4 shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-base shadow-inner shrink-0">
                      {emp.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm font-serif leading-tight">{emp.name}</h4>
                      <span className="text-[11px] text-emerald-400 font-semibold block">{emp.designation}</span>
                      <span className="text-[10px] font-mono text-stone-400 block mt-0.5">{emp.employeeId}</span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      emp.status === "ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-stone-500/15 text-stone-400 border-stone-500/30"
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>

                <div className="bg-black/35 rounded-2xl p-3 border border-white/5 space-y-1.5 text-xs mt-3">
                  <div className="flex justify-between">
                    <span className="text-stone-400 text-[11px]">ডিপার্টমেন্ট:</span>
                    <span className="font-semibold text-stone-200">{emp.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 text-[11px]">অভিজ্ঞতা:</span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      {calculateExperienceLive(emp.joiningDate)}
                    </span>
                  </div>
                  {emp.salary !== undefined && emp.salary !== null && (
                    <div className="flex justify-between">
                      <span className="text-stone-400 text-[11px]">মাসিক বেতন:</span>
                      <span className="font-mono text-white font-bold">{formatTaka(emp.salary)}</span>
                    </div>
                  )}
                </div>

                {emp.skills && emp.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {emp.skills.map((s, idx) => (
                      <span key={idx} className="bg-white/5 border border-white/10 text-stone-300 text-[9px] px-2 py-0.5 rounded-md font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {emp.personalPhone && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="font-mono text-stone-400 text-[11px]">{emp.personalPhone}</span>
                  <div className="flex gap-1.5">
                    <a
                      href={`tel:${emp.personalPhone}`}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-emerald-400 rounded-lg text-[10px] font-semibold border border-white/10"
                    >
                      📞 কল
                    </a>
                    <a
                      href={`https://wa.me/${emp.personalPhone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] rounded-lg text-[10px] font-semibold border border-[#25D366]/20"
                    >
                      💬 চ্যাট
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
