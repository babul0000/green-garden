"use client";

import React, { useState } from "react";
import { IBooking } from "@/types";

interface BookingsTabProps {
  bookings?: IBooking[];
  handleUpdateBooking: (id?: string, status?: string, assignedStaff?: string) => void;
  handleDeleteBooking: (id?: string) => void;
}

export default function BookingsTab({ bookings = [], handleUpdateBooking, handleDeleteBooking }: BookingsTabProps) {
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  
  // Basic current month calendar generator (August 2026)
  const daysInMonth = 31;
  const startDayOffset = 6; // Aug 1, 2026 starts on Saturday (0: Sun, 6: Sat)
  const calendarCells: (number | null)[] = [
    ...Array(startDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ];

  const getBookingsForDay = (day: number | null) => {
    if (!day) return [];
    return bookings.filter(b => {
      const date = b.bookingDate ? new Date(b.bookingDate) : new Date();
      return date.getDate() === day;
    });
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-sans font-bold text-lg text-white">জেনারেল বুকিংস • Booking & Audit Inquiries</h3>
          <p className="text-xs text-stone-400 mt-0.5">Approve slots, assign experts, and check scheduled audit locations.</p>
        </div>

        {/* View Switcher */}
        <div className="bg-black/40 border border-white/10 p-1 rounded-xl flex gap-1 text-xs font-bold font-mono">
          <button 
            type="button" 
            onClick={() => setViewMode("list")} 
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "text-white/60 hover:text-white"}`}
          >
            List View
          </button>
          <button 
            type="button" 
            onClick={() => setViewMode("calendar")} 
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "calendar" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "text-white/60 hover:text-white"}`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="overflow-x-auto w-full rounded-2xl border border-white/10 bg-black/30">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-stone-400 font-bold font-mono uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Budget Standard</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400 italic font-mono">No bookings found.</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b.id || b._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {b.clientName}
                      <span className="block text-[10px] font-normal text-stone-400 font-mono mt-0.5">{b.clientEmail} • {b.phone}</span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-200 font-medium">{b.service}</td>
                    <td className="py-3.5 px-4 text-stone-300 font-mono">{b.budgetRange || "Standard"}</td>
                    <td className="py-3.5 px-4">
                      <select 
                        value={b.assignedStaff || "Unassigned"}
                        onChange={(e) => handleUpdateBooking(b.id || b._id, b.status, e.target.value)}
                        className="bg-black/50 border border-white/15 py-1.5 px-2.5 rounded-xl text-xs text-white font-semibold focus:border-emerald-400 focus:outline-none"
                      >
                        <option value="Unassigned" className="bg-[#121A14]">Unassigned</option>
                        <option value="Ar. Sultana Yasmin" className="bg-[#121A14]">Ar. Sultana Yasmin</option>
                        <option value="Dr. Rafiqul Islam" className="bg-[#121A14]">Dr. Rafiqul Islam</option>
                        <option value="Tanvir Ahmed" className="bg-[#121A14]">Tanvir Ahmed</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase tracking-wider ${
                        b.status === "Confirmed" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : b.status === "Completed" ? "bg-purple-500/15 text-purple-300 border border-purple-500/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex gap-1.5 justify-end items-center font-mono">
                        <button 
                          type="button"
                          onClick={() => handleUpdateBooking(b.id || b._id, "Confirmed", b.assignedStaff || "Ar. Sultana Yasmin")}
                          className="bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleUpdateBooking(b.id || b._id, "Completed", b.assignedStaff || "Ar. Sultana Yasmin")}
                          className="bg-white/10 hover:bg-white/20 text-white border border-white/15 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all cursor-pointer"
                        >
                          Complete
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleDeleteBooking(b.id || b._id)}
                          className="text-rose-400 hover:text-rose-300 px-1 py-1 text-xs cursor-pointer transition-colors"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* Calendar view grid */
        <div className="flex flex-col gap-4 animate-fade-in-up">
          <div className="text-center font-bold text-xs text-white py-2.5 bg-black/40 border border-white/10 rounded-xl font-mono">
            August 2026
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-stone-400 font-mono uppercase tracking-wider mb-1">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              const dayBookings = getBookingsForDay(cell);
              return (
                <div 
                  key={idx} 
                  className={`min-h-[70px] border border-white/10 p-1.5 rounded-xl flex flex-col justify-between ${
                    cell ? "bg-black/30 hover:bg-white/[0.04]" : "bg-transparent border-0"
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-stone-400 self-start">{cell || ""}</span>
                  {dayBookings.length > 0 && (
                    <div className="flex flex-col gap-0.5 mt-1 overflow-y-auto max-h-[45px]">
                      {dayBookings.map(db => (
                        <div 
                          key={db._id} 
                          title={`${db.clientName} - ${db.service}`}
                          className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded truncate ${
                            db.status === "Completed" ? "bg-purple-900/60 text-purple-200 border border-purple-600/40" : "bg-emerald-900/60 text-emerald-200 border border-emerald-600/40"
                          }`}
                        >
                          {db.clientName}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
