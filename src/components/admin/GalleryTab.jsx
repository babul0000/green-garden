"use client";

import React, { useState, useEffect } from "react";

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
}) {
  const [applyWatermark, setApplyWatermark] = useState(true);

  useEffect(() => {
    if (editingGallery) {
      setApplyWatermark(editingGallery.watermarked !== false);
    }
  }, [editingGallery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Inject watermark flag
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
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-sans font-bold text-lg text-[#06120c]">Gallery & Visuals Showcase</h3>
        <p className="text-xs text-slate-400 mt-0.5">Upload project visual portfolio comparison sliders and manage branding watermark protection options.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-[#f8faf9] p-6 rounded-[24px] border border-slate-200/60 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-[#06120c] uppercase tracking-wider">
          {editingGallery ? `Edit Photo: ${editingGallery.title}` : "Upload New Gallery Item"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            required
            placeholder="Photo Title"
            value={galTitle}
            onChange={(e) => setGalTitle(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none"
          />
          <select 
            value={galCategory}
            onChange={(e) => setGalCategory(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option>Rooftop</option>
            <option>Vertical</option>
            <option>Landscape</option>
            <option>Indoor</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            required
            placeholder="After Image URL (Main photo)"
            value={galUrl}
            onChange={(e) => setGalUrl(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none"
          />
          <input 
            type="text" 
            placeholder="Before Image URL (Optional, for slider)"
            value={galBeforeUrl}
            onChange={(e) => setGalBeforeUrl(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none"
          />
        </div>
        <input 
          type="text" 
          placeholder="Short photo caption details..."
          value={galCaption}
          onChange={(e) => setGalCaption(e.target.value)}
          className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none"
        />

        {/* Watermark toggle option */}
        <label className="flex items-center gap-2 text-xs text-[#06120c] font-semibold cursor-pointer">
          <input 
            type="checkbox" 
            checked={applyWatermark}
            onChange={(e) => setApplyWatermark(e.target.checked)}
            className="w-4 h-4 rounded accent-[#91cd3d]"
          />
          <span>Apply automatic "AR Green Garden" watermark overlay to visual assets?</span>
        </label>

        <div className="flex gap-2">
          <button type="submit" className="bg-[#06120c] hover:bg-black text-[#8fc63f] font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm">
            {editingGallery ? "Update Photo" : "Upload Photo"}
          </button>
          {editingGallery && (
            <button 
              type="button" 
              onClick={() => { setEditingGallery(null); setGalTitle(""); setGalUrl(""); setGalBeforeUrl(""); setGalCaption(""); }} 
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List Gallery */}
      <div className="flex flex-col gap-2 mt-2">
        <h4 className="font-sans font-bold text-sm text-[#06120c]">Gallery Showcase Images ({gallery.length})</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gallery.map(g => (
            <div key={g._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8fc63f]/30 transition-colors text-xs">
              <div className="flex items-center gap-3">
                {g.imageUrl && (
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 relative">
                    <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                    {g.watermarked !== false && <span className="absolute bottom-0 right-0 bg-[#06120c]/70 text-white text-[5px] px-1 font-bold">WM</span>}
                  </div>
                )}
                <div>
                  <span className="font-bold text-[#06120c] block">{g.title}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Category: {g.category} {g.beforeImageUrl && "• Comparison Slider"}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleEditGalleryClick(g)} className="text-[#8fc63f] hover:underline font-bold">Edit</button>
                <button type="button" onClick={() => handleDeleteGallery(g._id)} className="text-red-500 hover:underline font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
