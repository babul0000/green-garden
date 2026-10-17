"use client";

import React, { useState, useEffect } from "react";

interface IReviewItem {
  id?: string;
  name: string;
  location?: string | null;
  text: string;
  rating: number;
  service?: string | null;
  createdAt?: string;
  date?: string;
}

const DEFAULT_REVIEWS: IReviewItem[] = [
  { name: "Tanvir Rahman", location: "Dhanmondi, Dhaka", text: "AR Green Garden turned our damp, dusty roof into a breathtaking orchard. The drip irrigation system makes maintenance effortless!", rating: 5, date: "2026-08-01" },
  { name: "Engr. Faruq Hasan (BTI)", location: "Gulshan, Dhaka", text: "A masterpiece of engineering and botany. It reduced our office reception room temperature by almost 3 degrees!", rating: 5, date: "2026-07-28" },
  { name: "Sabrina Karim", location: "Banani, Dhaka", text: "A beautiful, calming space in the middle of busy Banani. They resolved the drainage issue perfectly.", rating: 5, date: "2026-07-15" }
];

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<IReviewItem[]>(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newService, setNewService] = useState("Rooftop Garden");
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews?status=Approved");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newText.trim()) return;

    try {
      setSubmitting(true);
      setErrorMsg("");

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          location: newLocation.trim() || "Dhaka, Bangladesh",
          service: newService,
          rating: newRating,
          text: newText.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSubmitted(true);
      setNewName("");
      setNewLocation("");
      setNewText("");
      setNewRating(5);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "রিভিউ জমা দিতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-5xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <span className="text-xs text-primary-green font-bold uppercase tracking-wider">Customer Feedback</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3020]">Client Testimonials</h1>
          <p className="text-xs text-foreground/60 leading-relaxed mt-1">
            Read verified reviews from home owners and corporate developers regarding our landscape styling and garden construction.
          </p>

          {/* Aggregate Rating Badge */}
          {reviews.length > 0 && (
            <div className="mt-2 inline-flex items-center gap-3 bg-emerald-50 border border-emerald-200/80 px-4 py-2 rounded-2xl mx-auto shadow-2xs">
              <div className="flex items-center gap-1 text-amber-500 text-sm font-bold">
                <span>★</span>
                <span className="text-[#1a3020]">
                  {(reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1)}
                </span>
              </div>
              <span className="text-xs text-stone-600 font-mono">
                গড় রেটিং (মোট {reviews.length} টি ভেরিফাইড রিভিউ)
              </span>
            </div>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div key={rev.id || idx} className="bg-white/80 border border-foreground/5 p-6 rounded-3xl shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center gap-1 text-amber-500 text-sm mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < rev.rating ? "text-amber-500" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                  <span className="text-xs font-bold text-foreground/50 ml-1">{rev.rating}.0</span>
                </div>
                <p className="text-xs md:text-sm italic text-foreground/80 leading-relaxed">
                  &ldquo;{rev.text}&rdquo;
                </p>
                {rev.service && (
                  <span className="inline-block mt-3 px-2 py-0.5 bg-primary-green/10 text-primary-green text-[10px] font-semibold rounded-full">
                    {rev.service}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center border-t border-foreground/5 pt-4 mt-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-green/10 flex items-center justify-center text-primary-green font-bold text-xs">
                    {rev.name ? rev.name.charAt(0).toUpperCase() : "👤"}
                  </div>
                  <div>
                    <span className="block font-bold text-xs text-[#1a3020]">{rev.name}</span>
                    <span className="block text-[10px] text-foreground/45 mt-0.5">{rev.location || "Bangladesh"}</span>
                  </div>
                </div>
                <span className="text-[10px] text-foreground/35">
                  {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : (rev.date || "Verified")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Review form */}
        <div className="bg-[#f8faf9] border border-foreground/5 p-8 rounded-[32px] max-w-xl mx-auto w-full text-center flex flex-col gap-6 shadow-sm mt-8">
          <div>
            <div className="w-12 h-12 bg-primary-green/10 rounded-2xl flex items-center justify-center text-primary-green mx-auto mb-3 text-xl">
              💬
            </div>
            <h3 className="font-serif font-bold text-xl text-[#1a3020]">Write a Review</h3>
            <p className="text-xs text-foreground/50 mt-1">Share your experience with AR Green Garden architecture and maintenance.</p>
          </div>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold p-5 rounded-2xl flex items-center gap-3 text-left">
              <span className="text-emerald-600 text-xl font-bold">✓</span>
              <div>
                <p className="font-bold">ধন্যবাদ! আপনার রিভিউটি গ্রহণ করা হয়েছে।</p>
                <p className="text-[11px] text-emerald-700/80 mt-0.5">অ্যাডমিনের অনুমোদনের পর তা টেস্টমোনিয়াল পেজে লাইভ প্রদর্শিত হবে।</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Full Name *</label>
                  <input 
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Tanvir Ahmed"
                    className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Location</label>
                  <input 
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Gulshan, Dhaka"
                    className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Service Availed</label>
                  <select 
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                  >
                    <option value="Rooftop Garden">Rooftop Garden</option>
                    <option value="Landscape Design">Landscape Design</option>
                    <option value="Indoor Gardening">Indoor Gardening</option>
                    <option value="Vertical Green Wall">Vertical Green Wall</option>
                    <option value="Garden Maintenance">Garden Maintenance</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Rating *</label>
                  <select 
                    value={newRating}
                    onChange={(e) => setNewRating(parseInt(e.target.value, 10))}
                    className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Outstanding)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                    <option value={2}>⭐⭐ (2 Stars - Needs Improvement)</option>
                    <option value={1}>⭐ (1 Star - Poor)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">Your Review *</label>
                <textarea 
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Share details of your experience with our team, plant quality, irrigation or waterproofing..."
                  className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                <span>🚀</span>
                <span>{submitting ? "Submitting Review..." : "Submit Review"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
