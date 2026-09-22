import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#122216] text-white/90 py-16 px-4 sm:px-6 lg:px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Company Info & Address */}
        <div className="flex flex-col gap-4">
          <span className="text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
            <span className="inline-block w-2.5 h-6 bg-emerald-500 rounded-full"></span>
            A R Green Garden
          </span>
          <p className="text-xs text-white/60 leading-relaxed">
            Professional Landscape Company in Bangladesh. Rooftop gardens, vertical greenery, tree doctor healthcare, and smart automatic irrigation.
          </p>
          <div className="space-y-1.5 text-xs text-white/70 pt-2 border-t border-white/10">
            <p className="flex items-center gap-2">
              <span>📍</span> 42/A, Road 9/A, Dhanmondi, Dhaka
            </p>
            <p className="flex items-center gap-2">
              <span>📞</span> <a href="tel:01620692449" className="hover:text-emerald-400 font-semibold">01620692449</a>
            </p>
            <p className="flex items-center gap-2">
              <span>💬</span> <a href="https://wa.me/8801620692449" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">WhatsApp Chat</a>
            </p>
          </div>
          <p className="text-[11px] text-white/40 mt-3">
            © 2026 A R Green Garden. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-white font-serif uppercase tracking-wider">Quick Navigation</h4>
          <div className="flex flex-col gap-2 text-xs text-white/70">
            <Link href="/" className="hover:text-emerald-300 transition-colors">Home Page</Link>
            <Link href="/services" className="hover:text-emerald-300 transition-colors">All Services Catalog</Link>
            <Link href="/projects" className="hover:text-emerald-300 transition-colors">Featured Projects</Link>
            <Link href="/gallery" className="hover:text-emerald-300 transition-colors">Before & After Gallery</Link>
            <Link href="/contact" className="hover:text-emerald-300 transition-colors">Location & Google Map</Link>
            <Link href="/client-dashboard" className="hover:text-emerald-300 transition-colors">Client Portal</Link>
            <Link href="/employee-portal" className="hover:text-emerald-300 transition-colors">Employee Portal</Link>
          </div>
        </div>

        {/* Core Specializations */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-white font-serif uppercase tracking-wider">Our Services</h4>
          <div className="flex flex-col gap-2 text-xs text-white/70">
            <Link href="/services" className="hover:text-emerald-300 transition-colors">Rooftop Garden Design</Link>
            <Link href="/services" className="hover:text-emerald-300 transition-colors">Residential Landscaping</Link>
            <Link href="/services" className="hover:text-emerald-300 transition-colors">Tree Doctor & Plant Care</Link>
            <Link href="/services" className="hover:text-emerald-300 transition-colors">Smart Automated Irrigation</Link>
            <Link href="/services" className="hover:text-emerald-300 transition-colors">Vertical Green Wall</Link>
            <Link href="/services" className="hover:text-emerald-300 transition-colors">Garden Maintenance Packages</Link>
          </div>
        </div>

        {/* Working Hours & Consultation */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-white font-serif uppercase tracking-wider">Consultation & Hours</h4>
          <p className="text-xs text-white/60 leading-relaxed">
            শনিবার — বৃহস্পতিবার: সকাল ৯:০০ — রাত ৮:০০
            <br />
            জরুরি গাছের চিকিৎসার জন্য আমাদের হটলাইনে কল করুন।
          </p>
          <div className="pt-2">
            <a
              href="tel:01620692449"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow transition-all"
            >
              <span>📞</span> Call: 01620692449
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
