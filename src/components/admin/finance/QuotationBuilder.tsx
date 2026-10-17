"use client";

import React, { useState, useEffect } from "react";
import { generatePaymentQRCode } from "@/services/invoiceGenerator";
import { Quotation, QuotationItem, QUOTATION_CATEGORIES } from "./types";

interface QuotationBuilderProps {
  quotations: Quotation[];
  onRefresh: () => void | Promise<void>;
}

export default function QuotationBuilder({ quotations, onRefresh }: QuotationBuilderProps) {
  // Smart Quotation Builder State
  const [isBuildingQuote, setIsBuildingQuote] = useState(false);
  const [qClientName, setQClientName] = useState("");
  const [qClientPhone, setQClientPhone] = useState("");
  const [qDiscount, setQDiscount] = useState<number>(0);
  const [qAdvance, setQAdvance] = useState<number>(0);
  const [quoteItems, setQuoteItems] = useState<QuotationItem[]>([
    { category: "Landscape Design", itemTitle: "3D Landscape Architectural Blueprint", quantity: 1, unit: "set", unitPrice: 25000, amount: 25000 },
    { category: "Plants", itemTitle: "Imported Bonsai & Exotic Shrubs", quantity: 15, unit: "pcs", unitPrice: 2000, amount: 30000 },
    { category: "Soil & Media", itemTitle: "Prepared Organic Soil Mix + Cocopeat", quantity: 40, unit: "bags", unitPrice: 350, amount: 14000 },
    { category: "Irrigation", itemTitle: "Automatic Smart Drip Irrigation Unit", quantity: 1, unit: "set", unitPrice: 35000, amount: 35000 },
    { category: "Labour", itemTitle: "Site Preparation, Waterproofing & Planting", quantity: 4, unit: "days", unitPrice: 3000, amount: 12000 },
  ]);

  // Selected Quotation for Print/PDF View
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);
  const [quoteQrUrl, setQuoteQrUrl] = useState<string>("");

  useEffect(() => {
    if (previewQuote) {
      const payAmount = previewQuote.due > 0 ? previewQuote.due : previewQuote.total;
      generatePaymentQRCode(previewQuote.quotationNumber, payAmount).then((res) => {
        setQuoteQrUrl(res.qrDataUrl);
      });
    }
  }, [previewQuote]);

  // Itemized calculations
  const calculateSubtotal = () => quoteItems.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
  const qSubtotal = calculateSubtotal();
  const qTotal = Math.max(0, qSubtotal - qDiscount);
  const qDue = Math.max(0, qTotal - qAdvance);

  const handleItemChange = (index: number, field: string, value: any) => {
    const updated = [...quoteItems];
    const item = { ...updated[index], [field]: value };
    item.amount = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    updated[index] = item;
    setQuoteItems(updated);
  };

  const handleAddItemRow = () => {
    setQuoteItems([
      ...quoteItems,
      { category: "Plants", itemTitle: "New Material / Plant", quantity: 1, unit: "pcs", unitPrice: 1000, amount: 1000 },
    ]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (quoteItems.length > 1) {
      setQuoteItems(quoteItems.filter((_, i) => i !== index));
    }
  };

  const handleSaveQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qClientName) return;

    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: qClientName,
          clientPhone: qClientPhone,
          discount: qDiscount,
          advance: qAdvance,
          items: quoteItems,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        alert(`Quotation ${data.quotationNumber} তৈরি হয়েছে!`);
        setIsBuildingQuote(false);
        onRefresh();
      }
    } catch {
      setIsBuildingQuote(false);
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quotation?")) return;
    try {
      const res = await fetch(`/api/quotations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error("Failed to delete quotation:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#18221A]/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-sm text-[#E4E2D7]">
        <div>
          <h3 className="font-bold text-white text-sm font-serif">প্রফেশনাল আইটেমাইজড কোটেশন</h3>
          <p className="text-xs text-stone-400">প্রতিটি উপাদান (গাছ, মাটি, লেবার, ইরিগেশন) আলাদা দেখিয়ে কোটেশন ও প্রিন্টযোগ্য PDF তৈরি করুন।</p>
        </div>
        <button
          onClick={() => setIsBuildingQuote(!isBuildingQuote)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          {isBuildingQuote ? "✕ বন্ধ করুন" : "+ নতুন কোটেশন তৈরি করুন"}
        </button>
      </div>

      {/* Quotation Builder Modal/Form */}
      {isBuildingQuote && (
        <form onSubmit={handleSaveQuotation} className="bg-[#18221A]/95 backdrop-blur-xl p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-5 animate-fade-in-up text-[#E4E2D7]">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h4 className="font-bold text-emerald-300 text-base">স্মার্ট কোটেশন তৈরি করুন</h4>
            <span className="text-xs font-mono text-stone-400">তারিখ: {new Date().toLocaleDateString("bn-BD")}</span>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-stone-300 block mb-1">গ্রাহকের নাম (Client Name) *</label>
              <input
                type="text"
                required
                placeholder="e.g. ইঞ্জিঃ তানভীর আহমেদ"
                value={qClientName}
                onChange={(e) => setQClientName(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">মোবাইল নম্বর *</label>
              <input
                type="tel"
                inputMode="tel"
                required
                placeholder="01XXXXXXXXX"
                value={qClientPhone}
                onChange={(e) => setQClientPhone(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
          </div>

          {/* Itemized Lines */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">খরচের আইটেমভিত্তিক ব্রেকডাউন</span>
              <button
                type="button"
                onClick={handleAddItemRow}
                className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer font-mono"
              >
                + আরও আইটেম যোগ করুন
              </button>
            </div>

            <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/30">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-stone-400 font-bold font-mono text-[10px] uppercase border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">ক্যাটাগরি</th>
                    <th className="py-2.5 px-3">আইটেমের বিবরণ</th>
                    <th className="py-2.5 px-3 w-20">পরিমাণ</th>
                    <th className="py-2.5 px-3 w-20">একক</th>
                    <th className="py-2.5 px-3 w-24">দর (৳)</th>
                    <th className="py-2.5 px-3 w-24">মোট (৳)</th>
                    <th className="py-2.5 px-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {quoteItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="p-2">
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                          className="w-full bg-black/50 border border-white/15 rounded-lg p-1.5 text-xs text-white"
                        >
                          {QUOTATION_CATEGORIES.map((c) => (
                            <option key={c} value={c} className="bg-[#121A14] text-white">{c}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.itemTitle}
                          onChange={(e) => handleItemChange(idx, "itemTitle", e.target.value)}
                          className="w-full bg-black/50 border border-white/15 rounded-lg p-1.5 text-xs text-white placeholder-white/30"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                          className="w-full bg-black/50 border border-white/15 rounded-lg p-1.5 text-xs text-center text-white font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                          className="w-full bg-black/50 border border-white/15 rounded-lg p-1.5 text-xs text-center text-white"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                          className="w-full bg-black/50 border border-white/15 rounded-lg p-1.5 text-xs text-right font-mono text-white"
                        />
                      </td>
                      <td className="p-2 text-right font-mono font-bold text-white">
                        ৳{item.amount.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="text-rose-400 hover:text-rose-300 font-bold cursor-pointer"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary Calculation */}
          <div className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col items-end gap-2 text-xs">
            <div className="flex justify-between w-64 text-stone-300">
              <span>সাবটোটাল (Subtotal):</span>
              <span className="font-mono font-bold text-white">৳{qSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center w-64 text-stone-300">
              <span>স্পেশাল ছাড় (Discount):</span>
              <div className="flex items-center gap-1">
                <span>৳</span>
                <input
                  type="number"
                  value={qDiscount}
                  onChange={(e) => setQDiscount(Number(e.target.value))}
                  className="w-24 bg-black/50 border border-white/15 rounded-lg p-1 text-right font-mono text-white"
                />
              </div>
            </div>
            <div className="flex justify-between w-64 text-sm font-bold text-white border-t border-white/10 pt-2">
              <span>সর্বমোট বিল (Total):</span>
              <span className="font-mono text-emerald-400">৳{qTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center w-64 text-stone-300">
              <span>অগ্রিম প্রদান (Advance):</span>
              <div className="flex items-center gap-1">
                <span>৳</span>
                <input
                  type="number"
                  value={qAdvance}
                  onChange={(e) => setQAdvance(Number(e.target.value))}
                  className="w-24 bg-black/50 border border-white/15 rounded-lg p-1 text-right font-mono text-emerald-400 font-bold"
                />
              </div>
            </div>
            <div className="flex justify-between w-64 text-sm font-bold text-rose-400 border-t border-dashed border-white/15 pt-2">
              <span>বাকি টাকা (Due Amount):</span>
              <span className="font-mono">৳{qDue.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsBuildingQuote(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              ✓ কোটেশন সংরক্ষণ ও প্রিন্ট ভিউ
            </button>
          </div>
        </form>
      )}

      {/* Quotations List Table */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl text-[#E4E2D7]">
        <div className="p-4 bg-white/[0.03] border-b border-white/10 flex justify-between items-center">
          <span className="text-xs font-bold text-stone-300 uppercase tracking-wider font-mono">সংরক্ষিত কোটেশন ও ইনভয়েস হিস্ট্রি</span>
          <span className="text-xs text-stone-400 font-mono">মোট: {quotations.length}টি</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-stone-400 font-bold font-mono text-[10px] uppercase border-b border-white/10">
              <tr>
                <th className="py-3 px-4">কোটেশন আইডি</th>
                <th className="py-3 px-4">গ্রাহক</th>
                <th className="py-3 px-4">মোট বিল (৳)</th>
                <th className="py-3 px-4">অগ্রিম (৳)</th>
                <th className="py-3 px-4">বাকি (৳)</th>
                <th className="py-3 px-4">স্ট্যাটাস</th>
                <th className="py-3 px-4 text-center">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">{q.quotationNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {q.clientName}
                    <span className="block text-[10px] font-mono text-stone-400 font-normal">{q.clientPhone}</span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">৳{q.total.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono text-emerald-400">৳{q.advance.toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-400">৳{q.due.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      {q.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setPreviewQuote(q)}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-white/80 border border-white/10 rounded-lg text-xs font-bold transition-all cursor-pointer font-mono"
                      >
                        🖨️ PDF
                      </button>
                      <button
                        onClick={() => handleDeleteQuotation(q.id)}
                        className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs transition-colors cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF / Print Quotation Preview Modal */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-[#141E16] text-[#E4E2D7] rounded-3xl overflow-hidden shadow-2xl p-8 max-h-[90vh] overflow-y-auto border border-white/15 print:p-0 print:bg-white print:text-black">
            <button
              onClick={() => setPreviewQuote(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-white/20 print:hidden"
            >
              ✕
            </button>

            {/* Official Letterhead */}
            <div className="flex justify-between items-start border-b border-white/10 pb-6">
              <div>
                <h2 className="text-2xl font-serif font-extrabold text-emerald-400 tracking-tight">A R GREEN GARDEN</h2>
                <p className="text-xs text-stone-400 mt-1">Professional Landscape Architecture & Garden Care</p>
                <p className="text-xs text-stone-400 font-mono">42/A, Road 9/A, Dhanmondi, Dhaka • Hotline: 01883012641</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block font-mono">OFFICIAL QUOTATION</span>
                <span className="font-mono font-bold text-sm text-white">{previewQuote.quotationNumber}</span>
                <span className="text-xs text-stone-400 block mt-1 font-mono">
                  তারিখ: {new Date(previewQuote.createdAt).toLocaleDateString("bn-BD")}
                </span>
              </div>
            </div>

            {/* Client Info */}
            <div className="py-4 border-b border-white/10 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-stone-400 block">কোটেশন প্রাপক:</span>
                <span className="font-bold text-white text-sm">{previewQuote.clientName}</span>
                <span className="block font-mono text-stone-400">{previewQuote.clientPhone}</span>
              </div>
              <div className="text-right">
                <span className="text-stone-400 block">প্রস্তাবিত প্রকল্প:</span>
                <span className="font-semibold text-emerald-300">Rooftop / Landscape Garden Project</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="py-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-stone-400 font-bold font-mono border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">আইটেমের বিবরণ</th>
                    <th className="py-2.5 px-3">ক্যাটাগরি</th>
                    <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                    <th className="py-2.5 px-3 text-right">দর (৳)</th>
                    <th className="py-2.5 px-3 text-right">মোট (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {previewQuote.items && previewQuote.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-mono text-stone-500">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-white">{it.itemTitle}</td>
                      <td className="py-2.5 px-3 text-stone-400">{it.category}</td>
                      <td className="py-2.5 px-3 text-center font-mono text-stone-300">{it.quantity} {it.unit}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-stone-300">৳{it.unitPrice.toLocaleString()}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">৳{it.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals & Dynamic bKash/Nagad QR Code */}
            <div className="border-t border-white/10 pt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Dynamic bKash / Nagad Merchant Payment QR */}
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 print:border-black/20 print:bg-stone-50">
                {quoteQrUrl ? (
                  <img
                    src={quoteQrUrl}
                    alt="bKash Merchant Payment QR"
                    className="w-24 h-24 rounded-xl bg-white p-1.5 shadow-md shrink-0 border border-white/10"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-white/10 flex items-center justify-center text-[10px] font-mono text-stone-400 shrink-0">
                    QR জেনারেটিং...
                  </div>
                )}
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 inline-block mb-1">
                    📱 bKash / Nagad Instant Pay
                  </span>
                  <h5 className="font-bold text-white text-xs print:text-black">স্ক্যান করে সরাসরি পেমেন্ট করুন</h5>
                  <p className="text-[11px] text-stone-400 print:text-stone-600 mt-0.5 leading-snug">
                    বিকাশ বা নগদ অ্যাপ ওপেন করে কিউআর কোড স্ক্যান করুন ও রেফারেন্সে <span className="font-mono text-emerald-400 font-bold">{previewQuote.quotationNumber}</span> লিখুন।
                  </p>
                  <span className="text-[10px] font-mono text-emerald-400 print:text-emerald-700 block mt-1">
                    মার্চেন্ট নম্বর: 01883012641
                  </span>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="flex justify-end">
                <div className="w-full max-w-xs space-y-1.5 text-xs text-stone-300 print:text-black">
                  <div className="flex justify-between">
                    <span>সাবটোটাল:</span>
                    <span className="font-mono font-bold text-white print:text-black">৳{previewQuote.subtotal.toLocaleString()}</span>
                  </div>
                  {previewQuote.discount > 0 && (
                    <div className="flex justify-between text-emerald-400 print:text-emerald-700">
                      <span>ছাড় (Discount):</span>
                      <span className="font-mono">-৳{previewQuote.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-white print:text-black border-t border-white/10 print:border-black/20 pt-1">
                    <span>সর্বমোট বিল:</span>
                    <span className="font-mono text-emerald-400 print:text-emerald-700">৳{previewQuote.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-300 print:text-emerald-800">
                    <span>পরিশোধিত অগ্রিম:</span>
                    <span className="font-mono font-bold">৳{previewQuote.advance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-rose-400 print:text-rose-700 border-t border-dashed border-white/15 print:border-black/20 pt-1">
                    <span>বাকি টাকা (Due):</span>
                    <span className="font-mono">৳{previewQuote.due.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center print:hidden">
              <span className="text-xs text-stone-400 font-medium">স্বাক্ষরিত ও ভেরিফাইড বাই A R Green Garden</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  🖨️ প্রিন্ট / PDF সেভ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
