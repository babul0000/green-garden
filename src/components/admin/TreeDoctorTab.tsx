"use client";

import React, { useState, useEffect } from "react";

interface TreeDoctorRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  location: string;
  treeName: string;
  problem: string;
  treePhotoUrl?: string | null;
  preferredVisitTime?: string | null;
  isEmergency: boolean;
  status: "PENDING" | "ASSIGNED" | "VISITED" | "DIAGNOSED" | "TREATED" | "FOLLOW_UP" | string;
  assignedDoctor?: { id: string; name: string; designation: string } | null;
  createdAt: string;
}

interface PlantHealthRecord {
  id: string;
  plantName: string;
  photoUrl?: string | null;
  plantingDate?: string | null;
  location: string;
  diseaseHistory?: string | null;
  treatment?: string | null;
  fertilizer?: string | null;
  pruning?: string | null;
  nextMaintenanceDate?: string | null;
  doctorReport?: string | null;
  project?: { name: string; location: string } | null;
  createdAt: string;
}

export default function TreeDoctorTab() {
  const [activeSubTab, setActiveSubTab] = useState<"requests" | "records">("requests");
  const [requests, setRequests] = useState<TreeDoctorRequest[]>([]);
  const [records, setRecords] = useState<PlantHealthRecord[]>([]);
  const [doctors, setDoctors] = useState<{ id: string; name: string; designation: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterEmergencyOnly, setFilterEmergencyOnly] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Form state for creating Plant Health Record
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [recPlantName, setRecPlantName] = useState("");
  const [recPhotoUrl, setRecPhotoUrl] = useState("");
  const [recLocation, setRecLocation] = useState("Rooftop Garden, Dhanmondi");
  const [recDisease, setRecDisease] = useState("");
  const [recTreatment, setRecTreatment] = useState("");
  const [recFertilizer, setRecFertilizer] = useState("");
  const [recPruning, setRecPruning] = useState("");
  const [recNextDate, setRecNextDate] = useState("");
  const [recDoctorNotes, setRecDoctorNotes] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Tree Doctor Requests
      const reqRes = await fetch("/api/tree-doctor");
      if (reqRes.ok) {
        const data = await reqRes.json();
        setRequests(data);
      }

      // 2. Fetch Plant Health Records
      const recRes = await fetch("/api/plant-health");
      if (recRes.ok) {
        const recData = await recRes.json();
        setRecords(recData);
      }

      // 3. Fetch Doctors / Employees
      const empRes = await fetch("/api/employees");
      if (empRes.ok) {
        const empData = await empRes.json();
        const docList = empData
          .filter((e: any) => e.department?.includes("Tree") || e.designation?.includes("Doctor") || e.designation?.includes("Gardener"))
          .map((e: any) => ({ id: e.id, name: e.name, designation: e.designation }));
        setDoctors(docList.length > 0 ? docList : [
          { id: "doc-1", name: "ডাঃ মোঃ রহিম", designation: "Senior Tree Doctor" },
          { id: "doc-2", name: "ড. সামসুল আলম", designation: "Horticulture Specialist" }
        ]);
      }
    } catch (err) {
      console.error("Error loading tree doctor data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStageChange = async (id: string, newStatus: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    try {
      await fetch("/api/tree-doctor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update tree doctor status:", err);
    }
  };

  const handleDoctorAssign = async (id: string, docId: string) => {
    const doc = doctors.find((d) => d.id === docId);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "ASSIGNED", assignedDoctor: doc } : r
      )
    );
    try {
      await fetch("/api/tree-doctor", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "ASSIGNED", assignedDoctorId: docId }),
      });
    } catch (err) {
      console.error("Failed to assign doctor in DB:", err);
    }
  };

  const handleDeleteTreeDoctor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this Tree Doctor request?")) return;
    try {
      const res = await fetch(`/api/tree-doctor?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete tree doctor request:", err);
    }
  };

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recPlantName) return;

    try {
      const res = await fetch("/api/plant-health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantName: recPlantName,
          photoUrl: recPhotoUrl || null,
          location: recLocation,
          diseaseHistory: recDisease || null,
          treatment: recTreatment || null,
          fertilizer: recFertilizer || null,
          pruning: recPruning || null,
          nextMaintenanceDate: recNextDate || null,
          doctorReport: recDoctorNotes || null,
        }),
      });

      if (res.ok) {
        await fetchData();
        setIsAddingRecord(false);
        setRecPlantName("");
        setRecDisease("");
        setRecTreatment("");
        setRecFertilizer("");
        setRecPruning("");
        setRecDoctorNotes("");
      } else {
        const err = await res.json();
        alert("Failed to save plant health record: " + (err.error || "Server error"));
      }
    } catch (err: any) {
      alert("Error saving record: " + err.message);
    }
  };

  const handleDeletePlantRecord = async (id: string) => {
    if (!confirm("Delete this plant health record?")) return;
    try {
      const res = await fetch(`/api/plant-health?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRecords((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete plant record:", err);
    }
  };


  const stages = [
    { key: "PENDING", label: "Request (অনুরোধ)" },
    { key: "ASSIGNED", label: "Doctor Assigned" },
    { key: "VISITED", label: "Visited (পরিদর্শন)" },
    { key: "DIAGNOSED", label: "Diagnosed (শনাক্তকরণ)" },
    { key: "TREATED", label: "Treated (চিকিৎসাধীন)" },
    { key: "FOLLOW_UP", label: "Follow-up (সুস্থ)" },
  ];

  const filteredRequests = requests.filter((r) => {
    if (filterEmergencyOnly) return r.isEmergency;
    return true;
  });

  const emergencyCount = requests.filter((r) => r.isEmergency).length;

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <span>🩺</span> ট্রি ডক্টর ও প্ল্যান্ট হেলথ • Clinical Care
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Tree Doctor Pipeline & Digital Plant Health Records
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            জরুরি গাছের চিকিৎসা, ভিজিট অ্যাসাইনমেন্ট, রোগের ইতিহাস এবং ডিজিটাল প্রেসক্রিপশন ট্র্যাক করুন।
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab("requests")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              activeSubTab === "requests"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            🩺 ট্রি ডক্টর বুকিংস ({requests.length})
          </button>
          <button
            onClick={() => setActiveSubTab("records")}
            className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              activeSubTab === "records"
                ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            🌱 প্ল্যান্ট হেলথ রেকর্ড ({records.length})
          </button>
        </div>
      </div>

      {/* Emergency Alert Banner if any */}
      {emergencyCount > 0 && activeSubTab === "requests" && (
        <div className="bg-rose-950/40 border border-rose-500/40 rounded-3xl p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h4 className="text-xs font-bold text-rose-200">
                জরুরি সতর্কতা: {emergencyCount}টি ইমার্জেন্সি ট্রি ডক্টর রিকোয়েস্ট পেন্ডিং আছে!
              </h4>
              <p className="text-[11px] text-rose-300">আক্রান্ত গাছের দ্রুত চিকিৎসা নিশ্চিত করতে তাৎক্ষণিক ডাক্তার অ্যাসাইন করুন।</p>
            </div>
          </div>
          <button
            onClick={() => setFilterEmergencyOnly(!filterEmergencyOnly)}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            {filterEmergencyOnly ? "সব দেখুন" : "শুধু ইমার্জেন্সি ফিল্টার"}
          </button>
        </div>
      )}

      {/* SUBTAB 1: TREE DOCTOR PIPELINE */}
      {activeSubTab === "requests" && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center bg-[#18221A]/85 backdrop-blur-xl rounded-3xl border border-white/10">
              <span className="w-8 h-8 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
              <p className="text-xs text-stone-400 mt-3 font-semibold">ট্রি ডক্টর রিকোয়েস্ট লোড হচ্ছে...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-16 text-center bg-[#18221A]/85 backdrop-blur-xl rounded-3xl border border-white/10 text-stone-400">
              <span className="text-4xl block mb-2">🩺</span>
              <p className="font-semibold text-sm text-white">কোনো ট্রি ডক্টর রিকোয়েস্ট পাওয়া যায়নি।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRequests.map((req) => (
                <div
                  key={req.id}
                  className={`bg-[#18221A]/90 backdrop-blur-xl rounded-3xl p-5 border shadow-lg transition-all flex flex-col justify-between ${
                    req.isEmergency
                      ? "border-rose-500/60 ring-1 ring-rose-500/30"
                      : "border-white/10 hover:border-emerald-500/40"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {req.isEmergency && (
                          <span className="inline-block bg-rose-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full mb-1">
                            🚨 EMERGENCY VISIT
                          </span>
                        )}
                        <h3 className="font-bold text-white text-base font-serif">{req.treeName}</h3>
                        <p className="text-xs text-stone-400">ক্লায়েন্ট: <span className="font-semibold text-stone-200">{req.clientName}</span></p>
                      </div>

                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {req.status}
                      </span>
                    </div>

                    {/* Problem Description */}
                    <div className="bg-black/35 p-3 rounded-2xl border border-white/10 text-xs space-y-1.5">
                      <div>
                        <span className="text-stone-400 text-[10px] block">সমস্যা (Problem):</span>
                        <p className="font-semibold text-rose-300 leading-snug">{req.problem}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10 text-[11px]">
                        <div>
                          <span className="text-stone-400 text-[10px] block">লোকেশন:</span>
                          <span className="font-medium text-stone-200">{req.location}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] block">পছন্দের সময়:</span>
                          <span className="font-medium text-stone-200">{req.preferredVisitTime || "যে কোনো সময়"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Tree Photo Thumbnail */}
                    {req.treePhotoUrl && (
                      <div
                        onClick={() => setSelectedPhoto(req.treePhotoUrl || null)}
                        className="relative group rounded-xl overflow-hidden aspect-[16/9] border border-white/10 cursor-pointer bg-black/40"
                      >
                        <img src={req.treePhotoUrl} alt={req.treeName} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-all">
                          🔍 আক্রান্ত গাছের ছবি দেখুন
                        </div>
                      </div>
                    )}

                    {/* Doctor Assignment Selection */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">দায়িত্বপ্রাপ্ত ডাক্তার:</label>
                      <select
                        value={req.assignedDoctor?.id || ""}
                        onChange={(e) => handleDoctorAssign(req.id, e.target.value)}
                        className="w-full bg-black/50 border border-white/15 text-stone-200 font-semibold py-2 px-3 rounded-xl text-xs focus:outline-none focus:border-emerald-400"
                      >
                        <option value="" className="bg-[#18221A] text-white">-- ডাক্তার নির্বাচন করুন --</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id} className="bg-[#18221A] text-white">
                            👨‍⚕️ {d.name} ({d.designation})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Workflow Stage Tracker */}
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">স্টেজ আপডেট করুন:</label>
                      <div className="grid grid-cols-3 gap-1">
                        {stages.map((st) => (
                          <button
                            key={st.key}
                            type="button"
                            onClick={() => handleStageChange(req.id, st.key)}
                            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer text-center ${
                              req.status === st.key
                                ? "bg-emerald-500 text-stone-950 shadow-sm"
                                : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
                            }`}
                          >
                            {st.key}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bottom */}
                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-300">{req.clientPhone}</span>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${req.clientPhone}`}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 border border-white/10 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        📞 কল করুন
                      </a>
                      <a
                        href={`https://wa.me/${req.clientPhone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(req.clientName)},%20AR%20Green%20Garden%20Tree%20Doctor%20Team%20contacting%20regarding%20${encodeURIComponent(req.treeName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        💬 চ্যাট
                      </a>
                      <button
                        onClick={() => handleDeleteTreeDoctor(req.id)}
                        className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer text-xs"
                        title="মুছে ফেলুন"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: PLANT HEALTH RECORD SYSTEM */}
      {activeSubTab === "records" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-[#18221A]/85 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-md">
            <div>
              <h3 className="font-bold text-white text-sm font-serif">গাছের ডিজিটাল হেলথ রেকর্ড ডাটাবেজ</h3>
              <p className="text-xs text-stone-400">ভবিষ্যতে যেকোনো গাছের সমস্যা হলে পূর্বের মেডিকেল হিস্ট্রি এক ক্লিকে দেখার সুবিধা।</p>
            </div>
            <button
              onClick={() => setIsAddingRecord(!isAddingRecord)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
            >
              {isAddingRecord ? "✕ বন্ধ করুন" : "+ নতুন হেলথ রেকর্ড যুক্ত করুন"}
            </button>
          </div>

          {/* New Record Modal / Form */}
          {isAddingRecord && (
            <form onSubmit={handleCreateRecord} className="bg-[#18221A] p-6 rounded-3xl border border-white/15 shadow-2xl space-y-4 animate-fade-in-up">
              <h4 className="font-bold text-emerald-400 text-sm border-b border-white/10 pb-2">নতুন গাছের হেলথ রেকর্ড এন্ট্রি</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">গাছের নাম (Plant Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Thai Amrapali Mango / Ficus Benjamina"
                    value={recPlantName}
                    onChange={(e) => setRecPlantName(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">লোকেশন (Location) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rooftop Orchard, Gulshan-2"
                    value={recLocation}
                    onChange={(e) => setRecLocation(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">গাছের ছবি URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={recPhotoUrl}
                    onChange={(e) => setRecPhotoUrl(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">রোগের ইতিহাস (Disease History)</label>
                  <input
                    type="text"
                    placeholder="e.g. Anthracnose Fungal Leaf Spot / Mealybug"
                    value={recDisease}
                    onChange={(e) => setRecDisease(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">প্রদত্ত চিকিৎসা (Applied Treatment)</label>
                  <input
                    type="text"
                    placeholder="e.g. Carbendazim spray 2ml/L + Neem Oil"
                    value={recTreatment}
                    onChange={(e) => setRecTreatment(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">সারের শিডিউল (Fertilizer Schedule)</label>
                  <input
                    type="text"
                    placeholder="e.g. Vermicompost 500g + NPK slow release"
                    value={recFertilizer}
                    onChange={(e) => setRecFertilizer(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">প্রুনিং বিবরণ (Pruning Log)</label>
                  <input
                    type="text"
                    placeholder="e.g. Canopy thinning on 15 July"
                    value={recPruning}
                    onChange={(e) => setRecPruning(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-300 font-mono block mb-1">পরবর্তী মেইনটেন্যান্স তারিখ</label>
                  <input
                    type="date"
                    value={recNextDate}
                    onChange={(e) => setRecNextDate(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="sm:col-span-2 md:col-span-3">
                  <label className="font-semibold text-stone-300 font-mono block mb-1">ডাক্তার ভিজিট রিপোর্ট ও পরামর্শ (Doctor Notes)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. ছত্রাক সম্পূর্ণরূপে নিয়ন্ত্রণে। আগামী সিজনে প্রচুর মুকুল আসার অনুকূল অবস্থা রয়েছে।"
                    value={recDoctorNotes}
                    onChange={(e) => setRecDoctorNotes(e.target.value)}
                    className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingRecord(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  ✓ সেভ করুন
                </button>
              </div>
            </form>
          )}

          {/* Plant Records Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#18221A]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/10 hover:border-emerald-500/40 shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start gap-4">
                  {rec.photoUrl && (
                    <div
                      onClick={() => setSelectedPhoto(rec.photoUrl || null)}
                      className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-white/10 bg-black/40 cursor-pointer"
                    >
                      <img src={rec.photoUrl} alt={rec.plantName} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <span className="text-[10px] font-mono text-stone-400 block">{rec.location}</span>
                    <h4 className="font-bold text-white text-base font-serif">{rec.plantName}</h4>
                    {rec.nextMaintenanceDate && (
                      <span className="inline-block mt-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        পরবর্তী ভিজিট: {rec.nextMaintenanceDate}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeletePlantRecord(rec.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors cursor-pointer text-xs h-fit"
                    title="রেকর্ড মুছুন"
                  >
                    🗑️
                  </button>
                </div>

                {/* Medical History Breakdown */}
                <div className="bg-black/35 p-3.5 rounded-2xl border border-white/10 text-xs space-y-2">
                  {rec.diseaseHistory && (
                    <div>
                      <span className="text-stone-400 text-[10px] block font-bold">রোগের ইতিহাস (Disease):</span>
                      <p className="text-rose-300 font-medium">{rec.diseaseHistory}</p>
                    </div>
                  )}
                  {rec.treatment && (
                    <div>
                      <span className="text-stone-400 text-[10px] block font-bold">চিকিৎসা (Treatment):</span>
                      <p className="text-emerald-300 font-medium">{rec.treatment}</p>
                    </div>
                  )}
                  {rec.fertilizer && (
                    <div>
                      <span className="text-stone-400 text-[10px] block font-bold">সার প্রয়োগ (Fertilizer):</span>
                      <p className="text-stone-300">{rec.fertilizer}</p>
                    </div>
                  )}
                  {rec.doctorReport && (
                    <div className="pt-1 border-t border-white/10">
                      <span className="text-emerald-400 text-[10px] block font-bold">ডাক্তার রিপোর্ট:</span>
                      <p className="text-stone-300 italic">"{rec.doctorReport}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#18221A] border border-white/15 rounded-3xl overflow-hidden p-3 shadow-2xl">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-black"
            >
              ✕
            </button>
            <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black">
              <img src={selectedPhoto} alt="Tree Plant" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
