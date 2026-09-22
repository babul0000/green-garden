import React from "react";

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Engr. Zahid Hasan",
      role: "Penthouse Owner",
      location: "Road 9/A, Dhanmondi, Dhaka",
      rating: 5,
      date: "August 2026",
      text: "এ আর গ্রিন গার্ডেন আমাদের ধানমন্ডির ছাদকে পুরোপুরি একটি স্বর্গীয় আশ্রয়ে পরিণত করেছে। বিশেষ করে তাদের ওয়াটারপ্রুফিং আর অটো-ড্রিপ ইরিগেশন অসাধারণ। গাছের কোনো যত্ন নিতে ঝামেলা পোহাতে হয় না।",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
      projectType: "Luxury Rooftop Garden",
    },
    {
      name: "Dr. Farhana Chowdhury",
      role: "Resident",
      location: "Gulshan-2, Dhaka",
      rating: 5,
      date: "July 2026",
      text: "আমাদের বাগানের ২০ বছরের পুরনো আম গাছটি পোকার আক্রমণে প্রায় মরতে বসেছিল। তাদের ট্রি ডক্টর টিম এসে ৩টি সেশনের ট্রিটমেন্টে গাছটিকে সম্পূর্ণ সুস্থ করে তুলেছেন। তাদের জ্ঞান সত্যিই প্রশংসনীয়।",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
      projectType: "Tree Doctor Treatment",
    },
    {
      name: "Mahmudur Rahman",
      role: "Managing Director, Tech Park",
      location: "Banani, Dhaka",
      rating: 5,
      date: "September 2026",
      text: "আমাদের অফিসের এন্ট্রান্সে তাদের তৈরি করা ভার্টিক্যাল গ্রিন ওয়াল ক্লায়েন্টদের প্রথম দেখাতেই মুগ্ধ করে। মেইনটেন্যান্স টিমও সময়মতো এসে নিয়মিত পরিচর্যা করে যায়।",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
      projectType: "Commercial Vertical Garden",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
            গ্রাহকের সন্তুষ্টি
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            Customer Reviews & Ratings
          </h2>
          <p className="text-sm md:text-base text-gray-600">
            আমাদের কাজ ও সেবায় সন্তুষ্ট গ্রাহকদের মূল্যবান প্রতিক্রিয়া।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="bg-emerald-50/40 rounded-3xl p-7 border border-emerald-100 flex flex-col justify-between space-y-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400 text-base">
                  {"★".repeat(r.rating)}
                  <span className="text-xs font-bold text-gray-500 ml-1.5">{r.rating}.0</span>
                </div>

                <p className="text-xs md:text-sm text-gray-700 leading-relaxed italic">
                  "{r.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-200/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={r.avatar}
                    alt={r.name}
                    className="w-11 h-11 rounded-full object-cover border border-white shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-xs md:text-sm font-serif">{r.name}</h4>
                    <p className="text-[11px] text-gray-500">{r.role} • {r.location}</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                  {r.projectType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
