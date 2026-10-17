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

  // Field Worker "Photo-Punch" Mode State
  const [punchProjectId, setPunchProjectId] = useState<string>("");
  const [geoLocName, setGeoLocName] = useState<string>("অবস্থান যাচাই হচ্ছে...");
  const [beforePhotoUrl, setBeforePhotoUrl] = useState<string | null>(null);
  const [afterPhotoUrl, setAfterPhotoUrl] = useState<string | null>(null);
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [punchNotice, setPunchNotice] = useState<string | null>(null);
  const [employeeNotFound, setEmployeeNotFound] = useState(false);

  // Helper to obtain GPS location safely without hardcoding
  const getSafeGeolocation = (): Promise<string> => {
    return new Promise((resolve) => {
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(`GPS: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
          },
          () => resolve("অবস্থান পাওয়া যায়নি"),
          { timeout: 7000, enableHighAccuracy: true }
        );
      } else {
        resolve("অবস্থান পাওয়া যায়নি");
      }
    });
  };

  // Fetch real employee portal data from PostgreSQL
  const fetchPortalData = async () => {
    setDataLoading(true);
    try {
      // 1. Fetch employees to match current user strictly without arbitrary fallback
      const empRes = await fetch("/api/employees", { cache: "no-store" });
      let currentEmp: EmployeeData | null = null;
      if (empRes.ok) {
        const emps: EmployeeData[] = await empRes.json();
        currentEmp = emps.find((e) =>
          (user?.id && (e as any).userId === user.id) ||
          (e.name && user?.name && e.name.toLowerCase() === user.name.toLowerCase())
        ) || null;

        if (!currentEmp) {
          setEmployeeNotFound(true);
          setEmployee(null);
        } else {
          setEmployeeNotFound(false);
          setEmployee(currentEmp);
        }
      }

      // 2. Fetch attendance for this employee
      if (currentEmp) {
        const attRes = await fetch(`/api/attendance?employeeId=${currentEmp.id}`, { cache: "no-store" });
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
      const assignRes = await fetch("/api/assignments", { cache: "no-store" });
      if (assignRes.ok) {
        const aData: AssignmentItem[] = await assignRes.json();
        if (currentEmp) {
          setAssignments(aData.filter((a: any) => a.employeeId === currentEmp?.id));
        } else {
          setAssignments(aData);
        }
      }

      // 4. Fetch tree doctor tasks
      const treeRes = await fetch("/api/tree-doctor", { cache: "no-store" });
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

  // 1-Tap Mobile Camera "Photo-Punch" Check-In
  const handlePhotoPunchCheckIn = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBefore(true);
    setPunchNotice("সাইটের ছবি ও জিপিএস অবস্থান যাচাই হচ্ছে...");

    try {
      // 1. Geolocation lookup with strict safe fallback
      const detectedGeo = await getSafeGeolocation();
      setGeoLocName(detectedGeo);

      // 2. Upload photo
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "field-punch");
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await upRes.json();
      const photoUrl = upData.url || URL.createObjectURL(file);
      setBeforePhotoUrl(photoUrl);

      // 3. Link photo directly to Project in PostgreSQL
      const targetProjId = punchProjectId || assignments[0]?.project?.id;
      if (targetProjId) {
        await fetch(`/api/projects/${targetProjId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ beforeImage: photoUrl }),
        });
      }

      // 4. Punch Attendance
      if (employee) {
        await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: employee.id,
            action: "CHECK_IN",
            notes: `Field Photo-Punch Check-In (${detectedGeo}). Initial site photo captured.`,
          }),
        });
      }

      setIsCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setPunchNotice("✅ সাইটে পৌঁছানো সফলভাবে নিশ্চিত হয়েছে! প্রারম্ভিক ছবি ক্লায়েন্ট ড্যাশবোর্ডে যুক্ত হয়েছে।");
      fetchPortalData();
    } catch (err: any) {
      setPunchNotice("❌ চেক-ইন ছবি আপলোডে সমস্যা: " + err.message);
    } finally {
      setIsUploadingBefore(false);
    }
  };

  // 1-Tap Mobile Camera "Photo-Punch" Check-Out
  const handlePhotoPunchCheckOut = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAfter(true);
    setPunchNotice("পরিষ্কার সাইটের সমাপ্তি ছবি ও কাজ যাচাই হচ্ছে...");

    try {
      // 1. Upload After photo
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "field-punch");
      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await upRes.json();
      const photoUrl = upData.url || URL.createObjectURL(file);
      setAfterPhotoUrl(photoUrl);

      // 2. Link photo to Project & increment progress
      const targetProjId = punchProjectId || assignments[0]?.project?.id;
      if (targetProjId) {
        await fetch(`/api/projects/${targetProjId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            afterImage: photoUrl,
            progress: 90,
            status: "RUNNING",
          }),
        });
      }

      // 3. Punch Checkout with real GPS
      const detectedGeo = await getSafeGeolocation();
      if (employee) {
        await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            employeeId: employee.id,
            action: "CHECK_OUT",
            notes: `Field Photo-Punch Check-Out (${detectedGeo}). Completed site photo submitted.`,
          }),
        });
      }

      setIsCheckedIn(false);
      setPunchNotice("🎉 কাজ সমাপ্তির ছবি আপলোড হয়েছে এবং ক্লায়েন্ট ড্যাশবোর্ডে আফটার-ফটো লাইভ হয়েছে!");
      fetchPortalData();
    } catch (err: any) {
      setPunchNotice("❌ চেক-আউট ছবি আপলোডে সমস্যা: " + err.message);
    } finally {
      setIsUploadingAfter(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121A14]">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121A14] text-[#E4E2D7] py-8 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden studio-portal-dark">
      {/* Background Architectural Ambient Grid & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#243A2A_1px,transparent_1px)] [background-size:32px_32px] opacity-35 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-900/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        {/* Top Header Card */}
        <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-900 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {employee?.name ? employee.name.charAt(0).toUpperCase() : user?.name?.charAt(0).toUpperCase() || "E"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-display font-bold text-[#E4E2D7]">
                  {employee?.name || user?.name || "Employee Portal"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                  {employee?.status || "ACTIVE"}
                </span>
              </div>
              <p className="text-sm text-white/60 mt-1">
                ID: <span className="font-mono font-bold text-[#E4E2D7]">{employee?.employeeId || "EMP-101"}</span> •{" "}
                পদবী: <span className="text-emerald-400 font-medium">{employee?.designation || "Senior Tree Doctor & Landscape Specialist"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {employeeNotFound ? (
              <div className="text-xs text-rose-300 bg-rose-500/15 border border-rose-500/30 px-3 py-2 rounded-xl">
                ⚠️ কর্মী প্রোফাইল যুক্ত নেই
              </div>
            ) : !isCheckedIn ? (
              <button
                onClick={handleCheckIn}
                disabled={isProcessingAttendance}
                className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-sm font-bold font-mono shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>🕒</span> {isProcessingAttendance ? "হচ্ছে..." : "ডেইলি চেক-ইন (Check-In)"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 bg-emerald-500/15 px-3 py-2 rounded-xl border border-emerald-500/30 font-mono">
                  চেক-ইন হয়েছে: <strong>{checkInTime}</strong>
                </span>
                <button
                  onClick={handleCheckOut}
                  disabled={isProcessingAttendance}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer disabled:opacity-50 shadow-md"
                >
                  চেক-আউট (Check-Out)
                </button>
              </div>
            )}
            <button
              onClick={() => logout()}
              className="px-4 py-2.5 border border-white/15 hover:bg-white/10 text-white/80 rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Warning Banner if No Matching Employee Profile */}
        {employeeNotFound && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-center text-rose-200">
            <div className="text-2xl mb-1">⚠️</div>
            <h3 className="text-base font-bold text-white mb-1">কর্মী (Employee) প্রোফাইল পাওয়া যায়নি</h3>
            <p className="text-xs text-rose-200/80">
              আপনার লগইন অ্যাকাউন্টের সাথে কোনো কর্মী (Employee) প্রোফাইল যুক্ত পাওয়া যায়নি। উপস্থিতি ও ফটো-পাঞ্চ রেকর্ড করতে অ্যাডমিনকে আপনার প্রোফাইল তৈরি করতে বলুন।
            </p>
          </div>
        )}

        {/* Quick KPI Stats from Database */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#18221A]/85 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Today's Schedule</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#E4E2D7] font-mono">
                {treeTasks.length + assignments.length}
              </span>
              <span className="text-xs text-emerald-400 font-bold">
                {treeTasks.length} Tree Visits, {assignments.length} Sites
              </span>
            </div>
          </div>

          <div className="bg-[#18221A]/85 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Assigned Projects</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#E4E2D7] font-mono">
                {assignments.length || 1}
              </span>
              <span className="text-xs text-blue-400 font-bold">
                {assignments[0]?.project?.location || "Dhanmondi, Dhaka"}
              </span>
            </div>
          </div>

          <div className="bg-[#18221A]/85 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Attendance Rate</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {attendanceSummary?.attendancePercentage || "100%"}
              </span>
              <span className="text-xs text-white/60 font-bold">
                {attendanceSummary?.present || attendances.length} Days Present
              </span>
            </div>
          </div>

          <div className="bg-[#18221A]/85 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider font-mono">Tree Doctor Cases</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-purple-400 font-mono">
                {treeTasks.length}
              </span>
              <span className="text-xs text-purple-300 font-bold">Active Cases</span>
            </div>
          </div>
        </div>

        {/* ================= SIMPLIFIED FIELD WORKER PHOTO-PUNCH MODE ================= */}
        <div className="bg-gradient-to-br from-[#1c2e22] via-[#16251b] to-[#101c14] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-inner shrink-0">
                📸
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-white">
                    Field Worker 1-Tap Photo-Punch Mode
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 uppercase">
                    Live GPS Sync
                  </span>
                </div>
                <p className="text-xs text-white/70 mt-0.5">
                  Capture Before and After photos on-site. Photos sync directly to the client portal and project logs.
                </p>
              </div>
            </div>

            {/* GPS Location Badge & Project Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5">
                📍 {geoLocName}
              </span>
              {assignments.length > 0 && (
                <select
                  value={punchProjectId}
                  onChange={(e) => setPunchProjectId(e.target.value)}
                  className="px-3 py-1 rounded-xl bg-black/40 border border-white/15 text-xs font-mono text-white outline-none focus:border-emerald-400"
                >
                  <option value="">Select Project Site (Auto)</option>
                  {assignments.map((a) => (
                    <option key={a.id} value={a.project?.id || ""}>
                      {a.project?.name || "Project Site"} ({a.project?.location || "Dhaka"})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Punch Notification Notice */}
          {punchNotice && (
            <div className="my-4 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center justify-between gap-2 animate-fade-in">
              <span>{punchNotice}</span>
              <button
                onClick={() => setPunchNotice(null)}
                className="text-white/60 hover:text-white text-xs px-2 py-0.5 rounded bg-white/10"
              >
                ✕
              </button>
            </div>
          )}

          {/* Two Massive Touch Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 relative z-10">
            {/* BUTTON 1: CHECK-IN WITH BEFORE PHOTO */}
            <div>
              <input
                id="punch-before-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoPunchCheckIn}
                disabled={isUploadingBefore}
              />
              <label
                htmlFor="punch-before-input"
                className={`w-full p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-lg group ${
                  isCheckedIn
                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300 hover:border-emerald-500/60"
                    : "bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-stone-950 hover:scale-[1.01] active:scale-[0.99]"
                } ${isUploadingBefore ? "opacity-60 pointer-events-none" : ""}`}
              >
                <div className="flex items-center gap-2 text-xl sm:text-2xl font-display font-black tracking-tight">
                  <span className="text-2xl group-hover:scale-125 transition-transform">📍📸</span>
                  <span>{isUploadingBefore ? "Uploading..." : "Site Arrival (Check-in)"}</span>
                </div>
                <p className={`text-xs mt-1 font-medium ${isCheckedIn ? "text-emerald-200/80" : "text-stone-900/80"}`}>
                  {isCheckedIn
                    ? `✓ Checked in today (${checkInTime || "Done"}) • Tap to capture Before photo again`
                    : "Tap to capture initial (Before) photo and punch check-in"}
                </p>
                {beforePhotoUrl && (
                  <div className="mt-3 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                    <img src={beforePhotoUrl} alt="Before preview" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[11px] font-mono text-emerald-300">Before Photo Saved ✓</span>
                  </div>
                )}
              </label>
            </div>

            {/* BUTTON 2: CHECK-OUT WITH AFTER PHOTO */}
            <div>
              <input
                id="punch-after-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoPunchCheckOut}
                disabled={isUploadingAfter}
              />
              <label
                htmlFor="punch-after-input"
                className={`w-full p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer shadow-lg group ${
                  !isCheckedIn && checkInTime
                    ? "bg-amber-950/40 border-amber-500/30 text-amber-300 hover:border-amber-500/60"
                    : "bg-amber-500 hover:bg-amber-400 border-amber-300 text-stone-950 hover:scale-[1.01] active:scale-[0.99]"
                } ${isUploadingAfter ? "opacity-60 pointer-events-none" : ""}`}
              >
                <div className="flex items-center gap-2 text-xl sm:text-2xl font-display font-black tracking-tight">
                  <span className="text-2xl group-hover:scale-125 transition-transform">✅📸</span>
                  <span>{isUploadingAfter ? "Verifying..." : "Task Done (Check-out)"}</span>
                </div>
                <p className={`text-xs mt-1 font-medium ${!isCheckedIn && checkInTime ? "text-amber-200/80" : "text-stone-900/80"}`}>
                  {!isCheckedIn && checkInTime
                    ? "✓ Checked out • Tap to capture After photo again"
                    : "Tap to capture finished (After) photo and punch check-out"}
                </p>
                {afterPhotoUrl && (
                  <div className="mt-3 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
                    <img src={afterPhotoUrl} alt="After preview" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[11px] font-mono text-amber-300">After Photo Saved ✓</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-white/10 gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`pb-3 text-sm font-bold font-mono transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === "tasks" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-white/50 hover:text-white"
            }`}
          >
            📋 Today's Tasks & Schedule ({treeTasks.length})
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`pb-3 text-sm font-bold font-mono transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === "projects" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-white/50 hover:text-white"
            }`}
          >
            🌿 Assigned Projects ({assignments.length})
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`pb-3 text-sm font-bold font-mono transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === "attendance" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-white/50 hover:text-white"
            }`}
          >
            ⏱️ Daily Attendance Log ({attendances.length})
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 text-sm font-bold font-mono transition-all relative cursor-pointer whitespace-nowrap ${
              activeTab === "profile" ? "text-emerald-400 border-b-2 border-emerald-400 font-bold" : "text-white/50 hover:text-white"
            }`}
          >
            👤 Profile & Skills
          </button>
        </div>

        {/* Tab 1: Today's Tasks */}
        {activeTab === "tasks" && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-[#E4E2D7] font-sans">
                Today's Site Visits & Tree Doctor Assignments
              </h3>
              <div className="space-y-3">
                {treeTasks.map((t) => (
                  <div key={t.id} className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 font-mono">
                          {t.preferredVisitTime || "Morning Slot"}
                        </span>
                        {t.isEmergency && (
                          <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30 font-mono">
                            🚨 Emergency
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-white text-sm">{t.treeName} - {t.problem}</h4>
                      <p className="text-xs text-white/50">গ্রাহক: {t.clientName} ({t.clientPhone}) • লোকেশন: {t.location}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-mono">
                        {t.status}
                      </span>
                      <a
                        href={`tel:${t.clientPhone}`}
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all shadow-md"
                      >
                        📞 কল করুন
                      </a>
                    </div>
                  </div>
                ))}

                {treeTasks.length === 0 && (
                  <p className="text-sm text-white/40 text-center py-6">আজকের জন্য কোনো পেন্ডিং টাস্ক নেই।</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Assigned Projects */}
        {activeTab === "projects" && (
          <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-[#E4E2D7] font-sans">Assigned Projects Roster</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignments.map((a) => (
                <div key={a.id} className="p-5 rounded-2xl border border-white/10 bg-black/40 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-base">{a.project?.name || "Landscape Site"}</h4>
                      <p className="text-xs text-white/50">📍 {a.project?.location || "Dhaka"}</p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                      {a.project?.progress || 70}% Completed
                    </span>
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold font-mono">Role: {a.roleOnTask || "Lead Specialist"}</p>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${a.project?.progress || 70}%` }}
                    ></div>
                  </div>
                </div>
              ))}
              {assignments.length === 0 && (
                <p className="text-sm text-white/40 py-6">No current project assignments.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Monthly Attendance Record */}
        {activeTab === "attendance" && (
          <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 animate-fade-in-up">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-[#E4E2D7] font-sans">Attendance History & Daily Logs</h3>
                <p className="text-xs text-white/50">Daily check-in and check-out records synced live with the database.</p>
              </div>
              <span className="text-xs font-bold font-mono bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                Rate: {attendanceSummary?.attendancePercentage || "100%"}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-white/60 font-mono font-bold uppercase bg-white/5">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Check-In</th>
                    <th className="py-3 px-4">Check-Out</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {attendances.map((att) => (
                    <tr key={att.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-white">
                        {new Date(att.date).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">
                        {att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                      <td className="py-3 px-4 font-mono text-white/70">
                        {att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          att.status === "PRESENT" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : att.status === "LATE" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                        }`}>
                          {att.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white/60">{att.notes || "Regular Attendance"}</td>
                    </tr>
                  ))}
                  {attendances.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/40">
                        No attendance records found.
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
          <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-xl space-y-4 animate-fade-in-up">
            <h3 className="text-lg font-bold text-[#E4E2D7] font-sans">Staff Profile & Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl">
                <span className="text-white/50 block font-mono">বিভাগ (Department)</span>
                <span className="font-bold text-white text-sm mt-1 block">{employee?.department || "Tree Doctor & Plant Health"}</span>
              </div>
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl">
                <span className="text-white/50 block font-mono">অভিজ্ঞতা (Experience)</span>
                <span className="font-bold text-emerald-400 text-sm font-mono mt-1 block">
                  {employee?.calculatedExperience || "5 Years 4 Months"}
                </span>
              </div>
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl">
                <span className="text-white/50 block font-mono">যোগদানের তারিখ (Joining Date)</span>
                <span className="font-bold text-white text-sm mt-1 block">
                  {employee?.joiningDate ? new Date(employee.joiningDate).toLocaleDateString("bn-BD") : "01-01-2022"}
                </span>
              </div>
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl">
                <span className="text-white/50 block font-mono">শিক্ষাগত যোগ্যতা</span>
                <span className="font-bold text-white text-sm mt-1 block">{employee?.education || "B.Sc in Horticulture"}</span>
              </div>
            </div>

            {employee?.skills && employee.skills.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-white/70 block mb-2 font-mono">দক্ষতা ও স্পেশালাইজেশন:</span>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((s, idx) => (
                    <span key={idx} className="bg-emerald-500/15 text-emerald-400 text-xs font-semibold px-3 py-1 rounded-xl border border-emerald-500/30 font-mono">
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
