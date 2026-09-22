"use client";

import React, { useState } from "react";
import Link from "next/link";

interface GalleryProject {
  id: string;
  name: string;
  bengaliName: string;
  location: string;
  projectType: string;
  category: string;
  status: "Completed" | "Running";
  completionDate: string;
  description: string;
  mainImage: string;
  photos: string[];
  beforePhoto?: string;
  afterPhoto?: string;
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Filters exact from PDF page 4
  const filterList = [
    "All",
    "Luxury",
    "Standard",
    "Rooftop",
    "Residential",
    "Commercial",
    "Resort",
    "Vertical Garden",
    "Flower Garden",
    "Indoor",
    "Lawn",
    "Office",
    "Restaurant/Café",
    "Balcony",
    "Lighting",
    "Fountain",
    "Before & After",
  ];

  const projects: GalleryProject[] = [
    {
      id: "p1",
      name: "Dhanmondi Sky Retreat Penthouse",
      bengaliName: "ধানমন্ডি স্কাই রিট্রিট ছাদবাগান",
      location: "Road 9/A, Dhanmondi, Dhaka",
      projectType: "Rooftop Garden",
      category: "Rooftop",
      status: "Completed",
      completionDate: "August 2026",
      description: "২,২০০ বর্গফুটের ছাদবাগান যাতে রয়েছে ১০০% ওয়াটারপ্রুফ ড্রেনেজ, জাপানিজ গ্রাস লন, মেহগনি কাঠের পারগোলা ও অটো ড্রিপ সেচ ব্যবস্থা।",
      mainImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
        "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80",
      ],
      beforePhoto: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
    },
    {
      id: "p2",
      name: "Gulshan Corporate Vertical Eco-Wall",
      bengaliName: "গুলশান করপোরেট ভার্টিক্যাল গ্রিন ওয়াল",
      location: "Gulshan Avenue, Dhaka",
      projectType: "Vertical Garden",
      category: "Vertical Garden",
      status: "Completed",
      completionDate: "July 2026",
      description: "করপোরেট হেডকোয়ার্টারের ৩ তলা বিশিষ্ট জীবন্ত দেয়ালবাগান। স্বয়ংক্রিয় ফার্টিগেশন এবং এয়ার পিউরিফাইং গাছপালায় সমৃদ্ধ।",
      mainImage: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      ],
      beforePhoto: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1545241047-6083a3684587?w=800&q=80",
    },
    {
      id: "p3",
      name: "Banani Royal Residence Landscape",
      bengaliName: "বনানী রয়্যাল রেসিডেন্স ল্যান্ডস্কেপ",
      location: "Road 11, Banani, Dhaka",
      projectType: "Residential Landscape",
      category: "Residential",
      status: "Completed",
      completionDate: "September 2026",
      description: "আবাসিক ভিলার এন্ট্রান্স ও উঠান ঘিরে প্রিমিয়াম লন কার্পেট, প্রাকৃতিক পাথরের হাঁটার পথ ও ওয়াটারপ্রুফ গার্ডেন স্পাইক লাইটিং।",
      mainImage: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?w=800&q=80",
        "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=800&q=80",
      ],
      beforePhoto: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?w=800&q=80",
    },
    {
      id: "p4",
      name: "Sreemangal Tea Valley Resort Oasis",
      bengaliName: "শ্রীমঙ্গল টি ভ্যালি রিসোর্ট গার্ডেন",
      location: "Sreemangal, Sylhet",
      projectType: "Resort Landscape",
      category: "Resort",
      status: "Completed",
      completionDate: "June 2026",
      description: "প্রাকৃতিক পাহাড় ও লেকসংলগ্ন রিসোর্টের প্রাকৃতিক ল্যান্ডস্কেপ ও ট্রপিক্যাল ফ্লোরাল জোন।",
      mainImage: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80",
      ],
    },
    {
      id: "p5",
      name: "Uttara Zen Terrace Japanese Garden",
      bengaliName: "উত্তরা জেন টেরেস জাপানিজ গার্ডেন",
      location: "Sector 4, Uttara, Dhaka",
      projectType: "Luxury Garden",
      category: "Luxury",
      status: "Running",
      completionDate: "Expected Oct 2026",
      description: "জাপানিজ জেন গার্ডেন শৈলীতে মিনি রোক্স, সাদা নুড়িপাথর, বনসাই কালেকশন ও ব্যাম্বু ওয়াটার ড্রপ ফাউন্টেন।",
      mainImage: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=800&q=80",
      ],
    },
    {
      id: "p6",
      name: "Bashundhara R/A Pergola & Fountain Plaza",
      bengaliName: "বসুন্ধরা ফাউন্টেন ও নাইট লাইটিং প্লাজা",
      location: "Block I, Bashundhara R/A, Dhaka",
      projectType: "Fountain & Lighting",
      category: "Fountain",
      status: "Completed",
      completionDate: "May 2026",
      description: "আন্ডারওয়াটার এলইডি লাইট সম্বলিত মার্বেল ফাউন্টেন এবং কাস্টমাইজড গার্ডেন লাইটিং পাথওয়ে।",
      mainImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80",
      ],
    },
  ];

  // Filtering logic
  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Before & After") return Boolean(p.beforePhoto && p.afterPhoto);
    return (
      p.category.toLowerCase().includes(activeFilter.toLowerCase()) ||
      p.projectType.toLowerCase().includes(activeFilter.toLowerCase()) ||
      p.name.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  return (
    <div className="bg-gradient-to-b from-emerald-50/30 via-white to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
            আমাদের কাজ • Project Gallery
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900">
            A R Green Garden <br />
            <span className="text-emerald-700 italic font-medium">Premium Project Portfolio</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            ঢাকাসহ সারা দেশে আমাদের সম্পন্ন হওয়া ছাদবাগান, ভার্টিক্যাল গ্রিন ওয়াল ও রেসিডেন্সিয়াল ল্যান্ডস্কেপ প্রকল্পের দৃশ্যমালা।
          </p>
        </div>

        {/* 17 Filter Badges exact from PDF */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          {filterList.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab
                  ? "bg-emerald-700 text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
              }`}
            >
              {tab === "Before & After" ? "🔄 " : ""}
              {tab}
            </button>
          ))}
        </div>

        {/* Project Gallery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                {/* Main Image with Status & Category Badges */}
                <div className="relative aspect-[16/11] overflow-hidden bg-gray-100">
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-[11px] font-semibold">
                      {p.category}
                    </span>
                    {p.beforePhoto && (
                      <span className="px-2.5 py-1 bg-emerald-800/90 text-white rounded-full text-[10px] font-bold">
                        Before/After Available
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold shadow ${
                        p.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.status === "Completed" ? "✓ সম্পন্ন" : "⏳ চলমান"}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-2">
                  <h3 className="font-bold text-gray-900 text-lg font-serif group-hover:text-emerald-800 transition-colors">
                    {p.bengaliName}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>📍</span> {p.location}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed pt-1">
                    {p.description}
                  </p>
                </div>
              </div>

              {/* Card Footer with Details Modal trigger */}
              <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-4">
                <span>{p.completionDate}</span>
                <button
                  onClick={() => {
                    setSelectedProject(p);
                    setActivePhotoIdx(0);
                    setSliderPosition(50);
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  বিস্তারিত দেখুন →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no projects in category */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
            <span className="text-4xl">🌿</span>
            <p className="text-gray-500 text-sm mt-2">এই ক্যাটাগরিতে নতুন প্রোজেক্ট আপলোড হচ্ছে...</p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-4 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-xl"
            >
              সব প্রোজেক্ট দেখুন
            </button>
          </div>
        )}

        {/* Detailed Project Lightbox Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {selectedProject.projectType}
                  </span>
                  <span className="text-xs text-gray-500">
                    Status: <strong>{selectedProject.status}</strong> ({selectedProject.completionDate})
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-2">
                  {selectedProject.bengaliName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">📍 {selectedProject.location}</p>
              </div>

              {/* Multi-photo slider / before-after if present */}
              {selectedProject.beforePhoto && selectedProject.afterPhoto ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-800 block">
                    Before & After Comparison (পূর্বে ও পরে)
                  </span>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden select-none shadow-md border border-gray-200">
                    <img
                      src={selectedProject.afterPhoto}
                      alt="After"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-800 text-white px-3 py-1 rounded-md text-xs font-bold shadow">
                      AFTER
                    </div>

                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={selectedProject.beforePhoto}
                        alt="Before"
                        className="absolute inset-0 w-full h-full object-cover max-w-none"
                        style={{ width: "100%", height: "100%" }}
                      />
                      <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-md text-xs font-bold shadow">
                        BEFORE
                      </div>
                    </div>

                    <div
                      className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="w-8 h-8 bg-white text-emerald-800 rounded-full shadow-lg flex items-center justify-center text-xs font-bold border border-emerald-600">
                        ↔
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sliderPosition}
                      onChange={(e) => setSliderPosition(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md">
                    <img
                      src={selectedProject.photos[activePhotoIdx]}
                      alt={selectedProject.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thumbnails */}
                  {selectedProject.photos.length > 1 && (
                    <div className="flex gap-2">
                      {selectedProject.photos.map((photo, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setActivePhotoIdx(pIdx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer ${
                            activePhotoIdx === pIdx ? "border-emerald-700" : "border-transparent opacity-70"
                          }`}
                        >
                          <img src={photo} alt="thumb" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="space-y-2 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <h4 className="font-bold text-sm text-gray-900 font-serif">প্রকল্পের বিস্তারিত বিবরণ</h4>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={`/contact?projectRef=${encodeURIComponent(selectedProject.name)}`}
                  className="flex-1 text-center py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow transition-all"
                >
                  এই ধরণের প্রজেক্ট করাতে যোগাযোগ করুন
                </Link>
                <a
                  href="tel:01620692449"
                  className="py-3.5 px-6 border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl hover:bg-emerald-50 text-center transition-all"
                >
                  📞 হটলাইন: 01620692449
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
