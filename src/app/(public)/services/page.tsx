"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";


interface IServiceItem {
  id?: string;
  slug: string;
  title: string;
  bengaliTitle: string;
  desc: string;
  features: string[];
  pricing?: string;
  category: string;
  icon?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  bengaliName: string;
  icon: string;
  desc: string;
  services: IServiceItem[];
}

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("landscape-design");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [bookingModalService, setBookingModalService] = useState<IServiceItem | null>(null);

  // Booking Modal Form State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  // Default Categories data mapping to all 7 masterplan categories
  const initialCategories: ServiceCategory[] = [
    {
      id: "landscape-design",
      name: "Landscape Design & Implementation",
      bengaliName: "ল্যান্ডস্কেপ ডিজাইন ও বাস্তবায়ন",
      icon: "🏡",
      desc: "সম্পূর্ণ আধুনিক ও আন্তর্জাতিক মানের ল্যান্ডস্কেপিং স্থাপত্য পরিকল্পনা ও বাস্তবায়ন।",
      services: [
        {
          slug: "residential-landscape",
          title: "Residential Landscape Design",
          bengaliTitle: "রেসিডেন্সিয়াল ল্যান্ডস্কেপ (আবাসিক)",
          desc: "ব্যক্তিগত বাড়ি, ডুপ্লেক্স বা ভিলার চারপাশ ও উঠানের নান্দনিক সবুজায়ন ও হার্ডস্কেপ ডিজাইন।",
          features: ["2D/3D Master Layout", "Lawn Sodding", "Walkway Paving", "Mood Lighting"],
          pricing: "৳৫০,০০০ থেকে শুরু",
          category: "Landscape Design & Implementation"
        },
        {
          slug: "commercial-landscape",
          title: "Commercial & Corporate Landscape",
          bengaliTitle: "কমার্শিয়াল ল্যান্ডস্কেপ",
          desc: "করপোরেট অফিস, শপিং প্লাজা এবং বাণিজ্যিক ভবনের প্রিমিয়াম গ্রিন এক্সটেরিয়র ও ইন্টেরিয়র।",
          features: ["Executive Entryways", "Waterproof planters", "Corporate Green Walls"],
          pricing: "৳১,০০,০০০ থেকে শুরু",
          category: "Landscape Design & Implementation"
        },
        {
          slug: "resort-landscape",
          title: "Resort & Eco-Park Landscape",
          bengaliTitle: "রিসোর্ট ল্যান্ডস্কেপ",
          desc: "বিলাসবহুল রিসোর্ট, ফার্মহাউস ও অবকাশ যাপন কেন্দ্রের জন্য ইকো-ফ্রেন্ডলি প্রাকৃতিক নকশা।",
          features: ["Tropical Waterbodies", "Nature Pathways", "Gazebos & Pergolas"],
          pricing: "কাস্টম প্রজেক্ট কোটেশন",
          category: "Landscape Design & Implementation"
        },
        {
          slug: "office-landscape",
          title: "Office Biophilic Landscape",
          bengaliTitle: "অফিস ল্যান্ডস্কেপ",
          desc: "কর্মক্ষেত্রের ভেতর বায়োফিলিক পরিবেশ ও মানসিক প্রশান্তি বৃদ্ধিকারী আধুনিক সবুজ বিন্যাস।",
          features: ["Low-light Air Purifiers", "Desk Planters", "Reception Green Wall"],
          pricing: "৳৩০,০০০ থেকে শুরু",
          category: "Landscape Design & Implementation"
        },
        {
          slug: "cafe-restaurant-landscape",
          title: "Café & Restaurant Landscape",
          bengaliTitle: "ক্যাফে ও রেস্টুরেন্ট ল্যান্ডস্কেপ",
          desc: "গ্রাহকদের আকর্ষিত করার জন্য ইনস্টাগ্রাম-ফ্রেন্ডলি রুফটপ বা আলফ্রেসকো ক্যাফে অ্যাম্বিয়েন্স।",
          features: ["Hanging Planters", "Ambient Fairy Lighting", "Outdoor Dining Greenery"],
          pricing: "৳৪০,০০০ থেকে শুরু",
          category: "Landscape Design & Implementation"
        },
        {
          slug: "factory-landscape",
          title: "Factory & Industrial Landscape",
          bengaliTitle: "ফ্যাক্টরি ও ইন্ডাস্ট্রিয়াল ল্যান্ডস্কেপ",
          desc: "পরিবেশবান্ধব ও কমপ্লায়েন্স-উপযুক্ত সবুজ বনায়ন, সবুজ বাফার জোন ও লন।",
          features: ["Pollution Filter Trees", "Perimeter Green Belts", "Low-maintenance Lawns"],
          pricing: "কাস্টম প্রজেক্ট কোটেশন",
          category: "Landscape Design & Implementation"
        },
        {
          slug: "park-landscape",
          title: "Park & Public Landscape",
          bengaliTitle: "পার্ক ও পাবলিক ল্যান্ডস্কেপ",
          desc: "কমিউনিটি পার্ক, শিশুদের খেলার মাঠ ও পাবলিক ওয়াকওয়ের নান্দনিক নকশা ও সবুজায়ন।",
          features: ["Public Seating Zones", "Shade Trees", "Durable Sod Lawns"],
          pricing: "কাস্টম কোটেশন",
          category: "Landscape Design & Implementation"
        }
      ]
    },
    {
      id: "garden-services",
      name: "Garden Services",
      bengaliName: "গার্ডেন সার্ভিসেস (বাগান তৈরি)",
      icon: "🌴",
      desc: "ছাদ, বারান্দা ও লনে বিভিন্ন শৈলীর নজরকাড়া বাগান তৈরি।",
      services: [
        {
          slug: "luxury-zen-garden",
          title: "Luxury Villa & Zen Garden",
          bengaliTitle: "লাক্সারি ও জেন গার্ডেন",
          desc: "আমদানিকৃত দুর্লভ বনসাই, মার্বেল ফাউন্টেন, সিরামিক টব ও ডিজাইনার পারগোলা সম্বলিত বিলাসবহুল বাগান।",
          features: ["Bonsai Specimens", "Architectural Stone Work", "Designer Seating"],
          pricing: "৳১,৮০,০০০ থেকে শুরু",
          category: "Garden Services"
        },
        {
          slug: "standard-garden",
          title: "Standard Home Garden",
          bengaliTitle: "স্ট্যান্ডার্ড গার্ডেন",
          desc: "বাজেট-বান্ধব কিন্তু দৃষ্টিনন্দন ফুল ও ফলজ গাছের সুশৃঙ্খল বাগান।",
          features: ["Seasonal Flowers", "Organic Soil Mix", "Clay Planters"],
          pricing: "৳২৫,০০০ থেকে শুরু",
          category: "Garden Services"
        },
        {
          slug: "rooftop-gardening",
          title: "Rooftop Garden Setup",
          bengaliTitle: "রুফটপ গার্ডেন (ছাদবাগান)",
          desc: "১০০% ওয়াটারপ্রুফ মেমব্রেন, ড্রেনেজ সেল ও হালকা সয়েল মিডিয়ায় ছাদকে সবুজ স্বর্গে রূপান্তর।",
          features: ["100% Waterproofing", "Drip Line Grid", "Wind Barrier Plants", "Lawn Carpet"],
          pricing: "৳১,৫০,০০০ থেকে শুরু",
          category: "Garden Services"
        },
        {
          slug: "terrace-garden",
          title: "Terrace Deck Garden",
          bengaliTitle: "টেরেস গার্ডেন",
          desc: "বিল্ডিংয়ের টেরেস ও ওপেন ডেকে আধুনিক আউটডোর লিভিং স্পেস ও প্ল্যান্টার্স।",
          features: ["Container Gardening", "Composite Decking", "Outdoor Furniture"],
          pricing: "৳৩৫,০০০ থেকে শুরু",
          category: "Garden Services"
        },
        {
          slug: "vertical-garden",
          title: "Vertical Wall Greenery",
          bengaliTitle: "ভার্টিক্যাল গার্ডেন (দেয়াল বাগান)",
          desc: "হাই-ডেনসিটি জিওটেক্সটাইল পকেটে দেয়ালজুড়ে জীবিত গাছের জীবন্ত আর্টওয়ার্ক।",
          features: ["Automated Fertigation", "Ambient Grow Lights", "Air-Purifying Species"],
          pricing: "৳৪৫০ - ৬৫০ / sqft",
          category: "Garden Services"
        },
        {
          slug: "lawn-garden",
          title: "Lawn Sod Grass Installation",
          bengaliTitle: "লন গার্ডেন (ঘাসের মাঠ)",
          desc: "বারমুডা, জাপানিজ বা মেক্সিকান গ্রাস দিয়ে নিখুঁত নরম সবুজ কার্পেট লন তৈরি।",
          features: ["Ground Grading", "Roll Sod Installation", "Edge Trimming"],
          pricing: "৳৩৫ - ৬০ / sqft",
          category: "Garden Services"
        },
        {
          slug: "balcony-indoor-garden",
          title: "Indoor & Balcony Mini Garden",
          bengaliTitle: "ইনডোর ও ব্যালকনি গার্ডেন",
          desc: "ছোট ব্যালকনি বা ঘরের ভেতর সুনির্দিষ্ট আলো অনুযায়ী আকর্ষণীয় মিনি বাগান।",
          features: ["Compact Hanging Pots", "Air Purifiers", "Self-watering pots"],
          pricing: "৳১৫,০০০ থেকে শুরু",
          category: "Garden Services"
        },
        {
          slug: "garden-renovation",
          title: "Garden Renovation & Remodeling",
          bengaliTitle: "গার্ডেন রেনোভেশন (পুনরুদ্ধার)",
          desc: "পুরাতন ও নষ্ট হয়ে যাওয়া বাগানকে নতুন মাটি, নতুন গাছ ও নকশার মাধ্যমে পুনরুজ্জীবিত করা।",
          features: ["Soil Rejuvenation", "Dead Plant Replacement", "Pathway Restoration"],
          pricing: "কাস্টম অ্যাসেসমেন্ট",
          category: "Garden Services"
        }
      ]
    },
    {
      id: "plant-health",
      name: "Plant Health & Tree Doctor",
      bengaliName: "ট্রি ডক্টর ও প্ল্যান্ট হেলথ",
      icon: "🩺",
      desc: "গাছের যেকোনো রোগ নির্ণয়, পুষ্টির ঘাটতি পূরণ ও জরুরি সার্জারি সেবা।",
      services: [
        {
          slug: "tree-doctor",
          title: "Tree Doctor Clinical Visit",
          bengaliTitle: "ট্রি ডক্টর অন-সাইট ভিজিট",
          desc: "বিশেষজ্ঞ এগ্রোনমিস্ট সরাসরি আপনার বাগানে এসে আক্রান্ত গাছ পর্যবেক্ষণ ও প্রেসক্রিপশন প্রদান করেন।",
          features: ["Fungal Diagnosis", "Pest Identification", "Written Prescription"],
          pricing: "৳১,৫০০ ভিজিট ফি",
          category: "Plant Health"
        },
        {
          slug: "plant-health-management",
          title: "Plant Health Management",
          bengaliTitle: "প্ল্যান্ট হেলথ ম্যানেজমেন্ট",
          desc: "দীর্ঘমেয়াদী সুরক্ষায় গাছে রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি ও সুষম নিউট্রিশন প্ল্যান।",
          features: ["Micronutrient Boost", "Bio-pesticide Sprays", "Health History Log"],
          pricing: "মাসিক প্ল্যান প্রযোজ্য",
          category: "Plant Health"
        },
        {
          slug: "soil-testing-treatment",
          title: "Soil Testing & Diagnosis",
          bengaliTitle: "সয়েল টেস্টিং ও ডায়াগনোসিস",
          desc: "মাটির পিএইচ (pH), লবণাক্ততা এবং পুষ্টি উপাদান পরীক্ষা করে উপযোগী মাটি তৈরি।",
          features: ["pH & N-P-K Lab Test", "Drainage Flow Test", "Custom Soil Conditioning"],
          pricing: "৳২,০০০ / স্যাম্পল",
          category: "Plant Health"
        },
        {
          slug: "disease-diagnosis-treatment",
          title: "Disease Diagnosis & Tree Surgery",
          bengaliTitle: "রোগ নির্ণয় ও নিরাময় চিকিৎসা",
          desc: "গাছের পাতা পোড়া, কান্ড পচা, উইপোকা বা মিলিবাগ দমনে সমন্বিত বালাই দমন (IPM)।",
          features: ["Targeted Fungicide", "Bark Injections", "Stem Surgery"],
          pricing: "ট্রিটমেন্ট অনুযায়ী",
          category: "Plant Health"
        }
      ]
    },
    {
      id: "maintenance",
      name: "Garden Maintenance",
      bengaliName: "গার্ডেন মেইনটেন্যান্স (পরিচর্যা)",
      icon: "🔧",
      desc: "অভিজ্ঞ মালী ও সুপারভাইজারের নিয়মিত তত্ত্বাবধানে বাগানের শতভাগ সজীবতা রক্ষা।",
      services: [
        {
          slug: "garden-maintenance",
          title: "Scheduled Monthly Maintenance",
          bengaliTitle: "মাসিক মেইনটেন্যান্স প্যাকেজ",
          desc: "মাসে ২-৪ দিন অভিজ্ঞ মালী ও ট্রি ডক্টরের নিয়মিত পরিচর্যা ও মনিটরিং।",
          features: ["Lawn Mowing", "Pruning & Trimming", "Organic Fertilizer Feeding", "Pest Spray"],
          pricing: "৳৪,০০০ / মাস থেকে",
          category: "Maintenance"
        },
        {
          slug: "weekly-maintenance",
          title: "Weekly Dedicated Maintenance",
          bengaliTitle: "সাপ্তাহিক ভিজিট প্যাকেজ",
          desc: "বড় বাগান ও করপোরেট ক্লায়েন্টদের জন্য প্রতি সপ্তাহে নিবেদিত মালীর পরিচর্যা।",
          features: ["Weekly Weeding", "Watering System Check", "Plant Shaping"],
          pricing: "৳৮,০০০ / মাস থেকে",
          category: "Maintenance"
        },
        {
          slug: "one-time-maintenance",
          title: "One-Time Deep Garden Overhaul",
          bengaliTitle: "ওয়ান-টাইম ডিপ ক্লিন ও সার্ভিসিং",
          desc: "বাগানের আগাছা পরিষ্কার, নতুন সার প্রয়োগ ও পূর্ণাঙ্গ কাটাই-ছাঁটাই এর ওয়ান-স্টপ সমাধান।",
          features: ["Overhaul Cleaning", "Full Pruning", "Fresh Potting Mix"],
          pricing: "৳৩,৫০০ থেকে শুরু",
          category: "Maintenance"
        },
        {
          slug: "gardener-mali-service",
          title: "Professional Mali / Gardener Supply",
          bengaliTitle: "প্রফেশনাল মালী সরবরাহ",
          desc: "প্রশিক্ষিত, ভদ্র ও অভিজ্ঞ মালী ডেডিকেটেড কাজের জন্য নিয়োগের সুযোগ।",
          features: ["Background Verified", "Botanical Training", "Equipment Included"],
          pricing: "দৈনিক / মাসিক চুক্তি",
          category: "Maintenance"
        }
      ]
    },
    {
      id: "irrigation",
      name: "Irrigation Systems",
      bengaliName: "ইরিগেশন ও ড্রেনেজ সলিউশন",
      icon: "💧",
      desc: "পানি সাশ্রয়ী আধুনিক অটো ড্রিপ ও স্প্রিংকলার ইরিগেশন প্রযুক্তি।",
      services: [
        {
          slug: "smart-irrigation",
          title: "Smart Automated Drip Irrigation",
          bengaliTitle: "স্মার্ট ড্রিপ ইরিগেশন",
          desc: "প্রতিটি গাছের গোড়ায় নির্দিষ্ট ফোটা ফোটা পানি সরবরাহের স্বয়ংক্রিয় ড্রিপ লাইন নেটওয়ার্ক।",
          features: ["70% Water Saving", "Root Zone Hydration", "Anti-clog Emitters"],
          pricing: "৳২৫,০০০ থেকে শুরু",
          category: "Irrigation"
        },
        {
          slug: "lawn-sprinklers",
          title: "Lawn Pop-Up Sprinkler Systems",
          bengaliTitle: "স্প্রিংকলার ইরিগেশন",
          desc: "লন ও ঘাসের মাঠ ভিজিয়ে রাখতে রোটারি ও পপ-আপ স্প্রিংকলার নোযেল সেটআপ।",
          features: ["360° Lawn Coverage", "Pop-up Concealed Heads", "Uniform Spray"],
          pricing: "৳২০,০০০ থেকে শুরু",
          category: "Irrigation"
        },
        {
          slug: "digital-timer-controllers",
          title: "Digital Weather Sensing Timers",
          bengaliTitle: "ডিজিটাল টাইমার কন্ট্রোল্ড",
          desc: "নির্দিষ্ট সময়ে স্বয়ংক্রিয়ভাবে ভালভ অন ও অফ হওয়ার ইলেকট্রনিক টাইমার ও ব্যাটারি ব্যাকআপ।",
          features: ["Zero Manual Effort", "Rain Sensor Cut-off", "Mobile App Ready"],
          pricing: "৳৮,০০০ থেকে শুরু",
          category: "Irrigation"
        },
        {
          slug: "subsurface-drainage-solution",
          title: "Subsurface Drainage & French Drains",
          bengaliTitle: "সাব-সারফেস ড্রেনেজ সলিউশন",
          desc: "বর্ষায় লনে পানি জমা রোধ করতে ভূগর্ভস্থ পারফোরেটেড পাইপ ও ফ্রেঞ্চ ড্রেইন সমাধান।",
          features: ["Zero Water Logging", "Gravel Bed Filter", "Odor Prevention"],
          pricing: "৳১৮,০০০ থেকে শুরু",
          category: "Irrigation"
        }
      ]
    },
    {
      id: "additional-services",
      name: "Additional Landscape Features",
      bengaliName: "অ্যাডিশনাল ল্যান্ডস্কেপ ফিচার",
      icon: "💡",
      desc: "গার্ডেন লাইটিং, মার্বেল ঝর্ণা, পারগোলা ও কাঠের নান্দনিক আউটডোর আর্কিটেকচার।",
      services: [
        {
          slug: "garden-lighting-fountain",
          title: "Garden Lighting & Warm Atmospheric LEDs",
          bengaliTitle: "গার্ডেন লাইটিং ও নাইট অ্যাম্বিয়েন্স",
          desc: "IP68 ওয়াটারপ্রুফ আর্কিটেকচারাল ওয়ার্ম লাইট, স্পটলাইট, পাথওয়ে বোলার্ড এবং নাইট ইলুমিনেশন।",
          features: ["IP68 Waterproof", "Warm 3000K Soft Glow", "Sunset Timers", "Safe 12V/24V Low Voltage"],
          pricing: "৳৩৫,০০০ থেকে শুরু",
          category: "Additional Services"
        },
        {
          slug: "fountain-waterfall",
          title: "Natural Stone Fountains & Waterfalls",
          bengaliTitle: "ফাউন্টেন ও ওয়াটারফল (ঝর্ণা)",
          desc: "মার্বেল ও গ্রানাইটের দৃষ্টিনন্দন ঝর্ণা, ওয়াটারফল এবং মৃদু পানির কলতান সম্বলিত ওয়াটার ফিচার।",
          features: ["Silent Pumps", "Underwater Glow Lights", "Slate Stone Cascades", "Algae Bio-Filter"],
          pricing: "৳৪৫,০০০ থেকে শুরু",
          category: "Additional Services"
        },
        {
          slug: "pergola-gazebo-setup",
          title: "Outdoor Pergola & Wooden Gazebo",
          bengaliTitle: "পারগোলা ও আউটডোর গেজেবো",
          desc: "মেহগনি বা ট্রিটেড পাইন উড দিয়ে নির্মিত রোদ-বৃষ্টি প্রতিরোধী রাজকীয় সিটিং পারগোলা।",
          features: ["Weather-treated Timber", "Polycarbonate Clear Roofing", "Climber Vine Integration"],
          pricing: "৳৬০,০০০ থেকে শুরু",
          category: "Additional Services"
        },
        {
          slug: "landscape-accessories",
          title: "Landscape Accessories & Seating",
          bengaliTitle: "গার্ডেন অ্যাকসেসরিজ ও সিটিং বেঞ্চ",
          desc: "কাস্টমাইজড গার্ডেন বেঞ্চ, বারবিকিউ কর্নার, পাখির বাসা ও প্রাকৃতিক পাথরের স্টেপিং স্টোন।",
          features: ["Cast Iron & Teak Benches", "River Pebble Stones", "Decorative Terracotta"],
          pricing: "৳৮,০০০ থেকে শুরু",
          category: "Additional Services"
        }
      ]
    },
    {
      id: "gardening-materials",
      name: "Gardening Materials & Supplies",
      bengaliName: "গার্ডেনিং মেটেরিয়ালস ও সাপ্লাই",
      icon: "🪴",
      desc: "গাছপালা, জীবাণুমুক্ত জৈব মাটি, ভার্মিকম্পোস্ট, সিরামিক টব ও আধুনিক গার্ডেনিং টুলস।",
      services: [
        {
          slug: "soil-media-fertilizers",
          title: "Premium Soil Media & Organic Fertilizers",
          bengaliTitle: "প্রিমিয়াম সয়েল মিডিয়া ও ভার্মিকম্পোস্ট",
          desc: "জীবাণুমুক্ত জৈব মাটি, ভার্মিকম্পোস্ট, কোকোপিট ব্রিক, হাড়ের গুঁড়া ও প্রিমিয়াম মাইক্রোনিউট্রিয়েন্ট।",
          features: ["Pathogen-free Mix", "High Organic Vermicompost", "Low EC Cocopeat", "Slow-release Food"],
          pricing: "৳৫০০ থেকে শুরু",
          category: "Gardening Materials"
        },
        {
          slug: "plants-pots-materials",
          title: "Exotic Plants, Fruit Trees & Ceramic Planters",
          bengaliTitle: "গাছপালা, ফলজ চারা ও সিরামিক টব",
          desc: "আমদানিকৃত থাই ফলজ গাছ, এডেল বনসাই, আধুনিক সিরামিক ও ফাইবার টব এবং উন্নত টুলস।",
          features: ["Grafted Fruit Trees", "Weatherproof Ceramic Pots", "Japanese Pruning Tools", "100% Genuine"],
          pricing: "৳৮০০ থেকে শুরু",
          category: "Gardening Materials"
        }
      ]
    }
  ];

  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories);

  // Fetch dynamic services from PostgreSQL backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        if (res.ok) {
          const dbServices: any[] = await res.json();
          if (Array.isArray(dbServices) && dbServices.length > 0) {
            // Merge or augment categories with DB items
            setCategories(prev => {
              return prev.map(cat => {
                const matchedFromDb = dbServices.filter(s => 
                  s.category && (
                    s.category.toLowerCase().includes(cat.name.toLowerCase()) ||
                    cat.name.toLowerCase().includes(s.category.toLowerCase()) ||
                    (cat.id === "landscape-design" && s.category.includes("Landscape")) ||
                    (cat.id === "garden-services" && s.category.includes("Garden")) ||
                    (cat.id === "plant-health" && s.category.includes("Plant")) ||
                    (cat.id === "maintenance" && s.category.includes("Maintenance")) ||
                    (cat.id === "irrigation" && s.category.includes("Irrigation")) ||
                    (cat.id === "additional-services" && (s.category.includes("Additional") || s.category.includes("Lighting"))) ||
                    (cat.id === "gardening-materials" && (s.category.includes("Material") || s.category.includes("Supply")))
                  )
                );

                if (matchedFromDb.length === 0) return cat;

                // Map DB services to IServiceItem
                const formattedDbServices: IServiceItem[] = matchedFromDb.map(d => ({
                  id: d.id,
                  slug: d.slug || d.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  title: d.label,
                  bengaliTitle: d.label,
                  desc: d.desc || d.description || "",
                  features: Array.isArray(d.features) && d.features.length > 0 ? d.features : ["Professional Quality", "Expert Execution", "Quality Guarantee"],
                  pricing: d.pricing || "কোটেশন অনুযায়ী",
                  category: d.category,
                  icon: d.icon || cat.icon
                }));

                // Combine keeping unique slugs
                const existingSlugs = new Set(formattedDbServices.map(s => s.slug));
                const remainingStatic = cat.services.filter(s => !existingSlugs.has(s.slug));
                return {
                  ...cat,
                  services: [...formattedDbServices, ...remainingStatic]
                };
              });
            });
          }
        }
      } catch (err) {
        console.error("Could not fetch DB services:", err);
      }
    };

    fetchServices();
  }, []);

  // Handle Booking form submit directly to PostgreSQL
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalService) return;
    setIsSubmitting(true);
    setBookingSuccess(null);

    try {
      const payload = {
        clientName: clientName.trim(),
        clientEmail: `${clientPhone.trim()}@client.argreengarden.com`,
        phone: clientPhone.trim(),
        address: clientAddress.trim() || "Dhaka",
        service: `${bookingModalService.bengaliTitle} (${bookingModalService.title})`,
        budgetRange: bookingModalService.pricing || "Negotiable",
        message: clientMessage.trim() || `Booked for service: ${bookingModalService.title}. Preferred Date: ${bookingDate || 'Earliest available'}`
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setBookingSuccess(data.id || "BOOK-" + Math.floor(100000 + Math.random() * 900000));
      } else {
        const err = await res.json();
        alert("Booking failed: " + (err.error || "Please check inputs"));
      }
    } catch (err: any) {
      alert("Network error submitting booking: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCat = categories.find((c) => c.id === activeCategory) || categories[0];

  // Search filtering logic
  const allServicesList = categories.flatMap(c => c.services.map(s => ({ ...s, categoryId: c.id, categoryName: c.name, categoryBengali: c.bengaliName })));
  const searchFilteredServices = searchQuery.trim()
    ? allServicesList.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.bengaliTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : null;

  const faqs = [
    {
      q: "প্রজেক্ট বাস্তবায়নের আগে কি কোনো থ্রি-ডি (3D) ডিজাইন দেখানো হয়?",
      a: "হ্যাঁ, আমরা প্রতিটি মাঝারি ও বড় ল্যান্ডস্কেপিং এবং রুফটপ গার্ডেন প্রজেক্টে সাইট ভিজিট ও মাটির পরীক্ষার পর গ্রাহককে পূর্ণাঙ্গ 2D/3D আর্কিটেকচারাল ডিজাইন উপস্থাপন করি।"
    },
    {
      q: "ছাদবাগানে ছাদের ওয়াটারপ্রুফিংয়ের কী ধরনের গ্যারান্টি দেওয়া হয়?",
      a: "আমরা আন্তর্জাতিক মানের ৩-স্তর বিশিষ্ট ইলাস্টোমেরিক মেমব্রেন এবং ড্রেনেজ ম্যাট ব্যবহার করি। এতে ছাদের কংক্রিট সম্পূর্ণ সুরক্ষিত থাকে এবং আমরা ১০ বছরের ওয়াটারপ্রুফিং গ্যারান্টি প্রদান করি।"
    },
    {
      q: "ট্রি ডক্টর সার্ভিস কীভাবে কাজ করে?",
      a: "আপনার গাছের পাতা পোড়া, কান্ড পচা, ফুল ঝরে যাওয়া বা ছত্রাক সংক্রমণ দেখা দিলে আমাদের ট্রি ডক্টর অন-সাইট ভিজিট করে রোগ নির্ণয় করেন এবং অর্গানিক বালাইনাশক ও প্রেসক্রিপশন প্রদান করেন।"
    },
    {
      q: "মেইনটেন্যান্স প্যাকেজে কী কী সেবা অন্তর্ভুক্ত থাকে?",
      a: "আমাদের নিয়মিত মেইনটেন্যান্সে থাকে অভিজ্ঞ মালীর রুটিন ভিজিট, আগাছা পরিষ্কার, গাছের বৈজ্ঞানিক কাটাই-ছাঁটাই, লন মোয়িং, ফ্রিতে কেঁচো জৈব সার প্রয়োগ এবং ট্রি ডক্টরের ফলো-আপ।"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100/80 px-4 py-1.5 rounded-full border border-emerald-200">
            🌿 আমাদের সকল সেবা • Complete Services Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
            A R Green Garden <br />
            <span className="text-emerald-700 italic font-medium">৭টি প্রধান ক্যাটাগরির পূর্ণাঙ্গ সেবা</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            আন্তর্জাতিক মানের ল্যান্ডস্কেপ ডিজাইন, ১০০% ওয়াটারপ্রুফ ছাদবাগান, লিভিং গ্রিন ওয়াল, আধুনিক অটো ইরিগেশন, এবং বিশেষজ্ঞ ট্রি ডক্টর চিকিৎসা — আপনার বাগান সাজাতে সবকিছু এক ছাদের নিচে।
          </p>

          {/* Live Search Bar */}
          <div className="max-w-xl mx-auto pt-3 relative">
            <input
              type="text"
              placeholder="যেকোনো সেবা খুঁজুন (যেমন: Rooftop, Tree Doctor, Drip, ফাউন্টেন)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white rounded-full border border-emerald-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm transition-all"
            />
            <span className="absolute left-4 top-7 text-gray-400">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-7 text-xs text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Search Results Notification if Active */}
        {searchFilteredServices !== null && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between text-xs sm:text-sm text-emerald-900">
            <span>
              <b>"{searchQuery}"</b> এর জন্য মোট <b>{searchFilteredServices.length}</b>টি সেবা পাওয়া গেছে
            </span>
            <button
              onClick={() => setSearchQuery("")}
              className="text-emerald-700 font-bold underline cursor-pointer"
            >
              সকল ক্যাটাগরি দেখুন
            </button>
          </div>
        )}

        {/* 7 Category Selector Navigation (Shown when not searching) */}
        {!searchFilteredServices && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-5xl mx-auto">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-emerald-800 text-white shadow-lg scale-105"
                      : "bg-white text-gray-700 hover:bg-emerald-50/80 border border-emerald-100 hover:border-emerald-300"
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.bengaliName}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Category Description Banner (When browsing specific category) */}
        {!searchFilteredServices && (
          <div className="bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-3xl">{currentCat.icon}</span>
                <h2 className="text-xl sm:text-2xl font-serif font-bold">{currentCat.bengaliName}</h2>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
                {currentCat.desc}
              </p>
            </div>
            <button
              onClick={() => {
                setBookingModalService(currentCat.services[0]);
                setBookingSuccess(null);
              }}
              className="px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 rounded-full text-xs font-bold whitespace-nowrap shadow transition-all cursor-pointer"
            >
              💬 ফ্রি কনসাল্টেশন বুক করুন
            </button>
          </div>
        )}

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {(searchFilteredServices || currentCat.services).map((srv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg font-serif group-hover:text-emerald-800 transition-colors">
                      {srv.bengaliTitle}
                    </h3>
                    <span className="text-xs text-gray-400 block mt-0.5">{srv.title}</span>
                  </div>
                  <span className="text-2xl p-2.5 bg-emerald-50 rounded-2xl text-emerald-800">
                    {srv.icon || currentCat.icon}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {srv.desc}
                </p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                    ফিচার ও সুবিধাসমূহ:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {srv.features.map((f, fIdx) => (
                      <span
                        key={fIdx}
                        className="text-[11px] bg-emerald-50/70 text-emerald-800 px-2.5 py-0.5 rounded-lg font-medium border border-emerald-100"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer with Price, Detail Link & Direct Booking Modal Trigger */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase font-semibold block">আনুমানিক খরচ</span>
                    <span className="text-xs font-bold text-emerald-800">{srv.pricing || "কোটেশন অনুযায়ী"}</span>
                  </div>
                  <Link
                    href={`/services/${srv.slug}`}
                    className="text-xs text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    বিস্তারিত দেখুন <span>→</span>
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      setBookingModalService(srv);
                      setBookingSuccess(null);
                    }}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all text-center cursor-pointer"
                  >
                    বুকিং করুন
                  </button>

                  <a
                    href={`https://wa.me/8801620692449?text=Hello%20AR%20Green%20Garden,%20I%20am%20interested%20in%20your%20service:%20${encodeURIComponent(srv.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs font-semibold transition-all text-center flex items-center justify-center gap-1"
                  >
                    <span>💬</span> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Booking & Consultation Modal */}
        {bookingModalService && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-fade-in-up border border-emerald-100">
              <button
                onClick={() => setBookingModalService(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-xl font-bold w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>

              <div className="space-y-2 mb-6">
                <span className="text-xs font-bold text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {bookingModalService.category}
                </span>
                <h3 className="text-xl font-serif font-bold text-gray-900">
                  {bookingModalService.bengaliTitle}
                </h3>
                <p className="text-xs text-gray-500">
                  আপনার তথ্য প্রদান করুন। আমাদের ল্যান্ডস্কেপ এক্সপার্ট সরাসরি আপনার সাথে যোগাযোগ করবেন।
                </p>
              </div>

              {bookingSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                    ✓
                  </div>
                  <h4 className="font-bold text-base">আপনার বুকিং সফলভাবে গ্রহণ করা হয়েছে!</h4>
                  <p className="text-xs text-emerald-700">
                    রেফারেন্স ট্র্যাকিং আইডি: <b>{bookingSuccess}</b>
                  </p>
                  <p className="text-xs text-gray-600">
                    আমাদের সিনিয়র কর্মকর্তা শীঘ্রই আপনার সাথে কথা বলে সুবিধাজনক সময়ে সাইট পরিদর্শনে আসবেন।
                  </p>
                  <button
                    onClick={() => setBookingModalService(null)}
                    className="mt-4 px-6 py-2.5 bg-emerald-800 text-white rounded-full text-xs font-bold cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: তানভীর আহমেদ"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">ফোন নম্বর *</label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">পছন্দের তারিখ</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-600 text-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">লোকেশন / ঠিকানা</label>
                    <input
                      type="text"
                      placeholder="যেমন: রোড ৯/এ, ধানমন্ডি, ঢাকা"
                      value={clientAddress}
                      onChange={(e) => setClientAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">প্রজেক্ট সম্পর্কে নোট (ঐচ্ছিক)</label>
                    <textarea
                      rows={2}
                      placeholder="ছাদের মাপ, পছন্দসই গাছ বা সমস্যার বিবরণ..."
                      value={clientMessage}
                      onChange={(e) => setClientMessage(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-emerald-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "কনফার্ম করা হচ্ছে..." : "কনফার্ম বুকিং রিকোয়েস্ট পাঠান →"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

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
