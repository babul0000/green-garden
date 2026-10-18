"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ActivityLogItem {
  id: string;
  userId?: string | null;
  userName: string;
  action: string;
  entity: string;
  entityId?: string | null;
  summary: string;
  details?: Record<string, any> | null;
  createdAt: string;
}

export default function ActivityLogTab() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search.trim()) params.append("search", search.trim());
      if (entityFilter) params.append("entity", entityFilter);
      if (actionFilter) params.append("action", actionFilter);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await fetch(`/api/admin/activity-logs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, entityFilter, actionFilter, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLogs();
  };

  const handleClearFilters = () => {
    setSearch("");
    setEntityFilter("");
    setActionFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case "CREATE":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">যোগ (CREATE)</span>;
      case "UPDATE":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">হালনাগাদ (UPDATE)</span>;
      case "DELETE":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">মুছে ফেলা (DELETE)</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-500/15 text-stone-300 border border-stone-500/30">{action}</span>;
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString("bn-BD", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in font-sans">
      {/* Top Banner */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl text-[#E4E2D7] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 mb-2">
            📋 Audit & Security Trail
          </div>
          <h3 className="font-sans font-bold text-xl sm:text-2xl text-[#E4E2D7]">অ্যাডমিন অ্যাক্টিভিটি লগ</h3>
          <p className="text-xs text-white/60 mt-1">
            স্টুডিও অ্যাডমিন ও এডিটরদের সকল সংযোজন, পরিবর্তন ও মুছে ফেলার অডিট ট্রেইল পর্যবেক্ষণ করুন।
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span className="text-white/50 text-[10px] block font-mono uppercase">মোট রেকর্ড</span>
            <span className="font-bold text-emerald-400 text-sm">{total} টি কার্যকলাপ</span>
          </div>
          <button
            onClick={() => fetchLogs()}
            disabled={loading}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            রিফ্রেশ
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#D6D2C4] shadow-xs flex flex-col gap-4 text-xs">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Keyword Search */}
          <div className="lg:col-span-2 flex flex-col gap-1">
            <label className="text-[#2D3B2D] font-semibold text-[11px]">সার্চ (বিবরণ, ব্যবহারকারী বা এনটিটি)</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="কীওয়ার্ড দিয়ে খুঁজুন..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#D6D2C4] bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4D33]/30"
            />
          </div>

          {/* Entity Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[#2D3B2D] font-semibold text-[11px]">এনটিটি / বিভাগ</label>
            <select
              value={entityFilter}
              onChange={(e) => {
                setEntityFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#D6D2C4] bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4D33]/30"
            >
              <option value="">সব এনটিটি (All)</option>
              <option value="Project">Project (প্রজেক্ট)</option>
              <option value="Service">Service (সার্ভিস)</option>
              <option value="User">User (ব্যবহারকারী)</option>
              <option value="Invoice">Invoice (ইনভয়েস)</option>
              <option value="Settings">Settings (সেটিংস)</option>
              <option value="DigitalServiceCard">Digital Service Card</option>
            </select>
          </div>

          {/* Action Filter */}
          <div className="flex flex-col gap-1">
            <label className="text-[#2D3B2D] font-semibold text-[11px]">অ্যাকশন টাইপ</label>
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-xl border border-[#D6D2C4] bg-[#F9F9FB] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2B4D33]/30"
            >
              <option value="">সব অ্যাকশন (All)</option>
              <option value="CREATE">CREATE (সংযোজন)</option>
              <option value="UPDATE">UPDATE (হালনাগাদ)</option>
              <option value="DELETE">DELETE (মুছে ফেলা)</option>
            </select>
          </div>

          {/* Filter Actions */}
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 min-h-[40px] px-3 py-2 rounded-xl bg-[#2B4D33] text-white font-medium hover:bg-[#1E3624] transition-colors"
            >
              ফিল্টার প্রয়োগ
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              title="ফিল্টার রিসেট করুন"
              className="min-h-[40px] px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#555] font-medium transition-colors"
            >
              রিসেট
            </button>
          </div>
        </form>

        {/* Date Filter Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#EAE7DC]">
          <span className="text-[11px] text-[#75787B] font-medium">তারিখ ফিল্টার:</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1 rounded-lg border border-[#D6D2C4] text-[11px] bg-white"
            />
            <span className="text-[#888]">থেকে</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1 rounded-lg border border-[#D6D2C4] text-[11px] bg-white"
            />
          </div>
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="bg-white rounded-2xl border border-[#D6D2C4] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-sm text-[#75787B] flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#2B4D33] border-t-transparent animate-spin"></div>
            অ্যাক্টিভিটি রেকর্ড লোড হচ্ছে...
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#75787B] flex flex-col items-center gap-2">
            <span className="text-3xl">📭</span>
            <span>কোনো অ্যাক্টিভিটি লগ রেকর্ড পাওয়া যায়নি।</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F9F9FB] border-b border-[#E4E2D7] text-[#75787B] uppercase tracking-wider font-semibold text-[10px]">
                  <th className="py-3.5 px-4">সময়কাল</th>
                  <th className="py-3.5 px-4">ব্যবহারকারী</th>
                  <th className="py-3.5 px-4">অ্যাকশন</th>
                  <th className="py-3.5 px-4">এনটিটি</th>
                  <th className="py-3.5 px-4">বিবরণ (Summary)</th>
                  <th className="py-3.5 px-4 text-right">বিস্তারিত</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE7DC]">
                {logs.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-[#F9F9FB] transition-colors">
                      <td className="py-3.5 px-4 text-[#555] font-mono whitespace-nowrap text-[11px]">
                        {formatTimestamp(item.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#121813] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-[#2B4D33]/10 text-[#2B4D33] flex items-center justify-center text-[10px] font-bold">
                            {item.userName ? item.userName.charAt(0).toUpperCase() : "U"}
                          </span>
                          <span>{item.userName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getActionBadge(item.action)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2B4D33] font-semibold whitespace-nowrap">
                        {item.entity}
                      </td>
                      <td className="py-3.5 px-4 text-[#2D3B2D] font-medium max-w-md">
                        {item.summary}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {item.details ? (
                          <button
                            type="button"
                            onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                            className="px-2.5 py-1 rounded-lg border border-[#D6D2C4] hover:bg-[#EAE7DC] text-[#2B4D33] font-medium text-[11px] transition-colors"
                          >
                            {expandedId === item.id ? "লুকান ▲" : "তথ্য ▼"}
                          </button>
                        ) : (
                          <span className="text-[#AAA] text-[10px]">—</span>
                        )}
                      </td>
                    </tr>
                    {expandedId === item.id && item.details && (
                      <tr className="bg-[#F5F4EE]">
                        <td colSpan={6} className="p-4 border-b border-[#D6D2C4]">
                          <div className="bg-white p-3 rounded-xl border border-[#D6D2C4] font-mono text-[11px] text-[#333] overflow-x-auto max-h-48">
                            <pre>{JSON.stringify(item.details, null, 2)}</pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#EAE7DC] bg-[#F9F9FB] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#75787B]">
            <div>
              পৃষ্ঠা <span className="font-semibold text-[#121813]">{page}</span> / {totalPages} (মোট {total} রেকর্ড)
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#D6D2C4] bg-white hover:bg-stone-50 disabled:opacity-40 transition-colors"
              >
                ◀ পূর্ববর্তী
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#D6D2C4] bg-white hover:bg-stone-50 disabled:opacity-40 transition-colors"
              >
                পরবর্তী ▶
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
