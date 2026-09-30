"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface ServiceItem {
  number: string;
  title: string;
  bengaliTitle: string;
  category: string;
  slug: string;
  pricing: string;
  desc: string;
  icon: string;
  image: string;
  deliverables: string[];
}

const defaultFeaturedServices: ServiceItem[] = [
  {
    number: "01",
    title: "Landscape Architecture & Masterplanning",
    bengaliTitle: "ল্যান্ডস্কেপ স্থাপত্য ও মাস্টারপ্ল্যানিং",
    category: "Landscape Design",
    slug: "landscape-design",
    pricing: "৳৫০,০০০ থেকে শুরু",
    desc: "ব্যক্তিগত ভিলা, রিসোর্ট ও করপোরেট ক্যাম্পাসের জন্য আর্কিটেকচারাল 2D/3D প্ল্যানিং, সাইট গ্র্যাডিং ও প্রাকৃতিক আলোকবিন্যাস।",
    icon: "🏛️",
    image: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=800&auto=format&fit=crop",
    deliverables: ["2D Cad Layouts", "3D Photorealistic Renders", "Plant Palette Spec"],
  },
  {
    number: "02",
    title: "Rooftop Garden & Penthouse Ecosystems",
    bengaliTitle: "রুফটপ গার্ডেন ও ছাদবাগান বাস্তবায়ন",
    category: "Garden Services",
    slug: "rooftop-gardening",
    pricing: "৳১,৫০,০০০ থেকে শুরু",
    desc: "১০০% ওয়াটারপ্রুফ মেমব্রেন, জার্মান ড্রেনেজ সেল ও হালকা পার্লাইট-ভার্মিকুলাইট সয়েল মিডিয়ায় ছাদকে নিরাপদ সবুজ আশ্রয়ে রূপান্তর।",
    icon: "🌇",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
    deliverables: ["Leakproof Warranty", "Automated Irrigation", "Bespoke Pergola"],
  },
  {
    number: "03",
    title: "Vertical Living Green Walls",
    bengaliTitle: "ভার্টিক্যাল গ্রিন ওয়াল ও জীবন্ত দেয়াল",
    category: "Garden Services",
    slug: "vertical-garden",
    pricing: "৳৪৫০ - ৬৫০ / sqft",
    desc: "বাণিজ্যিক ও আবাসিক দেয়ালের জন্য স্বয়ংক্রিয় হাইড্রোপনিক ফেল্ট ও মডিউলার পকেট সিস্টেম। বাতাস বিশুদ্ধকরণ ও অ্যাকোস্টিক নয়েজ শোষণ।",
    icon: "🍃",
    image: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=800&auto=format&fit=crop",
    deliverables: ["Hydroponic Fertigation", "NASA Air-Purifiers", "Subtle Downlights"],
  },
  {
    number: "04",
    title: "Tree Doctor & Plant Pathology Clinic",
    bengaliTitle: "ট্রি ডক্টর ক্লিনিক ও উদ্ভিদের চিকিৎসা",
    category: "Plant Health",
    slug: "tree-doctor",
    pricing: "৳১,৫০০ / ভিজিট",
    desc: "গাছের পাতা পোড়া, কান্ড পচা, উইপোকা বা ছত্রাক আক্রমণ নির্ণয় ও কৃষিবিদদের মাধ্যমে অন-সাইট সার্জারি ও জৈব প্রতিষেধক।",
    icon: "🩺",
    image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop",
    deliverables: ["On-site Diagnosis", "Foliar Nutrition Spray", "Root Surgery"],
  },
  {
    number: "05",
    title: "Smart Automated Drip Irrigation",
    bengaliTitle: "স্মার্ট অটোমেটেড সেচ ব্যবস্থা",
    category: "Irrigation",
    slug: "smart-irrigation",
    pricing: "৳২৫,০০০ থেকে শুরু",
    desc: "ওয়াইফাই ও টাইমার নিয়ন্ত্রিত ড্রিপ ইরিগেশন — প্রতিটি গাছের গোড়ায় নিয়মিত পানি পৌঁছে ৭০% পানি সাশ্রয় করে ও শ্রম হ্রাস করে।",
    icon: "💧",
    image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop",
    deliverables: ["WiFi Smart Timers", "Pressure Compensating Emitters", "Zero Water Wastage"],
  },
  {
    number: "06",
    title: "Water Features, Fountains & Pergolas",
    bengaliTitle: "ফোয়ারা, ওয়াটার ক্যাস্কেড ও পারগোলা",
    category: "Hardscaping",
    slug: "water-fountain",
    pricing: "৳৪০,০০০ থেকে শুরু",
    desc: "প্রাকৃতিক পাথর ও কাচের ওয়াটারফল, রিফ্লেক্টিভ পুল, কাঠের পারগোলা ও সানকেন লাউঞ্জ যা ল্যান্ডস্কেপে তৈরি করে বিশেষ প্রশান্তি।",
    icon: "⛲",
    image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=800&auto=format&fit=crop",
    deliverables: ["Submersible Pumps", "Underwater Lighting", "Weatherproof Timber"],
  },
  {
    number: "07",
    title: "Scheduled Horticultural Maintenance",
    bengaliTitle: "গার্ডেন নিয়মিত পরিচর্যা ও মালী সেবা",
    category: "Maintenance",
    slug: "garden-maintenance",
    pricing: "৳৩,০০০ / মাস থেকে",
    desc: "অভিজ্ঞ মালী ও হর্টিকালচারিস্টদের নিয়মিত পরিদর্শন, প্রুনিং, জৈব কম্পোস্ট প্রয়োগ, পেস্ট কন্ট্রোল ও লন মোয়িং সেবা।",
    icon: "🌿",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?q=80&w=800&auto=format&fit=crop",
    deliverables: ["Weekly Visits", "Organic Fertilization", "Weed & Pest Shield"],
  },
];

export default function Services() {
  const [servicesList, setServicesList] = useState<ServiceItem[]>(defaultFeaturedServices);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.slice(0, 7).map((s: any, idx: number) => ({
            number: String(idx + 1).padStart(2, "0"),
            title: s.label || defaultFeaturedServices[idx]?.title || "Landscape Discipline",
            bengaliTitle: s.label,
            category: s.category || "Landscape Design",
            slug: s.slug || s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            pricing: s.pricing || defaultFeaturedServices[idx]?.pricing || "কোটেশন অনুযায়ী",
            desc: s.desc || defaultFeaturedServices[idx]?.desc || "AR Green Garden-এর প্রফেশনাল ল্যান্ডস্কেপিং সেবা।",
            icon: s.icon || defaultFeaturedServices[idx]?.icon || "🌱",
            image: s.bannerImage || defaultFeaturedServices[idx]?.image || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop",
            deliverables: defaultFeaturedServices[idx]?.deliverables || ["Full Consultation", "Turnkey Build", "Warranty Included"],
          }));
          setServicesList(mapped);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F6F2] text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Shma Header: Architectural Disciplines */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                Disciplines & Services • আমাদের সেবাসমূহ
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                Comprehensive <span className="font-bold text-[#2B4D33]">Landscape Services</span>
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              From residential penthouses to sprawling corporate campuses, we offer end-to-end masterplanning, clinical tree care, and turnkey construction.
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        {/* 7 Disciplines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service) => (
            <div
              key={service.slug}
              className="bg-white rounded-3xl border border-stone-300 overflow-hidden flex flex-col justify-between hover:border-[#2B4D33] transition-all duration-300 shadow-sm hover:shadow-xl group"
            >
              <div>
                {/* Media Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Category & Number Pills */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 bg-white/95 text-stone-900 rounded-full font-bold shadow">
                      {service.category}
                    </span>
                    <span className="font-mono text-xs font-bold text-white px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full">
                      {service.number}
                    </span>
                  </div>

                  {/* Pricing Badge */}
                  <div className="absolute bottom-3 left-4 text-white font-mono text-xs font-semibold">
                    {service.pricing}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-2xl">
                    <span>{service.icon}</span>
                    <h3 className="font-display text-lg font-bold text-[#121813] leading-snug group-hover:text-[#2B4D33] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <h4 className="font-sans text-xs font-bold text-[#2B4D33]">
                    {service.bengaliTitle}
                  </h4>
                  <p className="font-sans text-xs text-[#75787B] leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Deliverables */}
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {service.deliverables.map((del, i) => (
                      <span
                        key={i}
                        className="font-mono text-[10px] bg-[#E4E2D7] text-[#121813] px-2.5 py-0.5 rounded-full"
                      >
                        • {del}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
                <Link
                  href={`/services#${service.slug}`}
                  className="font-mono text-xs uppercase tracking-wider font-semibold text-[#2B4D33] hover:text-[#121813] transition-colors"
                >
                  View Details →
                </Link>
                <button
                  onClick={() => {
                    const el = document.getElementById("estimator");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    else window.location.href = "/design-garden";
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#18221A] text-white hover:bg-[#2B4D33] font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  Book Service
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* View Full Catalog Strip */}
        <div className="p-6 sm:p-8 bg-[#E4E2D7] rounded-3xl border border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-display text-xl font-bold text-[#121813]">
              Need a Custom Turnkey Landscape Solution?
            </h4>
            <p className="font-sans text-xs sm:text-sm text-[#75787B]">
              আমাদের রেজিস্টার্ড আর্কিটেক্ট ও প্ল্যান্ট ডক্টরদের সাথে সাইট ভিজিট ও মাস্টারপ্ল্যানের জন্য যোগাযোগ করুন।
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/services"
              className="px-6 py-3 bg-[#18221A] hover:bg-[#2B4D33] text-white font-mono text-xs uppercase tracking-wider font-bold rounded-full transition-all shadow"
            >
              Browse Full Services Catalog
            </Link>
            <a
              href="tel:01620692449"
              className="px-5 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-[#121813] font-mono text-xs uppercase tracking-wider font-bold rounded-full transition-all"
            >
              Call 01620692449
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
