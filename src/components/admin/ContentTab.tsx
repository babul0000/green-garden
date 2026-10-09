"use client";

import React from "react";

interface ContentTabProps {
  services?: any[];
  projects?: any[];
  gallery?: any[];
  blogs?: any[];
  setActiveTab: (tab: string) => void;
}

export default function ContentTab({ services = [], projects = [], gallery = [], blogs = [], setActiveTab }: ContentTabProps) {
  const contentTypes = [
    { id: "services", label: "সার্ভিস ক্যাটালগ", count: services.length, desc: "ল্যান্ডস্কেপ ও গার্ডেনিং সার্ভিসের বিবরণ, প্যাকেজ ও সুবিধা ব্যবস্থাপনা।", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { id: "projects", label: "সম্পন্ন প্রজেক্ট পোর্টফোলিও", count: projects.length, desc: "কেস স্টাডিজ, ক্লায়েন্ট ডিটেইলস, বাজেট ও আর্কিটেকচারাল সমাধান।", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    { id: "gallery", label: "বিফোর-আফটার গ্যালারি", count: gallery.length, desc: "ইন্টারেক্টিভ ভিজ্যুয়াল কম্প্যারিজন স্লাইডার ও ফটো মিডিয়া শোকেস।", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    { id: "blogs", label: "গার্ডেনিং ব্লগ ও আর্টিক্যাল", count: blogs.length, desc: "গাছের যত্ন, সার প্রয়োগ ও নগর কৃষির তথ্যবহুল প্রকাশনা ও কমেন্ট মডারেশন।", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" }
  ];

  return (
    <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl text-[#E4E2D7] flex flex-col gap-6 animate-fade-in-up">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
          📑 CMS Hub
        </div>
        <h3 className="font-sans font-bold text-xl text-[#E4E2D7]">কন্টেন্ট ও মিডিয়া হাব</h3>
        <p className="text-xs text-white/50 mt-1">ওয়েবসাইটের সার্ভিসসমূহ, প্রজেক্ট পোর্টফোলিও, গ্যালারি এবং ব্লগ আর্টিক্যাল সরাসরি পরিচালনা করুন।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-1">
        {contentTypes.map(c => (
          <div key={c.id} className="bg-black/30 border border-white/10 p-6 rounded-2xl shadow-lg flex flex-col justify-between min-h-[160px] hover:border-emerald-400/40 transition-all group">
            <div className="flex justify-between items-start gap-4">
              <div>
                <span className="font-sans font-bold text-base text-[#E4E2D7] group-hover:text-emerald-400 transition-colors block">{c.label}</span>
                <span className="text-xs text-white/50 block mt-2 leading-relaxed max-w-[280px]">{c.desc}</span>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border ${c.color} shrink-0`}>
                {c.count} আইটেম
              </span>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveTab(c.id)}
              className="mt-6 text-xs font-mono font-bold text-stone-950 bg-emerald-500 hover:bg-emerald-400 py-2.5 px-5 rounded-xl transition-all w-fit cursor-pointer flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <span>পরিচালনা করুন</span>
              <span>➔</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
