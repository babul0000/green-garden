"use client";

import React, { useState, useEffect } from "react";

const initialReviews = [
  {
    name: "Engr. Zahid Hasan",
    role: "Penthouse Owner",
    location: "Road 9/A, Dhanmondi, Dhaka",
    rating: 5,
    date: "August 2026",
    text: "এ আর গ্রিন গার্ডেন আমাদের ধানমন্ডির ছাদকে পুরোপুরি একটি স্বর্গীয় আশ্রয়ে পরিণত করেছে। বিশেষ করে তাদের ওয়াটারপ্রুফিং আর অটো-ড্রিপ ইরিগেশন অসাধারণ। গাছের কোনো যত্ন নিতে ঝামেলা পোহাতে হয় না।",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    projectType: "Luxury Rooftop Garden",
  },
  {
    name: "Dr. Farhana Chowdhury",
    role: "Resident",
    location: "Gulshan-2, Dhaka",
    rating: 5,
    date: "July 2026",
    text: "আমাদের বাগানের ২০ বছরের পুরনো আম গাছটি পোকার আক্রমণে প্রায় মরতে বসেছিল। তাদের ট্রি ডক্টর টিম এসে ৩টি সেশনের ট্রিটমেন্টে গাছটিকে সম্পূর্ণ সুস্থ করে তুলেছেন। তাদের জ্ঞান সত্যিই প্রশংসনীয়।",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
    projectType: "Tree Doctor Treatment",
  },
  {
    name: "Mahmudur Rahman",
    role: "Managing Director, Tech Park",
    location: "Banani, Dhaka",
    rating: 5,
    date: "September 2026",
    text: "আমাদের অফিসের এন্ট্রান্সে তাদের তৈরি করা ভার্টিক্যাল গ্রিন ওয়াল ক্লায়েন্টদের প্রথম দেখাতেই মুগ্ধ করে। মেইনটেন্যান্স টিমও সময়মতো এসে নিয়মিত পরিচর্যা করে যায়।",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    projectType: "Commercial Vertical Garden",
  },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d: any) => ({
            name: d.name,
            role: "Verified Client",
            location: d.location || "Dhaka, Bangladesh",
            rating: typeof d.rating === "number" ? d.rating : 5,
            date: d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recent",
            text: d.text,
            avatar: d.photoUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
            projectType: d.service || "Landscape Design",
          }));
          setReviews(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Shma Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                Client Testimonials • গ্রাহকের সন্তুষ্টি
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                Client <span className="font-bold text-[#2B4D33]">Endorsements</span>
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              Read direct testimonials from penthouse owners, corporate headquarters, and residential estates across Dhaka.
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-stone-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 hover:border-[#2B4D33]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500 text-sm">
                    {"★".repeat(r.rating)}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider bg-[#E4E2D7] text-[#121813] px-2.5 py-0.5 rounded-full font-bold">
                    {r.projectType}
                  </span>
                </div>

                <p className="font-sans text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  "{r.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center gap-3.5">
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="w-11 h-11 rounded-full object-cover border border-stone-200 shadow-sm"
                />
                <div>
                  <h4 className="font-display font-bold text-sm text-[#121813]">
                    {r.name}
                  </h4>
                  <p className="font-mono text-[11px] text-[#75787B]">
                    {r.role} • {r.location.split(",")[0]}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
