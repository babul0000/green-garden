import React from "react";
import Link from "next/link";

export default function Services() {
  const featuredServices = [
    {
      title: "Rooftop Garden Setup",
      bengaliTitle: "রুফটপ গার্ডেন (ছাদবাগান)",
      category: "Garden Services",
      slug: "rooftop-gardening",
      pricing: "৳১,৫০,০০০ থেকে শুরু",
      desc: "১০০% ওয়াটারপ্রুফ মেমব্রেন, আধুনিক ড্রেনেজ সেল ও হালকা সয়েল মিডিয়ায় কংক্রিটের ছাদকে সবুজ স্বর্গে রূপান্তর।",
      icon: "🌇",
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Vertical Green Living Wall",
      bengaliTitle: "ভার্টিক্যাল গ্রিন ওয়াল",
      category: "Garden Services",
      slug: "vertical-garden",
      pricing: "৳৪৫০ - ৬৫০ / sqft",
      desc: "ঘরের দেয়াল বা বাণিজ্যিক ভবনের বহির্ভাগে জীবিত গাছের উচ্চ ঘনত্বের জীবন্ত দেয়ালবাগান ও অটো ফার্টিগেশন।",
      icon: "🍃",
      image: "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Residential Landscape Design",
      bengaliTitle: "রেসিডেন্সিয়াল ল্যান্ডস্কেপ",
      category: "Landscape Design",
      slug: "residential-landscape",
      pricing: "৳৫০,০০০ থেকে শুরু",
      desc: "ব্যক্তিগত বাড়ি ও ভিলার চারপাশের জন্য আর্কিটেকচারাল 2D/3D মাস্টারপ্ল্যান, লন সোফিং ও পাথওয়ে লাইটিং।",
      icon: "🏡",
      image: "https://images.unsplash.com/photo-1558904541-efa8c3a30fc9?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Tree Doctor & Plant Clinic",
      bengaliTitle: "ট্রি ডক্টর ও প্ল্যান্ট হেলথ",
      category: "Plant Health",
      slug: "tree-doctor",
      pricing: "৳১,৫০০ / ভিজিট",
      desc: "গাছের পাতা পোড়া, কান্ড পচা, উইপোকা বা ছত্রাক সংক্রমণ নির্ণয় ও বিশেষজ্ঞ এগ্রোনমিস্টের অন-সাইট চিকিৎসা।",
      icon: "🩺",
      image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Smart Automated Drip Irrigation",
      bengaliTitle: "স্মার্ট অটোমেটেড সেচ ব্যবস্থা",
      category: "Irrigation",
      slug: "smart-irrigation",
      pricing: "৳২৫,০০০ থেকে শুরু",
      desc: "ওয়াইফাই ও টাইমার নিয়ন্ত্রিত ড্রিপ ইরিগেশন — প্রতিটি গাছের গোড়ায় নিয়মিত পানি পৌঁছে ৭০% পানি সাশ্রয় করে।",
      icon: "💧",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600&auto=format&fit=crop"
    },
    {
      title: "Scheduled Garden Maintenance",
      bengaliTitle: "গার্ডেন মেইনটেন্যান্স প্যাকেজ",
      category: "Maintenance",
      slug: "garden-maintenance",
      pricing: "৳৪,০০০ / মাস থেকে",
      desc: "অভিজ্ঞ মালী ও সুপারভাইজারের নিয়মিত পরিচর্যা, লন কাটিং, প্রুনিং এবং অর্গানিক কেঁচো সার প্রয়োগ।",
      icon: "✂️",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?q=80&w=600&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col gap-3">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100/80 px-4 py-1.5 rounded-full self-center border border-emerald-200">
            আমাদের সেবা • What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            প্রিমিয়াম ল্যান্ডস্কেপিং সার্ভিসেস
          </h2>
          <div className="w-16 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            ৭টি প্রধান ক্যাটাগরির আওতায় ব্যক্তিগত বাড়ি, করপোরেট প্রতিষ্ঠান ও রুফটপ প্রকল্পের পূর্ণাঙ্গ ডিজাইন, বাস্তবায়ন ও পরিচর্যা।
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                {/* Image Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span>{srv.icon}</span>
                    <span>{srv.category}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 text-emerald-900 text-[11px] font-bold px-3 py-1 rounded-full shadow">
                    {srv.pricing}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-bold font-serif text-gray-900 group-hover:text-emerald-800 transition-colors">
                    {srv.bengaliTitle}
                  </h3>
                  <span className="text-xs text-gray-400 block">{srv.title}</span>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">
                    {srv.desc}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-6 pt-0 border-t border-gray-50 flex items-center justify-between text-xs mt-3">
                <Link
                  href={`/services/${srv.slug}`}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  বিস্তারিত জানুন <span>→</span>
                </Link>
                <Link
                  href={`/contact?service=${encodeURIComponent(srv.title)}`}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold shadow-sm transition-all"
                >
                  বুকিং করুন
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center pt-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <span>🌿</span> সকল ৭টি ক্যাটাগরির সার্ভিস ক্যাটালগ দেখুন <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
