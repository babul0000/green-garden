"use client";

import React, { useState, useEffect } from "react";

interface QuotationItem {
  category: string;
  itemTitle: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
}

interface Quotation {
  id: string;
  quotationNumber: string;
  clientName: string;
  clientPhone?: string | null;
  subtotal: number;
  discount: number;
  total: number;
  advance: number;
  due: number;
  status: string;
  createdAt: string;
  items: QuotationItem[];
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stockQuantity: number;
  minThreshold: number;
  unit: string;
  unitCost: number;
  isLowStock?: boolean;
}

interface AccountingData {
  summary: {
    totalIncome: number;
    totalExpense: number;
    netProfit: number;
    profitMargin: string;
  };
  incomeBreakdown: Record<string, { label: string; amount: number }>;
  expenseBreakdown: Record<string, { label: string; amount: number }>;
}

export default function FinanceInventoryTab() {
  const [subTab, setSubTab] = useState<"quotation" | "inventory" | "accounting">("quotation");
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [accounting, setAccounting] = useState<AccountingData | null>(null);
  const [loading, setLoading] = useState(true);

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

  // New Inventory Item State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [invName, setInvName] = useState("");
  const [invCategory, setInvCategory] = useState("PLANT");
  const [invQty, setInvQty] = useState(50);
  const [invMin, setInvMin] = useState(15);
  const [invUnit, setInvUnit] = useState("pcs");
  const [invCost, setInvCost] = useState(500);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Quotations
      const qRes = await fetch("/api/quotations");
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuotations(qData);
      }

      // 2. Fetch Inventory
      const invRes = await fetch("/api/inventory");
      if (invRes.ok) {
        const iData = await invRes.json();
        setInventory(iData.items || []);
      }

      // 3. Fetch Accounting
      const accRes = await fetch("/api/accounting");
      if (accRes.ok) {
        const aData = await accRes.json();
        setAccounting(aData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

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
        fetchFinanceData();
      }
    } catch {
      setIsBuildingQuote(false);
    }
  };

  const handleSaveInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName) return;

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: invName,
          category: invCategory,
          stockQuantity: invQty,
          minThreshold: invMin,
          unit: invUnit,
          unitCost: invCost,
        }),
      });

      if (res.ok) {
        setIsAddingItem(false);
        fetchFinanceData();
      }
    } catch {
      setIsAddingItem(false);
    }
  };

  const handleDeleteQuotation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quotation?")) return;
    try {
      const res = await fetch(`/api/quotations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setQuotations((prev) => prev.filter((q) => q.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete quotation:", err);
    }
  };

  const handleDeductStock = async (id: string, currentStock: number) => {
    const qtyStr = prompt(`বর্তমান স্টক: ${currentStock}। প্রজেক্টে ব্যবহারের জন্য কত পরিমাণ কমাতে চান?`, "1");
    if (!qtyStr) return;
    const deductQty = parseFloat(qtyStr);
    if (isNaN(deductQty) || deductQty <= 0) return;

    try {
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, deductQuantity: deductQty }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.lowStockAlertTriggered) {
          alert(`⚠️ সতর্কবার্তা: স্টক নূন্যতম সীমার নিচে নেমে গেছে!`);
        }
        fetchFinanceData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInventory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;
    try {
      const res = await fetch(`/api/inventory?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setInventory((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };


  const categories = [
    "Landscape Design",
    "Plants",
    "Soil & Media",
    "Fertilizer",
    "Pots & Tubs",
    "Labour",
    "Irrigation",
    "Lighting",
    "Fountain",
    "Transportation",
    "Other Costs",
  ];

  const lowStockItems = inventory.filter((i) => i.isLowStock || i.stockQuantity <= i.minThreshold);

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <span>💰</span> ধাপ ৯ • Smart Quotation, Invoicing, Inventory & P&L Accounting
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-gray-900 tracking-tight">
            কোটেশন বিল্ডার, স্টক ইনভেন্টরি ও কোম্পানি লাভ-ক্ষতি
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            আইটেমাইজড কোটেশন ও ইনভয়েস জেনারেশন, লো-স্টক অ্যালার্ট এবং P&L ফাইন্যান্সিয়াল হিসাবরক্ষণ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab("quotation")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              subTab === "quotation" ? "bg-[#06120c] text-[#91cd3d] shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            🧾 কোটেশন বিল্ডার ({quotations.length})
          </button>
          <button
            onClick={() => setSubTab("inventory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              subTab === "inventory" ? "bg-[#06120c] text-[#91cd3d] shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            📦 ইনভেন্টরি ও স্টক ({inventory.length})
          </button>
          <button
            onClick={() => setSubTab("accounting")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              subTab === "accounting" ? "bg-[#06120c] text-[#91cd3d] shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            💵 লাভ-ক্ষতি (P&L Dashboard)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: SMART QUOTATION BUILDER */}
      {subTab === "quotation" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
            <div>
              <h3 className="font-bold text-gray-900 text-sm font-serif">প্রফেশনাল আইটেমাইজড কোটেশন</h3>
              <p className="text-xs text-gray-500">প্রতিটি উপাদান (গাছ, মাটি, লেবার, ইরিগেশন) আলাদা দেখিয়ে কোটেশন ও প্রিন্টযোগ্য PDF তৈরি করুন।</p>
            </div>
            <button
              onClick={() => setIsBuildingQuote(!isBuildingQuote)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              {isBuildingQuote ? "✕ বন্ধ করুন" : "+ নতুন কোটেশন তৈরি করুন"}
            </button>
          </div>

          {/* Quotation Builder Modal/Form */}
          {isBuildingQuote && (
            <form onSubmit={handleSaveQuotation} className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-xl space-y-5 animate-fade-in-up">
              <div className="flex justify-between items-center border-b pb-3">
                <h4 className="font-bold text-emerald-900 text-base">স্মার্ট কোটেশন তৈরি করুন</h4>
                <span className="text-xs font-mono text-gray-500">তারিখ: {new Date().toLocaleDateString("bn-BD")}</span>
              </div>

              {/* Client Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">গ্রাহকের নাম (Client Name) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ইঞ্জিঃ তানভীর আহমেদ"
                    value={qClientName}
                    onChange={(e) => setQClientName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01XXXXXXXXX"
                    value={qClientPhone}
                    onChange={(e) => setQClientPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Itemized Lines (PDF page 11 requirement) */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">খরচের আইটেমভিত্তিক ব্রেকডাউন</span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    + আরও আইটেম যোগ করুন
                  </button>
                </div>

                <div className="border border-gray-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-600 font-bold">
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
                    <tbody className="divide-y divide-gray-100">
                      {quoteItems.map((item, idx) => (
                        <tr key={idx} className="bg-white">
                          <td className="p-2">
                            <select
                              value={item.category}
                              onChange={(e) => handleItemChange(idx, "category", e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs"
                            >
                              {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.itemTitle}
                              onChange={(e) => handleItemChange(idx, "itemTitle", e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, "quantity", Number(e.target.value))}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-center"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => handleItemChange(idx, "unit", e.target.value)}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-center"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(idx, "unitPrice", Number(e.target.value))}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-1.5 text-xs text-right font-mono"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-gray-900">
                            ৳{item.amount.toLocaleString()}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveItemRow(idx)}
                              className="text-red-500 hover:text-red-700 font-bold cursor-pointer"
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

              {/* Summary Calculation (PDF page 12: Subtotal -> Discount -> Total -> Advance -> Due) */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col items-end gap-2 text-xs">
                <div className="flex justify-between w-64 text-gray-700">
                  <span>সাবটোটাল (Subtotal):</span>
                  <span className="font-mono font-bold">৳{qSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center w-64 text-gray-700">
                  <span>স্পেশাল ছাড় (Discount):</span>
                  <div className="flex items-center gap-1">
                    <span>৳</span>
                    <input
                      type="number"
                      value={qDiscount}
                      onChange={(e) => setQDiscount(Number(e.target.value))}
                      className="w-24 bg-white border border-gray-300 rounded-lg p-1 text-right font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-between w-64 text-sm font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>সর্বমোট বিল (Total):</span>
                  <span className="font-mono text-emerald-700">৳{qTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center w-64 text-gray-700">
                  <span>অগ্রিম প্রদান (Advance):</span>
                  <div className="flex items-center gap-1">
                    <span>৳</span>
                    <input
                      type="number"
                      value={qAdvance}
                      onChange={(e) => setQAdvance(Number(e.target.value))}
                      className="w-24 bg-white border border-gray-300 rounded-lg p-1 text-right font-mono text-emerald-800 font-bold"
                    />
                  </div>
                </div>
                <div className="flex justify-between w-64 text-sm font-bold text-red-700 border-t border-dashed border-gray-300 pt-2">
                  <span>বাকি টাকা (Due Amount):</span>
                  <span className="font-mono">৳{qDue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBuildingQuote(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-md"
                >
                  ✓ কোটেশন সংরক্ষণ ও প্রিন্ট ভিউ
                </button>
              </div>
            </form>
          )}

          {/* Quotations List Table */}
          <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">সংরক্ষিত কোটেশন ও ইনভয়েস হিস্ট্রি</span>
              <span className="text-xs text-gray-500">মোট: {quotations.length}টি</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/60 text-gray-600 font-bold border-b border-gray-200">
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
                <tbody className="divide-y divide-gray-100">
                  {quotations.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-800">{q.quotationNumber}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900">
                        {q.clientName}
                        <span className="block text-[10px] font-mono text-gray-400 font-normal">{q.clientPhone}</span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">৳{q.total.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-700">৳{q.advance.toLocaleString()}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-red-600">৳{q.due.toLocaleString()}</td>
                      <td className="py-3.5 px-4">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPreviewQuote(q)}
                            className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            🖨️ PDF
                          </button>
                          <button
                            onClick={() => handleDeleteQuotation(q.id)}
                            className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs transition-colors cursor-pointer"
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
        </div>
      )}

      {/* SUBTAB 2: INVENTORY & STOCK MANAGEMENT */}
      {subTab === "inventory" && (
        <div className="space-y-6">
          {/* Low Stock Alert Banner (as in PDF page 12) */}
          {lowStockItems.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-3xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Low Stock Alert: {lowStockItems.length}টি কাঁচামালের স্টক নির্ধারিত সীমার নিচে নেমে গেছে!
                  </h4>
                  <p className="text-[11px] text-amber-800">
                    প্রজেক্ট পরিচালনায় বিঘ্ন এড়াতে দ্রুত নার্সারি বা সাপ্লায়ারের কাছ থেকে রি-স্টক করুন।
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
            <div>
              <h3 className="font-bold text-gray-900 text-sm font-serif">কোম্পানি ইনভেন্টরি ও কাঁচামাল স্টক</h3>
              <p className="text-xs text-gray-500">গাছ, সার, মাটি, টব, লাইটিং ও সেচ সরঞ্জামের স্বয়ংক্রিয় মজুত ট্র্যাকিং।</p>
            </div>
            <button
              onClick={() => setIsAddingItem(!isAddingItem)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              {isAddingItem ? "✕ বন্ধ করুন" : "+ নতুন পণ্য যোগ করুন"}
            </button>
          </div>

          {/* Add Item Modal */}
          {isAddingItem && (
            <form onSubmit={handleSaveInventoryItem} className="bg-white p-6 rounded-3xl border border-emerald-300 shadow-md space-y-4 animate-fade-in-up">
              <h4 className="font-bold text-emerald-900 text-sm border-b pb-2">ইনভেন্টরি আইটেম নিবন্ধন</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">পণ্যের নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vermicompost Organic Fertilizer"
                    value={invName}
                    onChange={(e) => setInvName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">ক্যাটাগরি *</label>
                  <select
                    value={invCategory}
                    onChange={(e) => setInvCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="PLANT">Plants & Trees (গাছ)</option>
                    <option value="SOIL">Soil / Media (মাটি)</option>
                    <option value="FERTILIZER">Fertilizer (সার)</option>
                    <option value="POT">Pots & Planters (টব)</option>
                    <option value="IRRIGATION">Irrigation Equipment (সেচ পাইপ)</option>
                    <option value="LIGHTING">Garden Lights (লাইটিং)</option>
                    <option value="TOOL">Tools & Cutters (টুলস)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">মজুত পরিমাণ (Quantity) *</label>
                  <input
                    type="number"
                    value={invQty}
                    onChange={(e) => setInvQty(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">ন্যূনতম সীমা (Min Threshold) *</label>
                  <input
                    type="number"
                    value={invMin}
                    onChange={(e) => setInvMin(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">একক (Unit) *</label>
                  <input
                    type="text"
                    value={invUnit}
                    onChange={(e) => setInvUnit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">প্রতি এককের ক্রয়মূল্য (৳)</label>
                  <input
                    type="number"
                    value={invCost}
                    onChange={(e) => setInvCost(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-md"
                >
                  ✓ সেভ করুন
                </button>
              </div>
            </form>
          )}

          {/* Inventory Table */}
          <div className="bg-white rounded-3xl border border-gray-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100/60 text-gray-600 font-bold border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">আইটেমের নাম</th>
                    <th className="py-3 px-4">ক্যাটাগরি</th>
                    <th className="py-3 px-4">বর্তমান মজুত</th>
                    <th className="py-3 px-4">মিনিমাম থ্রেশহোল্ড</th>
                    <th className="py-3 px-4">একক খরচ (৳)</th>
                    <th className="py-3 px-4">স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {inventory.map((it) => {
                    const isLow = it.isLowStock || it.stockQuantity <= it.minThreshold;
                    return (
                      <tr key={it.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-900">{it.name}</td>
                        <td className="py-3.5 px-4 text-gray-600">{it.category}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                          {it.stockQuantity} {it.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-500">
                          {it.minThreshold} {it.unit}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gray-700">৳{it.unitCost || 0}</td>
                        <td className="py-3.5 px-4">
                          {isLow ? (
                            <span className="bg-red-100 text-red-800 border border-red-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
                              ⚠️ LOW STOCK
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              IN STOCK
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleDeductStock(it.id, it.stockQuantity)}
                              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                              title="প্রজেক্টে ব্যবহারের জন্য স্টক কমান"
                            >
                              - স্টক ব্যবহার
                            </button>
                            <button
                              onClick={() => handleDeleteInventory(it.id)}
                              className="p-1 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs transition-colors cursor-pointer"
                              title="আইটেম মুছুন"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: COMPANY ACCOUNTING & P&L DASHBOARD */}
      {subTab === "accounting" && accounting && (
        <div className="space-y-6">
          {/* Top 3 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-gradient-to-br from-emerald-800 to-teal-950 text-white p-6 rounded-3xl shadow-lg border border-emerald-700/60">
              <span className="text-xs text-emerald-200 uppercase tracking-widest font-semibold block">মোট আয় (Total Income)</span>
              <div className="text-3xl font-extrabold font-mono mt-2 text-white">
                ৳{accounting.summary.totalIncome.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-200/80 mt-1">প্রজেক্ট, মেইনটেন্যান্স ও গাছ বিক্রি</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200/90">
              <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold block">মোট ব্যয় (Total Expense)</span>
              <div className="text-3xl font-extrabold font-mono mt-2 text-red-600">
                ৳{accounting.summary.totalExpense.toLocaleString()}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">বেতন, কাঁচামাল ও পরিচালন ব্যয়</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-emerald-300">
              <span className="text-xs text-emerald-800 uppercase tracking-widest font-semibold block">নিট লাভ (Net Profit)</span>
              <div className="text-3xl font-extrabold font-mono mt-2 text-emerald-700">
                ৳{accounting.summary.netProfit.toLocaleString()}
              </div>
              <p className="text-[11px] text-emerald-600 font-bold mt-1">মার্জিন: {accounting.summary.profitMargin}</p>
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Income Streams */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-900 text-sm font-serif border-b pb-2 flex items-center justify-between">
                <span>📈 আয়ের উৎসসমূহ (Income Streams)</span>
                <span className="text-emerald-700 font-mono font-bold text-xs">
                  ৳{accounting.summary.totalIncome.toLocaleString()}
                </span>
              </h4>
              <div className="space-y-3 text-xs">
                {Object.values(accounting.incomeBreakdown).map((inc, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-gray-700 font-medium">{inc.label}</span>
                    <span className="font-mono font-bold text-gray-900">৳{inc.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Streams */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <h4 className="font-bold text-gray-900 text-sm font-serif border-b pb-2 flex items-center justify-between">
                <span>📉 ব্যয়ের খাতসমূহ (Expense Breakdown)</span>
                <span className="text-red-600 font-mono font-bold text-xs">
                  ৳{accounting.summary.totalExpense.toLocaleString()}
                </span>
              </h4>
              <div className="space-y-3 text-xs">
                {Object.values(accounting.expenseBreakdown).map((exp, i) => (
                  <div key={i} className="flex justify-between items-center py-1 border-b border-gray-50">
                    <span className="text-gray-700 font-medium">{exp.label}</span>
                    <span className="font-mono font-bold text-gray-900">৳{exp.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF / Print Quotation Preview Modal */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-8 max-h-[90vh] overflow-y-auto print:p-0">
            <button
              onClick={() => setPreviewQuote(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold text-sm cursor-pointer hover:bg-gray-200 print:hidden"
            >
              ✕
            </button>

            {/* Official Letterhead */}
            <div className="flex justify-between items-start border-b pb-6">
              <div>
                <h2 className="text-2xl font-serif font-extrabold text-emerald-900 tracking-tight">A R GREEN GARDEN</h2>
                <p className="text-xs text-gray-500 mt-1">Professional Landscape Architecture & Garden Care</p>
                <p className="text-xs text-gray-500">42/A, Road 9/A, Dhanmondi, Dhaka • Hotline: 01620692449</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest block">OFFICIAL QUOTATION</span>
                <span className="font-mono font-bold text-sm text-gray-800">{previewQuote.quotationNumber}</span>
                <span className="text-xs text-gray-400 block mt-1">
                  তারিখ: {new Date(previewQuote.createdAt).toLocaleDateString("bn-BD")}
                </span>
              </div>
            </div>

            {/* Client Info */}
            <div className="py-4 border-b text-xs grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 block">কোটেশন প্রাপক:</span>
                <span className="font-bold text-gray-900 text-sm">{previewQuote.clientName}</span>
                <span className="block font-mono text-gray-600">{previewQuote.clientPhone}</span>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block">প্রস্তাবিত প্রকল্প:</span>
                <span className="font-semibold text-gray-800">Rooftop / Landscape Garden Project</span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="py-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 font-bold border-b">
                  <tr>
                    <th className="py-2 px-2">#</th>
                    <th className="py-2 px-2">আইটেমের বিবরণ</th>
                    <th className="py-2 px-2">ক্যাটাগরি</th>
                    <th className="py-2 px-2 text-center">পরিমাণ</th>
                    <th className="py-2 px-2 text-right">দর (৳)</th>
                    <th className="py-2 px-2 text-right">মোট (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {previewQuote.items && previewQuote.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-2 font-mono text-gray-400">{idx + 1}</td>
                      <td className="py-2 px-2 font-semibold text-gray-900">{it.itemTitle}</td>
                      <td className="py-2 px-2 text-gray-500">{it.category}</td>
                      <td className="py-2 px-2 text-center font-mono">{it.quantity} {it.unit}</td>
                      <td className="py-2 px-2 text-right font-mono">৳{it.unitPrice.toLocaleString()}</td>
                      <td className="py-2 px-2 text-right font-mono font-bold">৳{it.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 flex justify-end">
              <div className="w-64 space-y-1.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>সাবটোটাল:</span>
                  <span className="font-mono font-bold">৳{previewQuote.subtotal.toLocaleString()}</span>
                </div>
                {previewQuote.discount > 0 && (
                  <div className="flex justify-between text-emerald-800">
                    <span>ছাড় (Discount):</span>
                    <span className="font-mono">-৳{previewQuote.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-900 border-t pt-1">
                  <span>সর্বমোট বিল:</span>
                  <span className="font-mono text-emerald-800">৳{previewQuote.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>পরিশোধিত অগ্রিম:</span>
                  <span className="font-mono font-bold">৳{previewQuote.advance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-red-700 border-t border-dashed pt-1">
                  <span>বাকি টাকা (Due):</span>
                  <span className="font-mono">৳{previewQuote.due.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 pt-4 border-t flex justify-between items-center print:hidden">
              <span className="text-xs text-gray-400 font-medium">স্বাক্ষরিত ও ভেরিফাইড বাই A R Green Garden</span>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-md"
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
