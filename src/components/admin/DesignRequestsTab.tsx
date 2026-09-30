"use client";

import React, { useState, useEffect } from "react";

interface DesignRequest {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  spaceType: string;
  designStyle: string;
  features: string[];
  sitePhotoUrl?: string | null;
  approxArea: string;
  budgetRange: string;
  status: "NEW" | "CONTACTED" | "QUOTED" | "CONVERTED" | string;
  adminNotes?: string | null;
  createdAt: string;
}

interface DesignRequestsTabProps {
  setActiveTab?: (tab: string) => void;
  onSelectForQuotation?: (client: { name: string; phone: string; email?: string; notes?: string }) => void;
}

export default function DesignRequestsTab({ setActiveTab, onSelectForQuotation }: DesignRequestsTabProps) {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<DesignRequest | null>(null);
  const [photoModalUrl, setPhotoModalUrl] = useState<string | null>(null);

  // Fetch design requests from API
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/design-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch design requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    // Optimistic update
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }

    try {
      await fetch("/api/design-requests", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status in DB:", err);
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this design request?")) return;
    try {
      const res = await fetch(`/api/design-requests?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setRequests((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete request:", err);
    }
  };


  const filtered = requests.filter((r) => {
    const matchesStatus = filterStatus === "ALL" || r.status === filterStatus;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.spaceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.designStyle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <span className="bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full">New Lead (নতুন)</span>;
      case "CONTACTED":
        return <span className="bg-blue-500/10 text-blue-700 border border-blue-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full">Contacted (যোগাযোগকৃত)</span>;
      case "QUOTED":
        return <span className="bg-amber-500/10 text-amber-700 border border-amber-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full">Quotation Sent (কোটেশন প্রেরিত)</span>;
      case "CONVERTED":
        return <span className="bg-purple-500/10 text-purple-700 border border-purple-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full">Converted (প্রজেক্ট ফাইনাল)</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2.5 py-1 rounded-full">{status}</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <span>🎨</span> ধাপ ৪ • Design Your Garden Wizard Submissions
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 tracking-tight">
            গার্ডেন ডিজাইন রিকোয়েস্ট ও লিড ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            গ্রাহকদের ৬-ধাপের ইন্টারেক্টিভ উইজার্ড থেকে আসা রিকোয়েস্টসমূহ পর্যালোচনা করুন এবং কোটেশনে রূপান্তর করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchRequests}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-2"
          >
            <span>🔄</span> রিফ্রেশ
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {["ALL", "NEW", "CONTACTED", "QUOTED", "CONVERTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-[#06120c] text-[#91cd3d] shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {st === "ALL" ? `সবগুলো (${requests.length})` : st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="নাম, ফোন বা স্পেস দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-emerald-600"
          />
          <span className="absolute left-3 top-2.5 text-xs text-gray-400">🔍</span>
        </div>
      </div>

      {/* Requests Grid / Table */}
      {loading ? (
        <div className="p-16 flex flex-col items-center justify-center bg-white rounded-3xl border border-gray-200">
          <span className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></span>
          <p className="text-xs text-gray-500 mt-3 font-semibold">রিকোয়েস্ট লোড হচ্ছে...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-gray-200 text-gray-500">
          <span className="text-4xl block mb-2">🌿</span>
          <p className="font-semibold text-sm">কোনো গার্ডেন ডিজাইন রিকোয়েস্ট পাওয়া যায়নি।</p>
          <p className="text-xs text-gray-400 mt-1">গ্রাহক ওয়েবসাইটের "Design Your Garden" উইজার্ড সাবমিট করলে এখানে জমা হবে।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-5 border border-gray-200 hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-gray-400 block">
                      {new Date(req.createdAt).toLocaleDateString("bn-BD")}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base font-serif">{req.name}</h3>
                  </div>
                  {getStatusBadge(req.status)}
                </div>

                {/* Key Spec Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">জায়গা (Space):</span>
                    <span className="font-bold text-gray-800">{req.spaceType}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">স্টাইল (Style):</span>
                    <span className="font-bold text-emerald-800">{req.designStyle}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">আয়তন (Area):</span>
                    <span className="font-bold text-gray-800">{req.approxArea}</span>
                  </div>
                  <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="text-gray-400 block text-[10px]">বাজেট (Budget):</span>
                    <span className="font-bold text-amber-700">{req.budgetRange}</span>
                  </div>
                </div>

                {/* Selected Features */}
                {req.features && req.features.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">নির্বাচিত ফিচার:</span>
                    <div className="flex flex-wrap gap-1">
                      {req.features.map((f, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Site Photo Preview */}
                {req.sitePhotoUrl && (
                  <div className="relative group rounded-xl overflow-hidden aspect-[16/9] border border-gray-200 bg-gray-50 cursor-pointer"
                       onClick={() => setPhotoModalUrl(req.sitePhotoUrl || null)}>
                    <img src={req.sitePhotoUrl} alt="Site" className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-all">
                      📷 ছবি বড় করে দেখুন
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-mono">{req.phone}</span>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${req.phone}`}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="কল করুন"
                    >
                      📞
                    </a>
                    <a
                      href={`https://wa.me/${req.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(req.name)},%20I%20am%20contacting%20you%20from%20AR%20Green%20Garden%20regarding%20your%20Garden%20Design%20Request.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                      title="হোয়াটসঅ্যাপ চ্যাট"
                    >
                      💬
                    </a>
                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      🗑️
                    </button>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-2 mt-1">
                  <select
                    value={req.status}
                    onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-1.5 text-xs text-gray-700 font-semibold focus:outline-none"
                  >
                    <option value="NEW">New (নতুন)</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="QUOTED">Quotation Sent</option>
                    <option value="CONVERTED">Converted</option>
                  </select>

                  <button
                    onClick={() => {
                      if (onSelectForQuotation) {
                        onSelectForQuotation({
                          name: req.name,
                          phone: req.phone,
                          email: req.email || "",
                          notes: `Request for ${req.spaceType} (${req.designStyle}) - Budget: ${req.budgetRange}`,
                        });
                      }
                      if (setActiveTab) {
                        setActiveTab("quotations");
                      }
                    }}
                    className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>🧾</span> কোটেশন বানান
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Photo Lightbox Modal */}
      {photoModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4">
            <button
              onClick={() => setPhotoModalUrl(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-black/80"
            >
              ✕
            </button>
            <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black">
              <img src={photoModalUrl} alt="Site Enlarged" className="w-full h-full object-contain" />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3 font-semibold">গ্রাহকের আপলোড করা সাইটের ছবি</p>
          </div>
        </div>
      )}
    </div>
  );
}
