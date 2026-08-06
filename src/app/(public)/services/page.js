"use client";

import { useState } from "react";

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const services = [
    { label: "Landscape Design", desc: "Detailed 2D sketches, 3D renders, and plant layout visual blueprints.", icon: "✏️", slug: "landscape-design" },
    { label: "Landscape Consultancy", desc: "Professional botanical assessments, structural weight analysis, and drainage audits.", icon: "👨‍🏫", slug: "landscape-consultancy" },
    { label: "Commercial Landscape", desc: "Eco-office fitouts, hotels, open commercial plazas, and green corporate facade designs.", icon: "🏢", slug: "commercial-landscape" },
    { label: "Residential Landscape", desc: "Lawn gardens, courtyard transformations, and customized home botanical layout plans.", icon: "🏡", slug: "residential-landscape" },
    { label: "Rooftop Gardening", desc: "Turnkey concrete-to-paradise solutions. Includes waterproofing, load matching, and auto-drip grids.", icon: "🌇", slug: "rooftop-gardening" },
    { label: "Vertical Garden", desc: "High-density breathing wall systems for indoor aesthetics or hot outside facades.", icon: "🍃", slug: "vertical-garden" },
    { label: "Garden Maintenance", desc: "Scheduled pruning, organic nutrition mapping, pest control, and system health checks.", icon: "✂️", slug: "garden-maintenance" },
    { label: "Hardscaping", desc: "Paving paths, custom clay borders, wooden gazebos, pergolas, and landscape lighting frames.", icon: "🪵", slug: "hardscaping" },
    { label: "Garden Lighting", desc: "Weatherproof LED arrays, uplighters, and automated evening mood lighting.", icon: "💡", slug: "garden-lighting" },
    { label: "Drip Irrigation", desc: "Micro-drippers, Wi-Fi solenoids, moisture detectors, and automated water savers.", icon: "💧", slug: "drip-irrigation" }
  ];

  const faqs = [
    { q: "How much does a typical rooftop garden setup cost in Bangladesh?", a: "Rooftop gardening costs vary based on size and premium finishes. Base setups start from BDT 70-120 per sq. ft. for basic plant installations, while luxury custom landscaping ranges from BDT 200-250 per sq. ft." },
    { q: "Do you conduct waterproofing tests for rooftops?", a: "Absolutely. Waterproofing and load security are our top priorities. Before any setup, we conduct a multi-layer chemical waterproofing coating test to ensure zero leakages into the concrete slab." },
    { q: "How long does a vertical garden green wall take to install?", a: "A standard 100 sq. ft. vertical garden takes approximately 3 to 5 business days to install, including the structural framing, micro-irrigation lines, and final organic planting." },
    { q: "Is structural weight capacity checked before landscaping?", a: "Yes. For corporate or large-scale gardens with deep soil borders (heavy planters/lawns), our structural engineers conduct weight load capacity audits to confirm the roof is safe before mobilization." }
  ];

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-24">
        
        {/* Section 1: Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-6 animate-fade-in-up">
          <span className="text-[13px] font-bold tracking-wider text-primary-green uppercase">Studio Offerings</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3020]">
            Our Landscaping <br />
            <span className="text-primary-green italic font-medium">Services & Solutions</span>
          </h1>
          <div className="w-16 h-1.5 bg-primary-green/20 mx-auto rounded"></div>
          <p className="text-foreground/75 leading-relaxed text-sm md:text-base">
            From luxury structural design to monthly maintenance, we provide expert botanical solutions for homes, commercial complexes, and urban landscapes.
          </p>
        </div>

        {/* Section 2: Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div 
              key={idx} 
              className="glass-card hover:bg-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group border border-foreground/5"
            >
              <div className="flex flex-col gap-6">
                <div className="w-14 h-14 bg-sage-pastel text-[#1a3020] rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#1a3020] group-hover:text-white transition-colors duration-300">
                  {srv.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-[#1a3020]">{srv.label}</h3>
                  <p className="text-foreground/70 text-xs md:text-sm mt-3 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 border-t border-foreground/5 pt-4">
                <a 
                  href={`/contact?service=${srv.slug}`} 
                  className="text-primary-green font-semibold text-xs md:text-sm flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform"
                >
                  Request Consultation <span>→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Section 3: FAQ Accordion */}
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-10">
          <div className="text-center flex flex-col gap-3">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1a3020]">Frequently Asked Questions</h3>
            <p className="text-xs text-foreground/50">Everything you need to know about starting your project</p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-[#f4f7f5] border border-primary-green/10 rounded-2xl p-5 md:p-6 transition-all duration-300"
              >
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-[#1a3020] text-[14px] md:text-[16px] focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg text-primary-green/60 ml-4">{openFaq === idx ? "−" : "+"}</span>
                </button>
                {openFaq === idx && (
                  <p className="mt-3 text-xs md:text-sm text-foreground/75 leading-relaxed border-t border-primary-green/10 pt-3 animate-fade-in-up">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Call to Action */}
        <div className="bg-[#1a3020] text-white rounded-[32px] p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-serif font-bold">Try Our Automated Estimate Calculator</h3>
          <p className="text-xs md:text-sm text-white/70 max-w-lg leading-relaxed">
            Want to budget for a rooftop or green wall project? Calculate your pricing in seconds with our estimators.
          </p>
          <div>
            <button 
              onClick={() => window.dispatchEvent(new Event("open-estimator"))} 
              className="bg-white text-[#1a3020] font-bold text-xs md:text-sm px-8 py-3.5 rounded-full hover:bg-sage-pastel transition-colors cursor-pointer"
            >
              Open Project Calculator
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
