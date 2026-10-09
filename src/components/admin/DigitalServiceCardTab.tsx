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
      doctorHotline: "01883012641",
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
      doctorHotline: "01883012641",
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
      doctorHotline: "01883012641",
    };

    setCards([newCard, ...cards]);
    setSelectedCard(newCard);
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg text-[#E4E2D7]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <span>🪪</span> Digital Service Card & Handover
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Digital Service & Handover Card
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Official handover record detailing project blueprint, flora species, warranty guarantees, and follow-up schedules.
          </p>
        </div>

        <button
          onClick={() => setIsGenerating(!isGenerating)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          {isGenerating ? "✕ Close" : "+ Issue New Digital Service Card"}
        </button>
      </div>

      {/* Generator Form */}
      {isGenerating && (
        <form onSubmit={handleCreateCard} className="bg-[#18221A]/95 backdrop-blur-xl p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4 animate-fade-in-up text-[#E4E2D7]">
          <h4 className="font-bold text-emerald-300 text-sm border-b border-white/10 pb-2">Issue New Digital Service Card</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-stone-300 block mb-1">প্রজেক্টের নাম *</label>
              <input
                type="text"
                required
                placeholder="e.g. Banani Terrace Haven"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">গ্রাহকের নাম *</label>
              <input
                type="text"
                required
                placeholder="e.g. ড. আহমেদ শরীফ"
                value={newClient}
                onChange={(e) => setNewClient(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">ফোন নম্বর</label>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">লোকেশন</label>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">সার্ভিসসমূহ (কমা দিয়ে আলাদা করুন)</label>
              <input
                type="text"
                value={newServices}
                onChange={(e) => setNewServices(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">রোপিত গাছপালার তালিকা (কমা দিয়ে)</label>
              <input
                type="text"
                value={newFlora}
                onChange={(e) => setNewFlora(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">মেইনটেন্যান্স শিডিউল</label>
              <input
                type="text"
                value={newMaintenance}
                onChange={(e) => setNewMaintenance(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">পরবর্তী ফলো-আপ ভিজিট</label>
              <input
                type="date"
                value={newFollowUp}
                onChange={(e) => setNewFollowUp(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none font-mono"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsGenerating(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
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
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block font-mono">ISSUED DIGITAL SERVICE CARDS</span>
          {cards.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCard(c)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer space-y-1 ${
                selectedCard?.id === c.id
                  ? "bg-emerald-950/40 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/40"
                  : "bg-[#18221A]/70 border-white/10 hover:bg-white/5"
              }`}
            >
              <span className="text-[10px] font-mono font-bold text-emerald-400">{c.projectCode}</span>
              <h4 className="font-bold text-white text-sm font-serif">{c.projectName}</h4>
              <p className="text-xs text-stone-400">গ্রাহক: <span className="font-semibold text-stone-200">{c.clientName}</span></p>
              <span className="text-[10px] text-stone-500 block pt-1 font-mono">হস্তান্তর: {c.handoverDate}</span>
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
              <div className="col-span-2 sm:col-span-1">
                <span className="text-emerald-400 block text-[10px]">
                  Lead Architect & Tree Doctor Emergency Hotline:
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono text-amber-300 font-bold text-sm">
                    {selectedCard.doctorHotline}
                  </span>
                  <a
                    href={`https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20would%20like%20to%20consult%20about%20my%20garden.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-[#25D366] text-[10px] font-bold flex items-center gap-1 transition-all border border-emerald-500/30"
                    title="WhatsApp Emergency Hotline"
                  >
                    <span>💬</span> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Plant Replacement Warranty & Renewal Engine */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-emerald-900/40 p-4 rounded-2xl border border-emerald-500/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                  🛡️
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-emerald-300 font-mono">
                      🌿 প্ল্যান্ট রিপ্লেসমেন্ট ওয়ারেন্টি: আর ৪ মাস বাকি
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      সক্রিয় গ্যারান্টি
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-200/70 mt-0.5">
                    ১ বছরের মধ্যে কোনো চারা ক্ষতিগ্রস্ত হলে বিনামূল্যে প্রতিস্থাপন ও বিশেষজ্ঞ চিকিৎসকের অন-সাইট সেবা।
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/8801883012641?text=Hello%20A%20R%20Green%20Garden,%20I%20would%20like%20to%20renew%20my%20plant%20maintenance%20and%20warranty%20package."
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>🔄</span> রিনিউ মেইনটেন্যান্স প্যাকেজ
              </a>
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
