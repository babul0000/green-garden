"use client";

import React, { useState, useEffect } from "react";

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
  // Extra fields for Service-specific SEO & banner images
  const [banner, setBanner] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [showSeo, setShowSeo] = useState(false);

  // Sync state if editing
  useEffect(() => {
    if (editingService) {
      setBanner(editingService.banner || "");
      setSeoTitle(editingService.seoTitle || "");
      setSeoKeywords(editingService.seoKeywords || "");
      setSeoDescription(editingService.seoDescription || "");
    } else {
      setBanner("");
      setSeoTitle("");
      setSeoKeywords("");
      setSeoDescription("");
    }
  }, [editingService]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Inject extra fields into the submit callback
    // We modify handleCreateOrUpdateService to read these or pass them.
    // In page.js we can handle service payload dynamically.
    const servicePayload = {
      label: serviceLabel,
      icon: serviceIcon,
      desc: serviceDesc,
      banner,
      seoTitle,
      seoKeywords,
      seoDescription
    };
    handleCreateOrUpdateService(e, servicePayload);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-sans font-bold text-lg text-[#06120c]">Services catalog (Branding & CRUD)</h3>
        <p className="text-xs text-slate-400 mt-0.5">Configure landing pages offering cards, banner images, and specific SEO page metadata tags.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#f8faf9] p-6 rounded-[24px] border border-slate-200/60 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-[#06120c] uppercase tracking-wider">
          {editingService ? `Edit Details: ${editingService.label}` : "Add New Offering Product"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            required
            placeholder="Service Name (e.g. Lawn Gardening)"
            value={serviceLabel}
            onChange={(e) => setServiceLabel(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#06120c]"
          />
          <input 
            type="text" 
            required
            placeholder="Icon Emoji (e.g. 🏡)"
            value={serviceIcon}
            onChange={(e) => setServiceIcon(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-center text-slate-800 focus:outline-none focus:border-[#06120c]"
          />
          <input 
            type="text" 
            placeholder="Banner Image URL (Optional)"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#06120c]"
          />
        </div>
        
        <textarea 
          required
          rows={2}
          placeholder="Service description details..."
          value={serviceDesc}
          onChange={(e) => setServiceDesc(e.target.value)}
          className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800 focus:outline-none focus:border-[#06120c]"
        />

        {/* Collapsible SEO Section */}
        <div className="border-t border-slate-200/60 pt-3">
          <button 
            type="button" 
            onClick={() => setShowSeo(!showSeo)} 
            className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <span>{showSeo ? "▼ Hide" : "▶ Show"} SEO Metadata Settings</span>
          </button>
          
          {showSeo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 animate-fade-in-up">
              <input 
                type="text" 
                placeholder="SEO Title Tag"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
              />
              <input 
                type="text" 
                placeholder="SEO Keywords (comma separated)"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
              />
              <input 
                type="text" 
                placeholder="SEO Meta Description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 self-end">
          <button type="submit" className="bg-[#06120c] hover:bg-black text-[#8fc63f] font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm">
            {editingService ? "Save Service" : "Add Service"}
          </button>
          {editingService && (
            <button 
              type="button" 
              onClick={() => { setEditingService(null); setServiceLabel(""); setServiceDesc(""); }} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List Services */}
      <div className="flex flex-col gap-2 mt-2">
        <h4 className="font-sans font-bold text-sm text-[#06120c]">Existing Offerings ({services.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s._id} className="bg-white border border-slate-100 p-5 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8fc63f]/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon || "🌱"}</span>
                <div>
                  <span className="font-bold text-[#06120c] text-xs block">{s.label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5 leading-normal max-w-[180px]">{s.desc}</span>
                  {s.seoTitle && <span className="inline-block bg-slate-50 text-slate-400 border border-slate-100 text-[8px] font-mono rounded px-1.5 py-0.5 mt-2">SEO Configured</span>}
                </div>
              </div>
              <div className="flex gap-3 text-xs shrink-0 ml-3">
                <button type="button" onClick={() => handleEditServiceClick(s)} className="text-[#8fc63f] hover:underline font-bold">Edit</button>
                <button type="button" onClick={() => handleDeleteService(s._id)} className="text-red-500 hover:underline font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
