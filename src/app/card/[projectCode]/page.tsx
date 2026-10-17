import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ projectCode: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { projectCode } = await params;
  const card = await prisma.digitalServiceCard.findUnique({
    where: { projectCode },
    select: { projectName: true, projectCode: true },
  });

  if (!card) {
    return { title: "ডিজিটাল সার্ভিস কার্ড | AR Green Garden" };
  }

  return {
    title: `${card.projectName} (${card.projectCode}) - ডিজিটাল সার্ভিস ও ওয়ারেন্টি কার্ড`,
    description: "AR Green Garden অফিসিয়াল ডিজিটাল ওয়ারেন্টি ও বোটানিক্যাল সার্ভিস হিস্ট্রি রেকর্ড।",
  };
}

export default async function DigitalServiceCardPublicPage({ params }: PageProps) {
  const { projectCode } = await params;

  const card = await prisma.digitalServiceCard.findUnique({
    where: { projectCode },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
          afterImage: true,
          imageUrl: true,
          location: true,
        },
      },
    },
  });

  if (!card) {
    notFound();
  }

  // Generate QR code data URL server-side
  const origin = process.env.NEXT_PUBLIC_APP_URL || "https://argreengarden.com";
  const cardUrl = `${origin}/card/${card.projectCode}`;
  let qrCodeDataUrl = "";
  try {
    qrCodeDataUrl = await QRCode.toDataURL(cardUrl, {
      width: 240,
      margin: 1.5,
      color: {
        dark: "#121813",
        light: "#FFFFFF",
      },
    });
  } catch (err) {
    console.error("Failed to generate QR Code:", err);
  }

  const isExpired = new Date() > new Date(card.warrantyExpiryDate);
  const statusDisplay = isExpired ? "EXPIRED" : card.status || "ACTIVE";

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#121813] font-sans py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Top Branding Bar */}
        <div className="flex items-center justify-between border-b border-[#D6D2C4] pb-4">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="w-8 h-8 rounded-lg bg-[#2B4D33] text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
              🌿
            </span>
            <div>
              <span className="text-sm font-display font-light uppercase tracking-wider text-[#121813] block">
                AR GREEN GARDEN
              </span>
              <span className="text-[10px] text-[#75787B] block font-mono">
                Landscape Architecture & Botany Studio
              </span>
            </div>
          </Link>

          <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2B4D33] border border-[#2B4D33]/20">
            Official Warranty Record
          </span>
        </div>

        {/* Main Digital Warranty Card Container */}
        <div className="bg-white rounded-3xl border border-[#D6D2C4] shadow-xl overflow-hidden animate-scale-up">
          
          {/* Hero Banner with Status Badge */}
          <div className="bg-gradient-to-r from-[#1E3724] via-[#2B4D33] to-[#121813] text-white p-6 sm:p-8 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-300 font-semibold block">
                  DIGITAL NFC / QR PASSPORT
                </span>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-light uppercase tracking-wide mt-1">
                  {card.projectName}
                </h1>
                <p className="text-xs text-stone-300 mt-1 flex items-center gap-1 font-mono">
                  <span>📍 {card.location}</span>
                  <span className="mx-1">•</span>
                  <span>ক্লায়েন্ট: {card.clientName}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-sm ${
                    statusDisplay === "ACTIVE"
                      ? "bg-emerald-500 text-stone-950 border-emerald-400"
                      : "bg-rose-500 text-white border-rose-400"
                  }`}
                >
                  {statusDisplay === "ACTIVE" ? "✓ ওয়ারেন্টি সক্রিয় (ACTIVE)" : "মেয়াদোত্তীর্ণ (EXPIRED)"}
                </span>
                <p className="text-[10px] font-mono text-emerald-200 mt-1.5 font-bold tracking-wider">
                  {card.projectCode}
                </p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Key Dates & Warranty Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F6F2] p-4 rounded-2xl border border-[#D6D2C4]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] block font-bold">
                  হস্তান্তর তারিখ (Handover)
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#121813] mt-1 block">
                  {new Date(card.handoverDate).toLocaleDateString("bn-BD")}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] block font-bold">
                  ওয়ারেন্টি সময়সীমা
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#2B4D33] mt-1 block">
                  {card.warrantyMonths} মাস (Full Support)
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] block font-bold">
                  ওয়ারেন্টি মেয়াদ শেষ
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#121813] mt-1 block">
                  {new Date(card.warrantyExpiryDate).toLocaleDateString("bn-BD")}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#75787B] block font-bold">
                  মেইনটেনেন্স ফ্রিকোয়েন্সি
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#121813] mt-1 block">
                  {card.maintenanceFrequency}
                </span>
              </div>
            </div>

            {/* Services & Plant Flora Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Services Included */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2B4D33] flex items-center gap-1.5">
                  <span>🛠️</span>
                  <span>প্রকল্পে অন্তর্ভুক্ত সেবাসমূহ (Included Services)</span>
                </h3>
                <ul className="space-y-2">
                  {card.servicesIncluded.length === 0 ? (
                    <li className="text-xs text-[#75787B] italic">সবগুলো নির্ধারিত ল্যান্ডস্কেপ সেবা</li>
                  ) : (
                    card.servicesIncluded.map((s, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[#323232] bg-[#F7F6F2] px-3 py-2 rounded-xl border border-[#D6D2C4] flex items-center gap-2"
                      >
                        <span className="text-emerald-700 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Planted Flora */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-[#2B4D33] flex items-center gap-1.5">
                  <span>🌿</span>
                  <span>সংরক্ষিত উদ্ভিদ তালিকা (Botanical Flora)</span>
                </h3>
                <ul className="space-y-2">
                  {card.plantedFlora.length === 0 ? (
                    <li className="text-xs text-[#75787B] italic">গাছের তালিকা সংরক্ষিত রয়েছে</li>
                  ) : (
                    card.plantedFlora.map((flora, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-[#323232] bg-[#F7F6F2] px-3 py-2 rounded-xl border border-[#D6D2C4] flex items-center gap-2"
                      >
                        <span className="text-emerald-600">🌱</span>
                        <span>{flora}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Next Follow Up & Support Contact Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#E8F5E9]/60 border border-emerald-200 p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#2B4D33] block">
                  📅 পরবর্তী সাইট পরিদর্শন / ফলো-আপ
                </span>
                <p className="text-sm font-bold text-[#121813]">
                  {card.nextFollowUpDate
                    ? new Date(card.nextFollowUpDate).toLocaleDateString("bn-BD")
                    : "নিয়মিত শিডিউল অনুযায়ী"}
                </p>
                <p className="text-[11px] text-[#75787B]">
                  আমাদের বোটানিক্যাল কেয়ার টিম যথাসময়ে যোগাযোগ করবে।
                </p>
              </div>

              <div className="bg-[#F7F6F2] border border-[#D6D2C4] p-4 rounded-2xl space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#75787B] block">
                  👨‍⚕️ ট্রি ডক্টর ও আরবারিকালচার হটলাইন
                </span>
                <p className="text-sm font-bold text-[#121813]">
                  <a
                    href={`tel:${card.doctorHotline || "01883012641"}`}
                    className="hover:text-[#2B4D33] hover:underline"
                  >
                    📞 {card.doctorHotline || "01883012641"}
                  </a>
                </p>
                <p className="text-[11px] text-[#75787B]">
                  লিড আর্কিটেক্ট: {card.leadArchitect || "Ar. Tanvir Chowdhury"}
                </p>
              </div>
            </div>

            {/* QR Code Verification Section */}
            {qrCodeDataUrl && (
              <div className="border-t border-[#D6D2C4] pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#F7F6F2]/40 p-5 rounded-2xl">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-[#2B4D33]">
                    📲 মোবাইল এনএফসি ও কিউআর যাচাইকরণ (NFC / QR Sync)
                  </span>
                  <p className="text-xs text-[#75787B] max-w-md">
                    বাগানে বা সাইটে লাগানো ডিজিটাল কিউআর প্লেট স্ক্যান করে যেকোনো সময় এই লাইভ ওয়ারেন্টি রেকর্ড দেখতে পাবেন।
                  </p>
                  <code className="text-[11px] font-mono text-[#2B4D33] bg-white px-2 py-0.5 rounded border border-[#D6D2C4] inline-block mt-1">
                    {cardUrl}
                  </code>
                </div>

                <div className="bg-white p-2.5 rounded-2xl border border-[#D6D2C4] shadow-sm shrink-0">
                  <img
                    src={qrCodeDataUrl}
                    alt={`QR Code for ${card.projectCode}`}
                    className="w-28 h-28 object-contain"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Card Footer */}
          <div className="px-6 sm:px-8 py-4 bg-[#F7F6F2] border-t border-[#D6D2C4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#75787B] font-mono">
            <span>© AR Green Garden • Verified Botanical Warranty</span>
            <Link href="/contact" className="text-[#2B4D33] hover:underline font-bold">
              সাপোর্ট ও যোগাযোগ ➔
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
