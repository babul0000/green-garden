"use client";

import React from "react";

export default function BookingsTab({ bookings = [], handleUpdateBooking, handleDeleteBooking }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-serif font-bold text-lg text-[#0c1911]">Transactions (Booking Records)</h3>
        <p className="text-xs text-slate-400 mt-0.5">Manage booking slots, change status (Pending/Confirmed/Completed), and allocate expert staff.</p>
      </div>

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
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                      b.status === "Confirmed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : b.status === "Completed" ? "bg-[#0c1911] text-white" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 text-right flex gap-1.5 justify-end items-center h-full">
                    <button 
                      type="button"
                      onClick={() => handleUpdateBooking(b._id, "Confirmed", b.assignedStaff || "Ar. Sultana Yasmin")}
                      className="bg-[#8ac343]/10 hover:bg-[#8ac343] text-emerald-800 hover:text-white px-2 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleUpdateBooking(b._id, "Completed", b.assignedStaff || "Ar. Sultana Yasmin")}
                      className="bg-[#0c1911] hover:bg-black text-[#8ac343] px-2 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
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
    </div>
  );
}
