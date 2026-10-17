"use client";

import React, { useState } from "react";
import { IGalleryItem } from "@/types";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";

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
  handleDeleteGallery,
}: GalleryTabProps) {
  const [deleteTarget, setDeleteTarget] = useState<IGalleryItem | null>(null);
  const [activeUploadTab, setActiveUploadTab] = useState<"after" | "before">("after");
  const [isReordering, setIsReordering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: galTitle,
      category: galCategory,
      imageUrl: galUrl,
      beforeImageUrl: galBeforeUrl || null,
      caption: galCaption,
    };
    handleCreateOrUpdateGallery(e, payload);
  };

  // Up/Down reordering handler
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (isReordering) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= gallery.length) return;

    const newItems = [...gallery];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setIsReordering(true);
    try {
      const payload = {
        items: newItems.map((item, idx) => ({
          id: item.id || (item as any)._id,
          order: idx,
        })),
      };
      await fetch("/api/gallery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to reorder gallery:", err);
    } finally {
      setIsReordering(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans text-[#121813]">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-display font-light tracking-wide uppercase text-[#121813]">
              🖼️ বিফোর-আফটার গ্যালারি ও ভিজ্যুয়াল শোকেস
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2B4D33] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] border border-[#2B4D33]/20">
              Gallery Manager
            </span>
          </div>
          <p className="text-xs text-[#75787B] font-light mt-1">
            ল্যান্ডস্কেপ প্রকল্পসমূহের ছবি ও বিফোর-আফটার স্লাইডার আপলোড, ক্লাউডিনারি আপলোডার এবং ড্র্যাগ/বাটন ভিত্তিক ক্রম পরিবর্তন।
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-7 rounded-2xl border border-[#D6D2C4] shadow-2xs flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-[#2B4D33] uppercase tracking-wider font-mono">
            {editingGallery ? `✏️ ছবি এডিট করুন: ${editingGallery.title}` : "➕ নতুন গ্যালারি ছবি যোগ করুন"}
          </h4>
          {editingGallery && (
            <button
              type="button"
              onClick={() => {
                setEditingGallery(null);
                setGalTitle("");
                setGalUrl("");
                setGalBeforeUrl("");
                setGalCaption("");
              }}
              className="text-xs font-mono font-bold text-[#75787B] hover:text-[#121813] cursor-pointer min-h-[44px] px-2 flex items-center"
            >
              ✕ এডিট বাতিল
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">ছবির শিরোনাম</label>
            <input
              type="text"
              required
              placeholder="যেমন: ধানমন্ডি রুফটপ গার্ডেন - মূল ড্রাইভওয়ে"
              value={galTitle}
              onChange={(e) => setGalTitle(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">ক্যাটাগরি</label>
            <select
              value={galCategory}
              onChange={(e) => setGalCategory(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs font-semibold text-[#121813] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            >
              <option value="Rooftop">Rooftop Garden</option>
              <option value="Vertical">Vertical Living Wall</option>
              <option value="Landscape">Landscape Architecture</option>
              <option value="Indoor">Indoor Biophilic Plantscape</option>
              <option value="All">All Categories</option>
            </select>
          </div>
        </div>

        {/* Media Upload / URL Selector */}
        <div className="border border-[#D6D2C4] rounded-2xl p-4 bg-[#F7F6F2]/50 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#D6D2C4] pb-3">
            <button
              type="button"
              onClick={() => setActiveUploadTab("after")}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeUploadTab === "after"
                  ? "bg-[#2B4D33] text-white shadow-xs"
                  : "bg-white text-[#75787B] hover:text-[#121813] border border-[#D6D2C4]"
              }`}
            >
              🌿 কাজের পরের দৃশ্য (After Image - প্রধান)
            </button>
            <button
              type="button"
              onClick={() => setActiveUploadTab("before")}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                activeUploadTab === "before"
                  ? "bg-[#2B4D33] text-white shadow-xs"
                  : "bg-white text-[#75787B] hover:text-[#121813] border border-[#D6D2C4]"
              }`}
            >
              🧱 কাজের পূর্বের দৃশ্য (Before Image - ঐচ্ছিক স্লাইডার)
            </button>
          </div>

          {activeUploadTab === "after" ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">
                  Cloudinary Uploader (আফটার ছবি)
                </label>
                <CloudinaryUploader
                  value={galUrl}
                  onUpload={(url) => setGalUrl(url)}
                  label="প্রধান আফটার ফটো আপলোড করুন"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">
                  অথবা সরাসরি Image URL লিখুন
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={galUrl}
                  onChange={(e) => setGalUrl(e.target.value)}
                  className="w-full bg-white border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">
                  Cloudinary Uploader (বিফোর ছবি)
                </label>
                <CloudinaryUploader
                  value={galBeforeUrl}
                  onUpload={(url) => setGalBeforeUrl(url)}
                  label="বিফোর ফটো আপলোড করুন"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#75787B] block mb-1">
                  অথবা সরাসরি Before Image URL লিখুন
                </label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={galBeforeUrl}
                  onChange={(e) => setGalBeforeUrl(e.target.value)}
                  className="w-full bg-white border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#75787B] block mb-1">ছবির সংক্ষিপ্ত ক্যাপশন</label>
          <input
            type="text"
            placeholder="ছবির বিবরণ ও বোটানিক্যাল হাইলাইট..."
            value={galCaption}
            onChange={(e) => setGalCaption(e.target.value)}
            className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
          />
        </div>

        <div className="flex gap-2.5 self-end">
          <button
            type="submit"
            className="min-h-[44px] bg-[#2B4D33] hover:bg-[#1E3724] text-white font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-xs transition-all"
          >
            {editingGallery ? "ছবি আপডেট করুন" : "ছবি সংরক্ষণ করুন"}
          </button>
        </div>
      </form>

      {/* Gallery Items List with Reordering */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-[#121813] font-mono">
            গ্যালারি তালিকা ({gallery.length}) • ক্রম পরিবর্তন করতে উপরে/নিচে বাটন ব্যবহার করুন
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gallery.map((g, index) => {
            const itemId = g.id || (g as any)._id;

            return (
              <div
                key={itemId}
                className="bg-[#F7F6F2] border border-[#D6D2C4] p-4 rounded-2xl flex justify-between items-center shadow-2xs hover:border-[#2B4D33]/40 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  {/* Up / Down Order Buttons */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0 || isReordering}
                      onClick={() => handleMoveOrder(index, "up")}
                      className="w-7 h-7 rounded-lg bg-white border border-[#D6D2C4] flex items-center justify-center text-[11px] disabled:opacity-30 hover:bg-stone-50 cursor-pointer font-bold"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === gallery.length - 1 || isReordering}
                      onClick={() => handleMoveOrder(index, "down")}
                      className="w-7 h-7 rounded-lg bg-white border border-[#D6D2C4] flex items-center justify-center text-[11px] disabled:opacity-30 hover:bg-stone-50 cursor-pointer font-bold"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  {g.imageUrl && (
                    <div className="w-14 h-14 rounded-xl bg-stone-100 border border-[#D6D2C4] flex items-center justify-center overflow-hidden shrink-0 relative">
                      <img src={g.imageUrl} alt={g.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div>
                    <span className="font-bold text-sm text-[#121813] block">{g.title}</span>
                    <span className="text-[10px] text-[#75787B] block mt-0.5 font-mono">
                      ক্যাটাগরি: {g.category} {g.beforeImageUrl && "• স্লাইডার সমন্বিত"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditGalleryClick(g)}
                    className="min-h-[40px] px-3 py-1 bg-white hover:bg-stone-50 text-[#2B4D33] border border-[#2B4D33]/30 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    ✏️ এডিট
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(g)}
                    className="min-h-[40px] px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    🗑️ মুছুন
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deletion Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            const targetId = deleteTarget.id || (deleteTarget as any)._id;
            handleDeleteGallery(targetId);
            setDeleteTarget(null);
          }}
          title="গ্যালারি ছবি মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে "${deleteTarget.title}" ছবিটি মুছে ফেলতে চান?`}
          itemName={deleteTarget.title}
          confirmLabel="হ্যাঁ, মুছে ফেলুন"
          cancelLabel="বাতিল"
          variant="danger"
        />
      )}
    </div>
  );
}
