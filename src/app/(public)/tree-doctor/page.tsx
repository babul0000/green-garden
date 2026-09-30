"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function TreeDoctorPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState("");
  const [treeName, setTreeName] = useState("");
  const [problem, setProblem] = useState("");
  const [preferredVisitTime, setPreferredVisitTime] = useState("Morning (10:00 AM - 1:00 PM)");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("emergency=true")) {
      setIsEmergency(true);
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !treeName || !problem) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নম্বর, গাছের নাম ও সমস্যার বিবরণ দিন।");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tree-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: name,
          clientPhone: phone,
          location,
          treeName,
          problem,
          preferredVisitTime,
          treePhotoUrl: photoPreview,
          isEmergency: Boolean(isEmergency),
          userId: user?.id,
        }),
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert("Failed to submit booking request. Please try again.");
      }
    } catch {
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sample Plant Health Records from PDF Requirement #7
  const samplePlantRecords = [
    {
      plantName: "Ficus Benjamina (Golden Weeping Fig)",
      photo: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&q=80",
      plantingDate: "15 March 2025",
      location: "Penthouse North Terrace, Dhanmondi",
      diseaseHistory: "White Mealybug & Leaf Yellowing (মিলিবাগের আক্রমণ)",
      treatment: "Neem Oil 5ml/L + Imidacloprid systematic spray; Root aeration applied.",
      fertilizer: "Slow-release NPK (19:19:19) + Organic Vermicompost 500g",
      pruning: "Canopy structural pruning conducted on 10 July 2026",
      nextMaintenance: "15 October 2026",
      doctorReport: "গাছের নতুন কচি পাতা গজিয়েছে এবং কোনো পোকার উপস্থিতি নেই। গাছ বর্তমানে ১০০% সুস্থ। — ডাঃ মোঃ রহিম",
    },
    {
      plantName: "Thai Amrapali Mango (Bonsai Container)",
      photo: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80",
      plantingDate: "10 November 2024",
      location: "Rooftop Orchard, Gulshan-2",
      diseaseHistory: "Anthracnose Fungal Leaf Spot (পাতায় কালো দাগ)",
      treatment: "Carbendazim + Mancozeb antifungal spray twice at 10-day intervals.",
      fertilizer: "Bone Meal + Mustard Oil Cake organic feeding",
      pruning: "Dead branch tip pruning completed",
      nextMaintenance: "05 November 2026",
      doctorReport: "ছত্রাক সম্পূর্ণরূপে নিয়ন্ত্রণে। আগামী সিজনে প্রচুর মুকুল আসার অনুকূল অবস্থা রয়েছে।",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>🩺</span> গাছ বিশেষজ্ঞ ক্লিনিক • Tree Doctor Healthcare
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
            ট্রি ডক্টর সার্ভিস ও <br />
            <span className="text-emerald-700 italic font-medium">প্ল্যান্ট হেলথ কেয়ার</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            গাছের যেকোনো রোগ নির্ণয়, পোকা দমন, পুষ্টির ঘাটতি পূরণ ও জরুরি ট্রিটমেন্টে আমাদের অভিজ্ঞ এগ্রোনমিস্ট ও ট্রি ডক্টর টিম রয়েছে আপনার পাশে।
          </p>
        </div>

        {/* Workflow Pipeline Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
              চিকিৎসা সেবা প্রক্রিয়া (Workflow)
            </span>
            <h3 className="text-xl font-serif font-bold text-gray-900">
              কীভাবে ট্রি ডক্টর কাজ করে?
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { step: "১", label: "Request", desc: "বুকিং রিকোয়েস্ট", icon: "📝" },
              { step: "২", label: "Assign", desc: "ডাক্তার অ্যাসাইন", icon: "👨‍⚕️" },
              { step: "৩", label: "Visit", desc: "বাগানে অন-সাইট ভিজিট", icon: "🚗" },
              { step: "৪", label: "Diagnosis", desc: "রোগ ও সমস্যা নির্ণয়", icon: "🔬" },
              { step: "৫", label: "Treatment", desc: "ওষুধ ও পরিচর্যা প্রয়োগ", icon: "💉" },
              { step: "৬", label: "Follow-up", desc: "ফলো-আপ ও হেলথ লগ", icon: "📋" },
            ].map((st, i) => (
              <div key={i} className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/80 space-y-2">
                <span className="text-2xl block">{st.icon}</span>
                <span className="text-xs font-bold text-emerald-900 block">{st.label}</span>
                <span className="text-[11px] text-gray-500 block">{st.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tree Doctor Booking Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Book a Tree Doctor Visit</span>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                ট্রি ডক্টর ভিজিট বুকিং ফর্ম
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                গাছের সমস্যা বিস্তারিত জানান; আমাদের বিশেষজ্ঞ টিম অন-সাইট পরিদর্শনে এসে সমাধান প্রদান করবেন।
              </p>
            </div>

            {/* Emergency Priority Toggle Banner */}
            <div
              onClick={() => setIsEmergency(!isEmergency)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                isEmergency
                  ? "bg-red-50 border-red-400 ring-2 ring-red-100 shadow-sm"
                  : "bg-emerald-50/60 border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{isEmergency ? "🚨" : "🩺"}</span>
                <div>
                  <h4 className={`text-xs font-bold ${isEmergency ? "text-red-900" : "text-emerald-900"}`}>
                    {isEmergency ? "জরুরি সেবা সক্রিয় (High Priority Emergency Visit)" : "নরমাল ভিজিট বুকিং"}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {isEmergency
                      ? "আমাদের জরুরি দল তাৎক্ষণিক অন-সাইট চিকিৎসায় সর্বোচ্চ অগ্রাধিকার দেবে।"
                      : "জরুরিভাবে গাছ বাঁচানোর প্রয়োজন হলে ক্লিক করে ইমার্জেন্সি মোড অন করুন।"}
                  </p>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                isEmergency ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {isEmergency ? "✓" : "+"}
              </div>
            </div>

            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">বুকিং সফল হয়েছে!</h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  ধন্যবাদ! আমাদের সিনিয়র ট্রি ডক্টর টিম আপনার দেওয়া নম্বরে <strong>({phone})</strong> ফোন করে ভিজিটের সময়সূচি চূড়ান্ত করবে।
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <a
                    href="tel:01620692449"
                    className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow"
                  >
                    📞 জরুরি হলে সরাসরি কল করুন
                  </a>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium"
                  >
                    নতুন বুকিং
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. তানভীর আহমেদ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">আক্রান্ত গাছের নাম / প্রজাতি *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: আম গাছ, ফিকাস, পাম, বনসাই"
                      value={treeName}
                      onChange={(e) => setTreeName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">লোকেশন (এলাকা/ঠিকানা) *</label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: রোড ৯/এ, ধানমন্ডি, ঢাকা"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl text-xs focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider">সমস্যার বিবরণ (লক্ষণ) *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="পাতায় কালো বা সাদা দাগ, কান্ড শুকিয়ে যাওয়া, শিকড় পচা বা পোকার আক্রমণ সম্পর্কে লিখুন..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3.5 rounded-xl text-xs focus:border-emerald-600 focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">পছন্দের ভিজিট টাইম</label>
                    <select
                      value={preferredVisitTime}
                      onChange={(e) => setPreferredVisitTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl text-xs focus:border-emerald-600 focus:outline-none cursor-pointer"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">সকাল (১০:০০ AM - ১:০০ PM)</option>
                      <option value="Afternoon (2:00 PM - 5:00 PM)">বিকাল (২:০০ PM - ৫:০০ PM)</option>
                      <option value="Weekend (Friday/Saturday)">ছুটির দিন (শুক্রবার / শনিবার)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">গাছের ছবি আপলোড (যদি থাকে)</label>
                    <div className="border border-dashed border-gray-300 rounded-xl p-2.5 bg-gray-50 flex items-center justify-between">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-xs text-gray-500"
                      />
                      {photoPreview && <span className="text-emerald-700 font-bold">✓ ছবি সংযুক্ত</span>}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "বুকিং প্রসেস হচ্ছে..." : "🩺 ট্রি ডক্টর ভিজিট বুক করুন"}
                </button>
              </form>
            )}
          </div>

          {/* Right Info Card */}
          <div className="lg:col-span-5 bg-emerald-50/60 p-7 sm:p-9 rounded-3xl border border-emerald-100 space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">বিশেষজ্ঞ পরামর্শ</span>
              <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">
                কেন ট্রি ডক্টর প্রয়োজন?
              </h3>
            </div>

            <ul className="space-y-3.5 text-xs text-gray-700 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-700 font-bold text-base">✓</span>
                <span><strong>মূল্যবান গাছ রক্ষা:</strong> ছাদবাগান বা ল্যান্ডস্কেপের দুর্লভ লাখ টাকার গাছ অকালে মারা যাওয়ার হাত থেকে রক্ষা করে।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-700 font-bold text-base">✓</span>
                <span><strong>রোগ বিস্তার রোধ:</strong> একটি আক্রান্ত গাছ থেকে পুরো বাগানে ছত্রাক বা পোকা ছড়িয়ে পড়া বন্ধ করে।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-700 font-bold text-base">✓</span>
                <span><strong>সঠিক বালাইনাশক নির্বাচন:</strong> সাধারণ রাসায়নিক ব্যবহারের পরিবর্তে বিজ্ঞানসম্মত প্রেসক্রিপশন প্রদান।</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-700 font-bold text-base">✓</span>
                <span><strong>ডিজিটাল মেডিকেল হিস্ট্রি:</strong> প্রতিটি গাছের জন্য ডিজিটাল হেলথ রেকর্ড সংরক্ষণ করা হয়।</span>
              </li>
            </ul>

            {/* Quick Hotline */}
            <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm space-y-3">
              <span className="text-[11px] font-bold text-emerald-800 uppercase block">জরুরি হটলাইন সেবা</span>
              <p className="text-xs text-gray-600">গাছের তাৎক্ষণিক জটিলতায় সরাসরি কথা বলুন আমাদের এগ্রোনমিস্টের সাথে:</p>
              <a
                href="tel:01620692449"
                className="block text-center py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                📞 কল করুন: 01620692449
              </a>
            </div>
          </div>

        </div>

        {/* Plant Health Record System Section (Requirement #7) */}
        <div className="space-y-8 pt-8 border-t border-gray-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold tracking-widest text-emerald-800 uppercase bg-emerald-100 px-3.5 py-1 rounded-full">
              ডিজিটাল মেডিকেল হিস্ট্রি • Plant Health Record
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              গুরুত্বপূর্ণ গাছের হেলথ রেকর্ড সিস্টেম
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              ভবিষ্যতে যেকোনো সমস্যা হলে পূর্বের ইতিহাস, সার, কাটাই-ছাঁটাই ও ট্রিটমেন্ট হিস্ট্রি এক ক্লিকে দেখার সুবিধা।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {samplePlantRecords.map((rec, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden border border-emerald-100 shadow-sm space-y-4 p-6 sm:p-7"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-emerald-100">
                    <img src={rec.photo} alt={rec.plantName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                      Plant Record
                    </span>
                    <h4 className="font-bold text-base font-serif text-gray-900 mt-1">{rec.plantName}</h4>
                    <p className="text-xs text-gray-500">📍 {rec.location}</p>
                    <p className="text-[11px] text-gray-400">রোপণের তারিখ: {rec.plantingDate}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-100">
                  <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100/60">
                    <span className="text-red-700 font-bold block">পূর্বের রোগ (Disease):</span>
                    <p className="text-gray-700 mt-0.5">{rec.diseaseHistory}</p>
                  </div>
                  <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
                    <span className="text-emerald-800 font-bold block">ট্রিটমেন্ট (Treatment):</span>
                    <p className="text-gray-700 mt-0.5">{rec.treatment}</p>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-600 font-bold block">সার প্রয়োগ (Fertilizer):</span>
                    <p className="text-gray-700 mt-0.5">{rec.fertilizer}</p>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-600 font-bold block">কাটাই-ছাঁটাই (Pruning):</span>
                    <p className="text-gray-700 mt-0.5">{rec.pruning}</p>
                  </div>
                </div>

                <div className="bg-emerald-950 text-emerald-100 p-4 rounded-2xl text-xs space-y-1">
                  <div className="flex justify-between items-center text-emerald-300 font-semibold text-[11px]">
                    <span>ট্রি ডক্টর রিপোর্ট (Doctor Report):</span>
                    <span>পরবর্তী মেইনটেন্যান্স: {rec.nextMaintenance}</span>
                  </div>
                  <p className="text-white/90 leading-relaxed italic">
                    "{rec.doctorReport}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
