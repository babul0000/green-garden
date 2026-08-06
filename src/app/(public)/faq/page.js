"use client";

import { useState } from "react";

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      cat: "Pricing & Budgeting",
      items: [
        { q: "How much does a typical rooftop garden setup cost in Bangladesh?", a: "Rooftop gardening costs vary based on size and premium finishes. Base setups start from BDT 70-120 per sq. ft. for basic plant installations, while luxury custom landscaping ranges from BDT 200-250 per sq. ft." },
        { q: "Are consultation visits free?", a: "We charge a minimal site survey audit fee of BDT 5,000 inside Dhaka which is completely adjusted/deducted from your final project mobilization billing once you confirm the work." }
      ]
    },
    {
      cat: "Waterproofing & Safety",
      items: [
        { q: "Do you conduct waterproofing tests for rooftops?", a: "Absolutely. Waterproofing and load security are our top priorities. Before any setup, we conduct a multi-layer chemical waterproofing coating test to ensure zero leakages into the concrete slab." },
        { q: "Is structural weight capacity checked before landscaping?", a: "Yes. For corporate or large-scale gardens with deep soil borders (heavy planters/lawns), our structural engineers conduct weight load capacity audits to confirm the roof is safe before mobilization." }
      ]
    },
    {
      cat: "Plants & Irrigation",
      items: [
        { q: "How long does a vertical garden green wall take to install?", a: "A standard 100 sq. ft. vertical garden takes approximately 3 to 5 business days to install, including the structural framing, micro-irrigation lines, and final organic planting." },
        { q: "Can drip irrigation save water?", a: "Yes. Automated drip systems deliver water directly to the plant root zones in droplets, reducing evaporation losses and saving up to 60% of water compared to manual hose watering." }
      ]
    }
  ];

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-3xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto flex flex-col gap-3">
          <span className="text-xs text-primary-green font-bold uppercase tracking-wider">Help & Support</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1a3020]">Frequently Asked Questions</h1>
          <p className="text-xs text-foreground/60 leading-relaxed mt-1">Get instant answers regarding waterproofing, weights, costs, and drip systems.</p>
        </div>

        {/* FAQ Categories list */}
        <div className="flex flex-col gap-8">
          {faqs.map((group, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h3 className="font-serif font-bold text-base text-primary-green border-b border-foreground/5 pb-2">{group.cat}</h3>
              <div className="flex flex-col gap-4">
                {group.items.map((item, itemIdx) => {
                  const globalIdx = `${idx}-${itemIdx}`;
                  const isOpen = openFaq === globalIdx;
                  return (
                    <div 
                      key={itemIdx}
                      className="bg-[#f8faf9] border border-foreground/5 rounded-2xl p-5 md:p-6 transition-all duration-300"
                    >
                      <button 
                        onClick={() => setOpenFaq(isOpen ? null : globalIdx)}
                        className="w-full flex items-center justify-between text-left font-bold text-[#1a3020] text-xs md:text-sm focus:outline-none"
                      >
                        <span>{item.q}</span>
                        <span className="text-lg text-primary-green/60 ml-4">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen && (
                        <p className="mt-3 text-xs text-foreground/75 leading-relaxed border-t border-primary-green/10 pt-3 animate-fade-in-up">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
