import React from "react";
import Link from "next/link";

export default function Gallery() {
  const showcaseProjects = [
    {
      title: "Dhanmondi Sky Retreat Luxury Penthouse",
      category: "Rooftop Garden",
      location: "Road 9/A, Dhanmondi",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600&auto=format&fit=crop",
      badge: "Before/After Available"
    },
    {
      title: "Gulshan Corporate Living Vertical Wall",
      category: "Vertical Garden",
      location: "Gulshan Avenue, Dhaka",
      image: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop",
      badge: "Commercial"
    },
    {
      title: "Banani Royal Residence Lawn & Mood Lights",
      category: "Residential",
      location: "Road 11, Banani",
      image: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=600&auto=format&fit=crop",
      badge: "Luxury"
    },
    {
      title: "Sreemangal Tea Valley Resort Oasis",
      category: "Resort",
      location: "Sreemangal, Sylhet",
      image: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=600&auto=format&fit=crop",
      badge: "Eco-Park"
    },
    {
      title: "Uttara Zen Terrace Japanese Garden",
      category: "Luxury",
      location: "Sector 4, Uttara",
      image: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=600&auto=format&fit=crop",
      badge: "Zen Garden"
    },
    {
      title: "Bashundhara R/A Fountain & Lighting Plaza",
      category: "Fountain & Lighting",
      location: "Block I, Bashundhara",
      image: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=600&auto=format&fit=crop",
      badge: "Water Feature"
    }
  ];

  return (
    <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-50/30">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100/80 px-4 py-1.5 rounded-full self-center border border-emerald-200">
            আমাদের কাজ • Project Showcase
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            বাস্তবায়িত ল্যান্ডস্কেপ গ্যালারি
          </h2>
          <div className="w-16 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            ঢাকাসহ সারা দেশে আমাদের সম্পন্ন হওয়া আন্তর্জাতিক মানের ছাদবাগান, লিভিং গ্রিন ওয়াল ও রেসিডেন্সিয়াল প্রকল্পের নির্বাচিত ছবি।
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {showcaseProjects.map((item, idx) => (
            <Link
              key={idx}
              href="/gallery"
              className="group relative aspect-[16/11] rounded-3xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-emerald-900 text-[11px] font-bold rounded-full shadow-sm">
                  {item.category}
                </span>
                <span className="px-2.5 py-1 bg-emerald-800/90 text-white text-[10px] font-semibold rounded-full shadow-sm">
                  {item.badge}
                </span>
              </div>

              {/* Bottom Content */}
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-1 z-10">
                <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
                  <span>📍</span> {item.location}
                </span>
                <h4 className="text-base font-bold font-serif leading-snug group-hover:text-emerald-200 transition-colors">
                  {item.title}
                </h4>
                <span className="text-xs text-white/70 inline-flex items-center gap-1 pt-1 font-semibold group-hover:translate-x-1 transition-transform">
                  সম্পূর্ণ গ্যালারি দেখুন →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-2">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <span>🖼️</span> ১৭টি ক্যাটাগরির ফিল্টারযুক্ত সম্পূর্ণ গ্যালারি দেখুন <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
