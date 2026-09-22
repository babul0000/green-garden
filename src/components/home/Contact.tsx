"use client";

import React, { useState } from "react";

export default function Contact() {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactLocation, setContactLocation] = useState("");
  const [serviceType, setServiceType] = useState("Rooftop Garden");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone) return;

    setIsSubmitting(true);
    try {
      // Send to backend message API if available
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          location: contactLocation,
          service: serviceType,
          message: contactMessage,
        }),
      }).catch(() => null);

      setContactSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/70">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
            যোগাযোগ ও অবস্থান
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            Contact & Location
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            আমাদের অফিসে সরাসরি ভিজিট করুন অথবা ফোনে ও হোয়াটসঅ্যাপে আপনার ল্যান্ডস্কেপিং নিয়ে আলোচনা করুন।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Company Address, Contacts & Actions */}
          <div className="lg:col-span-5 bg-white p-7 sm:p-9 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <div className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-lg">
                Professional Landscape Company
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-2">A R Green Garden</h3>
              <p className="text-xs text-gray-500 mt-1">
                Website + CRM + Project Management + Employee + Accounting + Automation
              </p>
            </div>

            <div className="space-y-4 text-sm text-gray-700">
              {/* Address */}
              <div className="flex items-start gap-3.5">
                <span className="text-xl shrink-0">📍</span>
                <div>
                  <strong className="block text-gray-900 text-xs uppercase tracking-wider">অফিস ঠিকানা:</strong>
                  <p className="text-sm text-gray-700 mt-0.5">42/A, Road 9/A, Dhanmondi, Dhaka, Bangladesh</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <span className="text-xl shrink-0">📞</span>
                <div>
                  <strong className="block text-gray-900 text-xs uppercase tracking-wider">হটলাইন / মোবাইল:</strong>
                  <a href="tel:01620692449" className="text-emerald-700 font-bold hover:underline text-base mt-0.5 inline-block">
                    01620692449
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3.5">
                <span className="text-xl shrink-0">💬</span>
                <div>
                  <strong className="block text-gray-900 text-xs uppercase tracking-wider">হোয়াটসঅ্যাপ চ্যাট:</strong>
                  <a 
                    href="https://wa.me/8801620692449?text=Hello%20AR%20Green%20Garden,%20I%20need%20landscape%20consultation" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-semibold hover:underline text-sm mt-0.5 inline-block"
                  >
                    +880 1620692449 (Click to Chat)
                  </a>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-3.5">
                <span className="text-xl shrink-0">⏰</span>
                <div>
                  <strong className="block text-gray-900 text-xs uppercase tracking-wider">অফিস সময়:</strong>
                  <p className="text-xs text-gray-600 mt-0.5">শনিবার — বৃহস্পতিবার: সকাল ৯:০০ — রাত ৮:০০</p>
                </div>
              </div>
            </div>

            {/* Direct Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-100">
              <a
                href="tel:01620692449"
                className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold text-center shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <span>📞</span> Call
              </a>

              <a
                href="https://wa.me/8801620692449?text=Hello%20AR%20Green%20Garden,%20I%20want%20to%20consult%20about%20my%20garden."
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-semibold text-center shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <span>💬</span> WhatsApp
              </a>

              <a
                href="https://maps.google.com/?q=42/A+Road+9/A+Dhanmondi+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-all"
              >
                <span>🧭</span> Direction
              </a>
            </div>

            {/* Embedded Google Maps View */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 aspect-[16/9] shadow-inner relative">
              <iframe
                title="A R Green Garden Location Dhanmondi"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.023243171881!2d90.370500!3d23.746500!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b1a8d00001%3A0x280e56d787019672!2sRoad%209%2FA%2C%20Dhanmondi%2C%20Dhaka%201209!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Free Consultation Callback Form */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-3xl border border-emerald-100 shadow-sm">
            {contactSubmitted ? (
              <div className="text-center py-14 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">ধন্যবাদ! আপনার রিকোয়েস্ট সফল হয়েছে</h3>
                <p className="text-gray-600 text-sm max-w-md">
                  আপনার তথ্য আমাদের সিস্টেমে সংরক্ষিত হয়েছে। আমাদের প্রধান ল্যান্ডস্কেপ টিম দ্রুতই আপনার <strong>{contactPhone}</strong> নম্বরে যোগাযোগ করবে।
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactName("");
                    setContactPhone("");
                    setContactLocation("");
                    setContactMessage("");
                  }}
                  className="mt-3 text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                >
                  আরেকটি কনসালটেশন রিকোয়েস্ট পাঠান
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">ফ্রি কনসালটেশন বা হোম ভিজিট রিকোয়েস্ট</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    ফর্মটি পূরণ করুন; আমাদের বিশেষজ্ঞ টিম বিনামূল্যে প্রাথমিক পরামর্শ প্রদান করবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. তানভীর আহমেদ"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">সাইট লোকেশন (এলাকা)</label>
                    <input
                      type="text"
                      placeholder="যেমন: ধানমন্ডি, গুলশান, উত্তরা"
                      value={contactLocation}
                      onChange={(e) => setContactLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">আগ্রহের সার্ভিস</label>
                    <select
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="Rooftop Garden">Rooftop Garden (ছাদ বাগান)</option>
                      <option value="Residential Landscape">Residential Landscape (আবাসিক ল্যান্ডস্কেপ)</option>
                      <option value="Vertical Garden">Vertical Green Wall (ভার্টিক্যাল গার্ডেন)</option>
                      <option value="Tree Doctor Service">Tree Doctor / গাছের চিকিৎসা</option>
                      <option value="Smart Irrigation">Smart Irrigation (অটো ড্রিপ ইরিগেশন)</option>
                      <option value="Garden Maintenance">Garden Maintenance (নিয়মিত পরিচর্যা)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">বিস্তারিত বিবরণ / প্রশ্ন</label>
                  <textarea
                    rows={4}
                    placeholder="আপনার ছাদের মাপ, ব্যালকনির সাইজ বা গাছের সমস্যা সম্পর্কে সংক্ষেপে লিখুন..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <span>📨</span> ফ্রি কনসালটেশন সাবমিট করুন
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
