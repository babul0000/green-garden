"use client";

import React, { useState, useEffect } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<GalleryProject | null>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Exact 17 filters from Masterplan & PDF
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

  // Static baseline projects
  const initialProjects: GalleryProject[] = [
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
      beforePhoto: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&q=80",
    },
    {
      id: "p5",
      name: "Uttara Zen Terrace Japanese Garden",
      bengaliName: "উত্তরা জেন টেরেস জাপানিজ গার্ডেন",
      location: "Sector 4, Uttara, Dhaka",
      projectType: "Luxury Garden",
      category: "Luxury",
      status: "Running",
      completionDate: "October 2026",
      description: "জাপানিজ জেন গার্ডেন শৈলীতে মিনি রোক্স, সাদা নুড়িপাথর, বনসাই কালেকশন ও ব্যাম্বু ওয়াটার ড্রপ ফাউন্টেন।",
      mainImage: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=800&q=80",
      ],
      beforePhoto: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?w=800&q=80",
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
      beforePhoto: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&q=80",
      afterPhoto: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80",
    },
    {
      id: "p7",
      name: "Baridhara Diplomatic Enclave Flower Garden",
      bengaliName: "বারিধারা ডিপ্লোম্যাটিক ফ্লাওয়ার গার্ডেন",
      location: "Baridhara, Dhaka",
      projectType: "Flower Garden",
      category: "Flower Garden",
      status: "Completed",
      completionDate: "August 2026",
      description: "সিজনাল বহুবর্ষজীবী ফুল এবং অটোমেটিক ফগিং মিস্ট সেচ নেটওয়ার্ক।",
      mainImage: "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1584473457406-6240486418e9?w=800&q=80"
      ]
    },
    {
      id: "p8",
      name: "Gulshan Tech Hub Biophilic Indoor Atrium",
      bengaliName: "গুলশান টেক হাব বায়োফিলিক ইনডোর এট্রিয়াম",
      location: "Gulshan-2, Dhaka",
      projectType: "Indoor Garden",
      category: "Indoor",
      status: "Completed",
      completionDate: "July 2026",
      description: "ইনডোর স্পেসে বায়ু পরিশোধক দানবীয় মনস্টেরা ও ফিডেল লিফ ডুমুরের জীবন্ত বাগান।",
      mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80"
      ]
    },
    {
      id: "p9",
      name: "Dhanmondi Lakeview Bermuda Turf Lawn",
      bengaliName: "ধানমন্ডি লেকভিউ বারমুডা কার্পেট লন",
      location: "Dhanmondi Lake, Dhaka",
      projectType: "Lawn Garden",
      category: "Lawn",
      status: "Completed",
      completionDate: "September 2026",
      description: "রোল-সড বারমুডা ঘাসের সমতল সবুজ গালিচা ও ভূগর্ভস্থ স্প্রিংকলার নেটওয়ার্ক।",
      mainImage: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80"
      ]
    },
    {
      id: "p10",
      name: "Motijheel Corporate Boardroom Landscape",
      bengaliName: "মতিঝিল করপোরেট হেডকোয়ার্টার অফিস ল্যান্ডস্কেপ",
      location: "Motijheel C/A, Dhaka",
      projectType: "Office Landscape",
      category: "Office",
      status: "Completed",
      completionDate: "June 2026",
      description: "এক্সিকিউটিভ বোর্ডরুম ও অভ্যর্থনা কক্ষে কম আলোর উপযোগী বায়োফিলিক প্ল্যান্টার্স।",
      mainImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
      ]
    },
    {
      id: "p11",
      name: "Dhanmondi 27 Rooftop Alfresco Café & Bistro",
      bengaliName: "ধানমন্ডি ২৭ রুফটপ ক্যাফে গ্রিনারি",
      location: "Dhanmondi 27, Dhaka",
      projectType: "Café Landscape",
      category: "Restaurant/Café",
      status: "Completed",
      completionDate: "August 2026",
      description: "গ্রাহকদের জন্য ইনস্টাগ্রাম-বান্ধব আলফ্রেসকো ক্যাফে ডাইনিং ও ফেয়ারি লাইট ক্যানোপি।",
      mainImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
      ]
    },
    {
      id: "p12",
      name: "Mirpur DOHS Compact Balcony Mini Garden",
      bengaliName: "মিরপুর ডিওএইচএস ব্যালকনি মিনি বাগান",
      location: "Mirpur DOHS, Dhaka",
      projectType: "Balcony Garden",
      category: "Balcony",
      status: "Completed",
      completionDate: "July 2026",
      description: "কম জায়গায় আধুনিক অ্যাপার্টমেন্টের ব্যালকনিতে সেল্ফ-ওয়াটারিং হ্যাংগিং প্ল্যান্টার।",
      mainImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80"
      ]
    },
    {
      id: "p13",
      name: "Gulshan Residence Night Art Lighting",
      bengaliName: "গুলশান রেসিডেন্স আর্কিটেকচারাল ট্রি আপলাইটিং",
      location: "Gulshan-1, Dhaka",
      projectType: "Garden Lighting",
      category: "Lighting",
      status: "Completed",
      completionDate: "August 2026",
      description: "IP68 ওয়াটারপ্রুফ ৩০০০কে নরম আলো যা রাতে বাগানকে জীবন্ত শিল্পকর্মে রূপ দেয়।",
      mainImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80",
      photos: [
        "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&q=80"
      ]
    }
  ];

  const [projects, setProjects] = useState<GalleryProject[]>(initialProjects);

  // Fetch dynamic projects from PostgreSQL API
  useEffect(() => {
    const fetchDbProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const dbProjects: any[] = await res.json();
          if (Array.isArray(dbProjects) && dbProjects.length > 0) {
            const formatted: GalleryProject[] = dbProjects.map((p) => ({
              id: p.id || p._id || p.slug,
              name: p.name,
              bengaliName: p.name,
              location: p.location || "Dhaka, Bangladesh",
              projectType: p.category || "Landscape Design",
              category: p.category || "Residential",
              status: p.status === "COMPLETED" ? "Completed" : "Running",
              completionDate: p.completionDate
                ? new Date(p.completionDate).toLocaleDateString("bn-BD", { year: "numeric", month: "long" })
                : "Ongoing",
              description: p.description || "A R Green Garden-এর প্রফেশনাল ল্যান্ডস্কেপিং প্রকল্প।",
              mainImage: p.afterImage || (p.images && p.images[0]) || p.beforeImage || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
              photos: (Array.isArray(p.images) && p.images.length > 0)
                ? p.images
                : [p.afterImage || p.beforeImage || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80"],
              beforePhoto: p.beforeImage || undefined,
              afterPhoto: p.afterImage || undefined,
            }));

            // Merge with initial, ensuring unique IDs and rich coverage
            const dbIds = new Set(formatted.map(f => f.name.toLowerCase()));
            const remaining = initialProjects.filter(p => !dbIds.has(p.name.toLowerCase()));
            setProjects([...formatted, ...remaining]);
          }
        }
      } catch (err) {
        console.warn("Could not fetch DB projects, using rich masterplan projects:", err);
      }
    };

    fetchDbProjects();
  }, []);

  // Filtering logic matching 17 categories & search query
  const filteredProjects = projects.filter((p) => {
    // 1. Category Filter Match
    let matchesCategory = true;
    if (activeFilter === "All") {
      matchesCategory = true;
    } else if (activeFilter === "Before & After") {
      matchesCategory = Boolean(p.beforePhoto && p.afterPhoto);
    } else {
      const filterLower = activeFilter.toLowerCase();
      matchesCategory =
        p.category.toLowerCase().includes(filterLower) ||
        p.projectType.toLowerCase().includes(filterLower) ||
        (filterLower.includes("vertical") && p.category.toLowerCase().includes("vertical")) ||
        (filterLower.includes("rooftop") && (p.category.toLowerCase().includes("rooftop") || p.projectType.toLowerCase().includes("rooftop"))) ||
        (filterLower.includes("luxury") && (p.category.toLowerCase().includes("luxury") || p.projectType.toLowerCase().includes("luxury"))) ||
        (filterLower.includes("fountain") && (p.category.toLowerCase().includes("fountain") || p.projectType.toLowerCase().includes("fountain"))) ||
        (filterLower.includes("lighting") && (p.category.toLowerCase().includes("lighting") || p.projectType.toLowerCase().includes("lighting"))) ||
        (filterLower.includes("lawn") && (p.category.toLowerCase().includes("lawn") || p.projectType.toLowerCase().includes("lawn")));
    }

    // 2. Search Query Match
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.bengaliName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-gradient-to-b from-emerald-50/30 via-white to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100/80 px-4 py-1.5 rounded-full border border-emerald-200">
            🌿 আমাদের কাজ • Project Gallery Portfolio
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
            A R Green Garden <br />
            <span className="text-emerald-700 italic font-medium">প্রিমিয়াম প্রজেক্ট শোকেস ও গ্যালারি</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            ধানমন্ডি, গুলশান, বনানী, উত্তরা ও শ্রীমঙ্গলসহ সারা দেশে আমাদের বাস্তবায়িত ছাদবাগান, লিভিং গ্রিন ওয়াল, বিলাসবহুল ভিলা ও করপোরেট ল্যান্ডস্কেপের সচিত্র রূপান্তর।
          </p>

          {/* Location & Title Search */}
          <div className="max-w-md mx-auto pt-2 relative">
            <input
              type="text"
              placeholder="লোকেশন বা প্রজেক্ট খুঁজুন (যেমন: Dhanmondi, Gulshan, Rooftop)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white rounded-full border border-emerald-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
            <span className="absolute left-3.5 top-5 text-gray-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-5 text-xs text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 17 Filter Badges Exact from Masterplan */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          {filterList.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-emerald-800 text-white shadow-md scale-105"
                    : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300"
                }`}
              >
                {tab === "Before & After" ? "🔄 " : ""}
                {tab}
              </button>
            );
          })}
        </div>

        {/* Total Results Bar */}
        <div className="flex items-center justify-between text-xs text-gray-500 border-b border-gray-100 pb-3">
          <span>
            ফিল্টার: <b>{activeFilter}</b> • প্রদর্শিত হচ্ছে: <b>{filteredProjects.length}</b>টি প্রজেক্ট
          </span>
          {activeFilter !== "All" && (
            <button
              onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              রিসেট ফিল্টার
            </button>
          )}
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
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-[11px] font-semibold">
                      {p.category}
                    </span>
                    {p.beforePhoto && (
                      <span className="px-2.5 py-1 bg-emerald-800/90 text-white rounded-full text-[10px] font-bold shadow">
                        🔄 Before/After
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
                <span className="font-medium text-gray-400">{p.completionDate}</span>
                <button
                  onClick={() => {
                    setSelectedProject(p);
                    setActivePhotoIdx(0);
                    setSliderPosition(50);
                  }}
                  className="px-4 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                >
                  বিস্তারিত দেখুন <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no projects in category */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 space-y-3">
            <span className="text-4xl block">🌿</span>
            <h4 className="font-serif font-bold text-gray-800 text-lg">কোনো প্রজেক্ট পাওয়া যায়নি</h4>
            <p className="text-gray-500 text-xs max-w-sm mx-auto">
              আপনার ফিল্টার অথবা সার্চ কি-ওয়ার্ডের সাথে কোনো প্রজেক্ট মেলেনি। অনুগ্রহ করে অন্য ফিল্টার চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setActiveFilter("All");
                setSearchQuery("");
              }}
              className="mt-2 px-5 py-2.5 bg-emerald-700 text-white text-xs font-semibold rounded-full shadow hover:bg-emerald-800 cursor-pointer"
            >
              সব প্রজেক্ট দেখুন
            </button>
          </div>
        )}

        {/* Detailed Project Lightbox Modal */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-[32px] max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative border border-emerald-100 animate-fade-in-up">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center font-bold text-sm cursor-pointer z-30"
              >
                ✕
              </button>

              {/* Modal Header */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {selectedProject.projectType}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    স্ট্যাটাস: <strong className="text-emerald-700">{selectedProject.status === "Completed" ? "সম্পন্ন" : "চলমান"}</strong> ({selectedProject.completionDate})
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-2">
                  {selectedProject.bengaliName}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <span>📍</span> {selectedProject.location}
                </p>
              </div>

              {/* Multi-photo slider / before-after if present */}
              {selectedProject.beforePhoto && selectedProject.afterPhoto ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                      <span>🔄</span> Before & After Transformation (পূর্বে ও পরে স্লাইডার)
                    </span>
                    <span className="text-[11px] text-gray-400">স্লাইডারটি ডানে-বামে ড্র্যাগ করুন</span>
                  </div>
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden select-none shadow-md border border-gray-200">
                    <img
                      src={selectedProject.afterPhoto}
                      alt="After"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-800 text-white px-3 py-1 rounded-md text-xs font-bold shadow">
                      AFTER (পরে)
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
                        BEFORE (পূর্বে)
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
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-md bg-gray-100">
                    <img
                      src={selectedProject.photos[activePhotoIdx] || selectedProject.mainImage}
                      alt={selectedProject.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thumbnails */}
                  {selectedProject.photos.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedProject.photos.map((photo, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => setActivePhotoIdx(pIdx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                            activePhotoIdx === pIdx ? "border-emerald-700 scale-105" : "border-transparent opacity-70"
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
              <div className="space-y-2 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-sm text-gray-900 font-serif">প্রকল্পের বিস্তারিত বিবরণ ও বৈশিষ্ট্য</h4>
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
                  এই ধরণের প্রজেক্ট করাতে ফ্রি কোটেশন নিন →
                </Link>
                <a
                  href={`https://wa.me/8801620692449?text=Hello%20AR%20Green%20Garden,%20I%20saw%20project:%20${encodeURIComponent(selectedProject.name)}%20and%20want%20to%20consult.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-xl shadow text-center flex items-center justify-center gap-1.5"
                >
                  <span>💬</span> WhatsApp চ্যাট
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
