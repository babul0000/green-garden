"use client";

import React, { useState, useEffect } from "react";
import QuotationBuilder from "./finance/QuotationBuilder";
import InventoryStock from "./finance/InventoryStock";
import AccountingSummary from "./finance/AccountingSummary";
import { Quotation, InventoryItem, AccountingData } from "./finance/types";

interface FinanceInventoryTabProps {
  initialQuotationClient?: { name: string; phone: string; email?: string; notes?: string } | null;
}

export default function FinanceInventoryTab({ initialQuotationClient }: FinanceInventoryTabProps = {}) {
  const [subTab, setSubTab] = useState<"quotation" | "inventory" | "accounting">("quotation");
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [accounting, setAccounting] = useState<AccountingData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Quotations
      const qRes = await fetch("/api/quotations", { cache: "no-store" });
      if (qRes.ok) {
        const qData = await qRes.json();
        setQuotations(qData);
      }

      // 2. Fetch Inventory
      const invRes = await fetch("/api/inventory", { cache: "no-store" });
      if (invRes.ok) {
        const iData = await invRes.json();
        setInventory(iData.items || []);
      }

      // 3. Fetch Accounting
      const accRes = await fetch("/api/accounting", { cache: "no-store" });
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

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18221A]/85 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-lg text-[#E4E2D7]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-2">
            <span>💰</span> কোটেশন, ইনভেন্টরি ও হিসাব • Finance & Accounts
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Smart Quotation Builder, Inventory Stock & Financial P&L
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            আইটেমাইজড কোটেশন ও ইনভয়েস জেনারেশন, লো-স্টক অ্যালার্ট এবং P&L ফাইন্যান্সিয়াল হিসাবরক্ষণ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab("quotation")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "quotation" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            🧾 কোটেশন বিল্ডার ({quotations.length})
          </button>
          <button
            onClick={() => setSubTab("inventory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "inventory" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            📦 ইনভেন্টরি ও স্টক ({inventory.length})
          </button>
          <button
            onClick={() => setSubTab("accounting")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "accounting" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            💵 লাভ-ক্ষতি (P&L Dashboard)
          </button>
        </div>
      </div>

      {/* SUBTAB 1: SMART QUOTATION BUILDER */}
      {subTab === "quotation" && (
        <QuotationBuilder
          quotations={quotations}
          onRefresh={fetchFinanceData}
          initialClient={initialQuotationClient}
        />
      )}

      {/* SUBTAB 2: INVENTORY & STOCK MANAGEMENT */}
      {subTab === "inventory" && (
        <InventoryStock inventory={inventory} onRefresh={fetchFinanceData} />
      )}

      {/* SUBTAB 3: COMPANY ACCOUNTING & P&L DASHBOARD */}
      {subTab === "accounting" && (
        <AccountingSummary accounting={accounting} loading={loading} />
      )}
    </div>
  );
}
