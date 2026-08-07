"use client";

import React from "react";

export default function ServicesTab({
  services = [],
  serviceLabel,
  setServiceLabel,
  serviceDesc,
  setServiceDesc,
  serviceIcon,
  setServiceIcon,
  editingService,
  setEditingService,
  handleCreateOrUpdateService,
  handleEditServiceClick,
  handleDeleteService
}) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-serif font-bold text-lg text-[#0c1911]">Products (Services Manager)</h3>
        <p className="text-xs text-slate-400 mt-0.5">Manage offering services, icons, and descriptions.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateOrUpdateService} className="bg-[#f8faf9] p-6 rounded-[24px] border border-slate-200/60 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-[#0c1911] uppercase tracking-wider">
          {editingService ? `Edit Details: ${editingService.label}` : "Add New Offering Product"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            required
            placeholder="Service Name (e.g. Lawn Gardening)"
            value={serviceLabel}
            onChange={(e) => setServiceLabel(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <input 
            type="text" 
            required
            placeholder="Icon Emoji (e.g. 🏡)"
            value={serviceIcon}
            onChange={(e) => setServiceIcon(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-center text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-[#0c1911] hover:bg-black text-[#8ac343] font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all">
              {editingService ? "Save Service" : "Add Service"}
            </button>
            {editingService && (
              <button type="button" onClick={() => { setEditingService(null); setServiceLabel(""); setServiceDesc(""); }} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                Cancel
              </button>
            )}
          </div>
        </div>
        <textarea 
          required
          rows={2}
          placeholder="Short description snippet..."
          value={serviceDesc}
          onChange={(e) => setServiceDesc(e.target.value)}
          className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800 focus:outline-none focus:border-[#0c1911]"
        />
      </form>

      {/* List Services */}
      <div className="flex flex-col gap-2 mt-2">
        <h4 className="font-serif font-bold text-sm text-[#0c1911]">Existing Offerings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8ac343]/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon || "🌱"}</span>
                <div>
                  <span className="font-bold text-[#0c1911] text-xs">{s.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal">{s.desc}</span>
                </div>
              </div>
              <div className="flex gap-3 text-xs shrink-0 ml-3">
                <button type="button" onClick={() => handleEditServiceClick(s)} className="text-[#8ac343] hover:underline font-bold">Edit</button>
                <button type="button" onClick={() => handleDeleteService(s._id)} className="text-red-500 hover:underline font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
