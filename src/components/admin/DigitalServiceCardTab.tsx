"use client";

import React, { useState } from "react";

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
  nextFollowUpDate: string;
  warrantyPeriod: string;
  leadArchitect: string;
  doctorHotline: string;
}

export default function DigitalServiceCardTab() {
  const [cards, setCards] = useState<DigitalServiceCardData[]>([
    {
      id: "card-1",
      projectCode: "ARG-2026-D01",
      projectName: "Dhanmondi Sky Oasis Luxury Rooftop",
      clientName: "ব্যারিস্টার এম. এ. হাসান",
      clientPhone: "01711223344",
      handoverDate: "15 August 2026",
      location: "Road 9/A, Dhanmondi, Dhaka",
      servicesIncluded: [
        "Waterproof Rooftop Gardening",
        "Automated Smart Drip Irrigation",
        "Architectural Wood Pergola",
        "Warm LED Ambience Lighting",
      ],
      plantedFlora: [
        "Thai Amrapali Mango (Bonsai)",
        "Ficus Benjamina",
        "Bougainvillea White & Pink",
        "Dracaena Reflexa",
        "Korean Lawn Grass",
      ],
      maintenanceFrequency: "Weekly (Every Thursday)",
      nextFollowUpDate: "15 October 2026",
      warrantyPeriod: "1 Year Free Plant Replacement & Waterproofing Warranty",
      leadArchitect: "Ar. Tanvir Chowdhury",
      doctorHotline: "01620692449",
    },
    {
      id: "card-2",
      projectCode: "ARG-2026-G02",
      projectName: "Gulshan Corporate Bio-Terrace",
      clientName: "Apex Holdings Ltd.",
      clientPhone: "01822334455",
      handoverDate: "02 September 2026",
      location: "Gulshan-2, Dhaka",
      servicesIncluded: [
        "Vertical Green Wall",
        "Indoor Air-Purifying Biophilic Lounge",
        "Custom Water Cascade Fountain",
      ],
      plantedFlora: [
        "Monstera Deliciosa",
        "Philodendron Xanadu",
        "Snake Plant Sansevieria",
        "Areca Palm Container",
      ],
      maintenanceFrequency: "Bi-Weekly (1st & 3rd Tuesday)",
      nextFollowUpDate: "02 November 2026",
      warrantyPeriod: "2 Years Pump & Irrigation Maintenance Warranty",
      leadArchitect: "Ar. Nusrat Jahan",
      doctorHotline: "01620692449",
    },
  ]);

  const [selectedCard, setSelectedCard] = useState<DigitalServiceCardData | null>(cards[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // New Card State
  const [newProjName, setNewProjName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newLocation, setNewLocation] = useState("Banani, Dhaka");
  const [newFlora, setNewFlora] = useState("Mango Bonsai, Jasmine, Mexican Grass, Ficus");
  const [newServices, setNewServices] = useState("Rooftop Garden, Drip Irrigation, Lighting");
  const [newMaintenance, setNewMaintenance] = useState("Monthly (1st Sunday)");
  const [newFollowUp, setNewFollowUp] = useState("2026-11-15");

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newClient) return;

    const newCard: DigitalServiceCardData = {
      id: `card-${Date.now()}`,
      projectCode: `ARG-${new Date().getFullYear()}-P${Math.floor(10 + Math.random() * 90)}`,
      projectName: newProjName,
      clientName: newClient,
      clientPhone: newPhone,
      handoverDate: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }),
      location: newLocation,
      servicesIncluded: newServices.split(",").map((s) => s.trim()),
      plantedFlora: newFlora.split(",").map((s) => s.trim()),
      maintenanceFrequency: newMaintenance,
      nextFollowUpDate: newFollowUp,
      warrantyPeriod: "1 Year Plant & Infrastructure Warranty",
      leadArchitect: "Senior Landscape Architect",
      doctorHotline: "01620692449",
    };

    setCards([newCard, ...cards]);
    setSelectedCard(newCard);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <span>🪪</span> ধাপ ১০ • Digital Service Card & Handover
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 tracking-tight">
            প্রজেক্ট সমাপ্তির ডিজিটাল সার্ভিস কার্ড
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            প্রজেক্ট শেষে গ্রাহকের নিকট প্রজেক্ট বিবরণ, রোপিত গাছের তালিকা, ওয়ারেন্টি ও ফলো-আপ শিডিউল কার্ড হস্তান্তর।
          </p>
        </div>

        <button
          onClick={() => setIsGenerating(!isGenerating)}
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
        >
          {isGenerating ? "✕ বন্ধ করুন" : "+ নতুন ডিজিটাল কার্ড তৈরি করুন"}
        </button>
      </div>

      {/* Generator Form */}
      {isGenerating && (
        <form onSubmit={handleCreateCard} className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-md space-y-4 animate-fade-in-up">
          <h4 className="font-bold text-emerald-900 text-sm border-b pb-2">নতুন ডিজিটাল সার্ভিস কার্ড ইস্যু</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">প্রজেক্টের নাম *</label>
              <input
                type="text"
                required
                placeholder="e.g. Banani Terrace Haven"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">গ্রাহকের নাম *</label>
              <input
                type="text"
                required
                placeholder="e.g. ড. আহমেদ শরীফ"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">ফোন নম্বর</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">লোকেশন</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">সার্ভিসসমূহ (কমা দিয়ে আলাদা করুন)</label>
              <input
                type="text"
                value={newServices}
                onChange={(e) => setNewServices(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">রোপিত গাছপালার তালিকা (কমা দিয়ে)</label>
              <input
                type="text"
                value={newFlora}
                onChange={(e) => setNewFlora(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">মেইনটেন্যান্স শিডিউল</label>
              <input
                type="text"
                value={newMaintenance}
                onChange={(e) => setNewMaintenance(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
              />
            </div>
            <div>
              <label className="font-semibold text-gray-700 block mb-1">পরবর্তী ফলো-আপ ভিজিট</label>
              <input
                type="date"
                value={newFollowUp}
                onChange={(e) => setNewFollowUp(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsGenerating(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-md"
            >
              ✓ কার্ড তৈরি ও প্রিভিউ দেখুন
            </button>
          </div>
        </form>
      )}

      {/* Main 2-Column Layout: Cards List & Interactive Digital Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Cards Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">ইস্যুকৃত ডিজিটাল কার্ডসমূহ</span>
          {cards.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCard(c)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-1 ${
                selectedCard?.id === c.id
                  ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-100"
                  : "bg-white/80 border-gray-200 hover:bg-white"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-emerald-700">{c.projectCode}</span>
              <h4 className="font-bold text-gray-900 text-sm font-serif">{c.projectName}</h4>
              <p className="text-xs text-gray-500">গ্রাহক: <span className="font-semibold text-gray-700">{c.clientName}</span></p>
              <span className="text-[10px] text-gray-400 block pt-1">হস্তান্তর: {c.handoverDate}</span>
            </div>
          ))}
        </div>

        {/* Right: The High-End Digital Service Card Display */}
        {selectedCard && (
          <div className="lg:col-span-8 bg-gradient-to-br from-[#061e13] via-[#092b1b] to-[#04120a] text-white rounded-[36px] p-8 shadow-2xl border border-emerald-500/40 relative overflow-hidden space-y-6">
            {/* Ambient Background Accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Card Header */}
            <div className="flex justify-between items-start border-b border-emerald-800/80 pb-5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-800 shadow-md font-bold text-xl">
                  🌿
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest block">
                    OFFICIAL CLIENT DIGITAL SERVICE CARD
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                    {selectedCard.projectName}
                  </h3>
                  <p className="text-xs text-emerald-200/80">📍 {selectedCard.location}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold px-3 py-1 rounded-full">
                  {selectedCard.projectCode}
                </span>
                <span className="text-[11px] text-emerald-300/70 block mt-1.5">
                  হস্তান্তর: {selectedCard.handoverDate}
                </span>
              </div>
            </div>

            {/* Client & Architect Credentials */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs relative z-10">
              <div>
                <span className="text-emerald-400 block text-[10px]">ক্লায়েন্টের নাম:</span>
                <span className="font-bold text-white text-sm">{selectedCard.clientName}</span>
              </div>
              <div>
                <span className="text-emerald-400 block text-[10px]">মোবাইল:</span>
                <span className="font-mono text-emerald-100">{selectedCard.clientPhone}</span>
              </div>
              <div>
                <span className="text-emerald-400 block text-[10px]">লিড আর্কিটেক্ট:</span>
                <span className="font-medium text-white">{selectedCard.leadArchitect}</span>
              </div>
              <div>
                <span className="text-emerald-400 block text-[10px]">ট্রি ডক্টর হটলাইন:</span>
                <span className="font-mono text-amber-300 font-bold">{selectedCard.doctorHotline}</span>
              </div>
            </div>

            {/* Installed Plants & Tree Roster (PDF requirement) */}
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                🌱 রোপিত গাছের তালিকা ও পরিচিতি (Installed Flora):
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCard.plantedFlora.map((flora, i) => (
                  <span
                    key={i}
                    className="bg-emerald-900/60 border border-emerald-600/40 text-emerald-200 text-xs px-3 py-1.5 rounded-xl font-medium"
                  >
                    ✓ {flora}
                  </span>
                ))}
              </div>
            </div>

            {/* Services Implemented */}
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                🛠️ বাস্তবায়িত সার্ভিস ও ল্যান্ডস্কেপিং ফিচারসমূহ:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCard.servicesIncluded.map((s, i) => (
                  <span
                    key={i}
                    className="bg-white/10 border border-white/15 text-white text-xs px-3 py-1.5 rounded-xl font-medium"
                  >
                    ✦ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Maintenance & Warranty Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 relative z-10">
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 text-xs">
                <span className="text-emerald-400 block text-[10px] font-bold">মেইনটেন্যান্স শিডিউল:</span>
                <span className="font-semibold text-white mt-0.5 block">{selectedCard.maintenanceFrequency}</span>
              </div>
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 text-xs">
                <span className="text-amber-400 block text-[10px] font-bold">পরবর্তী ফ্রি ফলো-আপ ভিজিট:</span>
                <span className="font-semibold text-white mt-0.5 block font-mono">📅 {selectedCard.nextFollowUpDate}</span>
              </div>
              <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10 text-xs">
                <span className="text-emerald-400 block text-[10px] font-bold">ওয়ারেন্টি গ্যারান্টি:</span>
                <span className="font-semibold text-white mt-0.5 block">{selectedCard.warrantyPeriod}</span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-emerald-800/80 flex flex-col sm:flex-row justify-between items-center gap-3 relative z-10">
              <span className="text-[11px] text-emerald-300/70">
                A R Green Garden ডিজিটাল সার্টিফিকেশন • ধানমন্ডি, ঢাকা
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-emerald-950 font-bold text-xs rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  🖨️ কার্ড প্রিন্ট / PDF ডাউনলোড
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
