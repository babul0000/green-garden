"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function EmergencyTreeDoctorModal() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [clientName, setClientName] = useState(user?.name || "");
  const [clientPhone, setClientPhone] = useState(user?.phone || "");
  const [treeName, setTreeName] = useState("");
  const [location, setLocation] = useState("");
  const [problem, setProblem] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) setPhotoUrl(data.url);
        }
      } catch (err) {
        console.error("Photo upload error:", err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !problem || !treeName) {
      alert(t("অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন।", "Please fill in all required fields."));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientPhone,
          serviceCategory: "Tree Doctor",
          projectScope: `EMERGENCY TREE CARE - Tree: ${treeName}, Area: ${location}`,
          preferredVisitTime: "EMERGENCY DOCTOR VISIT",
          siteAddress: location || "Emergency Request",
          notes: `EMERGENCY TREE DOCTOR REQUEST:
Tree/Plant: ${treeName}
Symptoms: ${problem}
Photo: ${photoUrl || "No photo attached"}`,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert(t("রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে। সরাসরি হটলাইনে কল করুন।", "Request failed. Please call our direct hotline."));
      }
    } catch {
      alert(t("সার্ভার ত্রুটি। অনুগ্রহ করে হটলাইনে কল করুন।", "Server error. Please call our direct hotline."));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setIsSubmitted(false);
    };
    window.addEventListener("open-tree-doctor", handleOpen);
    return () => window.removeEventListener("open-tree-doctor", handleOpen);
  }, []);

  return (
    <>
      {/* Floating trigger is managed in MobileQuickContact */}

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
                <span>🚨</span> {t("Emergency Tree Care", "Emergency Tree Care")}
              </div>
              <h3 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                {t("On-Call Tree Doctor Clinic", "On-Call Tree Doctor Clinic")}
              </h3>
              <p className="text-xs text-gray-600">
                {t(
                  "গাছের আকস্মিক ঢলে পড়া, পাতা শুকানো বা মারাত্মক পোকার আক্রমণে দ্রুত বিশেষজ্ঞ ডাক্তার ভিজিট রিকোয়েস্ট পাঠান।",
                  "Request an urgent on-site visit for critically sick, wilting, or pest-damaged trees."
                )}
              </p>
            </div>

            {/* Direct Instant Hotline Strip */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-red-700 font-bold uppercase block">
                  {t("Instant Direct Helpline:", "Instant Direct Helpline:")}
                </span>
                <a href="tel:01883012641" className="text-red-700 font-extrabold text-lg hover:underline font-mono">
                  01883012641
                </a>
              </div>
              <a
                href="https://wa.me/8801883012641?text=EMERGENCY:%20My%20tree%20is%20critically%20sick.%20Please%20help."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-[#25D366] text-stone-950 font-bold text-xs rounded-xl shadow-sm hover:bg-[#20bd5a] flex items-center gap-1.5"
              >
                <span>💬</span> WhatsApp
              </a>
            </div>

            {/* AI Plant Doctor Instant Assistant Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    {t("ফ্রি স্মার্ট এআই ডক্টর চ্যাট", "Free Smart AI Plant Doctor")}
                  </h4>
                  <p className="text-[10px] text-emerald-700">
                    {t("ছবি দিয়ে তাৎক্ষণিক রোগ নির্ণয় ও প্রেসক্রিপশন পান", "Diagnose tree diseases with photo instantly")}
                  </p>
                </div>
              </div>
              <Link
                href="/ai-tools"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-xl shadow-xs transition-all whitespace-nowrap"
              >
                {t("এআই চ্যাট →", "AI Chat →")}
              </Link>
            </div>

            {isSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <h4 className="text-xl font-bold font-serif text-gray-900">
                  {t("Booking Confirmed Successfully!", "Booking Confirmed Successfully!")}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed max-w-sm mx-auto">
                  {t(
                    `আমাদের অন-কল ট্রি ডক্টর টিম আপনার নম্বরে (${clientPhone}) দ্রুততম সময়ে যোগাযোগ করবেন।`,
                    `Our emergency arborist team will call your number (${clientPhone}) shortly.`
                  )}
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  {t("বন্ধ করুন", "Close")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">
                      {t("আপনার নাম *", "Your Name *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("e.g. তানভীর আহমেদ", "e.g. Tanvir Ahmed")}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">
                      {t("মোবাইল নম্বর *", "Phone Number *")}
                    </label>
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
                    <label className="font-bold text-gray-700 uppercase tracking-wider">
                      {t("গাছের প্রজাতি *", "Tree / Plant Species *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("e.g. আম গাছ, বনসাই, পাম", "e.g. Mango Tree, Bonsai, Palm")}
                      value={treeName}
                      onChange={(e) => setTreeName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase tracking-wider">
                      {t("লোকেশন (এলাকা) *", "Location (Area) *")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("ধানমন্ডি, গুলশান, বনানী ইত্যাদি", "Dhanmondi, Gulshan, Banani etc.")}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider">
                    {t("জরুরি সমস্যার লক্ষণ *", "Symptoms / Issue *")}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t(
                      "পাতা হঠাৎ শুকিয়ে যাচ্ছে, কান্ডে কালো দাগ, শিকড় পচন বা পোকার আক্রমণ...",
                      "Leaves wilting rapidly, dark trunk spots, root rot, or pest infestation..."
                    )}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3 rounded-xl focus:border-red-600 focus:outline-none resize-none"
                  ></textarea>
                </div>

                {/* Photo upload */}
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase tracking-wider">
                    {t("গাছের ছবি (যদি থাকে)", "Tree Photo (Optional)")}
                  </label>
                  <div className="border border-dashed border-gray-300 rounded-xl p-3 text-center bg-gray-50 flex items-center justify-between">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="text-xs text-gray-500"
                    />
                    {photoPreview && (
                      <span className="text-[10px] text-emerald-700 font-bold">
                        {t("✓ ছবি সংযুক্ত হয়েছে", "✓ Photo attached")}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t("রিকোয়েস্ট পাঠানো হচ্ছে...", "Sending Request...")}</span>
                  ) : (
                    <>
                      <span>🚨</span> {t("জরুরি ডাক্তার ভিজিট রিকোয়েস্ট পাঠান", "Send Emergency Visit Request")}
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
