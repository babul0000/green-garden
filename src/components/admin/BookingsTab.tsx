"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { IBooking } from "@/types";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";
import DataTable, { ColumnDef } from "@/components/admin/shared/DataTable";

interface BookingsTabProps {
  bookings?: IBooking[];
  handleUpdateBooking?: (id?: string, status?: string, assignedStaff?: string, assignedStaffId?: string) => void;
  handleDeleteBooking?: (id?: string) => void;
}

interface EmployeeOption {
  id: string;
  name: string;
  designation?: string;
  department?: string;
}

export default function BookingsTab({
  bookings: initialBookings = [],
  handleUpdateBooking: parentHandleUpdate,
  handleDeleteBooking: parentHandleDelete,
}: BookingsTabProps) {
  // Views: list | calendar | kanban
  const [viewMode, setViewMode] = useState<"list" | "calendar" | "kanban">("list");

  // Local bookings state (populated from API or props)
  const [bookingsList, setBookingsList] = useState<IBooking[]>(initialBookings);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Deletion Confirm Modal state
  const [deleteTarget, setDeleteTarget] = useState<IBooking | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Detail Modal state
  const [selectedBooking, setSelectedBooking] = useState<IBooking | null>(null);

  // Calendar State
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);

  // Drag and Drop state for Kanban
  const [draggedBookingId, setDraggedBookingId] = useState<string | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch Employees for dynamic staff dropdown
  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setEmployees(
          list.map((e: any) => ({
            id: e.id,
            name: e.name,
            designation: e.designation,
            department: e.department,
          }))
        );
      }
    } catch {
      // Keep empty if failed
    }
  };

  // 2. Fetch Bookings from API
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setBookingsList(list);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
    fetchBookings();
  }, [fetchBookings]);

  // Sync props if initialBookings updates externally
  useEffect(() => {
    if (initialBookings.length > 0 && bookingsList.length === 0) {
      setBookingsList(initialBookings);
    }
  }, [initialBookings]);

  // 3. Update Booking (Status & Staff)
  const updateBooking = async (
    bookingId: string,
    newStatus?: string,
    newStaffId?: string
  ) => {
    try {
      const current = bookingsList.find((b) => (b.id || b._id) === bookingId);
      if (!current) return;

      const payload: any = {};
      if (newStatus !== undefined) payload.status = newStatus;
      if (newStaffId !== undefined) {
        payload.assignedStaffId = newStaffId || null;
      }

      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "আপডেট ব্যর্থ হয়েছে");
      }

      const updated = await res.json();

      // Update state locally
      setBookingsList((prev) =>
        prev.map((b) => ((b.id || b._id) === bookingId ? { ...b, ...updated } : b))
      );

      // Notify parent if prop handler passed
      if (parentHandleUpdate) {
        parentHandleUpdate(bookingId, updated.status, updated.assignedStaff, updated.assignedStaffId);
      }

      showToast("বুকিং সফলভাবে আপডেট করা হয়েছে।");
    } catch (err: any) {
      alert("বুকিং আপডেট ব্যর্থ: " + err.message);
    }
  };

  // 4. Delete Booking
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const bId = deleteTarget.id || deleteTarget._id;
    if (!bId) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/bookings/${bId}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "ডিলিট ব্যর্থ হয়েছে");
      }

      setBookingsList((prev) => prev.filter((b) => (b.id || b._id) !== bId));
      if (parentHandleDelete) parentHandleDelete(bId);

      showToast("বুকিং সফলভাবে মুছে ফেলা হয়েছে।");
      setDeleteTarget(null);
    } catch (err: any) {
      alert("মুছে ফেলতে ব্যর্থ: " + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // 5. CSV Export Helper
  const exportToCSV = () => {
    if (bookingsList.length === 0) {
      alert("এক্সপোর্ট করার জন্য কোনো বুকিং নেই।");
      return;
    }

    const headers = [
      "Booking ID",
      "Client Name",
      "Email",
      "Phone",
      "Address",
      "Service",
      "Budget Range",
      "Assigned Staff",
      "Status",
      "Booking Date",
      "Created Date",
    ];

    const escapeCSV = (str: any) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = bookingsList.map((b) => [
      escapeCSV(b.id || b._id),
      escapeCSV(b.clientName),
      escapeCSV(b.clientEmail),
      escapeCSV(b.phone),
      escapeCSV(b.address),
      escapeCSV(b.service),
      escapeCSV(b.budgetRange),
      escapeCSV(b.assignedStaff || b.assignedStaffMember?.name || "Unassigned"),
      escapeCSV(b.status),
      escapeCSV(b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("en-GB") : ""),
      escapeCSV(b.createdAt ? new Date(b.createdAt).toLocaleDateString("en-GB") : ""),
    ]);

    // Add UTF-8 BOM for Microsoft Excel Bengali font rendering
    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `argreengarden_bookings_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("CSV ফাইল সফলভাবে ডাউনলোড হয়েছে।");
  };

  // ================= CALENDAR CALCULATIONS =================
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun
    const totalDays = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ day: number | null; dateStr: string | null; isToday: boolean }> = [];

    // Leading blanks
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ day: null, dateStr: null, isToday: false });
    }

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    // Days of month
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isToday = isCurrentMonth && today.getDate() === d;
      cells.push({ day: d, dateStr, isToday });
    }

    return cells;
  }, [currentDate]);

  const monthNamesBn = [
    "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
  ];
  const monthNamesEn = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Bookings grouped by date string "YYYY-MM-DD"
  const bookingsByDate = useMemo(() => {
    const map: Record<string, IBooking[]> = {};
    bookingsList.forEach((b) => {
      const d = b.bookingDate ? new Date(b.bookingDate) : (b.createdAt ? new Date(b.createdAt) : null);
      if (d && !isNaN(d.getTime())) {
        const key = d.toISOString().slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(b);
      }
    });
    return map;
  }, [bookingsList]);

  // Calendar prev / next month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  const jumpToToday = () => {
    setCurrentDate(new Date());
  };

  // ================= KANBAN COLUMNS =================
  const kanbanColumns = useMemo(() => {
    const pending = bookingsList.filter((b) => !b.status || b.status.toLowerCase() === "pending");
    const confirmed = bookingsList.filter((b) => b.status && b.status.toLowerCase() === "confirmed");
    const completed = bookingsList.filter((b) => b.status && b.status.toLowerCase() === "completed");
    return { pending, confirmed, completed };
  }, [bookingsList]);

  // Kanban Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedBookingId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: "Pending" | "Confirmed" | "Completed") => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedBookingId;
    if (!id) return;
    setDraggedBookingId(null);
    await updateBooking(id, targetStatus);
  };

  // ================= TABLE COLUMN DEFINITIONS =================
  const columns: ColumnDef<IBooking>[] = [
    {
      header: "ক্লায়েন্ট তথ্য",
      accessorKey: "clientName",
      mobileLabel: "ক্লায়েন্ট",
      cell: (b) => (
        <div>
          <span className="font-semibold text-sm text-[#121813] font-display tracking-wide block">
            {b.clientName}
          </span>
          <span className="text-[10px] font-mono text-[#75787B] block mt-0.5">
            {b.clientEmail || "—"} {b.phone ? `• ${b.phone}` : ""}
          </span>
          {b.address && (
            <span className="text-[10px] text-[#75787B] block truncate max-w-xs">
              📍 {b.address}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "সার্ভিস ও বাজেট",
      accessorKey: "service",
      mobileLabel: "সার্ভিস",
      cell: (b) => (
        <div>
          <span className="font-medium text-xs text-[#2B4D33] font-mono block">
            {b.service}
          </span>
          <span className="text-[10px] text-[#75787B] font-mono block mt-0.5">
            বাজেট: {b.budgetRange || "Standard"}
          </span>
        </div>
      ),
    },
    {
      header: "বুকিং তারিখ",
      accessorKey: "bookingDate",
      mobileLabel: "তারিখ",
      cell: (b) => {
        const date = b.bookingDate ? new Date(b.bookingDate) : (b.createdAt ? new Date(b.createdAt) : null);
        return (
          <span className="font-mono text-xs text-[#121813]">
            {date ? date.toLocaleDateString("en-GB") : "—"}
          </span>
        );
      },
    },
    {
      header: "অ্যাসাইনকৃত স্টাফ",
      accessorKey: "assignedStaffId",
      mobileLabel: "স্টাফ",
      cell: (b) => {
        const bId = b.id || b._id;
        if (!bId) return null;
        const currentStaffId = b.assignedStaffId || "";

        return (
          <select
            value={currentStaffId}
            onChange={(e) => updateBooking(bId, undefined, e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#D6D2C4] bg-white text-xs font-mono text-[#121813] focus:outline-none focus:border-[#2B4D33] shadow-2xs cursor-pointer max-w-[190px] truncate"
          >
            <option value="">Unassigned (নির্ধারিত নেই)</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} {emp.designation ? `(${emp.designation})` : ""}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      header: "অবস্থা",
      accessorKey: "status",
      mobileLabel: "স্ট্যাটাস",
      cell: (b) => {
        const bId = b.id || b._id;
        const status = b.status || "Pending";
        const isPending = status.toLowerCase() === "pending";
        const isConfirmed = status.toLowerCase() === "confirmed";
        const isCompleted = status.toLowerCase() === "completed";

        return (
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${
                isPending
                  ? "bg-amber-50 text-amber-700 border-amber-300"
                  : isConfirmed
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                  : isCompleted
                  ? "bg-purple-50 text-purple-700 border-purple-300"
                  : "bg-stone-100 text-stone-700 border-stone-300"
              }`}
            >
              {status}
            </span>

            {/* Quick status change button */}
            {bId && (
              <button
                type="button"
                onClick={() =>
                  updateBooking(
                    bId,
                    isPending ? "Confirmed" : isConfirmed ? "Completed" : "Pending"
                  )
                }
                title="পরবর্তী স্ট্যাটাসে পরিবর্তন করুন"
                className="text-[10px] text-[#75787B] hover:text-[#2B4D33] font-bold p-1 cursor-pointer"
              >
                ↻
              </button>
            )}
          </div>
        );
      },
    },
    {
      header: "অ্যাকশন",
      className: "text-right",
      cell: (b) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setSelectedBooking(b)}
            className="p-1.5 text-xs text-[#2B4D33] hover:bg-[#2B4D33]/10 rounded-lg transition-colors cursor-pointer"
            title="বিস্তারিত দেখুন"
          >
            👁️
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(b)}
            className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="মুছে ফেলুন"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans text-[#121813]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 bg-[#E4E2D7] border border-[#D6D2C4] text-[#121813] rounded-2xl text-xs font-semibold animate-fade-in flex justify-between items-center shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2B4D33]"></span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-[#75787B] hover:text-[#121813] font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* ================= TOP HEADER & VIEW SWITCHER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#D6D2C4] bg-white text-[9px] font-mono uppercase tracking-[0.25em] text-[#2B4D33] font-bold mb-2 shadow-2xs">
            CLIENT BOOKINGS & SITE VISITS
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-light text-[#121813] tracking-wide uppercase leading-tight">
            ক্লায়েন্ট বুকিং ও সাইট অডিট
          </h2>
          <p className="text-xs font-sans font-light text-[#75787B] mt-0.5">
            সাইট ভিজিট শিডিউল, স্টাফ অ্যাসাইনমেন্ট এবং কানবান প্রগ্রেস ট্র্যাকিং।
          </p>
        </div>

        {/* View Switcher & CSV Export Button */}
        <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
          {/* CSV Export Button */}
          <button
            type="button"
            onClick={exportToCSV}
            className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-[#D6D2C4] rounded-2xl text-xs font-mono font-medium text-[#121813] shadow-2xs flex items-center gap-2 transition-colors cursor-pointer"
            title="Export bookings to CSV"
          >
            <span>📥</span>
            <span>CSV এক্সপোর্ট</span>
          </button>

          {/* 3 View Tabs: List | Calendar | Kanban */}
          <div className="bg-white border border-[#D6D2C4] p-1 rounded-2xl flex items-center shadow-2xs text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#2B4D33] text-white font-bold shadow-xs"
                  : "text-[#75787B] hover:text-[#121813]"
              }`}
            >
              তালিকা
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-[#2B4D33] text-white font-bold shadow-xs"
                  : "text-[#75787B] hover:text-[#121813]"
              }`}
            >
              ক্যালেন্ডার
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-[#2B4D33] text-white font-bold shadow-xs"
                  : "text-[#75787B] hover:text-[#121813]"
              }`}
            >
              কানবান
            </button>
          </div>
        </div>
      </div>

      {/* ================= VIEW 1: LIST VIEW (DATATABLE) ================= */}
      {viewMode === "list" && (
        <DataTable<IBooking>
          columns={columns}
          data={bookingsList}
          keyExtractor={(b, idx) => b.id || b._id || `booking-${idx}`}
          searchPlaceholder="ক্লায়েন্টের নাম, ইমেইল, ফোন বা সার্ভিস দিয়ে খুঁজুন..."
          emptyMessage="কোনো বুকিং পাওয়া যায়নি"
          emptyDescription="এখনো কোনো ক্লায়েন্ট বুকিং ডাটাবেসে নেই।"
          emptyIcon="📋"
          loading={loading}
        />
      )}

      {/* ================= VIEW 2: CALENDAR VIEW ================= */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-2xl border border-[#D6D2C4] p-5 sm:p-6 shadow-2xs flex flex-col gap-5">
          {/* Calendar Header with Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-[#D6D2C4]">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-display uppercase tracking-wider text-[#121813]">
                {monthNamesBn[currentDate.getMonth()]} {currentDate.getFullYear()}{" "}
                <span className="text-xs font-mono font-normal text-[#75787B]">
                  ({monthNamesEn[currentDate.getMonth()]})
                </span>
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={jumpToToday}
                className="px-3 py-1.5 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] transition-colors cursor-pointer"
              >
                আজ (Today)
              </button>
              <button
                type="button"
                onClick={prevMonth}
                className="px-3 py-1.5 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] transition-colors cursor-pointer font-bold"
                title="Previous Month"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="px-3 py-1.5 rounded-xl border border-[#D6D2C4] bg-white hover:bg-stone-50 text-[#121813] transition-colors cursor-pointer font-bold"
                title="Next Month"
              >
                ▶
              </button>
            </div>
          </div>

          {/* Desktop/Tablet Calendar Grid */}
          <div className="hidden sm:block">
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-mono uppercase tracking-wider text-[#75787B] font-bold">
              <span>রবি</span>
              <span>সোম</span>
              <span>মঙ্গল</span>
              <span>বুধ</span>
              <span>বৃহঃ</span>
              <span>শুক্র</span>
              <span>শনি</span>
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-2">
              {calendarData.map((cell, idx) => {
                if (!cell.day || !cell.dateStr) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      className="min-h-[90px] rounded-xl bg-stone-50/50 border border-transparent"
                    ></div>
                  );
                }

                const dayBookings = bookingsByDate[cell.dateStr] || [];

                return (
                  <div
                    key={cell.dateStr}
                    onClick={() => setSelectedCalendarDate(new Date(cell.dateStr!))}
                    className={`min-h-[90px] p-2 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                      cell.isToday
                        ? "bg-emerald-50/40 border-[#2B4D33]"
                        : "bg-white border-[#D6D2C4] hover:border-[#2B4D33]/50"
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                          cell.isToday
                            ? "bg-[#2B4D33] text-white"
                            : "text-[#121813]"
                        }`}
                      >
                        {cell.day}
                      </span>
                      {dayBookings.length > 0 && (
                        <span className="text-[10px] font-mono text-[#2B4D33] font-bold">
                          {dayBookings.length} বুকিং
                        </span>
                      )}
                    </div>

                    {/* Booking Badges */}
                    <div className="flex flex-col gap-1 mt-1 overflow-y-auto max-h-[60px] custom-scrollbar">
                      {dayBookings.map((b) => (
                        <div
                          key={b.id || b._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(b);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[9px] font-mono truncate font-semibold border ${
                            b.status === "Confirmed"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : b.status === "Completed"
                              ? "bg-purple-100 text-purple-800 border-purple-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          {b.clientName} ({b.service})
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Calendar: Agenda / List View for Small Screens */}
          <div className="block sm:hidden flex flex-col gap-3">
            <p className="text-xs font-mono text-[#75787B]">
              এই মাসের শিডিউলকৃত বুকিংস ({monthNamesBn[currentDate.getMonth()]}):
            </p>
            {Object.keys(bookingsByDate).length === 0 ? (
              <div className="p-6 border border-dashed border-[#D6D2C4] rounded-xl text-center text-[#75787B] text-xs font-mono">
                এই মাসে কোনো নির্ধারিত বুকিং নেই।
              </div>
            ) : (
              Object.entries(bookingsByDate).map(([dateKey, bList]) => (
                <div key={dateKey} className="bg-[#F7F6F2] p-3.5 rounded-xl border border-[#D6D2C4] space-y-2">
                  <div className="text-xs font-mono font-bold text-[#2B4D33] flex items-center justify-between">
                    <span>📅 {new Date(dateKey).toLocaleDateString("en-GB")}</span>
                    <span>{bList.length} বুকিং</span>
                  </div>
                  {bList.map((b) => (
                    <div
                      key={b.id || b._id}
                      onClick={() => setSelectedBooking(b)}
                      className="bg-white p-2.5 rounded-lg border border-[#D6D2C4] text-xs space-y-1"
                    >
                      <div className="font-bold text-[#121813]">{b.clientName}</div>
                      <div className="text-[#75787B] font-mono text-[10px]">{b.service} • {b.phone}</div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW 3: KANBAN BOARD ================= */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          
          {/* Column 1: অপেক্ষমাণ (Pending) */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Pending")}
            className="bg-[#F7F6F2] rounded-2xl border border-amber-200/80 p-4 flex flex-col gap-3 min-h-[450px]"
          >
            <div className="flex justify-between items-center pb-2 border-b border-amber-300/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#121813]">
                  অপেক্ষমাণ (Pending)
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {kanbanColumns.pending.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 flex-1">
              {kanbanColumns.pending.length === 0 ? (
                <div className="p-8 border border-dashed border-amber-200 rounded-xl text-center text-xs font-mono text-[#75787B] my-auto">
                  কোনো অপেক্ষমাণ বুকিং নেই
                </div>
              ) : (
                kanbanColumns.pending.map((b) => renderKanbanCard(b, "Pending"))
              )}
            </div>
          </div>

          {/* Column 2: অনুমোদিত (Confirmed) */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Confirmed")}
            className="bg-[#F7F6F2] rounded-2xl border border-emerald-200/80 p-4 flex flex-col gap-3 min-h-[450px]"
          >
            <div className="flex justify-between items-center pb-2 border-b border-emerald-300/40">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#121813]">
                  অনুমোদিত (Confirmed)
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {kanbanColumns.confirmed.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 flex-1">
              {kanbanColumns.confirmed.length === 0 ? (
                <div className="p-8 border border-dashed border-emerald-200 rounded-xl text-center text-xs font-mono text-[#75787B] my-auto">
                  কোনো অনুমোদিত বুকিং নেই
                </div>
              ) : (
                kanbanColumns.confirmed.map((b) => renderKanbanCard(b, "Confirmed"))
              )}
            </div>
          </div>

          {/* Column 3: সম্পন্ন (Completed) */}
          <div
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, "Completed")}
            className="bg-[#F7F6F2] rounded-2xl border border-[#2B4D33]/30 p-4 flex flex-col gap-3 min-h-[450px]"
          >
            <div className="flex justify-between items-center pb-2 border-b border-[#2B4D33]/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2B4D33]"></span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#121813]">
                  সম্পন্ন (Completed)
                </span>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#2B4D33]/15 text-[#2B4D33]">
                {kanbanColumns.completed.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5 flex-1">
              {kanbanColumns.completed.length === 0 ? (
                <div className="p-8 border border-dashed border-stone-200 rounded-xl text-center text-xs font-mono text-[#75787B] my-auto">
                  কোনো সম্পন্ন বুকিং নেই
                </div>
              ) : (
                kanbanColumns.completed.map((b) => renderKanbanCard(b, "Completed"))
              )}
            </div>
          </div>

        </div>
      )}

      {/* ================= DETAIL MODAL ================= */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="w-full max-w-lg bg-white border border-[#D6D2C4] rounded-3xl p-6 shadow-2xl relative text-[#121813] font-sans space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-[#D6D2C4] pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#2B4D33] font-bold uppercase tracking-wider">
                  BOOKING DETAILS
                </span>
                <h3 className="text-xl font-display uppercase tracking-wide text-[#121813]">
                  {selectedBooking.clientName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="text-[#75787B] hover:text-[#121813] text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#D6D2C4]">
                  <span className="font-mono text-[10px] text-[#75787B] uppercase block">সার্ভিস</span>
                  <span className="font-bold text-[#121813]">{selectedBooking.service}</span>
                </div>
                <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#D6D2C4]">
                  <span className="font-mono text-[10px] text-[#75787B] uppercase block">বাজেট</span>
                  <span className="font-mono font-bold text-[#121813]">{selectedBooking.budgetRange || "Standard"}</span>
                </div>
              </div>

              <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#D6D2C4] space-y-1">
                <span className="font-mono text-[10px] text-[#75787B] uppercase block">যোগাযোগ</span>
                <p className="font-mono">ইমেইল: {selectedBooking.clientEmail}</p>
                <p className="font-mono">ফোন: {selectedBooking.phone || "—"}</p>
                {selectedBooking.address && <p>ঠিকানা: {selectedBooking.address}</p>}
              </div>

              {selectedBooking.message && (
                <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#D6D2C4]">
                  <span className="font-mono text-[10px] text-[#75787B] uppercase block">ক্লায়েন্ট বার্তা</span>
                  <p className="mt-1 leading-relaxed text-[#323232]">{selectedBooking.message}</p>
                </div>
              )}

              <div className="bg-[#F7F6F2] p-3 rounded-xl border border-[#D6D2C4] flex items-center justify-between">
                <span className="font-mono text-[10px] text-[#75787B] uppercase">অ্যাসাইনকৃত স্টাফ</span>
                <span className="font-mono font-bold text-[#2B4D33]">
                  {selectedBooking.assignedStaff || selectedBooking.assignedStaffMember?.name || "Unassigned"}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 bg-[#2B4D33] text-white text-xs font-mono font-bold rounded-xl cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRM MODAL ================= */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="বুকিং মুছে ফেলুন"
        description="আপনি কি নিশ্চিত যে এই সাইট বুকিং রেকর্ডটি মুছে ফেলতে চান?"
        itemName={deleteTarget ? `${deleteTarget.clientName} (${deleteTarget.service})` : undefined}
        confirmLabel="হ্যাঁ, মুছে ফেলুন"
        cancelLabel="বাতিল"
        isLoading={isDeleting}
      />

    </div>
  );

  // Helper renderer for Kanban Cards
  function renderKanbanCard(b: IBooking, currentStatus: "Pending" | "Confirmed" | "Completed") {
    const bId = b.id || b._id;
    if (!bId) return null;

    return (
      <div
        key={bId}
        draggable
        onDragStart={(e) => handleDragStart(e, bId)}
        className="bg-white rounded-2xl p-4 border border-[#D6D2C4] shadow-2xs space-y-3 cursor-grab active:cursor-grabbing hover:border-[#2B4D33]/40 transition-all select-none"
      >
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="font-bold text-xs text-[#121813] font-display uppercase tracking-wide">
              {b.clientName}
            </h4>
            <span className="text-[10px] font-mono text-[#75787B] block mt-0.5">
              {b.service}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#75787B]">
            {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("en-GB") : ""}
          </span>
        </div>

        <div className="text-[11px] text-[#75787B] font-mono space-y-0.5">
          {b.phone && <p>📞 {b.phone}</p>}
          {b.address && <p className="truncate">📍 {b.address}</p>}
        </div>

        {/* Staff Assignment & Touch Status Dropdown */}
        <div className="pt-2 border-t border-[#D6D2C4] flex items-center justify-between gap-2">
          {/* Staff Selector */}
          <select
            value={b.assignedStaffId || ""}
            onChange={(e) => updateBooking(bId, undefined, e.target.value)}
            className="text-[10px] font-mono p-1 bg-[#F7F6F2] border border-[#D6D2C4] rounded-lg max-w-[130px] truncate cursor-pointer"
          >
            <option value="">স্টাফ নির্বাচন</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          {/* Touch-Friendly Status Switcher (Fallback for users without drag-and-drop) */}
          <select
            value={currentStatus}
            onChange={(e) => updateBooking(bId, e.target.value as any)}
            className="text-[10px] font-mono font-bold p-1 bg-white border border-[#D6D2C4] rounded-lg cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
    );
  }
}
