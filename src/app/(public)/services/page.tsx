"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ServiceCategory {
  id: string;
  name: string;
  bengaliName: string;
  icon: string;
  desc: string;
  services: {
    title: string;
    bengaliTitle: string;
    desc: string;
    features: string[];
    pricing?: string;
  }[];
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("landscape-design");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories: ServiceCategory[] = [
    {
      id: "landscape-design",
      name: "Landscape Design & Implementation",
      bengaliName: "ল্যান্ডস্কেপ ডিজাইন ও বাস্তবায়ন",
      icon: "🏡",
      desc: "সম্পূর্ণ আধুনিক ও আন্তর্জাতিক মানের ল্যান্ডস্কেপিং স্থাপত্য পরিকল্পনা ও বাস্তবায়ন।",
      services: [
        {
          title: "Residential Landscape",
          bengaliTitle: "রেসিডেন্সিয়াল ল্যান্ডস্কেপ (আবাসিক)",
          desc: "ব্যক্তিগত বাড়ি, ডুপ্লেক্স বা ভিলার চারপাশ ও উঠানের নান্দনিক সবুজায়ন ও হার্ডস্কেপ ডিজাইন।",
          features: ["2D/3D Master Layout", "Lawn Sodding", "Walkway Paving", "Mood Lighting"],
          pricing: "Starting from ৳৫0,000",
        },
        {
          title: "Commercial Landscape",
          bengaliTitle: "কমার্শিয়াল ল্যান্ডস্কেপ",
          desc: "করপোরেট অফিস, শপিং প্লাজা এবং বাণিজ্যিক ভবনের প্রিমিয়াম গ্রিন এক্সটেরিয়র ও ইন্টেরিয়র।",
          features: ["Executive Entryways", "Waterproof planters", "Corporate Green Walls"],
          pricing: "Starting from ৳১,০০,০০০",
        },
        {
          title: "Resort Landscape",
          bengaliTitle: "রিসোর্ট ল্যান্ডস্কেপ",
          desc: "বিলাসবহুল রিসোর্ট, ফার্মহাউস ও অবকাশ যাপন কেন্দ্রের জন্য ইকো-ফ্রেন্ডলি প্রাকৃতিক নকশা।",
          features: ["Tropical Waterbodies", "Nature Pathways", "Gazebos & Pergolas"],
          pricing: "Custom Project Quote",
        },
        {
          title: "Office Landscape",
          bengaliTitle: "অফিস ল্যান্ডস্কেপ",
          desc: "কর্মক্ষেত্রের ভেতর বায়োফিলিক পরিবেশ ও মানসিক প্রশান্তি বৃদ্ধিকারী আধুনিক সবুজ বিন্যাস।",
          features: ["Low-light Air Purifiers", "Desk Planters", "Reception Green Wall"],
          pricing: "Starting from ৳৩০,০০০",
        },
        {
          title: "Café & Restaurant Landscape",
          bengaliTitle: "ক্যাফে ও রেস্টুরেন্ট ল্যান্ডস্কেপ",
          desc: "গ্রাহকদের আকর্ষিত করার জন্য ইনস্টাগ্রাম-ফ্রেন্ডলি রুফটপ বা আলফ্রেসকো ক্যাফে অ্যাম্বিয়েন্স।",
          features: ["Hanging Planters", "Ambient Fairy Lighting", "Outdoor Dining Greenery"],
          pricing: "Starting from ৳৪০,০০০",
        },
        {
          title: "Factory Landscape",
          bengaliTitle: "ফ্যাক্টরি ও ইন্ডাস্ট্রিয়াল ল্যান্ডস্কেপ",
          desc: "পরিবেশবান্ধব ও কমপ্লায়েন্স-উপযুক্ত সবুজ বনায়ন, সবুজ বাফার জোন ও লন।",
          features: ["Pollution Filter Trees", "Perimeter Green Belts", "Low-maintenance Lawns"],
          pricing: "Custom Quote",
        },
        {
          title: "Park Landscape",
          bengaliTitle: "পার্ক ও পাবলিক ল্যান্ডস্কেপ",
          desc: "কমিউনিটি পার্ক, শিশুদের খেলার মাঠ ও পাবলিক ওয়াকওয়ের নান্দনিক নকশা ও সবুজায়ন।",
          features: ["Public Seating Zones", "Shade Trees", "Durable Sod Lawns"],
          pricing: "Custom Quote",
        },
      ],
    },
    {
      id: "garden-services",
      name: "Garden Services",
      bengaliName: "গার্ডেন সার্ভিসেস (বাগান তৈরি)",
      icon: "🌴",
      desc: "ছাদ, বারান্দা ও লনে বিভিন্ন শৈলীর নজরকাড়া বাগান তৈরি।",
      services: [
        {
          title: "Luxury Garden",
          bengaliTitle: "লাক্সারি গার্ডেন",
          desc: "আমদানিকৃত দুর্লভ গাছ, মার্বেল ফাউন্টেন, সিরামিক টব ও ডিজাইনার পারগোলা সম্বলিত বিলাসবহুল বাগান।",
          features: ["Bonsai Specimens", "Architectural Stone Work", "Designer Seating"],
          pricing: "Starting from ৳১,৫০,০০০",
        },
        {
          title: "Standard / Normal Garden",
          bengaliTitle: "স্ট্যান্ডার্ড গার্ডেন",
          desc: "বাজেট-বান্ধব কিন্তু দৃষ্টিনন্দন ফুল ও ফলজ গাছের সুশৃঙ্খল বাগান।",
          features: ["Seasonal Flowers", "Organic Soil Mix", "Clay Planters"],
          pricing: "Starting from ৳২৫,০০০",
        },
        {
          title: "Rooftop Garden",
          bengaliTitle: "রুফটপ গার্ডেন (ছাদবাগান)",
          desc: "১০০% ওয়াটারপ্রুফ মেমব্রেন, ড্রেনেজ সেল ও হালকা সয়েল মিডিয়ায় ছাদকে সবুজ স্বর্গে রূপান্তর।",
          features: ["100% Waterproofing", "Drip Line Grid", "Wind Barrier Plants", "Lawn Carpet"],
          pricing: "Starting from ৳৪০,০০০",
        },
        {
          title: "Terrace Garden",
          bengaliTitle: "টেরেস গার্ডেন",
          desc: "বিল্ডিংয়ের টেরেস ও ওপেন ডেকে আধুনিক আউটডোর লিভিং স্পেস ও প্ল্যান্টার্স।",
          features: ["Container Gardening", "Composite Decking", "Outdoor Furniture"],
          pricing: "Starting from ৳৩৫,০০০",
        },
        {
          title: "Vertical Garden",
          bengaliTitle: "ভার্টিক্যাল গার্ডেন (দেয়াল বাগান)",
          desc: "হাই-ডেনসিটি জিওটেক্সটাইল পকেটে দেয়ালজুড়ে জীবিত গাছের জীবন্ত আর্টওয়ার্ক।",
          features: ["Automated Fertigation", "Ambient Grow Lights", "Air-Purifying Species"],
          pricing: "৳৩৫০-৫৫০ / sqft",
        },
        {
          title: "Lawn Garden",
          bengaliTitle: "লন গার্ডেন (ঘাসের মাঠ)",
          desc: "বারমুডা, জাপানিজ বা মেক্সিকান গ্রাস দিয়ে নিখুঁত নরম সবুজ কার্পেট লন তৈরি।",
          features: ["Ground Grading", "Roll Sod Installation", "Edge Trimming"],
          pricing: "৳৩৫-৬০ / sqft",
        },
        {
          title: "Indoor & Balcony Garden",
          bengaliTitle: "ইনডোর ও ব্যালকনি গার্ডেন",
          desc: "ছোট ব্যালকনি বা ঘরের ভেতর সুনির্দিষ্ট আলো অনুযায়ী আকর্ষণীয় মিনি বাগান।",
          features: ["Compact Hanging Pots", "Air Purifiers", "Self-watering pots"],
          pricing: "Starting from ৳১৫,০০০",
        },
        {
          title: "Garden Renovation",
          bengaliTitle: "গার্ডেন রেনোভেশন (পুনরুদ্ধার)",
          desc: "পুরাতন ও নষ্ট হয়ে যাওয়া বাগানকে নতুন মাটি, নতুন গাছ ও নকশার মাধ্যমে পুনরুজ্জীবিত করা।",
          features: ["Soil Rejuvenation", "Dead Plant Replacement", "Pathway Restoration"],
          pricing: "Custom Assessment",
        },
      ],
    },
    {
      id: "plant-health",
      name: "Plant Health & Tree Doctor",
      bengaliName: "ট্রি ডক্টর ও প্ল্যান্ট হেলথ",
      icon: "🩺",
      desc: "গাছের যেকোনো রোগ নির্ণয়, পুষ্টির ঘাটতি পূরণ ও জরুরি সার্জারি সেবা।",
      services: [
        {
          title: "Tree Doctor Clinical Visit",
          bengaliTitle: "ট্রি ডক্টর অন-সাইট ভিজিট",
          desc: "বিশেষজ্ঞ এগ্রোনমিস্ট সরাসরি আপনার বাগানে এসে আক্রান্ত গাছ পর্যবেক্ষণ ও প্রেসক্রিপশন প্রদান করেন।",
          features: ["Fungal Diagnosis", "Pest Identification", "Written Prescription"],
          pricing: "৳১,৫০০ ভিজিট ফি",
        },
        {
          title: "Plant Health Management",
          bengaliTitle: "প্ল্যান্ট হেলথ ম্যানেজমেন্ট",
          desc: "দীর্ঘমেয়াদী সুরক্ষায় গাছে রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি ও সুষম নিউট্রিশন প্ল্যান।",
          features: ["Micronutrient Boost", "Bio-pesticide Sprays", "Health History Log"],
          pricing: "Monthly Plans Available",
        },
        {
          title: "Soil Testing & Diagnosis",
          bengaliTitle: "সয়েল টেস্টিং ও ডায়াগনোসিস",
          desc: "মাটির পিএইচ (pH), লবণাক্ততা এবং পুষ্টি উপাদান পরীক্ষা করে উপযোগী মাটি তৈরি।",
          features: ["pH & N-P-K Lab Test", "Drainage Flow Test", "Custom Soil Conditioning"],
          pricing: "৳২,০০০ / স্যাম্পল",
        },
        {
          title: "Disease Diagnosis & Treatment",
          bengaliTitle: "রোগ নির্ণয় ও নিরাময় চিকিৎসা",
          desc: "গাছের পাতা পোড়া, কান্ড পচা, উইপোকা বা মিলিবাগ দমনে সমন্বিত বালাই দমন (IPM)।",
          features: ["Targeted Fungicide", "Bark Injections", "Stem Surgery"],
          pricing: "Based on Treatment",
        },
      ],
    },
    {
      id: "maintenance",
      name: "Garden Maintenance",
      bengaliName: "গার্ডেন মেইনটেন্যান্স (পরিচর্যা)",
      icon: "🔧",
      desc: "অভিজ্ঞ মালী ও সুপারভাইজারের নিয়মিত তত্ত্বাবধানে বাগানের শতভাগ সজীবতা রক্ষা।",
      services: [
        {
          title: "Regular & Monthly Maintenance",
          bengaliTitle: "মাসিক মেইনটেন্যান্স প্যাকেজ",
          desc: "মাসে ২-৪ দিন অভিজ্ঞ মালী ও ট্রি ডক্টরের নিয়মিত পরিচর্যা ও মনিটরিং।",
          features: ["Lawn Mowing", "Pruning & Trimming", "Organic Fertilizer Feeding", "Pest Spray"],
          pricing: "Starting from ৳৫,০০০ / মাস",
        },
        {
          title: "Weekly Maintenance",
          bengaliTitle: "সাপ্তাহিক ভিজিট প্যাকেজ",
          desc: "বড় বাগান ও করপোরেট ক্লায়েন্টদের জন্য প্রতি সপ্তাহে নিবেদিত মালীর পরিচর্যা।",
          features: ["Weekly Weeding", "Watering System Check", "Plant Shaping"],
          pricing: "Starting from ৳৮,০০০ / মাস",
        },
        {
          title: "One-Time Deep Service",
          bengaliTitle: "ওয়ান-টাইম ডিপ ক্লিন ও সার্ভিসিং",
          desc: "বাগানের আগাছা পরিষ্কার, নতুন সার প্রয়োগ ও পূর্ণাঙ্গ কাটাই-ছাঁটাই এর ওয়ান-স্টপ সমাধান।",
          features: ["Overhaul Cleaning", "Full Pruning", "Fresh Potting Mix"],
          pricing: "Starting from ৳৩,৫০০",
        },
        {
          title: "Gardener / Mali Service",
          bengaliTitle: "প্রফেশনাল মালী সরবরাহ",
          desc: "প্রশিক্ষিত, ভদ্র ও অভিজ্ঞ মালী ডেডিকেটেড কাজের জন্য নিয়োগের সুযোগ।",
          features: ["Background Verified", "Botanical Training", "Equipment Included"],
          pricing: "Daily / Monthly Contract",
        },
      ],
    },
    {
      id: "irrigation",
      name: "Irrigation Systems",
      bengaliName: "ইরিগেশন ও ড্রেনেজ সলিউশন",
      icon: "💧",
      desc: "পানি সাশ্রয়ী আধুনিক অটো ড্রিপ ও স্প্রিংকলার ইরিগেশন প্রযুক্তি।",
      services: [
        {
          title: "Smart Drip Irrigation",
          bengaliTitle: "স্মার্ট ড্রিপ ইরিগেশন",
          desc: "প্রতিটি গাছের গোড়ায় নির্দিষ্ট ফোটা ফোটা পানি সরবরাহের স্বয়ংক্রিয় ড্রিপ লাইন নেটওয়ার্ক।",
          features: ["70% Water Saving", "Root Zone Hydration", "Anti-clog Emitters"],
          pricing: "Starting from ৳১৫,০০০",
        },
        {
          title: "Sprinkler Irrigation",
          bengaliTitle: "স্প্রিংকলার ইরিগেশন",
          desc: "লন ও ঘাসের মাঠ ভিজিয়ে রাখতে রোটারি ও পপ-আপ স্প্রিংকলার নোযেল সেটআপ।",
          features: ["360° Lawn Coverage", "Pop-up Concealed Heads", "Uniform Spray"],
          pricing: "Starting from ৳২০,০০০",
        },
        {
          title: "Automatic Timer Controlled",
          bengaliTitle: "ডিজিটাল টাইমার কন্ট্রোল্ড",
          desc: "নির্দিষ্ট সময়ে স্বয়ংক্রিয়ভাবে ভালভ অন ও অফ হওয়ার ইলেকট্রনিক টাইমার ও ব্যাটারি ব্যাকআপ।",
          features: ["Zero Manual Effort", "Rain Sensor Cut-off", "Mobile App Ready"],
          pricing: "Starting from ৳৮,০০০ / Controller",
        },
        {
          title: "Drainage Solution",
          bengaliTitle: "রুফটপ ড্রেনেজ সলিউশন",
          desc: "ছাদে বা বারান্দায় কোনো প্রকার পানি জমে থাকা রোধে জিও-কম্পোজিট ড্রেনেজ ম্যাট ও আউটলেট।",
          features: ["Puddle-Free Slabs", "Clog-resistant Geotextile", "Fast Runoff"],
          pricing: "Custom Quote",
        },
      ],
    },
    {
      id: "additional",
      name: "Additional Landscape Features",
      bengaliName: "অতিরিক্ত ল্যান্ডস্কেপ ফিচার",
      icon: "⛲",
      desc: "ফাউন্টেন, গার্ডেন লাইটিং, পারগোলা ও কাঠের আউটডোর সিটিংয়ের বিশেষ কারুকাজ।",
      services: [
        {
          title: "Garden Lighting",
          bengaliTitle: "গার্ডেন লাইটিং ও আলোকসজ্জা",
          desc: "ওয়াটারপ্রুফ এলইডি স্পাইক লাইট, পাথওয়ে বোলার্ড ও গাছের আপ-লাইটিং।",
          features: ["IP68 Waterproofing", "Warm Ambient Mood", "Solar Option Available"],
          pricing: "Custom Quote",
        },
        {
          title: "Fountains & Water Features",
          bengaliTitle: "ফাউন্টেন ও ওয়াটার ফিচার",
          desc: "মনোরম পানির আওয়াজে মন শান্ত করতে কাস্টমাইজড ফোয়ারা ও ক্যাস্কেড ফলস।",
          features: ["Submersible Pumps", "Underwater LED Glow", "Stone / Ceramic Finishes"],
          pricing: "Starting from ৳২৫,০০০",
        },
        {
          title: "Pergolas & Outdoor Seating",
          bengaliTitle: "পারগোলা ও আউটডোর সিটিং",
          desc: "ছাদে বা লনে আরামদায়ক কাঠের বা মেটাল পারগোলা, বেঞ্চ ও ক্যানোপি।",
          features: ["Weather-treated Timber", "Rust-proof Powder Coating", "Creep Vine Trellis"],
          pricing: "Custom Dimensions",
        },
      ],
    },
    {
      id: "materials",
      name: "Gardening Materials",
      bengaliName: "গার্ডেনিং ম্যাটেরিয়ালস ও প্ল্যান্টস",
      icon: "🪴",
      desc: "উচ্চমানের গাছ, সমৃদ্ধ মাটি, ভার্মিকম্পোস্ট ও ডিজাইনার টবের বিশ্বস্ত সংগ্রহ।",
      services: [
        {
          title: "Plants & Trees Supply",
          bengaliTitle: "গাছ ও ফলজ চারার সরবরাহ",
          desc: "দেশি-বিদেশি ইনডোর ও আউটডোর শোভাবর্ধনকারী ও ফলজ গাছের সুস্থ চারা।",
          features: ["Ficus, Palms & Bonsai", "Fruit Bearing Hybrids", "Guaranteed Rooted"],
          pricing: "Wholesale & Retail",
        },
        {
          title: "Soil Media & Organic Fertilizer",
          bengaliTitle: "মাটি, কোকোপিট ও ভার্মিকম্পোস্ট",
          desc: "হালকা ও পুষ্টিসমৃদ্ধ পটিং মিক্স, ছত্রাকমুক্ত কম্পোস্ট ও জীবাণু সার।",
          features: ["Lightweight Rooftop Mix", "100% Organic Vermicompost", "Sterilized Peat"],
          pricing: "Per Bag / Bulk",
        },
        {
          title: "Decorative Pots & Planters",
          bengaliTitle: "ডিজাইনার সিরামিক ও ফাইবার টব",
          desc: "আধুনিক আর্কিটেকচারাল লুকের জন্য হালকা ও দীর্ঘস্থায়ী ফাইবারগ্লাস ও সিরামিক প্ল্যান্টার।",
          features: ["Modern Geometrics", "UV-Resistant Colors", "Built-in Drainage Tray"],
          pricing: "Various Sizes",
        },
      ],
    },
  ];

  const currentCat = categories.find((c) => c.id === activeCategory) || categories[0];

  const faqs = [
    {
      q: "ছাদবাগানের ক্ষেত্রে ওয়াটারপ্রুফিং কতটা নিরাপদ?",
      a: "আমাদের প্রথম ও প্রধান অগ্রাধিকার হলো ভবনের সুরক্ষা। আমরা ৩-স্তরের বিশেষ পলিমার ওয়াটারপ্রুফ মেমব্রেন ও ড্রেনেজ সেল ব্যবহার করি, যাতে ছাদ কোনোভাবেই ভিজে না থাকে বা লিকেজের ঝুঁকি না তৈরি হয়।",
    },
    {
      q: "ট্রি ডক্টর সার্ভিস কীভাবে বুক করব?",
      a: "আমাদের হটলাইন ০১৬২০৬৯২৪৪৯ নম্বরে কল করে অথবা ওয়েবসাইটের 'Book Tree Doctor' বাটন চেপে সহজেই বুক করতে পারবেন। আমাদের বিশেষজ্ঞ ডাক্তার আপনার ঠিকানায় এসে সমস্যা পরীক্ষা করবেন।",
    },
    {
      q: "অটো ড্রিপ ইরিগেশন কীভাবে কাজ করে?",
      a: "একটি ডিজিটাল টাইমারের সাহায্যে প্রতিদিন নির্দিষ্ট সময়ে পানির মোটর ও সোলেনয়েড ভালভ স্বয়ংক্রিয়ভাবে অন হয় এবং প্রতিটি গাছের মূলে ফোঁটা ফোঁটা পানি দিয়ে নিজ থেকেই বন্ধ হয়ে যায়। আপনি বাড়িতে না থাকলেও গাছ শুকিয়ে যাবে না।",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-emerald-50/30 via-white to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>🌿</span> পূর্ণাঙ্গ সেবা তালিকা • Complete Services Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
            Comprehensive Landscaping & <br />
            <span className="text-emerald-700 italic font-medium">Garden Solutions</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            ল্যান্ডস্কেপ ডিজাইন থেকে শুরু করে ছাদবাগান, স্মার্ট সেচ প্রযুক্তি, ট্রি ডক্টর চিকিৎসা এবং মাসিক পরিচর্যা — আপনার সবুজের সব সমাধান এক ঠিকানায়।
          </p>
        </div>

        {/* Categories Horizontal Tabs */}
        <div className="flex overflow-x-auto gap-2.5 pb-3 scrollbar-none border-b border-gray-200">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs md:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === c.id
                  ? "bg-emerald-700 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
              }`}
            >
              <span className="text-base">{c.icon}</span>
              <span>{c.bengaliName}</span>
            </button>
          ))}
        </div>

        {/* Active Category Overview */}
        <div className="bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border border-emerald-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{currentCat.icon}</span>
              <h2 className="text-2xl font-serif font-bold text-gray-900">{currentCat.bengaliName}</h2>
            </div>
            <span className="text-xs font-semibold text-emerald-800 block mt-0.5">{currentCat.name}</span>
            <p className="text-xs md:text-sm text-gray-600 mt-2 max-w-2xl">{currentCat.desc}</p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap"
            >
              ফ্রি কনসালটেশন নিন
            </Link>
            <a
              href="tel:01620692449"
              className="px-4 py-2.5 bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl hover:bg-emerald-50 transition-all whitespace-nowrap"
            >
              📞 01620692449
            </a>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCat.services.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base font-serif">{srv.bengaliTitle}</h3>
                    <span className="text-xs text-gray-400 block mt-0.5">{srv.title}</span>
                  </div>
                  <span className="text-2xl">{currentCat.icon}</span>
                </div>

                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {srv.desc}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">প্রধান বৈশিষ্ট্যসমূহ:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {srv.features.map((f, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg font-medium border border-emerald-100"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase">মূল্য নির্ধারণ</span>
                  <span className="text-xs font-bold text-emerald-800">{srv.pricing || "কোটেশন অনুযায়ী"}</span>
                </div>

                <Link
                  href={`/contact?service=${encodeURIComponent(srv.title)}`}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
                >
                  বুকিং করুন →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6 pt-10">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-serif font-bold text-gray-900">সাধারণ কিছু প্রশ্নোত্তর (FAQ)</h3>
            <p className="text-xs text-gray-500">আপনার যেকোনো প্রশ্ন থাকলে সরাসরি জেনে নিন</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-gray-900 text-sm focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-emerald-700">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <p className="text-xs md:text-sm text-gray-600 mt-3 leading-relaxed pt-2 border-t border-emerald-100">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
