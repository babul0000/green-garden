"use client";

import React, { useState, useEffect } from "react";
import { IService } from "@/types";
import CloudinaryUploader from "@/components/shared/CloudinaryUploader";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";

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
  handleDeleteService,
}: ServicesTabProps) {
  const [banner, setBanner] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [descBn, setDescBn] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [showSeo, setShowSeo] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IService | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  useEffect(() => {
    if (editingService) {
      setBanner(editingService.banner || editingService.bannerImage || "");
      setTitleBn(editingService.titleBn || "");
      setDescBn(editingService.descBn || "");
      setSeoTitle((editingService as any).seoTitle || "");
      setSeoKeywords((editingService as any).seoKeywords || "");
      setSeoDescription((editingService as any).seoDescription || "");
    } else {
      setBanner("");
      setTitleBn("");
      setDescBn("");
      setSeoTitle("");
      setSeoKeywords("");
      setSeoDescription("");
    }
  }, [editingService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const servicePayload = {
      label: serviceLabel,
      titleBn,
      descBn,
      icon: serviceIcon,
      desc: serviceDesc,
      bannerImage: banner,
      seoTitle,
      seoKeywords,
      seoDescription,
    };
    handleCreateOrUpdateService(e, servicePayload);
  };

  // Up/Down reordering handler
  const handleMoveOrder = async (index: number, direction: "up" | "down") => {
    if (isReordering) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const newItems = [...services];
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
      await fetch("/api/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      window.location.reload();
    } catch (err) {
      console.error("Failed to reorder services:", err);
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
              🌱 সার্ভিস ক্যাটালগ ও সেবা ব্যবস্থাপনা
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2B4D33] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] border border-[#2B4D33]/20">
              Services Catalog
            </span>
          </div>
          <p className="text-xs text-[#75787B] font-light mt-1">
            ল্যান্ডস্কেপিং, রুফটপ গার্ডেনিং ও বোটানিক্যাল সেবা কনফিগারেশন — বাংলা অনুবাদ, ব্যানার আপলোড ও ক্রম সজ্জা।
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} autoComplete="off" className="bg-white p-6 sm:p-7 rounded-2xl border border-[#D6D2C4] shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-[#2B4D33] uppercase tracking-wider font-mono">
            {editingService ? `✏️ সেবা এডিট করুন: ${editingService.label || editingService.title}` : "➕ নতুন সেবা যোগ করুন"}
          </h4>
          {editingService && (
            <button
              type="button"
              onClick={() => {
                setEditingService(null);
                setServiceLabel("");
                setServiceDesc("");
                setTitleBn("");
                setDescBn("");
              }}
              className="text-xs font-mono font-bold text-[#75787B] hover:text-[#121813] cursor-pointer min-h-[44px] px-2 flex items-center"
            >
              ✕ এডিট বাতিল
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">সেবার নাম (English)</label>
            <input
              type="text"
              required
              placeholder="e.g. Rooftop Gardening"
              value={serviceLabel}
              onChange={(e) => setServiceLabel(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">সেবার বাংলা নাম (Bangla)</label>
            <input
              type="text"
              placeholder="যেমন: ছাদবাগান আর্কিটেকচার ও ব্যবস্থাপনা"
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">আইকন ইমোজি</label>
            <input
              type="text"
              required
              placeholder="🌱"
              value={serviceIcon}
              onChange={(e) => setServiceIcon(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-center text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">ইংরেজি বিবরণ (Description)</label>
            <textarea
              required
              rows={2}
              placeholder="Detailed description in English..."
              value={serviceDesc}
              onChange={(e) => setServiceDesc(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs resize-none text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">বাংলা বিবরণ (Bangla Description)</label>
            <textarea
              rows={2}
              placeholder="সেবার সম্পূর্ণ বাংলা বিবরণ..."
              value={descBn}
              onChange={(e) => setDescBn(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs resize-none text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33]"
            />
          </div>
        </div>

        {/* Banner Image Uploader */}
        <div className="border border-[#D6D2C4] rounded-2xl p-4 bg-[#F7F6F2]/50 space-y-3">
          <label className="text-[11px] font-bold text-[#75787B] block">
            সার্ভিস ব্যানার ছবি (Cloudinary Uploader অথবা URL)
          </label>
          <CloudinaryUploader
            value={banner}
            onUpload={(url) => setBanner(url)}
            label="ব্যানার ছবি আপলোড করুন"
          />
          <input
            type="text"
            placeholder="অথবা সরাসরি Banner URL লিখুন: https://..."
            value={banner}
            onChange={(e) => setBanner(e.target.value)}
            className="w-full bg-white border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
          />
        </div>

        {/* Collapsible SEO Section */}
        <div className="border-t border-[#D6D2C4] pt-3">
          <button
            type="button"
            onClick={() => setShowSeo(!showSeo)}
            className="text-xs font-bold text-[#2B4D33] hover:text-[#1E3724] flex items-center gap-1 cursor-pointer font-mono min-h-[40px]"
          >
            <span>{showSeo ? "▼ Hide" : "▶ Show"} SEO Metadata Settings</span>
          </button>

          {showSeo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <input
                type="text"
                placeholder="SEO Title Tag"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
              />
              <input
                type="text"
                placeholder="SEO Keywords"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
              />
              <input
                type="text"
                placeholder="SEO Meta Description"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
              />
            </div>
          )}
        </div>

        <div className="flex gap-2.5 self-end">
          <button
            type="submit"
            className="min-h-[44px] bg-[#2B4D33] hover:bg-[#1E3724] text-white font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-xs transition-all"
          >
            {editingService ? "সেবা সংরক্ষণ করুন" : "নতুন সেবা যোগ করুন"}
          </button>
        </div>
      </form>

      {/* Services List with Reorder Buttons */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col gap-4">
        <h4 className="font-bold text-sm text-[#121813] font-mono">
          বিদ্যমান সেবাসমূহ ({services.length}) • ক্রম সাজাতে উপরে/নিচে বাটন ব্যবহার করুন
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((s, index) => {
            const serviceId = s.id || (s as any)._id;

            return (
              <div
                key={serviceId}
                className="bg-[#F7F6F2] border border-[#D6D2C4] p-5 rounded-2xl flex justify-between items-center shadow-2xs hover:border-[#2B4D33]/40 transition-colors"
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
                      disabled={index === services.length - 1 || isReordering}
                      onClick={() => handleMoveOrder(index, "down")}
                      className="w-7 h-7 rounded-lg bg-white border border-[#D6D2C4] flex items-center justify-center text-[11px] disabled:opacity-30 hover:bg-stone-50 cursor-pointer font-bold"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  <span className="text-2xl">{s.icon || "🌱"}</span>
                  <div>
                    <span className="font-bold text-[#121813] text-sm block">{s.label || s.title}</span>
                    {s.titleBn && (
                      <span className="text-xs text-[#2B4D33] font-medium block">{s.titleBn}</span>
                    )}
                    <span className="block text-[11px] text-[#75787B] mt-0.5 leading-normal max-w-[220px]">
                      {s.desc || s.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEditServiceClick(s)}
                    className="min-h-[40px] px-3 py-1 bg-white hover:bg-stone-50 text-[#2B4D33] border border-[#2B4D33]/30 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                  >
                    ✏️ এডিট
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(s)}
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
            handleDeleteService(targetId);
            setDeleteTarget(null);
          }}
          title="সেবা মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে "${deleteTarget.label || deleteTarget.title}" সেবাটি মুছে ফেলতে চান?`}
          itemName={deleteTarget.label || deleteTarget.title}
          confirmLabel="হ্যাঁ, সেবা মুছুন"
          cancelLabel="বাতিল"
          variant="danger"
        />
      )}
    </div>
  );
}
