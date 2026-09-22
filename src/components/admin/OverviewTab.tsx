"use client";

import React, { useState } from "react";

interface OverviewTabProps {
  bookings?: any[];
  projects?: any[];
  services?: any[];
  setActiveTab?: (tab: string) => void;
}

export default function OverviewTab({ bookings = [], projects = [], services = [], setActiveTab }: OverviewTabProps) {
  const [timeFilter, setTimeFilter] = useState("This Month");

  // Exact KPI Counters from PDF Requirement #23 (Owner/Admin Control Center)
  const stats = {
    customers: 250,
    runningProjects: 18,
    completedProjects: 96,
    employees: 35,
    activeMaintenance: 72,
    treeDoctorRequests: 12,
    pendingQuotations: 8,
    totalIncome: 4250000,
    totalExpense: 2830000,
    netProfit: 1420000,
  };

  // Service popularity breakdown (PDF Requirement #20)
  const topServices = [
    { name: "Rooftop Garden Design", count: 88, percentage: 38, icon: "🌴" },
    { name: "Vertical Green Wall", count: 46, percentage: 22, icon: "🍃" },
    { name: "Garden Maintenance Package", count: 72, percentage: 20, icon: "🔧" },
    { name: "Tree Doctor Healthcare", count: 32, percentage: 12, icon: "🩺" },
    { name: "Smart Drip Irrigation", count: 24, percentage: 8, icon: "💧" },
  ];

  // Monthly Revenue & Expense Trends (PDF Requirement #20)
  const monthlyTrends = [
    { month: "May", income: 32, expense: 22 },
    { month: "Jun", income: 36, expense: 24 },
    { month: "Jul", income: 41, expense: 26 },
    { month: "Aug", income: 48, expense: 29 },
    { month: "Sep", income: 42.5, expense: 28.3 },
  ];

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      
      {/* Header with Title & Date Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <h2 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">
              Owner / Admin Master Control Center
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            A R Green Garden • Real-time Business Analytics, Operations & Financial Tracking
          </p>
        </div>

        <div className="flex gap-2">
          {["This Month", "Last Quarter", "Year 2026"].map((t) => (
            <button
              key={t}
              onClick={() => setTimeFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                timeFilter === t
                  ? "bg-emerald-800 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Financial Summary Strip (Income, Expense, Net Profit) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-6 rounded-3xl shadow-md border border-emerald-800 flex flex-col justify-between">
          <div className="flex justify-between items-center text-emerald-300">
            <span className="text-xs font-bold uppercase tracking-wider">Total Income (মোট আয়)</span>
            <span className="text-xs bg-emerald-800/80 px-2 py-0.5 rounded-full font-mono">↗ +24%</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-emerald-300">
              ৳{(stats.totalIncome / 100000).toFixed(2)} <span className="text-lg text-white font-sans">Lakh</span>
            </div>
            <span className="text-xs text-emerald-200/70 mt-1 block">Project + Maintenance + Tree Doctor</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-gray-400">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Total Expense (মোট ব্যয়)</span>
            <span className="text-xs text-red-500 font-mono">↘ Salaries & Materials</span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-gray-900">
              ৳{(stats.totalExpense / 100000).toFixed(2)} <span className="text-lg text-gray-500 font-sans">Lakh</span>
            </div>
            <span className="text-xs text-gray-400 mt-1 block">Staff Salaries, Plants, Soil, Transport</span>
          </div>
        </div>

        <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center text-emerald-800">
            <span className="text-xs font-bold uppercase tracking-wider">Net Profit (নিট লাভ)</span>
            <span className="text-xs bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
              33.4% Margin
            </span>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold font-mono text-emerald-800">
              ৳{(stats.netProfit / 100000).toFixed(2)} <span className="text-lg text-emerald-700 font-sans">Lakh</span>
            </div>
            <span className="text-xs text-emerald-700 mt-1 block">Clean Operating Profit</span>
          </div>
        </div>
      </div>

      {/* Operational KPI Counters Exact from PDF Requirement #23 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="text-gray-400 text-xs block font-medium">Customers</span>
          <span className="text-2xl font-bold font-mono text-gray-900 mt-1 block">{stats.customers}</span>
          <span className="text-[10px] text-emerald-600 font-medium">Active Clients</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="text-gray-400 text-xs block font-medium">Running Projects</span>
          <span className="text-2xl font-bold font-mono text-blue-600 mt-1 block">{stats.runningProjects}</span>
          <span className="text-[10px] text-blue-500 font-medium">On-Site Progress</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="text-gray-400 text-xs block font-medium">Completed Projects</span>
          <span className="text-2xl font-bold font-mono text-emerald-700 mt-1 block">{stats.completedProjects}</span>
          <span className="text-[10px] text-emerald-600 font-medium">100% Handover</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="text-gray-400 text-xs block font-medium">Employees</span>
          <span className="text-2xl font-bold font-mono text-purple-700 mt-1 block">{stats.employees}</span>
          <span className="text-[10px] text-purple-600 font-medium">Full Staff</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="text-gray-400 text-xs block font-medium">Maintenance</span>
          <span className="text-2xl font-bold font-mono text-teal-700 mt-1 block">{stats.activeMaintenance}</span>
          <span className="text-[10px] text-teal-600 font-medium">Recurring Subs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="text-gray-400 text-xs block font-medium">Tree Doctor Visits</span>
          <span className="text-2xl font-bold font-mono text-red-600 mt-1 block">{stats.treeDoctorRequests}</span>
          <span className="text-[10px] text-red-500 font-medium">Pending Clinical</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <span className="text-gray-400 text-xs block font-medium">Quotations</span>
          <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">{stats.pendingQuotations}</span>
          <span className="text-[10px] text-amber-500 font-medium">Pending Review</span>
        </div>
      </div>

      {/* Business Analytics Charts (Requirement #20) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Monthly Revenue vs Expense Visual Chart */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-gray-900 text-base font-serif">মাসিক আয় ও ব্যয়ের অ্যানালিটিক্স</h3>
              <p className="text-xs text-gray-500">Monthly Income vs Expense comparison (Lakh BDT)</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Income
              </span>
              <span className="flex items-center gap-1.5 text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Expense
              </span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-4 pt-4 border-b border-gray-100">
            {monthlyTrends.map((m, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Income bar */}
                  <div
                    className="w-5 sm:w-7 bg-emerald-600 hover:bg-emerald-700 rounded-t-lg transition-all"
                    style={{ height: `${(m.income / 55) * 100}%` }}
                    title={`Income: ৳${m.income} Lakh`}
                  ></div>
                  {/* Expense bar */}
                  <div
                    className="w-5 sm:w-7 bg-gray-300 hover:bg-gray-400 rounded-t-lg transition-all"
                    style={{ height: `${(m.expense / 55) * 100}%` }}
                    title={`Expense: ৳${m.expense} Lakh`}
                  ></div>
                </div>
                <span className="text-xs font-bold text-gray-600">{m.month}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-400 block font-medium">নতুন ক্লায়েন্ট</span>
              <span className="text-base font-bold text-gray-900">৬৪ জন (৭২%)</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-400 block font-medium">রিপিট ক্লায়েন্ট</span>
              <span className="text-base font-bold text-emerald-700">২৮ জন (২৮%)</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-400 block font-medium">সর্বোচ্চ আয়ের মাস</span>
              <span className="text-base font-bold text-gray-900">আগস্ট ২০২৬</span>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-400 block font-medium">গড় প্রজেক্ট মার্জিন</span>
              <span className="text-base font-bold text-emerald-700">৩৫.৮%</span>
            </div>
          </div>
        </div>

        {/* Top Services Breakdown */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 text-base font-serif">জনপ্রিয় সার্ভিসসমূহ (Top Services)</h3>
            <p className="text-xs text-gray-500">কোন সেবাটি গ্রাহকরা সবচেয়ে বেশি গ্রহণ করেছেন</p>
          </div>

          <div className="space-y-4">
            {topServices.map((srv, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span>{srv.icon}</span> {srv.name}
                  </span>
                  <span className="font-mono text-gray-500">{srv.count} Projects ({srv.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${srv.percentage * 2}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-xs space-y-1">
            <span className="font-bold text-emerald-900 block">💡 ব্যবসায়িক পরামর্শ (Business Insight):</span>
            <p className="text-emerald-800 leading-relaxed">
              ধানমন্ডি ও গুলশান এলাকায় ছাদবাগান ও ড্রিপ ইরিগেশনের চাহিদা গত ৩ মাসে ৪০% বৃদ্ধি পেয়েছে।
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
