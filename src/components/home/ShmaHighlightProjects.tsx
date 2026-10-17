"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export interface HighlightProjectItem {
  id: string;
  slug?: string;
  nameBn: string;
  nameEn: string;
  categoryBn: string;
  categoryEn: string;
  locationBn: string;
  locationEn: string;
  descBn: string;
  descEn: string;
  videoUrl?: string;
  imageUrl?: string;
  year?: string;
  area?: string;
  client?: string;
  ecoMetrics?: {
    tempDrop?: string;
    rainwater?: string;
    greenCoverage?: string;
  };
}

const SHMA_DEFAULT_PROJECTS: HighlightProjectItem[] = [
  {
    id: "mapletree-business-city",
    slug: "mapletree-business-city",
    nameBn: "ম্যাপলট্রি বিজনেস সিটি ২: আরবান ওয়াইল্ডারনেস",
    nameEn: "Mapletree Business City II",
    categoryBn: "ইনস্টিটিউশন ও আধুনিক কর্মক্ষেত্র",
    categoryEn: "Institution and Workplace",
    locationBn: "সিঙ্গাপুর",
    locationEn: "Singapore",
    descBn: "ম্যাপলট্রি বিজনেস সিটি ২ কর্মক্ষেত্র ও প্রকৃতির মেলবন্ধনে একটি 'আরবান ওয়াইল্ডারনেস' সৃষ্টি করেছে। সংলগ্ন নেচার রিজার্ভ ও ক্রান্তীয় জলবায়ুর অনুপ্রেরণায় পরিকল্পিত এই ল্যান্ডস্কেপ জীববৈচিত্র্য ও নাগরিক স্বস্তির এক অপূর্ব দৃষ্টান্ত।",
    descEn: "Mapletree Business City II aims to create an ‘Urban Wilderness’ by integrating modern workspaces with an eco-friendly, nature-inspired landscape. This design enhances comfort and recreation while fostering ecological balance, inspired by the adjacent nature reserve and tropical climate.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/04/Shma_Mapletree-Business-City-II.mp4#t=1",
    imageUrl: "https://shmadesigns.com/wp-content/uploads/al_opt_content/IMAGE/shmadesigns.com/wp-content/uploads/2025/06/Shma_MBCII_Photo_0013.jpg.bv.webp",
    year: "2024",
    area: "28,000 sq.m",
    client: "Mapletree Investments",
    ecoMetrics: { tempDrop: "-3.5°C", rainwater: "85% Recycled", greenCoverage: "68%" },
  },
  {
    id: "the-standard-hua-hin",
    slug: "the-standard-hua-hin",
    nameBn: "দ্য স্ট্যান্ডার্ড হুয়া হিন ট্রপিক্যাল রিসোর্ট",
    nameEn: "The Standard Hua Hin",
    categoryBn: "হসপিটালিটি ও ইকো রিসোর্ট",
    categoryEn: "Hospitality",
    locationBn: "প্রাচুয়াপ খিরি খান, থাইল্যান্ড",
    locationEn: "Prachuap Khiri Khan, Thailand",
    descBn: "প্রকৃতির পরম কোলে এক শান্ত প্রশান্তিময় আশ্রম। সাইটের বিদ্যমান বিশালাকার বনস্পতিগুলোকে অক্ষত রেখে নকশা করা হয়েছে প্রতিটি কর্নার—যেখানে আলো, গঠন ও নিসর্গ মিলেমিশে এক অভূতপূর্ব অনুভূতি সৃষ্টি করে।",
    descEn: "The Standard Hua Hin is envisioned as a tranquil retreat embraced by nature. The design weaves around existing trees, preserving the site’s forest character. Each space invites guests to reconnect with nature through light, texture, and time. The forest is not just a backdrop. It is the foundation of the experience.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/06/Pop-up-The-standard-huahin.mp4#t=1",
    imageUrl: "https://shmadesigns.com/wp-content/uploads/al_opt_content/IMAGE/shmadesigns.com/wp-content/uploads/2026/09/Home-pic-2.webp.bv.webp",
    year: "2023",
    area: "14,500 sq.m",
    client: "Standard International",
    ecoMetrics: { tempDrop: "-4.2°C", rainwater: "100% Retained", greenCoverage: "74%" },
  },
  {
    id: "one-city-centre-occ",
    slug: "one-city-centre-occ",
    nameBn: "ওয়ান সিটি সেন্টার (OCC) আরবান প্লাজা",
    nameEn: "One City Centre (OCC)",
    categoryBn: "কর্মক্ষেত্র ও পাবলিক প্লাজা",
    categoryEn: "Workplace & Civic Plaza",
    locationBn: "প্লয়েনচিট, ব্যাংকক",
    locationEn: "Ploenchit, Bangkok, Thailand",
    descBn: "ব্যাংককের প্রাণকেন্দ্রে একটি সানকেন পাবলিক পার্ক ও জীবন্ত সবুজ প্লাজা। এটি পথচারীদের জন্য শীতল ছায়াময় পথ সৃষ্টি করে এবং নগরীর অতিরিক্ত উত্তাপ প্রশমনে সক্রিয় ভূমিকা রাখে।",
    descEn: "A visionary high-density corporate hub enveloped in sunken gardens, shaded pedestrian corridors, and porous water plazas that substantially reduce the urban heat island effect.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/06/Pop-up-OCC.mp4#t=1",
    imageUrl: "https://shmadesigns.com/wp-content/uploads/2025/10/481669737_1051237407039729_5786496014790253820_n.jpg",
    year: "2024",
    area: "19,200 sq.m",
    client: "Raimon Land & Mitsubishi Estate",
    ecoMetrics: { tempDrop: "-3.8°C", rainwater: "90% Filtered", greenCoverage: "62%" },
  },
  {
    id: "dhanmondi-sky-forest",
    slug: "dhanmondi-sky-forest",
    nameBn: "ধানমন্ডি স্কাই ফরেস্ট ও বায়োফিলিক টেরেস",
    nameEn: "Dhanmondi Sky Forest & Bio-Terrace",
    categoryBn: "লাক্সারি ছাদবাগান ও রেসিডেন্সিয়াল",
    categoryEn: "Luxury Rooftop & Residential",
    locationBn: "রোড ৯/এ, ধানমন্ডি, ঢাকা, বাংলাদেশ",
    locationEn: "Road 9/A, Dhanmondi, Dhaka, Bangladesh",
    descBn: "কংক্রিট ছাদকে রূপান্তর করা হয়েছে সবুজ বায়োফিলিক স্বর্গে—যেখানে রয়েছে মাল্টি-লেয়ার ১০০% ওয়াটারপ্রুফ ড্রেনেজ, সুপরিকল্পিত জাপানিজ কার্পেট ঘাসের লন এবং মেহগনি কাঠের ছায়ানিবিড় পারগোলা।",
    descEn: "Transforming a bare concrete rooftop into a biophilic sanctuary, complete with multi-layer waterproof drainage, Japanese carpet lawn, and a handcrafted mahogany pergola overlooking the Dhanmondi skyline.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/04/Shma_Sky-Forest.mp4#t=1",
    imageUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200",
    year: "2026",
    area: "3,800 sq.ft",
    client: "Tanvir Rahman",
    ecoMetrics: { tempDrop: "-5.0°C", rainwater: "100% Drainage Safe", greenCoverage: "80%" },
  },
  {
    id: "gulshan-green-tower",
    slug: "gulshan-green-tower",
    nameBn: "গুলশান করপোরেট লিভিং গ্রিন ওয়াল",
    nameEn: "Gulshan Corporate Living Green Wall",
    categoryBn: "কর্মক্ষেত্র ও বায়োফিলিক স্থাপত্য",
    categoryEn: "Corporate Workplace & Vertical Forest",
    locationBn: "গুলশান এভিনিউ, ঢাকা, বাংলাদেশ",
    locationEn: "Gulshan Avenue, Dhaka, Bangladesh",
    descBn: "করপোরেট ভবনের সম্মুখভাগে স্থাপিত ৪,২০০-র বেশি জীবন্ত এয়ার-পিউরিফাইং গাছ ও স্বয়ংক্রিয় ড্রিপ সেচ প্রযুক্তি, যা কর্মক্ষেত্রের তাপমাত্রা কমায় ও নির্মল অক্সিজেন নিশ্চিত করে।",
    descEn: "Over 4,200 air-purifying endemic plants installed along corporate facades with automated root fertigation to cool workspace temperatures and clean urban air in central Gulshan.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/06/สวนสาน-.mp4#t=1",
    imageUrl: "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=1200",
    year: "2025",
    area: "6,400 sq.ft",
    client: "BTI Landmark",
    ecoMetrics: { tempDrop: "-3.2°C", rainwater: "Automated Drip", greenCoverage: "95%" },
  },
  {
    id: "coxs-bazar-resort",
    slug: "coxs-bazar-resort",
    nameBn: "কক্সবাজার ট্রপিক্যাল ইকো রিসোর্ট",
    nameEn: "Cox's Bazar Tropical Eco Resort",
    categoryBn: "রিসোর্ট ও হসপিটালিটি ল্যান্ডস্কেপ",
    categoryEn: "Resort & Hospitality Landscape",
    locationBn: "মেরিন ড্রাইভ, কক্সবাজার, বাংলাদেশ",
    locationEn: "Marine Drive, Cox's Bazar, Bangladesh",
    descBn: "সমুদ্র উপকূলের লবণাক্ত আবহাওয়া ও আর্দ্রতা উপযোগী দেশীয় উদ্ভিদের সমন্বয়ে নির্মিত উন্মুক্ত ল্যান্ডস্কেপ ও পরিবেশবান্ধব রিট্রিট মাস্টারপ্ল্যান।",
    descEn: "Coastal landscape masterplan tailored for sea breezes and saline soil conditions, featuring salt-tolerant endemic trees and natural water retention ponds along the marine coastline.",
    imageUrl: "https://shmadesigns.com/wp-content/uploads/2026/09/3.-The-Residences-at-Mandarin-Oriental-Miami-at-One-Island-Drive_POOL-1.webp",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/07/About.mp4",
    year: "2025",
    area: "35,000 sq.m",
    client: "Ocean Paradise Retreats",
    ecoMetrics: { tempDrop: "-4.0°C", rainwater: "Retention Ponds", greenCoverage: "70%" },
  },
];

const CATEGORY_MAP_BN: Record<string, string> = {
  "Rooftop Garden": "লাক্সারি ছাদবাগান",
  "Vertical Garden": "ভার্টিক্যাল গ্রিন ওয়াল",
  "Commercial Landscape": "বাণিজ্যিক ল্যান্ডস্কেপ",
  "Commercial": "বাণিজ্যিক ল্যান্ডস্কেপ",
  "Indoor Plants": "ইনডোর বায়োফিলিয়া",
  "Landscape Design": "ল্যান্ডস্কেপ ডিজাইন",
  "Hospitality": "হসপিটালিটি ও ইকো রিসোর্ট",
  "Resort": "হসপিটালিটি ও রিসোর্ট",
  "Workplace & Civic Plaza": "কর্মক্ষেত্র ও পাবলিক প্লাজা",
  "Luxury Rooftop & Residential": "লাক্সারি ছাদবাগান ও রেসিডেন্সিয়াল",
  "Corporate Workplace & Vertical Forest": "করপোরেট কর্মক্ষেত্র ও ভার্টিক্যাল গার্ডেন",
  "Resort & Hospitality Landscape": "রিসোর্ট ও হসপিটালিটি ল্যান্ডস্কেপ",
  "Public Realm": "পাবলিক রিয়েলম ও আরবান পার্ক",
};

const LOCATION_MAP_BN: Record<string, string> = {
  "Road 9/A, Dhanmondi, Dhaka": "রোড ৯/এ, ধানমন্ডি, ঢাকা",
  "Road 9/A, Dhanmondi, Dhaka, Bangladesh": "রোড ৯/এ, ধানমন্ডি, ঢাকা, বাংলাদেশ",
  "Gulshan Avenue, Dhaka": "গুলশান এভিনিউ, ঢাকা",
  "Gulshan Avenue, Dhaka, Bangladesh": "গুলশান এভিনিউ, ঢাকা, বাংলাদেশ",
  "Gulshan, Dhaka": "গুলশান, ঢাকা",
  "Banani, Dhaka": "বনানী, ঢাকা",
  "Road 11, Banani, Dhaka, Bangladesh": "রোড ১১, বনানী, ঢাকা, বাংলাদেশ",
  "Uttara, Dhaka": "উত্তরা, ঢাকা",
  "Dhaka, Bangladesh": "ঢাকা, বাংলাদেশ",
  "Marine Drive, Cox's Bazar, Bangladesh": "মেরিন ড্রাইভ, কক্সবাজার, বাংলাদেশ",
  "Cox's Bazar, Bangladesh": "কক্সবাজার, বাংলাদেশ",
  "Prachuap Khiri Khan, Thailand": "প্রাচুয়াপ খিরি খান, থাইল্যান্ড",
  "Ploenchit, Bangkok, Thailand": "প্লয়েনচিট, ব্যাংকক, থাইল্যান্ড",
  "Singapore": "সিঙ্গাপুর",
  "Purbachal New Town, Dhaka, Bangladesh": "পূর্বাচল নিউ টাউন, ঢাকা, বাংলাদেশ",
};

const DESC_MAP_BN: Record<string, string> = {
  "Transforming a bare concrete rooftop into a biophilic sanctuary, complete with multi-layer waterproof drainage, Japanese carpet lawn, and a handcrafted mahogany pergola overlooking the Dhanmondi skyline.":
    "কংক্রিট ছাদকে রূপান্তর করা হয়েছে সবুজ বায়োফিলিক স্বর্গে—যেখানে রয়েছে মাল্টি-লেয়ার ১০০% ওয়াটারপ্রুফ ড্রেনেজ, সুপরিকল্পিত জাপানিজ কার্পেট ঘাসের লন এবং মেহগনি কাঠের ছায়ানিবিড় পারগোলা।",
  "Over 4,200 air-purifying endemic plants installed along corporate facades with automated root fertigation to cool workspace temperatures and clean urban air.":
    "করপোরেট ভবনের সম্মুখভাগে স্থাপিত ৪,২০০-র বেশি জীবন্ত এয়ার-পিউরিফাইং গাছ ও স্বয়ংক্রিয় ড্রিপ সেচ প্রযুক্তি, যা কর্মক্ষেত্রের তাপমাত্রা কমায় ও নির্মল অক্সিজেন নিশ্চিত করে।",
  "Over 4,200 air-purifying endemic plants installed along corporate facades with automated root fertigation to cool workspace temperatures and clean urban air in central Gulshan.":
    "করপোরেট ভবনের সম্মুখভাগে স্থাপিত ৪,২০০-র বেশি জীবন্ত এয়ার-পিউরিফাইং গাছ ও স্বয়ংক্রিয় ড্রিপ সেচ প্রযুক্তি, যা কর্মক্ষেত্রের তাপমাত্রা কমায় ও নির্মল অক্সিজেন নিশ্চিত করে।",
  "Mapletree Business City II aims to create an ‘Urban Wilderness’ by integrating modern workspaces with an eco-friendly, nature-inspired landscape.":
    "ম্যাপলট্রি বিজনেস সিটি ২ কর্মক্ষেত্র ও প্রকৃতির মেলবন্ধনে একটি 'আরবান ওয়াইল্ডারনেস' সৃষ্টি করেছে। সংলগ্ন নেচার রিজার্ভের অনুপ্রেরণায় পরিকল্পিত এই ল্যান্ডস্কেপ জীববৈচিত্র্যের এক অনন্য প্রতীক।",
  "Envisioned as a tranquil retreat embraced by nature. The design weaves around existing trees, preserving the site’s forest character.":
    "প্রকৃতির পরম কোলে এক শান্ত প্রশান্তিময় আশ্রম। সাইটের বিদ্যমান বিশালাকার বনস্পতিগুলোকে অক্ষত রেখে নকশা করা হয়েছে প্রতিটি কর্নার—যেখানে আলো, গঠন ও নিসর্গ মিলেমিশে এক অভূতপূর্ব অনুভূতি সৃষ্টি করে।",
};

const toBnDigits = (str: string | number) => {
  const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(str).replace(/[0-9]/g, (d) => bnDigits[Number(d)]);
};

const BACKUP_DISTINCT_PROJECT_IMAGES = [
  "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1200",
  "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1200",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200",
  "https://images.unsplash.com/photo-1530731141654-59610f3b729f?q=80&w=1200",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200",
  "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=1200",
  "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200",
];

export default function ShmaHighlightProjects({ columns }: { columns?: number } = {}) {
  const { language, t } = useLanguage();
  const isBn = language === "bn";
  const [projectList, setProjectList] = useState<HighlightProjectItem[]>(SHMA_DEFAULT_PROJECTS);
  const [activeModalProject, setActiveModalProject] = useState<HighlightProjectItem | null>(null);

  useEffect(() => {
    const fetchLiveProjects = async () => {
      try {
        const res = await fetch(`/api/projects?featured=true&_t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : data?.projects || [];
          if (items.length >= 2) {
            const usedImages = new Set<string>();

            const mapped: HighlightProjectItem[] = items.map((p: any, idx: number) => {
              const fallback =
                SHMA_DEFAULT_PROJECTS.find(
                  (df) =>
                    df.slug === p.slug ||
                    df.id === p.id ||
                    df.nameEn?.toLowerCase() === (p.name || p.title || "").toLowerCase()
                ) || SHMA_DEFAULT_PROJECTS[idx % SHMA_DEFAULT_PROJECTS.length];

              const catEn = p.categoryEn || p.category || fallback.categoryEn || "Landscape Design";
              const catBn =
                p.categoryBn ||
                CATEGORY_MAP_BN[p.category] ||
                CATEGORY_MAP_BN[catEn] ||
                fallback.categoryBn ||
                "ল্যান্ডস্কেপ ডিজাইন";

              const locEn = p.locationEn || p.location || fallback.locationEn || "Dhaka, Bangladesh";
              const locBn =
                p.locationBn ||
                LOCATION_MAP_BN[p.location] ||
                LOCATION_MAP_BN[locEn] ||
                fallback.locationBn ||
                "ঢাকা, বাংলাদেশ";

              const descEn = p.descEn || p.description || p.desc || fallback.descEn || "";
              let descBn = p.descBn;
              if (!descBn || descBn === descEn) {
                descBn = DESC_MAP_BN[p.description] || DESC_MAP_BN[descEn] || fallback.descBn || descEn;
              }

              // Image deduplication logic: find candidate image not yet seen in this list
              const candidateImages = [
                p.afterImage,
                ...(Array.isArray(p.images) ? p.images : []),
                p.imageUrl,
                p.image,
                p.coverImage,
                p.beforeImage,
                fallback.imageUrl,
              ].filter(Boolean);

              let selectedImage = "";
              for (const candidate of candidateImages) {
                if (candidate && !usedImages.has(candidate)) {
                  selectedImage = candidate;
                  usedImages.add(candidate);
                  break;
                }
              }

              if (!selectedImage) {
                const uniqueBackup =
                  BACKUP_DISTINCT_PROJECT_IMAGES.find((img) => !usedImages.has(img)) ||
                  BACKUP_DISTINCT_PROJECT_IMAGES[idx % BACKUP_DISTINCT_PROJECT_IMAGES.length];
                selectedImage = uniqueBackup;
                usedImages.add(selectedImage);
              }

              return {
                id: p._id || p.id || `proj-${idx}`,
                slug: p.slug || fallback.slug,
                nameBn: p.titleBn || p.nameBn || fallback.nameBn || p.title || p.name || "",
                nameEn: p.titleEn || p.nameEn || p.title || p.name || fallback.nameEn || "",
                categoryBn: catBn,
                categoryEn: catEn,
                locationBn: locBn,
                locationEn: locEn,
                descBn: descBn,
                descEn: descEn,
                imageUrl: selectedImage,
                videoUrl: p.videoUrl || fallback.videoUrl,
                year: p.year || fallback.year || "2026",
                area: p.area || p.budgetRange || fallback.area || "3,500 sq.ft",
                client: p.client || p.clientName || fallback.client || "Private Client",
                ecoMetrics: fallback.ecoMetrics || {
                  tempDrop: "-3.5°C",
                  rainwater: "100% Drainage Safe",
                  greenCoverage: "75%",
                },
              };
            });
            setProjectList(mapped);
          }
        }
      } catch (e) {
        // keep default curated Shma projects
      }
    };
    fetchLiveProjects();
  }, []);

  return (
    <section id="projects" className="py-12 sm:py-24 px-4 sm:px-10 lg:px-16 max-w-[1440px] mx-auto text-[#323232] bg-white">
      {/* 1. ARCHITECTURAL SECTION HEADER (MATCHING SHMA DESIGNS) */}
      <div className="mb-10 sm:mb-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#75787b] block">
              {t("নির্বাচিত ল্যান্ডস্কেপ স্থাপত্য", "ARCHITECTURAL PORTFOLIO")}
            </span>
            <h2 className="font-display font-light text-3xl sm:text-5xl md:text-[54px] tracking-tight text-[#3d1916]">
              Highlight Project
            </h2>
          </div>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#3d1916] hover:text-[#5a9dff] transition-colors"
          >
            <span>{t("সকল প্রকল্প দেখুন", "View All Works")}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* 2. ASYMMETRIC ALTERNATING ARCHITECTURAL SHOWCASE (SHMA SIGNATURE) */}
      <div className="space-y-24 sm:space-y-32">
        {projectList.map((item, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={item.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center ${
                isEven ? "" : "lg:grid-flow-dense"
              }`}
            >
              {/* Media Container (Video / Image with Aspect 16/10) */}
              <div
                className={`lg:col-span-7 ${
                  isEven ? "lg:order-1" : "lg:col-start-6 lg:order-2"
                }`}
              >
                <div
                  onClick={() => setActiveModalProject(item)}
                  className="group relative aspect-[16/10] overflow-hidden bg-[#dedad2] cursor-pointer shadow-sm hover:shadow-xl transition-all duration-700"
                >
                  {item.videoUrl ? (
                    <video
                      src={item.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  ) : (
                    <img
                      src={item.imageUrl}
                      alt={item.nameEn}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          BACKUP_DISTINCT_PROJECT_IMAGES[index % BACKUP_DISTINCT_PROJECT_IMAGES.length];
                      }}
                    />
                  )}

                  {/* Shma Subtle Ambient Vignette & Interactive Hover Banner */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors duration-500" />
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="px-5 py-2.5 bg-white/95 text-[#3d1916] text-xs font-mono uppercase tracking-[0.2em] backdrop-blur-sm shadow-md">
                      {t("কেস স্টাডি দেখুন ➔", "Explore Project ➔")}
                    </span>
                  </div>

                  {/* Corner Category Tag */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full">
                      {isBn ? item.categoryBn : item.categoryEn}
                    </span>
                  </div>
                </div>
              </div>

              {/* Text & Architectural Narrative Container */}
              <div
                className={`lg:col-span-5 space-y-6 ${
                  isEven ? "lg:order-2" : "lg:col-start-1 lg:order-1"
                }`}
              >
                {/* Typology & Location */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-block px-3 py-1 text-xs font-mono tracking-wider uppercase text-[#3d1916] bg-[#dedad2]/70 rounded-full">
                      {isBn ? item.categoryBn : item.categoryEn}
                    </span>
                    {item.year && (
                      <span className="font-mono text-xs text-[#75787b]">
                        {isBn ? toBnDigits(item.year) : item.year}
                      </span>
                    )}
                  </div>
                  <p className="font-mono text-xs tracking-wider uppercase text-[#75787b]">
                    {isBn ? item.locationBn : item.locationEn}
                  </p>
                </div>

                {/* Project Title (Architectural Display Typeface) */}
                <h3
                  onClick={() => setActiveModalProject(item)}
                  className="font-display font-light text-2xl sm:text-3xl md:text-4xl text-[#3d1916] leading-tight tracking-tight hover:text-[#5a9dff] transition-colors cursor-pointer"
                >
                  {item.nameEn || item.nameBn}
                </h3>

                {/* Narrative Description */}
                <p className="font-sans text-sm sm:text-[15px] font-light text-[#54595f] leading-relaxed">
                  {isBn ? item.descBn : item.descEn}
                </p>

                {/* Eco Metric Quick Summary */}
                {item.ecoMetrics && (
                  <div className="pt-2 border-t border-[#e7e7e7] grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div>
                      <span className="block font-display text-sm sm:text-lg text-[#3d1916] font-medium">
                        {isBn ? toBnDigits(item.ecoMetrics.tempDrop) : item.ecoMetrics.tempDrop}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-[#75787b] uppercase tracking-wider block">
                        {t("মাইক্রোক্লাইমেট", "Microclimate")}
                      </span>
                    </div>
                    <div>
                      <span className="block font-display text-sm sm:text-lg text-[#3d1916] font-medium">
                        {isBn ? toBnDigits(item.ecoMetrics.greenCoverage) : item.ecoMetrics.greenCoverage}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-[#75787b] uppercase tracking-wider block">
                        {t("বায়োফিলিয়া", "Biophilia")}
                      </span>
                    </div>
                    <div>
                      <span className="block font-display text-sm sm:text-lg text-[#3d1916] font-medium">
                        {isBn
                          ? item.ecoMetrics.rainwater
                              .replace("100% Drainage Safe", "১০০% নিরাপদ ড্রেনেজ")
                              .replace("100% Retained", "১০০% সংরক্ষিত পানি")
                              .replace("90% Filtered", "৯০% ফিল্টার্ড ড্রেনেজ")
                              .replace("Automated Drip", "স্বয়ংক্রিয় ড্রিপ সেচ")
                              .replace("Retention Ponds", "ধারণ জলাধার")
                          : item.ecoMetrics.rainwater}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono text-[#75787b] uppercase tracking-wider block">
                        {t("হাইড্রোলজি", "Hydrology")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Call-to-action button */}
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={() => setActiveModalProject(item)}
                    className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#3d1916] hover:text-[#5a9dff] pb-1 border-b border-[#3d1916] hover:border-[#5a9dff] transition-all cursor-pointer"
                  >
                    <span>{t("প্রকল্পের বিস্তারিত", "Project Case Study")}</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. ARCHITECTURAL EXPLORE MORE FOOTER */}
      <div className="mt-28 text-center border-t border-[#e7e7e7] pt-14">
        <Link
          href="/projects"
          className="inline-block px-10 py-4 border border-[#3d1916] text-[#3d1916] text-xs font-mono uppercase tracking-[0.25em] hover:bg-[#3d1916] hover:text-white transition-all duration-300"
        >
          {t("সকল প্রকল্প ও কেস স্টাডি দেখুন", "Explore Complete Portfolio")}
        </Link>
      </div>

      {/* 4. LUXURY ARCHITECTURAL MODAL / DRAWER */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full p-6 sm:p-10 relative text-[#323232] space-y-6 my-auto shadow-2xl animate-fade-in-up">
            {/* Close Button */}
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-6 right-6 text-2xl text-[#3d1916] hover:opacity-60 cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>

            {/* Overline & Category */}
            <div className="space-y-1 pr-8">
              <span className="text-xs uppercase tracking-[0.25em] text-[#75787b] block font-mono">
                {t("স্থাপত্য বিশ্লেষণ ও সমীক্ষা", "ARCHITECTURAL CASE STUDY")}
              </span>
              <h3 className="text-2xl sm:text-4xl font-light font-display text-[#3d1916] tracking-tight">
                {activeModalProject.nameEn || activeModalProject.nameBn}
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-[#75787b] pt-1">
                {isBn ? activeModalProject.locationBn : activeModalProject.locationEn}
                {activeModalProject.year && ` • ${isBn ? toBnDigits(activeModalProject.year) : activeModalProject.year}`}
              </p>
            </div>

            {/* Media Highlight (Video / Image) */}
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-black">
              {activeModalProject.videoUrl ? (
                <video
                  src={activeModalProject.videoUrl}
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeModalProject.imageUrl}
                  alt={activeModalProject.nameEn}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      BACKUP_DISTINCT_PROJECT_IMAGES[0];
                  }}
                />
              )}
            </div>

            {/* Project Specs Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#f8faf9] border border-[#e7e7e7] text-xs">
              <div>
                <span className="block font-mono text-[10px] text-[#75787b] uppercase">{t("টাইপোলজি", "Typology")}</span>
                <span className="font-medium text-[#3d1916]">
                  {isBn ? activeModalProject.categoryBn : activeModalProject.categoryEn}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#75787b] uppercase">{t("পরিসর / ক্ষেত্রফল", "Scale / Area")}</span>
                <span className="font-medium text-[#3d1916]">{isBn ? toBnDigits(activeModalProject.area || "৩,৫০০ বর্গফুট") : (activeModalProject.area || "Custom Scope")}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#75787b] uppercase">{t("জলবায়ু উপযোগিতা", "Climate Adaptation")}</span>
                <span className="font-medium text-[#3d1916]">{t("গ্রীষ্মমণ্ডলীয় মৌসুমি", "Tropical Monsoon")}</span>
              </div>
              <div>
                <span className="block font-mono text-[10px] text-[#75787b] uppercase">{t("ওয়াটারপ্রুফিং", "Waterproofing")}</span>
                <span className="font-medium text-[#3d1916]">{t("১০০% সুরক্ষিত নিশ্চয়তা", "100% Guaranteed")}</span>
              </div>
            </div>

            {/* Narrative & Engineering Strategy */}
            <div className="space-y-4 font-sans text-sm font-light text-[#54595f] leading-relaxed">
              <p>{isBn ? activeModalProject.descBn : activeModalProject.descEn}</p>
              <p className="text-xs text-[#75787b] leading-relaxed">
                {t(
                  "এ আর গ্রিন গার্ডেনের বিশেষজ্ঞ টিম প্রতিটি সাইটের ড্রেনেজ, মাটির গভীরতা ও সূর্যের অবস্থান নিবিড়ভাবে পর্যবেক্ষণ করে বায়োফিলিক ল্যান্ডস্কেপ বাস্তবায়ন করে। শতভাগ লিক-প্রুফ ড্রেনেজ সেল ও উন্নত ফিল্টারেশন মেমব্রেনের মাধ্যমে ছাদ ও ভবনের দীর্ঘস্থায়িত্ব নিশ্চিত করা হয়।",
                  "A R Green Garden's multidisciplinary team executes rigorous hydrological modeling, root-barrier membranes, and automated drip fertigation tailored to the subtropical conditions of Bangladesh, ensuring decades of thriving greenery without slab dampness."
                )}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-[#e7e7e7] flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/contact?subject=${encodeURIComponent(activeModalProject.nameEn)}`}
                  onClick={() => setActiveModalProject(null)}
                  className="px-6 py-3 bg-[#3d1916] text-white text-xs font-mono uppercase tracking-widest hover:bg-[#5a9dff] transition-colors"
                >
                  {t("এই ডিজাইনে পরামর্শ নিন", "Inquire About This Project")}
                </Link>
                <Link
                  href="/projects"
                  onClick={() => setActiveModalProject(null)}
                  className="px-6 py-3 border border-[#3d1916] text-[#3d1916] text-xs font-mono uppercase tracking-widest hover:bg-[#dedad2] transition-colors"
                >
                  {t("সকল কাজ দেখুন", "All Case Studies")}
                </Link>
              </div>

              <button
                onClick={() => setActiveModalProject(null)}
                className="text-xs font-mono uppercase text-[#75787b] hover:text-[#3d1916] transition-colors cursor-pointer"
              >
                {t("বন্ধ করুন [ESC]", "Close [ESC]")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
