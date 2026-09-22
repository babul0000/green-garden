"use client";

import React, { useState } from "react";
import Link from "next/link";

interface AIConsultationAnalysis {
  recommendedGardenType: string;
  recommendedPlants: string[];
  layoutZoning: {
    lawn: string;
    flowerBed: string;
    seating: string;
  };
  verticalGardenNeed: string;
  irrigationRecommendation: string;
  estimatedBudgetEstimate: string;
}

export default function AIToolsPage() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [spaceType, setSpaceType] = useState("Rooftop");
  const [sunlightHours, setSunlightHours] = useState("Direct Sunlight (5-6 hours)");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIConsultationAnalysis | null>(null);

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

  const handleRunAIConsultant = () => {
    setIsAnalyzing(true);

    // AI Space & Plant Intelligence Simulation
    setTimeout(() => {
      let gardenType = "Modern Rooftop Penthouse Sanctuary";
      let plants = ["Ficus Lyrata (Fiddle Leaf)", "Areca Palm", "Bougainvillea Bonsai", "Japanese Boxwood", "Jasmine (Beli)"];
      let vertical = "দেয়ালে সরাসরি অতিরিক্ত রোদ থাকলে ১টি ৮x১০ ফুটের ভার্টিক্যাল গ্রিন ওয়াল তাপমাত্রা ২-৩ ডিগ্রি কমাতে সাহায্য করবে।";
      let irrigation = "অটোমেটিক মাইক্রো-ড্রিপ ইরিগেশন (ডিজিটাল টাইমার নিয়ন্ত্রিত)। প্রতিদিন সকাল ৭:০০ টায় স্বয়ংক্রিয় সেচ।";
      let lawn = "ছাদের মধ্যবর্তী অংশে ৪০০ বর্গফুটের হালকা পলিমার বেসে জাপানিজ গ্রাস লন কার্পেট।";
      let flowerBed = "পশ্চিম ও উত্তর রেলিং ঘেঁষে সুগন্ধি বেলি, কামিনী ও গন্ধরাজ ফুলের বেড।";
      let seating = "ছাদের পূর্ব কোণে একটি আধুনিক উডেন পারগোলা ও ৪-সিটের ওয়েদারপ্রুফ বেঞ্চ।";

      if (spaceType === "Balcony") {
        gardenType = "Compact Urban Balcony Garden";
        plants = ["Snake Plant", "Monstera Deliciosa", "Peace Lily", "Hanging Petunia"];
        vertical = "ব্যালকনির সাইড ওয়ালে স্লিম ৩-টায়ার মডুলার পকেট গ্রিন ওয়াল অত্যন্ত কার্যকরী হবে।";
        irrigation = "স্মার্ট সেলফ-ওয়াটারিং স্পাইক ও মাইক্রো মিস্টার।";
        lawn = "ব্যালকনি ফ্লোরে অ্যান্টি-স্লিপ গ্রিন সিন্থেটিক বা জাপানিজ টার্ফ।";
        flowerBed = "রেলিং বক্স প্ল্যান্টারে মৌসুমি রঙিন ফুল।";
        seating = "একটি কমপ্যাক্ট কফি টেবিল ও ব্যালকনি কর্নার কুশন সিটিং।";
      } else if (spaceType === "Yard") {
        gardenType = "Lush Residential Villa Lawn & Orchard";
        plants = ["Thai Mango", "Mexican Grass Carpet", "Golden Shower", "Royal Palm"];
        vertical = "বাউন্ডারি ওয়ালে মেটালিক ট্রেলিসে বোগেনভিলিয়ার প্রাকৃতিক গ্রিন স্ক্রিন।";
        irrigation = "৩৬০° পপ-আপ রোটারি স্প্রিংকলার সিস্টেম।";
        lawn = "উঠানের কেন্দ্রস্থলে সুবিশাল মসৃণ বারমুডা গ্রাস লন।";
        flowerBed = "সীমানা প্রাচীর বরাবর বহুবর্ষজীবী ফুলের বর্ডার বেড।";
        seating = "লনের পাশে গ্যাজেবো বা ছাতাযুক্ত আউটডোর ডাইনিং।";
      }

      setAnalysisResult({
        recommendedGardenType: gardenType,
        recommendedPlants: plants,
        layoutZoning: {
          lawn,
          flowerBed,
          seating,
        },
        verticalGardenNeed: vertical,
        irrigationRecommendation: irrigation,
        estimatedBudgetEstimate: "৳৮০,০০০ - ৳১,৮০,০০০",
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>🤖</span> AI Garden Consultant • কৃত্রিম বুদ্ধিমত্তা চালিত পরামর্শক
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
            AI ল্যান্ডস্কেপ ও গার্ডেন <br />
            <span className="text-emerald-700 italic font-medium">স্মার্ট অ্যানালাইজার</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            আপনার ছাদ, বারান্দা বা উঠানের একটি ছবি আপলোড করুন। আমাদের এআই ইঞ্জিন বিশ্লেষণ করে জানিয়ে দেবে কোন ধরনের বাগান, গাছ ও সেচ ব্যবস্থা আপনার জন্য সেরা।
          </p>
        </div>

        {/* Upload & Input Section */}
        <div className="bg-white p-6 sm:p-8 rounded-[32px] border border-emerald-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Photo Upload Card */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                ১. আপনার সাইট/জায়গার ছবি আপলোড করুন *
              </label>
              <div className="border-2 border-dashed border-emerald-300/80 rounded-2xl p-6 text-center bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors">
                {photoPreview ? (
                  <div className="space-y-3">
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow">
                      <img src={photoPreview} alt="Site" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={() => setPhotoPreview(null)}
                      className="text-xs text-red-600 hover:underline cursor-pointer"
                    >
                      ছবি পরিবর্তন করুন
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center gap-2 py-4">
                    <span className="text-4xl">📷</span>
                    <span className="text-xs font-bold text-emerald-800">ছবির ফাইল সিলেক্ট করুন</span>
                    <span className="text-[11px] text-gray-400">ছাদ, বারান্দা বা আঙিনার যেকোনো ছবি</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            {/* Space Details */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  ২. জায়গার ধরন (Space Type)
                </label>
                <select
                  value={spaceType}
                  onChange={(e) => setSpaceType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 py-3 px-3.5 rounded-xl text-xs focus:border-emerald-600 focus:outline-none cursor-pointer"
                >
                  <option value="Rooftop">Rooftop Garden (ছাদবাগান)</option>
                  <option value="Balcony">Balcony / Terrace (বারান্দা)</option>
                  <option value="Yard">Yard / Lawn (বাড়ির উঠান বা আঙিনা)</option>
                  <option value="Office">Indoor / Office (অফিস বা লিভিং রুম)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  ৩. সূর্যরশ্মির উপস্থিতি (Sunlight Exposure)
                </label>
                <select
                  value={sunlightHours}
                  onChange={(e) => setSunlightHours(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-800 py-3 px-3.5 rounded-xl text-xs focus:border-emerald-600 focus:outline-none cursor-pointer"
                >
                  <option value="Direct Sunlight (5-6 hours)">প্রচুর সরাসরি রোদ (৫-৬ ঘণ্টা বা বেশি)</option>
                  <option value="Partial Sunlight (2-4 hours)">আংশিক রোদ ও ছায়া (২-৪ ঘণ্টা)</option>
                  <option value="Shady / Indirect Light">সম্পূর্ণ ছায়াযুক্ত বা পরোক্ষ আলো</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  disabled={isAnalyzing}
                  onClick={handleRunAIConsultant}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      <span>AI বিশ্লেষণ চলছে...</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span> এআই গার্ডেন বিশ্লেষণ শুরু করুন
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* AI Analysis Result Display */}
        {analysisResult && (
          <div className="bg-emerald-950 text-white p-7 sm:p-10 rounded-[36px] shadow-2xl space-y-8 animate-fade-in-up border border-emerald-700/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">
                  AI CONSULTANT REPORT
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-1">
                  {analysisResult.recommendedGardenType}
                </h3>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-emerald-800 text-emerald-200 text-xs font-semibold">
                বাজেট অনুমান: {analysisResult.estimatedBudgetEstimate}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
              {/* Recommended Plants */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span>🌿</span> কোন ধরনের Plant ব্যবহার করা যেতে পারে:
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.recommendedPlants.map((p, idx) => (
                    <span key={idx} className="bg-emerald-900/80 text-emerald-200 px-3 py-1 rounded-lg border border-emerald-600/40">
                      ✓ {p}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-emerald-200/70 pt-1">
                  রোদ ও আবহাওয়া বিবেচনা করে এআই এই গাছগুলোকে সর্বোচ্চ টেকসই হিসেবে সুপারিশ করেছে।
                </p>
              </div>

              {/* Layout Zoning */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span>📐</span> লেআউট জোন বিন্যাস (Lawn, Bed, Seating):
                </div>
                <ul className="space-y-2 text-emerald-100">
                  <li><strong>• লন (Lawn):</strong> {analysisResult.layoutZoning.lawn}</li>
                  <li><strong>• ফুলের বেড (Flower Bed):</strong> {analysisResult.layoutZoning.flowerBed}</li>
                  <li><strong>• সিটিং (Seating):</strong> {analysisResult.layoutZoning.seating}</li>
                </ul>
              </div>

              {/* Vertical Garden Need */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span>🍃</span> Vertical Garden প্রয়োজন কি না:
                </div>
                <p className="text-emerald-100">
                  {analysisResult.verticalGardenNeed}
                </p>
              </div>

              {/* Irrigation Recommendation */}
              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span>💧</span> সেচ ব্যবস্থা (Irrigation Recommendation):
                </div>
                <p className="text-emerald-100">
                  {analysisResult.irrigationRecommendation}
                </p>
              </div>
            </div>

            {/* Hand-off to Professional Consultation */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-base text-white font-serif">বাস্তবায়ন করতে চান?</h4>
                <p className="text-xs text-emerald-200/80">
                  এ আর গ্রিন গার্ডেনের মূল আর্কিটেক্টের সাথে সরাসরি অন-সাইট পরামর্শ বুক করুন।
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Link
                  href="/contact"
                  className="flex-1 sm:flex-none text-center px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-300 text-emerald-950 font-bold text-xs rounded-xl shadow hover:scale-105 transition-all"
                >
                  Book Professional Consultation →
                </Link>
                <a
                  href="tel:01620692449"
                  className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-all"
                >
                  📞 01620692449
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
