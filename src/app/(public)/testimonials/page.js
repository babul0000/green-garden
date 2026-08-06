"use client";

import { useState } from "react";

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState([
    { name: "Tanvir Rahman", location: "Dhanmondi, Dhaka", text: "AR Green Garden turned our damp, dusty roof into a breathtaking orchard. The drip irrigation system makes maintenance effortless!", rating: 5, date: "2026-08-01" },
    { name: "Engr. Faruq Hasan (BTI)", location: "Gulshan, Dhaka", text: "A masterpiece of engineering and botany. It reduced our office reception room temperature by almost 3 degrees!", rating: 5, date: "2026-07-28" },
    { name: "Sabrina Karim", location: "Banani, Dhaka", text: "A beautiful, calming space in the middle of busy Banani. They resolved the drainage issue perfectly.", rating: 5, date: "2026-07-15" }
  ]);

  const [newName, setNewName] = useState("");
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName || !newText) return;
    
    setReviews(prev => [
      { name: newName, location: "Dhaka, Bangladesh", text: newText, rating: newRating, date: new Date().toISOString().split("T")[0] },
      ...prev
    ]);
    setNewName("");
    setNewText("");
    setNewRating(5);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <span className="text-xs text-primary-green font-bold uppercase tracking-wider">Customer Feedback</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3020]">Client Testimonials</h1>
          <p className="text-xs text-foreground/60 leading-relaxed mt-1">Read reviews from home owners and corporate developers regarding our landscape styling.</p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="bg-white/80 border border-foreground/5 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-yellow-500 text-sm mb-3">{"★".repeat(rev.rating)}</div>
                <p className="text-xs md:text-sm italic text-foreground/80 leading-relaxed">"{rev.text}"</p>
              </div>
              <div className="flex justify-between items-center border-t border-foreground/5 pt-4 mt-6">
                <div>
                  <span className="block font-bold text-xs text-[#1a3020]">{rev.name}</span>
                  <span className="block text-[10px] text-foreground/45 mt-0.5">{rev.location}</span>
                </div>
                <span className="text-[10px] text-foreground/35">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Review form */}
        <div className="bg-[#f8faf9] border border-foreground/5 p-8 rounded-[32px] max-w-lg mx-auto w-full text-center flex flex-col gap-6 shadow-sm mt-8">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1a3020]">Write a Review</h3>
            <p className="text-xs text-foreground/50 mt-1">Share your experience with AR Green Garden.</p>
          </div>

          {submitted ? (
            <div className="bg-primary-green/10 text-primary-green text-xs font-bold p-4 rounded-xl">
              ✓ Testimonial submitted successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Your Name"
                    className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Rating</label>
                  <select 
                    value={newRating}
                    onChange={(e) => setNewRating(parseInt(e.target.value))}
                    className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none"
                  >
                    <option value={5}>5 Stars (Excellent)</option>
                    <option value={4}>4 Stars (Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">Feedback Text</label>
                <textarea 
                  required
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="How was our service? Waterproofing check..."
                  className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
