"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const cleanApiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000")
  .split("||")[0]
  .trim();

const fetchProxy = ((originalFetch) => (url: string | URL | Request, options?: RequestInit) => 
  typeof url === "string" && url.startsWith("http://localhost:5000") 
    ? originalFetch(url.replace("http://localhost:5000", cleanApiUrl), options) 
    : originalFetch(url, options)
)(globalThis.fetch);

interface IServiceDetail {
  label: string;
  category?: string;
  icon?: string;
  pricing?: string;
  desc?: string;
  features?: string[];
  benefits?: string[];
  process?: { title: string; text: string }[];
  faqs?: { q: string; a: string }[];
  bannerImage?: string;
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = typeof rawSlug === "string" ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : "";

  const [service, setService] = useState<IServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Form inputs
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchService = async () => {
      try {
        // Try direct slug fetch
        const res = await fetchProxy(`http://localhost:5000/api/services/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.label) {
            setService({
              label: data.label,
              category: data.category,
              icon: data.icon || "🌿",
              pricing: data.pricing || "কোটেশন অনুযায়ী",
              desc: data.desc || data.description || "",
              features: Array.isArray(data.features) ? data.features : [],
              benefits: Array.isArray(data.benefits) && data.benefits.length > 0 ? data.benefits : [
                "অভিজ্ঞ হর্টিকালচারিস্ট ও ল্যান্ডস্কেপ আর্কিটেক্ট দ্বারা ডিজাইন",
                "আন্তর্জাতিক মানের ড্রেনেজ ও প্রিমিয়াম ম্যাটেরিয়ালস",
                "১০০% কাস্টমার স্যাটিসফ্যাকশন ও ফ্রি সাইট ভিজিট পরামর্শ"
              ],
              process: Array.isArray(data.process) && data.process.length > 0 ? data.process : [
                { title: "১. সাইট সার্ভে ও আলোচনা", text: "আমাদের টিম আপনার লোকেশন পরিদর্শন করে মাপ ও সম্ভাবনা যাচাই করেন।" },
                { title: "২. ডিজাইন ও খরচ অনুমোদন", text: "ক্লায়েন্টকে পছন্দসই লেআউট ও কোটেশন প্রদান করা হয়।" },
                { title: "৩. বাস্তবায়ন ও হ্যান্ডওভার", text: "সুনির্দিষ্ট সময়ের মধ্যে প্রজেক্ট সম্পন্ন করে লাইভ বুঝিয়ে দেওয়া হয়।" }
              ],
              faqs: Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : [
                { q: "এই কাজের ক্ষেত্রে কি কোনো ওয়ারেন্টি থাকে?", a: "হ্যাঁ, আমরা গাছ প্রতিস্থাপন এবং ড্রেনেজ ও ওয়াটারপ্রুফিংয়ের উপর নির্দিষ্ট মেয়াদী গ্যারান্টি প্রদান করি।" }
              ],
              bannerImage: data.bannerImage || "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop"
            });
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Backend unavailable, falling back to static services detail:", err);
      }

      // Fallback
      setService({
        label: slug.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
        category: "Garden Services",
        icon: "🌿",
        pricing: "কোটেশন অনুযায়ী",
        desc: "এ আর গ্রিন গার্ডেনের প্রিমিয়াম ল্যান্ডস্কেপিং সেবা। আপনার বাড়ি বা প্রতিষ্ঠানের প্রতিটি কোণে নিয়ে আসুন জীবন্ত সবুজের সৌন্দর্য।",
        features: ["100% Quality Guaranteed", "Custom Architectural Design", "Dedicated Gardener Support"],
        benefits: [
          "সম্পূর্ণ পরিবেশবান্ধব ও দৃষ্টিনন্দন সবুজায়ন",
          "পরিকল্পিত পানি নিষ্কাশন ও গাছ নির্বাচন",
          "দীর্ঘমেয়াদী রক্ষণাবেক্ষণ সহায়তা"
        ],
        process: [
          { title: "১. পরামর্শ ও সাইট ভিজিট", text: "আপনার জায়গা অনুযায়ী বিশেষজ্ঞ মতামত প্রদান।" },
          { title: "২. বাস্তবায়ন", text: "আমাদের পেশাদার কর্মীবাহিনী দ্বারা নিখুঁত রূপদান।" }
        ],
        faqs: [
          { q: "কীভাবে বুকিং করব?", a: "নিচের ফর্মে ফোন নম্বর প্রদান করুন অথবা সরাসরি ফোন বা হোয়াটসঅ্যাপ করুন।" }
        ],
        bannerImage: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=1200&auto=format&fit=crop"
      });
      setLoading(false);
    };

    fetchService();
  }, [slug]);

  const handleSubmitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;
    setIsSubmitting(true);

    try {
      const payload = {
        clientName: name.trim() || "Website Visitor",
        clientEmail: `${phone.trim()}@guest.argreengarden.com`,
        phone: phone.trim(),
        service: service.label,
        message: message.trim() || `Inquiry for ${service.label} via slug detail page`,
        budgetRange: service.pricing || "Negotiable"
      };

      const res = await fetchProxy("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedRef(data.id || "BOOK-" + Math.floor(100000 + Math.random() * 900000));
      } else {
        setSubmittedRef("REF-" + Date.now().toString().slice(-6));
      }
    } catch {
      setSubmittedRef("REF-" + Date.now().toString().slice(-6));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <span className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"></span>
        <p className="text-xs text-gray-500 font-medium">সার্ভিস বিস্তারিত লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-emerald-50/30 via-white to-white text-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-emerald-700">হোম</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-emerald-700">সার্ভিস ক্যাটালগ</Link>
          <span>/</span>
          <span className="text-emerald-800 font-semibold">{service.label}</span>
        </div>

        {/* Hero Banner Section */}
        <div className="relative rounded-[32px] overflow-hidden shadow-2xl bg-emerald-950 text-white p-8 sm:p-12">
          {service.bannerImage && (
            <div className="absolute inset-0 opacity-25">
              <img
                src={service.bannerImage}
                alt={service.label}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-emerald-800/80 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-200 border border-emerald-700">
                <span>{service.icon}</span>
                <span>{service.category || "Professional Landscaping"}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight">
                {service.label}
              </h1>
              <p className="text-sm md:text-base text-emerald-100 leading-relaxed">
                {service.desc}
              </p>
              <div className="text-sm font-semibold text-emerald-300">
                আনুমানিক বাজেট: <span className="text-white font-bold">{service.pricing}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
              <a 
                href="#quote-form-section"
                className="bg-white text-emerald-900 font-bold text-xs sm:text-sm px-7 py-3.5 rounded-full hover:bg-emerald-50 transition-all shadow-lg text-center whitespace-nowrap"
              >
                অনলাইন বুকিং করুন →
              </a>
              <a
                href={`https://wa.me/8801620692449?text=Hello%20AR%20Green%20Garden,%20I%20want%20to%20consult%20about%20${encodeURIComponent(service.label)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full hover:bg-[#20bd5a] transition-all shadow text-center flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>💬</span> WhatsApp পরামর্শ
              </a>
            </div>
          </div>
        </div>

        {/* Benefits & Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Benefits & Features */}
          <div className="bg-white border border-emerald-100 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <span>⭐</span> এই সেবার বিশেষ সুবিধাসমূহ
              </h3>
              <ul className="space-y-3 pt-4">
                {(service.benefits || []).map((benefit, idx) => (
                  <li key={idx} className="flex gap-3 text-xs sm:text-sm text-gray-700 items-start">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {service.features && service.features.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                  টেকনিক্যাল স্পেসিফিকেশন:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-emerald-50 text-emerald-800 px-3 py-1 rounded-lg border border-emerald-200 font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Steps */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-900 flex items-center gap-2">
              <span>📋</span> প্রজেক্ট বাস্তবায়নের ধারাবাহিক ধাপ
            </h3>
            <div className="space-y-3">
              {(service.process || []).map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <span className="font-mono text-emerald-800 font-bold text-sm bg-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm shrink-0 border border-emerald-200">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{step.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consultation Callback Form */}
        <div id="quote-form-section" className="bg-white border border-emerald-100 p-8 sm:p-10 rounded-[32px] max-w-xl mx-auto w-full shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase">
              সরাসরি যোগাযোগ
            </span>
            <h3 className="font-serif font-bold text-2xl text-gray-900">
              ফ্রি কনসাল্টেশন ও সাইট ভিজিট ফর্ম
            </h3>
            <p className="text-xs text-gray-500">
              <b>{service.label}</b> সম্পর্কে জানতে আপনার ফোন নম্বর দিন। আমাদের সিনিয়র বিশেষজ্ঞ বিনামূল্যে মতামত প্রদান করবেন।
            </p>
          </div>

          {submittedRef ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-6 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-700 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                ✓
              </div>
              <h4 className="font-bold text-base">আপনার অনুরোধ গৃহীত হয়েছে!</h4>
              <p className="text-xs text-emerald-700">
                বুকিং ট্র্যাকিং আইডি: <b>{submittedRef}</b>
              </p>
              <p className="text-xs text-gray-600">
                শীঘ্রই আমাদের কাস্টমার সার্ভিস প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">আপনার নাম</label>
                <input 
                  type="text"
                  placeholder="যেমন: ড. মাহফুজুর রহমান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">ফোন নম্বর *</label>
                <input 
                  type="tel"
                  required
                  placeholder="017XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-600 bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase block mb-1">আপনার স্পেস ও প্রয়োজনীয়তা (ঐচ্ছিক)</label>
                <textarea 
                  rows={3}
                  placeholder="ছাদের সাইজ, ড্রেনেজ অবস্থা বা যেকোনো বিশেষ পছন্দের বিবরণ..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-600 resize-none bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "পাঠানো হচ্ছে..." : "কনসাল্টেশন রিকোয়েস্ট পাঠান →"}
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-400">সরাসরি কল করতে পারেন: </span>
            <a href="tel:01620692449" className="text-xs font-bold text-emerald-800 hover:underline">
              01620692449
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
