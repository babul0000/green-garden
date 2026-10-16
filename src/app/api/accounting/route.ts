import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

// Admin only: real-time business financials and accounting
export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  // 1. Fetch real income from Invoices & Payments in PostgreSQL
  const invoices = await prisma.invoice.findMany({
    include: {
      payments: true,
      project: { select: { name: true, category: true } },
    },
  });

  let projectIncome = 0;
  let maintenanceIncome = 0;
  let treeDoctorIncome = 0;
  let plantSalesIncome = 0;

  for (const inv of invoices) {
    const paid = inv.paidAmount || 0;
    const notesLower = (inv.notes || "").toLowerCase();
    const projCategory = (inv.project?.category || "").toLowerCase();

    if (inv.projectId || projCategory.includes("landscape") || projCategory.includes("residential") || projCategory.includes("commercial")) {
      projectIncome += paid;
    } else if (notesLower.includes("maintenance") || projCategory.includes("maintenance")) {
      maintenanceIncome += paid;
    } else if (notesLower.includes("tree") || notesLower.includes("doctor")) {
      treeDoctorIncome += paid;
    } else {
      plantSalesIncome += paid;
    }
  }

  const totalIncome = projectIncome + maintenanceIncome + treeDoctorIncome + plantSalesIncome;

  // 2. Fetch real expenses from Employees (Payroll)
  const employees = await prisma.employee.findMany({
    select: { salary: true },
  });
  const employeeSalaryExpense = employees.reduce((acc, emp) => acc + (emp.salary || 0), 0);

  // 3. Fetch real Project expenses
  const projects = await prisma.project.findMany({
    select: { totalExpense: true },
  });
  const projectExpenses = projects.reduce((acc, p) => acc + (p.totalExpense || 0), 0);

  // 4. Fetch Inventory Investment Value
  const inventoryItems = await prisma.inventoryItem.findMany({
    select: { stockQuantity: true, unitCost: true, category: true },
  });

  let plantMaterialExpense = 0;
  let soilFertilizerExpense = 0;
  let toolsIrrigationExpense = 0;

  for (const item of inventoryItems) {
    const val = (item.stockQuantity || 0) * (item.unitCost || 0);
    const cat = item.category.toLowerCase();
    if (cat.includes("plant") || cat.includes("tree")) {
      plantMaterialExpense += val;
    } else if (cat.includes("soil") || cat.includes("fertilizer")) {
      soilFertilizerExpense += val;
    } else {
      toolsIrrigationExpense += val;
    }
  }

  // Estimated transportation and operations if not itemized
  const transportExpense = Math.round(projectExpenses * 0.12);
  const officeExpense = 20000; // Standard monthly facility overhead

  const totalExpense =
    employeeSalaryExpense +
    projectExpenses +
    plantMaterialExpense +
    soilFertilizerExpense +
    toolsIrrigationExpense +
    transportExpense +
    officeExpense;

  const netProfit = totalIncome - totalExpense;
  const marginNum = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  const profitMargin = `${marginNum.toFixed(1)}%`;

  return NextResponse.json(
    {
      summary: {
        totalIncome,
        totalExpense,
        netProfit,
        profitMargin,
      },
      incomeBreakdown: {
        projectIncome: { label: "Project Income (প্রজেক্ট আয়)", amount: projectIncome },
        maintenanceIncome: { label: "Maintenance Income (মেইনটেন্যান্স আয়)", amount: maintenanceIncome },
        treeDoctorIncome: { label: "Tree Doctor Service (ট্রি ডক্টর ফি)", amount: treeDoctorIncome },
        plantSalesIncome: { label: "Plant & Nursery Sales (গাছ ও নার্সারি বিক্রয়)", amount: plantSalesIncome },
      },
      expenseBreakdown: {
        employeeSalary: { label: "Employee Payroll (কর্মচারী বেতন)", amount: employeeSalaryExpense },
        projectOperation: { label: "Project Execution (সাইট খরচ)", amount: projectExpenses },
        plantsMaterial: { label: "Plants & Trees Stock (গাছ ও চারা স্টক)", amount: plantMaterialExpense },
        soilFertilizer: { label: "Soil & Fertilizer (মাটি ও সার খরচ)", amount: soilFertilizerExpense },
        toolsIrrigation: { label: "Equipment & Irrigation (টুলস ও ইরিগেশন)", amount: toolsIrrigationExpense },
        transport: { label: "Logistics & Transport (পরিবহন ও ডেলিভারি)", amount: transportExpense },
        officeExpense: { label: "Office & Operations (অফিস ও অপারেশনাল)", amount: officeExpense },
      },
    },
    { headers: NO_CACHE }
  );
});
