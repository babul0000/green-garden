"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import type { InvoiceItem } from "../types";

interface PaymentsTabProps {
  invoices: InvoiceItem[];
  totalBudget: number;
  totalPaid: number;
  totalDue: number;
  handlePayInvoice: (inv: InvoiceItem) => void;
  isPayingInvoice: string | null;
}

export default function PaymentsTab({
  invoices,
  totalBudget,
  totalPaid,
  totalDue,
  handlePayInvoice,
  isPayingInvoice,
}: PaymentsTabProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 mt-6 animate-fade-in-up">
      <div>
        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
          Billing & Financials
        </span>
        <h3 className="text-2xl font-display font-bold text-[#E4E2D7]">
          Invoices & Payment History
        </h3>
      </div>

      {/* Financial KPI bar */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs shadow-xl">
        <div>
          <span className="text-white/50 block font-mono text-[11px]">{t("Total Project Budget:", "Total Project Budget:")}</span>
          <span className="text-2xl font-extrabold text-[#E4E2D7] font-mono">৳{totalBudget.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-white/50 block font-mono text-[11px]">{t("Paid Amount:", "Paid Amount:")}</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">৳{totalPaid.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-white/50 block font-mono text-[11px]">{t("Due Balance:", "Due Balance:")}</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">৳{totalDue.toLocaleString()}</span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="border border-white/10 rounded-2xl sm:rounded-3xl overflow-x-auto bg-black/40 shadow-xl">
        <table className="w-full text-left text-xs min-w-[620px]">
          <thead className="bg-white/5 text-white/50 font-mono uppercase tracking-wider text-[11px] border-b border-white/10">
            <tr>
              <th className="py-3.5 px-4">Invoice #</th>
              <th className="py-3.5 px-4">{t("Date", "Date")}</th>
              <th className="py-3.5 px-4">{t("Total Amount", "Total Amount")}</th>
              <th className="py-3.5 px-4">{t("Paid", "Paid")}</th>
              <th className="py-3.5 px-4">{t("Due", "Due")}</th>
              <th className="py-3.5 px-4">{t("Status & Payment", "Status & Payment")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="py-3.5 px-4 font-bold text-emerald-400">{inv.invoiceNumber}</td>
                <td className="py-3.5 px-4 text-white/70">{new Date(inv.createdAt).toLocaleDateString("bn-BD")}</td>
                <td className="py-3.5 px-4 font-bold text-[#E4E2D7]">৳{inv.totalAmount.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-emerald-400">৳{inv.paidAmount.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-amber-400 font-bold">৳{inv.dueAmount.toLocaleString()}</td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}>
                      {inv.status}
                    </span>
                    {inv.status !== "PAID" && (
                      <button
                        onClick={() => handlePayInvoice(inv)}
                        disabled={isPayingInvoice === inv.id}
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-stone-950 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer whitespace-nowrap disabled:opacity-50"
                      >
                        <span>💳</span>
                        <span>{isPayingInvoice === inv.id ? t("লোড হচ্ছে...", "Processing...") : t("বিকাশ/কার্ডে পে", "bKash / Card Pay")}</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-white/40 font-mono">
                  {t("কোনো ইনভয়েস পাওয়া যায়নি", "No invoices found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
