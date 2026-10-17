"use client";

import React, { useState } from "react";
import { Employee, ProjectAssignment, ProjectOption } from "./types";

interface EmployeeAssignmentsProps {
  employees: Employee[];
  assignments: ProjectAssignment[];
  projectsList: ProjectOption[];
  onRefresh: () => void;
}

export default function EmployeeAssignments({
  employees,
  assignments,
  projectsList,
  onRefresh,
}: EmployeeAssignmentsProps) {
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignEmpId, setAssignEmpId] = useState("");
  const [assignProjectId, setAssignProjectId] = useState("");
  const [assignDate, setAssignDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [assignRole, setAssignRole] = useState("Team Lead & Site Architect");
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Check for Conflict (Employee already assigned to a project on the same date)
  const checkForConflict = (empId: string, dateStr: string) => {
    if (!empId || !dateStr) return null;
    const dateFormatted = new Date(dateStr).toISOString().split("T")[0];
    const conflict = assignments.find((a) => {
      const aDate = new Date(a.assignedDate).toISOString().split("T")[0];
      return a.employeeId === empId && aDate === dateFormatted;
    });

    if (conflict) {
      return `⚠️ সতর্কতা: এই কর্মী ইতিমধ্যে "${conflict.project?.name || "অন্য প্রজেক্ট"}" এ এই তারিখে (${new Date(dateStr).toLocaleDateString("bn-BD")}) নিয়োজিত আছেন!`;
    }
    return null;
  };

  const handleEmpChange = (empId: string) => {
    setAssignEmpId(empId);
    setConflictWarning(checkForConflict(empId, assignDate));
  };

  const handleDateChange = (dateStr: string) => {
    setAssignDate(dateStr);
    setConflictWarning(checkForConflict(assignEmpId, dateStr));
  };

  const handleConfirmAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignEmpId || !assignProjectId) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: assignEmpId,
          projectId: assignProjectId,
          assignedDate: assignDate,
          roleOnTask: assignRole,
          status: "ASSIGNED",
        }),
      });

      if (res.ok) {
        onRefresh();
        setIsAssigning(false);
        setAssignEmpId("");
        setConflictWarning(null);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to assign project task");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18221A]/85 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-md">
        <div>
          <h3 className="font-bold text-white text-sm font-serif">প্রজেক্ট ও ফিল্ড অ্যাসাইনমেন্ট বোর্ড</h3>
          <p className="text-xs text-stone-400">
            সাইট আর্কিটেকচার, ড্রিপ ইরিগেশন ও ল্যান্ডস্কেপ প্রজেক্টে কর্মীদের রিয়েল-টাইম দায়িত্ব বণ্টন।
          </p>
        </div>
        <button
          onClick={() => setIsAssigning(!isAssigning)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-all cursor-pointer shadow-md"
        >
          {isAssigning ? "✕ বন্ধ করুন" : "+ নতুন প্রজেক্ট অ্যাসাইনমেন্ট"}
        </button>
      </div>

      {/* New Assignment Form Modal */}
      {isAssigning && (
        <form
          onSubmit={handleConfirmAssignment}
          className="bg-[#18221A] p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 animate-fade-in-up"
        >
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h4 className="font-bold text-emerald-400 text-sm">নতুন প্রজেক্টে কর্মী নিয়োগ</h4>
            <span className="text-[10px] text-stone-400 font-mono">Real-time Conflict Checking</span>
          </div>

          {conflictWarning && (
            <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 p-3 rounded-2xl text-xs font-semibold animate-pulse">
              {conflictWarning}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">কর্মী নির্বাচন করুন *</label>
              <select
                required
                value={assignEmpId}
                onChange={(e) => handleEmpChange(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-stone-200 font-semibold focus:outline-none focus:border-emerald-400"
              >
                <option value="" className="bg-[#18221A] text-white">-- কর্মী বেছে নিন --</option>
                {employees.map((e) => (
                  <option key={e.id} value={e.id} className="bg-[#18221A] text-white">
                    {e.name} ({e.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">প্রজেক্ট নির্বাচন করুন *</label>
              <select
                required
                value={assignProjectId}
                onChange={(e) => setAssignProjectId(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-stone-200 font-semibold focus:outline-none focus:border-emerald-400"
              >
                <option value="" className="bg-[#18221A] text-white">-- প্রজেক্ট বেছে নিন --</option>
                {projectsList.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#18221A] text-white">
                    {p.name} ({p.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">কাজের তারিখ *</label>
              <input
                type="date"
                required
                value={assignDate}
                onChange={(e) => handleDateChange(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-300 font-mono block mb-1">দায়িত্ব / পদবী</label>
              <input
                type="text"
                value={assignRole}
                onChange={(e) => setAssignRole(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setIsAssigning(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl text-xs font-semibold"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
            >
              {submitting ? "নিয়োগ হচ্ছে..." : "✓ কনফার্ম অ্যাসাইনমেন্ট"}
            </button>
          </div>
        </form>
      )}

      {/* Current Assignments Table */}
      <div className="bg-[#18221A]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg">
        <div className="p-4 bg-white/[0.02] border-b border-white/10 flex justify-between items-center">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
            সক্রিয় অ্যাসাইনমেন্ট লগ
          </span>
          <span className="text-xs text-stone-400">মোট কার্যকর কাজ: {assignments.length}টি</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-stone-400 font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4">Employee (কর্মী)</th>
                <th className="py-3 px-4">কাজ / প্রজেক্ট</th>
                <th className="py-3 px-4">Location (এলাকা)</th>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">দায়িত্ব</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 italic">
                    কোনো প্রজেক্ট অ্যাসাইনমেন্ট পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                assignments.map((asgn) => (
                  <tr key={asgn.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      {asgn.employee?.name || "কর্মীর নাম"}
                      <span className="block text-[10px] text-stone-400 font-normal">
                        {asgn.employee?.designation || "স্পেশালিস্ট"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-300">
                      {asgn.project?.name || "প্রজেক্টের নাম"}
                    </td>
                    <td className="py-3.5 px-4 text-stone-300 font-medium">
                      📍 {asgn.project?.location || "Dhaka"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-300">
                      📅 {new Date(asgn.assignedDate).toLocaleDateString("bn-BD")}
                    </td>
                    <td className="py-3.5 px-4 text-stone-400">
                      {asgn.roleOnTask}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {asgn.status || "ASSIGNED"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
