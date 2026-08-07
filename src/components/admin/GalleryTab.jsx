"use client";

import React from "react";

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
  return (
    <div className="bg-white p-6 md:p-8 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-serif font-bold text-lg text-[#0c1911]">Customers (Gallery Editor)</h3>
        <p className="text-xs text-slate-400 mt-0.5">Edit gallery pictures and Before-After comparison slider images.</p>
      </div>

      {/* Form */}
      <form onSubmit={handleCreateOrUpdateGallery} className="bg-[#f8faf9] p-6 rounded-[24px] border border-slate-200/60 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-[#0c1911] uppercase tracking-wider">
          {editingGallery ? `Edit Photo: ${editingGallery.title}` : "Upload New Gallery Item"}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            type="text" 
            required
            placeholder="Photo Title"
            value={galTitle}
            onChange={(e) => setGalTitle(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
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
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
          <input 
            type="text" 
            placeholder="Before Image URL (Optional, for slider)"
            value={galBeforeUrl}
            onChange={(e) => setGalBeforeUrl(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
          />
        </div>
        <input 
          type="text" 
          placeholder="Short photo caption details..."
          value={galCaption}
          onChange={(e) => setGalCaption(e.target.value)}
          className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0c1911]"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-[#0c1911] hover:bg-black text-[#8ac343] font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-sm">
            {editingGallery ? "Update Photo" : "Upload Photo"}
          </button>
          {editingGallery && (
            <button type="button" onClick={() => { setEditingGallery(null); setGalTitle(""); setGalUrl(""); setGalBeforeUrl(""); setGalCaption(""); }} className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List Gallery */}
      <div className="flex flex-col gap-2 mt-2">
        <h4 className="font-serif font-bold text-sm text-[#0c1911]">Gallery Showcase Images</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gallery.map(g => (
            <div key={g._id} className="bg-white border border-slate-100 p-4 rounded-[20px] flex justify-between items-center shadow-sm hover:border-[#8ac343]/30 transition-colors text-xs">
              <div>
                <span className="font-bold text-[#0c1911] block">{g.title}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Category: {g.category} {g.beforeImageUrl && "• (Comparison slider enabled)"}</span>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => handleEditGalleryClick(g)} className="text-[#8ac343] hover:underline font-bold">Edit</button>
                <button type="button" onClick={() => handleDeleteGallery(g._id)} className="text-red-500 hover:underline font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
