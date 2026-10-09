"use client";

import React, { useState, useEffect } from "react";
import { IService } from "@/types";

interface ServicesTabProps {
  services?: IService[];
  serviceLabel: string;
  setServiceLabel: (val: string) => void;
  serviceDesc: string;
  setServiceDesc: (val: string) => void;
  serviceIcon: string;
  setServiceIcon: (val: string) => void;
  editingService: IService | null;
  setEditingService: (val: IService | null) => void;
  handleCreateOrUpdateService: (e: React.FormEvent, payload?: any) => void;
  handleEditServiceClick: (service: IService) => void;
  handleDeleteService: (id?: string) => void;
}

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
}: ServicesTabProps) {
  // Extra fields for Service-specific SEO & banner images
  const [banner, setBanner] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [showSeo, setShowSeo] = useState(false);

  // Sync state if editing
  useEffect(() => {
    if (editingService) {
      setBanner(editingService.banner || editingService.bannerImage || "");
      setSeoTitle((editingService as any).seoTitle || "");
      setSeoKeywords((editingService as any).seoKeywords || "");
      setSeoDescription((editingService as any).seoDescription || "");
    } else {
      setBanner("");
      setSeoTitle("");
      setSeoKeywords("");
      setSeoDescription("");
    }
  }, [editingService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7]">
      <div>
        <h3 className="font-sans font-bold text-lg text-white">সার্ভিস ক্যাটালগ • Services Catalog</h3>
        <p className="text-xs text-stone-400 mt-0.5">Configure landing pages offering cards, banner images, and specific SEO page metadata tags.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} autoComplete="off" className="bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider font-mono">
          {editingService ? `Edit Details: ${editingService.label || editingService.title}` : "Add New Offering Product"}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            required
            autoComplete="off"
            placeholder="Service Name (e.g. Lawn Gardening)"
            value={serviceLabel}
            onChange={(e) => setServiceLabel(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <input 
            type="text" 
            required
            autoComplete="off"
            placeholder="Icon Emoji (e.g. 🏡)"
            value={serviceIcon}
            onChange={(e) => setServiceIcon(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-center text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <input 
            type="text" 
            autoComplete="off"
            placeholder="Banner Image URL (Optional)"
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
        </div>
        
        <textarea 
          required
          autoComplete="off"
          rows={2}
          placeholder="Service description details..."
          value={serviceDesc}
          onChange={(e) => setServiceDesc(e.target.value)}
          className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs resize-none text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
        />

        {/* Collapsible SEO Section */}
        <div className="border-t border-white/10 pt-3">
          <button 
            type="button" 
            onClick={() => setShowSeo(!showSeo)} 
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer font-mono"
          >
            <span>{showSeo ? "▼ Hide" : "▶ Show"} SEO Metadata Settings</span>
          </button>
          
          {showSeo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 animate-fade-in-up">
              <input 
                type="text" 
                autoComplete="off"
                placeholder="SEO Title Tag"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
              <input 
                type="text" 
                autoComplete="off"
                placeholder="SEO Keywords (comma separated)"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
              <input 
                type="text" 
                autoComplete="off"
                placeholder="SEO Meta Description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 self-end">
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 transition-all">
            {editingService ? "Save Service" : "Add Service"}
          </button>
          {editingService && (
            <button 
              type="button" 
              onClick={() => { setEditingService(null); setServiceLabel(""); setServiceDesc(""); }} 
              className="bg-white/10 hover:bg-white/20 text-white font-bold font-mono text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List Services */}
      <div className="flex flex-col gap-3 mt-2">
        <h4 className="font-sans font-bold text-sm text-white font-mono">Existing Offerings ({services.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(s => (
            <div key={s.id || s._id} className="bg-black/30 border border-white/10 p-5 rounded-2xl flex justify-between items-center shadow-lg hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon || "🌱"}</span>
                <div>
                  <span className="font-bold text-white text-xs block">{s.label || s.title}</span>
                  <span className="block text-[11px] text-stone-400 mt-0.5 leading-normal max-w-[220px]">{s.desc || s.description}</span>
                  {(s as any).seoTitle && <span className="inline-block bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[9px] font-mono rounded px-2 py-0.5 mt-2">SEO Configured</span>}
                </div>
              </div>
              <div className="flex gap-3 text-xs shrink-0 ml-3 font-mono">
                <button type="button" onClick={() => handleEditServiceClick(s)} className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer">Edit</button>
                <button type="button" onClick={() => handleDeleteService(s.id || s._id)} className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
