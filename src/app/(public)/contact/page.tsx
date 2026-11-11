"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import {
  DEFAULT_EXTENDED_CONTACT_CONFIG,
  ExtendedContactConfig,
} from "@/types/cms";

export default function ContactPage() {
  const { language, t } = useLanguage();
  const { getSection, txt, config } = useSiteConfig();
  const bn = language === "bn";

  const rawContact = getSection<ExtendedContactConfig>(
    "contact_config",
    DEFAULT_EXTENDED_CONTACT_CONFIG
  );

  const branches =
    Array.isArray(rawContact.branches) && rawContact.branches.length > 0
      ? rawContact.branches
      : DEFAULT_EXTENDED_CONTACT_CONFIG.branches;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [branch, setBranch] = useState(branches[0]?.id || "dhaka-hq");
  const [service, setService] = useState("Rooftop Garden Setup");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const qs = new URLSearchParams(window.location.search);
      const consultant = qs.get("consultant");
      if (consultant) {
        setMessage((prev) => prev || `Requested consultation with: ${consultant}`);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !phone.trim()) {
      setErrorMsg(t("নাম ও মোবাইল নম্বর আবশ্যক।", "Name and phone number are required."));
      return;
    }

    setSubmitting(true);
    try {
      const chosenBranch = branches.find((b) => b.id === branch);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          branch: chosenBranch ? `${chosenBranch.cityEn} (${chosenBranch.titleEn})` : branch,
          subject: service,
          message: message.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(
          data.error || t("বার্তা পাঠানো যায়নি, আবার চেষ্টা করুন।", "Failed to send message.")
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setErrorMsg(t("নেটওয়ার্ক ত্রুটি, অনুগ্রহ করে কল করুন।", "Network error. Please call us."));
    } finally {
      setSubmitting(false);
    }
  };

  const waDigits = (config.site_config.whatsapp || rawContact.phone || "8801883012641").replace(
    /[^0-9]/g,
    ""
  );

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col gap-4">
          <span className="text-[12px] font-mono font-bold tracking-[0.2em] text-emerald-800 uppercase">
            {bn ? rawContact.badgeBn : rawContact.badgeEn}
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1a3020]">
            {bn ? rawContact.titleBn : rawContact.titleEn}
          </h1>
          <div className="w-16 h-1 bg-emerald-700/25 mx-auto rounded" />
          <p className="text-stone-600 leading-relaxed text-sm md:text-base">
            {bn ? rawContact.subtitleBn : rawContact.subtitleEn}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Branches Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold">
                {txt("contact.dhakaBadge", "প্রধান কার্যালয়", "Headquarters")}
              </span>
              <h3 className="text-xl font-bold font-serif text-[#1a3020] mt-1">
                {txt("contact.branchesTitle", "আঞ্চলিক শাখাসমূহ", "Regional Studio Hubs")}
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {branches.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#f4f7f5] border border-emerald-900/10 rounded-2xl p-5 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-[15px] text-[#1a3020]">
                      {bn ? b.cityBn || b.cityEn : b.cityEn}
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-800 bg-white px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {bn ? b.titleBn || b.titleEn : b.titleEn}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    📍 {bn ? b.addressBn || b.addressEn : b.addressEn}
                  </p>
                  <p className="text-xs text-stone-600">
                    📞{" "}
                    <a
                      href={`tel:${b.phone.replace(/\s+/g, "")}`}
                      className="text-emerald-800 font-semibold hover:underline"
                    >
                      {b.phone}
                    </a>
                  </p>
                  <p className="text-xs text-stone-600">
                    ✉️{" "}
                    <a href={`mailto:${b.email}`} className="text-emerald-800 hover:underline">
                      {b.email}
                    </a>
                  </p>
                  {(b.hoursBn || b.hoursEn) && (
                    <p className="text-[11px] text-stone-500">
                      🕒 {bn ? b.hoursBn || b.hoursEn : b.hoursEn}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <a
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3.5 rounded-2xl transition-colors shadow-sm"
            >
              <span>💬</span> WhatsApp Live Consultation
            </a>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-7 flex flex-col gap-8 w-full">
            <div className="bg-[#f2f6f3] p-8 md:p-10 rounded-[32px] border border-stone-200/80 shadow-md">
              {submitted ? (
                <div className="text-center py-12 flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl text-emerald-800">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold font-serif text-[#1a3020]">
                    {txt(
                      "contact.successNotice",
                      "ধন্যবাদ! আপনার বার্তা সফলভাবে পাঠানো হয়েছে।",
                      "Thank you! Your inquiry has been received."
                    )}
                  </h3>
                  <p className="text-stone-600 text-sm max-w-sm">
                    {t(
                      "আমাদের একজন ল্যান্ডস্কেপ আর্কিটেক্ট শীঘ্রই আপনার সাথে যোগাযোগ করবেন।",
                      "A landscape architect from your selected branch will contact you shortly."
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setPhone("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="mt-2 text-xs font-bold text-emerald-800 hover:underline cursor-pointer"
                  >
                    {t("নতুন বার্তা পাঠান", "Send another request")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#1a3020]">
                      {bn ? rawContact.formTitleBn : rawContact.formTitleEn}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {bn ? rawContact.formSubtitleBn : rawContact.formSubtitleEn}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {t("আপনার পূর্ণ নাম *", "Full Name *")}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t("আপনার নাম", "Tanvir Ahmed")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white border border-stone-200 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {t("মোবাইল নম্বর *", "Mobile Number *")}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-white border border-stone-200 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {t("ইমেইল ঠিকানা", "Email Address")}
                      </label>
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white border border-stone-200 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-stone-700">
                        {t("পছন্দের শাখা", "Preferred Branch")}
                      </label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="bg-white border border-stone-200 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                      >
                        {branches.map((b) => (
                          <option key={b.id} value={b.id}>
                            {bn ? b.cityBn || b.cityEn : b.cityEn} (
                            {bn ? b.titleBn || b.titleEn : b.titleEn})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t("সেবার ধরন", "Service Category")}
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="bg-white border border-stone-200 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-700"
                    >
                      <option value="Rooftop Garden Setup">{t("ছাদবাগান স্থাপন", "Rooftop Garden Setup")}</option>
                      <option value="Vertical Wall Greenery">{t("ভার্টিক্যাল গ্রিন ওয়াল", "Vertical Wall Greenery")}</option>
                      <option value="Commercial Landscaping">{t("বাণিজ্যিক ল্যান্ডস্কেপিং", "Commercial Landscaping")}</option>
                      <option value="Residential Courtyard">{t("বাড়ির আঙিনা ও বাগান", "Residential Courtyard")}</option>
                      <option value="Landscape Consultation">{t("আর্কিটেকচারাল পরামর্শ", "Landscape Design & Consultation")}</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-stone-700">
                      {t("বিস্তারিত বিবরণ", "Requirements Description")}
                    </label>
                    <textarea
                      rows={4}
                      placeholder={t(
                        "আপনার জায়গার আয়তন, অবস্থান ও পছন্দের ডিজাইন সম্পর্কে লিখুন...",
                        "Describe your space size, location, and architectural expectations..."
                      )}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-white border border-stone-200 py-3 px-4 rounded-xl text-xs focus:outline-none focus:border-emerald-700 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#1a3020] hover:bg-black text-white font-bold text-sm py-4 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {submitting
                      ? t("পাঠানো হচ্ছে...", "Sending Request...")
                      : bn
                      ? rawContact.submitLabelBn
                      : rawContact.submitLabelEn}
                  </button>
                </form>
              )}
            </div>

            {/* Map Embed */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-stone-200 bg-[#e3eae4] flex items-center justify-center">
              {rawContact.mapEmbedUrl ? (
                <iframe
                  src={rawContact.mapEmbedUrl}
                  title="Studio Location Map"
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="text-center p-6 text-stone-500">
                  <span className="text-4xl block mb-2">🗺️</span>
                  <h4 className="font-bold text-[15px] text-[#1a3020]">
                    {t("স্টুডিও লোকেশন ম্যাপ", "Studio Location Map")}
                  </h4>
                  <p className="text-xs mt-1 max-w-xs mx-auto">{rawContact.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
