"use client";

import React, { useState } from "react";

export default function EmergencyTreeDoctorModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [location, setLocation] = useState("");
  const [treeName, setTreeName] = useState("");
  const [problem, setProblem] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    if (!clientName || !clientPhone || !treeName || !problem) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/tree-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientPhone,
          location,
          treeName,
          problem,
          treePhotoUrl: photoPreview,
          preferredVisitTime: "🚨 EMERGENCY (জরুরি ভিত্তিতে)",
          isEmergency: true,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert("Failed to register emergency request. Please call hotline directly.");
      }
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Emergency Action Pill */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => {
            setIsOpen(true);
            setIsSubmitted(false);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-full shadow-2xl hover:shadow-red-600/50 transition-all duration-300 hover:scale-105 border-2 border-white/80 cursor-pointer animate-pulse"
        >
          <span className="text-base">🚨</span>
          <span>Emergency Tree Doctor</span>
          <span className="hidden sm:inline bg-red-800/80 px-2 py-0.5 rounded-full text-[10px] uppercase font-mono">
            জরুরি সেবা
          </span>
        </button>
      </div>

      {/* Emergency Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border-4 border-red-100">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            {/* Header */}
            <div className="text-left space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase">
                <span>🚨</span> ইমার্জেন্সি সার্ভিস • Urgent Tree Care
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                Emergency Tree Doctor
              </h3>
              <p className="text-xs text-gray-500">
                গাছের আকস্মিক ঢলে পড়া, পাতা শুকানো বা মারাত্মক পোকার আক্রমণে দ্রুত ভিজিট রিকোয়েস্ট পাঠান।
              </p>
            </div>

            {/* Direct Instant Hotline Strip */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-red-700 font-bold uppercase block">তাৎক্ষণিক সরাসরি কল করুন:</span>
                <a href="tel:01620692449" className="text-red-700 font-extrabold text-lg hover:underline font-mono">
                  01620692449
                </a>
              </div>
              <a
                href="https://wa.me/8801620692449?text=EMERGENCY:%20My%20tree%20is%20critically%20sick.%20Please%20help."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#25D366] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#20bd5a] flex items-center gap-1.5"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <h4 className="text-xl font-bold font-serif text-gray-900">জরুরি রিকোয়েস্ট সফল হয়েছে!</h4>
                <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                  আমাদের অন-কল ট্রি ডক্টর টিম আপনার নম্বরে <strong>({clientPhone})</strong> দ্রুততম সময়ে ফোন করবেন।
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold"
                >
                  বন্ধ করুন
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">আপনার নাম *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. তানভীর আহমেদ"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">মোবাইল নম্বর *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">গাছের নাম / প্রজাতি *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. আম গাছ / বনসাই / পাম"
                      value={treeName}
                      onChange={(e) => setTreeName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">লোকেশন (এলাকা)</label>
                    <input
                      type="text"
                      placeholder="ধানমন্ডি, গুলশান, ইত্যাদি"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider">জরুরি সমস্যার লক্ষণ *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="পাতা হঠাৎ শুকিয়ে যাচ্ছে, কান্ডে কালো দাগ, শিকড় পচন বা পোকার আক্রমণ..."
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Photo upload */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider">গাছের ছবি (যদি থাকে)</label>
                  <div className="border border-dashed border-gray-300 rounded-xl p-3 text-center bg-gray-50 flex items-center justify-between">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="text-xs text-gray-500"
                    />
                    {photoPreview && (
                      <span className="text-[10px] text-emerald-700 font-bold">✓ ছবি সংযুক্ত হয়েছে</span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>রিকোয়েস্ট পাঠানো হচ্ছে...</span>
                  ) : (
                    <>
                      <span>🚨</span> জরুরি ডাক্তার ভিজিট রিকোয়েস্ট পাঠান
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
