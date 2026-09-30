"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface GalleryProject {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  badge: string;
  area?: string;
}

const defaultShowcaseProjects: GalleryProject[] = [
  {
    id: "1",
    title: "Dhanmondi Sky Retreat Penthouse Forest",
    category: "Rooftop Garden",
    location: "Road 9/A, Dhanmondi, Dhaka",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
    badge: "100% Leakproof",
    area: "3,800 sq.ft",
  },
  {
    id: "2",
    title: "Gulshan Corporate Living Vertical Wall",
    category: "Vertical Wall",
    location: "Gulshan Avenue, Dhaka",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop",
    badge: "Commercial Biophilia",
    area: "4,200 sq.ft",
  },
  {
    id: "3",
    title: "Banani Royal Residence Lawn & Mood Lights",
    category: "Residential",
    location: "Road 11, Banani, Dhaka",
    image: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=800&auto=format&fit=crop",
    badge: "Luxury Estate",
    area: "5,500 sq.ft",
  },
  {
    id: "4",
    title: "Sreemangal Tea Valley Resort Oasis",
    category: "Resort",
    location: "Sreemangal, Sylhet",
    image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=800&auto=format&fit=crop",
    badge: "Eco-Park Masterplan",
    area: "2.5 Acres",
  },
  {
    id: "5",
    title: "Uttara Zen Terrace Japanese Garden",
    category: "Residential",
    location: "Sector 4, Uttara, Dhaka",
    image: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=800&auto=format&fit=crop",
    badge: "Zen Garden",
    area: "2,200 sq.ft",
  },
  {
    id: "6",
    title: "Bashundhara R/A Fountain & Lighting Plaza",
    category: "Water Feature",
    location: "Block I, Bashundhara, Dhaka",
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=800&auto=format&fit=crop",
    badge: "Public Water Cascade",
    area: "6,500 sq.ft",
  },
];

export default function Gallery() {
  const [showcaseProjects, setShowcaseProjects] = useState<GalleryProject[]>(defaultShowcaseProjects);
  const [filter, setFilter] = useState<string>("All");

  const filterOptions = ["All", "Rooftop Garden", "Vertical Wall", "Residential", "Resort", "Water Feature"];

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 6).map((p: any, idx: number) => ({
            id: p.id || String(idx),
            title: p.name,
            category: p.category || "Residential",
            location: p.location || "Dhaka, Bangladesh",
            image: p.afterImage || (p.images && p.images[0]) || p.beforeImage || defaultShowcaseProjects[idx]?.image || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
            badge: p.status === "COMPLETED" ? "Completed" : "Active Site",
            area: p.area || "Custom Area",
          }));
          setShowcaseProjects(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered =
    filter === "All"
      ? showcaseProjects
      : showcaseProjects.filter((p) => p.category.toLowerCase().includes(filter.toLowerCase()));

  return (
    <section id="gallery" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Shma Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                Project Gallery • বাস্তবায়িত ল্যান্ডস্কেপ
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                Selected <span className="font-bold text-[#2B4D33]">Works</span>
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              Explore our curated portfolio of residential rooftops, corporate living biospheres, and resort masterplans crafted with ecological precision.
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                filter === opt
                  ? "bg-[#18221A] text-white font-bold shadow-sm"
                  : "bg-[#F7F6F2] text-[#75787B] hover:text-[#121813] border border-stone-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="group bg-[#F7F6F2] rounded-3xl overflow-hidden border border-stone-300 hover:border-[#2B4D33] transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between"
            >
              {/* Image Frame */}
              <div className="relative aspect-[16/11] overflow-hidden bg-stone-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 bg-white/95 text-stone-900 rounded-full font-bold shadow">
                    {item.category}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-[#2B4D33] text-white rounded-full font-semibold shadow">
                    {item.badge}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="font-mono text-[11px] text-emerald-300 block">
                    📍 {item.location}
                  </span>
                </div>
              </div>

              {/* Title & Details */}
              <div className="p-6 space-y-3">
                <h3 className="font-display text-lg font-bold text-[#121813] leading-snug group-hover:text-[#2B4D33] transition-colors">
                  {item.title}
                </h3>
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-mono text-[#75787B]">
                  <span>{item.area || "Custom Scope"}</span>
                  <span className="text-[#2B4D33] font-bold group-hover:translate-x-1 transition-transform">
                    Explore Gallery →
                  </span>
                </div>
              </div>

            </Link>
          ))}
        </div>

        {/* View Full Filterable Gallery CTA */}
        <div className="text-center pt-4">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#18221A] hover:bg-[#2B4D33] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <span>🖼️</span> View Complete 17-Category Gallery & Blueprints <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
