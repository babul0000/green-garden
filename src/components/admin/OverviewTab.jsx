"use client";

import React from "react";

export default function OverviewTab({ bookings = [], projects = [], services = [], setActiveTab }) {
  
  // Safe helper to extract numeric budget values
  const parseBudget = (budgetStr) => {
    if (!budgetStr) return 0;
    // Extract numbers from strings like "৳ 4 Lakhs" or "৳ 50,000"
    let cleaned = budgetStr.replace(/[^\d]/g, "");
    if (budgetStr.toLowerCase().includes("lakh")) {
      // 1 Lakh = 100,000 BDT
      const val = parseFloat(budgetStr.replace(/[^\d.]/g, ""));
      return isNaN(val) ? 0 : val * 100000;
    }
    const num = parseInt(cleaned, 10);
    return isNaN(num) ? 0 : num;
  };

  // 1. Calculate Real Net Income (Sum of Completed and Confirmed bookings)
  const netIncome = bookings
    .filter(b => b.status === "Completed" || b.status === "Confirmed")
    .reduce((acc, b) => acc + parseBudget(b.budgetRange), 0);

  // 2. Count active transactions
  const pendingCount = bookings.filter(b => b.status === "Pending").length;
  const completedCount = bookings.filter(b => b.status === "Completed").length;
  const confirmedCount = bookings.filter(b => b.status === "Confirmed").length;

  // 3. Project categories division for Donut Chart
  const resProjects = projects.filter(p => p.category?.toLowerCase() === "residential").length;
  const comProjects = projects.filter(p => p.category?.toLowerCase() === "commercial").length;
  const villaProjects = projects.filter(p => p.category?.toLowerCase() === "villa").length;
  const totalProj = projects.length || 1;

  const resPct = Math.round((resProjects / totalProj) * 100) || 30;
  const comPct = Math.round((comProjects / totalProj) * 100) || 40;
  const villaPct = Math.round((villaProjects / totalProj) * 100) || 30;

  // 4. Generate dynamic chart bars by service categories
  // Group bookings by service label and get the sum of budgets
  const serviceRevenue = {};
  services.forEach(s => {
    serviceRevenue[s.label] = 0;
  });
  bookings.forEach(b => {
    const sName = b.service || "General";
    if (serviceRevenue[sName] !== undefined) {
      serviceRevenue[sName] += parseBudget(b.budgetRange);
    } else {
      serviceRevenue[sName] = parseBudget(b.budgetRange);
    }
  });

  const chartKeys = Object.keys(serviceRevenue).slice(0, 6);
  const maxVal = Math.max(...Object.values(serviceRevenue), 1);

  return (
    <div className="flex flex-col gap-6 animate-fade-in-up">
      
      {/* Tab Header title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-2xl font-sans font-bold text-slate-800">Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">An any way to manage sales with care and precision.</p>
        </div>
        {/* Date Dropdown */}
        <div className="bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 flex items-center gap-2">
          <span>January 2024 - May 2024</span>
          <span className="text-[7px]">▼</span>
        </div>
      </div>

      {/* Main dashboard content grids split */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        
        {/* Left Side elements: Stats & Recent Transaction Table & Bar Chart */}
        <div className="xl:col-span-3 flex flex-col gap-6">
          
          {/* Top Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Update Card (Dark Green) */}
            <div className="bg-[#0b2416] text-white p-6 rounded-[28px] flex flex-col justify-between min-h-[150px] shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="bg-[#8ac343]/20 text-[#8ac343] text-[9px] uppercase tracking-wider font-bold py-1 px-2.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  <span>Update</span>
                </span>
                <span className="text-[9px] text-white/40">Active Log</span>
              </div>
              <div className="mt-4">
                <h4 className="font-sans font-bold text-sm text-white leading-snug">
                  Garden bookings & inquiries increased 40% in 1 week.
                </h4>
                <button type="button" onClick={() => setActiveTab("projects")} className="text-[10px] font-bold text-[#8ac343] hover:underline mt-4 flex items-center gap-1 transition-colors">
                  <span>See Statistics</span>
                  <span>&gt;</span>
                </button>
              </div>
            </div>

            {/* Card 2: Net Income (White Card) */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex flex-col justify-between min-h-[150px] shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Net Income</span>
                <span className="text-sm font-bold tracking-widest cursor-pointer">...</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-[#0c1911] font-sans">
                  ৳ {netIncome.toLocaleString()}
                </span>
                <div className="flex items-center gap-1 mt-2 text-[#8ac343] text-[10px] font-bold">
                  <span>↗ +35% from last month</span>
                </div>
              </div>
            </div>

            {/* Card 3: Total Return */}
            <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex flex-col justify-between min-h-[150px] shadow-sm">
              <div className="flex justify-between items-center text-slate-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Return</span>
                <span className="text-sm font-bold tracking-widest cursor-pointer">...</span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-[#0c1911] font-sans">
                  {bookings.length} Slots
                </span>
                <div className="flex items-center gap-1 mt-2 text-red-500 text-[10px] font-bold">
                  <span>↘ -24% from last month</span>
                </div>
              </div>
            </div>

          </div>

          {/* Booking list (Transactions) & Bar Chart Row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            
            {/* Recent Bookings List (Transaction equivalent - takes 3/5 width) */}
            <div className="lg:col-span-3 bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Transaction</h3>
                <span className="text-sm font-bold text-slate-400 tracking-widest cursor-pointer">...</span>
              </div>
              
              <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                {bookings.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-8 text-center">No bookings registered yet.</p>
                ) : (
                  bookings.map((b, idx) => (
                    <div key={b._id || idx} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0c1911] flex items-center justify-center text-sm font-semibold">
                          🪴
                        </div>
                        <div>
                          <span className="font-bold text-[#0c1911] block">{b.clientName || "General Client"}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{b.service || "Garden Consultation"}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold block w-fit ml-auto uppercase ${
                          b.status === "Completed" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : b.status === "Confirmed"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                        }`}>
                          {b.status || "Pending"}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{(b._id || "GG").slice(-8).toUpperCase()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Revenue Bar Chart (takes 2/5 width) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4 justify-between">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Revenue</h3>
                <div className="flex gap-3 text-[9px] font-bold">
                  <span className="flex items-center gap-1 text-[#0c1911]"><span className="w-2 h-2 rounded-full bg-[#0c1911]"></span> Income</span>
                  <span className="flex items-center gap-1 text-[#8ac343]"><span className="w-2 h-2 rounded-full bg-[#8ac343]"></span> Expenses</span>
                </div>
              </div>
              
              <div className="mt-2">
                <span className="text-2xl font-bold text-slate-800 block">৳ {netIncome.toLocaleString()}</span>
                <span className="text-[9px] text-[#8ac343] font-bold">↗ +35% from last month</span>
              </div>

              {/* Dynamic Bar Charts based on service revenues */}
              <div className="h-40 flex items-end justify-between px-2 pt-6 gap-2">
                {chartKeys.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic text-center w-full pb-4">No service data</p>
                ) : (
                  chartKeys.map((key, idx) => {
                    const rev = serviceRevenue[key];
                    const pct = Math.round((rev / maxVal) * 100) || 10;
                    return (
                      <div key={idx} className="flex-1 flex items-end justify-center gap-1 h-full" title={`${key}: ${rev.toLocaleString()}`}>
                        <div className="bg-[#0c1911] w-2 rounded-t-sm" style={{ height: `${pct}%` }}></div>
                        <div className="bg-[#8ac343] w-2 rounded-t-sm" style={{ height: `${Math.round(pct * 0.4)}%` }}></div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Sales Report progress statistics */}
          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Sales Report</h3>
              <span className="text-sm font-bold text-slate-400 tracking-widest cursor-pointer">...</span>
            </div>
            
            <div className="flex flex-col gap-4 pt-2">
              {[
                { label: "Active Services Catalog", val: services.length, total: 20, color: "bg-[#8ac343]" },
                { label: "Ongoing Active Bookings", val: confirmedCount + pendingCount, total: 30, color: "bg-[#8ac343]" },
                { label: "Service Bookings Completed", val: completedCount, total: 50, color: "bg-[#0c1911]" }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>{item.label} ({item.val})</span>
                    <span>Target: {item.total}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`${item.color} h-full rounded-full transition-all duration-1000`} 
                      style={{ width: `${Math.min((item.val / item.total) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side elements: Donut chart view & Level up promo card */}
        <div className="flex flex-col gap-6">
          
          {/* Total View Performance (Donut Chart representation) */}
          <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex flex-col gap-4 items-center">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider self-start">Total View Performance</h3>
            
            {/* Custom SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Grey base circle */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                {/* Segment 1: View Count (Lawn - 68%) - color: #8ac343 */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8ac343" strokeWidth="4.2" strokeDasharray={`${resPct} ${100 - resPct}`} strokeDashoffset="0" />
                {/* Segment 2: Percentage (Vertical - 23%) - color: #0c1911 */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0c1911" strokeWidth="4.2" strokeDasharray={`${comPct} ${100 - comPct}`} strokeDashoffset={`-${resPct}`} />
                {/* Segment 3: Sales (Rooftop - 9%) - color: #e28d38 */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e28d38" strokeWidth="4.2" strokeDasharray={`${villaPct} ${100 - villaPct}`} strokeDashoffset={`-${resPct + comPct}`} />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-bold text-[#0c1911] block leading-none">{projects.length}</span>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-bold mt-1 block">Total Case Studies</span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed px-2">
              Garden design portfolio projects divided by site type dynamically.
            </p>

            <button type="button" className="w-full bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer">
              Guide Views
            </button>

            <div className="w-full border-t border-slate-100 pt-4 mt-2 flex justify-between text-[9px] font-bold text-slate-500">
              <div className="flex items-center gap-1" title={`${resProjects} Residential Projects`}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#8ac343]"></span>
                <span>Res ({resPct}%)</span>
              </div>
              <div className="flex items-center gap-1" title={`${comProjects} Commercial Projects`}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#0c1911]"></span>
                <span>Com ({comPct}%)</span>
              </div>
              <div className="flex items-center gap-1" title={`${villaProjects} Villa Projects`}>
                <span className="w-2.5 h-2.5 rounded-full bg-[#e28d38]"></span>
                <span>Villa ({villaPct}%)</span>
              </div>
            </div>
          </div>

          {/* Level Up Garden Banner */}
          <div className="bg-[#e4ece7] p-6 rounded-[28px] border border-slate-200/40 shadow-sm flex flex-col gap-4 justify-between relative overflow-hidden">
            <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-[#8ac343]/20 rounded-full blur-xl"></div>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#0c1911] leading-snug">Level up your sales managing to the next level.</h4>
              <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                An any way to manage sales with care and precision.
              </p>
            </div>
            <button 
              type="button"
              onClick={() => setActiveTab("settings")}
              className="bg-[#0c1911] hover:bg-black text-[#8ac343] text-[10px] font-bold py-2.5 px-4 rounded-xl shadow-md transition-all text-center block cursor-pointer"
            >
              Update to Siohioma+
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
