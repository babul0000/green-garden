"use client";

import React, { useState, useEffect } from "react";

export default function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
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

  const handleCreateReview = async (e) => {
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

  const handleUpdateStatus = async (id, status) => {
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

  const handleDeleteReview = async (id) => {
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
    <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-sans font-bold text-lg text-[#06120c]">Review & Testimonial Management</h3>
        <p className="text-xs text-slate-400 mt-0.5">Moderate client feedback, select star ratings, and approve testimonials to be featured on landing pages.</p>
      </div>

      {/* Form to submit review manually */}
      <form onSubmit={handleCreateReview} className="bg-[#f8faf9] p-6 rounded-[20px] border border-slate-200/60 flex flex-col gap-4">
        <h4 className="font-bold text-xs text-[#06120c] uppercase tracking-wider">Add Administrative Review</h4>
        {success && (
          <div className="bg-emerald-50 text-emerald-600 text-xs font-semibold p-3 rounded-xl border border-emerald-100">
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
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
          />
          <select 
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
            <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
            <option value="3">⭐⭐⭐ (3 Stars)</option>
          </select>
          <input 
            type="text" 
            placeholder="Service label"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs text-slate-800"
          />
        </div>
        <textarea 
          required
          rows={2}
          placeholder="Client comments..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="bg-white border border-slate-200 py-2.5 px-4 rounded-xl text-xs resize-none text-slate-800"
        />
        <button type="submit" disabled={loading} className="bg-[#06120c] hover:bg-black text-[#8fc63f] font-bold text-xs py-2.5 rounded-xl cursor-pointer w-fit px-6 shadow-sm">
          {loading ? "Adding..." : "Add & Publish"}
        </button>
      </form>

      {/* Testimonials List */}
      <div className="flex flex-col gap-3 mt-2">
        <h4 className="font-sans font-bold text-sm text-[#06120c]">Pending & Published Testimonials</h4>
        <div className="flex flex-col gap-3">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic bg-[#f8faf9] p-6 rounded-2xl text-center">No reviews found in database.</p>
          ) : (
            reviews.map(r => (
              <div key={r._id} className="bg-[#f8faf9] border border-slate-100 p-5 rounded-[20px] text-xs flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#06120c] text-sm block">{r.name}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Service: {r.service} • Rating: {"⭐".repeat(r.rating)}</span>
                  <p className="text-slate-600 leading-relaxed mt-2 italic bg-white border border-slate-100 p-3 rounded-xl">"{r.comment}"</p>
                  
                  <div className="flex gap-2 items-center mt-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Change Status:</span>
                    {["Pending", "Approved", "Rejected"].map(s => (
                      <button
                        key={s}
                        onClick={() => handleUpdateStatus(r._id, s)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-bold border transition-colors cursor-pointer ${
                          r.status === s
                            ? "bg-[#06120c] text-[#8fc63f] border-[#06120c]"
                            : "bg-white text-slate-500 border-slate-200 hover:border-[#8fc63f]"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                  <div className="flex gap-2 items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                      r.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : r.status === "Rejected" ? "bg-red-50 text-red-500 border border-red-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                    }`}>
                      {r.status}
                    </span>
                    <button onClick={() => handleDeleteReview(r._id)} className="text-red-500 hover:text-red-700 text-xs font-bold p-1 cursor-pointer">
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
