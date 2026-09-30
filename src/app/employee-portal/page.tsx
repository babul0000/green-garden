"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface EmployeeData {
  id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  joiningDate: string;
  calculatedExperience?: string;
  education?: string;
  skills: string[];
  status: string;
  salary?: number;
  personalPhone?: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  notes?: string;
}

interface AssignmentItem {
  id: string;
  assignedDate: string;
  roleOnTask: string;
  project?: {
    id: string;
    name: string;
    location: string;
    progress: number;
    status: string;
  };
}

interface TreeDoctorTask {
  id: string;
  treeName: string;
  problem: string;
  location: string;
  status: string;
  clientName: string;
  clientPhone: string;
  preferredVisitTime?: string;
  isEmergency: boolean;
}

export default function EmployeePortalPage() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"tasks" | "attendance" | "projects" | "profile">("tasks");
  const [employee, setEmployee] = useState<EmployeeData | null>(null);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [treeTasks, setTreeTasks] = useState<TreeDoctorTask[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Check-in status
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [isProcessingAttendance, setIsProcessingAttendance] = useState(false);

  // Fetch real employee portal data from PostgreSQL
  const fetchPortalData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch employees to match current user
      const empRes = await fetch("/api/employees");
      let currentEmp: EmployeeData | null = null;
      if (empRes.ok) {
        const emps: EmployeeData[] = await empRes.json();
        // Match by email/name or take the first doctor/employee
        currentEmp = emps.find((e) => e.name.toLowerCase() === (user?.name || "").toLowerCase()) ||
          emps.find((e) => e.department.includes("Doctor") || e.designation.includes("Doctor")) ||
          emps[0] || null;
        setEmployee(currentEmp);
      }

      // 2. Fetch attendance for this employee
      if (currentEmp) {
        const attRes = await fetch(`/api/attendance?employeeId=${currentEmp.id}`);
        if (attRes.ok) {
          const attData = await attRes.json();
          setAttendances(attData.attendances || []);
          setAttendanceSummary(attData.summary || null);

          // Check if checked in today
          const todayStr = new Date().toISOString().split("T")[0];
          const todayRecord = (attData.attendances || []).find(
            (a: AttendanceRecord) => a.date.startsWith(todayStr)
          );
          if (todayRecord && todayRecord.checkIn) {
            setIsCheckedIn(true);
            setCheckInTime(new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
          }
        }
      }

      // 3. Fetch project assignments
      const assignRes = await fetch("/api/assignments");
      if (assignRes.ok) {
        const aData: AssignmentItem[] = await assignRes.json();
        if (currentEmp) {
          setAssignments(aData.filter((a: any) => a.employeeId === currentEmp?.id));
        } else {
          setAssignments(aData);
        }
      }

      // 4. Fetch tree doctor tasks
      const treeRes = await fetch("/api/tree-doctor");
      if (treeRes.ok) {
        const tData: any[] = await treeRes.json();
        if (currentEmp) {
          setTreeTasks(tData.filter((t) => t.assignedDoctorId === currentEmp?.id || t.status === "ASSIGNED" || t.status === "PENDING"));
        } else {
          setTreeTasks(tData);
        }
      }
    } catch (err) {
      console.error("Error loading employee data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, [user]);

  // Real Database Check-In
  const handleCheckIn = async () => {
    if (!employee) return;
    setIsProcessingAttendance(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.id,
          action: "CHECK_IN",
          notes: "Daily check-in from Employee Portal",
        }),
      });

      if (res.ok) {
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        setIsCheckedIn(true);
        setCheckInTime(time);
        await fetchPortalData();
      } else {
        const err = await res.json();
        alert(err.error || "Check-in failed.");
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setIsProcessingAttendance(false);
    }
  };

  // Real Database Check-Out
  const handleCheckOut = async () => {
    if (!employee) return;
    setIsProcessingAttendance(true);
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.id,
          action: "CHECK_OUT",
          notes: "Daily check-out from Employee Portal",
        }),
      });

      if (res.ok) {
        setIsCheckedIn(false);
        alert(`Checked out successfully at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
        await fetchPortalData();
      } else {
        const err = await res.json();
        alert(err.error || "Check-out failed.");
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setIsProcessingAttendance(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f5]">
        <div className="w-10 h-10 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f5] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-900 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {employee?.name ? employee.name.charAt(0).toUpperCase() : user?.name?.charAt(0).toUpperCase() || "E"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-gray-900">
                  {employee?.name || user?.name || "Employee Portal"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  {employee?.status || "ACTIVE"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ID: <span className="font-mono font-bold text-gray-800">{employee?.employeeId || "EMP-101"}</span> •{" "}
                পদবী: <span className="text-emerald-700 font-medium">{employee?.designation || "Senior Tree Doctor & Landscape Specialist"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {!isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={isProcessingAttendance}
                className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>🕒</span> {isProcessingAttendance ? "হচ্ছে..." : "ডেইলি চেক-ইন (Check-In)"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                  চেক-ইন হয়েছে: <strong>{checkInTime}</strong>
                </span>
                <button
                  onClick={handleCheckOut}
                  disabled={isProcessingAttendance}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                >
                  চেক-আউট (Check-Out)
                </button>
              </div>
            )}
            <button
              onClick={() => logout()}
              className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick KPI Stats from Database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">আজকের কার্যতালিকা</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-gray-900 font-mono">
                {treeTasks.length + assignments.length}
              </span>
              <span className="text-xs text-emerald-700 font-bold">
                {treeTasks.length}টি ট্রি ভিজিট, {assignments.length}টি সাইট
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">অ্যাসাইন করা প্রজেক্ট</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-gray-900 font-mono">
                {assignments.length || 1}
              </span>
              <span className="text-xs text-blue-700 font-bold">
                {assignments[0]?.project?.location || "Dhanmondi, Dhaka"}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">উপস্থিতির হার (Attendance)</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-emerald-700 font-mono">
                {attendanceSummary?.attendancePercentage || "100%"}
              </span>
              <span className="text-xs text-gray-500 font-bold">
                {attendanceSummary?.present || attendances.length} দিন উপস্থিত
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">ট্রি ডক্টর দায়িত্ব</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-purple-700 font-mono">
                {treeTasks.length}
              </span>
              <span className="text-xs text-purple-600 font-bold">একটিভ কেইস</span>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-gray-200 gap-6">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "tasks" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            📋 আজকের শিডিউল ও কাজ ({treeTasks.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "projects" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            🌿 অ্যাসাইন করা প্রজেক্ট ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "attendance" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            ⏱️ ডেইলি অ্যাটেনডেন্স লগ ({attendances.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-bold transition-all relative cursor-pointer ${
              activeTab === "profile" ? "text-emerald-700 border-b-2 border-emerald-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            👤 প্রোফাইল ও দক্ষতা
          </button>
        </div>

        {/* Tab 1: Today's Tasks */}
        {activeTab === "tasks" && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900 font-serif">আজকের সাইট পরিদর্শন ও ট্রি ডক্টর দায়িত্ব</h3>
              <div className="space-y-3">
                {treeTasks.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {t.preferredVisitTime || "Morning Slot"}
                        </span>
                        {t.isEmergency && (
                          <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded">
                            🚨 Emergency
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">{t.treeName} - {t.problem}</h4>
                      <p className="text-xs text-gray-500">গ্রাহক: {t.clientName} ({t.clientPhone}) • লোকেশন: {t.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                        {t.status}
                      </span>
                      <a
                        href={`tel:${t.clientPhone}`}
                        className="px-3 py-1 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                      >
                        📞 কল করুন
                      </a>
                    </div>
                  </div>
                ))}

                {treeTasks.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">আজকের জন্য কোনো পেন্ডিং টাস্ক নেই।</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Assigned Projects */}
        {activeTab === "projects" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 font-serif">অ্যাসাইন করা প্রজেক্টের তালিকা</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((a) => (
                <div key={a.id} className="p-5 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{a.project?.name || "Landscape Site"}</h4>
                      <p className="text-xs text-gray-500">📍 {a.project?.location || "Dhaka"}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                      {a.project?.progress || 70}% সম্পন্ন
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 font-semibold">দায়িত্ব: {a.roleOnTask || "Lead Specialist"}</p>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${a.project?.progress || 70}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {assignments.length === 0 && (
                <p className="text-sm text-gray-400 py-6">বর্তমানে কোনো প্রজেক্ট অ্যাসাইনমেন্ট নেই।</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Monthly Attendance Record */}
        {activeTab === "attendance" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900 font-serif">উপস্থিতির রেকর্ড (Attendance History)</h3>
                <p className="text-xs text-gray-500">প্রতিদিনের চেক-ইন ও চেক-আউট ডাটা সরাসরি PostgreSQL ডাটাবেজে সংরক্ষিত।</p>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
                হার: {attendanceSummary?.attendancePercentage || "100%"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 text-gray-600 font-bold uppercase bg-gray-50">
                  <tr>
                    <th className="py-3 px-4">তারিখ</th>
                    <th className="py-3 px-4">চেক-ইন</th>
                    <th className="py-3 px-4">চেক-আউট</th>
                    <th className="py-3 px-4">স্ট্যাটাস</th>
                    <th className="py-3 px-4">নোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendances.map((att) => (
                    <tr key={att.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">
                        {new Date(att.date).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-800 font-semibold">
                        {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-600">
                        {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          att.status === "PRESENT" ? "bg-emerald-100 text-emerald-800" : att.status === "LATE" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                        }`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{att.notes || "নিয়মিত উপস্থিতি"}</td>
                    </tr>
                  ))}
                  {attendances.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        কোনো উপস্থিতির রেকর্ড পাওয়া যায়নি
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Profile & Qualifications */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-gray-900 font-serif">এমপ্লয়ি প্রোফাইল ও বিবরণ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="text-gray-400 block font-medium">বিভাগ (Department)</span>
                <span className="font-bold text-gray-800 text-sm">{employee?.department || "Tree Doctor & Plant Health"}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="text-gray-400 block font-medium">অভিজ্ঞতা (Experience)</span>
                <span className="font-bold text-emerald-700 text-sm font-mono">
                  {employee?.calculatedExperience || "5 Years 4 Months"}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="text-gray-400 block font-medium">যোগদানের তারিখ (Joining Date)</span>
                <span className="font-bold text-gray-800 text-sm">
                  {employee?.joiningDate ? new Date(employee.joiningDate).toLocaleDateString("bn-BD") : "01-01-2022"}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <span className="text-gray-400 block font-medium">শিক্ষাগত যোগ্যতা</span>
                <span className="font-bold text-gray-800 text-sm">{employee?.education || "B.Sc in Horticulture"}</span>
              </div>
            </div>

            {employee?.skills && employee.skills.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-gray-700 block mb-2">দক্ষতা ও স্পেশালাইজেশন:</span>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((s, idx) => (
                    <span key={idx} className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-xl border border-emerald-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
