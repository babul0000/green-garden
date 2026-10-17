"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IProject } from "@/types";
import ConfirmModal from "@/components/admin/shared/ConfirmModal";

interface DigitalServiceCardData {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  clientPhone: string;
  handoverDate: string;
  location: string;
  servicesIncluded: string[];
  plantedFlora: string[];
  maintenanceFrequency: string;
  nextFollowUpDate?: string | null;
  warrantyMonths: number;
  warrantyExpiryDate: string;
  leadArchitect?: string | null;
  doctorHotline?: string | null;
  status: string;
  projectId?: string | null;
  project?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export default function DigitalServiceCardTab() {
  const [cards, setCards] = useState<DigitalServiceCardData[]>([]);
  const [projects, setProjects] = useState<IProject[]>([]);
  const [selectedCard, setSelectedCard] = useState<DigitalServiceCardData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DigitalServiceCardData | null>(null);

  // Form Fields
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [projectCode, setProjectCode] = useState("");
  const [newProjName, setNewProjName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("Dhanmondi, Dhaka");
  const [newWarrantyMonths, setNewWarrantyMonths] = useState(12);
  const [newFlora, setNewFlora] = useState("Thai Mango Bonsai, Jasmine, Mexican Grass, Ficus");
  const [newServices, setNewServices] = useState("Waterproof Rooftop Gardening, Smart Drip Irrigation, Lighting");
  const [newMaintenance, setNewMaintenance] = useState("Weekly");
  const [newFollowUp, setNewFollowUp] = useState("");
  const [leadArchitect, setLeadArchitect] = useState("Ar. Tanvir Chowdhury");
  const [doctorHotline, setDoctorHotline] = useState("01883012641");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch cards and projects
  const fetchCards = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/service-cards");
      if (res.ok) {
        const data = await res.json();
        setCards(Array.isArray(data) ? data : []);
        if (data.length > 0 && !selectedCard) {
          setSelectedCard(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch service cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setProjects(list);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchProjects();
  }, []);

  // When a project is selected from dropdown, autofill the form
  const handleSelectProject = (projId: string) => {
    setSelectedProjectId(projId);
    if (!projId) return;
    const proj = projects.find((p) => (p.id || (p as any)._id) === projId);
    if (proj) {
      setNewProjName(proj.name || proj.title || "");
      setNewClient(proj.clientName || proj.client || "");
      setNewPhone(proj.clientPhone || "");
      setNewLocation(proj.location || "Dhaka, Bangladesh");
      setProjectCode(`ARG-${new Date().getFullYear()}-${proj.slug?.slice(0, 5).toUpperCase() || "SITE"}`);
      setNewWarrantyMonths(proj.warrantyMonths || 12);
      if (proj.description) {
        setNewServices("Waterproofing, Drip Irrigation, Biophilic Planting");
      }
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newClient || !newPhone) {
      alert("প্রজেক্টের নাম, ক্লায়েন্টের নাম ও ফোন নম্বর আবশ্যক!");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        projectId: selectedProjectId || undefined,
        projectCode: projectCode.trim() || undefined,
        projectName: newProjName.trim(),
        clientName: newClient.trim(),
        clientPhone: newPhone.trim(),
        location: newLocation.trim(),
        warrantyMonths: Number(newWarrantyMonths) || 12,
        servicesIncluded: newServices.split(",").map((s) => s.trim()).filter(Boolean),
        plantedFlora: newFlora.split(",").map((s) => s.trim()).filter(Boolean),
        maintenanceFrequency: newMaintenance,
        nextFollowUpDate: newFollowUp || undefined,
        leadArchitect,
        doctorHotline,
      };

      const res = await fetch("/api/service-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "ডিজিটাল সার্ভিস কার্ড তৈরি করা যায়নি");
      }

      const json = await res.json();
      showToast("✓ নতুন ডিজিটাল সার্ভিস কার্ড সফলভাবে ইস্যু করা হয়েছে!");
      setIsGenerating(false);
      fetchCards();
      if (json.card) {
        setSelectedCard(json.card);
      }
    } catch (err: any) {
      alert(err.message || "ত্রুটি ঘটেছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCard = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/service-cards/${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("🗑️ সার্ভিস কার্ড মুছে ফেলা হয়েছে");
        setDeleteTarget(null);
        fetchCards();
        if (selectedCard?.id === deleteTarget.id) {
          setSelectedCard(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans text-[#121813]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-[#D6D2C4] shadow-2xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#E8F5E9] border border-[#2B4D33]/20 text-[#2B4D33] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
            <span>🪪</span> Digital Service Card & NFC Warranty
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-light uppercase tracking-wide text-[#121813]">
            ডিজিটাল সার্ভিস ও ওয়ারেন্টি কার্ড
          </h2>
          <p className="text-xs text-[#75787B] font-light mt-0.5">
            হস্তান্তরিত প্রকল্পের বোটানিক্যাল বিবরণ, গাছের স্বাস্থ্য রেকর্ড, ওয়ারেন্টি গ্যারান্টি ও লাইভ QR লিঙ্ক।
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsGenerating(!isGenerating)}
          className="min-h-[44px] px-4 py-2 bg-[#2B4D33] hover:bg-[#1E3724] text-white rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shadow-xs"
        >
          {isGenerating ? "✕ ফর্ম বন্ধ করুন" : "+ নতুন ডিজিটাল কার্ড ইস্যু করুন"}
        </button>
      </div>

      {/* Temporary Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-[#E8F5E9] border border-[#2B4D33]/40 text-[#121813] rounded-2xl text-xs font-semibold animate-fade-in flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2B4D33] animate-ping"></span>
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-[#75787B] hover:text-[#121813] font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Issue Card Form */}
      {isGenerating && (
        <form onSubmit={handleCreateCard} className="bg-white p-6 sm:p-7 rounded-2xl border border-[#2B4D33]/30 shadow-md space-y-4 animate-scale-up">
          <h4 className="font-bold text-xs text-[#2B4D33] uppercase tracking-wider font-mono border-b border-[#D6D2C4] pb-2">
            ➕ ইস্যু ডিজিটাল সার্ভিস ও ওয়ারেন্টি কার্ড
          </h4>

          {/* Optional Project Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#75787B] block mb-1">
              বিদ্যমান প্রজেক্ট থেকে প্রি-ফিল করুন (Select Project)
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-xs text-[#121813] focus:border-[#2B4D33] focus:outline-none min-h-[44px]"
            >
              <option value="">-- নতুন একক কার্ড তৈরি করুন (অথবা প্রজেক্ট বাছুন) --</option>
              {projects.map((p) => (
                <option key={p.id || (p as any)._id} value={p.id || (p as any)._id}>
                  {p.name} ({p.clientName || p.client || "ব্যক্তিগত"})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">প্রজেক্টের নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: Banani Terrace Haven"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] placeholder-[#75787B] focus:border-[#2B4D33] focus:outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">গ্রাহকের নাম *</label>
              <input
                type="text"
                required
                placeholder="যেমন: ড. আহমেদ শরীফ"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] placeholder-[#75787B] focus:border-[#2B4D33] focus:outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">ফোন নম্বর *</label>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] placeholder-[#75787B] focus:border-[#2B4D33] focus:outline-none font-mono min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">লোকেশন</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] placeholder-[#75787B] focus:border-[#2B4D33] focus:outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">প্রজেক্ট কোড (Project Code)</label>
              <input
                type="text"
                placeholder="ARG-2026-C101"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] placeholder-[#75787B] focus:border-[#2B4D33] focus:outline-none font-mono min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">ওয়ারেন্টি মাস (মাস)</label>
              <input
                type="number"
                value={newWarrantyMonths}
                onChange={(e) => setNewWarrantyMonths(parseInt(e.target.value, 10))}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] focus:border-[#2B4D33] focus:outline-none font-mono min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">সার্ভিসসমূহ (কমা দিয়ে আলাদা করুন)</label>
              <input
                type="text"
                value={newServices}
                onChange={(e) => setNewServices(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] focus:border-[#2B4D33] focus:outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">রোপিত গাছপালা (কমা দিয়ে)</label>
              <input
                type="text"
                value={newFlora}
                onChange={(e) => setNewFlora(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] focus:border-[#2B4D33] focus:outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-[#75787B] block mb-1">মেইনটেনেন্স ফ্রিকোয়েন্সি</label>
              <select
                value={newMaintenance}
                onChange={(e) => setNewMaintenance(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#D6D2C4] rounded-xl p-2.5 text-[#121813] focus:border-[#2B4D33] focus:outline-none min-h-[44px]"
              >
                <option value="Weekly">Weekly (সাপ্তাহিক)</option>
                <option value="Bi-Weekly">Bi-Weekly (পাক্ষিক)</option>
                <option value="Monthly">Monthly (মাসিক)</option>
                <option value="On-Demand">On-Demand (প্রয়োজন অনুযায়ী)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsGenerating(false)}
              className="min-h-[44px] px-4 py-2 border border-[#D6D2C4] text-[#75787B] hover:text-[#121813] rounded-xl text-xs font-mono font-bold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-[44px] px-6 py-2 bg-[#2B4D33] hover:bg-[#1E3724] text-white rounded-xl text-xs font-mono font-bold cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? "সংরক্ষণ হচ্ছে..." : "ডিজিটাল কার্ড ইস্যু করুন"}
            </button>
          </div>
        </form>
      )}

      {/* Main Dual Pane Layout: Cards Selector & Live Card Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Cards Selector List */}
        <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-[#D6D2C4] shadow-2xs space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#2B4D33] font-mono border-b border-[#D6D2C4] pb-2">
            ইস্যুকৃত সার্ভিস কার্ডসমূহ ({cards.length})
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs font-mono text-[#75787B]">লোড হচ্ছে...</div>
          ) : cards.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-[#75787B]">
              এখনো কোনো ডিজিটাল সার্ভিস কার্ড তৈরি হয়নি।
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
              {cards.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCard(c)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedCard?.id === c.id
                      ? "bg-[#E8F5E9] border-[#2B4D33] shadow-xs"
                      : "bg-[#F7F6F2] border-[#D6D2C4] hover:bg-stone-50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-[#121813] line-clamp-1">{c.projectName}</span>
                    <span className="text-[10px] font-mono font-bold text-[#2B4D33] bg-white px-1.5 py-0.5 rounded border border-[#D6D2C4]">
                      {c.projectCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#75787B] mt-1 font-mono">
                    👤 {c.clientName} • 📍 {c.location}
                  </p>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#D6D2C4]/60">
                    <span className="text-[10px] text-emerald-800 font-bold">
                      {c.warrantyMonths} মাস ওয়ারেন্টি
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(c);
                      }}
                      className="text-rose-600 hover:text-rose-800 text-[10px] font-mono font-bold"
                    >
                      মুছুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Live Card Passport Render */}
        <div className="lg:col-span-2">
          {selectedCard ? (
            <div className="bg-white rounded-3xl border border-[#D6D2C4] shadow-md p-6 sm:p-8 space-y-6">
              
              {/* Card Header & External Link Action */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#D6D2C4] pb-4">
                <div>
                  <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-widest font-bold">
                    Official Passport Preview
                  </span>
                  <h3 className="text-xl font-display font-light text-[#121813] uppercase">
                    {selectedCard.projectName}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/card/${selectedCard.projectCode}`}
                    target="_blank"
                    className="min-h-[40px] px-3.5 py-1.5 bg-[#2B4D33] text-white rounded-xl text-xs font-mono font-bold hover:bg-[#1E3724] transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <span>🌐 পাবলিক পেজ ও QR কোড</span> ➔
                  </Link>
                </div>
              </div>

              {/* Passport Details Box */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F7F6F2] p-4 rounded-2xl border border-[#D6D2C4] text-xs">
                <div>
                  <span className="text-[10px] font-mono text-[#75787B] block">প্রজেক্ট কোড</span>
                  <span className="font-mono font-bold text-[#121813] mt-0.5 block">{selectedCard.projectCode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#75787B] block">ক্লায়েন্ট ও ফোন</span>
                  <span className="font-bold text-[#121813] mt-0.5 block">{selectedCard.clientName}</span>
                  <span className="text-[10px] font-mono text-[#75787B]">{selectedCard.clientPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#75787B] block">হস্তান্তর তারিখ</span>
                  <span className="font-mono text-[#121813] mt-0.5 block">
                    {new Date(selectedCard.handoverDate).toLocaleDateString("bn-BD")}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#75787B] block">ওয়ারেন্টি মেয়াদ</span>
                  <span className="font-bold text-[#2B4D33] mt-0.5 block">
                    {selectedCard.warrantyMonths} মাস ({new Date(selectedCard.warrantyExpiryDate).toLocaleDateString("bn-BD")})
                  </span>
                </div>
              </div>

              {/* Flora & Services List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F7F6F2] rounded-2xl border border-[#D6D2C4] space-y-2">
                  <span className="font-mono font-bold text-[#2B4D33] text-[11px] block">
                    🛠️ অন্তর্ভুক্ত সেবাসমূহ:
                  </span>
                  <ul className="space-y-1 text-[#323232]">
                    {selectedCard.servicesIncluded.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-700">✓</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-[#F7F6F2] rounded-2xl border border-[#D6D2C4] space-y-2">
                  <span className="font-mono font-bold text-[#2B4D33] text-[11px] block">
                    🌿 রোপিত উদ্ভিদ প্রজাতি:
                  </span>
                  <ul className="space-y-1 text-[#323232]">
                    {selectedCard.plantedFlora.map((f, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="text-emerald-600">🌱</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Public URL Box */}
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                <div>
                  <span className="font-mono font-bold text-[#2B4D33] text-[10px] block uppercase">
                    পাবলিক ভেরিফিকেশন লিংক:
                  </span>
                  <code className="text-xs font-mono text-[#121813] break-all">
                    /card/{selectedCard.projectCode}
                  </code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      navigator.clipboard.writeText(`${window.location.origin}/card/${selectedCard.projectCode}`);
                      showToast("✓ লিংক কপি করা হয়েছে!");
                    }
                  }}
                  className="min-h-[40px] px-3.5 py-1.5 bg-white border border-[#2B4D33]/40 text-[#2B4D33] rounded-xl text-xs font-mono font-bold hover:bg-emerald-50 cursor-pointer"
                >
                  📋 লিংক কপি করুন
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#D6D2C4] p-12 text-center text-xs text-[#75787B] font-mono">
              বাম পাশ থেকে একটি সার্ভিস কার্ড নির্বাচন করুন অথবা নতুন কার্ড তৈরি করুন।
            </div>
          )}
        </div>

      </div>

      {/* Deletion Modal */}
      {deleteTarget && (
        <ConfirmModal
          isOpen={true}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteCard}
          title="সার্ভিস কার্ড মুছে ফেলার নিশ্চিতকরণ"
          description={`আপনি কি নিশ্চিত যে "${deleteTarget.projectName}" এর ডিজিটাল সার্ভিস কার্ডটি মুছে ফেলতে চান?`}
          itemName={deleteTarget.projectName}
          confirmLabel="হ্যাঁ, মুছে ফেলুন"
          cancelLabel="বাতিল"
          variant="danger"
        />
      )}
    </div>
  );
}
