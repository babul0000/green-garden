"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { DEFAULT_TREE_DOCTOR_CONFIG, TreeDoctorConfig } from "@/types/cms";

interface PublicPlantRecord {
  id?: string;
  plantName: string;
  photoUrl?: string | null;
  photo?: string;
  plantingDate?: string | null;
  location?: string | null;
  diseaseHistory?: string | null;
  treatment?: string | null;
  fertilizer?: string | null;
  pruning?: string | null;
  nextMaintenanceDate?: string | null;
  doctorReport?: string | null;
}

const SAMPLE_PLANT_RECORDS: PublicPlantRecord[] = [
  {
    plantName: "Ficus Benjamina (Golden Weeping Fig)",
    photoUrl: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&q=80",
    plantingDate: "15 March 2025",
    location: "Penthouse North Terrace, Dhanmondi",
    diseaseHistory: "White Mealybug & Leaf Yellowing (মিলিবাগের আক্রমণ)",
    treatment: "Neem Oil 5ml/L + Imidacloprid systematic spray; Root aeration applied.",
    fertilizer: "Slow-release NPK (19:19:19) + Organic Vermicompost 500g",
    pruning: "Canopy structural pruning conducted",
    nextMaintenanceDate: "Upcoming Monthly Audit",
    doctorReport: "গাছের নতুন কচি পাতা গজিয়েছে এবং কোনো পোকার উপস্থিতি নেই। গাছ বর্তমানে ১০০% সুস্থ।",
  },
  {
    plantName: "Thai Amrapali Mango (Bonsai Container)",
    photoUrl: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80",
    plantingDate: "10 November 2024",
    location: "Rooftop Orchard, Gulshan-2",
    diseaseHistory: "Anthracnose Fungal Leaf Spot (পাতায় কালো দাগ)",
    treatment: "Carbendazim + Mancozeb antifungal spray twice at 10-day intervals.",
    fertilizer: "Bone Meal + Mustard Oil Cake organic feeding",
    pruning: "Dead branch tip pruning completed",
    nextMaintenanceDate: "Pre-Flowering Checkup",
    doctorReport: "ছত্রাক সম্পূর্ণরূপে নিয়ন্ত্রণে। আগামী সিজনে প্রচুর মুকুল আসার অনুকূল অবস্থা রয়েছে।",
  },
];

export default function TreeDoctorPage() {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const { getSection, config, txt } = useSiteConfig();
  const bn = language === "bn";

  const tdCfg = getSection<TreeDoctorConfig>("tree_doctor_config", DEFAULT_TREE_DOCTOR_CONFIG);
  const hideStaticFallbacks = Boolean(config.homepage_sections?.hideStaticFallbacks);

  const [records, setRecords] = useState<PublicPlantRecord[]>(
    hideStaticFallbacks ? [] : SAMPLE_PLANT_RECORDS
  );

  // Booking form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [treeName, setTreeName] = useState("");
  const [problem, setProblem] = useState("");
  const [preferredVisitTime, setPreferredVisitTime] = useState("Morning (10:00 AM - 1:00 PM)");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) setName((p) => p || user.name || "");
  }, [user]);

  useEffect(() => {
    if (tdCfg.showShowcaseRecords === false) {
      setRecords([]);
      return;
    }
    fetch(`/api/plant-health?public=true&_t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecords(data);
        } else if (hideStaticFallbacks) {
          setRecords([]);
        }
      })
      .catch(() => {});
  }, [tdCfg.showShowcaseRecords, hideStaticFallbacks]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      let cloudinaryPhotoUrl = "";
      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (upRes.ok) {
          const upData = await upRes.json();
          cloudinaryPhotoUrl = upData.url || upData.secure_url || "";
        }
      }

      const res = await fetch("/api/tree-doctor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: name.trim(),
          clientPhone: phone.trim(),
          location: location.trim(),
          treeName: treeName.trim(),
          problem: problem.trim(),
          preferredVisitTime,
          treePhotoUrl: cloudinaryPhotoUrl || null,
          isEmergency: Boolean(isEmergency),
          userId: user?.id,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setIsSuccess(true);
      } else {
        setErrorMsg(data.error || t("বুকিং সম্পন্ন করা যায়নি।", "Could not submit booking."));
      }
    } catch {
      setErrorMsg(t("নেটওয়ার্ক ত্রুটি, অনুগ্রহ করে কল করুন।", "Network error. Please call us."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hotlineDial = (tdCfg.hotline || config.site_config.phone || "01883012641").replace(
    /[^0-9+]/g,
    ""
  );

  return (
    <div className="bg-gradient-to-b from-emerald-50/40 via-white to-white min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <span>🩺</span> {bn ? tdCfg.badgeBn : tdCfg.badgeEn}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
            {bn ? tdCfg.titleBn : tdCfg.titleEn}
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            {bn ? tdCfg.subtitleBn : tdCfg.subtitleEn}
          </p>

          {/* Dynamic Hotline & Visit Fee Strip */}
          <div className="flex flex-wrap justify-center gap-3 pt-2 text-xs font-semibold">
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-900">
              💳 {bn ? tdCfg.visitFeeBn : tdCfg.visitFeeEn}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-900">
              ⚡ {bn ? tdCfg.responseTimeBn : tdCfg.responseTimeEn}
            </span>
            <a
              href={`tel:${hotlineDial}`}
              className="px-3.5 py-1.5 rounded-full bg-emerald-800 text-white hover:bg-emerald-900"
            >
              📞 {tdCfg.hotline}
            </a>
          </div>
        </div>

        {/* Booking Form + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-3xl border border-emerald-100 shadow-sm space-y-6">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {t("অন-সাইট ট্রি ক্লিনিক", "Book a Tree Doctor Visit")}
              </span>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mt-1">
                {t("ট্রি ডক্টর ভিজিট বুকিং ফর্ম", "Tree Doctor Visit Booking Form")}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {bn ? tdCfg.emergencyNoteBn : tdCfg.emergencyNoteEn}
              </p>
            </div>

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
                    {isEmergency
                      ? t("ইমার্জেন্সি সার্ভিস চালু (অগ্রাধিকার ভিজিট)", "Emergency Service Active (High Priority)")
                      : t("স্ট্যান্ডার্ড ভিজিট বুকিং", "Standard Visit Booking")}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    {isEmergency
                      ? t("তাৎক্ষণিক অন-সাইট চিকিৎসায় সর্বোচ্চ অগ্রাধিকার দেওয়া হবে।", "Our urgent team prioritizes dying/pest-stricken plants.")
                      : t("জরুরি গাছ বাঁচাতে ক্লিক করে ইমার্জেন্সি মোড অন করুন।", "Tap to activate priority emergency rescue mode.")}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                  isEmergency ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {isEmergency ? "✓" : "+"}
              </div>
            </div>

            {isSuccess ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto">
                  ✓
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">
                  {t("বুকিং আবেদন সফলভাবে গৃহীত হয়েছে!", "Booking Request Successful!")}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  {t(
                    `ধন্যবাদ! আমাদের সিনিয়র ট্রি ডক্টর টিম (${phone}) নম্বরে কল করে ভিজিট কনফার্ম করবে।`,
                    `Thank you! Our senior arborist will call (${phone}) shortly to confirm the visit.`
                  )}
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <a
                    href={`tel:${hotlineDial}`}
                    className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow"
                  >
                    📞 {txt("common.callNow", "সরাসরি কল করুন", "Call Studio")}
                  </a>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium cursor-pointer"
                  >
                    {t("নতুন বুকিং", "New Booking")}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <p className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                    {errorMsg}
                  </p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">
                      {t("আপনার নাম *", "Your Name *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. তানভীর আহমেদ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">
                      {t("মোবাইল নম্বর *", "Phone Number *")}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">
                      {t("আক্রান্ত গাছের নাম *", "Plant / Tree Species *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: আম গাছ, ফিকাস, বনসাই"
                      value={treeName}
                      onChange={(e) => setTreeName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">
                      {t("লোকেশন (এলাকা) *", "Location / Area *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: রোড ৯/এ, ধানমন্ডি, ঢাকা"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 uppercase">
                    {t("সমস্যার বিবরণ (লক্ষণ) *", "Symptoms & Problem *")}
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t(
                      "পাতায় কালো/সাদা দাগ, কান্ড শুকিয়ে যাওয়া বা পোকার আক্রমণ সম্পর্কে লিখুন...",
                      "Describe spots, wilting, fungus, or pest signs..."
                    )}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 py-2.5 px-3.5 rounded-xl focus:border-emerald-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">
                      {t("পছন্দের ভিজিট সময়", "Preferred Visit Window")}
                    </label>
                    <select
                      value={preferredVisitTime}
                      onChange={(e) => setPreferredVisitTime(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 py-3 px-3.5 rounded-xl focus:border-emerald-600 focus:outline-none cursor-pointer"
                    >
                      <option value="Morning (10:00 AM - 1:00 PM)">সকাল (১০:০০ AM - ১:০০ PM)</option>
                      <option value="Afternoon (2:00 PM - 5:00 PM)">বিকাল (২:০০ PM - ৫:০০ PM)</option>
                      <option value="Weekend (Friday/Saturday)">ছুটির দিন (শুক্রবার / শনিবার)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 uppercase">
                      {t("গাছের ছবি আপলোড (ঐচ্ছিক)", "Upload Photo (Optional)")}
                    </label>
                    <div className="border border-dashed border-gray-300 rounded-xl p-2.5 bg-gray-50 flex items-center justify-between">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="text-xs text-gray-500 max-w-full"
                      />
                      {photoPreview && (
                        <span className="text-emerald-700 font-bold shrink-0">✓ সংযুক্ত</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? t("বুকিং প্রসেস হচ্ছে...", "Processing...")
                    : txt("treeDoc.submitBtn", "জরুরি পরামর্শ পাঠান", "Dispatch Tree Doctor Request")}
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-emerald-50/70 p-7 sm:p-9 rounded-3xl border border-emerald-100 space-y-5">
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
                {t("বিশেষজ্ঞ এগ্রোনমিস্ট সহায়তা", "Expert Arborist Consultation")}
              </span>
              <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">
                {t("কেন ট্রি ডক্টর সেবা নেবেন?", "Why Choose Tree Doctor Service?")}
              </h3>
            </div>
            <ul className="space-y-3 text-xs text-gray-700 leading-relaxed">
              <li className="flex gap-2.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>
                  {t(
                    "দুর্লভ ও মূল্যবান বনসাই বা ফলের গাছ অকালে মারা যাওয়ার হাত থেকে রক্ষা করে।",
                    "Rescues rare bonsai, rooftop fruit trees, and architectural palms from root rot."
                  )}
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>
                  {t(
                    "একটি আক্রান্ত গাছ থেকে পুরো ছাদবাগানে ছত্রাক বা মিলিবাগ ছড়িয়ে পড়া রোধ করে।",
                    "Prevents infectious pests and fungus from spreading across your entire estate."
                  )}
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>
                  {t(
                    "বিজ্ঞানসম্মত অরগানিক ও নিরাপদ প্রেসক্রিপশন ও সার ব্যবস্থাপনা প্রদান।",
                    "Scientific organic & targeted bio-prescriptions rather than harsh guesswork."
                  )}
                </span>
              </li>
            </ul>
            <a
              href={`https://wa.me/${(tdCfg.whatsapp || tdCfg.hotline || "").replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center py-3 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors"
            >
              💬 {t("হোয়াটসঅ্যাপে ছবি পাঠান", "Send Plant Photo on WhatsApp")}
            </a>
          </div>
        </div>

        {/* Live Public Plant Health Records */}
        {tdCfg.showShowcaseRecords !== false && records.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                {t("লাইভ ক্লিনিক্যাল কেস স্টাডি", "Clinical Treatment Archive")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1">
                {t("সাম্প্রতিক সুস্থ হয়ে ওঠা বৃক্ষের নথি", "Verified Plant Health Records")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {records.map((rec, i) => (
                <div
                  key={rec.id || i}
                  className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-xs flex flex-col sm:flex-row"
                >
                  <div className="sm:w-44 h-48 sm:h-auto bg-emerald-50 shrink-0">
                    <img
                      src={
                        rec.photoUrl ||
                        rec.photo ||
                        "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&q=80"
                      }
                      alt={rec.plantName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 space-y-2 text-xs">
                    <h4 className="font-bold text-base text-gray-900 font-serif">{rec.plantName}</h4>
                    {rec.location && (
                      <p className="text-stone-500">📍 {rec.location}</p>
                    )}
                    {rec.diseaseHistory && (
                      <p className="text-rose-700 font-semibold">🩺 {rec.diseaseHistory}</p>
                    )}
                    {rec.treatment && (
                      <p className="text-stone-600">
                        <strong>Tx:</strong> {rec.treatment}
                      </p>
                    )}
                    {rec.doctorReport && (
                      <p className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 italic">
                        "{rec.doctorReport}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
