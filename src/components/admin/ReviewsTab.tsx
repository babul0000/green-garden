"use client";

import React, { useState, useEffect } from "react";
import { IReview } from "@/types";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [service, setService] = useState("Rooftop Gardening");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/admin/reviews");
      if (res.ok) {
        setReviews(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, comment, service, status: "Approved" })
      });
      if (res.ok) {
        setSuccess(true);
        setName("");
        setComment("");
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id?: string, status?: string) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReview = async (id?: string) => {
    if (!id) return;
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl flex flex-col gap-6 animate-fade-in-up text-[#E4E2D7]">
      <div>
        <h3 className="font-sans font-bold text-lg text-white">রিভিউ ও রেটিংস • Reviews & Feedback</h3>
        <p className="text-xs text-stone-400 mt-0.5">Moderate client feedback, select star ratings, and approve testimonials to be featured on landing pages.</p>
      </div>

      {/* Form to submit review manually */}
      <form onSubmit={handleCreateReview} className="bg-black/40 p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-emerald-300 uppercase tracking-wider font-mono">Add Administrative Review</h4>
        {success && (
          <div className="bg-emerald-500/10 text-emerald-300 text-xs font-semibold p-3 rounded-xl border border-emerald-500/25">
            ✓ Review added successfully!
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            required
            placeholder="Client Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
          <select 
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value, 10))}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-emerald-400"
          >
            <option value={5} className="bg-[#121A14]">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value={4} className="bg-[#121A14]">⭐⭐⭐⭐ (4 Stars)</option>
            <option value={3} className="bg-[#121A14]">⭐⭐⭐ (3 Stars)</option>
          </select>
          <input 
            type="text" 
            placeholder="Service label"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
          />
        </div>
        <textarea 
          required
          rows={2}
          placeholder="Client comments..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-black/50 border border-white/15 py-2.5 px-4 rounded-xl text-xs resize-none text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
        />
        <button type="submit" disabled={loading} className="bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold font-mono text-xs py-2.5 px-6 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 transition-all w-fit disabled:opacity-50">
          {loading ? "Adding..." : "Add & Publish"}
        </button>
      </form>

      {/* Testimonials List */}
      <div className="flex flex-col gap-3 mt-2">
        <h4 className="font-sans font-bold text-sm text-white font-mono">Customer Testimonials ({reviews.length})</h4>
        <div className="flex flex-col gap-3">
          {reviews.length === 0 ? (
            <p className="text-xs text-stone-400 italic bg-black/40 p-6 rounded-2xl text-center border border-white/10 font-mono">No reviews found in database.</p>
          ) : (
            reviews.map(r => (
              <div key={r._id} className="bg-black/30 border border-white/10 p-5 rounded-2xl text-xs flex justify-between items-start shadow-lg">
                <div>
                  <span className="font-bold text-white text-sm block">{r.name}</span>
                  <span className="block text-[10px] text-stone-400 font-mono mt-0.5">Service: {r.service} • Rating: {"⭐".repeat(r.rating || 5)}</span>
                  <p className="text-stone-300 leading-relaxed mt-2 italic bg-black/40 border border-white/10 p-3 rounded-xl">"{r.comment || r.text}"</p>
                  
                  <div className="flex gap-2 items-center mt-4">
                    <span className="text-[10px] font-bold text-stone-400 font-mono uppercase tracking-wider">Change Status:</span>
                    {["Pending", "Approved", "Rejected"].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleUpdateStatus(r._id, s)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold font-mono border transition-all cursor-pointer ${
                          r.status === s
                            ? "bg-emerald-500 text-stone-950 border-emerald-500 font-bold shadow-md shadow-emerald-500/20"
                            : "bg-white/5 text-stone-400 border-white/10 hover:border-emerald-500/50 hover:text-white"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0 ml-4 font-mono">
                  <div className="flex gap-2 items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      r.status === "Approved" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : r.status === "Rejected" ? "bg-rose-500/15 text-rose-300 border border-rose-500/30" : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                    }`}>
                      {r.status}
                    </span>
                    <button type="button" onClick={() => handleDeleteReview(r._id)} className="text-rose-400 hover:text-rose-300 text-xs font-bold p-1 cursor-pointer transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
