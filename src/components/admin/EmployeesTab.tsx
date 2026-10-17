"use client";

import React, { useState, useEffect } from "react";
import EmployeeDirectory from "./employees/EmployeeDirectory";
import EmployeeAssignments from "./employees/EmployeeAssignments";
import EmployeeAttendance from "./employees/EmployeeAttendance";
import { Employee, ProjectAssignment, ProjectOption } from "./employees/types";

export default function EmployeesTab() {
  const [subTab, setSubTab] = useState<"directory" | "assignments" | "attendance">("directory");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [projectsList, setProjectsList] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployeesData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Employees
      const res = await fetch("/api/employees");
      if (res.ok) {
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : data.data || []);
      }

      // 2. Fetch Assignments
      const assignRes = await fetch("/api/assignments");
      if (assignRes.ok) {
        const aData = await assignRes.json();
        setAssignments(Array.isArray(aData) ? aData : aData.data || []);
      }

      // 3. Fetch Projects for assignment dropdown
      const projRes = await fetch("/api/projects");
      if (projRes.ok) {
        const pData = await projRes.json();
        const list = Array.isArray(pData) ? pData : pData.projects || [];
        setProjectsList(
          list.map((p: any) => ({
            id: p.id || p._id,
            name: p.name,
            location: p.location || "Dhaka",
          }))
        );
      }
    } catch (err) {
      console.error("Error loading employees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans text-[#E4E2D7]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <span>👥</span> টিম ও এইচআর ম্যানেজমেন্ট • Human Resources
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Employee Directory, Project Assignments & Attendance Sheet
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            কর্মী প্রোফাইল, দায়িত্ব বণ্টন, কনফ্লিক্ট চেকিং ও ডিজিটাল মাসিক উপস্থিতি ট্র্যাকার।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab("directory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "directory"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            📋 কর্মী ডিরেক্টরি ({employees.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("assignments")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "assignments"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            🎯 প্রজেক্ট অ্যাসাইনমেন্ট ({assignments.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("attendance")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "attendance"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            ⏱️ মাসিক হাজিরা শিট
          </button>
        </div>
      </div>

      {/* Subtab 1: Directory */}
      {subTab === "directory" && (
        <EmployeeDirectory
          employees={employees}
          loading={loading}
          onRefresh={fetchEmployeesData}
        />
      )}

      {/* Subtab 2: Project Assignments */}
      {subTab === "assignments" && (
        <EmployeeAssignments
          employees={employees}
          assignments={assignments}
          projectsList={projectsList}
          onRefresh={fetchEmployeesData}
        />
      )}

      {/* Subtab 3: Attendance Sheet */}
      {subTab === "attendance" && (
        <EmployeeAttendance employees={employees} />
      )}
    </div>
  );
}
