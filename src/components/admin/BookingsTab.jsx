"use client";

import React, { useState } from "react";

export default function BookingsTab({ bookings = [], handleUpdateBooking, handleDeleteBooking }) {
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  
  // Basic current month calendar generator (August 2026)
  const daysInMonth = 31;
  const startDayOffset = 6; // Aug 1, 2026 starts on Saturday (0: Sun, 6: Sat)
  const calendarCells = Array.from({ length: startDayOffset }).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const getBookingsForDay = (day) => {
    if (!day) return [];
    return bookings.filter(b => {
      const date = b.bookingDate ? new Date(b.bookingDate) : new Date();
      // Match day and month (assuming current month/year for simple visualization)
      return date.getDate() === day;
    });
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-sans font-bold text-lg text-[#06120c]">Booking & Audit Inquiries</h3>
          <p className="text-xs text-slate-400 mt-0.5">Approve slots, assign experts, and check scheduled audit locations.</p>
        </div>

        {/* View Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-[10px] font-bold text-slate-600">
          <button 
            type="button" 
            onClick={() => setViewMode("list")} 
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === "list" ? "bg-white text-[#06120c] shadow-sm" : "hover:text-black"}`}
          >
            List View
          </button>
          <button 
            type="button" 
            onClick={() => setViewMode("calendar")} 
            className={`px-3 py-1.5 rounded-lg transition-all ${viewMode === "calendar" ? "bg-white text-[#06120c] shadow-sm" : "hover:text-black"}`}
          >
            Calendar View
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[9px]">
                <th className="pb-3">Client</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Budget Standard</th>
                <th className="pb-3">Assigned Staff</th>
                <th className="pb-3">State</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">No bookings found.</td>
                </tr>
              ) : (
                bookings.map(b => (
                  <tr key={b._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-semibold text-[#0c1911]">
                      {b.clientName}
                      <span className="block text-[10px] font-normal text-slate-400 mt-0.5">{b.clientEmail} • {b.phone}</span>
                    </td>
                    <td className="py-4 text-[#0c1911] font-medium">{b.service}</td>
                    <td className="py-4 text-slate-500">{b.budgetRange || "Standard"}</td>
                    <td className="py-4">
                      <select 
                        value={b.assignedStaff || "Unassigned"}
                        onChange={(e) => handleUpdateBooking(b._id, b.status, e.target.value)}
                        className="bg-white border border-slate-200 py-1.5 px-2.5 rounded-xl text-[10px] focus:outline-none text-slate-700 font-semibold"
                      >
                        <option value="Unassigned">Unassigned</option>
                        <option value="Ar. Sultana Yasmin">Ar. Sultana Yasmin</option>
                        <option value="Dr. Rafiqul Islam">Dr. Rafiqul Islam</option>
                        <option value="Tanvir Ahmed">Tanvir Ahmed</option>
                      </select>
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider ${
                        b.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : b.status === "Completed" ? "bg-[#06120c] text-[#8fc63f]" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-4 text-right flex gap-1.5 justify-end items-center h-full">
                      <button 
                        type="button"
                        onClick={() => handleUpdateBooking(b._id, "Confirmed", b.assignedStaff || "Ar. Sultana Yasmin")}
                        className="bg-[#8fc63f]/10 hover:bg-[#8fc63f] text-emerald-800 hover:text-white px-2.5 py-1.5 rounded-xl text-[9px] font-bold transition-all cursor-pointer"
                      >
                        Confirm
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleUpdateBooking(b._id, "Completed", b.assignedStaff || "Ar. Sultana Yasmin")}
                        className="bg-[#06120c] hover:bg-black text-[#8fc63f] px-2.5 py-1.5 rounded-xl text-[9px] font-bold transition-all cursor-pointer"
                      >
                        Complete
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteBooking(b._id)}
                        className="text-red-500 hover:text-red-700 px-1 py-1 text-xs cursor-pointer"
                      >
                        🗑️
                      </button>
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
          <div className="text-center font-bold text-xs text-[#06120c] py-2 bg-slate-50 border border-slate-100 rounded-xl">
            August 2026
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] text-slate-400 uppercase tracking-wider mb-1">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarCells.map((cell, idx) => {
              const dayBookings = getBookingsForDay(cell);
              return (
                <div 
                  key={idx} 
                  className={`min-h-[70px] border border-slate-100 p-1.5 rounded-xl flex flex-col justify-between ${
                    cell ? "bg-slate-50/50 hover:bg-slate-50" : "bg-transparent border-0"
                  }`}
                >
                  <span className="text-[9px] font-bold text-slate-400 self-start">{cell || ""}</span>
                  {dayBookings.length > 0 && (
                    <div className="flex flex-col gap-0.5 mt-1 overflow-y-auto max-h-[45px]">
                      {dayBookings.map(db => (
                        <div 
                          key={db._id} 
                          title={`${db.clientName} - ${db.service}`}
                          className={`text-[7px] font-bold px-1 py-0.5 rounded truncate ${
                            db.status === "Completed" ? "bg-[#06120c] text-white" : "bg-[#8fc63f]/20 text-emerald-800"
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
