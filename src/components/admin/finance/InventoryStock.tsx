"use client";

import React, { useState } from "react";
import { InventoryItem } from "./types";

interface InventoryStockProps {
  inventory: InventoryItem[];
  onRefresh: () => void | Promise<void>;
}

export default function InventoryStock({ inventory, onRefresh }: InventoryStockProps) {
  // New Inventory Item State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [invName, setInvName] = useState("");
  const [invCategory, setInvCategory] = useState("PLANT");
  const [invQty, setInvQty] = useState(50);
  const [invMin, setInvMin] = useState(15);
  const [invUnit, setInvUnit] = useState("pcs");
  const [invCost, setInvCost] = useState(500);

  const lowStockItems = inventory.filter((i) => i.isLowStock || i.stockQuantity <= i.minThreshold);

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
        setInvName("");
        onRefresh();
      }
    } catch {
      setIsAddingItem(false);
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
        onRefresh();
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
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-500/40 text-amber-200 rounded-3xl p-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="text-xs font-bold text-amber-300 font-mono uppercase tracking-wider">
                Low Stock Alert: {lowStockItems.length}টি কাঁচামালের স্টক নির্ধারিত সীমার নিচে নেমে গেছে!
              </h4>
              <p className="text-[11px] text-amber-200/80 mt-0.5">
                প্রজেক্ট পরিচালনায় বিঘ্ন এড়াতে দ্রুত নার্সারি বা সাপ্লায়ারের কাছ থেকে রি-স্টক করুন।
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-[#18221A]/85 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-sm text-[#E4E2D7]">
        <div>
          <h3 className="font-bold text-white text-sm font-serif">কোম্পানি ইনভেন্টরি ও কাঁচামাল স্টক</h3>
          <p className="text-xs text-stone-400">গাছ, সার, মাটি, টব, লাইটিং ও সেচ সরঞ্জামের স্বয়ংক্রিয় মজুত ট্র্যাকিং।</p>
        </div>
        <button
          onClick={() => setIsAddingItem(!isAddingItem)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          {isAddingItem ? "✕ বন্ধ করুন" : "+ নতুন পণ্য যোগ করুন"}
        </button>
      </div>

      {/* Add Item Modal */}
      {isAddingItem && (
        <form onSubmit={handleSaveInventoryItem} className="bg-[#18221A]/95 backdrop-blur-xl p-6 rounded-3xl border border-emerald-500/30 shadow-xl space-y-4 animate-fade-in-up text-[#E4E2D7]">
          <h4 className="font-bold text-emerald-300 text-sm border-b border-white/10 pb-2">ইনভেন্টরি আইটেম নিবন্ধন</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="font-semibold text-stone-300 block mb-1">পণ্যের নাম *</label>
              <input
                type="text"
                required
                placeholder="e.g. Vermicompost Organic Fertilizer"
                value={invName}
                onChange={(e) => setInvName(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white placeholder-white/30 focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">ক্যাটাগরি *</label>
              <select
                value={invCategory}
                onChange={(e) => setInvCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white font-semibold focus:border-emerald-400 focus:outline-none"
              >
                <option value="PLANT" className="bg-[#121A14]">Plants & Trees (গাছ)</option>
                <option value="SOIL" className="bg-[#121A14]">Soil / Media (মাটি)</option>
                <option value="FERTILIZER" className="bg-[#121A14]">Fertilizer (সার)</option>
                <option value="POT" className="bg-[#121A14]">Pots & Planters (টব)</option>
                <option value="IRRIGATION" className="bg-[#121A14]">Irrigation Equipment (সেচ পাইপ)</option>
                <option value="LIGHTING" className="bg-[#121A14]">Garden Lights (লাইটিং)</option>
                <option value="TOOL" className="bg-[#121A14]">Tools & Cutters (টুলস)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">মজুত পরিমাণ (Quantity) *</label>
              <input
                type="number"
                value={invQty}
                onChange={(e) => setInvQty(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 font-mono text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">ন্যূনতম সীমা (Min Threshold) *</label>
              <input
                type="number"
                value={invMin}
                onChange={(e) => setInvMin(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 font-mono text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">একক (Unit) *</label>
              <input
                type="text"
                value={invUnit}
                onChange={(e) => setInvUnit(e.target.value)}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-300 block mb-1">প্রতি এককের ক্রয়মূল্য (৳)</label>
              <input
                type="number"
                value={invCost}
                onChange={(e) => setInvCost(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/15 rounded-xl p-2.5 font-mono text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              ✓ সেভ করুন
            </button>
          </div>
        </form>
      )}

      {/* Inventory Table */}
      <div className="bg-[#18221A]/85 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl text-[#E4E2D7]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-stone-400 font-bold font-mono text-[10px] uppercase border-b border-white/10">
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
            <tbody className="divide-y divide-white/5">
              {inventory.map((it) => {
                const isLow = it.isLowStock || it.stockQuantity <= it.minThreshold;
                return (
                  <tr key={it.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{it.name}</td>
                    <td className="py-3.5 px-4 text-stone-300 font-mono text-[11px]">{it.category}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {it.stockQuantity} {it.unit}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-400">
                      {it.minThreshold} {it.unit}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-300">৳{it.unitCost || 0}</td>
                    <td className="py-3.5 px-4">
                      {isLow ? (
                        <span className="bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 w-max">
                          ⚠️ LOW STOCK
                        </span>
                      ) : (
                        <span className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                          IN STOCK
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleDeductStock(it.id, it.stockQuantity)}
                          className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-[10px] font-bold font-mono rounded-lg transition-colors cursor-pointer"
                          title="প্রজেক্টে ব্যবহারের জন্য স্টক কমান"
                        >
                          - স্টক ব্যবহার
                        </button>
                        <button
                          onClick={() => handleDeleteInventory(it.id)}
                          className="p-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs transition-colors cursor-pointer"
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
  );
}
