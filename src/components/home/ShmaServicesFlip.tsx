"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface ShmaService {
  id: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  scopeBn: string[];
  scopeEn: string[];
}

const services: ShmaService[] = [
  {
    id: "01",
    titleBn: "ল্যান্ডস্কেপ স্থাপত্য ও নকশা",
    titleEn: "Landscape Architecture",
    descBn: "ভবনের মূল স্থাপত্যের সাথে বায়োফিলিক উপাদান, মাটির আর্দ্রতা এবং জীবন্ত উদ্ভিদের সমন্বয়ে সমন্বিত মাস্টার লেআউট প্রণয়ন।",
    descEn: "Comprehensive spatial design integrating built architecture with biophilic elements, soil hydrology, and living plant canopies.",
    scopeBn: ["কনসেপ্ট ও থ্রিডি ভিজ্যুয়ালাইজেশন", "স্ট্রাকচারাল লোড ও ড্রেনেজ সমন্বয়", "১০০% ওয়াটারপ্রুফ মেমব্রেন আর্কিটেকচার", "টার্ন-কি সাইট বাস্তবায়ন"],
    scopeEn: ["Concept & 3D Visualization", "Structural Load & Drainage", "100% Waterproofing Architecture", "Turn-key Site Implementation"],
  },
  {
    id: "02",
    titleBn: "মাস্টারপ্ল্যানিং ও বৃহৎ সবুজায়ন",
    titleEn: "Master Planning & Eco Parks",
    descBn: "রিসোর্ট, আবাসিক কমিউনিটি, বিশ্ববিদ্যালয় ক্যাম্পাস ও ইকো-পার্কের জন্য পরিবেশবান্ধব বৃহৎ মাস্টারপ্ল্যান প্রণয়ন।",
    descEn: "Macro-scale zoning and environmental landscape masterplans for resorts, residential communities, campuses, and industrial eco-parks.",
    scopeBn: ["সাইট জরিপ ও টপোগ্রাফি", "প্রাকৃতিক ড্রেনেজ নেটওয়ার্ক", "হাঁটার ট্রেইল ও সাইকেল লেন", "স্থানীয় প্রতিবেশ সংরক্ষণ"],
    scopeEn: ["Site Analysis & Topography", "Hydrological Drainage Network", "Pedestrian Trails & Green Corridors", "Ecological Preservation"],
  },
  {
    id: "03",
    titleBn: "আরবান ভিশন ও ক্লাইমেট স্ট্র্যাটেজি",
    titleEn: "Urban Biophilia & Microclimate",
    descBn: "নগরীর অতিরিক্ত তাপমাত্রা হ্রাস, বৃষ্টির পানি নিষ্কাশন এবং ছাদ বাগানের মাধ্যমে সবুজ বলয় সৃষ্টি।",
    descEn: "Strategic urban green infrastructure frameworks addressing urban heat mitigation, stormwater management, and rooftop biophilia.",
    scopeBn: ["নগর তাপমাত্রা হ্রাস ও শেডিং", "বৃষ্টির পানি সঞ্চয় ও পুনব্যবহার", "ছায়ানিবিড় পথচারী করিডোর", "কমিউনিটি পকেট পার্ক ডিজাইন"],
    scopeEn: ["Urban Heat Mitigation", "Rainwater Harvesting & Reuse", "Shaded Pedestrian Corridors", "Public Pocket Park Design"],
  },
  {
    id: "04",
    titleBn: "বাস্তুতন্ত্র ও বৃক্ষ চিকিৎসা ক্লিনিক",
    titleEn: "Ecology & Tree Doctor Care",
    descBn: "দেশীয় আবহাওয়ার উপযোগী দীর্ঘজীবী উদ্ভিদ নির্বাচন, বায়ু বিশুদ্ধকারী প্রজাতি এবং সার্টিফাইড বৃক্ষ চিকিৎসা সেবা।",
    descEn: "Scientific curation of endemic Bangladeshi and tropical flora, air-purifying vertical species, soil conditioning, and tree doctor care.",
    scopeBn: ["দেশীয় দীর্ঘজীবী প্রজাতি নির্বাচন", "বৃক্ষ সার্জারি ও রোগ নিরাময় ক্লিনিক", "উন্নত জৈব পুষ্টি ও মাটির মিশ্রণ", "পরাগায়ন সহায়ক বাগান"],
    scopeEn: ["Endemic Hardy Species Selection", "Tree Surgery & Clinic Care", "Substrate Media Engineering", "Pollinator Sanctuaries"],
  },
  {
    id: "05",
    titleBn: "জলপ্রপাত ফোয়ারা ও নান্দনিক পারগোলা",
    titleEn: "Water Features & Pergolas",
    descBn: "শান্ত পানির ফোয়ারা, মার্বেল জলপ্রপাত, নান্দনিক কাঠের পারগোলা ও অ্যাম্বিয়েন্ট লাইটিং সহযোগে সামাজিক মিলনমেলা সৃষ্টি।",
    descEn: "Designing tactile gathering spaces with reflective water plazas, cascading streams, custom pergolas, and evening ambient illumination.",
    scopeBn: ["আধুনিক হাইড্রলিক ফোয়ারা", "নান্দনিক কাঠের ও স্টিল পারগোলা", "লো-ভোল্টেজ অ্যাম্বিয়েন্ট লাইটিং", "আউটডোর সানকেন লাউঞ্জ"],
    scopeEn: ["Hydraulic Water Fountains", "Timber & Steel Pergolas", "Low-Voltage Mood Lighting", "Sunken Social Lounges"],
  },
  {
    id: "06",
    titleBn: "স্মার্ট স্বয়ংক্রিয় ড্রিপ সেচ প্রযুক্তি",
    titleEn: "Smart Irrigation & Automation",
    descBn: "ওয়াইফাই ও টাইমার নিয়ন্ত্রিত ড্রিপ ইরিগেশন, রেইন সেন্সর ও স্বয়ংক্রিয় ফার্টিগেশন প্রযুক্তি যা ৭০% পানি সাশ্রয় করে।",
    descEn: "WiFi-controlled automated micro-drip networks, moisture sensors, and root-zone fertigation systems saving 70% water.",
    scopeBn: ["ডিজিটাল স্মার্ট কন্ট্রোলার", "প্রেশার ড্রিপার নেটওয়ার্ক", "সুষম তরল সার প্রয়োগ ব্যবস্থা", "মোবাইল রিমোট মনিটরিং"],
    scopeEn: ["Digital Smart Controllers", "Pressure Compensating Drippers", "Root-zone Fertigation System", "Mobile App Remote Monitoring"],
  },
];

export default function ShmaServicesFlip() {
  const { language, t } = useLanguage();

  return (
    <section id="service" className="py-20 px-6 sm:px-10 max-w-[1380px] mx-auto text-[#323232] bg-white">
      
      {/* Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              Our Services
            </h2>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            Architectural Disciplines
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* 6 Flip-Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {services.map((item) => (
          <div
            key={item.id}
            className="group relative h-[300px] sm:h-[340px] [perspective:1000px] cursor-pointer"
          >
            {/* Flipping Inner Container */}
            <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              
              {/* FRONT FACE: Clean Beige Rectangular Box */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#dedad2] p-8 flex flex-col justify-between">
                <span className="font-mono text-xs text-[#75787b] font-light">
                  {item.id}
                </span>
                <div className="my-auto text-center space-y-2">
                  <h3 className="font-display font-light text-2xl sm:text-[26px] text-[#3d2e17] leading-snug">
                    {item.titleEn}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#75787b] opacity-0 group-hover:opacity-100 transition-opacity">
                    {t("বিস্তারিত দেখুন →", "Hover to View Details →")}
                  </span>
                </div>
              </div>

              {/* BACK FACE: Dark Brown Architectural Brief */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#3d2e17] text-white p-7 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] text-[#dedad2]/70 font-light block">
                      {t("সেবার পরিধি", "Scope & Deliverables")}
                    </span>
                  </div>
                  <h4 className="font-display font-light text-xl text-[#dedad2] mb-2">
                    {item.titleEn}
                  </h4>
                  <p className="font-sans text-xs text-white/85 font-light leading-relaxed">
                    {language === "bn" ? item.descBn : item.descEn}
                  </p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-white/10">
                  {(language === "bn" ? item.scopeBn : item.scopeEn).slice(0, 3).map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-sans text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5a9dff]"></span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href="#newsletter"
                    className="inline-block text-xs font-mono uppercase tracking-[0.18em] text-[#5a9dff] hover:text-white transition-colors"
                  >
                    {t("পরামর্শ নিন →", "Consult Studio →")}
                  </a>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
