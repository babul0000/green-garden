"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function Contact() {
  const { language, t } = useLanguage();
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [serviceType, setServiceType] = useState("Rooftop Garden");
  const [contactMessage, setContactMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) {
      alert(t("অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর দিন।", "Please provide your name and phone number."));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: contactName,
          clientPhone: contactPhone,
          serviceCategory: serviceType,
          siteAddress: contactLocation,
          notes: contactMessage,
        }),
      });

      if (res.ok) {
        setContactSubmitted(true);
        setContactName("");
        setContactPhone("");
        setContactLocation("");
        setContactMessage("");
      } else {
        alert(t("সমস্যা হয়েছে, অনুগ্রহ করে সরাসরি হটলাইনে কল করুন।", "Submission error. Please call our direct hotline."));
      }
    } catch {
      alert(t("সার্ভার ত্রুটি, অনুগ্রহ করে হটলাইনে কল করুন।", "Server error. Please call our hotline."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                {t("Studio Headquarters", "Studio Headquarters")}
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                {t("Contact & Studio Consultation", "Contact & Studio Consultation")}
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              {t(
                "আমাদের ধানমন্ডি স্টুডিওতে সরাসরি চলে আসুন অথবা আপনার সাইট পরিদর্শনের জন্য আর্কিটেক্ট ও ট্রি ডক্টর টিম বুক করুন।",
                "Visit our Dhanmondi studio or schedule an on-site architectural consultation with our landscape team."
              )}
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Studio Headquarters */}
          <div className="lg:col-span-5 bg-[#F7F6F2] p-8 sm:p-10 rounded-[32px] border border-stone-300 space-y-6 shadow-sm">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] bg-[#E4E2D7] text-[#121813] px-3 py-1 rounded-full font-bold inline-block">
                {t("Dhaka Headquarters", "Dhaka Headquarters")}
              </span>
              <h3 className="font-display text-2xl font-bold text-[#121813]">
                A R Green Garden
              </h3>
              <p className="font-mono text-xs text-[#75787B]">
                {t("Landscape Architecture, Tree Doctor Clinic & Automation", "Landscape Architecture, Tree Doctor Clinic & Automation")}
              </p>
            </div>

            <div className="space-y-4 font-sans text-xs sm:text-sm text-stone-700">
              {/* Studio Address */}
              <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200">
                <span className="text-xl shrink-0">📍</span>
                <div>
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#75787B]">
                    {t("স্টুডিওর ঠিকানা:", "Studio Address:")}
                  </strong>
                  <p className="text-stone-900 font-semibold mt-0.5">
                    {t("৪২/এ, রোড ৯/এ, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ", "42/A, Road 9/A, Dhanmondi, Dhaka-1209, Bangladesh")}
                  </p>
                </div>
              </div>

              {/* Phone Hotline */}
              <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200">
                <span className="text-xl shrink-0">📞</span>
                <div>
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#75787B]">
                    {t("সরাসরি হটলাইন:", "Direct Hotline:")}
                  </strong>
                  <a
                    href="tel:01883012641"
                    className="text-[#2B4D33] font-mono text-base font-bold hover:underline mt-0.5 inline-block"
                  >
                    01883012641
                  </a>
                </div>
              </div>

              {/* WhatsApp Direct */}
              <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200">
                <span className="text-xl shrink-0">💬</span>
                <div>
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#75787B]">
                    {t("হোয়াটসঅ্যাপ চ্যাট:", "WhatsApp Instant Chat:")}
                  </strong>
                  <a
                    href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20would%20like%20to%20consult%20about%20my%20garden."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-mono text-xs font-bold hover:underline mt-0.5 inline-block"
                  >
                    +880 1883-012641
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200">
                <span className="text-xl shrink-0">🕒</span>
                <div>
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#75787B]">
                    {t("স্টুডিও সময়সূচী:", "Studio Hours:")}
                  </strong>
                  <p className="text-stone-900 font-mono text-xs mt-0.5">
                    {t("শনিবার – বৃহস্পতিবার: সকাল ৯:০০ – রাত ৮:০০", "Saturday – Thursday: 9:00 AM – 8:00 PM")}
                  </p>
                  <p className="text-[11px] text-[#75787B] mt-0.5">
                    {t("শুক্রবার: অন-কল ট্রি ডক্টর টিম জরুরি সেবায় প্রস্তুত", "Friday: On-Call Tree Doctor Emergency Team Available")}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href="tel:01883012641"
                className="px-5 py-2.5 bg-[#18221A] hover:bg-[#2B4D33] text-white rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow"
              >
                {t("হটলাইনে কল করুন", "Call Hotline")}
              </a>
              <a
                href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20would%20like%20to%20consult%20about%20my%20garden."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-stone-950 font-bold rounded-full font-mono text-xs uppercase tracking-wider transition-all shadow flex items-center gap-1.5"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>

          </div>

          {/* Right Column: Architectural Consultation Booking Form & Map */}
          <div className="lg:col-span-7 space-y-8">
            
            <div className="bg-[#F7F6F2] p-8 sm:p-10 rounded-[32px] border border-stone-300 shadow-sm space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2B4D33] font-bold block mb-1">
                  {t("Schedule Studio Consultation", "Schedule Studio Consultation")}
                </span>
                <h3 className="font-display text-xl font-bold text-[#121813]">
                  {t("Book an On-Site Landscape Assessment", "Book an On-Site Landscape Assessment")}
                </h3>
              </div>

              {contactSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <span className="text-3xl">🌿</span>
                  <h4 className="font-display text-lg font-bold text-emerald-900">
                    {t("ধন্যবাদ! আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে।", "Thank you! Your inquiry has been dispatched.")}
                  </h4>
                  <p className="font-sans text-xs text-emerald-700">
                    {t("আমাদের প্রধান ল্যান্ডস্কেপ আর্কিটেক্ট শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করবেন।", "Our principal landscape architect will call you shortly.")}
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="mt-3 px-4 py-2 bg-emerald-800 text-white rounded-full font-mono text-xs font-semibold cursor-pointer"
                  >
                    {t("আরেকটি রিকোয়েস্ট পাঠান", "Send Another Inquiry")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                        {t("আপনার পূর্ণ নাম *", "Your Full Name *")}
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t("e.g. তানভীর আহমেদ", "e.g. Tanvir Ahmed")}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                        {t("মোবাইল নম্বর *", "Phone Number *")}
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                        {t("সাইটের অবস্থান (এলাকা)", "Location / Site Area")}
                      </label>
                      <input
                        type="text"
                        value={contactLocation}
                        onChange={(e) => setContactLocation(e.target.value)}
                        placeholder={t("ধানমন্ডি / গুলশান / বনানী", "e.g. Dhanmondi, Gulshan, Banani")}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                        {t("প্রয়োজনীয় সেবা", "Service Required")}
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813]"
                      >
                        <option value="Rooftop Garden">{t("ছাদবাগান সেটআপ (১০০% ওয়াটারপ্রুফ)", "Rooftop Garden Setup (100% Waterproof)")}</option>
                        <option value="Vertical Green Wall">{t("ভার্টিক্যাল লিভিং গ্রিন ওয়াল", "Vertical Living Green Wall")}</option>
                        <option value="Residential Landscape">{t("আবাসিক ভিলা ল্যান্ডস্কেপিং", "Residential Villa Landscaping")}</option>
                        <option value="Commercial Landscape">{t("করপোরেট অফিস বায়োফিলিয়া", "Corporate Office Biophilia")}</option>
                        <option value="Tree Doctor Consultation">{t("ট্রি ডক্টর ও উদ্ভিদ ক্লিনিক", "Tree Doctor & Plant Clinic")}</option>
                        <option value="Smart Irrigation">{t("স্বয়ংক্রিয় স্মার্ট ড্রিপ সেচ", "Automated Smart Drip Irrigation")}</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                      {t("প্রকল্পের বিবরণ বা বিশেষ চাহিদা", "Project Notes / Special Requirements")}
                    </label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={t(
                        "আনুমানিক আয়তন (যেমন: ২,৫০০ বর্গফুট ছাদ), ফ্লোর লেভেল বা পছন্দের স্টাইল লিখুন...",
                        "Please specify approx area (e.g. 2,500 sq.ft rooftop), floor level, preferred design..."
                      )}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#18221A] hover:bg-[#2B4D33] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-full transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting
                      ? t("রিকোয়েস্ট পাঠানো হচ্ছে...", "Submitting Request...")
                      : t("পরামর্শ বুকিং আবেদন পাঠান ✓", "Request Architectural Consultation ✓")}
                  </button>
                </form>
              )}
            </div>

            {/* Interactive Dhanmondi Google Map Frame */}
            <div className="rounded-[32px] overflow-hidden border border-stone-300 shadow-sm aspect-[16/8] bg-stone-200 relative">
              <iframe
                title="A R Green Garden Studio Location - Dhanmondi Dhaka"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.1287959062327!2d90.3725!3d23.7428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b7a3a9a1d1%3A0x1c8b3f8d9b1c!2sRoad%209%2FA%2C%20Dhanmondi%2C%20Dhaka%201209!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
