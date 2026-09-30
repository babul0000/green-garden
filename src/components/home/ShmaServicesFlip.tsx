"use client";

import React from "react";

interface ShmaService {
  id: string;
  title: string;
  bnTitle: string;
  desc: string;
  bnDesc: string;
  scope: string[];
}

const services: ShmaService[] = [
  {
    id: "01",
    title: "Landscape Architecture",
    bnTitle: "ল্যান্ডস্কেপ স্থাপত্য ও নকশা",
    desc: "Comprehensive spatial design integrating built architecture with biophilic elements, soil hydrology, and living plant canopies.",
    bnDesc: "ভবনের স্থাপত্যের সাথে বায়োফিলিক উপাদান, মাটির আর্দ্রতা এবং জীবন্ত উদ্ভিদের সমন্বয়ে সার্বিক মাস্টার লেআউট প্রণয়ন।",
    scope: ["Concept Development • কনসেপ্ট নকশা", "3D Photorealistic Modeling • থ্রিডি ভিজ্যুয়ালাইজেশন", "Structural Coordination • স্ট্রাকচারাল সমন্বয়", "Construction Detailing • সাইট বাস্তবায়ন"],
  },
  {
    id: "02",
    title: "Master Planning",
    bnTitle: "মাস্টারপ্ল্যানিং ও বৃহৎ সবুজায়ন",
    desc: "Macro-scale zoning and environmental landscape masterplans for resorts, residential communities, campuses, and industrial eco-parks.",
    bnDesc: "রিসোর্ট, আবাসিক কমিউনিটি, বিশ্ববিদ্যালয় ক্যাম্পাস ও ইকো-পার্কের জন্য পরিবেশবান্ধব বৃহৎ মাস্টারপ্ল্যান।",
    scope: ["Site Analysis & Grading • সাইট জরিপ", "Hydrological Drainage • ড্রেনেজ নেটওয়ার্ক", "Circulation & Trails • হাঁটার পথ বিন্যাস", "Ecological Preservation • প্রতিবেশ সংরক্ষণ"],
  },
  {
    id: "03",
    title: "Urban Vision & Strategies",
    bnTitle: "আরবান ভিশন ও ক্লাইমেট স্ট্র্যাটেজি",
    desc: "Strategic urban green infrastructure frameworks addressing urban heat mitigation, stormwater management, and rooftop biophilia.",
    bnDesc: "নগরীর অতিরিক্ত তাপমাত্রা হ্রাস, বৃষ্টির পানি নিষ্কাশন এবং ছাদ বাগানের মাধ্যমে সবুজ বলয় সৃষ্টি।",
    scope: ["Urban Heat Mitigation • তাপমাত্রা হ্রাস", "Rainwater Harvesting • বৃষ্টির পানি সঞ্চয়", "Pedestrian Shading • ছায়ানিবিড় পথচারী পথ", "Public Pocket Parks • পকেট পার্ক ডিজাইন"],
  },
  {
    id: "04",
    title: "Ecology & Planting Design",
    bnTitle: "বাস্তুতন্ত্র ও উদ্ভিদ নির্বাচন",
    desc: "Scientific curation of endemic Bangladeshi and tropical flora, air-purifying vertical species, soil conditioning, and tree doctor care.",
    bnDesc: "দেশীয় আবহাওয়ার উপযোগী দীর্ঘজীবী উদ্ভিদ নির্বাচন, বায়ু বিশুদ্ধকারী প্রজাতি এবং সার্টিফাইড বৃক্ষ চিকিৎসা সেবা।",
    scope: ["Endemic Species Selection • দেশীয় প্রজাতি", "Tree Surgery & Clinic • বৃক্ষ চিকিৎসা ও সার্জারি", "Substrate Media Engineering • জৈব মাটির মিশ্রণ", "Pollinator Sanctuaries • পরাগায়ন সহায়ক বাগান"],
  },
  {
    id: "05",
    title: "Placemaking & Water Features",
    bnTitle: "প্লেসমেকিং ও জলপ্রপাত ফোয়ারা",
    desc: "Designing tactile gathering spaces with reflective water plazas, cascading streams, custom pergolas, and evening ambient illumination.",
    bnDesc: "শান্ত পানির ফোয়ারা, নান্দনিক কাঠের পারগোলা, রিফ্লেক্টিং পুল ও অ্যাম্বিয়েন্ট লাইটিং সহযোগে সামাজিক মিলনমেলা সৃষ্টি।",
    scope: ["Hydraulic Water Fountains • আধুনিক ফোয়ারা", "Timber & Steel Pergolas • নান্দনিক পারগোলা", "Low-Voltage Mood Lighting • মুড লাইটিং", "Sunken Social Lounges • সানকেন লাউঞ্জ"],
  },
  {
    id: "06",
    title: "Smart Irrigation & Automation",
    bnTitle: "স্মার্ট স্বয়ংক্রিয় সেচ প্রযুক্তি",
    desc: "WiFi-controlled automated micro-drip networks, moisture sensors, and root-zone fertigation systems saving 70% water.",
    bnDesc: "ওয়াইফাই নিয়ন্ত্রিত ড্রিপ ইরিগেশন, রেইন সেন্সর ও স্বয়ংক্রিয় ফার্টিগেশন প্রযুক্তি যা ৭০% পানি সাশ্রয় করে।",
    scope: ["Digital Multi-Zone Controllers • মাল্টি-জোন কন্ট্রোলার", "Pressure Compensating Drip • প্রেশার ড্রিপার", "Root-zone Fertigation • সুষম তরল সার প্রয়োগ", "Mobile Remote Monitoring • মোবাইল অ্যাপ কন্ট্রোল"],
  },
];

export default function ShmaServicesFlip() {
  return (
    <section id="service" className="py-20 px-6 sm:px-10 max-w-[1380px] mx-auto text-[#323232] bg-white">
      
      {/* Exact Shma Header */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              Service
            </h2>
            <span className="font-sans text-sm sm:text-base text-[#75787b] font-normal">
              • স্থাপত্য ও উদ্যান সেবাসমূহ
            </span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            Architectural Disciplines
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* 6 Flip-Box Grid Matching Shma Exact Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {services.map((item) => (
          <div
            key={item.id}
            className="group relative h-[300px] sm:h-[340px] [perspective:1000px] cursor-pointer"
          >
            {/* Flipping Inner Container */}
            <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              
              {/* FRONT FACE: Shma Exact Clean Beige Rectangular Box with Bilingual Title */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-[#dedad2] p-8 flex flex-col justify-between">
                <span className="font-mono text-xs text-[#75787b] font-light">
                  {item.id}
                </span>
                <div className="my-auto text-center space-y-2">
                  <h3 className="font-display font-light text-2xl sm:text-[26px] text-[#3d2e17] leading-snug">
                    {item.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#3d2e17]/75 font-normal">
                    {item.bnTitle}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#75787b] opacity-0 group-hover:opacity-100 transition-opacity">
                    Hover to Flip • বিস্তারিত →
                  </span>
                </div>
              </div>

              {/* BACK FACE: Shma Exact Dark Brown Architectural Brief */}
              <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#3d2e17] text-white p-7 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[11px] text-[#dedad2]/70 font-light block">
                      Scope & Deliverables
                    </span>
                    <span className="text-[11px] font-sans text-[#5a9dff]">
                      {item.bnTitle}
                    </span>
                  </div>
                  <h4 className="font-display font-light text-xl text-[#dedad2] mb-2">
                    {item.title}
                  </h4>
                  <p className="font-sans text-xs text-white/80 font-light leading-relaxed mb-1">
                    {item.desc}
                  </p>
                  <p className="font-sans text-[11px] text-[#dedad2]/90 font-light leading-normal">
                    {item.bnDesc}
                  </p>
                </div>

                <div className="space-y-1 pt-3 border-t border-white/10">
                  {item.scope.slice(0, 3).map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] font-sans text-white/70">
                      <span className="w-1 h-1 rounded-full bg-[#5a9dff]"></span>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href="#newsletter"
                    className="inline-block text-[11px] font-mono uppercase tracking-[0.18em] text-[#5a9dff] hover:text-white transition-colors"
                  >
                    Consult Studio • পরামর্শ নিন →
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
