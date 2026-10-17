"use client";

import React, { useState, useEffect } from "react";
import QuotationBuilder from "./finance/QuotationBuilder";
import InventoryStock from "./finance/InventoryStock";
import AccountingSummary from "./finance/AccountingSummary";
import InvoicesPayments from "./finance/InvoicesPayments";
import { Quotation, InventoryItem, AccountingData } from "./finance/types";

interface FinanceInventoryTabProps {
  initialQuotationClient?: { name: string; phone: string; email?: string; notes?: string } | null;
}

export default function FinanceInventoryTab({ initialQuotationClient }: FinanceInventoryTabProps = {}) {
  const [subTab, setSubTab] = useState<"quotation" | "invoices" | "inventory" | "accounting">("quotation");
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
            <span>💰</span> কোটেশন, ইনভয়েস ও হিসাব • Studio ERP
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
            Smart Quotations, Invoices & ERP Financial Accounts
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            আইটেমাইজড কোটেশন, ইনভয়েস পেমেন্ট ট্র্যাকিং, ইনভেন্টরি ও আর্থিক P&L হিসাবরক্ষণ।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSubTab("quotation")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "quotation" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            🧾 কোটেশন ({quotations.length})
          </button>
          <button
            onClick={() => setSubTab("invoices")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "invoices" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            💳 ইনভয়েস ও পেমেন্ট
          </button>
          <button
            onClick={() => setSubTab("inventory")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "inventory" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            📦 ইনভেন্টরি ({inventory.length})
          </button>
          <button
            onClick={() => setSubTab("accounting")}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all cursor-pointer ${
              subTab === "accounting" ? "bg-emerald-500 text-stone-950 font-bold shadow-md shadow-emerald-500/20" : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10"
            }`}
          >
            💵 লাভ-ক্ষতি (P&L)
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

      {/* SUBTAB 2: INVOICES & PAYMENTS */}
      {subTab === "invoices" && (
        <InvoicesPayments
          quotations={quotations}
          onRefreshFinance={fetchFinanceData}
        />
      )}

      {/* SUBTAB 3: INVENTORY & STOCK MANAGEMENT */}
      {subTab === "inventory" && (
        <InventoryStock inventory={inventory} onRefresh={fetchFinanceData} />
      )}

      {/* SUBTAB 4: COMPANY ACCOUNTING & P&L DASHBOARD */}
      {subTab === "accounting" && (
        <AccountingSummary accounting={accounting} loading={loading} />
      )}
    </div>
  );
}
