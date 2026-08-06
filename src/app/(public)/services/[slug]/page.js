"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const fetch = (originalFetch => (url, options) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

const SERVICES_STATIC = {
  "rooftop-gardening": {
    label: "Rooftop Gardening Setup",
    icon: "🌇",
    desc: "Turnkey concrete-to-paradise solutions. Includes waterproofing, load matching, and auto-drip grids.",
    benefits: [
      "Reduces concrete surface heat by up to 15°C",
      "Supplies fresh organic home-grown fruits and herbs",
      "Increases property value and building lifespan",
      "Reduces dust particles and improves ambient air quality"
    ],
    process: [
      { title: "Waterproofing & Leak Test", text: "Multi-layer chemical coatings followed by a 48-hour flood test to secure concrete." },
      { title: "Lightweight Substrate Fill", text: "Mixing organic cocopeat, vermicompost, and expanded clay instead of heavy clay soil." },
      { title: "Irrigation & Drainage Setup", text: "Installing sub-surface drainage cells and Wi-Fi automated drip lines." },
      { title: "Planting & Design Layout", text: "Strategic planting of subtropical shrubs, flowers, and fruit trees." }
    ],
    faqs: [
      { q: "Is my roof strong enough for a lawn?", a: "Our structural engineer calculates the weight threshold. For older roofs, we use lightweight raised container gardens." }
    ]
  },
  "vertical-garden": {
    label: "Vertical Wall Greenery",
    icon: "🍃",
    desc: "High-density breathing wall systems for indoor aesthetics or hot outside facades.",
    benefits: [
      "Saves floor footprint while maximizing leaf area",
      "Acts as a natural sound insulation barrier",
      "Improves indoor humidity and cognitive focus",
      "Stunning corporate aesthetic branding"
    ],
    process: [
      { title: "Aluminum Framing Mount", text: "Affixing a rust-proof aluminum frame with a PVC layer to keep moisture away from concrete walls." },
      { title: "Felt Grow Pockets", text: "Stapling premium geotextile double felt pockets to hold root systems." },
      { title: "Automatic Fertigation", text: "Placing drip emitters connected to a fertilizer dosing pump." },
      { title: "Plant Selection", text: "Placing ferns, money plants, and indoor foliage matching sun intensity." }
    ],
    faqs: [
      { q: "How are vertical walls watered?", a: "They are connected to an automated drip line that triggers watering for 2-3 minutes daily." }
    ]
  }
};

export default function ServiceDetailsPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/services");
        if (res.ok) {
          const data = await res.json();
          const matched = data.find(s => s.slug === slug);
          if (matched) {
            setService(matched);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Backend unavailable, falling back to static services detail:", err);
      }

      // Static fallback
      const staticMatched = SERVICES_STATIC[slug] || {
        label: slug.replace(/-/g, " ").toUpperCase(),
        icon: "🌱",
        desc: "Premium customized landscaping and garden installation service designed for modern homes and commercial spaces.",
        benefits: ["Expert horticulturist selection", "Water-saving drip lines", "Guaranteed waterproofing integration"],
        process: [
          { title: "1. Consult & Plan", text: "We survey your layout and sun levels." },
          { title: "2. Mobilize & Plant", text: "Our staff installs substrates and plants." }
        ],
        faqs: []
      };
      setService(staticMatched);
      setLoading(false);
    };

    fetchService();
  }, [slug]);

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-8 h-8 border-3 border-primary-green/20 border-t-primary-green rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-sans min-h-screen py-16 px-6 relative">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
        {/* Banner Section */}
        <div className="bg-[#1a3020] text-white p-8 md:p-12 rounded-[32px] flex flex-col md:flex-row justify-between items-center gap-8 shadow-xl animate-fade-in-up">
          <div className="flex flex-col gap-4 text-center md:text-left">
            <span className="text-4xl md:text-5xl">{service.icon}</span>
            <h1 className="text-3xl md:text-4xl font-serif font-bold">{service.label}</h1>
            <p className="text-xs md:text-sm text-white/70 max-w-xl leading-relaxed">{service.desc}</p>
          </div>
          <a 
            href="#quote-form-section"
            className="bg-white text-[#1a3020] font-bold text-xs md:text-sm px-6 py-3 rounded-full hover:bg-sage-pastel transition-colors whitespace-nowrap"
          >
            Get Free Quote
          </a>
        </div>

        {/* Benefits & Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column: Benefits */}
          <div className="bg-white/80 border border-foreground/5 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col gap-5">
            <h3 className="font-serif font-bold text-lg text-[#1a3020] border-b border-foreground/5 pb-2">Key Advantages</h3>
            <ul className="flex flex-col gap-3">
              {(service.benefits || []).map((benefit, idx) => (
                <li key={idx} className="flex gap-2 text-xs md:text-sm text-foreground/75 items-start">
                  <span className="text-primary-green">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Steps */}
          <div className="flex flex-col gap-6">
            <h3 className="font-serif font-bold text-lg text-[#1a3020]">Implementation Workflow</h3>
            <div className="flex flex-col gap-4">
              {(service.process || []).map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-sage-light/20 p-4 rounded-2xl border border-primary-green/5">
                  <span className="font-mono text-primary-green font-bold text-sm bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-xs md:text-sm text-[#1a3020]">{step.title}</h4>
                    <p className="text-[11px] md:text-xs text-foreground/60 mt-1 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quote Form pre-filled */}
        <div id="quote-form-section" className="bg-[#f8faf9] border border-foreground/5 p-8 rounded-[32px] max-w-xl mx-auto w-full text-center flex flex-col gap-6 shadow-sm">
          <div>
            <h3 className="font-serif font-bold text-lg text-[#1a3020]">Consultation Callback Form</h3>
            <p className="text-xs text-foreground/50 mt-1">Submit your phone and query relating to <b>{service.label}</b>. Our agronomist will schedule a call.</p>
          </div>

          {submitted ? (
            <div className="bg-primary-green/10 text-primary-green text-xs font-bold p-4 rounded-xl">
              ✓ Request received successfully. We will call you shortly!
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} className="flex flex-col gap-4 text-left">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">Phone Number</label>
                <input 
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-foreground/60 uppercase">Details (Optional)</label>
                <textarea 
                  rows={3}
                  placeholder="Describe your space size, waterproofing state..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white border border-foreground/10 py-2.5 px-3 rounded-xl text-xs focus:outline-none focus:border-primary-green resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-primary-green hover:bg-primary-green-dark text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer text-center"
              >
                Submit Consultation Request
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
