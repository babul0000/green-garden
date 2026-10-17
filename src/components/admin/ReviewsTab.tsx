"use client";

import React, { useState, useEffect } from "react";
import { IReview } from "@/types";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states (Create / Edit)
  const [editingReview, setEditingReview] = useState<IReview | null>(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [service, setService] = useState("Rooftop Gardening");
  const [location, setLocation] = useState("Dhanmondi, Dhaka");
  const [status, setStatus] = useState("Approved");
  const [featured, setFeatured] = useState(false);
  const [adminReply, setAdminReply] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<IReview | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const resetForm = () => {
    setEditingReview(null);
    setName("");
    setRating(5);
    setComment("");
    setService("Rooftop Gardening");
    setLocation("Dhanmondi, Dhaka");
    setStatus("Approved");
    setFeatured(false);
    setAdminReply("");
  };

  const handleStartEdit = (r: IReview) => {
    setEditingReview(r);
    setName(r.name || "");
    setRating(r.rating || 5);
    setComment(r.comment || r.text || "");
    setService(r.service || "Landscape Design");
    setLocation(r.location || "Dhaka");
    setStatus(r.status || "Approved");
    setFeatured(Boolean(r.featured));
    setAdminReply(r.adminReply || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      alert("নাম ও কমেন্ট আবশ্যক!");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingReview) {
        const reviewId = editingReview.id || (editingReview as any)._id;
        const res = await fetch(`/api/admin/reviews/${reviewId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            rating,
            comment,
            text: comment,
            service,
            location,
            status,
            featured,
            adminReply,
          }),
        });
        if (!res.ok) throw new Error("রিভিউ আপডেট করা যায়নি");
        showToast("✓ রিভিউ সফলভাবে আপডেট হয়েছে!");
      } else {
        const res = await fetch("/api/admin/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            rating,
            comment,
            text: comment,
            service,
            location,
            status,
            featured,
            adminReply,
          }),
        });
        if (!res.ok) throw new Error("নতুন রিভিউ সংরক্ষণ করা যায়নি");
        showToast("✓ নতুন রিভিউ সফলভাবে সংরক্ষিত হয়েছে!");
      }
      resetForm();
      fetchReviews();
    } catch (err: any) {
      alert(err.message || "ত্রুটি ঘটেছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id?: string, newStatus?: string) => {
    if (!id || !newStatus) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`✓ রিভিউ স্ট্যাটাস '${newStatus}' করা হয়েছে`);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id?: string, currentFeatured?: boolean) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });
      if (res.ok) {
        showToast(!currentFeatured ? "★ ফিচার্ড হিসেবে সেট করা হয়েছে" : "ফিচার্ড থেকে সরানো হয়েছে");
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const reviewId = deleteTarget.id || (deleteTarget as any)._id;
    if (!reviewId) return;

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("🗑️ রিভিউ সফলভাবে মুছে ফেলা হয়েছে");
        setDeleteTarget(null);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: "approve" | "reject" | "delete") => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !confirm(`নির্বাচিত ${selectedIds.length} টি রিভিউ মুছে ফেলতে চান?`)) return;

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ids: selectedIds }),
      });
      if (res.ok) {
        showToast(`✓ নির্বাচিত ${selectedIds.length} টি রিভিউ আপডেট হয়েছে`);
        setSelectedIds([]);
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === reviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reviews.map((r) => r.id || (r as any)._id).filter(Boolean));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans text-[#121813]">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-display font-light tracking-wide uppercase text-[#121813]">
              ⭐ ক্লায়েন্ট রিভিউ ও টেস্টিমোনিয়াল
            </h2>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#2B4D33] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] border border-[#2B4D33]/20">
              Verified Feedback
            </span>
          </div>
          <p className="text-xs text-[#75787B] font-light mt-1">
            ক্লায়েন্ট রিভিউ অনুমোদন, ১-৫ স্টার রেটিং, অ্যাডমিন রিপ্লাই প্রদান ও পাবলিক টেস্টমোনিয়াল পরিচালনা।
          </p>
        </div>
      </div>

      {/* Temporary Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-[#E8F5E9] border border-[#2B4D33]/40 text-[#121813] rounded-2xl text-xs font-semibold animate-fade-in flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2B4D33] animate-ping"></span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#75787B] hover:text-[#121813] font-bold cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center">
            ✕
          </button>
        </div>
      )}

      {/* Form (Create / Edit) */}
      <form onSubmit={handleSubmitReview} className="bg-white p-6 sm:p-7 rounded-2xl border border-[#D6D2C4] shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-[#2B4D33] uppercase tracking-wider font-mono">
            {editingReview ? `✏️ রিভিউ এডিট করুন: ${editingReview.name}` : "➕ নতুন অ্যাডমিনিস্ট্রেটিভ রিভিউ যোগ করুন"}
          </h4>
          {editingReview && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-mono font-bold text-[#75787B] hover:text-[#121813] cursor-pointer min-h-[44px] px-2 flex items-center"
            >
              ✕ এডিট বাতিল
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">ক্লায়েন্টের নাম</label>
            <input
              type="text"
              required
              placeholder="যেমন: তানভীর আহমেদ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">স্টার রেটিং (১-৫)</label>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs font-semibold text-[#121813] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (৫ স্টার)</option>
              <option value={4}>⭐⭐⭐⭐ (৪ স্টার)</option>
              <option value={3}>⭐⭐⭐ (৩ স্টার)</option>
              <option value={2}>⭐⭐ (২ স্টার)</option>
              <option value={1}>⭐ (১ স্টার)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">সার্ভিস ক্যাটাগরি</label>
            <input
              type="text"
              placeholder="যেমন: Rooftop Gardening"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">লোকেশন</label>
            <input
              type="text"
              placeholder="যেমন: ধানমন্ডি, ঢাকা"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] min-h-[44px]"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#75787B] block mb-1">ক্লায়েন্টের রিভিউ মন্তব্য</label>
          <textarea
            required
            rows={3}
            placeholder="ক্লায়েন্টের বিস্তারিত ফিডব্যাক..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] resize-none"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-[#75787B] block mb-1">অ্যাডমিন রিপ্লাই (Admin Response)</label>
          <textarea
            rows={2}
            placeholder="স্টুডিওর পক্ষ থেকে ক্লায়েন্টকে ধন্যবাদ ও অফিসিয়াল উত্তর..."
            value={adminReply}
            onChange={(e) => setAdminReply(e.target.value)}
            className="w-full bg-[#F7F6F2] border border-[#D6D2C4] py-2 px-3.5 rounded-xl text-xs text-[#121813] placeholder-[#75787B] focus:outline-none focus:border-[#2B4D33] resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <label className="flex items-center gap-2 text-xs text-[#121813] font-semibold cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded accent-[#2B4D33]"
            />
            <span>হোমপেজে ফিচার্ড হিসেবে প্রদর্শন করুন (Featured Testimonial)</span>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[44px] bg-[#2B4D33] hover:bg-[#1E3724] text-white font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-xs transition-all disabled:opacity-50"
          >
            {isSubmitting ? "সংরক্ষণ হচ্ছে..." : editingReview ? "রিভিউ আপডেট করুন" : "রিভিউ সংরক্ষণ ও প্রকাশ করুন"}
          </button>
        </div>
      </form>

      {/* Bulk Action Controls */}
      {selectedIds.length > 0 && (
        <div className="bg-[#E8F5E9] border border-[#2B4D33]/30 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 animate-fade-in shadow-xs">
          <span className="text-xs font-mono font-bold text-[#2B4D33]">
            {selectedIds.length} টি রিভিউ নির্বাচিত হয়েছে
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkAction("approve")}
              className="min-h-[40px] px-3.5 py-1.5 bg-[#2B4D33] text-white rounded-xl text-xs font-mono font-bold hover:bg-[#1E3724] cursor-pointer"
            >
              ✓ বাল্ক অনুমোদন (Approve)
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction("reject")}
              className="min-h-[40px] px-3.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-amber-700 cursor-pointer"
            >
              ✕ বাল্ক রিজেক্ট (Reject)
            </button>
            <button
              type="button"
              onClick={() => handleBulkAction("delete")}
              className="min-h-[40px] px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-mono font-bold hover:bg-rose-700 cursor-pointer"
            >
              🗑️ বাল্ক মুছুন (Delete)
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#D6D2C4] shadow-2xs flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selectedIds.length > 0 && selectedIds.length === reviews.length}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded accent-[#2B4D33] cursor-pointer"
              title="Select all"
            />
            <h4 className="font-bold text-sm text-[#121813] font-mono">
              মোট কাস্টমার রিভিউ ({reviews.length})
            </h4>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[#75787B]">
            রিভিউ লোড হচ্ছে...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[#75787B]">
            ডাটাবেজে কোনো রিভিউ পাওয়া যায়নি।
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {reviews.map((r) => {
              const reviewId = r.id || (r as any)._id;
              const isSelected = selectedIds.includes(reviewId);

              return (
                <div
                  key={reviewId}
                  className={`bg-[#F7F6F2] border rounded-2xl p-4 sm:p-5 transition-all flex flex-col gap-3 ${
                    isSelected ? "border-[#2B4D33] bg-[#E8F5E9]/30" : "border-[#D6D2C4]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectOne(reviewId)}
                        className="w-4 h-4 rounded accent-[#2B4D33] cursor-pointer"
                      />
                      <div>
                        <span className="font-bold text-sm text-[#121813] block">{r.name}</span>
                        <span className="text-[10px] text-[#75787B] font-mono mt-0.5 block">
                          {r.service} • {r.location || "Bangladesh"} • {"⭐".repeat(r.rating || 5)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Featured Star Toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(reviewId, r.featured)}
                        className={`min-h-[40px] px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                          r.featured
                            ? "bg-amber-400 text-stone-950 border-amber-500 shadow-2xs"
                            : "bg-white text-[#75787B] border-[#D6D2C4] hover:text-[#121813]"
                        }`}
                        title="Toggle Homepage Featured"
                      >
                        {r.featured ? "★ Featured" : "☆ Make Featured"}
                      </button>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border ${
                          r.status === "Approved"
                            ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                            : r.status === "Rejected"
                            ? "bg-rose-100 text-rose-800 border-rose-300"
                            : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}
                      >
                        {r.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-xs text-[#323232] italic leading-relaxed bg-white border border-[#D6D2C4] p-3 rounded-xl">
                    &ldquo;{r.comment || r.text}&rdquo;
                  </p>

                  {/* Admin Reply if exists */}
                  {r.adminReply && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-[10px] text-[#2B4D33] uppercase font-mono block">
                        🛡️ স্টুডিও অফিসিয়াল উত্তর:
                      </span>
                      <p className="text-stone-800 leading-relaxed">{r.adminReply}</p>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#D6D2C4]/60">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-[#75787B] font-mono uppercase mr-1">
                        স্ট্যাটাস বদলান:
                      </span>
                      {["Pending", "Approved", "Rejected"].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleUpdateStatus(reviewId, s)}
                          className={`min-h-[40px] px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                            r.status === s
                              ? "bg-[#2B4D33] text-white border-[#2B4D33]"
                              : "bg-white text-[#75787B] border-[#D6D2C4] hover:text-[#121813]"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(r)}
                        className="min-h-[40px] px-3 py-1 bg-white hover:bg-stone-50 text-[#2B4D33] border border-[#2B4D33]/30 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
                      >
                        ✏️ এডিট
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(r)}
                        className="min-h-[40px] px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-mono font-bold cursor-pointer transition-colors"
                      >
                        🗑️ মুছুন
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deletion Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          title="রিভিউ মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে "${deleteTarget.name}" এর রিভিউটি মুছে ফেলতে চান?`}
          itemName={deleteTarget.name}
          confirmLabel="হ্যাঁ, রিভিউ মুছুন"
          cancelLabel="বাতিল"
          variant="danger"
        />
      )}
    </div>
  );
}
