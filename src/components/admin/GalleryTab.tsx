"use client";

import React, { useState, useEffect } from "react";
import { IGalleryItem } from "@/types";

interface GalleryTabProps {
  gallery?: IGalleryItem[];
  galTitle: string;
  setGalTitle: (val: string) => void;
  galUrl: string;
  setGalUrl: (val: string) => void;
  galBeforeUrl: string;
  setGalBeforeUrl: (val: string) => void;
  galCategory: string;
  setGalCategory: (val: string) => void;
  galCaption: string;
  setGalCaption: (val: string) => void;
  editingGallery: IGalleryItem | null;
  setEditingGallery: (item: IGalleryItem | null) => void;
  handleCreateOrUpdateGallery: (e: React.FormEvent, payload?: any) => void;
  handleEditGalleryClick: (item: IGalleryItem) => void;
  handleDeleteGallery: (id?: string) => void;
}

export default function GalleryTab({
  gallery = [],
  galTitle,
  setGalTitle,
  galUrl,
  setGalUrl,
  galBeforeUrl,
  setGalBeforeUrl,
  galCategory,
  setGalCategory,
  galCaption,
  setGalCaption,
  editingGallery,
  setEditingGallery,
  handleCreateOrUpdateGallery,
  handleEditGalleryClick,
  handleDeleteGallery
}: GalleryTabProps) {
  const [applyWatermark, setApplyWatermark] = useState(true);

  useEffect(() => {
    if (editingGallery) {
      setApplyWatermark(editingGallery.watermarked !== false);
    }
  }, [editingGallery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: galTitle,
      category: galCategory,
      imageUrl: galUrl,
      beforeImageUrl: galBeforeUrl,
      caption: galCaption,
      watermarked: applyWatermark
    };
    handleCreateOrUpdateGallery(e, payload);
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7]">
      <div>
        <h3 className="font-sans font-bold text-lg text-white">বিফোর-আফটার গ্যালারি • Visuals Showcase</h3>
        <p className="text-xs text-stone-400 mt-0.5">Upload project visual portfolio comparison sliders and manage branding watermark protection options.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider font-mono">
          {editingGallery ? `Edit Photo: ${editingGallery.title}` : "Upload New Gallery Item"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            required
            placeholder="Photo Title"
            value={galTitle}
            onChange={(e) => setGalTitle(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <select 
            value={galCategory}
            onChange={(e) => setGalCategory(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-emerald-400"
          >
            <option className="bg-[#121A14]">Rooftop</option>
            <option className="bg-[#121A14]">Vertical</option>
            <option className="bg-[#121A14]">Landscape</option>
            <option className="bg-[#121A14]">Indoor</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            required
            placeholder="After Image URL (Main photo)"
            value={galUrl}
            onChange={(e) => setGalUrl(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <input 
            type="text" 
            placeholder="Before Image URL (Optional, for slider)"
            value={galBeforeUrl}
            onChange={(e) => setGalBeforeUrl(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
        </div>
        <input 
          type="text" 
          placeholder="Short photo caption details..."
          value={galCaption}
          onChange={(e) => setGalCaption(e.target.value)}
          className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
        />

        {/* Watermark toggle option */}
        <label className="flex items-center gap-2 text-xs text-stone-300 font-semibold cursor-pointer">
          <input 
            type="checkbox" 
            checked={applyWatermark}
            onChange={(e) => setApplyWatermark(e.target.checked)}
            className="w-4 h-4 rounded accent-emerald-500"
          />
          <span>Apply automatic "AR Green Garden" watermark overlay to visual assets?</span>
        </label>

        <div className="flex gap-2">
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 transition-all">
            {editingGallery ? "Update Photo" : "Upload Photo"}
          </button>
          {editingGallery && (
            <button 
              type="button" 
              onClick={() => { setEditingGallery(null); setGalTitle(""); setGalUrl(""); setGalBeforeUrl(""); setGalCaption(""); }} 
              className="bg-white/10 hover:bg-white/20 text-white font-bold font-mono text-xs py-2.5 px-4 rounded-xl cursor-pointer transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List Gallery */}
      <div className="flex flex-col gap-3 mt-2">
        <h4 className="font-sans font-bold text-sm text-white font-mono">Gallery Showcase Images ({gallery.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gallery.map(g => (
            <div key={g.id || g._id} className="bg-black/30 border border-white/10 p-4 rounded-2xl flex justify-between items-center shadow-lg hover:border-emerald-500/40 transition-colors text-xs">
              <div className="flex items-center gap-3">
                {g.imageUrl && (
                  <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                    {g.watermarked !== false && <span className="absolute bottom-0 right-0 bg-[#06120c]/85 text-emerald-400 text-[6px] px-1 font-bold font-mono">WM</span>}
                  </div>
                )}
                <div>
                  <span className="font-bold text-white block">{g.title}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">Category: {g.category} {g.beforeImageUrl && "• Comparison Slider"}</span>
                </div>
              </div>
              <div className="flex gap-3 font-mono">
                <button type="button" onClick={() => handleEditGalleryClick(g)} className="text-emerald-400 hover:text-emerald-300 font-bold cursor-pointer">Edit</button>
                <button type="button" onClick={() => handleDeleteGallery(g.id || g._id)} className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
