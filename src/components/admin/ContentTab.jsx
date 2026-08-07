"use client";

import React from "react";

export default function ContentTab({ services = [], projects = [], gallery = [], blogs = [], setActiveTab }) {
  const contentTypes = [
    { id: "services", label: "Services catalog", count: services.length, desc: "CRUD operations on platform offerings, icons & details.", color: "text-[#8fc63f] bg-emerald-50" },
    { id: "projects", label: "Completed Projects", count: projects.length, desc: "Case studies manager showing location, budgets, solutions.", color: "text-blue-600 bg-blue-50" },
    { id: "gallery", label: "Gallery media showcase", count: gallery.length, desc: "Before-after visual comparison sliders upload tools.", color: "text-purple-600 bg-purple-50" },
    { id: "blogs", label: "Gardening Blogs", count: blogs.length, desc: "Tips, tips & rich text published articles manager.", color: "text-amber-600 bg-amber-50" }
  ];

  return (
    <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col gap-6 animate-fade-in-up">
      <div>
        <h3 className="font-sans font-bold text-lg text-[#06120c]">Content Management</h3>
        <p className="text-xs text-slate-400 mt-0.5">Dynamically add, edit, or delete visual elements, blogs, and landing pages offerings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {contentTypes.map(c => (
          <div key={c.id} className="border border-slate-100 p-6 rounded-[20px] shadow-sm flex flex-col justify-between min-h-[140px] hover:border-[#8fc63f]/30 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-sans font-bold text-sm text-[#06120c] block">{c.label}</span>
                <span className="text-[11px] text-slate-400 block mt-1 leading-normal max-w-[220px]">{c.desc}</span>
              </div>
              <span className={`text-xl font-bold px-3 py-1 rounded-xl ${c.color}`}>{c.count} Items</span>
            </div>
            <button 
              type="button" 
              onClick={() => setActiveTab(c.id)}
              className="mt-6 text-[11px] font-bold text-[#8fc63f] bg-[#0e2217] py-2 px-4 rounded-xl hover:bg-[#153021] transition-all w-fit cursor-pointer flex items-center gap-1.5"
            >
              <span>Manage Content</span>
              <span>➔</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
