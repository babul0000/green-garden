import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white">
      {/* Background Soft Ambient Elements */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-emerald-100/30 rounded-l-[120px] md:rounded-l-[240px] -z-10 transform translate-x-12 translate-y-4 blur-2xl"></div>
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-teal-100/40 rounded-full -z-10 blur-3xl"></div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Bengali Headline, Subheadline & CTAs */}
        <div className="lg:col-span-7 flex flex-col gap-5 md:gap-7 animate-fade-in-up z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-800/10 text-emerald-800 border border-emerald-800/20 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold tracking-wide self-start shadow-sm">
            <span>🌿</span> A R GREEN GARDEN • Professional Landscape Company
          </div>

          {/* Main Bengali Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-[1.2] tracking-tight">
            প্রকৃতির ছোঁয়ায় বদলে দিন <br />
            <span className="text-emerald-700 italic font-medium">আপনার চারপাশ</span>
          </h1>

          {/* Bengali Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium leading-relaxed max-w-2xl">
            আপনার স্বপ্নের সবুজায়ন, আমাদের দক্ষতায়।
            <span className="block text-sm md:text-base text-gray-500 font-normal mt-1">
              রুপটপ গার্ডেন, ভার্টিক্যাল গ্রিন ওয়াল, আধুনিক ইরিগেশন এবং বিশেষজ্ঞ ট্রি ডক্টর চিকিৎসা — আপনার বাড়ি ও কর্মক্ষেত্রকে সাজিয়ে তুলুন আন্তর্জাতিক মানের ল্যান্ডস্কেপিংয়ে।
            </span>
          </p>

          {/* 5 CTA Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <a 
              href="#contact" 
              className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>🌿</span> Free Consultation
            </a>

            <button 
              onClick={() => {
                const el = document.getElementById("estimator");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else window.dispatchEvent(new Event("open-estimator"));
              }} 
              className="px-6 py-3.5 bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 font-semibold text-sm rounded-full transition-all duration-300 border border-emerald-300 shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
            >
              <span>🎨</span> Design Your Garden
            </button>

            <Link 
              href="/projects" 
              className="px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-800 font-medium text-sm rounded-full transition-all duration-300 border border-gray-300 shadow-sm hover:shadow flex items-center gap-2"
            >
              <span>🖼️</span> View Projects
            </Link>

            <a 
              href="tel:01620692449" 
              className="px-5 py-3.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-800 font-semibold text-sm rounded-full transition-all duration-300 border border-emerald-300 flex items-center gap-2"
              title="Call 01620692449"
            >
              <span>📞</span> 01620692449
            </a>

            <a 
              href="https://wa.me/8801620692449?text=Hello%20AR%20Green%20Garden,%20I%20want%20to%20consult%20about%20my%20garden." 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-sm rounded-full transition-all duration-300 shadow-sm hover:shadow flex items-center gap-2"
            >
              <span>💬</span> WhatsApp
            </a>
          </div>

          {/* Trust Stats Counter Pill */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200 mt-2 max-w-xl">
            <div>
              <span className="block text-2xl md:text-3xl font-bold font-serif text-emerald-700">350+</span>
              <span className="text-xs text-gray-500">Gardens Built</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-bold font-serif text-emerald-700">100%</span>
              <span className="text-xs text-gray-500">Waterproof Guarantee</span>
            </div>
            <div>
              <span className="block text-2xl md:text-3xl font-bold font-serif text-emerald-700">35+</span>
              <span className="text-xs text-gray-500">Expert Team</span>
            </div>
            <div className="hidden sm:block">
              <span className="block text-2xl md:text-3xl font-bold font-serif text-emerald-700">9+ Yrs</span>
              <span className="text-xs text-gray-500">Dhaka Experience</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop" 
              alt="AR Green Garden Luxury Rooftop Project Dhanmondi"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            
            {/* Project Pill Floating Bottom */}
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Featured Transformation</span>
                  <p className="text-sm font-bold text-gray-900">Dhanmondi Penthouse Rooftop Oasis</p>
                  <p className="text-xs text-gray-500">Road 9/A, Dhanmondi, Dhaka</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
                  Completed
                </span>
              </div>
            </div>

            {/* Tree Doctor Badge Floating Top */}
            <div className="absolute top-5 left-5 px-3.5 py-1.5 rounded-full bg-emerald-800/90 text-white backdrop-blur-md text-xs font-semibold shadow-md flex items-center gap-1.5">
              <span>🩺</span> Tree Doctor Specialist On-Board
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
