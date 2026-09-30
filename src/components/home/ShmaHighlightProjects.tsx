"use client";

import React, { useState } from "react";

export default function ShmaHighlightProjects() {
  const [activeModalProject, setActiveModalProject] = useState<string | null>(null);

  return (
    <section id="projects" className="py-20 px-6 sm:px-10 max-w-[1380px] mx-auto text-[#323232] bg-white">
      
      {/* Exact Shma Section Header with Bilingual Polish */}
      <div className="mb-14">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-4">
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-light text-3xl sm:text-4xl md:text-[40px] text-[#3d2e17]">
              Highlight Project
            </h2>
            <span className="font-sans text-sm sm:text-base text-[#75787b] font-normal">
              • নির্বাচিত স্থাপত্য প্রকল্পসমূহ
            </span>
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#75787b]">
            Architectural Portfolio
          </span>
        </div>
        <div className="w-full h-[1px] bg-[#e7e7e7]"></div>
      </div>

      {/* Exact Editorial 2-Column Staggered Grid of Shma Designs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-16 gap-y-16">
        
        {/* ===================== COLUMN 1 (LEFT) ===================== */}
        <div className="space-y-16">
          
          {/* 1. Mapletree Business City II Media */}
          <div
            onClick={() => setActiveModalProject("MAPLETREE BUSINESS CITY II")}
            className="relative aspect-[16/10] overflow-hidden bg-stone-100 group cursor-pointer"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://shmadesigns.com/wp-content/uploads/2025/04/Shma_Mapletree-Business-City-II.mp4#t=1"
            ></video>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                Read more • বিস্তারিত
              </span>
            </div>
          </div>

          {/* 2. The Standard Hua Hin Media */}
          <div
            onClick={() => setActiveModalProject("THE STANDARD HUA HIN")}
            className="relative aspect-[16/10] overflow-hidden bg-stone-100 group cursor-pointer"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://shmadesigns.com/wp-content/uploads/2025/06/Pop-up-The-standard-huahin.mp4#t=1"
            ></video>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                Read more • বিস্তারিত
              </span>
            </div>
          </div>

          {/* 3. The Standard Hua Hin Details */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display font-light text-2xl sm:text-[28px] uppercase tracking-wide text-[#3d2e17]">
                THE STANDARD HUA HIN
              </h3>
              <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-[13px] text-[#3d2e17] font-sans">
                Hospitality • হসপিটালিটি ও রিসোর্ট
              </span>
            </div>
            <p className="font-sans text-sm text-[#75787b] font-light">
              Prachuap Khiri Khan, Thailand • থাইল্যান্ড
            </p>
            <p className="font-sans text-sm sm:text-[14.5px] font-light text-[#54595f] leading-relaxed pt-1">
              The Standard Hua Hin is envisioned as a tranquil retreat embraced by nature. বিদ্যমান প্রাকৃতিক বনভূমি ও উদ্ভিদের বিন্যাস অক্ষুণ্ণ রেখে তৈরি করা হয়েছে আলো ও ছায়ার অনুপম সমন্বয়। প্রতিটি স্থান অতিথিদের প্রকৃতির সাথে একাত্ম হওয়ার শান্ত স্নিগ্ধ পরিবেশ প্রদান করে।
            </p>
          </div>

          {/* 4. AIA East Gateway Details */}
          <div className="space-y-3 pt-4">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display font-light text-2xl sm:text-[28px] uppercase tracking-wide text-[#3d2e17]">
                AIA EAST GATEWAY
              </h3>
              <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-[13px] text-[#3d2e17] font-sans">
                Institution & Workplace • আধুনিক কর্মক্ষেত্র
              </span>
            </div>
            <p className="font-sans text-sm text-[#75787b] font-light">
              Bangkok, Thailand • ব্যাংকক
            </p>
            <p className="font-sans text-sm sm:text-[14.5px] font-light text-[#54595f] leading-relaxed pt-1">
              AIA East Gateway is a new model of office building that integrates living nature directly into the workspace. ৪০০ মিটার আউটডোর লাল রানিং ট্র্যাক ও বায়োফিলিক সবুজায়ন কর্মীদের জন্য একটি স্বস্তিদায়ক পরিবেশ ও সুস্থ জীবনধারা নিশ্চিত করে।
            </p>
          </div>

          {/* 5. Sky Forest Scape Media */}
          <div
            onClick={() => setActiveModalProject("SKY FOREST SCAPE")}
            className="relative aspect-[16/10] overflow-hidden bg-stone-100 group cursor-pointer"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://shmadesigns.com/wp-content/uploads/2025/04/Shma_Sky-Forest.mp4#t=1"
            ></video>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                Read more • বিস্তারিত
              </span>
            </div>
          </div>

          {/* 6. Sky Forest Scape Details */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display font-light text-2xl sm:text-[28px] uppercase tracking-wide text-[#3d2e17]">
                SKY FOREST SCAPE
              </h3>
              <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-[13px] text-[#3d2e17] font-sans">
                Park & Public Space • রুফটপ পাবলিক পার্ক
              </span>
            </div>
            <p className="font-sans text-sm text-[#75787b] font-light">
              Siam Square, Bangkok, Thailand
            </p>
            <p className="font-sans text-sm sm:text-[14.5px] font-light text-[#54595f] leading-relaxed pt-1">
              “SKY FOREST SCAPE” is a new type of elevated public space on the roof for Bangkok. সিয়াম স্কয়ারের প্রাণকেন্দ্রে অবস্থিত এই রুফটপ ফরেস্টে তরুণ সমাজের জন্য মেলামেশার উন্মুক্ত পরিমণ্ডল ও আকাশছোঁয়া সবুজের মেলবন্ধন ঘটানো হয়েছে।
            </p>
          </div>

          {/* 7. The Residences at Mandarin Oriental (Small Pool Shot) */}
          <div
            onClick={() => setActiveModalProject("THE RESIDENCES AT MANDARIN ORIENTAL")}
            className="relative aspect-[16/11] overflow-hidden bg-stone-100 group cursor-pointer max-w-[420px]"
          >
            <img
              src="https://shmadesigns.com/wp-content/uploads/2026/09/3.-The-Residences-at-Mandarin-Oriental-Miami-at-One-Island-Drive_POOL-1.webp"
              alt="Mandarin Oriental Pool"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                Read more • বিস্তারিত
              </span>
            </div>
          </div>

        </div>

        {/* ===================== COLUMN 2 (RIGHT) ===================== */}
        <div className="space-y-16">
          
          {/* 1. Mapletree Business City II Details */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display font-light text-2xl sm:text-[28px] uppercase tracking-wide text-[#3d2e17]">
                MAPLETREE BUSINESS CITY II
              </h3>
              <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-[13px] text-[#3d2e17] font-sans">
                Workplace Ecosystem • কর্পোরেট পার্ক
              </span>
            </div>
            <p className="font-sans text-sm text-[#75787b] font-light">
              Singapore • সিঙ্গাপুর
            </p>
            <p className="font-sans text-sm sm:text-[14.5px] font-light text-[#54595f] leading-relaxed pt-1">
              Mapletree Business City II creates an ‘Urban Wilderness’ by integrating modern workspaces with nature-inspired landscapes. ক্রান্তীয় জলবায়ু এবং সংলগ্ন প্রাকৃতিক রিজার্ভ ফরেস্ট থেকে অনুপ্রাণিত হয়ে কাজের পরিবেশের সাথে বাস্তুতান্ত্রিক ভারসাম্যের এক অনন্য মেলবন্ধন রচনা করা হয়েছে।
            </p>
          </div>

          {/* 2. One City Centre Media (Tall Portrait Video) */}
          <div
            onClick={() => setActiveModalProject("ONE CITY CENTRE")}
            className="relative aspect-[3/4] overflow-hidden bg-stone-100 group cursor-pointer max-w-[480px]"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://shmadesigns.com/wp-content/uploads/2025/06/Pop-up-OCC.mp4#t=1"
            ></video>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                Read more • বিস্তারিত
              </span>
            </div>
          </div>

          {/* 3. One City Centre Details */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display font-light text-2xl sm:text-[28px] uppercase tracking-wide text-[#3d2e17]">
                ONE CITY CENTRE
              </h3>
              <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-[13px] text-[#3d2e17] font-sans">
                Institution and Workplace • নগর ওয়েসিস
              </span>
            </div>
            <p className="font-sans text-sm text-[#75787b] font-light">
              Bangkok, Thailand • ব্যাংকক
            </p>
            <p className="font-sans text-sm sm:text-[14.5px] font-light text-[#54595f] leading-relaxed pt-1">
              One City Centre transforms dense urban spaces into a living ecosystem. প্রাক্তন কার পার্কিংকে রূপান্তর করা হয়েছে সানকেন প্লাজা ও গ্রিন ফ্লোরে, যা নগরবাসীর জন্য প্রশান্তিদায়ক আড্ডা ও প্রাকৃতিক সংযোগের অফুরন্ত সুযোগ উন্মোচন করে।
            </p>
          </div>

          {/* 4. Suan San Pocket Park Media */}
          <div
            onClick={() => setActiveModalProject("SUAN SAN POCKET PARK")}
            className="relative aspect-[16/10] overflow-hidden bg-stone-100 group cursor-pointer"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://shmadesigns.com/wp-content/uploads/2025/06/สวนสาน-.mp4#t=1"
            ></video>
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                Read more • বিস্তারিত
              </span>
            </div>
          </div>

          {/* 5. Suan San Pocket Park Details */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display font-light text-2xl sm:text-[28px] uppercase tracking-wide text-[#3d2e17]">
                SUAN SAN POCKET PARK
              </h3>
              <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-[13px] text-[#3d2e17] font-sans">
                Public Park • কমিউনিটি উদ্যান
              </span>
            </div>
            <p className="font-sans text-sm text-[#75787b] font-light">
              Bangkok, Thailand • ব্যাংকক
            </p>
            <p className="font-sans text-sm sm:text-[14.5px] font-light text-[#54595f] leading-relaxed pt-1">
              Suan San transforms private land into a public green sanctuary accessible to all. স্থানীয় বাসিন্দাদের সক্রিয় অংশগ্রহণে বহু পুরোনো গাছপালা সংরক্ষণ করে আধুনিক ওয়াকওয়ের সাথে এক অপরূপ মেলবন্ধন তৈরি করা হয়েছে।
            </p>
          </div>

          {/* 6. The Residences at Mandarin Oriental Media (Panoramic Skyline Photo) */}
          <div
            onClick={() => setActiveModalProject("THE RESIDENCES AT MANDARIN ORIENTAL")}
            className="relative aspect-[16/10] overflow-hidden bg-stone-100 group cursor-pointer"
          >
            <img
              src="https://shmadesigns.com/wp-content/uploads/al_opt_content/IMAGE/shmadesigns.com/wp-content/uploads/2026/09/The-Residences-at-Mandarin-Oriental-Miami-at-One-Island-Drive-Aerial-Rendering_Hero.jpg.bv.webp"
              alt="Mandarin Oriental Miami Aerial"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="text-white text-lg font-light tracking-wider border-b border-white/60 pb-0.5">
                Read more • বিস্তারিত
              </span>
            </div>
          </div>

          {/* 7. The Residences at Mandarin Oriental Details */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="font-display font-light text-2xl sm:text-[28px] uppercase tracking-wide text-[#3d2e17]">
                THE RESIDENCES AT MANDARIN ORIENTAL
              </h3>
              <span className="inline-block px-3 py-1 rounded-full bg-[#dedad2] text-[13px] text-[#3d2e17] font-sans">
                Luxury Living • দ্বীপাঞ্চলীয় অভয়ারণ্য
              </span>
            </div>
            <p className="font-sans text-sm text-[#75787b] font-light">
              Miami, USA • মায়ামি
            </p>
            <p className="font-sans text-sm sm:text-[14.5px] font-light text-[#54595f] leading-relaxed pt-1">
              The Residences blend refined living with panoramic views of the ocean, skyline, and tropical greenscape. প্রতিটি বাসস্থানের অন্দরমহল থেকে বাইরের সুপরিসর গ্রিন টেরেসে সহজে যাতায়াত তৈরি করে এক দ্বীপসদৃশ বিলাসবহুল অভয়ারণ্য।
            </p>
          </div>

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
            <span className="text-xs uppercase tracking-[0.2em] text-[#75787b] block">
              Architectural Masterpiece • স্থাপত্যের অনন্য নিদর্শন
            </span>
            <h3 className="text-3xl font-light font-display text-[#3d2e17]">
              {activeModalProject}
            </h3>
            <p className="text-sm font-light text-[#54595f] leading-relaxed">
              Explore our architectural drawings, native species planting plans, and hydraulic water conservation systems. আমাদের বিশেষজ্ঞ দল প্রতিটি প্রকল্পের হাইড্রোলজি, ড্রেনেজ ও জীববৈচিত্র্য সুরক্ষায় আন্তর্জাতিক মানদণ্ড বজায় রাখে।
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href="#newsletter"
                onClick={() => setActiveModalProject(null)}
                className="px-6 py-2.5 bg-[#3d2e17] text-white text-xs uppercase tracking-widest hover:bg-[#5a9dff] transition-colors"
              >
                Inquire Project Details • বিস্তারিত তথ্য জানুন
              </a>
              <button
                onClick={() => setActiveModalProject(null)}
                className="px-6 py-2.5 border border-[#3d2e17] text-[#3d2e17] text-xs uppercase tracking-widest hover:bg-[#dedad2] transition-colors cursor-pointer"
              >
                Close • বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
