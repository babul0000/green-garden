"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ProjectItem {
  id: string;
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
}

const projects: ProjectItem[] = [
  {
    id: "dhanmondi-sky-haven",
    nameBn: "ধানমন্ডি স্কাই ফরেস্ট ও বায়োফিলিক টেরেস",
    nameEn: "DHANMONDI SKY FOREST & BIO-TERRACE",
    categoryBn: "লাক্সারি ছাদবাগান ও রেসিডেন্সিয়াল",
    categoryEn: "Luxury Rooftop & Residential",
    locationBn: "রোড ৯/এ, ধানমন্ডি, ঢাকা, বাংলাদেশ",
    locationEn: "Road 9/A, Dhanmondi, Dhaka, Bangladesh",
    descBn: "কংক্রিট ছাদকে রূপান্তর করা হয়েছে সবুজ বায়োফিলিক স্বর্গে—যেখানে রয়েছে সম্পূর্ণ ওয়াটারপ্রুফ ড্রেনেজ, সুপরিকল্পিত জাপানিজ কার্পেট ঘাসের লন এবং মেহগনি কাঠের ছায়ানিবিড় পারগোলা।",
    descEn: "Transforming a bare concrete rooftop into a biophilic sanctuary, complete with multi-layer waterproof drainage, Japanese carpet lawn, and a handcrafted mahogany pergola.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/04/Shma_Mapletree-Business-City-II.mp4#t=1",
  },
  {
    id: "gulshan-green-tower",
    nameBn: "গুলশান করপোরেট লিভিং গ্রিন ওয়াল",
    nameEn: "GULSHAN CORPORATE LIVING GREEN WALL",
    categoryBn: "কর্মক্ষেত্র ও আধুনিক বাণিজ্যিক স্থাপত্য",
    categoryEn: "Corporate Workplace & Vertical Forest",
    locationBn: "গুলশান এভিনিউ, ঢাকা, বাংলাদেশ",
    locationEn: "Gulshan Avenue, Dhaka, Bangladesh",
    descBn: "করপোরেট ভবনের সম্মুখভাগে স্থাপিত ৪,২০০-র বেশি জীবন্ত এয়ার-পিউরিফাইং গাছ ও স্বয়ংক্রিয় ড্রিপ সেচ প্রযুক্তি, যা কর্মক্ষেত্রের তাপমাত্রা কমায় ও নির্মল অক্সিজেন নিশ্চিত করে।",
    descEn: "Over 4,200 air-purifying endemic plants installed along corporate facades with automated root fertigation to cool workspace temperatures and clean urban air.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/06/Pop-up-The-standard-huahin.mp4#t=1",
  },
  {
    id: "banani-royal-estate",
    nameBn: "বনানী রয়েল এস্টেট ও ওয়াটার গার্ডেন",
    nameEn: "BANANI ROYAL ESTATE & WATER GARDEN",
    categoryBn: "প্রাইভেট এস্টেট ও কোর্টইয়ার্ড",
    categoryEn: "Private Estate & Courtyard",
    locationBn: "রোড ১১, বনানী, ঢাকা, বাংলাদেশ",
    locationEn: "Road 11, Banani, Dhaka, Bangladesh",
    descBn: "মার্বেল পাথরের নান্দনিক জলপ্রপাত, উষ্ণ ল্যান্ডস্কেপ লাইটিং এবং সুবিন্যস্ত বহুবর্ষজীবী বাগান উদ্ভিদের সমাহারে নির্মিত এক অনন্য অভিজাত ব্যক্তিগত অঙ্গন।",
    descEn: "Featuring architectural marble water cascades, ambient evening lighting, and rare perennial flora integrated into a private residential estate.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/04/Shma_Sky-Forest.mp4#t=1",
  },
  {
    id: "coxs-bazar-resort",
    nameBn: "কক্সবাজার ট্রপিক্যাল ইকো রিসোর্ট",
    nameEn: "COX'S BAZAR TROPICAL ECO RESORT",
    categoryBn: "রিসোর্ট ও হসপিটালিটি ল্যান্ডস্কেপ",
    categoryEn: "Resort & Hospitality Landscape",
    locationBn: "মেরিন ড্রাইভ, কক্সবাজার, বাংলাদেশ",
    locationEn: "Marine Drive, Cox's Bazar, Bangladesh",
    descBn: "সমুদ্র উপকূলের লবণাক্ত আবহাওয়া ও আর্দ্রতা উপযোগী দেশীয় উদ্ভিদের সমন্বয়ে নির্মিত উন্মুক্ত ল্যান্ডস্কেপ ও পরিবেশবান্ধব রিট্রিট মাস্টারপ্ল্যান।",
    descEn: "Coastal landscape masterplan tailored for sea breezes and saline soil conditions, featuring salt-tolerant endemic trees and natural water retention ponds.",
    imageUrl: "https://shmadesigns.com/wp-content/uploads/2026/09/3.-The-Residences-at-Mandarin-Oriental-Miami-at-One-Island-Drive_POOL-1.webp",
  },
  {
    id: "purbachal-retreat",
    nameBn: "পূর্বাচল নেচার রিট্রিট ও সানকেন পার্ক",
    nameEn: "PURBACHAL NATURE RETREAT & SUNKEN PARK",
    categoryBn: "কমিউনিটি পার্ক ও ওপেন স্পেস",
    categoryEn: "Community Park & Open Space",
    locationBn: "পূর্বাচল নিউ টাউন, ঢাকা, বাংলাদেশ",
    locationEn: "Purbachal New Town, Dhaka, Bangladesh",
    descBn: "নগরবাসীর শারীরিক ও মানসিক প্রশান্তির জন্য সানকেন প্লাজা, হাঁটার ট্রেইল এবং বৃষ্টির পানি সংরক্ষণের সমন্বয়ে পরিকল্পিত আধুনিক গ্রিন স্পেস।",
    descEn: "A vibrant urban gathering place featuring sunken rain gardens, walking trails, and permeable green paving for civic wellness.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/06/Pop-up-OCC.mp4#t=1",
  },
  {
    id: "baridhara-oasis",
    nameBn: "বারিধারা ডিপ্লোম্যাটিক এম্বাসি গার্ডেন",
    nameEn: "BARIDHARA DIPLOMATIC OASIS",
    categoryBn: "লাক্সারি রেসিডেন্সিয়াল গার্ডেন",
    categoryEn: "Luxury Residential Landscape",
    locationBn: "বারিধারা ডিপ্লোম্যাটিক জোন, ঢাকা, বাংলাদেশ",
    locationEn: "Baridhara Diplomatic Enclave, Dhaka, Bangladesh",
    descBn: "নিভৃত ও সুরক্ষিত আধুনিক স্থাপত্য আঙ্গিনায় জ্যামিতিক গ্রিন প্যাটিও, শান্ত ফোয়ারা এবং ছায়ানিবিড় ট্রপিক্যাল গাছের অনন্য মেলবন্ধন।",
    descEn: "High-security biophilic landscaping integrating geometric stone patios, soothing water reflections, and shaded tropical foliage.",
    videoUrl: "https://shmadesigns.com/wp-content/uploads/2025/06/สวนสาน-.mp4#t=1",
  },
];

export default function ShmaHighlightProjects() {
  const { language, t } = useLanguage();
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const col1 = [projects[0], projects[1], projects[2], projects[3]];
  const col2 = [projects[4], projects[5]];

  return (
    <section id="projects" className="py-20 px-6 sm:px-10 max-w-[1380px] mx-auto text-[#323232] bg-white">
      {/* Section Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              Highlight Projects
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            Architectural Portfolio
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* 2-Column Staggered Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-16 gap-y-16">
        
        {/* Column 1 (Left) */}
        <div className="space-y-16">
          {col1.map((item) => (
            <div key={item.id} className="space-y-4">
              <div
                onClick={() => setActiveModalProject(item)}
                className="relative aspect-[16/10] overflow-hidden bg-stone-100 group cursor-pointer"
              >
                {item.videoUrl ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={item.videoUrl}
                  ></video>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.nameEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-base sm:text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                    {t("বিস্তারিত দেখুন →", "View Details →")}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display font-light text-xl sm:text-2xl uppercase tracking-wide text-[#3d2e17]">
                    {item.nameEn}
                  </h3>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-xs text-[#3d2e17] font-sans">
                    {language === "bn" ? item.categoryBn : item.categoryEn}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#75787b] font-light">
                  {language === "bn" ? item.locationBn : item.locationEn}
                </p>
                <p className="font-sans text-sm font-light text-[#54595f] leading-relaxed">
                  {language === "bn" ? item.descBn : item.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2 (Right) */}
        <div className="space-y-16">
          {col2.map((item) => (
            <div key={item.id} className="space-y-4">
              <div
                onClick={() => setActiveModalProject(item)}
                className="relative aspect-[16/10] overflow-hidden bg-stone-100 group cursor-pointer"
              >
                {item.videoUrl ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={item.videoUrl}
                  ></video>
                ) : (
                  <img
                    src={item.imageUrl}
                    alt={item.nameEn}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-base sm:text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                    {t("বিস্তারিত দেখুন →", "View Details →")}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display font-light text-xl sm:text-2xl uppercase tracking-wide text-[#3d2e17]">
                    {item.nameEn}
                  </h3>
                  <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-xs text-[#3d2e17] font-sans">
                    {language === "bn" ? item.categoryBn : item.categoryEn}
                  </span>
                </div>
                <p className="font-sans text-xs text-[#75787b] font-light">
                  {language === "bn" ? item.locationBn : item.locationEn}
                </p>
                <p className="font-sans text-sm font-light text-[#54595f] leading-relaxed">
                  {language === "bn" ? item.descBn : item.descEn}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox / Details Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white max-w-2xl w-full p-8 rounded-none relative text-[#323232] space-y-6">
            <button
              onClick={() => setActiveModalProject(null)}
              className="absolute top-4 right-4 text-2xl text-[#3d2e17] hover:opacity-60 cursor-pointer"
            >
              ✕
            </button>
            <span className="text-xs uppercase tracking-[0.2em] text-[#75787b] block font-mono">
              Architectural Masterpiece
            </span>
            <h3 className="text-2xl sm:text-3xl font-light font-display text-[#3d2e17]">
              {activeModalProject.nameEn}
            </h3>
            <p className="text-xs text-[#75787b]">
              {language === "bn" ? activeModalProject.locationBn : activeModalProject.locationEn}
            </p>
            <p className="text-sm font-light text-[#54595f] leading-relaxed">
              {language === "bn" ? activeModalProject.descBn : activeModalProject.descEn}
            </p>
            <p className="text-xs text-[#75787b] leading-relaxed">
              {t(
                "আমাদের বিশেষজ্ঞ দল প্রতিটি প্রকল্পের হাইড্রোলজি, ড্রেনেজ ও জীববৈচিত্র্য সুরক্ষায় আন্তর্জাতিক মানদণ্ড বজায় রেখে শতভাগ ওয়াটারপ্রুফ সমাধান প্রদান করে।",
                "Our multidisciplinary team ensures scientific hydrology, soil media engineering, and 100% waterproof membranes tailored to Bangladesh's climate."
              )}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="#newsletter"
                onClick={() => setActiveModalProject(null)}
                className="px-6 py-2.5 bg-[#3d2e17] text-white text-xs uppercase tracking-widest hover:bg-[#5a9dff] transition-colors"
              >
                {t("পরামর্শ নিন", "Inquire Project")}
              </a>
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-6 py-2.5 border border-[#3d2e17] text-[#3d2e17] text-xs uppercase tracking-widest hover:bg-[#dedad2] transition-colors cursor-pointer"
              >
                {t("বন্ধ করুন", "Close")}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
