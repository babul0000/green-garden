"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function DesignYourGardenWizard() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [spaceType, setSpaceType] = useState("Rooftop");
  const [designStyle, setDesignStyle] = useState("Modern");
  const [features, setFeatures] = useState<string[]>(["Lawn", "Lighting", "Irrigation"]);
  const [sitePhotoPreview, setSitePhotoPreview] = useState<string | null>(null);
  const [approxArea, setApproxArea] = useState<number>(800);
  const [budgetRange, setBudgetRange] = useState("৳১,০০,০০০ - ৳২,৫০,০০০");
  const [clientName, setClientName] = useState(user?.name || "");
  const [clientPhone, setClientPhone] = useState(user?.phone || "");
  const [clientEmail, setClientEmail] = useState(user?.email || "");
  const [clientLocation, setClientLocation] = useState("ধানমন্ডি, ঢাকা");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");

  // Step 1 spaces
  const spaces = [
    {
      id: "Rooftop",
      labelBn: "ছাদবাগান",
      labelEn: "Rooftop Garden",
      icon: "🌇",
      descBn: "কংক্রিট ছাদের ওপর ওয়াটারপ্রুফ মেমব্রেন ও ড্রেনেজযুক্ত বাগান",
      descEn: "Waterproof membrane and specialized drainage on concrete slab",
    },
    {
      id: "Balcony",
      labelBn: "বারান্দা",
      labelEn: "Balcony",
      icon: "🪴",
      descBn: "কমপ্যাক্ট আধুনিক ব্যালকনি প্ল্যান্টার ও হ্যাঙ্গিং পট",
      descEn: "Compact modern balcony planters and hanging pots",
    },
    {
      id: "Yard",
      labelBn: "উঠান বা আঙিনা",
      labelEn: "Courtyard & Lawn",
      icon: "🏡",
      descBn: "বাড়ির আঙিনায় প্রাকৃতিক ঘাসের লন ও ওয়াকওয়ে",
      descEn: "Natural sod lawn and paved garden walkways for houses",
    },
    {
      id: "Office",
      labelBn: "করপোরেট অফিস",
      labelEn: "Corporate Office",
      icon: "🏢",
      descBn: "অফিসের অভ্যন্তরে বায়োফিলিক ডিজাইন ও ইনডোর প্ল্যান্ট",
      descEn: "Indoor biophilic architecture and air-purifying foliage",
    },
    {
      id: "Resort",
      labelBn: "রিসোর্ট ও ফার্মহাউস",
      labelEn: "Resort & Farmhouse",
      icon: "🌴",
      descBn: "প্রাকৃতিক রিসোর্ট ও সুবিশাল ল্যান্ডস্কেপ জোন",
      descEn: "Expansive landscape masterplans for retreats and estates",
    },
    {
      id: "Restaurant",
      labelBn: "রুফটপ ক্যাফে ও রেস্তোরাঁ",
      labelEn: "Rooftop Café & Dining",
      icon: "☕",
      descBn: "গ্রাহকদের আকর্ষিত করার মতো ওপেন এয়ার ক্যাফে ল্যান্ডস্কেপ",
      descEn: "Open-air restaurant dining surrounded by curated nature",
    },
  ];

  // Step 2 design styles
  const styles = [
    {
      id: "Luxury",
      labelBn: "বিলাসবহুল ও প্রিমিয়াম",
      labelEn: "Luxury & Premium",
      icon: "👑",
      descBn: "আমদানিকৃত দুর্লভ গাছ, মার্বেল ফাউন্টেন ও আর্কিটেকচারাল পারগোলা",
      descEn: "Exotic specimen trees, architectural pergolas, and stone fountains",
    },
    {
      id: "Modern",
      labelBn: "আধুনিক ও মিনিমাল",
      labelEn: "Modern Minimalist",
      icon: "📐",
      descBn: "পরিচ্ছন্ন জ্যামিতিক নকশা, স্মার্ট লাইটিং ও সহজ পরিচর্যা",
      descEn: "Clean geometric layouts, ambient LED illumination, low maintenance",
    },
    {
      id: "Natural",
      labelBn: "প্রাকৃতিক ও ট্রপিক্যাল",
      labelEn: "Tropical Natural",
      icon: "🌿",
      descBn: "ঘন সবুজ ট্রপিক্যাল অরণ্য ভাব ও দেশীয় ফুলের সমাহার",
      descEn: "Lush endemic green foliage and fragrant flowering species",
    },
    {
      id: "Standard",
      labelBn: "স্ট্যান্ডার্ড ও বাজেট-বান্ধব",
      labelEn: "Standard Budget-Friendly",
      icon: "🎯",
      descBn: "বাজেট-বান্ধব অথচ দীর্ঘস্থায়ী নান্দনিক গাছের সমাহার",
      descEn: "Resilient, high-value, durable garden setups within budget",
    },
  ];

  // Step 3 features
  const featureList = [
    { id: "Lawn", labelBn: "ঘাসের লন", labelEn: "Natural Lawn", icon: "🌱" },
    { id: "Flower Bed", labelBn: "ফুলের বেড", labelEn: "Flower Bed", icon: "🌸" },
    { id: "Vertical Garden", labelBn: "দেয়ালবাগান", labelEn: "Living Vertical Wall", icon: "🍃" },
    { id: "Seating", labelBn: "বসার জায়গা", labelEn: "Outdoor Seating", icon: "🪑" },
    { id: "Pergola", labelBn: "কাঠের পারগোলা", labelEn: "Wooden Pergola", icon: "🪵" },
    { id: "Fountain", labelBn: "ফোয়ারা বা ঝর্ণা", labelEn: "Water Fountain", icon: "⛲" },
    { id: "Lighting", labelBn: "গার্ডেন লাইটিং", labelEn: "Garden Mood Lighting", icon: "💡" },
    { id: "Irrigation", labelBn: "অটো ড্রিপ সেচ", labelEn: "Smart Drip Irrigation", icon: "💧" },
  ];

  // Step 6 budget ranges
  const budgetOptionsBn = [
    "৳৫০,০০০ - ৳১,০০,০০০ (ছোট ব্যালকনি / স্ট্যান্ডার্ড)",
    "৳১,০০,০০০ - ৳২,৫০,০০০ (মাঝারি ছাদবাগান)",
    "৳২,৫০,০০০ - ৳৫,০০,০০০ (প্রিমিয়াম ল্যান্ডস্কেপ ও পারগোলা)",
    "৳৫,০০,০০০+ (লাক্সারি ফুল-স্কেল মাস্টারপিস)",
  ];

  const budgetOptionsEn = [
    "BDT 50,000 - 100,000 (Small Balcony / Standard)",
    "BDT 100,000 - 250,000 (Medium Rooftop)",
    "BDT 250,000 - 500,000 (Premium Landscape & Pergola)",
    "BDT 500,000+ (Full Luxury Masterpiece)",
  ];

  const budgetOptions = language === "bn" ? budgetOptionsBn : budgetOptionsEn;

  const toggleFeature = (fId: string) => {
    if (features.includes(fId)) {
      setFeatures(features.filter((f) => f !== fId));
    } else {
      setFeatures([...features, fId]);
    }
  };

  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSitePhotoPreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            setUploadedPhotoUrl(data.url);
          }
        }
      } catch (err) {
        console.error("Photo upload error:", err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!clientName || !clientPhone) {
      alert(t("অনুগ্রহ করে আপনার নাম ও মোবাইল নম্বর প্রদান করুন।", "Please provide your name and phone number."));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/design-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
          location: clientLocation,
          spaceType,
          designStyle,
          features,
          sitePhotoUrl: uploadedPhotoUrl || sitePhotoPreview || null,
          approxArea,
          budgetRange,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setReferenceCode(data.referenceCode || "ARG-2026");
        setIsSuccess(true);
      } else {
        alert(t("সাবমিশন ত্রুটি: ", "Submission error: ") + (data.error || t("অনুগ্রহ করে সঠিক তথ্য দিন।", "Please verify your input.")));
      }
    } catch (err: any) {
      alert(t("নেটওয়ার্ক ত্রুটি: ", "Network error: ") + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="design-wizard" className="py-20 px-4 sm:px-6 lg:px-8 bg-emerald-950 text-white relative overflow-hidden rounded-[40px] my-12 max-w-7xl mx-auto shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-900/70 border border-emerald-700/60 text-emerald-300 text-xs font-semibold">
            <span>🎨</span> {t("3D Garden Design Wizard", "3D Garden Design Wizard")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            {t("Design Your Dream Garden Step by Step", "Design Your Dream Garden Step by Step")}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200/80 max-w-xl mx-auto">
            {t(
              "আপনার জায়গা, স্টাইল ও পছন্দের ফিচার নির্বাচন করুন। আমাদের প্রধান ল্যান্ডস্কেপ আর্কিটেক্ট প্রস্তাবিত ডিজাইন ও কোটেশন তৈরি করবেন।",
              "Select your space, design aesthetics, and desired features to receive a custom landscape architectural plan."
            )}
          </p>
        </div>

        {/* Progress Bar (6 Steps) */}
        {!isSuccess && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-emerald-300 font-semibold">
              <span>{t(`ধাপ ${currentStep} / ৬`, `Step ${currentStep} of 6`)}</span>
              <span>
                {currentStep === 1 && t("জায়গা নির্বাচন", "Select Space")}
                {currentStep === 2 && t("ডিজাইন স্টাইল", "Design Style")}
                {currentStep === 3 && t("ফিচারসমূহ", "Key Features")}
                {currentStep === 4 && t("সাইটের ছবি", "Photo Upload")}
                {currentStep === 5 && t("জায়গার আয়তন", "Area Size")}
                {currentStep === 6 && t("বাজেট ও সাবমিশন", "Budget & Submit")}
              </span>
            </div>
            <div className="w-full bg-emerald-900/60 h-2 rounded-full overflow-hidden border border-emerald-800">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Wizard Success State */}
        {isSuccess ? (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 sm:p-10 border border-white/20 text-center space-y-6 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-4xl mx-auto border border-emerald-400/30">
              ✓
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                {t("রিকোয়েস্ট সফলভাবে গৃহীত হয়েছে!", "Design Request Successfully Received!")}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                {t(`ধন্যবাদ, ${clientName}!`, `Thank you, ${clientName}!`)}
              </h3>
              <p className="text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
                {t(
                  "আপনার গার্ডেন ডিজাইন রিকোয়েস্ট আমাদের আর্কিটেকচার টিমের কাছে পৌঁছে গেছে। আমরা দ্রুত আপনার সাথে যোগাযোগ করব।",
                  "Your garden proposal has been dispatched to our principal landscape architect. We will contact you shortly."
                )}
              </p>
            </div>

            {/* Reference Badge */}
            <div className="inline-block bg-emerald-900/90 border border-emerald-500/50 px-6 py-3 rounded-2xl">
              <span className="text-xs text-emerald-300 block">
                {t("আপনার প্রজেক্ট রেফারেন্স আইডি:", "Your Project Reference ID:")}
              </span>
              <span className="text-xl font-mono font-bold text-white tracking-widest">{referenceCode}</span>
            </div>

            {/* Summary Details Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-left bg-black/20 p-4 rounded-2xl border border-white/10 max-w-2xl mx-auto">
              <div>
                <span className="text-emerald-400 block">{t("জায়গা:", "Space:")}</span>
                <span className="font-semibold text-white">{spaceType}</span>
              </div>
              <div>
                <span className="text-emerald-400 block">{t("স্টাইল:", "Style:")}</span>
                <span className="font-semibold text-white">{designStyle}</span>
              </div>
              <div>
                <span className="text-emerald-400 block">{t("আয়তন:", "Area:")}</span>
                <span className="font-semibold text-white">{approxArea} sq ft</span>
              </div>
              <div>
                <span className="text-emerald-400 block">{t("ফিচার:", "Features:")}</span>
                <span className="font-semibold text-white">
                  {t(`${features.length} টি নির্বাচিত`, `${features.length} Selected`)}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20submitted%20Design%20Request%20ref:%20${referenceCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <span>💬</span> {t("হোয়াটসঅ্যাপে যোগাযোগ করুন", "Confirm via WhatsApp")}
              </a>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setCurrentStep(1);
                  setSitePhotoPreview(null);
                }}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-all cursor-pointer"
              >
                {t("নতুন রিকোয়েস্ট শুরু করুন", "Start New Design Request")}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 min-h-[380px] flex flex-col justify-between">
            
            {/* STEP 1: Space Type */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {t("Step 1: Choose Your Space Type", "Step 1: Choose Your Space Type")}
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    {t("আপনি কোথায় বাগানটি তৈরি করতে চান?", "Where would you like to develop the landscape?")}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {spaces.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSpaceType(s.id)}
                      className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        spaceType === s.id
                          ? "bg-emerald-700/80 border-emerald-400 shadow-lg scale-102"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <span className="font-bold text-sm text-white">
                          {language === "bn" ? s.labelBn : s.labelEn}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-100/70 mt-2">
                        {language === "bn" ? s.descBn : s.descEn}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Design Style */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {t("Step 2: Select Architectural Style", "Step 2: Select Architectural Style")}
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    {t("আপনার রুচি ও ব্যক্তিত্ব অনুযায়ী থিম পছন্দ করুন", "Choose the aesthetic theme that matches your vision")}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {styles.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setDesignStyle(st.id)}
                      className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-4 ${
                        designStyle === st.id
                          ? "bg-emerald-700/80 border-emerald-400 shadow-lg scale-102"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="text-3xl">{st.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm text-white">
                          {language === "bn" ? st.labelBn : st.labelEn}
                        </h4>
                        <p className="text-xs text-emerald-100/70 mt-1">
                          {language === "bn" ? st.descBn : st.descEn}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: Features */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {t("Step 3: Select Desired Features", "Step 3: Select Desired Features")}
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    {t("একাধিক ফিচার পছন্দ করতে পারেন (মাল্টি-সিলেক্ট)", "You may pick multiple features (multi-select)")}
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {featureList.map((f) => {
                    const isSelected = features.includes(f.id);
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => toggleFeature(f.id)}
                        className={`p-4 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                          isSelected
                            ? "bg-emerald-600 border-emerald-300 shadow-md scale-105"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <span className="text-3xl">{f.icon}</span>
                        <span className="text-xs font-semibold text-white">
                          {language === "bn" ? f.labelBn : f.labelEn}
                        </span>
                        <span className="text-[10px] text-emerald-200">
                          {isSelected ? t("✓ নির্বাচিত", "✓ Selected") : t("+ যোগ করুন", "+ Add")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: Photo Upload */}
            {currentStep === 4 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {t("Step 4: Upload Site Photograph", "Step 4: Upload Site Photograph")}
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    {t(
                      "ছাদ, বারান্দা বা উঠানের বর্তমান একটি ছবি দিলে আমাদের আর্কিটেক্টের পরিকল্পনা করতে সহজ হয়",
                      "An actual photograph helps our architects understand sunlight, boundaries, and drainage"
                    )}
                  </p>
                </div>

                <div className="border-2 border-dashed border-white/20 rounded-3xl p-8 text-center bg-white/5 hover:bg-white/10 transition-colors relative">
                  {sitePhotoPreview ? (
                    <div className="space-y-3">
                      <div className="w-full max-w-sm mx-auto aspect-[16/10] rounded-2xl overflow-hidden shadow-lg border-2 border-emerald-400">
                        <img src={sitePhotoPreview} alt="Site preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setSitePhotoPreview(null)}
                          className="px-3 py-1.5 bg-red-600/80 hover:bg-red-700 text-white rounded-lg text-xs font-medium cursor-pointer"
                        >
                          {t("ছবি মুছুন", "Remove Photo")}
                        </button>
                        <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium cursor-pointer">
                          {t("অন্য ছবি দিন", "Change Photo")}
                          <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center gap-3">
                      <span className="text-4xl">📷</span>
                      <span className="text-sm font-bold text-white">
                        {t("ক্লিক করে ছবি আপলোড করুন", "Click to Upload Photo")}
                      </span>
                      <span className="text-xs text-emerald-200/60">
                        {t("JPG, PNG বা WEBP (ছবি না থাকলেও পরবর্তী ধাপে যেতে পারেন)", "JPG, PNG or WEBP (Optional, you may skip)")}
                      </span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: Approximate Area */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {t("Step 5: Approximate Area Size", "Step 5: Approximate Area Size")}
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    {t("স্কয়ার ফিট (Sq Ft) হিসেবে আনুমানিক মাপ নির্বাচন করুন", "Select the estimated area in square feet")}
                  </p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-5 text-center">
                  <span className="text-xs text-emerald-300 uppercase tracking-widest font-semibold block">
                    {t("নির্বাচিত আয়তন", "Selected Area Size")}
                  </span>
                  <div className="text-4xl font-bold font-mono text-emerald-400">
                    {approxArea} <span className="text-lg text-white font-sans">sq ft</span>
                  </div>
                  <p className="text-xs text-emerald-200/60">
                    {t(
                      `(প্রায় ${(approxArea / 720).toFixed(2)} কাঠা / ${(approxArea / 435.6).toFixed(2)} শতাংশ)`,
                      `(Approx ${(approxArea / 720).toFixed(2)} Katha / ${(approxArea / 435.6).toFixed(2)} Decimal)`
                    )}
                  </p>

                  {/* Slider */}
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="50"
                    value={approxArea}
                    onChange={(e) => setApproxArea(Number(e.target.value))}
                    aria-label="Garden Approximate Area in sq ft"
                    className="w-full accent-emerald-400 cursor-pointer"
                  />

                  {/* Quick Presets */}
                  <div className="flex flex-wrap justify-center gap-2 pt-2">
                    {[250, 500, 800, 1200, 2000, 3500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setApproxArea(preset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          approxArea === preset
                            ? "bg-emerald-500 text-white"
                            : "bg-white/10 text-emerald-200 hover:bg-white/20"
                        }`}
                      >
                        {preset} sqft
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: Budget Range & Contact Info */}
            {currentStep === 6 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {t("Step 6: Budget & Contact Details", "Step 6: Budget & Contact Details")}
                  </h3>
                  <p className="text-xs text-emerald-200/70">
                    {t("রিকোয়েস্ট সাবমিট করলে আমাদের আর্কিটেকচার টিম যোগাযোগ করবে", "Our landscape architectural team will review and contact you")}
                  </p>
                </div>

                {/* Budget selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                    {t("আপনার বাজেট রেঞ্জ", "Your Target Budget")}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {budgetOptions.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudgetRange(b)}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer ${
                          budgetRange === b
                            ? "bg-emerald-700 border-emerald-300 text-white shadow"
                            : "bg-white/5 border-white/10 text-emerald-100 hover:bg-white/10"
                        }`}
                      >
                        💰 {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-200">
                      {t("আপনার নাম *", "Your Name *")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("e.g. তানভীর আহমেদ", "e.g. Tanvir Ahmed")}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-200">
                      {t("মোবাইল নম্বর *", "Phone Number *")}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01XXXXXXXXX"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-200">
                      {t("সাইটের অবস্থান (এলাকা)", "Site Location (Area)")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("ধানমন্ডি, গুলশান, বনানী ইত্যাদি", "Dhanmondi, Gulshan, Banani etc.")}
                      value={clientLocation}
                      onChange={(e) => setClientLocation(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-emerald-200">
                      {t("ইমেইল (ঐচ্ছিক)", "Email (Optional)")}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white py-2.5 px-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Step Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-white/10 mt-6">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  {t("← পূর্ববর্তী", "← Previous")}
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs transition-all shadow cursor-pointer"
                >
                  {t("পরবর্তী ধাপ →", "Next Step →")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-emerald-950 font-bold text-xs transition-all shadow-lg cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? t("সাবমিট হচ্ছে...", "Submitting...")
                    : t("ডিজাইন প্রস্তাবনা সাবমিট করুন ✓", "Submit Design Request ✓")}
                </button>
              )}
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
