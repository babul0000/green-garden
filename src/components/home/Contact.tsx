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
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          subject: `${serviceType} Consultation - ${contactLocation || "Dhaka"}`,
          message: `${contactMessage ? contactMessage + "\n" : ""}Location: ${contactLocation || "Dhaka"}\nService: ${serviceType}`,
        }),
      });

      if (res.ok) {
        setContactSubmitted(true);
      } else {
        const data = await res.json();
        alert("Message sending failed: " + (data.error || "Please verify your input"));
      }
    } catch (err: any) {
      alert("Network error sending message: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#121813] border-b border-stone-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Shma Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#2B4D33] font-bold block mb-2">
                Studio Headquarters • যোগাযোগ ও অবস্থান
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-[#121813]">
                Contact & <span className="font-bold text-[#2B4D33]">Studio Consultation</span>
              </h2>
            </div>
            <p className="font-sans text-xs sm:text-sm text-[#75787B] max-w-md leading-relaxed">
              Visit our Dhanmondi studio or schedule an on-site architectural consultation with our landscape architects and certified tree doctors.
            </p>
          </div>
          
          <div className="w-full h-[1px] bg-stone-300"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Studio Headquarters, Phone, Hours (5 cols) */}
          <div className="lg:col-span-5 bg-[#F7F6F2] p-8 sm:p-10 rounded-[32px] border border-stone-300 space-y-6 shadow-sm">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] bg-[#E4E2D7] text-[#121813] px-3 py-1 rounded-full font-bold inline-block">
                Dhaka Headquarters
              </span>
              <h3 className="font-display text-2xl font-bold text-[#121813]">
                A R Green Garden
              </h3>
              <p className="font-mono text-xs text-[#75787B]">
                Landscape Architecture, Tree Doctor Clinic & Automation
              </p>
            </div>

            <div className="space-y-4 font-sans text-xs sm:text-sm text-stone-700">
              {/* Studio Address */}
              <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200">
                <span className="text-xl shrink-0">📍</span>
                <div>
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#75787B]">
                    Studio Address:
                  </strong>
                  <p className="text-stone-900 font-semibold mt-0.5">
                    42/A, Road 9/A, Dhanmondi, Dhaka-1209, Bangladesh
                  </p>
                </div>
              </div>

              {/* Phone Hotline */}
              <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200">
                <span className="text-xl shrink-0">📞</span>
                <div>
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#75787B]">
                    Direct Hotline:
                  </strong>
                  <a
                    href="tel:01620692449"
                    className="text-[#2B4D33] font-mono text-base font-bold hover:underline mt-0.5 inline-block"
                  >
                    01620692449
                  </a>
                </div>
              </div>

              {/* WhatsApp Direct */}
              <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200">
                <span className="text-xl shrink-0">💬</span>
                <div>
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#75787B]">
                    WhatsApp Instant Chat:
                  </strong>
                  <a
                    href="https://wa.me/8801620692449?text=Hello%20AR%20Green%20Garden,%20I%20would%20like%20to%20consult%20about%20my%20landscape%20project."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#25D366] font-mono text-xs font-bold hover:underline mt-0.5 inline-block"
                  >
                    +880 1620-692449 (Click to Chat)
                  </a>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start gap-3.5 p-3.5 bg-white rounded-2xl border border-stone-200">
                <span className="text-xl shrink-0">🕒</span>
                <div>
                  <strong className="block font-mono text-[11px] uppercase tracking-wider text-[#75787B]">
                    Studio Hours:
                  </strong>
                  <p className="text-stone-900 font-mono text-xs mt-0.5">
                    Saturday – Thursday: 9:00 AM – 8:00 PM
                  </p>
                  <p className="text-[11px] text-[#75787B] mt-0.5">
                    Friday: On-Call Tree Doctor Emergency Team Available
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href="tel:01620692449"
                className="px-5 py-2.5 bg-[#18221A] hover:bg-[#2B4D33] text-white rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow"
              >
                Call Hotline
              </a>
              <a
                href="https://wa.me/8801620692449"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow"
              >
                WhatsApp Us
              </a>
            </div>

          </div>

          {/* Right Column: Architectural Consultation Booking Form & Map (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Consultation Booking Form */}
            <div className="bg-[#F7F6F2] p-8 sm:p-10 rounded-[32px] border border-stone-300 shadow-sm space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#2B4D33] font-bold block mb-1">
                  Schedule Studio Consultation
                </span>
                <h3 className="font-display text-xl font-bold text-[#121813]">
                  Book an On-Site Landscape Assessment
                </h3>
              </div>

              {contactSubmitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                  <span className="text-3xl">🌿</span>
                  <h4 className="font-display text-lg font-bold text-emerald-900">
                    ধন্যবাদ! আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে।
                  </h4>
                  <p className="font-sans text-xs text-emerald-700">
                    আমাদের প্রধান ল্যান্ডস্কেপ আর্কিটেক্ট শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করবেন।
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="mt-3 px-4 py-2 bg-emerald-800 text-white rounded-full font-mono text-xs font-semibold cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Engr. Zahid Hasan"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                        Location / Site Area
                      </label>
                      <input
                        type="text"
                        value={contactLocation}
                        onChange={(e) => setContactLocation(e.target.value)}
                        placeholder="e.g. Road 9/A, Dhanmondi, Dhaka"
                        className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                        Service Required
                      </label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813]"
                      >
                        <option value="Rooftop Garden">Rooftop Garden Setup (100% Waterproof)</option>
                        <option value="Vertical Green Wall">Vertical Living Green Wall</option>
                        <option value="Residential Landscape">Residential Villa Landscaping</option>
                        <option value="Commercial Landscape">Corporate Office / Campus Biophilia</option>
                        <option value="Tree Doctor Consultation">Tree Doctor & Plant Clinic</option>
                        <option value="Smart Irrigation">Automated Smart Drip Irrigation</option>
                        <option value="Garden Maintenance">Scheduled Maintenance Package</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs uppercase tracking-wider text-[#75787B] block">
                      Project Notes / Special Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Please specify approx area (e.g. 2,500 sq.ft rooftop), building floor, preferred design style..."
                      className="w-full px-4 py-3 bg-white rounded-xl border border-stone-300 focus:outline-none focus:border-[#2B4D33] text-sm text-[#121813] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#18221A] hover:bg-[#2B4D33] text-white font-mono text-xs uppercase tracking-widest font-bold rounded-full transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting Request..." : "Request Architectural Consultation"}
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
