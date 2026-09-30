"use client";

import React from "react";

interface ActivityItem {
  id: string;
  title: string;
  bnTitle: string;
  image: string;
  date: string;
}

const activities: ActivityItem[] = [
  {
    id: "act-1",
    title: "Campus Gathering & Ecological Landscape Workshop",
    bnTitle: "বুয়েট স্থাপত্য বিভাগের সাথে মাইক্রোক্লাইমেট গবেষণা",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_0246-800x600.jpg",
    date: "September 2026 • সেপ্টেম্বর ২০২৬",
  },
  {
    id: "act-2",
    title: "Landscape Architecture Annual Summit & Keynote",
    bnTitle: "ধানমন্ডি পেন্টহাউস প্রজেক্ট সফল হস্তান্তর ও কমিশন",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_1020-800x600.jpg",
    date: "August 2026 • আগস্ট ২০২৬",
  },
  {
    id: "act-3",
    title: "Public Lecture on Climate Resilient Urban Strategies",
    bnTitle: "গুলশানে হেরিটেজ গাছের সফল সার্জারি ও ট্রি ক্লিনিক",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/1-11-800x534.jpg",
    date: "July 2026 • জুলাই ২০২৬",
  },
  {
    id: "act-4",
    title: "Façade Biophilic Installation Opening Ceremony",
    bnTitle: "গ্রিন ওয়াল ও ভার্টিক্যাল গার্ডেন প্রদর্শনী",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/S__10559556-800x600.jpg",
    date: "June 2026 • জুন ২০২৬",
  },
  {
    id: "act-5",
    title: "Community Pocket Park Co-Design Showcase",
    bnTitle: "কমিউনিটি পকেট পার্ক ডিজাইন ও সামাজিক সম্মেলন",
    image: "https://shmadesigns.com/wp-content/uploads/2025/06/IMG_9771-800x600.jpg",
    date: "May 2026 • মে ২০২৬",
  },
];

export default function ShmaRecentActivities() {
  return (
    <section id="activities" className="py-20 px-6 sm:px-10 max-w-[1380px] mx-auto text-[#323232] bg-white">
      
      {/* Exact Shma Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              Recent Activities
            </h2>
            <span className="font-sans text-sm sm:text-base text-[#75787b] font-normal">
              • সাম্প্রতিক কার্যক্রম ও ইভেন্ট
            </span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            Studio News & Events
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* 5-Column Photo Stream matching Shma */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {activities.map((item) => (
          <div key={item.id} className="space-y-3 group cursor-pointer">
            <div className="aspect-[3/4] overflow-hidden bg-stone-100 relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="space-y-1">
              <p className="font-sans text-[11px] text-[#75787b] font-light">
                {item.date}
              </p>
              <h3 className="font-sans text-xs sm:text-[13px] font-medium text-[#3d2e17] leading-snug line-clamp-1 group-hover:text-[#5a9dff] transition-colors">
                {item.title}
              </h3>
              <p className="font-sans text-[11px] text-[#75787b] leading-tight line-clamp-2">
                {item.bnTitle}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
