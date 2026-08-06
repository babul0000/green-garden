"use client";

import { useState } from "react";

export default function Contact() {
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (contactName && contactPhone) {
      setContactSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8">
          <span className="text-[13px] font-semibold tracking-wider text-primary-green uppercase">Get In Touch</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold leading-tight">
            Let's Discuss <br />
            <span className="text-primary-green italic font-medium font-serif">Your Next Green</span> Masterpiece
          </h2>
          <p className="text-foreground/75 leading-relaxed text-sm md:text-base">
            Ready to remodel your space? Schedule a home visit with our principal landscape architect. We serve clients across all neighborhoods in Dhaka, Chittagong, and Sylhet.
          </p>

          <div className="flex flex-col gap-4 text-sm font-medium">
            <div className="flex items-center gap-4">
              <span className="text-xl">📍</span>
              <span className="text-foreground/85">House 42, Road 11, Banani, Dhaka, Bangladesh</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl">📞</span>
              <a href="tel:+8801700000000" className="text-primary-green hover:underline">+880 1700-000000</a>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl">✉️</span>
              <a href="mailto:hello@argreengarden.com" className="text-primary-green hover:underline">hello@argreengarden.com</a>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7 w-full">
          <div className="glass-card bg-[#f2f6f3] p-8 md:p-10 rounded-[32px] border border-foreground/5 shadow-lg">
            {contactSubmitted ? (
              <div className="text-center py-12 flex flex-col items-center gap-4 animate-fade-in-up">
                <div className="w-16 h-16 rounded-full bg-primary-green/10 flex items-center justify-center text-2xl text-primary-green">
                  ✓
                </div>
                <h3 className="text-xl font-bold font-serif">Thank You!</h3>
                <p className="text-foreground/60 text-sm max-w-sm">
                  Your message has been logged. Our design coordinators will call you back within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setContactSubmitted(false);
                    setContactName("");
                    setContactPhone("");
                    setContactMessage("");
                  }}
                  className="mt-4 text-xs font-semibold text-primary-green hover:underline"
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <h3 className="text-lg font-bold font-serif text-foreground/80 mb-2">Request Consultation Callback</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-foreground/75">Full Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Tanvir Ahmed" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-foreground/75">Mobile Number</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="e.g. +88017XXXXXXXX" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-foreground/75">Message / Requirements</label>
                  <textarea 
                    rows="4" 
                    placeholder="Tell us about your rooftop area, balcony size or requirements..." 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="bg-white border border-foreground/10 text-foreground py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-primary-green transition-all resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-primary-green hover:bg-primary-green-dark text-white font-medium text-[15px] py-4 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                >
                  Submit Callback Request
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
