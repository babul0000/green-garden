"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Employee } from "./types";

interface AttendanceRecord {
  id?: string;
  employeeId: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "LEAVE" | string;
}

interface EmployeeAttendanceProps {
  employees: Employee[];
}

export default function EmployeeAttendance({ employees }: EmployeeAttendanceProps) {
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [submittingBulk, setSubmittingBulk] = useState(false);

  // Month parameters
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentMonthDate.toLocaleString("bn-BD", { month: "long", year: "numeric" });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAttendances(data.attendances || []);
      }
    } catch (err) {
      console.error("Failed to load attendance", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [currentMonthDate]);

  // Lookup map: `${employeeId}_${day}` -> status
  const attendanceMap = useMemo(() => {
    const map = new Map<string, string>();
    attendances.forEach((a) => {
      const d = new Date(a.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        map.set(`${a.employeeId}_${day}`, a.status);
      }
    });
    return map;
  }, [attendances, year, month]);

  // Handle previous / next month
  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  // Bulk Mark All Present Today
  const handleBulkMarkPresentToday = async () => {
    const today = new Date();
    const todayDateStr = today.toISOString().split("T")[0];
    const todayDay = today.getDate();

    setSubmittingBulk(true);
    try {
      const marks = employees.map((e) => ({
        employeeId: e.id,
        status: "PRESENT",
      }));

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BULK_MARK",
          date: todayDateStr,
          marks,
        }),
      });

      if (res.ok) {
        await fetchAttendance();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to bulk mark attendance");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingBulk(false);
    }
  };

  // Toggle or Update Single Day Status
  const handleToggleDayStatus = async (employeeId: string, day: number) => {
    const key = `${employeeId}_${day}`;
    const current = attendanceMap.get(key) || "ABSENT";
    const nextStatus = current === "PRESENT" ? "LATE" : current === "LATE" ? "LEAVE" : current === "LEAVE" ? "ABSENT" : "PRESENT";

    const targetDate = new Date(year, month, day);
    const dateStr = targetDate.toISOString().split("T")[0];

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "BULK_MARK",
          date: dateStr,
          marks: [{ employeeId, status: nextStatus }],
        }),
      });

      if (res.ok) {
        await fetchAttendance();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Compute Today Stats
  const today = new Date();
  const todayDay = today.getDate();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  let presentTodayCount = 0;
  let absentTodayCount = 0;
  let lateTodayCount = 0;
  let leaveTodayCount = 0;

  if (isCurrentMonth) {
    employees.forEach((e) => {
      const status = attendanceMap.get(`${e.id}_${todayDay}`);
      if (status === "PRESENT") presentTodayCount++;
      else if (status === "LATE") lateTodayCount++;
      else if (status === "LEAVE") leaveTodayCount++;
      else absentTodayCount++;
    });
  }

  return (
    <div className="space-y-6">
      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#18221A]/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-stone-400 text-xs block">আজকের উপস্থিতি (Present)</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{presentTodayCount} জন</span>
          <span className="text-[10px] text-emerald-400/80 block mt-1">
            {employees.length > 0 ? `${Math.round((presentTodayCount / employees.length) * 100)}% উপস্থিতি হার` : "কর্মচারী নেই"}
          </span>
        </div>
        <div className="bg-[#18221A]/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-stone-400 text-xs block">অনুপস্থিত (Absent)</span>
          <span className="text-2xl font-bold font-mono text-rose-400">{absentTodayCount} জন</span>
          <span className="text-[10px] text-rose-400/80 block mt-1">পেন্ডিং অথবা ছুটি</span>
        </div>
        <div className="bg-[#18221A]/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-stone-400 text-xs block">দেরি (Late Check-in)</span>
          <span className="text-2xl font-bold font-mono text-amber-400">{lateTodayCount} জন</span>
          <span className="text-[10px] text-amber-400/80 block mt-1">নির্ধারিত সময়ের পর</span>
        </div>
        <div className="bg-[#18221A]/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-stone-400 text-xs block">ছুটিতে (On Leave)</span>
          <span className="text-2xl font-bold font-mono text-purple-400">{leaveTodayCount} জন</span>
          <span className="text-[10px] text-purple-400/80 block mt-1">অনুমোদিত ছুটি</span>
        </div>
      </div>

      {/* Month Navigation & Bulk Actions Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#18221A]/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prevMonth}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm cursor-pointer border border-white/10"
            title="আগের মাস"
          >
            ←
          </button>
          <span className="font-bold text-white text-sm font-serif px-2">
            📅 {monthName}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold text-sm cursor-pointer border border-white/10"
            title="পরের মাস"
          >
            →
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-3 text-[10px] text-stone-300 font-mono px-3 py-1 bg-black/40 rounded-xl border border-white/10">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block"></span> P: Present</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block"></span> L: Late</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block"></span> H: Leave</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-500/40 inline-block"></span> A: Absent</span>
          </div>

          <button
            type="button"
            onClick={handleBulkMarkPresentToday}
            disabled={submittingBulk}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
          >
            {submittingBulk ? "সংরক্ষণ হচ্ছে..." : "✓ আজকে সবাইকে উপস্থিত মার্ক করুন"}
          </button>
        </div>
      </div>

      {/* Monthly Matrix Table (Employees x Days) */}
      <div className="bg-[#18221A]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg">
        <div className="p-4 bg-white/[0.02] border-b border-white/10 flex justify-between items-center">
          <span className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
            মাসিক হাজিরা শিট (Monthly Attendance Grid)
          </span>
          <span className="text-[11px] text-stone-400">সেল এ ক্লিক করে স্ট্যাটাস পরিবর্তন করুন</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-white/[0.04] text-stone-400 font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="py-2.5 px-3 min-w-[140px] sticky left-0 bg-[#141b16] z-10 border-r border-white/10">
                  Employee
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                  <th
                    key={d}
                    className={`py-2 px-1 text-center min-w-[28px] ${
                      isCurrentMonth && d === todayDay ? "bg-emerald-500/20 text-emerald-300 font-bold" : ""
                    }`}
                  >
                    {d}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-center text-emerald-400 font-bold border-l border-white/10">
                  উপস্থিত
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={daysInMonth + 2} className="py-8 text-center text-stone-400 italic">
                    কোনো কর্মী তালিকা নেই।
                  </td>
                </tr>
              ) : (
                employees.map((emp) => {
                  let totalPresent = 0;
                  return (
                    <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-white sticky left-0 bg-[#141b16] z-10 border-r border-white/10 whitespace-nowrap">
                        {emp.name}
                        <span className="block text-[9px] font-mono text-stone-400 font-normal">{emp.employeeId}</span>
                      </td>

                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                        const status = attendanceMap.get(`${emp.id}_${day}`);
                        if (status === "PRESENT" || status === "LATE") totalPresent++;

                        let bgClass = "bg-stone-800/40 text-stone-500";
                        let label = "-";

                        if (status === "PRESENT") {
                          bgClass = "bg-emerald-500 text-stone-950 font-bold";
                          label = "P";
                        } else if (status === "LATE") {
                          bgClass = "bg-amber-400 text-stone-950 font-bold";
                          label = "L";
                        } else if (status === "LEAVE") {
                          bgClass = "bg-purple-400 text-stone-950 font-bold";
                          label = "H";
                        } else if (status === "ABSENT") {
                          bgClass = "bg-rose-500/30 text-rose-300 font-bold";
                          label = "A";
                        }

                        return (
                          <td
                            key={day}
                            onClick={() => handleToggleDayStatus(emp.id, day)}
                            className="p-1 text-center cursor-pointer select-none"
                            title={`Day ${day}: ${status || "None"} - ক্লিক করে পরিবর্তন করুন`}
                          >
                            <span
                              className={`w-6 h-6 rounded inline-flex items-center justify-center text-[10px] transition-transform hover:scale-110 ${bgClass}`}
                            >
                              {label}
                            </span>
                          </td>
                        );
                      })}

                      <td className="py-2.5 px-3 text-center font-bold text-emerald-400 border-l border-white/10">
                        {totalPresent} দিন
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
