"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { toBnDigits } from "@/lib/formatters";

export interface ProjectDetail {
  id: string;
  slug?: string;
  nameBn: string;
  nameEn: string;
  category: "Residential" | "Commercial" | "Hospitality" | "Public Realm" | "All";
  categoryBn: string;
  categoryEn: string;
  locationBn: string;
  locationEn: string;
  client?: string;
  year?: string;
  area?: string;
  descBn: string;
  descEn: string;
  challengesBn?: string;
  challengesEn?: string;
  solutionBn?: string;
  solutionEn?: string;
  imageUrl: string;
  videoUrl?: string;
  gallery?: string[];
  metrics?: {
    tempDrop?: string;
    rainwater?: string;
    waterproofing?: string;
    greenCoverage?: string;
  };
  clientTestimonial?: {
    name: string;
    text: string;
    role?: string;
    rating: number;
  };
}

const ARCHITECTURAL_PROJECTS: ProjectDetail[] = [
  {
    id: "proj-1",
    slug: "dhanmondi-sky-forest",
    nameBn: "ধানমন্ডি স্কাই ফরেস্ট ও বায়োফিলিক টেরেস",
    nameEn: "Dhanmondi Sky Forest & Bio-Terrace",
    category: "Residential",
    categoryBn: "লাক্সারি ছাদবাগান ও রেসিডেন্সিয়াল",
    categoryEn: "Luxury Rooftop & Residential",
    locationBn: "রোড ৯/এ, ধানমন্ডি, ঢাকা, বাংলাদেশ",
    locationEn: "Road 9/A, Dhanmondi, Dhaka, Bangladesh",
    client: "Tanvir Rahman",
    year: "2026",
    area: "3,800 sq.ft",
    descBn: "কংক্রিট ছাদকে রূপান্তর করা হয়েছে সবুজ বায়োফিলিক স্বর্গে—যেখানে রয়েছে সম্পূর্ণ ১০০% ওয়াটারপ্রুফ ড্রেনেজ, সুপরিকল্পিত জাপানিজ কার্পেট ঘাসের লন এবং মেহগনি কাঠের ছায়ানিবিড় পারগোলা।",
    descEn: "Transforming a bare concrete rooftop into a biophilic sanctuary, complete with multi-layer waterproof drainage, Japanese carpet lawn, and a handcrafted mahogany pergola overlooking the Dhanmondi skyline.",
    challengesBn: "পুরনো কংক্রিট ছাদের স্ল্যাবে সূক্ষ্ম আর্দ্রতা চুইয়ে পড়ার সমস্যা এবং অতিরিক্ত লোড-বেয়ারিং সীমাবদ্ধতা।",
    challengesEn: "Micro-fissures in the existing roof slab caused moisture seepage to lower apartments, alongside strict dead-load limitations.",
    solutionBn: "৩ স্তরের ইলাস্টোমেরিক পলিমার মেমব্রেন, লাইটওয়েট এক্সপ্যান্ডেড ক্লে অ্যাগ্রিগেট এবং স্বয়ংক্রিয় রুট-জোন ড্রিপ সেচ স্থাপন।",
    solutionEn: "Applied 3-stage elastomeric waterproofing membranes, lightweight expanded clay aggregates with cocopeat media, and precision subsurface drip fertigation.",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200",
    metrics: {
      tempDrop: "-4.5°C",
      rainwater: "100% Drainage Safe",
      waterproofing: "10-Year Warranty",
      greenCoverage: "78%",
    },
    clientTestimonial: {
      name: "Tanvir Rahman",
      role: "Homeowner & Penthouse Resident",
      text: "AR Green Garden turned our damp, dusty roof into a breathtaking oasis that has dropped our top-floor summer temperature noticeably.",
      rating: 5,
    },
  },
  {
    id: "proj-2",
    slug: "gulshan-green-tower",
    nameBn: "গুলশান করপোরেট লিভিং গ্রিন ওয়াল ও ফেসাড",
    nameEn: "Gulshan Corporate Living Green Wall",
    category: "Commercial",
    categoryBn: "কর্মক্ষেত্র ও বায়োফিলিক স্থাপত্য",
    categoryEn: "Corporate Workplace & Vertical Forest",
    locationBn: "গুলশান এভিনিউ, ঢাকা, বাংলাদেশ",
    locationEn: "Gulshan Avenue, Dhaka, Bangladesh",
    client: "BTI Landmark Developments",
    year: "2025",
    area: "6,400 sq.ft Vertical Area",
    descBn: "করপোরেট ভবনের সম্মুখভাগে স্থাপিত ৪,২০০-র বেশি জীবন্ত এয়ার-পিউরিফাইং গাছ ও স্বয়ংক্রিয় ড্রিপ সেচ প্রযুক্তি, যা কর্মক্ষেত্রের তাপমাত্রা কমায় ও নির্মল অক্সিজেন নিশ্চিত করে।",
    descEn: "Over 4,200 air-purifying endemic plants installed along corporate facades with automated root fertigation to cool workspace temperatures and clean urban air.",
    challengesBn: "গুলশান এভিনিউয়ের প্রচণ্ড সূর্যের প্রখর তাপ ও তীব্র বাতাস যা উল্লম্ব দেয়ালে উদ্ভিদের দ্রুত পানিশূন্যতা ঘটায়।",
    challengesEn: "High ambient midday heat and turbulent wind corridors along Gulshan Avenue that quickly desiccate conventional vertical walls.",
    solutionBn: "স্মার্ট সেন্সর নিয়ন্ত্রিত ড্রিপ ইমিটার, টেকসই জিওটেক্সটাইল পকেট এবং বায়ুপ্রবাহ সহনশীল স্থানীয় ভ্যারাইটি নির্বাচন।",
    solutionEn: "Zone-modulated pressure compensating drippers with solar sensors, UV-stabilized geotextile cellular pockets, and wind-hardy air filtering plants.",
    imageUrl: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=1200",
    metrics: {
      tempDrop: "-3.8°C",
      rainwater: "70% Water Saved",
      waterproofing: "Zero-Seepage Barrier",
      greenCoverage: "92%",
    },
    clientTestimonial: {
      name: "Engr. Faruq Hasan",
      role: "Chief Project Director, BTI",
      text: "A genuine masterpiece of ecological engineering. Our corporate building has become a landmark on Gulshan Avenue.",
      rating: 5,
    },
  },
  {
    id: "proj-5",
    slug: "coxs-bazar-coastal-resort",
    nameBn: "কক্সবাজার ট্রপিক্যাল ইকো রিসোর্ট ও ল্যান্ডস্কেপ",
    nameEn: "Cox's Bazar Coastal Eco-Resort",
    category: "Hospitality",
    categoryBn: "রিসোর্ট ও হসপিটালিটি ল্যান্ডস্কেপ",
    categoryEn: "Hospitality & Coastal Ecology",
    locationBn: "মেরিন ড্রাইভ, কক্সবাজার, বাংলাদেশ",
    locationEn: "Marine Drive, Cox's Bazar, Bangladesh",
    client: "Ocean View Hospitality Ltd",
    year: "2025",
    area: "35,000 sq.m",
    descBn: "সমুদ্র উপকূলের লবণাক্ত আবহাওয়া ও আর্দ্রতা উপযোগী দেশীয় উদ্ভিদের সমন্বয়ে নির্মিত উন্মুক্ত ল্যান্ডস্কেপ ও পরিবেশবান্ধব রিট্রিট মাস্টারপ্ল্যান।",
    descEn: "A climate-resilient coastal masterplan engineered for marine salt sprays, featuring native dune stabilizers, cascading water gardens, and shaded timber walkways.",
    imageUrl: "/hero_plants.png",
    metrics: {
      tempDrop: "-4.0°C",
      rainwater: "Rain Retention Ponds",
      waterproofing: "Salt-Resistant",
      greenCoverage: "70%",
    },
    clientTestimonial: {
      name: "Kazi Nabil",
      role: "Managing Director",
      text: "Preserved our beachfront topography while introducing world-class biophilic luxury.",
      rating: 5,
    },
  },
  {
    id: "proj-7",
    slug: "banani-royal-estate",
    nameBn: "বনানী রয়েল এস্টেট ও ওয়াটার গার্ডেন",
    nameEn: "Banani Royal Estate & Water Garden",
    category: "Residential",
    categoryBn: "প্রাইভেট এস্টেট ও কোর্টইয়ার্ড",
    categoryEn: "Private Estate & Courtyard",
    locationBn: "রোড ১১, বনানী, ঢাকা, বাংলাদেশ",
    locationEn: "Road 11, Banani, Dhaka, Bangladesh",
    client: "Chowdhury Residence",
    year: "2025",
    area: "5,200 sq.ft",
    descBn: "মার্বেল পাথরের নান্দনিক জলপ্রপাত, উষ্ণ ল্যান্ডস্কেপ লাইটিং এবং সুবিন্যস্ত বহুবর্ষজীবী বাগান উদ্ভিদের সমাহারে নির্মিত এক অনন্য অভিজাত ব্যক্তিগত অঙ্গন।",
    descEn: "Featuring architectural marble water cascades, ambient evening lighting, and rare perennial flora integrated into a private residential estate.",
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
    metrics: {
      tempDrop: "-3.0°C",
      rainwater: "Filtered Recirculation",
      waterproofing: "Custom Basins",
      greenCoverage: "65%",
    },
    clientTestimonial: {
      name: "Mrs. N. Chowdhury",
      role: "Banani Residence",
      text: "Our courtyard has become a peaceful retreat where the soothing sound of water relaxes the entire household.",
      rating: 5,
    },
  },
  {
    id: "proj-8",
    slug: "purbachal-sunken-park",
    nameBn: "পূর্বাচল নেচার রিট্রিট ও সানকেন পার্ক",
    nameEn: "Purbachal Nature Retreat & Sunken Park",
    category: "Public Realm",
    categoryBn: "কমিউনিটি পার্ক ও ওপেন স্পেস",
    categoryEn: "Community Park & Open Space",
    locationBn: "পূর্বাচল নিউ টাউন, ঢাকা, বাংলাদেশ",
    locationEn: "Purbachal New Town, Dhaka, Bangladesh",
    client: "Civic Green Foundation",
    year: "2026",
    area: "42,000 sq.m",
    descBn: "নগরবাসীর শারীরিক ও মানসিক প্রশান্তির জন্য সানকেন প্লাজা, হাঁটার ট্রেইল এবং বৃষ্টির পানি সংরক্ষণের সমন্বয়ে পরিকল্পিত আধুনিক গ্রিন স্পেস।",
    descEn: "A vibrant urban gathering place featuring sunken rain gardens, walking trails, and permeable green paving designed for community wellness.",
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200",
    metrics: {
      tempDrop: "-4.8°C",
      rainwater: "Zero-Runoff Bioswales",
      waterproofing: "Retention Ponds",
      greenCoverage: "82%",
    },
    clientTestimonial: {
      name: "Purbachal Urban Guild",
      role: "Planning Committee",
      text: "A forward-looking demonstration of how planned satellite cities should harmonize with natural wetlands.",
      rating: 5,
    },
  },
];

export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const isBn = language === "bn";
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectDetail | null>(null);
  const [projectsList, setProjectsList] = useState<ProjectDetail[]>(ARCHITECTURAL_PROJECTS);
  const [loading, setLoading] = useState(false);

  // Sync with live database while retaining architectural metadata
  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const res = await fetch(`/api/projects?_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data?.projects || [];
          if (items.length > 0) {
            const mapped: ProjectDetail[] = items.map((p: any, idx: number) => {
              const fallback =
                ARCHITECTURAL_PROJECTS.find(
                  (df) =>
                    df.slug === p.slug ||
                    df.id === p.id ||
                    df.nameEn?.toLowerCase() === (p.name || p.title || "").toLowerCase()
                ) || ARCHITECTURAL_PROJECTS[idx % ARCHITECTURAL_PROJECTS.length];

              let cat: "Residential" | "Commercial" | "Hospitality" | "Public Realm" = "Residential";
              const cLower = (p.category || "").toLowerCase();
              if (cLower.includes("commercial") || cLower.includes("workplace") || cLower.includes("office")) cat = "Commercial";
              else if (cLower.includes("hospitality") || cLower.includes("resort") || cLower.includes("hotel")) cat = "Hospitality";
              else if (cLower.includes("park") || cLower.includes("public") || cLower.includes("plaza")) cat = "Public Realm";

              const descEn = p.descEn || p.description || p.desc || fallback.descEn || "";
              let descBn = p.descBn;
              if (!descBn || descBn === descEn) {
                descBn = fallback.descBn || descEn;
              }

              const locEn = p.locationEn || p.location || fallback.locationEn || "Dhaka, Bangladesh";
              const locBn = p.locationBn || fallback.locationBn || locEn;

              return {
                id: p._id || p.id || `live-${idx}`,
                slug: p.slug || fallback.slug,
                nameBn: p.titleBn || p.nameBn || fallback.nameBn || p.title || p.name,
                nameEn: p.titleEn || p.nameEn || p.title || p.name || fallback.nameEn,
                category: cat,
                categoryBn: p.categoryBn || fallback.categoryBn,
                categoryEn: p.categoryEn || fallback.categoryEn,
                locationBn: locBn,
                locationEn: locEn,
                client: p.client || p.clientName || fallback.client,
                year: p.year || fallback.year || "2026",
                area: p.area || p.budgetRange || fallback.area,
                descBn: descBn,
                descEn: descEn,
                challengesBn: p.challengesBn || fallback.challengesBn,
                challengesEn: p.challengesEn || p.challenges || fallback.challengesEn,
                solutionBn: p.solutionBn || fallback.solutionBn,
                solutionEn: p.solutionEn || p.solution || fallback.solutionEn,
                imageUrl: p.imageUrl || p.image || p.coverImage || fallback.imageUrl,
                videoUrl: p.videoUrl || fallback.videoUrl,
                metrics: fallback.metrics,
                clientTestimonial: p.clientTestimonial || fallback.clientTestimonial,
              };
            });
            // Merge unique projects with Shma curated showcases
            const combined = [...mapped];
            ARCHITECTURAL_PROJECTS.forEach((arch) => {
              if (!combined.some((c) => c.slug === arch.slug)) {
                combined.push(arch);
              }
            });
            setProjectsList(combined);
          }
        }
      } catch (err) {
        // Fall back gracefully to curated Shma architectural portfolio
      }
    };
    fetchLiveProjects();
  }, []);

  const categories = [
    { key: "All", en: "All Typologies", bn: "সকল প্রকল্প" },
    { key: "Commercial", en: "Workplace & Commercial", bn: "কর্মক্ষেত্র ও বাণিজ্যিক" },
    { key: "Hospitality", en: "Hospitality & Resorts", bn: "হসপিটালিটি ও রিসোর্ট" },
    { key: "Residential", en: "Luxury Residential & Rooftops", bn: "আবাসিক ও লাক্সারি ছাদবাগান" },
    { key: "Public Realm", en: "Public Realm & Parks", bn: "পাবলিক রিয়েলম ও পার্ক" },
  ];

  const filteredProjects = selectedCategory === "All"
    ? projectsList
    : projectsList.filter((p) => p.category === selectedCategory);

  return (
    <div className="bg-[#FAF9F5] text-[#323232] font-sans min-h-screen">
      {/* 1. CINEMATIC HERO SECTION (MATCHING SHMA DESIGNS) */}
      <section className="relative w-full bg-[#121813] text-white pt-36 pb-20 sm:pt-44 sm:pb-28 px-6 sm:px-12 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 opacity-40">
          <img
            src="/hero_plants.png"
            alt="Landscape Architecture"
            className="w-full h-full object-cover filter brightness-75 scale-105 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121813] via-[#121813]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#E4E2D7] block">
            {t("পোর্টফোলিও • স্থাপত্য ও বায়োফিলিক ল্যান্ডস্কেপ", "PORTFOLIO • ARCHITECTURAL LANDSCAPES & BIOPHILIA")}
          </span>
          <h1 className="font-display font-light text-4xl sm:text-6xl md:text-7xl lg:text-[76px] tracking-tight leading-[1.08] text-white max-w-4xl">
            Weaving Living Nature into <span className="font-normal italic text-[#5a9dff]">Modern Architecture</span>
          </h1>
          <p className="font-sans text-sm sm:text-base font-light text-white/80 max-w-2xl leading-relaxed pt-2">
            {t(
              "শহুরে ধূসর কংক্রিটকে রূপান্তর করছি জলবায়ু সহনশীল জীবন্ত বাস্তুতন্ত্রে। উচ্চ-মানের ওয়াটারপ্রুফিং ড্রেনেজ, বৈজ্ঞানিক বৃক্ষ চিকিৎসা এবং বিশ্বমানের স্থাপত্যে নির্মিত আমাদের পূর্ণাঙ্গ প্রকল্প তালিকা।",
              "Pioneering climate-resilient landscapes, zero-seepage biophilic rooftops, and enduring civic green spaces tailored to the subtropical conditions of Bangladesh."
            )}
          </p>
        </div>
      </section>

      {/* 2. MINIMALIST ARCHITECTURAL FILTER BAR */}
      <nav aria-label="Project Typology Navigation" className="sticky top-[68px] sm:top-[76px] z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E5DC] py-4 px-6 sm:px-12">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-4 sm:px-5 py-2 text-xs font-mono tracking-wider uppercase transition-all duration-300 cursor-pointer whitespace-nowrap rounded-full border ${
                    isActive
                      ? "bg-[#3D1916] text-white border-[#3D1916] shadow-sm"
                      : "bg-white text-[#75787b] border-[#E7E5DC] hover:text-[#3D1916] hover:border-[#3D1916]"
                  }`}
                >
                  {isBn ? cat.bn : cat.en}
                </button>
              );
            })}
          </div>

          <span className="hidden md:block font-mono text-xs text-[#75787b] uppercase tracking-wider shrink-0">
            {filteredProjects.length} {t("টি প্রকল্প", "Works Documented")}
          </span>
        </div>
      </nav>

      {/* 3. SHMA-STYLE ARCHITECTURAL SHOWCASE GRID */}
      <main className="max-w-[1440px] mx-auto px-6 sm:px-12 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-16 gap-y-20">
          {filteredProjects.map((project, index) => (
            <article
              key={project.id}
              className="space-y-5 group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Media Card with Aspect 16/10 & Ambient Hover */}
              <div className="relative aspect-[16/10] overflow-hidden bg-[#dedad2] shadow-sm group-hover:shadow-xl transition-all duration-700">
                {project.videoUrl ? (
                  <video
                    src={project.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={project.imageUrl}
                    alt={project.nameEn}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200";
                    }}
                  />
                )}

                {/* Shma Gradient Hover Overlay */}
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/35 transition-colors duration-500 flex items-center justify-center">
                  <span className="px-5 py-2.5 bg-white/95 text-[#3D1916] text-xs font-mono uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    {t("কেস স্টাডি দেখুন ➔", "Explore Case Study ➔")}
                  </span>
                </div>

                {/* Typology Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {isBn ? project.categoryBn : project.categoryEn}
                  </span>
                </div>

                {project.year && (
                  <span className="absolute bottom-4 right-4 z-10 font-mono text-[11px] text-white/90 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-sm">
                    {isBn ? toBnDigits(project.year) : project.year}
                  </span>
                )}
              </div>

              {/* Architectural Typography & Info */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display font-light text-2xl sm:text-3xl text-[#3D1916] leading-tight tracking-tight group-hover:text-[#5a9dff] transition-colors">
                    {project.nameEn || project.nameBn}
                  </h3>
                </div>

                <p className="font-mono text-xs uppercase tracking-wider text-[#75787b]">
                  {isBn ? project.locationBn : project.locationEn}
                  {project.area && ` • ${isBn ? toBnDigits(project.area) : project.area}`}
                </p>

                <p className="font-sans text-sm font-light text-[#54595f] leading-relaxed line-clamp-3 pt-1">
                  {isBn ? project.descBn : project.descEn}
                </p>

                {/* Eco & Performance Indicators */}
                {project.metrics && (
                  <div className="flex items-center gap-4 pt-3 font-mono text-[11px] text-[#75787b] border-t border-[#E7E5DC]">
                    <span>🌡️ {isBn ? toBnDigits(project.metrics.tempDrop) : project.metrics.tempDrop}</span>
                    <span>•</span>
                    <span>💧 {isBn ? project.metrics.rainwater.replace("100% Retained", "১০০% সংরক্ষিত").replace("85% Harvested", "৮৫% হার্ভেস্টেড").replace("90% Infiltrated", "৯০% ইনফিল্ট্রেটেড").replace("Filtered Recirculation", "ফিল্টার্ড পুনর্ব্যবহার") : project.metrics.rainwater}</span>
                    <span>•</span>
                    <span>🌿 {isBn ? toBnDigits(project.metrics.greenCoverage) : project.metrics.greenCoverage}</span>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* 4. LUXURY ARCHITECTURAL CASE STUDY MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full p-6 sm:p-10 relative text-[#323232] space-y-6 my-auto shadow-2xl animate-fade-in-up max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProject(null)}
              className="absolute top-6 right-6 text-2xl text-[#3D1916] hover:opacity-60 cursor-pointer w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close Modal"
            >
              ✕
            </button>

            {/* Overline & Typology Header */}
            <div className="space-y-1.5 pr-10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#75787b] block font-mono">
                {t("স্থাপত্য কেস স্টাডি ও কারিগরি বিবরণ", "ARCHITECTURAL CASE STUDY & SPECIFICATIONS")}
              </span>
              <h2 className="text-2xl sm:text-4xl font-light font-display text-[#3D1916] tracking-tight">
                {selectedProject.nameEn || selectedProject.nameBn}
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-[#75787b]">
                {isBn ? selectedProject.locationBn : selectedProject.locationEn}
                {selectedProject.client && ` • ${t("ক্লায়েন্ট:", "Client:")} ${selectedProject.client}`}
                {selectedProject.year && ` • ${isBn ? toBnDigits(selectedProject.year) : selectedProject.year}`}
              </p>
            </div>

            {/* Media Highlight (Video or High-Res Photo) */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black shadow-inner">
              {selectedProject.videoUrl ? (
                <video
                  src={selectedProject.videoUrl}
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={selectedProject.imageUrl}
                  alt={selectedProject.nameEn}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#f8faf9] border border-[#e7e7e7] text-xs">
              <div>
                <span className="block font-mono text-[10px] text-[#75787b] uppercase">{t("টাইপোলজি", "Typology")}</span>
                <span className="font-medium text-[#3D1916]">
                  {isBn ? selectedProject.categoryBn : selectedProject.categoryEn}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#75787b] uppercase">{t("পরিসর / ক্ষেত্রফল", "Site Footprint")}</span>
                <span className="font-medium text-[#3D1916]">{isBn ? toBnDigits(selectedProject.area || "৩,৫০০ বর্গফুট") : (selectedProject.area || "Custom")}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#75787b] uppercase">{t("ওয়াটারপ্রুফিং", "Waterproofing")}</span>
                <span className="font-medium text-[#3D1916]">
                  {isBn
                    ? (selectedProject.metrics?.waterproofing || "১০ বছরের নিশ্চয়তা")
                        .replace("10-Year Warranty", "১০ বছরের নিশ্চয়তা")
                        .replace("High-Spec Podium", "হাই-স্পেক পোডিয়াম")
                        .replace("Custom Basins", "কাস্টম বেসিন")
                        .replace("Podium Membrane", "পোডিয়াম মেমব্রেন")
                        .replace("Zero Seepage Membrane", "জিরো সিপেজ মেমব্রেন")
                    : (selectedProject.metrics?.waterproofing || "10-Year Warranty")}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#75787b] uppercase">{t("মাইক্রোক্লাইমেট প্রভাব", "Microclimate Delta")}</span>
                <span className="font-medium text-[#3D1916]">
                  {isBn
                    ? toBnDigits(selectedProject.metrics?.tempDrop || "-৩.৫° সে. শীতলীকরণ")
                        .replace("Cooling", "শীতলীকরণ")
                    : (selectedProject.metrics?.tempDrop || "-3.5°C Cooling")}
                </span>
              </div>
            </div>

            {/* Architectural Narrative */}
            <div className="space-y-4 font-sans text-sm font-light text-[#54595f] leading-relaxed">
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider text-[#3D1916] font-semibold mb-1">
                  {t("স্থাপত্য ধারণা ও উদ্দেশ্য", "Architectural Concept & Vision")}
                </h4>
                <p>{isBn ? selectedProject.descBn : selectedProject.descEn}</p>
              </div>

              {selectedProject.challengesEn && (
                <div className="border-t border-[#e7e7e7] pt-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#3D1916] font-semibold mb-1">
                    {t("সাইটের চ্যালেঞ্জ", "Site Challenges")}
                  </h4>
                  <p>{isBn ? selectedProject.challengesBn : selectedProject.challengesEn}</p>
                </div>
              )}

              {selectedProject.solutionEn && (
                <div className="border-t border-[#e7e7e7] pt-4">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-[#3D1916] font-semibold mb-1">
                    {t("প্রকৌশল ও বোটানিক্যাল সমাধান", "Engineering & Botanical Solution")}
                  </h4>
                  <p>{isBn ? selectedProject.solutionBn : selectedProject.solutionEn}</p>
                </div>
              )}

              {selectedProject.clientTestimonial && (
                <div className="bg-[#FAF9F5] p-5 border-l-4 border-[#3D1916] space-y-2 mt-4">
                  <p className="italic text-xs sm:text-sm text-[#3D1916]">
                    "{selectedProject.clientTestimonial.text}"
                  </p>
                  <div className="flex items-center justify-between font-mono text-xs text-[#75787b]">
                    <span>— {selectedProject.clientTestimonial.name} ({selectedProject.clientTestimonial.role})</span>
                    <span className="text-amber-600">{"★".repeat(selectedProject.clientTestimonial.rating || 5)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-[#e7e7e7] flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/contact?subject=${encodeURIComponent(selectedProject.nameEn)}`}
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-3 bg-[#3D1916] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#5a9dff] transition-colors"
                >
                  {t("এই ডিজাইনে পরামর্শ নিন", "Inquire About This Design")}
                </Link>
                <Link
                  href="/booking"
                  onClick={() => setSelectedProject(null)}
                  className="px-6 py-3 border border-[#3D1916] text-[#3D1916] text-xs font-mono uppercase tracking-widest hover:bg-[#dedad2] transition-colors"
                >
                  {t("সাইট ভিজিট বুক করুন", "Schedule Site Visit")}
                </Link>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="text-xs font-mono uppercase text-[#75787b] hover:text-[#3D1916] cursor-pointer"
              >
                {t("বন্ধ করুন [ESC]", "Close [ESC]")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. ARCHITECTURAL INVITATION SECTION (SHMA STUDIO CALLOUT) */}
      <section className="bg-[#E4E2D7] py-20 px-6 sm:px-12 border-t border-[#D6D2C4] text-[#3D1916]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#75787b] block">
              {t("সহযোগিতা ও যৌথ স্থাপত্য", "COLLABORATIVE PRACTICE")}
            </span>
            <h3 className="font-display font-light text-3xl sm:text-4xl text-[#3D1916]">
              {t("আপনার পরবর্তী স্থাপত্য প্রকল্পে প্রকৃতিকে সংযুক্ত করুন", "Integrate Living Ecosystems into Your Next Architectural Project")}
            </h3>
            <p className="font-sans text-sm font-light text-[#54595f] leading-relaxed">
              {t(
                "বাণিজ্যিক রিয়েল এস্টেট, বিলাসবহুল ভিলা কিংবা আবাসিক ছাদবাগান—আমাদের বিশেষজ্ঞ দল আপনার ভিশনকে বাস্তবে রূপ দিতে প্রস্তুত।",
                "From corporate campuses and luxury villas to private biophilic penthouses, our multidisciplinary team partners with architects, developers, and homeowners."
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#3D1916] text-white text-xs font-mono uppercase tracking-[0.2em] hover:bg-[#5a9dff] transition-colors"
            >
              {t("স্থপতিদের সাথে কথা বলুন", "Contact Studio")}
            </Link>
            <Link
              href="/booking"
              className="px-8 py-4 border border-[#3D1916] text-[#3D1916] text-xs font-mono uppercase tracking-[0.2em] hover:bg-white transition-colors"
            >
              {t("সাইট ভিজিট বুক করুন", "Book Consultation")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
