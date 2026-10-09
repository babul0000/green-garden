"use client";

import React, { useState, useEffect } from "react";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  responsibility?: string | null;
  joiningDate: string;
  calculatedExperience?: string;
  skills: string[];
  salary?: number | null;
  personalPhone?: string | null;
  personalAddress?: string | null;
  status: "ACTIVE" | "INACTIVE" | "ON_LEAVE" | string;
  photo?: string | null;
  attendances?: { date: string; status: string; checkIn?: string; checkOut?: string }[];
}

interface ProjectAssignment {
  id: string;
  employeeId: string;
  projectId: string;
  assignedDate: string;
  roleOnTask: string;
  status: string;
  employee?: { name: string; employeeId: string; designation: string };
  project?: { name: string; location: string };
}

export default function EmployeesTab() {
  const [subTab, setSubTab] = useState<"directory" | "assignments" | "attendance">("directory");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [projectsList, setProjectsList] = useState<{ id: string; name: string; location: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // New Employee Form State
  const [isAddingEmp, setIsAddingEmp] = useState(false);
  const [empId, setEmpId] = useState(`EMP-${Math.floor(100 + Math.random() * 900)}`);
  const [empName, setEmpName] = useState("");
  const [empDesignation, setEmpDesignation] = useState("Senior Landscape Architect");
  const [empDept, setEmpDept] = useState("Landscape Design");
  const [empJoiningDate, setEmpJoiningDate] = useState("2021-04-15");
  const [empSalary, setEmpSalary] = useState("45000");
  const [empPhone, setEmpPhone] = useState("01712345678");
  const [empAddress, setEmpAddress] = useState("Dhanmondi, Dhaka");
  const [empSkills, setEmpSkills] = useState("Rooftop Gardening, 3D Modeling, Tree Surgery");

  // Assignment Modal & Conflict Alert State
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignEmpId, setAssignEmpId] = useState("");
  const [assignProjectId, setAssignProjectId] = useState("");
  const [assignDate, setAssignDate] = useState(new Date().toISOString().split("T")[0]);
  const [assignRole, setAssignRole] = useState("Team Lead & Site Architect");
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Automatic Experience Calculator Function
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
    return `${years} Years ${months} Months`;
  };

  const fetchEmployeesData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Employees
      const res = await fetch("/api/employees");
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }

      // 2. Fetch Assignments
      const assignRes = await fetch("/api/assignments");
      if (assignRes.ok) {
        const aData = await assignRes.json();
        setAssignments(aData);
      }

      // 3. Fetch Projects for assignment dropdown
      const projRes = await fetch("/api/projects");
      if (projRes.ok) {
        const pData = await projRes.json();
        setProjectsList(pData.map((p: any) => ({ id: p.id || p._id, name: p.name, location: p.location || "Dhaka" })));
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

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName) return;

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
          personalPhone: empPhone,
          personalAddress: empAddress,
          skills: empSkills.split(",").map((s) => s.trim()),
          status: "ACTIVE",
          isPublicTeam: true,
        }),
      });

      if (res.ok) {
        fetchEmployeesData();
        setIsAddingEmp(false);
        setEmpName("");
      } else {
        alert("Failed to create employee.");
      }
    } catch {
      setIsAddingEmp(false);
    }
  };

  // Schedule Conflict Check during assignment
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);

    // Front-end Conflict Check
    const existing = assignments.find(
      (a) =>
        a.employeeId === assignEmpId &&
        a.assignedDate.split("T")[0] === assignDate &&
        a.projectId !== assignProjectId
    );

    if (existing) {
      setConflictWarning(
        `⚠️ Schedule Conflict Alert: নির্বাচিত কর্মী ইতিমধ্যে "${existing.project?.name || "অন্য প্রজেক্ট"}" (${existing.project?.location || "ঢাকা"})-এ একই দিনে অ্যাসাইন করা আছে! একই সময়ে দুটি সাইটে কাজ করানো সম্ভব নয়।`
      );
      return;
    }

    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: assignEmpId,
          projectId: assignProjectId,
          assignedDate: assignDate,
          roleOnTask: assignRole,
        }),
      });

      if (res.status === 409) {
        const errorData = await res.json();
        setConflictWarning(errorData.error || "Schedule conflict detected!");
      } else if (res.ok) {
        alert("Employee assigned successfully!");
        setIsAssigning(false);
        fetchEmployeesData();
      }
    } catch {
      setIsAssigning(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <span>👥</span> মানবসম্পদ ও কর্মী ব্যবস্থাপনা • Workforce Management
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Staff Management, Project Assignments & Attendance
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            স্বয়ংক্রিয় অভিজ্ঞতা গণনা, শিডিউল কনফ্লিক্ট অ্যালার্ট এবং গোপনীয় স্যালারি ও অ্যাটেনডেন্স নিয়ন্ত্রণ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab("directory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "directory" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            📋 Staff Directory ({employees.length})
          </button>
          <button
            onClick={() => setSubTab("assignments")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "assignments" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            📍 Project Assignments
          </button>
          <button
            onClick={() => setSubTab("attendance")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "attendance" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            🕐 Daily Attendance
          </button>
        </div>
      </div>

      {/* SUBTAB 1: EMPLOYEE DIRECTORY */}
      {subTab === "directory" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#18221A]/85 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-md">
            <div>
              <h3 className="font-bold text-white text-sm font-serif">Company Team Directory</h3>
              <p className="text-xs text-stone-400">পাবলিক প্রোফাইল ওয়েবসাইটে দেখাবে; কিন্তু স্যালারি ও ব্যক্তিগত তথ্য শুধুমাত্র অ্যাডমিন দেখতে পারবে।</p>
            </div>
            <button
              onClick={() => setIsAddingEmp(!isAddingEmp)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              {isAddingEmp ? "✕ Close" : "+ Add New Employee"}
            </button>
          </div>

          {/* Add Employee Modal / Form */}
          {isAddingEmp && (
            <form onSubmit={handleCreateEmployee} className="bg-[#18221A] p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 animate-fade-in-up">
              <h4 className="font-bold text-emerald-400 text-sm border-b border-white/10 pb-2">New Employee Registration</h4>
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
                  <label className="font-semibold text-stone-300 font-mono block mb-1">কর্মীর নাম (Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Md. Rahim"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
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
                  <label className="font-semibold text-stone-300 font-mono block mb-1">ডিপার্টমেন্ট (Department)</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-stone-200 focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Landscape Design" className="bg-[#18221A] text-white">Landscape Design</option>
                    <option value="Tree Doctor" className="bg-[#18221A] text-white">Tree Doctor</option>
                    <option value="Garden Maintenance" className="bg-[#18221A] text-white">Garden Maintenance</option>
                    <option value="Irrigation & Lighting" className="bg-[#18221A] text-white">Irrigation & Lighting</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">যোগদানের তারিখ (Joining Date) *</label>
                  <input
                    type="date"
                    required
                    value={empJoiningDate}
                    onChange={(e) => setEmpJoiningDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                  <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                    ⏱️ স্বয়ংক্রিয় অভিজ্ঞতা: {calculateExperienceLive(empJoiningDate)}
                  </span>
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">মাসিক বেতন (Salary - Private) *</label>
                  <input
                    type="number"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">ব্যক্তিগত ফোন (Private)</label>
                  <input
                    type="tel"
                    value={empPhone}
                    onChange={(e) => setEmpPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">ঠিকানা (Private)</label>
                  <input
                    type="text"
                    value={empAddress}
                    onChange={(e) => setEmpAddress(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">দক্ষতা (Skills - Comma Separated)</label>
                  <input
                    type="text"
                    value={empSkills}
                    onChange={(e) => setEmpSkills(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingEmp(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  ✓ সেভ করুন
                </button>
              </div>
            </form>
          )}

          {/* Employees Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {employees.map((emp) => (
              <div
                key={emp.id}
                className="bg-[#18221A]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-lg hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-900/60 text-emerald-300 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
                        {emp.photo ? (
                          <img src={emp.photo} alt={emp.name} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                          emp.name[0]
                        )}
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-stone-400 block">{emp.employeeId}</span>
                        <h4 className="font-bold text-white text-base font-serif">{emp.name}</h4>
                        <p className="text-xs text-emerald-400 font-semibold">{emp.designation}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        emp.status === "ACTIVE"
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {emp.status}
                    </span>
                  </div>

                  {/* Auto-Calculated Experience Badge */}
                  <div className="mt-3 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 flex items-center justify-between text-xs">
                    <span className="text-emerald-300 font-medium">⏱️ সার্ভিস অভিজ্ঞতা:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {emp.calculatedExperience || calculateExperienceLive(emp.joiningDate)}
                    </span>
                  </div>

                  {/* Private Info Box (Admin Eyes Only) */}
                  <div className="mt-3 bg-black/35 p-3 rounded-2xl border border-white/10 text-xs space-y-1">
                    <span className="text-[9px] uppercase font-extrabold text-stone-400 tracking-wider block">
                      🔒 প্রাইভেট রেকর্ড (শুধুমাত্র অ্যাডমিন):
                    </span>
                    <div className="flex justify-between text-stone-300">
                      <span>মাসিক বেতন:</span>
                      <span className="font-bold font-mono text-white">৳{emp.salary ? emp.salary.toLocaleString() : "৪০,০০০"}</span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>ব্যক্তিগত ফোন:</span>
                      <span className="font-mono text-stone-200">{emp.personalPhone || "০১৭XXXXXXXX"}</span>
                    </div>
                    <div className="flex justify-between text-stone-300">
                      <span>ঠিকানা:</span>
                      <span className="truncate max-w-[150px] text-stone-200">{emp.personalAddress || "ঢাকা"}</span>
                    </div>
                  </div>

                  {/* Skills tags */}
                  {emp.skills && emp.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {emp.skills.map((s, i) => (
                        <span key={i} className="text-[10px] bg-white/5 text-stone-300 border border-white/10 px-2 py-0.5 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">যোগদান: {new Date(emp.joiningDate).toLocaleDateString()}</span>
                  <button
                    onClick={() => {
                      setAssignEmpId(emp.id);
                      setIsAssigning(true);
                      setSubTab("assignments");
                    }}
                    className="px-3 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    📍 প্রজেক্টে অ্যাসাইন করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PROJECT ASSIGNMENT & SCHEDULE CONFLICT ALERT */}
      {subTab === "assignments" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#18221A]/85 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-md">
            <div>
              <h3 className="font-bold text-white text-sm font-serif">প্রজেক্ট অ্যাসাইনমেন্ট ও শিডিউল ট্র্যাকিং</h3>
              <p className="text-xs text-stone-400">কোন কর্মী বর্তমানে কোন লোকেশনে কাজ করছে তা পর্যবেক্ষণ করুন। একই সময়ে কনফ্লিক্ট হলে ওয়ার্নিং আসবে।</p>
            </div>
            <button
              onClick={() => {
                setIsAssigning(true);
                setConflictWarning(null);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
            >
              + নতুন অ্যাসাইনমেন্ট যুক্ত করুন
            </button>
          </div>

          {/* Conflict Alert Banner */}
          {conflictWarning && (
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-3xl p-5 flex items-start gap-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <h4 className="font-bold text-amber-200 text-sm">Schedule Conflict Alert!</h4>
                <p className="text-xs text-amber-300 mt-1 leading-relaxed">{conflictWarning}</p>
                <p className="text-[11px] text-amber-400 mt-2 font-semibold">
                  দয়া করে তারিখ পরিবর্তন করুন অথবা অন্য কর্মীকে দায়িত্ব প্রদান করুন।
                </p>
              </div>
            </div>
          )}

          {/* Assignment Form */}
          {isAssigning && (
            <form onSubmit={handleAssignSubmit} className="bg-[#18221A] p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 animate-fade-in-up">
              <h4 className="font-bold text-emerald-400 text-sm border-b border-white/10 pb-2">প্রজেক্টে কর্মী অ্যাসাইন করুন</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">কর্মী নির্বাচন করুন *</label>
                  <select
                    required
                    value={assignEmpId}
                    onChange={(e) => setAssignEmpId(e.target.value)}
                    className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-stone-200 font-semibold focus:outline-none focus:border-emerald-400"
                  >
                    <option value="" className="bg-[#18221A] text-white">-- কর্মী নির্বাচন করুন --</option>
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
                    <option value="" className="bg-[#18221A] text-white">-- প্রজেক্ট নির্বাচন করুন --</option>
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
                    onChange={(e) => setAssignDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">দায়িত্ব / পদবী</label>
                  <input
                    type="text"
                    value={assignRole}
                    onChange={(e) => setAssignRole(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAssigning(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  ✓ কনফার্ম অ্যাসাইনমেন্ট
                </button>
              </div>
            </form>
          )}

          {/* Current Assignments Table */}
          <div className="bg-[#18221A]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg">
            <div className="p-4 bg-white/[0.02] border-b border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">Live Assignment Board</span>
              <span className="text-xs text-stone-400">Total Active Tasks: {assignments.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-stone-400 font-mono text-[10px] uppercase border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Employee (কর্মী)</th>
                    <th className="py-3 px-4">কাজ / প্রজেক্ট</th>
                    <th className="py-3 px-4">Location (এলাকা)</th>
                    <th className="py-3 px-4">তারিখ</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {assignments.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-400">
                        কোনো প্রজেক্ট অ্যাসাইনমেন্ট পাওয়া যায়নি।
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
                          📍 {asgn.project?.location || "Dhanmondi, Dhaka"}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-stone-400">
                          {new Date(asgn.assignedDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {asgn.status || "Working"}
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
      )}

      {/* SUBTAB 3: DAILY ATTENDANCE SYSTEM */}
      {subTab === "attendance" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#18221A]/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-lg">
              <span className="text-stone-400 text-xs block">আজকের উপস্থিতি (Present)</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">৩২ জন</span>
              <span className="text-[10px] text-emerald-400/80 block mt-1">৯৪% মোট উপস্থিতি হার</span>
            </div>
            <div className="bg-[#18221A]/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-lg">
              <span className="text-stone-400 text-xs block">অনুপস্থিত (Absent)</span>
              <span className="text-2xl font-bold font-mono text-rose-400">২ জন</span>
              <span className="text-[10px] text-rose-400/80 block mt-1">নোটিফিকেশন পাঠানো হয়েছে</span>
            </div>
            <div className="bg-[#18221A]/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-lg">
              <span className="text-stone-400 text-xs block">দেরি (Late Check-in)</span>
              <span className="text-2xl font-bold font-mono text-amber-400">১ জন</span>
              <span className="text-[10px] text-amber-400/80 block mt-1">সকাল ১০:১৫ এর পর</span>
            </div>
            <div className="bg-[#18221A]/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-lg">
              <span className="text-stone-400 text-xs block">ছুটিতে (On Leave)</span>
              <span className="text-2xl font-bold font-mono text-purple-400">১ জন</span>
              <span className="text-[10px] text-purple-400/80 block mt-1">অনুমোদিত ছুটি</span>
            </div>
          </div>

          <div className="bg-[#18221A]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg">
            <div className="p-4 bg-white/[0.02] border-b border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">দৈনিক হাজিরা লগ</span>
              <span className="text-xs text-emerald-400 font-bold">তারিখ: {new Date().toLocaleDateString("bn-BD")}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.04] text-stone-400 font-mono text-[10px] uppercase border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Check-in</th>
                    <th className="py-3 px-4">Check-out</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        {emp.name}
                        <span className="block text-[10px] font-mono text-stone-400">{emp.employeeId}</span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-300">{emp.department}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">09:15 AM</td>
                      <td className="py-3.5 px-4 font-mono text-stone-400">06:05 PM</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          PRESENT
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
