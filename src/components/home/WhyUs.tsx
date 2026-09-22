import React from "react";

export default function WhyUs() {
  const points = [
    {
      icon: "🛡️",
      title: "১০০% ওয়াটারপ্রুফ গ্যারান্টি",
      subtitle: "100% Leak-Proof Rooftop Guarantee",
      desc: "উন্নত মাল্টি-লেয়ার মেমব্রেন ও ড্রেনেজ সেল প্রযুক্তি ব্যবহারের ফলে আপনার ছাদ বা ভবনে কোনো প্রকার ড্যাম্প বা পানির লিকেজ হওয়ার কোনো ঝুঁকি থাকে না।",
    },
    {
      icon: "🩺",
      title: "বিশেষজ্ঞ ট্রি ডক্টর সার্ভিস",
      subtitle: "Certified Tree Doctor & Plant Pathology",
      desc: "শুধু গাছ লাগানো নয়, গাছের রোগ নির্ণয়, পোকা দমন, ভিটামিন প্রয়োগ এবং গাছ সুস্থ রাখার জন্য আমাদের রয়েছে অভিজ্ঞ ডেডিকেটেড ট্রি ডক্টর টিম।",
    },
    {
      icon: "💧",
      title: "স্মার্ট অটোমেটিক ইরিগেশন",
      subtitle: "Smart Automated Drip & Sprinkler",
      desc: "ডিজিটাল টাইমার নিয়ন্ত্রিত ড্রিপ ও স্প্রিংকলার সিস্টেম, যা ৭০% পর্যন্ত পানি সাশ্রয় করে এবং মানুষের অনুপস্থিতিতেও গাছে সঠিক পরিমাণে পানি নিশ্চিত করে।",
    },
    {
      icon: "🗓️",
      title: "নিয়মিত মেইনটেন্যান্স সাপোর্ট",
      subtitle: "Scheduled Garden Maintenance",
      desc: "সাপ্তাহিক ও মাসিক শিডিউল অনুযায়ী মালীদের নিয়মিত পরিচর্যা, লন কাটিং, প্রুনিং এবং জৈব সার প্রয়োগের নিশ্চয়তা।",
    },
    {
      icon: "💰",
      title: "স্বচ্ছ কোটেশন ও ফেয়ার প্রাইসিং",
      subtitle: "Itemized & Transparent Pricing",
      desc: "প্রতিটি গাছ, মাটি, টব, লেবার ও ম্যাটেরিয়ালের আলাদা হিসাবসহ স্মার্ট কোটেশন দেওয়া হয়, যাতে কোনো গোপন বা অতিরিক্ত খরচ থাকে না।",
    },
    {
      icon: "🏆",
      title: "৩৫+ অভিজ্ঞ ল্যান্ডস্কেপ টিম",
      subtitle: "Decade of Urban Greening Expertise",
      desc: "ধানমন্ডি, গুলশান, বনানী, উত্তরা সহ ঢাকা শহরের শত শত লাক্সারি ভিলা, পেন্টহাউস এবং কর্পোরেট অফিসে ল্যান্ডস্কেপিংয়ের বাস্তব অভিজ্ঞতা।",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-50/40 border-y border-emerald-100/60">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
            কেন এ আর গ্রিন গার্ডেন?
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
            Why Choose A R Green Garden
          </h2>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            আমরা শুধু বাগান বানাই না, একটি দীর্ঘস্থায়ী ও স্বস্তিদায়ক সবুজ পরিবেশ গড়ে তুলি।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 border border-emerald-100/80 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl shadow-inner">
                  {p.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg font-serif">{p.title}</h3>
                  <span className="text-xs font-semibold text-emerald-700 block mt-0.5">{p.subtitle}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
