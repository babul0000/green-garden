"use client";

import React, { useState, useEffect, useMemo } from "react";
import { InvoiceItem, Quotation } from "./types";
import { formatTaka } from "@/lib/formatters";

interface InvoicesPaymentsProps {
  quotations?: Quotation[];
  onRefreshFinance?: () => void;
}

export default function InvoicesPayments({
  quotations = [],
  onRefreshFinance,
}: InvoicesPaymentsProps) {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<InvoiceItem | null>(null);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<InvoiceItem | null>(null);
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false);

  // Record Payment form state
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState("BKASH");
  const [payTrxId, setPayTrxId] = useState("");
  const [payReceivedBy, setPayReceivedBy] = useState("");
  const [payNotes, setPayNotes] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);

  // Create Invoice from Quote form state
  const [selectedQuoteId, setSelectedQuoteId] = useState("");
  const [invDueDate, setInvDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [invNotes, setInvNotes] = useState("");
  const [submittingCreate, setSubmittingCreate] = useState(false);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/invoices", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data);
      }
    } catch (err) {
      console.error("Failed to load invoices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filtered Invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        (inv.clientPhone && inv.clientPhone.includes(q));

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "UNPAID" && (inv.status === "DUE" || inv.status === "UNPAID")) ||
        (statusFilter === "PARTIAL" && inv.status === "PARTIALLY_PAID") ||
        (statusFilter === "PAID" && inv.status === "PAID") ||
        (statusFilter === "OVERDUE" && inv.status === "OVERDUE");

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Aggregate Stats
  const stats = useMemo(() => {
    const totalBilled = invoices.reduce((acc, inv) => acc + (inv.totalAmount || 0), 0);
    const totalPaid = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
    const totalDue = invoices.reduce((acc, inv) => acc + (inv.dueAmount || 0), 0);
    return { totalBilled, totalPaid, totalDue, count: invoices.length };
  }, [invoices]);

  // Handle Record Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || !payAmount) return;

    setSubmittingPayment(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: paymentModalInvoice.id,
          amount: parseFloat(payAmount),
          paymentMethod: payMethod,
          transactionId: payTrxId || null,
          receivedBy: payReceivedBy || null,
          notes: payNotes || null,
        }),
      });

      if (res.ok) {
        await fetchInvoices();
        if (onRefreshFinance) onRefreshFinance();
        setPaymentModalInvoice(null);
        setPayAmount("");
        setPayTrxId("");
        setPayNotes("");
      } else {
        const err = await res.json();
        alert(err.error || "পেমেন্ট সংরক্ষণ ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingPayment(false);
    }
  };

  // Handle Create Invoice from Quotation
  const handleCreateFromQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuoteId) return;

    setSubmittingCreate(true);
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "CREATE_FROM_QUOTATION",
          quotationId: selectedQuoteId,
          dueDate: invDueDate,
          notes: invNotes,
        }),
      });

      if (res.ok) {
        await fetchInvoices();
        if (onRefreshFinance) onRefreshFinance();
        setIsCreatingInvoice(false);
        setSelectedQuoteId("");
        setInvNotes("");
      } else {
        const err = await res.json();
        alert(err.error || "ইনভয়েস তৈরি ব্যর্থ হয়েছে");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setSubmittingCreate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Aggregation Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[10px] font-mono uppercase text-stone-400 block tracking-wider">মোট ইনভয়েস</span>
          <span className="text-xl sm:text-2xl font-bold font-serif text-white mt-1 block">
            {stats.count} টি
          </span>
        </div>
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[10px] font-mono uppercase text-emerald-400 block tracking-wider">সর্বমোট বিল্ড</span>
          <span className="text-xl sm:text-2xl font-bold font-serif text-emerald-400 mt-1 block">
            {formatTaka(stats.totalBilled)}
          </span>
        </div>
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
          <span className="text-[10px] font-mono uppercase text-blue-400 block tracking-wider">সংগৃহীত পেমেন্ট</span>
          <span className="text-xl sm:text-2xl font-bold font-serif text-blue-400 mt-1 block">
            {formatTaka(stats.totalPaid)}
          </span>
        </div>
        <div className="bg-[#18221A]/85 backdrop-blur-xl p-4 sm:p-5 rounded-2xl border border-rose-500/30 bg-rose-950/15 shadow-lg">
          <span className="text-[10px] font-mono uppercase text-rose-300 block tracking-wider">সর্বমোট বকেয়া (Outstanding)</span>
          <span className="text-xl sm:text-2xl font-bold font-serif text-rose-400 mt-1 block">
            {formatTaka(stats.totalDue)}
          </span>
        </div>
      </div>

      {/* Toolbar: Search, Filter & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-[#18221A]/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2 flex-grow">
          <input
            type="text"
            placeholder="ইনভয়েস নম্বর বা ক্লায়েন্টের নাম..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/40 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-emerald-400 flex-grow sm:max-w-xs"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-black/50 border border-white/15 rounded-xl px-3 py-2 text-xs text-stone-200 font-semibold focus:outline-none focus:border-emerald-400"
          >
            <option value="ALL" className="bg-[#18221A]">সব স্ট্যাটাস</option>
            <option value="UNPAID" className="bg-[#18221A]">বকেয়া (Unpaid/Due)</option>
            <option value="PARTIAL" className="bg-[#18221A]">আংশিক পরিশোধ (Partial)</option>
            <option value="PAID" className="bg-[#18221A]">পরিশোধিত (Paid)</option>
            <option value="OVERDUE" className="bg-[#18221A]">মেয়াদোত্তীর্ণ (Overdue)</option>
          </select>
        </div>

        <button
          onClick={() => setIsCreatingInvoice(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
        >
          <span>🧾</span> কোটেশন থেকে ইনভয়েস তৈরি
        </button>
      </div>

      {/* Invoice List Table */}
      <div className="bg-[#18221A]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-12 text-center text-stone-400 text-xs">
            <span className="w-6 h-6 border-2 border-emerald-400/20 border-t-emerald-400 rounded-full animate-spin inline-block mb-2"></span>
            <p>ইনভয়েস লোড হচ্ছে...</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-stone-400 text-xs italic">
            কোনো ইনভয়েস পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.04] text-stone-400 font-mono text-[10px] uppercase border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">ইনভয়েস নম্বর</th>
                  <th className="py-3 px-4">ক্লায়েন্ট ও যোগাযোগ</th>
                  <th className="py-3 px-4 text-right">মোট বিল</th>
                  <th className="py-3 px-4 text-right">পরিশোধিত</th>
                  <th className="py-3 px-4 text-right">বকেয়া</th>
                  <th className="py-3 px-4">স্ট্যাটাস</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {inv.invoiceNumber}
                      {inv.dueDate && (
                        <span className="block text-[10px] font-mono text-stone-400 font-normal">
                          মেয়াদ: {new Date(inv.dueDate).toLocaleDateString("bn-BD")}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-stone-200 block">{inv.clientName}</span>
                      {inv.clientPhone && (
                        <span className="text-[10px] text-stone-400 font-mono">{inv.clientPhone}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      {formatTaka(inv.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                      {formatTaka(inv.paidAmount)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-400">
                      {formatTaka(inv.dueAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          inv.status === "PAID"
                            ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                            : inv.status === "PARTIALLY_PAID"
                            ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                            : "bg-rose-500/15 text-rose-300 border-rose-500/30"
                        }`}
                      >
                        {inv.status === "PAID"
                          ? "PAID"
                          : inv.status === "PARTIALLY_PAID"
                          ? "PARTIAL"
                          : "DUE"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.dueAmount > 0 && (
                          <button
                            onClick={() => {
                              setPaymentModalInvoice(inv);
                              setPayAmount(inv.dueAmount.toString());
                            }}
                            className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                            title="পেমেন্ট এন্ট্রি করুন"
                          >
                            + পেমেন্ট
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedInvoiceForPrint(inv)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-lg text-[10px] font-semibold transition-all cursor-pointer"
                          title="ইনভয়েস ভিউ ও প্রিন্ট"
                        >
                          🖨️ প্রিন্ট
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: Create Invoice from Quotation */}
      {isCreatingInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateFromQuotation}
            className="max-w-md w-full bg-[#18221A] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in-up"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base font-serif">কোটেশন থেকে ইনভয়েস তৈরি</h3>
              <button
                type="button"
                onClick={() => setIsCreatingInvoice(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-semibold block mb-1">কোটেশন নির্বাচন করুন *</label>
                <select
                  required
                  value={selectedQuoteId}
                  onChange={(e) => setSelectedQuoteId(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400 font-semibold"
                >
                  <option value="" className="bg-[#18221A]">-- কোটেশন বেছে নিন --</option>
                  {quotations.map((q) => (
                    <option key={q.id} value={q.id} className="bg-[#18221A]">
                      {q.quotationNumber} - {q.clientName} ({formatTaka(q.total)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">পেমেন্ট মেয়াদের শেষ তারিখ (Due Date)</label>
                <input
                  type="date"
                  value={invDueDate}
                  onChange={(e) => setInvDueDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">অতিরিক্ত নোট বা শর্তাবলী</label>
                <textarea
                  rows={2}
                  value={invNotes}
                  onChange={(e) => setInvNotes(e.target.value)}
                  placeholder="e.g. কাজের অগ্রগতির সাথে ৫০% পরিশোধযোগ্য"
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsCreatingInvoice(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={submittingCreate}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {submittingCreate ? "তৈরি হচ্ছে..." : "✓ ইনভয়েস জেনারেট করুন"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: Record Payment */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleRecordPayment}
            className="max-w-md w-full bg-[#18221A] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 animate-fade-in-up"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-white text-base font-serif">পেমেন্ট রেকর্ড করুন</h3>
                <span className="text-[11px] font-mono text-emerald-400">
                  {paymentModalInvoice.invoiceNumber} • {paymentModalInvoice.clientName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-black/40 p-3 rounded-2xl border border-white/10 text-xs flex justify-between">
              <div>
                <span className="text-stone-400 block text-[10px]">মোট বিল</span>
                <span className="font-bold text-white font-mono">{formatTaka(paymentModalInvoice.totalAmount)}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">ইতিমধ্যে প্রাপ্ত</span>
                <span className="font-bold text-emerald-400 font-mono">{formatTaka(paymentModalInvoice.paidAmount)}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px]">বর্তমান বকেয়া</span>
                <span className="font-bold text-rose-400 font-mono">{formatTaka(paymentModalInvoice.dueAmount)}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 font-semibold block mb-1">প্রাপ্ত টাকার পরিমাণ (টাকা) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentModalInvoice.dueAmount}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white font-mono font-bold focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">পেমেন্ট মাধ্যম (Payment Method) *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white font-semibold focus:outline-none focus:border-emerald-400"
                >
                  <option value="BKASH" className="bg-[#18221A]">bKash (বিকাশ)</option>
                  <option value="NAGAD" className="bg-[#18221A]">Nagad (নগদ অ্যাপ)</option>
                  <option value="BANK_TRANSFER" className="bg-[#18221A]">Bank Transfer (ব্যাংক ট্রান্সফার)</option>
                  <option value="CASH" className="bg-[#18221A]">Cash (সরাসরি নগদ গ্রহণ)</option>
                </select>
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">Transaction ID / রেফারেন্স (প্রযোজ্য ক্ষেত্রে)</label>
                <input
                  type="text"
                  placeholder="e.g. 9J28DA109X"
                  value={payTrxId}
                  onChange={(e) => setPayTrxId(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white font-mono placeholder-white/30 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-stone-300 font-semibold block mb-1">গ্রহণকারী স্টাফ / একাউন্টস অফিসার</label>
                <input
                  type="text"
                  placeholder="e.g. মোঃ রাজিব (হিসাব শাখা)"
                  value={payReceivedBy}
                  onChange={(e) => setPayReceivedBy(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setPaymentModalInvoice(null)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-stone-300 rounded-xl text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={submittingPayment}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs transition-all disabled:opacity-50"
              >
                {submittingPayment ? "সংরক্ষণ হচ্ছে..." : "✓ পেমেন্ট কনফার্ম করুন"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 3: Print / PDF View */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white text-stone-900 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print:p-0 print:m-0 print:shadow-none">
            {/* Header with Print Controls */}
            <div className="flex justify-between items-start border-b border-stone-200 pb-4 print:hidden">
              <div>
                <span className="text-xs font-mono text-stone-500 block">ইনভয়েস প্রিভিউ ও প্রিন্ট</span>
                <h4 className="font-bold text-stone-900 text-lg font-serif">A R GREEN GARDEN</h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  🖨️ প্রিন্ট / PDF সংরক্ষণ
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPrint(null)}
                  className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Invoice Slip */}
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-emerald-800">A R Green Garden</h2>
                  <p className="text-xs text-stone-500 leading-relaxed mt-0.5">
                    ল্যান্ডস্কেপ আর্কিটেকচার ও ছাদ বাগান বিশেষজ্ঞ<br />
                    ধানমন্ডি, ঢাকা, বাংলাদেশ • হেল্পলাইন: 01883012641
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-mono text-stone-900 block">INVOICE</span>
                  <span className="text-xs font-mono font-bold text-stone-600 block mt-0.5">
                    #{selectedInvoiceForPrint.invoiceNumber}
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    তারিখ: {new Date(selectedInvoiceForPrint.createdAt).toLocaleDateString("bn-BD")}
                  </span>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs grid grid-cols-2 gap-3">
                <div>
                  <span className="text-stone-500 text-[10px] block uppercase font-mono">বিল প্রাপক (Billed To):</span>
                  <span className="font-bold text-stone-900 text-sm block mt-0.5">{selectedInvoiceForPrint.clientName}</span>
                  {selectedInvoiceForPrint.clientPhone && (
                    <span className="text-stone-600 font-mono block">{selectedInvoiceForPrint.clientPhone}</span>
                  )}
                </div>
                {selectedInvoiceForPrint.project && (
                  <div>
                    <span className="text-stone-500 text-[10px] block uppercase font-mono">প্রজেক্ট:</span>
                    <span className="font-bold text-stone-900 block mt-0.5">{selectedInvoiceForPrint.project.name}</span>
                    <span className="text-stone-600 block">{selectedInvoiceForPrint.project.location}</span>
                  </div>
                )}
              </div>

              {/* Itemized summary from Quotation if attached */}
              {selectedInvoiceForPrint.quotation?.items && selectedInvoiceForPrint.quotation.items.length > 0 && (
                <div className="border border-stone-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-100 text-stone-600 font-mono uppercase text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">বিবরণ (Item)</th>
                        <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                        <th className="py-2.5 px-3 text-right">একক মূল্য</th>
                        <th className="py-2.5 px-3 text-right">মোট</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {selectedInvoiceForPrint.quotation.items.map((item: any, i: number) => (
                        <tr key={i}>
                          <td className="py-2 px-3 font-medium text-stone-800">{item.itemTitle}</td>
                          <td className="py-2 px-3 text-center font-mono">{item.quantity} {item.unit}</td>
                          <td className="py-2 px-3 text-right font-mono">{formatTaka(item.unitPrice)}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold">{formatTaka(item.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals Calculation */}
              <div className="flex justify-end text-xs">
                <div className="w-64 space-y-2 border-t border-stone-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-stone-600">সর্বমোট বিল:</span>
                    <span className="font-mono font-bold text-stone-900">{formatTaka(selectedInvoiceForPrint.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>পরিশোধিত:</span>
                    <span className="font-mono font-bold">{formatTaka(selectedInvoiceForPrint.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between text-rose-700 font-bold border-t border-stone-200 pt-2 text-sm">
                    <span>বকেয়া (Balance Due):</span>
                    <span className="font-mono">{formatTaka(selectedInvoiceForPrint.dueAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Payment History Log */}
              {selectedInvoiceForPrint.payments && selectedInvoiceForPrint.payments.length > 0 && (
                <div className="border-t border-stone-200 pt-3 text-xs">
                  <span className="font-bold text-stone-700 block mb-2 font-mono text-[11px] uppercase">
                    পেমেন্ট হিস্ট্রি (Payment Transactions):
                  </span>
                  <div className="space-y-1 font-mono text-[11px] text-stone-600">
                    {selectedInvoiceForPrint.payments.map((p) => (
                      <div key={p.id} className="flex justify-between bg-stone-50 px-2 py-1 rounded">
                        <span>
                          {new Date(p.paymentDate).toLocaleDateString("bn-BD")} • {p.paymentMethod} {p.transactionId ? `(Trx: ${p.transactionId})` : ""}
                        </span>
                        <span className="font-bold text-emerald-700">{formatTaka(p.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
